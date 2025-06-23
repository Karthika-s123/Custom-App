let client; // Global client

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {
    app.initialized()
      .then((_client) => {
        client = _client;
        client.events.on('app.activated', getLoggedInUserData);
      })
      .catch((err) => {
        showError("Initialization error", err);
      });
  }
};

// Fetch requester by requester_id
async function getRequesterDetails(requesterId) {
  const response = await client.request.invokeTemplate("getRequester", {
    context: { requester_id: requesterId }
  });
  return JSON.parse(response.response).requester;
}

// Fetch agent(s) by phone number
async function getAgentDetails(phone) {
  const response = await client.request.invokeTemplate("getAgentByPhone", {
    context: { mobile: phone }
  });
  return JSON.parse(response.response).agents || [];
}

// Fetch single agent by agent_id (responder_id)
async function getAgentById(agentId) {
  try {
    const response = await client.request.invokeTemplate("getAgentById", {
      context: { agent_id: agentId }
    });
    const agent = JSON.parse(response.response).agent;
    console.log("Agent details by ID:", agent);
    renderDetails(agent, true);
  } catch (error) {
    showError("Failed to fetch agent by ID", error);
  }
}

// Render HTML in div
function renderDetails(data, isAgent) {
  console.log("Rendering details", data, isAgent);
  const div = document.getElementById("requester-details");
  if (!div) {
    console.error("No div found with ID requester-details");
    return;
  }

  const content = isAgent
    ? `
      <h3>Agent Details</h3>
      <p><strong>Name:</strong> ${data.first_name} ${data.last_name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.mobile_phone_number}</p>
    `
    : `
      <h3>Requester Details</h3>
      <p><strong>Name:</strong> ${data.first_name} ${data.last_name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.mobile}</p>
    `;

  div.innerHTML = content;
}

// Button: Fetch both requester and match any agent with same phone
async function getLoggedInUserData() {
  try {
    const { ticket } = await client.data.get("ticket");
    console.log("Ticket data:", ticket);

    const requester = await getRequesterDetails(ticket.requester_id);
    console.log("Requester data:", requester);

    const agents = await getAgentDetails(requester.mobile);
    console.log("Agent data:", agents);

    const match = agents.find(a => a.mobile_phone_number === requester.mobile);
    renderDetails(match || requester, Boolean(match));
  } catch (error) {
    showError("Failed to load user data", error);
    document.getElementById("requester-details").innerHTML =
      `<p style="color:red;">Failed to load details.</p>`;
  }
}

// Button: Fetch agent by ID from ticket's responder_id

// Error handler
function showError(title, error) {
  console.error(`${title}:`, error);
  const div = document.getElementById("requester-details");
  if (div) {
    div.innerHTML = `
      <p style="color: red;"><strong>${title}:</strong> ${error.message || error}</p>
    `;
  }
}

let client;

init();

async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderText); // Removed extra argument
}

async function renderText() {
  try {
    let data = await client.interface.trigger('showModal', {
      title: 'Sample App Form',
      noBackdrop: true,
      template: 'template.html'
    });
    console.log(data); // success message
  } catch (error) {
    console.error(error);
  }
}

async function TicketDetails() {

    const iparams = await client.iparams.get();
    const apiKey = iparams.api_key;
    const domain = iparams.domain;

    console.log("API Key:", apiKey);
    console.log("Domain:", domain);

  const ticketId = document.getElementById("ticket_id").value.trim();

  const url = `https://${domain}/api/v2/tickets/${ticketId}`;
 
  const data = await client.data.get("requester");
  const requesterName = data.requester.name || "N/A";
  console.log("Requester Name:", requesterName);
 
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(`${apiKey}:X`),
        "Content-Type": "application/json"
      }
    });

    const ticketData = await response.json();

    // First, try to fetch requester as agent
    let requester = { name: "Unknown" };
    const agentUrl = `https://${domain}/api/v2/agents/${ticketData.requester_id}`;
    const contactUrl = `https://${domain}/api/v2/contacts/${ticketData.requester_id}`;
    const responderUrl = `https://${domain}/api/v2/agents/${ticketData.responder_id}`;

    // Try agent API
    const agentResponse = await fetch(agentUrl, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(`${apiKey}:X`),
        "Content-Type": "application/json"
      }
    });

    if (agentResponse.ok) {
      const agentData = await agentResponse.json();
      requester.name = agentData.contact.name;
    } else {
      // If not an agent, fallback to contact API
      const contactResponse = await fetch(contactUrl, {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa(`${apiKey}:X`),
          "Content-Type": "application/json"
        }
      });

      if (contactResponse.ok) {
        const contactData = await contactResponse.json();
        requester.name = contactData.name;
      }
    }

    // Fetch responder agent info
    const responderResponse = await fetch(responderUrl, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(`${apiKey}:X`),
        "Content-Type": "application/json"
      }
    });

    const responder = responderResponse.ok
      ? await responderResponse.json()
      : { contact: { name: "Agent UnAssigned" } };

    const tableHTML = `
   <div class="card">
  <div class="card-item"><strong>Ticket ID:</strong> ${ticketData.id}</div>
  <div class="card-item"><strong>Subject:</strong> ${ticketData.subject}</div>
  <div class="card-item"><strong>Status:</strong> ${ticketData.status}</div>
  <div class="card-item"><strong>Priority:</strong> ${ticketData.priority}</div>
  <div class="card-item"><strong>Requester Name:</strong> ${requesterName}</div>
  <div class="card-item"><strong>Responder Name:</strong> ${responder.contact.name || "Agent Not Found"}</div>
  <div class="card-item"><strong>Created At:</strong> ${ticketData.created_at}</div>
  <div class="card-item"><strong>Updated At:</strong> ${ticketData.updated_at}</div>
</div>

    `;

    document.getElementById("apptext").innerHTML = tableHTML;

  } catch (error) {
    console.error("Error:", error);
    document.getElementById("apptext").innerHTML =
      `<p style="color: red;">Failed to fetch ticket data. ${error.message}</p>`;
  }
}

let client;
let apiKey = ""; // Define apiKey globally

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

  async function renderApp() {
    try {
      client = await app.initialized();
      window.client = client;

      const iparams = await client.iparams.get();
      apiKey = iparams.apikey; // Now available globally
      console.log("Loaded API Key from iparams:", apiKey);

      // Register event listeners
      client.events.on("app.activated", () => {
        renderContactName();
        initTicketFetcher(); // Call fetch only after apiKey is ready
      });

    } catch (err) {
      handleErr(err);
    }
  }
};

function initTicketFetcher() {
  const fetchBtn = document.getElementById("fetch-ticket");
  const ticketOutput = document.getElementById("ticket-output");

  if (!fetchBtn || !ticketOutput) return;

  fetchBtn.addEventListener("click", async () => {
    const ticketId = document.getElementById("ticket-id").value.trim();
    if (!ticketId) {
      ticketOutput.innerHTML = "❗ Please enter a ticket ID.";
      return;
    }

    const url = `https://workdeft973.freshservice.com/api/v2/tickets/${ticketId}`;
    const headers = {
      Authorization: "Basic " + btoa(apiKey + ":X"),
      "Content-Type": "application/json"
    };

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        ticketOutput.innerHTML = `❌ Error: ${response.status} ${response.statusText}<br><pre>${errorText}</pre>`;
        return;
      }

      const ticket = await response.json();
      ticketOutput.innerHTML = `
        ✅ <strong>Ticket ID:</strong> ${ticket.ticket.id}<br>
        📝 <strong>Subject:</strong> ${ticket.ticket.subject}<br>
        📄 <strong>Description:</strong> ${ticket.ticket.description_text || 'N/A'}<br>
        👤 <strong>Requester:</strong> ${ticket.ticket.requester_id}<br>
        🔧 <strong>Status:</strong> ${ticket.ticket.status} &nbsp;|&nbsp; <strong>Priority:</strong> ${ticket.priority}
      `;
    } catch (error) {
      console.error("Fetch failed:", error);
      ticketOutput.innerHTML = "❌ An error occurred while fetching ticket details.";
    }
  });
}

function renderContactName() {
  const textElement = document.getElementById('apptext');
  if (!textElement) return;

  client.data.get('requester')
    .then(function (payload) {
      textElement.innerHTML = `Requester: ${payload.requester.name}`;
    })
    .catch(handleErr);
}

function handleErr(err = 'Unknown error') {
  console.error("Error occurred:", err);
}

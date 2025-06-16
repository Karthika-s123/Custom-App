let client;
const apiKey = " ";

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

  async function renderApp() {
    try {
      client = await app.initialized();
      window.client = client;

      // Register events
      client.events.on('app.activated', function() {
        renderContactName();
        const showBtn = document.getElementById("show-ticket");
        if (showBtn) {
          showBtn.addEventListener("click", showTicketDetails);
        }
      });

      client.events.on("ticket.replyClick", onReplyClick);
      client.events.on("ticket.priorityChanged", async function(event) {
        try {
          // Retrieve event data
          const data = await event.helper.getData();
          const ticketId = data.ticket.id;
          const newPriority = data.ticket.priority;

          // Show popup notification
          await client.interface.trigger("showNotify", {
            type: "info",
            message: `Ticket ID ${ticketId} priority changed to ${newPriority}`
          });
        } catch (err) {
          handleErr(err);
        }
      });

    } catch (error) {
      handleErr(error);
    }
  }
};

// ticket.replyClick event callback
async function eventCallback(event) {
  try {
    // Retrieve event data
    const data = await event.helper.getData();
    const ticketId = data.ticket.id;

    // Fetch ticket details using Request API
    const iparams = await client.iparams.get();
    const apiKey = iparams.apikey;
    const url = `https://workdeft973.freshservice.com/api/v2/tickets/${ticketId}`; // fixed typo here
    const headers = {
      Authorization: "Basic " + btoa(apiKey + ":X"),
      "Content-Type": "application/json"
    };

    const response = await client.request.invoke('get', { url, headers });
    if (response.status !== 200) throw new Error("Ticket fetch failed");
    const ticket = JSON.parse(response.response).ticket;

    // Compose reply text from ticket details
    const replyText =
      `Ticket ID: ${ticket.id}\n` +
      `Subject: ${ticket.subject}\n` +
      `Description: ${ticket.description_text || 'N/A'}\n` +
      `Priority: ${ticket.priority}\n` +
      `Status: ${ticket.status}`;

    // Show popup notification
    await client.interface.trigger("showNotify", {
      type: "info",
      message: `Reply button clicked for Ticket ID ${ticketId}`
    });

    // Fill the reply text area with ticket details
    await client.interface.trigger("setValue", {
      id: "reply",
      value: replyText
    });

    // Optionally show in your custom output area
    const replyOutput = document.getElementById("reply-output");
    if (replyOutput) {
      replyOutput.innerHTML = `
        Ticket ID: ${ticket.id}<br>
        Subject: ${ticket.subject}<br>
        Description: ${ticket.description_text || 'N/A'}<br>
        Priority: ${ticket.priority}<br>
        Status: ${ticket.status}
      `;
    }

  } catch (err) {
    handleErr(err);
  }
}

function onReplyClick(event) {
  try {
    const data = event.helper.getData();
    console.log("✉️ Reply clicked:", data);
    const replyOutput = document.getElementById("apptext");
    if(replyOutput) {
       replyOutput.innerHTML = `
    <p> Reply button clicked.</p>
    <p>Ticket ID: ${data.ticket.id}</p>`;
    }
  } catch (error) {
    console.error("Reply handler error:", error);
   // showMessage("❌ Reply handler error.");
  }
}
function showTicketDetails() {
  try {
    client.data.get("ticket").then(
      function(data) {
        if (data && data.ticket) {
          const ticket = data.ticket;
          const replyOutput = document.getElementById("reply-output");
          if (replyOutput) {
            replyOutput.innerHTML = `
              <strong>Ticket ID:</strong> ${ticket.id || 'N/A'}<br>
              <strong>Subject:</strong> ${ticket.subject || 'N/A'}<br>
              <strong>Description:</strong> ${ticket.description_text || 'N/A'}<br>
              <strong>Priority:</strong> ${ticket.priority || 'N/A'}<br>
              <strong>Status:</strong> ${ticket.status || 'N/A'}
            `;
          }
        }
      },
      function(error) {
        const replyOutput = document.getElementById("reply-output");
        if (replyOutput) {
          replyOutput.innerHTML = `<span style="color:red;">${typeof error === 'string' ? error : JSON.stringify(error)}</span>`;
        }
        console.error("Error occurred:", error);
      }
    );
  } catch (err) {
    handleErr(err);
  }
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
  const replyOutput = document.getElementById("reply-output");
  if (replyOutput) {
    replyOutput.innerHTML = `<span style="color:red;">${typeof err === 'string' ? err : JSON.stringify(err)}</span>`;
  }
  console.error("Error occurred:", err);
}

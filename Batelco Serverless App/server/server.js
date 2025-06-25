exports = {

  onTicketUpdateHandler: async function ({ data }) {
    try {
      const ticket = data.ticket;
      const Id = ticket.id;
      const status = ticket.status;

      console.log(`Checking Ticket ID: ${Id}`);
      console.log(`Ticket ${Id} Current Status: ${status}`);

      if (status === 32) {
        console.log(`Ticket ${Id} is in status 32. Updating to 31...`);

        const updateResponse = await $request.invokeTemplate("updateTicketStatus", {
          context: {
            ticket_id: Id
          },
          body: JSON.stringify({ status: 31 })
        });

        console.log(`Successfully updated ticket ${Id} to status ${updateResponse.status}`);
      } else {
        console.log(`Ticket ${Id} is not in status 32. No update required.`);
      }

    } catch (error) {
      console.error("Error in onTicketUpdateHandler:", error);
    }
  }
};

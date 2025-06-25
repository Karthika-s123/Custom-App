exports = {

  onTicketUpdateHandler: async function ({ data }) {
    try {
      const ticket = data.ticket;
      const Id = ticket.id;

      console.log(`🎟️ Checking Ticket ID: ${Id}`);

      // Get Ticket Details by ID
      const response = await $request.invokeTemplate("getTicketsWithStatus32", {
        context: { id: Id }
      });

      const ticketData = JSON.parse(response.response);
      const currentStatus = ticketData.status;

      console.log(`📌 Ticket ${Id} Current Status: ${currentStatus}`);

      if (currentStatus === 32) {
        console.log(`🎯 Ticket ${Id} is in status 32. Updating to 31...`);

        // Update Ticket Status with explicit body
        const updateResponse = await $request.invokeTemplate("updateTicketStatus", {
          context: {
            ticket_id: Id
          },
          body: JSON.stringify({ status: 31 })
        });

        console.log(`✅ Successfully updated ticket ${Id} to status 31`, updateResponse);
      } else {
        console.log(`ℹ️ Ticket ${Id} is not in status 32. No update required.`);
      }

    } catch (error) {
      console.error("❌ Error in onTicketUpdateHandler:", error);
    }
  }
};

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

      async function renderApp() {
        try {
          window.client = await app.initialized();
          client.events.on('app.activated', onAppActivate);
          client.events.on("ticket.replyClick", eventCallback);

        } catch (err) {
          handleErr(err);
        }
      }
    };

    async function onAppActivate() {
      try {
        const { portal } = await client.data.get('portal');
        document.getElementById('apptext').innerHTML = `Portal name: ${portal.name}`;
      } catch (err) {
        handleErr(err);
      }
    }

    // Notification
    async function showNotification() {
      try {
        await client.interface.trigger('showNotify', {
          type: 'success',
          title: 'Hello',
          message: 'This is a notification'
        });
      } catch (err) {
        handleErr(err);
      }
    }

    // Modal
    async function showModal() {
      try {
        await client.interface.trigger('showModal', {
          title: 'Sample Modal',
          template: '<p>This is a sample modal triggered from the app</p>'
        });
      } catch (err) {
        handleErr(err);
      }
    }

    // Confirm
    async function showConfirm() {
      try {
        const response = await client.interface.trigger('showConfirm', {
          title: 'Confirm?',
          message: 'Are you sure you want to proceed?',
          saveLabel: 'Yes',
          cancelLabel: 'No'
        });
        console.log('User selected:', response.message);
      } catch (err) {
        handleErr(err);
      }
    }

    // Set Ticket Subject
    async function setTicketSubject() {
      try {
        await client.interface.trigger('setValue', {
          id: 'subject',
          value: 'Updated via App'
        });
      } catch (err) {
        handleErr(err);
      }
    }

    // Get Ticket Details
    async function getTicketDetails() {
      try {
        const ticketData = await client.data.get('ticket');
        await client.interface.trigger("showNotify", {
  type: "info",
  title: "Ticket Info",
  message: `ID: ${ticketData.ticket.id} | Subject: ${ticketData.ticket.subject}`
});

      } catch (err) {
        handleErr(err);
      }
    }

  async function eventCallback(event) {
  console.log(event.type + " event occurred");

  try {
    await client.interface.trigger("showNotify", {
      type: "info",
      title: "Reply Clicked",
      message: "The reply button was clicked on this ticket."
    });
  } catch (err) {
    handleErr(err);
  }
}
    // Hide Priority Field
    async function hidePriorityField() {
      try {
        await client.interface.trigger('hide', { id: 'priority' });
      } catch (err) {
        handleErr(err);
      }
    }

    // Disable Priority Field
    async function disablePriorityField() {
      try {
        await client.interface.trigger('disable', { id: 'priority' });
      } catch (err) {
        handleErr(err);
      }
    }

    // Make Booking ID Required
    async function setRequiredField() {
      try {
        await client.interface.trigger('setRequired', { id: 'cf_booking_id' });
      } catch (err) {
        handleErr(err);
      }
    }

    // Clear Field Value
    async function clearFieldValue() {
      try {
        await client.interface.trigger('setValue', {
          id: 'subject',
          value: ''
        });
      } catch (err) {
        handleErr(err);
      }
    }

    function handleErr(err) {
      console.error('Error occurred:', err);
    }
exports = {
  onTicketCreateHandler: function (args) {
    console.log("Ticket Created:"`<br>`+"   Ticket ID:" + args.data.ticket.id + `<br>` + 
      "Subject:"`<br>`+ args.data.ticket.subject + `<br>` + 
      "Status:"`<br>`+ args.data.ticket.status + `<br>` + 
      "Priority:"`<br>`+ args.data.ticket.priority + `<br>` + 
      "Requester:"`<br>`+ args.data.ticket.requester + `<br>` + 
      "Group:"`<br>`+ args.data.ticket.group);
  },
  onTicketUpdateHandler: function(args) {
   console.log("Ticket Updated:"`<br>`+
    "   Ticket ID:" + args.data.ticket.id + `<br>` + 
    "Subject:"`<br>`+ args.data.ticket.subject + `<br>` + 
    "Status:"`<br>`+ args.data.ticket.status + `<br>` + 
    "Priority:"`<br>`+ args.data.ticket.priority);
  },
  onConversationCreateCallback: function(args) {
    console.log("Conversation Created:"`<br>`+"   Conversation ID:" + args.data.conversation.id + `<br>` + "Ticket ID:"`<br>`+ args.data.conversation.ticket_id + `<br>` + "Author:"`<br>`+ args.data.conversation.author + `<br>` + "Content:"`<br>`+ args.data.conversation.content);
  },
   onUserCreateCallback: function(args){
    console.log("User Created:"`<br>`+"   User ID:" + args.data.user.id);
    console.log("Name:"`<br>`+ args.data.user.name);
    console.log("Email:"`<br>`+ args.data.user.email);
  },
   onUserUpdateCallback: function(args) {
    console.log("User Updated:"`<br>`+"   User ID:" + args.data.user.id + `<br>` + "Name:"`<br>`+ args.data.user.name + `<br>` + "Email:"`<br>`+ args.data.user.email);
  },
   onUserDeleteCallback: function(args) {
    console.log("User Deleted:"`<br>`+"   User ID:" + args.data.user.id + `<br>` + "Name:"`<br>`+ args.data.user.name + `<br>` + "Email:"`<br>`+ args.data.user.email);
  },
  onUserDeleteCallback: function(args){
    console.log("User Deleted:"`<br>`+"   User ID:" + args.data.user.id);
  },
   onChangeCreateCallback: function(args) {
      console.log("Change Created:"`<br>`+"   Change ID:" + args.data.change.id + `<br>` +
      "Subject:"`<br>`+ args.data.change.subject + `<br>` +
      "Status:"`<br>`+ args.data.change.status + `<br>` +
      "Priority:"`<br>`+ args.data.change.priority);
  }
}

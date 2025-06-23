exports = {
  onTicketCreateHandler: function(args) {
    console.log("ticket id :"+args ['ticket']['id']);
    console.log("ticket subject :"+args ['ticket']['subject']);
    console.log("ticket description :"+args ['ticket']['description']);
  },
  onChangeCreateHandler: function(args) {
    console.log("change id :"+args['data'] ['change']['id']);
    console.log("change subject :"+args['data'] ['change']['subject']);
    console.log("change description :"+args['data'] ['change']['description']);
  }
};

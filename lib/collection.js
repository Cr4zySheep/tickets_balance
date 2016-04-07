this.Meteor.logs = new this.Meteor.Collection('logs');

//Security, no one could modify database from client side
Meteor.users.deny({
    update: function() {
      return true;
    },
    remove: function() {
      return true;
    },
    insert: function() {
      return true;
    }
});

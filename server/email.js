var Meteor = this.Meteor;

Meteor.startup(function () {
    process.env.MAIL_URL = Meteor.settings.mailUrl;
});

Meteor.publish("files", function (query) {
    return Files.find({'name' : { '$regex' : '.*' + query || '' + '.*', '$options' : 'i' }});
});

Meteor.publish("file", function (id) {
    return Files.find({_id:id});
});

Meteor.publish('realfiles', function() {
    return Realfiles.find({});
});

Meteor.publish("operations", function () {
    return Operations.find({});
});

Meteor.publish("chains", function () {
    return Chains.find({});
});

Files.allow({
    update: function(userId, doc) {
        var username = Meteor.users.findOne(userId).username;
        return doc.author == username ? true : false;
    }
});

Realfiles.allow({
    insert: function (userId) {
      return (userId ? true : false);
    },
    remove: function (userId) {
      return true;
    },
    download: function () {
      return true;
    },
    update: function (userId) {
      return true;
    }
});
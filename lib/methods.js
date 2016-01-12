Meteor.methods({
    newFile: function (realfileid, filename) {
        if (!Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error("not-authorized");
        }
        var f = Realfiles.findOne({_id:realfileid});
        if (!f) throw new Meteor.Error("no such file");
        //console.log(f);
        var user = Meteor.users.findOne(Meteor.userId());
        Files.insert({name:filename, date:new Date(), author:user.username, variations:[realfileid]});
    },
    newChain: function (name,ops) {
        if (!Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error("not-authorized");
        }
        if (!name || name=="") {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error("Chain name can not be empty!");
        }
        if (!ops || ops.length<2) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error("Chain can not be undefined!");
        }
        Chains.insert({name:name,operations:ops});
    },
    deleteAllFileVar: function (id) {
        var file = Files.findOne(id);
        if (!Meteor.userId() || Meteor.user().username!=file.author) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error("not-authorized");
        }
        var subfiles = file.variations;
        for (var i=0; i<subfiles.length; i++) {
            Realfiles.remove(subfiles[i]);
        }
        Files.remove(id);
    }
});
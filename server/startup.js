Meteor.startup(function() {
    if (Operations.find({}).count()==0) {
        Operations.insert({name:"Операция 1",params:[{id:1,name:"Параметр 1"},{id:2,name:"Параметр 2"}]});
        Operations.insert({name:"Операция 2",params:[{id:1,name:"Параметр 1"}]});
    }
});

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

accountsUIBootstrap3.setLanguage('ru');

Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    var chain;
    $("#saveChainButton").click(function() {
        var name = $('#chainname').val();
        console.log(window.chain,name);
        if (name!="") {
            $('#myModal').modal('hide');
            Meteor.call("newChain",name,window.chain);
        }
    });
});
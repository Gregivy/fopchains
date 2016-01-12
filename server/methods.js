Future = Npm.require('fibers/future');
Meteor.methods({
    fileContent: function (id) {
        var myFuture = new Future();
        
        var fileObject = Realfiles.findOne(id);
        fileObject.createReadStream()
            .on('data', function (chunk) {
                //console.log(chunk);
                myFuture.return(chunk.toString('utf-8'));
            });
        return myFuture.wait();
    },
    changeFile: function (id,n,instructions) {
        if (!Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error("not-authorized");
        }
        //console.log(id,n,instructions);
        var myFuture = new Future();
        
        var file = Files.findOne(id);
        var filevarl = file.variations.length;
        //Filed.update(id,{$push:}
        var newFile = new FS.File();
        var filecontent = Meteor.call("fileContent",file.variations[n])+"\n"+JSON.stringify(instructions);
        //console.log(filecontent);
        var filebuffer = new Buffer(filecontent);
        newFile.attachData(filebuffer, {type: 'text/xml'}, function(error){
            //if(error) throw error;
            //console.log(error);
            myFuture.return(Realfiles.insert(newFile)._id);
        });
        var newFileId = myFuture.wait();
        //console.log(newFileId);
        Files.update(id,{$push:{variations:newFileId}});
        return [filevarl,newFileId];
        //var fileObject = Realfiles.findOne(file.variations[n]);
        /*
        var readStream = fileObject.createReadStream("realfiles");
        newFile.attachData(readStream, {type: 'text/xml'});
        var newFileId = Realfiles.insert(newFile);
        fileObject = Realfiles.findOne(newFileId);
        fileObject.createWriteStream
        return myFuture.wait();
        */
    },
});
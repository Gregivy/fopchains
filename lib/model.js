Files = new Mongo.Collection("files");
Operations = new Mongo.Collection("operations");
Chains = new Mongo.Collection("chains");
Realfiles = new FS.Collection("realfiles", {
  stores: [
    new FS.Store.GridFS("original")
  ],
  filter: {
    allow: {
      contentTypes: ['text/xml']
    }
  }
});
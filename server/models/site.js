const mongooose = require("mongoose");

//why siteInfo and featured fields are array, and all info stored inside these arrays?
//because we now that at index 0 of siteInfo we are storing the basic site information (name, address, tel, email)
//later we might decide to store different information, for example menu structure or language settings etc...
//so we can store these settings as completely differently structured objects inside the siteInfo array at different indexes
//for example at index:1 we can store home page related settings, how many products shown at "new arrivals", what is the color of ...
//at index 2: we might keep user dashboard related settings...
//As a result, this structure provides us a huge advantage, easy manipulate...

//Same reasons are valid for "featured" field. Normally this field designed for promotion-related settings,
//but in the future we can extend its usage by adding/pushing new objects at different indexes

//And name filed used for when updating an information inside this collection,
//we need to find it first. Even if there exists an only one document its easier to
//use "Site.findOneAndUpdate()". In this function, we wil try to find the correct document.
//In the future we can use this name as a distinctor for other types of sites.
//For example the document which has a name="guitar" used for guitar online web site,
//name="book" might be used for book selling online web site etc.

const siteSchema = mongooose.Schema({
  name: {
    type: String,
    default: "Site",
  },
  featured: {
    type: Array,
    required: true,
    default: [],
  },
  siteInfo: {
    type: Array,
    required: true,
    default: [],
  },
});

const Site = mongooose.model("Site", siteSchema);

module.exports = { Site };

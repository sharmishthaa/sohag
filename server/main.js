import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import './../imports/api/ClientData/methods.js'
import './../imports/api/Product/methods.js'
import './../imports/api/ProductAttribute/methods.js'
import './../imports/api/ProductCategory/methods.js'
import './../imports/api/User/methods.js'
import './../imports/api/GlobalSettings/methods.js'

function insertLink({ title, url }) {
  LinksCollection.insert({title, url, createdAt: new Date()});
}

Meteor.startup(() => {
  
});


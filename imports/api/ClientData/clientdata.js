import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'simpl-schema/dist/SimpleSchema';

export const ClientDataCollection = new Mongo.Collection('clientdata');

const Schemas = {};

Schemas.Clientdata = new SimpleSchema({
  first_name: {
    type: String,
    label: 'First Name',
    optional: false,
  },
  last_name: {
    type: String,
    label: 'Last Name',
    optional: false,
  },
  gender: {
    type: String,
    label: 'Gender',
    optional: false,
  },
  // dob: {
  //   type: Date,
  //   label: 'DOB',
  //   optional: false,
  // },
  email: {
    type: String,
    label: 'Email',
    optional: false,
  },
  phone: {
    type: String,
    label: 'Phone',
    optional: false,
  },
  product: {
    type: Array,
    label: 'Product',
    optional: false,
  },
  'product.$': Object,
  "product.$.productCategory": String,
  "product.$.productName": String,
  "product.$.size": String,
  "product.$.quantity": String,
  "product.$.price": String,
  order_price: {
    type: String,
    label: 'Order Price',
    optional: false,
  },
});

ClientDataCollection.attachSchema(Schemas.Clientdata);
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'simpl-schema/dist/SimpleSchema';

export const ClientDataCollection = new Mongo.Collection('orderdata');

const Schemas = {};

Schemas.Clientdata = new SimpleSchema({
  name: {
    type: String,
    label: 'First Name',
    optional: false,
  },
  dob: {
    type: Date,
    label: 'Date of Birth',
    optional: false,
  },
  address: {
    type: String,
    label: 'Address',
    optional: false,
  },
  postal_code: {
    type: String,
    label: 'Postal Code',
    optional: false,
  },
  phone: {
    type: String,
    label: 'Phone',
    optional: false,
  },
  order_type: {
    type: String,
    label: 'Order Type',
    optional: false,
  },
  product: {
    type: Array,
    label: 'Product',
    optional: false,
  },
  'product.$': Object,
  "product.$.size": String,
  "product.$.quantity": String,
  "product.$.price": String,
  payment_mode: {
    type: String,
    label: 'Payment Mode',
    optional: false,
  },
  order_date_time: {
    type: Date,
    label: 'Order Placing Date Time',
    optional: false,
  },
  order_no: {
    type: String,
    label: 'Order No',
    optional: false,
  },
  total_payment_amount: {
    type: Number,
    label: 'Total Payment Amount',
    optional: false,
  },
  // dob: {
  //   type: Date,
  //   label: 'DOB',
  //   optional: false,
  // },
  // email: {
  //   type: String,
  //   label: 'Email',
  //   optional: false,
  // },
});

ClientDataCollection.attachSchema(Schemas.Clientdata);
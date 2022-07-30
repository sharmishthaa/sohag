import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'simpl-schema/dist/SimpleSchema';

export const ClientDataCollection = new Mongo.Collection('orderdata');

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
  address_line_1: {
    type: String,
    label: 'Address Line 1',
    optional: false,
  },
  address_line_2: {
    type: String,
    label: 'Address Line 2',
    optional: true,
  },
  city: {
    type: String,
    label: 'City',
    optional: false,
  },
  state: {
    type: String,
    label: 'State',
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
  totalPayment: {
    type: String,
    label: 'Total Payment',
    optional: true,
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
  // gender: {
  //   type: String,
  //   label: 'Gender',
  //   optional: false,
  // },
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
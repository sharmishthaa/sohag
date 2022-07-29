import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'simpl-schema/dist/SimpleSchema';

export const ProductCatCollection = new Mongo.Collection('product_category');

const Schemas = {};

Schemas.Productcat = new SimpleSchema({
  product_category_name: {
    type: String,
    label: 'Product Category',
    optional: false,
  },
  status: {
    type: String,
    label: 'Status',
    optional: false,
  },
//   created_date: {
//     type: String,
//     label: 'Gender',
//     optional: false,
//   },
//   created_by: {
//     type: Date,
//     label: 'Car Name',
//     optional: false,
//   },
});

ProductCatCollection.attachSchema(Schemas.Productcat);
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'simpl-schema/dist/SimpleSchema';

export const ProductCollection = new Mongo.Collection('product');

const Schemas = {};

Schemas.Product = new SimpleSchema({
  product_name: {
    type: String,
    label: 'Product Name',
    optional: false,
  },
  product_category: {
    type: String,
    label: 'Product Category',
    optional: false,
  },
  status: {
    type: String,
    label: 'Status',
    optional: false,
  },
});

ProductCollection.attachSchema(Schemas.Product);
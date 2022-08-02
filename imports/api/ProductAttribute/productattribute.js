import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'simpl-schema/dist/SimpleSchema';

export const ProductAttrCollection = new Mongo.Collection('product_attr');

const Schemas = {};

Schemas.Product_attr = new SimpleSchema({
  product: {
    type: String,
    label: 'Product Name',
    optional: false,
  },
  size: {
    type: String,
    label: 'size',
    optional: false,
  },
  price: {
    type: Number,
    label: 'price',
    optional: false,
  },
  status: {
    type: String,
    label: 'status',
    optional: false,
  },
});

ProductAttrCollection.attachSchema(Schemas.Product_attr);
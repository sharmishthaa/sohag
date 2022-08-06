import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'simpl-schema/dist/SimpleSchema';

export const GlobalSettingsCollection = new Mongo.Collection('globalsettings');

const Schemas = {};

Schemas.GlobalSettings = new SimpleSchema({
  field_name: {
    type: String,
    label: 'Field Name',
    optional: false,
  },
  display_name: {
    type: String,
    label: 'Display Name',
    optional: true,
  },
  field_value: {
    type: String,
    label: 'Field Value',
    optional: true,
  },
  input_type: {
    type: String,
    label: 'Input Type',
    optional: true,
  },
  option_value: {
    type: String,
    label: 'Option Value',
    optional: true,
  },
  status: {
    type: String,
    label: 'Status',
    optional: false,
  },
});

GlobalSettingsCollection.attachSchema(Schemas.GlobalSettings);
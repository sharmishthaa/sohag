import { Meteor } from 'meteor/meteor';
import { ProductCollection } from './product';

Meteor.methods({
    'product.insert'({...values}) {
        return ProductCollection.insert({
            product_name:values.product_name, 
            product_category:values.product_category, 
            status:values.status
        })
    },
    'product.list'({...values}) {
        return ProductCollection.find({
            product_category:values.product_category,
            status:'active'
        }).fetch()
    },
})
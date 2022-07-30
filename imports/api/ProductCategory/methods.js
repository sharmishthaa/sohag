import { Meteor } from 'meteor/meteor';
import { ProductCatCollection } from './productcategory';

Meteor.methods({
    'productcat.insert'({...values}) {
        return ProductCatCollection.insert({
            product_category_name:values.product_category_name, 
            status:values.status, 
        })
    },
    'productcat.list'() {
        return ProductCatCollection.find({}).fetch()
    },
    'productcat.test'(values) {
        console.log(values)
        return values;
    },
})
import { Meteor } from 'meteor/meteor';
import { ProductAttrCollection } from './productattribute';

Meteor.methods({
    'productattr.insert'({...values}) {
        return ProductAttrCollection.insert({
            product:values.product, 
            size:values.size, 
            price:values.price,
            status:values.status, 
        })
    },
    'productattr.list'({...values}) {
        return ProductAttrCollection.find({
            product:values.product,
            status:'active'
        }).fetch()
    },
})
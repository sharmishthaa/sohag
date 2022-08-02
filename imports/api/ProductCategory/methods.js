import { Meteor } from 'meteor/meteor';
import { ProductCollection } from '../Product/product';
import { ProductAttrCollection } from '../ProductAttribute/productattribute';
import { ProductCatCollection } from './productcategory';

Meteor.methods({
    'productcat.insert'({...values}) {
        return ProductCatCollection.insert({
            product_category_name:values.product_category_name, 
            status:values.status, 
        })
    },
    'productcat.list'() {
        return ProductCatCollection.find({status:'active'}).fetch()
    },
    'productcat.test'(values) {
        console.log("values", values)
        values.map( record => {
            let is_exist_category = ProductCatCollection.findOne({product_category_name:{ $regex: record.productCategoryName, $options:'i' }})
            let prod_cat_id
            if(!is_exist_category)
            {
                let new_prod_cat = ProductCatCollection.insert({
                    product_category_name:record.productCategoryName, 
                    status:'active', 
                })
                prod_cat_id = new_prod_cat
            }
            else
            {
                prod_cat_id = is_exist_category._id
            }
            console.log("prod_cat_id",prod_cat_id)
            let is_exist_product = ProductCollection.findOne({product_name:{ $regex: record.productName, $options:'i'}, product_category:prod_cat_id})
            let prod_id
            if(!is_exist_product)
            {
                let new_prod = ProductCollection.insert({
                    product_name:record.productName, 
                    product_category:prod_cat_id, 
                    status:'active'
                })
                prod_id = new_prod
            }
            else
            {
                prod_id = is_exist_product._id
            }
            console.log("prod_id",prod_id)
            let is_exist_product_attr = ProductAttrCollection.findOne({size:{ $regex: record.productSize, $options:'i'}, price:{ $eq: record.productPrice }, product:prod_id})
            let prod_attr_id
            if(!is_exist_product_attr)
            {
                let new_prod_attr = ProductAttrCollection.insert({
                    product:prod_id, 
                    size:record.productSize, 
                    price:record.productPrice,
                    status:'active',
                })
                prod_attr_id = new_prod_attr
            }
            else
            {
                prod_attr_id = is_exist_product_attr._id
            }
            console.log("prod_attr_id",prod_attr_id)
        })
        // return values;
    },
})
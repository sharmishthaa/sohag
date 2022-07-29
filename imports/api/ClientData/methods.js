import { Meteor } from 'meteor/meteor';
import { ClientDataCollection } from './clientdata';

Meteor.methods({
    'clientdata.insert'({...values}) {
        console.log(values)
        let order_price = 0
        values.products.map(function(product_price){
            order_price += product_price.price
        })
        return ClientDataCollection.insert({
            first_name:values.first_name, 
            last_name:values.last_name, 
            gender:values.gender,
            dob:values.dob, 
            email:values.email, 
            phone:values.phone,
            product:values.products,
            order_price:order_price
        })
    },
    'clientdata.list'() {
        return ClientDataCollection.find({}).fetch()
    },
})
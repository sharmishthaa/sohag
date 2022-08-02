import { Meteor } from 'meteor/meteor';
import { ClientDataCollection } from './clientdata';
import getWeekOfMonth from 'date-fns/getWeekOfMonth'

Meteor.methods({
    'orderdata.insert'({...values}) {
        console.log(values)
        let order_price = 0
        values.products.map(function(product_price){
            order_price += product_price.price
        })
        return ClientDataCollection.insert({
            name:values.name, 
            dob:values.dob, 
            address:values.address,
            postal_code:values.postal_code,
            phone:values.phone,
            order_type:values.order_type,
            total_payment_amount:values.total_payment_amount,
            product:values.products,
            payment_mode:values.payment_mode,
            order_date_time:new Date(),
            order_no:'OD'+Date.now().toString(36)
            // gender:values.gender,
            // dob:values.dob, 
            // email:values.email, 
        })
    },
    'orderdata.details'({...values}) {
        let match_feilds = {}
        if(values.from_date)
        {
            match_feilds.order_date_time = {$gte: values.from_date}
        }
        if(values.to_date)
        {
            match_feilds.order_date_time = {$lte: values.to_date}
        }
        const client_data = ClientDataCollection.rawCollection().aggregate( 
            [
                {                 
                    $unwind: {
                        "path": "$product"
                    }
                },
                {
                    $lookup: {
                        from: "product_attr",
                        localField: "product.size",
                        foreignField: "_id",
                        as: "product_attrs"
                    }
                },
                { $unwind: "$product_attrs" },
                {
                    $lookup: {
                        from: "product",
                        localField: "product_attrs.product",
                        foreignField: "_id",
                        as: "products"
                    },
                },
                { $unwind: "$products" },
                {
                    $lookup: {
                        from: "product_category",
                        localField: "products.product_category",
                        foreignField: "_id",
                        as: "product_categorys"
                    }
                },
                { $unwind: "$product_categorys" },
                { $match: match_feilds },
                { $sort: {_id:-1} },
                {
                    $project: {
                        "name": 1,
                        "phone": 1,
                        "address": 1,
                        "postal_code": 1,
                        "order_type": 1,
                        "total_payment_amount": 1,
                        "payment_mode": 1,
                        "order_date_time": 1,
                        "order_no": 1,
                        "product_cat": "$product_categorys.product_category_name",
                        "product_name": "$products.product_name",
                        "size": "$product_attrs.size",
                        "quantity": "$product.quantity"
                    }
                }
            ]
        ).toArray().await();
        return client_data
    },

    'orderdata.list'() {
        // let weekOfMonth = getWeekOfMonth(new Date())
        // let dayOfWeek = new Date('07-03-2022').getDay()
        // // '07-03-2022'
        // console.log(dayOfWeek);
        return ClientDataCollection.find().fetch()
    },
})
import { Meteor } from 'meteor/meteor';
import { ClientDataCollection } from './clientdata';

Meteor.methods({
    'orderdata.insert'({...values}) {
        console.log(values)
        let order_price = 0
        values.products.map(function(product_price){
            order_price += product_price.price
        })
        return ClientDataCollection.insert({
            first_name:values.first_name, 
            last_name:values.last_name, 
            address_line_1:values.address_line_1,
            address_line_2:values.address_line_2,
            city:values.city,
            state:values.state,
            postal_code:values.postal_code,
            phone:values.phone,
            order_type:values.order_type,
            total_payment:values.total_payment,
            product:values.products,
            payment_mode:values.payment_mode,
            order_date_time:new Date(),
            order_no:'OD'+Date.now().toString(36)
            // gender:values.gender,
            // dob:values.dob, 
            // email:values.email, 
        })
    },
    'orderdata.list'({...values}) {
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
                
                {
                    $project: {
                        "first_name": 1,
                        "last_name": 1,
                        "phone": 1,
                        "address_line_1": 1,
                        "address_line_2": 1,
                        "city": 1,
                        "state": 1,
                        "postal_code": 1,
                        "order_type": 1,
                        "totalPayment": 1,
                        "payment_mode": 1,
                        "order_date_time": 1,
                        "order_no": 1,
                        "product_cat": "$product_categorys.product_category_name",
                        "product_name": "$products.product_name",
                        "size": "$product_attrs.size",
                        "quantity": "$product.quantity",
                        "price": "$product.price",
                    }
                }
            ]
        ).toArray().await();
        return client_data
    },
})
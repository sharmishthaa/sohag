import { Meteor } from 'meteor/meteor';
import { ClientDataCollection } from './clientdata';
import moment from "moment";
import { orderNoEncriptionObject } from '../../config';

Meteor.methods({
    'orderdata.insert'({...values}) {
        // console.log(values)

        // const inserted_data = {
        //     name:values.name, 
        //     address:values.address,
        //     landmark:values.landmark,
        //     postal_code:values.postal_code,
        //     phone:values.phone,
        //     order_type:values.order_type,
        //     total_payment_amount:values.total_payment_amount,
        //     product:values.products,
        //     payment_mode:values.payment_mode,
        //     order_date_time:new Date(),
        //     order_no:generateOrderId()
        //     // gender:values.gender,
        //     // dob:values.dob, 
        //     // email:values.email, 
        // }
        // if(values.dob)
        // {
        //     inserted_data.dob=values.dob
        //     console.log(inserted_data)
        // }
        // return ClientDataCollection.insert(inserted_data)
    },
    'orderdata.details'({...values}) {
        console.log(values)
        let match_feilds = {}
        let date_array = []
        if(values.from_date)
        {
            date_array.push({order_date_time:{$gte: new Date(values.from_date)}})
        }
        if(values.to_date)
        {
            date_array.push({order_date_time:{$lte: new Date(values.to_date)}})
        }
        if(date_array.length>0)
        {
            match_feilds = {$and:date_array}
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
                
                {
                    $lookup: {
                        from: "product",
                        localField: "product.productName",
                        foreignField: "_id",
                        as: "products"
                    },
                },
                
                {
                    $lookup: {
                        from: "product_category",
                        localField: "product.productCategory",
                        foreignField: "_id",
                        as: "product_categorys"
                    }
                },
                { $unwind: { path: "$product_attrs", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$products", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$product_categorys", preserveNullAndEmptyArrays: true } },
                // { $unwind: "$product_attrs" },
                // { $unwind: "$products" },
                // { $unwind: "$product_categorys" },
                { $match: match_feilds },
                { $sort: {_id:-1} },
                {
                    $project: {
                        "name": 1,
                        "dob": 1,
                        "phone": 1,
                        "address": 1,
                        "landmark":1,
                        "postal_code": 1,
                        "order_type": 1,
                        "total_payment_amount": 1,
                        "payment_mode": 1,
                        "order_date_time": 1,
                        "order_no": 1,
                        "product_cat": "$product_categorys.product_category_name",
                        "product_name": "$products.product_name",
                        "size": "$product_attrs.size",
                        "customsizesize": "$product.size",
                        "quantity": "$product.quantity"
                    }
                }
            ]
        ).toArray().await();
        return client_data
    },

    'orderdata.list'() {
        // let weekOfMonth = getWeekOfMonth(new Date())
        // let dayOfWeek = new Date().getDay()
        // // '07-03-2022'
        // console.log(dayOfWeek);
        return ClientDataCollection.find().fetch()
    },
})

export const generateOrderId=()=>{
    const month = new Date().getMonth().toString()
    const date = new Date().getDay().toString()
    const year = new Date().getFullYear().toString()
    const hours = new Date().getHours().toString()
    const minutes = new Date().getMinutes().toString()
    const seconds = new Date().getSeconds().toString()
    const encriptedObject = orderNoEncriptionObject
    return encriptedObject[date]+encriptedObject[7]+year.slice(-2)+encriptedObject[hours]+encriptedObject[minutes]+encriptedObject[seconds]
}
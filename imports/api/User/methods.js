import { Meteor } from 'meteor/meteor';

Meteor.methods({
    'user.insert'({...values}){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phregex=/^[0-9]+$/;
        if(values.user_type == 'admin' && emailRegex.test(values.email.toLowerCase()))
        {
            let cleanData = values
            const id = Accounts.createUser({
                email: cleanData.email,
                password: cleanData.password,
                profile: 
                {
                    user_type: cleanData.user_type, 
                    status: 'active', 
                }
            });

        }
    }
})
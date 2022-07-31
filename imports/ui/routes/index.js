
import React from 'react';
import {
    BrowserRouter,
    Route,
    Routes,
    Navigate
  } from "react-router-dom";
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import FullLoader from '../components/FullLoader';
import MainLayout from '../layouts/MainLayout';
import Userform from '../pages/userFrom';
import ClientDetails from '../pages/ClientDetails';
import ClientdataList from '../pages/ClientDetails/list';
import ProductUpload from '../pages/ProductUpload/upload';

const Routers = () => {

    const user = useTracker(()=>Meteor.user());
    const loggingIn =useTracker(()=>Meteor.loggingIn()); 

    if(loggingIn)
        return <FullLoader />
    
    return (
        <BrowserRouter>
            {user?.profile?.user_type!='admin' ?
                <Routes>
                    <Route path="/auth" element={<AuthLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<SignUp />} />
                    </Route>
                    <Route path="/userform" element={<Userform />} />
                    <Route path="/*" element={<Navigate replace to="/auth/login" />} />
                </Routes>
                :
                <Routes>
                    <Route path="/" element={<MainLayout />} >                    
                        <Route path="/auth/order" element={<ClientDetails />}>
                            <Route path="list" element={<ClientdataList />} />
                        </Route>
                        <Route path="/auth/product" element={<ProductUpload />}>
                            {/* <Route path="upload" element={<ClientdataList />} /> */}
                        </Route>
                        <Route path="/auth/*" element={<ClientdataList />}/>
                    </Route>
                    <Route path="/userform" element={<Userform />} />
                    <Route path="/*" element={<Navigate replace to="/auth/client/list" />} />
                </Routes>
            }
        </BrowserRouter>
      );
}
 
export default Routers;

import React from 'react';
import { Outlet } from "react-router";
// import "./style.less";

const AuthLayout = () => {
    return ( 
        <div className="h-w-100 auth-cnt">
            
            <div className='auth-cnt-form'>
            
                <Outlet />
            </div>
        
        </div>
     );
}
 
export default AuthLayout;
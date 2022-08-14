import React, {useState, useEffect} from "react";
import {
    CarOutlined,

} from "@ant-design/icons";
import { Layout, Menu, Image } from "antd";
import { Link, useLocation } from "react-router-dom";
import { Header } from "antd/lib/layout/layout";

const { Sider} = Layout;
const SideMenu = ({collapsed, toggle}) => {

    const [defaultKey, setDefaultKey] = useState([]);
    const location = useLocation();

    function getItem(label, key, icon, children) {
        return {
          key,
          icon,
          children,
          label,
        };
      }

      const test =(key) => {
        // toggle && toggle()
        let keydefault=[];
        keydefault.push(key.keyPath[0])
        setDefaultKey(keydefault)
        console.log(keydefault)
      }

      useEffect(() => {

        let loacationPath = location.pathname
        let keys=[];
        if(loacationPath.includes('userdata')) keys.push('1');
        setDefaultKey(keys)
        
       }, [])

      const items = [
        getItem(<Link to="/auth/order/list">Order Details</Link>, '1', <CarOutlined />),
        getItem(<Link to="/auth/product">Product Upload</Link>, '2', <CarOutlined />),
        getItem(<Link to="/auth/gs/list">Global Settings</Link>, '3', <CarOutlined />),
        ];
 
    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <Header className="site-header">
              <div className="site-logo" style={{fontSize: "20px", color: "#e2a93c", fontFamily: "cursive"}}>
                {/* <img src="https://i.picsum.photos/id/870/200/300.jpg?blur=2&grayscale&hmac=ujRymp644uYVjdKJM7kyLDSsrqNSMVRPnGU99cKl6Vs"></img> */}
                Sohag
              </div>
            </Header>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={defaultKey}
                items={items}
                onClick={(key)=>test(key)}
            />
        </Sider>
    );
};

export default SideMenu;


import React, {useState, useEffect} from 'react';
import { Button, Col, Layout, Menu, Row } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
// import "./style";
import { Outlet } from "react-router";
import SideMenu from './SideMenu';

const { Header, Content } = Layout;

const MainLayout =() => {
  const [collapsed, setCollapsed] = useState(false)

  const toggle = () => {
    setCollapsed(!collapsed)
  };

  const logout = () => {
    Meteor.logout();
  }
  useEffect(() => {
    collapsed ? 
  document.querySelector('body').classList.add("sitebar-active")
  : document.querySelector('body').classList.remove("sitebar-active")
}, [collapsed]);
 return (
  <>
      <Layout className='h-w-100'>
        <SideMenu collapsed={collapsed} toggle={toggle} />
        <Layout className="site-layout">
          <Header className="site-header">
           
                <div className="left-toggle-btn">
                  <button className={collapsed ? "mainDashboard-toggle active":"mainDashboard-toggle"} onClick={toggle}>
                    <div></div>
                  </button>
                {/* {
                  collapsed ? <MenuUnfoldOutlined onClick={toggle}/> : 
                              <MenuFoldOutlined onClick={toggle}/> 
                } */}
                </div>
            
                <div className='logout-button'>
                  <Button type="primary" onClick={logout}>Logout</Button>
                  {/* <Button type="primary" onClick={changepass}>Change Password</Button> */}
                </div>
              
          </Header>
          <Content>
            <div className="dashborad-main-body">
             <Outlet />
             </div>
          </Content>
        </Layout>
      </Layout>
      {collapsed &&
      <div className="overlay-sidebar" onClick={toggle}></div>
      }
      </>
    );
  
}

export default MainLayout;
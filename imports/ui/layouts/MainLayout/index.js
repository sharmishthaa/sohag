
import React, {useState} from 'react';
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
  
 return (
      <Layout className='h-w-100'>
        <SideMenu collapsed={collapsed}/>
        <Layout className="site-layout">
          <Header className="site-header">
            <Row>
              <Col span={12}>
                {
                  collapsed ? <MenuUnfoldOutlined onClick={toggle}/> : 
                              <MenuFoldOutlined onClick={toggle}/> 
                }
              </Col>
              
              <Col span={12}>
                <div className='logout-button'>
                  <Button type="primary" onClick={logout}>Logout</Button>
                  {/* <Button type="primary" onClick={changepass}>Change Password</Button> */}
                </div>
              </Col>
            </Row>
          </Header>
          <Content>
             <Outlet />
          </Content>
        </Layout>
      </Layout>
    );
  
}

export default MainLayout;
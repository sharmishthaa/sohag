
import React from 'react';
import { Form, Input, Button, message } from 'antd';
// import { SignInAlt } from '@styled-icons/fa-solid/SignInAlt';
// import './style';
import { Link, useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

const SignUp = () => {
  const navaigate = useNavigate();
  const onFinish = (values) => 
  {
    // navaigate
    values.user_type = 'admin';
    console.log(values);
    Meteor.call('user.insert',values, (err, res) => {
        if(err)
        {
          if(err.reason)
              message.error(err.reason)
        }
        else
        {
            message.success("Account creation successful");
            navaigate('/auth/login');
        }
    })
  };

  const onFinishFailed = (errorInfo) => 
  {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className='login-form'
    >
  {/* @styled-icons/boxicons-regular/LogInCircle */}
      {/* <div className='login-logo-cnt'>
            <SignInAlt width={35}/>
      </div> */}
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: "email",message: 'Please input valid email!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Sign Up
        </Button>
      </Form.Item>
      <Link to="/auth/login">Login</Link>
    </Form>
  );
};

export default SignUp;

import React, {useEffect, useState} from 'react';
import { Form, Input, Button, Checkbox, message, Image } from 'antd';
// import './style';
import { Meteor } from 'meteor/meteor';

const Login = () => {

  // const [loadingState, setLoadingState] = useState(false);  

  const onLogin = (values) => {
    const { email, password } = values;
    // setLoadingState(true);

    console.log(email);

    Meteor.loginWithPassword(email, password, (err, res) => {
        let returnObj={}
        // setLoadingState(false);

        if (!err) 
        {
          message.success("Welcome")
          returnObj.status="success"
          returnObj.message="Login Successful"
          // const PORT =  3001;
          // const socket = io(`http://localhost:${PORT}`);
          
          // socket.on('connect', function() {
          //   console.log(socket);
          //   console.log('Client connected');
            
          //   socket.on("message",(key)=>{
          //     console.log("Client inside coonect func---",key)
          //   })
          // });
          // socket.emit("useradd", {userInfo: values});
          // socket.on("message",(key)=>{
          //   console.log("Client outside coonect func---",key)
          // })
        }
        
        else 
        {
          if (err && err.reason)
            message.error(err.reason);
          else
            message.error("Something is going wrong!");
            returnObj.status="fail"
            returnObj.message="Something is going wrong!"
            throw new Meteor.Error(returnObj)
        }
        return returnObj;

    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onLogin}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className='login-form'
    >
      <Form.Item
        label="Email"
        name="email"
        // rules={[{ required: true, type: "email", message: 'Please input valid email!' }]}
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

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">Login</Button>
      </Form.Item>

      {/* <Link to="/auth/signup">Signup</Link> */}
    </Form>
  );
};

export default Login;
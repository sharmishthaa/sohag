import { Typography, Button, Col, Form, Input, Row, Card, Select, DatePicker, Radio, Space, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
// import './style.less';
import 'antd/dist/antd.css';
import moment from "moment";

const { Title } = Typography;

function Userform() {
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const [productCategory, setProductCategory] = useState('')
  const [productNameFromCategory, setProductNameFromCategory] = useState('')
  const [productDetailsFromProduct, setProductDetailsFromProduct] = useState('')
  const layout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 20,
    },
    layout: "horizontal",
    initialValues: {
      size: "default",
    }
  };

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: 'not a valid ${label}!',
    },
  };

  useEffect(() => {
    getProductCategory()
  }, []);
  const getProductCategory = () => {
    // const lo_cardata = { ...values }
    // lo_cardata.dob = moment(values.dob).toDate()
    Meteor.call("productcat.list", (error, result) => {
      console.log(error);
      if (!error) {
        console.log("success");
        console.log(result)
        setProductCategory(result)
      }
      else {
        console.log(error)
      }
    });
  }
  const selectedCategory = (value) => {
    Meteor.call("product.list", { product_category: value }, (error, result) => {
      console.log(error);
      if (!error) {
        console.log("success");
        console.log(result)
        setProductNameFromCategory(result)
      }
      else {
        console.log(error)
      }
    });
  }
  const selectedProduct = (value) => {
    Meteor.call("productattr.list", { product: value }, (error, result) => {
      console.log(error);
      if (!error) {
        console.log("success");
        console.log(result)
        setProductDetailsFromProduct(result)
      }
      else {
        console.log(error)
      }
    });
  }

  const onFinish = (values) => {
    console.log(values)
    const lo_cardata = { ...values }
    lo_cardata.dob = moment(values.dob).toDate()
    Meteor.call("clientdata.insert", lo_cardata, (error, result) => {
      console.log(error);
      if (!error) {
        message.success("Order Requested");
        console.log("success");
      }
      else {
        alert(error.error)
      }
    });
    setTimeout(() => {
      window.location.reload()
    }, "1000")
  }


  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });

    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };
  const exportToCsv = e => {
    e.preventDefault();
    // let headers = ["Id,Name,Surname,Age"];

    // let usersCsv = usersData.users.reduce((acc, user) => {
    //   const { id, name, surname, age } = user;
    //   acc.push([id, name, surname, age].join(","));
    //   return acc;
    // }, []);

    Meteor.call("productcat.list", (error, result) => {
      console.log(error);
      if (!error) {
        console.log("success");
        console.log(result)
        // setProductCategory(result)
        let headers = ["Product Category Name,Status"];

        let usersCsv = result.reduce((acc, user) => {
          const { product_category_name, status } = user;
          acc.push([product_category_name, status].join(","));
          return acc;
        }, []);

        downloadFile({
          data: [...headers, ...usersCsv].join("\n"),
          fileName: "users.csv",
          fileType: "text/csv",
        });

      }
      else {
        console.log(error)
      }
    });


  };
  return (
    <Card level={2} title="Customer Form">
      {/* <button type="button" onClick={exportToCsv}>
        Export to CSV
      </button> */}
      <Form
        form={form}
        {...layout}
        validateMessages={validateMessages}
        onFinish={onFinish}>
        <Row className='module-heading'>
          <Col className='title-cus' span={24}>  <Title level={5}>Full Name</Title></Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="first_name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input className='form-input' placeholder='First Name' />
            </Form.Item>
          </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="last_name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input className='form-input' placeholder='Last Name' />
            </Form.Item>
          </Col>
          <Col className='title-cus' span={12}>  <Title level={5}>Gender</Title></Col>
          <Col className='title-cus' span={12}>  <Title level={5}>Date of Birth</Title></Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="gender"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group>
                <Radio value="male">Male</Radio>
                <Radio value="female">Female</Radio>
                <Radio value="others">Others</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Form.Item
            name="dob"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker style={{ width: '500%' }} placeholder="00-00-0000" />
          </Form.Item>
          <Col className='title-cus' span={12}>  <Title level={5}>Email</Title></Col>
          <Col className='title-cus' span={12}>  <Title level={5}>Phone No</Title></Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true, type: 'email'
                },
              ]}
            >
              <Input className='form-input' placeholder='Enter email' />
            </Form.Item>
          </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="phone"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Input style={{ width: '101%' }} placeholder="XXXXXXXXXX" />
            </Form.Item>
          </Col>

          <Col className='title-cus' span={24}>  <Title level={5}>Add products</Title></Col>
          <Col className='custom-width' span={24} >
            <Form.List name="products">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space align="baseline" key={"space-" + field.key}>
                      <Form.Item
                        {...field}
                        key={"category-" + field.key}
                        label="Product Category"
                        name={[field.name, 'productCategory']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing product category',
                          },
                        ]}
                      >
                        <Select style={{ width: 100 }} key={"select-" + field.key} onChange={(e) => selectedCategory(e)}>
                          {/* <Option value="">Select...</Option> */}
                          {productCategory?.length > 0 && productCategory.map((data, index) => (
                            <Option key={index} value={data._id}>{data.product_category_name}</Option>
                          ))}
                        </Select>
                      </Form.Item>


                      <Form.Item
                        {...field}
                        ey={"name-" + field.key}
                        label="Product Name"
                        name={[field.name, 'productName']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing Product Name',
                          },
                        ]}
                      >
                        <Select style={{ width: 100 }} key={"prod name-" + field.key} onChange={(e) => selectedProduct(e)} >
                          {productNameFromCategory?.length > 0 && productNameFromCategory.map((data, index) => (
                            <Option key={index} value={data._id}>{data.product_name}</Option>
                          ))}
                        </Select>
                      </Form.Item>


                      <Form.Item
                        {...field}
                        key={"size-" + field.key}
                        label="Size"
                        name={[field.name, 'size']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing size',
                          },
                        ]}
                      >
                        <Select style={{ width: 100 }} id={"size-select-" + field.key} key={"size select-" + field.key} onChange={(e) => {
                          let price = productDetailsFromProduct.find((data) => data._id === e).price

                          const fields = form.getFieldsValue()
                          const { products } = fields
                          Object.assign(products[field.key], { actualPrice: price })
                          Object.assign(products[field.key], { price: price })
                          Object.assign(products[field.key], { quantity: 1 })
                          form.setFieldsValue({ products })
                        }}>
                          {productDetailsFromProduct?.length > 0 && productDetailsFromProduct.map((data, index) => (
                            <Option key={index} value={data._id}>{data.size}</Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...field}

                        key={"quantity-" + field.key}
                        label="Quantity"
                        name={[field.name, 'quantity']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing Quantity',
                          },
                        ]}
                      >
                        <Input style={{ width: 100 }} onChange={(e) => {
                          console.log(form.getFieldValue('products')[field.key])
                          console.log(parseFloat(form.getFieldValue('products')[field.key].actualPrice), e.target.value)
                          const fields = form.getFieldsValue()
                          const { products } = fields
                          Object.assign(products[field.key], { price: parseFloat(form.getFieldValue('products')[field.key].actualPrice) * parseInt(e.target.value) })
                          form.setFieldsValue({ products })
                        }} />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        key={"price-" + field.key}
                        label="Price"
                        name={[field.name, 'price']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing Price',
                          },
                        ]}
                      >
                        <Input style={{ width: 100 }} disabled />
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}

                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
          <Col className='title-cus' span={24}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Col>
        </Row>
      </Form>


    </Card>
  )

}

export default Userform

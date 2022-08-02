import { Typography, Button, Col, Form, Input, Row, InputNumber, Card, Select, Upload, Radio, Space, message, DatePicker } from 'antd'
import React, { useEffect, useState } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/antd.css';
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

function Userform() {
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const [productCategory, setProductCategory] = useState('')
  const [productNameFromCategory, setProductNameFromCategory] = useState('')
  const [productDetailsFromProduct, setProductDetailsFromProduct] = useState('')
  const [otherMode, setOtherMode] = useState('')
  const [totalPayment, setTotalPayment] = useState('')
  const [formCustomized, setFormCustomized] = useState('')

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

  console.log("Total------", totalPayment)
  console.log("Form Check---", formCustomized)

  const removeFormFields = (idx) => {
    let list = [...formCustomized]
    list.splice(idx, 1)
    setFormCustomized(list)

  }
  useEffect(() => {
    getProductCategory()
    document.getElementById("add_button").click();
  }, []);
  const getProductCategory = () => {
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
  const selectedCategory = (value, key) => {
    if(value == "10 ml perfume")
    {}
    console.log(key)
    Meteor.call("product.list", { product_category: value }, (error, result) => {
      console.log(error);
      if (!error) {
        console.log("success");
        console.log(result)
        setProductNameFromCategory(result)

        //Set Form Values
        const fields = form.getFieldsValue()
        const { products } = fields
        Object.assign(products[key], { productName: '' })
        Object.assign(products[key], { actualPrice: 0 })
        Object.assign(products[key], { price: 0 })
        Object.assign(products[key], { size: '' })
        Object.assign(products[key], { quantity: '' })


        form.setFieldsValue({ products })
        setFormCustomized(products)
      }
      else {
        console.log(error)
      }
    });
  }
  const selectedProduct = (value, key) => {
    Meteor.call("productattr.list", { product: value }, (error, result) => {
      console.log(error);
      if (!error) {
        console.log("success");
        console.log(result)
        setProductDetailsFromProduct(result)

        //Set Form Values
        const fields = form.getFieldsValue()
        const { products } = fields
        Object.assign(products[key], { actualPrice: 0 })
        Object.assign(products[key], { price: 0 })
        Object.assign(products[key], { size: '' })
        Object.assign(products[key], { quantity: '' })

        form.setFieldsValue({ products })
        setFormCustomized(products)

      }
      else {
        console.log(error)
      }
    });
  }

  const onFinish = (values) => {
    console.log(values)
    const lo_orderdata = { ...values }
    lo_orderdata.dob = moment(values.dob).toDate()
    Meteor.call("orderdata.insert", lo_orderdata, (error, result) => {
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

  return (
    <Card level={2} title="Customer Form">
      <Form
        form={form}
        {...layout}
        onFinish={onFinish} >
        <Row className='module-heading'>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Name Required!' }]}
            >
              <Input className='form-input' placeholder='Name' />
            </Form.Item>
          </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="dob"
              label="Date of Birth"
            >
              <DatePicker placeholder="00-00-0000" />
            </Form.Item>
          </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Address Line 1 Required!' }]}
            >
              <Input className='form-input' placeholder='Address Line 1' />
            </Form.Item>
          </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="landmark"
              label="Landmark"
            >
              <Input className='form-input' placeholder='Landmark' />
            </Form.Item>
          </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="postal_code"
              label="Postal/Zip Code"
              rules={[{ required: true, type: "number", min: 100000, max: 999999, message: '6 digits Postal/Zip Code Required!' }]}
            >
              <InputNumber style={{ width: '101%' }} placeholder='Postal/Zip Code' />
            </Form.Item>
          </Col>
          <Col className='title-cus' span={12}> </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, type: "number", min: 1000000000, max: 9999999999, message: '10 digits Phone No Required!' }]}
            >
              <InputNumber style={{ width: '101%' }} placeholder="XXXXXXXXXX" />
            </Form.Item>
          </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="order_type"
              label="Order Type"
              rules={[{ required: true, message: 'Order Type Required!' }]}
            >
              <Radio.Group>
                <Radio value="prepaid">Prepaid</Radio>
                <Radio value="cod">COD</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col className='title-cus' span={24}>  <Title level={5}>Products</Title></Col>
          <Col className='custom-width' span={24} >
            <Form.List name="products" label="Products">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Space align="baseline" key={"space-" + field.key}>
                      {console.log(index)}
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
                        <Select key={"select-" + field.key} onChange={(e) => selectedCategory(e, index)}>
                          {productCategory?.length > 0 && productCategory.map((data, index) => (
                            <Option key={index} value={data._id}>{data.product_category_name}</Option>
                          ))}
                          <Option key={"10mlperfume"} value={"10 ml perfume"}>10 ml Perfume</Option>
                        </Select>
                      </Form.Item>

                      {console.log(form?.getFieldValue('products'))}

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
                        <Select
                          disabled={form.getFieldValue('products')[index]?.productCategory ? false : true} key={"prod name-" + field.key} onChange={(e) => selectedProduct(e, index)} >
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
                        <Select
                          disabled={form.getFieldValue('products')[index]?.productName ? false : true} id={"size-select-" + field.key} key={"size select-" + index}
                          onChange={(e) => {
                            let price = productDetailsFromProduct.find((data) => data._id === e).price

                            const fields = form.getFieldsValue()
                            const { products } = fields
                            Object.assign(products[index], { actualPrice: price })
                            Object.assign(products[index], { price: price })
                            Object.assign(products[index], { quantity: 1 })
                            form.setFieldsValue({ products })
                            setFormCustomized(products)
                          }}>
                          {productDetailsFromProduct?.length > 0 && productDetailsFromProduct.map((data, index) => (
                            <Option key={index} value={data._id}>{data.size}</Option>
                          ))}
                          {/* <Option key={0} value={10}>10 ml</Option> */}
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
                        <InputNumber
                          disabled={form.getFieldValue('products')[index]?.size ? false : true} min="1" onChange={(e) => {
                            const fields = form.getFieldsValue()
                            const { products } = fields
                            Object.assign(products[index], { price: parseFloat(form.getFieldValue('products')[index].actualPrice) * parseInt(e) })
                            form.setFieldsValue({ products })
                            setFormCustomized(products)
                          }} />
                      </Form.Item>
                      {/* <Form.Item
                        {...field}
                        key={"note-" + field.key}
                        label="Product Detals"
                        name={[field.name, 'note']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing Details',
                          },
                        ]}
                      >
                        <Input className='form-input' placeholder='Product Details' />
                      </Form.Item> */}
                        {form.getFieldValue('products').length>1 && <MinusCircleOutlined onClick={() => { removeFormFields(index); remove(field.name) }} />}
                    </Space>
                  ))}

                  <Form.Item>
                    <Button id="add_button" type="dashed" onClick={() => add({ productCategory: '', productName: '', size: '', quantity: '', price: 0 }, { focus: true })} icon={<PlusOutlined />} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
              
          <Col className='custom-width' span={12}>
            <Form.Item
                name="total_payment_amount"
                label="Total Payment Amount"
                rules={[{ required: true, message: 'Payment Amount Required!' }]}
              >
                <Input className='form-input' placeholder='Total Payment Amount' />
            </Form.Item>
          </Col>

          <Col className='custom-width' span={24}>
            <Form.Item
                name="payment_mode"
                label="Payment Mode"
                rules={[{ required: true, message: 'Payment Mode Required!' }]}
              >
                <Radio.Group>
                  <Radio value="gpay">Google Pay</Radio>
                  <Radio value="phonepe">Phone Pe</Radio>
                  <Radio value="paytm">Paytm</Radio>
                  <Radio value="bank_transfer">Bank Transfer</Radio>
                  <Radio value="cash">Cash</Radio>
                  <Radio value="cod">COD (Only For COD Order)</Radio>
                  <Radio value={otherMode}>Other<Input readOnly className='form-input' onChange={(e)=>{setOtherMode(e)}}/></Radio>
                </Radio.Group>
            </Form.Item>
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

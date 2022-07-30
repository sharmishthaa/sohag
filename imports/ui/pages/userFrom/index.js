import { Typography, Button, Col, Form, Input, Row, InputNumber, Card, Select, DatePicker, Radio, Space, message } from 'antd'
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
  const [otherMode, setOtherMode] = useState('')
  const [totalPayment, setTotalPayment] = useState('')
  // const [tax, setTax] = useState(0)

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
  useEffect(() => {
    console.log("Under UseEff---", form?.getFieldValue('products'))
    if (form?.getFieldValue('products')?.length > 0) {
      let total = 0
      form?.getFieldValue('products')?.map((data, index) => {
        console.log("Inside--------", data)
        if (data.price) {
          total = total + data.price
        }
      })
      total = (total * 0.05).toFixed(2)
      setTotalPayment(total)
    }


  }, [form?.getFieldValue('products')]);
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

        //Set Form Values
        // const fields = form.getFieldsValue()
        // const { products } = fields

        // console.log(fields, products)
        // products = [{productCategory: '', productName: ''}]
        // Object.assign(products[0], { productCategory: '' })
        // Object.assign(products[0], { productName: '' })
        // Object.assign(products[0], { actualPrice: 0 })
        // Object.assign(products[0], { price: 0 })
        // Object.assign(products[0], { size: '' })
        // Object.assign(products[0], { quantity: '' })


        form.setFieldsValue({ products })
      }
      else {
        console.log(error)
      }
    });
  }
  const selectedCategory = (value, key) => {
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

      }
      else {
        console.log(error)
      }
    });
  }

  const onFinish = (values) => {
    // console.log(values)
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

  // const addCustomized = (e, f) => {
  //   console.log(e, f)
  // }
  // console.log("Form is---", form, form?.getFieldValue('products'))
  return (
    <Card level={2} title="Customer Form">
      {/* <button type="button" onClick={exportToCsv}>
        Export to CSV
      </button> */}
      <Form
        form={form}
        {...layout}
        onFinish={onFinish}>
        <Row className='module-heading'>
          <Col className='title-cus' span={24}>  <Title level={5}>Full Name</Title></Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="first_name"
              rules={[{ required: true, message: 'First Name Required!' }]}
            >
              <Input className='form-input' placeholder='First Name' />
            </Form.Item>
          </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="last_name"
              rules={[{ required: true, message: 'Last Name Required!' }]}
            >
              <Input className='form-input' placeholder='Last Name' />
            </Form.Item>
          </Col>
          {/* <Col className='title-cus' span={12}>  <Title level={5}>Gender</Title></Col>
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
          </Form.Item> */}
          <Col className='title-cus' span={24}>  <Title level={5}>Address</Title></Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="address_line_1"
              rules={[{ required: true, message: 'Address Line 1 Required!' }]}
            >
              <Input className='form-input' placeholder='Address Line 1' />
            </Form.Item>
          </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="address_line_2"
            >
              <Input className='form-input' placeholder='Address Line 2' />
            </Form.Item>
          </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="city"
              rules={[{ required: true, message: 'City Required!' }]}
            >
              <Input className='form-input' placeholder='City' />
            </Form.Item>
          </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="state"
              rules={[{ required: true, message: 'State Required!' }]}
            >
              <Input className='form-input' placeholder='State' />
            </Form.Item>
          </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="postal_code"
              rules={[{ required: true, type: "number", min:100000, max:999999, message: '6 digits Postal/Zip Code Required!' }]}
            >
              <InputNumber style={{ width: '101%' }} placeholder='Postal/Zip Code' />
            </Form.Item>
          </Col>
          <Col className='title-cus' span={12}> </Col>
          <Col className='title-cus' span={12}>  <Title level={5}>Phone No</Title></Col>
          <Col className='title-cus' span={12}>  <Title level={5}>Order Type</Title></Col>
          <Col className='custom-width' span={12}>
            <Form.Item
              name="phone"
              rules={[{ required: true, type: "number", min:1000000000, max:9999999999, message: '10 digits Phone No Required!' }]}
            >
              <InputNumber style={{ width: '101%' }} placeholder="XXXXXXXXXX" />
            </Form.Item>
          </Col>
          <Col className='custom-width' span={12}>
            <Form.Item
                name="order_type"
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
                        <Select style={{ width: 100 }} key={"select-" + field.key} onChange={(e) => selectedCategory(e, field.key)}>
                          {/* <Option value="">Select...</Option> */}
                          {productCategory?.length > 0 && productCategory.map((data, index) => (
                            <Option key={index} value={data._id}>{data.product_category_name}</Option>
                          ))}
                        </Select>
                      </Form.Item>

                      {console.log(form?.getFieldValue('products'))}
                      <Form.Item
                        {...field}
                        ey={"name-" + field.key}
                        label="Product Name"

                        // disabled={form?.getFieldValue('products')[field.key] && !form?.getFieldValue('products')[field.key].productCategory  ? false : true}
                        name={[field.name, 'productName']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing Product Name',
                          },
                        ]}
                      >
                        <Select
                          disabled={form.getFieldValue('products')[field.key].productCategory ? false : true}
                          style={{ width: 100 }} key={"prod name-" + field.key} onChange={(e) => selectedProduct(e, field.key)} >
                          {productNameFromCategory?.length > 0 && productNameFromCategory.map((data, index) => (
                            <Option key={index} value={data._id}>{data.product_name}</Option>
                          ))}
                        </Select>
                      </Form.Item>


                      <Form.Item
                        {...field}
                        key={"size-" + field.key}
                        // disabled={form.getFieldValue('products')[field.key]?.productName ? false : true}
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
                          disabled={form.getFieldValue('products')[field.key].productName ? false : true}
                          style={{ width: 100 }} id={"size-select-" + field.key} key={"size select-" + field.key}
                          onChange={(e) => {
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
                        <InputNumber
                          disabled={form.getFieldValue('products')[field.key].size ? false : true}
                          style={{ width: 100 }} min="1" onChange={(e) => {
                            // console.log(form.getFieldValue('products')[field.key])
                            // console.log(parseFloat(form.getFieldValue('products')[field.key].actualPrice), e)
                            const fields = form.getFieldsValue()
                            const { products } = fields
                            Object.assign(products[field.key], { price: parseFloat(form.getFieldValue('products')[field.key].actualPrice) * parseInt(e) })
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
                    <Button type="dashed" onClick={() => add({ productCategory: '', productName: '', size: '', quantity: '', price: 0 }, { focus: true })} icon={<PlusOutlined />} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
          {totalPayment && totalPayment !== '0' &&
            <>
              <Col className='title-cus' span={12}>  <Title level={5}>Amount: {totalPayment}</Title></Col>
              <Col className='custom-width' span={12}>
                <Form.Item
                  name="totalPayment"
                  rules={[
                    {
                      required: false, type: 'totalPayment'
                    },
                  ]}
                >
                  <Input readOnly className='form-input' name="totalPayment" value={totalPayment} />
                </Form.Item>
              </Col>
            </>
          }
          <Col className='title-cus' span={24}>  <Title level={5}>Payment Mode</Title></Col>
          <Col className='custom-width' span={12}>
            <Form.Item
                name="payment_mode"
                rules={[{ required: true, message: 'Payment Mode Required!' }]}
              >
                <Radio.Group>
                  <Radio value="gpay">Google Pay</Radio>
                  <Radio value="phonepe">Phone Pe</Radio>
                  <Radio value="paytm">Paytm</Radio>
                  <Radio value="bank_transfer">Bank Transfer</Radio>
                  <Radio value="cash">Cash</Radio>
                  <Radio value="cod">COD (Only For COD Order)</Radio>
                  <Radio value={otherMode}>Other<Input readOnly className='form-input' name="totalPayment" onChange={(e)=>{setOtherMode(e)}}/></Radio>
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

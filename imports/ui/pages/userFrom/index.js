import { Typography, Button, Col, Form, Input, Row, InputNumber, Card, Select, Upload, Radio, Space, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";
import 'antd/dist/antd.css';
import moment from "moment";
import { UploadOutlined } from '@ant-design/icons';

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
  const [massData, setMassData] = useState('')

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
  const getTotalAmount = () => {
    if (formCustomized?.length > 0) {
      return formCustomized?.reduce((accumulator, object) => {
        return accumulator + parseInt(object.price);
      }, 0)
    }
  }
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


        // form.setFieldsValue({ products })
      }
      else {
        console.log(error)
      }
    });
  }
  const selectedCategory = (value, key) => {
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


  const uploadExcelForProduct = async (e) => {
    if (e.target.files.length === 0) return;

    if (e.target.files) {
      console.log(e.target.files)

      let fileParts = e.target.files[0].name.split('.')
      let fileSize = e.target.files[0].size;
      let fileName = fileParts[0];
      let fileType = fileParts[1];
      // productcat.test

      let f = e.target.files[0];
      let name = f.name;
      const reader = new FileReader();
      reader.onload = (evt) => {

        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        console.log("Data>>>" + data);// shows that excel data is read
        let lines = data.split("\n");
        let result = [];
        let headers = lines[0].split(",");
        for (let i = 1; i < lines.length; i++) {
          let obj = {};
          let currentline = lines[i].split(",");
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
          }
          result.push(obj);
        }

        console.log(JSON.stringify(result))
        let JSONFulldataFromExcel = JSON.parse(JSON.stringify(result))
        console.log(JSONFulldataFromExcel.length)
        let roleNames
        let roles
        let massUploadData = []

        JSONFulldataFromExcel && JSONFulldataFromExcel.length > 0 && JSONFulldataFromExcel.map((data, index) => {
          if (data['Product Category Name']) {

            let collectedData = {
              'productCategoryName': data['Product Category Name'] ? data['Product Category Name'] : '',
              'status': data['Status'] ? data['Status'] : '',
            }
            massUploadData.push(collectedData)
            console.log(massUploadData)

            setMassData(massUploadData)
            // setFile(e.target.files[0])
          } else {
          }

        })
      };
      reader.readAsBinaryString(f);
    }
  }
  const upLoadExcelDataForProductDetails = () => {
    Meteor.call("productcat.test",massData, (error, result) => {
      console.log(error);
      if (!error) {
        console.log("success");
        console.log(result)
        alert("upload Successfully")
      }
      else {
        console.log(error)
      }
    });
  }
  console.log("mass-------", massData)
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
        onFinish={onFinish} >
        <Row className='module-heading'>
          <input id="file-upload" accept=".xlsx,.xls,.csv" type="file" name="file-upload" onChange={(e) => uploadExcelForProduct(e, '')} />
          {/* <Upload >
            <Button onClick={(e)=> uploadExcelForProduct(e)} icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload> */}
          <Button type="primary" onClick={upLoadExcelDataForProductDetails}>Submit</Button>
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
              rules={[{ required: true, type: "number", min: 100000, max: 999999, message: '6 digits Postal/Zip Code Required!' }]}
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
              rules={[{ required: true, type: "number", min: 1000000000, max: 9999999999, message: '10 digits Phone No Required!' }]}
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
                        <Select style={{ width: 100 }} key={"select-" + field.key} onChange={(e) => selectedCategory(e, index)}>
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
                          disabled={form.getFieldValue('products')[index]?.productCategory ? false : true}
                          style={{ width: 100 }} key={"prod name-" + field.key} onChange={(e) => selectedProduct(e, index)} >
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
                          disabled={form.getFieldValue('products')[index]?.productName ? false : true}
                          style={{ width: 100 }} id={"size-select-" + field.key} key={"size select-" + index}
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
                          disabled={form.getFieldValue('products')[index]?.size ? false : true}
                          style={{ width: 100 }} min="1" onChange={(e) => {
                            // console.log(form.getFieldValue('products')[field.key])
                            // console.log(parseFloat(form.getFieldValue('products')[field.key].actualPrice), e)
                            const fields = form.getFieldsValue()
                            const { products } = fields
                            Object.assign(products[index], { price: parseFloat(form.getFieldValue('products')[index].actualPrice) * parseInt(e) })
                            form.setFieldsValue({ products })
                            setFormCustomized(products)
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

                      <MinusCircleOutlined onClick={() => { removeFormFields(index); remove(field.name) }} />
                    </Space>
                  ))}

                  <Form.Item>
                    <Button id="add_button" type="dashed" onClick={() => add({ productCategory: '', productName: '', size: '', quantity: '', price: 0 }, { focus: true })} icon={<PlusOutlined />} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
          {/* {getTotalAmount() && getTotalAmount() > 0 && */}
            <>
              <Col className='title-cus' span={12}>  <Title level={5}>Amount: {getTotalAmount()}</Title></Col>
              <Col className='custom-width' span={12}>
                <Form.Item
                  name="total_payment"
                  rules={[
                    {
                      required: false, type: 'total_payment'
                    },
                  ]}
                >
                  <Input readOnly className='form-input' value={getTotalAmount()} />
                </Form.Item>
              </Col>
            </>
          {/* } */}
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

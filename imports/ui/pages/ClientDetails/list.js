import React, { useEffect, useState } from 'react'
import { Meteor } from 'meteor/meteor';
import 'antd/dist/antd.css';
import moment from "moment";
// import './style.less';
import { Col, Button, Form, Input, Row, Table, DatePicker, Typography } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

function ClientdataList() {

  const [form] = Form.useForm();
  const [sortedInfo, setSortedInfo] = useState({});
  const [carTypesList, setCarTypeList] = useState([])
  const [totalRecord, setTotalRecord] = useState();
  const [loadindStatus, setLoadingStatus] = useState(false);
  const [isPagination, setIsPagination] = useState(false);
  const [defaultPage, setDefaultPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchText, setSearchText] = useState();

  let navigate = useNavigate();

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: 'Order No',
      dataIndex: 'order_no',
      key: 'order_no',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      render: (text, record) => <Typography.Text>{moment(text).format("DD/MM/YYYY")}</Typography.Text>
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Landmark',
      dataIndex: 'landmark',
      key: 'landmark',
    },
    {
      title: 'Zip / Postal Code',
      dataIndex: 'postal_code',
      key: 'postal_code',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Order Date Time',
      dataIndex: 'order_date_time',
      key: 'order_date_time',
      render: (text, record) => <Typography.Text>{moment(text).format("DD/MM/YYYY")}</Typography.Text>
    },
    // {
    //   key: 'action',
    //   render: (text, record) => <>{record.status != 'archive' && <><a onClick={() => handelView(record._id)}><DeleteOutlined /></a> <a onClick={() => handelEdit(record._id)}><EditOutlined /></a></>}</>,
    // },
  ];

  // const handelEdit = (key) => {
  //   navigate(`/auth/gs/editform/${key}`)
  // }

  // const handelView = (key) => {
  //   navigate(`/auth/gs/view/${key}`)
  // }

  const getListData = () => {
    setLoadingStatus(true);
    Meteor.call("orderdata.list", defaultPage, sortedInfo, searchText, (err, res) => {
      setCarTypeList(res);
      console.log(res);
      setLoadingStatus(false);
    });
  }

  const onFinish = (values) => {
    const lo_orderdata = { ...values }
    lo_orderdata.from_date = values.from_date?moment(values.from_date).format('YYYY-MM-DD'):null
    lo_orderdata.to_date = values.to_date?moment(values.to_date).toDate('YYYY-MM-DD'):null
    // let headers = ["Id,Name,Surname,Age"];

    // let orderCsv = usersData.users.reduce((acc, user) => {
    //   const { id, name, surname, age } = user;
    //   acc.push([id, name, surname, age].join(","));
    //   return acc;
    // }, []);

    Meteor.call("orderdata.details", lo_orderdata, (error, result) => {
      console.log(error);
      const d = new Date();
      filenmae = 'order_details_' + d.getHours() + '_' + d.getMinutes() + '_' + d.getMonth() + '_' + d.getDate() + '.csv'
      if (!error) {
        console.log("success");
        console.log(result)
        // setProductCategory(result)
        //let headers = ["First Name, Last Name, Phone, Address Line 1, Address Line 2, City, State, Postal Code, Order Type, Total Payment, Payment Mode, Order Date Time, Order No, Product Description "];
        let headers = ["Name,Dob,Address,Postal Code,Phone No,Order No,Order Type,Products,Total Payment Amount,Payment Mode,Order Date"]
        let list = []
        // ['name,pro','name2,data']

        // result.map((order, index) => {
        //   let { _id, name, dob, address, phone, postal_code, order_type, payment_mode, order_date_time,total_payment_amount, order_no, product_cat, product_name, size, quantity} = order;
        //   let product_details = product_cat + '/' + product_name + '/' + size + '/' + quantity
        //   console.log(index, "----In Map----", product_details, name)
        //   let date_of_birth = dob?moment(dob).format('DD/MM/YYYY'):''
        //   //list.push([first_name, last_name, phone, address_line_1, address_line_2, city, state, postal_code, order_type, totalPayment, payment_mode, moment(order_date_time).format('DD-MM-YYYY HH:mm:ss'), order_no, product_cat, product_name, size, quantity, price].join(","));
        //   if (index === 0) {
        //     list.push([name, date_of_birth, address, postal_code, phone, order_no, order_type, order_no, product_details, total_payment_amount, payment_mode, moment(order_date_time).format('YYYY-MM-DD')].join(","))
        //   } else if (_id === result[index - 1]._id) {
        //     console.log("List else", list[list.length - 1])
        //     let value = [list[list.length - 1], product_details].join("--")
        //     console.log(value)
        //     list[list.length - 1] = value
        //   } else {
        //     list.push([name, date_of_birth, address, postal_code, phone, order_no, order_type, order_no, product_details, total_payment_amount, payment_mode, moment(order_date_time).format('YYYY-MM-DD')].join(","))
        //   }
        //   console.log("List---Map-", list)
        //   //return acc;

        // });
        let temp_obj, total_products=''
        result.map((order, index) => {
          let { _id, name, customsizesize, dob, address, landmark, phone, postal_code, order_type, payment_mode, order_date_time,total_payment_amount, order_no, product_cat, product_name, size, quantity} = order;
          console.log('_id',_id)
          let product_size = size?size:customsizesize
          let product_details = product_cat + '/' + product_name + '/' + product_size + '/' + quantity
          let date_of_birth = dob?moment(dob).format('DD/MM/YYYY'):''
          let fulladdress = landmark?address+' '+landmark:address
          if(index === 0)
          {
            if(result.length-1 === index)
            {
              list.push([name, date_of_birth, fulladdress, postal_code, phone, order_no, order_type, product_details, total_payment_amount, payment_mode, moment(order_date_time).format('YYYY-MM-DD')].join(","))
            }
            else
            {
              temp_obj = order
              temp_obj.date_of_birth = dob?moment(dob).format('DD/MM/YYYY'):''
              temp_obj.fulladdress = landmark?address+' '+landmark:address
              total_products=product_details
              console.log('temp_obj._id', temp_obj._id)
              console.log("total_products index 0", total_products)
            }
          }
          else if(temp_obj._id === _id)
          {
            console.log('yes',result.length-1,'------',index)
            console.log('name',name)
            if(result.length-1 === index)
            {
              total_products=total_products+'--'+product_details
              list.push([name, date_of_birth, fulladdress, postal_code, phone, order_no, order_type, total_products, total_payment_amount, payment_mode, moment(order_date_time).format('YYYY-MM-DD')].join(","))
            }
            else
            {
              console.log("test last element no else if")
              total_products=total_products+'--'+product_details
              console.log("total_products index !0", total_products)
            }
          }
          else
          {
            console.log('no',result.length-1,'------',index)
            console.log('name',name)
            if(result.length-1 === index)
            {
              list.push([temp_obj.name, temp_obj.date_of_birth, temp_obj.fulladdress, temp_obj.postal_code, temp_obj.phone, temp_obj.order_no, temp_obj.order_type, total_products, temp_obj.total_payment_amount, temp_obj.payment_mode, moment(temp_obj.order_date_time).format('YYYY-MM-DD')].join(","))
              list.push([name, date_of_birth, fulladdress, postal_code, phone, order_no, order_type, product_details, total_payment_amount, payment_mode, moment(order_date_time).format('YYYY-MM-DD')].join(","))
              console.log("test last element else")
            }
            else
            {
              console.log("test last element no else")
              list.push([temp_obj.name, temp_obj.date_of_birth, temp_obj.fulladdress, temp_obj.postal_code, temp_obj.phone, temp_obj.order_no, temp_obj.order_type, total_products, temp_obj.total_payment_amount, temp_obj.payment_mode, moment(temp_obj.order_date_time).format('YYYY-MM-DD')].join(","))
              temp_obj=order
              temp_obj.date_of_birth = dob?moment(dob).format('DD/MM/YYYY'):''
              temp_obj.fulladdress = landmark?address+' '+landmark:address
              total_products=product_details
            }
          }
          
        });

        // result.map((order, index) => {
        //   let { _id, name, customsizesize, dob, address, phone, postal_code, order_type, payment_mode, order_date_time,total_payment_amount, order_no, product_cat, product_name, size, quantity} = order;
        //   console.log('_id',_id)
        //   let product_size = size?size:customsizesize
        //   let product_details = product_cat + '/' + product_name + '/' + product_size + '/' + quantity
        //   if(index === 0)
        //   {
        //     if(result.length-1 === index)
        //     {
        //       list.push([name, product_details, total_payment_amount].join(","))
        //     }
        //     else
        //     {
        //       temp_obj = order
        //       total_products=product_details
        //       console.log('temp_obj._id', temp_obj._id)
        //       console.log("total_products index 0", total_products)
        //     }
        //   }
        //   else if(temp_obj._id === _id)
        //   {
        //     console.log('yes',result.length-1,'------',index)
        //     console.log('name',name)
        //     if(result.length-1 === index)
        //     {
        //       total_products=total_products+'--'+product_details
        //       list.push([name, total_products, total_payment_amount].join(","))
        //     }
        //     else
        //     {
        //       console.log("test last element no else if")
        //       total_products=total_products+'--'+product_details
        //       console.log("total_products index !0", total_products)
        //     }
        //   }
        //   else
        //   {
        //     console.log('no',result.length-1,'------',index)
        //     console.log('name',name)
        //     if(result.length-1 === index)
        //     {
        //       list.push([temp_obj.name, total_products, temp_obj.total_payment_amount].join(","))
        //       list.push([name, product_details, total_payment_amount].join(","))
        //       console.log("test last element else")
        //     }
        //     else
        //     {
        //       console.log("test last element no else")
        //       list.push([temp_obj.name, total_products, temp_obj.total_payment_amount].join(","))
        //       temp_obj=order
        //       total_products=product_details
        //     }
        //   }
          
        // });
        console.log("List---Map-", list)
        downloadFile({
          data: [...headers, ...list].join("\n"),
          fileName: filenmae,
          fileType: "text/csv",
        });

      }
      else {
        console.log(error)
      }
    });
  };

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

  //   const getTotalRecord = () => {
  //     Meteor.call("cartypes.count", searchText, (err, res) => {
  //       console.log(res)
  //       setTotalRecord(res);
  //       if(res > pageSize)
  //       {
  //         setIsPagination(true)
  //       }
  //       else
  //       {
  //         setIsPagination(false)
  //       }
  //     });
  //   }

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  // const onFinish = (values) => {
  //   console.log("values", values)
  // }

  useEffect(() => {
    // getTotalRecord()
    getListData()
  }, [defaultPage, sortedInfo, searchText])

  return (
    <>
      <div className='module-content-with-pagination'>
        <Form
          form={form}
          onFinish={onFinish}>
          <Row className='module-heading'>
            <Col className='custom-width' span={8}>
              <Form.Item
                name="from_date"
                label="From"
              >
                <DatePicker placeholder="00-00-0000" />
              </Form.Item>
            </Col>

            <Col className='custom-width' span={8}>
              <Form.Item
                name="to_date"
                label="To"
              >
                <DatePicker placeholder="00-00-0000" />
              </Form.Item>
            </Col>

            <Col className='title-cus' span={8}>
              <Button type="button" htmlType="submit">Export to CSV</Button>
            </Col>
          </Row>
        </Form>
        {/* <Search placeholder="input search text" onSearch={handleSearch} enterButton className='search-div'/> */}
        <Table className='listing_table'
          pagination={isPagination && {
            defaultCurrent: defaultPage,
            pageSize: pageSize,
            total: totalRecord,

            onChange: (defaultPage, pageSize) => {
              setDefaultPage(defaultPage); setPageSize(pageSize)
            }
          }}
          columns={columns} dataSource={carTypesList} rowKey="_id" loading={loadindStatus} onChange={handleChange} />
      </div>
    </>

  )
}

export default ClientdataList






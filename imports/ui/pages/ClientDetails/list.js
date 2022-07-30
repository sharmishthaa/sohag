import React, { useEffect, useState } from 'react'
import { Meteor } from 'meteor/meteor';
import 'antd/dist/antd.css';
import moment from "moment";
// import './style.less';
import { Col, Button, Form, Input, Row, Table, DatePicker } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {useNavigate } from 'react-router-dom';

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

  const handleSearch = (value) =>{
    setSearchText(value);
  };

  const columns = [
    {
      title: 'Order No',
      dataIndex: 'order_no',
      key: 'order_no',
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
        title: 'Last Name',
        dataIndex: 'last_name',
        key: 'last_name',
    },
    {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
    },
    {
        title: 'Zip/Postal Code',
        dataIndex: 'postal_code',
        key: 'postal_code',
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
      key: 'action',
      render: (text, record) => <>{record.status!='archive' && <><a onClick={()=>handelView(record._id)}><DeleteOutlined /></a> <a onClick={()=>handelEdit(record._id)}><EditOutlined /></a></>}</>,
    },
  ];

  const handelEdit = (key) => {
    navigate(`/cartype/editform/${key}`)
  }

  const handelView = (key) => {
    navigate(`/cartype/view/${key}`)
  }

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
    lo_orderdata.from_date = moment(values.from_date).toDate()
    lo_orderdata.to_date = moment(values.to_date).toDate()
    // let headers = ["Id,Name,Surname,Age"];

    // let orderCsv = usersData.users.reduce((acc, user) => {
    //   const { id, name, surname, age } = user;
    //   acc.push([id, name, surname, age].join(","));
    //   return acc;
    // }, []);

    Meteor.call("orderdata.details", lo_orderdata, (error, result) => {
      console.log(error);
      const d = new Date();
      filenmae = 'order_details_'+d.getHours()+'_'+d.getMinutes()+'_'+d.getMonth()+'_'+d.getDate()+'.csv'
      if (!error) {
        console.log("success");
        console.log(result)
        // setProductCategory(result)
        let headers = ["First Name, Last Name, Phone, Address Line 1, Address Line 2, City, State, Postal Code, Order Type, Total Payment, Payment Mode, Order Date Time, Order No, Product Category, Product Name, Size, Quantity, Price "];

        let orderCsv = result.reduce((acc, order) => {
          const { first_name, last_name, phone, address_line_1, address_line_2, city, state, postal_code, order_type, totalPayment, payment_mode, order_date_time, order_no, product_cat, product_name, size, quantity, price } = order;
          acc.push([first_name, last_name, phone, address_line_1, address_line_2, city, state, postal_code, order_type, totalPayment, payment_mode, moment(order_date_time).format('DD-MM-YYYY HH:mm:ss'), order_no, product_cat, product_name, size, quantity, price].join(","));
          return acc;
        }, []);

        downloadFile({
          data: [...headers, ...orderCsv].join("\n"),
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
          
          onChange:(defaultPage, pageSize)=>{
              setDefaultPage(defaultPage);setPageSize(pageSize)
            }
        }} 
      columns={columns} dataSource={carTypesList} rowKey="_id" loading={loadindStatus} onChange={handleChange}/>
    </div>
    </>
    
  )
}

export default ClientdataList






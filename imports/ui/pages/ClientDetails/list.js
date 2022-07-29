import React, { useEffect, useState } from 'react'
import { Meteor } from 'meteor/meteor';
import 'antd/dist/antd.css';
// import './style.less';
import { Input, Table, Image} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {useNavigate } from 'react-router-dom';

const { Search } = Input;

function ClientdataList() {
  
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
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
    //   sorter: (a, b) => a.car_name.length - b.car_name.length,
    //   sortOrder: sortedInfo.columnKey === 'first_name' ? sortedInfo.order : null,
    },
    {
        title: 'Last Name',
        dataIndex: 'last_name',
        key: 'last_name',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'DOB',
        dataIndex: 'dob',
        key: 'dob',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
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
    Meteor.call("clientdata.list", defaultPage, sortedInfo, searchText, (err, res) => {
      setCarTypeList(res);
      console.log(res);
      setLoadingStatus(false);
    });
  }

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

  useEffect(() => {
    // getTotalRecord()
    getListData()
   }, [defaultPage, sortedInfo, searchText])

  return (
    <>
    <div className='module-content-with-pagination'>
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






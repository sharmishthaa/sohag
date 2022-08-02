import React, { useEffect, useState } from 'react'
import { Meteor } from 'meteor/meteor';
import 'antd/dist/antd.css';
import './style.less';
import { Input, Table, Image, Row, Col, Button } from 'antd';
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { application } from '../../../api/config/application';

const { Search } = Input;
const BaseUrl = application.s3MediaBaseUrl;
function GSList() {
  const [sortedInfo, setSortedInfo] = useState({});
  const columns = [
    {
      title: 'Display Name',
      dataIndex: 'display_name',
      key: 'display_name',
      sorter: (a, b) => a.display_name.length - b.display_name.length,
      sortOrder: sortedInfo.columnKey === 'display_name' ? sortedInfo.order : null,
    },
    {
      title: 'Field Value',
      dataIndex: 'field_value',
      key: 'field_value',
      render: (text, record) => record.input_type == 'file' ? <Image width={200} src={`${BaseUrl}${record.field_value}`} /> : <>{record.field_value}</>,
      sorter: (a, b) => a.field_value.length - b.field_value.length,
      sortOrder: sortedInfo.columnKey === 'field_value' ? sortedInfo.order : null,
    },
    {
      key: 'action',
      render: (text, record) => <a onClick={() => handelEdit(record._id)}><EditOutlined /></a>,
    },
  ];

  const [gsList, setGsList] = useState([])
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

  const handelEdit = (key) => {
    navigate(`/auth/gs/editform/${key}`)
  }

  const handelView = (key) => {
    navigate(`/auth/gs/view/${key}`)
  }

  const getListData = () => {

    setLoadingStatus(true);
    Meteor.call("gs.list", defaultPage, sortedInfo, searchText, (err, res) => {
      setGsList(res);
      setLoadingStatus(false);
    });

  }

  const getTotalRecord = () => {
    Meteor.call("gs.count", searchText, (err, res) => {
      setTotalRecord(res);
      if (res > pageSize) {
        setIsPagination(true)
      }
      else {
        setIsPagination(false)
      }
    });
  }

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  useEffect(() => {
    getTotalRecord()
    getListData()
  }, [defaultPage, sortedInfo, searchText])

  const openForm = () => {
    navigate(`/auth/gs/form`)
  }

  return (
    <div>
      <div>
        <Row>
          <Col span={2}><Button className='crud-action' onClick={() => openForm()}>Create</Button></Col>
        </Row>
      </div>
      <div className='module-content-with-pagination'>
        <Search placeholder="input search text" onSearch={handleSearch} enterButton className='search-div' />
        <Table className='table-class'
          pagination={isPagination && {
            defaultCurrent: defaultPage,
            pageSize: pageSize,
            total: totalRecord,
            onChange: (defaultPage, pageSize) => {
              setDefaultPage(defaultPage); setPageSize(pageSize)
            }
          }}
          columns={columns} dataSource={gsList} rowKey="_id" loading={loadindStatus} onChange={handleChange} />
        {/* {isPagination && <Pagination onChange={(page)=>changeDataOfList(page)} defaultCurrent={defaultCurrent} total={totalRecord} pageSize={pageSize}/>} */}
      </div>
    </div>
  )
}

export default GSList

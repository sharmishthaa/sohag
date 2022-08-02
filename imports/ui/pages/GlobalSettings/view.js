import { Table } from 'antd';
import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react'
import { useParams} from 'react-router-dom';

function GSView() {
  const [gsDetails, setGsDetails] = useState([])
  const [loadindStatus, setLoadingStatus] = useState(false);
  let {gsid} =useParams();
  const columns = [
    {
      title: 'Display Name',
      dataIndex: 'display_name',
      key: 'display_name'
    },
    {
        title: 'Field Value',
        dataIndex: 'field_value',
        key: 'field_value'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    },
  ];

  const getGSDetails = () => {
    setLoadingStatus(true)
    Meteor.call("gs.profile", gsid, (err, res) => {
        console.log(res)
        setGsDetails(res)
        setLoadingStatus(false)
    });
   }

   useEffect(() => {
    getGSDetails()
   }, [])

  return (
    <>
      <div className='module-heading'>
          <Table className='table-class' pagination={false} columns={columns} dataSource={gsDetails} rowKey="_id" loading={loadindStatus}/>
      </div>
    </>
  )
}

export default GSView

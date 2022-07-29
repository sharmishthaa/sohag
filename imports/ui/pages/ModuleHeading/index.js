import { Col, Row } from 'antd'
import { Typography } from 'antd';
import React from 'react'

function ModuleHeading({module}) {
  const { Title } = Typography;
  return (
    <Row className='module-heading'>
        <Col span={24}><Title level={2}>{module}</Title></Col>
    </Row>
  )
}

export default ModuleHeading

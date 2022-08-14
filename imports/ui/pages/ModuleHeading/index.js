import { Col, Row } from 'antd'
import { Typography } from 'antd';
import React from 'react'

function ModuleHeading({module}) {
  const { Title } = Typography;
  return (
    <div className="dashbaord-body-heading">
      <Title>{module}</Title>
    </div>
  )
}

export default ModuleHeading

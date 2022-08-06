import { Typography, Button, Col, Form, Input, Row, Upload, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import './style.less'
import { Meteor } from 'meteor/meteor';
import { useNavigate, useParams } from 'react-router-dom';
import {
  UploadOutlined,
  PlusOutlined,
  LoadingOutlined
} from "@ant-design/icons";

const { Title } = Typography;
function GSForm() {
  const [inputType, setInputType] = useState('')
  const [optionValues, setOptionValues] = useState([])
  const [form] = Form.useForm();
  const [fileBase64, setFileBase64] = useState('');
  const [imageUrl, setImageUrl] = useState();
  const [updatePageLoad, setUpdatePageLoad] = useState(true)
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

  let navigate = useNavigate();
  let { gsid } = useParams();

  // const beforeUpload = (file) => {
  //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

  //   if (!isJpgOrPng) {
  //     message.error('You can only upload JPG/PNG file!');
  //   }

  //   const isLt2M = file.size / 1024 / 1024 < 2;

  //   if (!isLt2M) {
  //     message.error('Image must smaller than 2MB!');
  //   }

  //   return isJpgOrPng && isLt2M;
  // };

  const handleChange = (info) => {
  };

  const UploadFile = (event) => {
    console.log(event)
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      console.log('RESULT', reader.result)
      setFileBase64(reader.result)
    }
    console.log(file)
    reader.readAsDataURL(file)
  }

  const validateMessages = {
    required: '${label} is required!',
  };

  const onFinish = (values) => {
    let lo_gsdata = { ...values }
    console.log("Update data--", lo_gsdata, fileBase64)
    if (gsid) {
      lo_gsdata.field_value = fileBase64 ?  fileBase64 : lo_gsdata.field_value 
      Meteor.call("gs.edit", gsid, lo_gsdata, (error, result) => {
        console.log(error);
        if (!error) {
          setFileBase64('')
          console.log("success");
          console.log(navigate('/auth/gs/list'))
        }
        else {
          alert(error.error)
        }
      });
    }
    else {
      Meteor.call("gs.insert", lo_gsdata, (error, result) => {
        console.log(error);
        if (!error) {
          console.log("success");
          console.log(navigate('/auth/gs/list'))
        }
        else {
          alert(error.error)
        }
      });
    }
  }

  useEffect(() => {
    if (gsid && updatePageLoad) {
      getGSDetails()
      setUpdatePageLoad(false)
    }
  }, [])

  const getGSDetails = () => {
    Meteor.call("gs.editeddata", gsid, (err, res) => {
      setInputType(res.input_type)
      if (res.input_type == 'radio') {
        setOptionValues(res.option_value)
      }
      if (res.input_type == 'file') {
        setImageUrl(res)
      }
      console.log(res)
      form.setFieldsValue(res);
    });
  }

  return (
    <Form
      form={form}
      {...layout}
      validateMessages={validateMessages}
      onFinish={onFinish}>
      <Row className='module-heading'>
        <Col span={24}>  <Title level={2}>{gsid ? 'Update' : 'Create'} Form</Title></Col>
        {!gsid &&
          <Col span={12}>
            <Form.Item
              name="field_name"
              label="Field Name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input className='form-input' />
            </Form.Item>
          </Col>
        }

        <Col span={12}>
          <Form.Item
            name="display_name"
            label="Display Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input className='form-input' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="field_value"
            label="Field Value"
            rules={[
              {
                required: true,
              },
            ]}
          >
            {gsid && inputType == 'radio' ?
              <Select>
                {
                  optionValues.map(options => {
                    return (
                      <Select.Option key={options} value={options}>{options}</Select.Option>
                    )
                  })
                }
              </Select>
              : gsid && inputType == 'file' ?
                <>
                  {fileBase64 &&
                    <img
                      src={fileBase64}
                      alt="avatar"
                      style={{
                        width: '25px',
                        height: '25px'
                      }}
                    />
                  }
                  <input type='file'
                    // name="avatar"
                    // listType="picture-card"
                    // className="avatar-uploader"
                    // showUploadList={false}
                    // beforeUpload={beforeUpload}
                    onChange={(info) => UploadFile(info)}
                  >
                  </input>

                </>
                : <Input className='form-input' />}
          </Form.Item>
        </Col>

        {/* {fileBase64 ? (
                    <img
                    src={fileBase64}
                    alt="avatar"
                    style={{
                        width: '100%',
                    }}
                    />
                ) : <PlusOutlined />} */}
        {!gsid &&
          <>
            <Col span={12}>
              <Form.Item
                name="input_type"
                label="Input Type"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input className='form-input' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="option_value"
                label="Option Value"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input className='form-input' />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select>
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </>}
        <Col span={12}>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
            <Button type="primary" htmlType="submit">{gsid ? 'Update' : 'Create'}</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default GSForm

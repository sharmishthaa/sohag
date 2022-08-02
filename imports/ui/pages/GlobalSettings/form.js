import { Typography, Button, Col, Form, Input, Row, Upload, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import './style.less'
import { Meteor } from 'meteor/meteor';
import { useNavigate, useParams } from 'react-router-dom';
import { application } from '../../../api/config/application';
import {
  UploadOutlined,
  PlusOutlined,
  LoadingOutlined
} from "@ant-design/icons";

const { Title } = Typography;
const BaseUrl = application.s3MediaBaseUrl;
function GSForm() {
  const [inputType, setInputType] = useState('')
  const [optionValues, setOptionValues] = useState('')
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState();
  const [file, setFile] = useState();
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

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }

    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    setFile(info.file.originFileObj)
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const validateMessages = {
    required: '${label} is required!',
  };

  const onFinish = (values) => {
    const lo_gsdata = { ...values }
    if (gsid) {
      Meteor.call("gs.edit", gsid, lo_gsdata, (error, result) => {
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
    if (file) {
      getBase64(file, (imageUrl) => {
        setImageUrl(imageUrl);
        let data = {
          name: file.name,
          size: file.size,
          type: file.type,
          src: imageUrl,
        };
        Meteor.call('gs.uploadToTempFolder', data, (err, res) => {
          form.setFieldsValue({
            field_value: `tattu/global-settings/temp/${res}`,
          });
          console.log(res)
        });
      });
    }
  }, [file])

  const getGSDetails = () => {
    Meteor.call("gs.editeddata", gsid, (err, res) => {
      setInputType(res.input_type)
      if (res.input_type == 'radio') {
        setOptionValues(res.option_value)
      }
      if (res.input_type == 'file') {
        setImageUrl(BaseUrl + res)
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
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info)}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        width: '100%',
                      }}
                    />
                  ) : <PlusOutlined />}
                </Upload>
                : <Input className='form-input' />}
          </Form.Item>
        </Col>
        
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

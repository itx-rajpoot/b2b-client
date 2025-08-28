import { useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, Col, Row, Upload, message, Switch, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';

const normFile = (e) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const AddReward = ({ edit, item }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    if (edit) {
      message.success('Reward saved successfully');
    } else {
      message.success('Reward created successfully');
    }
    setVisible(false);
  };
  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  return (
    <div>
      {edit ? (
        <Button
          size="small"
          type="primary"
          ghost
          onClick={() => {
            setVisible(true);
          }}
          icon={<EditOutlined />}
        />
      ) : (
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
          icon={<PlusOutlined />}
        >
          Create reward
        </Button>
      )}
      <Modal
        visible={visible}
        title={edit ? 'Edit item' : 'Add new reward'}
        okText={edit ? 'Save' : 'Add'}
        cancelText="Cancel"
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
        width="80vw"
        style={{ maxWidth: 800 }}
      >
        <p>* Updates will be made live to B2C DineGo App immediately</p>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: item?.name,
            description: item?.description,
            lp: item?.lp,
            venue: item?.venue,
            limit: item?.limit,
            stipulations: item?.stipulations,
            expiration: item?.expiration,
            available: item?.available,
            img: item ? [{ uid: 0, name: 'image.png', url: item.img }] : undefined,
          }}
        >
          <Row gutter={24}>
            <Col md={12} xs={24}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: 'Please input the name of the item!',
                  },
                ]}
              >
                <Input placeholder="Cheeseburger" />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="lp"
                label="LP"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the DineGo Points of the reward!',
                  },
                ]}
              >
                <InputNumber placeholder={125} />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="venue"
                label="Venue name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the venue name!',
                  },
                ]}
              >
                <Input placeholder="Buckhead Saloon" />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="limit"
                label="Inventory limits (item quantity)"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the item quantity!',
                  },
                ]}
              >
                <InputNumber placeholder={245} />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="stipulations"
                label="Stipulations"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the stipulation of the reward!',
                  },
                ]}
              >
                <Input placeholder="One reward per purchase" />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="expiration"
                label="Expiration date"
                rules={[
                  {
                    required: true,
                    message: 'Please select the expiration date!',
                  },
                ]}
              >
                <DatePicker placeholder="Select date" format="MM/DD/YYYY" />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item label="Image" shouldUpdate={(prev, cur) => prev.img !== cur.img}>
                {() => {
                  const images = form.getFieldValue('img');
                  const image = images && images.length > 0 ? images[0].url : undefined;
                  console.log(image);
                  return (
                    <Form.Item name="img" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                      <Upload.Dragger name="files" action="/upload.do">
                        {image ? (
                          <img src={image} alt="" style={{ width: '100%', height: '100%' }} />
                        ) : (
                          <div style={{ padding: 12 }}>
                            <p className="ant-upload-drag-icon">
                              <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">Upload image</p>
                            <p className="ant-upload-hint">Recommended 800x600 up to 5MB</p>
                          </div>
                        )}
                      </Upload.Dragger>
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the description of the item!',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Fusce at risus a nulla feugiat venetatus non eu klibero,. Ut tincuasdudf aode sit amet condimentum" />
              </Form.Item>
              <Form.Item
                name="available"
                label="Available"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the availability of the reward!',
                  },
                ]}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddReward;

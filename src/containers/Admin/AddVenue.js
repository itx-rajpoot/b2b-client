import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Form, Input, Select, Row, Col, Switch, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PK_cities_asArray, PK_states_asArray } from '../../utils/PAK_states_cities';import { apiCall } from '../../services/api';

const { Option } = Select;

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export default function AddVenue() {
  const currentUser = useSelector((state) => state.currentUser);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    form.resetFields();
    setVisible(true);
  };

  const handleOk = () => {
    form.validateFields()
    .then((values) => {
        console.log('values', values)
        setLoading(true);
        // Crear venue con endpoint
        apiCall('POST', `/api/admin/${currentUser.id}/venues`, {
          address: values.address,
          address_2: values.address_2,
          category: values.category,
          city: values.city,
          email: values.email,
          hidden: values.hidden,
          name: values.name,
          phone: values.phone,
          short_name: values.short_name,
          state: values.state,
          website: values.website,
          zip_code: values.zip_code,
          release: values.release,
        })
          .then(() => {
            message.destroy();
            message.success("Venue created successfully!");
            setLoading(false);
            setVisible(false);
          })
          .catch((err) => {
            message.destroy();
            message.error(err.message, 6);
            console.log(err);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    if (loading) return;
    setVisible(false);
  };
  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
        Add venue
      </Button>
      <Modal 
        title="Add a new venue" 
        visible={visible} 
        okText="Add"
        onOk={handleOk} 
        onCancel={handleCancel}
        width={800}
        destroyOnClose
      >
        <Form 
          {...layout} 
          className="venue-info-form" 
          form={form} 
          validateMessages={validateMessages} 
          size="large"
          initialValues={{
            hidden: true
          }}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label="Venue Name" rules={[{ required: true }]}>
                <Input placeholder="DineGo" disabled={loading === 'info'} />
              </Form.Item>
              <Form.Item name="short_name" label="Short name (optional)">
                <Input placeholder="DineGo" disabled={loading === 'info'} />
              </Form.Item>
              <Form.Item name="website" label="Website">
                <Input placeholder="www.DineGo.com" disabled={loading === 'info'} />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ type: 'email' }, { required: true }]}>
                <Input placeholder="hi@DineGo.com" disabled={loading === 'info'} />
              </Form.Item>
              <Form.Item name="phone" label="Phone number">
                <Input placeholder="1818 256 257" disabled={loading === 'info'} />
              </Form.Item>
              <Form.Item name="category" label="Type of venue">
                <Select mode="multiple" placeholder="Select venue type" disabled={loading === 'info'}>
                  <Option value="Bar">Bar</Option>
                  <Option value="Breweries">Breweries</Option>
                  <Option value="Gamebar">Gamebar</Option>
                  <Option value="Hybrid">Hybrid</Option>
                  <Option value="Lounge">Lounge</Option>
                  <Option value="Music hall">Music hall</Option>
                  <Option value="Nightclub">Nightclub</Option>
                  <Option value="Sports bar">Sports bar</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="address" label="Street 1" rules={[{ required: true }]}>
                <Input placeholder="Glenwood Park" disabled={loading === 'info'} />
              </Form.Item>
              <Form.Item name="address_2" label="Street 2 (optional)">
                <Input placeholder="apt 245" disabled={loading === 'info'} />
              </Form.Item>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Select placeholder="Select city" disabled={loading === 'info'} options={PK_cities_asArray} optionFilterProp="label" showSearch />
              </Form.Item>
              <Form.Item name="state" label="State" rules={[{ required: true }]}>
                <Select placeholder="Select state" disabled={loading === 'info'} options={PK_states_asArray} optionFilterProp="label" showSearch />
              </Form.Item>
              <Form.Item name="zip_code" label="Zip code" rules={[{ required: true }]}>
                <Input placeholder="91000" disabled={loading === 'info'} />
              </Form.Item>
            </Col>
            <Col xs={24} style={{ marginTop: 12, borderTop: "1px dashed #434343", borderBottom: "1px dashed #434343", paddingTop: 12, paddingBottom: 12, marginBottom: 12, textAlign: "center" }}>
              Admin specific options
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="release" label="Release" rules={[{ required: true }]}>
                <Select placeholder="Select a release" disabled={loading === 'info'}>
                  <Option disabled value="first">First release</Option>
                  <Option disabled value="second">Second release</Option>
                  <Option value="third">Third release</Option>
                  <Option value="forth">Forth release</Option>
                  <Option value="fifth">Fifth release</Option>
                  <Option value="pending">Pending</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="hidden" label="Hide on B2C App" valuePropName="checked">
                <Switch disabled={loading} checkedChildren="Hidden" unCheckedChildren="Visible" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

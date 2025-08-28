import { useState } from 'react';
import { Button, Modal, Form, AutoComplete, Radio, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const options = [

  { value: 'Indoor seating', label: 'Indoor seating' },
  { value: 'Outdoor seating', label: 'Outdoor seating' },
  { value: 'Family seating area', label: 'Family seating area' },
  { value: 'Kids play area', label: 'Kids play area' },
  { value: 'Prayer room / Masjid nearby', label: 'Prayer room / Masjid nearby' },
  { value: 'Halal food', label: 'Halal food' },
  { value: 'Vegetarian options', label: 'Vegetarian options' },
  { value: 'Vegan options', label: 'Vegan options' },
  { value: 'Wheelchair accessible', label: 'Wheelchair accessible' },
  { value: 'Free Wi-Fi', label: 'Free Wi-Fi' },
  { value: 'Air conditioning', label: 'Air conditioning' },
  { value: 'Live cultural music', label: 'Live cultural music' },
  { value: 'Traditional decor', label: 'Traditional decor' },
  { value: 'Sports screenings', label: 'Sports screenings' },
  { value: 'Library / Reading corner', label: 'Library / Reading corner' },
  { value: 'Board games', label: 'Board games' },
  { value: 'Table tennis', label: 'Table tennis' },
  { value: 'Carrom board', label: 'Carrom board' },
  { value: 'Chess', label: 'Chess' },
  { value: 'Foosball', label: 'Foosball' },
  { value: 'Billiards / Pool table', label: 'Billiards / Pool table' },
  { value: 'Arcade games', label: 'Arcade games' },
  { value: 'Outdoor garden', label: 'Outdoor garden' },
  { value: 'Rooftop seating', label: 'Rooftop seating' },
  { value: 'Scenic view', label: 'Scenic view' },
  { value: 'Live shows (family-friendly)', label: 'Live shows (family-friendly)' },
  { value: 'Cultural events', label: 'Cultural events' },
  { value: 'Photography spot', label: 'Photography spot' },
  { value: 'Gift shop', label: 'Gift shop' },
  { value: 'Bookstore corner', label: 'Bookstore corner' },
  { value: 'Kids menu', label: 'Kids menu' },
  { value: 'Healthy food options', label: 'Healthy food options' },
  { value: 'Juice & mocktail bar', label: 'Juice & mocktail bar' },
  { value: 'Dessert corner', label: 'Dessert corner' },
  { value: 'Tea & coffee bar', label: 'Tea & coffee bar' },
  { value: 'Quiet zone', label: 'Quiet zone' },
  { value: 'Study / Work friendly', label: 'Study / Work friendly' },
  { value: 'Paid Parking', label: 'Paid Parking' },
  { value: 'Free Parking', label: 'Free Parking' },
];


const AddAmenity = ({ addAmenityOrMusic }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onCreate = async (values) => {
    console.log('Received values of form: ', values);
    setLoading(true);
    await addAmenityOrMusic(values.name, values.active, 'amenities');
    message.destroy();
    message.success('Amenity successfully added!');
    setVisible(false);
    setLoading(false);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
        icon={<PlusOutlined />}
      >
        Add amenity
      </Button>
      <Modal
        visible={visible}
        title="Add new amenity"
        okText="Add"
        cancelText="Cancel"
        onCancel={() => (loading ? {} : setVisible(false))}
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
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            active: true,
          }}
        >
          <Form.Item
            name="name"
            label="Title"
            rules={[
              {
                required: true,
                message: 'Please input the name of the amenity!',
              },
            ]}
          >
            <AutoComplete
              disabled={loading}
              options={options}
              style={{ width: 200 }}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </Form.Item>
          <Form.Item name="active">
            <Radio.Group disabled={loading}>
              <Radio value={false}>Inactive</Radio>
              <Radio value={true}>Active</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddAmenity;

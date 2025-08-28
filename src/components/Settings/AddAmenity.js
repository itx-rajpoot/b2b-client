import { useState } from 'react';
import { Button, Modal, Form, AutoComplete, Radio, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const options = [
  { value: 'Pool table', label: 'Pool table' },
  { value: 'Beer Pong', label: 'Beer Pong' },
  { value: 'Indoor seating', label: 'Indoor seating' },
  { value: '21+', label: '21+' },
  { value: 'Patio', label: 'Patio' },
  { value: 'DJs', label: 'DJs' },
  { value: 'Bull Riding', label: 'Bull Riding' },
  { value: 'Corn Hole', label: 'Corn Hole' },
  { value: 'Outdoor seating', label: 'Outdoor seating' },
  { value: 'Happy hour', label: 'Happy hour' },
  { value: 'Dancing', label: 'Dancing' },
  { value: 'Live music', label: 'Live music' },
  { value: 'TVs', label: 'TVs' },
  { value: 'Brunch', label: 'Brunch' },
  { value: 'Karaoke', label: 'Karaoke' },
  { value: 'Darts', label: 'Darts' },
  { value: 'Flip Cup', label: 'Flip Cup' },
  { value: 'Other games', label: 'Other games' },
  { value: 'Poker', label: 'Poker' },
  { value: 'Hookah', label: 'Hookah' },
  { value: 'Dog friendly ', label: 'Dog friendly ' },
  { value: 'Ping pong', label: 'Ping pong' },
  { value: 'Gay bar ', label: 'Gay bar ' },
  { value: 'Lesbian bar', label: 'Lesbian bar' },
  { value: 'LGBTQIA+ friendly ', label: 'LGBTQIA+ friendly ' },
  { value: 'Drag shows', label: 'Drag shows' },
  { value: 'Comedy shows', label: 'Comedy shows' },
  { value: 'VIP', label: 'VIP' },
  { value: 'Casual attire', label: 'Casual attire' },
  { value: 'Juke box', label: 'Juke box' },
  { value: 'Trivia', label: 'Trivia' },
  { value: 'Live Jazz music', label: 'Live Jazz music' },
  { value: 'Speakeasy', label: 'Speakeasy' },
  { value: 'Videogames', label: 'Videogames' },
  { value: 'Jenga', label: 'Jenga' },
  { value: 'Shuffle Board', label: 'Shuffle Board' },
  { value: 'Bocce Ball', label: 'Bocce Ball' },
  { value: 'Dress Code', label: 'Dress Code' },
  { value: 'Restaurant bar', label: 'Restaurant bar' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Prohibition-Era Setting', label: 'Prohibition-Era Setting' },
  { value: 'Ice Rink', label: 'Ice Rink' },
  { value: 'Live Concerts', label: 'Live Concerts' },
  { value: 'Air Hockey', label: 'Air Hockey' },
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

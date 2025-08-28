import { useState } from 'react';
import { Button, Modal, Form, Input, Radio, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AddMusic = ({ addAmenityOrMusic }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onCreate = async (values) => {
    console.log('Received values of form: ', values);
    setLoading(true);
    await addAmenityOrMusic(values.name, values.active, "music");
    message.destroy();
    message.success("Music type successfully added!");
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
        Add music type
      </Button>
      <Modal
        visible={visible}
        title="Add new music type"
        okText="Add"
        cancelText="Cancel"
        onCancel={() => loading ? {} : setVisible(false)}
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
                message: 'Please input the name of the music!',
              },
            ]}
          >
            <Input disabled={loading} />
          </Form.Item>
          <Form.Item name="active">
            <Radio.Group disabled={loading} >
              <Radio value={false}>Inactive</Radio>
              <Radio value={true}>Active</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddMusic;

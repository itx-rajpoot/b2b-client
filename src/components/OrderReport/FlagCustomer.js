import { useState } from 'react';
import { Button, Modal, Form, Select, message } from 'antd';
import { FlagOutlined } from '@ant-design/icons';

const FlagCustomer = () => {
  const [visible, setVisible] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [form] = Form.useForm();
  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setVisible(false);
    setIsFlagged(true);
    message.success("Customer was flagged");
  };

  return (
    <div>
      <Button
        type="danger"
        ghost={!isFlagged}
        onClick={() => {
          setVisible(true);
        }}
        icon={<FlagOutlined />}
        style={{ minWidth: 110 }}
      >
        {isFlagged ? "Flagged" : "Flag"}
      </Button>
      <Modal
        visible={visible}
        title="Flag customer"
        okText="Flag"
        cancelText="Cancel"
        okType="danger"
        onCancel={() => setVisible(false)}
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
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="reason"
            label="Reason"
            rules={[
              {
                required: true,
                message: 'Please select the reason',
              },
            ]}
          >
            <Select placeholder="Select the reason">
              <Select.Option value="incorrect_data">Incorrect data</Select.Option>
              <Select.Option value="inappropriate_comment">Inappropriate comment</Select.Option>
              <Select.Option value="violence">Violence</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FlagCustomer;

import { useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import { Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

const AddSubcategory = ({ edit, subcategory, menu, categoryName, subcategories }) => {
  const history = useHistory();
  const firestore = useFirestore();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onCreate = () => {
    form
    .validateFields()
    .then(async (values) => {
      if(!menu){
        message.destroy();
        return message.error("An error happened. Please contact support");
      }
      console.log('Received values of form: ', values);
      if (subcategories.filter(x => subcategory ? x !== subcategory : true).findIndex(x => x === values.name) > -1) {
        message.destroy();
        return message.error("A subcategory with that name is already created");
      }
      setLoading(true);
      if (edit) {
        const newCategories = JSON.parse(JSON.stringify(menu.categories));
        const index = newCategories.findIndex(x => x.name === categoryName);
        if(index === -1) {
          message.destroy();
          return message.error("An error happened. Please contact support");
        }
        const sIndex = newCategories[index].subcategories.findIndex(x => x === subcategory);
        if(sIndex === -1) {
          message.destroy();
          return message.error("An error happened. Please contact support");
        }
        newCategories[index].subcategories[sIndex] = values.name;
        await firestore.update({ collection: 'menus', doc: menu.menuId }, { categories: newCategories });
        // Pending handle items subcategory change
        message.destroy();
        message.success("Subcategory saved successfully");
      } else {
        const newCategories = JSON.parse(JSON.stringify(menu.categories));
        const index = newCategories.findIndex(x => x.name === categoryName);
        if(index === -1) {
          setLoading(false);
          message.destroy();
          return message.error("An error happened. Please contact support");
        }
        console.log(index, newCategories[index]);
        newCategories[index].subcategories.push(values.name);
        await firestore.update({ collection: 'menus', doc: menu.menuId }, { categories: newCategories });
        message.destroy();
        message.success("Subcategory added successfully");
      }
      setVisible(false);
      setLoading(false);
      history.push('/menu', {
        category: categoryName,
        subcategory: values.name
      });
    })
    .catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    if(loading) return;
    setVisible(false);
    form.resetFields();
  }

  return (
    <div align="center">
      {edit ? (
        <Button
          icon={<EditOutlined />}
          type="primary"
          ghost
          size="small"
          onClick={() => setVisible(true)}
        />
      ) : subcategories.length === 10 ? (
        <Button
          disabled
          type="text"
        >
          Subcategories max limit reached
        </Button>
      ) : (
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          icon={<PlusOutlined />}
        >
          Add subcategory
        </Button>
      )}
      <Modal
        visible={visible}
        title={`Add new subcategory for ${categoryName}`}
        okText="Add"
        cancelText="Cancel"
        onCancel={handleCancel}
        confirmLoading={loading}
        onOk={onCreate}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: subcategory }}
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input the name of the subcategory!',
              },
            ]}
          >
            <Input placeholder="Beverages" disabled={loading} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddSubcategory;

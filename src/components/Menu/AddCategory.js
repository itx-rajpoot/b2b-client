import { useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import { useHistory } from 'react-router-dom';
import { Button, Modal, Form, AutoComplete, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

const AddCategory = ({ edit, category, menu, categories }) => {
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
      if (categories.filter(x => category ? x.name !== category.name : true).findIndex(x => x.name === values.name) > -1) {
        message.destroy();
        return message.error("A category with that name is already created");
      }
      setLoading(true);
      if (edit) {
        const newCategories = JSON.parse(JSON.stringify(menu.categories));
        const index = newCategories.findIndex(x => x.name === category.name);
        if(index === -1) {
          message.destroy();
          return message.error("An error happened. Please contact support");
        }
        console.log(index, newCategories[index]);
        newCategories[index].name = values.name;
        await firestore.update({ collection: 'menus', doc: menu.menuId }, { categories: newCategories });
        // Pending: handle items category change
        message.destroy();
        message.success("Category saved successfully");
      } else {
        const newCategories = [...menu.categories];
        newCategories.push({
          name: values.name,
          subcategories: []
        });
        await firestore.update({ collection: 'menus', doc: menu.menuId }, { categories: newCategories });
        message.destroy();
        message.success("Category added successfully");
      }
      setVisible(false);
      setLoading(false);
      history.push('/menu', {
        category: values.name
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
      ) : (
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          icon={<PlusOutlined />}
        >
          Add category
        </Button>
      )}
      <Modal
        visible={visible}
        title={edit ? "Edit category" : "Add new category"}
        okText={edit ? "Save" : "Add"}
        cancelText="Cancel"
        onCancel={handleCancel}
        confirmLoading={loading}
        onOk={onCreate}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={category}
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input the name of the category!',
              },
            ]}
          >
            <AutoComplete
              options={[
                { label: "Breakfast", value: "Breakfast" },
                { label: "Brunch", value: "Brunch" },
                { label: "Happy hour", value: "Happy hour" },
                { label: "Lunch", value: "Lunch" },
                { label: "Dinner", value: "Dinner" },
                { label: "Drink", value: "Drink" },
              ]}
              placeholder="Enter your category"
              disabled={loading}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddCategory;

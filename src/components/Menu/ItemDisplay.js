import { useState, useEffect } from 'react';
import { Button, Col, Row, Form, message, Input, InputNumber, Select, Upload, Switch, notification } from 'antd';
import { useFirestore, useFirebase } from 'react-redux-firebase';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { beforeUpload, dummyRequest } from '../../utils/uploads';
import { addonsOptions, sidesOptions, sizesOptions } from '../../utils/itemOptions';
import './ItemDisplay.less';

const formItemCol = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export default function ItemDisplay({ menu, items, categories }) {
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [form] = Form.useForm();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const history = useHistory();
  const location = useLocation();
  const { item_id } = useParams();
  const item = items.find((x) => x.itemId === item_id);
  const venueId = menu?.venue;
  const venueImagesPath = `venueImages/${venueId}/items`;

  useEffect(() => {
    if(item) {
      setImg(item.img);
      form.setFieldsValue(item);
    }
    return () => {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item])

  const onFinish = async(values) => {
    try {
      
      console.log('Received values of form: ', values);
      setLoading(true);
      if (item_id) {
        let newImage = item.img;
        if (item.img && (!img || img.isNew)) {
          await firebase.deleteFile(`${venueImagesPath}/${item.img.name}`);
        }
        if (img && img.isNew) {
          const { uploadTaskSnaphot } = await firebase.uploadFile(venueImagesPath, img.originFileObj);
          console.log('Uploaded item image to Firebase Storage.', uploadTaskSnaphot);
          const url = await uploadTaskSnaphot.ref.getDownloadURL();
          console.log('Item image URL', url);
          newImage = {
            name: uploadTaskSnaphot.ref.name,
            url,
          };
        }
        const updatedItem = {
          venue: venueId,
          name: values.name,
          description: values.description,
          category: values.category,
          subcategory: values.subcategory,
          addons: values.addons || [],
          sides: values.sides || [],
          size: values.size || null,
          available: values.available || false,
          ageRestricted: values.ageRestricted || false,
          img: newImage,
          price: values.price,
        };
        console.log(updatedItem);
        await firestore.update({ collection: 'items', doc: item.itemId }, { ...updatedItem });
        message.destroy();
        message.success('Item saved successfully');
      } else {
        let newImage = null;
        if (img) {
          const { uploadTaskSnaphot } = await firebase.uploadFile(venueImagesPath, img.originFileObj);
          console.log('Uploaded item image to Firebase Storage.', uploadTaskSnaphot);
          const url = await uploadTaskSnaphot.ref.getDownloadURL();
          console.log('Item image URL', url);
          newImage = {
            name: uploadTaskSnaphot.ref.name,
            url,
          };
        }
        const newItem = {
          venue: venueId,
          name: values.name,
          description: values.description,
          category: values.category,
          subcategory: values.subcategory,
          addons: values.addons || [],
          sides: values.sides || [],
          size: values.size || null,
          available: values.available || false,
          ageRestricted: values.ageRestricted || false,
          img: newImage,
          price: values.price,
        };
        console.log(newItem);
        await firestore.collection('items').add(newItem);
  
        message.destroy();
        message.success('New item added successfully');
      }
      setLoading(false);
      history.push('/menu', {
        category: values.category,
        subcategory: values.subcategory[0]
      });
    } catch (error) {
      console.log(error);
      notification.error({ 
        title: "Oops! Something happened",
        description: process.env.NODE_ENV !== "production" ? error.message : "Please try again...",
      });
      setLoading(false);
    }
  };

  const handleImagesChange = async ({ file }) => {
    console.log(file);
    if (file.status === 'uploading') {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImg({
          name: file.name,
          isNew: true,
          originFileObj: file.originFileObj,
          url: e.target.result,
        });
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const handleImagesRemove = (file) => {
    console.log('removing', file);
    setImg(null);
    return true;
  };

  return (
    <div>
      <div>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => history.push('/menu')}>
          Back
        </Button>
      </div>
      <h1 align="center">{item_id ? 'Edit item' : 'Add new item'}</h1>
      <p align="center" style={{ color: "#00ABFF" }}>* Updates will be made live to B2C DineGo App immediately</p>
      <Form
        form={form}
        onFinish={onFinish}
        size="large"
        initialValues={{
          name: item?.name,
          description: item?.description,
          price: item?.price,
          category: item ? item.category : location.state ? location.state.defaultCategory : undefined,
          subcategory: item ? item.subcategory : location.state ? [location.state.defaultSubcategory] : undefined,
          addons: item?.addons,
          sides: item?.addons,
          size: item?.size,
          available: item ? item.available : true,
          ageRestricted: item ? item.ageRestricted : true,
        }}
      >
        <Row gutter={24} justify="center" align="stretch">
          <Col md={8} sm={12} xs={24}>
            <div className="item-form-card">
              <Form.Item
                {...formItemCol}
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: 'Please input the name of the item!',
                  },
                ]}
              >
                <Input disabled={loading} placeholder="Pizza" />
              </Form.Item>
              <Form.Item
                {...formItemCol}
                name="price"
                label="Price"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the price of the item!',
                  },
                ]}
              >
                <InputNumber disabled={loading} placeholder={125} formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value.replace(/\$\s?|(,*)/g, '')} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item {...formItemCol} name="size" label="Item size">
                <Select disabled={loading} placeholder="Chose item size" options={sizesOptions} allowClear />
              </Form.Item>
            </div>
          </Col>
          <Col md={8} sm={12} xs={24}>
            <div className="item-form-card">
              <Form.Item
                {...formItemCol}
                name="category"
                label="Category"
                rules={[
                  {
                    required: true,
                    message: 'Please select the category of the item!',
                  },
                ]}
              >
                <Select
                  disabled={loading}
                  placeholder="Chose category"
                  options={categories.map((x) => ({ label: x.name, value: x.name }))}
                  showSearch
                  onChange={() => form.setFieldsValue({'subcategory': undefined})}
                />
              </Form.Item>
              <Form.Item noStyle shouldUpdate={(prev, cur) => prev.category !== cur.category}>
                {() => {
                  const selectedCategory = form.getFieldValue('category');
                  const selectedCategoryIdx = selectedCategory ? categories.findIndex((x) => x.name === selectedCategory) : -1;
                  const subcategories = selectedCategoryIdx > -1 ? categories[selectedCategoryIdx].subcategories : [];
                  return (
                    <Form.Item
                      {...formItemCol}
                      name="subcategory"
                      label="Subcategory"
                      rules={[
                        {
                          type: 'array',
                          required: !!selectedCategory,
                          message: 'Please select the subcategory of the item!',
                        },
                      ]}
                      extra={selectedCategory ? '' : 'Select a category before selecting the subcategory'}
                    >
                      <Select
                        mode="multiple"
                        showSearch
                        placeholder="Chose subcategory"
                        disabled={!selectedCategory || loading}
                        options={subcategories.concat(subcategories.indexOf('Not listed') === -1 ? ['Not listed'] : []).map((x) => ({ label: x, value: x }))}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
              <Form.Item
                {...formItemCol}
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the description of the item!',
                  },
                ]}
              >
                <Input.TextArea
                  disabled={loading}
                  rows={4}
                  placeholder="Dish of Italian origin consisting of a flattened disk of bread dough topped with some combination of olive oil, oregano, tomato, mozzarella or many other ingredients, baked quickly."
                />
              </Form.Item>
            </div>
          </Col>
          <Col md={8} sm={12} xs={24}>
            <div className="item-form-card">
              <Form.Item {...formItemCol} name="sides" label="Sides">
                <Select disabled={loading} mode="tags" placeholder="Sides/Combos/Substitutions" options={sidesOptions} allowClear />
              </Form.Item>
              <Form.Item {...formItemCol} name="addons" label="Add-ons">
                <Select disabled={loading} mode="tags" placeholder="Chose add-ons" options={addonsOptions} allowClear />
              </Form.Item>
            </div>
            <div className="item-form-switch-wrapper">
              <Form.Item name="available" label="Available" valuePropName="checked" labelAlign="left">
                <Switch disabled={loading} style={{ marginLeft: 42 }} />
              </Form.Item>
              <Form.Item name="ageRestricted" label="Age restricted" valuePropName="checked" labelAlign="left">
                <Switch disabled={loading} style={{ marginLeft: 12 }} />
              </Form.Item>
            </div>
          </Col>
          <Col md={12} sm={16} xs={24}>
            <Form.Item {...formItemCol} label="Image">
              <Upload.Dragger
                fileList={img ? [img] : []}
                disabled={loading}
                onChange={handleImagesChange}
                onRemove={handleImagesRemove}
                customRequest={dummyRequest}
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                {img ? (
                  <img src={img.url} alt="" style={{ width: '100%', height: '100%' }} />
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
          </Col>
        </Row>
        <Form.Item style={{ paddingTop: 24, textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" size="large" loading={loading} style={{ padding: "6.5px 36px"}}>
            {item_id ? "Edit" : "Add"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

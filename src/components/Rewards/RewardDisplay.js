import { useState, useEffect } from 'react';
import { Button, Col, Row, Form, message, Input, InputNumber, Upload, Switch, notification, DatePicker } from 'antd';
import moment from 'moment';
import { useFirestore, useFirebase } from 'react-redux-firebase';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom';
import { beforeUpload, dummyRequest } from '../../utils/uploads';
import './RewardDisplay.less';

const formItemCol = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export default function RewardDisplay({ venueId, rewards }) {
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [form] = Form.useForm();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const history = useHistory();
  const { reward_id } = useParams();
  const reward = rewards.find((x) => x.rewardId === reward_id);
  const venueImagesPath = `venueImages/${venueId}/rewards`;

  useEffect(() => {
    if(reward) {
      setImg(reward.img);
      form.setFieldsValue({
        name: reward?.name || "",
        description: reward?.description || "",
        lp: reward?.lp || null,
        limit: reward?.limit || null,
        stipulations: reward?.stipulations || "",
        expiration: reward ? moment(reward.expiration) : null,
        available: reward?.available || false,
        ageRestricted: reward?.available || false,
      });
    }
    return () => {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reward])

  const onFinish = async(values) => {
    try {
      console.log('Received values of form: ', values);
      setLoading(true);
      if (reward_id) {
        let newImage = reward.img;
        if (reward.img && (!img || img.isNew)) {
          await firebase.deleteFile(`${venueImagesPath}/${reward.img.name}`);
        }
        if (img && img.isNew) {
          const { uploadTaskSnaphot } = await firebase.uploadFile(venueImagesPath, img.originFileObj);
          console.log('Uploaded reward image to Firebase Storage.', uploadTaskSnaphot);
          const url = await uploadTaskSnaphot.ref.getDownloadURL();
          console.log('Reward image URL', url);
          newImage = {
            name: uploadTaskSnaphot.ref.name,
            url,
          };
        }
        const updatedReward = {
          venue: venueId,
          name: values.name,
          description: values.description,
          lp: values.lp,
          limit: values.limit,
          stipulations: values.stipulations,
          expiration: moment(values.expiration).format(),
          available: values.available,
          ageRestricted: values.ageRestricted,
          img: newImage,
        };
        console.log(updatedReward);
        await firestore.update({ collection: 'rewards', doc: reward.rewardId }, { ...updatedReward });
        message.destroy();
        message.success('Reward saved successfully');
        history.push('/rewards');
      } else {
        let newImage = null;
        if (img) {
          const { uploadTaskSnaphot } = await firebase.uploadFile(venueImagesPath, img.originFileObj);
          console.log('Uploaded reward image to Firebase Storage.', uploadTaskSnaphot);
          const url = await uploadTaskSnaphot.ref.getDownloadURL();
          console.log('Reward image URL', url);
          newImage = {
            name: uploadTaskSnaphot.ref.name,
            url,
          };
        }
        const newReward = {
          venue: venueId,
          name: values.name,
          description: values.description,
          lp: values.lp,
          limit: values.limit,
          stipulations: values.stipulations,
          expiration: moment(values.expiration).format(),
          available: values.available,
          ageRestricted: values.ageRestricted,
          img: newImage,
        };
        console.log(newReward);
        await firestore.collection('rewards').add(newReward);
  
        message.destroy();
        message.success('New reward added successfully');
        history.push('/rewards');
      }
      form.resetFields();
      setLoading(false);
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
  console.log(moment().format())
  return (
    <div>
      <div>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => history.push('/rewards')}>
          Back
        </Button>
      </div>
      <h1 align="center">{reward_id ? 'Edit reward' : 'Add new rewards'}</h1>
      <p align="center" style={{ color: "#00ABFF", marginBottom: 48 }}>* Updates will be made live to B2C DineGo App immediately</p>
      <Form
        form={form}
        onFinish={onFinish}
        size="large"
        initialValues={{
          name: reward?.name || "",
          description: reward?.description || "",
          lp: reward?.lp || null,
          limit: reward?.limit || null,
          stipulations: reward?.stipulations || "",
          expiration: reward ? moment(reward.expiration) : null,
          available: reward?.available || false,
          ageRestricted: reward?.available || false,
        }}
      >
        <Row gutter={[24, 24]} justify="center" align="stretch">
          <Col md={8} sm={12} xs={24}>
            <div className="reward-form-card">
              <Form.Item
                {...formItemCol}
                name="name"
                label="Reward name"
                rules={[
                  {
                    required: true,
                    message: 'Please input the name of the reward!',
                  },
                ]}
              >
                <Input disabled={loading} placeholder="Cheeseburger" />
              </Form.Item>
              <Form.Item
                {...formItemCol}
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
              <Form.Item
                {...formItemCol}
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the description of the reward!',
                  },
                ]}
              >
                <Input.TextArea
                  disabled={loading}
                  rows={4}
                  placeholder="Enter the description of the reward here..."
                />
              </Form.Item>
            </div>
          </Col>
          <Col md={1} sm={12} xs={24}/>
          <Col md={8} sm={12} xs={24}>
            <div className="reward-form-card">
              <Form.Item
                {...formItemCol}
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
              <Form.Item
                {...formItemCol}
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
              <Form.Item
                {...formItemCol}
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
          <Col style={{ width: '100%', maxWidth: 500 }}>
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
            {reward_id ? "Edit" : "Add"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

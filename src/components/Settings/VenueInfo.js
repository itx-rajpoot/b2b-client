import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Upload,
  Divider,
  Button,
  message,
  Modal,
  Empty,
  Space,
  Tag,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useFirestore, useFirebase } from 'react-redux-firebase';
import { PK_cities_asArray, PK_states_asArray } from '../../utils/PAK_states_cities';
import { beforeUpload, dummyRequest } from '../../utils/uploads';
import ServiceHoursInput from './ServiceHoursInput';
import VenueLocation from './VenueLocation';
import ChangeVenueEmail from './ChangeVenueEmail';
import './VenueInfo.less';
import CameraUploadIcon from '../../assets/icons/CameraUploadIcon';
import VenueVisibility from './VenueVisibility';
import ChangeVenueEmailAdmin from './ChangeVenueEmailAdmin';
import VenueProfileCompletition from '../Onboarding/VenueProfileCompletition';

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

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

export default function VenueInfo({ venue, onAdmin }) {
  const [loading, setLoading] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [loadingServiceHours, setLoadingServiceHours] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImg] = useState(null);
  const [serviceHours, setServiceHours] = useState(null);
  const venueImagesPath = `venueImages/${venue.uid}`;
  const firestore = useFirestore();
  const firebase = useFirebase();
  const [form] = Form.useForm();

  useEffect(() => {
    if (venue) {
      form.setFieldsValue(venue);
      setServiceHours(venue.serviceHours);
    }
    return () => { };
  }, [form, venue]);

  const onFinishInfo = (values) => {
    console.log(values);
    setLoading('info');
    firestore
      .update(
        { collection: 'venues', doc: venue.uid },
        {
          address: values.address,
          address_2: values.address_2 || '',
          category: values.category || [],
          city: values.city,
          email: values.email,
          name: values.name,
          phone: values.phone || '',
          short_name: values.short_name || '',
          state: values.state,
          website: values.website,
          zip_code: values.zip_code,
          price: values.price,
          geo_segment: values.geo_segment,
        }
      )
      .then(() => {
        setLoading(false);
        message.destroy();
        message.success('Successfully saved!');
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        message.destroy();
        message.error('Oops! Something happened');
      });
  };
  const onFinishFailedInfo = ({ errorFields }) => {
    console.log(errorFields);
    message.destroy();
    message.error('Please fill all the data before saving');
  };
  const handleImagesChange = ({ file }) => {
    console.log(file);
    if (file.status === 'uploading') {
      setLoadingImg(true);
      firebase
        .uploadFile(venueImagesPath, file.originFileObj)
        .then(function ({ uploadTaskSnaphot }) {
          console.log('Uploaded venue/Restaurant image to Firebase Storage.', uploadTaskSnaphot);
          uploadTaskSnaphot.ref
            .getDownloadURL()
            .then(async function (url) {
              console.log('Venue image URL', url);
              const newImage = {
                name: uploadTaskSnaphot.ref.name,
                url,
              };
              const newImages = JSON.parse(JSON.stringify(venue.images));
              newImages.push(newImage);
              await firestore.update(
                { collection: 'venues', doc: venue.uid },
                { images: newImages }
              );
              message.destroy();
              message.success('Image successfully uploaded');
              setLoadingImg(false);
            })
            .catch(function (error) {
              console.log(error);
              message.destroy();
              message.error(error.message);
              setLoadingImg(false);
            });
        })
        .catch(function (error) {
          console.log(error);
          message.destroy();
          message.error(error.message);
          setLoadingImg(false);
        });
    }
  };
  const handleImagesRemove = (file) => {
    console.log(file);
    return new Promise((resolve) => {
      Modal.confirm({
        title: 'Do you want to delete this image?',
        content: '* Updates will be made live to B2C DineGo app immediately',
        icon: null,
        okType: 'danger',
        className: 'delete-modal-confirm',
        cancelButtonProps: { type: 'primary' },
        centered: true,
        autoFocusButton: null,
        okText: 'Delete',
        onOk: async () => {
          const newImages = venue.images.filter((x) => x.name !== file.name);
          await firestore.update({ collection: 'venues', doc: venue.uid }, { images: newImages });
          resolve(true);
          message.destroy();
          message.success('Image successfully deleted');
        },
        onCancel: () => resolve(false),
      });
    });
  };
  const handlePreview = (file) => {
    setPreviewImg(file);
    setPreviewVisible(true);
  };
  const cancelPreview = () => {
    setPreviewImg(null);
    setPreviewVisible(false);
  };

  const handleCreateServiceHours = () => {
    setServiceHours([
      { day: 1, blocks: [] },
      { day: 2, blocks: [] },
      { day: 3, blocks: [] },
      { day: 4, blocks: [] },
      { day: 5, blocks: [] },
      { day: 6, blocks: [] },
      { day: 7, blocks: [] },
    ]);
  };
  const saveDayServiceHours = (idx, dayServiceHours) => {
    const newServiceHours = JSON.parse(JSON.stringify(serviceHours));
    newServiceHours[idx] = dayServiceHours;
    setServiceHours(newServiceHours);
  };
  const saveServiceHours = async () => {
    setLoadingServiceHours(true);
    console.log('saveServiceHours', venue.uid, serviceHours);
    await firestore.update({ collection: 'venues', doc: venue.uid }, { serviceHours });
    setLoadingServiceHours(false);
    message.destroy();
    message.success('Successfully saved!');
  };

  const updateVenueLocation = ({ latitude, longitude, position }) => {
    return firestore.update(
      { collection: 'venues', doc: venue.uid },
      { latitude, longitude, position }
    );
  };

  return (
    <div>
      <h1 align="center" style={{ color: 'white' }}>
        Change App Basic Info
      </h1>
      <Form
        {...layout}
        className="venue-info-form"
        form={form}
        validateMessages={validateMessages}
        initialValues={venue}
        onFinish={onFinishInfo}
        onFinishFailed={onFinishFailedInfo}
        size="large"
      >
        <Row gutter={24}>
          <Col xs={24} align="right" style={{ paddingBottom: 24 }}>
            <Space>
              <VenueProfileCompletition venue={venue} />
              {onAdmin ? (
                <>
                  <Tag color="green">Release: {venue.release}</Tag>
                  <VenueVisibility venueId={venue.uid} hidden={venue.hidden} />
                  <ChangeVenueEmailAdmin venueId={venue.uid} venueEmail={venue.email} />
                  <VenueLocation
                    venueId={venue.uid}
                    updateVenueLocation={updateVenueLocation}
                    venuePosition={{
                      position: venue.position,
                      latitude: venue.latitude,
                      longitude: venue.longitude,
                    }}
                  />
                </>
              ) : (
                <ChangeVenueEmail venueId={venue.uid} venueEmail={venue.email} />
              )}
              <Button type="primary" htmlType="submit" loading={loading === 'info'}>
                Save info
              </Button>
            </Space>
          </Col>
          <Col md={8}>
            <div className="profile-form-card">
              <Form.Item name={'name'} label="Venue/Restaurant Name" rules={[{ required: true }]}>
                <Input placeholder="DineGo" disabled={loading === 'info'} />
              </Form.Item>
              <Form.Item name={'short_name'} label="Short name (optional)">
                <Input placeholder="DineGo" disabled={loading === 'info'} />
              </Form.Item>
              <Form.Item name={'website'} label="Website">
                <Input placeholder="www.DineGo.com" disabled={loading === 'info'} />
              </Form.Item>
            </div>
          </Col>
          <Col md={8}>
            <div className="profile-form-card">
              <Form.Item
                name={'email'}
                label="Email"
                rules={[{ type: 'email' }, { required: true }]}
              >
                <Input placeholder="hi@DineGo.com" readOnly disabled={loading === 'info'} />
              </Form.Item>
              <Form.Item name={'phone'} label="Phone number">
                <Input placeholder="0300 256 257" disabled={loading === 'info'} />
              </Form.Item>
              <Form.Item name={'category'} label="Type of venue">
                <Select
                  mode="multiple"
                  placeholder="Select venue/Restaurant type"
                  disabled={loading === 'info'}
                >
                  <Option value="Cafe">Cafe</Option>
                  <Option value="Restaurant">Restaurant</Option>
                  <Option value="Food Court">Food Court</Option>
                  <Option value="Lounge">Lounge</Option>
                  <Option value="Hotel Restaurant">Hotel Restaurant</Option>
                  <Option value="Family Restaurant">Family Restaurant</Option>
                  <Option value="Tea House">Tea House</Option>
                  <Option value="Street Food Spot">Street Food Spot</Option>
                  <Option value="Buffet">Buffet</Option>
                  <Option value="Fast Food">Fast Food</Option>

                </Select>
              </Form.Item>
              <Form.Item name={'price'} label="Average price">
                <Select
                  placeholder="Select the average price"
                  disabled={loading === 'info'}
                  allowClear
                  mode="multiple"
                >
                  <Option value={1}>$</Option>
                  <Option value={2}>$$</Option>
                  <Option value={3}>$$$</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'geo_segment'} label="Neighborhood">
                <Select
                  placeholder="Select the neighborhood"
                  disabled={loading === 'info'}
                  allowClear
                >
                  <Option value="0">Gulberg, Lahore</Option>
                  <Option value="1">DHA, Karachi</Option>
                  <Option value="2">F-6, Islamabad</Option>
                  <Option value="3">Clifton, Karachi</Option>
                  <Option value="4">Johar Town, Lahore</Option>
                  <Option value="5">G-11, Islamabad</Option>
                  <Option value="6">Saddar, Karachi</Option>
                  <Option value="7">Bahria Town, Faisalabad</Option>
                  <Option value="8">Model Town, Lahore</Option>
                  <Option value="9">Gulshan-e-Iqbal, Karachi</Option>
                  <Option value="10">Faisalabad Cantt</Option>
                  <Option value="11">Blue Area, Islamabad</Option>
                  <Option value="12">Shadman, Lahore</Option>
                  <Option value="13">Malir, Karachi</Option>
                  <Option value="14">Multan Cantt</Option>
                  <Option value="15">Peshawar Saddar</Option>
                  <Option value="16">Quetta Cantt</Option>
                  <Option value="17">PECHS, Karachi</Option>
                  <Option value="18">I-8, Islamabad</Option>
                  <Option value="19">F-7, Islamabad</Option>
                  <Option value="20">F-8, Islamabad</Option>
                  <Option value="21">DHA Phase 6, Lahore</Option>
                  <Option value="22">Other</Option>
                </Select>
              </Form.Item>

            </div>
          </Col>
          <Col md={8}>
            <div className="profile-form-card">
              <Form.Item name={'address'} label="Street 1" rules={[{ required: true }]}>
                <Input placeholder="Glenwood Park" disabled={loading === 'info'} />
              </Form.Item>
              <Form.Item name={'address_2'} label="Street 2 (optional)">
                <Input placeholder="apt 245" disabled={loading === 'info'} />
              </Form.Item>
              <Form.Item name={'city'} label="City" rules={[{ required: true }]}>
                <Select
                  placeholder="Select city"
                  disabled={loading === 'info'}
                  options={PK_cities_asArray}
                  optionFilterProp="label"
                  showSearch
                />
              </Form.Item>
              <Form.Item name={'state'} label="State" rules={[{ required: true }]}>
                <Select
                  placeholder="Select state"
                  disabled={loading === 'info'}
                  options={PK_states_asArray}
                  optionFilterProp="label"
                  showSearch
                />
              </Form.Item>
              <Form.Item name={'zip_code'} label="Zip code" rules={[{ required: true }]}>
                <Input placeholder="91000" disabled={loading === 'info'} />
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
      <Divider style={{ borderColor: '#ffffff1a' }} />
      <h1 align="center" style={{ color: 'white' }}>
        Change App Images
      </h1>
      <Upload
        listType="picture-card"
        fileList={venue.images.map((x) => ({
          uid: x.name,
          name: x.name,
          status: 'done',
          url: x.url,
        }))}
        onChange={handleImagesChange}
        onRemove={handleImagesRemove}
        onPreview={handlePreview}
        customRequest={dummyRequest}
        beforeUpload={beforeUpload}
        disabled={loadingImg}
        className="profile-upload-images"
      >
        {venue.images.length >= 8 ? null : loadingImg ? (
          <div>
            <LoadingOutlined style={{ fontSize: 48 }} />
          </div>
        ) : (
          <div>
            <CameraUploadIcon style={{ width: 48, height: 48 }} />
          </div>
        )}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewImage?.name}
        footer={null}
        onCancel={cancelPreview}
      >
        <img alt={previewImage?.name} style={{ width: '100%' }} src={previewImage?.url} />
      </Modal>
      <Divider style={{ borderColor: '#ffffff1a' }} />
      <h1 align="center" style={{ color: 'white' }}>
        Set Hours of Operation
      </h1>
      <div align="right" style={{ paddingBottom: 24 }}>
        <Button
          type="primary"
          size="large"
          onClick={saveServiceHours}
          loading={loadingServiceHours}
        >
          Save service hours
        </Button>
      </div>
      {!serviceHours || serviceHours.length === 0 || serviceHours.length !== 7 ? (
        <div>
          <Empty
            imageStyle={{
              height: 60,
            }}
            description="You haven't created your service hours"
          >
            <Button type="primary" onClick={handleCreateServiceHours}>
              Create
            </Button>
          </Empty>
        </div>
      ) : (
        serviceHours.map((day, i) => (
          <ServiceHoursInput
            key={i}
            day={day}
            saveDayServiceHours={(values) => saveDayServiceHours(i, values)}
            disabled={loadingServiceHours}
          />
        ))
      )}
    </div>
  );
}

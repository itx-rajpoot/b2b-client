import { useState } from 'react'
import { Button, Input, Modal, Form, Result, Alert } from 'antd'
import Numpad from '../Numpad/Numpad';
import firebase from '../../services/firebase';
import { apiCall } from '../../services/api';

const steps = [
  { 
    noTitle: true,
    okText: "Yes",
    cancelText: "No",
  },
  { 
    title: "Please, enter you password", 
    okText: "Next" ,
  },
  { 
    title: "Please, enter your new email", 
    okText: "Submit" ,
  },
  { 
    noTitle: true,
    okText: "Close",
    noFooter: true, 
  },
];

export default function ChangeVenueEmail({ venueId, venueEmail }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();

  const onCancel = () => {
    setVisible(false);
    if (step === 1 || step === 2) {
      form.resetFields();
    }
    setLoading(false);
    setStep(0);
    setError(null);
  }
  const onOk = () => {
    if (step === 0) {
      setStep(step + 1);
    } else if (step === 1) {
      form.validateFields()
        .then(async (values) => {
          setLoading(true);
          setError(null);
          console.log('Received values of password form: ', values);
          // Verify password
          const user = firebase.auth().currentUser;
          const credential = firebase.auth.EmailAuthProvider.credential(
            firebase.auth().currentUser.email,
            values.password
          );
          user.reauthenticateWithCredential(credential)
            .then(() => {
              setLoading(false);
              setStep(step + 1);
              setError(null);
            })
            .catch((error) => {
              form.resetFields();
              setLoading(false);
              setError(error);
            });
        })
        .catch(err => {
          console.log(err);
        });
    } else if (step === 2) {
      form.validateFields()
        .then(async (values) => {
          setLoading(true);
          setError(null);
          console.log('Received values of email form: ', values);
          // Send confirmation to new email
          apiCall('post', `/api/venues/${venueId}/changeEmail`, {
            email: values.email
          })
            .then(() => {
              setLoading(false);
              setLoading(false);
              setStep(step + 1);
            })
            .catch((err) => {
              form.resetFields()
              setLoading(false);
              setError(err);
            })
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  return (
    <div>
      <Button onClick={() => setVisible(true)}>
        Change email
      </Button>
      <Modal
        title={steps[step].noTitle ? null : steps[step].title}
        visible={visible} 
        onOk={onOk} 
        onCancel={onCancel}
        width={600}
        footer={steps[step].noFooter ? null : [
          <Button key="cancel" onClick={onCancel} disabled={loading}>{steps[step].cancelText || "Cancel"}</Button>,
          <Button key="next" type="primary" loading={loading} onClick={onOk}>{steps[step].okText}</Button>,
        ]}
      >
        {step === 0 ? (
          <div style={{ textAlign: 'center' }}>
            <h1>Do you want to change your email?</h1>
            <h3>Your current email used to log in is</h3>
            <h3><strong><em>{venueEmail}</em></strong></h3>
            <br/>
            <h3>If you change it, the sign in email will also change.</h3>
          </div>
        ) : step === 1 ? (
          <Form
            form={form}
            style={{ maxWidth: 320, margin: 'auto' }} 
            initialValues={{ remember: true }} 
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            requiredMark={false}
            size="large"
          >
            {error && error.message && <Alert message={error.message} type="error" showIcon closable onClose={() => setError(null)} style={{ marginBottom: 12 }} />}
            <Form.Item 
              label="For security purposes, please enter your PIN" 
              name="password" 
              rules={[{ required: true, message: 'Please enter your pin' }]} 
            >
              <Input.Password disabled={loading} />
            </Form.Item>
            <Numpad onChange={e => form.setFieldsValue({ password: e })}/>
          </Form>
        ) : step === 2 ? (
          <Form
            form={form}
            style={{ maxWidth: 320, margin: 'auto' }} 
            initialValues={{ remember: true }} 
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            requiredMark={false}
            size="large"
          >
            {error && error.message && <Alert message={error.message} type="error" showIcon closable onClose={() => setError(null)} style={{ marginBottom: 12 }} />}
            <Form.Item
              label="Enter the new email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your new email' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input disabled={loading} type="email" />
            </Form.Item>
          </Form>
        ) : step === 3 ? (
          <Result
            status="success"
            title="Email change request sent successfully"
            subTitle="We have sent a confirmation link to your new email. Please check your spam or promotions inbox."
            extra={[
              <Button key="close" type="primary" onClick={onCancel}>Close</Button>,
            ]}
          />
        ) : null}
      </Modal>
    </div>
  )
}

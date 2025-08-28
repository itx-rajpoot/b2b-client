import { useState } from 'react'
import { Button, Input, Modal, Form, Result, Alert } from 'antd'
import { apiCall } from '../../services/api';
import { useSelector } from 'react-redux';

const steps = [
  { 
    noTitle: true,
    okText: "Yes",
    cancelText: "No",
  },
  { 
    title: "Please, enter the venue's new email", 
    okText: "Submit" ,
  },
  { 
    noTitle: true,
    okText: "Close",
    noFooter: true, 
  },
];

export default function ChangeVenueEmailAdmin({ venueId, venueEmail }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();
  const currentUser = useSelector((state) => state.currentUser);

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
          console.log('Received values of email form: ', values);
          // Send confirmation to new email
          apiCall('post', `/api/admin/${currentUser.id}/venues/${venueId}/email`, {
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
            <h1>Hello Admin! Do you want to change this venue's email?</h1>
            <h3>The current email used to log in is</h3>
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
              label="Enter the new email"
              name="email"
              rules={[
                { required: true, message: "Please enter the venue's new email" },
                { type: 'email', message: "Please enter a valid email!" },
              ]}
            >
              <Input disabled={loading} type="email" />
            </Form.Item>
          </Form>
        ) : step === 2 ? (
          <Result
            status="success"
            title="The venue's email have been successfully changed"
            subTitle="No need to confirm this action. You are an admin!"
            extra={[
              <Button key="close" type="primary" onClick={onCancel}>Close</Button>,
            ]}
          />
        ) : null}
      </Modal>
    </div>
  )
}

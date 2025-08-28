import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, Input, Alert, Spin, Modal } from 'antd';
import { SecurityScanOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import demoImg from '../../images/demo_request.svg';
import authCardBG from '../../images/auth_card_side.png';
import logo from '../../images/logo_dark.png';
import mailIcon from '../../images/mail_icon.png';
import './AuthMain.less';
import { loginVenue, loginVenueWithCustomToken } from '../../store/actions/auth';
import { apiCall } from '../../services/api';
import Numpad from '../../components/Numpad/Numpad';

export default function Auth({ history, location, match: { params } }) {
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  console.log(location);
  const isLogin = location.pathname.indexOf('/login') > -1;
  const isSignup = location.pathname === '/signup';
  const isForgotPassword = location.pathname === '/forgot-password';
  const isResetPassword = location.pathname.indexOf('/reset-password') > -1;
  const isConfirmation = location.pathname.indexOf('/confirmation') > -1;

  useEffect(() => {
    if (params.token_id) {
      console.log('token_id');
      setValidatingToken(true);
      setValidatingToken(false);
      const loadingModal = Modal.info({
        footer: null,
        okButtonProps: { loading: true },
        okText: 'Verifying...',
        maskClosable: false,
        keyboard: false,
        icon: <SecurityScanOutlined />,
        title: 'Please, wait a moment...',
        content: 'We are verifying this link.',
      });
      apiCall('get', `/api/venues/token/${params.token_id}`)
        .then((res) => {
          console.log(res);
          loadingModal.destroy();
          if (res.action === 'email_verification') {
            // Account verification
            Modal.success({
              title: 'You account was successfully verified!',
              content: 'Please, create a PIN to log in',
            });
            // Saving email on localStorage
            if (res.email) {
              window.localStorage.setItem('email', res.email);
            }
          } else if (res.action === 'team_login') {
            // Team login
            dispatch(loginVenueWithCustomToken(res.customToken))
              .then((res) => {
                console.log(res);
                setLoading(false);
                history.push('/settings/info');
              })
              .catch((err) => {
                setError(err);
                setLoading(false);
                console.log(err);
              });
          } else if (res.action === 'password_reset') {
            // reset password form
          } else if (res.action === 'email_change') {
            // Email change
            history.push('/login');
            Modal.success({
              title: 'You email was successfully changed!',
              content: 'Please, create log in with your new email!',
            });
          } else {
            history.push('/login');
            Modal.info({
              title: 'Unknown action!',
            });
          }
          setValidatingToken(false);
        })
        .catch((err) => {
          loadingModal.destroy();
          Modal.error({
            title: err.message,
          });
          history.push('/login');
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(false);
    setEmailSent(false);
    setError(null);
    form.resetFields();
    const savedEmail = window.localStorage.getItem('email');
    if (savedEmail && isLogin) {
      form.setFieldsValue({ email: savedEmail });
    }
    return () => {};
  }, [form, location.pathname, isLogin]);

  const onFinish = (values) => {
    console.log('Success:', values);
    setError(null);
    setLoading(true);
    if (isLogin) {
      dispatch(loginVenue(values.email, values.password))
        .then((res) => {
          console.log(res);
          setLoading(false);
          history.push('/');
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
          console.log(err);
        });
    } else if (isSignup) {
      apiCall('post', `/api/venues/signup`, {
        name: values.name,
        phone: values.phone,
        address: values.address,
        contact_name: values.contact_name,
        email: values.email,
      })
        .then((res) => {
          console.log(res);
          setEmailSent(true);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
          console.log(err);
        });
    } else if (isForgotPassword) {
      apiCall('post', '/api/venues/forgot-password', { email: values.email })
        .then((res) => {
          console.log(res);
          setEmailSent(true);
          setLoading(false);
        })
        .catch((err) => {
          form.resetFields();
          setError(err);
          setLoading(false);
          console.log(err);
        });
    } else if (isResetPassword || isConfirmation) {
      apiCall('post', '/api/venues/change-password', {
        token: params.token_id,
        password: values.password,
      })
        .then((res) => {
          console.log(res);
          setLoading(false);
          Modal.success({
            title: isConfirmation
              ? 'Password successfully created!'
              : 'Password successfully changed!',
            content: 'You may now log in with your new credentials',
          });
          history.push('/login');
        })
        .catch((err) => {
          form.resetFields();
          setError(err);
          setLoading(false);
          console.log(err);
        });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const returnToLogin = () => {
    setEmailSent(false);
    history.push('/login');
  };

  return (
    <div id="auth_main">
      <div className="auth_container">
        {emailSent ? (
          isSignup ? (
            <div className="auth_card_confirmation">
              <img src={logo} alt="" style={{ width: 200 }} />
              <div style={{ padding: '48px 0px 24px' }}>
                <img src={demoImg} alt="" style={{ width: 300 }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 24,
                    maxWidth: 400,
                    textAlign: 'center',
                    marginBottom: 0,
                    color: 'rgba(0,0,0,0.82)',
                  }}
                >
                  Awesome choice! 😉
                </p>
                <p
                  style={{
                    fontSize: 18,
                    maxWidth: 400,
                    textAlign: 'center',
                    color: 'rgba(0,0,0,0.82)',
                  }}
                >
                  One of our sales representatives will contact you shortly with your credentials to
                  login.
                </p>
              </div>
              <Button type="link" size="large" onClick={returnToLogin}>
                Return to login
              </Button>
            </div>
          ) : (
            <div className="auth_card_confirmation">
              <img src={logo} alt="" style={{ width: 200 }} />
              <div style={{ padding: '48px 0px 24px' }}>
                <img
                  src={isSignup ? demoImg : mailIcon}
                  alt=""
                  style={{ width: isSignup ? 300 : 120 }}
                />
              </div>
              <p
                style={{
                  fontSize: 24,
                  maxWidth: 400,
                  textAlign: 'center',
                  color: 'rgba(0,0,0,0.82)',
                }}
              >
                {isSignup
                  ? 'Check you email to confirm registration'
                  : 'We have sent a pin recover instructions to your email. Please also check your spam/promotions inbox.'}
              </p>
              <Button type="link" size="large" onClick={returnToLogin}>
                Return to login
              </Button>
            </div>
          )
        ) : isForgotPassword || isResetPassword || isConfirmation ? (
          <Row className="auth_card">
            <Col xs={24} className="auth_card__forgot">
              <img src={logo} alt="" style={{ width: 200, margin: 'auto' }} />
              <p
                style={{
                  fontSize: 18,
                  maxWidth: 400,
                  margin: '24px auto 12px',
                }}
              >
                {isForgotPassword
                  ? 'Enter the email associated with your account and we will send you an email with the instructions to reset your password'
                  : 'Create your new pin'}
              </p>
              {isForgotPassword ? (
                <Form
                  form={form}
                  style={{ maxWidth: 320, margin: 'auto' }}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  requiredMark={false}
                  size="large"
                >
                  {error && error.message && (
                    <Alert
                      message={error.message}
                      type="error"
                      showIcon
                      closable
                      onClose={() => setError(null)}
                      style={{ marginBottom: 12 }}
                    />
                  )}
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email!' },
                      { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                  >
                    <Input disabled={loading} />
                  </Form.Item>
                  <Form.Item style={{ paddingTop: 32 }}>
                    <Button type="primary" htmlType="submit" size="large" loading={loading}>
                      Send instructions
                    </Button>
                  </Form.Item>
                  <Button type="link" style={{ padding: 0 }} onClick={() => history.push('/login')}>
                    I remebered my password!
                  </Button>
                </Form>
              ) : (
                <Spin spinning={validatingToken} tip="Validating token...">
                  <Form
                    form={form}
                    style={{ maxWidth: 320, margin: 'auto' }}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    requiredMark={false}
                    size="large"
                  >
                    {error && error.message && (
                      <Alert
                        message={error.message}
                        type="error"
                        showIcon
                        closable
                        onClose={() => setError(null)}
                        style={{ marginBottom: 12 }}
                      />
                    )}
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          validator: (rules, value, callback) =>
                            !value
                              ? callback('Please enter your new password!')
                              : value.match(/\D/g)
                              ? callback('Only numbers are required')
                              : value && value.length < 6
                              ? callback('Pin should be at least 6 digits')
                              : callback(),
                        },
                      ]}
                    >
                      <Input.Password disabled={loading} style={{ width: 180 }} />
                    </Form.Item>

                    <Numpad onChange={(e) => form.setFieldsValue({ password: e })} />

                    <Form.Item style={{ paddingTop: 12 }}>
                      <Button type="primary" htmlType="submit" size="large" loading={loading}>
                        Change password
                      </Button>
                    </Form.Item>
                    <Button
                      type="link"
                      style={{ padding: 0 }}
                      onClick={() => history.push('/login')}
                    >
                      Back to login
                    </Button>
                  </Form>
                </Spin>
              )}
            </Col>
          </Row>
        ) : (
          <Row
            className={`auth_card ${
              isSignup ? 'auth_card__signup' : isLogin ? 'auth_card__login' : ''
            }`}
          >
            {isSignup ? (
              <Col md={14} xs={24} className="auth_content" order={0}>
                <h1 align="center" style={{ marginBottom: 0 }}>
                  Register Account
                </h1>
                <Form
                  form={form}
                  style={{ maxWidth: 320, margin: 'auto' }}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  requiredMark={false}
                  size="large"
                >
                  {error && error.message && (
                    <Alert
                      message={error.message}
                      type="error"
                      showIcon
                      closable
                      onClose={() => setError(null)}
                      style={{ marginBottom: 12 }}
                    />
                  )}
                  <Form.Item
                    name="name"
                    label="Venue Name"
                    rules={[{ required: true, message: '' }]}
                  >
                    <Input placeholder="Restaurant Bar Brewery" disabled={loading} />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="Venue Phone Number"
                    rules={[{ required: true, message: '' }]}
                  >
                    <Input placeholder="555-555-555" disabled={loading} />
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label="Venue Address"
                    rules={[{ required: true, message: '' }]}
                  >
                    <Input placeholder="555 5th Street, Main St." disabled={loading} />
                  </Form.Item>
                  <Form.Item
                    name="contact_name"
                    label="Primary Contact Name"
                    rules={[{ required: true, message: '' }]}
                  >
                    <Input placeholder="John Doe / Jane Doe" disabled={loading} />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Primary Contact Email"
                    rules={[{ required: true, type: 'email', message: '' }]}
                  >
                    <Input placeholder="test@DineGo.com" disabled={loading} />
                  </Form.Item>

                  <Form.Item style={{ paddingTop: 12, textAlign: 'center' }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      style={{ padding: '6.5px 36px' }}
                    >
                      Register
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            ) : (
              <Col md={{ span: 14, order: 2 }} xs={{ span: 24, order: 0 }} className="auth_content">
                <h1 align="center">Log in</h1>
                <Form
                  form={form}
                  style={{ maxWidth: 320, margin: 'auto' }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  requiredMark={false}
                  size="large"
                >
                  {error && error.message && (
                    <Alert
                      message={error.message}
                      type="error"
                      showIcon
                      closable
                      onClose={() => setError(null)}
                      style={{ marginBottom: 12 }}
                    />
                  )}
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email!' }]}
                  >
                    <Input disabled={loading} />
                  </Form.Item>

                  <Form.Item
                    label="Pin"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your pin!',
                      },
                    ]}
                  >
                    <Input.Password disabled={loading} />
                  </Form.Item>

                  <Numpad onChange={(e) => form.setFieldsValue({ password: e })} />

                  <Form.Item style={{ paddingTop: 24, textAlign: 'center' }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      style={{ padding: '6.5px 36px' }}
                    >
                      Log in
                    </Button>
                    <div style={{ paddingTop: 6 }}>
                      <Button
                        disabled={loading}
                        type="link"
                        style={{ padding: 0 }}
                        onClick={() => history.push('/forgot-password')}
                      >
                        Forgot pin?
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </Col>
            )}
            <Col
              md={{ span: 10, order: isLogin ? 0 : 2 }}
              xs={{ span: 24, order: 2 }}
              align="center"
              className="auth_sider"
            >
              <div className="auth_sider_bg">
                <img src={authCardBG} alt="" />
              </div>
              <div className="auth_sider_content">
                <img src={logo} alt="" style={{ width: '75%', maxWidth: 200, margin: 'auto' }} />
                <h2 style={{ marginBottom: 24, marginTop: 48 }}>
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                </h2>
                <Button
                  type="primary"
                  ghost
                  onClick={() => history.push(isLogin ? '/signup' : '/login')}
                  size="large"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}

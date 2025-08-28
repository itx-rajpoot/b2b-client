/* eslint-disable react-hooks/exhaustive-deps */
import {
  Spin,
  Button,
  Empty,
  message,
  Row,
  Col,
  Card,
  Skeleton,
  Modal,
  notification,
  Tag,
} from 'antd';
import { FilePdfOutlined, CreditCardOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { Visa, Mc, Amex } from 'react-pay-icons';

import { useEffect, useState } from 'react';
import moment from 'moment';

import { apiCall } from '../../services/api';
import { redirectToCheckout } from '../../services/stripe';
import { useHistory, useLocation } from 'react-router';
import './Billing.css';

const { Meta } = Card;

export default function Billing({ venue }) {
  const [loading, setLoading] = useState(true);
  const [pricings, setPricings] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const history = useHistory();
  const location = useLocation();

  const getPlans = () => {
    return apiCall('get', `/api/venues/${venue.uid}/payments/pricings`)
      .then((res) => {
        setPricings(res);
      })
      .catch((err) => {
        console.log(err);
        message.destroy();
        message.error("Oops! We couldn't get the latest pricing.");
      });
  };
  const getPaymentMethod = () => {
    return apiCall('get', `/api/venues/${venue.uid}/payments/method`)
      .then((res) => {
        setPaymentMethod(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getInvoices = () => {
    return apiCall('get', `/api/venues/${venue.uid}/payments/invoice`)
      .then((res) => {
        setInvoices(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCurrentPlan = () => {
    return apiCall('get', `/api/venues/${venue.uid}/payments/plan`)
      .then((res) => {
        setCurrentPlan(res);
      })
      .catch((err) => {
        console.log(err);
        message.destroy();
        message.error("Oops! We couldn't get your current plan.");
      });
  };
  const checkLocationSearch = () => {
    // Manejar redirecciones desde Stripe
    const status = new URLSearchParams(location.search).get('status');
    const action = new URLSearchParams(location.search).get('action');
    const session_id = new URLSearchParams(location.search).get('session_id');
    if (action === 'change_payment_method') {
      if (status === 'success' && session_id) {
        notification.success({
          message: 'Success!',
          description: 'New payment method added!',
          duration: 12,
          placement: 'bottomRight',
        });
      } else if (status === 'back') {
        notification.info({
          message: 'No changes made to your payment method',
          duration: 12,
          placement: 'bottomRight',
        });
      }
      history.replace(location.pathname);
    } else if (status === 'success') {
      const loadingModal = Modal.info({
        footer: null,
        okButtonProps: { loading: true },
        okText: '',
        maskClosable: false,
        keyboard: false,
        centered: true,
        icon: <CreditCardOutlined />,
        title: 'Checking transaction',
        content:
          'This action might take a couple of seconds. Please, do not close or refresh this site.',
      });
      if (session_id) {
        history.replace(location.pathname);
        return apiCall('get', `/api/venues/${venue.uid}/payments/session/${session_id}`).then(
          (res) => {
            setTimeout(() => {
              loadingModal.destroy();
              if (res.status) {
                // Mixpanel. -> User subscribed (PENDING)
              }
              // Mixpanel. -> User came back from Stripe Checkout (PENDING)
              setTransaction(res);
            }, 800);
          }
        );
      }
    } else if (status === 'back') {
      // Mixpanel. -> User came back from Stripe Checkout (PENDING)
      history.replace(location.pathname);
    }
  };

  useEffect(() => {
    const initialFetches = async () => {
      checkLocationSearch();
      await getCurrentPlan();
      await getPlans();
      await getPaymentMethod();
      await getInvoices();
      setLoading(false);
    };
    initialFetches();
    return () => {};
  }, []);

  const goToCustomerPortal = () => {
    apiCall('post', `/api/venues/${venue.uid}/payments/portal`, {
      return_url: window.location.href,
    })
      .then((res) => {
        console.log(res);
        message.destroy();
        message.loading('Redirecting you to Stripe...');
        window.location.assign(res);
      })
      .catch((err) => {
        message.destroy();
        message.error('Oops! Reload the page and try again.');
        console.log(err);
      });
  };

  const handleSelectPlan = (pricing) => {
    setSelectedPlan(pricing);
    apiCall('get', `/api/venues/${venue.uid}/payments/session?pricing=${pricing}`)
      .then((res) => {
        console.log(res);
        redirectToCheckout(res.session_id);
      })
      .catch((err) => {
        message.destroy();
        message.error('Oops! Reload the page and try again.');
        console.log(err);
        setSelectedPlan(null);
      });
  };

  const closeTransactionStatus = () => {
    setTransaction(null);
  };

  return (
    <div>
      {transaction &&
        transaction.success &&
        [...Array(30)].map((x, i) => <div className="confetti" key={i} />)}
      <Modal
        title=""
        visible={!!transaction}
        maskClosable={false}
        keyboard={false}
        closable={false}
        centered
        style={{ padding: 0 }}
        width={600}
        footer={null}
      >
        <div className="payment-receipt">
          <CheckCircleTwoTone className="response-icon" twoToneColor="#52c41a" />
          <div className="response-title">Awesome!</div>
          <div className="response-subtitle">
            You have successfully subscribed to DineGo Business
          </div>
          {transaction && (
            <div className="payment-receipt-information">
              <Row>
                <Col span={6} align="right">
                  Plan:
                </Col>
                <Col span={18}>
                  {transaction.subscription.planName} (
                  {transaction.subscription.planInterval === 'month' ? 'monthly' : 'annualy'})
                </Col>
                <Col span={6} align="right">
                  Started date:
                </Col>
                <Col span={18}>
                  {moment(transaction.subscription.startedDate).format('DD/MMMM/YYYY')}
                </Col>
                <Col span={6} align="right">
                  Next billing:
                </Col>
                <Col span={18}>
                  {moment(transaction.subscription.nextBillingDate).format('DD/MMMM/YYYY')}
                </Col>
              </Row>
            </div>
          )}
          <div style={{ marginTop: 20 }}>
            <Button type="primary" onClick={closeTransactionStatus}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <h3 className="billing-section-title" style={{ paddingTop: 0 }}>
        CURRENT PLAN
      </h3>
      <Row gutter={[12, 12]} justify="space-between" style={{ alignItems: 'flex-start' }}>
        {loading ? (
          <Spin />
        ) : currentPlan ? (
          <div>
            <div className="billing-plan-title">{currentPlan.planName}</div>
            <div className="billing-plan-price">
              <strong>
                ${currentPlan.amount / 100} / {currentPlan.interval}
              </strong>
            </div>
            <div>
              Billing: <strong>{moment(currentPlan.startDate).format('MM/DD/YYYY')}</strong>
              {' - '}
              <strong>{moment(currentPlan.endDate).format('MM/DD/YYYY')}</strong>
            </div>
          </div>
        ) : (
          <div>No plan</div>
        )}
        <Button type="primary" size="large" style={{ width: '140px' }} onClick={goToCustomerPortal}>
          Upgrade
        </Button>
      </Row>
      <Row gutter={[12, 12]} justify="space-around" style={{ padding: '12px 0px' }}>
        {loading ? (
          <Skeleton active />
        ) : pricings.length === 0 ? (
          <Empty
            description="No current plans available. Try to reload the site"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          pricings.map((x) => (
            <Col xs={24} md={6} key={x.planName}>
              <Card
                actions={[
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => handleSelectPlan(x.pricing)}
                    loading={selectedPlan === x.pricing}
                    disabled={
                      (currentPlan && currentPlan.planName === x.planName) ||
                      (selectedPlan && selectedPlan !== x.pricing)
                    }
                  >
                    {currentPlan && currentPlan.planName === x.planName
                      ? 'Subscribed'
                      : selectedPlan === x.pricing
                      ? ''
                      : !currentPlan
                      ? 'ACTIVATE'
                      : currentPlan.amount > x.amount * 100
                      ? 'Downgrade'
                      : currentPlan.amount < x.amount * 100
                      ? 'Upgrade'
                      : 'ACTIVATE'}
                  </Button>,
                ]}
              >
                <Meta title={x.planName} description={`$ ${x.amount} / ${x.interval}`} />
              </Card>
            </Col>
          ))
        )}
      </Row>

      <h3 className="billing-section-title">PAYMENT DETAILS</h3>
      <Row gutter={[12, 12]} style={{ alignItems: 'center' }}>
        {loading ? (
          <Spin />
        ) : paymentMethod ? (
          <>
            <Col>
              {paymentMethod.brand.includes('visa') ? (
                <Visa style={{ width: 50 }} />
              ) : paymentMethod.brand.includes('mastercard') ? (
                <Mc style={{ width: 50 }} />
              ) : paymentMethod.brand.includes('amex') ||
                paymentMethod.brand.includes('american express') ? (
                <Amex style={{ width: 50 }} />
              ) : (
                <CreditCardOutlined style={{ fontSize: 26 }} />
              )}
            </Col>
            <Col>**** {paymentMethod.last4}</Col>
            <Col>
              Expires {paymentMethod.exp_month}/{paymentMethod.exp_year}
            </Col>
          </>
        ) : (
          <div>No payment method</div>
        )}
      </Row>

      <h3 className="billing-section-title">BILLING AND SHIPPING INFORMATION</h3>
      {loading ? (
        <Spin />
      ) : invoices.length === 0 ? (
        <div>No invoices</div>
      ) : (
        invoices.map((x) => (
          <Row key={x.id} gutter={[12, 12]} style={{ alignItems: 'center' }}>
            <Col>
              {moment(x.created * 1000).format('MMMM DD, YYYY')}{' '}
              <a href={x.url} target="_blank" rel="noopener noreferrer">
                <Button type="link" icon={<FilePdfOutlined />} size="small" />
              </a>
            </Col>
            <Col>$ {Number(x.amount_paid / 100).toFixed(2)}</Col>
            <Col>
              <Tag color={x.status === 'paid' ? 'green' : 'blue'}>{x.status.toUpperCase()}</Tag>
            </Col>
            <Col>{x.plan}</Col>
          </Row>
        ))
      )}
    </div>
  );
}

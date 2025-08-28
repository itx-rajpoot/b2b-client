import { ArrowLeftOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PageHeader, Button, Row, Col, Empty, Modal, message, Alert } from 'antd';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import moment from 'moment';
import OrderDetailsItem from './OrderDetailsItem';
import { apiCall } from '../../services/api';
import FlagCustomer from './FlagCustomer';

export default function OrderDetails({ orders, venue }) {
  const history = useHistory();
  const location = useLocation();
  const { order_id } = useParams();
  const currentOrder = orders.find((x) => x.orderId === order_id);
  const currentUserId = currentOrder ? currentOrder.user : null;
  useFirestoreConnect([{ collection: 'users', doc: currentUserId }]);
  const user = useSelector(({ firestore: { data } }) => data.users && data.users[currentUserId]);
  const handleGoBack = () => {
    if (location.state && location.state.goBack) {
      history.push(location.state.goBack);
    } else {
      history.push('/menu');
    }
  };
  const isPaid = currentOrder ? currentOrder.status === 2 : false;

  console.log('order_id', order_id);
  console.log('order', currentOrder);

  const closeOrder = () => {
    Modal.confirm({
      title: 'Do you want to close the tab?',
      content: '* Updates will be made live to B2C DineGo App immediately',
      icon: null,
      okType: 'danger',
      className: 'delete-modal-confirm',
      cancelButtonProps: { type: 'primary' },
      centered: true,
      onOk: async () => {
        return apiCall(
          'post',
          `/api/venues/${currentOrder.venue}/users/${currentOrder.user}/orders/${currentOrder.orderId}/pay`
        )
          .then(() => {
            message.destroy();
            message.success('Order successfully closed!');
          })
          .catch((err) => {
            console.log(err);
            message.destroy();
            message.error('Error while cancelling order!');
          });
      },
    });
  };
  const cancelOrder = (subOrderIdx) => {
    Modal.confirm({
      title: 'Do you want to cancel this order from the tab?',
      content: '* Updates will be made live to B2C DineGo App immediately',
      icon: null,
      okType: 'danger',
      className: 'delete-modal-confirm',
      cancelButtonProps: { type: 'primary' },
      centered: true,
      onOk: async () => {
        return apiCall(
          'delete',
          `/api/venues/${currentOrder.venue}/users/${currentOrder.user}/orders/${currentOrder.orderId}/${subOrderIdx}`
        )
          .then(() => {
            message.destroy();
            message.success('Order successfully cancelled!');
          })
          .catch((err) => {
            console.log(err);
            message.destroy();
            message.error('Error while cancelling order!');
          });
      },
    });
  };

  const notEditable = isPaid || currentOrder.paymentFailed;

  return (
    <div>
      <div>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={handleGoBack}>
          Back
        </Button>
      </div>
      {isPaid && (
        <div style={{ width: '40%', margin: 'auto', minWidth: 200 }}>
          <Alert
            type="success"
            message={`This order was paid on ${moment(currentOrder.paymentDate.toDate()).format(
              'lll'
            )}`}
            showIcon
          />
        </div>
      )}
      {currentOrder.paymentFailed && (
        <div style={{ width: '40%', margin: 'auto', minWidth: 200 }}>
          <Alert
            type="error"
            message={`This order was unsuccessfully charged on behalf of the customer. Error: ${currentOrder.paymentFailed}`}
            showIcon
          />
        </div>
      )}
      <PageHeader
        title={
          !user ? (
            <LoadingOutlined />
          ) : (
            <div style={{ color: 'white' }}>
              <div>{user.fullName}</div>
              <div style={{ fontSize: 14, lineHeight: 1.5, fontWeight: 'normal' }}>
                {user.dateOfBirth
                  ? `${moment().diff(moment(user.dateOfBirth), 'years')} years`
                  : 'Age not specified'}
              </div>
              {currentOrder.tableNo === 'Not assigned' ? (
                <div style={{ fontSize: 14, lineHeight: 1.5, fontWeight: 'normal' }}>
                  Table <em>{currentOrder.tableNo}</em>
                </div>
              ) : (
                <div style={{ fontSize: 14, lineHeight: 1.5, fontWeight: 'normal' }}>
                  Table #<em>{currentOrder.tableNo}</em>
                </div>
              )}
            </div>
          )
        }
        extra={
          <Row gutter={[0, 12]}>
            <Col xs={24} align="right">
              <FlagCustomer />
            </Col>
            {!isPaid && currentOrder && currentOrder.isTab && (
              <Col xs={24} align="right">
                <Button style={{ minWidth: 110 }} type="primary" onClick={closeOrder}>
                  Close Tab
                </Button>
              </Col>
            )}
          </Row>
        }
        avatar={{ size: 64, icon: <UserOutlined /> }}
      >
        <div style={{ color: 'white', borderTop: '1px solid #ffffff1a', paddingTop: 12 }}>
          {!currentOrder ? (
            <Empty>This order details is not ready yet. Please, come back later.</Empty>
          ) : (
            currentOrder.orders.map((x, subOrderIdx) => (
              <OrderDetailsItem
                key={x.orderNo}
                order={x}
                cancelOrder={() => cancelOrder(subOrderIdx)}
                notEditable={notEditable}
              />
            ))
          )}
        </div>
      </PageHeader>
    </div>
  );
}

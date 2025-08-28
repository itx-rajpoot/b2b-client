import { Badge, Button, Col, Row, Space } from 'antd';
import moment from 'moment';
import './OrderCard.less';

export default function OrderCard({ viewDetails, getItemImg, ...order }) {
  const inProcess = order.status === 1;
  const completed = order.status === 2;
  const cancelled = order.status === -1;
  const isNewOrder = moment().diff(moment(order.creationDate.toDate()), 'minutes') <= 5;
  const total = order.subtotal;
  return (
    <div className="order-card" onClick={() => viewDetails(order.orderId)}>
      <Row className="order-card-header">
        <Col style={{ width: 'calc(100% - 80px)' }}>
          <Row className="order-number-container">
            <Col className="order-number-prefix">Order #:</Col>
            <Col className="order-number">{order.orderNo}</Col>
          </Row>
          <Row className="order-date-container">
            <Col className="order-date-prefix">Order date:</Col>
            <Col className="order-date">{moment(order.creationDate.toDate()).format('lll')}</Col>
          </Row>
          <Row className="order-server-container">
            <Col className="order-server-prefix">Server:</Col>
            <Col className="order-server">{order.server}</Col>
          </Row>
        </Col>
        <Col
          className={
            inProcess
              ? 'order-status-processing'
              : completed
              ? 'order-status-completed'
              : cancelled
              ? 'order-status-cancelled'
              : ''
          }
        >
          {inProcess ? 'In Process' : completed ? 'Completed' : cancelled ? 'Cancelled' : ''}
        </Col>
      </Row>
      <Row className="order-details-container" justify="flex-end">
        <img
          src={getItemImg(order.items[0].item) || 'https://i.stack.imgur.com/y9DpT.jpg'}
          alt=""
          className="order-details-img"
        />
        <div className="order-details-cart">
          <div className="order-details-cart-first">
            {order.items[0].name} x {order.items[0].quantity}
          </div>
          {Array.isArray(order.items[0].additionals) && order.items[0].additionals.length > 0 && (
            <div>
              <div className="order-details-additional">Additional choices:</div>
              {order.items[0].additionals.map((x) => (
                <div key={x} className="order-details-additional-item">
                  {x}
                </div>
              ))}
            </div>
          )}
          <Space>
            {order.items.length > 1 && (
              <div className="order-details-more">
                {order.items.length - 1} more item{order.items.length - 1 === 1 ? '' : 's'}
              </div>
            )}
            <Button
              type="link"
              className="order-details-button"
              onClick={() => viewDetails(order.orderId)}
            >
              Details
            </Button>
          </Space>
        </div>
      </Row>
      {isNewOrder ? (
        <Badge.Ribbon text="New order" placement="start" color="#00ABFF">
          <Row className="order-details-footer">
            <div className="order-total">Subtotal: $ {total}</div>
          </Row>
        </Badge.Ribbon>
      ) : (
        <Row className="order-details-footer">
          <div className="order-total">Subtotal: $ {total}</div>
        </Row>
      )}
    </div>
  );
}

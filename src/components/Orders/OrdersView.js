import { Col, Row } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import OrderCard from './OrderCard';
import './OrdersView.less';
import emptyOrders from '../../assets/icons/empty_orders.svg';

const EmptyOrders = ({ type }) => (
  <div>
    <p style={{ fontSize: 28 }}>No {type} orders found</p>
    <img src={emptyOrders} alt="" style={{ width: '100%', maxWidth: 400 }} />
  </div>
);

const OrderTypeCard = ({ type, name, count, handleClick, isActive }) => (
  <div key={type} className="orders-card-wrapper">
    <div className={`orders-card-vertical orders-card-vertical-${type}`} />
    <div
      className={`orders-card orders-card-${type} ${isActive ? 'orders-active' : ''}`}
      onClick={handleClick}
    >
      <div className="orders-card-info">
        <div className="orders-card-info-title">{name}</div>
        <div className="orders-card-info-stat">{count}</div>
      </div>
    </div>
  </div>
);

export default function OrdersView({ orders, items }) {
  const history = useHistory();
  const location = useLocation();

  const isOrdersProccess = location.pathname === '/tab-timeline/process';
  const isOrdersCompleted = location.pathname === '/tab-timeline/completed';
  const isOrdersCancelled = location.pathname === '/tab-timeline/cancelled';

  const viewDetails = (orderId) => {
    history.push(`/tab-timeline/${orderId}`, {
      goBack: isOrdersCancelled
        ? '/tab-timeline/cancelled'
        : isOrdersCompleted
        ? '/tab-timeline/completed'
        : '/tab-timeline/process',
    });
  };

  const getOrders = (a) => {
    const processOrders = [];
    const completedOrders = [];
    const cancelledOrders = [];
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a[i].orders.length; j++) {
        const order = a[i].orders[j];
        console.log(order);
        if (order.status === 1) {
          processOrders.push({
            orderId: a[i].orderId,
            user: a[i].user,
            venue: a[i].venue,
            ...order,
          });
        } else if (order.status === 2) {
          completedOrders.push({
            orderId: a[i].orderId,
            user: a[i].user,
            venue: a[i].venue,
            ...order,
          });
        } else if (order.status === -1) {
          cancelledOrders.push({
            orderId: a[i].orderId,
            user: a[i].user,
            venue: a[i].venue,
            ...order,
          });
        }
      }
    }
    return {
      processOrders: processOrders.sort(
        (a, b) => new Date(b.creationDate.toDate()) - new Date(a.creationDate.toDate())
      ),
      completedOrders: completedOrders.sort(
        (a, b) => new Date(b.creationDate.toDate()) - new Date(a.creationDate.toDate())
      ),
      cancelledOrders: cancelledOrders.sort(
        (a, b) => new Date(b.creationDate.toDate()) - new Date(a.creationDate.toDate())
      ),
    };
  };
  console.log('items', items);
  const getItemImg = (itemId) => {
    return items.find((x) => x.itemId === itemId)?.img?.url;
  };

  const { processOrders, completedOrders, cancelledOrders } = getOrders(orders);
  console.log('isOrdersProccess', isOrdersProccess);
  console.log('isOrdersCompleted', isOrdersCompleted);
  console.log('isOrdersCancelled', isOrdersCancelled);
  return (
    <div>
      <div
        style={{
          background: '#081B33',
          color: 'white',
          fontSize: 22,
          borderRadius: 4,
          padding: '6px 12px',
        }}
      >
        Daily Order Statistics
      </div>
      <Row justify="space-between" style={{ padding: 32 }}>
        <Col xs={24} md={7}>
          <OrderTypeCard
            type="process"
            name="In Process"
            count={processOrders.length}
            handleClick={() => history.push('/tab-timeline/process')}
            isActive={location.pathname === '/tab-timeline/process'}
          />
        </Col>
        <Col xs={24} md={7}>
          <OrderTypeCard
            type="completed"
            name="Completed"
            count={completedOrders.length}
            handleClick={() => history.push('/tab-timeline/completed')}
            isActive={location.pathname === '/tab-timeline/completed'}
          />
        </Col>
        <Col xs={24} md={7}>
          <OrderTypeCard
            type="cancelled"
            name="Cancelled"
            count={cancelledOrders.length}
            handleClick={() => history.push('/tab-timeline/cancelled')}
            isActive={location.pathname === '/tab-timeline/cancelled'}
          />
        </Col>
        <Col xs={24} style={{ paddingTop: 32 }}>
          {isOrdersProccess ? (
            <Row gutter={[24, 24]}>
              {processOrders.length === 0 ? (
                <Col xs={24} style={{ textAlign: 'center' }}>
                  <EmptyOrders />
                </Col>
              ) : (
                processOrders.map((x) => (
                  <Col xs={24} md={12} key={x.orderNo}>
                    <OrderCard {...x} viewDetails={viewDetails} getItemImg={getItemImg} />
                  </Col>
                ))
              )}
            </Row>
          ) : isOrdersCompleted ? (
            <Row gutter={[24, 24]}>
              {completedOrders.length === 0 ? (
                <Col xs={24} style={{ textAlign: 'center' }}>
                  <EmptyOrders type="completed" />
                </Col>
              ) : (
                completedOrders.map((x) => (
                  <Col xs={24} md={12} key={x.orderNo}>
                    <OrderCard {...x} viewDetails={viewDetails} getItemImg={getItemImg} />
                  </Col>
                ))
              )}
            </Row>
          ) : isOrdersCancelled ? (
            <Row gutter={[24, 24]}>
              {cancelledOrders.length === 0 ? (
                <Col xs={24} style={{ textAlign: 'center' }}>
                  <EmptyOrders type="cancelled" />
                </Col>
              ) : (
                cancelledOrders.map((x) => (
                  <Col xs={24} md={12} key={x.orderNo}>
                    <OrderCard {...x} viewDetails={viewDetails} getItemImg={getItemImg} />
                  </Col>
                ))
              )}
            </Row>
          ) : null}
        </Col>
      </Row>
    </div>
  );
}

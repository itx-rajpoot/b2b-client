import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, InputNumber, message, Row, Space, Switch, Tag } from 'antd';
import { parseOrders } from '../../utils/collectionParsers';
import { apiCall } from '../../services/api';
import moment from 'moment';

const mockUserId = 'ThpY3HCFsjUrPi81wPbs6aKC9B43';
const taxRate = 0.1;
const tip = 5;

function getCartDetails(items) {
  const subtotal = items.reduce((acc, a) => a.price * a.quantity + acc, 0);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + tax + tip;
  return {
    tax,
    tip,
    subtotal,
    total,
  };
}

export default function OrderDebugger() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({ items: [], subtotal: 0, tax: 0, tip: 5, total: 0, isTab: true });
  const venueId = useSelector((state) => state.currentUser.id);
  const mockUser = useSelector((state) => state.firestore.data.users ? state.firestore.data.users[mockUserId] : {});
  const orders = useSelector((state) => parseOrders(state.firestore.data.orders));
  useFirestoreConnect([
    { collection: 'users', doc: mockUserId },
  ]);
  console.log(mockUser)

  useEffect(() => {
    apiCall('get', `/api/users/${mockUserId}/menu/${venueId}`)
      .then(setItems)
      .catch(err => message.error(err.message))
    return () => {}
  }, [venueId]);

  const addItem = (item) => {
    const newItems = cart.items.concat([
      {
        item: item.itemId,
        quantity: 1,
        price: item.price,
        name: item.name,
      },
    ]);
    const { tip, tax, subtotal, total } = getCartDetails(newItems);
    setCart({
      items: newItems,
      subtotal,
      tax,
      tip,
      total,
      isTab: cart.isTab
    });
  };
  const removeItem = (itemName) => {
    const newItems = cart.items.filter((x) => x.name !== itemName);
    const { tip, tax, subtotal, total } = getCartDetails(newItems);
    setCart({
      items: newItems,
      subtotal,
      tax,
      tip,
      total,
      isTab: cart.isTab
    });
  };
  const setItemQuantity = (itemIdx, newQuantity) => {
    const newItems = [...cart.items];
    newItems[itemIdx].quantity = newQuantity || 1;
    const { tip, tax, subtotal, total } = getCartDetails(newItems);
    setCart({
      items: newItems,
      subtotal,
      tax,
      tip,
      total,
      isTab: cart.isTab
    });
  };
  const toggleTab = (isTab) => {
    setCart({
      ...cart,
      isTab
    });
  };

  const handlePlaceOrder = () => {
    if (cart.items.length === 0) {
      message.destroy();
      return message.warn('cart is empty');
    }
    setLoading(true);
    apiCall('post', `/api/users/${mockUserId}/orders`, {
      venue: venueId,
      items: cart.items,
      isTab: cart.isTab,
      paymentMethodId: mockUser.paymentMethods[0].id
    })
      .then(() => {
        console.log('order creation res');
        message.destroy();
        message.success(`Order created`);
        setLoading(false);
      })
      .catch((err) => {
        message.destroy();
        message.error(err.message);
        setLoading(false);
      });
  };
  const handlePlaceSubOrder = (orderId, isTab) => {
    if (cart.items.length === 0) {
      message.destroy();
      return message.warn('cart is empty');
    }
    if (!isTab) {
      message.destroy();
      return message.warn('order is not a tab');
    }
    setLoading(true);
    apiCall('post', `/api/users/${mockUserId}/orders/${orderId}`, {
      venue: venueId,
      items: cart.items,
    })
      .then(() => {
        message.destroy();
        message.success(`Order placed to Tab`);
        setLoading(false);
      })
      .catch((err) => {
        message.destroy();
        message.error(err.message);
        setLoading(false);
      });
  };
  const cancelOrder = (orderId, orderIndex) => {
    setLoading(true);
    apiCall('delete', `/api/users/${mockUserId}/orders/${orderId}/${orderIndex}`)
      .then(() => {
        message.destroy();
        message.success(`Order successfully cancelled!`);
        setLoading(false);
      })
      .catch((err) => {
        message.destroy();
        message.error(err.message);
        setLoading(false);
      });
  };

  return (
    <div
      style={{
        border: '1px dashed gainsboro',
        borderRadius: 4,
        padding: '12px 6px',
        marginBottom: 8,
        paddingTop: 24,
      }}
    >
      <h3 style={{ fontWeight: 'bold', textAlign: 'center' }}>
        [DEVELOPMENT] User info
      </h3>
      <Divider />
      <Row>
        <Col xs={12}>
          <div><strong>ID:</strong><br />{" - "}{mockUserId}</div>
          <div><strong>Username:</strong><br />{" - "}{mockUser.username}</div>
          <div><strong>Email:</strong><br />{" - "}{mockUser.email}</div>
          <div><strong>Stripe Customer Id:</strong><br />{" - "}{mockUser.stripe_customerId}</div>
        </Col>
        <Col xs={12}>
          <p style={{ fontWeight: "bold" }}>Payment Methods</p>
          <Row>
            {!Array.isArray(mockUser.paymentMethods) || mockUser.paymentMethods.length === 0 ? (
              <Col xs={24}>
                <span>No payment methods registered</span>
              </Col>
            ) : mockUser.paymentMethods.map((x, i) => (
              <Col xs={12} key={x.id}>
                <div><strong>Payment Method #{i}</strong></div>
                <div>{x.cardHolder}</div>
                <div>{x.gatewayBrand} {x.cardType}</div>
                <div>**** {x.lastFour}</div>
              </Col>  
            ))}
          </Row>
        </Col>
        <div>
        </div>
      </Row>
      <Divider />
      <h3 style={{ fontWeight: 'bold', textAlign: 'center' }}>
        [DEVELOPMENT] Order creator debugger
      </h3>
      <Divider />
      <Row>
        <Col xs={24} md={12} align="center">
          <p>Cart:</p>
          {cart.items.map((item, itemIdx) => (
            <div key={item.name}>
              <Space style={{ border: '1px solid gainsboro', padding: 6 }}>
                {item.name}
                <InputNumber
                  placeholder="Input quantity"
                  value={item.quantity}
                  min={1}
                  max={10}
                  onChange={(e) => setItemQuantity(itemIdx, e)}
                />
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  type="text"
                  onClick={() => removeItem(item.name)}
                />
              </Space>
            </div>
          ))}
          <div><Switch checked={cart.isTab} checkedChildren="Tab order" unCheckedChildren="Single order" onChange={toggleTab} /> </div>
          <div>Order subtotal: $ {cart.subtotal}</div>
          <div>Order tax: $ {cart.tax}</div>
          <div>Order tip: $ {cart.tip}</div>
          <div>Order total: $ {cart.total}</div>
          <div>
            <Button type="primary" onClick={handlePlaceOrder} loading={loading}>
              Place order
            </Button>
          </div>
        </Col>
        <Col xs={24} md={12} align="center">
          <p>Available items:</p>
          {items.map((item) => (
            <div key={item.name}>
              <Space style={{ border: '1px solid gainsboro', padding: 6 }}>
                <div
                  style={
                    cart.items.findIndex((x) => x.item === item.itemId) > -1
                      ? { textDecoration: 'line-through' }
                      : {}
                  }
                >
                  <div>
                    <strong>{item.name}</strong>
                  </div>
                  <div>
                    category: <strong>{item.category}</strong>
                  </div>
                  <div>
                    subcategories: <strong>{item.subcategory.join('; ')}</strong>
                  </div>
                </div>
                <Button
                  disabled={cart.items.findIndex((x) => x.item === item.itemId) > -1}
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={() => addItem(item)}
                />
              </Space>
            </div>
          ))}
        </Col>
      </Row>
      <Divider />
      <h3 style={{ fontWeight: 'bold', textAlign: 'center' }}>
        [DEVELOPMENT] Order viewer debugger
      </h3>
      <Divider />
      <Row justify="center">
        {orders.length === 0 ? "No orders placed yet" : orders.map((order) => (
          <Col xs={24} sm={12} md={8} style={{ border: '1px solid gainsboro', padding: 6 }}>
            <p align="center">
              <Space>
                <Tag color={order.isTab ? "green" : "orange"}>{order.isTab ? "Tab" : "Single"}</Tag>
                <Button size="small" ghost onClick={() => handlePlaceSubOrder(order.orderId, order.isTab)}>
                  Place suborder with cart
                </Button>
              </Space>
            </p>
            <div>Order UID: {order.orderId}</div>
            <div>User ID: {order.user}</div>
            <div>Total: $ {order.total}</div>
            <div style={{ borderTop: '1px solid gainsboro', marginTop: 8, paddingTop: 8 }}>
              {order.orders.map((x, i) => (
                <div style={order.orders.length - 1 === i ? {} : { borderBottom: "1px dashed gainsboro", marginBottom: 6 }}>
                  <Space>
                    <div>Order #{x.orderNo} -</div>
                    <div>
                      {x.status === 1 ? 'In process' : x.status === 2 ? 'Completed' : 'Cancelled'}
                    </div>
                    {x.status === 1 && (
                      <Button type="danger" ghost danger size="small" onClick={() => cancelOrder(order.orderId, i)}>cancel</Button>
                    )}
                  </Space>
                  <div>
                    {x.status === 1
                      ? moment(x.inProcessDate.toDate()).format('LLL')
                      : x.status === 2
                      ? moment(x.completionDate.toDate()).format('LLL')
                      : moment(x.cancellationDate.toDate()).format('LLL')
                    }
                  </div>
                  <div>
                    {x.items.map((item) => (
                      <div>
                        {`> $${item.quantity * item.price} - ${item.quantity} ${item.name}`}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

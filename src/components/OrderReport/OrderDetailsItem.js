import { DeleteOutlined, PrinterOutlined } from '@ant-design/icons';
import { Row, Col, Button, Table, Space } from 'antd';
import moment from 'moment';
import './OrderDetailsItem.less';


export default function OrderDetailsItem({ order, cancelOrder, notEditable }) {
  const { status, orderNo, creationDate, server, items, subtotal } = order;
  const columns = [
    // {
    //   title: 'Image',
    //   dataIndex: 'img',
    //   key: 'img',
    //   align: 'center',
    //   render: img => <img className="order-details-item-img" src={img ? img.url : "https://i.stack.imgur.com/y9DpT.jpg"} alt="" height={80} />,
    // },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price) => `$${price}`
    },
    {
      title: 'Add-ons',
      dataIndex: 'additionals',
      key: 'additionals',
      align: 'center',
      render: text => text ? text.join("; ") : ""
    },
    {
      title: 'Sides',
      dataIndex: 'sides',
      key: 'sides',
      align: 'center',
      render: text => text ? text.join("; ") : ""
    },
    {
      title: 'Add-ons',
      dataIndex: 'addons',
      key: 'addons',
      align: 'center',
      render: text => text ? text.join("; ") : ""
    },
    {
      title: 'Special Instructions',
      dataIndex: 'instructions',
      key: 'instructions',
      align: 'center',
    },
    {
      title: 'Redeemable Points (LP)',
      dataIndex: 'lp',
      key: 'lp',
      align: 'center',
    },
    {
      key: 'action',
      render: (text, record) => notEditable ? null : (
        <Space size="middle">
          <Button icon={<DeleteOutlined />} type="danger" ghost size="small" onClick={() => {}} />
        </Space>
      ),
    },
  ];
  const statusType = status === 1 ? "process" : status === 2 ? "completed" : status === -1 ? "cancelled" : "created";
  return (
    <Row gutter={[24, 24]} className="order-details-item-card">
      <Col>
        <div>
          <div className="order-details-label">Order No:</div>
          {orderNo}
        </div>
        <div>
          <div className="order-details-label">Order Date:</div>
          {moment(creationDate.toDate()).format('llll')}
        </div>
        <div>
          <div className="order-details-label">Status:</div>
          <span className={`order-details-status-${statusType}`}>
            {status === 1 ? "In Process" : status === 2 ? "Completed" : status === -1 ? "Cancelled" : "Created"}
          </span>
        </div>
        <div className="order-details-server">
          <div className="order-details-label">Server:</div>
          {server}
        </div>
      </Col>
      <Col style={{ textAlign: "right" }}>
        <Row gutter={[0, 12]}>
          <Col xs={24} align="right">
            <Button style={{ minWidth: 110 }} icon={<PrinterOutlined />} type="primary" ghost>
              Print
            </Button>
          </Col>
          {statusType === 'process' && (
            <Col xs={24} align="right">
              <Button style={{ minWidth: 110 }} type="primary" onClick={cancelOrder}>
                Cancel order
              </Button>
            </Col>
          )}
        </Row>
      </Col>
      <Col xs={24}>
        <Table 
          columns={columns} 
          dataSource={items} 
          pagination={false}
          className="custom-table"
        />
      </Col>
      <Col xs={24}>
        <div align="right">Subtotal: $ {subtotal}</div>
      </Col>
    </Row>
  )
}

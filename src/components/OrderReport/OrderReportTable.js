import { createRef, useState } from 'react';
import { Table, Tag, Button, Row, Col, Input, Space, message, Empty, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import emptyItemsImg from '../../images/empty_items.svg';
import { loadDownloadToExcelScript } from '../../services/excel';

const { Search } = Input;

export default function OrdersReportTable({ orders }) {
  const history = useHistory();
  const [downloading, setDownloading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchDate, setSearchDate] = useState(null);
  const [searchInputText, setSearchInputText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = createRef();

  const downloadToExcel = () => {
    setDownloading(true);
    loadDownloadToExcelScript(() => {
      const records = orders.map((x) => {
        const details = {};
        x.orders.forEach((y, i) => {
          details[`Suborder_${i + 1} (Order #)`] = y.orderNo;
          details[`Suborder_${i + 1} (Items)`] = y.items
            .map((item) => `${item.quantity} ${item.name} ($${item.price * item.quantity})`)
            .join('\n');
          details[`Suborder_${i + 1} (Subtotal)`] = y.subtotal;
        });
        return {
          Date: moment(x.creationDate.toDate()).format('LLLL'),
          'User name': x.userName,
          'User email': x.userEmail,
          Total: x.total,
          Status:
            x.status === -1
              ? 'Cancelled'
              : x.status === 1
                ? 'In process'
                : x.status === 2
                  ? 'Completed'
                  : 'Created',
          ...details,
        };
      });
      let data = window.XLSX.utils.json_to_sheet(records);
      let book = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(book, data, 'Orders report');
      window.XLSX.writeFile(book, `Orders report up to ${moment().format('MM-DD-YYYY')}.xlsx`);
      setTimeout(() => {
        setDownloading(false);
        message.destroy();
        message.success('Downloaded successfully!');
      }, 2000);
    });
  };

  const viewDetails = (orderId) => {
    history.push(`/tab-report/${orderId}`, {
      goBack: '/tab-report',
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const handleSearchDate = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchDate(selectedKeys);
    setSearchedColumn(dataIndex);
  };

  const handleResetDate = (clearFilters) => {
    clearFilters();
    setSearchDate(null);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      (dataIndex === 'name' && searchInputText) || searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText, searchInputText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const getDateSearchProps = () => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <div>
          <DatePicker
            ref={searchInput}
            onChange={(e) => setSelectedKeys(e ? [e] : [])}
            value={selectedKeys[0]}
            format={['MM/DD/YYYY', 'MM/DD/YYYY']}
            style={{ marginBottom: 8 }}
          />
        </div>
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearchDate(selectedKeys, confirm, 'creationDate')}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleResetDate(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchDate(selectedKeys[0]);
              setSearchedColumn('creationDate');
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      if (value !== null && moment(value).isValid()) {
        return moment(record['creationDate'].toDate()).isBetween(
          moment(value).startOf('day'),
          moment(value).endOf('day')
        );
      } else {
        return record['creationDate'];
      }
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.focus(), 100);
      }
    },
    render: (date) => moment(date.toDate()).format('lll'),
  });

  const columns = [
    {
      title: 'ID',
      key: 'orderId',
      dataIndex: 'orderId',
    },
    {
      title: 'Customer Name',
      key: 'userName',
      dataIndex: 'userName',
      sorter: (a, b) => a.user.length - b.user.length,
      sortDirections: ['descend'],
      ...getColumnSearchProps('userName'),
    },
    {
      title: 'Customer Email',
      key: 'userEmail',
      dataIndex: 'userEmail',
      ...getColumnSearchProps('userEmail'),
    },
    {
      title: 'Suborders',
      key: 'orders',
      dataIndex: 'orders',
      render: (orders) => orders.length,
    },
    {
      title: 'Amount',
      key: 'total',
      dataIndex: 'total',
      render: (total) => `$${total}`,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      filters: [
        {
          text: 'Cancelled',
          value: -1,
        },
        {
          text: 'Completed',
          value: 2,
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => (
        <Tag color={status === 2 ? 'green' : status === -1 ? 'volcano' : 'geekblue'}>
          {{ '-1': 'Cancelled', 0: 'Created', 1: 'In process', 2: 'Completed' }[status]}
        </Tag>
      ),
    },
    {
      title: 'Date',
      key: 'creationDate',
      dataIndex: 'creationDate',
      ...getDateSearchProps(),
    },
    {
      title: 'Order Details',
      key: 'details',
      dataIndex: 'details',
      render: (details, record) => (
        <Button type="link" onClick={() => viewDetails(record.orderId)}>
          View details
        </Button>
      ),
    },
  ];
  return (
    <div>
      <Row justify="space-between" style={{ paddingBottom: 24 }}>
        <Col>
          <Search
            placeholder="Search by customer name or order ID"
            value={searchInputText}
            onChange={(e) => setSearchInputText(e.target.value)}
            style={{ width: 300 }}
          />
        </Col>
        <Col>
          <Button type="primary" loading={downloading} onClick={downloadToExcel}>
            Download CSV
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        rowKey="orderId"
        dataSource={orders.filter((x) =>
          searchInputText
            ? (x.userName?.toLowerCase().includes(searchInputText.toLowerCase()) ||
              x.orderId?.toLowerCase().includes(searchInputText.toLowerCase()))
            : true
        )}

        className="custom-table"
        locale={{
          emptyText: (
            <Empty
              image={emptyItemsImg}
              description={
                searchInputText || searchDate
                  ? `No matches for your search "${searchDate
                    ? `Date is ${moment(searchDate).format('MM/DD/YYYY')}`
                    : searchInputText
                  }"`
                  : 'No orders were found'
              }
            />
          ),
        }}
      />
    </div>
  );
}

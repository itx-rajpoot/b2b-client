import React, { createRef, useState } from 'react';
import { Button, Col, Input, message, Row, Space, Table, Modal, Switch, Empty, Radio } from 'antd';
import { SearchOutlined, DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import { useHistory } from 'react-router';
import emptyRewardsImg from '../../images/empty_rewards.svg';
import { useFirebase, useFirestore } from 'react-redux-firebase';

export default function RewardsDisplay({ venueId, rewards }) {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [type, setType] = useState('active');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = createRef();
  const history = useHistory();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const venueImagesPath = `venueImages/${venueId}/rewards`;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const goToEditReward = (reward) => {
    history.push(`/rewards/${reward.rewardId}`);
  };
  const goToAddReward = () => {
    history.push('/rewards/add');
  };

  const handleDeleteReward = (reward) => {
    Modal.confirm({
      title: 'Do you want to delete this reward?',
      description: '* Updates will be made live to B2C DineGo App immediately',
      icon: null,
      okType: 'danger',
      className: 'delete-modal-confirm',
      cancelButtonProps: { type: 'primary' },
      centered: true,
      autoFocusButton: null,
      okText: 'Delete',
      onOk: async () => {
        setLoading(true);
        if (reward.img) {
          await firebase.deleteFile(`${venueImagesPath}/${reward.img.name}`);
        }
        console.log(reward.rewardId, venueId);
        await firestore.delete({ collection: 'rewards', doc: reward.rewardId });
        setLoading(false);
        message.destroy();
        message.success('Reward successfully deleted');
        return Promise.resolve();
      },
    });
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
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Item image',
      key: 'image',
      dataIndex: 'image',
      render: (img) => (
        <img src={img ? img.url : 'https://i.stack.imgur.com/y9DpT.jpg'} alt="" height={80} />
      ),
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend'],
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'LP',
      key: 'lp',
      dataIndex: 'lp',
    },
    {
      title: 'Stipulations',
      key: 'stipulations',
      dataIndex: 'stipulations',
    },
    {
      title: 'Limits',
      key: 'limit',
      dataIndex: 'limit',
      render: (text) => `Up to ${text} items`,
    },
    {
      title: 'Expiration date',
      key: 'expiration',
      dataIndex: 'expiration',
      render: (text) => moment(text).format('[Until] MM/DD/YYYY'),
    },
    {
      title: 'Availability',
      key: 'available',
      dataIndex: 'available',
      render: (text) => <Switch checked={text} />,
    },
    // {
    //   title: 'Age restricted',
    //   key: 'ageRestricted',
    //   dataIndex: 'ageRestricted',
    //   render: (text) => <Switch checked={text} />,
    // },
    {
      key: 'action',
      render: (_, record) => (
        <Space size="middle" direction="vertical">
          <Button
            size="small"
            type="primary"
            ghost
            onClick={() => goToEditReward(record)}
            icon={<EditOutlined />}
          />
          <Button
            icon={<DeleteOutlined />}
            type="danger"
            ghost
            size="small"
            onClick={() => handleDeleteReward(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" style={{ paddingBottom: 24 }}>
        <Input
          allowClear
          value={searchText}
          placeholder="Search rewards"
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Col>
          <Button type="primary" onClick={goToAddReward} icon={<PlusOutlined />}>
            Add reward
          </Button>
        </Col>
      </Row>
      <div align="center" style={{ padding: '0px 12px 24px' }}>
        <Radio.Group
          value={type}
          buttonStyle="solid"
          onChange={(e) => setType(e.target.value)}
        >
          <Radio.Button style={{ minWidth: 100 }} value="active">
            Active
          </Radio.Button>
          <Radio.Button style={{ minWidth: 100 }} value="inactive">
            Inactive
          </Radio.Button>
          <Radio.Button style={{ minWidth: 100 }} value="pending">
            Pending
          </Radio.Button>
        </Radio.Group>
      </div>

      <Table
        rowKey="rewardId"
        columns={columns}
        dataSource={rewards
          .filter((x) =>
            type === 'active' ? x.available : type === 'inactive' ? !x.available : false
          )
          .filter((x) => (searchText ? x.name.localeCompare(searchText) > -1 : true))}
        loading={loading}
        locale={{
          emptyText: (
            <Empty
              image={emptyRewardsImg}
              description={
                searchText ? `No matches for your search "${searchText}"` : `No ${type} rewards were found`
              }
            />
          ),
        }}
      />
    </div>
  );
}

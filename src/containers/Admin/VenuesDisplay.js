import React from 'react';
import { Button, Input, message, Progress, Row, Space, Table, Popover } from 'antd';
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import AddVenue from './AddVenue';
import DeleteConfirmationModal from '../../components/ReusableComponents/DeleteConfirmationModal';
import { apiCall } from '../../services/api';
import getVenueCompletition from '../../utils/venueCompletition';
export default class VenuesDisplay extends React.Component {
  state = {
    loading: false,
    searchText: '',
    searchedColumn: '',
  };

  handleDeleteVenue = (venueId, venueEmail, venueName) => {
    if (this.DeleteConfirmationRef) {
      this.DeleteConfirmationRef.displayModal({
        title: 'Do you want to delete this venue?',
        content: (
          <div>
            <p>You are about to delete venue the following venue.</p>
            <ul>
              <li>
                Venue name: <strong>{venueName || 'Name is missing'}</strong>
              </li>
              <li>
                Venue email: <strong>{venueEmail || 'Email is missing'}</strong>
              </li>
            </ul>
            <br />
            <p>
              All the information including, menu, items, orders, and ratings will be deleted.
              Please, double check you have selected the correct venue.{' '}
              <strong>This action is irreversible</strong>.
            </p>
          </div>
        ),
        okText: 'Yes, delete venue',
        cancelText: 'Cancel',
        onOk: () => {
          this.setState({ loading: true });
          return apiCall('delete', `/api/admin/${this.props.currentUser.id}/venues/${venueId}`)
            .then(() => {
              this.setState({ loading: false });
              message.destroy();
              message.success('Venue was deleted!');
            })
            .catch((err) => {
              this.setState({ loading: false });
              message.destroy();
              message.error(err.message);
            });
        },
      });
    }
  };
  handleEditVenue = (venueId) => {
    this.props.history.push(`/admin/venues/${venueId}`);
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
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
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const venues = this.props.venues.map((venue) => ({
      ...venue,
      onboarding: getVenueCompletition(venue),
    }));
    const _amenities = [];
    for (let i = 0; i < venues.length; i++) {
      const venue = venues[i];
      if (Array.isArray(venue.amenities)) {
        for (let j = 0; j < venue.amenities.length; j++) {
          const amenity = venue.amenities[j];
          if (amenity && amenity.name && _amenities.indexOf(amenity.name) === -1) {
            _amenities.push(amenity.name);
          }
        }
      }
    }

    const { loading } = this.state;
    const columns = [
      {
        title: 'Venue Name',
        dataIndex: 'name',
        key: 'name',
        width: 240,
        sorter: (a, b) => a.name.localeCompare(b.name),
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: 200,
        ellipsis: true,
      },
      {
        title: 'Website',
        dataIndex: 'website',
      },
      {
        title: 'Address',
        dataIndex: 'address',
      },
      {
        title: 'Amenities',
        dataIndex: 'amenities',
        filters: _amenities.sort((a, b) => a.localeCompare(b)).map((x) => ({ text: x, value: x })),
        onFilter: (value, record) =>
          Array.isArray(record.amenities)
            ? record.amenities.findIndex((x) => x.name === value) > -1
            : false,
        render: (amenities) =>
          Array.isArray(amenities) ? amenities.map((x) => x.name).join('\n') : '',
      },
      {
        title: 'Release',
        dataIndex: 'release',
        filters: [
          { text: 'First release', value: 'first' },
          { text: 'Second release', value: 'second' },
          { text: 'Pending', value: 'pending' },
        ],
        onFilter: (value, record) => (record.release ? record.release.includes(value) : false),
      },
      {
        title: 'Visible on B2C',
        dataIndex: 'hidden',
        filters: [
          { text: 'Hidden', value: true },
          { text: 'Visible', value: false },
        ],
        onFilter: (value, record) => record.hidden === value,
        render: (hidden) => (hidden ? 'Hidden' : 'Visible'),
        sorter: (a, b) => (a.hidden === b.hidden ? 0 : a.hidden ? -1 : 1),
      },
      {
        title: 'Profile Progress',
        dataIndex: 'onboarding',
        filters: [
          { text: 'Basic Info', value: 0 },
          { text: 'App Images', value: 1 },
          { text: 'Hours of Operations', value: 2 },
          { text: 'Covid Policy', value: 3 },
          { text: 'Amenities', value: 4 },
          { text: 'Type of Music', value: 5 },
          { text: 'Capacity', value: 6 },
        ],
        onFilter: (value, record) => record.onboarding.details[value].completed,
        render: (onboarding) => (
          <div align="center">
            <Popover
              placement="left"
              content={
                <ul style={{ paddingLeft: 12 }}>
                  {onboarding.details.map((x) => (
                    <li key={x.title}>
                      <strong>{x.title}</strong>:{' '}
                      {x.completed ? (
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                      ) : (
                        <CloseCircleTwoTone twoToneColor="#eb2f96" />
                      )}
                    </li>
                  ))}
                </ul>
              }
              title="Venue Profile Completition"
              trigger="click"
            >
              <Progress
                type="circle"
                percent={Math.round((onboarding.progress / 7) * 100)}
                width={40}
              />
            </Popover>
          </div>
        ),
        sorter: (a, b) => a.onboarding.progress - b.onboarding.progress,
      },
      {
        title: '',
        dataIndex: 'venueId',
        align: 'center',
        render: (venueId, record) => (
          <Space>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => this.handleDeleteVenue(venueId, record.email, record.name)}
            />
            <Button
              icon={<EditOutlined />}
              type="primary"
              onClick={() => this.handleEditVenue(venueId)}
            />
          </Space>
        ),
      },
    ];
    return (
      <div>
        <DeleteConfirmationModal ref={(node) => (this.DeleteConfirmationRef = node)} />
        <Row justify="end">
          <Space>
            <AddVenue />
          </Space>
        </Row>
        <div style={{ paddingTop: 12 }}>
          <Table rowKey="venueId" loading={loading} columns={columns} dataSource={venues} />
        </div>
        <div align="right">
          <em>{`Total of ${venues.length} venues`}</em>
        </div>
      </div>
    );
  }
}

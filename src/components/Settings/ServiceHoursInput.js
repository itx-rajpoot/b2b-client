import React, { useState, useEffect } from 'react';
import { Col, Row, Select, Switch, Button, Modal } from 'antd';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import TimeInput from '../TimeInput/TimeInput';
import './ServiceHoursInput.less';

const { Option } = Select;

export default function ServiceHoursInput({ day, saveDayServiceHours, disabled }) {
  const [blocks, setBlocks] = useState(day.blocks || []);

  useEffect(() => {
    saveDayServiceHours({
      day: day.day,
      blocks,
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  const editBlock = (value, field, blockIndex) => {
    const _blocks = JSON.parse(JSON.stringify(blocks));
    if (['start', 'end'].indexOf(field) > -1){
      _blocks[blockIndex][field] = moment(value).toISOString();
    } else {
      _blocks[blockIndex][field] = value;
    }
    setBlocks(_blocks);
  };
  const addBlock = () => {
    setBlocks(blocks.concat([{ start: '', end: '', type: 'normal', available: true }]));
  };
  const removeBlock = (blockIndex) => {
    Modal.confirm({
      title: "Are you sure you want to delete hours of operation?",
      content: "* Updates will be made live to B2C DineGo App immediately",
      icon: null,
      okType: "danger",
      className: "delete-modal-confirm",
      cancelButtonProps: { type: "primary" },
      centered: true,
      autoFocusButton: null,
      okText: "Delete",
      onOk: () => {
        setBlocks(blocks.filter((_, i) => i !== blockIndex));
      }
    });
  };

  return (
    <Row gutter={[4, 32]} className="service-hours-input-main">
      <Col className="service-hours-day">{moment().isoWeekday(day.day).format('dddd')}</Col>
      <Col className="service-hours-input-container">
        {blocks.map(({ start, end, type, available }, blockIndex) => (
          <Row
            key={blockIndex}
            gutter={24}
            className="service-hours-block-row"
            style={{
              paddingBottom: blocks.length - 1 === blockIndex ? 24 : 12,
            }}
          >
            <CloseCircleOutlined
              onClick={() => removeBlock(blockIndex)}
              className="service-hours-block-remove"
            />
            <Row className="service-hours-block-inputs" gutter={[24, 12]}>
              <TimeInput
                disabled={disabled}
                value={start}
                placeholder="Enter time"
                style={{ width: 130 }}
                handleTimeChange={(value) => editBlock(value, 'start', blockIndex)}
              />
              <div className="service-hours-block-to">To</div>
              <TimeInput
                disabled={disabled}
                value={end}
                placeholder="Enter time"
                style={{ width: 130 }}
                handleTimeChange={(value) => editBlock(value, 'end', blockIndex)}
              />
              <Select
                disabled={disabled}
                value={type}
                className="service-hours-block-type"
                placeholder="Select type"
                onChange={(value) => editBlock(value, 'type', blockIndex)}
              >
                <Option value="normal">Normal</Option>
                <Option value="brunch">Brunch</Option>
                <Option value="happy_hour">Happy hour</Option>
                <Option value="holiday">Holiday</Option>
              </Select>
            </Row>
            <Switch
              className="service-hours-block-switch"
              disabled={disabled}
              checked={available}
              onChange={(value) => editBlock(value, 'available', blockIndex)}
            />
          </Row>
        ))}
        <Row className="service-hours-add-block">
          <Button icon={<PlusOutlined />} onClick={addBlock}>
            Add Hours
          </Button>
        </Row>
      </Col>
    </Row>
  );
}

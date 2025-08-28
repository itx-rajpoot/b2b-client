import { useEffect, useState } from "react";
import { useFirestore } from 'react-redux-firebase';
import { Button, Col, Divider, Empty, message, Modal, Row, Slider, Space, Switch, Tooltip } from "antd";
import { DeleteOutlined, InfoCircleFilled } from '@ant-design/icons';
import AddAmenity from "./AddAmenity";
import AddMusic from "./AddMusic";
import { capacity as _capacity } from "../../mock/venueFeatures";
import emptyMusicImg from '../../images/empty_music.svg';
import emptyAmenitiesImg from '../../images/empty_amenities.svg';
import './VenueFeatures.less';

export default function VenueFeatures({ venue }) {
  const firestore = useFirestore();
  const [amenities, setAmenities] = useState([]);
  const [music, setMusic] = useState([]);
  const [capacity, setCapacity] = useState(null);
  const [loadingCapacity, setLoadingCapacity] = useState(false);

  useEffect(() => {
    if (venue) {
      setAmenities(venue.amenities || []);
      setMusic(venue.music || []);
      setCapacity(venue.capacity);
    }
  }, [venue]);

  const addAmenityOrMusic = (name, active, type) => {
    let value = [];
    let path = "";
    if (type === "music") {
      path = "music";
      value = [...music];
      value.push({ name, active });
      setMusic(value);
    } else if (type === "amenities") {
      path = "amenities";
      value = [...amenities];
      value.push({ name, active });
      setAmenities(value);
    }
    return firestore.update({ collection: 'venues', doc: venue.uid }, { [path]: value });
  };

  const deleteMusicType = (name) => {
    Modal.confirm({
      title: "Are you sure you want to delete this music type?",
      content: "* Updates will be made live to B2C DineGo app immediately",
      icon: null,
      okType: "danger",
      className: "delete-modal-confirm",
      cancelButtonProps: { type: "primary" },
      centered: true,
      autoFocusButton: null,
      okText: "Delete",
      onOk: async () => {
        const newMusic = music.filter(x => x.name !== name);
        setMusic(newMusic);
        await firestore.update({ collection: 'venues', doc: venue.uid }, { music: newMusic });
        message.success("Music type was deleted");
      }
    });
  };

  const deleteAmenity = (name) => {
    Modal.confirm({
      title: "Are you sure you want to delete this amenity?",
      content: "* Updates will be made live to B2C DineGo app immediately",
      icon: null,
      okType: "danger",
      className: "delete-modal-confirm",
      cancelButtonProps: { type: "primary" },
      centered: true,
      autoFocusButton: null,
      okText: "Delete",
      onOk: async () => {
        const newAmenities = amenities.filter(x => x.name !== name);
        setAmenities(newAmenities);
        await firestore.update({ collection: 'venues', doc: venue.uid }, { amenities: newAmenities });
        message.success("Amenity was deleted");
      }
    });
  };

  // ✅ Toggle handlers
  const toggleAmenity = async (name, checked) => {
    const newAmenities = amenities.map(a =>
      a.name === name ? { ...a, active: checked } : a
    );
    setAmenities(newAmenities);
    await firestore.update({ collection: 'venues', doc: venue.uid }, { amenities: newAmenities });
  };

  const toggleMusic = async (name, checked) => {
    const newMusic = music.map(m =>
      m.name === name ? { ...m, active: checked } : m
    );
    setMusic(newMusic);
    await firestore.update({ collection: 'venues', doc: venue.uid }, { music: newMusic });
  };

  const getCapacitySliderOpt = () => {
    const step = null;
    const tooltipVisible = false;
    const min = _capacity[0].key;
    const max = _capacity[_capacity.length - 1].key;
    const marks = {};
    for (let i = 0; i < _capacity.length; i++) {
      marks[_capacity[i].key] = _capacity[i].name;
    }
    return { min, max, marks, step, tooltipVisible };
  };

  const capacitySliderOpt = getCapacitySliderOpt();

  const handleCapacity = async (capacity) => {
    if (capacity === venue.capacity) return;
    setLoadingCapacity(true);
    await firestore.update({ collection: 'venues', doc: venue.uid }, { capacity });
    setLoadingCapacity(false);
    message.success("Capacity successfully edited");
  };

  return (
    <Row gutter={[48, 24]}>
      <Col xs={24} md={12} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: 'white' }}>AMENITIES</h1>
          {amenities.length === 0 && (
            <Empty description="You haven't added any amenities yet" image={emptyAmenitiesImg} />
          )}
          {amenities.map(x => (
            <Row key={x.name} justify="space-between" style={{ paddingBottom: 6 }}>
              <Space align="center">
                <Button
                  ghost
                  danger
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => deleteAmenity(x.name)}
                />
                <div style={{ color: 'white' }}>{x.name}</div>
              </Space>
              <Switch
                checked={x.active}
                onChange={(checked) => toggleAmenity(x.name, checked)}
              />
            </Row>
          ))}
        </div>
        <div align="right" style={{ paddingTop: 12 }}>
          <AddAmenity addAmenityOrMusic={addAmenityOrMusic} />
        </div>
      </Col>

      <Col xs={24} md={12} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: 'white' }}>TYPE OF MUSIC</h1>
          {music.length === 0 && (
            <Empty description="You haven't added any types of music yet" image={emptyMusicImg} />
          )}
          {music.map(x => (
            <Row key={x.name} justify="space-between" style={{ paddingBottom: 6 }}>
              <Space align="center">
                <Button
                  ghost
                  danger
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => deleteMusicType(x.name)}
                />
                <div style={{ color: 'white' }}>{x.name}</div>
              </Space>
              <Switch
                checked={x.active}
                onChange={(checked) => toggleMusic(x.name, checked)}
              />
            </Row>
          ))}
        </div>
        <div align="right" style={{ paddingTop: 12 }}>
          <AddMusic addAmenityOrMusic={addAmenityOrMusic} />
        </div>
      </Col>

      <Col xs={24}>
        <Divider style={{ borderColor: '#ffffff1a' }} />
        <h1 align="center" style={{ color: 'white' }}>
          CAPACITY
          <Tooltip
            title="This data will help us calculate the capacity more accurately which in turn will improve the accuracy of your litness score."
            trigger="click"
            placement="bottom"
          >
            <InfoCircleFilled style={{ marginLeft: 4 }} />
          </Tooltip>
        </h1>
        <Slider
          className="capacity-slider"
          marks={capacitySliderOpt.marks}
          min={capacitySliderOpt.min}
          max={capacitySliderOpt.max}
          step={capacitySliderOpt.step}
          tooltipVisible={capacitySliderOpt.tooltipVisible}
          value={capacity}
          onChange={value => setCapacity(value)}
          onAfterChange={handleCapacity}
          disabled={loadingCapacity}
        />
      </Col>
    </Row>
  );
}

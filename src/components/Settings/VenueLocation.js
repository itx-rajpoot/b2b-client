import React, { useRef, useState } from 'react'
import { Button, Col, Input, message, Row, Modal, Space } from 'antd';
import { LoadingOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { apiCall } from '../../services/api';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import axios from "axios";
import { useSelector } from 'react-redux';

function VenueLocation({ venueId, google, zoom, center, updateVenueLocation, venuePosition }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [address, setAddress] = useState([]);
  const [searchedAddress, setSearchedAddress] = useState("");
  const currentUser = useSelector((state) => state.currentUser);
  const MapRef = useRef();
  
  const showModal = () => {
    setVisible(true);
    if(venuePosition.latitude && venuePosition.longitude){
      setLatitude(venuePosition.latitude);
      setLongitude(venuePosition.longitude);
    }
  };

  const onReadyMap = () => {
    if(venuePosition.latitude && venuePosition.longitude){
      MapRef.current.map.panTo({
        lat: venuePosition.latitude,
        lng: venuePosition.longitude
      });
    }
  }

  const getAddress = (lat, lon) => {
    setLoadingAddress(true);
    const params = {
      access_key: '428426a41ea43764430084973d6a5b65',
      query: `${lat},${lon}`,
      limit: 5
    }
    axios.get("http://api.positionstack.com/v1/reverse", { params })
      .then(res => {
        if(res.data.data){
          console.log(res.data.data);
          const address = res.data.data.find(x => x.type === "address");
          if(address) {
            setAddress([
              address.street,
              address.number,
              address.region,
              address.county,
              address.country,
            ]);
          } else {
            setAddress([]);
          }
        }
        setLoadingAddress(false);
      })
      .catch(err => {
        console.log(err);
        setAddress([]);
        setLoadingAddress(false);
      });
  }
  const getLatitudeAndLongitude = () => {
    if(!searchedAddress) {
      message.destroy();
      return message.error("Please enter an address");
    }
    setLoadingLocation(true);
    const params = {
      access_key: '428426a41ea43764430084973d6a5b65',
      query: searchedAddress,
      limit: 5
    }
    axios.get("http://api.positionstack.com/v1/forward", { params })
      .then(res => {
        if(res.data.data){
          console.log(res.data.data);
          const location = res.data.data[0];
          if(location) {
            setLatitude(location.latitude);
            setLongitude(location.longitude);
            MapRef.current.map.panTo({
              lat: location.latitude,
              lng: location.longitude
            });
          } else {
            message.destroy();
            message.warn('No results found');
            setLatitude(null);
            setLongitude(null);
          }
        }
        setAddress([]);
        setLoadingLocation(false);
      })
      .catch(err => {
        console.log(err);
        setAddress([]);
        setLatitude(null);
        setLongitude(null);
        setLoadingLocation(false);
      });
  }

  const handleSave= () => {
    const newLatitude = Number(latitude);
    const newLongitude = Number(longitude);
    if (isNaN(newLatitude) || isNaN(newLongitude)){
      message.destroy();
      return message.warn("Latitude/Longitude must be a valid number");
    }
    setLoading(true);
    apiCall("post", `/api/admin/${currentUser.id}/venues/${venueId}/location`, {
      latitude: newLatitude, 
      longitude: newLongitude,
    })
    .then(async ({ position }) => {
      console.log("Position is: ", position);
      message.destroy();
      message.success("Venue's location successfully updated!");
      setLoading(false);
      setVisible(false);
    })
    .catch(err => {
      message.destroy();
      message.error(err.message);
      setLoading(false);
      setVisible(false);
    });
  };

  const handleCancel = () => {
    if(loading) return;
    setVisible(false);
  };

  const handleMapClick = (ref, map, ev) => {
    if(loading) return;
    const location = ev.latLng;
    console.log(location);
    setLatitude(location.lat());
    setLongitude(location.lng());
    map.panTo(location);
  };

  const setCurrentLocation = async () => {
    setLoadingGeo(true);
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      message.destroy();
      message.success("Your current location was set!");
      setLoadingGeo(false);
      MapRef.current.map.panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      getAddress(position.coords.latitude, position.coords.longitude);
    }, (err) => {
      console.log(err);
      message.destroy();
      message.error(err.message);
      setLoadingGeo(false);
    });
  }

  return (
    <div>
      <Button onClick={showModal}>
        Change location
      </Button>
      <Modal 
        title="Change Venue Location" 
        visible={visible} 
        onOk={handleSave} 
        onCancel={handleCancel}
        width={600}
        footer={[
          <Button key="info" type="text" icon={venuePosition.position ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />} style={{ cursor: 'initial' }}>
            {venuePosition.position ? "Geolocation hash is saved" : "Missing geolocation hash"}
          </Button>,
          <Button key="cancel" onClick={handleCancel} disabled={loading}>Cancel</Button>,
          <Button key="save" type="primary" onClick={handleSave} loading={loading}>Save location</Button>,
        ]}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Space>
              <Input style={{ width: 160 }} disabled={loading || loadingGeo} value={latitude} placeholder="Enter latitude" onChange={e => setLatitude(e.target.value)} />
              <Input style={{ width: 160 }} disabled={loading || loadingGeo} value={longitude} placeholder="Enter longitude" onChange={e => setLongitude(e.target.value)} />
              <Button onClick={setCurrentLocation} disabled={loading} loading={loadingGeo}>
                Get current location
              </Button>
            </Space>
            <p><em>{loadingAddress ? <LoadingOutlined /> : address.length > 0 ? `Closest address: ${address.join(" ")}` : null}</em></p>
          </Col>
          <Col xs={24}>
            <Space>
              <Input style={{ width: 260 }} disabled={loading || loadingLocation} placeholder="Enter address" value={searchedAddress} onChange={e => setSearchedAddress(e.target.value)} />
              <Button onClick={getLatitudeAndLongitude} disabled={loading} loading={loadingLocation}>
                Find latitude/longitude from address
              </Button>
            </Space>
          </Col>
          <Col xs={24} style={{ textAlign: "center" }}>
            Click on the map to change the pin location
          </Col>

          <Col xs={24} style={{ minHeight: 500 }}>
            <Map
              ref={MapRef}
              google={google}
              style={{ height: '100%', width: "100%", maxWidth: 550, borderRadius: 12, overflow: "hidden" }}
              zoom={zoom}
              initialCenter={center}
              onClick={handleMapClick}
              onReady={onReadyMap}
            >
              {latitude && longitude && (
                <Marker
                  position={{ lat: latitude, lng: longitude }}
                />
              )}
            </Map>
          </Col>
        </Row>
      </Modal>
    </div>
  )
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyA3YMT3J2ZTZRvC11Z3B89zjairplArq3I"),
  libraries: []
})(VenueLocation)
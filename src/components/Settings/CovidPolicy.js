import { useState, useEffect } from 'react'
import { Col, message, Row, Switch } from 'antd'
import { useFirestore } from 'react-redux-firebase';
import './CovidPolicy.css';
import FaceMaskIcon from '../../assets/icons/FaceMaskIcon';
import OutdoorIcon from '../../assets/icons/OutdoorIcon';
import DistancingIcon from '../../assets/icons/DistancingIcon';
import CleaningIcon from '../../assets/icons/CleaningIcon';
import TemperatureIcon from '../../assets/icons/TemperatureIcon';
import VaccineIcon from '../../assets/icons/VaccineIcon';

const policies = [
  { key: "outdoor_seating", title: "Outdoor seating", icon: <OutdoorIcon /> },
  { key: "social_distance", title: "Social distance", icon: <DistancingIcon /> },
  { key: "masks", title: "Masks", icon: <FaceMaskIcon /> },
  { key: "cleaning_desinfecting", title: "Cleaning/Disinfecting", icon: <CleaningIcon /> },
  { key: "temperature_checks", title: "Temperature checks", icon: <TemperatureIcon /> },
  { key: "vaccination", title: "Vaccination", icon: <VaccineIcon /> },
];

export default function CovidPolicy({ venue }) {
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState([]);

  useEffect(() => {
    if(venue){
      const newSelection = [];
      for (const key in venue.covidPolicy) {
        if (Object.hasOwnProperty.call(venue.covidPolicy, key)) {
          if(venue.covidPolicy[key]){
            newSelection.push(key);
          }
        }
      }
      setSelection(newSelection);
    }
    return () => {}
  }, [venue, setSelection])

  
  const handleSwitchChange = async (key) => {
    console.log(key)
    const newCovidPolicy = { ...venue.covidPolicy };
    if (selection.indexOf(key) > -1) {
      setSelection(selection.filter(x => x !== key));
      newCovidPolicy[key] = false;
    } else {
      setSelection([...selection, key]);
      newCovidPolicy[key] = true;
    }
    setLoading(key);
    await firestore.update({ collection: 'venues', doc: venue.uid }, { covidPolicy: newCovidPolicy });
    setLoading(false);
    message.destroy();
    message.success('Successfully saved!');
  }

  return (
    <Row gutter={[24, 32]} style={{ paddingTop: 24 }}>
      {policies.map(x => {
        const checked = selection.indexOf(x.key) > -1;
        return (
          <Col xs={24} md={8} key={x.key} align="center">
            <h1 style={{ color: 'white' }}>{x.title}</h1>
            <div className={`covid-policy-img-container ${checked ? "covid-policy-checked": ""}`}>
              {x.icon}
            </div>
            <div style={{ paddingTop: 12 }}>
              <Switch 
                disabled={loading && loading !== x.key} 
                checked={checked} 
                loading={loading && loading === x.key}
                onChange={() => handleSwitchChange(x.key)} 
              />
            </div>
          </Col>
        );
      })}
    </Row>
  )
}

import React from 'react'
import { Button, Empty, Tabs } from 'antd';
import { Route, Switch, Redirect, useHistory, useLocation, useParams } from 'react-router-dom';
import VenueInfo from '../../components/Settings/VenueInfo'
import CovidPolicy from '../../components/Settings/CovidPolicy';
import VenueFeatures from '../../components/Settings/VenueFeatures';
import VenueMisc from '../../components/Settings/VenueMisc';
import { useFirestoreConnect } from 'react-redux-firebase';

const { TabPane } = Tabs;

export default function VenueHandler({ venues }) {
  const history = useHistory();
  const location = useLocation();
  const { venue_id } = useParams();
  const venue = venues.find((x) => x.venueId === venue_id);

  useFirestoreConnect(venue_id ? [
    { collection: 'litnessData', where: ['venueid', '==', venue_id] },
  ] : []);
  
  if (!venue) {
    return (
      <Empty
        imageStyle={{
          height: 60,
        }}
        description="Oops! Couldn't find this venue. Please, try again."
      >
        <Button type="primary" onClick={() => history.push('/admin/venues')}>Go back</Button>
      </Empty>
    );
  }

  return (
    <div>
      <Tabs activeKey={location.pathname} centered type="card" onChange={history.push}>
        <TabPane tab="Info" key={`/admin/venues/${venue_id}/info`} />
        <TabPane tab="Covid policy" key={`/admin/venues/${venue_id}/covid-policy`} />
        <TabPane tab="Features" key={`/admin/venues/${venue_id}/features`} />
        <TabPane tab="Misc" key={`/admin/venues/${venue_id}/misc`} />
      </Tabs>
      <Switch>
        <Route exact path="/admin/venues/:venue_id/info">
          <VenueInfo venue={venue} onAdmin={true} />
        </Route>
        <Route exact path="/admin/venues/:venue_id/covid-policy">
          <CovidPolicy venue={venue} onAdmin={true} />
        </Route>
        <Route exact path="/admin/venues/:venue_id/features">
          <VenueFeatures venue={venue} onAdmin={true} />
        </Route>
        <Route exact path="/admin/venues/:venue_id/misc">
          <VenueMisc venue={venue} onAdmin={true}  />
        </Route>
        <Redirect to="/admin/venues/:venue_id/info" />
      </Switch>
    </div>
  );
}

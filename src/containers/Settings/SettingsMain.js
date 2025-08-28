import { Tabs } from 'antd';
import VenueInfo from '../../components/Settings/VenueInfo';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Billing from '../../components/Settings/Billing';
import CovidPolicy from '../../components/Settings/CovidPolicy';
import VenueFeatures from '../../components/Settings/VenueFeatures';

const { TabPane } = Tabs;

export default function SettingsMain({ venue }) {
  const history = useHistory();
  const location = useLocation();
  return (
    <div>
      <Tabs activeKey={location.pathname} centered type="card" onChange={history.push}>
        <TabPane tab="Info" key="/settings/info" />
        <TabPane tab="Covid policy" key="/settings/covid-policy" />
        <TabPane tab="Features" key="/settings/features" />
        <TabPane tab="Staff" key="/settings/staff" disabled />
        <TabPane tab="Setup Notification" key="/settings/setup-notification" disabled />
        <TabPane tab="Billing" key="/settings/billing" />
      </Tabs>
      <Switch>
        <Route path="/settings/info">
          <VenueInfo venue={venue} />
        </Route>
        <Route path="/settings/covid-policy">
          <CovidPolicy venue={venue} />
        </Route>
        <Route path="/settings/features">
          <VenueFeatures venue={venue} />
        </Route>
        <Route path="/settings/staff">Upcoming!</Route>
        <Route path="/settings/setup-notification">Upcoming!</Route>
        <Route path="/settings/billing">
          <Billing venue={venue} />
        </Route>
        <Redirect to="/settings/info" />
      </Switch>
    </div>
  );
}

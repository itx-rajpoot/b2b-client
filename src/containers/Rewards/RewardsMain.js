import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import RewardsDisplay from '../../components/Rewards/RewardsDisplay';
import RewardDisplay from '../../components/Rewards/RewardDisplay';
import { parseRewards } from '../../utils/collectionParsers';

export default function RewardsMain() {
  const currentUser = useSelector((state) => state.currentUser);
  const rewards = useSelector((state) => parseRewards(state.firestore.data.rewards));
  return (
    <Switch>
      <Route path={["/rewards/add", "/rewards/:reward_id"]}>
        <RewardDisplay venueId={currentUser.id} rewards={rewards} />
      </Route>
      <Route path="/rewards">
        <RewardsDisplay venueId={currentUser.id} rewards={rewards} />
      </Route>
      <Redirect to="/rewards" />
    </Switch>
  );
}

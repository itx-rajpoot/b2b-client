import React from 'react'
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import OrderDetails from '../../components/OrderReport/OrderDetails';
import OrdersView from '../../components/Orders/OrdersView';
import { parseItems, parseOrders } from '../../utils/collectionParsers';

export default function OrdersMain({ venue }) {
  const orders = useSelector((state) => parseOrders(state.firestore.data.orders));
  const items = useSelector((state) => parseItems(state.firestore.data.items));
  return (
    <Switch>
      <Route path={["/tab-timeline/process", "/tab-timeline/completed", "/tab-timeline/cancelled"]}>
        <OrdersView venue={venue} orders={orders} items={items} />
      </Route>
      <Route exact path="/tab-timeline/:order_id">
        <OrderDetails venue={venue} orders={orders} items={items} />
      </Route>
      <Redirect to="/tab-timeline/process" />
    </Switch>
  );
}

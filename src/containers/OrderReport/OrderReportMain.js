import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import OrderDetails from "../../components/OrderReport/OrderDetails";
import OrderReportTable from "../../components/OrderReport/OrderReportTable";
import { parseItems, parseOrders } from "../../utils/collectionParsers";

export default function OrderReportMain() {
  const orders = useSelector((state) => parseOrders(state.firestore.data.orders));
  const items = useSelector((state) => parseItems(state.firestore.data.items));
  return (
    <Switch>
      <Route path="/tab-report/:order_id">
        <OrderDetails orders={orders} items={items} />
      </Route>
      <Route path="/tab-report">
        <OrderReportTable orders={orders} items={items} />
      </Route>
      <Redirect to="/tab-report" />
    </Switch>
  )
}

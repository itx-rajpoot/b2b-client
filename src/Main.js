import "./App.less";
import { Layout, Menu, Dropdown, Modal, Skeleton } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, Redirect, Route, Switch, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";

import SettingsMain from "./containers/Settings/SettingsMain";
import OrdersMain from "./containers/Orders/OrdersMain";
import MenuMain from "./containers/Menu/MenuMain";
import OrdersReportMain from "./containers/OrderReport/OrderReportMain";
import RewardsMain from "./containers/Rewards/RewardsMain";
import Sidebar from "./Sidebar";
import ErrorBoundary from "./ErrorBoundary";
import { logout } from "./store/actions/auth";

const { Header, Content } = Layout;

function Main() {
  const currentUser = useSelector((state) => state.currentUser);
  const [collapsed, setCollapsed] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  // Firestore data binding
  useFirestoreConnect([
    { collection: "venues", doc: currentUser.id },
    { collection: "menus", where: ["venue", "==", currentUser.id] },
    { collection: "orders", where: ["venue", "==", currentUser.id] },
    { collection: "rewards", where: ["venue", "==", currentUser.id] },
    { collection: "items", where: ["venue", "==", currentUser.id] },
  ]);

  const venue = useSelector(
    ({ firestore: { data } }) => data.venues && data.venues[currentUser.id]
  );

  const handleLogout = () => {
    Modal.confirm({
      title: "Do you want to log out?",
      onOk: () => dispatch(logout()),
      className: "delete-modal-confirm",
      icon: null,
      cancelButtonProps: { type: "text" },
      okText: "Yes, log out",
      cancelText: "No",
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => history.push("/settings/info")}>
        Settings
      </Menu.Item>
      <Menu.Item key="1">Talk with support</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={handleLogout}>
        Log out
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout id="app">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        style={{ marginLeft: collapsed ? 60 : 200, transition: "all 0.35s" }}
      >
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <div className="header-content">
            <img src={require("./images/isotype.png")} alt="Logo" height={40} />
            <Dropdown overlay={menu} trigger={["click"]}>
              <span className="dropdown-link">
                {currentUser.name} <DownOutlined />
              </span>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <ErrorBoundary>
            <Switch>
              <Route path="/tab-timeline">
                {venue ? <OrdersMain venue={venue} /> : <Skeleton active />}
              </Route>
              <Route path="/tab-report">
                {venue ? <OrdersReportMain /> : <Skeleton active />}
              </Route>
              <Route path="/menu">
                {venue ? <MenuMain /> : <Skeleton active />}
              </Route>
              <Route path="/rewards">
                {venue ? <RewardsMain /> : <Skeleton active />}
              </Route>
              <Route path="/settings">
                {venue ? <SettingsMain venue={venue} /> : <Skeleton active />}
              </Route>
              <Redirect to="/tab-timeline" />
            </Switch>
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Main;

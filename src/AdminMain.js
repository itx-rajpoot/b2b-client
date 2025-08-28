import "./App.less";
import { Layout, Menu, Dropdown, Modal, Skeleton } from "antd";
import { DownOutlined, TableOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Switch, Route, Redirect, useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import isotype from "./images/isotype.png";
import { useDispatch } from "react-redux";
import { logout } from "./store/actions/auth";
import ErrorBoundary from "./ErrorBoundary";
import logo_dark from './images/logo_dark.png';
import VenuesDisplay from "./containers/Admin/VenuesDisplay";
import { useFirestoreConnect } from "react-redux-firebase";
import VenueHandler from "./containers/Admin/VenueHandler";
import AdminBreadcrumb from "./AdminBreadcrumb";
import { parseVenues } from "./utils/collectionParsers";

const { Header, Content, Sider } = Layout;

function AdminMain() {
  const currentUser = useSelector((state) => state.currentUser);
  const [collapsed, setCollapsed] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  useFirestoreConnect([{ collection: 'venues' }]);
  const venues = useSelector((state) => parseVenues(state.firestore.data.venues));
  const pathnameSplit = location.pathname.split("/");
  const selectedKey = pathnameSplit.length > 2 ? pathnameSplit.slice(0, 3).join('/') : "";

  useEffect(() => {
    // dispatch(getVenueInfo(currentUser.id))
    return () => {};
  }, [currentUser, dispatch]);

  const handleLogout = () => {
    Modal.confirm({
      title: "Do you want to log out?",
      onOk: () => dispatch(logout()),
      okText: "Yes, log out",
      cancelText: "No",
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="3" onClick={handleLogout}>
        Log out
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout id="app">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="dark"
        style={{
          background: "#081B33",
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div className="logo" style={{ height: collapsed ? 64 : 128 }}>
          <img src={logo_dark} alt="" width="75%" />
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} style={{ background: "#081B33", fontSize: 16 }}>
          <Menu.Item key="/admin/venues" icon={<TableOutlined />} onClick={() => history.push('/admin/venues')}>
            Venues
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout
        style={{ marginLeft: collapsed ? 60 : 180, transition: "all 0.35s" }}
      >
        <Header
          style={{
            padding: "0px 24px",
            background: "#081B33",
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 3px 8px 0 rgb(0 0 0 / 10%)",
          }}
        >
          <div style={{ padding: '0px 24px' }}>
            <AdminBreadcrumb venues={venues} />
          </div>
          <Dropdown overlay={menu} trigger={["click"]}>
            <div className="header-menu">
              <div className="isotype-wrapper">
                <img src={isotype} alt="" />
              </div>
              <DownOutlined style={{ marginLeft: 6, color: 'white' }} />
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            padding: "60px 42px",
            background: "#152642",
          }}
        >
          <ErrorBoundary>
            <Switch>
              <Route path="/admin/venues/:venue_id">
                {venues.length > 0 ? <VenueHandler venues={venues} /> : <Skeleton active />}
              </Route>
              <Route 
                path="/admin/venues"
                render={(props) => venues.length > 0 ? <VenuesDisplay venues={venues} currentUser={currentUser} {...props} /> : <Skeleton active />}
              >
              </Route>
              <Redirect to="/admin/venues" />
            </Switch>
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminMain;

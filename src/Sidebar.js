import React from 'react'
import { Layout, Menu } from 'antd';
import {
  ShoppingCartOutlined,
  ContainerOutlined,
  ReadOutlined,
  StarOutlined,
  SettingOutlined
} from '@ant-design/icons';
import logo_dark from './images/logo_dark.png';
import { useHistory, useLocation } from 'react-router-dom';
const { Sider } = Layout;

export default function Sidebar({ collapsed, setCollapsed }) {
  const history = useHistory();
  let location = useLocation();
  const pathnameSplit = location.pathname.split("/");
  const selectedKey = pathnameSplit.length > 1 ? pathnameSplit[1] : "";
  return (
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
      <Menu theme="dark" mode="inline" selectedKeys={[`/${selectedKey}`]} style={{ background: "#081B33", fontSize: 16 }} onSelect={e => history.push(e.key)}>
        <Menu.Item key="/tab-timeline" icon={<ShoppingCartOutlined />}>
          Tab Timeline
        </Menu.Item>
        <Menu.Item key="/tab-report" icon={<ContainerOutlined />}>
          Tab Report
        </Menu.Item>
        <Menu.Item key="/menu" icon={<ReadOutlined />}>
          Menu
        </Menu.Item>
        <Menu.Item key="/rewards" icon={<StarOutlined />}>
          Rewards
        </Menu.Item>
        <Menu.Item key="/settings" icon={<SettingOutlined />}>
          Settings
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

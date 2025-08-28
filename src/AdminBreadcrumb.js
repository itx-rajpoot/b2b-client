import { Breadcrumb } from 'antd';
import { LoadingOutlined, HomeOutlined } from "@ant-design/icons";
import { Link, useLocation } from 'react-router-dom';

const breadcrumbNameMap = {
  '/admin': <HomeOutlined />,
  '/admin/venues': 'Venues',
  '/admin/venues/:venue_id/info': 'Info',
  '/admin/venues/:venue_id/covid-policy': 'Covid policy',
  '/admin/venues/:venue_id/features': 'Features',
};

const AdminBreadcrumb = ({ venues }) => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    if (index === 2) {
      const venue = venues.find((x) => x.venueId === _);
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url} style={{ fontSize: 18 }}>{venue ? venue.name || "[Restaurant Name]" : <LoadingOutlined />}</Link>
        </Breadcrumb.Item>
      );
    } else if (index === 3) {
      const newUrl = `/${pathSnippets.slice(0, 2).join('/')}/:venue_id/${_}`;
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url} style={{ fontSize: 18 }}>{breadcrumbNameMap[newUrl]}</Link>
        </Breadcrumb.Item>
      );
    }
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url} style={{ fontSize: 18 }}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });
  return (
    <Breadcrumb>{breadcrumbItems}</Breadcrumb>
  );
};

export default AdminBreadcrumb;

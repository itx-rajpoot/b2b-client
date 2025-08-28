import { useFirestore, useFirebase } from 'react-redux-firebase';
import { Input, Button, Col, Row, Tabs, Table, Space, Modal, message, Tag, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import AddCategory from './AddCategory';
import { getSize } from '../../utils/itemOptions';
import emptyItemsImg from '../../images/empty_items.svg';
import Highlighter from 'react-highlight-words';

const { TabPane } = Tabs;

const filterItems = (items, category, subcategory) => {
  if(!category) return items;
  if(category === "All categories" && subcategory === "All subcategories") return items;
  if(category === "All categories"){
    return items.filter(x => subcategory ? x.subcategory.indexOf(subcategory) > -1 : true)
  }
  return items.filter(x => x.category === category && (subcategory && subcategory !== "All subcategories" ? x.subcategory.indexOf(subcategory) > -1 : true));
}

export default function MenuDisplay({ menu, categories, items }) {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState();
  const [subcategory, setSubcategory] = useState();
  const [searchText, setSearchText] = useState("");
  const history = useHistory();
  const location = useLocation();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const venueImagesPath = `venueImages/${menu?.venue}/items`;

  useEffect(() => {
    if(categories.length > 0){
      setCategory(categories[0].name);
      if(categories[0].subcategories.length > 0) {
        setSubcategory(categories[0].subcategories[0]);
      }
    }
    return () => {}
  }, [categories, setCategory, setSubcategory]);

  useEffect(() => {
    if (location.state && location.state.category) {
      const foundCategory = categories.find(x => x.name === location.state.category);
      if (foundCategory) {
        setCategory(foundCategory.name);
        if (location.state.subcategory) {
          setSubcategory(location.state.subcategory);
        } else {
          if(foundCategory.subcategories.length > 0) {
            setSubcategory(foundCategory.subcategories[0]);
          }
        }
      }
    }
    return () => {}
  }, [categories, location]);

  const onNewCategory = () => {
    console.log("onNewCategory");
    history.push("/menu/categories")
  }
  const onNewSubcategory = () => {
    console.log("onNewSubcategory");
    history.push("/menu/subcategories", { category });
  }

  const handleDeleteItem = (item) => {
    Modal.confirm({
      title: "Do you want to delete this menu item?",
      content: "* Updates will be made live to B2C DineGo App immediately",
      icon: null,
      okType: "danger",
      className: "delete-modal-confirm",
      cancelButtonProps: { type: "primary" },
      centered: true,
      autoFocusButton: null,
      okText: "Delete",
      onOk: async () => {
        setLoading(true);
        if(item.img) {
          await firebase.deleteFile(`${venueImagesPath}/${item.img.name}`);
        }
        await firestore.delete({ collection: 'items', doc: item.itemId });
        setLoading(false);
        message.destroy();
        message.success("Menu item successfully deleted");
        return Promise.resolve();
      }
    });
  }

  const handleCategoryChange = (newCategory) => {
    const categoryIndex = categories.findIndex(x => x.name === newCategory);
    setCategory(newCategory);
    if(newCategory !== "All categories"){
      setSubcategory(categories[categoryIndex].subcategories.length > 0 ? categories[categoryIndex].subcategories[0] : undefined);
    } else {
      setSubcategory("All subcategories");
    }
  }
  const handleSubcategoryChange = (newCategory) => {
    if(newCategory === "edit") return onNewSubcategory();
    setSubcategory(newCategory);
  }

  const goToEditItem = (item) => {
    history.push(`/menu/items/${item.itemId}`);
  }
  const goToAddItem = (defaultCategory, defaultSubcategory = "Not listed") => {
    history.push('/menu/items/add', {
      defaultCategory, 
      defaultSubcategory
    });
  }

  const columns = [
    {
      title: 'Item',
      dataIndex: 'img',
      key: 'img',
      render: img => <img src={img ? img.url : "https://i.stack.imgur.com/y9DpT.jpg"} alt="" height={80} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => searchText ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      key: 'subcategory',
      render: subcategory => subcategory ? subcategory.join("; ") : ""
    },
    {
      title: 'Availability',
      dataIndex: 'available',
      key: 'available',
      render: text => <Tag color={text ? "green" : "red"}>{text ? "Available" : "Unavailable"}</Tag>
    },
    {
      title: 'Add-ons',
      dataIndex: 'addons',
      key: 'addons',
      render: text => text ? text.join("; ") : ""
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: getSize
    },
    {
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button
            size="small"
            type="primary"
            ghost
            onClick={() => goToEditItem(record)}
            icon={<EditOutlined />}
          />
          <Button icon={<DeleteOutlined />} type="danger" ghost size="small" onClick={() => handleDeleteItem(record)} />
        </Space>
      ),
    },
  ];
  return (
    <div style={{ paddingTop: 32 }}>
      <Tabs
        centered
        type="editable-card"
        onEdit={onNewCategory}
        addIcon={<EditOutlined />}
        hideAdd={categories.length === 0}
        tabBarStyle={{ margin: 0 }}
        onChange={handleCategoryChange}
        activeKey={category}
      >
        {categories.length === 0 && (
          <TabPane key="No categories" tab="No categories" closable={false} />
        )}
        {categories.length > 1 && (
          <TabPane 
            key="All categories" 
            tab="All categories" 
            closable={false} 
          >
            <Tabs
              centered
              style={{ paddingTop: 4 }}
              onChange={handleSubcategoryChange}
              activeKey={subcategory}
            >
              {categories.map(x => x.subcategories).flat(1).length > 1 && (
                <TabPane 
                  key="All subcategories" 
                  tab="All subcategories" 
                  closable={false} 
                />
              )}
              {categories.map(x => x.subcategories).flat(1).map(y => (
                <TabPane tab={y} key={y} />
              ))}
              {items.findIndex(item => item.subcategory.indexOf("Not listed") > -1) > -1 && (
                <TabPane 
                  key="Not listed" 
                  tab="Not listed" 
                />
              )}
            </Tabs>
          </TabPane>
        )}
        {categories.map(x => {
          const showUnlisted = items.findIndex(item => item.category === x.name && item.subcategory.indexOf("Not listed") > -1) > -1;
          return (
            <TabPane tab={x.name} key={x.name} closable={false}>
              <Tabs
                centered
                style={{ paddingTop: 4 }}
                onChange={handleSubcategoryChange}
                activeKey={subcategory}
              >
                {x.subcategories.length > 1 && (
                  <TabPane 
                    key="All subcategories" 
                    tab="All subcategories" 
                    closable={false} 
                  />
                )}
                {x.subcategories.map(y => (
                  <TabPane tab={y} key={y} />
                ))}
                {(x.subcategories.length === 0 && !showUnlisted) && (
                  <TabPane 
                    key="No subcategories"
                    tab="No subcategories"
                  />
                )}
                {showUnlisted && (
                  <TabPane 
                    key="Not listed" 
                    tab="Not listed" 
                  />
                )}
                <TabPane 
                  key="edit" 
                  tab={<Button type="text" size="small" icon={<EditOutlined />}/>} 
                  onClick={onNewSubcategory}
                />
              </Tabs>
            </TabPane>
          );
        })}
      </Tabs>
      {categories.length === 0 ? (
        <div style={{ padding: "32px 0px" }}>
          <Empty description="You haven't added a category for your menu">
            <AddCategory 
              menu={menu}
              categories={menu ? menu.categories : []}
            />
          </Empty>
        </div>
      ) : (
        <>
          <Row justify="space-between">
            <Col>
              <Input 
                allowClear
                value={searchText}
                placeholder="Search items" 
                prefix={<SearchOutlined />}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 200 }} 
              />
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={() => goToAddItem(category, subcategory)}
                icon={<PlusOutlined />}
              >
                Add item
              </Button>
            </Col>
          </Row>
          <div style={{ paddingTop: 24 }}>
            <Table
              rowKey="itemId"
              columns={columns}
              dataSource={filterItems(items, category, subcategory).filter(x => searchText ? x.name.localeCompare(searchText) > -1 : true)}
              loading={loading}
              locale={{
                emptyText: (
                  <Empty 
                    image={emptyItemsImg} 
                    description={searchText ? `No matches for your search "${searchText}"` : "No items were found" }
                  />
                )
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

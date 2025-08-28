import { useFirestore } from 'react-redux-firebase';
import { Button, Col, Row, Space, Tabs, Modal, message, Empty } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import AddSubcategory from './AddSubcategory';
import { useState } from 'react';
import emptySubcategoriesImg from '../../images/empty_categories.svg';

const { TabPane } = Tabs;

export default function MenuSubcategories({ menu, items }) {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const firestore = useFirestore();

  const handleDeleteSubcategory = (subcategoryName, categoryName) => {
    if(loading) return;
    Modal.confirm({
      title: "Do you want to delete this subcategory?",
      content: "* Updates will be made live to B2C DineGo App immediately",
      icon: null,
      okType: "danger",
      className: "delete-modal-confirm",
      cancelButtonProps: { type: "primary" },
      centered: true,
      onOk: async () => {
        setLoading(true);
        
        // Deleting the subcategory
        const newCategories = JSON.parse(JSON.stringify(menu.categories));
        const index = newCategories.findIndex(x => x.name === categoryName);
        if(index === -1) {
          message.destroy();
          return message.error("An error happened. Please contact support");
        }
        newCategories[index].subcategories = newCategories[index].subcategories.filter(x => x !== subcategoryName);
        await firestore.update({ collection: 'menus', doc: menu.menuId }, { categories: newCategories });
        
        // Logic to handle items with that deleted subcategory
        const itemsToPut = [];
        console.log("iterating over items ", items)
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          for (let j = 0; j < item.subcategory.length; j++) {
            const subcategory = item.subcategory[j];
            if (subcategory === subcategoryName) {
              // Item belongs to the deleted subcategory
              itemsToPut.push(item);
              break;
            }
          }
        }

        console.log("Items to be modifed due to subcategory deletion: ", itemsToPut.length);
        console.log("itemsToPut", itemsToPut);

        // Handling items in case there is any action pending
        if (itemsToPut.length > 0) {
          let batch = firestore.batch();
          itemsToPut.forEach((item) => {
            const currentDocRef = firestore.collection("items").doc(item.itemId);
            const newSubcategory = item.subcategory.filter(x => x !== subcategoryName);
            batch.update(currentDocRef, { 
              subcategory: newSubcategory.length === 0 ? ['Not listed'] : newSubcategory
            });
          })
          await batch.commit();
        }


        setLoading(false);
        message.destroy();
        message.success("Subcategory successfully deleted");
        return Promise.resolve();
      }
    })
  }
  console.log('default category', location.state)
  return (
    <div>
      <div>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => history.push("/menu")}>
          Back
        </Button>
      </div>
      <h1 align="center">Edit Subcategories</h1>
      <Tabs
        type="card"
        centered
        defaultActiveKey={location.state ? location.state.category : undefined}
      >
        {menu && menu.categories.map(x => (
          <TabPane tab={x.name} key={x.name} closable={false}>
            <div style={{ maxWidth: 400, margin: "auto" }}>
              {x.subcategories.length === 0 && (
                <Empty 
                  image={emptySubcategoriesImg}
                  description="You haven't create any subcategory yet" 
                  style={{ padding: "24px 0px 12px" }} 
                />
              )}
              {x.subcategories.map(y => (
                <Row key={y} justify="space-between" style={{ paddingBottom: 12 }}>
                  <Col>{y}</Col>
                  <Col>
                    <Space>
                      <AddSubcategory 
                        edit 
                        subcategory={y} 
                        menu={menu} 
                        categoryName={x.name} 
                        subcategories={x.subcategories}
                      />
                      <Button 
                        icon={<DeleteOutlined />} 
                        type="danger" 
                        ghost 
                        size="small" 
                        onClick={() => handleDeleteSubcategory(y, x.name)} 
                      />
                    </Space>
                  </Col>
                </Row>
              ))}
              <AddSubcategory 
                menu={menu} 
                categoryName={x.name} 
                subcategories={x.subcategories}
              />
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}

import { useState } from 'react';
import { Button, Col, Row, Space, Modal, message, Empty } from 'antd';
import { useFirestore } from 'react-redux-firebase';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import AddCategory from './AddCategory';
import emptyCategoriesImg from '../../images/empty_categories.svg';

export default function MenuCategories({ menu, items }) {
  const [loading, setLoading] = useState(false);
  const firestore = useFirestore();
  const history = useHistory();

  const handleDeleteCategory = (categoryName) => {
    if(loading) return;
    Modal.confirm({
      title: "Do you want to delete this category?",
      content: "* Updates will be made live to B2C DineGo App immediately",
      icon: null,
      okType: "danger",
      className: "delete-modal-confirm",
      cancelButtonProps: { type: "primary" },
      centered: true,
      onOk: async () => {
        setLoading(true);
        const newCategories = menu.categories.filter(x => x.name !== categoryName);
        await firestore.update({ collection: 'menus', doc: menu.menuId }, { categories: newCategories });

        // Logic to handle items with that deleted category
        const itemsToPut = [];
        console.log("iterating over items ", items)
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.category === categoryName) {
            // Item belongs to the deleted category
            itemsToPut.push(item);
          }
        }

        console.log("Items to be modifed due to category deletion: ", itemsToPut.length);
        console.log("itemsToPut", itemsToPut);

        // Handling items in case there is any action pending
        if (itemsToPut.length > 0) {
          let batch = firestore.batch();
          itemsToPut.forEach((item) => {
            const currentDocRef = firestore.collection("items").doc(item.itemId);
            batch.update(currentDocRef, { 
              category: "Untitled"
            });
          })
          // Add the "Untitled" category in case it doesn't exist
          const foundUntitledIdx = menu.categories.findIndex(x => x.name === "Untitled");
          if (foundUntitledIdx === -1) {
            const currentMenuDocRef = firestore.collection("menus").doc(menu.menuId);
            batch.update(currentMenuDocRef, { 
              categories: [
                ...newCategories, 
                {
                  name: "Untitled",
                  subcategories: []
                }
              ]
            });
          }
          await batch.commit();
        }
        
        setLoading(false);
        message.destroy();
        message.success("Category successfully deleted");
        return Promise.resolve();
      }
    })
  }
  return (
    <div>
      <div>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => history.push("/menu")}>
          Back
        </Button>
      </div>
      <h1 align="center">Edit Categories</h1>
      <div style={{ maxWidth: 400, margin: "auto" }}>
        {menu && menu.categories.length === 0 && (
          <Empty
            image={emptyCategoriesImg} 
            description="You haven't create any category yet" 
            style={{ padding: "24px 0px 12px" }} 
          />
        )}
        {menu && menu.categories.map(x => (
          <Row key={x.name} justify="space-between" style={{ paddingBottom: 12 }}>
            <Col>{x.name}</Col>
            <Col>
              <Space>
                <AddCategory 
                  edit 
                  category={x} 
                  menu={menu} 
                  categories={menu.categories}
                />
                <Button 
                  icon={<DeleteOutlined />} 
                  type="danger" 
                  ghost 
                  size="small" 
                  onClick={() => handleDeleteCategory(x.name)} 
                />
              </Space>
            </Col>
          </Row>
        ))}
        <AddCategory 
          menu={menu} 
          categories={menu ? menu.categories : []}
        />
      </div>
    </div>
  )
}

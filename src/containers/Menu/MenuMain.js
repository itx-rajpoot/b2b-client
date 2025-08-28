import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import MenuDisplay from '../../components/Menu/MenuDisplay';
import MenuCategories from '../../components/Menu/MenuCategories';
import MenuSubcategories from '../../components/Menu/MenuSubcategories';
import ItemDisplay from '../../components/Menu/ItemDisplay';
import { parseItems, parseMenus } from '../../utils/collectionParsers';

export default function MenuMain() {
  const menus = useSelector((state) => parseMenus(state.firestore.data.menus));
  const items = useSelector((state) => parseItems(state.firestore.data.items));
  const menu = menus.length > 0 ? menus[0] : null;
  return (
    <Switch>
      <Route path="/menu/categories">
        <MenuCategories menu={menu} items={items ? items : []} />
      </Route>
      <Route path="/menu/subcategories">
        <MenuSubcategories menu={menu} items={items ? items : []} />
      </Route>
      <Route path={["/menu/items/add", "/menu/items/:item_id"]}>
        <ItemDisplay menu={menu} items={items ? items : []} categories={menu ? menu.categories : []} />
      </Route>
      <Route path="/menu">
        <MenuDisplay menu={menu} items={items ? items : []} categories={menu ? menu.categories : []} />
      </Route>
      <Redirect to="/menu" />
    </Switch>
  );
}

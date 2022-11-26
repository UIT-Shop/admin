import Dashboard from '../components/Dashboard';
import Profile from '../components/Profile';
// import Category from '../components/category/Category';
// import ViewCategory from '../components/category/ViewCategory';
// import EditCategory from '../components/category/EditCategory';
// import AddProduct from '../components/product/AddProduct';
// import ViewProduct from '../components/product/ViewProduct';
// import EditProduct from '../components/product/EditProduct';
// import Order from '../components/order/Order';

const routes = [
  { path: '/', name: 'Admin' },
  {
    path: '/dashboard',

    name: 'Dashboard',
    element: Dashboard,
  },
  //   {
  //     path: '/add-category',
  //
  //     name: 'Category',
  //     component: Category,
  //   },
  //   {
  //     path: '/view-category',
  //
  //     name: 'ViewCategory',
  //     component: ViewCategory,
  //   },
  //   {
  //     path: '/edit-category/:id',
  //
  //     name: 'EditCategory',
  //     component: EditCategory,
  //   },
  //   {
  //     path: '/add-product',
  //
  //     name: 'AddProduct',
  //     component: AddProduct,
  //   },
  //   {
  //     path: '/view-product',
  //
  //     name: 'ViewProduct',
  //     component: ViewProduct,
  //   },
  //   {
  //     path: '/edit-product/:id',
  //
  //     name: 'EditProduct',
  //     component: EditProduct,
  //   },
  { path: '/profile', name: 'Profile', element: Profile },
  //   { path: '/orders',  name: 'Order', component: Order },
];

export default routes;

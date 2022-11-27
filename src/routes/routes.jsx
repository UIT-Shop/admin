import AddCategory from '../components/category/AddCategory';
import EditCategory from '../components/category/EditCategory';
import ViewCategory from '../components/category/ViewCategory';
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
  {
    path: '/add-category',

    name: 'Category',
    element: AddCategory,
  },
  {
    path: '/view-category',

    name: 'ViewCategory',
    element: ViewCategory,
  },
  {
    path: '/edit-category/:id',

    name: 'EditCategory',
    element: EditCategory,
  },
  //   {
  //     path: '/add-product',
  //
  //     name: 'AddProduct',
  //     element: AddProduct,
  //   },
  //   {
  //     path: '/view-product',
  //
  //     name: 'ViewProduct',
  //     element: ViewProduct,
  //   },
  //   {
  //     path: '/edit-product/:id',
  //
  //     name: 'EditProduct',
  //     element: EditProduct,
  //   },
  { path: '/profile', name: 'Profile', element: Profile },
  //   { path: '/orders',  name: 'Order', element: Order },
];

export default routes;

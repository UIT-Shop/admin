import AddBrand from '../components/brand/AddBrand';
import EditBrand from '../components/brand/EditBrand';
import ViewBrand from '../components/brand/ViewBrand';
import AddCategory from '../components/category/AddCategory';
import EditCategory from '../components/category/EditCategory';
import ViewCategory from '../components/category/ViewCategory';
import AddColor from '../components/color/AddColor';
import EditColor from '../components/color/EditColor';
import ViewColor from '../components/color/ViewColor';
import Dashboard from '../components/Dashboard';
import AddProduct from '../components/product/AddProduct';
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
  {
    path: '/add-brand',

    name: 'AddBrand',
    element: AddBrand,
  },
  {
    path: '/view-brand',

    name: 'ViewBrand',
    element: ViewBrand,
  },
  {
    path: '/edit-brand/:id',

    name: 'EditBrand',
    element: EditBrand,
  },
  {
    path: '/add-color',

    name: 'AddColor',
    element: AddColor,
  },
  {
    path: '/view-color',

    name: 'ViewColor',
    element: ViewColor,
  },
  {
    path: '/edit-color/:id',

    name: 'EditColor',
    element: EditColor,
  },
  {
    path: '/add-product',

    name: 'AddProduct',
    element: AddProduct,
  },
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

import ChangePassword from '../components/auth/ChangePassword'
import AddBrand from '../components/brand/AddBrand'
import EditBrand from '../components/brand/EditBrand'
import ViewBrand from '../components/brand/ViewBrand'
import AddCategory from '../components/category/AddCategory'
import EditCategory from '../components/category/EditCategory'
import ViewCategory from '../components/category/ViewCategory'
import AddColor from '../components/color/AddColor'
import EditColor from '../components/color/EditColor'
import ViewColor from '../components/color/ViewColor'
import Dashboard from '../components/dashboard/Dashboard'
import Order from '../components/order/Order'
import OrderDetail from '../components/order/OrderDetail'
import AddProduct from '../components/product/AddProduct'
import EditProduct from '../components/product/EditProduct'
import ViewProduct from '../components/product/ViewProduct'
import EditProfile from '../components/user/EditProfile'
import Profile from '../components/user/Profile'
import ViewUser from '../components/user/ViewUsers'
import AddWarehouse from '../components/warehouse/AddWarehouse'
import EditWarehouse from '../components/warehouse/EditWarehouse'
import ViewWarehouse from '../components/warehouse/ViewWarehouse'
import AddProductToWarehouse from '../components/warehouse/product/AddProductToWarehouse'
import MoveProductToWarehouse from '../components/warehouse/product/MoveProductToWarehouse'
import WarehouseStatistic from '../components/warehouse/product/WarehouseStatistic'

const routes = [
  { path: '/', name: 'Admin' },
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: Dashboard
  },
  {
    path: '/add-category',
    name: 'Category',
    element: AddCategory
  },
  {
    path: '/view-category',
    name: 'ViewCategory',
    element: ViewCategory
  },
  {
    path: '/edit-category/:id',
    name: 'EditCategory',
    element: EditCategory
  },
  {
    path: '/add-brand',
    name: 'AddBrand',
    element: AddBrand
  },
  {
    path: '/view-brand',
    name: 'ViewBrand',
    element: ViewBrand
  },
  {
    path: '/edit-brand/:id',
    name: 'EditBrand',
    element: EditBrand
  },
  {
    path: '/add-warehouse',
    name: 'AddWarehouse',
    element: AddWarehouse
  },
  {
    path: '/view-warehouse',
    name: 'ViewWarehouse',
    element: ViewWarehouse
  },
  {
    path: '/edit-warehouse/:id',
    name: 'EditWarehouse',
    element: EditWarehouse
  },
  {
    path: '/add-product-2-warehouse',
    name: 'AddProductToWarehouse',
    element: AddProductToWarehouse
  },
  {
    path: '/move-product-2-warehouse',
    name: 'MoveProductToWarehouse',
    element: MoveProductToWarehouse
  },
  {
    path: '/warehouse-statistic',
    name: 'WarehouseStatistic',
    element: WarehouseStatistic
  },
  {
    path: '/add-color',
    name: 'AddColor',
    element: AddColor
  },
  {
    path: '/view-color',
    name: 'ViewColor',
    element: ViewColor
  },
  {
    path: '/edit-color/:id',
    name: 'EditColor',
    element: EditColor
  },
  {
    path: '/add-product',
    name: 'AddProduct',
    element: AddProduct
  },
  {
    path: '/view-product',
    name: 'ViewProduct',
    element: ViewProduct
  },
  {
    path: '/edit-product/:id',
    name: 'EditProduct',
    element: EditProduct
  },
  {
    path: '/view-user',
    name: 'ViewUser',
    element: ViewUser
  },
  { path: '/profile/edit', name: 'EditProfile', element: EditProfile },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/change-password', name: 'ChangePassword', element: ChangePassword },
  { path: '/orders', name: 'Order', element: Order },
  { path: '/order-detail/:id', name: 'OrderDetail', element: OrderDetail }
]

export default routes

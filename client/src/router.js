import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Login from '@/views/Login'
import Register from '@/views/Register'
import ProductForm from '@/views/ProductForm'
import Cart from '@/views/Cart'
import Transaction from '@/views/Transaction'
import TransactionTable from '@/components/TransactionTable'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/add-product',
      name: 'productform',
      component: ProductForm
    },
    {
      path: '/edit-product',
      name: 'productform',
      component: ProductForm
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: Transaction,
      children: [
        {
          path: ':id',
          component: TransactionTable
        }
      ]
    }
  ]
})

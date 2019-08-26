<template>
  <div id="app">
    <Navbar :is-login="isLogin" :total-items="totalItems" @logout="logout" />
    <router-view
      :products="products"
      :transactions="transactions"
      :transactionsAdmin="transactionsAdmin"
      :cart="cart"
      :errMsg="errMsg"
      @input-name="name = $event"
      @input-email="email = $event"
      @input-password="password = $event"
      @clear-err="clearErr"
      @login="login"
      @register="register"
      @add-to-cart="addToCart"
      @overNewProduct="overNewProduct($event)"
      @remove-from-cart="removeFromCart"
      @delete-product="removeProduct"
      @checkout="checkout"
      @update-status="updateStatus"
    />
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import backend from '@/api/backend'
import swal from 'sweetalert'

export default {
  name: 'app',
  components: {
    Navbar: Navbar,
    Footer: Footer
  },
  data () {
    return {
      products: [],
      cart: [],
      transactions: [],
      transactionsAdmin: [],
      isLogin: !!localStorage.getItem('accesstoken'),
      name: '',
      email: '',
      password: '',
      errMsg: '',
      oldProduct: '',
      newProduct: ''
    }
  },
  computed: {
    totalItems () {
      return this.cart.length
    }
  },
  created () {
    this.fetchProducts()
    if (this.isLogin) {
      this.fetchCart()
      this.fetchTransactions()
    }
  },
  methods: {
    fetchProducts () {
      backend
        .get('/products')
        .then(({ data }) => {
          this.products = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    fetchCart () {
      backend({
        method: 'get',
        url: '/carts',
        headers: {
          accesstoken: localStorage.getItem('accesstoken')
        }
      })
        .then(({ data }) => {
          this.cart = data.cart
        })
        .catch(err => {
          if (err.response) {
            swal(err.response.data.message)
          } else {
            console.log(err)
          }
        })
    },
    overNewProduct (data) {
      this.products.unshift(data)
      this.fetchProducts()
    },
    fetchTransactions () {
      backend
        .get('/transactions', {
          headers: {
            accesstoken: localStorage.getItem('accesstoken')
          }
        })
        .then(({ data }) => {
          console.log(data)
          let arr = []
          data.forEach(el =>
            el.products.forEach(e => {
              arr.push({
                ...e,
                transactionId: el._id
              })
            })
          )
          this.transactions = arr
          this.transactionsAdmin = data
        })
        .catch(err => {
          if (err.response) {
            swal(err.response.data.message)
          } else {
            console.log(err)
          }
        })
    },
    logout () {
      swal({
        title: 'Are you sure?',
        text: '',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          localStorage.clear()
          this.isLogin = false
          this.fetchProducts()
          this.cart = []
          this.transactions = []
          this.$router.push('/')
          swal('See You Later!', {
            icon: 'success'
          })
        } else {
        }
      })
    },
    login () {
      backend
        .post('/login', {
          email: this.email,
          password: this.password
        })
        .then(({ data }) => {
          this.$router.push('/')
          localStorage.setItem('accesstoken', data.accesstoken)
          localStorage.setItem('email', this.email)
          if (data.role === 'Admin') {
            localStorage.setItem('role', 'Admin')
          }
          this.clearForm()
          this.fetchProducts()
          this.fetchCart()
          swal('Login Success', '', 'success')
          this.isLogin = true
        })
        .catch(err => {
          if (err.response) {
            this.errMsg = err.response.data.message
          }
          console.log(err)
        })
    },
    register () {
      backend
        .post('/register', {
          name: this.name,
          email: this.email,
          password: this.password
        })
        .then(({ data }) => {
          this.clearForm()
          swal('Register Success', '', 'success')
          this.$router.push('/login')
        })
        .catch(err => {
          if (err.response) {
            this.errMsg = err.response.data.message
          }
          console.log(err)
        })
    },
    clearErr () {
      this.errMsg = ''
    },
    clearForm () {
      this.name = ''
      this.email = ''
      this.password = ''
    },
    addToCart (id) {
      if (!this.isLogin) {
        this.$router.push('/login')
      }
      backend({
        url: '/carts/' + id,
        method: 'patch',
        headers: {
          accesstoken: localStorage.getItem('accesstoken')
        }
      })
        .then(({ data }) => {
          console.log(data)
          this.fetchProducts()
          this.fetchCart()
        })
        .catch(err => {
          if (err.response) {
            if (!this.isLogin) {
              this.errMsg = err.response.data.message
            } else {
              swal(err.response.data.message)
            }
          } else {
            console.log(err)
          }
        })
    },
    removeFromCart (id) {
      backend({
        url: '/carts/' + id,
        method: 'delete',
        headers: {
          accesstoken: localStorage.getItem('accesstoken')
        }
      })
        .then(({ data }) => {
          console.log(data)
          this.fetchProducts()
          this.fetchCart()
        })
        .catch(err => {
          if (err.response) {
            swal(err.response.data.message)
          } else {
            console.log(err)
          }
        })
    },
    removeProduct (id) {
      console.log('trigggg')
      backend({
        url: '/products/' + id,
        method: 'delete',
        headers: {
          accesstoken: localStorage.getItem('accesstoken')
        }
      })
        .then(({ data }) => {
          console.log(data)
          this.fetchProducts()
          swal('Product deleted!', {
            icon: 'success'
          })
        })
        .catch(err => {
          if (err.response) {
            swal(err.response.data.message)
          } else {
            console.log(err)
          }
        })
    },
    checkout () {
      backend
        .post(
          '/transactions',
          {},
          {
            headers: {
              accesstoken: localStorage.getItem('accesstoken')
            }
          }
        )
        .then(({ data }) => {
          swal('Transaction Success', '', 'success')
          console.log(data)
          this.fetchProducts()
          this.fetchCart()
          this.fetchTransactions()
        })
        .catch(err => {
          if (err.response) {
            swal(err.response.data.message)
          } else {
            console.log(err)
          }
        })
    },
    updateStatus (transactionId, productId) {
      let status = ''
      this.transactions.forEach(prod => {
        if (prod.product._id === productId) {
          if (prod.status === 'Transit') {
            status = 'Delivered'
          }
        }
      })
      console.log(status)
      if (status === 'Delivered') {
        backend
          .patch(
            `/transactions/${transactionId}/${productId}`,
            { status },
            {
              headers: {
                accesstoken: localStorage.getItem('accesstoken')
              }
            }
          )
          .then(({ data }) => {
            console.log(data)
            this.fetchTransactions()
          })
          .catch(err => {
            console.log(err)
            if (err.response) {
              swal(err.response.data.message)
            } else {
              console.log(err)
            }
          })
      }
    }
  }
}
</script>

<style>
#title {
  font-family: "Josefin Sans", sans-serif;
}
.icon:hover {
  cursor: pointer;
}

#ds:hover {
  cursor: pointer;
}
</style>

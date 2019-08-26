<template>
  <div class="ui container basic segment" style="margin-top: 2rem;">
      <h1 class="ui header" id="title">
          Add New Product
      </h1>
    <form class="ui form" style="margin-top: 2rem;" @submit.prevent="addProduct">
      <div class="three fields">
        <div class="field">
          <label for="product-name">Name</label>
          <input type="text" v-model="name" placeholder="Product Name...">
        </div>
        <div class="field">
          <label for="product-price">Price</label>
          <input type="number" v-model="price" placeholder="Product Price" min="1">
        </div>
        <div class="field">
            <label for="product-description">Stock</label>
            <input type="number" v-model="stock" placeholder="Product Stock" min="1">
        </div>
      </div>
      <div class="field">
          <label for="image">Image</label>
          <input type="file" @change="previewFile">
      </div>
      <div class="ui fluid black submit button" @click.prevent="addProduct">Add</div>
    </form>
  </div>
</template>

<script>
import backend from '@/api/backend'
import swal from 'sweetalert'
export default {
  data () {
    return {
      name: '',
      price: '',
      stock: '',
      image: ''
    }
  },
  methods: {
    addProduct () {
      let newProduct = new FormData()
      newProduct.append('name', this.name)
      newProduct.append('price', this.price)
      newProduct.append('stock', this.stock)
      newProduct.append('image', this.image)
      backend
        .post(
          `/products`,
          newProduct,
          {
            headers: {
              accesstoken: localStorage.getItem('accesstoken'),
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then(({ data }) => {
          this.$emit('overNewProduct', data)
          swal('Product Added', '', 'success')
          this.$router.push('/')
        })
        .catch(err => {
          console.log(err)
        })
    },
    previewFile (event) {
      this.image = event.target.files[0]
    }
  }
}
</script>

<style>
</style>

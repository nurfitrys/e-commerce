<template>
  <div class="ui card">
    <div class="image">
      <div v-show="role">
      <div class="ui left black ribbon icon label">
        <i class="trash icon" @click="$emit('delete-product', product._id)"></i>
      </div>
    </div>
      <img
        :src="product.image"
        class="visible content"
        style="width: 100%; height: 200px;"
      >
    </div>
    <div class="center aligned content">
      <a class="header">{{ product.name }}</a>
      <div class="meta">
        Stock: {{ product.stock }}
      </div>
      Rp. {{ product.price }}
    </div>
    <div v-show="!role">
<div
  class="ui basic bottom attached button"
  tabindex="0"
  @click="$emit('add-to-cart', product._id)"
  :class="{ disabled: onCart == 'Added to Cart' || product.stock == 0 }"
  >
    <p>{{ product.stock ? onCart : 'Stock Empty' }}</p>
</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: Object,
    cart: Array
  },
  created () {
  },
  computed: {
    onCart () {
      let cart = this.cart.map(el => el._id)
      if (cart.indexOf(this.product._id) < 0) {
        return 'Add to Cart'
      } else {
        return 'Added to Cart'
      }
    },
    role () {
      return localStorage.getItem('role') === 'Admin'
    }
  }
}
</script>

<style>
</style>

<template>
  <div class="ui container" style="margin-top: 2rem;">
    <div class="ui basic segment">
      <h1 class="ui header" id="title">Cart Content</h1>
      <table class="ui very basic table" style="margin-top: 2rem;">
        <thead>
          <tr>
            <th></th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item._id">
            <td class="collapsing">
              <a class="ui orange small circular label" @click="$emit('remove-from-cart', item._id)">x</a>
            </td>
            <td>
              <h4 class="ui image header">
                <img
                  :src="item.image"
                  class="ui image"
                >
                <div class="content">{{ item.name }}</div>
              </h4>
            </td>
            <td>Rp. {{ item.price }}</td>
            <td><input type="number" v-model="item.quantity"></td>
          </tr>
        </tbody>
        <tfoot class="full-width">
          <tr>
            <th></th>
            <th>Total:</th>
            <th></th>
            <th>
                Rp. {{ totalPrice }}
              <div class="ui right floated small black labeled icon button" @click="$emit('checkout')">
                <i class="shopping cart icon"></i> Checkout
              </div>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="ui basic segment">
      <h2 class="ui header" id="title">Transaction History</h2>
      <table class="ui table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in transactions" :key="data._id">
            <td>{{ data.product.name }}</td>
            <td>{{ data.product.price }}</td>
            <td :class="{
                warning: data.status === 'Pending',
                positive: data.status === 'Delivered'
                }">{{ data.status }}</td>
            <td :class="{
                positive: data.status === 'Transit'
                }"
                @click="$emit('update-status', data.transactionId, data.product._id)"
                >
              <p>{{ action(data.status) }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  props: {
    cart: Array,
    transactions: Array
  },
  computed: {
    totalPrice () {
      let total = 0
      this.cart.forEach(el => (total += el.price))
      return total
    }
  },
  methods: {
    action (status) {
      if (status === 'Pending') {
        return 'Waiting...'
      } else if (status === 'Transit') {
        return 'Arrived'
      } else if (status === 'Delivered') {
        return 'Success'
      }
    }
  }
}
</script>

<style>
</style>

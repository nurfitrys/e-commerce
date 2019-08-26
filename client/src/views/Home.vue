<template>
    <div class="ui container three stackable cards" style="margin-top: 2rem;">
        <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :cart="cart"
        @add-to-cart="$emit('add-to-cart', $event)"
        @delete-product="$emit('delete-product', $event)"
        />
    </div>
</template>

<script>
import ProductCard from '@/components/ProductCard'

export default {
  components: {
    ProductCard: ProductCard
  },
  props: {
    products: Array,
    cart: Array
  }
}
</script>

<style>

</style>

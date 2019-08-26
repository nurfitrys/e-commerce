<template>
        <div class="ui raised segment">
          <h1 class="ui attached top header" id="title">Transaction Detail</h1>
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
          <tr v-for="data in transactions.products" :key="data._id">
            <td>{{ data.product.name }}</td>
            <td>{{ data.product.price }}</td>
            <td :class="{
                warning: data.status === 'Pending',
                positive: data.status !== 'Pending'
                }">{{ data.status }}</td>
            <td :class="{
                warning: data.status === 'Transit',
                positive: data.status === 'Pending'
                }"
                @click="updateStatus(data.product._id)"
                :id="{ ds: data.status === 'Transit' }"
                >
              <p>{{ action(data.status) }}</p>
            </td>
          </tr>
        </tbody>

      </table>
      </div>
</template>

<script>
import backend from '@/api/backend'
import swal from 'sweetalert'
export default {
  name: 'TransactionTable',
  data () {
    return {
      transactions: []
    }
  },
  created () {
    this.fetchTranscation()
  },
  methods: {
    action (status) {
      if (status === 'Pending') {
        return 'Send'
      } else if (status === 'Transit') {
        return 'Waiting..'
      } else if (status === 'Delivered') {
        return 'Success'
      }
    },
    fetchTranscation () {
      backend
        .get(`/transactions/${this.$route.params.id}`, {
          headers: {
            accesstoken: localStorage.getItem('accesstoken')
          }
        })
        .then(({ data }) => {
          this.transactions = data
        })
        .catch(err => {
          if (err.response) {
            swal(err.response.data.message)
          } else {
            console.log(err)
          }
        })
    },
    updateStatus (id) {
      let status = ''
      this.transactions.products.forEach(prod => {
        if (prod.product._id === id) {
          if (prod.status === 'Pending') {
            status = 'Transit'
          }
        }
      })

      if (status === 'Transit') {
        backend
          .patch(
            `/transactions/${this.$route.params.id}/${id}`,
            { status },
            { headers: {
              accesstoken: localStorage.getItem('accesstoken')
            }
            })
          .then(({ data }) => {
            console.log(data)
            this.fetchTranscation()
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
  },
  watch: {
    $route () {
      this.fetchTranscation()
    }
  }

}
</script>

<style>

</style>

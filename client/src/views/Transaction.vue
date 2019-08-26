<template>
  <div class="ui container" style="margin-top: 2rem;">
    <div class="ui grid">
      <div class="four wide column ui basic segment">
        <h1 class="ui header" id="title">Transaction List</h1>
        <table class="ui stackable table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Transaction Id</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in transactionsAdmin" :key="index">
              <td>{{ index + 1 }}</td>
              <td @click="$router.push('/transactions/' + item._id)" id="ds">{{ item._id }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="twelve wide column">
          <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Transaction',
  props: {
    transactionsAdmin: Array
  }
}
</script>

<style>
</style>

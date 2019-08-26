<template>
  <div class="ui container middle aligned center aligned grid">
    <div class="six wide column" style="margin-top: 8.5rem;">
      <h2 class="ui black image header">
        <div class="content" id="title">Log-in to Your Account</div>
      </h2>

      <form class="ui large form" @keyup.enter.prevent="$emit('login')">
        <div class="ui basic segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="mail icon"></i>
              <input
                type="text"
                name="email"
                placeholder="E-mail address"
                @input="$emit('input-email', $event.target.value)"

              >
            </div>
          </div>

          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                @input="$emit('input-password', $event.target.value)"
              >
            </div>
          </div>

        <div class="ui error message" :class="{ visible: errMsg }">
            <i class="close icon" @click="$emit('clear-err')"></i>
            <ul class="list">
                <li>{{ errMsg }}</li>
            </ul>
        </div>

          <div class="ui fluid large black submit button" @click="$emit('login')">
            <p>Login</p>
          </div>
        </div>
      </form>
      <br>

      <div class="ui message">
        <p>
          Don't have account ?
          <br><router-link to="/register">Sign Up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errMsg: String
  }
}
</script>

<style>
</style>

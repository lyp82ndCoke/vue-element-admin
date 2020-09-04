<template>
  <div id="app">
    <router-view />
    <!-- <div class="alert-wrap">
      <div class="code-wrap">
        <div class="code-title">请用微信扫码~</div>
        <img src="" alt="">
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.alert-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  .code-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    text-align: center;
    padding: 40px;
  }
}
</style>

<template>
  <div class="dashboard-container">
    <div class="dashboard-time">现在是：{{time}}</div>
    <div class="dashboard-text">知嘛文化欢迎您：{{ name }}</div>
    <!-- <div class="dashboard-text">name:{{ name }}</div> -->
    <!-- <div class="dashboard-text">
      roles:
      <span v-for="role in roles" :key="role">{{ role }}</span>
    </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import format from '../../utils/timeFromat'
export default {
  name: 'home',
  computed: {
    ...mapGetters([
      'name',
      'roles',
    ]),
  },
  data() {
    return {
      time: ''
    }
  },
  created() {
    this.getTime()
  },
  methods: {
    getTime() {
      let time = (new Date()).getTime();
      // console.log(format)
      let timeNow = format.format(time)
      this.time = timeNow;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-time {
    font-size: 20px;
  }
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

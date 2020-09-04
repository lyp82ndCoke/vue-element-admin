<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar />
      <app-main />
    </div>
    <!-- <div class="alert-wrap" v-if="!unionid">
      <div class="code-wrap">
        <el-col :span="24" class="code-title">
          <el-col class="code-title-text" :span="24">请用微信扫码绑定</el-col>
         
          <canvas id="canvas" ref="canvas" class="code-img"></canvas>
          <el-col :span="24" class="code-title-text">
            <el-button type="primary" @click="reload()">我已绑定成功</el-button>
            <el-col :span="24">
              <el-button type="text" @click="noBind">暂不绑定</el-button>
            </el-col>
          </el-col>
        </el-col>
      </div>
    </div> -->
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters } from 'vuex'
import QRCode from 'qrcode'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      codeShow: false,
      unionid: ''
    }
  },
  created() {
    this.getUnionId();
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    getUnionId() {

      this.unionid = this.$store.state.user.unionid
      console.log(this.$store.state, "vuex数据")
      if (!this.unionid) {
        const user_id = this.$store.state.user.user_id;

        const url = `https://xdata.zmedc.com/zmwx/ht_auth/?user_id=${user_id}`;
        console.log(url, "url")
        this.useqrcode(url)
      }
      // else {
      //   const APPID = "wxec395e2c015ff846", REDIRECT_URI = window.location.href;
      //   window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_login#wechat_redirect`
      // }
    },
    reload() {
      location.reload()
    },
    // 暂不绑定
    noBind() {
      this.unionid = true
    },
    // 转换二维码
    useqrcode(url) {
      var canvas;
      this.$nextTick(() => {
        canvas = this.$refs.canvas;
        QRCode.toCanvas(canvas, url, function (error) {
          if (error) {
            console.error(error)
          } else {
            console.log('QRCode success!');
          }
        })
      })
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.alert-wrap {
  z-index: 2020;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  .code-wrap {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background-color: #fff;
    padding: 20px;
    .code-title {
      text-align: center;
      color: #000;
      .code-title-text {
        padding: 20px 0;
      }
      .code-img {
        width: 200px;
        height: 200px;
      }
    }
  }
}
</style>

<template>
  <div class="app-container">
    <el-col :span="24" class="title-header">
      <el-col :span="2">
        <el-button size="small" type="primary" @click="goContent()">新建商品</el-button>
      </el-col>
      <el-col :span="5">
        <el-input v-model="listQuery.item_name" size="small" placeholder="商品名称" @keyup.enter.native="search"></el-input>
      </el-col>
    </el-col>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit size="small"
      highlight-current-row>
      <el-table-column label="商品名称" align="left" width="500">
        <template slot-scope="scope">
          <el-col :span="5"><img :src="scope.row.pic_url" class="head-img" alt=""></el-col>
          {{ scope.row.item_name }}
        </template>
      </el-table-column>
      <el-table-column label="商品ID" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.item_id}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="群数量" align="center">
        <template slot-scope="scope">{{ scope.row.chatroom_cnt }}</template>
      </el-table-column>
      <el-table-column label="容量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.plan_user_cnt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应入群人数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.buy_cnt}}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="余量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.plan_user_cnt - scope.row.buy_cnt ? scope.row.plan_user_cnt - scope.row.buy_cnt : 0}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="可售卖数量 待售" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.quantity}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否搜索可见" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.search_flag == 1 ? '可见':'不可见'}}</span>
        </template>
      </el-table-column>
      <!--  <el-table-column label="已购买未入群" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.no_in_room_cnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已入群待入小程序" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.no_in_xiao_cnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已入群已入小程序" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.in_xiao_cnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.created_user_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="created_at" label="操作" width="250px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goContent(scope.row.item_id)">编辑</el-button>
          <el-button size="mini" type="text" @click="extensionGoods(scope.row.item_id)">推广</el-button>
          <el-button size="mini" type="text" @click="userPraise(scope.row.item_id)">用户好评</el-button>
          <el-button size="mini" type="text" @click="searchClick(scope.row.item_id, scope.row.search_flag)">
            {{scope.row.search_flag == 1 ? '不可见' : '可见'}}
          </el-button>
          <!-- <el-button size="mini" type="text" @click="addInventory()">添加库存</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination class="pagination" v-show="total>0" :total="total" :page.sync="listQuery.page_no"
      :limit.sync="listQuery.page_size" v-on:pagination="getItemList" />
    <div :span="24" class="alert-wrap" v-if='popularize' @click.self="hiddenWrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-row>
          <el-col :span="3" class="wrap-title">推广链接：</el-col>
          <el-col :span="16">{{codeUrl}}</el-col>

        </el-row>

        <el-row style="margin-top: 20px;">
          <el-col :span="4">
            <el-button size="mini" type="primary" :data-clipboard-text="`${codeUrl}`" @click="copyActivity"
              class="activity-url">复制链接地址</el-button>
          </el-col>
        </el-row>

        <el-row style="margin-top: 40px;">
          <el-col :span="4" class="wrap-title">推广二维码：</el-col>
          <div id="qrCode">
            <div id='code'></div>
            <canvas id="canvas" ref="canvas"></canvas>
          </div>
        </el-row>
      </el-col>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import QRCode from 'qrcode'
import Base64 from 'js-base64'
import Pagination from '@/components/Pagination'
import { getItemList, updateSearch } from '@/api/shopGoods'
export default {
  components: { Pagination, QRCode },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      codes: '',
      // 推广弹框
      popularize: false,
      item_id: null,
      height: null,
      alertShow: false,
      optionsValue: null,
      searchText: '',
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page_no: 1,
        page_size: 10,
        item_name: '',
      },
      MOTHER_API: '',
      codeUrl: ''
    }
  },
  created() {
    // console.log(Base64, 'Base64')
    // const dataBase = {
    //   a: 1,
    //   b: 2,
    //   c: 'hahah'
    // }

    // let base = Base64.Base64.encode(JSON.stringify(dataBase));
    // console.log(base,'加密出来的')
    // console.log(JSON.parse(Base64.Base64.decode(base)),'解密出来的')

    this.getItemList()
    this.MOTHER_API = process.env.MOTHER_API;
    console.log(process.env.MOTHER_API, 'process')
  },
  methods: {
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
    // 搜索
    search() {
      this.listQuery.page_no = 1;
      this.getItemList();
    },
    // 商品列表
    getItemList() {
      this.listLoading = true;
      getItemList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.list = res.result.rows;
          this.total = res.result.total;
        }
      })
    },
    // 复制推广链接
    copyActivity() {
      var clipboard = new Clipboard('.activity-url')
      clipboard.on('success', e => {
        this.$message({
          message: '复制成功',
          type: 'success'
        });
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制  
        console.log('该浏览器不支持自动复制')
        // 释放内存  
        clipboard.destroy()
      })
    },
    // 推广
    extensionGoods(item_id) {
      this.popularize = true;
      const dataBase = {
        item_id: item_id,
        channel: null
      }
      let base = Base64.Base64.encode(JSON.stringify(dataBase));
      this.item_id = item_id;
      // const codeUrl = `${this.MOTHER_API}/#/goodsDetails/${item_id}/1`;
      this.codeUrl = `${this.MOTHER_API}/#/item?param=${base}`;
      this.useqrcode(this.codeUrl);
    },
    hiddenWrap() {
      this.popularize = false;
    },
    goContent(id) {
      const activityId = id ? id : 0;
      this.$router.push({ path: `./news/${activityId}` })
    },
    // addInventory(){
    //   this.$router.push({ path: '/group/stock/index' })
    // },
    userPraise(item_id){
      this.$router.push({ path: `/group/wechatGroup/detail/${item_id}` })
    },
    searchClick(item_id, search_flag){
      let search = search_flag == 1 ? 0 : 1;
      updateSearch({search_flag: search, item_id}).then(res => {
        if(res.code == 200){
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getItemList();
        }
      })
    }
  },
  mounted() {
    // this.useqrcode();
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  padding: 20px;
  .head-img {
    width: 50px;
    height: 50px;
  }
  .popularize-wrap {
    z-index: 20;
    position: absolute;
    top: 40%;
    left: 40%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 5px;
    background-color: #ededed;
  }
}
.title-header {
  padding: 10px 0;
}
.success-btn {
  text-align: right;
}
.alert {
  &-wrap {
    z-index: 1002;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 100px 150px 50px 450px;
  }
  &-content-wrap {
    border-radius: 5px;
    height: 80%;
    width: 80%;
    padding: 40px;
    background-color: #fff;
  }
}
.add-com {
  font-size: 20px;
}
.title-header {
  padding: 10px 0;
}
.close-alert {
  text-align: right;
  font-size: 30px;
  color: #ccc;
}
.pagination {
  margin-top: 10px;
}
.search-btn {
  margin-left: 20px;
}
.upper {
  color: red;
}
.lower {
  color: #ccc;
}
.goods-pic {
  width: 100%;
}
.wrap-title {
  color: #606266;
  font-size: 14px;
  font-weight: 700;
}
</style>

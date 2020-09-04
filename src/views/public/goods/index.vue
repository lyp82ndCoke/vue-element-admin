<template>
  <div class="app-container">
    <el-col :span="24" class="title-header">
      <el-col :span="4">
        <el-button size="small" type="primary" @click="goContent()">新建商品</el-button>
      </el-col>
    </el-col>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      size="small"
      highlight-current-row>
      <el-table-column label="商品名称" align="center" width="200">
        <template slot-scope="scope">
         <el-col :span="8"><img :src="scope.row.pic_url" class="head-img" alt=""></el-col>
          {{ scope.row.item_name }}
        </template>
      </el-table-column>
      <el-table-column label="群数量" align="center">
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
      </el-table-column>
      <el-table-column label="余量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.plan_user_cnt - scope.row.buy_cnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已购买未入群" align="center">
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
      </el-table-column>
      <el-table-column align="center" prop="created_at" width="100" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goContent(scope.row.item_id)">编辑</el-button>
          <el-button size="mini" type="text" @click="extensionGoods(scope.row.item_id)">推广</el-button>
          <el-button size="mini" type="text" @click="addInventory()">添加库存</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      class="pagination"
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page_no"
      :limit.sync="listQuery.page_size"
      v-on:pagination="getItemList"
    />
    <!-- <el-row class="popularize-wrap" v-if='popularize'>
      <el-col :span="24">
        推广弹框
      </el-col>
    </el-row> -->
      <div :span="24" class="alert-wrap" v-if='popularize' @click.self="hiddenWrap">
        <el-col :span="24" class="alert-content-wrap">
          <el-row>
            <el-col :span="3" class="wrap-title">推广链接：</el-col>
            <el-col :span="16">https://xdata.zmedc.com/h5shop/?item_id={{item_id}}</el-col>
            
          </el-row>

          <el-row style="margin-top: 20px;">
            <el-col :span="4">
              <el-button 
                size="mini" 
                type="primary"
                :data-clipboard-text="`https://xdata.zmedc.com/h5shop/?item_id=${item_id}`"
                @click="copyActivity"
                class="activity-url"
                >复制链接地址</el-button>
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
import Pagination from '@/components/Pagination'
import { getItemList } from '@/api/qecode'
import Request from '@/utils/request'
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
      codes:'',
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
    }
  },
  created() {
    this.getItemList()
  },
  methods: {
    useqrcode(url){
      var canvas;
      this.$nextTick(()=>{
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
    extensionGoods(item_id) {
      this.popularize = true;
      this.item_id = item_id; //推广商品的id
      const codeUrl = `https://xdata.zmedc.com/h5shop/?item_id=${item_id}`;
      this.useqrcode(codeUrl);
    },
    hiddenWrap(){
      this.popularize = false;
    },
    goContent(id) {
      const activityId = id ? id : 0;
      this.$router.push({ path: `./news/${activityId}` })
    },
    addInventory(){
      this.$router.push({ path: '/group/stock/index' })
    }
  },
  mounted(){
    // this.useqrcode();
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  padding: 20px;
  .head-img{
    width: 50px;
    height: 50px;
  }
  .popularize-wrap{
    
    z-index: 20;
    position: absolute;
    top: 40%;
    left: 40%;
    transform: translate(-50%,-50%);
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
.goods-pic{
  width: 100%;
}
.wrap-title{
  color: #606266;    
  font-size: 14px;
  font-weight: 700;
}
</style>

<template>
  <!-- 商品级(默认) 【1】 -->
  <div class="app-container">
    <el-col :span="24" class="title-header">
      <el-col :span="5">
        <el-input size="small" placeholder="请输入商品名称" prefix-icon="el-icon-search" @keyup.enter.native="searchGoods"
          v-model="listQuery.item_name"></el-input>
      </el-col>
      <el-col :span="2" class="success-btn">
        <el-button
          type="success"
          @click="searchGoods"
          icon="el-icon-search"
          size="small"
        >搜索</el-button>
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
      <el-table-column label="商品名称" align="left" width="300">
        <template slot-scope="scope">
         <el-col :span="5"><img :src="scope.row.pic_url" class="head-img" alt=""></el-col>
          {{ scope.row.item_name }}
        </template>
      </el-table-column>
      <el-table-column label="群数量" align="center">
        <template slot-scope="scope">{{ scope.row.chatroom_cnt }}</template>
      </el-table-column>
      <el-table-column label="总库存" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.plan_user_cnt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已购买人数已支付" align="center" width="85">
        <template slot-scope="scope">
          <span>{{scope.row.user_cnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="可售卖数量待售" align="center" width="85">
        <template slot-scope="scope">
          <span>{{scope.row.quantity}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已占用库存待支付" align="center" width="85">
        <template slot-scope="scope">
          <span>{{scope.row.wait_cnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已购买未入群" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.no_room_cnt}}</span>
        </template>
      </el-table-column>
       <el-table-column label="已入群人数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.in_room_cnt}}</span>
        </template>
      </el-table-column>
      
     <!--  <el-table-column label="已入群待入小程序" align="center">
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
      <el-table-column align="center" prop="created_at" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="addInventory(scope.row.item_id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      class="pagination"
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page_no"
      :limit.sync="listQuery.page_size"
      v-on:pagination="getStockList"
    />
        
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import QRCode from 'qrcode'  
import Pagination from '@/components/Pagination'
import { getStockList } from '@/api/shopGoods'
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
    this.getStockList()
  },
  methods: {
    // 商品列表
    getStockList() {
      this.listLoading = true;
      getStockList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.list = res.result.rows;
          this.total = res.result.total;
        }
      })
    },
    searchGoods(){
      this.listQuery.page_no = 1;
      this.getStockList();
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
    hiddenWrap(){
      this.popularize = false;
    },
    addInventory(item_id){
      this.$router.push({ path: `./goods/${item_id}` })
    }
  },
  mounted(){
    
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

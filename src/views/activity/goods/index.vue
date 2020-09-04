<template>
  <div class="app-container">
    <el-col :span="24" class="title-header">
      <el-col :span="2"><el-button size="small" type="primary" @click="goGoods(0)">新建商品</el-button></el-col>
      <el-col :span="4">
         <el-select size="small" v-model="listQuery.status" placeholder="全部" @change="searchGoods">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
          <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="listQuery.name">
          </el-input>
      </el-col>
      <el-col :span="2" class="success-btn">
        <el-button type="success" icon="el-icon-search" size="small" @click="searchGoods">搜索</el-button>
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
      <el-table-column label="名称" prop="name" width="200" align="center"></el-table-column>  
      <el-table-column label="最后修改时间" prop="updatetime" width="200" align="center"></el-table-column>
      <el-table-column label="兑换价（个）" prop="price" width="200" align="center"></el-table-column>
      <el-table-column label="章节" prop="audio_num" width="180" align="center"></el-table-column>
      <el-table-column class-name="status-col" label="状态" width="200" align="center">
        <template slot-scope="scope">
          <el-col class="upper" v-if="scope.row.status == 1">已上架</el-col>
          <el-col class="lower" v-if="scope.row.status == 0">已下架</el-col>
          <el-col class="lower" v-if="scope.row.status == 2">未上架</el-col>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goContent(scope.row.id)">内容管理</el-button>
           <!-- <el-button size="mini" type="text" v-if="scope.row.status == 1" class="lower">编辑</el-button> -->
            <el-button size="mini" type="text" @click="goGoods(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="text" @click="statusGoods(scope.row.id, scope.row.status)">{{scope.row.status == 1?'下架':'上架'}}</el-button>
          <!-- <el-button size="mini" type="text" @click="removeGoods(scope.row.id)">移除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
 
    <pagination  
      class="pagination"  
      v-show="total>0" 
      :total="total"  
      :page.sync="listQuery.page"  
      :limit.sync="listQuery.limit"  
      v-on:pagination="getGoodsList"/>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getConnect, getGoodStatus, getGoodsDel  } from '@/api/table'
import Request from '@/utils/request'
export default {
  components: { Pagination },
  data() {
    return {
      alertShow: false,
      list: null,
      listLoading: true,
      options:[{label:"已上架",value:"1"},{label:"已下架",value:"0"},{label:"未上架",value:"2"},{label:'全部',value: null}],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        name: "",
        status: null
      },
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 商品列表
    getGoodsList(){
      this.listLoading = true
      getConnect(this.listQuery).then((res) => {
        this.listLoading = false
        this.list = res.result.list;
        this.total = res.result.sign.count;
      })
    },
    // 搜索商品
    searchGoods(){
      this.listQuery.page = 1
      this.getGoodsList()
    },
    // 商品上下架
    statusGoods(id, status){
      var word = status == 1 ? '下架' : '上架';
      this.$confirm('确认要'+ word +'该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getGoodStatus({id,status}).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.getGoodsList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消' + word
        });          
      });
    },
    // 移除商品
    // removeGoods(id){
    //   getGoodsDel({id}).then(res => {
    //     if(res.code == 1000){
    //       this.$message({
    //         message: res.msg,
    //         type: 'success'
    //       });
    //       this.getGoodsList()
    //     } else {
    //       this.$message({
    //         message: res.msg,
    //         type: 'warning'
    //       });
    //     }
    //   })
    // },
    goGoods(id) {
      const activityId = id?id:0;
      this.$router.push({path:`./goods/${id}`})
    },
    goContent(id){
      const activityId = id?id:0;
      this.$router.push({path:`./content/${id}`})
    },
    showAlert(id) {
      this.alertShow = true;
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container{
    padding: 20px;
  }
  .title-header{
    padding: 10px 0;
  }
  .success-btn{
    text-align: right;
  }
  .alert{
    &-wrap{
      z-index: 1002;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,.7);
      padding: 50px 150px 50px 200px;
    }
    &-content-wrap{
      border-radius: 5px;
      height: 100%;
      width: 100%;
      padding: 20px;
      background-color: #fff;
    }
  }
  .add-com{
    font-size: 20px;
  }
  .title-header {
    padding: 10px 0;
  }
  .close-alert{
    text-align: right;
    font-size: 30px;
    color: #ccc;
  }
  .pagination {
    margin-top: 10px;
  }
  .search-btn{
    margin-left: 20px;
  }
  .upper{
    color: red;
  }
  .lower{
    color: #ccc;
  }
</style>

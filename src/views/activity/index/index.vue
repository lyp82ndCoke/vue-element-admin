<template>
  <div class="app-container">
    <el-col :span="24" class="title-header">
      <el-col :span="2" :xs="10">
        <el-button size="small" type="primary"   @click="goNews(0)">新建活动</el-button>
      </el-col>
      <el-col :span="4" :xs="10">
        <el-select size="small" v-model="listQuery.status" placeholder="全部" @change="getActivityList()">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5" :xs="10">
          <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="listQuery.name">
          </el-input>
      </el-col>
      <el-col :span="2" class="success-btn" :xs="10">
        <el-button type="success" @click="getActivityList()" icon="el-icon-search" size="small">搜索</el-button>
      </el-col>
    </el-col>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      size='mini'
      highlight-current-row>
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" align="center"></el-table-column>
      <el-table-column label="访问数据" align="center">
        <template slot-scope="scope">
          <el-col>访问量：{{scope.row.view_num}}</el-col>
          <el-col>助力人数：{{scope.row.new_num}}</el-col>
          <el-col>参与人数：{{scope.row.in_num}}</el-col>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态"  align="center">
        <template slot-scope="scope">
          <span class="upper" v-if="scope.row.status == 1">已上架</span>
          <span class="lower" v-else-if="scope.row.status == 0">已下架</span>
          <span class="lower" v-else>未上架</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="关联商品数量" prop="goods_num" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" @click="goContent(scope.row.id)" type="text">内容管理</el-button>
          <el-button size="mini" type="text" @click="goAdv(scope.row.id)">广告管理</el-button>
         <!--  <el-button size="mini" type="text" v-if="scope.row.status ==1" class="lower">编辑</el-button>
          <el-button size="mini" type="text" v-else @click="goNews(scope.row.id)">编辑</el-button> -->
          <el-button size="mini" type="text" @click="goNews(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="text" @click="statusActive(scope.row.id, scope.row.status)">{{scope.row.status == 1 ? '下架' : '上架'}}</el-button>
          <!-- <el-button size="mini" type="text" @click="deleteActive(scope.row.id)">删除</el-button> -->
       <!--    <el-tooltip class="item" effect="dark" :content="scope.row.urlLinks" placement="bottom-end">
            <el-button size="mini" type="text">复制地址</el-button>
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- @current-change="getActivityList" -->
    <pagination 
      class="pagination" 
      v-show="total>0" 
      :total="total" 
      :page.sync="listQuery.page" 
      :limit.sync="listQuery.limit" 
      v-on:pagination="getActivityList" />
  </div>
</template>

<script>
import { getActList, getStatus, getDelete } from '@/api/table'
import Pagination from '@/components/Pagination' 
import Request from '@/utils/request'
export default {
  components: { Pagination },
  data() {
    return {
      options:[{label:"未上架",value:"2"},{label:"已上架",value:"1"},{label:"已下架",value:"0"},{label:'全部',value: null}],
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        name: "",
        status: null
      },
    }
  },
  beforecreate() {
    
  },
  created() {  
    this.getActivityList()
  },
  mounted() {
    
  },
  methods: {
    changePaging(val){
      this.listQuery.page = 1
      this.getActivityList()
    },
    // 活动列表
    getActivityList(){
      this.listLoading = true
      getActList(this.listQuery).then(res => {
        if(res.code == 200){
          this.listLoading = false
          this.list = res.result.list
          this.total = res.result.sign.count
        }
      })
    },
    // 活动上下架
    statusActive(id, status){
      const word = status == 1 ? '下架' : '上架';
      this.$confirm('确认要'+word+'该活动吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getStatus({id,status}).then(res => {
          if(res.code == 200){
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.getActivityList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'+word
        });          
      });
    },
    // 删除活动
    // deleteActive(id){
    //   const map = {
    //     id: id
    //   }
    //   getDelete(map).then((res) => {
    //     this.getActivityList();
    //       this.$message({
    //         message: '删除成功',
    //         type: 'success'
    //       });
    //   })
    // },
    // 关联商品
    goContent(id){
      const activityId = id ? id:0;
      this.$router.push({path:`./content/${activityId}`})
    },
    // 编辑或新建活动
    goNews(id){
      const activityId = id ? id : 0;
      this.$router.push({path:`./news/${id}`})
    },
    goAdv(id){
      const bannerId = id ? id : 0;
      this.$router.push({path:`./banner/${id}`})
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
  .pagination{
    margin-top: 10px;
  }
  .success-btn{
    text-align: right;
  }
  .upper{
    color: red;
  }
  .lower{
    color: #ccc;
  }
</style>


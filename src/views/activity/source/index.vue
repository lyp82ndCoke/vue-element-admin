<template>
  <div class="app-container">
    <el-col :span="24" class="title-header">
      <el-col :span="4"><el-button size="small" type="primary" @click="goGoods(0)">新建音频</el-button></el-col>
      <!-- <el-col :span="4">
         <el-select size="small" v-model="optionsValue" placeholder="全部">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col> -->
      <el-col :span="5">
          <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchText">
          </el-input>
      </el-col>
      <el-col :span="2" class="success-btn">
        <el-button type="success" icon="el-icon-search" size="small" @click="searchSource">搜索</el-button>
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
      <el-table-column label="音频名称" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>  
      <el-table-column label="访问数据" width="300" align="center">
        <template slot-scope="scope">
          <el-col>播放量：{{scope.row.readnum}}</el-col>
          <!-- <el-col>完播率：0</el-col> -->
        </template>
      </el-table-column>
      <!-- <el-table-column class-name="status-col" label="状态" width="200" align="center">
        <template slot-scope="scope">
          <el-col class="upper" v-if="scope.row.status == 1">已上架</el-col>
          <el-col class="lower" v-else-if="scope.row.status == 0">已下架</el-col>
        </template>
      </el-table-column> -->
      <el-table-column label="添加时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联商品" width="300" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.goods_num}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" prop="created_at" label="操作">
        <template slot-scope="scope">
         <el-button size="mini" type="text" @click="goGoods(scope.row.id)">编辑</el-button>
         <!-- <el-button size="mini" type="text" @click="frameSource(scope.row.id, scope.row.status)">{{scope.row.status == 1 ? '下架' : '上架'}}</el-button> -->
         <!-- <el-button size="mini" type="text" @click="removeSource(scope.row.id)">移除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination 
      class="pagination" 
      v-show="total>0" 
      :total="total" 
      :page.sync="listQuery.page" 
      :limit.sync="listQuery.limit" 
      v-on:pagination="changePaging" />
  </div>
</template>

<script>
import { goodsSource, sourceStatus, delSource } from '@/api/table'
import Pagination from '@/components/Pagination'
import Request from '@/utils/request'
export default {
  components: { Pagination },
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
      total: 0,
      height: null,
      alertShow: false,
      optionsValue: null,
      searchText: '',
      list: null,
      listLoading: true,
      options:[{label:"已上架",value:"1"},{label:"已下架",value:"2"}],
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
    }
  },
  created() {
    this.audioList()
  },
  methods: {
    changePaging(val){
      const map = {
        page: val.page,
        name: this.searchText
        // limit: val.limit
      }
      goodsSource(map).then((res) => {
        this.listLoading = false
        this.list = res.result.list
        this.total = res.result.sign.count
      })
    },
    // 音频列表
    audioList(){
      this.listLoading = true
      goodsSource().then((res) => {
        this.listLoading = false
        this.list = res.result.list
        this.total = res.result.sign.count
      })
    },
    // 搜索素材
    searchSource(){
      this.listLoading = true
      const map = {
        status: this.optionsValue,
        name: this.searchText,
        page: 1
      }
      goodsSource(map).then((res) => {
        this.listLoading = false
        this.list = res.result.list
        this.total = res.result.sign.count
      })
    },
    // 上下架素材
    frameSource(id, status){
      const map = {
        id: id,
        status: status
      }
      sourceStatus(map).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.audioList();
      })
    },
    // 移除素材
    // removeSource(id){
    //   const map = {
    //     id: id
    //   }
    //   delSource(map).then((res) => {
    //     this.$message({
    //       message: res.msg,
    //       type: 'success'
    //     });
    //     this.audioList();
    //   })
    // },
    goGoods(id) {
      const activityId = id?id:0;
      this.$router.push({path:`./source/${id}`})
    },
    showAlert() {
      this.alertShow = true;
    },
    hiddenAlert(){
      this.alertShow = false;
    },
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

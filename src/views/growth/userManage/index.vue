<template>
  <div class="app_container">
    <el-row class="title-header" type="flex" justify="space-between">
      <el-col :span="7">
        <el-col :span="16">
          <el-input size="small" placeholder="请输入用户昵称或手机号码" prefix-icon="el-icon-search" v-model="listQuery.search" clearable></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="success" @click="searchUser()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
    </el-row>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
        <el-table-column label="用户昵称" prop="nickname" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.nickname === null ? '--' : scope.row.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column label="地区" prop="city" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.country === '' && scope.row.province === '' && scope.row.city === ''">--</span>
            <span v-else-if="scope.row.country === null && scope.row.province === null && scope.row.city === null">--</span>
            <span v-else>{{scope.row.country}}{{scope.row.province}}{{scope.row.city}}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" prop="mobile" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.mobile === null || scope.row.mobile === '' ? '--' : scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="create_time" align="center" width='200'>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="getUserList"
      />
    </el-col>
  </div>
</template>

<script>
import { getUserList } from "@/api/homePage";
import Pagination from '@/components/Pagination';

export default {
  name:'',
  components: { Pagination },

  data(){
    return{
      listLoading: true,
      listQuery: {
        page_num: 1,
        page_size: 10,
        search: '',
      },
      total: 0,
      lists:[],
    }
  },
  created(){
    this.getUserList();
  },
  methods:{
    getUserList(){
      this.listLoading = true;
      getUserList(this.listQuery).then((res) => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.list;
          this.total = res.result.count;
        }
      })
    },
    searchUser(){
      this.listQuery.page_num = 1;
      this.getUserList();
    }
  }
}
</script>

<style lang="scss" scoped>
.app_container{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
  }
}
</style>
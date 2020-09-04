<template>
  <div class="app_container">
    <el-row class="title-header" type="flex" justify="space-between">
      <el-col :span="7">
        <el-col :span="16">
          <el-input size="small" placeholder="请输入专栏标题" prefix-icon="el-icon-search" v-model="listQuery.search" clearable></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="success" @click="searchList()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
      <el-col :span="1.5" class="success-btn">
        <el-button size="small" type="primary" @click="newColumn()">创建专栏</el-button>   
      </el-col>
    </el-row>
    <el-col :span="24" class="title-content ">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
        <el-table-column label="ID" prop="id" align="center" width='45'>
        </el-table-column>
        <el-table-column label="封面图" prop="cover_img" align="center" width='105'>
          <template slot-scope="scope">
            <img :src="scope.row.cover_img" alt="" width="85" height="60">
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="spec_column_title" align="left">
        </el-table-column>
        <el-table-column label="简介" prop="spec_column_introduction" align="center" width='230'>
          <template slot-scope="scope">
            <span>{{ scope.row.spec_column_introduction ? scope.row.spec_column_introduction : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="专栏类型" prop="type" align="center" width='105'>
          <template slot-scope="scope">
            <span>{{ scope.row.type == '1' ? '训练营专栏' : (scope.row.type == '2' ? '赠送课程专栏' : '免费专栏' ) }}{{ scope.row.type == '2' && scope.row.is_enable == '1' ? '(天)': ''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="总章节数" prop="spec_column_count" align="center" width='65'>
          <template slot-scope="scope">
            <span>{{ scope.row.spec_column_count}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已选章节数" prop="spec_column_count_now" align="center" width='65'>
        </el-table-column>
        <el-table-column label="创建者" prop="create_real_name" align="center" width='95'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_real_name === null ? '--' : scope.row.create_real_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传日期" prop="create_time" align="center" width='90'>
        </el-table-column>
        <!-- <el-table-column label="用户数量" prop="user_count" align="center" width='60'>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width='115'>
          <template slot-scope="scope">
            <el-button size="mini" @click="goEdit(scope.row.spec_column_id)" type="text">编辑</el-button>
            <el-button size="mini" @click="goCheck(scope.row.spec_column_id)" type="text">查看课程</el-button>
            <el-button size="mini" @click="goDel(scope.row.spec_column_id)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="changePaging"
      />
    </el-col>
  </div>
</template>

<script>
import { specColumnList,delSpecColumn } from "@/api/growthCamp";
import Pagination from '@/components/Pagination';

export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      listLoading: true,
      lists:[],
      listQuery: {
        page_num: 1,
        page_size: 10,
        search: '',
      },
      total: 0
    }
  },
  created(){
    this.specColumnList();
    this.listQuery.page_num = Number(sessionStorage.getItem('courseColumnPage')) || this.listQuery.page_num;
  },
  methods:{
    specColumnList(){
      this.listLoading = true;
      setTimeout(() => {sessionStorage.removeItem('courseColumnPage')}, 300);
      specColumnList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.list;
          this.total = res.result.sign.count;
        }
      });
    },
    goDel(id){
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSpecColumn({spec_column_id:id}).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.specColumnList();
          }
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // }); 
      });
    },
    goEdit(data){
      this.$router.push({ path: `./newColumn/${data}` });
      sessionStorage.setItem('courseColumnPage',this.listQuery.page_num);
    },
    goCheck(data){
      this.$router.push({ path: `./allCourse/${data}` });
    },
    newColumn(){
      let id = 0;
      this.$router.push({ path: `./newColumn/${id}` });
    },
    changePaging(){
      this.specColumnList()
    },
    searchList(){
      this.listQuery.page_num = 1;
      this.specColumnList()
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
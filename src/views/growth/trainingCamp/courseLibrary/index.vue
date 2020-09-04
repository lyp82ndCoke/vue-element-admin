<template>
  <div class="app_container">
    <el-row class="title-header" type="flex" justify="space-between">
      <el-col :span="7">
        <el-col :span="16">
          <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="listQuery.search" clearable></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="success" @click="searchList()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
      <el-col :span="1.5" class="success-btn">
        <el-button size="small" type="primary" @click="newCourse()">添加课程</el-button>        
      </el-col>
    </el-row>
    <el-col :span="24" class="title-content lessonControl">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
        <el-table-column label="课程标题" prop="free_course_title" align="left" >
          <template slot-scope="scope">
            <b>{{ scope.row.audio_title }}</b>
            <ul>
              <li v-if="scope.row.type == '1'">
                <audio controls id="audioControls">
                  <source :src='scope.row.audio_url'>
                </audio>
              </li>
              <li v-if="scope.row.type == '2'">
                <video controls width="220" height="100" id="">
                  <source :src='scope.row.audio_url'>
                </video>
              </li>
            </ul>            
          </template>
        </el-table-column>
        <el-table-column label="文件时长" prop="audio_length" align="center" width='80'>
          <template slot-scope="scope">
            <span>{{ scope.row.audio_length }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件类型" prop="type" align="center" width='80'>
          <template slot-scope="scope">
            <span>{{ scope.row.type == '1' ? '音频' : '视频' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传日期" prop="create_time" align="center" width='90'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传人" prop="create_real_name" align="center" width='100'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_real_name === null ? '--' : scope.row.create_real_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='100'>
          <template slot-scope="scope">
            <el-button size="mini" @click="goEdit(scope.row.course_id)" type="text">编辑</el-button>
            <el-button size="mini" @click="goDel(scope.row.course_id)" type="text">删除</el-button>
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
import { addCourse,updateCourse,delCourse,courseList, } from "@/api/growthCamp";
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
        spec_column_id: '',
        search: '',
        // free_package_id: this.$route.params.Campid,
      },
      total: 0
    }
  },
  created(){
    this.courseList();
    this.listQuery.page_num = Number(sessionStorage.getItem('courseLibraryPage')) || this.listQuery.page_num;
  },
  methods:{
    courseList(){
      this.lists = [];
      setTimeout(() => {
        sessionStorage.removeItem('courseLibraryPage')
      }, 300);
      this.listLoading = true;
      courseList(this.listQuery).then(res => {
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
        delCourse({course_id:id}).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.courseList();
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
      this.$router.push({ path: `./newCourse/${data}` });
      sessionStorage.setItem('courseLibraryPage',this.listQuery.page_num);
    },
    newCourse(){
      let id = 0;
      this.$router.push({ path: `./newCourse/${id}` })
    },
    changePaging(){
      this.courseList();
    },
    searchList(){
      this.listQuery.page_num = 1;
      this.courseList();
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
  b{
      display: block;
      position: relative;
      width: 720px;
      font-weight: normal;
      margin-left: 10px;
    }
  ul{
    // display: flex;
    // justify-content: flex-start;
    // align-items: center;
    list-style: none;
    position: relative;
    width: 100%;
    height: 60px;
    line-height: 60px;
    li:nth-child(1){
      width: 220px;
      position: absolute;
      right: 20px;
      // background: palegoldenrod;
      // overflow: hidden;
      #audioControls{
        width: 220px;
      }
    }
    li:nth-child(2){
      width: 300px;
      line-height: 60px;
      position: absolute;
    }
  }
}

</style>

<style> 
.lessonControl .el-table .cell{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
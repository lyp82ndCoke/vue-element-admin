<template>
  <div class="app_container">
    <el-row class="title-header" type="flex" justify="space-between">
      <el-col :span="7">
        <el-col :span="16">
          <el-input size="small" placeholder="请输入测评试卷名称" prefix-icon="el-icon-search" v-model="listQuery.search_paper_name" clearable></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="success" @click="searchList()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
      <el-col :span="1.5" class="success-btn">
        <el-upload
          class="upload-demo"
          action=""
          :limit="1"
          :before-remove="beforeRemove"
          :http-request="getUploadFile"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          :file-list="fileList"
          ref="upload"
          >
          <el-button size="small">上传文件</el-button>
        </el-upload>
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
        <el-table-column label="测评试卷名称" prop="paper_name" align="left">
        </el-table-column>
        <el-table-column label="上传时间" prop="create_time" align="center" width='180'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_time ? scope.row.create_time : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传人" prop="create_user_name" align="center" width='180'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_user_name ? scope.row.create_user_name : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='150'>
          <template slot-scope="scope">
            <el-button size="mini" @click="goCheck(scope.row.paper_id)" type="text">查看</el-button>
            <el-button size="mini" @click="goDel(scope.row.paper_id)" type="text">删除</el-button>
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
import { getPaperList,importPaper,delPaper } from "@/api/growthCamp";
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
        search_paper_name:''
      },
      total: 0,
      fileList:[]
    }
  },
  created(){
    this.getPaperList();
  },
  methods:{
    getPaperList(){
      getPaperList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.paper_list;
          this.total = Number(res.result.count);
        }
      });
    },
    getUploadFile(data,file,fileList){
      var formData = new FormData();
      formData.append("excel_file", data.file);
      importPaper(formData).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '上传成功',
            type: 'success'
          });
          this.getPaperList();
          setTimeout(() => {
            this.fileList = [];
          }, 1000);
        }
      });
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleExceed(files, fileList) {
      // this.fileList = []
      this.$message.warning('每次只允许上传一个哦');
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    goDel(id){
      this.$confirm('确定删除该试卷吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPaper({ paper_id:id }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getPaperList();
          }
        });
      })
    },
    goCheck(data){
      this.$router.push({ path: `./checkPaper/${data}` });
    },
    changePaging(){
      this.getPaperList();
    },
    searchList(){
      this.listQuery.page_num = 1;
      this.getPaperList();
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
  .upload-demo{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  // .eltables{
  //   min-height: 500px;
  // }
}
</style>
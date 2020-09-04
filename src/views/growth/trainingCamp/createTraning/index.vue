<template>
  <div class="app_container">
    <el-row class="title-header" type="flex" justify="space-between">
      <el-col :span="6" class="success-btn">
        <el-col :span="18">
          <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="listQuery.search" clearable></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="searchData()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
      <el-col :span="1.2">
        <el-button size="small" type="primary" @click="dialogFormVisible = true">创建训练营</el-button>
      </el-col>
    </el-row>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        fit
        height="515"
        size='mini'
        highlight-current-row>
        <el-table-column label="ID" prop="id" align="center" width='80'>
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="训练营名称" prop="camp_name" align="left" >
        </el-table-column>
        <el-table-column label="营期数量" prop="camp_times_count" align="center" width='160'>
        </el-table-column>
        <el-table-column label="创建者" prop="create_real_name" align="center" width='160'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_real_name === null ? '--' : scope.row.create_real_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" align="center" width='160'>
        </el-table-column>
        <el-table-column label="操作" align="center" width='190'>
          <template slot-scope="scope">
            <el-button size="mini" @click="goEdit(scope.row.camp_id,scope.row.camp_name)" type="text">编辑</el-button>
            <el-button size="mini" @click="goCheck(scope.row.camp_id)" type="text">查看详情</el-button>
            <!-- <el-button size="mini" @click="goDel(scope.row.camp_id)" type="text">删除</el-button> -->
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
    <el-dialog title="创建/编辑训练营" width="35%" :visible.sync="dialogFormVisible">
      <el-form :model="newform" :rules="rules" ref="newform">
        <el-form-item label="训练营名称" prop="name" :label-width="formLabelWidth">
          <el-col :span="18">
            <el-input v-model="newform.name" ></el-input>
         </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm('newform')">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('newform')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { campList,addCamp,editCamp,delCamp } from "@/api/growthCamp";
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
        page_size: 12,
        search: '',
      },
      total: 0,
      dialogFormVisible: false,
      formLabelWidth: '100px',
      rules: {
        name: [
          { required: true, message: '请输入训练营名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      newform: {
        name: '',
      },
    }
  },
  created(){
    this.campList();
    this.listQuery.page_num = Number(sessionStorage.getItem('createTraningPage')) || this.listQuery.page_num;
  },
  methods:{
    campList(){
      setTimeout(() => {sessionStorage.removeItem('createTraningPage')}, 300);
      this.listLoading = true;
      campList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.list;
          this.total = res.result.sign.count;
        }
      });
    },
    goCheck(id){
      this.$router.push({ path: `./allCamp/${id}` });
      sessionStorage.setItem('createTraningPage',this.listQuery.page_num);
    },
    goEdit(i,n){  
      this.dialogFormVisible = true;
      this.newform.name = n;
      this.newform.id = i;
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.newform.id){
            editCamp({camp_name: this.newform.name,camp_id:this.newform.id,}).then((res) => {
              if (res.code == 200) {
                this.dialogFormVisible = false;
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.campList();
              }
            })
          }else{
            addCamp({camp_name: this.newform.name,}).then((res) => {
              if (res.code == 200) {
                this.dialogFormVisible = false;
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.campList();
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      // this.dialogFormVisible2 = false;
      this.$refs[formName].resetFields();
    },
    newCourse(){
      let id = 0;
      this.$router.push({ path: `./newCourse/${id}` })
    },
    editforms(data){
      let id = data.free_course_id + '&' + data.free_package_id;
      this.$router.push({ path: `./question/${id}` })
    },
    searchData(){
      this.listQuery.page_num = 1;
      this.campList()
    },
    changePaging(){
      this.campList()
    },
  }
}
</script>

<style lang="scss" scoped>
.app_container{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
  }
  ul{
    list-style: none;
    position: relative;
    width: 100%;
    height: 60px;
    line-height: 60px;
    li:nth-child(1){
      width: 200px;
      line-height: 60px;
      position: absolute;
      left: 0;
    }
    li:nth-child(2){
      width: 300px;
      line-height: 60px;
      position: absolute;
      left: 230px;
    }
  }
}

</style>
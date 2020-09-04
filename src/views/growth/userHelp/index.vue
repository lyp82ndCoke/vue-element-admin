<template>
  <div class="app_container">
    <el-col :span="24" class="title-header">
      <el-col :span="3">
        <el-button size="small" type="primary" @click="newQuestion"> 创建新问题 </el-button>
      </el-col>
    </el-col>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        class="eltables"
        highlight-current-row>
        <el-table-column label="序列" type='index' align="center" width='60'></el-table-column>
        <el-table-column label="问题" prop="problem" align="center" width='330'></el-table-column>
        <el-table-column label="问题说明" prop="problem_statement" align="center"></el-table-column>
        <el-table-column label="时间" prop="create_time" align="center" width='180'></el-table-column>
        <el-table-column label="操作" align="center" width='120'>
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row.id)" type="text">编辑</el-button>
            <el-button size="mini" @click="del(scope.row.id)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="usehelpList"
      />
    </el-col>
    <el-dialog title="创建/编辑问题" width="34%" :visible.sync="dialogFormVisible">
      <el-form :model="newform" :rules="rules" ref="newform">
        <el-form-item label="问题简介" prop="problem" :label-width="formLabelWidth">
          <el-input v-model="newform.problem" placeholder="请输入问题简介"></el-input>
        </el-form-item>
        <el-form-item label="问题说明" prop="problem_statement" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入问题说明"
            v-model="newform.problem_statement">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('newform')">取 消</el-button>
        <el-button type="primary" @click="submitForm('newform')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { editSubmitUsehelp,deleteUsehelp,usehelpList } from "@/api/growthCamp";
import { usehelpList, addSubmitUsehelp, getEditHelp, editSubmitUsehelp, deleteUsehelp } from "@/api/homePage";
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
        article_title:'',
      },
      total: 0,
      lists:[],
      dialogFormVisible: false,
      formLabelWidth: '90px',
      newform:{
        problem:'',
        problem_statement:'',
        
      },
      rules:{
        problem: [
          { required: true, message: '问题不能为空', trigger: 'change' }
        ],
        problem_statement: [
          { required: true, message: '问题说明不能为空', trigger: 'change' }
        ],
      },
      editID: ''
    }
  },
  created(){
    this.usehelpList();
  },
  methods:{
    usehelpList(){
      this.listLoading = true;
      usehelpList(this.listQuery).then((res) => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.list.reverse();
          this.total = res.result.count;
        }
      })
    },
    del(id){
      this.$confirm('确定删除此条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUsehelp({problem_id:id}).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功！',
              type: "success"
            });
            this.usehelpList();
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });          
      });
    },
    edit(id){
      this.dialogFormVisible = true;
      this.editID = id;
      getEditHelp({problem_id:id,}).then((res) => {
        if (res.code == 200) {
          this.newform = {...res.result}
          this.usehelpList();
        }
      })
    },
    newQuestion(){
      this.dialogFormVisible = true;
      this.editID = '';
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.editID){
            this.newform.problem_id = this.editID;
            editSubmitUsehelp(this.newform).then((res) => {
              if (res.code == 200) {
                this.dialogFormVisible = false;
                this.$message({
                  message: '操作成功',
                  type: "success"
                });
                this.$refs[formName].resetFields();
                this.usehelpList();
              }
            })
          }else{
            addSubmitUsehelp(this.newform).then((res) => {
              if (res.code == 200) {
                this.dialogFormVisible = false;
                this.$message({
                  message: '操作成功',
                  type: "success"
                });
                this.$refs[formName].resetFields();
                this.usehelpList();
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
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
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
  .eltables{
    min-height: 500px;
  }
}
</style>
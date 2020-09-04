<template>
  <div class="app_task_library">
    <el-col :span="24" class="title-header">
      <el-col :span="24">
        <el-col :span="2">
          <el-button size="small" type="primary" @click="createTask()">创建任务</el-button>
        </el-col>
        <el-col :span="5" align="center">
          <el-input 
            size="small" 
            clearable 
            placeholder="请输入任务内容" 
            prefix-icon="el-icon-search" 
            v-model="listQuery.search" 
            @clear="clearTitle"
            @change="clearTitle">
          </el-input>
        </el-col>
        <el-col :span="4" align="center">
          <el-select v-model="listQuery.task_category" clearable placeholder="请选择分类" size="small" @change="clearTitle">
            <el-option
              v-for="item in options2"
              :key="item.index"
              :label="item.task_category_name"
              :value="item.task_category">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="success-btn" align="center">
          <el-button type="success" @click="clearTitle()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
    </el-col>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
        <el-table-column label="分类" prop="task_category_name" align="center" width="120"></el-table-column>
        <el-table-column label="封面图" prop="title" align="center" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.task_cover" alt="" width="80">
          </template>
        </el-table-column>
        <el-table-column label="任务详情" prop="task_details" align="center"></el-table-column>
         <el-table-column label="更新时间" prop="create_time" align="center" width="150"></el-table-column>
        <el-table-column label="创建者" prop="create_real_name" align="center" width="150"></el-table-column>
        <el-table-column label="操作" align="center" width='130'>
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="editTask(scope.row.id)">编辑</el-button>
            <el-button size="mini" @click="deleteArticle(scope.row.id)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="getTaskLibraryList"/>
    </el-col>

    <el-dialog title="创建任务" :visible.sync="alertShow" class="create-alert">
      <el-form label-position="right" ref="form" :rules="rules" :model="form" label-width="110px">
        <el-form-item label="任务分类：" prop="task_category">
          <el-radio-group v-model="form.task_category">
            <el-radio :label="item.task_category" v-for="item in options" :key="item.index">
              {{item.task_category_name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务封面图：">
          <el-col :span="5">
            <!-- <el-upload 
              class="avatar-uploader" 
              :action="host"  
              :show-file-list="false"  
              :on-success="handleAvatarSuccess"  
              :before-upload="beforeAvatarUpload">
              <img v-if="form.task_cover" :src="form.task_cover" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload> -->
            <img v-if="form.task_cover" :src="form.task_cover" class="avatar">
          </el-col>
        </el-form-item>
        <el-form-item label="任务内容：" prop="task_details">
          <el-col :span="20">
            <el-input
              type="textarea"
              :rows="6"
              resize="none"
              placeholder="请输入任务内容......"
              v-model="form.task_details">
            </el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="alertShow=false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="onSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { taskLibraryList, addTask, delTask, updateTask } from "@/api/homePage";
import { getTaskCategroyList } from "@/api/growthCamp";

import Pagination from '@/components/Pagination';
export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      alertShow: false,
      form: {
        task_category: "",
        task_cover: "https://poster-share.oss-cn-beijing.aliyuncs.com/poster/ZMWH0E787BAB33BAACA5AD7D9DB8A46F28F2.jpg",
        task_details: "",
        primary_id: null,
      },
      rules: {
        task_category: [
          { required: true, message: '请选择任务分类', trigger: 'change' },
        ],
        // task_cover: [
        //   { required: true, message: '请上传任务封面图', trigger: 'blur' },
        // ],
        task_details: [
          { required: true, message: '请输入任务内容', trigger: 'blur' },
        ],
      },
      host: '',
      listLoading: true,
      total: 0,
      list:[],
      listQuery: {
        page_num: 1,
        page_size: 10,
        search:'',
        task_category: '',
      },
      options:[],
      options2:[
        {
          task_category_name: '全部类型',
          task_category: '',
        }
      ]
    }
  },
  created(){
    this.host= process.env.BASE_API+'publicmethod/upfile/upload_file';
    this.getTaskLibraryList();
    this.getTaskCategroyList();
  },
  methods:{
    getTaskCategroyList(){
      getTaskCategroyList().then(res => {
        if(res.code == 200){
          this.options = res.result.task_category_list;
          this.options.forEach(t=>{
            this.options2.push(t)
          })
        }
      })
    },
    getTaskLibraryList(){
      this.listLoading = true;
      taskLibraryList(this.listQuery).then(res => {
        if(res.code == 200){
          this.listLoading = false;
          this.list = res.result.list;
          this.total = res.result.sign.count;
        }
      })
    },
    createTask(){
      this.form.task_category = "";
      this.form.task_details = "";
      this.alertShow = true;
    },
    // beforeAvatarUpload(file) {
    //   var type = file.name.substring(file.name.lastIndexOf('.')+1)
    //   const extension = type === 'png'
    //   const extension2 = type === 'jpg'
    //   const extension3 = type === 'jpeg'
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!extension && !extension2 && !extension3) {
    //     this.$message.error('上传头像图片只能是 JPG 格式 或者 PNG 格式!');
    //     return false;
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传头像图片大小不能超过 2MB!');
    //     return false;
    //   }
    // },
    // handleAvatarSuccess(res, file) {
    //   this.form.task_cover = res.result.urlFile;
    // },
    onSubmit(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          if(this.form.primary_id){
            updateTask(this.form).then(res => {
              if(res.code == 200){
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                });
                this.getTaskLibraryList();
              }
            })
          }else {
            addTask(this.form).then(res => {
              if(res.code == 200){
                this.$message({
                  message: '创建成功',
                  type: 'success'
                });
                this.getTaskLibraryList();
              }
            })
          }
          this.alertShow = false;
        }
      });
    },
    editTask(primary_id){
      taskLibraryList({primary_id}).then(res => {
        if(res.code == 200){
          this.form.task_details = res.result.task_details;
          this.form.task_cover = res.result.task_cover;
          this.form.task_category = res.result.task_category;
          this.form.primary_id = res.result.id;
          this.alertShow = true;
        }
      })
    },
    deleteArticle(id){
      this.$confirm('确认要删除此任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delTask(id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    delTask(primary_id){
      delTask({primary_id}).then(res => {
        if(res.code == 200){
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getTaskLibraryList();
        }
      })
    },
    clearTitle(){
      this.listQuery.page_num = 1;
      this.getTaskLibraryList();
    }
  }
}
</script>

<style lang="scss">
.app_task_library{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
  }
  .create-alert{
    .el-dialog__body{
      padding: 10px 20px;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
    .avatar {
      width: 120px;
      height: 120px;
      display: block;
    }
    .el-form-item{
      margin-bottom: 18px;
    }
  }
}
</style>
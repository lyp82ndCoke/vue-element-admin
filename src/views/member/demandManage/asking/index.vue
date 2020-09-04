<template>
  <div class="app-container">
    
    <el-row>
      <el-col :span="24" class="title-header">
        <el-col :span="4">
          <el-button size="small" type="primary" @click="dialogFormVisible = true">创建问题</el-button>
        </el-col>
        <el-col :span="5">
            <el-input size="small" placeholder="请输入用户名称" prefix-icon="el-icon-search" v-model="searchText">
            </el-input>
        </el-col>
        <el-col :span="2" class="search-btn">
          <el-button type="success" icon="el-icon-search" size="small" @click="searchGoods">搜索</el-button>
        </el-col>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="22" class="title-header">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          size="small"
          highlight-current-row>
          <el-table-column label="需求详情" width="550" align="center">
            <template slot-scope="scope">
              <!-- {{ scope.row.name }} -->
            </template>
          </el-table-column>  
          <el-table-column label="用户信息" width="428" align="center">
            <template slot-scope="scope">
              <!-- {{ scope.row.updatetime }} -->
            </template>
          </el-table-column>
          <el-table-column label="时间" width="200" align="center">
            <template slot-scope="scope">
              <!-- <span>{{ scope.row.price }}</span> -->
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog title="大家都在问" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="问题描述" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="textarea">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      textarea:'',
      dialogFormVisible: false,
        form: {
          name: '',
          region: '',
        },
        formLabelWidth: '120px',
        imageUrl: ''
    }
  },
  methods:{
    createProblem(){

    },
    searchGoods(){
      
    },
    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
  }
}
</script>

<style lang="scss" scoped>
  .app-container{
    padding: 20px;
  }
  .el-table{
    margin-top: 30px;
  }
  .search-btn{
    margin-left: 20px;
  }
</style>
<template>
  <div class="app-container">
    <el-col :span="24" class="title-header">
      <el-col :span="3">
        <el-button size="small" type="primary" @click="goGoods(0)">上传二维码</el-button>
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
      <el-table-column label="二维码名称" width="200" align="center">
        <template slot-scope="scope">
          <el-col :span="16">{{ scope.row.qr_code_name }}</el-col>
        </template>
      </el-table-column>
      <el-table-column label="二维码" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.qr_code_url" class="head-img" alt="">
        </template>
      </el-table-column>
      <el-table-column label="二维码类型" align="center">
        <template slot-scope="scope">
          <el-col v-if="scope.row.qr_code_type == 1">微信群</el-col>
          <el-col v-else-if="scope.row.qr_code_type == 2">辅导员</el-col>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" width="100" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goGoods(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      class="pagination"
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page_no"
      :limit.sync="listQuery.page_size"
      v-on:pagination="changePaging"/>

    <!-- 上传二维码 修改 alert -->
    <el-col :span="24" class="alert-wrap" v-if='alreadyQrcode'>
      <el-col :span="24" class="alert-content-wrap">
        <el-form ref="form" :model="form" :rules="rules" class="form-wrap" label-width="140px">

          <el-form-item label="二维码名称：" prop="qr_code_name">
            <el-col :span="12">
              <el-input size="small" v-model="form.qr_code_name"/>
            </el-col>
          </el-form-item>


          <el-form-item label="二维码类型：" prop="qr_code_type">
            <el-col :span="12">
              <el-select v-model="form.qr_code_type" clearable  placeholder="请选择" size="small">
                <el-option
                  v-for="item in options"
                  :key="item.qr_code_type"
                  :label="item.label"
                  :value="item.qr_code_type">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>

          

          <el-form-item label="添加二维码：" prop="qr_code_url">
            <el-col :span="5">
              <el-upload 
                  class="avatar-uploader" 
                  :action="host"  
                  :show-file-list="false"  
                  :on-success="handleAvatarSuccess"  
                  :before-upload="beforeAvatarUpload">
                <img v-if="form.qr_code_url" :src="form.qr_code_url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
          </el-form-item>
          
          <el-form-item>
            <el-col :span="8">
              <el-button type="primary" @click="onSave('form')">保存</el-button>
              <el-button type="primary" @click="hiddenQrcodeAlert" class="handleHidden">取消</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getSourcesList, addSources, updateSources } from '@/api/qecode'
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
      host: '',
      // 推广弹框
      popularize:true,
      height: null,
      alertShow: false,
      searchText: '',
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page_no: 1,
        page_size: 10,
      },
      alreadyQrcode: false,
      //上传二维码 提交数据
      form:{
        qr_code_type:null,
        qr_code_name: '',
        qr_code_url: ''
      },
      options:[
        { label: "微信群", qr_code_type: 1 }, 
        { label: "辅导员", qr_code_type: 2 }
      ],
      rules:{
        qr_code_type: [
          { required: true, message: '请选择二维码类型', trigger: 'change' },
        ],
        qr_code_name: [
          { required: true, message: '请输入二维码名称', trigger: 'blur' },
        ],
        qr_code_url: [
          { required: true, message: '请上传二维码图片哦', trigger: 'blur' },
        ]
      },
      qr_code_id:null,
    }
  },
  created() {
    this.getSourcesList()
    this.host= process.env.GROUP_API+'/service/shop/item/file_upload';
  },
  methods: {
    changePaging(val) {
      this.listQuery.page_no = val.page;
      this.listQuery.page_size = val.limit;
      this.getSourcesList();
    },
    // 二维码管理 列表
    getSourcesList() {
      this.listLoading = true;
      getSourcesList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.list = res.result.rows;
          this.total = res.result.total;
        }
      })
    },
    goGoods(scope) {
      if(scope != 0){
        this.form = scope;
        this.qr_code_id = scope.qr_code_id; //修订二维码的id
      } else {
        this.form.qr_code_name = '';
        this.form.qr_code_type = '';
        this.form.qr_code_url = '';
      }
      this.alreadyQrcode = true;
    },
    goContent(id) {
      const activityId = id ? id : 0;
      this.$router.push({ path: `./news/${id}` })
    },
    hiddenQrcodeAlert(){
      this.alreadyQrcode = false;
      this.getSourcesList();
    },
    handleAvatarSuccess(res, file) {
      this.form.qr_code_url = res.result.file_url;
    },
    beforeAvatarUpload(file) {
      var type = file.name.substring(file.name.lastIndexOf('.')+1)
      const extension = type === 'png'
      const extension2 = type === 'jpg'
      const extension3 = type === 'jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!extension && !extension2 && !extension3) {
        this.$message.error('上传头像图片只能是 JPG 格式 或者 PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        return false;
      }
    },
    updateSources(){
      const map = this.form;
      map.qr_code_id = this.qr_code_id;
      updateSources(map).then((res) => {
        if(res.code == 200){
          this.$message({
            message: '修订成功',
            type: 'success'
          });
          this.alreadyQrcode = false;
        }
      })
    },
    addSources(){
      const map = this.form;
      addSources(map).then(res => {
        if(res.code == 200){
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.getSourcesList();
          this.alreadyQrcode = false;
        }
      })
    },
    onSave(form){
       this.$refs[form].validate((valid) => {
        if (valid) {
          if(this.qr_code_id){
            //修订二维码
            this.updateSources();
          } else {
            //添加二维码
            this.addSources();
          }
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  padding: 20px;
  .head-img{
    width: 50px;
    height: 50px;
  }
  .popularize-wrap{
   
    z-index: 20;
    position: absolute;
    top: 40%;
    left: 40%;
    transform: translate(-50%,-50%);
    padding: 20px;
    border-radius: 5px;
     background-color: #ededed;
  }
}
.title-header {
  padding: 10px 0;
}
.success-btn {
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
    background-color: rgba(0,0,0,.5);
    padding: 120px 150px 50px 300px;
  }
  &-content-wrap{
    border-radius: 5px;
    height: 85%;
    width: 80%;
    padding: 20px;
    background-color: #fff;
  }
}
.add-com {
  font-size: 20px;
}
.title-header {
  padding: 10px 0;
}
.close-alert {
  text-align: right;
  font-size: 30px;
  color: #ccc;
}
.pagination {
  margin-top: 10px;
}
.search-btn {
  margin-left: 20px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.handleHidden{
  margin-left: 30px;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.upper {
  color: red;
}
.lower {
  color: #ccc;
}
</style>

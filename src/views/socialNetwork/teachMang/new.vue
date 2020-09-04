<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-form ref="form" :model="form" :rules="rules" class="form-wrap" label-width="155px">
          <el-form-item label="关联登录号码" class="item-gender" prop="union_uuid">
            <el-select
              v-model="relationValue"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="搜索名称和手机号"
              :remote-method="remoteMethod"
              :loading="loading"
              @change="handleRelation"
            >
              <el-option
                v-for="item in userList"
                :key="item.union_uuid"
                :label="`${item.real_name}` + `${item.mobile}`"
                :value="{value:item}"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="头像图片:" prop="head_pic">
            <el-col :span="4">
              <el-upload
                class="avatar-uploader"
                :action="host"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="form.head_pic" :src="form.head_pic" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
            <el-col :span="17" class="input-pro">图片上传格式为：jpg、png；图片比例1:1</el-col>
            <el-col :span="17" class="input-pro">建议尺寸500像素 X 500像素</el-col>
          </el-form-item>

          <el-form-item label="真实姓名：" class="item-gender" prop="real_name">
            <el-col :span="8">
              <el-input v-model="form.real_name" placeholder="请输入真实姓名"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="手机号：" class="item-gender" prop="mobile">
            <el-col :span="8">
              <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="微信昵称：" class="item-gender" prop="nickname">
            <el-col :span="8">
              <el-input v-model="form.nickname" placeholder="请输入微信昵称"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="个人介绍(前端展示)：" prop="personal_smart">
            <!-- <span class="tips">（前端展示）</span> -->
            <el-col :span="24">
              <!-- <tinymce v-model="form.personal_smart"></tinymce> -->
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入个人介绍"
                v-model="form.personal_smart"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="item-gender">
            <el-button type="primary" @click="onSubmit('form')">提交</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
  </div>
</template>

<script>
import { addCounsellorList, getRelationUserList, getEditDetailList } from '@/api/articleLibrary'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Sticky, Tinymce },
  data() {
    return {
      relationValue: null,
      host: '',
      loading: false,
      userList: [],
      form: {
        union_uuid: '',
        mobile: '',
        head_pic: null,
        real_name: '',
        nickname: '',
        personal_smart: '',
        role_type: 2
      },
      rules: {
        union_uuid: [
          { required: true, message: '请选择关联登录号码', trigger: 'change' }
        ],
        head_pic: [
          { required: true, message: '请上传头像图片', trigger: 'blur' }
        ],
        real_name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入微信昵称', trigger: 'blur' }
        ],
        personal_smart: [
          { required: true, message: '请输入个人介绍', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    this.user_uuid = this.$route.params.id;
    if (this.user_uuid != 0) {
      this.getEditDetailList(this.user_uuid)
    }


  },
  methods: {
    handleRelation(value) {
      this.form.union_uuid = value.value.union_uuid;
      this.form.name_mobile = value.value.real_name + value.value.mobile;

      this.form.real_name = value.value.real_name;
      this.form.mobile = value.value.mobile;
    },
    // 获取编辑教研 详情
    getEditDetailList(user_uuid) {
      const map = { uuid: user_uuid };
      getEditDetailList(map).then((res) => {
        if (res.code == 200) {
          this.form = res.result;
          this.relationValue = res.result.name_mobile
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const map = {
            search: query
          }
          // 获取关联用户
          getRelationUserList(map).then((res) => {
            if (res.code == 200) {
              this.userList = res.result.list
            }
          })
        }, 200);
      } else {
        this.userList = [];
      }
    },


    beforeAvatarUpload(file) {
      var type = file.name.substring(file.name.lastIndexOf('.') + 1)
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
    // 上传头像
    handleAvatarSuccess(resData) {
      // console.log(resData, '123')
      if (resData.code == 200) {
        this.form.head_pic = resData.result.urlFile;
      }
      // console.log(resData.result)
    },
    onCancel() {
      this.$confirm('取消后不会保留已输入信息,确认取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.go(-1)
      }).catch(() => {
      });
    },
    // 添加教研 提交
    onSubmit(formName) {
      const map = { ...this.form };
      // 如果是编辑提交  
      // if(this.editId != 0){
      //   map.user_uuid = this.user_uuid;
      // }
      // addCounsellorList(map).then((res) => {
      //   if(res.code == 200){
      //     this.$message({
      //       message: res.msg,
      //       type: 'success'
      //     })
      //   }
      // })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form.personal_smart) {
            this.$message({
              message: '请填写个人介绍哦',
              type: 'warning'
            });
            return false;
          }
          const map = { ...this.form };
          // 如果是编辑提交  
          if (this.user_uuid != 0) {
            map.user_uuid = this.user_uuid;
          }
          addCounsellorList(map).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.$router.go(-1);
            }
          })
        } else {
          this.$message({
            message: '请填写必填信息哦',
            type: 'warning'
          });
          return false;
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  padding: 0 0 20px;
  .table-wrap {
    padding: 20px;
    .coverimg {
      width: 50px;
      height: 50px;
    }
  }
}
.title-header {
  padding: 10px 0;
}
.pagination {
  margin-top: 10px;
}
.sub-navbar {
  text-align: left;
  .subtitle {
    padding: 0 20px;
  }
}
.close-alert {
  text-align: right;
  font-size: 30px;
  color: #ccc;
}
.search-btn {
  margin-left: 20px;
}
.add-com {
  font-size: 20px;
}
.success-btn {
  text-align: right;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  max-width: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
.input-pro {
  padding-left: 20px;
}
</style>


<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">我的资料</el-col>
    </sticky>
    <el-form
      class="demo-form-inline"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="160px"
      size="small"
    >
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-putple">
            <el-form-item label="真实姓名：" prop="real_name">
              <el-input v-model="form.real_name" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </div>
          <div class="grid-content bg-putple">
            <el-form-item label="微信昵称：" prop="nickname">
              <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <el-col class="grid-content bg-putple-light">
            <el-form-item label="头像图片：" prop="head_pic" class="avater-wrap">
              <el-col>
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
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <div class="grid-content">
            <el-form-item label="个人介绍（前端展示）：" prop="personal_smart">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入个人介绍"
                v-model="form.personal_smart"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">更新资料</el-button>
        <!-- <el-button @click="onCancel">取消</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { teachInfo, upDateInfo } from '@/api/counselor'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
export default {
  components: {
    Sticky,
    Tinymce
  },
  data() {
    const host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    return {
      form: {
        "user_uuid": "123123123",
        "real_name": "admin",
        "head_pic": "http://img4.imgtn.bdimg.com/it/u=2697009988,4217049106&fm=26&gp=0.jpg",
        "nickname": "admin",
        "personal_smart": null
      },
      host,
      rules: {
        real_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        head_pic: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        personal_smart: [
          { required: true, message: '请输入简介', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.teachInfo();
    this.age1 = 0;
    this.age2 = 0;
  },
  methods: {
    // 获取个人资料
    teachInfo() {
      teachInfo().then(res => {
        if (res.code == 200) {
          this.form = res.result;
        }
      })
    },
    // 上传头像
    handleAvatarSuccess(resData) {
      if (resData.code == 200) {
        if (this.edit) {
          if (this.edit == 2) {
            // 排期中
            this.scheduleForm.poster_img = resData.result.urlFile;
          } else if (this.edit == 3) {
            // 进行中
            this.editForm.poster_img = resData.result.urlFile;
          } else if (this.edit == 4) {
            // 已过期
            this.expiredForm.poster_img = resData.result.urlFile;
          }
        } else {
          this.form.poster_img = resData.result.urlFile;
        }

      }
    },
    // 上传头像
    beforeAvatarUpload(file) {
      const fileType = file.type;
      let isJPG;
      const isLt2M = file.size / 1024 / 1024 < 4;
      // console.log(fileType)
      if (fileType == 'image/png' || fileType == 'image/jpg' || fileType == 'image/gif' || fileType == 'image/jpeg') {
        isJPG = true;
      } else {
        this.$message.error('上传海报图片只能是 jpg gif png 格式!');
        isJPG = false;
      }
      if (!isLt2M) {
        this.$message.error('上传海报图片大小不能超过 4MB!');
      }
      return isJPG && isLt2M;
    },
    h(n) {
      return n + '岁';
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let form = {};
          if (this.edit) {
            if (this.edit == 2) {
              // 排期中
              form = this.scheduleForm;
            } else if (this.edit == 3) {
              // 进行中
              form = this.editForm;
            } else if (this.edit == 4) {
              // 已过期
              form = this.expiredForm;
            }
          } else {
            form = this.form;
          }
          this.upDateInfo(form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    upDateInfo() {
      upDateInfo(this.form).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '更新成功！'
          })
        }
      })
    },
    onCancel() {
      this.$confirm('取消后不会保留已输入信息,确认取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addWrap = false;
      }).catch(() => {
      });
    }
  }

}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0 0 20px;
  .demo-form-inline {
    padding: 20px;
  }
  .bg-putple-light {
    .avater-wrap {
      height: 90px;
      .avatar {
        width: 80px;
        width: 80px;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 80px;
        width: 80px;
        line-height: 80px;
        text-align: center;
      }
    }
  }
}
</style>
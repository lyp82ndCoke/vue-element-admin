<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col
        :span="10"
        class="subtitle"
      >新建账号</el-col>
    </sticky>
    <el-col
      :span="24"
      class="content-wrap"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="120px"
      >
        <el-form-item
          label="真实姓名:"
          prop="real_name"
        >
          <el-input v-model="form.real_name" />
        </el-form-item>
        <el-form-item
          prop="group_id"
          label="所属部门:"
        >
          <el-select
            prop="group_id"
            v-model="form.group_id"
            placeholder="please select your zone"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.group_title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="title"
          label="职称:"
        >
          <el-input v-model="form.title" />
        </el-form-item>

        <el-form-item
          prop="mobile"
          label="手机号:"
        >
          <el-input v-model="form.mobile" />
        </el-form-item>
        <el-form-item
          prop="head_portrait"
          label="头像:"
        >
          <el-col :span="5">
            <el-upload
              class="avatar-uploader"
              :action="host"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="form.head_portrait"
                :src="form.head_portrait"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-upload>
          </el-col>
          <el-col
            :span="18"
            class="input-prompt"
          >建议尺寸：120*120像素</el-col>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit('form')"
          >确定</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>

import Sticky from '@/components/Sticky'
import { getRoles, getUser, addUser, updateUser } from '@/api/rule'
export default {
  name: 'newStaff',
  components: { Sticky },
  data() {
    var phone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
        if (!reg.test(value)) {
          callback(new Error('手机号格式有误'));
        }
        callback();
      }
    };
    return {
      host: '',
      options: [],
      form: {
        "user_id": "",
        "user_name": "",
        "mobile": "",
        "create_time": "",
        "status": 1,
        "real_name": "",
        "head_portrait": "https://dw-xiaochengxu.oss-cn-beijing.aliyuncs.com/ZMWH61A2287317F1BF9BCF89D900B5DC85B2.png",
        "title": "",
        "group_title": ""
      },
      rules: {
        real_name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        group_id: [
          { required: true, message: '请选择所属角色部门', trigger: 'blur' }
        ],

        title: [
          { required: true, message: '请输入职位职称', trigger: 'blur' }
        ],
        mobile: [
          { validator: phone, type: 'number', required: true, message: '手机号格式错误!', trigger: 'blur' }
        ],
        head_portrait: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    if (this.$route.params.id != 0) {
      this.form.user_id = this.$route.params.id;
      this.getUser()
    }
    this.getRoles();
    // console.log(this.$route.params.id)
    // if(this.$router)
  },
  methods: {
    // 获取角色列表
    getRoles() {
      const data = { page_num: 1, page_size: 100 }
      getRoles(data).then(response => {
        // console.log(response.result.listData)
        this.options = response.result.listData;
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.user_id) {
            this.updateUser();
            return false;
          }
          this.addUser();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 新增用户
    addUser() {
      const data = this.form;
      addUser(data).then(response => {
        if (response.code == 200) {
          this.$confirm('创建成功!', '提示', {
            confirmButtonText: '继续创建用户',
            cancelButtonText: '返回账户列表',
            type: 'success',
            center: true
          }).then(() => {

          }).catch(() => {
            this.$router.go(-1)
          })
        }
      })
    },
    // 编辑用户,获取用户信息
    getUser() {
      let data = {
        user_id: this.form.user_id
      }
      // console.log(data)
      getUser(data).then(response => {
        this.form = response.result;
        // console.log('用户信息', response.result);
      })
    },
    // 编辑用户
    updateUser() {
      const data = this.form;
      updateUser(data).then(response => {
        if (response.code == 200) {
          this.$alert('用户信息更新成功!', '提示', {
            confirmButtonText: '确定',
            type: 'success',
            center: true
          }).then(() => {
            this.$router.go(-1)
          }).catch(() => {
            this.$router.go(-1)
          })
        }
      })
    },
    // 上传头像
    handleAvatarSuccess(resData) {
      if (resData.code == 200) {
        this.form.head_portrait = resData.result.urlFile;
      }
      // console.log(resData.result)
      // this.from.head_portrait = 
    },
    beforeAvatarUpload() { },
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
    // 取消创建账号
    cancel() {
      this.$message({
        message: '取消创建!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  max-width: 120px;
  /* height: 120px; */
  line-height: 120px;
  text-align: center;
}
.avatar {
  max-width: 120px;
  max-height: 120px;
  display: block;
}
.input-prompt {
  padding: 20px;
}
</style>


<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">排班管理</el-col>
    </sticky>
    <el-col :span="24" class="content-wrap">
      <el-form ref="form" size="small" :rules="rules" :model="form" label-width="140px">
        <el-form-item label="训练营名称：" prop="good_id">
          <el-select prop="group_id" v-model="form.good_id" placeholder="请选择训练营类型">
            <el-option
              v-for="item in campOptions"
              :key="item.id"
              :label="item.good_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="group_name" label="群名称：">
          <el-input
            v-model="form.group_name"
            :autosize="{ minRows: 5, maxRows: 5}"
            placeholder="请输入群名称"
          />
        </el-form-item>
        <!-- 时间段 -->
        <el-form-item label="开始/结束时间：" prop="time_slot">
          <el-date-picker
            size="small"
            v-model="form.time_slot"
            type="daterange"
            align="right"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="timeChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="form.remarks"/>
        </el-form-item>
        <el-form-item label="选择人员/角色：" required>
          <el-row v-for="(item,index) in form.persons" :key="index">
            <el-col :span="8">
              <el-form-item :prop="`persons.${index}.counsellor_uuid`" :rules="rules.real_name">
                <el-select
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="remoteMethod"
                  :loading="counselorLoading"
                  v-model="item.user_uuid"
                  placeholder="请选择辅导员"
                >
                  <el-option
                    v-for="counselorItem in counselorOptions"
                    :key="counselorItem.user_uuid"
                    :label="counselorItem.nickname"
                    :value="counselorItem.user_uuid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :prop="`persons.${index}.group_id`" :rules="rules.group_id">
                <el-select v-model="item.group_id" placeholder="请选择群角色">
                  <el-option
                    v-for="roleItem in groupRoles"
                    :key="roleItem.group_id"
                    :label="roleItem.group_role"
                    :value="roleItem.group_id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <i v-if="index===0" @click="addRole" class="icon el-icon-circle-plus-outline"></i>
              <i v-else @click="removeRole(index)" class="icon el-icon-remove-outline"></i>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item prop="poster_img" label="海报：">
          <el-col :span="5">
            <el-upload
              class="avatar-uploader"
              :action="host"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.poster_img" :src="form.poster_img" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
          <el-col :span="18" class="input-prompt">图片上传格式为：gif、jpg、png、jpeg；建议尺寸750像素 X 1334像素</el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">确定</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>

import Sticky from '@/components/Sticky'
import { addSchedule, getCounselorDetail, getGoods, getCounselorList, getGroupRoleList } from '@/api/counselor'
export default {
  components: { Sticky },
  data() {
    const host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
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
      // 上传图片host
      host,
      // 训练营(商品)
      campOptions: [],
      // 群角色
      groupRoles: [],
      // 辅导员列表
      counselorOptions: [],
      // 群角色list
      roleOptions: [],
      // 远程搜索辅导员
      counselorLoading: false,
      // 提交的form值
      form: {
        good_id: '',
        group_name: '',
        scheduling_id: '',
        poster_img: '',
        persons: [{ counsellor_uuid: 1, group_id: 2 }, { counsellor_uuid: '' }],
      },
      rules: {
        good_id: [
          {
            required: true, message: '请选择训练营', trigger: 'change'
          }
        ],
        group_name: [
          { required: true, message: '请输入群名称', trigger: 'blur' }
        ],
        time_slot: [
          { required: true, message: '请选择开始/结束时间', trigger: 'change' }
        ],
        real_name: [
          { required: true, message: '请选择辅导员', trigger: 'blur' },
        ],
        poster_img: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        group_id: [
          { required: true, message: '请选择群角色', trigger: 'change' }
        ],


      }
    }
  },
  created() {
    this.getGoods();
    this.getGroupRoleList();
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    if (this.$route.params.id != 0) {
      this.form.scheduling_id = this.$route.params.id;
      this.getCounselorDetail();
    }
    // console.log(this.$route.params.id)
  },
  methods: {
    // 获取群角色
    getGroupRoleList() {
      getGroupRoleList().then(res => {
        if (res.code == 200) {
          this.groupRoles = res.result;
        }
      })
    },
    // 获取辅导员list
    getCounselorList(real_name) {
      const data = {
        is_select: 1,
        real_name
      }
      getCounselorList(data).then(res => {
        if (res.code == 200) {
          this.counselorOptions = res.result.list;
        }
      })
    },
    // 获取商品list（训练营）
    getGoods() {
      getGoods().then(res => {
        if (res.code == 200) {
          this.campOptions = res.result.list;
        }
      })
    },
    // 时间段改变
    timeChange() {
      // console.log(this.form.time_slot)
    },
    // 添加角色人员
    addRole() {
      this.form.persons.push({})
    },
    removeRole(index) {
      // console.log(index)
      let arr = this.form.persons;
      arr.splice(index, 1);
      this.form.persons = arr;
    },
    // 远程搜索辅导员方法
    remoteMethod(query) {
      this.getCounselorList(query);
      // console.log(query)
    },
    // 上传海报
    handleAvatarSuccess(resData) {
      if (resData.code == 200) {
        this.form.poster_img = resData.result.urlFile;
      }
    },
    // 图片上传之前验证
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
    },
    // s提交
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addCounselor();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 新建编辑排班
    addCounselor() {
      addSchedule(this.form).then(res => {
        if (res.code == 200) {
          this.$alert('提交成功!', '提示', {
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

    // 获取排班信息
    getCounselorDetail() {
      let data = {
        scheduling_id: this.form.scheduling_id
      }
      // console.log(data)
      getCounselorDetail(data).then(response => {
        this.form = response.result;
        // console.log('用户信息', response.result);
      })
    },


  }
}
</script>

<style lang="scss" scoped>
.icon {
  color: #dedede;
  margin-left: 10px;
  font-size: 25px;
  cursor: pointer;
  &:hover {
    color: #20b6f9;
  }
}

.line {
  text-align: center;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  max-width: 120px;
  /* height: 120px; */
  line-height: 350px;
  text-align: center;
}
.avatar {
  max-width: 120px;
  max-height: 350px;
  display: block;
}
.input-prompt {
  padding: 20px;
}
</style>


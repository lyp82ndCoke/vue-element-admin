<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">我的资料</el-col>
    </sticky>
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      class="demo-form-inline"
      label-width="160px"
      size="small"
    >
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-putple">
            <el-form-item label="其他昵称">
              <el-input v-model="form.other_nickname" placeholder="请输入昵称"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-putple-light">
            <el-form-item label="专业">
              <el-input v-model="form.major" placeholder="请输入专业"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content">
            <el-form-item label="您目前的工作状态？">
              <el-select v-model="form.work_status" clearable  placeholder="请选择工作状态">
                <el-option
                  v-for="item in work_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <el-form-item label="您目前从事的行业">
              <el-input v-model="form.now_work_trade" placeholder="请输入行业"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <el-form-item label="您目前从事的职业">
              <el-input v-model="form.now_work_vocation" placeholder="请输入职业"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="请简单描述您的特长？">
              <el-input
                type="textarea"
                v-model="form.descrip_spacial_skill"
                placeholder="1-500字，多行"
                style="width:600px;"
                :rows="3"
                maxlength="500"
                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="您最擅长解决的家庭教育问题是？">
              <el-input
                type="textarea"
                v-model="form.solve_family_educa_problem"
                placeholder="1-500字，多行"
                style="width:600px;"
                :rows="3"
                maxlength="500"
                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="10"> -->
        <el-col :span="10" class="grid-content">
          <el-form-item label="银行卡号：">
            <el-input v-model="form.bank_card_number" placeholder="请输入银行卡号"></el-input>
          </el-form-item>
        </el-col>
        <!-- </el-col>
        <el-col :span="12">-->
        <el-col :span="10" style="marginLeft:10px;" class="grid-content">
          <el-form-item label="开户行：">
            <el-input v-model="form.opening_bank" placeholder="请输入开户行"></el-input>
          </el-form-item>
        </el-col>
        <!-- </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="地区：" class="item-gender">
            <el-cascader
              clearable
              :options="options"
              v-model="form.address_ids"
              :props="props"
              size="small"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <div class="grid-content">
            <el-form-item>
              <el-input v-model="form.address" placeholder="详细地址"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <el-row>
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
        <el-col :span="10">
          <el-form-item label="常用邮箱：">
            <el-input v-model="form.email" placeholder="请输入常用邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="大宝生日：">
          <div class="block">
            <el-date-picker
              v-model="form.big_baby_birthday"
              type="date"
              placeholder="选择大宝生日"
              format="yyyy-MM-dd"
            ></el-date-picker>
            <span v-text="onAge(form.big_baby_birthday)"></span>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="二宝生日：">
          <div class="block">
            <el-date-picker
              v-model="form.small_baby_birthday"
              type="date"
              placeholder="选择小宝生日"
              format="yyyy-MM-dd"
            ></el-date-picker>
            <span v-text="onAge(form.small_baby_birthday)"></span>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12" style="min-width:400px;">
          <el-form-item label="个人介绍(前端展示)：" prop="personal_smart" :rules="rules.personal_smart">
            <tinymce v-model="form.personal_smart" :toolbar="toolbar"></tinymce>
            <!-- <input disabled v-model="form.personal_smart" style="display:none;"></tinymce> -->
          </el-form-item>
        </el-col>
        <el-col :span="12" style="min-width:400px;">
          <el-form-item label="预览：">
            <el-col class="preview" v-html="form.personal_smart"></el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="11">
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">更新资料</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getCounselorInfo, upDateCounselorInfo } from '@/api/counselor'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce-water'
import { data } from '@/assets/province.json'
import { requestOver } from '@/utils/global_variable'
export default {
  components: {
    Sticky,
    Tinymce
  },
  data() {
    return {
      host: "",
      toolbar: [],
      // 地址data
      options: data,
      props: {
        value: 'area_id',
        label: 'area_name'
      },
      form: {

      },
      rules: {
        personal_smart: [
          { required: true, message: '请输入个人介绍', trigger: 'change' }
        ],
        head_pic: [
          { required: true, message: '请上传头像', trigger: 'change' }
        ]
      },
      age1: 0,
      age2: 0,
      work_options: [
        { label: '有工作、全职', value: '1' },
        { label: '有工作、兼职', value: '2' },
        { label: '无工作、全职妈妈', value: '3' },
        { label: '自己成立亲子阅读馆', value: '4' }
      ],
      pro_options: [{
        value: 'beijing',
        label: '北京'
      }],
      city_options: [{
        value: 'beijing',
        label: '北京'
      }],
      coun_options: [{
        value: 'haidian',
        label: '海淀'
      }],
      counselorParams:{},
    }
  },
  created() {
    this.getCounselorInfo()
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
  },
  mounted() {
    // console.log(localStorage.getItem("counsellor_request_id"),'页面读取')
    requestOver('/counselor/counselorData',this.counselorParams)
  },
  methods: {
    //   获取资料
    getCounselorInfo() {
      getCounselorInfo().then(res => {
        if (res.code == 200) {
          // console.log(res.result, '资料')
          this.form = res.result;
          if(res.result.work_status === "0"){
            this.form.work_status = "";
          }
        }
      })
    },
    //获取大宝年龄
    onAge(date) {
      //   var date = new Date();
      //   var age = date.getFullYear() - this.form.big_baby_birthday.getFullYear();
      //   var birthDay = view.get("#employeeDS").getData().get('birthday');

      let nowDate = new Date();
      let lastDate = new Date(date)
      // console.log(nowDate.getTime(), '----', lastDate.getTime())
      if(lastDate.getTime() !== 0){
        let diff = nowDate.getTime() - lastDate.getTime();
        // 向下取整  例如 10岁 20天 会计算成 10岁

        // 如果要向上取整 计算成11岁，把floor替换成 ceil

        let age = Math.floor(diff / 1000 / 60 / 60 / 24 / 365);
        // console.log(age, 'age')
        return `${age}岁`;
      } else {
        return '0岁';
      }
      
    },

    h(n) {
      return n + '岁';
    },
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          upDateCounselorInfo(this.form).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '更新资料成功！'
              })
            }
          })
        } else {
          this.$message({
            message: '请填写必填项哦',
            type: 'warning'
          });
          return false;
        }
      });

    },
     // 上传头像
    handleAvatarSuccess(resData) {
      if (resData.code == 200) {
        this.form.head_pic = resData.result.urlFile;
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
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0 0 20px;
}
.demo-form-inline {
  padding: 20px;
}
.preview {
  padding: 8px;
  width: 375px;
  height: 522px;
  line-height: 1.3;
  border: 1px solid #ddd;
  overflow-y: auto;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
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
</style>



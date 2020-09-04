<template>
  <div class="app-container">
    <!-- <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">添加辅导员</el-col>
    </sticky> -->
    <el-col
      :span="24"
      class="base-line"
    >基本信息</el-col>
    <el-col
      :span="24"
      class="table-wrap"
    >
      <el-col
        :span="24"
        class="title-header"
      >

        <el-form
          :inline="true"
          :rules="rules"
          ref="formRule"
          :model="form"
          class="form-wrap"
          label-width="155px"
        >
          <el-form-item
            label="关联登录号码："
            class="item-gender"
            prop="role_type"
          >
            <el-select
              v-model="search"
              clearable
              filterable
              remote
              size="small"
              reserve-keyword
              placeholder="搜索名称和手机号"
              :remote-method="remoteMethod"
              :loading="loading"
              @change="handleRelation"
            >
              <el-option
                v-for="item in userList"
                :key="item.union_uuid"
                :label="`${item.real_name} ${item.mobile}`"
                :value="{value:item}"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="一级岗位："
            class="item-gender"
            prop="first_station"
          >
            <el-select
              v-model="form.first_station"
              clearable
              size="small"
              filterable
              placeholder="请选择岗位"
              @change="handleFirst"
            >
              <el-option
                v-for="item in first_station"
                :key="item.first_stationue"
                :label="item.name"
                :value="item.first_station"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="二级岗位："
            class="item-gender"
            prop="second_station"
          >
            <el-select
              v-model="form.second_station"
              clearable
              filterable
              size="small"
              placeholder="请选择岗位"
            >
              <el-option
                v-for="item in second_station"
                :key="item.second_station"
                :label="item.name"
                :value="item.second_station"
              >
              </el-option>
            </el-select>
          </el-form-item>
          

  
          <el-form-item label="选择浏览年龄：" prop="label_ids" class="counselor-age">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="check-all">全选</el-checkbox>
            <el-checkbox-group v-model="form.label_ids" @change="handleCheckedCitiesChange">
              <el-checkbox
                v-for="item in ageList"
                :key="item.label_id"
                :label="item.label_id"
              >{{item.title}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>


          <el-form-item
            label="真实姓名："
            class="item-gender"
            prop="real_name"
          >
            <el-input
              v-model="form.real_name"
              size="small"
              placeholder="请输入真实姓名"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="昵称："
            class="item-gender"
            prop="nickname"
          >
            <el-input
              v-model="form.nickname"
              size="small"
              placeholder="请输入昵称"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="性别"
            class="item-gender"
          >
            <el-select
              v-model="form.sex"
              size="small"
              filterable
              placeholder="请选择性别"
              @change="handleWording"
            >
              <el-option
                v-for="item in sex"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="邮箱"
            class="item-gender"
          >
            <el-input
              v-model="form.email"
              size="small"
              placeholder="请输入邮箱地址"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="其他昵称："
            class="item-gender"
          >
            <el-input
              v-model="form.other_nickname"
              size="small"
              placeholder="请输入其他昵称"
            ></el-input>
            <span class="input-tips">(多个昵称用逗号区分，例子：昵称1，昵称2)</span>
          </el-form-item>
          <el-form-item
            label="最高学历："
            class="item-gender"
          >
            <el-select
              v-model="form.education"
              size="small"
              filterable
              placeholder="请选择学历"
            >
              <el-option
                v-for="item in education"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="专业："
            class="item-gender"
          >
            <el-input
              v-model="form.major"
              size="small"
              placeholder="请输入专业"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="您目前的工作状态？"
            class="item-gender"
          >
            <el-select
              v-model="form.work_status"
              size="small"
              filterable
              placeholder="请选择工作状态"
              @change="handleWording"
            >
              <el-option
                v-for="item in working"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="您目前从事的行业："
            class="item-gender"
          >
            <el-input
              v-model="form.now_work_trade"
              size="small"
              placeholder="请输入行业"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="您目前从事的职业："
            class="item-gender"
          >
            <el-input
              v-model="form.now_work_vocation"
              size="small"
              placeholder="请输入职业"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="手机号："
            class="item-gender"
          >
            <el-input
              v-model="form.mobile"
              size="small"
              placeholder="请输入手机"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="手机号：" class="item-gender">
            <el-input v-model="form.mobile" size="small" placeholder="请输入手机"></el-input>
          </el-form-item> -->
          <el-form-item
            label="其他手机号："
            class="item-gender"
          >
            <el-input
              v-model="form.other_mobile"
              size="small"
              placeholder="请输入其他手机号"
            ></el-input>
            <span class="input-tips">(多个其他手机号码用逗号区分，例子：手机号1，手机号2)</span>
          </el-form-item>
          <el-form-item
            label="身份证号："
            class="item-gender"
          >
            <el-input
              v-model="form.id_number"
              size="small"
              placeholder="请输入身份证号"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="开户行："
            class="item-gender"
          >
            <el-input
              v-model="form.opening_bank"
              size="small"
              placeholder="请输入开户行"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="银行卡号："
            class="item-gender"
          >
            <el-input
              v-model="form.bank_card_number"
              size="small"
              placeholder="请输入银行卡号"
            ></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="请简单描述您的特长？："
                class="item-gender"
              >
                <el-input
                  size="small"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6}"
                  placeholder="1-500字，多行文本"
                  maxlength="500"
                  style='width:500px;'
                  v-model="form.descrip_spacial_skill"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="您最擅长解决的家庭教育问题是？："
                class="item-gender"
              >
                <el-input
                  size="small"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6}"
                  placeholder="1-500字，多行文本"
                  maxlength="500"
                  style='width:500px;'
                  v-model="form.solve_family_educa_problem"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="地址："
                class="item-gender"
              >
                <el-cascader
                  size="small"
                  :options="region"
                  v-model="form.address_ids"
                  :props="props"
                ></el-cascader>
                <el-input
                  v-model="form.address"
                  size="small"
                  placeholder="请输入详细地址"
                  class="el-input"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="生日："
                class="item-gender"
              >
                <el-date-picker
                  size="small"
                  v-model="form.birthday"
                  type="date"
                  placeholder="选择生日"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="大宝生日："
                class="item-gender"
              >
                <el-date-picker
                  size="small"
                  v-model="form.big_baby_birthday"
                  type="date"
                  placeholder="选择大宝生日"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="小宝生日："
                class="item-gender"
              >
                <el-date-picker
                  size="small"
                  v-model="form.small_baby_birthday"
                  type="date"
                  placeholder="选择小宝生日"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                prop='head_pic'
                label="头像图片:"
                required
              >
                <el-col :span="6">
                  <el-upload
                    class="avatar-uploader"
                    :action="host"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img
                      v-if="form.head_pic"
                      :src="form.head_pic"
                      class="avatar"
                    >
                    <i
                      v-else
                      class="el-icon-plus avatar-uploader-icon"
                    ></i>
                  </el-upload>
                </el-col>
                <el-col
                  :span="17"
                  class="input-pro"
                >图片上传格式为：jpg、png；图片比例1:1</el-col>
                <el-col
                  :span="17"
                  class="input-pro"
                >建议尺寸500像素 X 500像素</el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="个人介绍："
                prop="personal_smart"
              >
                <span class="tips">（前端展示）</span>
                <el-col :span="24">
                  <tinymce v-model="form.personal_smart"></tinymce>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="备注："
                class="item-gender"
              >
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6}"
                  placeholder="1-500字，多行文本"
                  maxlength="500"
                  style='width:500px;'
                  v-model="form.smart"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-col>

    <el-col
      :span="24"
      class="base-line"
    >职业信息</el-col>
    <el-col
      :span="24"
      class="table-wrap"
    >
      <el-col
        :span="24"
        class="title-header"
      >
        <el-form
          ref="form"
          :model="occupation"
          class="form-wrap"
          label-width="155px"
        >
          <el-form-item
            label="签约时间："
            class="item-gender"
          >
            <el-date-picker
              size="small"
              v-model="occupation.contract_time"
              type="date"
              placeholder="选择签约时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="转正时间："
            class="item-gender"
          >
            <el-date-picker
              size="small"
              v-model="occupation.correction_time"
              type="date"
              placeholder="选择转正时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="解约时间："
            class="item-gender"
          >
            <el-date-picker
              size="small"
              v-model="occupation.cancellation_time"
              type="date"
              placeholder="选择解约时间"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item
            label="转正评价："
            class="item-gender"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6}"
              placeholder="1-500字，多行文本"
              maxlength="500"
              style='width:500px;'
              v-model="occupation.correction_evaluate"
            >
            </el-input>
          </el-form-item>

          <el-form-item
            label="成长备注："
            class="item-gender"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6}"
              placeholder="1-500字，多行文本"
              maxlength="500"
              style='width:500px;'
              v-model="occupation.growup_smark"
            >
            </el-input>
          </el-form-item>

          <el-form-item class="item-gender">
            <el-button
              type="danger"
              @click="onSubmit('formRule')"
            >提交</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>

  </div>
</template>

<script>
import data from '@/assets/province.json'
import { addCounsellorList, getRelationUserList, getEditDetailList, getStation } from '@/api/articleLibrary'
import { getAgeGroup } from '@/api/teach'
import { getThemeTree } from '@/api/counselor'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'

export default {
  components: { Pagination, Sticky, Tinymce },
  data() {
    return {
      occupation: {
        contract_time: "",
        correction_time: "",
        cancellation_time: "",
        correction_evaluate: "",
        growup_smark: "",

      },
      host: '',
      userList: [],
      search: null,
      list: [],
      loading: false,
      form: {
        role_type: 1,
        first_station: "",
        second_station: "",
        real_name: "",
        sex: "",
        // nickname: "",
        other_nickname: "",
        work_status: "",
        now_work_vocation: "",
        now_work_trade: "",
        education: "",
        major: "",
        // mobile: "",
        other_mobile: "",
        email: '',
        descrip_spacial_skill: "",
        solve_family_educa_problem: "",
        id_number: "",
        address_ids: "",
        address: "",
        birthday: "",
        big_baby_birthday: "",
        small_baby_birthday: "",
        personal_smart: "",
        smart: "",
        head_pic: "",
        label_ids: [],
      },
      role_type: [
        { label: '辅导员', value: 1 },
        { label: '教研组', value: 2 }
      ],
      sex: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ],
      working: [
        { label: '有工作,全职', value: 1 },
        { label: '有工作,兼职', value: 3 },
        { label: '无工作,全职妈妈', value: 2 },
        { label: '自己成立亲子阅读馆', value: 4 },
      ],
      education: [
        { label: '高中', value: 1 },
        { label: '大专', value: 2 },
        { label: '本科', value: 3 },
        { label: '研究生', value: 4 },
        { label: '博士', value: 5 },
      ],
      status: [
        { label: '正常', value: 1 },
        { label: '清退', value: 2 }
      ],
      second_station: [],
      first_station: [],
      region: [],
      props: {
        value: 'area_id',
        label: 'area_name'
      },
      rules: {
        role_type: [
          { required: true, message: '请选择角色', trigger: 'change' },
        ],
        real_name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        first_station: [
          { required: true, message: '请选择一级岗位', trigger: 'change' }
        ],
        second_station: [
          { required: true, message: '请选择二级岗位', trigger: 'change' }
        ],
        label_ids: [
          { required: true, message: '请选择浏览年龄', trigger: 'change' }
        ],
        nickname: [
          { required: true, message: '请输入微信昵称', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ],
        personal_smart: [
          { required: true, message: '请输入个人介绍哦', trigger: 'blur' }
        ],
        head_pic: [
          { required: true, message: '请上传头像哦', trigger: 'blur' }
        ],
      },
      user_uuid: null,
      firstValue: '',
      ageList: [],
      label_ids: [],
      isIndeterminate: false,
      checkAll: false,
      ageCount: 0
    }
  },
  mounted() {

  },
  created() {
    this.getAgeGroup();
    this.region = data.data;
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    this.user_uuid = this.$route.params.id;
    if (this.user_uuid != 0) {
      this.editList(this.user_uuid);
    }
    // this.getThemeTree();
    this.getStation();
  },
  methods: {
    handleCheckAllChange(val){
      console.log(val, '全选')
      this.form.label_ids = val ? this.label_ids : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.ageList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.ageList.length;
    },
    //获取年龄段列表
    getAgeGroup(){
      const data = {
        page_num: 1,
        page_size: 20
      }
      getAgeGroup(data).then(res => {
        if(res.code == 200){
          this.ageList = res.result.list;
          this.ageCount = res.result.count;
          for(let i = 0;i < this.ageList.length;i++){
            if(this.label_ids.indexOf(this.ageList[i].label_id) === -1){
              this.label_ids.push(this.ageList[i].label_id);
            }
          }
        }
      })
    },
    //获取岗位
    getStation() {
      getStation().then((res) => {
        if (res.code == 200) {
          this.first_station = res.result.list;
        }
      })
    },
    //根据一级岗位 筛选二级岗位
    handleFirst(value) {
      this.form.second_station = '';
      const map = {
        first_station: value
      }
      getStation(map).then((res) => {
        if (res.code == 200) {
          this.second_station = res.result.list;
        }
      })
    },
    handleRelation(value) {
      this.form.union_uuid = value.value.union_uuid;
      this.form.name_mobile = value.value.real_name + value.value.mobile;

      this.form.real_name = value.value.real_name;
      this.form.mobile = value.value.mobile;
    },
    // 获取树形结构
    // getThemeTree() {
    //   const data = {};
    //   getThemeTree(data).then((res) => {
    //     if (res.code == 200) {
    //     }
    //   })
    // },
    // 获取编辑的详情
    editList(user_uuid) {
      const map = {
        uuid: user_uuid
      }
      getEditDetailList(map).then((res) => {
        if (res.code == 200) {
          const detail = {
            first_station: res.result.first_station
          }
          getStation(detail).then((res) => {
            if (res.code == 200) {
              this.second_station = res.result.list;
            }
          })
          this.occupation = res.result;
          this.form = res.result;
          this.search = res.result.name_mobile;

          // this.checkAll = res.result.label_ids.length === this.ageCount;

          const data = {
            page_num: 1,
            page_size: 20
          }
          getAgeGroup(data).then(response => {
            if(res.code == 200){
              this.checkAll = res.result.label_ids.length === response.result.list.length;
            }
          })

          
          
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
          getRelationUserList(map).then((res) => {
            if (res.code == 200) {
              this.userList = res.result.list;
            }
          })
        }, 200);
      } else {
        this.userList = [];
      }
    },
    hideScreen() {
      this.screen = false;
    },
    showScreen() {
      this.screen = true;
    },
    handleWording() {
    },
    changePaging(val) {
      const map = {
        actid: this.goodsListId,
        page: val.page,
        limit: val.limit
      }
      this.goodsList()
    },
    changeAlert(val) {
      const map = {
        page: val.page,
        limit: val.limit
      }
      this.showAlert();
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
      // const isJPG = file.type === 'image/jpeg' || 'image/png';
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式 或者 PNG 格式!');
      // }
      // return isJPG;
    },
    // 上传头像
    handleAvatarSuccess(resData) {
      if (resData.code == 200) {
        this.form.head_pic = resData.result.urlFile;
      }
    },
    // 辅导员 提交
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form.personal_smart) {
            this.$message({
              message: '请填写个人介绍哦',
              type: 'warning'
            });
            return false;
          }
          const map = {
            ...this.occupation, ...this.form
          }
          // 如果是编辑提交  
          if (this.user_uuid != 0) {
            map.user_uuid = this.user_uuid;
          }
          //添加辅导员接口
          addCounsellorList(map).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.$router.go(-1)
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
    }
  }
}
</script>
<style lang="scss">
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
.base-line {
  height: 30px;
  line-height: 30px;
  background: #eee;
  font-size: 14px;
  padding-left: 20px;
}
.email .el-input {
  width: 200px;
}
.item-gender .el-input {
  width: 200px;
}
.age {
  color: red;
  font-size: 16px;
  padding-left: 10px;
}
.input-prompt {
  padding: 20px;
}
.input-tips {
  color: #666;
  font-size: 14px;
}
.input-pro {
  padding-left: 20px;
}
.tips {
  font-size: 16px;
  color: #bbb;
  display: inline-block;
  width: 500px;
}
.counselor-age .el-checkbox-group{
  margin-left: 160px;
}
.check-all{
  margin-left: 160px;
}
.counselor-age .el-form-item__content{
  margin-top: -33px;
}
.counselor-age .el-form--inline .el-form-item__content{
  margin-top: -33px;
}
</style>


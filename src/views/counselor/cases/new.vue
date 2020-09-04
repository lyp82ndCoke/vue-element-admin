<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col
        :span="10"
        class="subtitle"
      >{{title}}</el-col>
    </sticky>
    <el-form
      class="form-wrap"
      v-if="caseId"
      label-width="140px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="历史审核结果："
            v-if="form.opinion_list && form.opinion_list.length > 0"
          >
            <el-row
              :span="24"
              v-for="(item, index) in form.opinion_list"
              :key="index"
            >
              <el-col :span="24">{{ index+1 + '、' + item.opinion_content}}</el-col>
              <el-col
                :span="24"
                style="padding-left: 20px;"
              >{{ item.create_time }}</el-col>
            </el-row>
          </el-form-item>
          <el-form-item
            label="历史审核结果："
            v-else
          >
            <el-row :span="24">
              <el-col :span="24">暂无审核结果</el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form
      :inline="true"
      ref="form"
      :rules="rules"
      :model="form"
      class="form-wrap"
      label-width="140px"
    >
      <!--  <el-form-item label="用户姓名：" class="item-gender">
        <el-input v-model="user_name" size="small" placeholder="请输入用户姓名"></el-input>
      </el-form-item>
      -->
      
      <el-row>
        <el-col :span="24">
          <el-col :span="12" class="input-name">
            <el-form-item
              label="群名称："
              prop="camp_ids"
              required
            >
              <el-cascader
                size="small"
                expand-trigger="hover"
                placeholder="请选择群名称"
                v-model="form.camp_ids"
                @change="handleCamp"
                :options="training_camp_name"
                :props="props"
              ></el-cascader>
            </el-form-item>
          </el-col>
          

          <el-form-item
            label="用户昵称："
            class="item-gender"
          >
            <el-input
              v-model="form.nickname"
              size="small"
              @change="searchCamp"
              placeholder="请输入用户昵称"
            ></el-input>
          </el-form-item>

          <el-form-item class="item-gender">
            <el-button
              type="success"
              size="mini"
              @click="searchCamp"
            >搜索</el-button>
          </el-form-item>

          <!-- <el-form-item
            label="用户姓名："
            prop="user_name"
            v-if="user_name"
          >
            <el-col
              :span="24"
              v-model="user_name"
            >{{ user_name }}</el-col>
          </el-form-item> -->

         
        </el-col>
      </el-row>


     

      <el-row>
        <el-form-item
          label="用户："
          class="item-gender"
          prop="unionid">
          <el-select 
            v-model="form.unionid" 
            placeholder="请选择用户" 
            @change="selectUser"
            size="small">
            <el-option
              v-for="item in userList"
              :key="item.unionid"
              :label="item.nickname"
              :value="item.unionid">
            </el-option>
          </el-select>
        </el-form-item>

         <el-form-item
            label="孩子性别："
            prop="child_sex"
            v-if="form.child_sex"
          >
            <el-col
              :span="24"
              v-model="form.child_sex"
            >
              <span v-if="form.child_sex == 1">男</span>
              <span v-if="form.child_sex == 2">女</span>
              <span v-if="form.child_sex == 0">其他</span>
            </el-col>
          </el-form-item>

          <el-form-item
            label="孩子年龄："
            prop="child_age"
            v-if="form.child_age"
          >
            <el-col
              :span="24"
              v-model="form.child_age"
            >{{ form.child_age }}</el-col>
          </el-form-item>

          <el-form-item
            label="与孩子关系："
            prop="child_relation"
            v-if="form.child_relation"
          >
            <el-col
              :span="24"
              v-model="form.child_relation"
            >
              <span v-if="form.child_relation == 1">爸爸</span>
              <span v-if="form.child_relation == 2">妈妈</span>
              <span v-if="form.child_relation == 3">其他</span>
            </el-col>
          </el-form-item>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item
            label="主题："
            required
          >
            <!-- 年龄段 -->
            <el-form-item>
              <!--  -->
              <el-select
                v-model="ageValue"
                @change="changeAge"
                :disabled="disabledAge"
                size="small"
                placeholder="请选择年龄段"
              >
                <el-option
                  v-for="(item,index) in options"
                  :key="item.label_id"
                  :label="item.title"
                  data-index="index"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 分类和标签 -->
            <el-row
              v-for="(item,index) in form.themeArr"
              style="margin-top:18px;"
              :key="index"
            >
              <el-col :span="20">
                <!-- 分类 begin -->
                <el-form-item
                  v-if="optionsTheme.length"
                  :prop="`themeArr.${index}`"
                  :rules="rules.relation_id"
                >
                  <el-cascader
                    :props="themeProps"
                    size="small"
                    :options="optionsTheme"
                    v-model="form.themeArr[index]"
                    placeholder="请选择主题"
                    @change="handleChange"
                  ></el-cascader>
                </el-form-item>
                <el-form-item
                  v-else
                  :prop="`themeArr.${index}`"
                  :rules="rules.relation_id"
                >
                  <el-cascader
                    :props="themeProps"
                    size="small"
                    :options="[]"
                    v-model="form.themeArr[index]"
                    placeholder="请选择主题"
                    @change="handleChange"
                  ></el-cascader>
                </el-form-item>
                <!-- 分类 end -->
              </el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="2">
                <i
                  class="icon el-icon-circle-plus"
                  @click="addTheme"
                  v-if="index===0"
                ></i>
                <i
                  class="icon el-icon-remove"
                  v-else
                  @click="removeTheme(index)"
                ></i>
              </el-col>
            </el-row>
            <!-- </el-col> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="标题："
            prop="case_title"
          >
            <el-col :span="24">
              <el-input
                style="width:500px;"
                size="small"
                placeholder="请输入标题"
                v-model="form.case_title"
              />
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

     <!--  <el-row>
        <el-col :span="24">
          <el-form-item
            label="用户问题："
            prop="first_asked"
          >
            <span class="tips">家长入群后的提问，以及发现提问背后的首发问题</span>
            <el-col :span="24">
              <tinymce v-model="form.first_asked"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row> -->

      <el-row>
        <el-col :span="24">
          <el-form-item
            label="孩子当时情况："
            prop="child_situation"
          >
            <span class="tips">家长认为孩子有什么问题</span>
            <el-col :span="24">
              <tinymce v-model="form.child_situation"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item
            label="诊断："
            prop="diagnosis"
          >
            <span class="tips">问题分析必须指向家长的行为认知</span>
            <el-col :span="24">
              <tinymce v-model="form.diagnosis"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item
            label="建议指导："
            prop="suggest"
          >
            <span class="tips">辅导员做了哪些具体的指导(分析、方向、具体步骤等)</span>
            <el-col :span="24">
              <tinymce v-model="form.suggest"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item
            label="用户行动："
            prop="user_action"
          >
            <span class="tips">家长做了哪些事，必须落实到家长具体行为的改变</span>
            <el-col :span="24">
              <tinymce v-model="form.user_action"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item
            label="成效："
            prop="effect"
          >
            <span class="tips">孩子的问题改善，改变后孩子的状态</span>
            <el-col :span="24">
              <tinymce v-model="form.effect"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="见证性材料："
            prop="case_track"
          >
            <span class="tips"></span>
            <el-col :span="24">
              <tinymce v-model="form.case_track"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="padding-left: 140px;">

        <el-button
          type="danger"
          @click="onSubmit('form')"
        >提交审核</el-button>

        <el-button
          type="primary"
          style="margin: 0 20px;"
          v-if="!disabledAge"
          @click="onSaveDrafts('form')"
        >存草稿</el-button>

        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      v-if="moreTheme.length"
      title="提示"
      :visible.sync="visible"
      width="30%"
      :before-close="moreThemeN"
    >
      <span>您选择的二级问题标签“{{moreTheme[0].second_label}}”，在这个年龄下还有其他相同标签是否全部添加</span>
      <el-col
        style="marginTop:10px;color:#409EFF;"
        v-for="(item,index) in moreTheme"
        :key="index"
      >{{index+1}}、{{item.first_label}}/{{item.second_label}}</el-col>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="moreThemeN">取 消</el-button>
        <el-button
          type="primary"
          @click="moreThemeY"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { 
  editCaseList, 
  addCounselorCaseList, 
  getQuestionList, 
  getSubmitCaseList, 
  reviseCounselorCaseList, 
  upDateCounselorCaseList, 
  getCampMsgList, 
  getCampBabyMst, 
  getCampUserMsg,
  addCaseDrafs,
  editCaseDetails,
  addCaseExamine,
  editCaseDrafs
} from '@/api/articleLibrary'
import { getThemeTree, getSameThemeList } from '@/api/counselor'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce-water'
import { requestOver } from '@/utils/global_variable'
export default {
  components: { Sticky, Tinymce },
  data() {
    const ids = (rule, value, callback) => {
      console.log(value, 'aaa')
      if (!value.length) {
        callback(new Error('请选择主题'))

      }
      callback();
    }
    return {
      // 更多主题
      moreTheme: [],
      title: '添加案例',
      // 当前选择年龄值
      ageValue: '',
      // 修订案例数据
      // resultForm: {
      //   opinion_list: []
      // },
      //  当前选择年龄下的主题tree
      optionsTheme: [],
      themeProps: { value: 'label_id', label: 'title', children: 'children' },
      // 年龄主题tree
      options: [],
      // 新建案例的value集合
      form: {
        camp_ids: [],
        themeArr: [[]],
        opinion_list: [],
        relation_id: [[]],
        case_title: '',
        unionid: '',
        // first_asked: '',
        child_situation: '',
        diagnosis: '',
        suggest: '',
        user_action: '',
        effect: '',
        case_track: '',
        child_sex: '',
        child_age: '',
        child_relation: '',
        nickname: '',
        camp_user_name: '',
        mobile: '',
        goods_name: '',
        camp_group_name: '',
        headimgurl: ''
      },
      // user集合
      user_phone: '',
      user_name: '',
      child_relation: '',
      training_camp_name: [],
      props: {
        value: "id",
        label: 'name',
        children: 'group'
      },
      rules: {
        case_title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        question_id: [
          { required: true, message: '请选择问题', trigger: 'blur' }
        ],
        relation_id: [
          { validator: ids, required: true, message: '请选择主题', trigger: 'change' },
        ],
        // first_asked: [
        //   { required: true, message: '请输入用户问题', trigger: 'blur' }
        // ],
        child_situation: [
          { required: true, message: '请输入孩子当时情况', trigger: 'blur' }
        ],
        diagnosis: [
          { required: true, message: '请输入诊断', trigger: 'blur' }
        ],
        suggest: [
          { required: true, message: '请输入建议指导', trigger: 'blur' }
        ],
        user_action: [
          { required: true, message: '请输入用户行为', trigger: 'blur' }
        ],
        effect: [
          { required: true, message: '请输入成效', trigger: 'blur' }
        ],
        case_track: [
          { required: true, message: '请输入见证性材料', trigger: 'blur' }
        ],
        unionid: [
          { required: true, message: '请选择用户' }
        ],
        camp_ids: [
          { validator: ids, required: true, message: '请选择群', trigger: 'change' },
        ]
      },
      oneIndex: null,
      twoIndex: null,
      caseId: null,//修订案例的 caseId
      disabledAge: false,
      userList: [],
      counselorParams:{},
    }
  },
  created() {
    this.getCampMsgList();
    this.caseId = this.$route.query.case_id;
    this.edit_id = this.$route.query.edit_id;
    if (this.caseId) {
      // 修订案例
      this.counselorParams.case_id = this.caseId;
      this.getThemeTree();
      this.reviseCounselorCaseList(this.caseId);
      this.title = '修订案例';
      this.disabledAge = true;
    } else if (this.edit_id){
      // 草稿箱编辑
      this.counselorParams.case_id = this.edit_id;
      this.getThemeTree();
      this.getEditCaseDetails(this.edit_id);
      this.title = '编辑案例';
    }
    //获取树形 结构
    this.getThemeTree();
  },
  mounted() {
    // console.log(localStorage.getItem("counsellor_request_id"),'页面读取')
    requestOver('/counselor/counselorCases/add/0',this.counselorParams)
  },
  methods: {
    handleCamp(value){
      this.form.unionid = "";
      this.userList = [];
      this.training_camp_name.forEach(item => {
        if(value[0]){
          if(item.id === value[0]){
            this.form.goods_name = item.name;
            if(item.group){
              item.group.forEach(itm => {
                if(itm.id == value[1]){
                  this.form.camp_group_name = itm.name;
                }
              })
            }
          }
        }
      })
    },
    //选中用户
    selectUser(){
      this.form.child_age = '';
      this.form.child_sex = '';
      this.form.child_relation = '';
      this.form.headimgurl = '';

      this.userList.forEach(item => {
        if(item.unionid === this.form.unionid){
          console.log(item,'item')
          this.form.child_age = item.child_age;
          this.form.child_sex = item.child_sex;
          this.form.child_relation = item.child_relation;
          this.form.camp_user_name = item.nickname;
          this.form.mobile = item.mobile;
          this.form.headimgurl = item.headimgurl;
        }
      })
    },
    //训练营信息列表
    getCampMsgList(){
     getCampMsgList().then(res => {
      if(res.code == 200){
        this.training_camp_name = res.result;
        this.training_camp_name.splice(1, 0);
      }
     })
    },
    //训练营信息
    searchCamp() {
      this.form.child_sex = '';
      this.form.child_age = '';
      this.user_name = '';
      this.child_relation = '';
      this.form.headimgurl = '';
      const map = {
        nickname: this.form.nickname,
        camp_ids: this.form.camp_ids
      }
      if (map.camp_ids.length != 0) {
        getCampUserMsg(map).then(res => {
          if(res.code == 200){
            this.form.child_age = '';
            this.form.child_sex = '';
            this.form.child_relation = '';

            this.userList = res.result;
            if(this.userList.length != 0){
              this.form.unionid = this.userList[0].unionid;
              this.userList.forEach(item => {
                if(item.unionid === this.form.unionid){
                  console.log(item,'item')
                  this.form.child_age = item.child_age;
                  this.form.child_sex = item.child_sex;
                  this.form.child_relation = item.child_relation;
                  this.form.camp_user_name = item.nickname;
                  this.form.mobile = item.mobile;
                  this.form.headimgurl = item.headimgurl;
                }
              })
            }
          }
        })
      } 
    },
    // 获取修订案例的详情
    reviseCounselorCaseList(case_id) {
      const map = {
        case_id
      }
      reviseCounselorCaseList(map).then((res) => {
        if (res.code == 200) {
          let result = res.result;
          let form = this.form;
          for (let key in form) {
            for (let item in result) {
              if (item == key) {
                form[key] = result[item];
              }
            }
          }
          this.form.case_track = result.contents.case_track;
          this.form.child_situation = result.contents.child_situation;
          this.form.diagnosis = result.contents.diagnosis;
          this.form.effect = result.contents.effect;
          this.form.suggest = result.contents.suggest;
          this.form.user_action = result.contents.user_action;
          this.form.first_asked = result.contents.first_asked;

          const ageLabelId = result.relation_id[0][0];
          this.userList = result.campUserInfo;
          this.form.unionid = result.campUserInfo[0].unionid;
          this.form.camp_user_name = result.campUserInfo[0].nickname;
          this.form.goods_name = result.camp.name;
          this.form.headimgurl = result.campUserInfo[0].headimgurl;
          this.form.camp_group_name = result.camp.group.name;
          const data = {};
          getThemeTree(data).then(res => {
            if (res.code == 200) {
              this.options = res.result;
              for (let i = 0; i < this.options.length; i++) {
                if (this.options[i].label_id == ageLabelId) {
                  this.ageValue = i;
                }
              }
              this.changeAge(this.ageValue);
              const relation_id = result.relation_id;
              const theme = [];
              for (let j = 0; j < relation_id.length; j++) {
                theme.push(relation_id[j].splice(1, 2))
              }
              this.form.themeArr = theme;
            }
          })
        }
      })
    },
    getEditCaseDetails(case_id){
      const map = {
        case_id
      }
      editCaseDetails(map).then((res) => {
        if (res.code == 200) {
          let result = res.result;
          let form = this.form;
          for (let key in form) {
            for (let item in result) {
              if (item == key) {
                form[key] = result[item];
              }
            }
          }
          this.form.case_track = result.contents.case_track;
          this.form.child_situation = result.contents.child_situation;
          this.form.diagnosis = result.contents.diagnosis;
          this.form.effect = result.contents.effect;
          this.form.suggest = result.contents.suggest;
          this.form.user_action = result.contents.user_action;
          this.form.first_asked = result.contents.first_asked;

          const ageLabelId = result.relation_id[0][0];
          this.userList = result.campUserInfo;
          this.form.unionid = result.campUserInfo[0].unionid;
          this.form.camp_user_name = result.campUserInfo[0].nickname;
          this.form.goods_name = result.camp.name;
          this.form.headimgurl = result.campUserInfo[0].headimgurl;
          this.form.camp_group_name = result.camp.group.name;
          const data = {};
          getThemeTree(data).then(res => {
            if (res.code == 200) {
              this.options = res.result;
              for (let i = 0; i < this.options.length; i++) {
                if (this.options[i].label_id == ageLabelId) {
                  this.ageValue = i;
                }
              }
              this.changeAge(this.ageValue);
              const relation_id = result.relation_id;
              const theme = [];
              for (let j = 0; j < relation_id.length; j++) {
                theme.push(relation_id[j].splice(1, 2))
              }
              this.form.themeArr = theme;
            }
          })
        }
      })
    },
    // 选择主题
    handleChange(value) {
      let count = 0;
      let array = this.form.themeArr;
      array.forEach((item, index) => {
        if (JSON.stringify(value) === JSON.stringify(item)) {
          count++
          if (count >= 2) {
            this.$message({
              type: 'error',
              message: '重复选择！'
            });
            this.form.themeArr[index] = [];
          }
        }
      });
      this.getSameThemeList(value);
    },
    // 获取同类标签lsit
    getSameThemeList(value) {
      console.log('id', value)
      const data = {
        age_id: this.options[this.ageValue].label_id,
        first_id: value[0],
        second_id: value[1]
      };
      getSameThemeList(data).then(res => {
        if (res.code == 200) {
          const moreTheme = res.result.list;
          if (moreTheme.length) {
            this.visible = true;
            this.moreTheme = moreTheme;
          }

        }
      })
    },
    // 改变年龄
    changeAge(value) {
      if (this.options[value].children) {
        this.optionsTheme = this.options[value].children;
        this.form.themeArr = [[]]
      } else {
        this.$message({
          type: 'error',
          message: '当前年龄段没有分类'
        })
      }
    },
    // 取消同步标签
    moreThemeN() {
      this.moreTheme = [];
      this.visible = false;
    },
    // 确定同步标签
    moreThemeY() {
      let arr = [];
      for (let index = 0; index < this.moreTheme.length; index++) {
        const element = this.moreTheme[index];
        arr.push([element.first_label_id, element.second_label_id])

      }
      this.form.themeArr = [...this.form.themeArr, ...arr];
      this.moreTheme = [];
      this.visible = false;
    },
    // 添加一条主题
    addTheme() {
      const index = this.ageValue;
      console.log(index, 'index')
      if (index !== null) {
        this.form.themeArr.push([])
        // this.form.themeArr.splice(1, 0)
        console.log(this.form.themeArr, 'themeArr')
      } else {
        this.$message({
          type: 'error',
          message: '请先选择年龄段'
        })
      }
    },
    // 删除主题标签
    removeTheme(index) {
      let themeArr = this.form.themeArr;
      themeArr.splice(index, 1);
    },
    // 获取树形结构
    getThemeTree() {
      const data = {};
      getThemeTree(data).then(res => {
        if (res.code == 200) {
          this.options = res.result;
          console.log(this.options, 'tree')
        }
      })
    },
    handleChangeReq(value) {
      console.log(value, '问题')
    },
    // 添加案例
    addCounselorCaseList() {
      const map = this.form
      addCounselorCaseList(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          let status = 'second';
          this.$router.push({path: '/counselor/counselorCases/index', query:{ status }})
        }
      })
    },
    // 更新案例
    upDateCounselorCaseList() {
      const map = this.form
      map.case_id = this.caseId;
      upDateCounselorCaseList(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          // this.$router.go(-1);
          let status = 'second';
          this.$router.push({path: '/counselor/counselorCases/index', query:{ status }})
        }
      })
    },
    // 草稿箱 案例 提交审核
    addCaseExamine(){
      const data = this.form;
      data.case_id = this.edit_id;
      addCaseExamine(data).then(res => {
        if(res.code == 200){
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: 'success'
            });
            let status = 'third';
            this.$router.push({path: '/counselor/counselorCases/index', query:{ status }})
          }
        }
      })
    },
    // 提交按钮
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          let arr = JSON.parse(JSON.stringify(this.form.themeArr));
          for (let index = 0; index < arr.length; index++) {
            arr[index].unshift(this.options[this.ageValue].label_id)
          }
          console.log(this.themeArr)
          this.form.relation_id = arr;
          console.log(JSON.stringify(this.form))
          if (this.caseId) {
            //走修订案例提交接口
            this.upDateCounselorCaseList();
          } else if(this.edit_id){
            //草稿箱 编辑 提交审核
            this.addCaseExamine();
          } else {
            //添加案例接口
            this.addCounselorCaseList();
          }
        } else {
          this.$message({
            message: '请填写必填项哦',
            type: 'warning'
          });
          return false;
        }
      });
    },
    // 保存到草稿箱
    onSaveDrafts(ruleForm){
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          let arr = JSON.parse(JSON.stringify(this.form.themeArr));
          for (let index = 0; index < arr.length; index++) {
            arr[index].unshift(this.options[this.ageValue].label_id)
          }
          console.log(this.themeArr)
          this.form.relation_id = arr;
          console.log(JSON.stringify(this.form))
          
          if(this.edit_id){
            //走编辑 草稿箱案例
            this.editCaseDrafs();
          }else{
            //保存草稿箱
            this.addCaseDrafs();
          }
        } else {
          this.$message({
            message: '请填写必填项哦',
            type: 'warning'
          });
          return false;
        }
      });
    },
    addCaseDrafs(){
      addCaseDrafs(this.form).then(res => {
        if(res.code == 200){
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          let status = 'third';
          this.$router.push({path: '/counselor/counselorCases/index', query:{ status }})
        }
      })
    },
    editCaseDrafs(){
      const data = this.form;
      data.case_id = this.edit_id;
      editCaseDrafs(data).then(res => {
        if(res.code == 200){
          this.$message({
            message: '编辑成功',
            type: 'success'
          });
          let status = 'third';
          this.$router.push({path: '/counselor/counselorCases/index', query:{ status }})
        }
      })
    },
    // 取消
    onCancel() {
      this.$confirm('取消后不会保留已修改信息,确认取消?', '提示', {
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
.form-wrap {
  padding-top: 20px;
}
.form-wrap {
  .input-prompt {
    font-size: 12px;
    color: red;
  }
  .icon {
    color: #dedede;
    margin-left: 10px;
    margin-top: 10px;
    font-size: 25px;
    cursor: pointer;
    &:hover {
      color: #20b6f9;
    }
  }
}
.question .el-select {
  width: 207px;
}
.tips {
  font-size: 16px;
  color: #bbb;
  display: inline-block;
  width: 500px;
}
.icon_add {
  font-size: 24px;
  padding-left: 20px;
  padding-top: 7px;
}
.comment-margin p {
  margin: 0;
}
.input-name .el-input--small{
  width: 430px;
}
.input-name .el-cascader__label{
  width: 430px;
}
</style>




<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col
        :span="10"
        class="subtitle"
      >{{title}}</el-col>
    </sticky>
    <el-form
      v-if="changeForm.question_id==0"
      ref="form"
      :model="form"
      class="form-wrap"
      label-width="140px"
      :rules="rules"
    >
      <!-- <el-form-item label="用户姓名：" class="item-gender">
        <el-input v-model="user_name" size="small" placeholder="请输入用户姓名"></el-input>
      </el-form-item>-->

      <el-form-item
        label="用户手机号："
        class="item-gender"
        prop="user_phone"
      >
        <el-col :span="4">
          <el-input
            v-model.number="form.user_phone"
            maxlength="11"
            size="small"
            @change="searchCamp"
            placeholder="请输入用户手机号"
          ></el-input>
        </el-col>

        <el-col
          :span="2"
          align="right"
        >
          <el-button
            type="success"
            size="mini"
            @click="searchCamp"
          >搜索</el-button>
        </el-col>
      </el-form-item>

      <el-row>
        <el-col :span="24">
          <el-col :span="6">
            <el-form-item
              label="群名称："
              prop="camp_ids"
              required
            >
              <el-cascader
                size="small"
                expand-trigger="hover"
                v-model="form.camp_ids"
                :options="training_camp_name"
                :props="props"
                placeholder="请选择训练营名称"
                @change="handleCampName"
              ></el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="用户姓名："
              prop="user_name"
              v-if="user_name"
            >
              <el-col
                :span="24"
                v-model="user_name"
              >{{ user_name }}</el-col>
            </el-form-item>
          </el-col>

          <el-col :span="3">
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
                <span v-if="form.child_sex == 0">未知</span>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="3">
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
          </el-col>

          <el-col :span="4">
            <el-form-item
              label="与孩子关系："
              prop="child_relation"
              v-if="child_relation"
            >
              <el-col
                :span="24"
                v-model="child_relation"
              >
                <span v-if="child_relation == 1">爸爸</span>
                <span v-if="child_relation == 2">妈妈</span>
                <span v-if="child_relation == 3">其他</span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>

      <!-- <el-form-item label="问题属性：" required prop="question_class_id">
        <el-select size="small" v-model="form.question_class_id" placeholder="请选择问题属性">
          <el-option
            v-for="item in attrOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item
        label="主题："
        required
      >
        <!-- 年龄段 -->
        <el-form-item>
          <el-select
            v-model="ageValue"
            @change="changeAge"
            :disabled="disabledQuestion"
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
          <el-col :span="5">
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
      <el-form-item
        label="问题场景"
        prop="question"
      >
        <el-input
          type="textarea"
          :rows="2"
          :autosize="{ minRows: 4, maxRows: 10}"
          placeholder="请输入内容"
          v-model="form.question"
        ></el-input>
        <!-- <tinymce v-model="form.answer"></tinymce> -->
      </el-form-item>
      <el-form-item
        label="如何解决："
        prop="answer"
      >
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10}"
          :rows="2"
          placeholder="请输入内容"
          v-model="form.answer"
        ></el-input>

        <!-- <tinymce v-model="form.family_education_trap"></tinymce> -->
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          v-if="!editQuestionId"
          @click="onSubmit('form')"
        >提交</el-button>
        <el-button
          type="primary"
          v-else
          @click="updateRevise('form')"
        >重新提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

    <el-form
      v-else
      :model="changeForm"
      :rules="rules"
      class="form-wrap"
      label-width="140px"
    >
      <el-form-item label="问题场景：">
        <p class="disable-p">{{changeForm.question}}</p>
      </el-form-item>
      <el-form-item
        label="解决方案："
        prop="answer"
      >
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10}"
          :rows="2"
          placeholder="请输入内容"
          v-model="changeForm.answer"
        ></el-input>

        <!-- <tinymce v-model="form.family_education_trap"></tinymce> -->
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitOtherAnswer"
        >提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
      <el-form-item label="其他方案：">
        <el-col v-for="(item,index) in changeForm.other_list" :key="index">
          <p class="disable-p">{{item.answer}}</p>
          {{item.nickname}} {{item.create_time}}
        </el-col>
      </el-form-item>
    </el-form>

    <el-col
      :span="24"
      class="history-wrap"
      v-if="historyList.length > 0"
    >
      <el-col
        :spa="24"
        class="history-title"
      >历史审核记录</el-col>
      <el-col
        class="history-item"
        v-for="(item,index) in historyList"
        :key="index"
        :span="24"
      >
        <el-col :span="24">{{item.opinion_content}}</el-col>
        <el-col :span="24">{{item.examine_time}}</el-col>
      </el-col>
    </el-col>

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
import { getAnswerserDetail, createAnswer, submitOtherAnswer, getThemeTree, getRevisionAnswer, updateRevise, getSameThemeList } from '@/api/counselor'
import { getCampMsgList, getCampBabyMst } from '@/api/articleLibrary'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
import Request from '@/utils/request'
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
      title: '',
      editQuestionId: '',
      historyList: [],//历史审核
      attrOptions: [{ label: '是问题的问题', value: '1' }, { label: '不是问题的问题', value: '2' }, { label: '看不见的问题', value: '3' }],
      // listLoading: true,
      // 一级主题和二级主题tree
      optionsTheme: [],
      themeProps: { value: 'label_id', label: 'title', children: 'children' },
      themeArr: [[]],
      // 更多主题
      moreTheme: [],
      visible: false,
      // 年龄主题标签tree
      options: [],
      label_options: [],
      label_ids: [[]],
      ageValue: null,
      form: {
        themeArr: [[]],
        question: '',
        question_class_id: '',
        relation_id: [[]],
        answer: null,
        camp_ids: [],
        child_sex: '',
        child_age: '',
        user_phone: '',
        resource_id: null
      },
      rules: {
        question: [
          { required: true, message: '请输入问题场景', trigger: 'blur' },
          { max: 500, message: '问题场景不能超过500字', trigger: 'blur' }
        ],
        question_class_id: [
          { required: true, message: '请选择问题属性', trigger: 'change' },
        ],
        relation_id: [
          { validator: ids, required: true, message: '请选择主题', trigger: 'change' },
        ],
        answer: [
          { required: true, message: '请输入解决方案', trigger: 'blur' },
        ],
        user_phone: [
          { required: true, message: '手机号不能为空' },
          { type: 'number', message: '手机号必须为数字值' }
        ],
        camp_ids: [
          { validator: ids, required: true, message: '请选择群', trigger: 'change' },
        ]
      },
      changeForm: {
        question_id: null,
        question: "问题标题",
        name: "问题属性问题的问题",
        title: ["1-3/亲子阅读/睡觉", "4-5/生活/吃饭"],
        other_list: [],
        answer: null
      },
      user_name: '',
      user_phone: '',
      child_sex: '',
      child_age: '',
      child_relation: '',
      training_camp_name: [],
      props: {
        value: 'id',
        label: 'name',
        children: 'group'
      },
      disabledQuestion: false,

    }
  },
  created() {
    console.log(this.$route.params.id, 'id')

    // this.getThemeTree();
    this.changeForm.question_id = this.$route.params.id;
    if (this.changeForm.question_id != 0) {
      this.title = '补充答案';
      this.getAnswerserDetail()
    } else {
      this.getThemeTree();
      this.title = '新建问答';
      if (this.$route.query.question_id) {
        this.title = '修订问答';
        this.editQuestionId = this.$route.query.question_id;
        this.getRevisionAnswer();
        this.disabledQuestion = true;
      }
    }

  },
  methods: {
    handleCampName(value) {
      console.log(value, '训练营的数据')
    },
    //训练营信息
    searchCamp() {
      this.form.child_sex = '';
      this.form.child_age = '';
      this.user_name = '';
      this.child_relation = '';
      this.form.camp_ids = [];
      this.training_camp_name = [];

      const map = {
        mobile: this.form.user_phone
      }
      if (map.mobile) {
        getCampMsgList(map).then((res) => {
          if (res.code == 200) {
            const result = res.result;
            this.training_camp_name = result.camp;
            this.training_camp_name.splice(1, 0);
            this.user_name = result.nickname;
            this.child_relation = result.child_relation;
            this.form.camp_user_id = result.camp_user_id;
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请输入用户手机号哦'
        })
      }
    },
    handleCampName(value) {
      const map = {
        camp_user_id: this.form.camp_user_id,
        camp_ids: value
      }
      getCampBabyMst(map).then((res) => {
        if (res.code == 200) {
          this.form.child_sex = parseInt(res.result.child_sex);
          this.form.child_age = res.result.child_age;
        }
      })
    },
    // 获取年龄段主题tree
    getThemeTree() {
      getThemeTree().then(res => {
        if (res.code == 200) {
          this.options = res.result;
        }
      })
    },
    // 移除标签
    tagClose() { },
    // 切换年龄段赋值当前主题options
    changeAge(value) {
      console.log(this.options[value].label_id, '选中的年龄段value');
      console.log(this.options[value])
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
    // 获取问答详情
    getAnswerserDetail() {
      const question_id = this.changeForm.question_id;
      getAnswerserDetail({ question_id }).then((res) => {
        if (res.code == 200) {
          this.changeForm = res.result
        }
      })
    },
    // 提交补充答案
    submitOtherAnswer(formName) {
      console.log(this.changeForm)
      if (this.changeForm.answer) {
        const data = this.changeForm;
        submitOtherAnswer(data).then((res) => {
          if (res.code == 200) {
            this.$confirm('答案补充成功', '提示', {
              confirmButtonText: '返回问答列表',
              cancelButtonText: '继续补充答案',
              type: 'success'
            }).then(() => {
              this.$router.go(-1)
            }).catch(() => {
              this.changeForm.answer = null;
            });
          }
        })
      } else {
        this.$message({
          message: '您还有未填写项，请检查并填写后再提交!',
          type: 'warning'
        })
      }
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
      // this.form.relation_id = 
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
    // 添加主题
    addTheme() {
      const index = this.ageValue;
      console.log(index)
      if (index === null) {
        this.$message({
          type: 'error',
          message: '请先选择年龄段'
        })

      } else {
        console.log(1111)
        this.form.themeArr.push([])
      }

    },
    // 删除主题标签
    removeTheme(index) {
      let themeArr = this.form.themeArr;
      themeArr.splice(index, 1);
    },
    // 创建问答
    onSubmit(formName) {
      console.log(this.$refs[formName])
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form.themeArr)
          let arr = JSON.parse(JSON.stringify(this.form.themeArr));
          // Object.assign(arr,this.form.themeArr)
          for (let index = 0; index < arr.length; index++) {
            arr[index].unshift(this.options[this.ageValue].label_id)
          }
          console.log(this.form.themeArr)
          this.form.relation_id = arr;
          console.log(JSON.stringify(this.form), '')
          createAnswer(this.form).then(res => {
            if (res.code == 200) {
              this.$confirm('创建成功!', '提示', {
                confirmButtonText: '继续创建',
                cancelButtonText: '返回问答列表',
                type: 'success',
                center: true
              }).then(() => {
                // this.$refs[formName].resetFields();
              }).catch(() => {
                this.$router.go(-1)
              })
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    updateRevise(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          let arr = JSON.parse(JSON.stringify(this.form.themeArr));
          for (let index = 0; index < arr.length; index++) {
            arr[index].unshift(this.options[this.ageValue].label_id)
          }
          this.form.relation_id = arr;
          this.form.resource_id = this.editQuestionId
          updateRevise(this.form).then(res => {
            if (res.code == 200) {
              this.$confirm('修订成功!', '提示', {
                confirmButtonText: '继续修订',
                cancelButtonText: '返回问答列表',
                type: 'success',
                center: true
              }).then(() => {
                // this.$refs[formName].resetFields();
              }).catch(() => {
                this.$router.go(-1)
              })
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 获取修订问答详情
    getRevisionAnswer() {
      // 获取问答详情并赋值
      const data = {
        question_id: this.editQuestionId,
        is_anwser: 0
      }
      getRevisionAnswer(data).then(res => {
        const arr = this.options;
        if (res.code == 200) {
          let result = res.result;
          let form = this.form;
          for (let key in form) {
            for (let item in result) {
              if (item == key) {
                console.log(item, 'item')
                form[key] = result[item];
              }
            }
          }
          
          this.historyList = res.result.opinion_list;
          this.user_name = result.user_camp.nickname;
          this.form.user_phone = parseInt(result.user_camp.mobile);
          this.searchCamp();

          this.form.camp_ids = result.user_camp.camp.camp_ids;
          this.form.child_sex = result.user_camp.camp.group.child_sex;
          this.form.child_age = result.user_camp.camp.group.child_age;
          const ageLabelId = result.relation_id[0][0];
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


          // for (let i = 0; i < this.options.length; i++) {
          //   if (this.options[i].label_id == ageLabelId) {
          //     this.ageValue = i;
          //   }
          // }
          // this.changeAge(this.ageValue)

          // const relation_id = result.relation_id;
          // const theme = [];
          // for (let j = 0; j < relation_id.length; j++) {
          //   theme.push(relation_id[j].splice(1, 2))
          // }
          // this.form.themeArr = theme;
          
        }
      })
    },
    // 处理返回的主题数据
    shiftOne(arr) {
      console.log(arr, '处理数据')
      this.ageValue = arr[0][0];
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        let [...arr1] = arr[i];
        newArr.push(arr1);
      }
      // let newArr = JSON.parse(JSON.stringify(arr));
      for (let index = 0; index < newArr.length; index++) {
        newArr[index].shift()
      }
      this.form.themeArr = newArr;
    },
    // 取消
    onCancel() {
      this.$confirm('确定离开？', '提示', {
        showClose: false,
        confirmButtonText: '继续创建',
        cancelButtonText: '狠心离开',
        type: 'warning',
      }).then(() => {

      }).catch(() => {
        console.log(this.$router.go(-1))
      })

    }

  }
}
</script>

<style lang="scss">
.app-container {
  padding: 0 0 20px;
}
.sub-navbar {
  text-align: left;
  .subtitle {
    padding: 0 20px;
  }
}
.form-wrap {
  padding: 20px;
  line-height: 40px;
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
  .disable-p {
    background-color: #eee;
    border-radius: 5px;
    padding: 10px;
    line-height: 16px;
    word-wrap: break-word;
  }
}
.history {
  &-wrap {
    padding: 20px 60px;
  }
  &-title {
    font-size: 20px;
    font-weight: bolder;
    margin-bottom: 10px;
  }
  &-item {
    border-radius: 5px;
    padding: 10px 20px;
    background-color: #ededed;
  }
}
.form-wrap .el-input__inner {
  width: 200px;
}
</style>
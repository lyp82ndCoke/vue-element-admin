<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col
        :span="10"
        class="subtitle"
        v-if="changeForm.question_id==0"
      >创建问题</el-col>
      <el-col
        :span="10"
        class="subtitle"
        v-else
      >编辑问答</el-col>
    </sticky>
    <!-- v-if="changeForm.question_id==0" -->
    <el-form
      :model="changeForm"
      :rules="rules"
      class="form-wrap"
      label-width="140px"
    >
      <!-- <el-form-item label="问题属性：" required prop="question_class_id">
        <el-select size="small" v-model="changeForm.question_class_id" placeholder="请选择问题属性">
          <el-option
            v-for="item in attrOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item
        label="问题场景："
        prop="question"
      >
        <el-input
          type="textarea"
          :rows="2"
          :autosize="{ minRows: 4, maxRows: 10}"
          placeholder="请输入内容"
          v-model="changeForm.question"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="解决方案："
        required
      >
        <el-row
          v-for="(item,index) in changeForm.answer_content"
          :key="index"
          style="marginBottom:20px;"
        >
          <el-col>{{item.real_name}}/{{item.create_time}}</el-col>
          <el-col :span="14">
            <el-form-item
              :prop="`answer_content.${index}.answer`"
              :rules="rules.answer"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 10}"
                :rows="2"
                placeholder="请输入内容"
                v-model="item.answer"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="10"
            algin="center"
            style="padding:0 20px;"
          >
            <el-col>
              <el-button
                size="small"
                icon="el-icon-delete"
                type="danger"
                @click="deleteAnswers(item.answer_id)"
                v-if="changeForm.answer_content.length>1"
              >删除答案</el-button>
              <el-button
                size="small"
                v-if="item.is_top==1"
                type="danger"
                @click="cancelTop(item.answer_id)"
                icon="el-icon-upload2"
              >取消置顶</el-button>
              <el-button
                size="small"
                v-else
                type="primary"
                @click="isTop(item.answer_id)"
                icon="el-icon-upload2"
              >置顶</el-button>
            </el-col>
            <el-col
              style="fontSize:12px;"
              align="left"
            >
              <span v-if="changeForm.answer_content[0].is_top==1">
                <span v-if="index===1">
                  <el-button
                    type="primary"
                    disabled
                    size="mini"
                    circle
                  >↑</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    v-if="index<(changeForm.answer_content.length-1)"
                    @click="goNext(index)"
                    circle
                  >↓</el-button>
                </span>
                <span v-else-if="index!==0">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="goPre(index)"
                    circle
                  >↑</el-button>
                  <el-button
                    v-if="index === (changeForm.answer_content.length-1)"
                    type="primary"
                    size="mini"
                    disabled
                    circle
                  >↓</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    v-else
                    @click="goNext(index)"
                    circle
                  >↓</el-button>
                </span>
                <span v-else></span>
              </span>
              <span v-else>
                <el-button
                  type="primary"
                  v-if="index===0"
                  disabled
                  size="mini"
                  circle
                >↑</el-button>
                <el-button
                  type="primary"
                  @click="goPre(index)"
                  v-else
                  size="mini"
                  circle
                >↑</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  v-if="index<(changeForm.answer_content.length-1)"
                  @click="goNext(index)"
                  circle
                >↓</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  v-else
                  disabled
                  circle
                >↓</el-button>
              </span>
            </el-col>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitOtherAnswer"
        >提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getEditAnswerDetail, submitEditQuestion, answerIsTop, delAnswer } from '@/api/counselor'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Sticky },
  data() {
    const ids = (rule, value, callback) => {
      // console.log(value, 'aaa')
      if (!value) {
        callback(new Error('请选择主题'))
      }
      callback();
    }
    return {

      attrOptions: [{ label: '是问题的问题', value: '1' }, { label: '不是问题的问题', value: '2' }, { label: '看不见的问题', value: '3' }],
      // listLoading: true,
      form: {
        question: '',
        question_class_id: '',
        answer: null,
      },
      rules: {
        question: [
          { required: true, message: '请输入问题场景', trigger: 'blur' },
        ],
        question_class_id: [
          { required: true, message: '请选择问题属性', trigger: 'change' },
        ],
        answer: [
          { required: true, message: '请输入解决方案', trigger: 'blur' },
        ]
      },
      changeForm: {
        question_id: null,
        question: '',
        question_class_id: null,
        answer_content: []
      },
      list: null,
    }
  },
  created() {
    // console.log(this.$route.params.id, 'id')
    this.changeForm.question_id = this.$route.params.id;
    if (this.changeForm.question_id != 0) {
      this.changeForm.question_id = this.$route.params.id;
      this.getAnswerserDetail()
    } else {
      this.$message('未找到此问答')
    }
  },
  methods: {
    // 移除标签
    // 获取问答详情
    getAnswerserDetail() {
      const question_id = this.changeForm.question_id;
      getEditAnswerDetail({ question_id }).then((res) => {
        if (res.code == 200) {
          this.changeForm = res.result
        }
      })
    },
    // 提交补充答案
    submitOtherAnswer() {
      // console.log(this.changeForm)
      if (this.changeForm.answer_content) {
        const data = this.changeForm;
        submitEditQuestion(data).then((res) => {
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
    // 置顶
    isTop(answer_id) {
      const data = {
        answer_id: answer_id,
        question_id: this.changeForm.question_id,
        is_top: 1
      }
      answerIsTop(data).then(res => {
        if (res.code == 200) {
          // console.log('置顶')
          this.getAnswerserDetail()
        }
      })
    },
    // 取消置顶
    cencelTop() {
      const data = {
        answer_id: answer_id,
        question_id: this.changeForm.question_id,
        is_top: 2
      }
      answerIsTop(data).then(res => {
        if (res.code == 200) {
          this.getAnswerserDetail()
        }
      })
    },
    // 向上一个
    goPre(index) {
      this.$message(`向上移动${index}`)
      this.changeArr(index, index - 1)
    },
    // 向下一个
    goNext(index) {
      this.$message(`向下移动${index}`)
      this.changeArr(index, index + 1)
    },
    // 数组交换位置
    changeArr(index1, index2) {
      let array = this.changeForm.answer_content;
      let temp = array[index1];
      array[index1] = array[index2];
      array[index2] = temp;
      this.changeForm.answer_content = [];
      this.changeForm.answer_content = array;
    },
    // 删除
    deleteAnswers(answer_id) {


      const data = {
        question_id: this.changeForm.question_id,
        answer_id
      }
      delAnswer(data).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }
        this.getAnswerserDetail()
      })
    },


    removeTheme(index) {
      let relation_id = this.form.relation_id;
      let treeValues = this.treeValues;
      // console.log(relation_id, treeValues)
      treeValues.splice(index, 1);
      relation_id.splice(index, 1);

      // this.form.label_ids = arr;
    },
    // 创建问答
    onSubmit(formName) {
      // console.log(this.$refs[formName])
      this.$refs[formName].validate((valid) => {
        // console.log(valid)
        if (valid) {
          createAnswer(this.form).then(res => {
            if (res.code == 200) {
              this.$confirm('编辑成功!', '提示', {
                confirmButtonText: '继续编辑',
                cancelButtonText: '返回问答列表',
                type: 'success',
                center: true
              }).then(() => {
                // this.$refs[formName].resetFields();
              }).catch(() => {
                this.$router.push({ path: '../index' })
              })
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    onCancel() {
      this.$confirm('是否放弃编辑？', '提示', {
        showClose: false,
        confirmButtonText: '继续编辑',
        cancelButtonText: '狠心离开',
        type: 'warning',
      }).then(() => {

      }).catch(() => {
        this.$router.push({ path: '../index' })
      })

    }

  }
}
</script>

<style lang="scss" scoped>
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
}
</style>
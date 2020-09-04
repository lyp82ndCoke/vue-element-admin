<template>
  <el-col :span="24">
    <!-- <el-col :span="24" v-if="bgShow" class="bg-wrap" > 
        <div @click.self="hiddenAlert" style="width:100%;height: 100%;">
          <el-col :span="20" class="alert-wrap">
          <el-table :data="themeData" stripe style="width: 100%">
            <el-table-column prop="age_label_name" label="年龄" width="180"></el-table-column>
            <el-table-column prop="first_theme_name" label="一级主题" width="180"></el-table-column>
            <el-table-column prop="second_theme_name" label="二级主题"></el-table-column>
          </el-table>
        </el-col>
        </div>
    </el-col>-->

    <!-- 全部title -->
    <el-col
      class="title-wrap"
      v-if="type=='all'"
    >
      <el-col :span="5">
        <el-cascader
          size="small"
          placeholder="请选择分类"
          filterable
          :options="options"
          :props="props"
          v-model="allForm.relation_id"
          @change="handleChange"
        ></el-cascader>
      </el-col>
      <!-- <el-col :span="5">
        <el-select
          size="small"
          v-model="allForm.class_id"
          placeholder="请选择问题属性"
          @change="attrChange"
        >
          <el-option
            v-for="item in attrOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>-->
      <el-col :span="4">
        <el-input
          size="small"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="allForm.question"
        ></el-input>
      </el-col>
      <el-col
        :span="2"
        align="center"
      >
        <el-button
          size="small"
          type="primary"
          @click="search"
        >搜索</el-button>
      </el-col>
      <el-col
        :span="2"
        align="center"
      >
        <el-button
          size="small"
          @click="clear"
        >清空</el-button>
      </el-col>
      <el-col
        :span="5"
        align="right"
      >
        <el-button
          size="small"
          type="primary"
          @click="news(0)"
        >创建问答</el-button>
      </el-col>
    </el-col>
    <!-- 全部title end -->
    <!-- 采纳title begin-->
    <el-col
      class="title-wrap"
      v-if="type=='adoption'"
    >
      <el-col :span="10">
        <el-radio-group
          size="small"
          v-model="adoptionForm.is_anwser"
          @change="answersChange"
        >
          <el-radio-button
            v-for="item in adoptionAttrOptions"
            :key="item.value"
            :label="item.value"
          >已采纳{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-col>
      <!-- <el-col :span="10">
        答案/问题：
        <el-select size="small" v-model="adoptionForm.is_anwser" @change="answersChange">
          <el-option
            v-for="item in adoptionAttrOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>-->
    </el-col>
    <!-- 采纳title end -->
    <!-- 待审核title begin-->
    <el-col
      class="title-wrap"
      v-if="type=='review'"
    >
      <el-col :span="10">
        <el-radio-group
          size="small"
          @change="reviewChangeAttrAnswers"
          v-model="reviewForm.is_anwser"
        >
          <el-radio-button
            v-for="item in reviewAttrOptions"
            :key="item.value"
            :label="item.value"
          >待审核{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-col>
      <!-- <el-col :span="10">
        答案/问题：
        <el-select size="small" v-model="reviewForm.is_anwser" @change="answersChange">
          <el-option
            v-for="item in reviewAttrOptions"
            :key="item.value"
            :label="'待审核'+item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>-->
      <!-- <el-col :span="14" align="right">
        审核结果：
        <el-select
          size="small"
          v-model="reviewForm.status"
          placeholder="请选择问题属性"
          @change="reviewChange"
        >
          <el-option
            v-for="item in reviewOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>-->
    </el-col>
    <!-- 待审核title end -->
    <el-col
      :span="24"
      class="table-wrap"
    >
      <!-- v-loading="loading" element-loading-text="请给我点时间！" -->
      <!-- 全部table -->
      <el-table
        v-loading="loading"
        element-loading-text="请给我点时间！"
        v-if="type=='all'"
        :data="allList"
        size="small"
        border
        fit
        highlight-current-row
        style="width: 100%"
        class="table-ellipes"
      >
        <!-- 标题模块 begin -->
        <el-table-column
          align="center"
          label="问题场景"
        >
          <template slot-scope="scope">
            <span class="text-3">{{ scope.row.question }}</span>
          </template>
        </el-table-column>
        <!-- 标题模块  end -->
        <!-- <el-table-column align="center" label="问题属性">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>-->
        <el-table-column
          align="center"
          label="答案数"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.answer_num>0"
              type="text"
              @click="news(scope.row.question_id)"
            >{{ scope.row.answer_num }}</el-button>
            <el-button
              v-else
              type="text"
              disabled
            >{{ scope.row.answer_num }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="关联主题数"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.theme_num>0"
              type="text"
              @click="showAlert(scope.row.question_id)"
            >{{ scope.row.theme_num }}</el-button>
            <el-button
              v-else
              type="text"
              disabled
            >{{ scope.row.theme_num }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-loading="loading"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="news(scope.row.question_id)"
            >补充答案</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 已采纳 begin -->
      <el-table
        v-loading="loading"
        v-if="type=='adoption'"
        :data="adoptionList"
        size="small"
        border
        fit
        highlight-current-row
        style="width: 100%"
        class="table-ellipes"
      >
        <el-table-column
          align="center"
          label="问题场景"
        >
          <template slot-scope="scope">
            <span class="text-3">{{ scope.row.question }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="解决方案"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.answer }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="提交日期"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="adoptionForm.is_anwser=='0'"
          align="center"
          label="关联标签数"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showAlert(scope.row.question_id)"
            >{{ scope.row.theme_num }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="最后审核时间"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.examine_time }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 已采纳模块--end -->
      <!-- 待审核模块  begin -->
      <el-table
        v-loading="loading"
        size="small"
        v-if="type=='review'"
        :data="reviewList"
        border
        fit
        highlight-current-row
        style="width: 100%"
        class="table-ellipes"
      >
        <el-table-column
          align="center"
          label="问题场景"
        >
          <template slot-scope="scope">
            <span class="text-3">{{ scope.row.question }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="解决方案"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.answer }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="提交日期"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="最后审核时间"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.examine_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="type=='review' && reviewForm.is_anwser == 0"
          align="center"
          label="审核结果"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.status=='3'"
              @click="revision(scope.row.question_id)"
            >修订问答</el-button>
            <el-button
              type="text"
              v-if="scope.row.status=='4'"
              disabled
            >已废弃</el-button>
            <span v-if="scope.row.status=='1'">待审核</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          label="审核结果"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.status=='3'"
              @click="revisionAnswer(scope.row.answer_id)"
            >修订答案</el-button>
            <el-button
              type="text"
              v-if="scope.row.status=='4'"
              disabled
            >已废弃</el-button>
            <span v-if="scope.row.status=='1'">待审核</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        class="pagination"
        v-show="allTotal>0&&type == 'all'"
        :total="allTotal"
        :page.sync="allForm.page_num"
        :limit.sync="allForm.page_size"
        v-on:pagination="getAnswers"
      />
      <pagination
        class="pagination"
        v-show="adoptionTotal>0&&type == 'adoption'"
        :total="adoptionTotal"
        :page.sync="adoptionForm.page_num"
        :limit.sync="adoptionForm.page_size"
        v-on:pagination="getAnswers"
      />
      <pagination
        class="pagination"
        v-show="reviewTotal>0&&type == 'review'"
        :total="reviewTotal"
        :page.sync="reviewForm.page_num"
        :limit.sync="reviewForm.page_size"
        v-on:pagination="getAnswers"
      />
    </el-col>
    <div
      :span="24"
      v-if="bgShow"
      class="bg-wrap"
      @click.self="hiddenAlert"
    >
      <el-col
        :span="24"
        class="alert-wrap"
      >
        <el-table
          :data="themeData"
          stripe
          style="width: 100%"
        >
          <el-table-column
            prop="age_label_name"
            label="年龄"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="first_theme_name"
            label="一级主题"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="second_theme_name"
            label="二级主题"
          ></el-table-column>
        </el-table>
      </el-col>
    </div>

    <!-- 待审核答案 修订 -->
    <div
      :span="24"
      class="alert-wrap"
      v-if="revisedAnswer"
      @click.self="hiddenAgeAlert"
    >
      <el-col
        :span="24"
        class="alert-content-wrap"
      >
        <el-col
          :span="24"
          class="title-header"
        >
          <el-form
            ref="revise_detail"
            :rules="revise_rules"
            :inline="true"
            :model="revise_detail"
            class="form-wrap"
            label-width="140px"
          >
            <el-row>
              <el-col
                :span="24"
                class="comment-margin"
              >
                <el-col
                  :span="3"
                  align="right"
                  class="left-title"
                >问题场景：</el-col>
                <el-col
                  :span="21"
                  v-html="revise_detail.question"
                >{{revise_detail.question}}</el-col>
              </el-col>
            </el-row>

            <el-row
              style="margin-top:30px;"
              class="detail_input"
            >
              <el-col :span="24">
                <el-form-item
                  label="如何解决："
                  prop="answer"
                >
                  <el-input
                    type="textarea"
                    :rows="9"
                    resize="none"
                    v-model="revise_detail.answer"
                    class="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-form-item
                label="历史审核记录："
                v-if="revise_options.length>0"
              >
                <el-col
                  :span="24"
                  v-for="(item, index) in revise_options"
                  :key="index"
                >
                  <el-row>{{index+1 + '、' + item.opinion_content }}</el-row>
                  <el-row>{{'提交时间：' + item.examine_time}}</el-row>
                </el-col>
              </el-form-item>

              <el-form-item
                label="历史审核记录："
                v-else
              >
                <el-col :span="24">
                  <el-row>暂无审核记录</el-row>
                </el-col>
              </el-form-item>
            </el-row>

            <el-form-item style="padding-left: 140px;margin-top: 30px;">
              <el-button
                type="primary"
                @click="onSubmitAnswer('revise_detail')"
                size="small"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-col>
    </div>
  </el-col>
</template>

<script>
// import { fetchList } from '@/api/article'
import Pagination from '@/components/Pagination'
import { getAnswers, getAdoptionList, getThemeList, getThemeTree, getRevisionAnswer, updateRevise } from '@/api/counselor'
import axios from 'axios'
export default {
  components: { Pagination },
  props: {
    type: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      attrOptions: [{ label: '全部', value: '' }, { label: '是问题的问题', value: '1' }, { label: '不是问题的问题', value: '2' }, { label: '看不见的问题', value: '3' }],
      // 问答和答案属性区分
      adoptionAttrOptions: [
        {
          label: '问答',
          value: '0'
        },
        {
          label: '答案',
          value: '1'
        }
      ],
      reviewAttrOptions: [
        {
          label: '问答',
          value: '0'
        },
        {
          label: '答案',
          value: '1'
        }
      ],
      // 审核结果选项0.全部 1.审核中3.已修订4.已废弃
      reviewOptions: [{ label: '全部', value: '0' }, { label: '待审核', value: '1' }, { label: '修订', value: '3' }, { label: '已废弃', value: '4' }],
      reviewValue: '',
      // 全部formData
      allForm: {
        question: '',
        class_id: '',
        relation_id: [],
        is_anwser: '',
        state: '0',
        page_num: 1,
        page_size: 10
      },
      allList: [{ question_id: 1 }],
      allTotal: 0,
      // 已采纳form
      adoptionForm: {
        is_anwser: '0',
        state: '2',
        page_num: 1,
        page_size: 10
      },
      adoptionTotal: 0,
      adoptionList: null,
      // 待审核form
      reviewForm: {
        state: '1',
        is_anwser: '0',
        page_num: 1,
        page_size: 10,
        status: '0'
      },
      reviewTotal: 0,
      reviewList: null,
      loading: false,
      // 主题tree
      props: {
        value: 'label_id',
        label: 'title'
      },
      options: []
      ,
      // 相关主题list
      themeData: [],
      // 相关主题弹框显示
      bgShow: false,
      //修订答案弹框显示
      revisedAnswer: false,
      //修订答案form
      revise_detail: {
        answer: '',
        question: ''
      },
      revise_rules: {
        answer: [
          { required: true, message: '请输入如何解决', trigger: 'blur' }
        ]
      },
      revise_options: []
    }
  },
  created() {
    // var instance = axios.create({
    //   baseURL: 'https://xdata.zmedc.com/service/chatroomdis/item/get_item_info?item_id=471405680',
    //   timeout: 1000,
    //   headers: {'X-Custom-Header': 'foobar'}
    // });
    // instance().then(res=>{
    //   console.log(res)
    // })
    console.log(this.type)
    this.getThemeTree();
    this.getAnswers();
  },
  methods: {
    // 获取树形结构
    getThemeTree() {
      const data = {};
      getThemeTree(data).then(res => {
        if (res.code == 200) {
          this.options = res.result;
        }
      })
    },
    // 获取全部数据
    getAnswers() {
      let data;
      if (this.type === 'all') {
        // 全部
        data = this.allForm;
        this.getList(data, (res) => {
          // console.log(res)
          this.allList = res.result.list;
          this.allTotal = res.result.count;
        })
      } else if (this.type === 'adoption') {
        // 已采纳
        data = this.adoptionForm;
        this.getList(data, (res) => {
          this.adoptionList = res.result.list;
          this.adoptionTotal = res.result.count;
        })
      } else if (this.type === 'review') {
        // 待审核
        data = this.reviewForm;
        this.getList(data, (res) => {
          this.reviewList = res.result.list;
          this.reviewTotal = res.result.count;
        })
      }

    },
    // 获取列表
    getList(data, cb) {
      // this.loading = true
      // this.$emit('create') // for test
      getAnswers(data).then((res) => {
        this.loading = false;
        cb(res)
        // this.list = res.result.list;
        // this.total = res.result.sign.count;
        // this.seleteVal = res.result.list
      })
    },
    // 选择年龄段/一级主题/二级主题
    handleChange(value) {
      this.allForm.page_num = 1;
      // this.allForm.relation_id = value;
      // console.log('选择年龄段', value);
      this.getAnswers();
    },
    // 选择问题属性
    attrChange(value) {
      this.allForm.page_num = 1;
      this.allForm.class_id = value;
      // console.log('选择问题属性', value)
      this.getAnswers();
    },
    // 已采纳切换问答和答案
    answersChange(value) {
      this.adoptionForm.page_num = 1;
      this.adoptionForm.is_anwser = value;
      this.getAnswers();
    },
    // 切换审核状态
    reviewChange(value) {
      this.reviewForm.status = value;
      this.reviewForm.page_num = 1;
      const data = this.reviewForm;
      this.getAnswers();
      // this.getList(data,res=>{
      //   if(res.code==200){
      //     this.reviewList = res.result.list;
      //     this.reviewTotal = res.result.count;
      //   }
      // })
      // console.log('切换审核状态', value)
    },
    // 切换审核问答/答案类型
    reviewChangeAttrAnswers(value) {
      this.reviewForm.page_num = 1;
      // console.log(value, '切换审核问答/答案类型')
      this.reviewForm.is_anwser = value;
      this.getAnswers();
    },
    // 修订问答
    revision(question_id) {
      // console.log(question_id, '修订问答')
      this.$router.push({ path: `./news/0`, query: { question_id } })
    },
    //修订答案详情
    revisionAnswer(answer_id) {
      this.revision_answer_id = answer_id;
      this.revisedAnswer = true;
      const map = {
        answer_id,
        is_anwser: 1
      }
      getRevisionAnswer(map).then(res => {
        if (res.code == 200) {
          this.revise_detail = res.result;
          this.revise_options = res.result.opinion_list;
        }
      })
    },
    //修订答案提交
    onSubmitAnswer(formName) {
      this.$refs[formName].validate((valid) => {
        // console.log(valid)
        if (valid) {
          // this.revise_detail.resource_id = this.revision_answer_id;
          const map = {
            resource_id: this.revise_detail.answer_id,
            is_answer: 1,
            answer: this.revise_detail.answer
          }
          updateRevise(map).then(res => {
            if (res.code == 200) {
              this.$confirm('修订成功!', '提示', {
                confirmButtonText: '继续修订',
                cancelButtonText: '返回问答列表',
                type: 'success',
                center: true
              }).then(() => {
                // this.$refs[formName].resetFields();
              }).catch(() => {
                this.revisedAnswer = false;
                this.getAnswers();
              })
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    hiddenAgeAlert() {
      this.revisedAnswer = false;
    },
    // 搜索
    search() {
      // console.log('搜索')
      this.getAnswers()
    },
    // 清空
    clear() {
      this.allForm = {};
      this.getAnswers();
      // console.log('清空')
    },
    // 创建问题
    news(id) {
      this.$router.push({ path: `./news/${id}` })
    },
    // 补充案例
    // goAddCase(question_id){
    //   this.$router.push({path:'/tutor/caseLibrary/edit/0',query:{question_id}})
    // },
    // 获取数据并显示主题弹框
    showAlert(question_id) {
      const data = {
        question_id,
      }
      getThemeList(data).then(res => {
        if (res.code == 200) {
          this.themeData = res.result.list;
          this.bgShow = true;
        }
      })
    },
    // 隐藏主题弹框
    hiddenAlert() {
      this.bgShow = false;
    }
  }
}
</script>
<style lang="scss">
.title-wrap {
  margin-bottom: 10px;
}
.bg-wrap {
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 200px;
  background-color: rgba(0, 0, 0, 0.7);
  .alert-wrap {
    width: 80%;
    height: 80%;
    background-color: #fff;
    border-radius: 10px;
    padding: 50px;
    overflow: auto;
    margin: 60px 0 0 150px;
  }
}
.table-ellipes .el-table__body-wrapper .cell {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}

.alert {
  &-wrap {
    z-index: 1002;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 50px 150px 50px 200px;
  }
  &-content-wrap {
    border-radius: 5px;
    height: 100%;
    width: 100%;
    padding: 20px;
    background-color: #fff;
  }
}
.left-title {
  color: #606266;
  font-size: 14px;
  font-weight: 700;
}
.comment-margin p {
  margin: 0;
}
.comment-margin {
  padding: 25px 0;
}
.detail_input .el-form-item.is-required {
  width: 100%;
}
.detail_input .el-form-item__content {
  width: 60%;
}
</style>

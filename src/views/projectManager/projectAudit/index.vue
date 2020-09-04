<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="待审核" name="first">
          <el-col :span="24" class="title-header">
            <el-col :span="5">
              <el-input
                size="small"
                placeholder="问题搜索"
                clearable
                prefix-icon="el-icon-search"
                v-model="data.case_title"
              ></el-input>
            </el-col>
            <el-col :span="2" class="success-btn">
              <el-button
                type="success"
                @click="searchGoods"
                icon="el-icon-search"
                size="small"
              >搜索</el-button>
            </el-col>
          </el-col>
          <el-table
            :height="caseHeight"
            v-loading="caseLoading"
            :data="caseList"
            element-loading-text="Loading"
            border
            fit
            size="mini"
            highlight-current-row
            align="middle">
            <el-table-column label="案例提交人/日期" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.nickname }}</el-col>
                <el-col :span="24">{{ scope.row.create_time }}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="案例标题" align="center">
              <template slot-scope="scope">
                <el-col class="text_overflow">
                  <div @click="caseTitle(scope.row.case_id)">{{ scope.row.case_title}}</div>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column label="审核意见" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.opinion_content ? scope.row.opinion_content : '-----' }}</el-col>
                <el-col :span="24">{{ scope.row.opinion_time }}</el-col>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="230"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="adoptCase(scope.row.case_id)">通过转交教研审核</el-button>
                <el-button
                  size="small"
                  type="text"
                  @click="questionRevise(scope.row.case_id)"
                >打回修订</el-button>
                <el-button
                  size="small"
                  type="text"
                  @click="discardComment(scope.row.case_id)"
                >废弃</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            class="pagination"
            v-show="caseTotal>0"
            :total="caseTotal"
            :page.sync="data.page_num"
            :limit.sync="data.page_size"
            v-on:pagination="getCaseList"
          />
        </el-tab-pane>
        <el-tab-pane label="已完成审核" name="second">
          <el-col :span="24" class="title-header">
            <el-col :span="5">
              <el-input
                size="small"
                placeholder="问题搜索"
                clearable
                prefix-icon="el-icon-search"
                v-model="dataCase.case_title"
              ></el-input>
            </el-col>
            <el-col :span="2" class="success-btn">
              <el-button
                type="success"
                @click="searchGoods"
                icon="el-icon-search"
                size="small"
              >搜索</el-button>
            </el-col>
          </el-col>
          <el-table
            :height="caseHeightCom"
            v-loading="caseLoadingCom"
            :data="caseListCom"
            element-loading-text="Loading"
            border
            fit
            size="mini"
            highlight-current-row
            align="middle">
            <el-table-column label="案例提交人/日期" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.nickname }}</el-col>
                <el-col :span="24">{{ scope.row.create_time }}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="案例标题" align="center">
              <template slot-scope="scope">
                <el-col class="text_overflow">
                  <div @click="showCaseDetail(scope.row.case_id)">{{ scope.row.case_title}}</div>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column label="审核意见" align="center">
              <template slot-scope="scope">
                <!-- <span>{{ scope.row.opinion_content ? scope.row.opinion_content : '-----' }}</span> -->
                <el-col :span="24">{{ scope.row.opinion_content ? scope.row.opinion_content : '-----' }}</el-col>
                <el-col :span="24">{{ scope.row.opinion_time }}</el-col>
              </template>
            </el-table-column>
            <el-table-column
              label="审核结果"
              align="center"
              width="230"
              class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 1">教研审核中(项目经理采纳)</span>
                <span v-else-if="scope.row.status == 2">教研组已采纳</span>
                <span v-else-if="scope.row.status == 3">教研修订</span>
                <span v-else-if="scope.row.status == 4">教研已废弃</span>
                <span v-else-if="scope.row.status == 5">项目经理审核中</span>
                <span v-else-if="scope.row.status == 6">项目经理修订</span>
                <span v-else-if="scope.row.status == 7">项目经理已废弃</span>
                <span v-else>已废弃</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            class="pagination"
            v-show="caseTotalCom>0"
            :total="caseTotalCom"
            :page.sync="dataCase.page_num"
            :limit.sync="dataCase.page_size"
            v-on:pagination="getCaseList"
          />
        </el-tab-pane>
      </el-tabs>
    </el-col>

  
    <!-- 修订 alert -->
    <el-col :span="24" v-if="revise" class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="24">
          <div class="add-com">修订意见</div>
        </el-col>
        <el-col :span="24" class="title-header">
          <el-form
            ref="formRevise"
            size="small"
            :rules="rulesRevise"
            :model="formRevise"
            label-width="140px"
            class="form_name"
          >
            <el-form-item label="修订意见：" prop="opinion_content" class="input_element">
              <el-input
                type="textarea"
                :rows="12"
                resize="none"
                v-model="formRevise.opinion_content"
                class="textarea"
              ></el-input>
            </el-form-item>

            <el-form-item label="历史审核记录:" v-if="content.length>0">
              <el-col :span="24" v-for="(item, index) in content" :key="index">
                <el-row>{{index+1 + '、' + item.opinion_content }}</el-row>
                <el-row>{{'提交时间：' + item.create_time}}</el-row>
                <!-- <el-row>{{'审核时间：' + item.opinion_time}}</el-row> -->
              </el-col>
            </el-form-item>

            <el-form-item label="历史审核记录:" v-else>
              <el-col :span="24">
                <el-row>暂无审核记录</el-row>
              </el-col>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24" class="btn-bottom">
          <el-col :span="7" align="right">
            <el-button type="danger" @click="sureRevise('formRevise')">发布</el-button>
          </el-col>
          <el-col :span="3" align="right">
            <el-button type="info" @click="reviseHidden">取消</el-button>
          </el-col>
        </el-col>
      </el-col>
    </el-col>

    <!-- 已审核案例 alert -->
    <div :span="24" v-if="caseAlertDetail" class="alert-wrap" @click.self="hiddenCaseDetail">
      <el-col :span="24" class="alert-content-wrap case-table" style="overflow-y: auto;">
        <el-form
          ref="form"
          :inline="true"
          :model="case_detail"
          class="form-wrap"
          label-width="140px"
        >
          <el-col :span="24">
            <el-form-item label="问题标签：" prop="case_title" style="width:85%;">
              <el-col :span="24">
                <el-table
                  :height="problemHeight"
                  v-loading="problemLoading"
                  :data="problemList"
                  border
                  size="mini"
                >
                  <el-table-column label="年龄段">
                    <template slot-scope="scope">
                      <el-col class="overflow">{{ scope.row.age_label_name }}</el-col>
                    </template>
                  </el-table-column>
                  <el-table-column label="问题标签">
                    <template slot-scope="scope">{{ scope.row.first_label_name }} / {{ scope.row.second_label_name }}</template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="基本信息：" prop="case_title" style="width:85%;">
              <el-col :span="24">
                <el-table
                  :height="informationHeight"
                  v-loading="informationLoading"
                  :data="informationList"
                  border
                  size="mini"
                >
                  <el-table-column label="*用户姓名">
                    <template slot-scope="scope">
                      <el-col class="overflow">{{ scope.row.parent_nickname }}</el-col>
                    </template>
                  </el-table-column>
                  <el-table-column label="*用户手机号">
                    <template slot-scope="scope">{{scope.row.parent_mobile}}</template>
                  </el-table-column>
                  <el-table-column label="*训练营名称">
                    <template slot-scope="scope">{{scope.row.goods_name}}</template>
                  </el-table-column>
                  <el-table-column label="*群名称">
                    <template slot-scope="scope">{{scope.row.group_name}}</template>
                  </el-table-column>
                  <el-table-column label="*孩子性别" width="100">
                    <template slot-scope="scope">
                      <span v-if="scope.row.child_sex == 1">男孩</span>
                      <span v-else-if="scope.row.child_sex == 2">女孩</span>
                      <span v-else>未知</span>
                      <!-- {{scope.row.child_sex == 1 ? '男孩' : '女孩'}} -->
                    </template>
                  </el-table-column>
                  <el-table-column label="*与孩子的关系" width="100">
                    <template slot-scope="scope">
                      <span v-if="scope.row.child_relation == 1">爸爸</span>
                      <span v-else-if="scope.row.child_relation == 2">妈妈</span>
                      <span v-else>未知</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="*孩子年龄" width="100">
                    <template slot-scope="scope">{{scope.row.child_age?scope.row.child_age:'未知'}}</template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">标题：</el-col>
            <el-col :span="21">{{ case_detail.case_title }}</el-col>
          </el-col>

          <!-- <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">用户问题：</el-col>
            <el-col :span="21" v-html="case_detail.first_asked">{{ case_detail.first_asked }}</el-col>
          </el-col> -->

          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">孩子当时情况：</el-col>
            <el-col
              :span="21"
              v-html="case_detail.child_situation"
            >{{ case_detail.child_situation }}</el-col>
          </el-col>
          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">诊断：</el-col>
            <el-col :span="21" v-html="case_detail.diagnosis">{{ case_detail.diagnosis }}</el-col>
          </el-col>
          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">建议指导：</el-col>
            <el-col :span="21" v-html="case_detail.suggest">{{ case_detail.suggest }}</el-col>
          </el-col>
          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">用户行动：</el-col>
            <el-col :span="21" v-html="case_detail.user_action">{{ case_detail.user_action }}</el-col>
          </el-col>
          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">成效：</el-col>
            <el-col :span="21" v-html="case_detail.effect">{{ case_detail.effect }}</el-col>
          </el-col>
          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">见证性材料：</el-col>
            <el-col :span="21" v-html="case_detail.case_track">{{ case_detail.case_track }}</el-col>
          </el-col>
        </el-form>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getWaitExamineList, getWaitExamineDetail, SubmitWaitDetail, discardQuestion, getAdoptList, adoptSubmitQuestion, adoptSubmitAnswer } from '@/api/relations'
import { getThemeTree, getSameThemeList } from '@/api/counselor'
//项目经理
import { getCaseList, getCaseDetail, getReviseCase, getReviseCaseSubmit, managerDiscardCase, adoptCase } from '@/api/project'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      //待审核传参
      data: {
        case_title: "",
        type: 1,
        page_num: 1,
        page_size: 10
      },
      //已完成审核传参
      dataCase: {
        case_title: "",
        type: 2,
        page_num: 1,
        page_size: 10
      },
      caseAlertDetail: false,
      case_detail: {},
      options: [],
      type: 3, //区分 问答 答案 案例
      revise: false,
      activeName: 'first',
      //待审核
      caseHeight: null,
      caseLoading: false,
      caseList: [],
      caseTotal: 0,
      //已完成审核
      caseHeightCom: null,
      caseLoadingCom: false,
      caseListCom: [],
      caseTotalCom: 0,

      formRevise: {
        case_id: null,
        opinion_content: "",
      },
      content: [],//历史审核记录
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page_num: 1,
        page_size: 10,
      },
      form: {
        camp_ids: [],
        themeArr: [[]],
        question_class_id: "",
        question: "",
        answer_content: "",
        relation_id: [],
        answer_id: "",
        question_id: ""
      },
      formAnswer: {
        question: "",
        answer_content: ""
      },
      rulesAnswer: {
        question: [
          {
            required: true, message: '请输入问题场景', trigger: 'blur'
          }
        ],
        answer_content: [
          {
            required: true, message: '请输入如何解决', trigger: 'blur'
          }
        ]
      },
      rules: {
        question_class_id: [
          {
            required: true, message: '请选择问题属性', trigger: 'change,blur'
          }
        ],
        question: [
          {
            required: true, message: '请输入问题场景', trigger: 'blur'
          }
        ],
        answer_content: [
          {
            required: true, message: '请输入如何解决', trigger: 'blur'
          }
        ]
      },
      rulesRevise: {
        opinion_content: [
          {
            required: true, message: '请输入修订意见', trigger: 'blur'
          }
        ]
      },
      question_id: null,
      opinions: [], //采纳编辑 alert 历史审核记录
      historyAnswer: [],
      answer_id: null, //采纳提交 的 问答id
      problemList: [],
      problemHeight: null,
      problemLoading: false,
      informationHeight: null,
      informationList: [],
      informationLoading: false,
      themeProps: { value: 'label_id', label: 'title', children: 'children' },
      optionsTheme: [],
      type: 1
    }
  },
  created() {
    this.goodsListId = this.$route.params.id;
    //获取树形 结构   
    this.getCaseList();
  },
  methods: {
    // 待审核 已完成审核列表
    getCaseList() {
      this.caseLoading = true;
      this.caseLoadingCom = true;
      var data;
      if(this.type === 1){
        data = this.data;
      }else if(this.type === 2){
        data = this.dataCase;
      }
      // const data = this.data;
      getCaseList(data).then((res) => {
        if (res.code == 200) {
          const commentList = res.result.list;
          const commentCount = res.result.count;
          if (data.type == 1) {
            this.caseList = commentList;
            this.caseTotal = commentCount;
          } else if (data.type == 2) {
            this.caseListCom = commentList;
            this.caseTotalCom = commentCount;
          }
          this.caseLoading = false;
          this.caseLoadingCom = false;
        }
      })
    },
    // 修订
    questionRevise(case_id) {
      this.formRevise.opinion_content = '';
      this.formRevise.case_id = case_id;
      this.revise = true;
      const map = {
        case_id
      }
      getReviseCase(map).then((res) => {
        if (res.code == 200) {
          this.content = res.result.content;
        }
      })
    },
    // 修订 发布
    sureRevise(sureRevise) {
      this.$refs[sureRevise].validate((valid) => {
        if (valid) {
          this.getReviseCaseSubmit();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getReviseCaseSubmit() {
      const map = {
        ...this.formRevise
      }
      getReviseCaseSubmit(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '发布成功'
          });
          this.revise = false;
          this.getCaseList();
        }
      })
    },
    reviseHidden() {
      this.$confirm('离开不会保留已修改的信息哦', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.revise = false;
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 待审核案例 案例标题
    caseTitle(case_id) {
      this.$router.push({ path: `./add/${case_id}` })
    },
    handleClick(tab, event) {
      this.data.case_title = '';
      if(this.activeName === 'first'){
        this.type = 1;
      } else if(this.activeName === 'second'){
        this.type = 2;
      }
      this.data.page_num = 1;
      this.dataCase.page_num = 1;
      this.getCaseList();
    },
    // 搜索  案例
    searchGoods() {
      this.data.page_num = 1;
      this.getCaseList();
    },
    //待审核案例  废弃
    discardComment(case_id) {
      this.$confirm('确认要废弃该案例吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.managerDiscardCase(case_id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    managerDiscardCase(case_id) {
      const map = {
        case_id
      }
      managerDiscardCase(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          });
        }
        this.getCaseList();
      })
    },
    // 已审核案例 alert
    showCaseDetail(case_id) {
      this.caseAlertDetail = true;
      const map = {
        case_id
      }
      getCaseDetail(map).then((res) => {
        if (res.code == 200) {
          this.problemList = res.result.label_ids;
          this.informationList = res.result.info;
          this.case_detail = res.result.form_data;
        }
      })
    },
    //项目经理采纳案例
    adoptCase(case_id){
      this.$confirm('确认要通过转交教研审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.adoptCaseDetails(case_id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消转交'
        });
      });
    },
    adoptCaseDetails(case_id){
      const data = {
        case_id
      }
      adoptCase(data).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '转交成功'
          });
        }
        this.getCaseList();
      })
    },
    hiddenCaseDetail() {
      this.caseAlertDetail = false;
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
    overflow-y: auto;
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
  margin-bottom: 20px;
  text-align: center;
}
.success-btn {
  text-align: right;
}
.single.el-radio.is-bordered {
  width: 212px;
  height: 34px;
  line-height: 34px;
  padding: 0 0 0 10px;
  background-color: #fff;
  margin-left: 0;
  margin-bottom: 10px;
}
#checkbox {
  background-color: #eee;
}
#checkbox .el-checkbox.single {
  width: 212px;
  height: 34px;
  line-height: 34px;
  padding: 0 0 0 10px;
  margin-left: 0;
  margin-bottom: 10px;
}
.form_name .textarea {
  width: 460px;
}
.form_name .textarea .el-textarea__inner {
  min-height: 110px;
}
.input_element {
  margin-bottom: 32px;
}
.text_overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}
.overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.btn-bottom {
  position: fixed;
  bottom: 70px;
  left: 280px;
}
.input-prompt {
  font-size: 12px;
  color: red;
}
.question {
  padding-left: 140px;
  margin-bottom: 10px;
}
.icon_add {
  font-size: 24px;
  padding-left: 15px;
  padding-top: 3px;
}
.case-table .el-form-item__content {
  width: 85%;
}
.theme-margin .el-form-item__content {
  width: 85%;
  padding-left: 140px;
}
.left-title {
  color: #606266;
  font-size: 14px;
  font-weight: 700;
}
.comment-padding {
  padding: 25px 0;
}
.comment-padding p {
  margin: 0;
}
.icon_add {
  font-size: 24px;
  padding-left: 20px;
  padding-top: 7px;
}
.disable-p {
  background-color: #eee;
  border-radius: 5px;
  padding: 10px;
  line-height: 16px;
  word-wrap: break-word;
}
</style>


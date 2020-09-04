<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
          <el-tab-pane label="已采纳" name="first">
            <el-col :span="24" style="margin-bottom: 10px;">
              <el-col :span="2">
                <el-button size="small" type="danger" @click="addCase">添加案例</el-button>
              </el-col>
              <el-col :span="5">
                <el-input
                  size="small"
                  placeholder="请输入内容"
                  prefix-icon="el-icon-search"
                  v-model="firtstCase.case_title"
                ></el-input>
              </el-col>
              <el-col :span="2" class="success-btn">
                <el-button
                  type="success"
                  @click="searchAlready"
                  icon="el-icon-search"
                  size="small"
                >搜索</el-button>
              </el-col>
            </el-col>
            <el-table
              :height="adoptedHeight"
              v-loading="adoptedLoading"
              :data="adoptedList"
              element-loading-text="Loading"
              border
              fit
              size="mini"
              highlight-current-row
              align="middle"
            >
              <el-table-column label="案例标题" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    @click="getDetail(scope.row.case_id)"
                  >{{ scope.row.case_title }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="提交日期" align="center">
                <template slot-scope="scope">
                  <span style="padding:0 5px;">{{ scope.row.create_time }}</span>
                </template>
              </el-table-column>
              <el-table-column label="引用数量" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    @click="alreadyAlert(scope.row.case_id)"
                  >{{ scope.row.topics }}</el-button>
                </template>
              </el-table-column>
              <el-table-column class-name="status-col" label="审核时间" align="center">
                <template slot-scope="scope">{{ scope.row.examine_time }}</template>
              </el-table-column>
            </el-table>
            <pagination
              class="pagination"
              v-show="adoptedtotal>0"
              :total="adoptedtotal"
              :page.sync="firtstCase.page_num"
              :limit.sync="firtstCase.page_size"
              v-on:pagination="getList"
            />
          </el-tab-pane>

          <el-tab-pane label="待审核" name="second">
            <el-col :span="24" style="margin-bottom: 10px;">
              <el-col :span="2">
                <el-button size="small" type="danger" @click="addCase">添加案例</el-button>
              </el-col>
              <el-col :span="4">
                <el-select
                  size="small"
                  clearable
                  v-model="listCase.status"
                  placeholder="全部案例"
                  @change="getToList"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-input
                  size="small"
                  placeholder="请输入内容"
                  prefix-icon="el-icon-search"
                  v-model="listCase.case_title"
                ></el-input>
              </el-col>
              <el-col :span="2" class="success-btn">
                <el-button
                  type="success"
                  @click="searchAudited"
                  icon="el-icon-search"
                  size="small"
                >搜索</el-button>
              </el-col>
            </el-col>

            <el-table
              :height="auditedHeight"
              v-loading="auditedLoading"
              :data="auditedList"
              element-loading-text="Loading"
              border
              fit
              size="mini"
              highlight-current-row
              align="middle"
            >
              <el-table-column label="标题" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    @click="getDetail(scope.row.case_id)"
                  >{{ scope.row.case_title }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="提交日期" align="center">
                <template slot-scope="scope">{{ scope.row.create_time }}</template>
              </el-table-column>
              <el-table-column label="引用数量" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    @click="alreadyAlert(scope.row.case_id)"
                  >{{ scope.row.topics }}</el-button>
                </template>
              </el-table-column>
              <el-table-column class-name="status-col" label="最后审核时间" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.examine_time }}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="审核结果"
                align="center"
                width="230"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 1">教研审核中</span>
                  <span v-else-if="scope.row.status == 2">教研已采纳</span>
                  <el-button
                    size="small"
                    v-else-if="scope.row.status == 3"
                    type="text"
                    @click="reviseCase(scope.row.case_id)"
                  >教研修订</el-button>
                  <span v-else-if="scope.row.status == 4">教研已废弃</span>
                  <span v-else-if="scope.row.status == 5">项目经理审核中</span>
                  <el-button
                    size="small"
                    v-else-if="scope.row.status == 6"
                    type="text"
                    @click="reviseCase(scope.row.case_id)"
                  >项目经理修订</el-button>
                  <span v-else-if="scope.row.status == 7">项目经理已废弃</span>
                  <span v-else>已废弃</span>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              class="pagination"
              v-show="auditedTotal>0"
              :total="auditedTotal"
              :page.sync="listCase.page_num"
              :limit.sync="listCase.page_size"
              v-on:pagination="getToList"
            />
          </el-tab-pane>

          <el-tab-pane label="草稿箱" name="third">
            <el-col :span="24" style="margin-bottom: 10px;">
              <el-col :span="2">
                <el-button size="small" type="danger" @click="addCase">添加案例</el-button>
              </el-col>
              <el-col :span="5">
                <el-input
                  size="small"
                  placeholder="请输入内容"
                  prefix-icon="el-icon-search"
                  v-model="drafts.case_title"
                ></el-input>
              </el-col>
              <el-col :span="2" class="success-btn">
                <el-button
                  type="success"
                  @click="searchDrafts"
                  icon="el-icon-search"
                  size="small"
                >搜索</el-button>
              </el-col>
            </el-col>
            
            <el-table
              :height="draftsHeight"
              v-loading="draftsLoading"
              :data="draftsList"
              element-loading-text="Loading"
              border
              fit
              size="mini"
              highlight-current-row
              align="middle"
            >
              <el-table-column label="标题" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    @click="getDrafts(scope.row.case_id)"
                  >{{ scope.row.case_title }}</el-button>
                </template>
              </el-table-column>
              
              <el-table-column label="提交日期" align="center">
                <template slot-scope="scope">{{ scope.row.create_time }}</template>
              </el-table-column>
              
              
              <el-table-column class-name="status-col" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    @click="editDrafts(scope.row.case_id)"
                  >编辑</el-button>

                  <el-button
                    size="small"
                    type="text"
                    @click="deleteDrafts(scope.row.case_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              class="pagination"
              v-show="draftsTotal>0"
              :total="draftsTotal"
              :page.sync="drafts.page_num"
              :limit.sync="drafts.page_size"
              v-on:pagination="getDraftsList"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-col>

    <!-- 已采纳引用数量 alert -->
    <div :span="24" v-if="alreadyNumber" class="alert-wrap" @click.self="hiddenAgeAlert">
      <el-col :span="24" class="alert-content-wrap">
        <el-table
          ref="multipleTable"
          :height="ageDetailHeight"
          v-loading="ageDetailLoading"
          :data="ageDeailList"
          element-loading-text="Loading"
          tooltip-effect="dark"
          border
          fit
          size="mini"
          highlight-current-row
        >
          <el-table-column label="年龄" align="center">
            <template slot-scope="scope">{{ scope.row.age_label_name }}</template>
          </el-table-column>
          <el-table-column label="一级主题" align="center">
            <template slot-scope="scope">
              <span style="padding:0 5px;">{{ scope.row.first_theme_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="二级主题" align="center">
            <template slot-scope="scope">{{ scope.row.second_theme_name }}</template>
          </el-table-column>
        </el-table>
        <pagination
          class="pagination"
          v-show="alertTotal>0"
          :total="alertTotal"
          :page.sync="casePage.page_num"
          :limit.sync="casePage.page_size"
          v-on:pagination="caseRelationList"
        />
        <!-- <el-col :span="24" class="title-header">
            <el-button type="info" @click="hiddenAgeAlert">取消</el-button>
        </el-col>-->
      </el-col>
    </div>

    <!-- 案例详情 alert -->
    <div :span="24" v-if="articleDetail" class="alert-wrap" @click.self="hiddenArticle">
      <el-col :span="24" class="alert-content-wrap" style="overflow-y: auto;">
        <el-form
          ref="form"
          :inline="true"
          :model="article_detail"
          class="form-wrap"
          label-width="140px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="用户姓名：" class="item-gender" prop="user_name">
                <template>{{ article_user.nickname }}</template>
              </el-form-item>
             <!--  <el-form-item label="用户手机号：" class="item-gender" prop="user_name">
                <template slot-scope="scope">{{ article_detail.camp_user.mobile }}</template>
              </el-form-item> -->
              <el-form-item label="训练营名称：" class="item-gender" prop="user_name">
                <template>{{ camp_name }}</template>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="群名称：" class="item-gender" prop="user_name">
            <template>{{ group_name }}</template>
          </el-form-item>
          <el-form-item label="孩子性别：" class="item-gender" prop="user_name">
            <template >
              <span v-if="article_user.child_sex == 1">男</span>
              <span v-else-if="article_user.child_sex == 2">女</span>
              <span v-else>未知</span>
            </template>
          </el-form-item>
          <el-form-item label="与孩子关系：" class="item-gender" prop="user_name">
            <template >
              <span v-if="article_user.child_relation == 1">爸爸</span>
              <span v-else-if="article_user.child_relation == 2">妈妈</span>
              <span v-else>未知</span>
            </template>
          </el-form-item>
           <el-form-item label="孩子年龄：" class="item-gender" prop="user_name">
            <template >
              <span>{{article_user.child_age ? article_user.child_age : '未知'}}</span>
            </template>
          </el-form-item>

          <el-row>
            <el-col :span="24" style="padding-bottom:25px">
              <el-col :span="3" align="right" class="left-title">案例标题：</el-col>
              <el-col :span="21">{{ article_detail.case_title }}</el-col>
            </el-col>
          </el-row>

          <!-- <el-row>
            <el-col :span="24" class="comment-margin">
              <el-col :span="3" align="right" class="left-title">用户问题：</el-col>
              <el-col
                :span="21"
                v-html="article_detail.first_asked"
              >{{ article_detail.first_asked }}</el-col>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="24" class="comment-margin">
              <el-col :span="3" align="right" class="left-title">孩子当时情况：</el-col>
              <el-col
                :span="21"
                v-html="child_situation.child_situation"
              >{{ child_situation.child_situation }}</el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="comment-margin">
              <el-col :span="3" align="right" class="left-title">诊断：</el-col>
              <el-col :span="21" v-html="child_situation.diagnosis">{{ child_situation.diagnosis }}</el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="comment-margin">
              <el-col :span="3" align="right" class="left-title">建议指导：</el-col>
              <el-col :span="21" v-html="child_situation.suggest">{{ child_situation.suggest }}</el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="comment-margin">
              <el-col :span="3" align="right" class="left-title">用户行动：</el-col>
              <el-col
                :span="21"
                v-html="child_situation.user_action"
              >{{ child_situation.user_action }}</el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="comment-margin">
              <el-col :span="3" align="right" class="left-title">成效：</el-col>
              <el-col :span="21" v-html="child_situation.effect">{{ child_situation.effect }}</el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="comment-margin">
              <el-col :span="3" align="right" class="left-title">见证性材料：</el-col>
              <el-col :span="21" v-html="child_situation.case_track">{{ child_situation.case_track }}</el-col>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getCounselorCaseList, caseRelationList, reviseCounselorCaseList, deleteCaseDrafs, editCaseDetails } from '@/api/articleLibrary'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import { requestOver } from '@/utils/global_variable'
import { counsellorRequestId } from '@/api/login'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      //已采纳
      firtstCase: {
        page_num: 1,
        page_size: 10,
        case_title: "",
        state: 2
      },
      //待审核
      listCase: {
        page_num: 1,
        page_size: 10,
        status: 0,
        case_title: "",
        state: 3
      },
      //草稿箱
      drafts: {
        case_title: "",
        page_num: 1,
        page_size: 10,
        state: 5
      },
      state: 2,//已采纳2 待审核3
      group_name: "",
      camp_name: "",
      articleDetail: false,
      alreadyNumber: false,
      article_detail: {},
      auditedList: [], // 待审核
      auditedHeight: null,
      auditedLoading: false,
      activeName2: 'first',
      total: 0,
      auditedTotal: 0,
      adoptedtotal: 0,
      optionsValue: '0',
      options: [
        { label: "全部案例", value: 0 },
        { label: "审核中", value: 1 },
        { label: "修订", value: 3 },
        { label: "已废弃", value: 4 }
      ],
      adoptedList: [],// 已采纳
      adoptedLoading: false,
      adoptedHeight: null,
      ageDetailLoading: false,
      ageDetailHeight: null,
      ageDeailList: [],
      alertTotal: 0,
      article_user: {},
      child_situation:{},
      casePage: {
        page_num: 1,
        page_size: 10
      },
      caseId: '',
      counselorParams: {},
      draftsHeight: null,
      draftsLoading: false,
      draftsTotal: 0,
      draftsList: [],
    }
  },
  created() {
    this.getList();
    //上传案例成功后
    if(this.$route.query.status === 'second'){
      this.activeName2 = 'second';
      this.state = 3;
      this.getToList();
    }else if(this.$route.query.status === 'third'){
      this.activeName2 = 'third';
      this.state = 5;
      this.getDraftsList();
    }
    this.counselorParams = {
      state: this.state,
      activeName2: this.activeName2,
      case_title: this.firtstCase.case_title ? this.firtstCase.case_title : '',
    }
  },
  mounted() {
    // console.log(localStorage.getItem("counsellor_request_id"),'页面读取')
    requestOver('/counselor/counselorCases/index',this.counselorParams)
  },
  methods: {
    // 案例详情
    getDetail(case_id) {
      this.articleDetail = true;
      const map = {
        case_id
      }
      reviseCounselorCaseList(map).then((res) => {
        if (res.code == 200) {
          this.article_detail = res.result;
          this.article_user = res.result.campUserInfo[0];
          this.camp_name = res.result.camp.name;
          this.group_name = res.result.camp.group.name;
          this.child_situation = res.result.contents;
        }
      })
    },
    hiddenArticle() {
      this.articleDetail = false;
    },
    alreadyAlert(case_id) {
      this.alreadyNumber = true;
      this.ageDetailLoading = true;
      this.caseId = case_id;
      this.caseRelationList();
    },
    caseRelationList(){
      const data = {
        case_id: this.caseId,
        page_num: this.casePage.page_num,
        page_size: this.casePage.page_size
      }
      caseRelationList(data).then(res => {
        if(res.code == 200){
          this.ageDetailLoading = false;
          this.ageDeailList = res.result.list;
          this.alertTotal = res.result.count;
        }
      })
    },
    hiddenAgeAlert() {
      this.alreadyNumber = false;
    },
    // 已采纳列表
    getList() {
      const map = this.firtstCase;
      getCounselorCaseList(map).then(res => {
        if (res.code == 200) {
          this.adoptedList = res.result.list;
          this.adoptedtotal = res.result.count;
        } 
      })
    },
    //待审核列表
    getToList(){
      const map = this.listCase;
      getCounselorCaseList(map).then(res => {
        if (res.code == 200) {
          this.auditedList = res.result.list;
          this.auditedTotal = res.result.count;
        } 
      })
    },
    //草稿箱列表
    getDraftsList(){
      const map = this.drafts;
      getCounselorCaseList(map).then(res => {
        if (res.code == 200) {
          this.draftsList = res.result.list;
          this.draftsTotal = res.result.count;
        } 
      })
    },
    // 添加案例
    addCase() {
      this.$router.push({ path: './add/0' })
    },
    // 已采纳  搜索
    searchAlready() {
      this.firtstCase.page_num = 1;
      this.getList();
    },
    // 已采纳 待审核切换
    handleClick(tab, event) {
      this.$router.push({path: '/counselor/counselorCases/index'})
      if (this.activeName2 == 'first') {
        this.state = 2;
        this.firtstCase.page_num = 1;
        this.firtstCase.case_title = "";
        this.getList();
      } else if (this.activeName2 == 'second') {
        this.state = 3;
        this.listCase.page_num = 1;
        this.listCase.case_title = "";
        this.listCase.status = 0;
        this.getToList();
      } else if (this.activeName2 == 'third') {
        this.state = 5;
        this.drafts.page_num = 1;
        this.drafts.case_title = "";
        this.getDraftsList();
      }
    },
    // 待审核 修订
    reviseCase(case_id) {
      // this.$router.push({ path: `/tutor/caseLibrary/edit/0`,query:{revise_id} })
      this.$router.push({ path: `./add/0`, query: { case_id } })
    },
    searchAudited(){
      this.listCase.page_num = 1;
      this.getToList();
    },
    // 草稿箱案例搜索
    searchDrafts(){
      this.drafts.page_num = 1;
      this.getDraftsList();
    },
    // 草稿箱案例编辑
    editDrafts(case_id){
      this.$router.push({ path: `./add/0`, query: { edit_id: case_id } })
    },
    // 草稿箱案例详情
    getDrafts(case_id){
      this.articleDetail = true;
      const map = {
        case_id
      }
      editCaseDetails(map).then((res) => {
        if (res.code == 200) {
          this.article_detail = res.result;
          this.article_user = res.result.campUserInfo[0];
          this.camp_name = res.result.camp.name;
          this.group_name = res.result.camp.group.name;
          this.child_situation = res.result.contents;
        }
      })
    },
    deleteCaseDrafs(case_id){
      deleteCaseDrafs({case_id}).then(res => {
        if(res.code == 200){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.drafts.page_num = 1;
          this.getDraftsList();
        }
      })
    },
    // 草稿箱删除案例
    deleteDrafts(case_id){
      this.$confirm('确认要删除该案例吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCaseDrafs(case_id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
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
</style>


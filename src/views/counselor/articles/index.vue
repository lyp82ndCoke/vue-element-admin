<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
          <el-tab-pane label="已采纳" name="first">
            <el-col :span="24" style="margin-bottom: 10px;">
              <el-col :span="4">
                <el-button size="small" type="danger" @click="addCase">添加文章</el-button>
              </el-col>
              <el-col :span="5">
                <el-input
                  size="small"
                  placeholder="请输入内容"
                  prefix-icon="el-icon-search"
                  v-model="searchTextAlready"
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
              <el-table-column label="文章标题">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    v-if="scope.row.come_from == 2"
                    type="text"
                    @click="getDetail(scope.row.article_id)"
                  >{{ scope.row.article_title }}</el-button>
                  <span v-else>{{ scope.row.article_title }}</span>
                </template>
              </el-table-column>
              <el-table-column label="文章渠道">
                <template slot-scope="scope">
                  <span v-if="scope.row.come_from == 1">微信文章</span>
                  <span v-if="scope.row.come_from == 2">普通文章</span>
                </template>
              </el-table-column>
              <el-table-column label="引用数量">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    @click="alreadyAlert(scope.row.article_id)"
                  >{{ scope.row.topics }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="提交日期">
                <template slot-scope="scope">
                  <span style="padding:0 5px;">{{ scope.row.create_time }}</span>
                </template>
              </el-table-column>
              <!--  <el-table-column class-name="status-col" label="审核时间" align="center">
                <template slot-scope="scope">{{ scope.row.examine_time }}</template>
              </el-table-column>-->
            </el-table>
            <pagination
              class="pagination"
              v-show="adoptedtotal>0"
              :total="adoptedtotal"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              v-on:pagination="changeAdopted"
            />
          </el-tab-pane>

          <el-tab-pane label="待审核" name="second">
            <el-col :span="24" style="margin-bottom: 10px;">
              <el-col :span="4">
                <el-button size="small" type="danger" @click="addCase">添加文章</el-button>
              </el-col>
              <el-col :span="4">
                <el-select size="small" v-model="optionsValue" placeholder="全部文章">
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
                  v-model="searchText"
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
              <el-table-column label="标题">
                <template slot-scope="scope">{{ scope.row.article_title }}</template>
              </el-table-column>
              <el-table-column label="文章渠道">
                <template slot-scope="scope">
                  <span v-if="scope.row.come_from == 1" style="padding:0 5px;">微信文章</span>
                  <span v-else-if="scope.row.come_from == 2" style="padding:0 5px;">普通文章</span>
                </template>
              </el-table-column>
              <el-table-column label="提交日期">
                <template slot-scope="scope">{{ scope.row.create_time }}</template>
              </el-table-column>
              <el-table-column class-name="status-col" label="问题" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.question }}</span>
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
                  <span v-if="scope.row.status == 1">审核中</span>
                  <span v-else-if="scope.row.status == 2">已采纳</span>
                  <el-button
                    size="small"
                    v-else-if="scope.row.status == 3"
                    type="text"
                    @click="reviseCase(scope.row.article_id)"
                  >修订</el-button>
                  <span v-else>已废弃</span>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              class="pagination"
              v-show="auditedTotal>0"
              :total="auditedTotal"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              v-on:pagination="changeAudited"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-col>

    <!-- 已采纳引用数量 alert -->
    <el-col :span="24" v-if="alreadyNumber" class="alert-wrap">
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
          <el-table-column label="序号">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="问题标题">
            <template slot-scope="scope">
              <span style="padding:0 5px;">{{ scope.row }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          class="pagination"
          v-show="alertTotal>0"
          :total="alertTotal"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          v-on:pagination="changeAlert"
        />
        <el-col :span="24" class="title-header">
          <el-button type="info" @click="hiddenAgeAlert">取消</el-button>
        </el-col>
      </el-col>
    </el-col>

    <!-- 普通文章详情 alert -->
    <el-col :span="24" v-if="articleDetail" class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-form
          ref="form"
          :rules="rules"
          :inline="true"
          :model="article_detail"
          class="form-wrap"
          label-width="140px"
        >
          <el-form-item label="文章渠道：" class="item-gender" prop="user_name">
            <template slot-scope="scope">
              <span v-if="scope.row.come_from == 1">微信文章</span>
              <span v-if="scope.row.come_from == 2">普通文章</span>
            </template>
          </el-form-item>
          <el-form-item label="文章来源：" class="item-gender" prop="user_name">
            <template slot-scope="scope">
              <span v-if="scope.row.source == 1">尹建莉父母学堂</span>
              <span v-if="scope.row.source == 2">吃好每天三顿饭</span>
              <span v-if="scope.row.source == 3">其他</span>
            </template>
          </el-form-item>
          <el-form-item label="文章出处：" class="item-gender" prop="user_name">
            <template slot-scope="scope">
              <span v-if="scope.row.references == 1">好妈妈胜过好老师</span>
              <span v-if="scope.row.references == 2">最美的教育最简单</span>
              <span v-if="scope.row.references == 3">从小读到大</span>
              <span v-if="scope.row.references == 4">自由的孩子最自觉</span>
            </template>
          </el-form-item>
          <el-form-item label="文章标题：" class="item-gender" prop="user_name">
            <template slot-scope="scope">{{ scope.row.article_title }}</template>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item label="文章内容：" class="item-gender" prop="user_name">
                <template slot-scope="scope">{{ scope.row.article_content }}</template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="24" class="title-header" style="padding-left: 60px;">
            <el-button type="info" @click="hiddenArticle">取消</el-button>
          </el-col>
        </el-form>
      </el-col>
    </el-col>
  </div>
</template>

<script>
import { getArticleTheme, getCounselorArticle, getArticleDetail } from '@/api/articleLibrary'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      articleDetail: false,
      alreadyNumber: false,
      article_detail: {},
      auditedList: [
        {
          "article_id": "2",
          "article_title": "文章待审核",
          "come_from": "2",
          "create_time": "2019-04-29",
          "topics": "2",
          "question": "????",
          "examine_time": "2019-05-05",
          "status": "3"
        }
      ], // 待审核
      auditedHeight: null,
      auditedLoading: false,
      searchTextAlready: '',
      searchText: '',
      activeName2: 'first',
      total: 0,
      auditedTotal: null,
      adoptedtotal: null,
      optionsValue: '',
      options: [
        { label: "审核中", value: "1" },
        { label: "修订", value: "3" },
        { label: "已废弃", value: "4" }
      ],
      adoptedList: [
        {
          "article_id": "2",
          "article_title": "普通文章",
          "come_from": "2",
          "create_time": "2019-04-29",
          "topics": "2",
          "question": "????",
          "examine_time": "2019-05-05",
        },
        {
          "article_id": "2",
          "article_title": "微信文章给你",
          "come_from": "1",
          "create_time": "2019-04-29",
          "topics": "2",
          "question": "????",
          "examine_time": "2019-05-05",
        }
      ],// 已采纳
      adoptedLoading: false,
      adoptedHeight: null,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      ageDetailLoading: false,
      ageDetailHeight: null,
      ageDeailList: ["11111", '222'],
      alertTotal: 0,

    }
  },
  created() {
    // console.log(this.$route.params, '此活动的id')
    this.goodsListId = this.$route.params.id;
    // 默认调已采纳的接口
    const map = {
      state: 2,
      page: 1
    }
    this.getList(map);
  },
  methods: {
    // 已采纳文章详情
    getDetail(id) {
      this.articleDetail = true;
      const map = {
        article_id: id,
        state: 2
      }
      getArticleDetail(map).then((res) => {
        this.article_detail = res.result;
      })
    },
    hiddenArticle() {
      this.articleDetail = false;
    },
    alreadyAlert(id) {
      this.alreadyNumber = true;
      const map = {
        id: id
      }
      getArticleTheme(map).then((res) => {
        this.ageDeailList = res.result.list;
        this.alertTotal = res.result.count;
      })
    },
    hiddenAgeAlert() {
      this.alreadyNumber = false;
    },
    // 列表
    getList(map) {
      getCounselorArticle(map ? map : '').then((res) => {

      })
    },
    // 添加案例
    addCase() {
      this.$router.push({ path: '/tutor/articleLibrary/edit/0' })
    },
    // 已采纳  搜索
    searchAlready() {
      const map = {
        state: 2,
        article_title: this.searchTextAlready ? this.searchTextAlready : ''
      }
      this.getList(map);
    },
    // 已采纳分页
    changeAdopted() {

    },
    // 已采纳 待审核切换
    handleClick(tab, event) {
      // console.log(tab, event);
      const map = {
        state: '',
        page: 1
      }
      if (this.activeName2 == 'first') {
        map.state = 2;
      } else if (this.activeName2 == 'second') {
        map.state = 3;
      }
      this.getList(map);
    },
    goNews() {
      this.$router.push({ path: './news' })
    },
    // 待审核分页
    changeAudited(val) {

    },
    // 待审核 搜索
    searchAudited() {
      const map = {
        state: 3,
        article_title: this.searchText ? this.searchText : '',
        status: this.optionsValue
      }
      this.getList(map);
    },
    // 待审核 修订
    reviseCase(article_id) {
      // console.log(article_id, '----')
      this.$router.push({ path: '/tutor/articleLibrary/edit/0', query: { article_id } })
    },
    // 已采纳引用数量的分页
    changeAlert(val) {

    }

  }
}
</script>
<style lang="scss" scoped>
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
.el-form-item {
  margin-bottom: 10px;
}
</style>


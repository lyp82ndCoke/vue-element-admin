<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick"> -->
        <!--  <el-tab-pane label="相关内容" name="first">
           
        </el-tab-pane>-->
        <!--  <el-tab-pane label="数据统计" name="second">
            <el-col :span="24" style="margin:20px 0;">
              <el-col :span="1.5" class="statistics">
                <el-col>今日分享人数</el-col>
                <el-col>10</el-col>
              </el-col>
              <el-col :span="1.5" class="statistics">
                <el-col>今日分享次数</el-col>
                <el-col>100</el-col>
              </el-col>
            </el-col>
            <el-table
              :height="stateHeight"
              v-loading="stateLoading"
              :data="stateList"
              element-loading-text="Loading"
              border
              fit
              size="small"
              highlight-current-row
              align='middle'
              class="table-row">
              <el-table-column label="分享者">
                <template slot-scope="scope">{{ scope.row.title }}</template>
              </el-table-column>
              <el-table-column label="今日分享次数">
                <template slot-scope="scope">{{ scope.row.title }}</template>
              </el-table-column>
              <el-table-column label="今日访问人数" align="center">
                <template slot-scope="scope">{{ scope.row.create_time }}</template>
              </el-table-column>
              <el-table-column class-name="status-col" label="今日访问次数" align="center">
                <template slot-scope="scope">{{ scope.row.theme_num }}</template>
              </el-table-column>
              <el-table-column class-name="status-col" label="总分享次数" align="center">
                <template slot-scope="scope">gxw</template>
              </el-table-column>
              <el-table-column class-name="status-col" label="总访问人数" align="center">
                <template slot-scope="scope">gxw</template>
              </el-table-column>
              <el-table-column class-name="status-col" label="总访问次数" align="center">
                <template slot-scope="scope">gxw</template>
              </el-table-column>
              
            </el-table>
            <pagination  
              class="pagination"  
              v-show="stateTotal>0" 
              :total="stateTotal"  
              :page.sync="listQueryAge.page"  
              :limit.sync="listQueryAge.limit"  
              v-on:pagination="changeState"/>
        </el-tab-pane>-->
        <!-- </el-tabs> -->

        <el-tabs v-model="activeName2" type="card" @tab-click="handleContent" class="content">
          <el-tab-pane label="案例" name="first">
            <el-col :span="24">
              <el-button
                type="primary"
                size="small"
                class="manual_relation"
                @click="commentAlert(1)"
              >关联案例</el-button>
            </el-col>

            <el-table
              :height="caseHeight"
              v-loading="caseLoading"
              :data="caseList"
              element-loading-text="Loading"
              border
              fit
              size="small"
              highlight-current-row
              align="middle"
              class="table-row"
            >
              <el-table-column label="排序">
                <template slot-scope="{row, $index}">
                  <el-input
                    v-if="row.flag"
                    v-model="row.sort"
                    :autofocus="row.flag"
                    @keyup.enter.native="onSubmit($index, row)"
                    v-on:change="inputblur(row.relation_id, row.case_id, row.sort)"
                    v-on:blur="changeTable"
                  ></el-input>
                  <el-col v-else>{{ row.sort }}</el-col>
                  <img
                    class="editImg"
                    @click="confirmEdit($index, row)"
                    src="@/assets/404_images/edit.png"
                    alt="编辑"
                  >
                </template>
              </el-table-column>

              <el-table-column label="标题" align="center">
                <template slot-scope="scope">{{ scope.row.case_title }}</template>
              </el-table-column>
              <el-table-column label="提交日期" align="center">
                <template slot-scope="scope">{{ scope.row.create_time }}</template>
              </el-table-column>
              <el-table-column class-name="status-col" label="提交人" align="center">
                <template slot-scope="scope">{{ scope.row.create_user }}</template>
              </el-table-column>
              <el-table-column class-name="status-col" label="关联时间" align="center">
                <template slot-scope="scope">{{ scope.row.relaiton_create_time }}</template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="230"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    @click="removeComment(scope.row.relation_id, scope.row.case_id)"
                  >移除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              class="pagination"
              v-show="caseTotal>0"
              :total="caseTotal"
              :page.sync="listQueryAge.page"
              :limit.sync="listQueryAge.limit"
              v-on:pagination="changeCase"
            />
          </el-tab-pane>
          <el-tab-pane label="文章" name="second">
            <el-col :span="24">
              <el-button
                type="primary"
                size="small"
                class="manual_relation"
                @click="commentAlert(2)"
              >关联文章</el-button>
            </el-col>
            <el-table
              :height="articleHeight"
              v-loading="articleLoading"
              :data="articleList"
              element-loading-text="Loading"
              border
              fit
              size="small"
              highlight-current-row
              align="middle"
              class="table-row"
            >
              <el-table-column label="排序">
                <template slot-scope="{row, $index}">
                  <el-input
                    v-if="row.flag"
                    v-model="row.sort"
                    :autofocus="row.flag"
                    @keyup.enter.native="onSubmitArticle($index, row)"
                    v-on:change="inputblurArticle(row.relation_id, row.article_id, row.sort)"
                    v-on:blur="changeArticle"
                  ></el-input>
                  <el-col v-else>{{ row.sort }}</el-col>
                  <img
                    class="editImg"
                    @click="confirmEditArticle($index, row)"
                    src="@/assets/404_images/edit.png"
                    alt="编辑"
                  >
                </template>
              </el-table-column>

              <el-table-column label="标题" align="center">
                <template slot-scope="scope">{{ scope.row.article_title }}</template>
              </el-table-column>
              <el-table-column label="提交日期" align="center">
                <template slot-scope="scope">{{ scope.row.create_time }}</template>
              </el-table-column>
              <el-table-column class-name="status-col" label="提交人" align="center">
                <template slot-scope="scope">{{ scope.row.create_user }}</template>
              </el-table-column>
              <el-table-column class-name="status-col" label="关联时间" align="center">
                <template slot-scope="scope">{{ scope.row.relaiton_create_time }}</template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="230"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    @click="removeComment(scope.row.relation_id, scope.row.article_id)"
                  >移除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              class="pagination"
              v-show="articleTotal>0"
              :total="articleTotal"
              :page.sync="listQueryAge.page"
              :limit.sync="listQueryAge.limit"
              v-on:pagination="changeArticle"
            />
          </el-tab-pane>
          <el-tab-pane label="问答" name="third">
            <el-col :span="24">
              <el-button
                type="primary"
                size="small"
                class="manual_relation"
                @click="commentAlert(3)"
              >关联问答</el-button>
            </el-col>
            <el-table
              :height="questionHeight"
              v-loading="questionLoading"
              :data="questionList"
              element-loading-text="Loading"
              border
              fit
              size="small"
              highlight-current-row
              align="middle"
              class="table-row"
            >
              <el-table-column label="排序">
                <template slot-scope="{row, $index}">
                  <el-input
                    v-if="row.flag"
                    v-model="row.sort"
                    :autofocus="row.flag"
                    @keyup.enter.native="onSubmitQuestion($index, row)"
                    v-on:change="inputblurQuestion(row.relation_id, row.question_id, row.sort)"
                    v-on:blur="changeQuestion"
                  ></el-input>
                  <el-col v-else>{{ row.sort }}</el-col>
                  <img
                    class="editImg"
                    @click="confirmEditQuestion($index, row)"
                    src="@/assets/404_images/edit.png"
                    alt="编辑"
                  >
                </template>
              </el-table-column>

              <el-table-column label="问题场景" align="center">
                <template slot-scope="scope">{{ scope.row.question }}</template>
              </el-table-column>
              <el-table-column label="提交日期" align="center">
                <template slot-scope="scope">{{ scope.row.create_time }}</template>
              </el-table-column>
              <el-table-column class-name="status-col" label="提交人" align="center">
                <template slot-scope="scope">{{ scope.row.create_user }}</template>
              </el-table-column>
              <el-table-column class-name="status-col" label="关联时间" align="center">
                <template slot-scope="scope">{{ scope.row.relaiton_create_time }}</template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="230"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    @click="removeComment(scope.row.relation_id, scope.row.question_id)"
                  >移除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              class="pagination"
              v-show="questionTotal>0"
              :total="questionTotal"
              :page.sync="listQueryAge.page"
              :limit.sync="listQueryAge.limit"
              v-on:pagination="changeQuestion"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-col>

    <!-- 关联 案例 && 文章 alert -->
    <el-col :span="24" v-if="alertSubject" class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap" style="overflow-y: auto;">
        <el-col :span="24" class="title-header">
          <el-col :span="5" v-if="typeId != 2">
            <el-cascader
              :options="options"
              v-model="selectedOptions"
              @change="searchGoods"
              :props="props"
              clearable
              size="small"
            ></el-cascader>
          </el-col>
          <el-col :span="4">
            <el-input
              size="small"
              placeholder="问题搜索"
              prefix-icon="el-icon-search"
              clearable
              v-model="searchText"
            ></el-input>
          </el-col>
          <el-col :span="2" class="success-btn" align="right">
            <el-button type="success" @click="searchGoods" icon="el-icon-search" size="small">搜索</el-button>
          </el-col>
        </el-col>
        <el-table
          ref="multipleTable"
          size="small"
          border
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>

          <el-table-column label="问题场景" v-if="typeId == 3" align="center">
            <template slot-scope="scope">{{scope.row.title}}</template>
          </el-table-column>

          <el-table-column label="标题" v-else align="center">
            <template slot-scope="scope">{{scope.row.title}}</template>
          </el-table-column>
          <el-table-column label="类型" align="center">
            <template slot-scope="scope">
              <el-col v-if="typeId == 1">案例</el-col>
              <el-col v-if="typeId == 2">文章</el-col>
              <el-col v-if="typeId == 3">问答</el-col>
            </template>
          </el-table-column>
          <el-table-column label="上传人/日期" align="center">
            <template slot-scope="scope">
              <el-col :span="24">{{ scope.row.user_name }}</el-col>
              <el-col :span="24">{{ scope.row.create_time }}</el-col>
            </template>
          </el-table-column>
          <el-table-column label="被使用次数" align="center">
            <template slot-scope="scope">{{scope.row.use_times}}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="handleRelation(scope.row.project_id)">关联</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          class="pagination"
          v-show="alertTotal>0"
          :total="alertTotal"
          :page.sync="listQueryAge.page"
          :limit.sync="listQueryAge.limit"
          v-on:pagination="changeAlert"
        />
        <el-col :span="16" align="left" class="sure-margin">
          <el-button type="primary" @click="handleRelationMore">批量关联</el-button>
          <el-button type="info" @click="hiddenAlert">取消</el-button>
        </el-col>
      </el-col>
    </el-col>

    <!-- 关联问答 alert -->
    <!-- <el-col :span="24" v-if='alertQuestion' class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="24" class="title-header">
        <el-col :span="5">
          <el-cascader
            :options="options"
            v-model="selectedQuestion"
            @change="questionChange"
            size="small">
          </el-cascader>
        </el-col>
        <el-col :span="4">
          <el-input
            size="small"
            placeholder="问题搜索"
            prefix-icon="el-icon-search"
            v-model="searchTextQuestion"
          ></el-input>
        </el-col>
        <el-col :span="2" class="success-btn" align="right">
          <el-button type="success" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
      <el-table
        size="small"
        :data="questionData">
        <el-table-column label="问题场景">
          <template slot-scope="scope">{{scope.row.a}}</template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">{{scope.row.b}}</template>
        </el-table-column>
        <el-table-column label="上传人/日期">
          <template slot-scope="scope">{{scope.row.c}}</template>
        </el-table-column>
        <el-table-column label="被使用次数">
          <template slot-scope="scope">{{scope.row.b}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="small" type="text">关联</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination  
        class="pagination"  
        v-show="alertTotal>0" :total="alertTotal"  
        :page.sync="listQueryAge.page"  
        :limit.sync="listQueryAge.limit"
        v-on:pagination="changeAlert"/>
        <el-col :span="16" align="left" class="sure-margin">
          
          <el-button type="info" @click="hiddenQuestionAlert">取消</el-button>
        </el-col>
      </el-col>
    </el-col>-->
  </div>
</template>

<script>
import { contentRelatedList, caseRelationSort, removeCaseList, relatedHandCase, relatedHandCaseOne, relatedHandCaseMore, getDataRelation } from '@/api/relations'
import { getThemeTree } from '@/api/counselor'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Pagination, Sticky, Tinymce },
  data() {
    return {
      alertSubject: false,
      // alertQuestion: false,
      // selectedQuestion: '',
      // searchTextQuestion: '',
      activeName: 'first',
      activeName2: 'first',
      caseHeight: null,
      caseLoading: false,
      caseList: [],
      caseTotal: 0,

      articleHeight: null,
      articleLoading: false,
      articleList: [],
      articleTotal: 0,

      questionHeight: null,
      questionLoading: false,
      questionList: [],
      questionTotal: 0,

      stateHeight: null,
      stateLoading: false,
      stateList: [],
      stateTotal: 0,

      listQueryAge: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      tableData: [],
      alertTotal: 0,
      options: [],
      searchText: '',
      selectedOptions: '',
      questionData: [],
      multipleSelection: [],
      case_ids: [],
      props: {
        value: 'label_id',
        label: 'title'
      },
    }
  },
  created() {
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    this.relationId = this.$route.params.id;
    this.typeId = this.$route.query.id;
    if (this.typeId == 1) {
      //案例
      this.activeName2 = 'first';
    } else if (this.typeId == 2) {
      //文章
      this.activeName2 = 'second';
    } else if (this.typeId == 3) {
      //问答
      this.activeName2 = 'third'
    }
    this.contentRelatedList();
  },
  methods: {
    //案例/文章/问答列表
    contentRelatedList() {
      const map = {
        relation_id: this.relationId,
        type: [1, 2, 3],
        page_num: 1,
        page_size: 10,
      }
      contentRelatedList(map).then((res) => {
        if (res.code == 200) {
          this.caseList = res.result.case_list;
          this.caseTotal = res.result.caseCount;
          this.articleList = res.result.article_list;
          this.articleTotal = res.result.articleCount;
          this.questionList = res.result.question_list;
          this.questionTotal = res.result.questionCount;
        }
      })
    },
    // handleClick(tab, event) {
    //   console.log(this.activeName, '1234')
    //   if(this.activeName == 'second'){
    //     const map = {
    //       relation_id: this.relationId
    //     }
    //     //数据统计
    //     getDataRelation(map).then((res) => {
    //       if(res.code == 200){
    //       }
    //     })
    //   }
    // },
    handleContent(tab, event) {
      // console.log(this.activeName2, '案例 文章 问答')
      if (this.activeName2 == 'first') {
        this.typeId = 1;
      } else if (this.activeName2 == 'second') {
        this.typeId = 2;
      } else {
        this.typeId = 3;
      }
      const map = {
        relation_id: this.relationId,
        type: [this.typeId],
        page_num: 1,
        page_size: 10
      }
      contentRelatedList(map).then((res) => {
        if (res.code == 200) {
          if (this.typeId == 1) {
            this.caseList = res.result.case_list;
            this.caseTotal = res.result.caseCount;
          } else if (this.typeId == 2) {
            this.articleList = res.result.article_list;
            this.articleTotal = res.result.articleCount;
          } else if (this.typeId == 3) {
            this.questionList = res.result.question_list;
            this.questionTotal = res.result.questionCount;
          }
        }
      })
    },
    // 案例分页
    changeCase(val) {
      const map = {
        relation_id: this.relationId,
        type: [1],
        page_num: val.page,
        page_size: val.limit,
      }
      contentRelatedList(map).then((res) => {
        if (res.code == 200) {
          this.caseList = res.result.case_list;
          this.caseTotal = res.result.caseCount;
        }
      })
    },
    // 案例移除
    // removeCase(relation_id, case_id){
    //   this.$confirm('确认要移除该案例吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.removeCaseList(relation_id, case_id);
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消移除'
    //     });          
    //   });
    // },

    // 案例排序修改
    inputblur(relation_id, project_id, sort) {
      // console.log(sort, 'srot')
      // console.log(label_id)
      let tableD = this.caseList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      const map = {
        relation_id,
        project_id,
        sort,
        type: this.typeId
      }
      if (!map.sort) {
        this.$message({
          type: 'warning',
          message: '排序不能为空哦'
        });
        this.contentRelatedList();
        return false;
      }
      // 接口  
      caseRelationSort(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          });
        }
      })
    },
    changeTable() {
      let tableD = this.caseList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
    },
    onSubmit(index, row) {
      // console.log(this.list[index].sort, '获取的值')
      let tableD = this.caseList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      // this.$set(this.showEdit,this.list[index].sort,true)
    },
    confirmEdit(index, row) {
      // console.log(index, 'index')
      // console.log(row, 'row')
      let tableD = this.caseList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      tableD[index].flag = true;
    },
    // 文章排序修改
    inputblurArticle(relation_id, project_id, sort) {
      // console.log(sort, 'srot')
      // console.log(label_id)
      let tableD = this.articleList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      // 接口    
      const map = {
        relation_id,
        project_id,
        sort,
        type: this.typeId
      }
      if (!map.sort) {
        this.$message({
          type: 'warning',
          message: '排序不能为空哦'
        });
        this.contentRelatedList();
        return false;
      }
      caseRelationSort(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.contentRelatedList();
        }
      })
    },
    changeArticle() {
      let tableD = this.articleList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
    },
    onSubmitArticle(index, row) {
      let tableD = this.articleList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
    },
    confirmEditArticle(index, row) {
      // console.log(index, 'index')
      // console.log(row, 'row')
      let tableD = this.articleList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      tableD[index].flag = true;
    },
    // 文章 移除
    // removeArticleList(relation_id, article_id){
    //   this.$confirm('确定要移除该文章吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.removeArticle(relation_id, article_id);        
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     });          
    //   });
    // },
    // removeArticle(relation_id, article_id){
    //   const map = {
    //     relation_id, article_id
    //   }
    //   removeArticle(map).then((res) => {
    //     if(res.code == 200){
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功!'
    //       });
    //     }
    //   })
    // },
    // 文章分页
    changeArticle(val) {
      const map = {
        relation_id: this.relationId,
        type: [2],
        page_num: val.page,
        page_size: val.limit,
      }
      contentRelatedList(map).then((res) => {
        if (res.code == 200) {
          this.articleList = res.result.article_list;
          this.articleTotal = res.result.articleCount;
        }
      })
    },
    // 问答排序修改
    inputblurQuestion(relation_id, project_id, sort) {
      // console.log(sort, 'srot')
      // console.log(label_id)
      let tableD = this.questionList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      // 接口    
      const map = {
        relation_id,
        project_id,
        sort,
        type: this.typeId
      }
      if (!map.sort) {
        this.$message({
          type: 'warning',
          message: '排序不能为空哦'
        });
        this.contentRelatedList();
        return false;
      }
      caseRelationSort(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.contentRelatedList();
        }
      })
    },
    changeQuestion() {
      let tableD = this.questionList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
    },
    onSubmitQuestion(index, row) {
      // console.log(this.list[index].sort, '获取的值')
      let tableD = this.questionList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      // this.$set(this.showEdit,this.list[index].sort,true)
    },
    confirmEditQuestion(index, row) {
      // console.log(index, 'index')
      // console.log(row, 'row')
      let tableD = this.questionList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      tableD[index].flag = true;
    },
    //问答分页
    changeQuestion(val) {
      const map = {
        relation_id: this.relationId,
        type: [3],
        page_num: val.page,
        page_size: val.limit,
      }
      contentRelatedList(map).then((res) => {
        if (res.code == 200) {
          this.questionList = res.result.question_list;
          this.questionTotal = res.result.questionCount;
        }
      })
    },
    //数据统计 分页
    changeState() {

    },
    //关联案例 && 文章 && 问答列表 alert
    commentAlert(type) {
      this.typeId = type;
      this.alertSubject = true;
      this.searchText = '';
      this.selectedOptions = [];
      this.multipleSelection.length = 0;
      this.getThemeTree();
      if (type == 1) {
        //关联案例

      } else if (type == 2) {
        //关联文章

      } else if (type == 3) {
        //关联问答
      }

      this.relatedHandCase(type);
    },
    relatedHandCase(type) {
      const map = {
        relation_id: this.relationId,
        type: type
      }
      relatedHandCase(map).then((res) => {
        if (res.code == 200) {
          this.tableData = res.result.list;
          this.alertTotal = res.result.count;
        }
      })
    },
    //alert 关联
    handleRelation(project_id) {
      this.$confirm('确认要关联该问题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.relatedHandCaseOne(project_id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消关联'
        });
      });
    },
    relatedHandCaseOne(object_id) {
      const map = {
        relation_id: this.relationId,
        object_id,
        type: this.typeId
      }
      relatedHandCaseOne(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.object_id = '';
          this.alertSubject = false;
          this.contentRelatedList();
        }
      })
    },
    //alet 批量关联
    handleRelationMore() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('确认要关联选中的问题吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.relatedHandCaseMore();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关联'
          });
        });
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要关联的问题哦'
        });
      }
    },
    relatedHandCaseMore() {
      const map = {
        relation_id: this.relationId,
        type: this.typeId,
        object_ids: this.case_ids
      }
      // if(this.typeId == 1){
      //   map.case_ids = this.case_ids;
      // } else if (this.typeId == 2){
      //   map.article_ids = this.case_ids;
      // } else if (this.typeId == 3){
      //   map.question_ids = this.case_ids;
      // }

      relatedHandCaseMore(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.case_ids = '';
          this.alertSubject = false;
          this.contentRelatedList();
        }
      })
    },
    hiddenAlert() {
      this.alertSubject = false;
    },
    //关联案例 && 文章 分页
    changeAlert(value) {
      const map = {
        relation_id: this.relationId,
        type: this.typeId,
        page_num: value.page,
        page_size: value.limit,
        label_ids: this.selectedOptions,
        title: this.searchText,
      }
      relatedHandCase(map).then((res) => {
        if (res.code == 200) {
          this.tableData = res.result.list;
          this.alertTotal = res.result.count;
        }
      })
    },
    handleSelectionChange(val) {
      const checkArray = val;
      const case_ids = [];
      for (let i = 0; i < checkArray.length; i++) {
        case_ids[i] = checkArray[i].project_id;
      }
      this.multipleSelection = val;
      this.case_ids = case_ids;

    },
    searchGoods() {
      const map = {
        label_ids: this.selectedOptions,
        title: this.searchText,
        relation_id: this.relationId,
        type: this.typeId,
        page_num: 1,
        page_size: 10
      }
      relatedHandCase(map).then((res) => {
        if (res.code == 200) {
          this.tableData = res.result.list;
          this.alertTotal = res.result.count;
        }
      })
    },
    handleChange() {

    },
    // 问答 移除
    // removeAnswerList(relation_id, answer_id){
    //   this.$confirm('确定要移除该问答吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.removeAnswer(relation_id, answer_id);
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消移除'
    //     });          
    //   });
    // },
    // removeAnswer(relation_id, answer_id){
    //   const map = {
    //     relation_id, answer_id
    //   }
    //   removeAnswer(map).then((res) => {
    //     if(res.code == 200){
    //       this.$message({
    //         type: 'success',
    //         message: res.msg
    //       });
    //     }
    //   })
    // },
    // 获取树形结构
    getThemeTree() {
      const data = {};
      getThemeTree(data).then(res => {
        if (res.code == 200) {
          this.options = res.result;
        }
      })
    },
    // questionChange(){

    // },
    // 关联问答 alert
    // relationQuestion(){
    //   this.alertQuestion = true;
    // },
    // hiddenQuestionAlert(){
    //   this.alertQuestion = false;
    // }
    // 案例 文章 问答 移除
    removeComment(relation_id, project_id) {
      const type = this.typeId;
      let delTitle = '';
      if (type == 1) {
        delTitle = '案例';
      } else if (type == 2) {
        delTitle = '文章';
      } else if (type == 3) {
        delTitle = '问答';
      }
      // console.log(relation_id, project_id, '====')
      this.$confirm('确认要移除该' + delTitle + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeCaseList(relation_id, project_id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    removeCaseList(relation_id, project_id) {
      const map = {
        relation_id,
        project_id,
        type: this.typeId
      }
      removeCaseList(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.contentRelatedList();
        }
      })
    },
  }
}
</script>
<style lang="scss">
.app-container {
  position: relative;
  padding: 0 0 10px;
  .table-wrap {
    padding: 10px;
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
.content {
  margin-top: 20px;
}
.manual_relation {
  margin-bottom: 20px;
}
.editImg {
  width: 20px;
  height: 20px;
  float: right;
}
.el-table_1_column_1 .cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-table_1_column_2 .cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-table__row td:first-child .cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.statistics {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 50px;
  background-color: #eee;
  margin-right: 10px;
  padding: 10px;
}
.sure-margin {
  margin-top: 20px;
}
</style>


<!-- .el-table__row td:nth-child(2) .cell{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
 -->
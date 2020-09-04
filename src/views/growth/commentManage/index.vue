<template>
  <div class="app-container-commentManage">
    <el-col :span="24" class="table-wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="金句" name="first">
          <el-col :span="24" class="title-header">
            <el-col :span="5">
              <el-input
                size="small"
                placeholder="请输入内容标题..."
                clearable
                prefix-icon="el-icon-search"
                @clear="goldenClear"
                v-model="golden.title"
              ></el-input>
            </el-col>
            <el-col :span="2" class="success-btn">
              <el-button
                type="success"
                @click="goldenClear"
                icon="el-icon-search"
                size="small"
              >搜索</el-button>
            </el-col>
          </el-col>
          <el-table
            :height="goldenHeight"
            v-loading="goldenLoading"
            :data="goldenList"
            element-loading-text="Loading"
            border
            fit
            size="mini"
            highlight-current-row
            align="middle">
            <el-table-column label="标题" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.title }}</el-col>
                <!-- <span v-if="scope.row.title.length < 71">{{ scope.row.title }}</span>
                <el-popover v-else
                  placement="top-start"
                  width="500"
                  height="500"
                  trigger="hover"
                  :content="scope.row.title.slice(0,573) + '。。。'">
                  <span slot="reference">{{ scope.row.title.slice(0,70) + '。。。' }}</span>
                </el-popover> -->
              </template>
            </el-table-column>
            <el-table-column label="评论量" align="center" width="150">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.comment_num }}</el-col>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="230"
              class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="moreGolden(scope.row.identify_id)">查看更多</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            class="pagination"
            v-show="goldenTotal>0"
            :total="goldenTotal"
            :page.sync="golden.page_num"
            :limit.sync="golden.page_size"
            v-on:pagination="getGoldenList"/>
        </el-tab-pane>
        <el-tab-pane label="群聊" name="second">
          <el-col :span="24" class="title-header">
            <el-col :span="5">
              <el-input
                size="small"
                placeholder="请输入内容标题..."
                clearable
                prefix-icon="el-icon-search"
                @clear="groupClear"
                v-model="group.title"
              ></el-input>
            </el-col>
            <el-col :span="2" class="success-btn">
              <el-button
                type="success"
                @click="groupClear"
                icon="el-icon-search"
                size="small"
              >搜索</el-button>
            </el-col>
          </el-col>
          <el-table
            :height="groupHeight"
            v-loading="groupLoading"
            :data="groupList"
            element-loading-text="Loading"
            border
            fit
            size="mini"
            highlight-current-row
            align="middle">
            <el-table-column label="标题" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.title }}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="评论量" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.comment_num }}</el-col>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="230"
              class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="moreGroup(scope.row.identify_id)">查看更多</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            class="pagination"
            v-show="groupTotal>0"
            :total="groupTotal"
            :page.sync="group.page_num"
            :limit.sync="group.page_size"
            v-on:pagination="getGroupList"/>
        </el-tab-pane>
        <el-tab-pane label="好文" name="third">
          <el-col :span="24" class="title-header">
            <el-col :span="5">
              <el-input
                size="small"
                placeholder="请输入内容标题..."
                clearable
                prefix-icon="el-icon-search"
                @clear="articleClear"
                v-model="article.title"
              ></el-input>
            </el-col>
            <el-col :span="2" class="success-btn">
              <el-button
                type="success"
                @click="articleClear"
                icon="el-icon-search"
                size="small"
              >搜索</el-button>
            </el-col>
          </el-col>
          <el-table
            :height="articleHeight"
            v-loading="articleLoading"
            :data="articleList"
            element-loading-text="Loading"
            border
            fit
            size="mini"
            highlight-current-row
            align="middle">
            <el-table-column label="标题" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.title }}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="评论量" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.comment_num }}</el-col>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="230"
              class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="moreArticle(scope.row.identify_id)">查看更多</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            class="pagination"
            v-show="articleTotal>0"
            :total="articleTotal"
            :page.sync="article.page_num"
            :limit.sync="article.page_size"
            v-on:pagination="getArticleList"/>
        </el-tab-pane>
        <el-tab-pane label="课程" name="fourth">
          <el-col :span="24" class="title-header">
            <el-col :span="5">
              <el-input
                size="small"
                placeholder="请输入内容标题..."
                clearable
                prefix-icon="el-icon-search"
                @clear="courseClear"
                v-model="course.title"
              ></el-input>
            </el-col>
            <el-col :span="2" class="success-btn">
              <el-button
                type="success"
                @click="courseClear"
                icon="el-icon-search"
                size="small"
              >搜索</el-button>
            </el-col>
          </el-col>
          <el-table
            :height="courseHeight"
            v-loading="courseLoading"
            :data="courseList"
            element-loading-text="Loading"
            border
            fit
            size="mini"
            highlight-current-row
            align="middle">
            <el-table-column label="标题" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.title }}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="评论量" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.comment_num }}</el-col>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="230"
              class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="moreCourse2(scope.row.identify_id)">查看更多</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            class="pagination"
            v-show="courseTotal>0"
            :total="courseTotal"
            :page.sync="course.page_num"
            :limit.sync="course.page_size"
            v-on:pagination="getCourseList"/>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    
    <!-- 查看更多弹框 -->
    <div class="alert-wrap" v-if='popularize' @click.self="hiddenWrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="23" class="title-header">评论详情</el-col><el-col :span="1" class="title-header"><i class="el-icon-close" style="zoom: 1.3; cursor: pointer;" @click="hiddenWrap()"></i></el-col>
        <el-col :span="2" class="success-btn">
          <el-button
            type="success"
            @click="allShow"
            size="small" :disabled="multipleSelection.length == 0"
          >批量显示</el-button>
        </el-col>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="45">
          </el-table-column>
          <el-table-column
            prop="nickname"
            label="用户昵称"
            align="center"
            width="140">
          </el-table-column>
          <el-table-column
            prop="comment_contents"
            label="评论详情"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="点评日期"
            align="center"
            width="160">
          </el-table-column>
          <el-table-column
            prop="zan_num"
            label="点赞数"
            align="center"
            width="90">
          </el-table-column>
          <el-table-column
            prop="is_show"
            label="当前状态"
            align="center"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.is_show == '2' ? '已隐藏' : '已显示' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button size="mini" type="info" @click="handleEdit(scope.row.comment_id,scope.row.is_show)" v-if="scope.row.is_show == '1'">去隐藏</el-button>
              <el-button size="mini" type="success" @click="handleEdit(scope.row.comment_id,scope.row.is_show)" v-else>去显示</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          class="pagination"
          v-show="checkMoreTotal>0"
          :total="checkMoreTotal"
          :page.sync="checkMore.page_num"
          :limit.sync="checkMore.page_size"
          v-on:pagination="getCourseLists"/>
      </el-col>
    </div> 
    <!-- 课程查看更多弹框 -->
    <el-dialog title="评论详情" :visible.sync="popularize2" width='85%'>
      <el-table :data="tableData" border fit size="small" height="430">
        <el-table-column property="nickname" align="center" label="用户昵称" width="140"></el-table-column>
        <el-table-column property="comment_contents" align="center" label="评论详情" min-width="700">
          <template slot-scope="scope">
            <!-- 一级评论 -->
            <el-col :span="24" class='commentOne'>
              <el-col :span="5">
                <el-col :span="8">
                  <img :src="scope.row.headimgurl" width="45" height="45">
                </el-col>
                <el-col :span="15" :offset="1">
                  <el-col :span="24" class="nickname">
                    {{scope.row.nickname}}
                  </el-col>
                  <el-col :span="24" class="nickname">
                    {{ scope.row.create_time.slice(5,20) }}
                  </el-col>
                </el-col>
              </el-col>
              <el-col :span="19" class="question_content1 question_content">
                评论：
                <span v-if="scope.row.comment_contents.length<113">{{scope.row.comment_contents}}</span>
                <el-popover v-else
                  placement="top"
                  width="800"
                  height="500"
                  trigger="hover"
                  :content="scope.row.comment_contents">
                  <span slot="reference">{{ scope.row.comment_contents }}</span>
                </el-popover>
              </el-col>
            </el-col>
            <!-- 二级评论 -->
            <el-col :span="24" :offset="1" v-if='scope.row._apply&&scope.row._apply.length' class='commentTwo'>
              <el-col v-for="item in scope.row._apply" :key="item.index" class='commentTwoItem'>
                <el-col :span="6">
                  <el-col :span="8">
                    <img :src="item.headimgurl" alt="" width="45" height="45">
                  </el-col>
                  <el-col :span="15" :offset="1">
                    <el-col :span="24" class="nickname">
                      {{ item.nickname }}
                    </el-col>
                    <el-col :span="24" class="nickname">
                      {{ scope.row.create_time.slice(5,20) }}
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="18" class="question_content2 question_content">
                  回复：
                  <span v-if="item.comment_contents.length<101">{{item.comment_contents}}</span>
                  <el-popover v-else
                    placement="top"
                    width="800"
                    height="500"
                    trigger="hover"
                    :content="item.comment_contents">
                    <span slot="reference">{{ item.comment_contents }}</span>
                  </el-popover>
                </el-col>
              </el-col>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column property="create_time" align="center" label="点评日期" width="110">
          <template slot-scope="scope">
            {{ scope.row.create_time.slice(5,20) }}
          </template>
        </el-table-column>
        <el-table-column property="zan_num" align="center" label="点赞数" width="80"></el-table-column>
        <el-table-column property="is_show" align="center" label="当前状态" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.is_show == '2' ? '已隐藏' : '已显示' }}</span><br>
            <span>{{ scope.row.is_featured == '1' ? '已置顶' : '未置顶' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="125">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleEdit2(scope.row.comment_id,scope.row.is_show)" v-if="scope.row.is_show == '1'">去隐藏</el-button>
            <el-button size="small" type="text" @click="handleEdit2(scope.row.comment_id,scope.row.is_show)" v-else>去显示</el-button>
            <el-button size="small" type="text" @click="handleTop(scope.row.comment_id,scope.row.is_featured)" v-if="scope.row.is_featured == '1'">取消置顶</el-button>
            <el-button size="small" type="text" @click="handleTop(scope.row.comment_id,scope.row.is_featured)" v-else>去置顶</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        class="pagination"
        v-show="checkMoreTotal2>0"
        :total="checkMoreTotal2"
        :page.sync="checkMore2.page_num"
        :limit.sync="checkMore2.page_size"
        v-on:pagination="getCommentMoreLists"/>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
import { getCommentList,getCommentMoreList,commentBatchShow,commentShowDisplay,commentFeatured } from "@/api/homePage"
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      popularize: false,
      popularize2: false,
      activeName: 'first',
      // 金句
      golden: {
        type: 3,  //1好文 2群聊 3金句  4课程
        title: '',
        page_num: 1,
        page_size: 10,
      },
      goldenHeight: null,
      goldenLoading: true,
      goldenList: [],
      goldenTotal: 0,
      // 群聊
      group: {
        type: 2,
        title: '',
        page_num: 1,
        page_size: 10,
      },
      groupHeight: null,
      groupLoading: true,
      groupList: [],
      groupTotal: 0,
      // 好文
      article: {
        type: 1,
        title: '',
        page_num: 1,
        page_size: 10,
      },
      articleHeight: null,
      articleLoading: true,
      articleList: [],
      articleTotal: 0,
      // 课程
      course: {
        type: 4,
        title: '',
        page_num: 1,
        page_size: 10,
      },
      courseHeight: null,
      courseLoading: true,
      courseList: [],
      courseTotal: 0,
      tableData:[],
      tableData2:[],
      checkMore: {
        type: 4,
        identify_id:'',
        page_num: 1,
        page_size: 10,
      },
      checkMoreTotal: 0,
      checkMore2: {
        type: 4,
        identify_id:'',
        page_num: 1,
        page_size: 10,
      },
      checkMoreTotal2: 0,
      comment_ids:[],
      multipleSelection:[]
    }
  },
  created() {
    this.getGoldenList();
  },
  methods: {
    // 金句
    getGoldenList(){
      this.goldenLoading = true;
      getCommentList(this.golden).then(res => {
        if(res.code == 200){
          this.goldenLoading = false;
          this.goldenList = res.result.list;
          this.goldenTotal = res.result.count;
        }
      })
    },
    goldenClear(){
      this.golden.page_num = 1;
      this.getGoldenList();
    },
    // 群聊
    getGroupList(){
      this.groupLoading = true;
      getCommentList(this.group).then(res => {
        if(res.code == 200){
          this.groupLoading = false;
          this.groupList = res.result.list;
          this.groupTotal = res.result.count;
        }
      })
    },
    groupClear(){
      this.group.page_num = 1;
      this.getGroupList();
    },
    // 好文
    getArticleList(){
      this.articleLoading = true;
      getCommentList(this.article).then(res => {
        if(res.code == 200){
          this.articleLoading = false;
          this.articleList = res.result.list;
          this.articleTotal = res.result.count;
        }
      })
    },
    articleClear(){
      this.article.page_num = 1;
      this.getArticleList();
    },
    // 课程
    getCourseList(type,id){
      this.courseLoading = true;
      getCommentList(this.course).then(res => {
        if(res.code == 200){
          this.courseLoading = false;
          this.courseList = res.result.list;
          this.courseTotal = res.result.count;
        }
      })
    },
    getCourseLists(){
      this.getCommentMoreList();
    },
    courseClear(){
      this.course.page_num = 1;
      this.getCourseList();
    },
    handleClick(tab, event) {
      if(this.activeName === 'first'){
        this.golden.title = '';
        this.golden.page_num = 1;
        this.getGoldenList();
      } else if(this.activeName === 'second'){
        this.group.title = '';
        this.group.page_num = 1;
        this.getGroupList();
      } else if(this.activeName === 'third'){
        this.article.title = '';
        this.article.page_num = 1;
        this.getArticleList();
      } else if(this.activeName === 'fourth'){
        this.course.title = '';
        this.course.page_num = 1;
        this.getCourseList();
      }
    },
    getCommentMoreList(type,id){
      this.checkMore.type = type || this.checkMore.type;
      this.checkMore.identify_id = id || this.checkMore.identify_id;
      getCommentMoreList(this.checkMore).then(res => {
        if(res.code == 200){
          this.tableData = res.result.list;
          this.checkMoreTotal = res.result.count;
        }
      })
    },
    getCommentMoreList2(type,id){
      this.checkMore2.type = type || this.checkMore.type;
      this.checkMore2.identify_id = id || this.checkMore.identify_id;
      getCommentMoreList(this.checkMore2).then(res => {
        if(res.code == 200){
          this.tableData = res.result.list;
          this.checkMoreTotal2 = res.result.count;
        }
      })
    },
    handleEdit(id,is_show){
      this.$confirm('确定执行此操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commentShowDisplay({is_show: is_show,comment_id:id,}).then(res => {
          if(res.code == 200){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getCommentMoreList();
          }
        })
      })
    },
    handleEdit2(id,is_show){
      this.$confirm('确定执行此操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commentShowDisplay({is_show: is_show,comment_id:id,}).then(res => {
          if(res.code == 200){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getCommentMoreList2(this.checkMore2.type,this.checkMore2.identify_id);
          }
        })
      })
    },
    handleTop(id,status){
      this.$confirm('确定执行此操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commentFeatured({is_featured: status,comment_id:id}).then(res => {
          if(res.code == 200){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getCommentMoreList2(this.checkMore2.type,this.checkMore2.identify_id);
          }
        })
      })
    },
    allShow(){
      for (let t = 0,len=this.multipleSelection.length; t < len; t++) {
        this.comment_ids.push(this.multipleSelection[t].comment_id);
      }
      commentBatchShow({comment_ids: this.comment_ids,}).then(res => {
        if(res.code == 200){
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getCommentMoreList();
        }
      })
      this.comment_ids = [];
    },
    moreGolden(item_id) {
      this.popularize = true;
      this.checkMore.page_num = 1;
      this.getCommentMoreList('3',item_id);
    },
    moreGroup(item_id) {
      this.popularize = true;
      this.checkMore.page_num = 1;
      this.getCommentMoreList('2',item_id);
    },
    moreArticle(item_id) {
      this.popularize = true;
      this.checkMore.page_num = 1;
      this.getCommentMoreList('1',item_id);
    },
    moreCourse(item_id) {
      this.popularize = true;
      this.checkMore.page_num = 1;
      this.getCommentMoreList('4',item_id);
    },
    moreCourse2(item_id) {
      this.popularize2 = true;
      this.checkMore2.page_num = 1;
      this.getCommentMoreList2('4',item_id);
    },
    hiddenWrap(){
      this.popularize = false;
      this.popularize2 = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getCommentMoreLists(){
      this.getCommentMoreList2(this.checkMore2.type,this.checkMore2.identify_id)
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container-commentManage {
  position: relative;
  padding: 0 0 20px;
  .table-wrap {
    padding: 20px;
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
    .coverimg {
      width: 50px;
      height: 50px;
    }
  }
  .commentOne{
    width: 100%;
    background: rgb(222, 255, 222);
    img{
      border-radius: 50%;
      margin-top: 5px;
    }
  }
  .commentTwo{
    width: 95.8%;
    margin-top: 5px;
    background: rgb(252, 249, 217);
    img{
      border-radius: 50%;
      margin-top: 5px;
    }
    .commentTwoItem{
      border-bottom: 3px solid #fff;
    }
  }
  .nickname{
    width: 100%;
    // max-height: 40px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;  
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .question_content{
    font-size: 14px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;  
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .question_content1{
    padding-left: 10px;
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
    width: 95%;
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
.wrap-title{
  color: #606266;    
  font-size: 14px;
  font-weight: 700;
}
</style>
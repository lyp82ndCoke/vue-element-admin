<template>
  <div class="app_container-article">
    <el-col :span="24" class="title-header">
      <el-col :span="24">
        <el-col :span="2">
          <el-button size="small" type="primary"  @click="goArticle()">创建金句</el-button>
        </el-col>
        <el-col :span="2" class="success-btn">
          <el-button @click="titleShow=!titleShow" type="info" size="small">{{titleShow?'收起':'展开'}}筛选</el-button>
        </el-col>
        <el-col :span="5">
          <el-input size="small" clearable placeholder="请输入金句内容" prefix-icon="el-icon-search" v-model="listQuery.select_content" @clear="clearTitle" @keyup.enter.native="clearTitle()">
          </el-input>
        </el-col>
        <el-col :span="7.5" align="right">
          <el-date-picker
            @change="changeTime"
            size="small"
            align="right"
            v-model="valueTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="2" class="success-btn" align="right">
          <el-button type="success" @click="clearTitle()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
      <el-col :span="24" style="margin-top:20px;">
        <el-collapse-transition>
          <div v-show="titleShow">
            <div class="transition-box">
              <el-row>
                <el-col class="select-title">类别：</el-col>
                <el-col :span="20">
                  <el-checkbox-group v-model="listQuery.category" @change="clearTitle()">
                    <el-checkbox v-for="(cateItm,cateIndex) in categoryList" :label="cateItm.tag_id" :key="cateIndex">{{cateItm.tag_name}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
              <el-row style="margin: 10px 0;">
                <el-col  class="select-title">标签选择：</el-col>
                <el-col :span="20">
                  <el-checkbox-group v-model="listQuery.label" @change="clearTitle()">
                    <el-checkbox v-for="(labelItem, labelIndex) in labelList" :label="labelItem.tag_id" :key="labelIndex">{{labelItem.tag_name}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
              <el-row>
                <el-col  class="select-title">适用年龄：</el-col>
                <el-col :span="20">
                  <el-checkbox-group v-model="listQuery.age" @change="clearTitle()">
                    <el-checkbox  v-for="(ageItem,ageIndex) in ageList" :label="ageItem.tag_id" :key="ageIndex">{{ageItem.tag_name}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
              <el-row>
                <el-button type="success" icon="el-icon-search" size="small" @click="clearTitle()">筛选</el-button>
              </el-row>
            </div>
          </div>
        </el-collapse-transition>
      </el-col>
    </el-col>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
        <el-table-column label="金句内容" prop="intro" align="center"></el-table-column>
        <el-table-column label="排序值" prop="sort_num" align="center" width="80"></el-table-column>
        <el-table-column label="虚拟阅读量" prop="view_num" align="center" width="80"></el-table-column>
        <el-table-column label="真实阅读量" prop="view_count" align="center" width="80"></el-table-column>
        <el-table-column label="上传者" prop="create_user_name" align="center" width="80"></el-table-column>
        <el-table-column label="上传日期" prop="create_time" align="center" width="135"></el-table-column>
        <el-table-column label="指定更新日" prop="saying_date" align="center" width="90"></el-table-column>
        <el-table-column label="首页展示" prop="title" align="center" width="80">
          <template slot-scope="scope">
            <el-button type="info" size="mini" v-if="scope.row.saying_index_show == 1" @click="indexShow(scope.row.article_id, scope.row.saying_index_show)">隐藏</el-button>
            <el-button type="warning" size="mini" v-else @click="indexShow(scope.row.article_id, scope.row.saying_index_show)">显示</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='130'>
          <template slot-scope="scope">
            <el-button size="mini" @click="goArticle(scope.row.article_id,scope.row.article_type)" type="text">编辑</el-button>
            <el-button size="mini" @click="changeStatus(scope.row.article_id,scope.row.is_show)" type="text">{{scope.row.is_show == '1' ? '隐藏' : '显示'}}</el-button>
            <el-button size="mini" @click="deleteArticle(scope.row.article_id)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        ref="pagination"
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="getGoldsayList"/>
    </el-col>
  </div>
</template>

<script>
import { getGoldsayList, getTagList, articleShow, articleDelete, goldsayIndexShow } from "@/api/homePage";
import Pagination from '@/components/Pagination';

export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      valueTime: '',
      activeNames: [],
      titleShow: false,
      checkList: [],
      listLoading: true,
      total: 0,
      list:[],
      listQuery: {
        article_type: '3', 
        page_num: 1,
        page_size: 10,
        select_content:'',
        start_time: '',
        end_time: '',
        category: [],
        label: [],
        age: []
      },
      listQueryPage: {
        article_type: '3', 
        // page_num: Number(sessionStorage.getItem('goldenPage')) || this.listQuery.page_num,
        page_size: 10,
        select_content:'',
        start_time: '',
        end_time: '',
        category: [],
        label: [],
        age: []
      },
      categoryList: [],
      labelList: [],
      ageList: [],
      currentPage: 1
    }
  },
  created(){
    this.listQuery.page_num = Number(sessionStorage.getItem('goldenPage')) || this.listQuery.page_num;
    this.getCategory();
    this.getLabel();
    this.getAge();
    this.getGoldsayList();
  },
  methods:{
    getGoldsayList(){
      setTimeout(() => {
        sessionStorage.removeItem('goldenPage')
      }, 300);
      this.listLoading = true;
      getGoldsayList(this.listQuery).then(res => {
        if(res.code == 200){
          this.listLoading = false;
          this.list = res.result.list;
          this.total = res.result.count;
        }
      })
    },
    changeTime(val){
      if(val){
        this.listQuery.start_time = val[0];
        this.listQuery.end_time = val[1];
      }else{
        this.listQuery.start_time = '';
        this.listQuery.end_time = '';
      }
      this.listQuery.page_num = 1;
      this.getGoldsayList();
    },
    // 类别
    getCategory(){
      getTagList({tag_type: 1}).then(res => {
        if(res.code == 200){
          this.categoryList = res.result;
        }
      })
    },
    // 标签
    getLabel(){
      getTagList({tag_type: 2}).then(res => {
        if(res.code == 200){
          this.labelList = res.result;
        }
      })
    },
    // 年龄
    getAge(){
      getTagList({tag_type: 4}).then(res => {
        if(res.code == 200){
          this.ageList = res.result;
        }
      })
    },
    goArticle(article_id,article_type){
      let id = article_id ? article_id : 0;
      this.$router.push({ path:`./news/${id}`, query: { article_type } });
      sessionStorage.setItem('goldenPage',this.listQuery.page_num);
    },
    changeStatus(article_id, is_show){
      const show = is_show == 1 ? '隐藏' : '显示';
      this.$confirm(`确认要${show}该金句吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.articleShow(article_id, is_show);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${show}`
        });
      });
    },
    articleShow(article_id, is_show){
      const status = {
        article_id,
        is_show,
        
      }
      articleShow(status).then(res => {
        if(res.code == 200){
          this.$message.success('操作成功');
          this.getGoldsayList();
        }
      })
    },
    deleteArticle(article_id){
      this.$confirm('确认要删除该金句吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.articleDelete(article_id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    articleDelete(article_id){
      articleDelete({article_id}).then(res => {
        if(res.code == 200){
          this.$message.success('删除成功');
          this.getGoldsayList();
        }
      })
    },
    clearTitle(){
      this.listQuery.page_num = 1;
      this.getGoldsayList();
    },
    indexShow(article_id, saying_index_show){
      const show = saying_index_show == '1' ? '隐藏' : '显示';
      this.$confirm(`确认要在首页${show}该金句吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.goldsayIndexShow(article_id, saying_index_show);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${show}`
        });
      });
    },
    goldsayIndexShow(article_id, saying_index_show){
      const data = {
        article_id,
        saying_index_show,
        
      }
      goldsayIndexShow(data).then(res => {
        if(res.code == 200){
          this.$message.success('操作成功');
          this.getGoldsayList();
        }
      })
    }
  }
}
</script>

<style lang="scss">
.app_container-article{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
    .select-title{
      width: 70px;
      text-align: right;
      font-size: 14px;
      color: #606266;
      font-weight: 700;
    }
  }
  .el-checkbox-group{
    .el-checkbox{
      margin-left: 15px;
      margin-bottom: 10px;
    }
  }
  img{
    max-width: 100px;
    height: 100px;
    text-align: center;
  }
}
</style>
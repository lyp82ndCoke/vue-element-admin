<template>
  <div class="app_container-article">
    <el-col :span="24" class="title-header">
      <el-col :span="24">
        <el-col :span="2">
          <el-button size="small" type="primary"  @click="goArticle()">创建文章</el-button>
        </el-col>
        <el-col :span="2" class="success-btn" align="center">
          <el-button @click="titleShow=!titleShow" type="info" size="small">{{titleShow?'收起':'展开'}}筛选</el-button>
        </el-col>
        <el-col :span="4" align="center">
          <el-select v-model="listQuery.article_type" clearable placeholder="请选择文章类型" size="small" @change="clearTitle">
            <el-option
              v-for="item in [{label:'全部',value: ''},{label:'好文',value: '1'},{label:'群聊',value: '2'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5" align="center">
          <el-input size="small" clearable placeholder="请输入文章标题" prefix-icon="el-icon-search" v-model="listQuery.title" @clear="clearTitle">
          </el-input>
        </el-col>
        <el-col :span="7" align="center">
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
                  <el-checkbox-group v-model="listQuery.category" @change="getTraningArticle()">
                    <el-checkbox v-for="(cateItm,cateIndex) in categoryList" :label="cateItm.tag_id" :key="cateIndex">{{cateItm.tag_name}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
              <el-row style="margin: 10px 0;">
                <el-col  class="select-title">标签选择：</el-col>
                <el-col :span="20">
                  <el-checkbox-group v-model="listQuery.label" @change="getTraningArticle()">
                    <el-checkbox v-for="(labelItem, labelIndex) in labelList" :label="labelItem.tag_id" :key="labelIndex">{{labelItem.tag_name}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
              <el-row>
                <el-col  class="select-title">适用年龄：</el-col>
                <el-col :span="20">
                  <el-checkbox-group v-model="listQuery.age" @change="getTraningArticle()">
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
        <el-table-column label="文章标题" prop="title" align="center"></el-table-column>
        <el-table-column label="类别" align="center" width="85">
          <template slot-scope="scope">
            <span v-if="scope.row.article_type==1">好文</span>
            <span v-else-if="scope.row.article_type==2">群聊</span>
            <span v-else-if="scope.row.article_type==3">金句</span>
          </template>
        </el-table-column>
        <el-table-column label="排序值" prop="sort_num" align="center" width="80"></el-table-column>
        <el-table-column label="虚拟阅读量" prop="view_num" align="center" width="90"></el-table-column>
        <el-table-column label="真实阅读量" prop="view_count" align="center" width="90"></el-table-column>
        <el-table-column label="上传者" prop="create_user_name" align="center" width="95"></el-table-column>
        <el-table-column label="上传日期" prop="create_time" align="center" width='135'></el-table-column>
        <el-table-column label="状态" align="center" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.is_show == 1 ? '已显示' : '已隐藏'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='130'>
          <template slot-scope="scope">
            <el-button size="mini" @click="goArticle(scope.row.article_id,scope.row.target_type)" type="text">编辑</el-button>
            <el-button size="mini" @click="changeStatus(scope.row.article_id,scope.row.is_show)" type="text">{{scope.row.is_show == '1' ? '隐藏' : '显示'}}</el-button>
            <el-button size="mini" @click="deleteArticle(scope.row.article_id)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="getTraningArticle"/>
    </el-col>
  </div>
</template>

<script>
import { getTraningArticle, getTagList, articleShow, articleDelete } from "@/api/homePage";
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
        page_num: 1,
        page_size: 10,
        title:'',
        article_type: '', 
        start_time: '',
        end_time: '',
        category: [],
        label: [],
        age: []
      },
      categoryList: [],
      labelList: [],
      ageList: []
    }
  },
  created(){
    this.listQuery.page_num = Number(sessionStorage.getItem('articlePage')) || this.listQuery.page_num;
    this.getTraningArticle();
    this.getCategory();
    this.getLabel();
    this.getAge();
  },
  methods:{
    getTraningArticle(){
      setTimeout(() => {
        sessionStorage.removeItem('articlePage')
      }, 300);
      this.listLoading = true;
      getTraningArticle(this.listQuery).then(res => {
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
      this.getTraningArticle();
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
    goArticle(article_id,target_type){
      let id = article_id ? article_id : 0;
      this.$router.push({ path:`./news/${id}`, query: { target_type } })
      sessionStorage.setItem('articlePage',this.listQuery.page_num);
    },
    changeStatus(article_id, is_show){
      const show = is_show == 1 ? '隐藏' : '显示';
      this.$confirm(`确认要${show}该文章吗?`, '提示', {
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
        is_show
      }
      articleShow(status).then(res => {
        if(res.code == 200){
          this.$message.success('操作成功');
          this.getTraningArticle();
        }
      })
    },
    deleteArticle(article_id){
      this.$confirm('确认要删除该文章吗?', '提示', {
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
          this.getTraningArticle();
        }
      })
    },
    clearTitle(){
      this.listQuery.page_num = 1;
      this.getTraningArticle();
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
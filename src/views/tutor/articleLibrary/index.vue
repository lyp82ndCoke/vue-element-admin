<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">文章列表</el-col>
    </sticky>
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-col :span="3">
          <el-button size="small" type="primary" @click="addCase">创建文章</el-button>
        </el-col>
        <!-- <el-col :span="4">
          <el-select size="small" v-model="optionsValue" placeholder="全部文章">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col> -->
        <el-col :span="5">
          <el-cascader
            size="small"
            placeholder="请选择分类"
            clearable
            expand-trigger="hover"
            filterable
            :options="optionsTree"
            :props="props"
            v-model="relation_id"
            @change="searchArticle"
          ></el-cascader>
        </el-col>

        <el-col :span="5">
          <el-input
            size="small"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            clearable
            v-model="searchText"
          ></el-input>
        </el-col>
        <el-col :span="3" class="success-btn">
          <el-button type="success" @click="searchArticle" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>

      <el-table
        :height="tabHeight"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size="mini"
        highlight-current-row
        align='middle'>
        <el-table-column label="序号" align="center">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">{{ scope.row.article_title }}</template>
        </el-table-column>
        <el-table-column label="文章渠道" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.come_from == 1">微信文章</span>
            <span v-else-if="scope.row.come_from == 2">普通文章</span>
          </template>
        </el-table-column>
        <el-table-column label="提交日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="提交人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.real_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="引用数量" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="text" v-if="scope.row.quoted_quantity > 0" @click="relationAlert(scope.row.article_id)">{{ scope.row.quoted_quantity }}</el-button>
             <el-button size="small" type="text" v-else style="color:#ddd;">{{ scope.row.quoted_quantity }}</el-button>
          </template>
        </el-table-column>
       <!--  <el-table-column class-name="status-col" label="状态" align="center">
         <template slot-scope="scope">
          <span v-if="scope.row.status == 1" style='color:red;'>审核中</span>
          <span v-else-if="scope.row.status == 2" style="color:#ddd;">已采纳</span>
          <span v-else-if="scope.row.status == 3" style="color:#ddd;">已修订</span>
          <span v-else>已废弃</span>
          </template>
        </el-table-column> -->
        
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="editArticle(scope.row.article_id)">编辑</el-button>
            <el-button size="small" type="text" @click="delArticle(scope.row.article_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination  
        class="pagination"  
        v-show="total>0" 
        :total="total"  
        :page.sync="listQuery.page"  
        :limit.sync="listQuery.limit"  
        v-on:pagination="changePaging" 
      />
    </el-col>


    <!-- 引用数量 alert -->
    <div :span="24" v-if='alreadyNumber' class="alert-wrap" @click.self="hiddenAgeAlert">
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
          highlight-current-row>
          <el-table-column label="年龄" align="center">
            <template slot-scope="scope">{{ scope.row.age_label_name }}</template>
          </el-table-column>
          <el-table-column label="一级主题" align="center">
            <template slot-scope="scope">{{ scope.row.first_theme_name }}</template>
          </el-table-column>
          <el-table-column label="二级主题" align="center">
            <template slot-scope="scope">
              <span style="padding:0 5px;">{{ scope.row.second_theme_name }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination  
          class="pagination"  
          v-show="alertTotal>0" :total="alertTotal"  
          :page.sync="listQuery.page"  
          :limit.sync="listQuery.limit"  
          v-on:pagination="changeAlert"/>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getArticleList, delArticleList, getRelationList } from '@/api/articleLibrary'
import { getThemeTree } from '@/api/counselor'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Pagination, Sticky },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      ageDetailLoading: false,
      ageDetailHeight: null,
      ageDeailList: [],
      alreadyNumber: false,
      listLoading: false,
      tabHeight: null,
      optionsValue: null,
      searchText: '', 
      options: [{ label: "微信文章", value: "1" }, { label: "普通文章", value: "2" }],
      list: [], // 此活动关联的商品数据
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      goodsListId:null,
      form: {
        type:[] //关联商品弹框选中的数据
      },
      // 主题tree
      props: {
        value: 'label_id',
        label: 'title'
      },
      alertTotal: 0,
      seleteVal: [],
      multipleSelection: [],
      article_id: null,
      optionsTree: [],
      relation_id: []
    }
  },
  created() {
    const map = {
      page_num: 1,
      page_size: 10
    }
    this.allArticleList(map);
    this.getThemeTree();
  },
  methods: {
    // 获取树形结构
    getThemeTree() {
      const data = {};
      getThemeTree(data).then(res => {
        if (res.code == 200) {
          this.optionsTree = res.result;
        }
      })
    },
    //引用数量 alert
    relationAlert(article_id){
      this.alreadyNumber = true;
      this.ageDetailLoading = true;
      this.article_id = article_id;
      const map = {
        article_id,
        page_num:1,
        page_size: 10
      }
      getRelationList(map).then((res) => {
        if(res.code == 200){
          this.ageDetailLoading = false;
          this.ageDeailList = res.result.list;
          this.alertTotal = res.result.count;
        }
      })
    },
    hiddenAgeAlert(){
      this.alreadyNumber = false;
    },
    // 文章列表
    allArticleList(map){
      getArticleList(map?map:{}).then((res) => {
        if(res.code == 200){
          this.list = res.result.list;
          this.total = res.result.count;
        }
      })
    },
    // 文章列表 删除
    delArticle(id){
      this.$confirm('确认要删除该文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const map = {
          article_id: id
        }
        delArticleList(map).then((res) => {
          if(res.code == 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.allArticleList();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 文章列表 编辑
    editArticle(id){
      this.$router.push({ path: `./edit/${id}` })
    },
    // 文章列表 搜索
    searchArticle(){
      const map = {
        article_title: this.searchText,
        relation_id: this.relation_id,
        page_size: 10,
        page_num: 1
      }
      this.allArticleList(map);
    },
    changePaging(val){
      const map = {
        page_size: val.limit,
        page_num: val.page,
        article_title: this.searchText,
        relation_id: this.relation_id
      }
      this.allArticleList(map);
    },
    changeAlert(val){
      const map = {
        page_size: val.limit,
        page_num: val.page,
        article_id: this.article_id
      }
      getRelationList(map).then((res) => {
        if(res.code == 200){
          this.ageDeailList = res.result.list;
          this.alertTotal = res.result.count;
        }
      })
    },
    // 添加案例
    addCase(){
      this.$router.push({ path: '/tutor/articleLibrary/edit/0'})
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
    .coverimg{
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
.alert{
  &-wrap{
    z-index: 1002;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.7);
    padding: 50px 150px 50px 200px;
  }
  &-content-wrap{
    border-radius: 5px;
    height: 100%;
    width: 100%;
    padding: 20px;
    background-color: #fff;
  }
}
.close-alert{
  text-align: right;
  font-size: 30px;
  color: #ccc;
}
.search-btn{
  margin-left: 20px;
}
.add-com{
  font-size: 20px;
}
.success-btn{
  text-align: right;
}
</style>


<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">案例列表</el-col>
    </sticky>
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
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
            @change="searchCase"
          ></el-cascader>
        </el-col>

        <el-col :span="4">
          <el-input
            size="small"
            placeholder="请输入内容"
            clearable
            prefix-icon="el-icon-search"
            v-model="searchText"
          ></el-input>
        </el-col>
        <el-col :span="2" class="success-btn">
          <el-button type="success" @click="searchCase" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>

      <el-table
        :height="height"
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
          <template slot-scope="scope">{{ scope.row.case_title }}</template>
        </el-table-column>
        <!-- <el-table-column label="文章渠道">
          <template slot-scope="scope">
            <span v-if="scope.row.come_from == 1">微信文章</span>
            <span v-else-if="scope.row.come_from == 2">普通文章</span>
          </template>
        </el-table-column> -->
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
            <el-button size="small" type="text" v-if="scope.row.relation_num > 0" @click="quotedQuantity(scope.row.case_id)">{{ scope.row.relation_num }}</el-button>
            <el-button size="small" type="text" v-else style="color:#ddd;">{{ scope.row.relation_num }}</el-button>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" align="center">
         <template slot-scope="scope">
          <span v-if="scope.row.case_status == 1" style='color:red;'>审核中</span>
          <span v-else-if="scope.row.case_status == 2" >已采纳</span>
          <span v-else-if="scope.row.case_status == 3" >已修订</span>
          <span v-else-if="scope.row.case_status == 4" style="color:#ddd;">已废弃</span>
          </template>
        </el-table-column>
        
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="editArticle(scope.row.case_id)">编辑</el-button>
            <el-button size="small" type="text" @click="delArticle(scope.row.case_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination  
        class="pagination"  
        v-show="total>0" 
        :total="total"  
        :page.sync="listQuery.page"  
        :limit.sync="listQuery.limit"  
        v-on:pagination="changePaging"/>
    </el-col>


     <!-- 已采纳引用数量 alert -->
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
            <template slot-scope="scope">
              <span style="padding:0 5px;">{{ scope.row.first_theme_name }}</span>
            </template>
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
import { getCaseList, delCaseList, caseRelationList } from '@/api/articleLibrary'
import { getThemeTree } from '@/api/counselor'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      alreadyNumber: false,
      height: null,
      searchText: '', 
      list: [],
      listLoading: false,
      total: 0,
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
      ageDeailList:[],
      relation_id: [],
      alertTotal: 0,
      qutoreCaseId: null,
      // 主题tree
      props: {
        value: 'label_id',
        label: 'title'
      },
      optionsTree: []
    }
  },
  created() {
    this.caseList();
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
    // 案例列表
    caseList(map){
      getCaseList(map?map:'').then((res) => {
        if(res.code == 200){
          this.list = res.result.list;
          this.total = res.result.count;
        }
      })
    },
    // 案例分页
    changePaging(val){
      const map = {
        page_num: val.page,
        page_size: val.limit,
        case_title: this.searchText,
        relation_id: this.relation_id
      }
      this.caseList(map);
    },
    // 引用主题 分页
    changeAlert(val){
      const map = {
        page_num: val.page,
        page_size: val.limit,
        case_id: this.qutoreCaseId
      }
      caseRelationList(map).then((res) => {
        if(res.code == 200){
          this.ageDeailList = res.result.list;
          this.alertTotal = res.result.count;
        }
      })
    },
    // 案例 引用数量弹框
    quotedQuantity(case_id){
      this.alreadyNumber = true;
      this.qutoreCaseId = case_id;
      const map = {
        case_id,
        page_num: 1,
        page_size: 10
      }
      caseRelationList(map).then((res) => {
        if(res.code == 200){
          this.ageDeailList = res.result.list;
          this.alertTotal = res.result.count;
        }
      })
    },
    // 搜索案例
    searchCase(){
      const map = {
        case_title: this.searchText,
        relation_id: this.relation_id 
      }
      this.caseList(map);
    },
    // 移除该活动关联的该商品
    removeCom(id){
      this.$confirm('确认要移除该活动关联的商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消移除'
        });          
      });
    },
    goNews() {
      this.$router.push({ path: './news' })
    },
     // 案例列表 删除
    delArticle(id){
      this.$confirm('确认要删除该案例吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const map = {
          case_id: id
        }
        delCaseList(map).then((res) => {
          if(res.code == 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.caseList();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 案例列表 编辑
    editArticle(id){
      this.$router.push({ path: `./edit/${id}` })
    },
    hiddenAgeAlert(){
      this.alreadyNumber = false;
    },
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


<template>
  <div class="app_container">
    <el-row class="title-header" type="flex" justify="space-between">
      <el-col :span="7">
        <el-col :span="16">
          <el-input size="small" placeholder="请输入赛区名称" prefix-icon="el-icon-search" v-model="listQuery.search_name" 
          clearable></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="success" @click="searchList()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="addNew()" size="small">创建赛区</el-button>
      </el-col>
    </el-row>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
        <el-table-column label="赛区名称" prop="camp_times_name" align="center">
        </el-table-column>
        <el-table-column label="赛区时间" align="center" width='280'>
          <template slot-scope="scope">
            {{ scope.row.start_time }} 至 {{ scope.row.end_time }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="" align="center" width='240'>
          <template slot-scope="scope">
            <span>{{ scope.row.is_show == '1' ? '已显示' : '已隐藏' }}</span>
            <span>{{ scope.row.is_top  == '1' ? '已置顶' : '未置顶' }}</span>
          </template> 
        </el-table-column>
        <el-table-column label="操作" align="center" width='240'>
          <template slot-scope="scope">
            <el-button size="mini" @click="goEdit(scope.row.match_id)" type="text">编辑</el-button>
            <el-button size="mini" @click="goHide(scope.row.match_id,scope.row.is_show)" type="text">
              <span>{{ scope.row.is_show == '1' ? '去隐藏' : '去显示' }}</span>
            </el-button>
            <el-button size="mini" @click="goRank(scope.row.camp_times_id, scope.row.identity_id)" 
            type="text">排行榜</el-button>
            <el-button size="mini" @click="goTop(scope.row.match_id,scope.row.is_top)" type="text" :disabled="scope.row.is_show == '2'">
              <span>{{ scope.row.is_top == '1' ? '取消置顶' : '去置顶' }}</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="changePaging"
      />
    </el-col>
  </div>
</template>

<script>
import { getMatchList,matchSetShow,matchSetTop } from "@/api/growthCamp";
import Pagination from '@/components/Pagination';

export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      listLoading: true,
      lists:[],
      listQuery: {
        page_num: 1,
        page_size: 12,
        search_name: ''
      },
      total: 0,
      fileList:[]
    }
  },
  created(){
    this.getTableList();
  },
  methods:{
    getTableList(){
      getMatchList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.match_list;
          this.total = Number(res.result.count);
        }
      });
    },
    addNew(){
      this.$router.push({ path: `./newComp/${'newMatch'}` });
    },
    goEdit(data){
      this.$router.push({ path: `./newComp/${data}` });
    },
    goTop(id,type){
      this.$confirm('确定要执行此操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        matchSetTop({ match_id:id,is_top: type == '2'? '1': '2' }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getTableList();
          }
        });
      })
    },
    goHide(id,type){
      this.$confirm('确定要执行此操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        matchSetShow({ match_id:id,is_show: type == '2'? '1': '2' }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getTableList();
          }
        });
      })
    },
    goRank(camp_times_id, times_task_id){
      // this.$router.push({ path: `./rankingList/${data}` });
      this.$router.push({path: './rankingList', query: { camp_times_id, times_task_id }})
    },
    changePaging(){
      this.getTableList();
    },
    searchList(){
      this.listQuery.page_num = 1;
      this.getTableList();
    }
  }
}
</script>

<style lang="scss" scoped>
.app_container{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
  }
}
</style>
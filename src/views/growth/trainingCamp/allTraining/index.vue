<template>
  <div class="app_container">
    <el-row type="flex" class="title-header" justify="space-between">
      <el-col :span="6">
        <el-col :span="18">
          <el-input size="small" placeholder="请输入训练营名称" prefix-icon="el-icon-search" v-model="listQuery.search" clearable></el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="success" @click="searchData()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
      <el-col :span="1.8">
        <el-button size="small" type="primary" @click="newCamp()">新建训练营</el-button>
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
        class="eltables"
        highlight-current-row>
        <el-table-column label="ID" prop="all_camp_id" align="center" width='40'>
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="封面图" prop="adv_img" align="center" width='110'>
          <template slot-scope="scope">
            <img :src="scope.row.adv_img" alt="" v-if="scope.row.adv_img" width="90" height="60">
            <span v-else>{{ '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="训练营名称" prop="all_camp_name" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.all_camp_name">{{ scope.row.all_camp_name }}</span>
            <span v-else>{{ '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属板块" prop="camp_position_name" align="center" width='140'>
          <template slot-scope="scope">
            <span>{{ scope.row.camp_position_name === null ? '--' : scope.row.camp_position_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="顺序" prop="sort" align="center" width='80'>
          <template slot-scope="scope">
            <span>{{ scope.row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建者" prop="create_real_name" align="center" width='100'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_real_name === null ? '--' : scope.row.create_real_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传日期" prop="create_time" align="center" width='110'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前状态" prop="is_show" align="center" width='110'>
          <template slot-scope="scope">
            <span>{{ scope.row.is_show == "1" ? '已上架' : '已下架' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='140'>
          <template slot-scope="scope">
            <el-button size="mini" @click="goSet(scope.row.all_camp_id,scope.row.is_show)" type="text">
              {{ scope.row.is_show == "1" ? '去下架' : '去上架' }}
            </el-button>
            <el-button size="mini" @click="goEdit(scope.row.all_camp_id)" type="text">编辑</el-button>
            <el-button size="mini" @click="goDel(scope.row.all_camp_id)" type="text">删除</el-button>
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
import { allCampList,upLowerAllCamp,delAllCamp,editAllCamp,addAllCamp } from "@/api/growthCamp";
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
        page_size: 10,
        search: '',
      },
      total: 0
    }
  },
  created(){
    this.listQuery.page_num = Number(sessionStorage.getItem('allTrainingPage')) || this.listQuery.page_num;
    this.allCampList();
  },
  methods:{
    allCampList(){
      setTimeout(() => {sessionStorage.removeItem('allTrainingPage')}, 300);
      this.listLoading = true;
      allCampList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.list;
          this.total = res.result.sign.count;
        }
      });
    },
    goDel(id){
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAllCamp({all_camp_id:id}).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.allCampList();
          }
        });
      }).catch(() => {       
      });
    },
    goSet(id,v){
      this.$confirm('确定要修改状态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        upLowerAllCamp({all_camp_id:id,is_show: v}).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.allCampList();
          }
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });          
      });
    },
    goEdit(data){
      this.$router.push({ path: `./newCamp/${data}` });
      sessionStorage.setItem('allTrainingPage',this.listQuery.page_num);
    },
    newCamp(){
      let id = 0;
      this.$router.push({ path: `./newCamp/${id}` });
    },
    editforms(data){
      this.$router.push({ path: `./question/${id}` });
    },
    searchData(){
      this.listQuery.page_num = 1;
      this.allCampList()
    },
    changePaging(){
      this.allCampList();
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
  .eltables{
    min-height: 500px;
  }
}
</style>
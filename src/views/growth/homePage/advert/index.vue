<template>
  <div class="app_container">
    <el-row :span="24" class="title-header" type="flex" justify="space-between">
      <el-col :span="6">
        <el-col :span="16" align="center">
          <el-input size="small" clearable placeholder="请输入广告标题" prefix-icon="el-icon-search" v-model="listQuery.ad_title" @clear="handleAdv">
          </el-input>
        </el-col>
        <el-col :span="8" align="center">
          <el-button type="success" @click="handleAdv()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
      <el-col :span="2">
        <el-button size="small" type="primary"  @click="goAdv()">创建广告</el-button>
      </el-col>
    </el-row>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
        <el-table-column label="排序" type="index" align="center" width='60'>
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center" width='160'>
          <template slot-scope="scope">
            <video controls="controls" width="100px" height="auto" :src="scope.row.video_url"></video>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="ad_title" align="center"></el-table-column>
        <el-table-column label="顺序" prop="ad_sort" align="center" width='125'></el-table-column>
        <el-table-column label="创建者" align="center" width='125'>
          <template slot-scope="scope">
            <span>{{ scope.row.user_name === null ? '--' : scope.row.user_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" align="center" width='140'></el-table-column>
        <el-table-column label="状态" align="center" width='120'>
          <template slot-scope="scope">
            <span>{{scope.row.is_show == '1' ? '上架中' : '已下架'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='150'>
          <template slot-scope="scope">
            <el-button size="mini" @click="deleteAdvSure(scope.row.ad_id,scope.row.type)" type="text">删除</el-button>
            <el-button size="mini" @click="goAdv(scope.row.ad_id,scope.row.type)" type="text">编辑</el-button>
            <el-button size="mini" @click="changeStatus(scope.row.ad_id,scope.row.type,scope.row.is_show)" type="text">{{scope.row.is_show == '1' ? '下架' : '上架'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="adList"
      />
    </el-col>
  </div>
</template>

<script>
import { adList, deleteAdv, statusAdv, getEditAdv } from "@/api/homePage";
import Pagination from '@/components/Pagination';
export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      listLoading: true,
      listQuery: {
        page_num: 1,
        page_size: 10,
        ad_title: '',
        type: '2'
      },
      total: 0,
      list:[]
    }
  },
  created(){
    this.adList();
    this.listQuery.page_num = Number(sessionStorage.getItem('advertPage')) || this.listQuery.page_num;
  },
  methods:{
    adList(){
      this.listLoading = true;
      setTimeout(() => {
        sessionStorage.removeItem('advertPage')
      }, 300);
      adList(this.listQuery).then(res => {
        if(res.code == 200){
          this.listLoading = false;
          this.list = res.result.list;
          this.total = res.result.count;
        }
      })
    },
    goAdv(ad_id){
      let adId = ad_id ? ad_id : '0';
      this.$router.push({ path: `./news/${adId}` })
      sessionStorage.setItem('advertPage',this.listQuery.page_num);
    },
    deleteAdvSure(ad_id, type){
      this.$confirm('确认要删除该广告吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAdv(ad_id, type);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteAdv(ad_id, type){
      const data = {
        ad_id,
        type
      }
      deleteAdv(data).then(res => {
        if(res.code == 200){
          this.$message.success('删除成功');
          this.adList();
        }
      })
    },
    changeStatus(ad_id, type, is_show){
      const isShow = is_show == '1' ? '下架' : '上架';
      this.$confirm(`确认要${isShow}该广告吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.statusAdv(ad_id, type, is_show);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${isShow}`
        });
      });
    },
    statusAdv(ad_id, type, is_show){
      const data = {
        ad_id, 
        type, 
        is_show
      }
      statusAdv(data).then(res => {
        if(res.code == 200){
          this.$message.success('操作成功');
          this.adList();
        }
      })
    },
    handleAdv(){
      this.listQuery.page_num = 1;
      this.adList();
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
  img{
    max-width: 100px;
    height: 100px;
    text-align: center;
  }
  .lists{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img{
      margin-right: 50px;
    }
  }
}
</style>
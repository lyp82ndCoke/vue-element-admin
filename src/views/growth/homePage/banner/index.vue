<template>
  <div class="app_container">
    <el-col :span="24" class="title-header">
      <el-col :span="2">
        <el-button size="small" type="primary"  @click="goBanner()">创建banner</el-button>
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
        <el-table-column label="排序" type="index" align="center" width='60'>
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="banner图" align="center" >
          <template slot-scope="scope">
            <img :src="scope.row.ad_picture" alt="" style="width: 100%;height:100%;">
          </template>
        </el-table-column>
        <el-table-column label="顺序" prop="ad_sort" align="center" width='160'></el-table-column>
        <el-table-column label="创建者" align="center" width='160'>
          <template slot-scope="scope">
            <span>{{ scope.row.user_name === null ? '--' : scope.row.user_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" align="center" width='160'></el-table-column>
        <el-table-column label="状态" align="center" width='130'>
          <template slot-scope="scope">
            <span>{{scope.row.is_show == '1' ? '上架中' : '已下架'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width='150'>
          <template slot-scope="scope">
            <el-button size="mini" @click="deleteAdvSure(scope.row.ad_id,scope.row.type)" type="text">删除</el-button>
            <el-button size="mini" @click="goBanner(scope.row.ad_id,scope.row.type)" type="text">编辑</el-button>
            <el-button size="mini" @click="changeStatus(scope.row.ad_id,scope.row.type,scope.row.is_show)" type="text">{{scope.row.is_show == '1' ? '下架' : '上架'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-show="total>0"
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
        type: '1',
      },
      total: 0,
      list:[]
    }
  },
  created(){
    this.adList();
  },
  methods:{
    adList(){
      this.listLoading = true;
      adList(this.listQuery).then(res => {
        if(res.code == 200){
          this.listLoading = false;
          this.list = res.result.list;
          this.total = res.result.count;
        }
      })
    },
    goBanner(ad_id){
      let adId = ad_id ? ad_id : '0';
      this.$router.push({ path: `./news/${adId}` })
    },
    deleteAdvSure(ad_id, type){
      this.$confirm('确认要删除该banner吗?', '提示', {
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
      this.$confirm(`确认要${isShow}该banner吗?`, '提示', {
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
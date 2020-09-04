<template>
  <div class="app_container-article">
    <el-col :span="24" class="title-header">
      <el-col :span="24">
        <el-col :span="5">
          <el-input size="small" clearable placeholder="请输入任务名称" prefix-icon="el-icon-search" v-model="listQuery.search" @clear="clearTitle">
          </el-input>
        </el-col>
        <el-col :span="2" class="success-btn" align="right">
          <el-button type="success" @click="clearTitle()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
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
        <!-- 
          任务参与总人数   =>  营期人数
          发布任务人数     =>  完成任务人数
          发布任务数       =>  完成任务个数
          已公开任务       =>  用户公开任务数
          未公开任务       =>  用户未公开任务数 
        -->
        <el-table-column label="任务名称" prop="camp_times_name" align="center" width="200"></el-table-column>
        <el-table-column label="任务时间" align="center" width="130">
          <template slot-scope="scope">
            <span>{{scope.row.task_start_time}} 至 {{scope.row.task_end_time}}</span>
          </template>
        </el-table-column>
        <el-table-column label="进行中/任务时间（营期）" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.having_days}}/{{scope.row.total_days}}</span>
          </template>
        </el-table-column>
        <el-table-column label="参与任务总人数（营期）" prop="join_people_num" align="center" width="100"></el-table-column>
        <el-table-column label="已完成任务总人数" prop="finish_task_people_num" align="center"></el-table-column>
        <el-table-column label="已完成任务数" prop="finish_task_num" align="center"></el-table-column>
        <el-table-column label="已公开任务数" prop="open_task_num" align="center"></el-table-column>
        <el-table-column label="未公开任务数" prop="close_task_num" align="center"></el-table-column>
        <el-table-column label="已分享总次数" prop="share_count_num" align="center"></el-table-column>
        <el-table-column label="已点赞总数" prop="valid_zan_num" align="center"></el-table-column>
        <el-table-column label="状态" prop="status" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width='130'>
          <template slot-scope="scope">
            <el-button size="mini" @click="viewDetails(scope.row.times_task_id)" type="text">查看明细</el-button>
            <el-button size="mini" @click="goComment(scope.row.times_task_id)" type="text">评论</el-button>
            <el-button size="mini" @click="goStatistics(scope.row.camp_times_id, scope.row.times_task_id)" type="text">统计</el-button>
            <el-button size="mini" @click="goDeposit(scope.row.times_task_id)" type="text">押金</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="taskManageList"/>
    </el-col>
  </div>
</template>

<script>
import { taskManageList } from "@/api/homePage";
import Pagination from '@/components/Pagination';
export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      listLoading: true,
      total: 0,
      list:[],
      listQuery: {
        search: "",
        page_num: 1,
        page_size: 10
      }
    }
  },
  created(){
    this.taskManageList();
  },
  methods:{
    viewDetails(times_task_id){
      this.$router.push(`./viewDetails/${times_task_id}`)
    },
    goStatistics(camp_times_id, times_task_id){
      this.$router.push({path: './Statistics', query: { camp_times_id, times_task_id }})
    },
    goComment(times_task_id){
      this.$router.push(`./comment/${times_task_id}`)
    },
    goDeposit(times_task_id){
      this.$router.push(`./deposit/${times_task_id}`)
    },
    taskManageList(){
      this.listLoading = true;
      taskManageList(this.listQuery).then(res => {
        if(res.code == 200){
          this.listLoading = false;
          this.list = res.result.list;
          this.total = res.result.sign.count;
        }
      })
    },
    clearTitle(){
      this.listQuery.page_num = 1;
      this.taskManageList();
    }
  }
}
</script>

<style lang="scss">
.app_container-article{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
  }
}
</style>
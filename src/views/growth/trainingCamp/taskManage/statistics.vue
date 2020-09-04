<template>
  <div class="app_container_Statistics">
    <el-col :span="24" class="title-header">
      <h4>任务名称：{{ taskName }}</h4>
    </el-col>
    <el-col :span="24" class="statistics_table">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size='small'
        highlight-current-row>
        <el-table-column label="任务时间" prop="day" align="center"></el-table-column>
        <el-table-column label="进行中/任务时间(营期)" prop="nickname" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.data.having_days }}/{{ scope.row.data.total_days }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参与任务总人数(营期)" prop="mobile" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.data.join_total_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已完成任务总人数" prop="finish_task_num" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.data.finish_task_total_people }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已完成任务数" prop="public_task_num" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.data.finish_task_total_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已公开任务数" prop="private_task_num" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.data.open_task_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已分享总人数" prop="zan_num" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.data.share_task_people_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已分享总次数" prop="share_task_content_num" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.data.share_task_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已点赞总数" prop="share_task_content_num" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.data.zans_task_num }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="getRankingList"/>
    </el-col>
  </div>
</template>

<script>
import { taskStatistics } from "@/api/homePage";
import Pagination from '@/components/Pagination';

export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      taskName: '',
      listLoading: true,
      total: 0,
      list:[],
      listQuery: {
        camp_times_id: "",
        times_task_id: "",
        page_num: 1,
        page_size: 10
      }
    }
  },
  created(){
    this.listQuery.camp_times_id = this.$route.query.camp_times_id;
    this.listQuery.times_task_id = this.$route.query.times_task_id;
    this.getRankingList();
  },
  methods:{
    getRankingList(){
      this.listLoading = true;
      taskStatistics(this.listQuery).then(res => {
        if(res.code == 200){
          this.listLoading = false;
          this.taskName = res.result.camp_times_info.camp_times_name;
          this.list = res.result.data_info;
          this.total = res.result.count;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app_container_Statistics{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
    h4{
      margin: 0;
    }
  }
}
</style>
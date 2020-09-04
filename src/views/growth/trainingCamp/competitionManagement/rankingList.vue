<template>
  <div class="app_container-article">
    <el-col :span="24" class="title-header">
      <el-col :span="24">
        <el-col :span="6">
          <el-input size="small" clearable placeholder="请输入用户昵称或者手机号" prefix-icon="el-icon-search" v-model="listQuery.search_title" @clear="clearTitle">
          </el-input>
        </el-col>
        <el-col :span="4" align="center">
          <el-select v-model="listQuery.search_rank" clearable placeholder="全部" size="small" @change="clearTitle">
            <el-option
              v-for="item in prize"
              :key="item.level_sort"
              :label="item.prize_name"
              :value="item.level_sort">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="success-btn" align="center">
          <el-button type="success" @click="clearTitle()" size="small">搜索</el-button>
        </el-col>
      </el-col>
    </el-col>
    <el-col :span="24">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
        <!-- <el-table-column label="名次" prop="current_rank" align="center"></el-table-column> -->
        <el-table-column label="排行" prop="current_rank" align="center"></el-table-column>
        <el-table-column label="昵称" prop="nickname" align="center"></el-table-column>
        <el-table-column label="手机号码" prop="mobile" align="center"></el-table-column>
        <el-table-column label="完成任务总数量" prop="finish_task_num" align="center"></el-table-column>
        <el-table-column label="公开任务总数量" prop="public_task_num" align="center"></el-table-column>
        <el-table-column label="未开任务总数量" prop="private_task_num" align="center"></el-table-column>
        <el-table-column label="点赞总量" prop="zan_num" align="center"></el-table-column>
        <el-table-column label="分享总数量" prop="share_task_content_num" align="center"></el-table-column>
        <el-table-column label="获奖情况" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.is_prize == 1" size="mini" type="text" @click="priceDetails(scope.row.prize_info,scope.row.current_rank)">{{scope.row.prize_name}}</el-button>
            <el-button v-else size="mini" type="text" disabled>{{scope.row.prize_name}}</el-button>
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

    <el-dialog title="获奖情况" :visible.sync="taskDetails" class="create-alert">
      <div class="task-title">最终排行：{{current_rank}}</div>
      <div class="task-img">
        <!-- 实物 -->
        <div v-if="prize_info.prize_type == 1">
          <div>{{prize_info.prize_name}}：</div>
          <div class="award" v-for="(item,index) in prize_info.prize_data" :key="index">
            <div class="award-waring">{{item.award_name}}</div>
            <img :src="item.prize_img" width="100" height="100" alt="">
          </div>
        </div>
        <!-- 优惠券 -->
        <div v-else-if="prize_info.prize_type == 2" style="display: flex;">
          <div>{{prize_info.prize_name}}：</div>
          <div class="award">
            <div class="award-waring" v-for="(itm,idx) in prize_info.prize_data" :key="idx">
              {{itm.coupon_type == 1 ? '有赞平台优惠券':'H5商品平台优惠券'}} &nbsp;&nbsp; {{itm.coupon_name}}满{{itm.coupon_threshold}}元减{{itm.amount}}元
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRankingList } from "@/api/homePage";
import Pagination from '@/components/Pagination';

export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      taskDetails: false,
      prize_info: [],
      listLoading: true,
      total: 0,
      current_rank: null,
      list:[],
      listQuery: {
        camp_times_id: "",
        times_task_id: "",
        search_title: "",
        search_rank: "",
        page_num: 1,
        page_size: 10
      },
      prize: []
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
      getRankingList(this.listQuery).then(res => {
        if(res.code == 200){
          this.listLoading = false;
          this.list = res.result.rankList;
          this.prize = res.result.prize;
          this.total = res.result.sign.count;
        }
      })
    },
    priceDetails(details, current_rank){
      this.prize_info = details;
      this.current_rank = current_rank;
      this.taskDetails = true;
    },
    clearTitle(){
      this.listQuery.page_num = 1;
      this.getRankingList();
    }
  }
}
</script>

<style lang="scss" scoped>
.app_container-article{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
  }
  .create-alert{
    .task-title{
      margin-bottom: 10px;
    }
    .task-img{
      display: flex;
      margin-bottom: 20px;
      .award{
        margin-left: 10px;
        .award-waring{
          margin-bottom: 10px;
        }
      }
      .award-coupon{
        margin-bottom: 10px;
      }
    }
  }
}
</style>
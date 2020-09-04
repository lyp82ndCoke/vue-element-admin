<template>
  <div class="app-container">
    <el-col :span="24" class="table-title">
      <el-col :span="24" class="title">爱心值</el-col>
      <el-col :span="5">
        触发类型:
        <el-select v-model="listQuery.event_type" placeholder="请选择" @change="changeShow" size="small" clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="9">
        发放日期:
        <el-date-picker
          size="small"
          v-model="value2"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-input size="small" placeholder="请输入手机号/微信昵称" clearable prefix-icon="el-icon-search" v-model="listQuery.search_key">
        </el-input>
      </el-col>
      <el-col :span="1" class="success-btn">
        <el-button type="success" @click="getSearch()" icon="el-icon-search" size="small">搜索</el-button>
      </el-col>
    </el-col>
      
    <el-col :span="24" class="table-content">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
        <el-table-column label="名称" prop="card_name" align="center" width="190">
          <template slot-scope="scope">
            <div class="lists">
              <img :src="scope.row.headimgurl" alt="">
              <div class="user">
                <p>{{scope.row.nickname}}</p>
                <p>{{scope.row.mobile}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="触发类型" prop="score_type" align="center" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.score_type == '1' || scope.row.score_type == '2' ? '礼品卡' : '消费'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发放时间" prop="score_time" align="center" width="190">
        </el-table-column>
        <el-table-column label="原因" prop="" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.score_type == '1'">
              <p>领取礼品卡 "{{ scope.row.card_name }}" 1张</p>
              <p>礼品卡id: {{ scope.row.card_id }}</p>
            </div>
            <div v-if="scope.row.score_type == '2'">
              <p>使用礼品卡 "{{ scope.row.card_name }}" 1张</p>
              <p>礼品卡id: {{ scope.row.card_id }}</p>
            </div>
            <div v-if="scope.row.score_type == '3'">
              <p>自身每消费 {{ scope.row.rule.consumeAmount }}元 可获得 {{ scope.row.rule.score }}积分</p>
              <p>订单号: {{ scope.row.order_id }}</p>
            </div>
            <div v-if="scope.row.score_type == '4'">
              <p>粉丝每消费 {{ scope.row.rule.consumeAmount }}元 可获得 {{ scope.row.rule.score }}积分</p>
              <p>订单号: {{ scope.row.order_id }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="明细" prop="score" align="center" width="190">
          <template slot-scope="scope">
            <span style="color:red;">+{{scope.row.score}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="changePaging"
      />
    </el-col>
  </div>
</template>

<script>
import { getUserScoreList } from "@/api/spokesperson";
import Pagination from '@/components/Pagination';

export default {
  components: { Pagination },

  data() {
    return {
      listLoading: true,
      listQuery: {
        page_num: 1,
        page_size: 10,
        search_key:'',
        event_type:'',
        unionid: this.$route.params.id
      },
      total: 0,
      value2:'',
      options:[
        {
          value: '',
          label: '全部类型'
        },
        {
          value: '1',
          label: '礼品卡'
        },
        {
          value: '2',
          label: '消费'
        },
      ],
      list:[]
    };
  },
  created() {
    this.getUserScoreList();
  },
  methods: {
    getUserScoreList(){
      this.listLoading = true;
      if(this.value2){
        this.listQuery.start_time = this.value2[0];
        this.listQuery.end_time = this.value2[1];
      }else{
        this.listQuery.start_time = '';
        this.listQuery.end_time = '';
      }
      getUserScoreList(this.listQuery).then((res) => {
        if (res.code == 200) {
          this.listLoading = false;
          this.list = res.result.logList;
          this.total = Number(res.result.count);
        }
      })
    },
    changeShow(v){
      // this.getUserScoreList();
    },
    getSearch() {
      this.getUserScoreList();
    },
    changePaging(){
      this.getUserScoreList();
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container{
  padding: 20px;
  .title{
    height: 30px;
    line-height: 30px;
    margin-bottom: 20px;
    border-bottom: 1.5px solid #eee;
  }
  .table-title{
    margin-bottom: 20px;
  }
  .lists{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    img{
      width: auto;
      max-width: 60px;
      float: left;
      border-radius: 50%;
    }
    .user{
      float: left;
      width: 60%;
      height: 100%;
      p{
        margin-top: -2px;
        text-align: left;
        text-indent: 3px;
      }
    }
  }
}
</style>
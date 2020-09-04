<template>
  <div class="app_container-article">
    <el-col :span="24" class="title-header">
      <el-col :span="22">
        <el-col :span="5">
          <el-input size="small" clearable placeholder="请输入用户昵称或者手机号" prefix-icon="el-icon-search" v-model="listQuery.search_key" @clear="clearTitle">
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.status" placeholder="请选择退款状态" size="small" @change='changeType2'>
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="success-btn">
          <el-button type="success" @click="clearTitle()" size="small">搜索</el-button>
        </el-col>
        <el-col :span="2" class="success-btn">
          <a :href="processHost + 'edu/Sign/exportUserDeposit?special=skip&desposit_type=2&sign_id='+listQuery.sign_id" class="export-form">导出</a>
        </el-col>
        <el-col :span="2" class="success-btn">
          <el-button type="primary" size="small" @click="goRefund()" :disabled="isDisabaled">全部退款</el-button>
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
        <el-table-column label="排序" prop="title" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户昵称" prop="nickname" align="center"></el-table-column>
        <el-table-column label="手机号码" prop="mobile" align="center"></el-table-column>
        <el-table-column label="订单号" prop="order_id" align="center" width="530"></el-table-column>
        <el-table-column label="是否返现" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.is_back == 1 ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额(元)" prop="deposit_amount" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.deposit_amount/100}}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" prop="status" align="center">
          <template slot-scope="scope">
            <span style="color: #909399;cursor: pointer;" v-if="scope.row.status == '1'">未退款</span>
            <span v-if="scope.row.status == '2'">退款中</span>
            <span style="color: #67C23A;cursor: pointer;" v-if="scope.row.status == '3'">已退款</span>
            <span style="color: #F56C6C;cursor: pointer;" v-if="scope.row.status == '4'">退款失败</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="getUserDepositList"/>
    </el-col>
  </div>
</template>

<script>
import { getUserDepositList } from "@/api/homePage";
import { allRefund } from "@/api/growthCamp";

import Pagination from '@/components/Pagination';
export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      processHost: '',
      listLoading: true,
      total: 0,
      list:[],
      listQuery: {
        desposit_type: "2",
        sign_id: "",
        search_key: "",
        page_num: 1,
        page_size: 10
      },
      options2:[
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '未退款'
        },
        {
          value: '3',
          label: '已退款'
        },
        {
          value: '4',
          label: '退款失败'
        },
      ],
      isDisabaled: false,
    }
  },
  created(){
    this.processHost = process.env.BASE_API;
    this.listQuery.sign_id = this.$route.params.id;
    this.getUserDepositList();
  },
  methods:{
    getUserDepositList(){
      this.listLoading = true;
      getUserDepositList(this.listQuery).then(res => {
        if (res.code == 200 && res.result.refund_status == '2') {
          this.listLoading = false;
          this.list = res.result.userList;
          this.total = res.result.count;
          this.isDisabaled = res.result.refund_status == 1;
        }
      })
    },
    clearTitle(){
      this.listQuery.page_num = 1;
      this.getUserDepositList();
    },
    changeType2(v){
      this.listQuery.status = v;
      this.listQuery.page_num = 1;
      this.getUserDepositList();
    },
    goRefund(){
      this.$confirm('确定要全部进行退款吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        allRefund({ desposit_type: '2', sign_id:this.listQuery.sign_id }).then(res => {
          if(res.code == 200){
            this.$message({
              message: res.msg,
              type: 'success'
            });
          }
          this.getUserDepositList();
        })
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.app_container-article{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
    .export-form{
      color: #fff;
      width: 52px;
      display: block;
      background-color: #409EFF;
      border-color: #409EFF;
      font-size: 12px;
      border-radius: 3px;
      padding: 9px 10px;
      text-align: center;
    }
  }
}
</style>
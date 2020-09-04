<template>
  <div class="app_container">
    <h3>{{ sign_name }} - 押金列表</h3>
    <el-row type="flex" class="title-header" justify="space-between">
      <el-col :span="24">
        <el-col :span="3">
          <el-select v-model="listQuery.user_type" placeholder="请选择用户类型" size="small" @change='changeType1'>
            <el-option
              v-for="item in [{value: '',label: '全部'},{value: '1',label: 'H5商城'},{value: '2',label: '抖音用户'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="layoutMargin">
          <el-select v-model="listQuery.status" placeholder="请选择退款状态" size="small" @change='changeType2'>
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5" class="layoutMargin">
          <el-input size="small" placeholder="请输入用户昵称或手机号码" prefix-icon="el-icon-search" v-model.trim="listQuery.search_key" clearable @clear="clearTitle">
          </el-input>
        </el-col>
        <el-col :span="6" class="success-btn layoutMargin">
          <el-col :span="8">
            <el-button type="success" @click="searchData()" icon="el-icon-search" size="small">搜索</el-button>
          </el-col>
          <el-col :span="7" :offset="1">
            <a :href="processHost + 'edu/Sign/exportUserDeposit?special=skip&sign_id='+listQuery.sign_id+'&search_key='+listQuery.search_key+'&status='+listQuery.status+
             '&user_type='+listQuery.user_type+'&page_num='+listQuery.page_num+'&page_size=90000'" class="export-form">导出</a>
          </el-col>
          <el-col :span="7" v-if="listQuery.user_type == ''">
            <el-button type="primary" size="small" @click="goRefund()" :disabled="isDisabaled">全部退款</el-button>
          </el-col>
        </el-col>
      </el-col>
      <!-- <el-col :span="5">
        <el-button type="primary" @click="goRefund('goRefund','douyin')" size="small" v-if="listQuery.user_type == '2'" :disabled="multipleSelection.length == 0">批量退款</el-button>
        <el-button type="primary" @click="goRefund('goRefund','h5')" size="small" v-if="listQuery.user_type == '1'">全部完成</el-button>
      </el-col> -->
    </el-row>
    <el-col :span="24" class="title-content">
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          :data="lists"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          element-loading-text="Loading"
          border
          height="480"
          fit
          size='mini'
          highlight-current-row>
          <!-- <el-table-column type="selection" width="50" align="center" :selectable='selectInit' v-if="listQuery.user_type == '2'">
          </el-table-column> -->
          <el-table-column label="ID" prop="id" align="center" width="60">
          </el-table-column>
          <el-table-column label="用户昵称" prop="nickname" align="center" width="250">
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" align="center" width="170">
            <template slot-scope="scope">
              <span>{{ scope.row.mobile ? scope.row.mobile : '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单号" prop="order_id" align="center" width="310">
          </el-table-column>
          <!-- <el-table-column label="购买时间" prop="order_time" align="center" width="160" v-if="listQuery.user_type == '2'">
          </el-table-column> -->
          <el-table-column label="订单金额(元)" prop="deposit_amount" align="center">
          </el-table-column>
          <el-table-column label="退款状态" prop="status" align="center">
            <template slot-scope="scope">
              <span style="color: #909399;cursor: pointer;" v-if="scope.row.status == '1'">未退款</span>
              <span v-if="scope.row.status == '2'">退款中</span>
              <span style="color: #67C23A;cursor: pointer;" v-if="scope.row.status == '3'">已退款</span>
              <span style="color: #F56C6C;cursor: pointer;" v-if="scope.row.status == '4'">退款失败</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="goRefund(scope.row.id, scope.row.user_type)" type="text" v-if="scope.row.user_type == '1'&&scope.row.status == '1'">
                完成退款
              </el-button>
              <el-button size="mini" type="text" disabled v-if="scope.row.user_type == '1'&&scope.row.status == '3'">已完成退款</el-button>
              <el-button size="mini" @click="goRefund(scope.row.id, scope.row.user_type)" type="text" v-if="scope.row.user_type == '2'&&scope.row.status == '1'">
                退款
              </el-button>
              <el-button size="mini" type="text" disabled v-if="scope.row.user_type == '2'&&scope.row.status == '3'">已退款</el-button>
              <el-button size="mini" type="text" @click="error" v-if="scope.row.status == '4'" title="错误信息,请联系技术人员处理!">错误信息</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-col>
      <el-col :span="24" style="margin-top:10px;" v-if="listQuery.user_type == ''">
        合计： 需退款人数 {{countUserNum}} 人，已退款金额 {{sumRefundedAmount}}元
      </el-col>
      <el-col :span="24">
        <pagination 
          class="pagination"
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page_num"
          :limit.sync="listQuery.page_size"
          v-on:pagination="changePaging"
        />
      </el-col>
    </el-col>
  </div>
</template>

<script>
import { getUserDepositList,returnUserDeposit,exportUserDeposit,allRefund } from "@/api/growthCamp";
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
        sign_id: '',
        search_key: '',
        user_type: '',
        status: '',
      },
      total: 0,
      sign_name: sessionStorage.getItem('sign_name'),
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
      multipleSelection:[],
      processHost: '',
      isDisabaled: false,
      countUserNum: '0',  //合计已退款人数
      sumRefundedAmount: '0',  //合计已退款金额单位分
    }
  },
  created(){
    this.processHost = process.env.BASE_API;
    this.listQuery.sign_id = this.$route.params.Signid;
    this.getUserDepositList();
  },
  methods:{
    getUserDepositList(){
      this.listLoading = true;
      getUserDepositList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.userList;
          for (let t = 0, len=this.lists.length; t < len; t++) {
            if(this.lists[t].deposit_amount != '' && this.lists[t].deposit_amount != '0'){
              this.lists[t].deposit_amount = FentoYuan(Number(this.lists[t].deposit_amount));
              function FentoYuan( num ) {
                if ( typeof num !== "number" || isNaN( num ) ) return null;
                return ( num / 100 ).toFixed( 2 );
              }
            }
          }
          this.total = Number(res.result.count);
          this.countUserNum = res.result.amountInfo.countUserNum;
          this.sumRefundedAmount = this.changeMoney(Number(res.result.amountInfo.sumRefundedAmount));
          this.isDisabaled = res.result.refund_status == 1;
        }
        // else if(res.code == 200 && res.result.refund_status == '1'){
        //   this.listLoading = false;
        //   // setTimeout(() => {
        //   //   this.$alert('退款进行中，请稍后访问此页面！', '提示', {
        //   //     confirmButtonText: '确定',
        //   //     callback: action => {
        //   //       this.$router.go(-1);
        //   //     }
        //   //   });
        //   // }, 500);
        // }
      });
    },
    changeMoney(val){
      var str = (val/100).toFixed(2) + '';
      var intSum = str.substring(0,str.indexOf(".")).replace( /\B(?=(?:\d{3})+$)/g, ',' );//取到整数部分
      var dot = str.substring(str.length,str.indexOf("."))//取到小数部分搜索
      var ret = intSum + dot;
      return ret;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeType1(v){
      this.listQuery.page_num = 1;
      this.listQuery.user_type = v;
      if(v == ''){
        this.listQuery.status = '';
      }
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
        // this.listLoading = true;
        allRefund({ desposit_type: '1', sign_id:this.listQuery.sign_id }).then(res => {
          if(res.code == 200){
            // this.listLoading = false;
            this.$message({
              message: res.msg,
              type: 'success'
            });
          }
          this.getUserDepositList();
          // else {
          //   // this.listLoading = false;
          //   // setTimeout(() => {
          //   //   this.$alert('退款进行中，请稍后访问此页面！', '提示', {
          //   //     confirmButtonText: '确定',
          //   //     callback: action => {
          //   //       this.$router.go(-1);
          //   //     }
          //   //   });
          //   // }, 500);
          // }
        })
      })
    },
    // goRefund(id,type){
    //   let tip = type == 'h5' ? '确定已完成退款了吗？' : (type == 'douyin' ? '确定要进行批量退款吗？' : ( type == '1' ? '确定要完成退款吗？' : '确定要进行退款吗？') );
    //   this.$confirm(tip, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     if(id === 'goRefund'){
    //       if(type === 'h5'){
    //         setRefunded({ sign_id: this.listQuery.sign_id }).then(res => {
    //           if(res.code == 200){
    //             this.$message({
    //               message: res.msg,
    //               type: 'success'
    //             });
    //           }else{
    //             this.$message({
    //               message: res.msg,
    //               duration: 4500,
    //               type: 'error'
    //             });
    //           }
    //           this.getUserDepositList();
    //         })
    //       }else if(type === 'douyin'){
    //         let list = [];
    //         for (let t = 0,len=this.multipleSelection.length; t < len; t++) {
    //           list.push(this.multipleSelection[t].id);
    //         }
    //         returnUserDeposit({ deposit_id_list: list,sign_id: this.listQuery.sign_id,type: '2' }).then(res => {
    //           if(res.code == 200){
    //             this.$message({
    //               message: res.msg,
    //               type: 'success'
    //             });
    //             this.getUserDepositList();
    //           }else{
    //             this.$message({
    //               message: res.msg,
    //               duration: 4500,
    //               type: 'error'
    //             });
    //             this.getUserDepositList();
    //           }
    //         })
    //         this.multipleSelection = [];
    //       }
    //     }else{
    //       returnUserDeposit({ deposit_id_list: [id], sign_id: this.listQuery.sign_id, type: type }).then(res => {
    //         if(res.code == 200){
    //           this.$message({
    //             message: res.msg,
    //             type: 'success'
    //           });
    //           this.getUserDepositList();
    //         }else{
    //           this.$message({
    //             message: res.msg,
    //             duration: 4500,
    //             type: 'error'
    //           });
    //           this.getUserDepositList();
    //         }
    //       })
    //     }
    //   })
    // },
    selectInit(row,index){
      if(row.status == '1'){
         return true;
      }else{    
         return false;
      }
    },
    searchData(){
      this.listQuery.page_num = 1;
      this.getUserDepositList();
    },
    changePaging(){
      this.getUserDepositList();
    },
    clearTitle(){
      this.listQuery.page_num = 1;
      this.getUserDepositList();
    },
    error(){
      this.$message({
        message: '错误信息，请联系管理员处理！',
        type: 'warning'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.app_container{
  padding: 20px;
  h3{
    margin: -5px 0 10px;
  }
  .title-header{
    margin-bottom: 20px;
  }
  .layoutMargin{
    margin-left: 10px;
  }
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
    margin-top: 1px;
  }
}
</style>
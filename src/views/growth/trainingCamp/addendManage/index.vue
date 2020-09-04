<template>
  <div class="app_container">
    <el-row type="flex" class="title-header" justify="space-between">
      <el-col :span="6">
        <el-col :span="18" class="success-btn">
          <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="listQuery.search_key" clearable></el-input>
        </el-col>
        <el-col :span="5" class="success-btn">
          <el-button type="success" @click="searchSignList()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
    </el-row>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="lists"
        class="eltables"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
        <!-- <el-table-column type="index" width="30">
        </el-table-column> -->
        <el-table-column label="签到名称" prop="sign_name" align="center">
        </el-table-column>
        <el-table-column label="签到开始/结束时间" prop="sign_start_time" align="center" width='165'>
          <template slot-scope="scope">
            <span>{{ scope.row.sign_start_time }}/{{ scope.row.sign_end_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动总天数" prop="sign_day_num" align="center" width='65'>
        </el-table-column>
        <el-table-column label="总用户数" prop="count" align="center" width='65'>
          <template slot-scope="scope">
            <span>{{ scope.row.sign_all_people_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已签到总人数" prop="sign_people_num" align="center" width='70'>
        </el-table-column>
        <el-table-column label="当前天/总天数" prop="signing_date_num" align="center" width='70'>
          <template slot-scope="scope">
            <span>{{ scope.row.signing_date_num }}/{{ scope.row.sign_day_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已获优惠券人数" prop="coupon_people_num" align="center" width='70'>
        </el-table-column>
        <el-table-column label="已返押金人数" prop="amount_people_num" align="center" width='70'>
        </el-table-column>
        <el-table-column label="创建者" prop="create_real_name" align="center" width='95'>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" align="center" width='85'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_time.slice(0,10) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="sign_status" align="center" width='60'>
          <template slot-scope="scope">
            <span>{{ scope.row.sign_status == '1' ? '未开始' : (scope.row.sign_status == '2' ? '进行中' : '已结束')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='140'>
          <template slot-scope="scope">
            <el-button size="mini" @click="newAddend(scope.row)" type="text">编辑</el-button>
            <el-button size="mini" @click="goDeposit(scope.row.sign_id,scope.row.sign_name)" type="text">押金</el-button>
            <el-button size="mini" @click="goLibrary(scope.row.sign_id)" type="text">题库</el-button>
            <el-button size="mini" @click="goUser(scope.row.sign_id,scope.row.camp_times_id,scope.row.sign_name)" type="text">查看用户</el-button>
            <el-button size="mini" @click="goDel(scope.row.sign_id)" type="text" :disabled="scope.row.sign_status == '3' || scope.row.sign_status == '2'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="changePaging"/>
    </el-col>
    <el-dialog title="用户押金明细" width="55%" :visible.sync="dialogFormVisible">
      <el-col :span="6">
        <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="listQuery2.search_key" clearable>
        </el-input>
      </el-col>
      <el-col :span="2" class="success-btn">
        <el-button type="success" @click="getUserDepositList()" icon="el-icon-search" size="small">搜索</el-button>
      </el-col>
      <el-col :span="2" :offset="12">
        <!-- <el-button type="primary" @click="outPut()" size="small">导出</el-button> -->
      </el-col>
      <el-col :span="24">
        <el-table 
          tooltip-effect="dark"
          size='small'
          style="width: 100%"
          :data="goodsData"
          class="dialog-table">
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column property="nickname" label="用户昵称" align="center" width="100"></el-table-column>
          <el-table-column property="mobile" label="手机号码" align="center" width="100"></el-table-column>
          <el-table-column property="order_id" label="订单号" align="center" width="250"></el-table-column>
          <el-table-column property="is_back" label="是否返现" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.is_back == 2 ? '否' : '是'}}</span>
            </template>
          </el-table-column>
          <el-table-column property="deposit_amount" label="金额" align="center" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.deposit_amount }}元</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
        <pagination 
          class="pagination"
          v-show="total2>0" 
          :total="total2"
          :page.sync="listQuery2.page_num"
          :limit.sync="listQuery2.page_size" 
          v-on:pagination="changePaging2"/>
      </el-col >
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;" type="primary" size="small">确 定</el-button>
        <!-- <el-button type="primary" @click="bindCourse()">确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteSign,getSignList,getUserDepositList } from "@/api/growthCamp";
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
        search_key: '',
      },
      total: 0,
      listQuery2: {
        page_num: 1,
        page_size: 10,
        search_key: '',
        sign_id: '',
      },
      total2: 0,
      dialogFormVisible: false,
      goodsData: []
    }
  },
  created(){
    this.getSignList();
    this.listQuery.page_num = Number(sessionStorage.getItem('addendManagePage')) || this.listQuery.page_num;
  },
  methods:{
    getSignList(){
      this.listLoading = true;
      setTimeout(() => {sessionStorage.removeItem('addendManagePage')}, 300);
      getSignList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.signList;
          this.total = Number(res.result.count) || 0;
        }
      });
    },
    goDel(id){
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSign({sign_id:id,}).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getSignList();
          }
        });
      }).catch(() => {        
      });
    },
    getUserDepositList(){
      getUserDepositList(this.listQuery2).then(res => {
        if (res.code == 200) {
          this.goodsData = res.result.userList;
          for (let t = 0, len=this.goodsData.length; t < len; t++) {
            if(this.goodsData[t].deposit_amount != '' && this.goodsData[t].deposit_amount != '0'){
              this.goodsData[t].deposit_amount = FentoYuan(Number(this.goodsData[t].deposit_amount));
              function FentoYuan( num ) {
                if ( typeof num !== "number" || isNaN( num ) ) return null;
                return ( num / 100 ).toFixed( 2 );
              }
            }
          }
          this.total2 = Number(res.result.count);
        }
      })
    },
    goDeposit(id,name){
      this.$router.push({ path: `./depositList/${id}` });
      sessionStorage.setItem('sign_name',name);
      sessionStorage.setItem('addendManagePage',this.listQuery.page_num);
    },
    goLibrary(id){
      this.$router.push({ path: `./itemBank/${id}` });
      sessionStorage.setItem('addendManagePage',this.listQuery.page_num);
    },
    goUser(id1,id2,name){
      let id = id1+'_'+id2;
      this.$router.push({ path: `./userInfo/${id}` });
      sessionStorage.setItem('sign_name',name);
      sessionStorage.setItem('addendManagePage',this.listQuery.page_num);
    },
    outPut(){},
    newAddend(v){
      this.$router.push({ path: `./newAddend/${v.sign_id}` });
      sessionStorage.setItem('camp_id',v.camp_id);
      sessionStorage.setItem('camp_times_id',v.camp_times_id);
      sessionStorage.setItem('addendManagePage',this.listQuery.page_num);
    },
    editforms(data){
      let id = data.free_course_id + '&' + data.free_package_id;
      this.$router.push({ path: `./question/${id}` })
    },
    changePaging(){
      this.getSignList();
    },
    changePaging2(){
      this.getUserDepositList();
    },
    searchSignList(){
      this.listQuery.page_num = 1;
      this.getSignList();
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
<template>
  <div class="app_container">
    <el-row class="title-header" type="flex" justify="space-between">
      <el-col :span="8">
        <el-col :span="15">
          <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="listQuery.search">
          </el-input>
        </el-col>
        <el-col :span="4" class="success-btn">
          <el-button type="success" @click="searchData()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
      <el-col :span="1.2">
        <el-button size="small" type="primary" @click="newCamp(listQuery.camp_id)">创建营期</el-button>
      </el-col>
    </el-row>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        height="480"
        fit
        size='mini'
        highlight-current-row>
        <el-table-column type="index" width="40" label="ID">
        </el-table-column>
        <el-table-column label="营期名称" prop="camp_times_name" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.camp_times_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="营期时间" prop="start_time" align="center" width='190'>
          <template slot-scope="scope">
            <span>{{ scope.row.start_time }} - {{ scope.row.end_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="天数" prop="daynum" align="center" width='60'>
          <template slot-scope="scope">
            <span>{{ scope.row.daynum }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="课程播放类型" prop="spec_column_type" align="center" width='120'>
          <template slot-scope="scope">
            <span v-if="scope.row.spec_column_type == '0'">未选择课程</span>
            <span v-if="scope.row.spec_column_type == '1'">训练营课程</span>
            <span v-if="scope.row.spec_column_type == '2'">赠送课程{{ scope.row.is_enable == '1' ? '(天)': ''}}</span>
            <span v-if="scope.row.spec_column_type == '3'">免费课程</span>
          </template>
        </el-table-column> -->
        <el-table-column label="创建者" prop="create_real_name" align="center" width='110'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_real_name == null ? '--' : scope.row.create_real_name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" align="center" width='100'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总用户数" prop="user_count" align="center" width='90'>
          <template slot-scope="scope">
            <el-button @click="goUser(scope.row.camp_times_id)" type="text" size="small">{{ scope.row.user_count }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status == 1 ? " align="center" width='90'>
          <template slot-scope="scope">
            <span>{{ scope.row.status == 1 ? '正在开营' : (scope.row.status > 1 ? '已结营' : '未开营')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='200'>
          <template slot-scope="scope">
            <el-button size="mini" @click="goEdit(scope.row.camp_times_id)" type="text">编辑营期</el-button>
            <el-button size="mini" @click="checkCourse(scope.row.camp_times_id)" type="text" v-if="scope.row.is_course == '1'">课 程</el-button>
            <el-button size="mini" v-if="scope.row.is_task == '1'" @click="checkTask(scope.row)" type="text" :disabled="scope.row.taskDisabled">任 务</el-button>
            <el-button size="mini" v-if="scope.row.is_assess == '1'" @click="checkEvaluation(scope.row)" type="text">测 评</el-button>
            <el-button size="mini" @click="editSign(scope.row)" type="text"  v-if="scope.row.sign_id === null && scope.row.is_sign == '1'">签 到</el-button>
            <el-button size="mini" @click="checkSign(scope.row)" type="text" v-if="scope.row.sign_id != null && scope.row.is_sign == '1'">查看签到</el-button>
            <!-- <el-button size="mini" @click="checkSign(scope.row.sign_id)" type="text" v-if="scope.row.is_sign == '1'">查看签到</el-button> -->
            <!-- <el-button size="mini" @click="editSign(scope.row)" type="text" v-if="scope.row.is_sign == '1'&&scope.row.is_set_sign == '0'">编辑签到</el-button> -->
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

    <el-dialog title="用户明细" width="60%" :visible.sync="dialogFormVisible">
      <el-col :span="7">
        <el-input size="small" placeholder="请输入用户昵称或手机号" prefix-icon="el-icon-search" v-model="listQuery2.search" clearable>
        </el-input>
      </el-col>
      <el-col :span="3.5" :offset="1">
        <el-button size="mini" type="text">是否加入小程序：</el-button>
      </el-col>
      <el-col :span="10">
        <el-col :span="6">
          <el-select v-model="listQuery2.is_in" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-col>
      <el-col :span="2" class="success-btn" :offset="1">
        <el-button type="success" @click="searchList()" icon="el-icon-search" size="small">搜索</el-button>
      </el-col>
      <el-col :span="24">
        <el-table 
          tooltip-effect="dark"
          style="width: 100%"
          height="320"
          :data="goodsData"
          class="dialog-table">
          <el-table-column type="index" width="40" align="center"></el-table-column>
          <el-table-column property="nickname" label="用户昵称" align="center" width="240"></el-table-column>
          <el-table-column property="mobile" label="手机号码" align="center" width="110">
            <template slot-scope="scope">
              <span>{{ scope.row.mobile === null ? '--' : scope.row.mobile }}</span>
            </template>
          </el-table-column>
          <el-table-column property="is_in" label="是否加入小程序" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.is_in == 1 ? '已加入' : '未加入'}}</span>
            </template>
          </el-table-column>
          <el-table-column property="create_time" label="时间" align="center" width="100"></el-table-column>
          <el-table-column label="操作" align="center" width='110'>
            <template slot-scope="scope">
              <el-button size="mini" @click="delUser(scope.row.id)" type="text">移除</el-button>
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
        <el-button size="small" @click="dialogFormVisible = false;">确定</el-button>
        <!-- <el-button size="small" type="primary" @click="bindCourse()">确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addCampTimes,editCampTimes,delCampTimes,campTimesList,campTimesUserList,delCampTimesUser } from "@/api/growthCamp";
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
        camp_id: this.$route.params.Campid,
      },
      total: 0,
      total2: 0,
      taskDisabled: false,
      specColumnInfo:{},
      dialogFormVisible:false,
      goodsData:[],
      listQuery2: {
        page_num: 1,
        page_size: 15,
        camp_times_id: '',
        search: '',
        is_in:'',
      },
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '是'
        },
        {
          value: '2',
          label: '否'
        }
      ]
    }
  },
  created(){
    this.campTimesList();
    this.listQuery.page_num = Number(sessionStorage.getItem('allCampPage')) || this.listQuery.page_num;
  },
  methods:{
    campTimesList(){
      this.listLoading = true;
      setTimeout(() => {sessionStorage.removeItem('allCampPage')}, 300);
      //获取当前时间
      function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      }
      
      campTimesList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          //根据营期时间及是否配置任务判断是否可点
          res.result.list.forEach(v=>{
            if(v.times_task_id === '' && (getNowFormatDate() >= v.start_time)){
              v.taskDisabled = true
            }
          })
          this.specColumnInfo = res.result.specColumnInfo;
          this.lists = res.result.list;
          this.total = res.result.sign.count;
        }
      });
    },
    checkCourse(id){
      this.$router.push({ path: `../courseColumn/${id}` });
      sessionStorage.setItem('allCampPage',this.listQuery.page_num);
    },
    checkTask(data){
      this.$router.push({ path: `../taskManagement/${ data.times_task_id || 'new_task'}` });
      // sessionStorage.setItem('checkTask',data.camp_times_id+'&'+data.camp_times_name+'&'+data.start_time+'&'+data.end_time);
      sessionStorage.setItem('checkTask',data.camp_times_id+'&&'+data.camp_times_name+'&&'+data.start_time+'&&'+data.end_time+'&&'+data.times_task_id);
    },
    checkEvaluation(data){
      this.$router.push({ path: `../evaluation/${ data.assess_id || 'new_assess' }` });
      sessionStorage.setItem( 'camp_times_id',data.camp_times_id );
      // this.$router.push({ path: `../evaluation` });
    },
    checkSign(v){
      let id = v.sign_id;
      // this.$router.push({ path: `/growth/trainingCamp/addendManage/itemBank/${id}` });
      this.$router.push({ path: `/growth/trainingCamp/addendManage/newAddend/${id}` });
      sessionStorage.setItem('camp_times_start_time', v.start_time);
      sessionStorage.setItem('camp_times_end_time', v.end_time);
      sessionStorage.setItem('allCampPage',this.listQuery.page_num);
    },
    editSign(v){
      let id = v.camp_id+'_'+v.camp_times_id;
      // this.$router.push({ path: `../newAddend/${id}` });
      this.$router.push({ path: `/growth/trainingCamp/addendManage/newAddend/${id}` });
      sessionStorage.setItem('camp_times_start_time', v.start_time);
      sessionStorage.setItem('camp_times_end_time', v.end_time);
      sessionStorage.setItem('allCampPage',this.listQuery.page_num);
    },
    newCamp(id){
      this.$router.push({ path: `../newCamp/${id}` });
    },
    goEdit(data){
      this.$router.push({ path: `../newCamp/${data}` });
      sessionStorage.setItem('allCampPage',this.listQuery.page_num);
    },
    goUser(id){
      this.dialogFormVisible = true;
      this.listQuery2.camp_times_id = id;
      this.campTimesUserList();
    },
    delUser(id){
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCampTimesUser({id:id}).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.campTimesUserList();
            this.campTimesList();
          }
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });          
      })
    },
    campTimesUserList(){
      campTimesUserList(this.listQuery2).then(res => {
        if (res.code == 200) {
          this.goodsData = res.result.list;
          this.total2 = res.result.sign.count;
        }
      });
    },
    searchData(){
      this.listQuery.page_num = 1;
      this.campTimesList();
    },
    changePaging(){
      this.campTimesList();
    },
    changePaging2(){
      this.campTimesUserList();
    },
    searchList(){
      this.listQuery2.page_num = 1;
      this.campTimesUserList();
    },
  }
}
</script>

<style lang="scss" scoped>
.app_container{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
  }
  ul{
    // display: flex;
    // justify-content: flex-start;
    // align-items: center;
    list-style: none;
    position: relative;
    width: 100%;
    height: 60px;
    line-height: 60px;
    li:nth-child(1){
      width: 200px;
      line-height: 60px;
      position: absolute;
      left: 0;
    }
    li:nth-child(2){
      width: 300px;
      line-height: 60px;
      position: absolute;
      left: 230px;
    }
  }
}

</style>

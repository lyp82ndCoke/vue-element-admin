<template>
  <div class="app_container">
    <h3>{{ sign_name }}</h3>
    <el-col :span="24" class="title-header">
      <el-col :span="3">
        <el-select v-model="listQuery.search_type" placeholder="请选择用户类型" size="small" 
        clearable @change='changeType1'>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="listQuery.sign_date" placeholder="请选择签到日期" size="small" 
        clearable @change='changeType2'>
          <el-option
            v-for="item in dateList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input size="small" placeholder="请输入用户昵称或手机号码" prefix-icon="el-icon-search" 
        v-model="listQuery.search_key" clearable>
        </el-input>
      </el-col>
      <el-col :span="2" class="success-btn">
        <el-button type="success" @click="searchData()" icon="el-icon-search" size="small">搜索</el-button>
      </el-col>
      <el-col :span="2" class="success-btn">
        <a :href="processHost + 'edu/Sign/getSignUserList?special=skip&sign_id='+listQuery.sign_id+'&camp_times_id='+listQuery.camp_times_id+'&is_export=1'
        +'&search_key='+listQuery.search_key+'&search_type='+listQuery.search_type+'&sign_date='+listQuery.sign_date+'&page_num='+listQuery.page_num+'&page_size=99999'" 
        class="export-form">导出</a>
      </el-col>
    </el-col>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        class="eltables"
        highlight-current-row>
        <el-table-column type="index" width="40" fixed>
        </el-table-column>
        <el-table-column label="用户昵称" prop="userInfo.nickname" align="center" fixed>
        </el-table-column>
        <el-table-column label="手机号码" prop="userInfo.mobile" align="center" fixed>
          <template slot-scope="scope">
            {{ scope.row.userInfo.mobile == '' ? '--' : scope.row.userInfo.mobile }}
          </template>
        </el-table-column>
        <el-table-column  v-for="(item,index) in this.signTime" :key="index" :label="'第'+item.target_day +'天 - '+item.question_time" align="center">
          <template slot-scope="scope">
            <span v-if="lists[scope.$index].signList[index].account_type == '1'">已签<i class="el-icon-star-off el-icons"></i></span>
            <span v-else-if="lists[scope.$index].signList[index].account_type == '2'">已签<i class="el-icon-star-on el-icons"></i></span>
            <span v-else>未签到<i class="el-icon-star-on star-close el-icons" ></i></span>
         </template>
        </el-table-column>

        <!-- <el-table-column  v-for="(item,index) in this.signTime" :key="index" label="操作" align="center" width='100' fixed='right'>
          <template slot-scope="scope">
            <span v-if="lists[scope.$index].signList[index].account_type == '1'">已签<i class="el-icon-star-off el-icons"></i></span>
            <span v-else-if="lists[scope.$index].signList[index].account_type == '2'">已签<i class="el-icon-star-on el-icons"></i></span>
            <span v-else>未签到<i class="el-icon-star-on star-close el-icons" ></i></span>
         </template>
        </el-table-column> -->

        <el-table-column label="签到率" prop="userInfo.sign_rate" align="center" fixed='right'>
          <template slot-scope="scope">
            {{ scope.row.userInfo.sign_rate }}%
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed='right'>
          <template slot-scope="scope">
            <el-button size="mini" @click="goSet(scope.row.userInfo.unionid)" type="text">补签</el-button>
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

    <el-dialog title="选择补签类型" :visible.sync="innerVisible" width="35%" append-to-body>
      <el-form :model="form">
        <el-form-item label="类型选择" :label-width="formLabelWidth">
          <el-radio v-model="form.offset_type" label="2" @change="changeOffsettype(form.offset_type)">亮星星</el-radio>
          <el-radio v-model="form.offset_type" label="1" @change="changeOffsettype(form.offset_type)">补签到</el-radio>
        </el-form-item>
        <el-form-item label="时间选择" :label-width="formLabelWidth">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" id="checkboxList">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="innerVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="offsetSign()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSignUserList,getOffsetSignDateList,offsetSign,getSignDateList } from "@/api/growthCamp";
import Pagination from '@/components/Pagination';

export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      listLoading: false,
      lists:[],
      signTime:[],
      listQuery: {
        page_num: 1,
        page_size: 10,
        search_key: '',
        search_type: '1',
        sign_date: '',
      },
      valueTime: '',
      total: 0,
      sign_name: sessionStorage.getItem('sign_name'),
      value:'',
      radio:[],
      outerVisible: false,
      innerVisible: false,
      form:{
        offset_type:'1',
        select: null
      },
      formLabelWidth: '100px',
      options:[
        {
          value: '1',
          label: '全部'
        },
        {
          value: '3',
          label: '未签到'
        },
        {
          value: '2',
          label: '已签到'
        },
      ],
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: true,
      tableData: [],
      dateList: []
    }
  },
  created(){
    this.processHost = process.env.BASE_API;
    if(this.$route.params.Signid.indexOf('_')>0){
      this.listQuery.sign_id = this.$route.params.Signid.split('_')[0];
      this.listQuery.camp_times_id = this.$route.params.Signid.split('_')[1];
      this.getSignUserList();
      getSignDateList({ sign_id:this.listQuery.sign_id }).then(res => {
        if (res.code == 200) {
          res.result.signDateList.forEach( (item,index) => {
            this.dateList.push({
              value: item.question_time,
              label: item.question_time,
            })
          })
        }
      });
    }
  },
  methods:{
    getSignUserList(){
      this.listLoading = true;
      getSignUserList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.userSignList;
          this.signTime = res.result.signTime;
          this.total = Number(res.result.count);
          this.signTime = res.result.signTime;
        }
      });
    },
    goCheck(v,i){
      this.outerVisible = true;
      this.targetunionid = i.unionid;
      this.tableData = v;
      for (let m = 0,len=this.signTime.length; m < len; m++) {
        this.tableData[m].target_day = this.signTime[m].target_day;
        this.tableData[m].question_time = this.signTime[m].question_time;
      }
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    changeOffsettype(v){
      this.getOffsetSignDateList();
    },
    getOffsetSignDateList(v){
      this.innerVisible = true;
      let data = {
        sign_id: this.listQuery.sign_id,
        unionid: this.targetunionid,
        offset_type: this.form.offset_type,
      }
      getOffsetSignDateList(data).then(res => {
        if (res.code == 200) {
          this.cities = res.result.signTimeList;
        }
      });
    },
    goSet(id){
      this.innerVisible = true;
      this.targetunionid = id;
      let data = {
        sign_id: this.listQuery.sign_id,
        unionid: id,
        offset_type: this.form.offset_type
      }
      getOffsetSignDateList(data).then(res => {
        if (res.code == 200) {
          this.cities = res.result.signTimeList;
        }
      });
    },
    offsetSign(){
      let data = {
        sign_id: this.listQuery.sign_id,
        unionid: this.targetunionid,
        offset_type: this.form.offset_type,
        sign_time: this.checkedCities
      }
      offsetSign(data).then(res => {
        if (res.code == 200) {
          this.innerVisible = false;
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getSignUserList();
        }
      });
      this.checkedCities = [];
    },
    searchData(){
      this.listQuery.page_num = 1;
      this.getSignUserList();
    },
    changePaging(){
      this.getSignUserList();
    },
    changeType1(v){
      this.listQuery.page_num = 1;
      this.listQuery.search_type = v;
      this.getSignUserList();
    },
    changeType2(v){
      this.listQuery.page_num = 1;
      this.listQuery.sign_date = v;
      this.getSignUserList();
    },
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
  .el-icons{
    font-size: 18px;
    color: rgb(255, 35, 35);
  }
  .star-close{
    color: rgb(109, 109, 109);
  }
  .eltables{
    min-height: 500px;
  }
  .export-form{
    color: #fff;
    width: 50px;
    display: block;
    background-color: #409EFF;
    border-color: #409EFF;
    font-size: 12px;
    border-radius: 3px;
    padding: 8px 5px;
    text-align: center;
    margin-top: 1px;
  }
}
#checkboxList {
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
}
</style>
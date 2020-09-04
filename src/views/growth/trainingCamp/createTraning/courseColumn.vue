<template>
  <div class="app_container">
    <el-col :span="24" class="title-header1">
      <p><b>{{campTimesInfo.camp_times_name}}</b></p>
      <span>营期时间：{{campTimesInfo.start_time}}  -  {{campTimesInfo.end_time}}</span>
    </el-col>
    <el-col :span="4" class="title-header2">
      <el-button size="mini" type="primary" @click="selectCourse(listQuery.camp_id)">添加专栏</el-button>
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
        <el-table-column label="ID" prop="id" align="center" width='55'>
        </el-table-column>
        <el-table-column label="封面图" prop="cover_img" align="center" width='105'>
          <template slot-scope="scope">
            <img :src="scope.row.cover_img" alt="" width="85" height="60">
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="spec_column_title" align="left">
        </el-table-column>
        <el-table-column label="简介" prop="spec_column_introduction" align="center" width='270'>
        </el-table-column>
        <el-table-column label="专栏类型" prop="type" align="center" width='105'>
          <template slot-scope="scope">
            <span>{{ scope.row.type == '1' ? '训练营专栏' : (scope.row.type == '2' ? '赠送课程专栏' : '免费专栏' ) }}{{ scope.row.is_enable == '1' ? '(天)': ''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="总章节数" prop="spec_column_count" align="center" width='65'>
          <template slot-scope="scope">
            <span>{{ scope.row.spec_column_count}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已选章节数" prop="spec_column_course_count" align="center" width='65'>
        </el-table-column>
        <el-table-column label="创建者" prop="create_real_name" align="center" width='95'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_real_name === null ? '--' : scope.row.create_real_name }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="上传日期" prop="create_time" align="center" width='90'>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width='115'>
          <template slot-scope="scope">
            <el-button size="mini" @click="goCheck(scope.row.spec_column_id)" type="text">查看课程</el-button>
            <el-button size="mini" @click="goDel(scope.row.spec_column_id)" :disabled="scope.row.is_can_delete == 0" type="text">删除</el-button>
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

    <el-dialog title="选择专栏" width="75%" :visible.sync="dialogFormVisible">
      <el-col :span="7">
        <el-input size="small" placeholder="请输入专栏名称" prefix-icon="el-icon-search" v-model="listQuery2.search" clearable>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="searchData()" size='mini'>搜索</el-button>
      </el-col>
      <el-col :span="24">
        <el-table
          ref="singleTable"
          :data="tableData"
          highlight-current-row
          size="small"
          height="300"
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column 
            type="selection" 
            width="50" 
            align="center">
          </el-table-column>
          <el-table-column
            prop="cover_img"
            label="封面图"
            width="100"
            align="center">
            <template slot-scope="scope">
              <img :src="scope.row.cover_img" alt="" width='90' height="60">
            </template>
          </el-table-column>
          <el-table-column
            prop="spec_column_title"
            label="标题"
            align="center">
          </el-table-column>
          <el-table-column
            prop="spec_column_introduction"
            label="简介"
            align="center">
          </el-table-column>
          <el-table-column label="专栏类型" prop="type" align="center" width='100'>
            <template slot-scope="scope">
              <span>
                {{ scope.row.type == '1' ? '训练营专栏' : (scope.row.type == '2' ? '赠送课程专栏' : '免费课程专栏' ) }}
                {{ scope.row.is_enable == '1' ? '(天)': ''}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="spec_column_count"
            label="总章节数"
            width="80" 
            align="center">
          </el-table-column>
          <el-table-column
            prop="spec_column_count_now"
            label="已选章节数"
            width="100" 
            align="center">
          </el-table-column>
          <el-table-column
            prop="create_real_name"
            label="创建者"
            width="70" 
            align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.create_real_name === null ? '--' : scope.row.create_real_name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="上传日期"
            width="85" 
            align="center">
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
        <el-button size="small" @click="dialogFormVisible = false;">取 消</el-button>
        <el-button size="small" type="primary" @click="bindCourse()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getCampTimesSpecColumnList,addCampTimesSpecColumn,specColumnList,delCampTimesColumn } from "@/api/growthCamp";
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
        camp_times_id: this.$route.params.Campid,
      },
      total: 0,
      total2: 0,
      specColumnInfo:{},
      dialogFormVisible:false,
      campTimesInfo: {},
      dayMax:1,
      listQuery2: {
        page_num: 1,
        page_size: 6,
        is_camp: '1',
        search:'',
        camp_times_id: this.$route.params.Campid,
      },
      listQuery3: {
        page_num: 1,
        page_size: 20,
        spec_column_id:''
      },
      tableData:[],
      spec_column_id:'',
    }
  },
  created(){
    this.listLoading = false;
    this.campTimesCourseList();
    // this.getAllData();
  },
  filters:{
    formatSeconds(value) {
      if(value != ''){
        let result = parseInt(value);
    　　let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    　　let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    　　let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    　　result = `${h}:${m}:${s}`
    　　return result;
      }
    }
  },
  methods:{
    campTimesCourseList(){
      this.listLoading = true;
      getCampTimesSpecColumnList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.spec_column.list;
          this.total = Number(res.result.spec_column.count);
          this.campTimesInfo = res.result.camp_times_info;
        }
      });
    },
    goCheck(id){
      let data = id+'&'+this.campTimesInfo.camp_times_id;
      this.$router.push({ path: `../allCourse/${data}` });
      // sessionStorage.setItem('camp_times_id',this.$route.params.Campid);
    },
    goDel(id){
      this.$confirm('确定删除此专栏课程吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCampTimesColumn({ camp_times_id: this.listQuery.camp_times_id, spec_column_id:id }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.campTimesCourseList();
          }
        });
      })
    },
    //选择专栏
    selectCourse(){
      this.dialogFormVisible = true;
      this.listQuery2.page_num = 1;
      this.specColumnList();
    },
     //获取专栏列表
    specColumnList(){
      specColumnList(this.listQuery2).then(res => {
        if (res.code == 200) {
          this.tableData = res.result.list;
          this.total2 = res.result.sign.count;
        }
      });
    },
    //确定绑定专栏
    bindCourse(){
      let data = {
        camp_times_id: this.$route.params.Campid,
        spec_column_list:[],
      }
      for (let index = 0,len = this.multipleSelection.length; index < len; index++) {
        data.spec_column_list.push(this.multipleSelection[index].spec_column_id);
      }
      // console.log('data',data);
      addCampTimesSpecColumn(data).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.campTimesCourseList();
          this.dialogFormVisible = false;
          this.listQuery2.search = '';
        }
      });
    },
    changePaging(){
      this.campTimesCourseList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changePaging2(){
      this.specColumnList();
    },
    searchData(){
      this.listQuery2.page_num = 1;
      this.specColumnList();
    }
  }
}
</script>

<style lang="scss" scoped>
.app_container{
  padding: 20px;
  .title-header1{
    height: 62px;
    line-height: 4px;
    margin-bottom: 10px;
    padding-left: 10px;
    background: rgb(245, 244, 244);
    p{
      font-size: 16px;
      height: 12px;
      margin-bottom: 14px;
    }
    span{
      font-size: 14px;
    }
  }
  .title-header2{
    margin-bottom: 10px;
    width: 100%;
    .el-button{
      float: right;
    }
  }
  .eltables{
    min-height: 530px;
  }
}
</style>
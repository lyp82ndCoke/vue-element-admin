<template>
  <div class="app_container">
    <el-col :span="24" class="title-header">
      <p><b>{{campTimesInfo.camp_times_name}}</b></p>
      <p><span>营期时间：{{campTimesInfo.start_time}} - {{campTimesInfo.end_time}}</span></p>
    </el-col>
    <el-col :span="24" class="title-header2">
      <img :src="spec_column_info.cover_img" width="90" height="60">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{spec_column_info.spec_column_title}}</span>
    </el-col>
    <el-col :span="24">
      <el-row :span="24" class="title-header3" type="flex" justify="space-between">
        <el-col :span="10">
          <el-col :span="11">
            <el-input size="small" placeholder="请输入课程标题" prefix-icon="el-icon-search" v-model="listQuery.search_title" clearable>
            </el-input>
          </el-col>
          <el-col :span="4" class="success-btn">
            <el-button type="success" @click="searchData1()" icon="el-icon-search" size="small">搜索</el-button>
          </el-col>
        </el-col>
        <el-row :span="5" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="allEdit()" :disabled="editOption">批量编辑</el-button>
          <el-button size="mini" type="primary" @click="selectCourse(listQuery.camp_id)">添加课程</el-button>
        </el-row>
      </el-row>
    </el-col>
    
    <el-col :span="24" class="title-content ">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        height="440"
        :row-class-name="tableRowClassName"
        highlight-current-row>
        <el-table-column label="排序" prop="sort" align="center" width='140' >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.sort" @change="handleChange(scope.row)" :min="1" :max="999" size="mini" v-if='editOption'></el-input-number>
            <span v-else>{{ scope.row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column label="解锁天数" prop="deblock_day" align="center" width='140' v-if="spec_column_info.type != '2'">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.deblock_day" @change="handleChange2(scope.$index,scope.row)" :min="1" :max="dayMax" size="mini" 
            v-if='editOption && spec_column_info.type == "1" '></el-input-number>
            <span v-else>{{ scope.row.deblock_day }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开课时间" prop="start_time" align="center" width='140' v-if="spec_column_info.type != '2'">
          <template slot-scope="scope">
            <span> {{ scope.row.start_time === null || scope.row.start_time === '0000-00-00' ? '--' : scope.row.start_time }} </span> 
          </template>
        </el-table-column>
        <el-table-column label="课程标题" prop="audio_title" align="left">
        </el-table-column>
        <el-table-column label="文件类别" prop="type" align="center" width='70'>
          <template slot-scope="scope">
            <span>{{ scope.row.type == '1' ? '音频' : '视频'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件时长" prop="audio_length" align="center" width='70'>
        </el-table-column>
        <el-table-column label="上传者" prop="create_real_name" align="center" width='100'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_real_name === null ? '--' : scope.row.create_real_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" width='70'>
          <template slot-scope="scope">
            <span>{{ scope.row.status == '1' ? '已解锁' : '未解锁'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='110'>
          <template slot-scope="scope">
            <el-button size="mini" @click="editCourse(scope.row.course_id)" type="text" >编辑</el-button>
            <el-button size="mini" @click="goDel(scope.$index,scope.row.id)" type="text" :disabled="scope.row.is_can_delete == 0" v-if="!editOption">删除</el-button>
            <el-button size="mini" @click="goDel(scope.$index,scope.row.id)" type="text" v-else>删除</el-button>
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
    <el-col slot="footer" class="dialog-footer2" v-if='editOption'>
      <el-button size="small" @click="allCancel()"> 取 消 </el-button>
      <el-button size="small" type="primary" @click="allSubmit()"> 提 交 </el-button>
    </el-col>

    <el-dialog title="添加课程" width="75%" :visible.sync="dialogFormVisible">
      <el-col :span="7">
        <el-input size="small" placeholder="请输入专栏名称" prefix-icon="el-icon-search" v-model="listQuery2.search" clearable>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="searchData2()" size='mini'>搜索</el-button>
      </el-col>
      <el-col :span="24">
        <el-table
          ref="singleTable"
          :data="tableData"
          highlight-current-row
          size="small"
          height="320"
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column 
            type="selection" 
            width="50" 
            align="center">
          </el-table-column>
          <el-table-column
            prop="id"
            label="ID"
            width="55">
          </el-table-column>
          <el-table-column
            prop="audio_title"
            label="课程标题"
            align="left">
          </el-table-column>
          <el-table-column label="文件类型" prop="type" align="center" width='80'>
            <template slot-scope="scope">
              <span>{{ scope.row.type == '1' ? '音频' : '视频' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="文件时长" prop="audio_length" align="center" width='110'>
            <template slot-scope="scope">
              <span>{{ scope.row.audio_length | formatSeconds}}</span>
            </template>
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
            width="185" 
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
        <el-button size="small" type="primary" @click="Submit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { campTimesCourseList,getCampTimesSpecColumnCourseList, delCampTimesCourse,specColumnList,bindCampTimesColumnCourse,editCampTimesCourse,specColumnCourseList } from "@/api/growthCamp";
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
        search_title:'',
        spec_column_id: '',
        camp_times_id: '',
      },
      total: 0,
      total2: 0,
      specColumnInfo:{},
      dialogFormVisible: false,
      spec_column_info:{},
      campTimesInfo:{},
      dayMax:1,
      listQuery2: {
        page_num: 1,
        page_size: 10,
        is_camp: '1',
        search:'',
        spec_column_id: '',
        camp_times_id: '',
      },
      editOption: false,
      tableData:[],
      currentRow: [],
      spec_column_type:'',
      spec_column_id:'',
      allCourse:[],
      count: 0,
    }
  },
  created(){
    this.listLoading = true;
    this.listQuery.spec_column_id = this.$route.params.Courseid.split('&')[0];
    this.listQuery.camp_times_id = this.$route.params.Courseid.split('&')[1];
    this.listQuery2.spec_column_id = this.$route.params.Courseid.split('&')[0];
    this.listQuery2.camp_times_id = this.$route.params.Courseid.split('&')[1];
    this.getCampTimesSpecColumnCourseList();
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
    getCampTimesSpecColumnCourseList(){
      getCampTimesSpecColumnCourseList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.course.list;
          this.total = Number(res.result.course.count);
          this.campTimesInfo = res.result.camp_times_info;
          this.spec_column_info = res.result.spec_column_info;
          this.dayMax = this.getDays(this.campTimesInfo.start_time,this.campTimesInfo.end_time);

          for (let k = 0,len=this.lists.length; k < len; k++) {
            this.lists[k].origin_start_time = this.campTimesInfo.start_time;
            if(this.lists[k].is_show == '2'){
              this.count += 1;
            }
          }

        }
      })
    },
    //获取全量课程
    getAllData(){
      getCampTimesSpecColumnCourseList({ page_num: 1,page_size: 999, camp_times_id: this.listQuery2.camp_times_id,
        spec_column_id:this.listQuery2.spec_column_id }).then(res => {
        if (res.code == 200) {
          this.allCourse = JSON.parse(JSON.stringify(res.result.course.list));
          sessionStorage.setItem('tempData',JSON.stringify(res.result.course.list));
        }
      })
    },
    //课程弹窗
    selectCourse(){
      this.dialogFormVisible = true;
      this.listQuery2.page_num = 1;
      this.specColumnCourseList();
    },
    //获取课程列表
    specColumnCourseList(){
      this.listQuery.spec_column_id = this.listQuery.spec_column_id;
      this.listQuery.camp_times_id = this.listQuery.camp_times_id;
      specColumnCourseList(this.listQuery2).then(res => {
        if (res.code == 200) {
          this.tableData = res.result.list;
          this.total2 = res.result.sign.count;
        }
      });
    },
    //绑定所选课程
    Submit(){
      let data = {
        camp_times_id: this.listQuery.camp_times_id,
        spec_column_id: this.listQuery.spec_column_id,
        course_ids: [],
      }
      for (let index = 0,len = this.multipleSelection.length; index < len; index++) {
        data.course_ids.push(this.multipleSelection[index].course_id);
      }
      bindCampTimesColumnCourse(data).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '课程添加成功！',
            type: 'success'
          });
          // this.getAllData();
          this.listQuery2.page_num = 1;
          this.dialogFormVisible = false;
          this.getCampTimesSpecColumnCourseList();
          this.getAllData();
          this.editOption = true;
          this.count = 0;
        }
      });
    },
    goDel(index,id){
      this.$confirm('确定删除此课程吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCampTimesCourse({id:id}).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getCampTimesSpecColumnCourseList();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    editCourse(data){
      this.$router.push({ path: `/growth/trainingCamp/courseLibrary/newCourse/${data}` });
    },
    //点击批量编辑
    allEdit(){
      this.editOption = !this.editOption;
      if(this.lists[0].start_time === null){
        for (let k = 0,len=this.lists.length; k < len; k++) {
          this.lists[k].start_time = this.campTimesInfo.start_time;
          this.lists[k].origin_start_time = this.campTimesInfo.start_time;
        }
      }
      this.getAllData();
    },
    //最后编辑完提交
    allSubmit(){
      let count = 0;
      this.lists.forEach((v,i) => {
        if(v.is_show == '2' && v.sort == '1' && v.deblock_day == '1'){
          count += 1;
        }
      })
      if(this.count > 0 && count == this.count){
        this.$confirm('新添加的课程还未编辑，确定要保存吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.allSubmit2();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        })
      }else{
        this.allSubmit2();
      }
    },
    allSubmit2(){
      let tempData = JSON.parse(sessionStorage.getItem('tempData'));
      let data = {
        camp_times_id: this.listQuery.camp_times_id,
        spec_column_id: this.listQuery.spec_column_id,
        course_list: [],
      }
      this.allCourse.forEach((ele,i) => {
        tempData.forEach((item,index) => {
          if((ele.course_id == item.course_id && ele.sort != item.sort) || (ele.course_id == item.course_id && ele.deblock_day != item.deblock_day)){
            data.course_list.push(ele);
          }
        });
      });
      // console.log('allSubmit2',data);
      editCampTimesCourse(data).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.listQuery.page_num = 1;
          this.editOption = false;
          this.getCampTimesSpecColumnCourseList();
          this.count = 0;
        }
      });
    },
    //最后编辑完取消
    allCancel(){
      this.editOption = false;
      this.listQuery.page_num = 1;
      this.getCampTimesSpecColumnCourseList();
    },
    tableRowClassName({row, rowIndex}) {
      if (row.is_show === '2') {
        return 'warningRow';
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changePaging(){
      this.getCampTimesSpecColumnCourseList();
    },
    changePaging2(){
      this.specColumnCourseList();
    },
    searchData1(){
      this.listQuery.page_num = 1;
      this.getCampTimesSpecColumnCourseList();
    },
    searchData2(){
      this.listQuery2.page_num = 1;
      this.specColumnCourseList();
    },
    getDays(sDate1,sDate2){
      var dateSpan,tempDate,iDays;
      sDate1 = Date.parse(sDate1);
      sDate2 = Date.parse(sDate2);
      dateSpan = sDate2 - sDate1;
      dateSpan = Math.abs(dateSpan);
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
      return iDays+1;
    },
    //排序值修改
    handleChange(value) {
      this.allCourse.forEach((ele,i) => {
        if(value.course_id == ele.course_id){
          this.allCourse[i] = value;
        }
      });
    },
    //解锁天数修改
    handleChange2(i,v) {
      this.allCourse.forEach((ele,i) => {
        if(v.course_id == ele.course_id){
          this.allCourse[i] = v;
        }
      });

      let O = new Date(v.origin_start_time);
      let N = O.setDate(O.getDate() + this.lists[i].deblock_day - 1);
      N = new Date(O).toLocaleDateString();
      var t = new Date(O);

      if((t.getMonth() + 1) < 10 && (t.getDate()) < 10){
        this.lists[i].start_time = t.getFullYear() + '-' + '0' + (t.getMonth() + 1) + '-' + '0' + t.getDate();
      }else if((t.getMonth() + 1) < 10 && (t.getDate()) > 9){
        this.lists[i].start_time = t.getFullYear() + '-' + '0' + (t.getMonth() + 1) + '-' + t.getDate();
      }else if((t.getMonth() + 1) > 9 && (t.getDate()) < 10){
        this.lists[i].start_time = t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + '0' + t.getDate();
      }else{
        this.lists[i].start_time = t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app_container{
  padding: 15px;
  .title-header{
    background: rgb(245, 244, 244);
    height: 60px;
    padding-left: 10px;
    p{
      height: 8px;
      line-height: 8px;
      font-size: 16px;
      color: #333;
      span{
        font-size: 14px;
      }
    }
  }
  .title-header3{
    margin-bottom: 15px;
  }
  .title-header2{
    margin: 10px 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 80px;
    line-height: 80px;
    background: rgb(245, 244, 244);
    padding-left: 10px;
    font-size: 14px;
  }
  .dialog-footer2{
    text-align: center;
    margin-bottom: 15px;
  }
}
</style>
<style>
.el-table .warningRow {
  background: rgb(245, 244, 244);
}
</style>
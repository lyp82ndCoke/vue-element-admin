<template>
  <div class="app_container">
    <el-row type="flex" class="title-header" justify="space-between">
      <el-col :span="9">
        <el-col :span="8">
          <img :src="specColumnInfo.cover_img" alt="" width="125" height="70">
        </el-col>
        <el-col :span="16">
          <h4>{{specColumnInfo.spec_column_title}}</h4>
        </el-col>
      </el-col>
      <el-col :span="1.2">
        <el-button size="small" type="primary" @click="newCourse()">添加课程</el-button>
      </el-col>
      <!-- <el-col :span="5">
        <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="listQuery.search">
        </el-input>
      </el-col>
      <el-col :span="2" class="success-btn">
        <el-button type="success" @click="courseList()" icon="el-icon-search" size="small">搜索</el-button>
      </el-col> -->
    </el-row> 
    <el-col :span="24" class="title-content ">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        fit
        height="460"
        size='mini'
        highlight-current-row>
        <el-table-column type="index" width="50" align="center">
        </el-table-column>
        <el-table-column label="课程标题" prop="audio_title" align="left">
        </el-table-column>
        <el-table-column label="文件类别" prop="type" align="center" width='130'>
          <template slot-scope="scope">
            <span>{{ scope.row.type == '1' ? '音频' : '视频' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件时长" prop="audio_length" align="center" width='130'>
          <template slot-scope="scope">
            <span>{{ scope.row.audio_length | formatSeconds }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传者" prop="create_real_name" align="center" width='150'>
          <template slot-scope="scope">
            <span>{{ scope.row.create_real_name === null ? '--' : scope.row.create_real_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='150'>
          <template slot-scope="scope">
            <el-button size="mini" @click="goEdit(scope.row.course_id)" type="text">编辑</el-button>
            <el-button size="mini" @click="goDel(scope.row.id)" type="text">删除</el-button>
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
    <el-dialog title="选择关联课程" width="75%" :visible.sync="dialogFormVisible">
      <el-col :span="7">
        <el-input size="small" placeholder="请输入专栏名称" prefix-icon="el-icon-search" v-model="listQuery2.search" clearable>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="searchData()" size='small'>搜索</el-button>
      </el-col>
      <el-col :span="24">
        <el-table 
          ref="multipleTable"
          tooltip-effect="dark"
          height="370"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :data="goodsData"
          class="dialog-table">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column property="id" label="ID" align="center" width="70"></el-table-column>
          <el-table-column property="audio_title" label="课程标题" align="left"></el-table-column>
          <el-table-column property="type" label="文件类型" align="center" width="80">
            <template slot-scope="scope">{{ scope.row.type == '1' ? '音频' : '视频' }}</template>
          </el-table-column>
          <el-table-column property="audio_length" label="文件时长" align="center" width="100"></el-table-column>
          <el-table-column property="create_time" label="上传时间" align="center" width="100"></el-table-column>
          <el-table-column property="create_real_name" label="上传者姓名" align="center" width="120"></el-table-column>
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
        <el-button @click="dialogFormVisible = false;listQuery2.search = '';" size="small">取 消</el-button>
        <el-button type="primary" @click="bindCourse()" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { specColumnCourseList,delSpecColumnCourse,courseList,bindSpecColumnCourse } from "@/api/growthCamp";
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
        spec_column_id: this.$route.params.Columnid,
      },
      total: 0,
      total2: 0,
      specColumnInfo:{},
      dialogFormVisible:false,
      goodsData:[],
      listQuery2: {
        page_num: 1,
        page_size: 15,
        spec_column_id: '',
        search: '',
      }
    }
  },
  created(){
    this.specColumnCourseList();
    this.listQuery.page_num = Number(sessionStorage.getItem('allCoursePage')) || this.listQuery.page_num;

  },
  filters:{
    formatSeconds(value) {
      if(value != ''){
        let result = parseInt(value)
    　　let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
    　　let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
    　　let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
    　　result = `${h}:${m}:${s}`
    　　return result
      }
    }
  },
  methods:{
    specColumnCourseList(){
      this.listLoading = true;
      setTimeout(() => {sessionStorage.removeItem('allCoursePage')}, 300);
      specColumnCourseList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.list;
          this.specColumnInfo = res.result.specColumnInfo;
          this.total = res.result.sign.count;
          this.listQuery2.spec_column_id = res.result.specColumnInfo.spec_column_id;
        }
      });
    },
    goDel(id){
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSpecColumnCourse({id:id}).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.specColumnCourseList();
          }
        });
      }).catch(() => {
                
      })
    },
    goEdit(data){
      this.$router.push({ path: `/growth/trainingCamp/courseLibrary/newCourse/${data}` });
      sessionStorage.setItem('allCoursePage',this.listQuery.page_num);
    },
    newCourse(){
      this.dialogFormVisible = true;
      courseList(this.listQuery2).then(res => {
        if (res.code == 200) {
          this.goodsData = res.result.list;
          this.total2 = res.result.sign.count;
        }
      });
    },
    changePaging2(){
      this.newCourse();
    },
    bindCourse(){
      let data = {
        spec_column_id: this.$route.params.Columnid,
        course_ids:[],
      }
      for (let index = 0,len = this.multipleSelection.length; index < len; index++) {
        data.course_ids.push(this.multipleSelection[index].course_id);
      }
      console.log('data',data);
      bindSpecColumnCourse(data).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.specColumnCourseList();
          this.dialogFormVisible = false;
          this.listQuery2.search =  '';
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changePaging(){
      this.specColumnCourseList()
    },
    searchData(){
      this.listQuery2.page_num = 1;
      this.newCourse();
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
}

</style>
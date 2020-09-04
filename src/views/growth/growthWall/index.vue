<template>
  <div class="app_container">
    <el-col :span="24" class="title-header">
      <el-col :span="3" >
        <el-date-picker
          size="small"
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
      <el-col :span="4" :offset="5">
        <el-input size="small" placeholder="请输入用户昵称或手机号" clearable prefix-icon="el-icon-search" v-model="listQuery.search">
        </el-input>
      </el-col>
      <el-col :span="2" class="success-btn" align="right">
        <el-button type="success" @click="searchData()" icon="el-icon-search" size="small">搜索</el-button>
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
        highlight-current-row>
        <el-table-column label="用户昵称" prop="nickname" align="center" width='100'>
        </el-table-column>
        <el-table-column label="手机号码" prop="mobile" align="center" width='110'>
          <template slot-scope="scope">
            <span>{{scope.row.mobile === null || scope.row.mobile === '' ? '--' : scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column label="地区" prop="district" align="center" width='100'>
          <template slot-scope="scope">
            <span>{{scope.row.district === '' ? '--' : scope.row.district}}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容详情" prop="details" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.details == ''">只发布了图片~，请点击“查看详情”查阅</span>
            <span v-else-if="scope.row.details.length < 71">{{ scope.row.details }}</span>
            <el-popover v-else
              placement="top"
              width="600"
              height="500"
              trigger="hover"
              :content="scope.row.details.slice(0,573)">
              <span slot="reference">{{ scope.row.details.slice(0,70) + '。。。' }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="内容点赞数" prop="zan_num" align="center" width='90'>
        </el-table-column>
        <el-table-column label="评论数" prop="comment_count" align="center" width='80'>
          <template slot-scope="scope">
            <span>{{scope.row.comment_count === null ? '--' : scope.row.comment_count}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="create_time" align="center" width='150'>
          <template slot-scope="scope">
            <span>{{scope.row.create_time === null ? '--' : scope.row.create_time}}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前状态" prop="status" align="center" width='80'>
          <template slot-scope="scope">
            <span>{{scope.row.is_show == '1' ? '已显示' : '已隐藏'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='180'>
          <template slot-scope="scope">
            <el-button size="mini" @click="check1(scope.row.growth_wall_id)" type="text">查看详情</el-button>
            <el-button size="mini" @click="check2(scope.row.growth_wall_id)" type="text">查看评论</el-button>
            <el-button size="mini" @click="display(scope.row.growth_wall_id,scope.row.is_show)" type="text">{{scope.row.is_show == '1' ? '隐藏' : '显示'}}</el-button>
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

      <el-dialog title="查看评论" width="50%" :visible.sync="dialogTableVisible">
      <el-table :data="gridData1" border fit size='mini'>
        <el-table-column property="nickname" label="用户昵称" width='110' align="center"></el-table-column>
        <el-table-column property="comment_contents" label="详情" align="center"></el-table-column>
        <el-table-column property="is_show" label="当前状态" width='80' align="center">
          <template slot-scope="scope">
            <span>{{scope.row.is_show == '1' ? '已显示' : '已隐藏'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column property="option" label="操作" width='50' align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="display2(scope.row.comment_id,scope.row.is_show)" type="text">{{scope.row.is_show == '1' ? '隐藏' : '显示'}}</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <pagination 
        class="pagination"
        v-show="total2>0"
        :total="total2"
        :page.sync="listQuery2.page_num"
        :limit.sync="listQuery2.page_size"
        v-on:pagination="changePaging2"
      />

      </el-dialog>
      <el-dialog title="查看详情" width="50%" :visible.sync="dialogTableVisible2">
        <el-form :model="gridData2">
          <el-form-item label="图片介绍" prop="details" :label-width="formLabelWidth" v-if="gridData2.pic_urls">
            <p class="photoList">
              <!-- <img v-for="item in gridData2.pic_urls" :key="item.index" :src="'https://traceless.oss-cn-beijing.aliyuncs.com/'+item" alt="" > -->
              <img v-for="item in gridData2.pic_urls" :key="item.index" :src="item" alt="" >
            </p>
          </el-form-item>
          <el-form-item label="详情" prop="details" :label-width="formLabelWidth" v-if="gridData2.details">
            <span>{{gridData2.details}}</span>
          </el-form-item>
        </el-form>
        
      </el-dialog>
    </el-col>
  </div>
</template>
<script>
import { growthWallShowDisplay,listScan,growthWallList,scanComments,commentsShowDisplay } from "@/api/growthCamp";
import Pagination from '@/components/Pagination';

export default {
  name:'',
  components: { Pagination },

  data(){
    return{
      listLoading: true,
      listQuery: {
        page_num: 1,
        page_size: 12,
        search:'',
      },
      total: 0,
      total2: 0,
      dialogTableVisible: false,
      dialogTableVisible2: false,
      formLabelWidth: '100px',
      value1: '',
      listLoading: true,
      gridData1:[],
      gridData2:{
        details:'',
        pic_urls:[]
      },
      lists:[],
      listQuery2: {
        page_num: 1,
        page_size: 5,
        growth_wall_id:'',
      },
      id:''
    }
  },
  created(){
    this.growthWallList();
  },
  methods:{
    growthWallList(){
      this.listLoading = true;
      if(this.value1){
        this.listQuery.start_time = this.value1[0];
        this.listQuery.end_time = this.value1[1];
      }else{
        this.listQuery.start_time = '';
        this.listQuery.end_time = '';
      }
      growthWallList(this.listQuery).then((res) => {
        if (res.code == 200) {
          this.listLoading = false;
          this.lists = res.result.list;
          this.total = res.result.count;
        }
      })
    },
    display(id,v){
      growthWallShowDisplay({growth_wall_id:id,is_show:v=='1'?1:2,}).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '操作成功',
            type: "success"
          });
          this.growthWallList();
        }
      })
    },
    display2(id,v){
      commentsShowDisplay({comment_id:id,is_show:v=='1'?1:2,}).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '操作成功',
            type: "success"
          });
          this.check2(this.id);
        }
      })
    },
    check1(id){
      this.gridData2 = {};
      listScan({growth_wall_id:id,}).then((res) => {
        if (res.code == 200) {
          this.gridData2.details = res.result.details;
          if(res.result.pic_urls.length > 0){
            this.gridData2.pic_urls = res.result.pic_urls;
          }
          this.dialogTableVisible2 = true;
        }
      })
    },
    check2(id){
      this.dialogTableVisible = true;
      this.id = id;
      this.listQuery2.growth_wall_id = id;
      scanComments(this.listQuery2).then((res) => {
        if (res.code == 200) {
          this.total2 = res.result.count;
          this.gridData1 = res.result.list;
        }
      })
    },
    searchData(){
      this.listQuery.page_num = 1;
      this.growthWallList();
    },
    changePaging(){
      this.growthWallList();
    },
    changePaging2(){
      this.check2();
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
  .photoList{
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    img{
      width: auto;
      max-width: 140px;
    }
  }
}
</style>
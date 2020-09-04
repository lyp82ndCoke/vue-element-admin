<template>
  <div class="app_container-article">
    <el-col :span="24" class="title-header">
      <el-col :span="24">
        <el-col :span="5">
          <el-input size="small" clearable placeholder="请输入用户昵称或手机号"  v-model="listQuery.search_title" @clear="clearTitle"></el-input>
        </el-col>
        <el-col :span="4" align="center">
          <el-select v-model="listQuery.search_category" clearable placeholder="请选择分类" size="small" @change="clearTitle">
            <el-option
              v-for="item in options2"
              :key="item.index"
              :label="item.task_category_name"
              :value="item.task_category">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" align="center">
          <el-select v-model="listQuery.search_status" clearable placeholder="请选择状态" size="small" @change="clearTitle">
            <el-option
              v-for="item in [{label:'全部状态',value: ''},{label:'已公开',value: 1},{label:'未公开',value: 2}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" align="center" style="margin-left:20px;">
          <el-select v-model="listQuery.search_essence" clearable placeholder="请选择" size="small" @change="clearTitle">
            <el-option
              v-for="item in [{label:'全部',value: ''},{label:'已精选',value: '1'},{label:'未精选',value: '2'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" align="center">
          <el-select v-model="listQuery.search_time" clearable placeholder="请选择时间" size="small" @change="clearTitle">
            <el-option
              v-for="item in taskInfo.time_list"
              :key="item.task_content_time"
              :label="item.task_content_time+' '+'第'+item.target_day+'天'"
              :value="item.task_content_time">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1" class="success-btn" align="right">
          <el-button type="success" @click="clearTitle()" size="small">搜索</el-button>
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
        @sort-change="sortChange"
        highlight-current-row>
        <el-table-column label="用户昵称" align="center" width="120">
          <template slot-scope="scope">
            <el-col :span="24"><img :src="scope.row.headimgurl" width="80" alt=""></el-col>
            <el-col :span="24">{{scope.row.nickname}}</el-col>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" prop="mobile" align="center" width="120"></el-table-column>
        <el-table-column label="任务说明" prop="is_show" align="center" width="120">
          <template slot-scope="scope">
            <el-col :span="24"><img :src="scope.row.task_img_url" width="80" alt=""></el-col>
            <el-col :span="24">
              <el-button size="mini" type="text" @click="taskDescript(scope.row.task_content)">
                {{ scope.row.task_category_name }}
              </el-button>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column label="任务完成情况" prop="title" align="center">
          <template slot-scope="scope">
            <el-col :span="24" class="details-color" @click.native="seeDetails(scope.row.details, scope.row.pic_url)">
              <el-col :span="24" class="text-3" v-if="scope.row.details">
                {{scope.row.details}}
              </el-col>
              <el-col :span="24" v-if="scope.row.pic_url.length>0">
                <img v-for="(itm,idx) in scope.row.pic_url" :key="idx" :src="itm" alt="" class="pic-url">
              </el-col>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column label="任务完成时间" prop="submit_date" align="center" width="120"></el-table-column>
        <el-table-column label="点赞总量" sortable="custom" prop="zan_num" align="center"  width="100"></el-table-column>
        <el-table-column label="评论量" sortable="custom" prop="comment_count_num" align="center" width="100"></el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.is_open == 1 ? '公开' : '隐藏'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='130'>
          <template slot-scope="scope">
            <el-button v-if="scope.row.is_open == 1&&scope.row.is_essence==2"  size="mini" type="text" @click="setDeposit(scope.row.task_submit_id, scope.row.is_essence)">设为精选</el-button>
            <el-button v-if="scope.row.is_essence == 1" size="mini" type="text" @click="setDeposit(scope.row.task_submit_id, scope.row.is_essence)">取消精选</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="taskUserCompleted"/>
    </el-col>

    <el-dialog title="任务详情" :visible.sync="taskDetails" class="create-alert">
      <div class="task-title">{{userInfo.details}}</div>
      <div class="task-img" v-if="userInfo.pic_url&&userInfo.pic_url.length>0">
        <img v-for="(item,index) in userInfo.pic_url" :key="index" :src="item" width="300px" alt="">
      </div>
    </el-dialog>
    <el-dialog title="任务说明" :visible.sync="taskContent" class="create-alert">
      <div class="task-title">{{task_content}}</div>
    </el-dialog>
  </div>
</template>

<script>
import { taskUserCompleted, setUserDeposit } from "@/api/homePage";
import Pagination from '@/components/Pagination';
import { getTaskCategroyList } from "@/api/growthCamp";

export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      taskDetails: false,
      listLoading: true,
      taskContent: false,
      total: 0,
      list:[],
      taskInfo: {},
      listQuery: {
        times_task_id: "",
        search_title: "",
        search_category: "",
        search_status: "",
        search_essence: "",
        search_time: "",
        page_num: 1,
        page_size: 10
      },
      // 任务完成情况 详情
      userInfo: {
        details: "",
        pic_url: []
      },
      task_content:"",
      options2:[
        {
          task_category_name: '全部类型',
          task_category: '',
        }
      ],
    }
  },
  created(){
    this.listQuery.times_task_id = this.$route.params.id;
    this.taskUserCompleted();
    this.getTaskCategroyList();
  },
  methods:{
    getTaskCategroyList(){
      getTaskCategroyList().then(res => {
        if(res.code == 200){
          this.options = res.result.task_category_list;
          this.options.forEach(t=>{
            this.options2.push(t)
          })
        }
      })
    },
    taskUserCompleted(){
      this.listLoading = true;
      taskUserCompleted(this.listQuery).then(res => {
        if(res.code == 200){
          this.listLoading = false;
          this.list = res.result.userList;
          this.total = res.result.sign.count;
          this.taskInfo = res.result.taskInfo;
        }
      })
    },
    sortChange(column){
      // ascending升序  descending降序
      const prop = column.prop;
      const order = column.order;
      this.listQuery.sort_zan = "";
      this.listQuery.sort_comment = "";
      if(prop === 'zan_num'){
        // 点赞
        this.listQuery.sort_zan = order === 'ascending' ? 1 : 2;
      }else if(prop === 'comment_count_num'){
        // 评论
        this.listQuery.sort_comment = order === 'ascending' ? 1 : 2;
      }
      this.taskUserCompleted()
    },
    seeDetails(details, pic_url){
      this.userInfo.details = details;
      this.userInfo.pic_url = pic_url;
      this.taskDetails = true;
    },
    setDeposit(task_submit_id, is_essence){
      setUserDeposit({task_submit_id, is_essence}).then(res => {
        if(res.code == 200){
          this.$message.success("操作成功");
          this.taskUserCompleted();
        }
      })
    },
    clearTitle(){
      this.listQuery.page_num = 1;
      this.taskUserCompleted();
    },
    taskDescript(task_content){
      this.task_content = task_content;
      this.taskContent = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.app_container-article{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
  }
  .create-alert{
    .task-title{
      margin-bottom: 10px;
    }
    .task-img img{
      margin: 10px 10px 0 0;
    }
  }
  .details-color{
    color: #409EFF;
    cursor: pointer;
  }
  .text-3 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    word-break: break-all;
    -webkit-box-orient: vertical;
  }
  .pic-url{
    width: 100px;
    height: 100px;
    margin: 0 10px 10px 0;
  }
}
</style>
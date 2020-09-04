<template>
  <div class="app_container-comment">
    <el-col :span="24" class="title-header">
      <el-col :span="10">
        <el-col :span="9">
          <el-input size="small" clearable placeholder="请输入昵称" prefix-icon="el-icon-search" v-model="listQuery.search" @clear="clearTitle">
          </el-input>
        </el-col>
        <el-col :span="9" align="center">
          <el-select v-model="listQuery.create_time" clearable placeholder="请选择时间" size="small" @change="clearTitle">
            <el-option
              v-for="(item,index) in timesList"
              :key="item"
              :label="item + ' ' + '第' + (index+1) + '天'"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="success-btn" align="left">
          <el-button type="success" @click="clearTitle()" size="small">搜索</el-button>
        </el-col>
      </el-col>
    </el-col>
    <el-col :span="24" class="tableData">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
        <el-table-column label="任务说明" align="center" width="110">
          <template slot-scope="scope">
            <el-col :span="24"><img :src="scope.row.task_img_url" width="90" height="65" alt=""></el-col>
            <el-col :span="24">
              <el-button size="mini" type="text" @click="seeDetails(scope.row.task_img_url, scope.row.task_content)">
                {{ scope.row.task_category_name }}
              </el-button>
            </el-col>
          </template>
        </el-table-column>

        <el-table-column label="评论" align="center">
          <template slot-scope="scope">
            <!-- 任务详情 -->
            <el-col :span="24" class="commentMain" @click.native="seeDetails2(scope.row.details, scope.row.pic_url)" v-if="scope.row.details">
              <span title="点击查看任务详情">任务详情：{{ scope.row.details }}</span>
            </el-col>
            <!-- 一级评论 -->
            <el-col :span="20" class='commentOne'>
              <el-col :span="3">
                <el-col :span="8">
                  <img :src="scope.row.headimgurl" width="45" height="45">
                </el-col>
                <el-col :span="15" :offset="1">
                  <el-col :span="24" class="nickname">
                    {{scope.row.nickname}}
                  </el-col>
                  <el-col :span="24" class="nickname">
                    {{ scope.row.create_time.slice(5,20) }}
                  </el-col>
                </el-col>
              </el-col>
              <el-col :span="21" class="question_content1 question_content">
                评论：
                <span v-if="scope.row.comment_contents.length<220">{{scope.row.comment_contents}}</span>
                <el-popover v-else
                  placement="top"
                  width="700"
                  height="500"
                  trigger="hover"
                  :content="scope.row.comment_contents">
                  <span slot="reference">{{ scope.row.comment_contents }}</span>
                </el-popover>
              </el-col>
            </el-col>
            <!-- 二级评论 -->
            <el-col :span="21" :offset="1" v-if='scope.row._apply&&scope.row._apply.length' class='commentTwo'>
              <el-col v-for="item in scope.row._apply" :key="item.index" class='commentTwoItem'>>
                <el-col :span="4">
                  <el-col :span="8">
                    <img :src="item.headimgurl" alt="" width="45" height="45">
                  </el-col>
                  <el-col :span="15" :offset="1">
                    <el-col :span="24" class="nickname">
                      {{ item.nickname }}
                    </el-col>
                    <el-col :span="24" class="nickname">
                      {{ scope.row.create_time.slice(5,20) }}
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="20" class="question_content2 question_content">
                  回复：
                  <span v-if="item.comment_contents.length<183">{{item.comment_contents}}</span>
                  <el-popover v-else
                    placement="top"
                    width="700"
                    height="500"
                    trigger="hover"
                    :content="item.comment_contents">
                    <span slot="reference">{{ item.comment_contents }}</span>
                  </el-popover>
                </el-col>
              </el-col>
            </el-col>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" align="center" width="90">
          <template slot-scope="scope">
            <el-button v-if="scope.row.is_show == 1" size="mini" type="text" @click="updateShow(scope.row.id)">设为隐藏</el-button>
            <el-button v-if="scope.row.is_show == 2" size="mini" type="text" @click="updateShow(scope.row.id)">取消隐藏</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination 
        class="pagination"
        v-if="total!=0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="taskManageComment"
      />
    </el-col>

    <el-dialog title="任务说明" :visible.sync="taskDetails" class="create-alert">
      <div class="task-img">
        <img :src="taskDetail.task_img_url" width="100" alt="">
      </div>
      <div class="task-title">{{taskDetail.task_content}}</div>
    </el-dialog>
    <el-dialog title="任务详情" :visible.sync="taskDetails2" class="create-alert">
      <div class="task-title">{{userInfo.details}}</div>
      <div class="task-img" v-if="userInfo.pic_url&&userInfo.pic_url.length>0">
        <img v-for="(item,index) in userInfo.pic_url" :key="index" :src="item" width="200px" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { taskManageComment, getDayTime, updateIsShow } from "@/api/homePage";
import Pagination from '@/components/Pagination';
export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      taskDetails: false,
      taskDetails2: false,
      listLoading: true,
      total: 0,
      list:[],
      listQuery: {
        times_task_id: "",
        search: "",
        create_time: "",
        page_num: 1,
        page_size: 10,
        identify_type: '6'
      },
      timesList: [],
      taskDetail: {},
      userInfo: {
        details: "",
        pic_url: []
      },
    }
  },
  created(){
    this.listQuery.times_task_id = this.$route.params.id;
    this.taskManageComment();
    this.getDayTime();
  },
  methods:{
    taskManageComment(){
      this.listLoading = true;
      taskManageComment(this.listQuery).then(res => {
        if(res.code == 200){
          this.listLoading = false;
          this.list = res.result.list;
          this.total = res.result.sign.count;
        }
      })
    },
    // 时间列表
    getDayTime(){
      getDayTime({times_task_id: this.listQuery.times_task_id}).then(res => {
        if(res.code ==200){
          this.timesList = res.result;
        }
      })
    },
    seeDetails(task_img_url, task_content){
      this.taskDetail.task_img_url = task_img_url;
      this.taskDetail.task_content = task_content;
      this.taskDetails = true;
    },
    clearTitle(){
      this.listQuery.page_num = 1;
      this.taskManageComment();
    },
    updateShow(primary_id){
      this.$confirm('确定要执行此操作吗？是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateIsShow({primary_id}).then(res => {
          if(res.code == 200){
            this.$message.success('操作成功');
            this.taskManageComment();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
    seeDetails2(details, pic_url){
      this.userInfo.details = details;
      this.userInfo.pic_url = pic_url;
      this.taskDetails2 = true;
    },
  }
}
</script>

<style lang="scss" scoped>
.app_container-comment{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
    .select-title{
      width: 70px;
      text-align: right;
      font-size: 14px;
      color: #606266;
      font-weight: 700;
    }
  }
  .tableData{
    .commentMain{
      width: 100%;
      height: 20px;
      // text-align: center;
      color: #409EFF;
      margin: 4px 0 8px 0;
      cursor: pointer;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .commentOne{
      width: 100%;
      background: rgb(222, 255, 222);
      img{
        border-radius: 50%;
        margin-top: 5px;
      }
    }
    .commentTwo{
      width: 95.8%;
      margin-top: 5px;
      background: rgb(252, 249, 217);
      // margin:5px 0;
      img{
        border-radius: 50%;
        margin-top: 5px;
      }
      .commentTwoItem{
        border-bottom: 3px solid #fff;
      }
    }
    .nickname{
      width: 100%;
      // max-height: 40px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;  
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .question_content{
      font-size: 14px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;  
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .question_content1{
      padding-left: 10px;
    }
  }
  .create-alert{
    .task-title{
      margin-bottom: 10px;
    }
    .task-img img{
      margin: 10px 10px 0 0;
    }
  }
}
</style>
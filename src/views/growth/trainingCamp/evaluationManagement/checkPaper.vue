<template>
  <div class="paper_container">
    <el-col :span="24" class="title_header">
      <p><b>试卷名称:{{ paper_info.paper_name }}，试题总计:{{ paper_info.paper_content_num }}道</b></p>
    </el-col>
    <el-col :span="24" class="paper_content">
      <!-- 题目列表 -->
      <div v-for="(item,index1) in questionAnswerList" :key="index1">
        <template v-if="questionAnswerList.length">
          <!-- 标签 -->
          <el-col :span="24" class="tag">
            <i>标签</i>&nbsp;&nbsp;
            <span v-for="item in item.content_tag_list" :key="item.index">{{ item.tag_list_name }}</span>
          </el-col>
          <!-- 题干 -->
          <el-col :span="24" class="title">
            <el-col :span="1">
              <i>题干{{item.paper_content_info.content_sort}}</i>
            </el-col>
            <el-col :span="22">
              <p>{{ item.paper_content_info.select_content }}</p>
            </el-col>
          </el-col>
          <!-- 选项 -->
          <el-col :span="16" class="answerList">
            <i>选项</i>
            <section>
              <p v-for="answer in (item.select_option_list)" :key="answer.index">
                <span>{{ answer.option_index +' : '+ answer.option_content }}</span>
                <span>分数:</span>
                <span>{{ answer.score}}分</span>
              </p>
            </section>
          </el-col>
        </template>
      </div>
    </el-col>
    <el-col :span="24">
      <pagination 
        class="pagination"
        v-show="total>0" 
        :total="total" 
        :page.sync="listQuery.page_num" 
        :limit.sync="listQuery.page_size" 
        v-on:pagination="changePaging"/>
    </el-col>
  </div>
</template>

<script>
import { getPaper, } from "@/api/growthCamp";
import Pagination from '@/components/Pagination';

export default {
  name:'',
  components: { Pagination },
  data(){
    return{
      listLoading: true,
      paper_info: {
        paper_name: '',
        paper_content_num: '',
      },
      questionAnswerList:[],
      listQuery: {
        page_num: 1,
        page_size: 10,
        paper_id: '',
      },
      total: 0
    }
  },
  created(){
    this.getPaper();
    this.listQuery.paper_id = this.$route.params.Paperid;
  },
  methods:{
    getPaper(){
      getPaper(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          res.result.paper_content_list.forEach(v=>{
            v.content_tag_list.forEach((k,index)=>{
              if(v.content_tag_list.length -1 != index){
                k.tag_list_name+=' | ';
              }
            })
          })
          this.questionAnswerList = res.result.paper_content_list;
          this.paper_info = res.result.paper_info;
          this.total = Number(res.result.paper_info.paper_content_num);
        }
      });
    },
    changePaging(){
      this.getPaper();
    }
  }
}
</script>

<style lang="scss" scoped>
.paper_container{
  padding: 20px;
  .title_header{
    margin-bottom: 20px;
    height: 60px;
    line-height: 30px;
    margin-bottom: 10px;
    padding-left: 10px;
    background: rgb(245, 244, 244);
  }
  .paper_content{
    width: 100%;
    .tag{
      height: 40px;
      line-height: 40px;
      background: lightgrey;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .title{
      margin: 10px 0;
      width: 100%;
      height: 75px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      .el-col-22{
        width: 93.7%;
      }
      p{
        height: 70px;
        padding: 5px;
        margin: 0;
        border: 1px solid gainsboro;
      }
    }
    .answerList{
      margin-bottom: 30px;
      section{
        margin-left: 90px;
        p{
          width: 1160px;
          display: flex;
          justify-content: space-around;
          align-items: flex-start;
          span:nth-child(1){
            display: inline-block;
            width: 1050px;
          }
          span:nth-child(2){
            display: inline-block;
            width: 39px;
          }
          span:nth-child(3){
            display: inline-block;
            width: 44px;
            height: 100%;
          }
        }
      }
    }
    i{
      display: inline-block;
      width: 45px;
      height: 20px;
      line-height: 20px;
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      color: #fff;
      margin-left: 15px;
      text-align: center;
      background: rgb(161, 161, 161);
    }
  }
}
</style>
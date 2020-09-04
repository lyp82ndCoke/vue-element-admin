<template>
  <div class="detail_wrap">
    <div class="comment_head">
      <p class="question_info" v-html="signQuestion.question_content" />
      <p class="sign_info">
        <span class="sign_date">签到时间：{{ signQuestion.question_time }}</span><span class="sign_num">总评论数量：{{ signQuestion.comment_num }}</span>
      </p>
    </div>
    <div class="comment_detail">
      <div class="comment_title">
        <span class="details_title">评论详情</span>
        <span class="set_button">操作</span>
      </div>
      <div v-if="commntList.length > 0" class="comment_table">
        <div v-for="(item, index) in commntList" :key="`A${index}`" class="comment_item">
          <div class="user_head">
            <div class="user_left">
              <img :src="item.headimgurl" alt="头像" class="user_icon">
              <div class="user_message">
                <span clsss="user_name">{{ item.nickname }}</span>
                <span class="comment_time">{{ item.create_time }}</span>
              </div>
            </div>
            <div class="comment_item_right">
              <el-button type="text" size="mini" @click="setComment(item, index)">{{ item.is_top == 1 ? '取消置顶' : '置顶' }}</el-button>
              <el-button type="text" size="mini" @click="switchShow(1, item, index)">{{ item.is_show == 1 ? '隐藏' : '取消隐藏' }}</el-button>
            </div>
          </div>
          <div class="comment_content content_bg">
            <span v-html="item.comment_content" />
          </div>
          <!--二级评论-->
          <div style="">
            <div v-for="(itemMin, indexMin) in item.commentreplylist" :key="`B${indexMin}`" class="second_level">
              <div class="second_level_left">
                <div class="user_left">
                  <img :src="itemMin.headimgurl" alt="头像" class="user_icon">
                  <div class="user_message">
                    <span clsss="user_name">{{ itemMin.nickname }}</span>
                    <span class="comment_time">{{ itemMin.reply_create_time }}</span>
                  </div>
                </div>
                <div class="comment_item_right">
                  <el-button type="text" size="mini" @click="switchShow(2, item, index, indexMin, itemMin)">{{ itemMin.is_show == 1 ? '隐藏' : '取消隐藏' }}</el-button>
                </div>
              </div>
              <div class="second_level_c content_bg">
                <span v-html="itemMin.reply_content" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="comment_text">暂无评论~</p>
    </div>
    <pagination v-if="total > 10" :total="total" :page.sync="listQuery.page_num" :limit.sync="listQuery.page_size" class="pagination" v-on:pagination="moreCommentList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { questionScanList, setTop, switchShowApi } from '@/api/signDay'
export default {
  components: { Pagination },
  data() {
    return {
      commntList: [],
      signQuestion: {},
      total: 0,
      listQuery: {
        page_num: 1,
        page_size: 10
      }
    }
  },
  computed: {
    signId() { return this.$route.params.sign_id },
    questionId() { return this.$route.params.question_id }
  },
  created() {
    this.getQuestionDetail()
  },
  methods: {
    getQuestionDetail() {
      const params = {
        sign_id: this.signId,
        question_id: this.questionId
      }
      questionScanList(Object.assign(params, this.listQuery))
        .then(res => {
          if (parseInt(res.code) === 200) {
            if (res.result.SignQuestion) {
              this.signQuestion = res.result.SignQuestion
            }
            this.total = res.result.count
            if (Array.isArray(res.result.CommentInfo)) {
              this.commntList = res.result.CommentInfo
            }
          }
        })
    },
    moreCommentList() {
      this.getQuestionDetail()
    },
    setComment(item, index) {
      const isTop = parseInt(item.is_top) === 1 ? 2 : 1
      const params = {
        comment_id: item.comment_id,
        is_top: item.is_top
      }
      setTop(params)
        .then(res => {
          if (parseInt(res.code) === 200) {
            this.commntList[index].is_top = isTop
            this.$message({
              message: '设置成功',
              type: 'success'
            })
          }
        })
    },
    switchShow(type, item, index, indexMin, itemMin) {
      let isShow = null
      if (type === 1) {
        isShow = parseInt(item.is_show) === 1 ? 2 : 1
      } else {
        isShow = parseInt(itemMin.is_show) === 1 ? 2 : 1
      }
      const params = {
        comment_id: type === 1 ? item.comment_id : itemMin.reply_id,
        is_show: type === 1 ? item.is_show : itemMin.is_show,
        flg: type === 1 ? 1 : 2
      }
      switchShowApi(params)
        .then(res => {
          if (parseInt(res.code) === 200) {
            if (type === 1) {
              this.commntList[index].is_show = isShow
            } else {
              this.commntList[index]['commentreplylist'][indexMin].is_show = isShow
            }
            this.$message({
              message: '设置成功',
              type: 'success'
            })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail_wrap{
  padding: 20px;
  .comment_head{
    p{
      margin: 0;
    }
    border-radius: 5px;
    .question_info{
      font-size: 18px;
      font-weight: 500;
    }
    .sign_info{
      font-size: 14px;
      margin-top: 10px;
      font-weight: 400;
      .sign_date{
        margin-right: 20px;
      }
    }
  }
  .comment_detail{
    margin-top: 10px;
    .comment_title{
      display: flex;
      align-items: center;
      line-height: 48px;
      background: rgba(242, 246, 252, .7);
      margin-top: 10px;
      border: 1px solid #EBEEF5;
      color: #909399;
      font-size: 14px;
      font-weight: bold;
      .details_title{
        display: inline-block;
        width: calc(100% - 180px);
        text-align: center;
      }
      .set_button{
        display: inline-block;
        width: 180px;
        text-align: center;
      }
    }
    .comment_table{
      border: 1px solid #EBEEF5;
      border-top: none;
      .comment_item{
        background: #fff;
        // border-radius: 10px;
        border-bottom: 1px solid #EBEEF5;
        padding: 10px 0;
        .user_head{
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content:space-between;
          width: 100%;
          .user_icon{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin: 0 10px;
          }
          .user_message{
            display: flex;
            justify-content: space-around;
            flex-direction: column;
            height: 40px;
            text-align: left;
            .user_name{
              font-size: 16px;
              font-weight: 400;
            }
            .comment_time{
              font-size: 12px;
              color: #3a3838;
            }
          }
          .user_left{
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .comment_item_right{
            width: 180px;
            text-align: center;
          }
        }
        .comment_content{
          margin-left: 60px;
          margin-top: 5px;
          padding: 10px;
          border-radius: 5px;
          font-size:14px;
          width: calc(100% - 240px);
          line-height: 1.3;
          color: #303133;
        }
        .content_bg{
          background: rgba(230, 162, 60, .1);
        }
        .second_level{
          margin: 10px 0 0 60px;
          display: flex;
          flex-direction: column;
          justify-content:flex-start;
          .second_level_left{
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content:space-between;
            width: 100%;
            .user_icon{
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 10px;
            }
            .user_message{
              display: flex;
              justify-content: space-around;
              flex-direction: column;
              height: 40px;
              text-align: left;
              .user_name{
                font-size: 16px;
                font-weight: 400;
              }
              .comment_time{
                font-size: 12px;
                color: #3a3838;
              }
            }
            .user_left{
              display: flex;
              flex-direction: row;
              align-items: center;
            }
            .comment_item_right{
              width: 180px;
              text-align: center;
            }
          }
          .second_level_c{
            margin-top: 10px;
            padding: 10px;
            border-radius: 5px;
            font-size:14px;
            width: calc(100% - 180px);
            line-height: 1.3;
            color: #303133;
          }
        }
      }
      .comment_item:last-child{
        border-bottom: none;
      }
    }
    .comment_text{
      line-height: 60px;
      text-align: center;
      margin: 0;
      border: 1px solid #EBEEF5;
      border-top: 1px solid transparent;
      color: #909399;
      font-size: 14px;
    }
  }
}
</style>

<template>
  <div class="comment_wrap">
    <el-tabs v-model="flag" type="card" @tab-click="handleClick">
      <el-tab-pane label="评论管理" name="1">
        <div class="comment_manage">
          <div class="search_top">
            <el-row>
              <el-col :span="8">
                <el-input v-model="search_name" :placeholder="flag == 1 ? '请输入用户昵称或试题详情' : '请输入试题名称'" clearable class="search_style">
                  <el-button slot="append" icon="el-icon-search" @click="searchFilter">搜索</el-button>
                </el-input>
              </el-col>
              <el-col :span="16">
                <div v-if="flag == 1" class="filter_s">
                  <el-button :type="is_today == 2 ? 'primary' : null" size="mini" round @click="filter(2)">全部</el-button>
                  <el-button :type="is_today == 1 ? 'primary' : null" size="mini" round style="margin-right:10px;" @click="filter(1)" >今日评论</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
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
              <div class="comment_content">
                <span><i class="question_content_t">试题详情</i>：<span v-html="item.question_content" /></span>
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
      </el-tab-pane>
      <el-tab-pane label="试题管理" name="2">
        <div class="papeer_manage">
          <el-row>
            <el-col :span="6">
              <el-input v-model="search_name" placeholder="请输入试题名称模糊搜索" clearable class="search_style" />
            </el-col>
            <el-col :span="18">
              <el-date-picker v-model="searchDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="search_date" />
              <el-button type="primary" class="created_sign" @click="searchFilter">搜 索</el-button>
            </el-col>
          </el-row>
          <div class="paper_table">
            <el-table :data="commntList" border style="width: 100%" empty-text="暂无试题~">
              <el-table-column prop="question_time" label="签到日期" width="150" align="center" />
              <el-table-column :show-overflow-tooltip="true" label="试题详情" align="center">
                <template slot-scope="scope">
                  <span v-html="scope.row.question_content" />
                </template>
              </el-table-column>
              <el-table-column prop="comment_num" label="总评论数" width="100" align="center" />
              <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="query(scope.row, scope.$index)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <pagination v-show="total > 10" :total="total" :page.sync="listQuery.page_num" :limit.sync="listQuery.page_size" class="pagination" v-on:pagination="moreCommentList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { commentList, setTop, switchShowApi } from '@/api/signDay'
export default {
  components: { Pagination },
  data() {
    return {
      commntList: [],
      search_name: '',
      is_today: 1,
      searchDate: [],
      flag: '1',
      list: [],
      total: 0,
      listQuery: {
        page_num: 1,
        page_size: 10
      }
    }
  },
  computed: {
    signId() { return this.$route.params.sign_id }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    getCommentList() {
      const data = {
        sign_id: this.signId,
        flag: this.flag,
        search_name: this.search_name
      }
      if (parseInt(this.flag) === 1) {
        data.is_today = this.is_today
      } else if (parseInt(this.flag) === 2) {
        data.start_time = this.searchDate ? this.searchDate[0] : ''
        data.end_time = this.searchDate ? this.searchDate[1] : ''
      }
      commentList(Object.assign(data, this.listQuery))
        .then(res => {
          if (parseInt(res.code) === 200) {
            this.total = res.result.count
            this.commntList = res.result.list
          }
        })
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
    },
    handleClick() {
      this.search_name = ''
      this.commntList = []
      this.getCommentList()
    },
    moreCommentList() {
      this.getCommentList()
    },
    searchFilter() { this.getCommentList() },
    filter(code) {
      if (this.is_today === code) { return }
      this.is_today = code
      this.getCommentList()
    },
    query(item, index) {
      this.$router.push({ path: `../detail/${item.sign_id}/${item.question_id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.comment_wrap{
  padding: 20px;
  .comment_manage{
    // background: rgba(153, 153, 153, 0.1);
    border-radius: 10px;
    .search_top{
      .filter_s{
        height: 40px;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: flex-start;
        flex-direction: row-reverse;
      }
    }
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
          .question_content_t{
            font-style: normal;
            font-weight: 500;
          }
        }
        .content_bg{
          background: rgba(230, 162, 60, .1);
        }
        .comment_detail{
          margin-left: 60px;
          width: calc(100% - 240px);
          line-height: 1.3;
          color: #303133;
          font-size:14px;
          font-weight: 500;
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
      .comment_item:hover{
        // background-color: #F5F7FA;
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
  .papeer_manage{
    .search_date{
      margin:0 20px;
    }
    .paper_table{
      margin-top: 10px;
    }
  }
}
</style>

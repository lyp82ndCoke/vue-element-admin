<template>
  <div class="overview_wrap">
    <div class="overview_head">
      <el-row>
        <el-col :span="3">
          <div class="total_left">
            <i class="el-icon-edit-outline toatal_left_icon"/>
            <p class="toatal_left_t">总签到概况</p>
          </div>
        </el-col>
        <el-col :span="21">
          <div class="total_sign">
            <div class="flex-item">
              <p class="item_num_t">
                <span>进入签到总人数</span>
                <el-tooltip class="item" effect="dark" content="进入签到的总人数（未签用户与已签用户）" placement="top-start">
                  <i class="el-icon-question custom_que_i" />
                </el-tooltip>
              </p>
              <p class="totla_num">{{ statisticsTotal.join_people_num || 0 }}</p>
            </div>
            <div class="flex-item">
              <p class="item_num_t">
                <span>实际签到总人数</span>
                <el-tooltip class="item" effect="dark" content="成功提交每日签到题的总人数" placement="top-start">
                  <i class="el-icon-question custom_que_i" />
                </el-tooltip>
              </p>
              <p class="totla_num">{{ statisticsTotal.sign_people_num || 0 }}</p>
            </div>
            <div class="flex-item">
              <p class="item_num_t">
                <span>总签到次数</span>
                <el-tooltip class="item" effect="dark" content="进入签到人数中，每成功签到1次 + 1次" placement="top-start">
                  <i class="el-icon-question custom_que_i" />
                </el-tooltip>
              </p>
              <p class="totla_num">{{ statisticsTotal.sign_frequency_num || 0 }}</p>
            </div>
            <div class="flex-item">
              <p class="item_num_t">
                <span>人均签到次数</span>
                <el-tooltip class="item" effect="dark" content="成功签到总人数 / 签到总次数" placement="top-start">
                  <i class="el-icon-question custom_que_i" />
                </el-tooltip>
              </p>
              <p class="totla_num">{{ statisticsTotal.sign_average_num || 0 }}</p>
            </div>
            <div class="flex-item">
              <p class="item_num_t">
                <span>签到率</span>
                <el-tooltip class="item" effect="dark" content="实际签到总人数 / 进入签到总人数" placement="top-start">
                  <i class="el-icon-question custom_que_i" />
                </el-tooltip>
              </p>
              <p class="totla_num">{{ statisticsTotal.sign_rate || `0%` }}</p>
            </div>
            <div class="flex-item">
              <p class="item_num_t">
                <span>签到正确率</span>
                <el-tooltip class="item" effect="dark" content="总签到正确人数 / 实际签到总人数" placement="top-start">
                  <i class="el-icon-question custom_que_i" />
                </el-tooltip>
              </p>
              <p class="totla_num">{{ statisticsTotal.correct_rate || `0%` }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <div class="total_left total_today">
            <i class="el-icon-edit toatal_left_icon"/>
            <p class="toatal_left_t">今日签到概况</p>
          </div>
        </el-col>
        <el-col :span="21">
          <div class="total_sign total_today_s">
            <div class="flex-item">
              <p class="item_num_t">
                <span>进入签到总人数</span>
                <el-tooltip class="item" effect="dark" content="今日进入签到的总人数（未签用户与已签用户）" placement="top-start">
                  <i class="el-icon-question custom_que_i" />
                </el-tooltip>
              </p>
              <p class="totla_num">{{ statisticsToday.join_people_num || 0 }}</p>
            </div>
            <div class="flex-item">
              <p class="item_num_t">
                <span>今日签到总人数</span>
                <el-tooltip class="item" effect="dark" content="成功提交今日签到题的总人数" placement="top-start">
                  <i class="el-icon-question custom_que_i" />
                </el-tooltip>
              </p>
              <p class="totla_num">{{ statisticsToday.sign_people_num || 0 }}</p>
            </div>
            <div class="flex-item">
              <p class="item_num_t">
                <span>签到率</span>
                <el-tooltip class="item" effect="dark" content="实际签到总人数 / 进入签到总人数" placement="top-start">
                  <i class="el-icon-question custom_que_i" />
                </el-tooltip>
              </p>
              <p class="totla_num">{{ statisticsToday.sign_rate || `0%` }}</p>
            </div>
            <div class="flex-item">
              <p class="item_num_t">
                <span>今日新签用户数</span>
                <el-tooltip class="item" effect="dark" content="今日第1次签到人数" placement="top-start">
                  <i class="el-icon-question custom_que_i" />
                </el-tooltip>
              </p>
              <p class="totla_num">{{ statisticsToday.today_new_num || 0 }}</p>
            </div>
            <div class="flex-item">
              <p class="item_num_t">
                <span>今日新签用户占比</span>
                <el-tooltip class="item" effect="dark" content="今日第1次签到人数 / 今日总签到人数" placement="top-start">
                  <i class="el-icon-question custom_que_i" />
                </el-tooltip>
              </p>
              <p class="totla_num">{{ statisticsToday.today_new_rate || `0%` }}</p>
            </div>
            <div class="flex-item">
              <p class="item_num_t">
                <span>签到正确率</span>
                <el-tooltip class="item" effect="dark" content="总签到正确人数 / 实际签到总人数" placement="top-start">
                  <i class="el-icon-question custom_que_i" />
                </el-tooltip>
              </p>
              <p class="totla_num">{{ statisticsToday.correct_rate || `0%` }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="import_wrap">
      <el-date-picker v-model="dateTime" :unlink-panels="true" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate" /><el-button :loading="buttonLiading" type="primary" class="import_buton" size="medium" @click="importExcel">{{ buttonLiading ? '导出中...' : '导 出' }}</el-button><span class="prop_text">（<i class="el-icon-warning waring_s" />建议导出时间范围在3个月内）</span>
    </div>
    <div class="table_list">
      <el-row>
        <el-col :span="24">
          <el-table v-loading="tableLoading" :data="statisticsList" border style="width: 100%" empty-text="暂无签到数据~">
            <el-table-column label="日期" align="center" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.statistics_time }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="进入签到总人数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.join_people_num || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="实际签到总人数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.sign_people_num || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="签到率" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.sign_rate || `0%` }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="新签到用户数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.today_new_num || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="新签到用户占比" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.today_new_rate || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="签到正确率" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.correct_rate || `0%` }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="海报曝光次数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.poster_exposure_num || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="海报点击人数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.poster_click_people_num || 0 }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作" align="center" width="80" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="query(scope.row, scope.$index)">查看</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-col>
      </el-row>
    </div>
    <el-dialog :visible.sync="showDialog" title="模板数据详情" width="50%" left>
      <el-table :data="templateData" border style="width: 100%" empty-text="暂无数据~">
        <el-table-column :show-overflow-tooltip="true" label="模板名称" prop="stencil_flg" align="center" />
        <el-table-column :show-overflow-tooltip="true" label="曝光次数" prop="poster_exposure_num" align="center" />
        <el-table-column :show-overflow-tooltip="true" label="点击人数" prop="poster_click_people_num" align="center" />
      </el-table>
      <div class="dialog_bottom">
        <el-button type="primary" size="medium" @click="showDialog = false">我知道了</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total > 10" :total="total" :page.sync="listQuery.page_num" :limit.sync="listQuery.page_size" class="pagination" v-on:pagination="moreCommentList" />
  </div>
</template>

<script>
import timeTools from '@/utils/timeFromat'
import Pagination from '@/components/Pagination'
import { statisticsIndex, statisticsList } from '@/api/signDay'
export default {
  components: { Pagination },
  data() {
    return {
      dateTime: [timeTools.formatDate(new Date(), 'YYYY-MM-DD'), timeTools.formatDate(new Date(), 'YYYY-MM-DD')],
      tableLoading: false,
      showDialog: false,
      buttonLiading: false,
      templateData: [],
      total: 0,
      listQuery: {
        page_num: 1,
        page_size: 10
      },
      statisticsTotal: {},
      statisticsToday: {},
      statisticsList: []
    }
  },
  computed: {
    signId() { return this.$route.params.sign_id }
  },
  created() {
    this.getStatistics()
    this.getStatisticsList()
  },
  methods: {
    changeDate(time) {
      if (time) {
        this.getStatisticsList()
      } else {
        this.statisticsList = []
      }
    },
    importExcel() {
      if (!this.dateTime || this.dateTime.length <= 0) {
        this.$message({
          message: '请选择导出时间',
          type: 'warning'
        })
        return
      }
      if (this.buttonLiading) { return }
      this.buttonLiading = true
      const url = `${process.env.BASE_API}/portalsign/sign_admin/ExportExcel?sign_id=${this.signId}&start_time=${this.dateTime[0]}&end_time=${this.dateTime[1]}&special=skip`
      window.open(url, '_blank')
      this.buttonLiading = false
    },
    query(item, index) {
      this.templateData = item.stencil_list
      this.showDialog = true
    },
    getStatistics() {
      statisticsIndex({ sign_id: this.signId })
        .then(res => {
          if (res.code === 200) {
            this.statisticsTotal = res.result.statisticsTotal
            this.statisticsToday = res.result.statisticsToday
          }
        })
    },
    getStatisticsList() {
      this.tableLoading = true
      const params = {
        sign_id: this.signId,
        start_time: this.dateTime[0] || timeTools.formatDate(new Date(), 'YYYY-MM-DD'),
        end_time: this.dateTime[1] || timeTools.formatDate(new Date(), 'YYYY-MM-DD')
      }
      console.log('请求列表')
      statisticsList(Object.assign(params, this.listQuery))
        .then(res => {
          this.tableLoading = false
          if (res.code === 200) {
            this.statisticsList = res.result.statisticsList
          }
        })
        .catch(er => { this.tableLoading = false })
    },
    moreCommentList() { this.getStatisticsList() }
  }
}
</script>

<style lang="scss" scoped>
.overview_wrap{
  padding: 20px;
  .overview_head{
    .total_sign{
      height: 100px;
      background: #F2F6FC;
      display: flex;
      .flex-item{
        flex: 1;
        text-align: center;
        padding: 20px 0;
        .totla_num{
          margin-top: 10px;
          font-weight: 500;
          font-size: 20px;
        }
        .item_num_t{
          font-size: 14px;
          .custom_que_i{
            color:rgba(153, 153, 153, .5);
            font-size:16px;
            cursor: pointer;
          }
        }
        p{
          padding: 0;
          margin: 0;
        }
      }
    }
    .total_today_s{
      background: rgba(103, 194, 58, .1);
    }
    .total_left{
      height: 100px;
      padding: 20px 0;
      text-align: center;
      background: #409EFF;
      color: #fff;
      .toatal_left_t{
        margin-top: 10px;
        font-size: 16px;
      }
      .toatal_left_icon{
        font-size: 16px;
      }
      p{
        padding: 0;
        margin: 0;
      }
    }
    .total_today{
      background: #67C23A;
    }
  }
  .import_wrap{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
    .prop_text{
      font-size: 14px;
      color: #F56C6C;
      .waring_s{
        margin: 0 5px;
      }
    }
    .import_buton{
      margin: 0 10px;
    }
  }
  .table_list{
    margin-top: 10px;
  }
  .dialog_bottom{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
}
</style>

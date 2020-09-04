<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="代言人管理" name="first">
          <el-collapse-transition>
            <div v-show="titleShow">
              <div>
                <el-row class="title-header">
                  <el-col :span="2" class="lineheight-32">手机号:</el-col>
                  <el-col :span="5">
                    <el-input
                      size="small"
                      placeholder="手机号"
                      clearable
                      prefix-icon="el-icon-search"
                      v-model="form.mobile"
                    ></el-input>
                  </el-col>
                  <el-col :span="2" class="lineheight-32">昵称:</el-col>
                  <el-col :span="5">
                    <el-input
                      size="small"
                      placeholder="请输入昵称"
                      clearable
                      prefix-icon="el-icon-search"
                      v-model="form.nickname"
                    ></el-input>
                  </el-col>
                  <el-col :span="2" class="lineheight-32">状态:</el-col>
                  <el-col :span="5">
                    <el-select v-model="form.status" placeholder="请选择" size="small">
                      <el-option
                        v-for="item in status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </div>
              <div>
                <el-row class="title-header">
                  <el-col :span="2" class="lineheight-32">爱心值:</el-col>
                  <el-col :span="2">
                    <el-input size="small" clearable v-model="form.score_start"></el-input>
                  </el-col>
                  <el-col :span="1" class="lineheight-32">—</el-col>
                  <el-col :span="2">
                    <el-input size="small" clearable v-model="form.score_end"></el-input>
                  </el-col>
                  <!-- <el-col :span="3" class="lineheight-32">可提现荣誉金:</el-col>
                  <el-col :span="2">
                    <el-input size="small" clearable v-model="form.money_start"></el-input>
                  </el-col>
                  <el-col :span="1" class="lineheight-32">—</el-col>
                  <el-col :span="2">
                    <el-input size="small" clearable v-model="form.money_end"></el-input>
                  </el-col> -->
                  <el-col :span="3" class="lineheight-32">造福人数:</el-col>
                  <el-col :span="2">
                    <el-input size="small" clearable v-model="form.promotion_start"></el-input>
                  </el-col>
                  <el-col :span="1" class="lineheight-32">—</el-col>
                  <el-col :span="2">
                    <el-input size="small" clearable v-model="form.promotion_end"></el-input>
                  </el-col>
                </el-row>
              </div>
              <div>
                <el-row class="title-header">
                  <el-col :span="3" class="lineheight-32">上次赠卡时间:</el-col>
                  <el-col :span="14">
                    <el-date-picker
                      @change="changeTime"
                      size="small"
                      align="right"
                      v-model="value2"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      type="daterange"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    ></el-date-picker>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-collapse-transition>

          <!-- </el-col> -->
          <el-row style="margin-bottom:20px;">
            <el-col :span="5" :offset="18" class="success-btn">
              <el-button size="small" @click="titleShow=!titleShow">收起/展开</el-button>
              <el-button type="success" @click="search" size="small">筛选</el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            border
            fit
            size="small"
            highlight-current-row
            align="middle"
          >
            <el-table-column label="代言人昵称" align="center" width="300">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.nickname }}<br>{{scope.row.unionid}}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="手机号" align="center" prop="mobile">
              <template slot-scope="scope">
                <span>{{ scope.row.mobile === null || scope.row.mobile === '' ? '--' : scope.row.mobile }}</span>
              </template>
            </el-table-column>
            <el-table-column label="等级" align="center" prop="level_name"></el-table-column>
            <!-- <el-table-column label="爱心值" align="center" prop="score"></el-table-column> -->
            <!-- <el-table-column label="造福人数" align="center" prop="promotion_num"></el-table-column> -->
            <el-table-column label="爱心值" align="center" prop="score">
              <template slot-scope="scope">
                <span v-if="scope.row.score == '0'">{{ scope.row.score}}</span>
                <el-button @click="goHeart(scope.row.unionid)" type="text" size="small" v-else>{{ scope.row.score }}</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column label="可提现荣誉金" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.money }}</el-col>
              </template>
            </el-table-column> -->
            <el-table-column label="造福人数" align="center" prop="promotion_num">
              <template slot-scope="scope">
                <span v-if="scope.row.promotion_num == '0'">{{ scope.row.promotion_num}}</span>
                <el-button @click="goPromotion(scope.row.unionid)" type="text" size="small" v-else>{{ scope.row.promotion_num }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="赠卡张数/使用张数" align="center" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.give_num}}/{{scope.row.use_num}}</span>
              </template>
            </el-table-column>
            <el-table-column label="上次赠卡时间" prop="prev_give_time" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.prev_give_time == null ? '--' : scope.row.prev_give_time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.status == '1' ? '正常' : '停用' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center"  width="180">
              <template slot-scope="scope">
                <el-button @click="start(scope.row.unionid)" type="text" size="small" v-if="scope.row.status==2">
                  启用
                </el-button>
                <el-button v-if="scope.row.status==1" @click="stop(scope.row.unionid)" type="text" style="color:red;" size="small">
                  停用
                </el-button>
                <el-button @click="alertShow(scope.row.unionid)" type="text" size="small">资产明细</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            class="pagination"
            v-show="total>0"
            :total="total"
            :page.sync="form.page_num"
            :limit.sync="form.page_size"
            v-on:pagination="getSpokesManList"
          />
          <!-- 资产明细弹框 -->
          <el-col :span="24" class="alert-wrap" v-if="showAlert" @click.native="showAlert=false">
            <el-col :span="24" class="alert-content-wrap" @click.native.stop>

              <el-col :span="24" class="margin-top-20">交易统计</el-col>
              <el-table 
                border
                fit
                highlight-current-row
                align="middle"
                :data="detail">
                <el-table-column label="最近下单时间" prop="last_buy_time" align="center"></el-table-column>
                <el-table-column label="客单价" prop="per_amount" align="center"></el-table-column>
                <el-table-column label="累计消费金额" prop="sum_amount" align="center"></el-table-column>
                <el-table-column label="累计消费订单数" prop="count_order_num" align="center"></el-table-column>
                <!-- <el-table-column label="最近下单时间" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.last_buy_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column label="客单价" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.per_amount }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column label="累计消费金额" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.sum_amount }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column label="累计消费订单数" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.count_order_num }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  label="累计退款金额"
                  align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.nickname }}</el-col>
                    <el-col :span="24">{{ scope.row.create_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  label="累计退款订单数"
                  align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.count_order_num }}</el-col>
                  </template>
                </el-table-column> -->
              </el-table>

              <!-- <el-col :span="24" class="margin-top-50">资产信息</el-col>
              <el-table
                border
                fit
                size="small"
                highlight-current-row
                align="middle"
                >
                <el-table-column
                  label="累计收益金额"
                  align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.nickname }}</el-col>
                    <el-col :span="24">{{ scope.row.create_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  label="今日收益"
                  align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.nickname }}</el-col>
                    <el-col :span="24">{{ scope.row.create_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  label="当前余额"
                  align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.nickname }}</el-col>
                    <el-col :span="24">{{ scope.row.create_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  label="累计提现金额"
                  align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.nickname }}</el-col>
                    <el-col :span="24">{{ scope.row.create_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center">
                  <template slot-scope="scope">
                    <el-button
                      @click="goDetail(scope.row)"
                      type="text"
                      size="small"
                    >收益明细</el-button>
                  </template>
                </el-table-column>
              </el-table> -->
              
            </el-col>
          </el-col>

        </el-tab-pane>
      </el-tabs>
    </el-col>

  </div>
</template>

<script>
import { getSpokesManList, getSpokesManDetail,getUserPropertyDetail,updateUserStatus } from "@/api/spokesperson";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      titleShow: true,
      activeName: "first",
      status: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "正常"
        },
        {
          value: "2",
          label: "停用"
        }
      ],
      showAlert: false,
      form: {
        page_num: 1,
        page_size: 10,
        mobile: "",
        level_id: "",
        status: "",
        score_start: null,
        score_end: null,
        money_start: null,
        money_end: null,
        promotion_start: null,
        promotion_end: null,
        give_start: null,
        give_end: null
      },
      list: [
        // {
        //   "openid": "abcderfsadas",
        //   "nickname": "康祖明",
        //   "mobile": "15532145055",
        //   "unionid": "1111111111aaaaaaaaa",
        //   "level_name": "99级",
        //   "score": "998",
        //   "promotion_num": "1998",
        //   "give_num": "123",
        //   "use_num": "50",
        //   "prev_give_time": "1970-01-01 08:00:00",
        //   "status": "1"
        // }
      ],
      listLoading: true,
      total: 0,
      detail: [],
      value2:''
    };
  },
  created() {
    if(!(/^1[3456789]\d{9}$/.test(this.$route.params.id))){
      this.form.nickname = this.$route.params.id;
    }else{
      this.form.mobile = this.$route.params.id;
    }
    this.getSpokesManList();
  },
  methods: {
    // 查看资产明细
    goDetail() {},
    // 启用账户
    start(id) {
      updateUserStatus({unionid:id,status:1}).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.getSpokesManList();
        }
      });
    },
    // 停用账号
    stop(id) {
      updateUserStatus({unionid:id,status:2}).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.getSpokesManList();
        }
      });
    },
    // 显示资产明细弹框
    alertShow(unionid) {
      this.getSpokesManDetail(unionid);
      // 获取资产明细  显示弹框
      this.showAlert = true;
    },
    // 获取代言人列表
    getSpokesManList() {
      // this.form.nickname = this.$route.params.id;
      const data = this.form;
      this.listLoading = false;
      getSpokesManList(data).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.list = res.result.userList;
          this.total = Number(res.result.count);
        }
      });
    },
    goPromotion(id){
      this.$router.push({ path: `./promotionNum/${id}` });
    },
    goHeart(id){
      this.$router.push({ path: `./heartScore/${id}` });
    },
    // 修改时间
    changeTime(val) {
      console.log(val);
      if(val){
        this.form.give_start = val[0];
        this.form.give_end = val[1];
      }else{
        this.form.give_start = '';
        this.form.give_end = '';
      }
    },
    // 搜索
    search() {
      this.getSpokesManList();
    },
    // 获取资产明细
    getSpokesManDetail(unionid) {
      getUserPropertyDetail({unionid: unionid}).then(res => {
        if (res.code == 200) {
          let data = []; data.push(res.result);
          this.detail = data;
          this.showAlert = true;
        }
      });
    },
    handleClick(tab, event) {
      // this.data.case_title = '';
      // if (this.activeName === 'first') {
      //   this.type = 1;
      // } else if (this.activeName === 'second') {
      //   this.type = 2;
      // }
      // this.data.page_num = 1;
      // this.dataCase.page_num = 1;
      // this.getCaseList();
    }
  }
};
</script>
<style lang="scss">
.lineheight-32 {
  line-height: 32px;
  text-align: right;
  padding-right: 10px;
}
.app-container {
  position: relative;
  padding: 0 0 20px;
  .table-wrap {
    padding: 20px;
    .coverimg {
      width: 50px;
      height: 50px;
    }
  }
}
.title-header {
  box-sizing: border-box;
  padding: 10px 0;
}
.pagination {
  margin-top: 10px;
}
.sub-navbar {
  text-align: left;
  .subtitle {
    padding: 0 20px;
  }
}
.alert {
  &-wrap {
    z-index: 1002;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 100px 150px 100px 200px;
  }
  &-content-wrap {
    border-radius: 5px;
    height: 100%;
    width: 100%;
    padding: 50px 50px;
    background-color: #fff;
    overflow-y: auto;
    .margin-top-20 {
      margin-top: 20px;
      height: 30px;
      line-height: 30px;
    }
    .margin-top-50 {
      margin-top: 50px;
      height: 30px;
      line-height: 30px;
    }
  }
}
.close-alert {
  text-align: right;
  font-size: 30px;
  color: #ccc;
}
.success-btn {
  text-align: right;
}
</style>
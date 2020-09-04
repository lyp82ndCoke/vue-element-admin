<template>
  <div class="app-container">
    <el-col
      :span="24"
      class="table-wrap">
      <el-row>
        <el-col :span="24">
          <el-col :span="4">
            <el-select
              size="mini"
              v-model="data.is_used"
              @change="change"
              placeholder="全部">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="7">
            <el-date-picker
              size="mini"
              v-model="timeVale"
              type="daterange"
              align="right"
              range-separator="至"
              start-placeholder="选择领取开始日期"
              end-placeholder="选择领取结束日期"
              value-format="yyyy-MM-dd"
              @change="changeTime"
            ></el-date-picker>
          </el-col>
        
          <el-col :span="4">
            <el-input
              size="mini"
              placeholder="请输入用户昵称"
              clearable
              prefix-icon="el-icon-search"
              v-model="data.nickname"
              @keyup.native.enter="change"
              @clear="change"
            ></el-input>
          </el-col>
          <el-col
            :span="2"
            class="success-btn"
            align="right">
            <el-button
              type="success"
              @click="change"
              icon="el-icon-search"
              size="mini"
            >搜索</el-button>
          </el-col>
          <el-col
            :span="2"
            class="success-btn"
            align="center">
            <el-button
              type="primary"
              @click="goBoss"
              size="mini"
            >导出</el-button>
          </el-col>
        </el-col>
      </el-row>

      <el-row>
        <el-col
          :span="24"
          class="title-header">
          <el-table
            :data="list"
            element-loading-text="Loading"
            border
            fit
            size="mini"
            highlight-current-row
            align="middle">
            <el-table-column
              label="用户"
              align="center">
              <template slot-scope="scope">
                <el-col :span="24">
                  <el-col :span="6"><img width="50" style="border-radius: 50%;" :src="scope.row.headimgurl"/></el-col>
                  <el-col :span="16" align="left">
                    <el-col :span="24">{{scope.row.nickname}}</el-col>
                    <el-col :span="24">{{scope.row.mobile}}</el-col>
                  </el-col>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column
              label="领取时间"
              align="center"
              >
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.receive_time }}</el-col>
              </template>
            </el-table-column>
            <el-table-column
              label="使用时间"
              align="center"
              >
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.user_time?scope.row.user_time:'——' }}</el-col>
              </template>
            </el-table-column>
            <el-table-column
              label="领取来源"
              align="center"
              >
              <template slot-scope="scope">
                <el-col :span="24" v-if="scope.row.receive_type == 0">系统发送</el-col>
                <el-col :span="24" v-else-if="scope.row.receive_type == 1">用户领取</el-col>
              </template>
            </el-table-column>


            <el-table-column
              label="操作"
              align="center"
              width="200"
              class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="text"
                  v-if="scope.row.user_tid"
                  @click="viewOrder(scope.row.user_tid)"
                >查看订单</el-button>
                <el-button
                  size="small"
                  type="text"
                  v-else
                  disabled
                >查看订单</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            class="pagination"
            v-show="total>0"
            :total="total"
            :page.sync="data.page_no"
            :limit.sync="data.page_size"
            v-on:pagination="getItemList"/>
        </el-col>
      </el-row>
    </el-col>

    <!-- 查看订单 -->
    <el-dialog
      :visible.sync="singleOther"
      width="70%"
      :before-close="handleOther"
      class="sheet-details single-other">
        <el-table
          :data="orderList"
          element-loading-text="Loading"
          border
          fit
          size='mini'
          highlight-current-row>
          <el-table-column label="用户昵称" align="center">
            <template slot-scope="scope">
              <el-col :span="24">{{scope.row.buyer_info.nickname}}</el-col>
            </template>
          </el-table-column>
          <el-table-column label="手机号码" align="center">
            <template slot-scope="scope">
              <el-col :span="24">{{scope.row.buyer_info.mobile}}</el-col>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">
              <el-col :span="24">{{scope.row.orders[0].item_name}}</el-col>
            </template>
          </el-table-column>
          <el-table-column label="一级规格" align="center">
            <template slot-scope="scope">
              <el-col :span="24">{{scope.row.orders[0].sku1_v?scope.row.orders[0].sku1_v:'---'}}</el-col>
            </template>
          </el-table-column>
          <el-table-column label="二级规格" align="center">
            <template slot-scope="scope">
              <el-col :span="24">{{scope.row.orders[0].sku2_v?scope.row.orders[0].sku2_v:'---'}}</el-col>
            </template>
          </el-table-column>
          <el-table-column label="三级规格" align="center">
            <template slot-scope="scope">
              <el-col :span="24">{{scope.row.orders[0].sku3_v?scope.row.orders[0].sku3_v:'---'}}</el-col>
            </template>
          </el-table-column>
          <el-table-column label="优惠券名称" align="center">
            <template slot-scope="scope">
              <el-col :span="24">{{scope.row.order_promotion[0].card_name}}</el-col>
            </template>
          </el-table-column>
          <el-table-column label="优惠券ID" align="center">
            <template slot-scope="scope">
              <el-col :span="24">{{scope.row.order_promotion[0].card_id}}</el-col>
            </template>
          </el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getPromocardList, getTradeList } from '@/api/giftCard'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      data: {
        card_code: "",
        is_used: "",
        nickname: "",
        begin_date: "",
        end_date: "",
        page_no: 1,
        page_size: 10
      },
      timeVale: "",
      list: [],
      total: 0,
      options: [
        {
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '待使用'
        }, {
          value: '1',
          label: '已使用'
        }
      ],
      singleOther: false,
      orderDetail:{
        page_no: 1,
        page_size: 10,
        tid: ""
      },
      orderList: []
    }
  },
  created() {
    this.processHost = process.env.MALL_API;
    this.data.card_code = this.$route.params.id;
    this.getItemList();
  },
  methods: {
    getItemList() {
      getPromocardList(this.data).then(res => {
        if (res.code == 200) {
          this.list = res.result.rows;
          this.total = res.result.total;
        }
      })
    },
    change() {
      this.data.page_no = 1;
      this.getItemList()
    },
    viewOrder(tid){
      this.orderDetail.tid = tid;
      getTradeList(this.orderDetail).then(res => {
        if(res.code == 200){
          this.orderList = res.result.rows;
        }
      })
      this.singleOther = true;
    },
    handleOther(){
      this.singleOther = false;
    },
    changeTime(val){
      if(val){
        this.data.begin_date = val[0];
        this.data.end_date = val[1];
      }else{
        this.data.begin_date = '';
        this.data.end_date = '';
      }
      this.data.page_no = 1;
      this.getItemList();
    },
    goBoss(){
      window.location.href="https://boss.zmedc.com";
    }
  }
}
</script>
<style lang="scss" scoped>
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
  padding: 10px 0;
}
.pagination {
  margin-top: 10px;
}
</style>

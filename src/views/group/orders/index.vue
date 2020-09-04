<template>
  <div class="app-container">
    <el-col :span="24" class="title-header">
      <!-- <el-col :span="4"> -->
      <!-- <el-button size="small" type="primary" @click="goGoods(0)">导出</el-button> -->
      <!-- </el-col> -->
      <el-row :span="24">
        <el-col :span="7">
          <el-date-picker
            v-model="contract_time"
            type="daterange"
            range-separator="至"
            start-placeholder="下单开始日期"
            end-placeholder="下单结束日期"
            size="small"
            value-format="yyyy-MM-dd"
            @change="handleContract"
          ></el-date-picker>
        </el-col>
        <el-col :span="4" style="margin-left:10px;">
          <el-input
            size="small"
            v-model="listQuery.nickname"
            placeholder="请输入用户昵称"
            @keyup.native.enter="searchOrderList"
          ></el-input>
        </el-col>
        <el-col :span="4" style="margin-left:20px;">
          <el-input
            size="small"
            v-model="listQuery.mobile"
            placeholder="请输入用户手机号"
            @keyup.native.enter="searchOrderList"
          ></el-input>
        </el-col>
        <el-col :span="7" style="margin-left:20px;">
          <el-select
            clearable
            size="small"
            v-model="listQuery.status_code"
            @change="handleStatus"
            placeholder="请输入支付状态">
            <el-option v-for="(item,index) in payOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row :span="24" style="margin-top: 15px;">
        <el-col :span="4">
          <el-input
            size="small"
            v-model="listQuery.item_name"
            placeholder="请输入商品名称"
            @keyup.native.enter="searchOrderList"
          ></el-input>
        </el-col>
        <el-col :span="4" style="margin-left:20px;">
          <el-input
            size="small"
            v-model="listQuery.item_id"
            placeholder="请输入商品ID"
            @keyup.native.enter="searchOrderList"
          ></el-input>
        </el-col>
        <el-col :span="4" style="margin-left:10px;">
          <el-input
            size="small"
            v-model="listQuery.tid"
            placeholder="请输入订单ID"
            @keyup.native.enter="searchOrderList"
          ></el-input>
        </el-col>
        <el-col :span="2" class="success-btn">
          <el-button
            type="success"
            @click="searchOrderList"
            icon="el-icon-search"
            size="small"
          >搜索</el-button>
        </el-col>
      </el-row>
    </el-col>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      size="small"
      highlight-current-row>
      <el-table-column label="用户昵称" align="center">
        <template slot-scope="scope"><el-col>{{scope.row.buyer_info.nickname}}</el-col></template>
      </el-table-column>
      <el-table-column class-name="status-col" label="手机号码" width="130" align="center">
        <template slot-scope="scope">
          <el-col class="upper">{{scope.row.buyer_info.mobile}}</el-col>
        </template>
      </el-table-column>
      <el-table-column label="总金额(元)" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_info.total_fee > 0 ? scope.row.order_info.total_fee / 100 : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付金额(元)" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_info.payment > 0 ? scope.row.order_info.payment / 100 : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.order_info.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.order_info.pay_time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单ID" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.order_info.tid}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="100" align="center">
        <template v-if="scope.row.pay_info.length>0" slot-scope="scope">
          <span v-if="scope.row.pay_info[0].pay_type_str == 'weixin'">微信</span>
          <span v-else-if="scope.row.pay_info[0].pay_type_str == 'alipay'">支付宝</span>
          <span v-else-if="scope.row.pay_info[0].pay_type_str == 'promocard' && scope.row.pay_info[1] && scope.row.pay_info[1].pay_type_str == 'weixin'">微信</span>
          <span v-else-if="scope.row.pay_info[0].pay_type_str == 'promocard' && scope.row.pay_info[1] && scope.row.pay_info[1].pay_type_str == 'alipay'">支付宝</span>
          <span v-else-if="scope.row.pay_info[0].pay_type_str == 'promocard'">优惠券</span>
        </template>
      </el-table-column>
      <el-table-column label="支付ID" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.order_info.wx_transaction_id}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="地区" align="center">
        <template slot-scope="scope">
          <span>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="付款时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.pay_time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.status_code_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入群状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.real_status_name}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="created_at" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goDetails(scope.row.orders,scope.row.buyer_info.nickname,scope.row.buyer_info.mobile,scope.row.order_promotion)">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      class="pagination"
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page_no"
      :limit.sync="listQuery.page_size"
      v-on:pagination="getGoodsOrderList"
    />

    <!-- 订单明细 -->
    <div :span="24" v-if="articleDetail" class="alert-wrap" @click.self="hiddenArticle">
      <el-col :span="24" class="alert-content-wrap">
        <el-table
          v-loading="orderLoading"
          :data="orderList"
          element-loading-text="Loading"
          border
          fit
          size="small"
          highlight-current-row>
          <el-table-column label="用户昵称" align="center">
            <template slot-scope="scope">{{ nickname }}</template>
          </el-table-column>
          <el-table-column label="手机号码" align="center">
            <template slot-scope="scope">{{ mobile }}</template>
          </el-table-column>
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">
              <el-col>{{scope.row.item_name}}</el-col>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="一级规格" align="center">
            <template slot-scope="scope">
              <el-col class="upper">{{scope.row.sku1_v}}</el-col>
            </template>
          </el-table-column>
          <el-table-column label="二级规格" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sku2_v ? scope.row.sku2_v : '---' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="三级规格" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sku3_v ? scope.row.sku3_v : '---'}}</span>
            </template>
          </el-table-column>

          <el-table-column label="优惠券名称" align="center">
            <template slot-scope="scope">
              <span v-if="order_promotion">{{order_promotion.card_name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="优惠券ID" align="center">
            <template slot-scope="scope">
              <span v-if="order_promotion">{{order_promotion.card_id}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getGoodsOrderList } from '@/api/shopGoods'
import Pagination from '@/components/Pagination'
import Request from '@/utils/request'
export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      contract_time:[],
      // 支付状态options
      payOptions: [
        {
          label: '待付款',
          value: '1,3'
        },
        {
          label: '已支付',
          value: '2'
        },
        {
          label: '已超时',
          value: '99'
        },
        {
          label: '全部',
          value: ''
        }
      ],
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        sort_name: 'pay_time',
        sort_order: 'desc',
        begin_date: '',
        end_date: '',
        mobile: '',
        page_no: 1,
        page_size: 10,
        status_code: '2',
        item_name: '',
        tid: ''
      },
      articleDetail: false,
      orderLoading: false,
      orderList: [],
      nickname: "",
      mobile: "",
      order_promotion: {}
    }
  },
  created() {
    this.getGoodsOrderList()
  },
  methods: {
    // 获取订单list
    getGoodsOrderList() {
      this.listLoading = true;
      getGoodsOrderList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.list = res.result.rows;
          this.total = res.result.total;
          this.listLoading = false;
        }
      })
    },
    handleContract(val){
      if(val){
        this.listQuery.begin_date = val[0];
        this.listQuery.end_date = val[1];
      }else{
        this.listQuery.begin_date = '';
        this.listQuery.end_date = '';
      }
    },
    goDetails(data,nickname,mobile,order_promotion){
      this.articleDetail = true;
      this.orderList = data;
      this.nickname = nickname;
      this.mobile = mobile;
      this.order_promotion = order_promotion[0];
      
      // console.log(data,'数据')
      // this.$router.push({path: './details', query: {data: JSON.stringify(data),nickname,mobile}})
    },
    hiddenArticle(){
      this.articleDetail = false;
    },
    searchOrderList(){
      this.listQuery.page_no = 1;
      this.getGoodsOrderList()
    },
    handleStatus(value){
      if(value == 2){
        this.listQuery.sort_name = "pay_time";
      }else{
        this.listQuery.sort_name = "created_at";
      }
      this.searchOrderList();
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  .head-img {
    width: 80px;
    height: 80px;
  }
}
.title-header {
  padding: 10px 0;
}
.success-btn {
  text-align: right;
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
    padding: 50px 150px 50px 200px;
  }
  &-content-wrap {
    border-radius: 5px;
    height: 100%;
    width: 100%;
    padding: 20px;
    background-color: #fff;
  }
}
</style>

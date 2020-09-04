<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">购卡记录</el-col>
    </sticky>
    <el-col :span="24" class="table-wrap"> 
      <el-col :span="24" class="title-header">
        <el-col :span="4">
          <el-select v-model="form.status_code" clearable placeholder="请选择订单状态" size="small" @change="getTradeList">
            <el-option
              v-for="item in [{label:'全部',value: ''},{label:'待付款',value: '1,3'},{label:'支付成功',value: '2'},{label:'超时取消',value:'99'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="6">
          <el-date-picker
            v-model="contract_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            value-format="yyyy-MM-dd"
            @change="handleContract"
          ></el-date-picker>
        </el-col>

        <el-col :span="4" style="margin-right: 20px;margin-left: 40px;">
          <el-input
            size="small"
            clearable
            placeholder="请输入购卡人名称"
            prefix-icon="el-icon-search"
            v-model="form.purchase_nickname"
          ></el-input>
        </el-col>


        <el-col :span="4" style="margin-right: 20px;">
          <el-input
            size="small"
            placeholder="请输入购卡人手机号"
            clearable
            prefix-icon="el-icon-search"
            v-model="form.mobile"
          ></el-input>
        </el-col>

        <el-col :span="2" class="success-btn">
          <el-button
            type="success"
            @click="searchGoods"
            icon="el-icon-search"
            size="small"
          >搜索</el-button>
        </el-col>
      </el-col>
      <el-table
        :height="caseHeight"
        v-loading="caseLoading"
        :data="caseList"
        element-loading-text="Loading"
        border
        fit
        size="mini"
        highlight-current-row
        align="middle">
        <el-table-column label="下单时间" align="center">
          <template slot-scope="scope">
            <el-col :span="24">{{ scope.row.order_info.created_at }}</el-col>
          </template>
        </el-table-column>
        <el-table-column label="规格" align="center">
          <template slot-scope="scope">
            <el-col :span="24" v-if="scope.row.orders[0].sku1_v">{{ scope.row.orders[0].sku1_v }}</el-col>
            <el-col :span="24" v-else-if="scope.row.orders[0].sku2_v">{{ scope.row.orders[0].sku2_v }}</el-col>
            <el-col :span="24" v-else-if="scope.row.orders[0].sku3_v">{{ scope.row.orders[0].sku3_v }}</el-col>
          </template>
        </el-table-column>
        <el-table-column label="购卡人" align="center">
          <template slot-scope="scope">
            <el-col :span="24">
              <el-col :span="6"><img width="50" style="border-radius: 50%;" :src="scope.row.buyer_info.headimgurl"/></el-col>
              <el-col :span="16">
                <el-col :span="24" align="left">
                  <el-button
                    size="small"
                    type="text"
                    @click="buyerInfo(scope.row.buyer_info.nickname)"
                  >{{scope.row.buyer_info.nickname}}</el-button>
                </el-col>
                <el-col :span="24" align="left">
                  <el-button
                    size="small"
                    type="text"
                    @click="buyerInfo(scope.row.buyer_info.mobile)"
                  >{{scope.row.buyer_info.mobile}}</el-button>
                </el-col>
              </el-col>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" align="center">
          <template slot-scope="scope">
            <el-col :span="24">{{ scope.row.orders[0].total_fee }}</el-col>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-col :span="24" v-if="scope.row.order_info.status_code==2">支付成功</el-col>
            <el-col :span="24" v-else-if="scope.row.order_info.status_code==99">超时取消</el-col>
            <el-col :span="24" v-else="scope.row.order_info.status_code==1">待付款</el-col>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        class="pagination"
        v-show="caseTotal>0"
        :total="caseTotal"
        :page.sync="form.page_no"
        :limit.sync="form.page_size"
        v-on:pagination="getTradeList"
      />
    </el-col>
  </div>
</template>

<script>
import { getTradeList } from "@/api/giftCard"
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      type: 3,
      activeName: 'first',
      caseHeight: null,
      caseLoading: false,
      caseList: [],
      caseTotal: 0,
      list: [],
      listLoading: false,
      contract_time: [],
      form: {
        page_no: 1,
        page_size: 50,
        is_used: null,
        item_type: 7,
        begin_date: "",
        end_date: "",
        purchase_nickname: "",
        mobile: "",
        sort_name: "created_at",
        sort_order: 'desc',
        item_id: ""
      },
    }
  },
  created() {
    this.getTradeList();
    this.form.item_id = this.$route.query.item_id;
  },
  methods: {
    // 购卡记录
    getTradeList(){ 
      getTradeList(this.form).then(res => {
        if(res.code == 200){
          this.caseList = res.result.rows;
          this.caseTotal = res.result.total;
        }
      })
    },
    handleContract(val){
      this.form.begin_date = val[0];
      this.form.end_date = val[1];
    },
    searchGoods() {
      this.form.page_no = 1;
      this.getTradeList();
    },
    buyerInfo(value){
      this.$router.push({ name:'peopleManage', params:{ id:value }})
    }
  }
}
</script>
<style lang="scss">
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
    padding: 50px 150px 50px 200px;
  }
  &-content-wrap {
    border-radius: 5px;
    height: 100%;
    width: 100%;
    padding: 20px;
    background-color: #fff;
    overflow-y: auto;
  }
}
.close-alert {
  text-align: right;
  font-size: 30px;
  color: #ccc;
}
.search-btn {
  margin-left: 20px;
}
.add-com {
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
}
.success-btn {
  text-align: right;
}
.single.el-radio.is-bordered {
  width: 212px;
  height: 34px;
  line-height: 34px;
  padding: 0 0 0 10px;
  background-color: #fff;
  margin-left: 0;
  margin-bottom: 10px;
}
#checkbox {
  background-color: #eee;
}
#checkbox .el-checkbox.single {
  width: 212px;
  height: 34px;
  line-height: 34px;
  padding: 0 0 0 10px;
  margin-left: 0;
  margin-bottom: 10px;
}
.form_name .textarea {
  width: 460px;
}
.form_name .textarea .el-textarea__inner {
  min-height: 110px;
}
.input_element {
  margin-bottom: 32px;
}
.text_overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}
.overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.btn-bottom {
  position: fixed;
  bottom: 70px;
  left: 280px;
}
.input-prompt {
  font-size: 12px;
  color: red;
}
.question {
  padding-left: 140px;
  margin-bottom: 10px;
}
.icon_add {
  font-size: 24px;
  padding-left: 15px;
  padding-top: 3px;
}
.case-table .el-form-item__content {
  width: 85%;
}
.theme-margin .el-form-item__content {
  width: 85%;
  padding-left: 140px;
}
.left-title {
  color: #606266;
  font-size: 14px;
  font-weight: 700;
}
.comment-padding {
  padding: 25px 0;
}
.comment-padding p {
  margin: 0;
}
.icon_add {
  font-size: 24px;
  padding-left: 20px;
  padding-top: 7px;
}
.disable-p {
  background-color: #eee;
  border-radius: 5px;
  padding: 10px;
  line-height: 16px;
  word-wrap: break-word;
}
</style>


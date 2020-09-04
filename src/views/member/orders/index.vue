<template>
  <div class="app-container">
    <el-col :span="24" class="title-header">
      <!-- <el-col :span="4"> -->
      <!-- <el-button size="small" type="primary" @click="goGoods(0)">导出</el-button> -->
      <!-- </el-col> -->
      <el-col :span="4">
        <el-input
          size="small"
          v-model="listQuery.mobile"
          placeholder="用户手机号"
          @keyup.native.enter="getOrderList"
        ></el-input>
      </el-col>
      <el-col :span="6" align="right">
        支付状态：
        <el-select
          clearable
          size="small"
          v-model="listQuery.status_code"
          @change="getOrderList"
          placeholder="支付状态"
        >
          <el-option v-for="item in payOptions" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
    </el-col>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      size="small"
      highlight-current-row
    >
      <el-table-column label="订单ID" align="center">
        <template slot-scope="scope">{{ scope.row.tid }}</template>
      </el-table-column>
      <el-table-column label="商品名称" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.pic_url" class="head-img" alt>
          <el-col>{{scope.row.item_name}}</el-col>
          <!-- <el-col>完播率：0</el-col> -->
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="一级规格（营期）" width="200" align="center">
        <template slot-scope="scope">
          <el-col class="upper">{{scope.row.sku1_v}}</el-col>
        </template>
      </el-table-column>
      <el-table-column label="群名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.chatroom_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付流水" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.transaction_id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实付金额" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.payment}}</span>
        </template>
      </el-table-column>
      <el-table-column label="二级规格（辅导员老师）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sku2_v}}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买昵称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sex}}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买手机号码" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column label="地区" align="center">
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
      </el-table-column>

      <!-- <el-table-column align="center" prop="created_at" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goGoods(scope.row.id)">退款</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <pagination
      class="pagination"
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page_no"
      :limit.sync="listQuery.page_size"
      v-on:pagination="getOrderList"
    />
  </div>
</template>

<script>
import { getOrderList } from '@/api/group'
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
      // 支付状态options
      payOptions: [
        {
          label: '待付款',
          value: '1'
        },
        {
          label: '已支付',
          value: '2'
        },
        {
          label: '已超时',
          value: '99'
        }
      ],
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        mobile: '',
        page_no: 1,
        page_size: 10,
        status_code: '',
        item_name: ''
      },
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单list
    getOrderList() {
      this.listLoading = true;
      getOrderList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.list = res.result.rows;
          this.total = res.result.total;
          this.listLoading = false;
        }
      })
    },
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

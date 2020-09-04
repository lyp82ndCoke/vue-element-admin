<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      size="small"
      highlight-current-row
    >
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
      <el-table-column class-name="status-col" label="一级规格" width="200" align="center">
        <template slot-scope="scope">
          <el-col class="upper">{{scope.row.sku1_v}}</el-col>
        </template>
      </el-table-column>
      <el-table-column label="二级规格" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sku2_v ? scope.row.sku2_v : '---' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="三级规格" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sku3_v ? scope.row.sku3_v : '---'}}</span>
        </template>
      </el-table-column>
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
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page_no: 1,
        page_size: 10,
      },
      nickname: "",
      mobile: ""
    }
  },
  created() {
    console.log(JSON.parse(this.$route.query.data),'haha')
    this.list = JSON.parse(this.$route.query.data);
    this.nickname = this.$route.query.nickname;
    this.mobile = this.$route.query.mobile;
  },
  methods: {
    
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

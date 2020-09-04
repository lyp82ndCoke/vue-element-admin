<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-col color :span="10">
          状态：
          <el-select
            size="small"
            @change="changeStatus"
            v-model="listQuery.status"
            placeholder="全部"
          >
            <el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-col>

      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size="mini"
        highlight-current-row
        align="middle"
      >
        <el-table-column label="ID">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="排班明细（群名称）">
          <template slot-scope="scope">
            <!-- <img align='center' class="coverimg" :src="scope.row.coverimg" alt=""> -->
            <span style="padding:0 5px;">{{ scope.row.group_name }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="创建">
          <template slot-scope="scope">{{ scope.row.create_name }}</template>
        </el-table-column> -->
        <el-table-column label="群角色" align="center">
          <template slot-scope="scope">
            <el-col v-for="(item,index) in scope.row.persons" :key="index">{{ item.group_name }}：{{item.nickname}}</el-col>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="预计（天）" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.expect_days }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="开始时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.start_time }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="结束时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.end_time }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status==3" style="color:red;">进行中</span>
            <span v-if="scope.row.status==2" style="color:red;">排期中</span>
            <span v-if="scope.row.status==4" style="color:red;">已过期</span>
            <span v-if="scope.row.status==1" style="color:#ddd;">已关闭</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="changePaging"
      />
    </el-col>
  </div>
</template>

<script>
import { myScheduling } from '@/api/counselor'
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
      options: [{ label: "全部", value: '' }, { label: "进行中", value: "3" }, { label: "排期中", value: "2" }, { label: "已过期", value: "4" }, { label: "已关闭", value: "1" }],
      list: null, // 此活动关联的商品数据
      total: 0,
      listQuery: {
        status: '',
        page_num: 1,
        page_size: 10,
      },
    }
  },
  created() {
    // console.log(his.$route.params, '此活动的id')
    this.goodsList();
  },
  methods: {
    changePaging(val) {
      const map = {
        actid: this.goodsListId,
        page: val.page,
        limit: val.limit
      }
      this.goodsList()
    },

    // 辅导员排班列表
    goodsList() {
      this.listLoading = true;
      const map = this.listQuery;
      myScheduling(map).then((res) => {
        this.listLoading = false;
        this.list = res.result.list;
        this.total = res.result.count;
      })
    },
    // 切换状态
    changeStatus() {
      this.listQuery.page_num = 1;
      this.goodsList()
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
}
.success-btn {
  text-align: right;
}
</style>


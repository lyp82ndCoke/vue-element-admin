<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">排行榜管理</el-col>
    </sticky>
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <span class="demonstration">时间段：</span>
        <el-date-picker
          size="small"
          v-model="listQuery.time_slot"
          type="daterange"
          align="right"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          @change="changeTime"
        ></el-date-picker>
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
        <el-table-column label="名次">
          <template slot-scope="scope">{{ scope.row.ranking}}</template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span style="padding:0 5px;">{{ scope.row.real_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总分">
          <template slot-scope="scope">{{ scope.row.countScore }}</template>
        </el-table-column>
        <el-table-column label="采纳得分" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.adpot_value }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="分享得分" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.share_value }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="有用得分" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.useful_value }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="阅读得分" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.read_value }}</span>
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
import { getRankList } from '@/api/counselor'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      // 快捷选项（日期）
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      list: null,
      listLoading: false,
      total: 0,
      listQuery: {
        time_slot: [],
        page_num: 1,
        page_size: 10,
      },
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 切换时间段
    changeTime() {
      // console.log(this.timeVale)
      this.getList();
    },
    // 获取list
    getList() {
      // this.listLoading = true;
      getRankList(this.listQuery).then((res) => {
        this.listLoading = false;
        this.list = res.result.list;
        this.total = res.result.sign.count;
      })
    },
    // 切换分页
    changePaging() {
      this.getList()
    },
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
</style>


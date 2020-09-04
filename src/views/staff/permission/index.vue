<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-col :span="4">
          <el-button size="small" type="primary" @click="goNews(0)">新建角色</el-button>
        </el-col>
        <el-col :span="5">
          <el-input
            size="small"
            placeholder="请输入角色名称"
            prefix-icon="el-icon-search"
            v-model="listQuery.searchText"
            @keyup.enter.native="search"
          ></el-input>
        </el-col>
      </el-col>

      <el-table
        :height="height"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size="mini"
        highlight-current-row
        align="middle"
      >
        <el-table-column label="角色名称">
          <template slot-scope="scope">{{ scope.row.group_title }}</template>
        </el-table-column>
        <el-table-column label="员工数">
          <template slot-scope="scope">{{ scope.row.user_num }}</template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ scope.row.create_time }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="goNews(scope.row.id)">编辑</el-button>
            <el-button
              v-if="scope.row.user_num<=0"
              size="small"
              style="color:red"
              type="text"
              @click="deleteRoleAlert(scope.row.id,scope.$index,scope.row.group_title)"
            >删除</el-button>
            <el-button v-else size="small" disabled type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="changePage"
      />
    </el-col>
  </div>
</template>

<script>
import { getRoles, resetPassword, stopUser } from '@/api/rule'
import Pagination from '@/components/Pagination'
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
      height: null,
      options: [],
      list: null,
      listLoading: false,
      total: 0,
      listQuery: {
        page_num: 1,
        page_size: 10,
        searchText: '',
      },
      alertShow: false
    }
  },
  created() {
    this.getRoles();
    // this.getList();
  },
  methods: {
    // 获取角色列表
    getRoles(val) {
      this.listQuery.page_num = val || 1;
      this.listLoading = true
      getRoles(this.listQuery).then(response => {
        // console.log(response.result.listData)
        this.list = response.result.listData;
        this.total = response.result.count;
        this.listLoading = false;
      })
    },
    // 删除角色
    deleteRoleAlert(group_id, index, name) {
      this.$confirm(`您确认删除 <strong><i>${name}</i></strong> 的角色吗?`, '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRole(group_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    deleteRole(group_id, index, name) {
      this.$message('还没写')
    },
    // 切换角色
    changeRole() {
      this.getList();
    },
    hiddenAlert() {
      this.alertShow = false;
    },
    // 搜索
    search() {
      this.getRoles();
    },
    // 分页获取
    changePage(val) {
      // console.log(val.page)
      this.getRoles(val.page);
    },

    // 新建或者编辑员工账号信息
    goNews(id) {
      // console.log(id)
      // router.push({ path: `/user/${userId}` })
      this.$router.push({ path: `news/${id}` })
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
</style>


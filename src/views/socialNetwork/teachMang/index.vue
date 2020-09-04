<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col
        :span="10"
        class="subtitle"
      >教研管理</el-col>
    </sticky>
    <el-col
      :span="24"
      class="table-wrap"
    >
      <el-col
        :span="24"
        class="title-header"
      >
        <el-col
          :span="2"
          align="left"
        >
          <el-button
            size="small"
            type="danger"
            @click="addInstructor(0)"
          >添加教研</el-button>
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
        <el-table-column
          label="真实姓名"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.real_name }}</template>
        </el-table-column>
        <el-table-column
          label="微信昵称"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="手机号"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="status-col"
          label="状态"
          align="center"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.status == 1"
              style="color:red;"
            >正常</span>
            <span
              v-else-if="scope.row.status == 2"
              style="color:#ccc;"
            >清退</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              v-if="scope.row.status == 1"
              @click="delArticle(scope.row.user_uuid)"
            >清退</el-button>
            <el-button
              size="small"
              type="text"
              v-else
              @click="userOn(scope.row.user_uuid)"
            >启用</el-button>
            <el-button
              size="small"
              type="text"
              @click="editArticle(scope.row.user_uuid)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="form.page_num"
        :limit.sync="form.page_size"
        v-on:pagination="getSchedulingGroup"
      />
    </el-col>
  </div>
</template>

<script>
import { getSchedulingGroup, removeCounsellorList, userOnCounsellor } from '@/api/articleLibrary'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      height: null,
      list: [],
      listLoading: false,
      total: 0,
      form: {
        page_num: 1,
        page_size: 10,
      }
    }
  },
  created() {
    this.getSchedulingGroup();
  },
  methods: {
    //教研列表
    getSchedulingGroup() {
      this.listLoading = true;
      const map = { ...this.form }
      getSchedulingGroup(map).then((res) => {
        if (res.code == 200) {
          this.list = res.result.list;
          this.total = res.result.sign.count;
          this.listLoading = false;
        }
      })
    },
    //添加教研
    addInstructor(id) {
      this.$router.push({ path: `./add/${id}` })
    },
    changePaging(val) {
      const map = {
        page_num: val.page,
        page_size: val.limit
      }
    },
    changeAlert(val) {
      const map = {
        page: val.page,
        limit: val.limit
      }
    },
    // 教研列表 清退
    delArticle(uuid) {
      let that = this;
      this.$confirm('确认要清退该教研吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.removeCounsellorList(uuid);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清退'
        });
      });
    },
    removeCounsellorList(uuid) {
      const map = {
        uuid,
        role_type: 2
      }
      removeCounsellorList(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.getSchedulingGroup();
        } else {
          this.$message({
            type: 'warning',
            message: res.msg
          });
        }
      })
    },
    // 教研管理 编辑
    editArticle(id) {
      this.$router.push({ path: `./add/${id}` })
    },
    //启用教研
    userOn(user_uuid) {
      var that = this;
      this.$confirm('确认要启用该教研吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.userOnCounsellor(user_uuid);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消启用'
        });
      });
    },
    userOnCounsellor(user_uuid) {
      const map = {
        user_uuid
      }
      userOnCounsellor(map).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '启用成功'
          });
          this.getSchedulingGroup();
        }
      })
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


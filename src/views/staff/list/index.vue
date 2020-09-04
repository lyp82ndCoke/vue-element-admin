<template>
  <div class="app-container">
    <el-col
      :span="24"
      class="table-wrap"
    >
      <el-col
        :span="24"
        class="title-header"
      >
        <el-col :span="4">
          <el-button
            size="small"
            type="primary"
            @click="goNews(0)"
          >新建账号</el-button>
        </el-col>
        <el-col :span="4">
          <el-select
            size="small"
            v-model="listQuery.group_id"
            placeholder="请选择部门"
            @change="changeRole"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.group_title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input
            size="small"
            placeholder="请输入手机号"
            prefix-icon="el-icon-search"
            v-model="listQuery.mobile"
            @keyup.enter.native="search"
          ></el-input>
        </el-col>
        <el-col
          :span="8"
          align="right"
        >
          <el-button
            size="small"
            type="primary"
          >批量导入</el-button>
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
        <el-table-column label="头像">
          <template slot-scope="scope">
            <img
              align="center"
              class="coverimg"
              :src="scope.row.head_portrait"
              alt
            >
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span style="padding:0 5px;">{{ scope.row.real_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="职称">
          <template slot-scope="scope">
            <span style="padding:0 5px;">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <span style="padding:0 5px;">{{ scope.row.group_title }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ scope.row.create_time }}</template>
        </el-table-column>
        <el-table-column
          label="手机号(登录账号)"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status ==1 ">
              <el-button
                size="small"
                type="text"
                @click="goNews(scope.row.user_id)"
              >编辑</el-button>
              <el-button
                size="small"
                type="text"
                @click="resetAlert(scope.row.user_id,scope.row.real_name)"
              >重置密码</el-button>
              <el-button
                size="small"
                type="text"
                @click="stopAlert(scope.row.user_id,scope.$index,scope.row.real_name)"
              >停用</el-button>
            </span>
            <span v-if="scope.row.status ==0 ">
              <el-button
                size="small"
                type="text"
                @click="runUser(scope.row.user_id,scope.$index,scope.row.real_name)"
              >启用</el-button>
            </span>
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
import { getUsers, getRoles, resetPassword, stopUser } from "@/api/rule";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      height: null,
      searchText: "",
      options: [],
      list: null,
      listLoading: false,
      total: 0,
      listQuery: {
        page_num: 1,
        page_size: 10,
        mobile: "",
        group_id: "",
        optionsValue: ""
      },
      alertShow: false
    };
  },
  created() {
    this.getRoles();
    this.getList();
  },
  methods: {
    // 获取角色列表
    getRoles() {
      const data = { page_num: 1, page_size: 100 };
      getRoles(data).then(response => {
        // console.log(response.result.listData)
        this.options = response.result.listData;
      });
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
      this.getList();
    },
    // 重置密码弹框
    resetAlert(user_id, name) {
      const username = name;
      this.$confirm(
        `您确认重置 <strong><i>${username}</i></strong> 的密码吗?`,
        "提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.resetPassword(user_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 重置密码
    resetPassword(user_id) {
      resetPassword({ user_id }).then(response => {
        if (response.code == 200) {
          this.$message({
            type: "success",
            message: "用户密码已重置!"
          });
        }
      });
    },
    // 启用账号弹框
    runUserAlert(user_id, index, name) {
      this.$confirm(
        `您确认要启用 <strong><i>${name}</i></strong>的账户吗?`,
        "提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.runUser(user_id, index);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 启用账号
    runUser(user_id, index) {
      stopUser({ user_id, status: 1 }).then(response => {
        if (response.code == 200) {
          this.list[index].status = 1;
          this.$message({
            type: "success",
            message: "账号已启用!"
          });
        }
      });
    },
    // 删除用户
    // deleteUser
    // 停用账户弹框
    stopAlert(user_id, index, name) {
      this.$confirm(
        `您确认要停用 <strong><i>${name}</i></strong> 的账户吗?`,
        "提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.stopUser(user_id, index);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 停用账号
    stopUser(user_id, index) {
      stopUser({ user_id, status: 0 }).then(response => {
        if (response.code == 200) {
          this.list[index].status = 0;
          this.$message({
            type: "success",
            message: "账号已停用!"
          });
        }
      });
    },
    // 获取员工账号
    getList(val) {
      this.listQuery.page_num = val || 1;
      this.listLoading = true;
      getUsers(this.listQuery).then(response => {
        this.list = response.result.userData;
        this.total = response.result.count;
        // Just to simulate the time of the request
        this.listLoading = false;
      });
    },
    // 分页获取
    changePage(val) {
      // console.log(val.page)
      this.getList(val.page);
    },
    // 新建或者编辑员工账号信息
    goNews(id) {
      // console.log(id)
      // router.push({ path: `/user/${userId}` })
      this.$router.push({ path: `news/${id}` });
    }
  }
};
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


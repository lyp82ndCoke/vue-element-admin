<template>
  <div class="app-container">
    <el-col
      :span="24"
      class="title-header"
    >
      <el-col
        :span="5"
        style="paddingRight:25px;"
      >
        <el-input
          size="small"
          v-model="listQuery.mobile"
          placeholder="用户手机号"
          @keyup.native.enter="search"
        ></el-input>
      </el-col>
      <el-col :span="8">
        入群状态：
        <el-select
          clearable
          size="small"
          v-model="listQuery.real_status"
          clearable
          @change="search"
          placeholder="入群状态"
        >
          <el-option
            v-for="item in payOptions"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
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
      <!-- <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>-->
      <el-table-column
        label="序列"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-col>{{ scope.$index+1 }}</el-col>
        </template>
      </el-table-column>
      <el-table-column
        label="群名称"
        align="center"
      >
        <template slot-scope="scope">{{ scope.row.chatroom_name }}</template>
      </el-table-column>

      <el-table-column
        label="用户昵称"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{scope.row.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="手机号"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{scope.row.real_status_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="created_at"
        width="100"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.real_status==3||scope.row.real_status==9"
            type="text"
            @click="delGroup(scope.row.tid)"
          >移除此群</el-button>
          <el-button
            size="mini"
            v-else-if="scope.row.real_status==1||scope.row.real_status==2"
            type="text"
            @click="addGroup(scope.row.tid)"
          >确认入群</el-button>
          <el-button
            size="mini"
            v-else-if="scope.row.real_status==8"
            type="text"
            disabled
          >已移除此群</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      class="pagination"
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page_no"
      :limit.sync="listQuery.page_size"
      v-on:pagination="getGroupUserList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getGroupUserList, changeUserGroupStatus } from "@/api/group";
import Request from "@/utils/request";
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
      // 时间段
      slotTime: "",
      alertShow: false,
      // 1已分群 2已获取入群二维码 3已入群 8已移出群 9已入小程序
      payOptions: [
        {
          label: '未入群',
          value: '2'
        },
        {
          label: '已入群',
          value: '3'
        },
        {
          label: '已移出群',
          value: '8'
        },
        {
          label: '已入小程序',
          value: '9'
        }
      ],
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        chatroom_code: "",
        page_no: 1,
        page_size: 15,
        item_name: "",
        real_status: "",
        mobile: ""
      }
    };
  },
  created() {
    // console.log(this.$route.params)
    if (this.$route.params.id) {
      this.listQuery.chatroom_code = this.$route.params.id;
      this.getGroupUserList();
    } else {
      this.$message({
        type: "error",
        message: "当前无数据！"
      });
    }
  },
  methods: {
    // 获取群人员list
    getGroupUserList() {
      this.listLoading = true;
      getGroupUserList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.list = res.result.rows;
          this.total = res.result.total;
          // console.log(res)
        }
      });
    },
    //  搜索
    search() {
      this.listQuery.page_no = 1;
      this.getGroupUserList();
    },

    // 移出此群
    delGroup(tid) {
      const data = {
        tid,
        real_status: 8
      };
      changeUserGroupStatus(data).then(res => {
        if (res.code == 200) {
          this.getGroupUserList();
          this.message({
            type: "success",
            message: "移除成功"
          });
        }
      });
    },
    addGroup(tid) {
      const data = {
        tid,
        real_status: 3
      };
      changeUserGroupStatus(data).then(res => {
        if (res.code == 200) {
          this.getGroupUserList();
          this.message({
            type: "success",
            message: "成功入群"
          });
        }
      });
    }

    /* 以下都没用 */
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  padding: 20px;
  .head-img {
    width: 50px;
    height: 50px;
  }
  .popularize-wrap {
    z-index: 20;
    position: absolute;
    top: 40%;
    left: 40%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 5px;
    background-color: #ededed;
  }
}
.title-header {
  padding: 10px 0;
}
.success-btn {
  text-align: right;
}
.alert {
  &-bg {
    z-index: 1002;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    .add-wrap {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 5px;
      height: auto;
      width: 50%;
      overflow: hidden;
      background-color: #fff;
      .add-title {
        font-size: 23px;
        font-weight: 500;
        border: 1px solid #ddd;
        padding: 10px;
      }
      .add-form-wrap {
        padding: 30px 20px;
        .close-icon {
          position: absolute;
          top: 6px;
          right: 10px;
        }
      }
      .form-item-wrap {
        margin: 10px 0;
        .btn-bottom {
          margin: 0 30px;
        }
      }
    }
  }
}
.add-com {
  font-size: 20px;
}
.title-header {
  padding: 10px 0;
}
.close-alert {
  text-align: right;
  font-size: 30px;
  color: #ccc;
}
.pagination {
  margin-top: 10px;
}
.search-btn {
  margin-left: 20px;
}
.upper {
  color: red;
}
.lower {
  color: #ccc;
}
</style>

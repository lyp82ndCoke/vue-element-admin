<template>
  <div class="app-container">
    <el-col
      :span="24"
      class="title-header"
    >
      <el-col :span="2">
        <el-button
          size="small"
          type="primary"
          @click="goNews(0)"
        >新建公众号</el-button>
      </el-col>
      <el-col :span="4">
      </el-col>
      <el-col :span="5">
        <el-input
          size="small"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="searchText"
        >
        </el-input>
      </el-col>
      <el-col
        :span="2"
        class="success-btn"
      >
        <el-button
          type="success"
          @click="getActivityList()"
          icon="el-icon-search"
          size="small"
        >搜索</el-button>
      </el-col>
    </el-col>

    <el-table
      :height="height"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      size='small'
      highlight-current-row
    >

      <el-table-column
        label="名称"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="关联活动"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.act_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="添加时间"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
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
            size="mini"
            v-if="scope.row.act_id == null"
            type="text"
            @click="relationPublic(scope.row.act_id, scope.row.id)"
          >
            关联活动
          </el-button>
          <el-button
            v-if="scope.row.act_id != null"
            size="mini"
            type="text"
            @click="removePublic(scope.row.act_id, scope.row.id)"
          >
            移除活动
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="goNews(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="text"
            :data-clipboard-text="scope.row.activityUrl"
            @click="copyActivity"
            class="activity-url"
          >复制活动地址</el-button>
          <el-button
            size="mini"
            type="text"
            :data-clipboard-text="scope.row.inviteUrl"
            @click="copyActivity"
            class="activity-url"
          >复制助力地址</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- @current-change="officialList" -->
    <pagination
      class="pagination"
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      v-on:pagination="changeAlertPublic"
    />

    <!-- 活动列表 alert -->
    <el-col
      :span="24"
      v-if='alertShow'
      class="alert-wrap"
    >
      <el-col
        :span="24"
        class="alert-content-wrap"
      >
        <!-- <el-col :span="24"><div class="add-com">添加商品</div></el-col> -->
        <el-col
          :span="24"
          class="title-header"
        >
          <el-col :span="5">
            <el-input
              size="small"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="searchTextgoods"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-button
              type="success"
              class="search-btn"
              size="small"
              @click="searchActivity"
            >搜索</el-button>
          </el-col>
          <el-col
            :span="16"
            align="right"
          >
            <el-button
              type="info"
              @click="hiddenAlert"
            >取消</el-button>
            <el-button
              type="primary"
              @click="sureRelation"
            >确认</el-button>
          </el-col>
        </el-col>
        <el-table
          ref="multipleTable"
          :height="height"
          v-loading="listLoading"
          :data="tableList"
          element-loading-text="Loading"
          tooltip-effect="dark"
          border
          fit
          size="mini"
          highlight-current-row
        >
          <!-- <el-table-column
            type="selection"
            width="60">
          </el-table-column> -->
          <el-table-column>
            <template slot-scope="scope">
              <el-radio
                :label="scope.row.id"
                v-model="templateRadio"
                @change.native="getTemplateRow(scope.$index,scope.row.id)"
              > &nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column label="序号">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span style="padding:0 5px;">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="上架时间"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.starttime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            class-name="status-col"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.status"
                style='color:red;'
              >已上架</span>
              <span
                v-else
                style="color:#ddd;"
              >已下架</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="操作"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="removeGoods(scope.row.id)">移除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <pagination
          class="pagination"
          v-show="alertTotal>0"
          :total="alertTotal"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          v-on:pagination="changeAlert"
        />
      </el-col>
    </el-col>

  </div>
</template>

<script>
import Clipboard from 'clipboard'
import { getNoPublic, removeNoPublic, getActList, activityPublic } from '@/api/table'
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
      height: null,
      list: null,
      tableList: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      searchText: '',
      options: [{ label: "已上架", value: "1" }, { label: "已下架", value: "0" }],
      alertShow: false,
      multipleSelection: [],
      activityId: null, //活动id
      pubid: null,//公众号id
      searchTextgoods: '',
      alertTotal: 0, //弹框分页
      templateRadio: null,
    }
  },
  created() {
    this.officialList()
  },
  methods: {
    copyActivity() {
      var clipboard = new Clipboard('.activity-url')
      clipboard.on('success', e => {
        this.$message({
          message: '复制成功',
          type: 'success'
        });
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制  
        console.log('该浏览器不支持自动复制')
        // 释放内存  
        clipboard.destroy()
      })
    },
    getTemplateRow(index, row) {
      this.templateRadio = row;
    },
    // 获取公众号列表
    officialList() {
      getNoPublic({page:1,limit: 10}).then(res => {
        this.listLoading = false;
        this.list = res.result.list;
        this.total = res.result.sign.count;
        const url = res.result.list;
        for (var i = 0; i < url.length; i++) {
          url[i].activityUrl = url[i].activityUrl + '?appid=' + url[i].appid;
          url[i].inviteUrl = url[i].inviteUrl + '?appid=' + url[i].appid;
        }
      })
    },
    goNews(id) {
      const activityId = id ? id : 0;
      this.$router.push({ path: `./news/${id}` })
    },
    // 移除公众号
    removePublic(actid, id) {
      this.$confirm('确定要移除该活动吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeNoPublic({pubid: id,actid}).then(res => {
          if(res.code == 200){
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.officialList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    // 搜索
    getActivityList() {
      var map = {
        name: this.searchText,
        page: 1
      }
      getNoPublic(map).then((res) => {
        this.listLoading = false;
        // console.log(res, '公众号列表')
        this.list = res.result.list;
        this.total = res.result.sign.count
      })
    },
    // 关联活动
    relationPublic(id, picid) {
      this.alertShow = true;
      this.activityId = id;
      this.pubid = picid;
      const map = {
        status: 1,
        page: 1,
        limit: 10
      }
      getActList(map).then((res) => {
        this.listLoading = false
        this.tableList = res.result.list
        this.alertTotal = res.result.sign.count
      })
    },
    hiddenAlert() {
      this.alertShow = false;
    },
    // 选择关联的商品
    // handleSelectionChange(val) {
    //   this.multipleSelection = val;
    //   console.log(val, '123123')
    // },
    // 确认关联活动
    sureRelation() {
      const map = {
        actid: this.templateRadio,
        pubid: this.pubid
      }
      if (!map.actid) {
        this.$message({
          message: '请选择活动',
          type: 'warning'
        });
        return false;
      }
      activityPublic(map).then((res) => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.alertShow = false;
        this.officialList()
      })
    },
    changeAlert(val) {
      const map = {
        page: val.page,
      }
      getActList(map).then(res => {
        this.listLoading = false
        this.tableList = res.result.list
        this.alertTotal = res.result.sign.count
      })
    },
    // 弹框搜索
    searchActivity() {

    },
    // 弹框分页
    changePaging(val) {
      const map = {
        page: val.page
      }
      getActList(map).then((res) => {
        this.listLoading = false
        this.tableList = res.result.list
        this.alertTotal = res.result.sign.count
      })
    },
    // 公众号分页
    changeAlertPublic(val) {
      const map = {
        page: val.page,
        name: this.searchText
      }
      getNoPublic(map).then((res) => {
        this.listLoading = false;
        this.list = res.result.list;
        this.total = res.result.sign.count;
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.app-container {
  padding: 20px;
}
.title-header {
  padding-bottom: 20px;
}
.pagination {
  margin-top: 10px;
}
.upper {
  color: red;
}
.lower {
  color: #ccc;
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


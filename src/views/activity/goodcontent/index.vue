<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">关联素材</el-col>
    </sticky>
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-col :span="4">
          <el-button size="small" type="primary" @click="relateMeta">关联素材</el-button>
        </el-col>
        <!-- <el-col :span="4">
           <el-select size="small" v-model="optionsValue" placeholder="全部">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col> -->
        <el-col :span="5">
          <el-input
            size="small"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="searchText"
          ></el-input>
        </el-col>
        <el-col :span="2" class="success-btn">
          <el-button type="success" @click="searchGoods" icon="el-icon-search" size="small">搜索</el-button>
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
        <el-table-column label="排序" align="center" width="250">
          <!-- <template slot-scope="scope">{{ scope.$index + 1 }}</template> -->
          <template slot-scope="{row, $index}">
            <el-input
              v-if="row.flag"
              v-model="row.orderline"
              autofocus="row.flag"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              @keyup.enter.native="onSubmit($index, row)"
              v-on:blur="changeFlag"
              v-on:change="inputblur(row.orderline,row.goods_audio_id, $index)"
            ></el-input>
            <el-button
              v-else
              size="small"
              type="text"
              @click="confirmEdit($index, row)"
            >{{row.orderline}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="音频名称" prop="name"></el-table-column>
        <el-table-column label="最后修改时间" prop="updatetime"></el-table-column>
        <!--  <el-table-column class-name="status-col" label="状态" align="center">
         <template slot-scope="scope">
          <span v-if="scope.row.status" style='color:red;'>已上架</span>
          <span v-else style="color:#ddd;">已下架</span>
          </template>
        </el-table-column>-->
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <!-- <el-button size="small" type="text" @click="showStatus(scope.row.id, scope.row.status)">显示</el-button> -->
            <!-- <el-button size="small" type="text" @click="showStatus(scope.row.id, scope.row.status)">隐藏</el-button> -->
            <el-button size="small" type="text" @click="removeCom(scope.row.id)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @current-change="goodsContent"
        v-on:pagination="changePaging"
      />
    </el-col>

    <!-- 关联课程 alert -->
    <el-col :span="24" v-if="alertShow" class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="24" class="title-header">
          <el-col :span="5">
            <el-input
              size="small"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="alertText"
            ></el-input>
          </el-col>
          <el-col :span="2" class="success-btn">
            <el-button type="success" class="search-btn" size="small" @click="alertSearch">搜索</el-button>
          </el-col>
          <el-col :span="16" align="right">
            <el-button type="info" @click="hiddenAlert">取消</el-button>
            <el-button type="primary" @click="sureMeta">确认</el-button>
          </el-col>
        </el-col>
        <el-table
          ref="multipleTable"
          :data="tableList"
          v-loading="listLoading"
          element-loading-text="Loading"
          tooltip-effect="dark"
          border
          fit
          size="mini"
          highlight-current-row
          align="middle"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="60"></el-table-column>
          <!-- <el-table-column label="序号">
            <template slot-scope="scope">{{scope.$index + 1}}</template>
          </el-table-column>-->
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="上架时间" prop="addtime" align="center"></el-table-column>
          <!-- <el-table-column
            label="操作"
            align="center"
            width="230"
            class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="delAlert(scope.row.id)">移除</el-button>
            </template>
          </el-table-column>-->
        </el-table>
        <pagination
          class="pagination"
          v-show="alertTotal>0"
          :total="alertTotal"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @current-change="relateMeta"
          v-on:pagination="changeAlert"
        />
      </el-col>
    </el-col>
  </div>
</template>

<script>
import { getSortSourceList, getGoodSource, delSource, delAdv, advStatus, updateGoodsAudio, goodsSource } from '@/api/table'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      // optionsValue: null,
      searchText: '',
      alertText: '',
      options: [{ label: "已上架", value: "1" }, { label: "已下架", value: "0" }],
      list: null, // 此活动关联的商品数据
      tableList: null, // 所有的商品列表数据
      listLoading: true,
      total: 0,
      alertTotal: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      alertShow: false,
      goodsListId: null,
      multipleSelection: []
    }
  },
  created() {
    this.goodsId = this.$route.params.id
    this.goodsContent()
  },
  methods: {
    // 素材 排序 可 修改
    changeFlag() {
      this.list.forEach(item => {
        item.flag = false;
      });
    },
    onSubmit(index, row) {
      this.list.forEach(item => {
        item.flag = false;
      });
    },
    inputblur(order, goods_audio_id, index) {
      this.list.forEach(item => {
        item.flag = false;
      });
      const map = {
        order,
        goods_audio_id
      }
      if (map.order == '') {
        this.$message({
          message: '排序不能为空哦',
          type: 'warning'
        });
        this.goodsContent()
        this.list[index].flag = true;
        return false;
      }
      //排序修改接口
      updateGoodsAudio(map).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
        }
      })
    },
    confirmEdit(index, row) {
      this.list.forEach(item => {
        item.flag = false;
      });
      this.list[index].flag = true
    },
    changeAlert(val) {
      goodsSource({page: val.page}).then((res) => {
        if (res.code == 200) {
          this.tableList = res.result.list;
          this.alertTotal = res.result.sign.count;
        }
      })
    },
    changePaging(val) {
      const map = {
        goodsid: this.goodsId,
        page: val.page
      }
      this.goodsContent()
    },
    alertSearch() {
      const map = {
        name: this.alertText ? this.alertText : '',
        goodsid: this.goodsId,
        is_frame: 1
      }
      goodsSource(map).then(res => {
        this.tableList = res.result.list;
        this.alertTotal = res.result.sign.count;
      })
    },
    // 关联素材弹框 素材列表
    relateMeta() {
      this.alertShow = true
      var map = {
        goodsid: this.goodsId,
        is_frame: 1
      }
      goodsSource(map).then(res => {
        this.tableList = res.result.list;
        this.alertTotal = res.result.sign.count;
      })
    },
    // delAlert(id){
    //   const map = {
    //     id: id
    //   }
    //   delSource(map).then((res) => {
    //     this.$message({
    //       message: res.msg,
    //       type: 'success'
    //     });
    //     this.relateMeta();
    //   })
    // },
    // 确认关联素材
    sureMeta() {
      var seleted = this.multipleSelection;
      var goodsid = [];
      for (var i = 0; i < seleted.length; i++) {
        goodsid[i] = parseInt(seleted[i].id)
      }
      if (goodsid.length == 0) {
        this.$message({
          message: '请选择要关联的素材哦',
          type: 'warning'
        });
        return false;
      }
      getGoodSource({id: this.goodsId,audioids: goodsid}).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.goodsContent();
        this.alertShow = false
      })
    },
    hiddenAlert() {
      this.alertShow = false;
    },
    searchGoods() {
      const map = {
        name: this.searchText ? this.searchText : '',
        goodsid: this.goodsId
      }
      getSortSourceList(map).then(res => {
        if (res.code == 200) {
          this.list = res.result.list
          this.total = res.result.sign.count
        }
      })
    },
    // 选择关联的商品
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 商品内容管理列表
    goodsContent() {
      this.listLoading = true;
      getSortSourceList({goodsid: this.goodsId}).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          const flagList = res.result.list;
          for (let i = 0; i < flagList.length; i++) {
            flagList[i].flag = false;
          }
          this.list = flagList;
          this.total = res.result.sign.count;
        }
      })
    },
    // 素材列表 移除关联关系
    removeCom(id) {
      this.$confirm('确认要移除该素材吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const map = {
          id: id,
          goodsid: this.goodsId
        }
        delSource(map).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.goodsContent();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消移除'
        });
      });

    },
    // 素材列表 上下架
    // showStatus(id, status){
    //   const map = {
    //     id: id,
    //     status: status
    //   }
    //   advStatus(map).then((res) => {
    //    this.$message({
    //       message: res.msg,
    //       type: 'success'
    //     });
    //   })
    // }
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
.title-header {
  margin-bottom: 20px;
}
.success-btn {
  text-align: right;
}
</style>
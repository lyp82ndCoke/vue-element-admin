<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">关联商品</el-col>
    </sticky>
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-col :span="4">
          <el-button size="small" type="primary" @click="showAlert">关联商品</el-button>
        </el-col>
        <el-col :span="4">
          <el-select size="small" v-model="optionsValue" placeholder="全部">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
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
        :height="tabHeight"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size="mini"
        highlight-current-row
        align='middle'
      >
        <el-table-column label="序号">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
              <img align='center' class="coverimg" :src="scope.row.coverimg" alt="">
            <span style="padding:0 5px;">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后修改时间">
          <template slot-scope="scope">{{ scope.row.updatetime }}</template>
        </el-table-column>
        <el-table-column label="兑换价（个）" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="章节" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.audio_num }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" align="center">
         <template slot-scope="scope">
          <span v-if="scope.row.status" style='color:red;'>已上架</span>
          <span v-else style="color:#ddd;">已下架</span>
          </template>
        </el-table-column>
        
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="showHidden(scope.row.status)">显示</el-button>
            <el-button size="small" type="text" @click="showHidden(scope.row.status)">隐藏</el-button>
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
        @current-change="goodsList"
        v-on:pagination="changePaging" 
      />
    </el-col>

    <!-- 商品列表 alert -->
    <el-col :span="24" v-if='alertShow' class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <!-- <el-col :span="24"><div class="add-com">添加商品</div></el-col> -->
        <el-col :span="24" class="title-header">
        <el-col :span="5">
          <el-input
            size="small"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="searchTextgoods"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="success" class="search-btn" size="small" @click="searchActivity">搜索</el-button>
        </el-col>
        <el-col :span="16" align="right">
          <el-button type="info" @click="hiddenAlert">取消</el-button>
          <el-button type="primary" @click="sureRelation">确认</el-button>
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
        align='middle'
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="60">
        </el-table-column>
        <el-table-column label="序号">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span style="padding:0 5px;">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上架时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.addtime }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" align="center">
         <template slot-scope="scope">
          <span v-if="scope.row.status" style='color:red;'>已上架</span>
          <span v-else style="color:#ddd;">已下架</span>
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
        v-show="alertTotal>0" :total="alertTotal"  
        :page.sync="listQuery.page"  
        :limit.sync="listQuery.limit"  
        @current-change="goodsList"
        v-on:pagination="changeAlert"/>
      </el-col>
    </el-col>
  </div>
</template>

<script>
// import { getConnect, getGoodStatus, getGoodsDel, getSure } from '@/api/table'
import { getIsOtherScheduling, getGoodStatus, getGoodsDel, getSure } from '@/api/counselor'
getIsOtherScheduling
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Pagination, Sticky },
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
      tabHeight: null,
      optionsValue: null,
      searchText: '', 
      searchTextgoods: '', //弹框搜索
      options: [{ label: "已上架", value: "1" }, { label: "已下架", value: "0" }],
      list: null, // 此活动关联的商品数据
      tableList: null, // 所有的商品列表数据
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      alertShow:false,
      goodsListId:null,
      form: {
        type:[] //关联商品弹框选中的数据
      },
      alertTotal: 0,
      seleteVal: [],
      multipleSelection: []
    }
  },
  created() {
    // console.log(this.$route.params, '此活动的id')
    this.goodsListId = this.$route.params.id;
    // this.getList();
    // this.goodsList();
  },
  methods: {
    changePaging(val){
      const map = {
        actid: this.goodsListId,
        page: val.page,
        limit: val.limit
      }
      this.goodsList()
    },
    changeAlert(val){
      const map = {
        page: val.page,
        limit: val.limit
      }
      this.showAlert();
    },
    // 商品列表
    goodsList(){
      this.listLoading = true;
      const map = {
        actid: this.goodsListId
      }
      getIsOtherScheduling(map).then((res) => {
        this.listLoading = false;
        this.list = res.result.list;
        this.total = res.result.sign.count;
        this.seleteVal = res.result.list
      })
    },
    // 商品列表的显示隐藏
    showHidden(status){
      const map = {
        id: this.goodsListId, //活动的id
        status: status
      }
      getGoodStatus(map).then((res) => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        
      })
    },
    // 搜索商品
    searchGoods(){
      const map = {
        status: this.optionsValue,
        name: this.searchText
      }
      getConnect(map).then((res) => {
        this.list = res.result.list;
        this.total = res.result.list.length;
      })
    },
    // 移除该活动关联的该商品
    removeCom(id){
      this.$confirm('确认要移除该活动关联的商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const map = {
          id: id
        }
        getGoodsDel(map).then((res) => {
          if(res.code == 200){
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.goodsList();
          }        
        })
        this.$message({
          type: 'success',
          message: '移除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消移除'
        });          
      });
    },
    // 关联商品弹框移除商品
    removeGoods(id){
      const map = {
        id: id
      }
      getGoodsDel(map).then((res) => {
        this.$message({
          message: '移除成功',
          type: 'success'
        });
        this.showAlert()
      })
    },
    // 选择关联的商品
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    hiddenAlert(){
      this.alertShow = false;
    },
    showAlert(){
      this.alertShow = true;
      // 弹框的商品列表 只显示已上架 && 已经关联商品不显示
      this.listLoading = false;
      this.multipleTable = this.seleteVal;
      var map = {
        status: 1,
        actid: this.goodsListId,
        is_frame: 1
      }
      getConnect(map).then((res) => {
        this.tableList = res.result.list
        this.alertTotal = res.result.sign.count
      })
    },
    // 关联商品
    sureRelation(){
      var seleted = this.multipleSelection;
      var goodsid = [];
      for(var i = 0;i < seleted.length; i++){
        goodsid[i]  = parseInt(seleted[i].id)
      }
      const map = {
        id: this.goodsListId, //活动id
        goodsid: goodsid
      }
      if(goodsid.length == 0){
        this.$message({
          message: '请选择商品',
          type: 'warning'
        });
        return false;
      }
      getSure(map).then((res) => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.goodsList()
        this.alertShow = false;
      })
    },
    // 弹框搜索商品
    searchActivity(){
      const map = {
        name: this.searchTextgoods
      }
      getConnect(map).then((res) => {
        this.tableList = res.result.list
        this.alertTotal = res.result.sign.count
      })
    },
    goNews() {
      this.$router.push({ path: './news' })
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
    .coverimg{
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
.alert{
  &-wrap{
    z-index: 1002;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.7);
    padding: 50px 150px 50px 200px;
  }
  &-content-wrap{
    border-radius: 5px;
    height: 100%;
    width: 100%;
    padding: 20px;
    background-color: #fff;
  }
}
.close-alert{
  text-align: right;
  font-size: 30px;
  color: #ccc;
}
.search-btn{
  margin-left: 20px;
}
.add-com{
  font-size: 20px;
}
.success-btn{
  text-align: right;
}
</style>


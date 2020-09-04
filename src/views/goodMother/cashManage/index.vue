<template>
  <div class="app_container">
    <el-col :span="24" class="title-header">
      <el-col :span="3">
        <el-select v-model="value" placeholder="请选择状态" size="small">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-date-picker
          v-model="value2"
          size="small"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="5" :offset="4">
        <el-input size="small" placeholder="请输入提现昵称/手机号/订单号" prefix-icon="el-icon-search" v-model="listQuery.search_name">
        </el-input>
      </el-col>
      <el-col :span="2" class="success-btn">
        <el-button type="success" @click="getSearch()" icon="el-icon-search" size="small">搜索</el-button>
      </el-col>
    </el-col>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
        <el-table-column label="头像/昵称" prop="name" align="center" width='200'>
        </el-table-column>
        <el-table-column label="提现金额" prop="area" align="center" width='110'>
        </el-table-column>
        <el-table-column label="提现后剩余金额" prop="phone" align="center" width='160'>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" width='200'>
        </el-table-column>
        <el-table-column label="提交时间" prop="time" align="center" width='220'>
        </el-table-column>
        <el-table-column label="提现单号" prop="code" align="center" width='280'>
        </el-table-column>
        <el-table-column label="备注" prop="mark" align="center">
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
import { getSpokesManList } from "@/api/spokesperson";
import Pagination from "@/components/Pagination";

export default {
  name:'',
  components: { Pagination },

  data(){
    return{
      listLoading: false,
      listQuery: {
        page_num: 1,
        page_size: 12,
        times_name:'',
        search_name:'',
      },
      total: 0,
      value:'',
      value1:'',
      value2:'',
      options:[
        {
          label:'全部状态',
          value:'0',
        },
        {
          label:'提现成功',
          value:'1',
        },
        {
          label:'提现失败',
          value:'2',
        },
      ],
      lists:[
        {
          name: '昵称122424',
          area: '￥200',
          phone: '2000',
          status: '待结算',
          time: '2018-12-12 12:00:00',
          code: '微信支付，15087511815087875126118',
          mark: '无',
        },
        {
          name: '用户122424',
          area: '￥20',
          phone: '12000',
          status: '待结算',
          time: '2018-12-12 12:00:00',
          code: '微信支付，15087511815087875126118',
          mark: '我是备注',
        }
      ],
    }
  },
  created(){
    // this.getlist();
  },
  methods:{
    getSearch(){

    },
    getlist(){
      // this.listLoading = true;
      // usehelpList(this.listQuery).then((res) => {
      //   if (res.code == 200) {
      //     this.listLoading = false;
      //     this.lists = res.result.list.reverse();
      //     this.total = res.result.count;
      //   }
      // })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    changePaging(){
      // this.usehelpList();
    }
  }
}
</script>

<style lang="scss" scoped>
.app_container{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
  }
}
</style>
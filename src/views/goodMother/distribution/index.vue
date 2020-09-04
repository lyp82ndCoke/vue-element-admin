<template>
  <div class="app_container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="商品列表" name="first">
        <h3>我是商品列表</h3>
      </el-tab-pane>
      <el-tab-pane label="分享记录" name="second">
        <el-col :span="24" class="title-header">
          <el-col :span="3">
            <el-date-picker
              v-model="value1"
              size="small"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-col>
          <el-col :span="5" :offset='3'>
            <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchText">
            </el-input>
          </el-col>
          <el-col :span="2" class="success-btn">
            <el-button type="success" @click="getActivityList(0)" icon="el-icon-search" size="small">搜索</el-button>
          </el-col>
        </el-col>
        <el-col :span="20" class="title-content">
          <el-table
            v-loading="listLoading"
            :data="lists"
            element-loading-text="Loading"
            border
            fit
            size='mini'
            highlight-current-row>
            <el-table-column label="交易时间" prop="time" align="center" width='110'>
            </el-table-column>
            <el-table-column label="订单号" prop="order" align="center" width='210'>
            </el-table-column>
            <el-table-column label="代言人" prop="people" align="center" width='130'>
            </el-table-column>
            <el-table-column label="购买人" prop="buyer" align="center" width='130'>
            </el-table-column>
            <el-table-column label="商品名称" prop="goods" align="center" width='270'>
            </el-table-column>
            <el-table-column label="交易金额" prop="trade" align="center" width='80'>
            </el-table-column>
            <el-table-column label="佣金比例" prop="Commission" align="center" width='80'>
            </el-table-column>
            <el-table-column label="佣金" prop="money" align="center" width='80'>
            </el-table-column>
          </el-table>
        </el-col>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name:'',
  data(){
    return{
      listLoading: true,
      activeName: 'second',
      value1:'',
      searchText:'',
      lists:[
        {
          time:'2017-05-09 10:54:58',
          order:'o_1494298492_59112f7c476a5_64038284',
          people:'zsk998131234589',
          buyer:'曲无忆13123456789',
          goods:'我是商品标题',
          trade:'￥99',
          Commission:'55%',
          money:'￥55',
        },
        {
          time:'2017-05-09 10:54:58',
          order:'o_1494298492_59112f7c476a5_64038284',
          people:'zsk998131234589',
          buyer:'祝无双13123456789',
          goods:'我是商品标题',
          trade:'￥199',
          Commission:'55%',
          money:'￥155',
        }
      ]
    }
  },
  mounted(){
    this.listLoading = false;
  },
  methods:{
    add(){
      if(res.hasOwnProperty("code") && res.code === 0){
          
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
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
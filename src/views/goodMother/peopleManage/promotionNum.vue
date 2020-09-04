<template>
  <div class="app-container">
    <el-col :span="24" class="table-title">
      <el-col :span="24" class="title">造福人数</el-col>
      <el-col :span="5">
        <el-input size="small" placeholder="请输入手机号/微信昵称" clearable prefix-icon="el-icon-search" v-model="listQuery.search_key">
        </el-input>
      </el-col>
      <el-col :span="1" class="success-btn">
        <el-button type="success" @click="getUserRelationList()" icon="el-icon-search" size="small">搜索</el-button>
      </el-col>
    </el-col>
      
    <el-col :span="24" class="table-content">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size='small'
        highlight-current-row>
        <el-table-column label="名称" prop="nickname" align="center" width="180">
          <template slot-scope="scope">
            <div class="lists">
              <img :src="scope.row.headimgurl" alt="">
              <div class="user">
                <p>{{scope.row.nickname}}</p>
                <p>{{scope.row.mobile}}</p>
              </div>
            </div>

            <!-- <div class="lists">
              <img src="https://poster-share.oss-cn-beijing.aliyuncs.com/poster/ZMWH5FD3A8CFFCA064E71522B677CC5CAB3B.jpg" alt="">
              <div class="user">
                <p>Andy12345678</p>
                <p>18800000000</p>
              </div>
            </div> -->
          </template>
        </el-table-column>
        <el-table-column label="购买次数" prop="count_order_num" align="center" width="150">
        </el-table-column>
        <el-table-column label="客单价" prop="per_amount" align="center">
        </el-table-column>
        <el-table-column label="累计消费金额" prop="sum_amount_num" align="center" width="190">
        </el-table-column>
        <el-table-column label="上次消费时间" prop="last_consume_time" align="center" width="190">
          <template slot-scope="scope">
            <span>{{scope.row.last_consume_time === null ? '--' : scope.row.last_consume_time}}</span>
          </template>
        </el-table-column>
        <el-table-column label="代言人等级" prop="level_name" align="center" width="190">
        </el-table-column>
        <el-table-column label="贡献" prop="score" align="center" width="190">
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
import { getUserRelationList } from "@/api/spokesperson";
import Pagination from "@/components/Pagination";

export default {
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      listQuery: {
        page_num: 1,
        page_size: 10,
        search_key:'',
        unionid: this.$route.params.id
      },
      total: 0,
      list:[]
    };
  },
  created() {
    this.getUserRelationList();
  },
  methods: {
    getUserRelationList(){
      this.listLoading = true;
      getUserRelationList(this.listQuery).then((res) => {
        if (res.code == 200) {
          this.listLoading = false;
          this.list = res.result.userList;
          this.total = Number(res.result.count);
        }
      })
    },
    changePaging(){
      this.getUserRelationList();
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container{
  padding: 20px;
  .title{
    height: 30px;
    line-height: 30px;
    margin-bottom: 20px;
    border-bottom: 1.5px solid #eee;
  }
  .table-title{
    margin-bottom: 20px;
  }
  .lists{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    img{
      width: auto;
      max-width: 60px;
      float: left;
    }
    .user{
      float: left;
      width: 60%;
      height: 100%;
      p{
        margin-top: -2px;
        text-align: left;
        text-indent: 3px;
      }
    }
  }
}
</style>
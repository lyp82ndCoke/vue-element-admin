<template>
  <div class="app_container-wechat">
    <el-col :span="24" class="title-header">
      <el-col :span="24">
        <el-col :span="5" align="center">
          <el-input size="small" clearable placeholder="请输入商品名称" prefix-icon="el-icon-search" v-model="listQuery.item_name" @clear="clearTitle">
          </el-input>
        </el-col>

        <el-col :span="4" align="center">
          <el-select v-model="listQuery.relation_flag" clearable placeholder="请选择文章类型" size="small" @change="clearTitle">
            <el-option
              v-for="item in [{label:'全部',value: ''},{label:'已关联',value: '1'},{label:'未关联',value: '0'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="5" align="center">
          <el-input size="small" clearable placeholder="请输入群名称" prefix-icon="el-icon-search" v-model="listQuery.chatroom_name" @clear="clearTitle">
          </el-input>
        </el-col>

        <el-col :span="2" class="success-btn" align="right">
          <el-button type="success" @click="clearTitle()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
    </el-col>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        highlight-current-row>
         <el-table-column label="群ID" prop="create_time" align="center" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.chatroom_id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="微信群名称" prop="title" align="center" width="300">
          <template slot-scope="scope">
            <span>{{scope.row.chatroom_name}}</span>
          </template>
        </el-table-column>
       
        <el-table-column label="群人数" prop="is_show" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.count_member}}</span>
          </template>
        </el-table-column>

        <el-table-column label="关联商品" prop="title" align="center" width="300">
          <template slot-scope="scope">
            <span>{{scope.row.praise_name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格明细" prop="title" align="center">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column label="H5群名称" prop="title" align="center">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='200'>
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.praise_id" @click="changeStatus(scope.row.chatroom_id)" type="text">修改关联</el-button>
            <el-button size="mini" v-else @click="changeStatus(scope.row.chatroom_id)" type="text">关联商品</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page_no"
        :limit.sync="listQuery.page_size"
        v-on:pagination="getChatroomRelation"/>
    </el-col>

    <!-- 关联商品 -->
    <el-col
      :span="24"
      v-if='alertShow'
      class="alert-wrap">
      <el-col
        :span="24"
        class="alert-content-wrap">
        <el-col
          :span="24"
          class="title-header">
          <el-col :span="12">
            <el-input
              size="small"
              clearable
              placeholder="请输入商品名称"
              prefix-icon="el-icon-search"
              v-model="goods.item_name"
              @clear="searchActivity"
            ></el-input>
          </el-col>
          <el-col :span="2" align="right">
            <el-button
              type="success"
              class="search-btn"
              size="small"
              @click="searchActivity"
            >搜索</el-button>
          </el-col>
        </el-col>
        <el-table
          size="small"
          border
          :data="goodsData">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column width="80">
            <template slot-scope="scope">
              <el-radio
                :label="scope.row.item_id"
                v-model="templateRadio"
                @change.native="getTemplateRow(scope.$index,scope.row.item_id,scope.row)"
              > &nbsp;</el-radio>
            </template>
          </el-table-column>

          <el-table-column label="商品名称">
            <template slot-scope="scope">
              <!-- <el-col :span="2">
                <img align='center' style="width:100%;" :src="scope.row.pic_url" alt="">
              </el-col> -->
              <el-col :span="15" style="margin-left: 20px;">{{scope.row.item_name}}</el-col>
            </template>
          </el-table-column>
          <el-table-column label="库存">
            <template slot-scope="scope">
              <el-col :span="15" style="margin-left: 20px;"></el-col>
            </template>
          </el-table-column>
          
        </el-table>
        <pagination
          class="pagination"
          v-show="goodsTotal>0"
          :total="goodsTotal"
          :page.sync="goods.page_no"
          :limit.sync="goods.page_size"
          v-on:pagination="getItemRelationList"
        />
        <el-col :span="16" align="left" class="sure-margin">
          <el-button type="primary" @click="handleRelationMore" size="small">确定</el-button>
          <el-button type="info" @click="hiddenAlert" size="small">取消</el-button>
        </el-col>
      </el-col>
    </el-col>


  </div>
</template>

<script>
import { getChatroomRelation, getItemRelationList, updateChatroomRelation } from "@/api/wechat";
import Pagination from '@/components/Pagination';

export default {
  name:'',
  components: { Pagination },

  data(){
    return{
      alertShow: false,
      goods: {
        page_no: 1,
        page_size: 10,
        item_name: ""
      },
      goodsData: [],
      listQuery: {
        page_no: 1,
        page_size: 13,
        chatroom_name: "",
        item_id: "",
        item_name: "",
        relation_flag: ''
      },
      listLoading: true,
      total: 0,
      goodsTotal: 0,
      list:[],
      templateRadio: null,
      chatroom_id: null,
    }
  },
  created(){
    this.getChatroomRelation();
  },
  methods:{
    // 查询群关系列表
    getChatroomRelation(){
      this.listLoading = true;
      getChatroomRelation(this.listQuery).then(res => {
        if(res.code == 200){
          this.listLoading = false;
          this.list = res.result.rows;
          this.total = res.result.total;
        }
      })
    },
    // 查询商品列表
    getItemRelationList(){
      getItemRelationList(this.goods).then(res => {
        if(res.code == 200){
          this.goodsData = res.result.rows;
          this.goodsTotal = res.result.total;
        }
      })
    },
    searchActivity(){
      this.goods.page_no = 1;
      this.getItemRelationList();
    },
    changeStatus(chatroom_id){
      this.alertShow = true;
      this.chatroom_id = chatroom_id;
      this.getItemRelationList();
    },
    hiddenAlert(){
      this.alertShow = false;
    },
    handleRelationMore(){
      const data = {
        chatroom_id: this.chatroom_id,
        praise_id: this.templateRadio
      }
      updateChatroomRelation(data).then(res => {
        if(res.code == 200){
          this.$message.success('创建成功');
          this.alertShow = false;
          this.getChatroomRelation();
          this.templateRadio = null;
        }
      })

    },
    getTemplateRow(index, row, list) {
      console.log(row, list)
      this.templateRadio = row;
      // this.currentGoods = list;
      // this.sureData.push(list);
      // this.form.item_name = list.item_name;
    },



    changeTime(val){
      if(val){
        this.listQuery.start_time = val[0];
        this.listQuery.end_time = val[1];
      }else{
        this.listQuery.start_time = '';
        this.listQuery.end_time = '';
      }
      this.listQuery.page_num = 1;
      this.getChatroomRelation();
    },
    // goArticle(article_id,target_type){
    //   let id = article_id ? article_id : 0;
    //   this.$router.push({ path:`./news/${id}`, query: { target_type } })
    // },
    clearTitle(){
      this.listQuery.page_num = 1;
      this.getChatroomRelation();
    }
  }
}
</script>

<style lang="scss">
.app_container-wechat{
  padding: 20px;
  .title-header{
    margin-bottom: 20px;
    .select-title{
      width: 70px;
      text-align: right;
      font-size: 14px;
      color: #606266;
      font-weight: 700;
    }
  }
  .el-checkbox-group{
    .el-checkbox{
      margin-left: 15px;
      margin-bottom: 10px;
    }
  }
  img{
    max-width: 100px;
    height: 100px;
    text-align: center;
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
    .title-header{
      margin-bottom: 20px;
    }
    .sure-margin{
      margin-top: 20px;
    }
  }
  &-content-wrap {
    border-radius: 5px;
    height: 100%;
    width: 100%;
    padding: 20px;
    background-color: #fff;
    overflow: auto;
  }
}

}
</style>
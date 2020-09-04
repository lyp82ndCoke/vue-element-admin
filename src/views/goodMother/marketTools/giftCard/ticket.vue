<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">领卡记录</el-col>
    </sticky>
    <el-col :span="24" class="table-wrap"> 
      <el-col :span="24" class="title-header">
        <el-col :span="4">
          <el-select v-model="form.is_take" clearable placeholder="请选择是否领取" size="small" @change="getReceiveList">
            <el-option
              v-for="item in [{label:'全部',value: ''},{label:'已领取',value: 1},{label:'未领取',value: 0}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-select v-model="form.is_used" clearable placeholder="请选择是否使用" size="small" @change="getReceiveList">
            <el-option
              v-for="item in [{label:'全部',value: ''},{label:'已使用',value: 1},{label:'未使用',value: 0}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="6">
          <el-date-picker
            v-model="contract_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            value-format="yyyy-MM-dd"
            @change="handleContract"
          ></el-date-picker>
        </el-col>

        <el-col :span="4" style="margin-right: 20px;margin-left: 40px;">
          <el-input
            size="small"
            clearable
            placeholder="请输入领卡人"
            prefix-icon="el-icon-search"
            v-model="form.receive_nickname"
          ></el-input>
        </el-col>


        <el-col :span="4" style="margin-right: 20px;">
          <el-input
            size="small"
            placeholder="请输入赠卡人"
            clearable
            prefix-icon="el-icon-search"
            v-model="form.purchase_nickname"
          ></el-input>
        </el-col>

        <el-col :span="4" style="margin-top: 20px;">
          <el-input
            size="small"
            placeholder="请输入卡号"
            clearable
            prefix-icon="el-icon-search"
            v-model="form.card_no"
          ></el-input>
        </el-col>

        <el-col :span="2" class="success-btn" style="margin-top: 20px;">
          <el-button
            type="success"
            @click="searchGoods"
            icon="el-icon-search"
            size="small"
          >搜索</el-button>
        </el-col>
      </el-col>
      <el-table
        :height="caseHeight"
        v-loading="caseLoading"
        :data="caseList"
        element-loading-text="Loading"
        border
        fit
        size="mini"
        highlight-current-row
        align="middle">
        <el-table-column label="领取时间" prop="take_time" align="center"></el-table-column>
        <el-table-column label="卡号" prop="card_no" align="center"></el-table-column>
        <el-table-column label="领卡人" align="center" width="300">
          <template slot-scope="scope">
            <el-col :span="6">
              <img width="50" style="border-radius: 50%;" :src="scope.row.receive_headimgurl"/>
            </el-col>
            <el-col :span="18" align="left">{{ scope.row.receive_nickname }}</el-col>
            <el-col :span="18" align="left">{{ scope.row.receive_unionid }}</el-col>
          </template>
        </el-table-column>
        <el-table-column label="赠卡人" align="center" width="300">
          <template slot-scope="scope">
            <el-col :span="6">
              <img width="50" style="border-radius: 50%;" :src="scope.row.purchase_headimgurl"/>
            </el-col>
            <el-col :span="18" align="left">{{ scope.row.purchase_nickname }}</el-col>
            <el-col :span="18" align="left">{{ scope.row.purchase_unionid }}</el-col>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-col :span="24" v-if="scope.row.is_used==1">
              <el-col :span="24">已使用</el-col>
              <el-col :span="24">{{scope.row.user_time}}</el-col>
            </el-col>
            <el-col :span="24" v-else-if="scope.row.is_take==1">
              <el-col :span="24">已领取</el-col>
              <el-col :span="24">{{scope.row.invalid_date2}}</el-col>
            </el-col>

            <el-col :span="24" v-else-if="scope.row.is_take==0">
              <el-col :span="24">待领取</el-col>
            </el-col>
            <!-- <el-col :span="24" v-else-if="scope.row.is_used==1">
              <el-col :span="24">已使用</el-col>
              <el-col :span="24">{{scope.row.user_time}}</el-col>
            </el-col> -->
            <el-col :span="24" v-else-if="scope.row.is_used==0">
              <el-col :span="24">待使用</el-col>
            </el-col>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        class="pagination"
        v-show="caseTotal>0"
        :total="caseTotal"
        :page.sync="form.page_no"
        :limit.sync="form.page_size"
        v-on:pagination="getReceiveList"
      />
    </el-col>
  </div>
</template>

<script>
import { getCaseList } from '@/api/project'
import { getReceiveList } from "@/api/giftCard"
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      type: 3,
      activeName: 'first',
      caseHeight: null,
      caseLoading: false,
      caseList: [],
      caseTotal: 0,
      list: [],
      listLoading: false,
      contract_time: [],
      form: {
        page_no: 1,
        page_size: 10,
        begin_date: "",
        end_date: "",
        is_used: null,
        is_take: null,
        purchase_nickname: "",
        receive_nickname: "",
        case_title: "",
        type: 1,
        card_no: "",
        item_id: "",
        item_name: ""
      },
    }
  },
  created() {
    this.getReceiveList();
    this.form.item_id = this.$route.query.item_id;
  },
  methods: {
    // 领卡记录
    getReceiveList(){ 
      getReceiveList(this.form).then(res => {
        if(res.code == 200){
          this.caseList = res.result.rows;
          this.caseTotal = res.result.total;
        }
      })
    },
    handleContract(val){
      console.log(val, 'val')
      this.form.begin_date = val[0];
      this.form.end_date = val[1];
    },
    searchGoods() {
      this.form.page_no = 1;
      this.getReceiveList();
    }
  }
}
</script>
<style lang="scss">
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
    overflow-y: auto;
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
  margin-bottom: 20px;
  text-align: center;
}
.success-btn {
  text-align: right;
}
.single.el-radio.is-bordered {
  width: 212px;
  height: 34px;
  line-height: 34px;
  padding: 0 0 0 10px;
  background-color: #fff;
  margin-left: 0;
  margin-bottom: 10px;
}
#checkbox {
  background-color: #eee;
}
#checkbox .el-checkbox.single {
  width: 212px;
  height: 34px;
  line-height: 34px;
  padding: 0 0 0 10px;
  margin-left: 0;
  margin-bottom: 10px;
}
.form_name .textarea {
  width: 460px;
}
.form_name .textarea .el-textarea__inner {
  min-height: 110px;
}
.input_element {
  margin-bottom: 32px;
}
.text_overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}
.overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.btn-bottom {
  position: fixed;
  bottom: 70px;
  left: 280px;
}
.input-prompt {
  font-size: 12px;
  color: red;
}
.question {
  padding-left: 140px;
  margin-bottom: 10px;
}
.icon_add {
  font-size: 24px;
  padding-left: 15px;
  padding-top: 3px;
}
.case-table .el-form-item__content {
  width: 85%;
}
.theme-margin .el-form-item__content {
  width: 85%;
  padding-left: 140px;
}
.left-title {
  color: #606266;
  font-size: 14px;
  font-weight: 700;
}
.comment-padding {
  padding: 25px 0;
}
.comment-padding p {
  margin: 0;
}
.icon_add {
  font-size: 24px;
  padding-left: 20px;
  padding-top: 7px;
}
.disable-p {
  background-color: #eee;
  border-radius: 5px;
  padding: 10px;
  line-height: 16px;
  word-wrap: break-word;
}
</style>


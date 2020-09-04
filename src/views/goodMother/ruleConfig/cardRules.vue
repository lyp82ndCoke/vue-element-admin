<template>
  <div class="app_container">
    <el-col :span="24" class="title-header">
      <el-col :span="24" class="title">任务规则 - 礼品卡任务</el-col>
    </el-col>
    <el-col :span="6" class="title-content">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="关联商品" v-if="this.item.item_name == ''">
          <el-button type="text" @click="selectGoods">点击关联商品</el-button>
        </el-form-item>
        <el-form-item label="已选商品" v-else>
          <el-button type="text" @click="selectGoods2">{{ this.item.item_name }}</el-button>
        </el-form-item>
        <el-form-item label="任务说明">
          <el-input v-model="form.remarks" placeholder="最多输入20个字符"></el-input>
        </el-form-item>
        <el-form-item label="完成条件">
          <el-input v-model="form.card_target_num" placeholder="请输入下单数量"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即添加</el-button>
          <el-button @click="cancelSubmit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-dialog title="选择关联商品" width="50%" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-col :span="24">
        <el-col :span="10">
          <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="listQuery.item_name">
          </el-input>
        </el-col>
        <el-col :span="2" class="success-btn">
          <el-button type="success" @click="searchGoods()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col >
      <el-col :span="24">
        <el-table 
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :data="gridData" 
        class="dialog-table">
          <el-table-column type="selection" width="55" label="单选"></el-table-column>
          <el-table-column property="item_name" label="商品名称" width=""></el-table-column>
        </el-table>
      </el-col>

      <el-col :span="24">
        <pagination 
        class="pagination" 
        v-show="total>0" 
        :total="total" 
        :page.sync="listQuery.page_no" 
        :limit.sync="listQuery.page_size" 
        v-on:pagination="changePaging"/>
      </el-col >
      
       
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="Submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addSpokesRule,updateSpokesRule } from "@/api/spokesperson";
import { getItemList } from "@/api/giftCard";
import Pagination from '@/components/Pagination';
export default {
  name:'growthCamp',
  components: { Pagination },
  data(){
    return{
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      formLabelWidth: '100px',
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
      },
      list:[],
      form:{
        card_target_num: ''
      },
      gridData:[],
      listQuery: {
        page_no: 1,
        page_size: 10,
        item_name: '',
        status: 1
      },
      multipleSelection: [],
      package:[],
      item:{
        item_name: '',
        item_id: '',
      },
      card_task_id: '',
      selected:[],
      editCard:{}
    }
  },
  created(){
    this.editCard = JSON.parse(sessionStorage.getItem('editCard'));
    if(this.editCard){
      this.item.item_id = this.editCard.item_id;
      this.card_task_id = this.editCard.card_task_id;
      this.item.item_name = this.editCard.item_name;
      this.form.card_target_num = this.editCard.card_target_num;
      this.form.remarks = this.editCard.remarks;
    }
  },
  methods:{
    loadCamplist(){
      this.listLoading = true;
      // campList().then((res) => {
      //   if (res.code == 200) {
      //     this.listLoading = false;
      //     this.list = res.result.list;
      //     this.total = res.result.sign.count;
      //   }
      // })
    },
    selectGoods(){
      this.dialogFormVisible = true;
      this.getItemList();
    },
    selectGoods2(){
      this.item = {};
      this.dialogFormVisible = true;
      this.getItemList();
    },
    //获取商品列表
    getItemList() {
      getItemList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.gridData = res.result.rows;
          this.total = res.result.total;
        }
      });
    },
    Submit(){
      if(this.selected.length > 1){
        this.$message({
          type: "warning",
          message: "每次只能关联一个商品"
        });
      }else{
        this.dialogFormVisible = false;
      }
    },
    cancelDialog(){
      this.cancelValue();
    },
    cancelSubmit(){
      this.$router.go(-1);
    },
    onSubmit(){
      //添加
      let params = {
        task_type: 2,
        task_id: this.card_task_id,
        item_id: this.item.item_id,
        item_name: this.item.item_name,
        remarks: this.form.remarks,
        card_target_num: this.form.card_target_num,
      }

      if(this.card_task_id){
        updateSpokesRule(params).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.$router.go(-1);
          }
        })
      }else{
        addSpokesRule(params).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.$router.go(-1);
            // this.listLoading = false;
            // this.list = res.result.list;
            // this.total = res.result.sign.count;
          }
        })
      }
    },
    handleClose(done) {
      this.cancelValue();
    },
    cancelValue(){
      this.dialogFormVisible = false;
      this.item.item_id = this.editCard.item_id;
      this.card_task_id = this.editCard.card_task_id;
      this.item.item_name = this.editCard.item_name;
      this.form.card_target_num = this.editCard.card_target_num;
      this.form.remarks = this.editCard.remarks;
    },
    toggleSelection(rows) {
      console.log('rows',rows)
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      // this.selected = val;
      // this.item = val[0];
      // this.multipleSelection = val;
      // this.package = [];
      // this.multipleSelection.forEach((v,i) => {
      //   this.package.push(v.package_id)
      // })

      this.selected = val;
      if(val.length>1){
        this.$message({
          type: "warning",
          message: "每次只能关联一个商品"
        });
      }else if(val.length == 1){
        this.item = val[0];
        this.multipleSelection = val;
        this.package = [];
        this.multipleSelection.forEach((v,i) => {
          this.package.push(v.package_id)
        })
      }else if(val.length == 0){
        this.item.item_id = this.editCard.item_id;
        this.card_task_id = this.editCard.card_task_id;
        this.item.item_name = this.editCard.item_name;
        this.form.card_target_num = this.editCard.card_target_num;
        this.form.remarks = this.editCard.remarks;
      }
    },
    searchGoods(){
      this.getItemList();
    },
    changePaging(val){
      this.getItemList();
      // const map = {
      //   page: val.page,
      //   status: this.optionsValue,
      //   name: this.searchText
      // }
      // getItemList(this.listQuery).then(res => {
      //   if (res.code == 200) {
      //     this.gridData = res.result.rows;
      //     this.total = res.result.total;
      //   }
      // });
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
  .pagination {
    margin-top: 10px;
  }
  .title {
    font-weight: 500;
    padding: 15px 10px;
    border-bottom: 1px solid #000;
    margin-bottom: 10px;
  }
  .dialog-footer{
    margin-top: 20px;
  }
}
</style>
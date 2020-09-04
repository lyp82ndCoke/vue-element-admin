<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">创建/编辑营期</el-col>
    </sticky>
    <el-col :span="18" class="app_content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="营期名称：" prop="camp_times_name">
          <el-col :span="6">
            <el-input size="small" v-model="ruleForm.camp_times_name"/>
          </el-col>
        </el-form-item>
        <el-form-item label="营期时间：" prop="times_array">
          <el-col :span="4">
            <el-date-picker
              v-model="ruleForm.times_array"
              type="daterange" size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="选择商品：" prop="goods_info">
          <el-col :span="8">
            <!-- <el-select v-model="goods_info" multiple filterable remote reserve-keyword @change="changeGoods" -->
            <el-select v-model="goods_info" filterable remote reserve-keyword  @change="changeGoods"
            placeholder="请输入商品名称"  :remote-method="remoteMethod" :loading="loading" size="small">
              <el-option
                v-for="item in options"
                :key="item.item_id"
                :label="item.item_name"
                :value="item.item_id+'_'+item.item_name">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="选择规格：" v-if="showSku1" prop="goods_info">
          <el-col :span="6">
            <el-select v-model="value1" placeholder="请选择一级规格" @change="changeSkus1" size="small">
              <el-option
                v-for="item in options1"
                :key="item.sku1_vid"
                :label="item.sku1_v"
                :disabled="item.is_bound == 1"
                :value="item.sku1_kid+'_'+item.sku1_k+'_'+item.sku1_vid+'_'+item.sku1_v+'&'+item.sku_unique_code">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6" v-if="showSku2">
            <el-select v-model="value2" placeholder="请选择二级规格" @change="changeSkus2" size="small">
              <el-option
                v-for="item in options2"
                :key="item.sku2_vid"
                :label="item.sku2_v"
                :disabled="item.is_bound == 1"
                :value="item.sku2_kid+'_'+item.sku2_k+'_'+item.sku2_vid+'_'+item.sku2_v+'&'+item.sku_unique_code">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6" v-if="showSku3">
            <el-select v-model="value3" placeholder="请选择三级规格" @change="changeSkus3" size="small">
              <el-option
                v-for="item in options3"
                :key="item.sku3_vid"
                :label="item.sku3_v"
                :disabled="item.is_bound == 1"
                :value="item.sku3_kid+'_'+item.sku3_k+'_'+item.sku3_vid+'_'+item.sku3_v+'&'+item.sku_unique_code">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button @click="addGoods()" type="primary" size="small">确定</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="已选商品：" prop="">
          <el-col :span="15">
            <ul>
              <li v-for="(item,index) in goodsList2" :key="item.index">
                <span>{{ item.goods_title }}</span>
                <span v-if="item.specs_title.length>0">&nbsp;&nbsp;-&nbsp;&nbsp;{{ item.specs_title[0] }}</span>
                <span v-if="item.specs_title.length>1">&nbsp;&nbsp;-&nbsp;&nbsp;{{ item.specs_title[1] }}</span>
                <span v-if="item.specs_title.length>2">&nbsp;&nbsp;-&nbsp;&nbsp;{{ item.specs_title[2] }}</span>
                <i class="el-icon-circle-close" @click="delGoodsItem(index)"></i>
              </li>
            </ul>
          </el-col>
        </el-form-item>
        <el-form-item label="附加功能：" prop="checkList">
          <el-col :span="12">
            <el-checkbox-group v-model="ruleForm.checkList" :min="1" :max="4" @change="checkList">
              <el-checkbox label="签到"></el-checkbox>
              <el-checkbox label="课程"></el-checkbox>
              <el-checkbox label="任务"></el-checkbox>
              <el-checkbox label="测评"></el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button size="small" @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>
import { addCampTimes,updateCampTimes,updateSpecColumn,campList,campTimesList,campTimesDetails,getItemInfo } from "@/api/growthCamp";
import { getItemList,getGoodsDetail } from "@/api/shopGoods";

import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
import Request from '@/utils/request'
export default {
  components: { Sticky, Tinymce },
  data() {
    return {
      options:[],
      options1:[],
      options2:[],
      options3:[],
      value1: '',
      value2: '',
      value3: '',
      showSku1: false,
      showSku2: false,
      showSku3: false,
      skus:[],
      sku_unique_code:[],
      ruleForm: {
        camp_id:'',
        camp_times_id:'',
        camp_times_name: '',
        times_array: [],
        goods_info: {},
        goods:{
          goods_info:{},
          spec_info:[]
        },
        checkList: [],
      },
      goods_info: null,
      goodsData: {
        page_no: 1,
        page_size: 100,
        item_name:''
      },
      timer: null,
      lastTime: null,
      goodsList2:[],
      loading: false,
      rules: {
        camp_times_name: [
          { required: true, message: '营期名称不能为空', trigger: 'blur' }
        ],
        times_array: [
          { required: true, message: '请选择营期时间', trigger: 'blur' }
        ],
        goods_info: [
          { required: true, message: '商品分类不能为空', trigger: 'blur' }
        ],
        checkList: [
          { required: true, message: '附加功能至少选一个', trigger: 'blur' }
        ],
        specs_id: [
          // { required: true, message: '请填写规格', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    //获取营期详情
    if(this.$route.params.Campid.indexOf('times') != -1){
      this.ruleForm.camp_times_id = this.$route.params.Campid;
      campTimesDetails({camp_times_id:this.ruleForm.camp_times_id}).then(res => {
        if (res.code == 200) {
          this.ruleForm.camp_times_name = res.result.camp_times_name;
          this.ruleForm.camp_id = res.result.camp_id;
          this.ruleForm.camp_times_id = res.result.camp_times_id;
          this.ruleForm.goods = res.result.goods;
          this.ruleForm.times_array.push(res.result.start_time,res.result.end_time);
          this.ruleForm.checkList = []; 
          if(res.result.is_course == '1'){
            this.ruleForm.checkList.push('课程');
          }
          if(res.result.is_sign == '1'){
            this.ruleForm.checkList.push('签到');
          }
          if(res.result.is_task == '1'){
            this.ruleForm.checkList.push('任务');
          }
          if(res.result.is_assess == '1'){
            this.ruleForm.checkList.push('测评');
          }
          
          res.result.goods.spec_info.forEach((item) => {
            let goods = {
              goods_title:'',
              specs_title:[]
            }
            goods.goods_title = res.result.goods.goods_info.goods_name;
            goods.specs_title.push(item.sku1_v);
            if(item.sku2_v){
              goods.specs_title.push(item.sku2_v);
            }
            if(item.sku3_v){
              goods.specs_title.push(item.sku3_v);
            }
            this.goodsList2.push(goods);
            this.sku_unique_code.push(item.sku_unique_code);
          })
        }
      });
    }else{
      this.ruleForm.camp_id = this.$route.params.Campid;
    }
    getItemList(this.goodsData).then(res => {
      if (res.code == 200) {
        this.options = res.result.rows;
      }
    });
  },
  methods: {
    //获取优惠券列表
    remoteMethod(query) {
      if (query !== '') {
        this.options = [];
        this.loading = true;
        getItemList(
            {
              page_no: 1,
              page_size: 100,
              item_name: query
            }
          ).then(res => {
          if (res.code == 200) {
            this.options = res.result.rows;
            this.loading = false;
          }
        });
      } else {
        this.options = [];
      }
    },
    addGoods(){
      let specs = {},goods={
        goods_title:'',
        specs_title:[]
      };
      if(this.value1 != ''){
        specs.sku1_kid = this.value1.split('_')[0],
        specs.sku1_k = this.value1.split('_')[1],
        specs.sku1_vid = this.value1.split('_')[2],
        specs.sku1_v = (this.value1.split('_')[3]).split('&')[0],
        
        goods.specs_title.push(specs.sku1_v);
      }
      if(this.value2 != ''){
        specs.sku2_kid = this.value2.split('_')[0],
        specs.sku2_k = this.value2.split('_')[1],
        specs.sku2_vid = this.value2.split('_')[2],
        // specs.sku2_v = this.value2.split('_')[3],
        specs.sku2_v = (this.value2.split('_')[3]).split('&')[0],
        goods.specs_title.push(specs.sku2_v);
      }
      if(this.value3 != ''){
        specs.sku3_kid = this.value3.split('_')[0],
        specs.sku3_k = this.value3.split('_')[1],
        specs.sku3_vid = this.value3.split('_')[2],
        specs.sku3_v = this.value3.split('_')[3],
        specs.sku3_v = (this.value3.split('_')[3]).split('&')[0],
        goods.specs_title.push(specs.sku3_v);
      }
      if(this.value3){
        specs.sku_unique_code = this.value3.split('&')[1]
      }else if(this.value2){
        specs.sku_unique_code = this.value2.split('&')[1]
      }else if(this.value1){
        specs.sku_unique_code = this.value1.split('&')[1]
      }

      if(specs.sku3_v == undefined && this.showSku3 == true || 
        specs.sku2_v == undefined && this.showSku2 == true ||
        specs.sku1_v == undefined && this.showSku1 == true){
        this.$message({
          message: '规格不完整，请检查',
          type: 'warning'
        });
        return false;
      }

      if(this.goods_info.split('_')[0] != this.ruleForm.goods.goods_info.goods_id 
      && this.ruleForm.goods.spec_info.length > 0){
        this.$confirm('添加其他商品类别将清空当前列表，确定吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.goodsList2 = [];
          this.ruleForm.goods.spec_info = [];
          // this.ruleForm.goods = {};
          this.ruleForm.goods.goods_info.goods_id = this.goods_info.split('_')[0];
          this.ruleForm.goods.goods_info.goods_name = this.goods_info.split('_')[1];
          goods.goods_title = this.goods_info.split('_')[1];
          this.ruleForm.goods.spec_info.push(specs);
          this.goodsList2.push(goods);
          this.sku_unique_code.push(specs.sku_unique_code);
        }).catch(() => {
        });
      }else{
        if(this.sku_unique_code.indexOf(specs.sku_unique_code) == -1){
          this.ruleForm.goods.goods_info.goods_id = this.goods_info.split('_')[0];
          this.ruleForm.goods.goods_info.goods_name = this.goods_info.split('_')[1];
          goods.goods_title = this.goods_info.split('_')[1];
          this.ruleForm.goods.spec_info.push(specs);
          this.goodsList2.push(goods);
          this.sku_unique_code.push(specs.sku_unique_code);
        }else{
          this.$message({
            message: '添加失败，规格不能重复，请检查!',
            type: 'warning'
          })
        }
      }
       
      this.value1 = '';
      this.value2 = '';
      this.value3 = '';
      this.options2 = [];
      this.options3 = [];
    },
    delGoodsItem(i){
      this.goodsList2.splice(i, 1);
      this.ruleForm.goods.spec_info.splice(i,1);
      this.sku_unique_code.splice(i,1);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.go(-1);
    },
    checkList(){},
    //获取规格列表
    getGoodsDetail(n){
      getItemInfo({ item_id: n }).then(res => {
        if (res.code == 200) {
          if(res.result.skus.length){
            this.showSku1 = true;
          }
          // this.options2 = res.result.skus;
          let option1 = [];
          let option2 = [];
          let option3 = [];
          this.skus = res.result.skus;
          for (let index = 0,len = res.result.skus.length; index < len; index++) {
            // const element = res.result.skus[index];
            if(res.result.skus[index].sku1_k && res.result.skus[index].sku2_k){
              let a = {
                sku1_k: res.result.skus[index].sku1_k,
                sku1_kid: res.result.skus[index].sku1_kid,
                sku1_v: res.result.skus[index].sku1_v,
                sku1_vid: res.result.skus[index].sku1_vid,
                sku_unique_code: res.result.skus[index].sku_unique_code,
                // is_bound: res.result.skus[index].is_bound,
              }
              option1.push(a);
            }else{
              let a = {
                sku1_k: res.result.skus[index].sku1_k,
                sku1_kid: res.result.skus[index].sku1_kid,
                sku1_v: res.result.skus[index].sku1_v,
                sku1_vid: res.result.skus[index].sku1_vid,
                sku_unique_code: res.result.skus[index].sku_unique_code,
                is_bound: res.result.skus[index].is_bound,
              }
              option1.push(a);
            }
          }
          this.options1 = this.unique1(option1);
        }
      });
    },
    changeGoods(v){
      this.getGoodsDetail(v.split('_')[0]);
      this.value1 = '';
      this.value2 = '';
      this.value3 = '';
      this.showSku2 = false;
      this.showSku3 = false;
    },
    changeSkus1(v){
      this.value2 = '';
      this.value3 = '';
      this.showSku2 = false;
      this.showSku3 = false;
      this.options2 = [];

      this.skus.forEach( item =>{
        if(item.sku1_vid == (v.split('&')[0]).split('_')[2] && item.sku3_vid && item.sku2_vid){
          this.options2.push(
            {
              sku2_k: item.sku2_k,
              sku2_kid: item.sku2_kid,
              sku2_v: item.sku2_v,
              sku2_vid: item.sku2_vid,
              // is_bound: item.is_bound,
              sku_unique_code: item.sku_unique_code,
            }
          );
        }
        if(item.sku1_vid == (v.split('&')[0]).split('_')[2] && item.sku2_vid && item.sku3_vid == undefined){
          this.options2.push(
            {
              sku2_k: item.sku2_k,
              sku2_kid: item.sku2_kid,
              sku2_v: item.sku2_v,
              sku2_vid: item.sku2_vid,
              is_bound: item.is_bound,
              sku_unique_code: item.sku_unique_code,
            }
          );
        }
      })

      this.options2 = this.unique2(this.options2);

      if(v&&this.options2.length){
        this.showSku2 = true;
      }
    },
    changeSkus2(v){
      this.value3 = '';
      this.options3 = []

      this.skus.forEach( item =>{
        if(item.sku2_vid == v.split('_')[2] && item.sku1_vid == this.value1.split('_')[2] && item.sku3_vid ){
          this.options3.push(
            {
              sku3_k: item.sku3_k,
              sku3_kid: item.sku3_kid,
              sku3_v: item.sku3_v,
              sku3_vid: item.sku3_vid,
              is_bound: item.is_bound,
              sku_unique_code: item.sku_unique_code,
            }
          );
        }
      })
      if(v&&this.options3.length){
        this.showSku3 = true;
      }
      // this.options3 = this.unique3(this.options3);
    },
    changeSkus3(v){
      // for (let index = 0; index < this.options2.length; index++) {
      //   if(this.options2[index].sku1_vid == v){
      //   this.options3 = this.options2[index].values;
      //   }
      // }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //选一个
          if(this.ruleForm.checkList.length == 1){
            if(this.ruleForm.checkList.indexOf('签到') != -1){
              this.ruleForm.is_sign = '1';
              this.ruleForm.is_course = '0';
              this.ruleForm.is_task = '0';
              this.ruleForm.is_assess = '0';
            }else if(this.ruleForm.checkList.indexOf('任务') != -1){
              this.ruleForm.is_task = '1';
              this.ruleForm.is_course = '0';
              this.ruleForm.is_sign = '0';
              this.ruleForm.is_assess = '0';
            }else if(this.ruleForm.checkList.indexOf('课程') != -1){
              this.ruleForm.is_course = '1';
              this.ruleForm.is_sign = '0';
              this.ruleForm.is_task = '0';
              this.ruleForm.is_assess = '0';
            }else if(this.ruleForm.checkList.indexOf('测评') != -1){
              this.ruleForm.is_assess = '1';
              this.ruleForm.is_course = '0';
              this.ruleForm.is_sign = '0';
              this.ruleForm.is_task = '0';
            }
          //选两个
          }else if(this.ruleForm.checkList.length == 2){
            if(this.ruleForm.checkList.indexOf('签到') != -1 && this.ruleForm.checkList.indexOf('课程') != -1){
              this.ruleForm.is_sign = '1';
              this.ruleForm.is_course = '1';
              this.ruleForm.is_task = '0';
              this.ruleForm.is_assess = '0';
            }else if(this.ruleForm.checkList.indexOf('签到') != -1 && this.ruleForm.checkList.indexOf('任务') != -1){
              this.ruleForm.is_sign = '1';
              this.ruleForm.is_task = '1';
              this.ruleForm.is_course = '0';
              this.ruleForm.is_assess = '0';
            }else if(this.ruleForm.checkList.indexOf('签到') != -1 && this.ruleForm.checkList.indexOf('测评') != -1){
              this.ruleForm.is_sign = '1';
              this.ruleForm.is_assess = '1';
              this.ruleForm.is_task = '0';
              this.ruleForm.is_course = '0';
            }else if(this.ruleForm.checkList.indexOf('课程') != -1 && this.ruleForm.checkList.indexOf('任务') != -1){
              this.ruleForm.is_task = '1';
              this.ruleForm.is_course = '1';
              this.ruleForm.is_sign = '0';
              this.ruleForm.is_assess = '0';
            }else if(this.ruleForm.checkList.indexOf('课程') != -1 && this.ruleForm.checkList.indexOf('测评') != -1){
              this.ruleForm.is_assess = '1';
              this.ruleForm.is_course = '1';
              this.ruleForm.is_sign = '0';
              this.ruleForm.is_task = '0';
            }else if(this.ruleForm.checkList.indexOf('任务') != -1 && this.ruleForm.checkList.indexOf('测评') != -1){
              this.ruleForm.is_assess = '1';
              this.ruleForm.is_task = '1';
              this.ruleForm.is_sign = '0';
              this.ruleForm.is_course = '0';
            }
          //选三个
          }else if(this.ruleForm.checkList.length == 3){
            if(!this.ruleForm.checkList.includes('签到')){
              this.ruleForm.is_sign = '0';
              this.ruleForm.is_course = '1';
              this.ruleForm.is_task = '1';
              this.ruleForm.is_assess = '1';
            }else if(!this.ruleForm.checkList.includes('课程')){
              this.ruleForm.is_sign = '1';
              this.ruleForm.is_course = '0';
              this.ruleForm.is_task = '1';
              this.ruleForm.is_assess = '1';
            }else if(!this.ruleForm.checkList.includes('任务')){
              this.ruleForm.is_sign = '1';
              this.ruleForm.is_course = '1';
              this.ruleForm.is_task = '0';
              this.ruleForm.is_assess = '1';
            }else if(!this.ruleForm.checkList.includes('测评')){
              this.ruleForm.is_sign = '1';
              this.ruleForm.is_course = '1';
              this.ruleForm.is_task = '1';
              this.ruleForm.is_assess = '0';
            }
          //全选
          }else if(this.ruleForm.checkList.length == 4){
            this.ruleForm.is_course = '1';
            this.ruleForm.is_sign = '1';
            this.ruleForm.is_task = '1';
            this.ruleForm.is_assess = '1';
          }

          if(this.ruleForm.goods.spec_info.length == 0){
            this.$message({
              message: '至少绑定一个商品，请检查!',
              type: 'warning'
            })
          }else{
            console.log('this.ruleForm',this.ruleForm);
            if(this.ruleForm.camp_times_id){
              //编辑营期
              updateCampTimes(this.ruleForm).then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  });
                  this.$router.go(-1);
                }else{
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  });
                }
              })
            }else{
              //新建营期
              addCampTimes(this.ruleForm).then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  });
                  this.$router.go(-1);
                }else{
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  });
                }
              })
            }
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    unique1(arr){
      let res = []
      let obj = {}
      for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i].sku1_v]) {
          res.push(arr[i])
          obj[arr[i].sku1_v] = true
        }
      }
      return res;
    },
    unique2(arr){
      let res = []
      let obj = {}
      for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i].sku2_v]) {
          res.push(arr[i])
          obj[arr[i].sku2_v] = true
        }
      }
      return res;
    },
    unique3(arr){
      let res = []
      let obj = {}
      for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i].sku3_v]) {
          res.push(arr[i])
          obj[arr[i].sku3_v] = true
        }
      }
      return res;
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0 0 20px;
  ul {
    width: 780px;
    list-style: none;
    padding: 0;
    li {
      width: 100%;
      height: 20px;
      line-height: 20px;
      position: relative;
      text-align: left;
      margin-top: -3px;
      span {
        width: 300px;
      }
      i {
        visibility: hidden;
      }
      &:hover i {
        visibility: visible;
      }
    }
  }
}
.sub-navbar {
  text-align: left;
  .subtitle {
    padding: 0 20px;
  }
}
.app_content{
  padding: 30px;
}
</style>
<template>
  <div class="app-container-coupon">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">{{title}}优惠券</el-col>
    </sticky>
    <el-form class="demo-form-inline" ref="form" :rules="rules" :model="form" label-width="160px" size="small">
      <el-row>
        <el-col :span="24">
          <el-form-item label="优惠券名称：" prop="card_name">
            <el-col :span="7">
              <el-input size="small" v-model="form.card_name" maxlength="10" placeholder="请输入优惠券名称">
              </el-input>
            </el-col>
            <el-col :span="16" class="tips" align="left">
              1至10个字
            </el-col>
          </el-form-item>
          <el-form-item label="发放总量：" prop="card_quantity">
            <el-col :span="7">
              <el-input type="text" v-model="form.card_quantity" placeholder="请输入发放总量" onkeyup="value=value.replace(/[^\d]/g,'')">
              </el-input>
            </el-col>
            <el-col :span="16" class="tips" align="left">
              修改优惠券总量时只能增加不能减少，请谨慎设置，最多1000000张
            </el-col>
          </el-form-item>
          <el-form-item label="适用商品：" prop="promo_card_astrict_item">
            <el-col :span="24">
              <el-col :span="24">
                <el-col :span="5">
                  <el-radio v-model="radio" label="1">指定商品可用</el-radio>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-col :span="2">
                  <el-button type="text" size="mini" @click="relatedLabel">点击选择商品</el-button>
                </el-col>
                <el-col :span="12" class="tips" align="left">
                  (温馨提示：选择完商品后拖拽表格可进行排序哦)
                </el-col>
              </el-col>
            </el-col>
            <el-col :span="12">
              <el-table 
                border 
                size="mini" 
                :data="selectLabel" 
                v-if="selectLabel.length>0" 
                row-key="item_id"
                style="width: 100%">
                <el-table-column 
                  v-for="(colItem, colIndex) in goodsCol" 
                  :key="`goodsCol_${colIndex}`"
                  :prop="colItem.prop" 
                  :label="colItem.label">
                </el-table-column>
                <!-- <el-table-column prop="date" label="商品信息">
                  <template slot-scope="scope">
                    <el-col :span="20">{{scope.row.item_name}}</el-col>
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button size="small" type="text" @click="removeLabels(scope.row.item_id)">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-form-item>
          <el-form-item label="使用门槛：" prop="is_at_least">
            <el-col :span="24">
              <el-col :span="24">
                <el-col :span="5">
                  <el-radio v-model="form.is_at_least" :label='0'>无使用门槛</el-radio>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-col :span="2">
                  <el-radio v-model="form.is_at_least" :label='1'>订单满</el-radio>
                </el-col>
                <el-col :span="4" v-if="form.is_at_least==1" class="comment_style">
                  <el-form-item prop="at_least">
                    <el-input size="small" v-model="form.at_least" onkeyup="value=value.replace(/[^\d]/g,'')">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" v-else style="margin-bottom:0;">
                  <el-input size="small" v-model="form.at_least" onkeyup="value=value.replace(/[^\d]/g,'')">
                  </el-input>
                </el-col>
                <el-col :span="1" style="margin-left:10px;">
                  <span>分</span>
                </el-col>
                <el-col :span="2" v-if="form.at_least>0">
                  <span style="color:green;">{{form.at_least>0 ? form.at_least /100 : 0}}元</span>
                </el-col>
              </el-col>
            </el-col>
          </el-form-item>
          <el-form-item label="优惠内容：" prop="card_value">
            <el-col :span="24">
              <el-col :span="1">减免</el-col>
              <el-col :span="2">
                <el-input size="small" :disabled="form.card_code?true:false" v-model="form.card_value" onkeyup="value=value.replace(/[^\d]/g,'')">
                </el-input>
              </el-col>
              <el-col :span="1" style="margin-left:10px;">
                <span>分</span>
              </el-col>
              <el-col :span="2" v-if="form.card_value>0">
                <span style="color:green;">{{form.card_value>0 ? form.card_value/100 : 0}}元</span>
              </el-col>
            </el-col>
          </el-form-item>
          <el-form-item label="用劵时间：">
            <el-col :span="24">
              <el-col :span="20">
                <el-col style="width:28px;">
                  <el-radio v-model="form.date_type" :label="1" :disabled="form.card_code?true:false"><i></i></el-radio>
                </el-col>
                <el-col :span="9" v-if="form.date_type == 1">
                  <el-form-item prop="effective_date">
                    <el-date-picker v-model="couponDate" type="datetimerange" format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间"
                      end-placeholder="结束时间" :disabled="form.card_code?true:false" @change="handleConpon">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="9" v-else>
                  <el-form-item>
                    <el-date-picker v-model="couponDate" type="datetimerange" format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间"
                      :disabled="form.card_code?true:false" end-placeholder="结束时间" @change="handleConpon">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2" align="right">
                  <el-tooltip placement="bottom">
                    <div slot="content">
                      说明：<br />
                      有效期按结束时间计算。<br />
                      举例：如设置用券时间为5月21日 00:00:00至6月21日 23:59:59，<br />
                      用户在此期间可以领取或者使用；超时则不可领取不可使用。
                    </div>
                    <el-button type="text" size="mini">
                      <i class="el-icon-question tips-icon"></i>
                    </el-button>
                  </el-tooltip>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-col :span="2">
                  <el-radio v-model="form.fixed_begin_term" :label="0" :disabled="form.card_code?true:false">领券当日起</el-radio>
                </el-col>
                <el-col :span="2" style="margin-left:10px;" v-if="form.fixed_begin_term == 0" class="comment_day">
                  <el-form-item prop="term_day">
                    <el-input size="small" type="text" :disabled="form.card_code?true:false" v-model="form.term_day" onkeyup="value=value.replace(/[^\d]/g,'')">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="margin-left:10px;margin-bottom:15px;" v-else>
                  <el-input size="small" type="text" :disabled="form.card_code?true:false" v-model="form.term_day" onkeyup="value=value.replace(/[^\d]/g,'')">
                  </el-input>
                </el-col>
                <el-col :span="1" style="margin-left:10px;">
                  <span>天可用</span>
                </el-col>
                <el-col :span="1" align="center">
                  <el-tooltip placement="bottom">
                    <div slot="content">
                      说明<br />
                      有效期按自然天计算。<br />
                      举例：如设置领券当日起2天内可用，用户在5月21日14:00时领取优惠券，<br />
                      则该优惠券的可用时间为5月21日的14:00:00至5月22日的23:59:59。
                    </div>
                    <el-button type="text" size="mini">
                      <i class="el-icon-question tips-icon"></i>
                    </el-button>
                  </el-tooltip>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-col :span="2">
                  <el-radio v-model="form.fixed_begin_term" :label="1" :disabled="form.card_code?true:false">领券次日起</el-radio>
                </el-col>
                <el-col :span="2" style="margin-left:10px;" v-if="form.fixed_begin_term == 1" class="comment_style">
                  <el-form-item prop="fixed_day">
                    <el-input size="small" type="text" :disabled="form.card_code?true:false" v-model="form.fixed_day" onkeyup="value=value.replace(/[^\d]/g,'')">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="margin-left:10px;" v-else>
                  <el-input size="small" type="text" :disabled="form.card_code?true:false" v-model="form.fixed_day" onkeyup="value=value.replace(/[^\d]/g,'')">
                  </el-input>
                </el-col>
                <el-col :span="1" style="margin-left:10px;">
                  <span>天可用</span>
                </el-col>
                <el-col :span="1" align="center">
                  <el-tooltip placement="bottom">
                    <div slot="content">
                      说明：<br />
                      有效期按自然天计算。<br />
                      举例：如设置领券次日起2天内可用，用户在5月21日的14:00领取优惠券，<br />
                      则该优惠券的可用时间为5月22日的00:00:00到5月23日的23:59:59。
                    </div>
                    <el-button type="text" size="mini">
                      <i class="el-icon-question tips-icon"></i>
                    </el-button>
                  </el-tooltip>
                </el-col>
              </el-col>
            </el-col>
            <span style="color:red;position: absolute;left: -91px;">*</span>
          </el-form-item>
          <el-form-item label="领取人：" prop="temporary_label">
            <el-col :span="24">
              <el-col :span="6">
                <el-radio v-model="form.temporary_label" :label="1" :disabled="form.card_code?true:false">不限制，所有人都可以领</el-radio>
              </el-col>
            </el-col>
          </el-form-item>
          <el-form-item label="领取次数：" prop="quota_receive">
            <el-col :span="24">
              <el-col :span="24">
                <el-col :span="5">
                  <el-radio v-model="form.quota_receive" :label='0' :disabled="form.card_code?true:false">不限次数</el-radio>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-col :span="2">
                  <el-radio v-model="form.quota_receive" :label='1' :disabled="form.card_code?true:false">限制领取</el-radio>
                </el-col>
                <el-col :span="3" v-if="form.quota_receive==1" class="comment_style">
                  <el-form-item prop="quota">
                    <el-input size="small" type="text" :disabled="form.card_code?true:false" v-model="form.quota" onkeyup="value=value.replace(/[^\d]/g,'')">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" v-else style="margin-bottom:0;">
                  <el-input size="small" type="text" :disabled="form.card_code?true:false" v-model="form.quota" onkeyup="value=value.replace(/[^\d]/g,'')">
                  </el-input>
                </el-col>
                <el-col :span="1" style="margin-left:10px;">
                  <span>次</span>
                </el-col>
                <el-col :span="3" class="tips" align="left">
                  最多可领取500次
                </el-col>
              </el-col>
            </el-col>
          </el-form-item>
          <el-form-item label="分享设置：">
            <el-col :span="24">
              <el-col :span="6">
                <el-checkbox v-model="form.share_flag">优惠券允许分享给好友领取</el-checkbox>
              </el-col>
            </el-col>
          </el-form-item>
          <el-form-item label="显示到商品：">
            <el-col :span="24">
              <el-col :span="24">
                <el-col :span="5">
                  <el-checkbox v-model="form.goods_flag">显示</el-checkbox>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-col :span="5">
                  <el-button type="text" size="mini" @click="relatedGoods">点击选择商品</el-button>
                </el-col>
              </el-col>
            </el-col>
            <el-col :span="12">
              <el-table border size="mini" :data="selectShow" v-if="selectShow.length>0" style="width: 100%">
                <el-table-column prop="date" label="商品信息">
                  <template slot-scope="scope">
                    <!-- <el-col :span="5">
                      <img
                        align='center'
                        style="width:50px; height:50px;"
                        :src="scope.row.pic_url"
                        alt="">
                    </el-col> -->
                    <el-col :span="18" style="padding-left: 10px;">{{scope.row.item_name}}</el-col>
                  </template>
                </el-table-column>
                <!-- <el-table-column
                  prop="date"
                  width="200"
                  label="库存">
                  <template slot-scope="scope">
                    <el-col style="margin-left: 20px;">{{scope.row.quantity}}</el-col>
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button size="small" type="text" @click="removeShow(scope.row.item_id)">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-form-item>
          <el-form-item label="使用说明：">
            <el-col :span="24">
              <el-col :span="10">
                <el-input type="textarea" resize="none" :autosize="{ minRows: 5, maxRows: 6}" maxlength="50"
                  show-word-limit placeholder="请输入使用说明" v-model="form.description"></el-input>
              </el-col>
              <el-col :span="12" class="tips" align="left">
                <el-tooltip placement="right">
                  <div slot="content"><img class="img-hover"
                      src="https://poster-share.oss-cn-beijing.aliyuncs.com/poster/ZMWHF9251ABE397391C28D0EA828F1307193.png"
                      alt=""></div>
                  <el-button type="text">查看示例</el-button>
                </el-tooltip>
              </el-col>
            </el-col>
          </el-form-item>

          <el-form-item label="备注：">
            <el-col :span="24">
              <el-col :span="10">
                <el-input type="textarea" resize="none" :autosize="{ minRows: 5, maxRows: 6}" maxlength="500"
                  show-word-limit placeholder="请输入使用说明" v-model="form.remarks"></el-input>
              </el-col>

              <el-col :span="10" class="tips" align="left">
                1至500个字
              </el-col>
            </el-col>
          </el-form-item>

        </el-col>
      </el-row>
    </el-form>

    <!-- 关联适用商品 -->
    <el-col :span="24" v-if='alertShow' class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="24" class="alert-content-top">
          <el-col :span="24" class="title-header">
            <el-col :span="6">
              <el-input size="small" clearable placeholder="请输入商品名称" prefix-icon="el-icon-search"
                v-model="goods.item_name"></el-input>
            </el-col>
            <el-col :span="2" align="right">
              <el-button type="success" class="search-btn" size="small" @click="searchActivity">搜索</el-button>
            </el-col>
          </el-col>
          <el-table size="small" border :data="goodsData" @selection-change="goodsSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="商品信息">
              <template slot-scope="scope">
                <el-col :span="3">
                  <img align='center' style="width:50px;height:50px;" :src="scope.row.pic_url" alt="">
                </el-col>
                <el-col :span="20" style="padding-left: 10px;">{{scope.row.item_name}}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="库存">
              <template slot-scope="scope">
                <el-col :span="2">
                  {{scope.row.quantity}}
                </el-col>
              </template>
            </el-table-column>
          </el-table>
          <pagination class="pagination" v-show="goodsTotal>0" :total="goodsTotal" :page.sync="goods.page_no"
            :limit.sync="goods.page_size" v-on:pagination="getItemList" />
        </el-col>
        <el-col :span="16" align="left" class="sure-margin">
          <el-button type="primary" size="mini" @click="addActivityList">批量添加</el-button>
          <el-button type="info" size="mini" @click="cancelGoods">取消</el-button>
        </el-col>
      </el-col>
    </el-col>

    <!-- 关联显示到商品 -->
    <el-col :span="24" v-if='showGoods' class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="24" class="alert-content-top">
          <el-table size="small" border :data="showDatas" @selection-change="showSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="商品信息">
              <template slot-scope="scope">
                <!-- <el-col :span="3">
                  <img
                    align='center'
                    style="width:50px;height:50px;"
                    :src="scope.row.pic_url"
                    alt=""
                  >
                </el-col> -->
                <el-col :span="20" style="padding-left: 10px;">{{scope.row.item_name}}</el-col>
              </template>
            </el-table-column>
            <!-- <el-table-column label="库存">
              <template slot-scope="scope">
                <el-col :span="2">
                  {{scope.row.quantity}}
                </el-col>
              </template>
            </el-table-column> -->
          </el-table>
        </el-col>
        <el-col :span="16" align="left" class="sure-margin">
          <el-button type="primary" size="mini" @click="addShowGoods">批量添加</el-button>
          <el-button type="info" size="mini" @click="cancelShow">取消</el-button>
        </el-col>
      </el-col>
    </el-col>

    <el-col :span="24" align="center" class="bottom-btn-wrap">
      <el-button v-show="!view" size="mini" type="danger" :loading="saveLoading" class="bottom-btn"
        @click="save('form')">确定</el-button>
      <el-button type="info" class="bottom-btn" size="mini" @click="cancel">取消</el-button>
    </el-col>
  </div>
</template>
<script>
import { getgoodsList, addPromo, updatePromo, getPromoInfo } from "@/api/giftCard";
import Sticky from "@/components/Sticky";
import Tinymce from "@/components/Tinymce";
import Pagination from '@/components/Pagination';
import Sortable from 'sortablejs'
export default {
  components: {
    Sticky,
    Tinymce,
    Pagination
  },
  data() {
    return {
      title: "新建",
      form: {
        card_name: '',
        card_quantity: null,
        promo_card_astrict_item: [],
        exchange_rule: 3,//兑换规则 1直接兑换 2另付金额 3满减
        is_at_least: 0,//适用门槛 0不限制 1表示限制
        at_least: null,
        card_value: null,
        date_type: null,
        effective_date: "",
        invalid_date: "",
        fixed_term: null,
        fixed_day: null,
        term_day: null,
        promo_card_astrict_label: [],
        promo_card_show_item: [],
        quota: 0,
        quota_receive: 0,
        share_flag: false,
        status_code: 1,
        eff_flag: 1,
        goods_flag: false,
        temporary_label: 1,
        description: '',
        remarks: '',
        fixed_begin_term: null,
      },
      goods: {
        page_no: 1,
        page_size: 10,
        item_name: "",
        item_id_no: ""
      },
      goodsData: [],
      goodsTotal: 0,
      couponDate: [],
      showGoods: false,
      selectShow: [],
      selectLabel: [],
      radio: '1',
      saveLoading: false,//保存按钮loading  避免重复保存
      view: false,//查看状态
      alertShow: false,
      currentGoods: null,
      selectgoods:[],
      // 验证规则
      rules: {
        card_name: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" }
        ],
        card_quantity: [
          { required: true, message: "请输入发放总量", trigger: "blur" }
        ],
        is_at_least: [
          { required: true, message: "请选择使用门槛", trigger: "change" }
        ],
        at_least: [
          { required: true, message: "请输入订单满减金额", trigger: "change" }
        ],
        promo_card_astrict_item: [
          { required: true, message: "请选择适用商品", trigger: "change" }
        ],
        card_value: [
          { required: true, message: "请输入优惠内容", trigger: "change" }
        ],
        // date_type: [
        //   { required: true, message: "请选择用券时间", trigger: "change" }
        // ],
        // fixed_begin_term: [
        //   { required: true, message: "请选择用券时间", trigger: "change" }
        // ],
        effective_date: [
          { required: true, message: "请选择时间", trigger: "change" }
        ],
        term_day: [
          { required: true, message: "请输入天数", trigger: "blur" }
        ],
        fixed_day: [
          { required: true, message: "请输入天数", trigger: "blur" }
        ],
        temporary_label: [
          { required: true, message: "请选择领取人", trigger: "blur" }
        ],
        quota_receive: [
          { required: true, message: "请选择领取次数", trigger: "blur" }
        ],
        quota: [
          { required: true, message: "请输入限制领取的张数", trigger: "blur" }
        ]
      },
      // 适用商品表头
      goodsCol:[
        {
          label: '商品信息',
          prop: 'item_name',
        }
      ],
      copyCode: ''
    };
  },
  created() {
    if (this.$route.params.id != 0) {
      this.title = "编辑";
      this.form.card_code = this.$route.params.id;
      this.getPromoInfo(this.form.card_code);
      if (this.$route.query.view) {
        this.view = true;
        this.title = "查看";
      }
    }
    
    this.copyCode = this.$route.query.card_code;
    if(this.copyCode){
      this.getPromoInfo(this.$route.query.card_code)
    }
  },
  computed: {},
  methods: {
    //适用商品拖拽 排序
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody');
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.selectLabel.splice(oldIndex, 1)[0]
          _this.selectLabel.splice(newIndex, 0, currRow)
        }
      })
    },
    getPromoInfo(card_code) {
      getPromoInfo({ card_code }).then(res => {
        if (res.code == 200) {
          const result = res.result;
          for (let key in this.form) {
            for (let item in result) {
              if (key == item) {
                this.form[key] = result[key];
              }
            }
          }
          this.selectLabel = result.promo_card_astrict_item;
          this.$nextTick(() => {
            this.rowDrop()
          })
          
          if (result.promo_card_show_item.length > 0) {
            this.selectShow = result.promo_card_show_item;
            this.selectgoods = result.promo_card_show_item;
            this.form.goods_flag = true;
          }
          this.form.share_flag = result.share_flag == 1 ? true : false;
          if (result.date_type == 1) {
            this.couponDate[0] = result.effective_date;
            this.couponDate[1] = result.invalid_date;
            this.couponDate.splice(2);
          } else {
            if (result.fixed_begin_term == 0) {
              this.form.term_day = result.fixed_term;
            } else {
              this.form.fixed_day = result.fixed_term;
            }
          }
          if (result.is_at_least == 0) {
            this.form.at_least = null;
          }
          if (result.quota != 0) {
            this.form.quota_receive = 1;
          }
        }
      })
    },
    // 获取商品列表
    getItemList() {
      getgoodsList(this.goods).then(res => {
        if (res.code == 200) {
          this.goodsData = res.result.rows;
          this.goodsTotal = res.result.total;
        }
      })
    },
    relatedLabel() {
      let labelCode = [];
      if (this.selectLabel.length != 0) {
        this.selectLabel.forEach(item => {
          if (labelCode.indexOf(item.item_id) === -1) {
            labelCode.push(item.item_id)
          }
        })
        this.goods.item_id_no = labelCode.map((item) => item).join(',');
      }
      this.alertShow = true;
      this.getItemList();
    },
    removeLabels(item_id) {
      this.selectLabel.forEach((item, index) => {
        if (item_id == item.item_id) {
          this.selectLabel.splice(index, 1);
        }
      })
      this.form.promo_card_astrict_item.forEach((item, index) => {
        if (item_id == item.item_id) {
          this.form.promo_card_astrict_item.splice(index, 1);
        }
      })
    },
    goodsSelect(val) {
      this.currentGoods = val;
    },
    addActivityList() {
      this.currentGoods.forEach(item => {
        this.selectLabel.push({
          item_id: item.item_id,
          item_name: item.item_name,
          pic_url: item.pic_url,
          quantity: item.quantity
        });
      })
      this.form.promo_card_astrict_item = this.selectLabel;
      this.alertShow = false;
      this.$message({
        type: 'success',
        message: '关联成功!'
      });
    },
    handleConpon(val) {
      if (val.length > 0) {
        this.form.effective_date = val[0];
        this.form.invalid_date = val[1];
      } else {
        this.form.effective_date = '';
        this.form.invalid_date = '';
      }
    },
    // 搜索商品
    searchActivity() {
      this.goods.page_no = 1;
      this.getItemList();
    },
    // 显示商品
    relatedGoods() {
      this.showDatas = this.selectLabel;
      this.showGoods = true;
    },
    showSelect(val) {
      this.currentShow = val;
    },
    unique(arr1){
      const res = new Map();
      return arr1.filter((a) => !res.has(a.item_id) && res.set(a.item_id, 1))
    },
    addShowGoods() {
      this.currentShow.forEach((item,index) => { 
        this.selectgoods.push(item)
      })
      this.selectShow = this.unique(this.selectgoods);
      this.showGoods = false;
      this.$message({
        type: 'success',
        message: '关联成功!'
      });
    },
    removeShow(item_id) {
      this.selectShow.forEach((item, index) => {
        if (item_id == item.item_id) {
          this.selectShow.splice(index, 1);
        }
      })
      this.form.promo_card_show_item.forEach((itm, index) => {
        if (item_id == itm.item_id) {
          this.form.promo_card_show_item.splice(index, 1);
        }
      })
    },
    cancelShow() {
      this.showGoods = false;
    },

    // 取消选择商品
    cancelGoods() {
      this.alertShow = false;
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.promo_card_astrict_item = this.selectLabel;
          if (this.form.quota_receive == 0) {
            this.form.quota = 0;
          }
          if (this.form.date_type || this.form.fixed_begin_term == 0 || this.form.fixed_begin_term == 1) {
            this.form.share_flag = this.form.share_flag ? 1 : 0;
            this.form.card_quantity = this.form.card_quantity - 0;
            this.form.card_value = this.form.card_value - 0;
            if (this.form.card_quantity > 1000000) {
              this.$message.warning('发放总量最多1000000张哦');
              return false;
            }
            if (this.form.quota > 500) {
              this.$message.warning('最多可领取500次');
              return false;
            }
            if (this.form.date_type != 1) {
              this.form.date_type = 2;
              this.form.fixed_term = this.form.fixed_begin_term == 0 ? this.form.term_day : this.form.fixed_day;
            }else{
              if(!this.form.effective_date || !this.form.invalid_date){
                this.$message.warning('请选择用券时间段');
                return false;
              }
            }
            this.form.promo_card_show_item = this.unique(this.selectShow);
            console.log(this.form,'this.form')
            this.saveLoading = true;
            if (this.form.card_code) {
              this.updatePromo();
            } else {
              this.addPromo();
            }
          } else {
            this.$message.warning('请选择用券时间');
            return false;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    updatePromo() {
      updatePromo(this.form).then(res => {
        if (res.code == 200) {
          this.cancel()
        }
        this.saveLoading = false;
      })
    },
    addPromo() {
      addPromo(this.form).then(res => {
        if (res.code == 200) {
          this.cancel()
        }
        this.saveLoading = false;
      })
    },
    // 取消
    cancel() {
      this.$router.push({ path: `../index` })
    }
  },
  watch: {
    "form.fixed_begin_term": function (val) {
      if(this.$route.params.id ==0){
        if (val == 0 || val == 1) {
          this.form.date_type = null;
          // this.form.term_day = null;
          // this.form.fixed_day = null;
          this.form.effective_date = '';
          this.form.invalid_date = '';
          this.couponDate.length = 0;
          this.couponDate.splice(2);
        }
      }
    },
    "form.date_type": function (val) {
      if(this.$route.params.id ==0){
        if (val) {
          this.form.fixed_begin_term = null;
        }
      }
    },
    "form.quota_receive": function (val) {
      if(this.$route.params.id ==0){
        if (val == 0) {
          this.form.quota = null;
        }
      }
      
    }
  }
};
</script>

<style lang="scss">
.app-container-coupon {
  padding: 0 0 20px;
  .demo-form-inline {
    padding: 10px;
  }
  .comment_style {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
  }
  .comment_day {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 15px;
    }
  }
  .bg-putple-light {
    .avater-wrap {
      height: 110px;
      .avatar {
        width: 80px;
        width: 80px;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 80px;
        width: 80px;
        line-height: 80px;
        text-align: center;
      }
    }
  }
  .tips-icon {
    font-size: 24px;
    margin-top: -5px;
    color: #000;
  }
  .banner-img-wrap {
    display: inline-block;
    height: 140px;
    margin: 10px;
    position: relative;
    cursor: pointer;
    .banner-img {
      height: 100%;
    }
    .banner-img-remove {
      z-index: 20;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-size: 30px;
      display: none;
      background-color: rgba($color: #000000, $alpha: 0.2);
      .el-icon-delete {
        z-index: 10;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        // color: #000000;
      }
      .el-icon-delete:hover {
        color: #1989fa;
      }
    }
    &:hover > .banner-img-remove {
      display: block;
      // background-color: #fff;
    }
  }
  .tips-wrap {
    padding-left: 50px;
  }
  .tips {
    padding: 0 5px;
    color: red;
  }
  .head-img {
    width: 100px;
  }
}

table {
  border: 0;
}
table.table-sku {
  width: 100%;
  background-color: #fff;
  text-align: left;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
table.table-sku td {
  border: 1px solid #e5e5e5;
  padding: 8px;
}
.el-table--small td {
  padding: 0;
}
.close-project {
  font-size: 20px;
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

    .sure-margin {
      position: absolute;
      bottom: 5px;
      padding: 0 20px;
    }
  }
  // &-content--top {
  //   padding-bottom: 100px;
  // }
  &-content-wrap {
    position: relative;
    border-radius: 5px;
    height: 100%;
    width: 100%;
    padding: 0 0 40px 00px;
    background-color: #fff;
    overflow: auto;
    .title-header {
      padding-bottom: 10px;
    }
    .alert-content-top {
      height: 100%;
      overflow: auto;
      padding: 20px;
    }
    .all-cancel-btn {
      margin-top: 10px;
    }
    .price {
      color: red;
      font-weight: 400;
    }
  }
}
.img-hover {
  width: 300px;
}
.bottom-btn-wrap {
  padding: 10px;
  .bottom-btn {
    margin-left: 10px;
  }
}
</style>
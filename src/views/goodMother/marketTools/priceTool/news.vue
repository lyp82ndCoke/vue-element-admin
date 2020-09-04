<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">{{title}}涨价活动</el-col>
    </sticky>
    <el-form class="demo-form-inline" ref="form" :rules="rules" :model="form" label-width="160px" size="small">
      <el-row>
        <el-col :span="24">
          <el-form-item label="活动名称" prop="rule_name">
            <el-col :span="6">
              <el-input v-model="form.rule_name" placeholder="请输入活动名称"></el-input>
            </el-col>

          </el-form-item>

          <el-form-item label="显示涨价时间" prop="display_begn_time">
            <el-col :span="24">
              <el-col :span="6">
                <el-date-picker style="width:100%" v-model="form.display_begn_time" format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择涨价时间">
                </el-date-picker>
              </el-col>
              <el-col :span="16" class="tips" align="left"> 倒计时显示时间，商品详情页价格下方将会预告活动开始结束时间和涨价金额。
                <el-tooltip placement="bottom">
                  <div slot="content"><img class="img-hover"
                      src="https://poster-share.oss-cn-beijing.aliyuncs.com/poster/ZMWHC422C4A514DA03D982FDFCBDD8A47D4B.jpg"
                      alt=""></div>
                  <el-button type="text">查看示例</el-button>
                </el-tooltip>
              </el-col>

            </el-col>

          </el-form-item>

          <el-form-item label="涨价执行时间" prop="price_begn_time">
            <el-col :span="6">
              <el-date-picker style="width:100%" v-model="form.price_begn_time" format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择执行涨价时间">
              </el-date-picker>
            </el-col>
            <el-col :span="16" class="tips" align="left">活动开始后，商品和规格售价价格变更时间。</el-col>
          </el-form-item>

          <el-form-item prop="rule_label" label="活动标签">
            <el-col :span="6">
              <el-input v-model="form.rule_label"></el-input>
            </el-col>
            <el-col :span="16" class="tips" align="left"> 活动期间展示于商品详情的价格旁边，2至5字。
              <el-tooltip placement="bottom">
                <div slot="content"><img class="img-hover"
                    src="https://poster-share.oss-cn-beijing.aliyuncs.com/poster/ZMWHA74AF86524DB93983B6A96063EE338C6.jpg"
                    alt=""></div>
                <el-button type="text">查看示例</el-button>
              </el-tooltip>
            </el-col>

          </el-form-item>

        </el-col>
      </el-row>

      <!-- <el-form-item>
        <el-button
          type="primary"
          @click="onGoodSubmit('form')"
          :loading="saveGoods"
        >选择参加活动的商品</el-button>
      </el-form-item> -->
      </el-row>

      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane style="padding:0 20px" label="涨价活动" name="first">
          <el-col :span="24">
            <el-col :span="24" class="alert-content-wrap">
              <el-col :span="24" class="title-header">
                <el-col :span="4">

                  <el-input size="mini" clearable placeholder="批量涨价，输入金额" v-model.number="addPrices">
                    <!-- <template slot="prepend">批量涨价</template> -->
                  </el-input>
                </el-col>
                <el-col :span="3" :offset="1">
                  <el-button size="mini" type="primary" @click="allAddPrice" v-if="addPrices>0&&form.item.length>0">全部涨价
                  </el-button>
                </el-col>
                <el-col :offset="2" :span="5">
                  <el-button type="text" size="mini" @click="relatedGoods">点击选择商品</el-button>
                </el-col>
              </el-col>
              <el-table ref="multipleTable" size="small" border :data="form.item"
                @selection-change="activityGoodsSelect">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="商品信息">
                  <template slot-scope="scope">
                    <el-row>
                      <el-col :span="6">
                        <el-col :span="4">
                          <img align='center' style="width:100%; height:40px;" :src="scope.row.pic_url" alt="">
                        </el-col>
                        <el-col :span="20" style="padding-left: 10px;">{{scope.row.item_name}}
                          <el-col :span="24" class="price">
                            ￥{{scope.row.initial_price/100}}元
                          </el-col>
                        </el-col>
                      </el-col>
                      <el-col :span="18">
                        <el-col :span="10">
                          <el-form-item label="涨价金额（分）" :prop="`item.${scope.$index}.add_price`"
                            :rules="rules.add_price">
                            <el-col :span="24">

                              <el-input size="mini" placeholder="涨价金额" v-model.number="scope.row.add_price"
                                @keyup.native="addPriceChange(scope.$index)">
                                <!-- <template slot="prepend">涨价</template>
                                <template slot="append">分</template> -->
                              </el-input>

                            </el-col>
                          </el-form-item>
                          <el-col :span="24" class="tips-wrap">
                            <el-col>涨价： <span class="tips">{{scope.row.add_price/100}}元</span></el-col>
                          </el-col>

                        </el-col>
                        <el-col :span="10" :offset="1">
                          <el-form-item :prop="`item.${scope.$index}.final_price`" :rules="rules.final_price"
                            label="涨价后金额(分)">
                            <el-col :span="24">

                              <el-input size="mini" placeholder="涨价后金额" v-model.number="scope.row.final_price"
                                @keyup.native="finalPriceChange(scope.$index)">
                                <!-- <template slot="prepend">涨价后</template>
                                <template slot="append">分</template> -->
                              </el-input>

                            </el-col>
                          </el-form-item>
                          <el-col :span="24" class="tips-wrap">
                            <el-col>涨价后价格： <span class="tips">{{scope.row.final_price/100}}元</span></el-col>
                          </el-col>
                        </el-col>
                        <!-- <el-col :span="8"></el-col> -->
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column label="库存" width="80">
                  <template slot-scope="scope">
                    <el-col :span="15" style="margin-left: 20px;">{{scope.row.quantity}}</el-col>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">

                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="extensionGoods(scope.row.item_id)">推广</el-button>
                    <el-button type="danger" size="mini" @click="delActivity(scope.$index)">取消</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-col :span="16" align="left" class="all-cancel-btn">
                <el-button size="mini" @click="allCancelGoods">批量取消</el-button>
              </el-col>

            </el-col>
          </el-col>
        </el-tab-pane>

      </el-tabs>
    </el-form>

    <!-- 关联商品 -->
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
                <el-col :span="4">
                  <img align='center' style="width:100%; height:40px;" :src="scope.row.pic_url" alt="">
                </el-col>
                <el-col :span="20" style="padding-left: 10px;">{{scope.row.item_name}}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="库存">
              <template slot-scope="scope">
                <el-col :span="2">
                  {{scope.row.quantity}}
                  <!-- <img
                  align='center'
                  class="head-img"
                  :src="scope.row.pic_url"
                  alt=""
                > -->
                </el-col>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="addActivity(scope.row)">参加活动</el-button>
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
    <el-col :span="24" align="center" class="bottom-btn-wrap">
      <el-button v-show="!view" size="mini" type="danger" :loading="saveLoading" class="bottom-btn"
        @click="save('form')">保存</el-button>
      <el-button type="info" class="bottom-btn" size="mini" @click="cancel">取消</el-button>
    </el-col>

    <!-- 推广 -->
    <div :span="24" class="alert-wrap" v-if='popularize' @click.self="hiddenWrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-row>
          <el-col :span="3" class="wrap-title">推广链接：</el-col>
          <el-col :span="16">{{codeUrl}}</el-col>

        </el-row>

        <el-row style="margin-top: 20px;">
          <el-col :span="4">
            <el-button size="mini" type="primary" :data-clipboard-text="`${codeUrl}`" @click="copyActivity"
              class="activity-url">复制链接地址</el-button>
          </el-col>
        </el-row>

        <el-row style="margin-top: 40px;">
          <el-col :span="4" class="wrap-title">推广二维码：</el-col>
          <div id="qrCode">
            <div id='code'></div>
            <canvas id="canvas" ref="canvas"></canvas>
          </div>
        </el-row>
      </el-col>
    </div>

  </div>
</template>

<script>


import {
  getGoods,
  saveRule,
  getRuleList,
  editSaveRule,
} from "@/api/giftCard";

import Sticky from "@/components/Sticky";
import Tinymce from "@/components/Tinymce";
import Pagination from '@/components/Pagination';
import Base64 from 'js-base64'
import QRCode from 'qrcode'
import Clipboard from 'clipboard'
export default {
  components: {
    Sticky,
    Tinymce,
    Pagination
  },
  data() {
    const host = process.env.BASE_API + "publicmethod/upfile/upload_file";
    // 验证涨价显示时间规则  不能在执行涨价时间以后
    const beginTime = (rule, value, callback) => {
      const maxVale = this.form.price_begn_time;
      console.log(this.form, maxVale, 'console.log(maxVale)')
      if (!value) {
        callback(new Error('请选择涨价显示时间'))
      } else if (!maxVale) {
        // 涨价执行时间不存在
        callback()
      } else if (maxVale <= value) {
        callback(new Error('涨价显示时间不能大于涨价执行时间'))
      } else {
        callback()
      }
    }
    // 验证执行涨价时间规则  不能在涨价显示时间以后
    const endTime = (rule, value, callback) => {

      const minVale = this.form.display_begn_time;
      if (!value) {
        // 值不存在
        callback(new Error('请选择执行显示时间'))
      } else if (!minVale) {
        // 涨价执行时间不存在
        callback()
      } else if (minVale >= value) {
        callback(new Error('涨价执行时间不能小于涨价显示时间'))
      } else {
        console.log(minVale, 'console.log(minVale)')
        callback()
      }
    }
    // 验证正整数
    const price = (rule, value, callback) => {
      const re = /^\+?[1-9][0-9]*$/;
      if (re.test(value)) {
        // 值符合规则
        callback()

      } else {
        callback(new Error('金额为正整数'))
      }
    }


    return {
      saveLoading: false,//保存按钮loading  避免重复保存
      view: false,//查看状态
      title: "新建",
      alertShow: false,
      activeName: "first",
      form: {
        rule_id: '',//规则id
        price_begn_time: "",//涨价时间
        display_begn_time: "",//涨价执行时间
        rule_label: "",//活动标签
        rule_name: '',//活动名称
        // 当前选择参加活动的商品
        item: [

        ],

      },

      //推广会弹框
      popularize: false,
      // 商品列表
      goodsData: [],
      // 商品列表请求参数
      goods: {
        page_no: 1,
        page_size: 10,
        item_name: ""
      },
      // 商品总条数
      goodsTotal: 0,
      // 批量涨价
      addPrices: null,
      // 批量选择的商品list
      currentGoods: null,
      // 批量选择已经选择的商品lsit
      currentActivityGoods: null,
      // 验证规则
      rules: {
        rule_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        display_begn_time: [
          { type: 'date', required: true, trigger: ['blur', 'change'], validator: beginTime }

        ],
        price_begn_time: [
          { type: 'date', required: true, trigger: ['blur', 'change'], validator: endTime }
        ],
        rule_label: [
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        add_price: [
          { required: true, type: "number", trigger: ['blur', 'change'], validator: price }
        ],
        final_price: [
          { required: true, type: "number", trigger: ['blur', 'change'], validator: price }
        ]
      },

    };
  },

  created() {
    console.log(this.$route, 'type')
    if (this.$route.params.id != 0) {
      this.title = "编辑";
      this.form.rule_id = this.$route.params.id;
      if (this.$route.query.view) {
        this.view = true;
        this.title = "查看";
      }
      this.getRuleList();
    }
  },

  computed: {

  },
  methods: {
    // 转换商品推广连接
    useqrcode(url) {
      var canvas;
      this.$nextTick(() => {
        canvas = this.$refs.canvas;
        QRCode.toCanvas(canvas, url, function (error) {
          if (error) {
            console.error(error)
          } else {
            console.log('QRCode success!');
          }
        })
      })
    },
    // 关联活动
    addActivity(row) {

      let bol = true;
      const data = Object.assign({}, row, {
        add_price: 0,
        final_price: row.price,
        initial_price: row.price
      })
      this.form.item.forEach(item => {
        if (data.item_id === item.item_id) {
          bol = false;
          return false;
        }
      })
      if (bol) {
        this.form.item.push(data)
      } else {
        this.$message("选项中有重复项，已为您去除")
      }
      this.alertShow = false;
    },
    // 批量关联活动
    addActivityList() {
      this.currentGoods.forEach(item => {
        this.addActivity(item);
      })
    },
    // 获取商品列表
    getItemList() {
      const data = this.goods;
      getGoods(data).then(res => {
        if (res.code == 200) {
          this.goodsData = res.result.rows;
          this.goodsTotal = res.result.total;

        }
      })
    },
    // 推广
    extensionGoods(item_id) {
      this.popularize = true;
      const dataBase = {
        item_id: item_id,
        channel: 1
      }
      let base = Base64.Base64.encode(JSON.stringify(dataBase));
      this.item_id = item_id;
      // const codeUrl = `${this.MOTHER_API}/#/goodsDetails/${item_id}/1`;
      this.codeUrl = `${process.env.MOTHER_API}/#/item?param=${base}`;
      // console.log(dataBase, this.codeUrl, "=====")
      this.useqrcode(this.codeUrl);
    },
    // 隐藏推广弹框
    hiddenWrap() {
      this.popularize = false;
    },
    // 复制推广链接
    copyActivity() {
      var clipboard = new Clipboard('.activity-url')
      clipboard.on('success', e => {
        this.$message({
          message: '复制成功',
          type: 'success'
        });
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制  
        console.log('该浏览器不支持自动复制')
        // 释放内存  
        clipboard.destroy()
      })
    },
    // 搜索商品
    searchActivity() {
      this.goods.page_no = 1;
      this.getItemList();
    },
    // 显示商品
    relatedGoods() {
      this.alertShow = true;
      this.getItemList();
    },
    // 修改涨价数字
    addPriceChange(i) {
      const final_price = this.form.item[i].initial_price + this.form.item[i].add_price;
      this.$set(this.form.item[i], "final_price", final_price)
    },
    // 修改涨价后的价格
    finalPriceChange(i) {
      const add_price = this.form.item[i].final_price - this.form.item[i].initial_price;
      this.$set(this.form.item[i], "add_price", add_price)
    },
    // 全部涨价
    allAddPrice(value) {
      const list = this.form.item;

      list.forEach((item, i) => {
        this.$set(item, "add_price", this.addPrices);
        this.addPriceChange(i)
      })
    },
    // 取消当前商品的涨价?
    delActivity(i) {
      this.form.item.splice(i, 1);
    },
    //批量选择商品
    goodsSelect(val) {
      this.currentGoods = val;
    },
    // 批量选择已选商品
    activityGoodsSelect(val) {
      console.log(val)
      this.currentActivityGoods = val;
    },
    // 取消选择商品
    cancelGoods() {
      this.alertShow = false;
    },
    // 批量取消已经选择的商品
    allCancelGoods() {
      const cancelList = this.currentActivityGoods;
      const list = this.form.item;
      cancelList.forEach(cancelItem => {
        list.forEach((item, index) => {
          if (item.item_id === cancelItem.item_id) {
            list.splice(index, 1);
          }
        })
      })
    },
    // 编辑查看时获取活动规则
    getRuleList() {
      const data = {
        rule_id: this.form.rule_id,
        page_no: 1,
        page_size: 10
      }
      getRuleList(data).then(res => {
        if (res.code == 200) {
          console.log(res)
          this.form = res.result.rows[0];
        }
      })
    },



    // 保存规则
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveLoading = true;
          if (this.form.rule_id) {
            editSaveRule(this.form).then(res => {
              if (res.code == 200) {
                this.cancel()
              }
              console.log(res)
              this.saveLoading = false;

            })
          } else {
            saveRule(this.form).then(res => {
              if (res.code == 200) {
                this.cancel()
              }
              console.log(res)
              this.saveLoading = false;

            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 取消
    cancel() {
      this.$router.push({ path: `../index` })
    },






  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0 0 20px;
  .demo-form-inline {
    padding: 10px;
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
.alert-content-wrap {
  padding: 30px 20px;
}
.wrap-title {
  color: #606266;
  font-size: 14px;
  font-weight: 700;
}
</style>
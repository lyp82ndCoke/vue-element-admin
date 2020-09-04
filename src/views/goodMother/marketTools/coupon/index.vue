<template>
  <div class="app-container">
    <el-row>
      <el-col
        :span="24"
        class="table-wrap"
      >
        <el-row>
          <el-col :span="24">
            <el-col :span="3">
              <el-button
                size="small"
                type="primary"
                @click="editRule(0)"
              >新建优惠券</el-button>
            </el-col>
            <el-col :span="4">
              <el-select
                size="mini"
                v-model="data.status_code"
                @change="change"
                placeholder="quanbu"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-input
                size="mini"
                placeholder="请输入优惠券名称"
                clearable
                prefix-icon="el-icon-search"
                v-model="data.card_name"
                @keyup.native.enter="change"
                @clear="change"
              ></el-input>
            </el-col>
            <el-col
              :span="2"
              class="success-btn"
            >
              <el-button
                type="success"
                @click="change"
                icon="el-icon-search"
                size="mini"
              >搜索</el-button>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="24"
            class="title-header"
          >
            <el-table
              :data="list"
              element-loading-text="Loading"
              border
              fit
              size="mini"
              highlight-current-row
              align="middle"
            >
              <el-table-column
                label="优惠券名称"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col :span="24">{{ scope.row.card_name }}</el-col>
                </template>
              </el-table-column>

              <el-table-column
                label="优惠券ID"
                align="center"
                width="150"
              >
                <template slot-scope="scope">
                  <el-col :span="24">{{ scope.row.card_id }}</el-col>
                </template>
              </el-table-column>

              <el-table-column
                width="200"
                label="类型"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col :span="24">
                    <span v-if="scope.row.exchange_rule == 1">直接兑换</span>
                    <span v-else-if="scope.row.exchange_rule == 2">另付金额</span>
                    <span v-else>满减</span>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="优惠内容(元)"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col
                    :span="24"
                    v-if="scope.row.is_at_least == 1"
                  >满{{scope.row.at_least/100}}，减{{scope.row.card_value/100}}</el-col>
                  <el-col
                    :span="24"
                    v-else
                  >无门槛，减{{scope.row.card_value/100}}</el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col
                    :span="24"
                    v-if="scope.row.status_code == 1"
                  >进行中</el-col>
                  <el-col
                    :span="24"
                    v-else-if="scope.row.status_code == 2"
                  >已结束</el-col>
                  <el-col
                    :span="24"
                    v-if="scope.row.status_code == 3"
                  >已失效</el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="已领取/剩余"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    @click="goReceive(scope.row.card_code)"
                  >{{scope.row.sold_num}}/{{scope.row.card_quantity - scope.row.sold_num > 0 ? scope.row.card_quantity - scope.row.sold_num : 0}}</el-button>
                  <!-- <el-col :span="24">{{scope.row.sold_num}}/{{scope.row.card_quantity - scope.row.sold_num > 0 ? scope.row.card_quantity - scope.row.sold_num : 0}}</el-col> -->
                </template>
              </el-table-column>
              <el-table-column
                label="已使用"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col :span="24">{{scope.row.used_num}}</el-col>
                </template>
              </el-table-column>

              <el-table-column
                label="创建时间"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col :span="24">{{scope.row.add_time}}</el-col>
                </template>
              </el-table-column>

              <el-table-column
                label="备注"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col :span="24">{{scope.row.remarks}}</el-col>
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                align="center"
                width="200"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    v-if="scope.row.status_code&&(scope.row.status_code==1)"
                    @click="editRule(scope.row.card_code)"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="text"
                    @click="couponPromotion(scope.row.card_code, scope.row.is_at_least, scope.row.at_least, scope.row.card_value)"
                  >推广</el-button>
                  <el-button
                    size="small"
                    type="text"
                    @click="updateCardStatus(scope.row.card_code,scope.row.eff_flag)"
                    v-if="scope.row.status_code&&(scope.row.status_code==1)"
                  >使失效</el-button>
                  <el-button
                    v-else
                    size="small"
                    type="text"
                    @click="viewRule(scope.row.card_code)"
                  >查看</el-button>
                  <el-button
                    size="small"
                    type="text"
                    @click="copyRule(scope.row.card_code)"
                  >复制</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              class="pagination"
              v-show="total>0"
              :total="total"
              :page.sync="data.page_no"
              :limit.sync="data.page_size"
              v-on:pagination="getItemList"
            />
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 推广链接弹框 -->
    <div
      :span="24"
      class="alert-wrap"
      v-if='popularize'
      @click.self="hiddenWrap"
    >
      <el-col :span="24" class="alert-content-wrap" style="padding: 40px;">
        <el-row>
          <el-col
            :span="2"
            class="wrap-title"
          >推广链接：</el-col>
          <el-col :span="16">{{codeUrl}}</el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col :span="4">
            <el-button
              size="mini"
              type="primary"
              :data-clipboard-text="`${codeUrl}`"
              @click="copyActivity"
              class="activity-url"
            >复制链接地址</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top: 40px;">
          <el-col :span="10">
            <el-col
              :span="5"
              class="wrap-title"
            >推广二维码：</el-col>
            <div id="qrCode">
              <div id='code'></div>
              <canvas
                id="canvas"
                ref="canvas"
              ></canvas>
            </div>
          </el-col>

          <el-col :span="12" v-if="promocard_poster">
            <el-col
              :span="3"
              class="wrap-title"
            >推广海报：</el-col>
            <img :src="promocard_poster" alt="" width="300">
          </el-col>
        </el-row>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getPromoList, updateCardStatus, promocardCreateQr } from '@/api/giftCard'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Base64 from 'js-base64'
import QRCode from 'qrcode'
import Clipboard from 'clipboard'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      codeUrl: "",
      data: {
        card_name: "",
        status_code: "",
        page_no: 1,
        page_size: 10
      },
      list: [],
      total: 0,
      options: [
        {
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '进行中'
        }, {
          value: '2',
          label: '已结束'
        }, {
          value: '3',
          label: '已失效'
        }
      ],
      popularize: false,
      promocard_poster: ''
    }
  },
  created() {
    this.getItemList();
  },
  methods: {
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
    // 转换优惠券推广连接
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
    change() {
      this.data.page_no = 1;
      this.getItemList()
    },
    //获取优惠券列表
    getItemList() {
      getPromoList(this.data).then(res => {
        if (res.code == 200) {
          this.list = res.result.rows;
          this.total = res.result.total;
        }
      })
    },
    // 使失效
    updateCardStatus(card_code, status) {
      console.log(card_code,status)
      const data = {
        card_code,
        status: status==1?0:1
      }
      updateCardStatus(data).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getItemList();
        }
      })
    },
    couponPromotion(card_code, is_at_least, at_least, card_value) {
      this.popularize = true;
      this.card_code = card_code; //推广商品的id
      const dataBase = {
        channel: null
      }
      let base = Base64.Base64.encode(JSON.stringify(dataBase));
      // https://xdata.zmedc.com/zmshoptest/#/giftCards?item_id=496845255
      this.codeUrl = `${process.env.MOTHER_API}/#/getCoupon/${card_code}?param=${base}`;
      this.useqrcode(this.codeUrl);
      const text1 = card_value>0? card_value/100 : 0;
      let at_least_i = at_least>0 ? at_least/100 : 0;
      let card_value_i = card_value>0 ? card_value/100 : 0;
      const text2 = is_at_least == 1 ? `满${at_least_i}，减${card_value_i}` : `无门槛，减${card_value_i}`;
      if(this.codeUrl){
        this.promocardCreateQr(card_code,this.codeUrl,text1,text2);
      }
    },
    // 生成优惠券海报
    promocardCreateQr(card_code,qr_url,text1,text2){
      const createParams = {
        card_code,
        channel:1,
        qr_url,
        text1,
        text2
      }
      promocardCreateQr(createParams).then(res => {
        if(res.code == 200){
          this.promocard_poster = res.result;
        }
      })
    },
    hiddenWrap() {
      this.popularize = false;
    },
    // 编辑
    editRule(card_code) {
      this.$router.push({ path: `./news/${card_code}` })
    },
    // 查看
    viewRule(card_code) {
      this.$router.push({ path: `./news/${card_code}?view=1` })
    },
    //复制
    copyRule(card_code) {
      this.$router.push({ path: './news/0', query: { card_code } })
    },
    //领取明细
    goReceive(card_code) {
      this.$router.push({ path: `./receive/${card_code}` })
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
.wrap-title {
  color: #606266;
  font-size: 14px;
  font-weight: 700;
}
</style>


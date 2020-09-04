<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="使用中" name="first">
          <el-col :span="24" class="title-header">
            <el-col :span="3">
              <el-button size="small" type="primary" @click="newGiftCard(0)">新建礼品卡</el-button>
            </el-col>

            <el-col :span="5">
              <el-input
                size="small"
                placeholder="请输入礼品卡名称"
                clearable
                prefix-icon="el-icon-search"
                v-model="data.item_name"
              ></el-input>
            </el-col>
            <el-col :span="2" class="success-btn">
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
            <el-table-column label="礼品卡名称" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.item_name }}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="使用规则" align="center">
              <template slot-scope="scope">
                <el-col :span="24" v-if="scope.row.exchange_rule == 1">直接兑换</el-col>
                <el-col :span="24" v-else-if="scope.row.exchange_rule == 2">付费{{scope.row.additional_fee}}分</el-col>
              </template>
            </el-table-column>
            <el-table-column label="购卡最晚赠送时间" align="center">
              <template slot-scope="scope">
                <el-col :span="24">购卡后{{ scope.row.give_days }}天</el-col>
              </template>
            </el-table-column>
            <el-table-column label="领卡最晚使用时间" align="center">
              <template slot-scope="scope">
                <el-col :span="24">领卡后{{ scope.row.use_days }}天</el-col>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="230"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button 
                  size="small" 
                  type="text" 
                  @click="ticketCard(scope.row.item_id)"
                  >领卡记录</el-button>
                <el-button
                  size="small"
                  type="text"
                  @click="purchaseCard(scope.row.item_id)"
                >购卡记录</el-button>
                <el-button
                  size="small"
                  type="text"
                  @click="newGiftCard(scope.row.item_id)"
                >编辑</el-button>
                <el-button size="mini" type="text" @click="extensionGoods(scope.row.item_id)">推广</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            class="pagination"
            v-show="caseTotal>0"
            :total="caseTotal"
            :page.sync="data.page_no"
            :limit.sync="data.page_size"
            v-on:pagination="getItemList"
          />
        </el-tab-pane>
        <el-tab-pane label="已禁用" name="second">
          <el-col :span="24" class="title-header">
            <el-col :span="3">
              <el-button size="small" type="primary" @click="newGiftCard(0)">新建礼品卡</el-button>
            </el-col>

            <el-col :span="5">
              <el-input
                size="small"
                placeholder="请输入礼品卡名称"
                clearable
                prefix-icon="el-icon-search"
                v-model="dataCase.item_name"
              ></el-input>
            </el-col>
            <el-col :span="2" class="success-btn">
              <el-button
                type="success"
                @click="searchGifts"
                icon="el-icon-search"
                size="small"
              >搜索</el-button>
            </el-col>
          </el-col>
          <el-table
            :height="caseHeightCom"
            v-loading="caseLoadingCom"
            :data="caseListCom"
            element-loading-text="Loading"
            border
            fit
            size="mini"
            highlight-current-row
            align="middle">
            <el-table-column label="礼品卡名称" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.item_name }}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="使用规则" align="center">
              <template slot-scope="scope">
                <el-col :span="24" v-if="scope.row.exchange_rule == 1">直接兑换</el-col>
                <el-col :span="24" v-else-if="scope.row.exchange_rule == 2">付费{{scope.row.additional_fee}}分</el-col>
              </template>
            </el-table-column>
            <el-table-column label="购卡最晚赠送时间" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.effective_date2 }}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="领卡最晚使用时间" align="center">
              <template slot-scope="scope">
                <el-col :span="24">{{ scope.row.invalid_date2 }}</el-col>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="230"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button 
                  size="small" 
                  type="text" 
                  @click="ticketCard(scope.row.item_id)"
                  >领卡记录</el-button>
                <el-button
                  size="small"
                  type="text"
                  @click="purchaseCard(scope.row.item_id)"
                >购卡记录</el-button>
                <el-button
                  size="small"
                  type="text"
                  @click="newGiftCard(scope.row.item_id)"
                >编辑</el-button>
                <el-button size="mini" type="text" @click="extensionGoods(scope.row.item_id)">推广</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            class="pagination"
            v-show="caseTotalCom>0"
            :total="caseTotalCom"
            :page.sync="dataCase.page_no"
            :limit.sync="dataCase.page_size"
            v-on:pagination="getDisabledList"
          />
        </el-tab-pane>
      </el-tabs>
    </el-col>
    
    <!-- 推广链接弹框 -->
    <div :span="24" class="alert-wrap" v-if='popularize' @click.self="hiddenWrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-row>
          <el-col :span="2" class="wrap-title">推广链接：</el-col>
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
          <el-col :span="3" class="wrap-title">推广二维码：</el-col>
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
import Clipboard from 'clipboard'
import QRCode from 'qrcode'
import Base64 from 'js-base64'
import { getItemList } from '@/api/giftCard'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Pagination, Sticky, QRCode },
  data() {
    return {
      data: {
        item_name: "",
        item_type: "",
        status: 1,
        page_no: 1,
        page_size: 10
      },
      dataCase: {
        item_name: "",
        item_type: "",
        status: 2,
        page_no: 1,
        page_size: 10
      },
      caseAlertDetail: false,
      case_detail: {},
      options: [],
      type: 3, 
      revise: false,
      activeName: 'first',
      // 使用中
      caseHeight: null,
      caseLoading: false,
      caseList: [],
      caseTotal: 0,
      // 已禁用
      caseHeightCom: null,
      caseLoadingCom: false,
      caseListCom: [],
      caseTotalCom: 0,

      formRevise: {
        case_id: null,
        opinion_content: "",
      },
      content: [],//历史审核记录
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page_num: 1,
        page_size: 10,
      },
      form: {
        camp_ids: [],
        themeArr: [[]],
        question_class_id: "",
        question: "",
        answer_content: "",
        relation_id: [],
        answer_id: "",
        question_id: ""
      },
      formAnswer: {
        question: "",
        answer_content: ""
      },
      rulesAnswer: {
        question: [
          {
            required: true, message: '请输入问题场景', trigger: 'blur'
          }
        ],
        answer_content: [
          {
            required: true, message: '请输入如何解决', trigger: 'blur'
          }
        ]
      },
      rules: {
        question_class_id: [
          {
            required: true, message: '请选择问题属性', trigger: 'change,blur'
          }
        ],
        question: [
          {
            required: true, message: '请输入问题场景', trigger: 'blur'
          }
        ],
        answer_content: [
          {
            required: true, message: '请输入如何解决', trigger: 'blur'
          }
        ]
      },
      rulesRevise: {
        opinion_content: [
          {
            required: true, message: '请输入修订意见', trigger: 'blur'
          }
        ]
      },
      question_id: null,
      opinions: [], //采纳编辑 alert 历史审核记录
      historyAnswer: [],
      answer_id: null, //采纳提交 的 问答id
      problemList: [],
      problemHeight: null,
      problemLoading: false,
      informationHeight: null,
      informationList: [],
      informationLoading: false,
      themeProps: { value: 'label_id', label: 'title', children: 'children' },
      optionsTheme: [],
      type: 1,
      goods_id: null,
      popularize: false,
      MOTHER_API: "",
      codeUrl: ""
    }
  },
  created() {
    // this.getCaseList();
    this.getItemList();

    this.MOTHER_API = process.env.MOTHER_API;
    console.log(this.MOTHER_API,'123')
  },
  methods: {
    //使用中列表
    getItemList(){
      getItemList(this.data).then(res => {
        if(res.code == 200){
          this.caseList  = res.result.rows;
          this.caseTotal = res.result.total;
        }
      })
    },
    //已禁用列表
    getDisabledList(){
      getItemList(this.dataCase).then(res => {
        if(res.code == 200){
          this.caseListCom  = res.result.rows;
          this.caseTotalCom = res.result.total;
        }
      })
    },
    //礼品卡 新建 编辑
    newGiftCard(id){
      this.$router.push({ path: `./news/${id}` })
    },
    //领卡记录
    ticketCard(item_id){
      this.$router.push({ path: `./ticket`, query:{item_id}})
    },
    // 购卡记录
    purchaseCard(item_id) {
      this.$router.push({ path: `./purch`, query:{item_id} })
    },   
    handleClick(tab, event) {
      if(this.activeName === 'first'){
        this.data.page_no = 1;
        this.data.item_name = '';
        this.getItemList();
      } else if(this.activeName === 'second'){
        this.dataCase.page_no = 1;
        this.dataCase.item_name = '';
        this.getDisabledList();
      }
    },
    searchGoods() {
      this.data.page_no = 1;
      this.getItemList();
    },
    searchGifts(){
      this.dataCase.page_no = 1;
      this.getDisabledList();
    },
    hiddenCaseDetail() {
      this.caseAlertDetail = false;
    },
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
    extensionGoods(item_id) {
      this.popularize = true;
      this.goods_id = item_id; //推广商品的id
      const dataBase = {
        item_id: item_id,
        channel: 2
      }
      let base = Base64.Base64.encode(JSON.stringify(dataBase));
      // https://xdata.zmedc.com/zmshoptest/#/giftCards?item_id=496845255
      this.codeUrl = `${this.MOTHER_API}/#/giftcard?param=${base}`;
      this.useqrcode(this.codeUrl);
    },
    hiddenWrap(){
      this.popularize = false;
    },
    useqrcode(url){
      var canvas;
      this.$nextTick(()=>{
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
.wrap-title{
  color: #606266;    
  font-size: 14px;
  font-weight: 700;
}
</style>


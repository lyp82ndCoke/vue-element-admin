<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">新建/编辑签到</el-col>
    </sticky>
    <el-col :span="24" class="newaddend_container">
      <el-col :span="24" class="newaddend_container_header">
        <p>
          <span @click="active1()">第一步编辑签到基本信息</span>
          <span @click="active2()">第二步编辑签到题</span>
        </p>
      </el-col>
      <!-- 签到基础信息 -->
      <el-col :span="24" class="newaddend_content1" v-if="active == 1">
        <h5>签到基础信息</h5>
        <el-form ref="signInfo" :model="signInfo" :rules="rules" class="form-wrap" label-width="140px">
          <el-form-item label="签到名称：" prop="sign_name">
            <el-col :span="10">
              <el-input size="small" v-model="signInfo.sign_name" placeholder="请输入签到名称" />
            </el-col>
          </el-form-item>
          <el-form-item label="签到时间：" prop="sign_start_time">
            <el-col :span="10">
              <el-date-picker v-model="signInfo.sign_start_time" value-format="yyyy-MM-dd" type="daterange"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small"
                :disabled="timeDisabled" @change="timeFormat()" :picker-options="pickerOptions"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="是否提示：" prop="is_tips">
            <el-col :span="5">
              <el-radio v-model="signInfo.is_tips" label="2">否</el-radio>
              <el-radio v-model="signInfo.is_tips" label="1">是</el-radio>
            </el-col>
            <el-col :span="11" v-if="signInfo.is_tips == '1'">
              <el-input size="small" type="textarea" v-model="signInfo.tips_content" placeholder="请输入提示内容" />
            </el-col>
          </el-form-item>
          <el-form-item label="签到说明：" prop="sign_explain">
            <el-col :span="10">
              <el-input size="small" :rows="4" type="textarea" v-model="signInfo.sign_explain" placeholder="请输入签到说明" />
            </el-col>
          </el-form-item>
        </el-form>
        <h5>签到权益</h5>
        <el-form ref="form" :model="rewardInfo" class="form-wrap" label-width="140px">
          <el-form-item label="签到类型：">
            <el-col :span="10">
              <el-radio v-model="signInfo.sign_type" label="1" :disabled="timeDisabled">连续签到</el-radio>
              <el-radio v-model="signInfo.sign_type" label="2" :disabled="timeDisabled">累计签到</el-radio>
            </el-col>
          </el-form-item>
          <el-form-item label="是否返优惠券：">
            <el-col :span="10">
              <el-radio v-model="rewardInfo.is_back_coupon" label="2" :disabled="timeDisabled">否</el-radio>
              <el-radio v-model="rewardInfo.is_back_coupon" label="1" :disabled="timeDisabled">是</el-radio>
            </el-col>
          </el-form-item>
          <el-form-item label="选择优惠券：" v-if="rewardInfo.is_back_coupon == '1'">
            <el-col :span="14">
              <el-col :span="6.5">
                <el-input-number v-model="continuity_day" @change="handleChange" :min="1" :max="selecteDays.length" :disabled="timeDisabled"
                label="描述文字" size="mini"></el-input-number>
              </el-col>
              <el-col :span="7.5">
                <el-select v-model="couponType" size="mini" @change="changeType" :disabled="timeDisabled">
                  <el-option
                    v-for="item in options3" 
                    :key="item.index" 
                    :label="item.label" 
                    placeholder="请选择优惠券类型"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-select v-model="couponValue" filterable remote size='mini' reserve-keyword placeholder="选择或搜索优惠券名称"
                  :remote-method="remoteMethod" :loading="loading" :disabled="timeDisabled">
                  <el-option size='mini' v-for="item in options2" :key="item.index" :label="item.title"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="saveData1()" size="mini">确定</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="已选择优惠券：" v-if="rewardInfo.is_back_coupon == '1'">
            <el-col :span="10">
              <ul>
                <li v-for="(item,index) in couponList" :key="item.index">
                  <em> {{ item.coupon_type == '1'? '    有赞 ' : 'H5商城'}}优惠券 </em>
                  连续签到 {{ item.continuity_day }} 天 - 获得{{ item.coupon_name }}&nbsp;
                  <!-- <b v-if="item.limit!=0 && item.coupon_type == '2'"> 满{{item.limit}}元 &nbsp;</b><b v-if="item.amount && item.coupon_type == '2'">减{{item.amount}}元</b> -->
                  {{(Number(item.coupon_threshold))>0 ? '满'+item.coupon_threshold+'元 减'+item.amount+'元' :item.amount +'元无门槛优惠券'}}
                  <i class="el-icon-circle-close" @click.stop="delGoodsItem1(index)"></i>
                  
                  
                </li>
              </ul>
            </el-col>
          </el-form-item>
          <el-form-item label="是否返现：" v-if="signInfo.sign_type == '1'">
            <el-col :span="10">
              <el-radio v-model="rewardInfo.is_back_money" label="2" :disabled="timeDisabled">否</el-radio>
              <el-radio v-model="rewardInfo.is_back_money" label="1" @change="timeFormat()" :disabled="timeDisabled">
                是(连续签到28天且亮星)
              </el-radio>
              <!-- <el-radio v-model="rewardInfo.is_back_money" label="1" @change="timeFormat()" :disabled="timeDisabled">
                (连续签到28天且亮星)
              </el-radio> -->
            </el-col>
          </el-form-item>
          <!-- <el-form-item label="选择返押金：" v-if="rewardInfo.is_back_money == '1'">
            <el-col :span="10">
              <el-col :span="12">
                <el-select v-model="value3" placeholder="请选择" size="mini" :disabled="timeDisabled">
                  <el-option v-for="n in selecteDays.length" :key="n.index" :label="'第'+n+'天'" :value="n"></el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-input size="small" v-model="amount" placeholder="请输入返还金额" :disabled="timeDisabled" />
              </el-col>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="saveData2()" size="small">确定</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="已选择返押金：" v-if="rewardInfo.is_back_money == '1'">
            <el-col :span="10">
              <ul style="width: 165px;">
                <li v-for="(item,index) in sortDays3(moneyList)" :key="item.index">
                  <span>第{{ item.continuity_day }}天 - {{ item.amount }}元</span>
                  <i class="el-icon-circle-close" @click.stop="delGoodsItem2(index)"></i>
                </li>
              </ul>
            </el-col>
          </el-form-item> -->
        </el-form>
        <!-- 关联优惠券 -->
        <!-- <el-dialog title="关联优惠券" :visible.sync="dialogFormVisible2" width="40%">
          <el-form :model="form">
            <el-form-item label="优惠券链接" :label-width="formLabelWidth">
              <el-input v-model="form.url" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible2 = false" size="small">取 消</el-button>
            <el-button type="primary" @click="checkUrl()" size="small">确 定</el-button>
          </div>
        </el-dialog> -->

        <el-col :span="24" align="center">
          <el-button size="small" @click="cancelSubmit">取 消</el-button>
          <el-button size="small" type="primary" @click="submitForm('signInfo')">保 存</el-button>
        </el-col>
      </el-col>

      <!-- 编辑签到题 -->
      <el-col :span="24" class="newaddend_content2" v-else>
        <el-col :span="24" style="margin:-20px 0 10px 0;">
          <!-- <el-col :span="5">{{sign_name}} 签到题</el-col> -->
          <!-- <el-col :span="4">
            <el-select v-model="value" placeholder="请选择日期" size="mini" @change="selectedDay">
              <el-option
                v-for="item in sortDays(selecteDays2)"
                :key="item.index"
                :label="item.day"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col> -->
          <el-col :span="2">
            <el-button @click="newQuestion()" size="mini" class="positionFixed" type="success">新增题目</el-button>
          </el-col>
        </el-col>

        <el-col :span="24" style="margin-bottom: 30px;">
          <!-- 题目列表 -->
          <div v-for="(item,index1) in sortDays2(questionAnswerList)" :key="index1">
            <template v-if="item.questionAnswerList.length">
              <h4>日期：{{ item.timeInfo.time }} - 第{{index1+1}}天</h4>
              <el-form ref="item.name" :model="item" class="form-wrap" label-width="55px"
                v-for="(goods,index2) in item.questionAnswerList" :key="goods.index">
                <el-form-item :label="'题目'+(index2+1)+':'" align="left">
                  <el-col :span="10">
                    <span>{{ goods.questionInfo.question_content }}</span>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" @click="copyQuestion(index1,index2)" size="mini">复制此题</el-button>
                    <el-button type="primary" @click="editQuestion(index1,index2)" size="mini"
                      :disabled="item.timeInfo.is_can_edit == '2'">编辑此题</el-button>
                    <el-button type="primary" @click="delQuestion(index1,index2)" size="mini"
                      :disabled="item.timeInfo.is_can_edit == '2'">删除此题</el-button>
                  </el-col>
                </el-form-item>
                <el-form-item label="选项:" align="left">
                  <el-col :span="16" class="answerList">
                    <template>
                      <span v-for="answer in sortOptions(goods.answerList)" :key="answer.index"
                        style="margin-right:12px;">{{answer.option_type +'. '+ answer.answer_content + (answer.is_true_answer == '1' ? '（正确答案）' : '')}}</span>
                    </template>
                  </el-col>
                </el-form-item>
              </el-form>
            </template>
          </div>

          <!-- 新增/编辑问题 -->
          <el-dialog title="新增/编辑问题" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="editform">
              <el-form-item label="*选择日期" :label-width="formLabelWidth">
                <el-col :span="7">
                  <el-select v-model="question_time" placeholder="请选择日期" size="mini" @change="selectDate">
                    <el-option v-for="item in selecteDays" :key="item.index" :label="item.day" :value="item.day">
                    </el-option>
                  </el-select>
                </el-col>
              </el-form-item>

              <el-form-item label="*题目" :label-width="formLabelWidth">
                <el-col :span="16">
                  <el-input size="small" type="textarea" :rows="2" placeholder="请输入题目" v-model="editform.questionInfo.question_content">
                  </el-input>
                </el-col>
                <el-col :span="4" :offset="1">
                  <el-button @click="addAnswer()" size="mini" type="primary" :disabled="editform.answerList.length > 6">
                    添加选项</el-button>
                </el-col>
              </el-form-item>

              <el-form-item label="*选项A" :label-width="formLabelWidth">
                <el-col :span="16">
                  <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[0].answer_content">
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <i class="el-icon-delete" @click="delAnswer(0)"></i>
                  <el-checkbox v-model="editform.answerList[0].is_true_answer">正确答案</el-checkbox>
                </el-col>
              </el-form-item>
              <el-form-item label="*选项B" :label-width="formLabelWidth">
                <el-col :span="16">
                  <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[1].answer_content">
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <i class="el-icon-delete" @click="delAnswer(1)"></i>
                  <el-checkbox v-model="editform.answerList[1].is_true_answer">正确答案</el-checkbox>
                </el-col>
              </el-form-item>
              <el-form-item label="*选项C" :label-width="formLabelWidth" v-if="editform.answerList.length > 2">
                <el-col :span="16">
                  <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[2].answer_content">
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <i class="el-icon-delete" @click="delAnswer(2)"></i>
                  <el-checkbox v-model="editform.answerList[2].is_true_answer">正确答案</el-checkbox>
                </el-col>
              </el-form-item>
              <el-form-item label="*选项D" :label-width="formLabelWidth" v-if="editform.answerList.length > 3">
                <el-col :span="16">
                  <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[3].answer_content">
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <i class="el-icon-delete" @click="delAnswer(3)"></i>
                  <el-checkbox v-model="editform.answerList[3].is_true_answer">正确答案</el-checkbox>
                </el-col>
              </el-form-item>
              <el-form-item label="*选项E" :label-width="formLabelWidth" v-if="editform.answerList.length > 4">
                <el-col :span="16">
                  <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[4].answer_content">
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <i class="el-icon-delete" @click="delAnswer(4)"></i>
                  <el-checkbox v-model="editform.answerList[4].is_true_answer">正确答案</el-checkbox>
                </el-col>
              </el-form-item>
              <el-form-item label="*选项F" :label-width="formLabelWidth" v-if="editform.answerList.length > 5">
                <el-col :span="16">
                  <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[5].answer_content">
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <i class="el-icon-delete" @click="delAnswer(5)"></i>
                  <el-checkbox v-model="editform.answerList[5].is_true_answer">正确答案</el-checkbox>
                </el-col>
              </el-form-item>
              <el-form-item label="*选项G" :label-width="formLabelWidth" v-if="editform.answerList.length > 6">
                <el-col :span="16">
                  <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[6].answer_content">
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <i class="el-icon-delete" @click="delAnswer(6)"></i>
                  <el-checkbox v-model="editform.answerList[6].is_true_answer">正确答案</el-checkbox>
                </el-col>
              </el-form-item>
              <!-- <el-form-item label="选项H" :label-width="formLabelWidth" v-if="editform.answerList.length > 7">
                <el-col :span="16">
                  <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[7].answer_content" ></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button @click="delAnswer()" size="mini" type="info">删除选项</el-button>
                </el-col>
              </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelSubject()" size="small">取 消</el-button>
              <el-button type="primary" @click="addSubject()" size="small">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 复制此题 -->
          <el-dialog title="复制此题" :visible.sync="dialogFormVisible3" width="40%">
            <el-form :model="form">
              <el-form-item label="复制此题到" :label-width="formLabelWidth">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                </el-checkbox>
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" id="checkboxList">
                  <el-checkbox v-for="city in cities" :label="city" :key="city.index"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible3 = false">取 消</el-button>
              <el-button type="primary" @click="submitCopy()">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
        <div class="bottomButtonContainer">
          <el-col :span="24" class="bottomButton">
            <el-button size="small" @click="cancelSubmit">取 消</el-button>
            <el-button size="small" type="primary" @click="onSubmit">提 交</el-button>
          </el-col>
        </div>
      </el-col>
    </el-col>
  </div>
</template>

<script>
import { getSign, insertSign, updateSign, updateQuestionList, getQuestionList, getAllQuestionBySignId, getSignTimeList } from "@/api/growthCamp";
import { getPromoList } from '@/api/giftCard';
import { getCouponList } from "@/api/group";
import Pagination from "@/components/Pagination";
import Sticky from "@/components/Sticky";
import Request from "@/utils/request";
export default {
  components: { Sticky },
  data() {
    return {
      height: null,
      listLoading: true,
      options1: [],
      options2: [],
      options3: [
        {
          value: '1',
          label: '有赞平台优惠券'
        },
        {
          value: '2',
          label: 'H5商城平台优惠券'
        },
      ],
      fileList: [],
      active: 1,
      value1: '',
      value2: '',
      couponValue: '',
      couponType: '1',
      value3: '',
      value: '',
      radio: '1',
      pickerOptions: {
        disabledDate(time) {
          // return time.getTime() < Date.now();
          let startTime = sessionStorage.getItem('camp_times_start_time');
          let endTime = sessionStorage.getItem('camp_times_end_time');
          function getNextDate(date, day) { 
          　　var dd = new Date(date);
          　　dd.setDate(dd.getDate() + day);
          　　var y = dd.getFullYear();
          　　var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
          　　var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
          　　return y + "-" + m + "-" + d;
          };
          if(new Date() > new Date(startTime)){
            startTime = getNextDate(new Date(),-1);
          }else{
            startTime = getNextDate(startTime,-1);
          }
          return time.getTime() <= new Date(startTime).getTime() || time.getTime() > new Date(endTime).getTime();
        },
      },
      signInfo: {
        "sign_name": "",
        "sign_start_time": "",
        "sign_end_time": "",
        "sign_explain": "",
        "sign_type": "1",
        "is_tips": "2",
        "tips_content": "",
        "camp_id":'',
        'camp_times_id':''
      },
      rewardInfo: {
        "is_back_coupon": "2",
        "is_back_money": "2",
        "rewardList": []
      },
      rules: {
        sign_name: [
          { required: true, message: '请输入签到名称', trigger: 'blur' },
        ],
        sign_explain: [
          { required: true, message: '请输入签到说明', trigger: 'blur' },
        ],
        sign_start_time: [
          { required: true, message: '请选择签到时间', trigger: 'focus' },
        ],
        is_tips: [
          { required: true, message: '请选择是否提示', trigger: 'blur' },
        ],
      },
      couponList: [],
      moneyList: [],
      amount: '',
      selecteDays: [],
      selecteDays2: [
        {
          day: '全部时间',
          value: ''
        }
      ],
      questionList: [],
      checkList1: [],
      checkList2: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      formLabelWidth: '100px',
      trueAnswer: '',
      rightAnswers: [],
      questionAnswerList: [],
      dateList: [],
      form: {
        url: ''
      },
      editform: {
        "questionInfo": {
          "question_time": "",
          "question_content": "",
        },
        "answerList": [
          {
            "answer_content": "",
            "option_type": "A",
            "option_sort": "1",
            "is_true_answer": false
          },
          {
            "answer_content": "",
            "option_type": "B",
            "option_sort": "2",
            "is_true_answer": false
          }
        ]
      },
      num: 1,
      currentIndex: 999,
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: true,
      checked: false,
      targetDayList: [],
      question_time: '',
      Index1: '',
      Index2: '',
      timeDisabled: false,
      continuity_day: 1,
      input: "",
      restaurants: [],
      coupon: '',
      list: [],
      loading: false,
      data: {
        card_name: "",
        status_code: "",
        page_no: 1,
        page_size: 10
      }
    };
  },
  created() {
    this.active = sessionStorage.getItem('itemBank') == 2 ? 2 : 1;
    this.getCouponList();
    if (this.$route.params.Addendid.indexOf('_') > 0) {
      //新建签到基本信息
      this.signInfo.camp_id = this.$route.params.Addendid.split('_')[0];
      this.signInfo.camp_times_id = this.$route.params.Addendid.split('_')[1];
    } else {
      this.signInfo.sign_id = this.$route.params.Addendid;
      //获取编辑签到基本信息
      getSign({ sign_id: this.$route.params.Addendid, }).then(res => {
        this.signInfo.sign_name = res.result.signInfo.sign_name;
        this.signInfo.sign_start_time = [res.result.signInfo.sign_start_time, res.result.signInfo.sign_end_time];
        this.signInfo.tips_content = res.result.signInfo.tips_content;
        this.signInfo.sign_explain = res.result.signInfo.sign_explain;
        this.signInfo.camp_id = res.result.signInfo.camp_id;
        this.signInfo.camp_times_id = res.result.signInfo.camp_times_id;
        this.signInfo.is_tips = res.result.signInfo.is_tips;
        this.signInfo.sign_type = res.result.signInfo.sign_type;
        this.rewardInfo.is_back_coupon = res.result.signInfo.is_back_coupon;
        this.rewardInfo.is_back_money = res.result.signInfo.is_back_money;
        this.couponList = res.result.couponRewardList;
        this.moneyList = res.result.moneyRewardList;
        // this.sign_name = res.result.signInfo.sign_name;
        this.timeFormat();
      });
      this.getQuestionList();
      this.getSignTimeList();
    }
  },
  computed: {
    computedData: function () {
      var obj = {};
      obj = JSON.parse(JSON.stringify(this.questionAnswerList[this.Index1].questionAnswerList[this.Index2]));
      return obj
    }
  },
  methods: {
    //获取签到题目列表
    getQuestionList() {
      getAllQuestionBySignId({ search_time: this.value, sign_id: this.signInfo.sign_id, }).then(res => {
        if (res.code == 200) {
          this.questionAnswerList = res.result.list;
          this.num = res.result.list.length + 1;
          // this.couponList = res.result.couponRewardList;
          // this.moneyList = res.result.moneyRewardList;
        }
      });
    },
    getSignTimeList() {
      getSignTimeList({ sign_id: this.signInfo.sign_id, }).then(res => {
        if (res.code == 200) {
          for (let m = 0,len=res.result.signTimeList.length; m < len; m++) {
            this.selecteDays2.push(
              {
                day: res.result.signTimeList[m].sign_time,
                value: res.result.signTimeList[m].sign_time
              }
            );
          }
        }
      })
    },
    //选项升序排序
    sortOptions(arr) {
      return arr.slice().sort(function (a, b) {
        return a.option_sort - b.option_sort;
      });
    },
    //日期降序排列
    sortDays(arr) {
      return arr.slice().sort(function (a, b) {
        return a.day < b.day ? 1 : -1;
      });
    },
    //日期降序排列
    sortDays2(arr) {
      return arr.slice().sort(function (a, b) {
        return a.timeInfo.time < b.timeInfo.time ? -1 : 1;
      });
    },
    //日期降序排列
    sortDays3(arr) {
      return arr.slice().sort(function (a, b) {
        return a.continuity_day < b.continuity_day ? -1 : 1;
      });
    },
    selectedDay(v) {
      this.questionAnswerList = [];
      this.getQuestionList();
    },
    timeFormat() {
      this.timeDisabled = (getNowFormatDate() > this.signInfo.sign_start_time[0] || getNowFormatDate() == this.signInfo.sign_start_time[0]);
      let signDate = daysBetween(this.signInfo.sign_start_time[0], this.signInfo.sign_start_time[1]);
      let signEveryday = (getNowFormatDate() > this.signInfo.sign_start_time[0]) ? formatEveryDay(getNowFormatDate(), this.signInfo.sign_start_time[1]) : formatEveryDay(this.signInfo.sign_start_time[0], this.signInfo.sign_start_time[1]);
      let days = [];
      for (let x = 0; x < signDate; x++) {
        for (let y = 0; y < signEveryday.length; y++) {
          if (this.timeDisabled) {
            if (x == y && x != 0) {
              let d = {
                value: x + 1,
                day: signEveryday[y]
              }
              days.push(d)
            }
          } else {
            if (x == y) {
              let d = {
                value: x + 1,
                day: signEveryday[y]
              }
              days.push(d)
            }
          }
        }
      }
      this.selecteDays = days;

      function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      }
      function daysBetween(sDate1, sDate2) {
        var time1 = Date.parse(new Date(sDate1));
        var time2 = Date.parse(new Date(sDate2));
        var nDays = Math.abs(parseInt((time2 - time1) / 1000 / 3600 / 24)) + 1;
        return nDays;
      };
      function formatEveryDay(start, end) {
        let dateList = [];
        var startTime = getDate(start);
        var endTime = getDate(end);
        while ((endTime.getTime() - startTime.getTime()) >= 0) {
          var year = startTime.getFullYear();
          var month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1;
          var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
          dateList.push(year + "-" + month + "-" + day);
          startTime.setDate(startTime.getDate() + 1);
        }
        return dateList;
      }
      function getDate(datestr) {
        var temp = datestr.split("-");
        var date = new Date(temp[0], temp[1] - 1, temp[2]);
        return date;
      }
    },
    active1() {
      this.active = 1;
    },
    active2() {
      if(this.signInfo.sign_id){
        this.active = 2;
      }else{
        this.$message({
          message: "请先保存签到页基本信息！",
          type: "warning"
        });
      }
    },
    cancelSubmit() {
      this.$router.go(-1);
    },
    getPromoList(){
      this.options2 = [];
      getPromoList({ status_code: "",page_no: 1,page_size: 150 }).then(res => {
        if (res.code == 200) {
          res.result.rows.forEach( v => {
            this.options2.push({
              title:v.card_name,
              id: v.card_code,
              conditions: v.at_least || 0,
              denominations: v.card_value,
              coupon_type: '2',
              at_least: v.at_least || 0,

              originData:{
                card_id: v.card_id,
                card_type: v.card_type,
                card_code: v.card_code,
                card_name: v.card_name,
                card_value: v.card_value,
                card_quantity: v.card_quantity,
                sold_num: v.sold_num,
                used_num: v.used_num,
                add_time: v.add_time,
                date_type: v.date_type,
                effective_date: v.effective_date,
                invalid_date: v.invalid_date,
                description:v.description,
                remarks:v.remarks,
                is_at_least: v.is_at_least,
                quota: v.quota,
              }
            })
          })
        }
      })
    },
    getCouponList(){
      getCouponList({ kdt_id: '1655766', group_type: '9', page_no: 1, page_size: 150 }).then(res => {
        if (res.code == 200) {
          this.options2 = res.result.rows;
        }
      })
    },
    changeType(v){
      this.options2 = [];
      if(v == '1'){
        this.getCouponList();
      }else{
        this.getPromoList();
      }
    },
    //获取优惠券列表
    remoteMethod(query) {
      if (query !== '') {
        this.options2 = [];
        this.loading = true;
        if(this.couponType == '1'){
          getCouponList({ kdt_id: '1655766', group_type: '9', page_no: 1, page_size: 150,coupon_name: query }).then(res => {
            if (res.code == 200) {
              this.loading = false;
              this.options2 = res.result.rows;
            }
          })
        }else{
          getPromoList({ status_code: "",page_no: 1,page_size: 150,card_name: query }).then(res => {
            if (res.code == 200) {
              this.loading = false;
              res.result.rows.forEach( v => {
                this.options2.push({
                  title:v.card_name,
                  id: v.card_code,
                  conditions: v.at_least || 0,
                  denominations: v.card_value,
                  coupon_type: '2',
                  at_least: v.at_least || 0,
                  originData:{
                    card_id: v.card_id,
                    card_type: v.card_type,
                    card_code: v.card_code,
                    card_name: v.card_name,
                    card_value: v.card_value,
                    card_quantity: v.card_quantity,
                    sold_num: v.sold_num,
                    used_num: v.used_num,
                    add_time: v.add_time,
                    date_type: v.date_type,
                    effective_date: v.effective_date,
                    invalid_date: v.invalid_date,
                    description:v.description,
                    remarks:v.remarks,
                    is_at_least: v.is_at_least,
                    quota: v.quota,
                  }
                })
              })
            }
          })
          // this.getPromoList(query);
        }
      } else {
        this.options2 = [];
      }
    },
    saveData1() {
      let amount, id, coupon_type, title, coupon_json, coupon_threshold, bool = true;
      for (let t = 0,len=this.options2.length; t < len; t++) {
        if (this.couponValue == this.options2[t].id) {
          amount = Number(this.options2[t].denominations) / 100;
          id = this.options2[t].id;
          title = this.options2[t].title;
          coupon_json = this.options2[t].originData || this.options2[t];
          coupon_type = this.options2[t].coupon_type || '1';
          coupon_threshold = this.options2[t].conditions / 100;
          // limit = Number(this.options2[t].at_least) / 100;
        }
      }
      
      if (!this.continuity_day) {
        this.$message({
          message: "请选择天数",
          type: "warning"
        });
        bool = false;
        return;
      }

      if (this.couponValue == '') {
        this.$message({
          message: "优惠券不能为空,请重新选择!",
          type: "warning"
        });
        bool = false;
        return;
      }

      this.couponList.forEach(item => {
        if (item.continuity_day == this.continuity_day) {
          this.$message({
            message: "同一天只能对应一张优惠券,请检查!",
            type: "warning"
          });
          bool = false;
        }
      });

      if (bool) {
        this.couponList.push(
          {
            "type": 1,
            "coupon_id": id,
            "continuity_day": this.continuity_day,
            "amount": amount,
            "coupon_type": coupon_type || '1',
            "coupon_name": title,
            // "limit": limit,
            "coupon_json": coupon_json,
            "coupon_threshold": coupon_threshold
          }
        )
        this.value2 = '';
        this.couponValue = '';
        if(this.couponType == '1'){
          this.getCouponList();
        }else{
          this.getPromoList();
        }
        this.couponList.sort((a,b) => {
          return a.continuity_day - b.continuity_day
        })
      }
    },
    delGoodsItem1(i) {
      this.couponList.splice(i, 1);
    },
    saveData2() {
      for (let k = 0,len = this.moneyList.length; k < len; k++) {
        if (this.moneyList[k].continuity_day == this.value3) {
          this.$message({
            message: "同一天只能对应一张优惠券,请检查!",
            type: "warning"
          });
          return false;
        }
      }

      if (this.value3 == '' || this.amount == '') {
        this.$message({
          message: "天数或押金不能为空,请重新选择!",
          type: "warning"
        });
      } else {
        this.moneyList.push(
          {
            "continuity_day": this.value3,
            "amount": this.amount,
            "type": "2"
          }
        )
        this.value1 = '';
        this.amount = '';
      }
    },
    delGoodsItem2(i) {
      this.moneyList.splice(i, 1);
    },
    addAnswer() {
      if (this.editform.answerList.length == 2) {
        this.editform.answerList.push(
          {
            "answer_content": "",
            "option_type": "C",
            "option_sort": "3",
            "is_true_answer": false
          },
        )
      } else if (this.editform.answerList.length == 3) {
        this.editform.answerList.push(
          {
            "answer_content": "",
            "option_type": "D",
            "option_sort": "4",
            "is_true_answer": false
          },
        )
      } else if (this.editform.answerList.length == 4) {
        this.editform.answerList.push(
          {
            "answer_content": "",
            "option_type": "E",
            "option_sort": "5",
            "is_true_answer": false
          },
        )
      } else if (this.editform.answerList.length == 5) {
        this.editform.answerList.push(
          {
            "answer_content": "",
            "option_type": "F",
            "option_sort": "6",
            "is_true_answer": false
          },
        )
      } else if (this.editform.answerList.length == 6) {
        this.editform.answerList.push(
          {
            "answer_content": "",
            "option_type": "G",
            "option_sort": "7",
            "is_true_answer": false
          },
        )
      } else if (this.editform.answerList.length == 7) {
        this.editform.answerList.push(
          {
            "answer_content": "",
            "option_type": "H",
            "option_sort": "8",
            "is_true_answer": false
          },
        )
      }
    },
    delAnswer(i) {
      if (this.editform.answerList.length == 2) {
        this.$message({
          message: '至少包含两个选项！',
          type: 'warning'
        });
      } else {
        this.editform.answerList.splice(i, 1);
      }
    },
    selectDate(v) {
      // this.editform.questionInfo = {
      //   "question_time": v,
      //   // "target_day": this.num,
      //   // "question_sort": '1',
      //   // "question_type": "1",
      //   "question_content":''
      // }
      // this.num+=1;
    },
    copyQuestion(i1, i2) {
      this.Index1 = i1;
      this.Index2 = i2;
      this.dialogFormVisible3 = true;
      let currentDay = this.questionAnswerList[i1].timeInfo.time;
      let data = JSON.stringify(this.questionAnswerList[i1].questionAnswerList[i2]);
      sessionStorage.setItem('copyQuestion', data);
      this.cities = []; this.checkedCities = [];
      for (let k = 0,len = this.selecteDays.length; k < len; k++) {
        if (this.selecteDays[k].day != currentDay) {
          this.cities.push(this.selecteDays[k].day);
        }
      }
    },
    submitCopy() {
      this.dialogFormVisible3 = false;
      let Data = JSON.parse(sessionStorage.getItem('copyQuestion'));
      let selectDays = [];
      for (let i = 0,len=this.questionAnswerList.length; i < len; i++) {
        selectDays.push(this.questionAnswerList[i].timeInfo.time);
      }
      for (let n = 0,len=this.checkedCities.length; n < len; n++) {
        if (selectDays.indexOf(this.checkedCities[n]) == -1) {
          let copys = {
            "timeInfo": {
              "target_day": this.num,
              "time": this.checkedCities[n],
              "is_can_edit": '1'
            },
            "questionAnswerList": [this.computedData]
          }
          this.questionAnswerList.push(copys);
          this.num += 1;
        } else {
          for (let y = 0,len=this.questionAnswerList.length; y < len; y++) {
            if (this.questionAnswerList[y].timeInfo.time == this.checkedCities[n]) {
              this.questionAnswerList[y].questionAnswerList.push(this.computedData);
            }
          }
        }
      }
      this.questionAnswerList = this.sortDays2(this.questionAnswerList);
    },
    editQuestion(i1, i2) {
      this.dialogFormVisible = true;
      this.currentIndex = i1 + i2;
      this.currentIndex1 = i1;
      this.currentIndex2 = i2;
      let questionAnswerList = this.questionAnswerList[i1].questionAnswerList[i2];
      this.question_time = this.questionAnswerList[i1].timeInfo.time;
      for (let k = 0; k < questionAnswerList.answerList.length; k++) {
        if (questionAnswerList.answerList[k].is_true_answer == 1) {
          questionAnswerList.answerList[k].is_true_answer = true;
        } else {
          questionAnswerList.answerList[k].is_true_answer = false;
        }
      }
      this.editform = questionAnswerList;
    },
    delQuestion(i1, i2) {
      if (this.questionAnswerList[i1].questionAnswerList.length == 1) {
        this.questionAnswerList.splice(i1, 1);
      } else if (this.questionAnswerList[i1].questionAnswerList.length > 1) {
        this.questionAnswerList[i1].questionAnswerList.splice(i2, 1);
      }
    },
    newQuestion() {
      this.dialogFormVisible = true;
      this.question_time = '';
      this.editform = {
        "questionInfo": {
          "question_time": "",
          "question_content": "",
        },
        "answerList": [
          {
            "answer_content": "",
            "option_type": "A",
            "option_sort": "1",
            "is_true_answer": false
          },
          {
            "answer_content": "",
            "option_type": "B",
            "option_sort": "2",
            "is_true_answer": false
          }
        ]
      }
    },
    addSubject() {
      if (this.question_time == '' || this.editform.questionInfo.question_content == '') {
        this.$message({
          message: '题目必要信息不能为空，请检查！',
          type: 'warning'
        });
        return false;
      }
      let answers = [];
      for (let k = 0; k < this.editform.answerList.length; k++) {
        answers.push(this.editform.answerList[k].is_true_answer);
        if (this.editform.answerList[k].answer_content == '') {
          this.$message({
            message: '题目必要信息不能为空，请检查！',
            type: 'warning'
          });
          return false;
        }
      }
      if (answers.indexOf(true) == -1) {
        this.$message({
          message: '至少有一选项为正确答案，请检查！',
          type: 'warning'
        });
        return false;
      }

      this.dialogFormVisible = false;
      let targetDayList = [];
      for (let i = 0,len=this.questionAnswerList.length; i < len; i++) {
        targetDayList.push(this.questionAnswerList[i].timeInfo.time);
      }

      if (this.currentIndex < 999) {
        //修改题目
        if (this.question_time != this.questionAnswerList[this.currentIndex1].timeInfo.time) {
          //修改时间
          // this.questionAnswerList[this.currentIndex1].timeInfo.time = this.question_time;
          if (this.questionAnswerList[this.currentIndex1].questionAnswerList.length < 2) {
            this.questionAnswerList.splice(this.currentIndex1, 1);
          } else {
            this.questionAnswerList[this.currentIndex1].questionAnswerList.splice(this.currentIndex2, 1);
          }
          if (targetDayList.indexOf(this.question_time) != -1) {
            for (let k = 0,len = this.questionAnswerList.length; k < len; k++) {
              if (this.questionAnswerList[k].timeInfo.time == this.question_time) {
                this.questionAnswerList[k].questionAnswerList.push(this.editform);
              }
            }
          } else {
            let data = {
              "timeInfo": {
                "target_day": this.num,
                "time": this.question_time,
                "is_can_edit": '1'
              },
              "questionAnswerList": [this.editform]
            }
            this.questionAnswerList.push(data);
          }
        } else {
          //修改题目选项
          this.questionAnswerList[this.currentIndex1].questionAnswerList[this.currentIndex2] = this.editform;
        }

        this.currentIndex = 9999;

      } else {
        if (this.editform.answerList.length == 3) {
          this.editform.answerList[0].option_type = 'A';
          this.editform.answerList[0].option_sort = '1';
          this.editform.answerList[1].option_type = 'B';
          this.editform.answerList[1].option_sort = '2';
          this.editform.answerList[2].option_type = 'C';
          this.editform.answerList[2].option_sort = '3';
        } else if (
          this.editform.answerList.length == 4) {
          this.editform.answerList[0].option_type = 'A';
          this.editform.answerList[1].option_type = 'B';
          this.editform.answerList[2].option_type = 'C';
          this.editform.answerList[3].option_type = 'D';
          this.editform.answerList[0].option_sort = '1';
          this.editform.answerList[1].option_sort = '2';
          this.editform.answerList[2].option_sort = '3';
          this.editform.answerList[3].option_sort = '4';
        } else if (
          this.editform.answerList.length == 5) {
          this.editform.answerList[0].option_type = 'A';
          this.editform.answerList[1].option_type = 'B';
          this.editform.answerList[2].option_type = 'C';
          this.editform.answerList[3].option_type = 'D';
          this.editform.answerList[4].option_type = 'E';
          this.editform.answerList[0].option_sort = '1';
          this.editform.answerList[1].option_sort = '2';
          this.editform.answerList[2].option_sort = '3';
          this.editform.answerList[3].option_sort = '4';
          this.editform.answerList[4].option_sort = '5';
        } else if (
          this.editform.answerList.length == 6) {
          this.editform.answerList[0].option_type = 'A';
          this.editform.answerList[1].option_type = 'B';
          this.editform.answerList[2].option_type = 'C';
          this.editform.answerList[3].option_type = 'D';
          this.editform.answerList[4].option_type = 'E';
          this.editform.answerList[5].option_type = 'F';
          this.editform.answerList[0].option_sort = '1';
          this.editform.answerList[1].option_sort = '2';
          this.editform.answerList[2].option_sort = '3';
          this.editform.answerList[3].option_sort = '4';
          this.editform.answerList[4].option_sort = '5';
          this.editform.answerList[5].option_sort = '6';
        }
        for (let i = 0; i < this.editform.answerList.length; i++) {
          if (this.editform.answerList[i].is_true_answer == true) {
            this.editform.answerList[i].is_true_answer = '1'
          } else {
            this.editform.answerList[i].is_true_answer = '2'
          }
        }

        if (this.questionAnswerList.length > 0) {
          if (targetDayList.indexOf(this.question_time) != -1) {
            for (let k = 0; k < this.questionAnswerList.length; k++) {
              if (this.questionAnswerList[k].timeInfo.time == this.question_time) {
                this.questionAnswerList[k].questionAnswerList.push(this.editform);
              }
            }
          } else {
            let data = {
              "timeInfo": {
                "target_day": this.num,
                "time": this.question_time,
                "is_can_edit": '1'
              },
              "questionAnswerList": [this.editform]
            }
            this.questionAnswerList.push(data);
          }
        } else {
          let data = {
            "timeInfo": {
              "target_day": this.num,
              "time": this.question_time,
              "is_can_edit": '1'
            },
            "questionAnswerList": [this.editform]
          }
          this.questionAnswerList.push(data);
        }
        this.num += 1;
      }

      this.editform = {
        "questionInfo": {
          "question_time": "",
          "question_content": "",
        },
        "answerList": [
          {
            "answer_content": "",
            "option_type": "A",
            "option_sort": "1",
            "is_true_answer": false
          },
          {
            "answer_content": "",
            "option_type": "B",
            "option_sort": "2",
            "is_true_answer": false
          }
        ]
      }
      this.questionAnswerList = this.sortDays2(this.questionAnswerList);
    },
    cancelSubject() {
      this.dialogFormVisible = false;
      this.editform = {
        "questionInfo": {
          "question_time": "",
          "question_content": "",
        },
        "answerList": [
          {
            "answer_content": "",
            "option_type": "A",
            "option_sort": "1",
            "is_true_answer": false
          },
          {
            "answer_content": "",
            "option_type": "B",
            "option_sort": "2",
            "is_true_answer": false
          }
        ]
      }
    },
    //签到题目保存
    onSubmit() {
      let dataList = [];
      this.questionAnswerList = this.sortDays2(this.questionAnswerList);
      for (let m = 0,len=this.questionAnswerList.length; m < len; m++) {
        this.questionAnswerList[m].timeInfo.target_day = m + 1;
        if (this.questionAnswerList[m].timeInfo.is_can_edit == '1') {
          dataList.push(this.questionAnswerList[m]);
        }
      }
      let data = {
        signInfo: {
          sign_id: this.signInfo.sign_id,
          camp_id: this.signInfo.camp_id,
          camp_times_id: this.signInfo.camp_times_id,
        },
        contentList: dataList,
      }

      updateQuestionList(data).then(res => {
        if (res.code == 200) {
          this.dialogFormVisible = false;
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.$router.go(-1);
        }
      });

    },
    //签到基本信息保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for (let m = 0,len=this.couponList.length; m < len; m++) {
            this.rewardInfo.rewardList.push(this.couponList[m])
          }

          if(this.rewardInfo.is_back_money == '1'){
            this.rewardInfo.rewardList.push(
              {
                "type": "2",
                "continuity_day": "28",
                "amount": "",
                "coupon_type": '0'
              }
            )
          }
          let data = {
            signInfo: this.signInfo,
            rewardInfo: this.rewardInfo
          }
          data.signInfo.sign_end_time = this.signInfo.sign_start_time[1];
          data.signInfo.sign_start_time = this.signInfo.sign_start_time[0];

          if (this.signInfo.sign_id) {
            updateSign(data).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.$router.go(-1);
              }
            });
          } else {
            insertSign(data).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.$router.go(-1);
              }
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    onCancel() {
      var that = this;
      this.$confirm("取消后不会保留修改的信息,确认取消?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$router.go(-1);
        })
        .catch(() => { });
    },
    handleChange(value) {}
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0 0 20px;
  .sub-navbar {
    text-align: left;
    .subtitle {
      padding: 0 20px;
    }
  }
  .newaddend_container {
    padding: 0px 50px;
    .newaddend_container_header {
      p {
        width: 90%;
        height: 50px;
        line-height: 50px;
        background: rgb(228, 228, 228);
        display: flex;
        justify-content: space-around;
        span {
          cursor: pointer;
        }
      }
    }
    .newaddend_content1 {
      margin-bottom: 50px;
      ul {
        width: 500px;
        list-style: none;
        padding: 0;
        li {
          height: 20px;
          line-height: 20px;
          overflow: hidden;
          position: relative;
          em{
            font-style: normal;
            font-size: 12px;
            width: 80px;
            height: 20px;
            text-align: center;
            display: inline-block;
            background: lightgray;
          }
          b{
            font-weight: 400;
          }
          span {
            width: 220px;
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
    .newaddend_content2 {
      padding: 20px 0;
      .el-icon-delete {
        font-size: 19px;
        margin: 0 7px;
      }
      #checkboxList {
        width: 100px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-end;
      }
      .positionFixed {
        position: fixed;
        top: 160px;
        right: 175px;
        z-index: 999;
      }
      .answerList{
        display: flex;
        flex-direction: column;
      }
    }
  }
  .bottomButtonContainer {
    position: fixed;
    left: 50%;
    bottom: 10px;
    .bottomButton {
      margin-top: 40px;
      text-align: center;
    }
  }
}
</style>

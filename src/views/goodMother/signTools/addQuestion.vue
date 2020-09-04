<template>
  <div class="question_wrap">
    <el-row>
      <el-col :span="11">
        <div class="calendar_wrap">
          <p v-if="range.length > 0" class="sign_date">签到日期：<span class="date_item">{{ range[0] }}</span> 至 <span class="date_item">{{ range[1] }}</span></p>
          <el-calendar v-model="selectDay" class="sign_calendar_date">
            <template
              slot="dateCell"
              slot-scope="{date, data}">
              <div :style="{'background': data.isSelected ? 'rgba(102, 177, 255, .4)' : handleBgcolor(data.day) ? '#F2F6FC' : ''}" class="calendar_custom" @click="clickCalendar(data)"> <!--这里原本有动态绑定的class，去掉-->
                <span>{{ data.day.split('-').slice(1).join('-') }}</span>
                <span v-if="dealMyDate(data)" class="circle_tag" />
              </div>
            </template>
          </el-calendar>
        </div>
      </el-col>
      <el-col :span="13">
        <transition name="el-zoom-in-top">
          <div v-show="!isHaveSet" class="empty_text">
            【{{ question_time }}】不在签到日期范围内~
          </div>
        </transition>
        <transition name="el-zoom-in-top">
          <div v-show="isHaveSet" class="add_question">
            <p class="question_title">添加日签题<span class="prop_text">（注：每一天只能添加1道签到题，签到题必须有选项与解析，同时配置知识点）</span></p>
            <p class="check_date">已选日期：<i>{{ question_time }}</i></p>
            <div class="question_wrap">
              <el-form ref="ruleForm" label-width="125px" label-position="left" class="demo-ruleForm">
                <el-form-item>
                  <span slot="label" class="label_name"><i>*</i>题干：</span>
                  <el-input v-model="question_content" :disabled="!isPastTense" type="textarea" placeholder="请输入题干" />
                </el-form-item>
                <el-form-item>
                  <span slot="label" class="label_name"><i>*</i>选项：</span>
                  <div class="analysis_wrap">
                    <el-radio-group v-for="(item, index) in optionList" v-model="is_true_answer" :key="index" class="radio_wrap">
                      <div class="question_list">
                        <el-radio :disabled="!isPastTense" :label="item.tag" class="option_title">{{ sortList[index] }}</el-radio>
                        <div class="answer_analysis">
                          <el-input :disabled="!isPastTense" v-model="item.answer_content" :placeholder="`请输入选项${sortList[index]}的答案`" type="textarea" class="textarea_detail" />
                          <el-input :disabled="!isPastTense" v-model="item.answer_analysis" :placeholder="`请输入选项${sortList[index]}的解析`" type="textarea" class="textarea_detail"/>
                        </div>
                      </div>
                      <el-button :disabled="!isPastTense" type="danger" size="mini" circle icon="el-icon-delete" class="delete_button" @click="deleteAdv(index)"/>
                    </el-radio-group>
                  </div>
                  <el-button :disabled="!isPastTense" type="success" size="medium" class="add_button" @click="addAnalysis"><i class="el-icon-plus"/>添加一个选项</el-button>
                </el-form-item>
                <el-form-item>
                  <span slot="label" class="label_name"><i>*</i>虚拟日签人数：</span>
                  <el-input v-model.number="virtual_sign_num" :disabled="!isPastTense" clearable placeholder="请填写日签虚拟人数" style="width:50%;"/>
                </el-form-item>
                <el-form-item>
                  <span slot="label" class="label_name"><i>*</i>知识点来源：</span>
                  <el-select v-model="item_id" :remote-method="remoteMethod" :loading="loading" :disabled="!isPastTense" filterable remote placeholder="请输入商品名称（可搜索）" size="small" clearable style="width:50%;" @change="changeSelect" >
                    <el-option v-for="item in options" :key="item.item_id" :label="item.item_name" :value="item.item_id" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <div class="form_bottom">
                    <el-button :disabled="!isPastTense" @click="clearData" >清 空</el-button>
                    <el-button :disabled="!isPastTense" type="primary" @click="saveQuextion">{{ question_id ? '修改并保存' : '保 存' }}</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import timeTools from '@/utils/timeFromat'
import { getItemListAll } from '@/api/shopGoods'
import { getSignCalendar, getSignQuestion, createSignQuestion, modifySignQuestion, deleteQuestion } from '@/api/signDay'
export default {
  data() {
    return {
      range: [],
      resDate: [],
      optionList: [],
      sortList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      question_time: timeTools.formatDate(new Date(), 'YYYY-MM-DD'),
      selectDay: new Date(),
      listQuery: {
        page_no: 1,
        page_size: 10
      },
      question_content: '',
      is_true_answer: '',
      virtual_sign_num: '',
      item_id: '',
      options: [],
      loading: false,
      isHaveSet: false, // 是否在日签范围
      isPastTense: false, // 是否可操作
      question_id: null
    }
  },
  computed: {
    signId() { return this.$route.params.sign_id }
  },
  watch: {
    optionList: {
      handler(newList, old) {
        if (newList.length <= 0) { this.is_true_answer = '' }
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    changeSelect(id) {
      if (!id) { return }
      const shopItem = this.options.find((item) => (parseInt(id) === parseInt(item.item_id)))
      if (parseInt(shopItem.label_flag) !== 1) {
        this.$alert('此商品未添加标签，请联系财哥^-^', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.item_id = ''
          }
        })
        return
      }
    },
    clearData() {
      this.$confirm(`您确定清空您填写【${this.question_time}】的日签题吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.clear()
      }).catch(() => {})
    },
    initData() {
      // 获取商品
      this.getItemAll(this.listQuery, data => {
        this.options = data.rows
      })
      // 获取日签日历
      this.getCalendar((data) => {
        const list = Array.from(data.result.calendarInfo, (item) => (item.calendar_list))
        this.resDate = list.reduce((pre, cur) => {
          return pre.concat(cur)
        }, [])
        this.range = [data.result.signInfo.sign_start_time, data.result.signInfo.sign_end_time]

        this.isHaveSet = this.isTimes(this.question_time, this.range[0], this.range[1])
        this.isPastTense = this.isAlready(timeTools.formatDate(new Date(), 'YYYY-MM-DD'))
        // 获取某天的日签题
        const dateList = Array.from(this.resDate, (item) => (item.calendar_time))
        const isHaveQuestion = dateList.includes(this.question_time) // 是否配过题
        // 如果在日签范围内，在请求数据
        if (this.isHaveSet && isHaveQuestion) {
          this.getSignDayQuestion(this.question_time)
        }
      })
    },
    // 获取某天的日签题
    getSignDayQuestion(crrentDay) {
      if (!crrentDay) { return }
      const params = {
        sign_id: this.signId,
        calendar_time: crrentDay
      }
      getSignQuestion(params)
        .then(res => {
          if (res.code === 200) {
            const info = res.result.questionInfo
            this.question_content = info.question_content
            this.virtual_sign_num = info.virtual_sign_num
            this.item_id = info.goods_list[0]['goods_id']
            this.question_id = info.question_id
            const item = info.answer_list.find((item) => (parseInt(item.is_true_answer) === 1))
            if (item) { this.is_true_answer = parseInt(item.option_sort) - 1 }
            this.optionList = Array.from(info.answer_list, (item) => ({ answer_content: item.answer_content, answer_analysis: item.answer_analysis, tag: item.option_sort - 1 }))
          }
        })
    },
    // 搜索商品来源
    remoteMethod(query) {
      if (!query) {
        this.getItemAll(this.listQuery, data => {
          this.options = data.rows
        })
        return
      }
      this.getItemAll({ page_no: 1, page_size: 10, item_name: query }, data => {
        this.options = data.rows
      })
    },
    getItemAll(filters, cb) {
      this.loading = true
      getItemListAll(filters)
        .then(res => {
          this.loading = false
          cb(res.result)
        })
        .catch(er => {
          console.log(er)
          this.loading = false
        })
    },
    // 获取日签日历
    getCalendar(cb) {
      getSignCalendar({ sign_id: this.signId })
        .then(res => {
          if (res.code === 200) { cb(res) }
        })
    },
    // 增加选项
    addAnalysis() {
      this.optionList.push({ answer_content: '', answer_analysis: '', tag: this.optionList.length })
    },
    // 删除选项
    deleteAdv(index) {
      this.optionList.splice(index, 1)
    },
    // 点击日历
    clickCalendar(item) {
      this.question_id = null
      this.question_time = timeTools.formatDate(item.day, 'YYYY-MM-DD')
      this.isHaveSet = this.isTimes(this.question_time, this.range[0], this.range[1])
      this.isPastTense = this.isAlready(this.question_time)

      this.clear()
      // 获取某天的日签题
      const dateList = Array.from(this.resDate, (item) => (item.calendar_time))
      const isHaveQuestion = dateList.includes(this.question_time) // 是否配过题
      if (this.isHaveSet && isHaveQuestion) { // 如果在日签范围内并且配过题，在请求数据
        this.getSignDayQuestion(this.question_time)
      }
    },
    // 清空数据
    clear() {
      // this.question_id = null
      this.optionList = []
      this.question_content = ''
      this.is_true_answer = ''
      this.virtual_sign_num = ''
      this.item_id = ''
    },
    // 判断是不是今天之前的时间
    isAlready(crrentDayStr) {
      var curDate = new Date(crrentDayStr).getTime()
      var tadayDate = new Date().getTime()
      if (tadayDate > curDate) {
        return false
      }
      return true
    },
    // 判断一个时间是否在一段时间内
    isTimes(crrentDayStr, beginDateStr, endDateStr) {
      var curDate = new Date(crrentDayStr).getTime()
      var beginDate = new Date(beginDateStr).getTime()
      var endDate = new Date(endDateStr).getTime()
      if (curDate >= beginDate && curDate <= endDate) {
        return true
      }
      return false
    },
    checkSignQuestion() {
      if (!this.question_content) {
        this.$message({
          message: '请输入题干',
          type: 'warning'
        })
        return false
      }
      if (this.optionList.length <= 0) {
        this.$message({
          message: '至少添加一个选项',
          type: 'warning'
        })
        return false
      }
      for (let index = 0; index < this.optionList.length; index++) {
        const element = this.optionList[index]
        if (!element.answer_content) {
          this.$message({
            message: `请填写选项${this.sortList[index]}的答案`,
            type: 'warning'
          })
          return false
        }
        if (!element.answer_analysis) {
          this.$message({
            message: `请填写选项${this.sortList[index]}的解析`,
            type: 'warning'
          })
          return false
        }
      }
      if (this.isNull(this.is_true_answer)) {
        this.$message({
          message: '请给日签题选择正确选项',
          type: 'warning'
        })
        return false
      }
      if (this.virtual_sign_num === 0) {
        this.$message({
          message: '虚拟日签人数不能为0',
          type: 'warning'
        })
        return false
      }
      if (!this.virtual_sign_num) {
        this.$message({
          message: '请填写虚拟日签人数',
          type: 'warning'
        })
        return false
      }
      if (!this.isInteger(this.virtual_sign_num)) {
        this.$message({
          message: '虚拟日签人数只能为数字',
          type: 'warning'
        })
        return false
      }
      if (!this.item_id) {
        this.$message({
          message: '请选择知识点来源',
          type: 'warning'
        })
        return false
      }
      return true
    },
    saveQuextion() {
      if (!this.question_id && !this.checkSignQuestion()) { // 不是修改 && 检测必选
        return
      }
      const optionList = Array.from(this.optionList, (item) => ({ answer_content: item.answer_content, answer_analysis: item.answer_analysis, option_type: this.sortList[item.tag], option_sort: item.tag + 1, is_true_answer: item.tag === this.is_true_answer ? 1 : 2 }))
      const shopItem = this.options.find((item) => (parseInt(this.item_id) === parseInt(item.item_id)))
      const objData = {
        camps_type: shopItem ? shopItem.item_no : '',
        goods_name: shopItem ? shopItem.item_name : '',
        goods_id: this.item_id,
        option_list: optionList,
        question_time: this.question_time,
        sign_id: this.signId,
        question_content: this.question_content,
        virtual_sign_num: this.virtual_sign_num
      }
      if (this.question_id && this.optionList.length <= 0 && this.isNull(this.question_content) && this.isNull(this.is_true_answer) && this.isNull(this.virtual_sign_num) && this.isNull(this.item_id)) {
        // 清空日签题
        objData.question_id = this.question_id
        deleteQuestion({ sign_id: this.signId, question_id: this.question_id })
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              const index = this.resDate.findIndex((el) => (el.calendar_time === this.question_time))
              this.resDate.splice(index, 1)
            }
          })
        return
      } else {
        // 只要有一项存在，就是修改需check
        if (!this.checkSignQuestion()) {
          return
        }
      }
      // 编辑
      if (this.question_id) {
        objData.question_id = this.question_id
        modifySignQuestion(objData)
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            }
          })
        return
      }
      createSignQuestion(objData)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            if (res.result.question_id) {
              this.question_id = res.result.question_id
            }
            const item = this.resDate.find((el) => (el.calendar_time === this.question_time))
            if (!item) {
              this.resDate.push({ 'sign_id': 'signhfwncsvwief', 'calendar_time': this.question_time, 'calendar_month': timeTools.formatDate(this.question_time, 'YYYY.MM') })
            }
          }
        })
    },
    handleBgcolor(v) {
      return this.isTimes(v, this.range[0], this.range[1])
    },
    isInteger(val) {
      const reg = '^[1-9]\\d*$'
      if (val) {
        return new RegExp(reg).test(val)
      }
      return false
    },
    isNull(data) {
      return data === '' || data === undefined || data === null
    },
    dealMyDate(v) {
      const item = this.resDate.find((el) => (el.calendar_time === v.day))
      if (item) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.question_wrap{
  padding: 20px;
  .label_name{
    i {
      font-style: normal;
      color: #F56C6C;
      margin-right: 5px;
      font-size: 16px;
    }
  }
  .calendar_wrap{
    background: #F2F6FC;
    padding:12px 20px;
    border-radius: 10px;
    .sign_date{
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      margin-bottom:10px;
      .date_item{
        color:#F56C6C;
      }
    }
  }
  .calendar_custom{
    text-align: center;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .circle_tag{
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #E6A23C;
      margin-top: 10px;
    }
  }
  .calendar_custom:hover{
    background-color: rgba(102, 177, 255, .4) !important;
  }
  .empty_text{
    background: #F2F6FC;
    margin: 0 0 0 20px;
    padding: 12px 20px;
    border-radius: 10px;
    line-height: 50px;
    font-weight: 500;
    color: #999;
  }
  .add_question{
    background: #F2F6FC;
    margin: 0 0 0 20px;
    padding: 12px 20px;
    border-radius: 10px;
    .question_title{
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }
    .prop_text{
      font-size: 12px;
      color:#F56C6C;
    }
    .check_date{
      font-size: 16px;
      margin-top: 10px;
      i{
        font-style: normal;
        font-weight: 700;
        color: #F56C6C;
      }
    }
    .question_wrap{
      .radio_wrap{
        width: 100%;
        position: relative;
        left: 0;
        top: 0;
        .question_list{
          width: 90%;
          display: flex;
          justify-content: flex-start;
          padding: 10px;
          border-radius: 10px;
          background: #fff;
          margin-top: 10px;
          .answer_analysis{
            display: flex;
            flex-direction: column;
            width: 100%;
            .textarea_detail:last-child{
              margin-top: 10px;
            }
          }
          .option_title{
            margin-top: 20px;
          }
        }
        .delete_button{
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          -webkit-transform: translateY(-50%);
          -moz-transform: translateY(-50%);
          -o-transform: translateY(-50%);
        }
      }
    }
    .add_button{
      margin-top: 10px;
      i{
        margin-right: 10px;
      }
    }
  }
  .form_bottom{
    text-align: right;
  }
}
</style>

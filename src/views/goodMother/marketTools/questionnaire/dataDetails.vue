<template>
  <div class="app_container_details">
    <div class="swiper_home" >
      <el-button size="mini" type="primary" class="go_home" @click="goHome">返回上一页</el-button>

      <swiper :options="swiperOption">
        <swiper-slide v-for="(item,dateIndex) in detailList" :key="dateIndex">
          <el-col :span="22" style="height: 650px;overflow-y: auto;">
            <el-col :span="24" class="sheet-info1" style="padding-left: 20px;">
              <el-col :span="24" class="sheet-info2"><i class="sheet-icon" style=""></i>答题信息</el-col>
              <el-col :span="24" class="sheet-info3">
                <el-col :span="8" align="left">答题序号: {{detailInfo.answer_sort}}</el-col>
                <el-col :span="8" align="left">微信昵称: {{detailInfo.nickname}}</el-col>
                <el-col :span="8" align="left">答题状态: {{detailInfo.answer_status==1?'正常完成':'无效'}}</el-col>
              </el-col>
              <el-col :span="24" class="sheet-info3">
                <el-col :span="8" align="left">来源: {{detailInfo.origin}}</el-col>
                <el-col :span="8" align="left">开始时间: {{detailInfo.begin_time}}</el-col>
                <el-col :span="8" align="left">结束时间: {{detailInfo.end_time}}</el-col>
              </el-col>
              <el-col :span="24" class="sheet-info3">
                <el-col :span="8" align="left">答题时长: {{detailInfo.answer_time}}</el-col>
                <el-col :span="7" align="left">用于IP:{{detailInfo.ip}}</el-col>
              </el-col>
            </el-col>

            <el-col :span="24" class="sheet-info1 answer-details" style="padding-left: 20px;">
              <el-col :span="24" class="sheet-info2"><i class="sheet-icon"></i>答题详情</el-col>
              <el-col :span="24">
                <el-col :span="24" class="sheet-info4" v-for="(ansItem, ansIndex) in detailInfo.data" :key="ansIndex">
                  <el-col :span="24" align="left" style="margin-bottom:10px;">
                    Q{{ansItem.question_sort}}: {{ansItem.question}}
                    <span v-if="ansItem.question_type == 1">[单选题]</span>
                    <span v-if="ansItem.question_type == 2">[多选题]</span>
                    <span v-if="ansItem.question_type == 3">[填空题]</span>
                    <span v-if="ansItem.question_type == 4">[评分题]</span>
                  </el-col>
                  <el-col :span="24" align="left">{{ansItem.answer}}</el-col>
                </el-col>
              </el-col>
            </el-col>
          </el-col>
        </swiper-slide>
        <div class="swiper-button-prev" slot="button-prev" @click="prevAnswer"></div>
        <div class="swiper-button-next" slot="button-next" @click="nextAnswer"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import {answerInfoDetails} from '@/api/dataStatistics';

export default {
  name:'user',
  components: { swiper, swiperSlide },
  data(){
    return{
      answer_sort: "",
      questionnaire_code: "",
      detailList: [],
      detailInfo: {},
      swiperOption: {
        simulateTouch: false,
        // 箭头配置
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        initialSlide: 0
      },
      currentIndex: null,
      swiperHome: null,
      pre_sort: null,
      next_sort: null,
      status: 1,
      pageLocation: ''
    }
  },
  mounted(){
    
  },
  created(){
    let showIndex = parseInt(this.$route.query.showIndex);
    this.$set(this.swiperOption, 'initialSlide', showIndex)
    this.answer_sort = this.$route.params.id;
    this.questionnaire_code = this.$route.params.code;
    this.status = this.$route.query.status;
    this.answerDetails(this.answer_sort);
    this.pageLocation = this.$route.query.pageLocation;
  },
  methods:{
    prevAnswer(){
      this.answerDetails(this.pre_sort);
    },
    nextAnswer(){
      this.answerDetails(this.next_sort);
    },
    // 填空题
    answerDetails(answer_sort){
      const data = {
        answer_sort: answer_sort,
        questionnaire_code: this.questionnaire_code,
        status: this.status
      }
      answerInfoDetails(data).then(res => {
        this.detailList = res.result.sort_list;
        this.detailInfo = res.result.info;
        this.currentIndex = res.result.current_sort;
        this.pre_sort = res.result.pre_sort;
        this.next_sort = res.result.next_sort;
        if(res.result==""){
          var that = this;
          this.$message({
            type: 'warning',
            message: '暂无答卷详情！'
          });
        }
      })
    },
    goHome(){
      if(this.pageLocation == 'details'){
        this.$router.push({path: `/marketTools/questionnaire/data/${this.questionnaire_code}`, query: { activeName: '2'}})
      }else{
        this.$router.go(-1);
      }
    }
  },
  computed: {
    
  },
  watch: {
   
  }
}
</script>

<style lang="scss">
.app_container_details{
  .swiper_home{
    padding: 20px 30px 0;
    .go_home{
      margin:0 0 20px 60px;
    }
  }
  .swiper-button-prev, .swiper-button-next{
    position: absolute;
    top: 50%;
  }
  .swiper-button-prev{
   
  }
  .swiper-wrapper{
    padding:0 40px;
  }
  .sheet-info1 {
    font-size: 14px;
    padding-top: 20px;
    .sheet-info2{
      margin-bottom: 15px;
      font-size: 18px;
      .sheet-icon{
        display: inline-block;
        width: 3px;
        height: 14px;
        background: #409EFF;
        margin-right: 10px;
      }
    }
    .sheet-info3{
      margin-bottom: 10px;
      padding: 0 15px;
    }
  }
  .answer-details{
    padding-top: 30px;
    .sheet-info2{
      margin-bottom: 20px;
    }
    .sheet-info4{
      margin-bottom: 30px;
      padding: 0 15px;
    }
  }
}
</style>


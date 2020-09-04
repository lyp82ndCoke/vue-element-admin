<template>
  <div class="app_container-echarts">
    <el-col :span="24" class="title-header">
      <el-col :span="8">
        &nbsp;&nbsp;<span>{{title}}</span>
      </el-col>
      <el-col justify="center" :span="10" :offset="2">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><b @click="projectEdit" :class="{'active': isActive==1}">编辑项目</b></el-breadcrumb-item>
          <el-breadcrumb-item><b @click="projectRelease" :class="{'active': isActive==2}">发布项目</b></el-breadcrumb-item>
          <el-breadcrumb-item><b @click="activeValue='third'" :class="{'active': isActive==3}">统计报表</b></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-col>
    <el-col :span="24" class="title-content title-content3">
      <el-row type="flex" class="title-content3-main" justify="space-between">
        <el-col :span="19">
          <span>最后更新时间：{{updateTime}}</span>
        </el-col>
        <el-col :span="5" align="right">
          <el-col :span="22">
            <span>当前已收集问卷：{{finishNum}}份</span>
          </el-col>
          <!-- <el-col :span="8">
            <a :href="processHost + 'questionnaire/information/exportData?special=skip&questionnaire_code='+questionnaire_code" class="export-form">导出</a>
          </el-col> -->
        </el-col>
      </el-row>
      <el-col :span="23" class="data-status">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本图表" name="1">
            <el-col :span="24" style="display:flex;justify-content: flex-end;">
              <a :href="processHost + 'questionnaire/Information_chart/export?special=skip&questionnaire_code='+questionnaire_code" class="export-form">导出</a>
            </el-col>

            <div v-if="dataList.length>0">
              <el-col class="statistics" :span="24" v-for="(item,index) in dataList" :key="index" >
                <!-- 单选题 -->
                <el-col class="single-election" :span="24" v-if="item.question_type == 1">
                  <el-col :span="24" class="single-title">
                    Q{{item.question_num}}:{{item.question_title}}（单选题）——— 
                    答题人数：{{item.answer_num}}
                  </el-col>
                  <el-row>
                    <el-card shadow="always">
                      <div :id="`chart${index}`" style="width: 700px;height:300px;top:-70px;"></div>
                    </el-card>
                  </el-row>
                  <el-col :span="24" align="center">
                    <el-table :data="item.options" :border="true" class="table-data">
                      <el-table-column prop="option_name" label="选项" width="180"></el-table-column>
                      <el-table-column prop="option_answer" label="回复情况">
                        <template slot-scope="scope">
                          <el-col :span="20">{{scope.row.option_answer}}%</el-col>
                          <el-col :span="2" v-if="scope.row.option_type == 2">
                            <i class="el-icon-view icon-view2" style="" @click="singleOtherShow(scope.row.questionnaire_code,scope.row.option_id)"></i>
                          </el-col>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-col>

                <!-- 多选题 -->
                <el-col class="single-election multiple-election" :span="24" v-if="item.question_type == 2">
                  <el-col :span="24" class="single-title">
                    Q{{item.question_num}}:{{item.question_title}}（多选题） ——— 
                    答题人数：{{item.answer_num}}
                  </el-col>
                  <el-row>
                    <el-card shadow="always">
                      <div :id="`chart${index}`" style="width: 700px;height:300px;top:-50px;"></div>
                    </el-card>
                  </el-row>
                  <el-col :span="24" align="center">
                    <el-table :data="item.options" :border="true" class="table-data">
                      <el-table-column prop="option_name" label="选项" width="180"></el-table-column>
                      <el-table-column prop="option_answer" label="回复情况">
                        <template slot-scope="scope">
                          <el-col :span="20">{{scope.row.option_answer}}%</el-col>
                          <el-col :span="2" v-if="scope.row.option_type == 2">
                            <i class="el-icon-view icon-view2" @click="singleOtherShow(scope.row.questionnaire_code,scope.row.option_id)"></i>
                          </el-col>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-col>

                <!-- 填空题 -->
                <el-col class="single-election completion" :span="24" v-if="item.question_type == 3">
                  <el-col :span="24" class="single-title">
                    Q{{item.question_num}}:{{item.question_title}}（填空题） ——— 
                    答题人数：{{item.answer_num}}
                  </el-col>
                  <el-col :span="24" align="center">
                    <el-table v-if="item.options.length>0" :data="item.options.slice(0,10)" :border="true" class="table-data">
                      <el-table-column prop="option_answer" label="答案">
                        <template slot-scope="scope">
                          <el-col :span="20">{{scope.row.option_answer}}</el-col>
                          <el-col :span="2"><i class="el-icon-view icon-view1" @click="answerDetails(scope.row.answer_sort, 1, scope.$index,'charts')"></i></el-col>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-table v-else :data="item.options" :border="true" class="table-data">
                      <el-table-column prop="option_answer" label="答案">
                        <template slot-scope="scope">
                          <el-col :span="20">{{scope.row.option_answer}}</el-col>
                          <el-col :span="2"><i class="el-icon-view icon-view1" @click="answerDetails(scope.row.answer_sort, 1, scope.$index,'charts')"></i></el-col>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-col :span="5" align="right" v-if="item.answer_num >10">
                      <el-button type="text" size="small" @click="moreAnswer(item.question_id)">查看更多答案</el-button> 
                    </el-col>
                  </el-col>
                </el-col>

                <!-- 打分题 -->
                <el-col class="single-election multiple-election" :span="24" v-if="item.question_type == 4">
                  <el-col :span="24" class="single-title">
                    Q{{item.question_num}}:{{item.question_title}}（打分题） ——— 
                    答题人数：{{item.answer_num}}
                  </el-col>
                  <el-row>
                    <el-card shadow="always">
                      <div :id="`chart${index}`" style="width: 700px;height:300px;"></div>
                    </el-card>
                  </el-row>
                  <el-col :span="24" align="center">
                    <table class="table-score" border="1" cellspacing="0">
                      <thead>
                        <tr>
                          <th v-for="(nameItem,nameIndex) in item.options.option_name" :key="nameIndex">{{nameItem}}</th>
                          <th>平均分</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td v-for="(numItem,numIndex) in item.options.option_answer" :key="numIndex">
                            <el-col :span="24">{{numItem}}%</el-col>
                            <el-col :span="24">{{item.options.user_num[numIndex]}}</el-col>
                          </td>
                          <td>{{item.answer_avg}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </el-col>
                </el-col>
              </el-col>
            </div>
            
            <div v-else-if="dataList.length<=0 && showTitle">
              <el-col :span="24" align="center">该问卷暂无结果数据可供展示</el-col>
              <el-col :span="24" align="center" style="margin-top:10px;">请先进行问卷收集</el-col>
            </div>
          </el-tab-pane>

          <el-tab-pane label="答卷详情" name="2">
            <el-row style="margin-bottom:10px;">
              <el-col :span="4" align="left">
                <el-select v-model="info.status" placeholder="请选择" size="small" @change="handleInvalid">
                  <el-option
                    v-for="item in [{label: '有效答卷',value:1},{label:'查看无效答卷',value:0},{label:'目标答卷',value:2}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="15" align="right" v-if="this.info.status == 0">
                <el-button type="primary" size="small" @click="batchDelete">批量删除</el-button> 
              </el-col>
              <el-col :span="3" align="right" v-if="this.info.status == 0">
                <el-button type="primary" size="small" @click="batchValid">批量还原为有效</el-button> 
              </el-col>
              <el-col :span="18" align="right" v-if="this.info.status == 1">
                <el-button type="primary" size="small" @click="batchInvalid">批量标为无效</el-button> 
              </el-col>
              <!-- 有效和无效导出 -->
              <el-col :span="2" align="center" v-if="this.info.status == 1 || this.info.status == 0">
                <a :href="processHost + 'questionnaire/information/exportData?special=skip&questionnaire_code='+questionnaire_code" class="export-form">导出</a>
              </el-col>
              <!-- 目标人数导出 -->
              <el-col :span="19" align="right" v-if="this.info.status == 2">
                <a :href="processHost + 'questionnaire/information/exportTargetUserList?special=skip&questionnaire_code='+questionnaire_code" class="export-form">导出</a>
              </el-col>
            </el-row>
            <el-table
              :data="infoData"
              ref="multipleTable"
              element-loading-text="Loading"
              border
              fit
              size='mini'
              highlight-current-row
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column label="答题序号" prop="answer_sort" align="center" width="80"></el-table-column>
              <el-table-column label="微信昵称" prop="nickname" align="center"></el-table-column>
              <el-table-column label="答题状态" prop="answer_status" width="100" align="center" v-if="info.status == 1 || info.status==2">
                <template slot-scope="scope">
                  <el-col :span="24" align="center" v-if="scope.row.answer_status == 1">正常完成</el-col>
                  <el-col :span="24" align="center" v-else-if="scope.row.answer_status == 0">未完成</el-col>
                  <el-col :span="24" align="center" v-else-if="scope.row.answer_status == 2">未答题</el-col>
                </template>
              </el-table-column>
              <el-table-column label="开始时间" prop="begin_time" align="center"></el-table-column>
              <el-table-column label="答题时长" prop="answer_time" align="center"></el-table-column>
              <el-table-column label="来源" prop="origin" align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" v-if="info.status==1" @click="answerDetails(scope.row.answer_sort, 1, scope.row.index, 'details')">查看</el-button>
                  <el-button size="mini" type="text" v-if="info.status==0" @click="answerDetails(scope.row.answer_sort, 0, scope.row.index, 'details')">查看</el-button>
                  <el-button size="mini" type="text" v-if="info.status==2&&scope.row.status==='1'" @click="answerDetails(scope.row.answer_sort, 1, scope.row.index, 'details')">查看</el-button>
                  <el-button size="mini" type="text" v-if="scope.row.status==='1'" @click="invalidLabel(scope.row.answer_id)">标为无效</el-button>
                  <el-button size="mini" type="text" v-if="info.status==0" @click="deleteAnswer(scope.row.answer_id)">删除</el-button>
                  <el-button size="mini" type="text" v-if="scope.row.status==='0'" @click="restoreValid(scope.row.answer_id)">还原为有效答卷</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              class="pagination"
              v-show="infoTotal>0"
              :total="infoTotal"
              :page.sync="info.page_num"
              :limit.sync="info.page_size"
              v-on:pagination="answerSheetList"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-col>


    <!-- 单选题/多选题 其他 -->
    <el-dialog
      :visible.sync="singleOther"
      width="60%"
      :before-close="handleOther"
      class="sheet-details single-other">
        <el-table
          :data="tableSingle"
          element-loading-text="Loading"
          border
          fit
          size='mini'
          highlight-current-row>
          <el-table-column label="答题序号" prop="answer_sort" align="center" width='100'>
          </el-table-column>
          <el-table-column label="在选项其他中填写的内容" prop="answer_con" align="center">
          </el-table-column>
          <el-table-column label="微信昵称" prop="nickname" align="center" width='160'>
          </el-table-column>
        </el-table>
        <pagination
          class="pagination"
          v-show="singleTotal>0"
          :total="singleTotal"
          :page.sync="listQuery.page_num"
          :limit.sync="listQuery.page_size"
          v-on:pagination="getOtherList"/>
    </el-dialog>

    <!-- 查看更多答案 -->
    <el-dialog
      :visible.sync="answerInfo"
      width="60%"
      :before-close="handleAnswer"
      class="more-answer">
        <el-table
          :data="answerList"
          element-loading-text="Loading"
          border
          fit
          size='mini'
          highlight-current-row>
          <el-table-column prop="option_answer" label="答案">
            <template slot-scope="scope">
              <el-col :span="20">{{scope.row.content}}</el-col>
              <el-col :span="2"><i class="el-icon-view icon-view2" @click="answerDetails(scope.row.answer_sort, 1, scope.row.index, 'charts')"></i></el-col>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          class="pagination"
          v-show="answer_num>0"
          :total="answer_num"
          :page.sync="data.page_num"
          :limit.sync="data.page_size"
          v-on:pagination="userFillContentList"/>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts';
import Pagination from '@/components/Pagination';
import { 
  getChart, 
  getOtherList,  
  answerSheetList, 
  userFillContentList,
  answerInfoInvalid,
  restoreInvalidAnswer,
  deleteInvalidAnswer,
  getAnswerInfo
} from '@/api/dataStatistics';

export default {
  name:'user',
  components: { Pagination, echarts },
  data(){
    return{
      title:'',
      updateTime:'',
      finishNum:'',
			dataList: [],
      activeName: '1',
      activeValue: '',
      questionnaire_code: "",
      tableSingle: [],
      singleOther: false,
      // 填空题
      total: 10,
      data: {
        page_num:1,
        page_size: 10
      },

      // 其他
      singleTotal: 0,
      listQuery: {
        page_num: 1,
        page_size: 10,
        questionnaire_code: "",
        option_id: "",
      },

      // 问卷详情
      infoData:[],
      infoTotal: 0,
      info: {
        page_num: 1,
        page_size: 10,
        questionnaire_code: "",
        status: 1
      },
      answerList: [],
      answerInfo: false,
      answer_num: 0,
      data: {
        page_num:1,
        page_size:10,
        questionnaire_code:"",
        question_id:"",
      },
      multArray: [],
      multipleSelection: [],
      restoreArray:[],
      deleteAnswerId:[],
      processHost: '',
      isActive: 3,
      showTitle: false
    }
  },
  mounted(){
    this.getChart();
  },
  created(){
    this.processHost = process.env.BASE_API;
    this.questionnaire_code = this.$route.params.code;
    // this.questionnaire_code = 'quest_5b5f25a3edddc';
    this.activeName = this.$route.query.activeName ? this.$route.query.activeName : '1';
    this.answerSheetList();
  },
  methods:{
    // 基本图标
    getChart(){
      getChart({questionnaire_code:this.questionnaire_code}).then(res => {
				if(res.code == 200){
					this.dataList = res.result.data;
					this.title = res.result.title;
					this.updateTime = res.result.update_time;
					this.finishNum = res.result.finish_num;
          this.showTitle = true;
          this.$nextTick(() => {
            if(this.dataList.length>0){
              this.getData();
            }
          })
				}
			})
    },
    getData(){
      for(let i = 0;i<this.dataList.length;i++){
        let itm = this.dataList[i];
        if(itm.question_type == 1 || itm.question_type == 2 || itm.question_type == 4){
          if(itm.question_type == 1){
            //单选
            itm.dataValue = [];
            for(var j = 0;j<itm.options.length;j++){
              itm.dataValue.push({
                name: `${itm.options[j].option_name}: ${itm.options[j].option_answer}%`,
                value: itm.options[j].option_answer
              })
            }
            echarts.init(document.getElementById("chart"+i)).setOption({
              title: { 
                left: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: '{c}%'
              },
              series: [
                {
                  name: '选项',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '60%'],
                  data: itm.dataValue,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            });
          } else if(itm.question_type == 2){
            // 多选
            itm.yAxis = [];
            itm.seriesData = [];
            for(let k = 0;k<itm.options.length;k++){
              itm.yAxis.push(itm.options[k].option_name);
              itm.seriesData.push(itm.options[k].option_answer)
            }
            echarts.init(document.getElementById("chart"+i)).setOption({
              title: {
                text: '选项',
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                },
                formatter: '{c}%'
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
              },
              yAxis: {
                type: 'category',
                data: itm.yAxis
              },
              series: [
                {
                  type: 'bar',
                  data: itm.seriesData
                }
              ]
            });
          } else if(itm.question_type == 4){
            //打分题
            itm.xAxis = [];
            itm.seriesData = [];
            for(let g=0;g<itm.options.option_name.length;g++){
              itm.xAxis.push(itm.options.option_name[g]);
              itm.seriesData.push(itm.options.user_num[g]);
            }
            echarts.init(document.getElementById("chart"+i)).setOption({
              xAxis: {
                type: 'category',
                data: itm.xAxis
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                data: itm.seriesData,
                type: 'bar'
              }]
            });
          }
        }
      }
    },
    // 填空题
    answerDetails(answer_sort,status,showIndex,pageLocation){
      // answer_sort - 查询的答题序号
      // status - 查询的答题状态 1正常 0失效
      // showIndex - 需要定位的第几个轮播
      // pageLocation -- 从详情返回过来页面定位 charts基本图表 details问卷详情
      this.$router.push({path:`/marketTools/questionnaire/details/${answer_sort}/${this.questionnaire_code}`, query: {status, showIndex, pageLocation}});
    },
    // 单选题/多选题其他数据列表
    singleOtherShow(questionnaire_code,option_id){
      this.singleOther = true;
      this.listQuery.questionnaire_code = questionnaire_code;
      this.listQuery.option_id = option_id;
      this.getOtherList();
    },
    getOtherList(){
      getOtherList(this.listQuery).then(res => {
        if(res.code == 200){
          this.singleTotal = res.result.count;
          this.tableSingle = res.result.data;
        }
      })
    },
    handleOther(){
      this.singleOther = false;
    },
    // 答卷详情
    handleClick(){
      // if(this.activeName == 2){
      //   this.answerSheetList();
      // }
      if(this.activeName == 1){
        this.$router.push(`/marketTools/questionnaire/data/${this.questionnaire_code}`)
      }
    },
    answerSheetList(){
      this.info.questionnaire_code = this.questionnaire_code;
      answerSheetList(this.info).then(res => {
        if(res.code == 200){
          this.infoData = res.result.data;
          this.infoTotal = res.result.count;
        }
      })
    },
    batchDelete(){
      this.deleteAnswerId.length = 0;
      this.multipleSelection.forEach(item => {
        this.deleteAnswerId.push(item.answer_id);
      })
      if(this.deleteAnswerId.length>0){
        this.$confirm('确定要将选中的无效答卷删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteInvalidAnswer();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
      }else{
        this.$message({
          type: 'warning',
          message: '请先选择您要删除的答卷！'
        }); 
      }
    },
    deleteAnswer(answer_id){
      this.deleteAnswerId.length = 0;
      this.deleteAnswerId = [answer_id];
      this.$confirm('确定删除该无效答卷吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteInvalidAnswer();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    deleteInvalidAnswer(){
      deleteInvalidAnswer({answer_id:this.deleteAnswerId}).then(res => {
        if(res.code == 200){
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.info.answer_status = 0;
          this.answerSheetList();
          this.activeName = '2';
        }
      })
    },
    invalidLabel(answer_id){
      const answerValue = [answer_id];
      const confirmText = ['确定将该答卷标为无效答卷吗？',  '无效答卷默认不计入统计分析，您可「查看无效答卷」并将其还原为有效答卷。'];
      const newDatas = [];
      const h = this.$createElement;
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      this.$confirm(
        '提示',
        {
          title: '提示',
          message: h('div', null, newDatas),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.answerInfoInvalid(answerValue);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        }); 
      })
    },
    answerInfoInvalid(answerValue){
      answerInfoInvalid({answer_id:answerValue}).then(res => {
        if(res.code == 200){
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.answerSheetList();
          this.activeName = '2';
        }
      })
    },
    restoreValid(answer_id){
      this.restoreArray.length = 0;
      this.restoreArray = [answer_id];
      this.$confirm('确定要将该问卷还原为有效答卷吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.restoreInvalidAnswer();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
    batchValid(){
      this.restoreArray.length = 0;
      this.multipleSelection.forEach(item => {
        this.restoreArray.push(item.answer_id);
      })
      if(this.restoreArray.length>0){
        this.$confirm('确定要将选中的问卷还原为有效答卷吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.restoreInvalidAnswer();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
      }else{
        this.$message({
          type: 'warning',
          message: '请选择您要还原的答卷！'
        });
      }
    },
    restoreInvalidAnswer(){
      restoreInvalidAnswer({answer_id: this.restoreArray}).then(res => {
        if(res.code == 200){
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.info.answer_status = 0;
          this.answerSheetList();
          this.activeName = '2';
        }
      })
    },
    handleInvalid(){
      this.info.page_num = 1;
      this.answerSheetList();
    },
    moreAnswer(question_id){
      this.data.questionnaire_code = this.questionnaire_code;
      this.data.question_id = question_id;
      this.answerInfo = true;
      this.userFillContentList();
    },
    userFillContentList(){
      userFillContentList(this.data).then(res => {
        if(res.code == 200){
          this.answerList = res.result.list;
          this.answer_num = res.result.count;
        }
      })
    },
    handleAnswer(){
      this.answerInfo = false;
    },
    handleSelectionChange(value){
      this.multipleSelection = value;
      this.multArray.length = 0;
      this.multipleSelection.forEach(item => {
        this.multArray.push(item.answer_id);
      })
    },
    batchInvalid(){
      const confirmText = ['确定将选中的答卷标为无效答卷吗？',  '无效答卷默认不计入统计分析，您可「查看无效答卷」并将其还原为有效答卷。'];
      const newDatas = [];
      const h = this.$createElement;
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      if(this.multArray.length>0){
        this.$confirm(
          '提示',
          {
            title: '提示',
            message: h('div', null, newDatas),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.answerInfoInvalid(this.multArray);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          }); 
        })
      }else{
        this.$message({
          type: 'warning',
          message: '请先选择您要标为无效的答卷！'
        }); 
      }
    },
    projectRelease(){
      this.isActive = 2;
      this.$router.push(`/marketTools/questionnaire/newQuestion/${this.questionnaire_code}&second`);
    },
    projectEdit(){
      this.isActive = 1;
      this.$router.push(`/marketTools/questionnaire/newQuestion/${this.questionnaire_code}&first`);
    }
  },
  computed: {
    
  }
}
</script>

<style lang="scss">
.app_container-echarts{
  .title-header{
    margin: 15px 0;
    .active{
      color: #FF5757;
      text-decoration: underline;
    }
  }
  .title-content{
    border-top: 1px solid rgb(218, 216, 216);
    height: auto;
  }
  .title-content3{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 15px;
    .title-content3-main{
      width: 96%;
      .el-button{
        margin-top: -12px;
      }
    }
    .data-status{
      margin-top: 10px;
      .statistics{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
      .single-election{
        width: 750px;
        border: 1px solid #ccc;
        margin-bottom: 20px;
        .icon-view2{
          color: #409EFF;
          font-size: 14px;
          cursor: pointer;
        }
        .single-title{
          font-size: 14px;
          padding: 10px 0 0 10px;
        }
        .table-data{
          width: 80%;
          margin-bottom: 30px;
        }
        .table-data th, .table-data td{
          padding: 0 0;
        }
      }
    }
    .table-score{
      margin-bottom: 20px;
      border-collapse: collapse;
      color: #909399;
      font-size: 14px;
      th{
        width: 100px;
        font-weight: bold;
        text-align: left;
      }
      th,td{
        border:1px solid #ccc; 
        padding: 3px 0 3px 10px;
      }
    }
  }
  .el-card{
    border: 1px solid #fff;
    .el-card__body{
      height: 260px;
    }
  }
  .multiple-election.single-election .el-card__body{
    height: 300px;
  }
  .completion {
    .single-title{
      margin-bottom: 20px;
    }
    .icon-view1{
      color: #fff;
      font-size: 16px;
    }
    .el-table--enable-row-hover .el-table__body tr:hover>td .icon-view1{
      color: #409EFF !important;
    }
    .icon-view1:hover{
      cursor:pointer
    }
    .table-data{
      margin-bottom: 10px!important;
    }
  }
  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover{
    box-shadow: none;
  }
  .scoring-chart>div>canvas {
    top: -30px !important;
  }
  .sheet-details {
    .el-dialog__body{
      padding: 0 0 10px;
      color: #000;
    }
    .el-carousel__item {
      padding: 0 60px;
      background-color: #fff;
    }
  }
  .single-other .el-dialog__body{
    padding: 20px 10px 20px;
  }
  .more-answer {
    .icon-view2{
      color: #fff;
      font-size: 16px;
    }
    .el-table--enable-row-hover .el-table__body tr:hover>td .icon-view2{
      color: #409EFF !important;
    }
    .icon-view2:hover{
      cursor:pointer
    }
  }
  .export-form{
    color: #fff;
    width: 50px;
    display: block;
    background-color: #409EFF;
    border-color: #409EFF;
    font-size: 12px;
    border-radius: 3px;
    padding: 8px 5px;
    text-align: center;
    //margin-top: -6px;
  }
}
</style>


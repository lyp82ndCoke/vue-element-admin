<template>
  <div class="app_container">
    <h3 v-if="sign_name">{{ sign_name }}</h3>
    <el-row type="flex" class="title-header" justify="space-between">
      <el-col :span="9">
        <el-col :span="8">
          <el-select v-model="listQuery.search_target_day" @change="getQuestionList2" size="small" placeholder="请选择天数" clearable>
            <el-option
              v-for="item in options"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input size="small" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="listQuery.search_question_name" clearable>
          </el-input>
        </el-col>
        <el-col :span="4" class="success-btn">
          <el-button type="success" @click="searchData()" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
      <el-col :span="1.2">
        <el-button type="primary" @click="addSign()" size="small">创建签到题</el-button>
      </el-col>
    </el-row>
    <el-col :span="24" class="title-content">
      <el-table
        v-loading="listLoading"
        :data="lists"
        element-loading-text="Loading"
        border
        fit
        size='mini'
        class="eltables"
        :default-sort = "{prop: 'question.question_time'}"
        highlight-current-row>
        <el-table-column label="日期" prop="question.question_time" align="center" width='100' fixed>
        </el-table-column>
        <el-table-column label="签到第几天" prop="question.target_day" align="center" width='100' fixed>
        </el-table-column>
        <el-table-column label="第几题" prop="question.question_sort" align="center" width='80' fixed>
        </el-table-column>
        <el-table-column label="题目" prop="question.question_content" align="center" width='200' fixed>
        </el-table-column>
        <el-table-column label="选项A" prop="answerList[0].answer_content" align="center">
          <template slot-scope="scope">
            <!-- <span v-if="lists[scope.$index].answerList[0].is_true_answer == '1'"><b>{{lists[scope.$index].answerList[0].answer_content}}</b></span> -->
            <span :class="{'trueAnswer':lists[scope.$index].answerList[0].is_true_answer == '1'}">{{ lists[scope.$index].answerList[0].answer_content }}</span>
            <!-- {{ lists[scope.$index].answerList[0].is_true_answer == '1' ?  :  }} ? <b>{{lists[scope.$index].answerList[0].answer_content}}</b> : {{ lists[scope.$index].answerList[0].answer_content }} -->
          </template>
        </el-table-column>
        <el-table-column label="选项B" prop="answerList[1].answer_content" align="center">
          <template slot-scope="scope">
            <span :class="{'trueAnswer':lists[scope.$index].answerList[1].is_true_answer == '1'}">{{ lists[scope.$index].answerList[1].answer_content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项C" prop="answerList[2].answer_content" align="center" v-if="maxAnswerRowNum > 2 ">
          <template slot-scope="scope" v-if="lists[scope.$index].answerList.length>2">
            <span :class="{'trueAnswer':lists[scope.$index].answerList[2].is_true_answer == '1'}">{{ lists[scope.$index].answerList[2].answer_content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项D" prop="answerList[3].answer_content" align="center" v-if="maxAnswerRowNum > 3 ">
          <template slot-scope="scope" v-if="lists[scope.$index].answerList.length>3">
            <span :class="{'trueAnswer':lists[scope.$index].answerList[3].is_true_answer == '1'}">{{ lists[scope.$index].answerList[3].answer_content }}</span>
          </template>
        </el-table-column> 
        <el-table-column label="选项E" prop="answerList[4].answer_content" align="center" v-if="maxAnswerRowNum > 4 ">
          <template slot-scope="scope" v-if="lists[scope.$index].answerList.length>4">>
            <span :class="{'trueAnswer':lists[scope.$index].answerList[4].is_true_answer == '1'}">{{ lists[scope.$index].answerList[4].answer_content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项F" prop="answerList[5].answer_content" align="center" v-if="maxAnswerRowNum > 5 ">
          <template slot-scope="scope" v-if="lists[scope.$index].answerList.length>5">>
            <span :class="{'trueAnswer':lists[scope.$index].answerList[5].is_true_answer == '1'}">{{ lists[scope.$index].answerList[5].answer_content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项G" prop="answerList[6].answer_content" align="center" v-if="maxAnswerRowNum > 6 ">
          <template slot-scope="scope" v-if="lists[scope.$index].answerList.length>6">>
            <span :class="{'trueAnswer':lists[scope.$index].answerList[6].is_true_answer == '1'}">{{ lists[scope.$index].answerList[6].answer_content }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column v-for="(item,index) in lists[0].answerList" :key="index" :label="'选项'+item.option_type" align="center">
          <template slot-scope="scope">
            <span>{{ lists[scope.$index].signList[index].answer_content }}</span>
          </template>
          {{888}}
        </el-table-column> -->

        <el-table-column label="操作" align="center" width='120' fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="goEdit(scope.row)" type="text">
              <span>{{ scope.row.question.is_can_edit == '2'? '查看' : '编辑'}}</span>
            </el-button>
            <el-button size="mini" @click="goDel(scope.row.question.question_id)" type="text" v-if="scope.row.question.is_can_edit == '1'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination 
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="changePaging"
      />
    </el-col>
    <el-dialog title="编辑问题" :visible.sync="dialogFormVisible" width="40%">
      <h4>第{{ editform.question.target_day }}天：{{ editform.question.question_time }}</h4>
      <el-form :model="editform">
        <!-- <el-form-item label="选择正确答案" :label-width="formLabelWidth">
          <el-col :span="8">
            <el-select v-model="trueAnswer" placeholder="请选择正确答案" size="small" :disabled="editform.question.is_can_edit == '2'" @change="selectAnswer">
              <el-option
                v-for="item in editform.answerList"
                :key="item.index"
                :label="item.option_type"
                :value="item.option_sort">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item> -->
        <!-- <el-form-item label="题目" :label-width="formLabelWidth">
          <el-col :span="18">
            <el-input size="small" placeholder="请输入题目" v-model="editform.question.question_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
        </el-form-item> -->

        <el-form-item label="题目" :label-width="formLabelWidth">
          <el-col :span="16">
            <el-input
              size="small"
              placeholder="请输入题目"
              v-model="editform.question.question_content" :disabled="editform.question.is_can_edit == '2'"
            ></el-input>
          </el-col>
          <el-col :span="4">
            <el-button
              @click="addAnswer()"
              size="mini"
              type="primary"
              :disabled="editform.answerList.length > 6 || editform.question.is_can_edit == '2'">添加选项</el-button>
          </el-col>
        </el-form-item>

        <el-form-item label="选项A" :label-width="formLabelWidth">
          <el-col :span="16">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[0].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
          <el-col :span="8">
            <i class="el-icon-delete" @click="delAnswer(0)"  v-if="editform.question.is_can_edit != '2'"></i>
            <el-checkbox v-model="editform.answerList[0].is_true_answer" :disabled="editform.question.is_can_edit == '2'">正确答案</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item label="选项B" :label-width="formLabelWidth">
          <el-col :span="16">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[1].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
          <el-col :span="8">
            <i class="el-icon-delete" @click="delAnswer(1)" v-if="editform.question.is_can_edit != '2'"></i>
            <el-checkbox v-model="editform.answerList[1].is_true_answer" :disabled="editform.question.is_can_edit == '2'">正确答案</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item label="选项C" :label-width="formLabelWidth" v-if="editform.answerList.length > 2">
          <el-col :span="16">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[2].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
          <el-col :span="8">
            <i class="el-icon-delete" @click="delAnswer(2)" v-if="editform.question.is_can_edit != '2'"></i>
            <el-checkbox v-model="editform.answerList[2].is_true_answer" :disabled="editform.question.is_can_edit == '2'">正确答案</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item label="选项D" :label-width="formLabelWidth" v-if="editform.answerList.length > 3">
          <el-col :span="16">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[3].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
          <el-col :span="8">
            <i class="el-icon-delete" @click="delAnswer(3)" v-if="editform.question.is_can_edit != '2'"></i>
            <el-checkbox v-model="editform.answerList[3].is_true_answer" :disabled="editform.question.is_can_edit == '2'">正确答案</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item label="选项E" :label-width="formLabelWidth" v-if="editform.answerList.length > 4">
          <el-col :span="16">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[4].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
          <el-col :span="8">
            <i class="el-icon-delete" @click="delAnswer(4)" v-if="editform.question.is_can_edit != '2'"></i>
            <el-checkbox v-model="editform.answerList[4].is_true_answer" :disabled="editform.question.is_can_edit == '2'">正确答案</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item label="选项F" :label-width="formLabelWidth" v-if="editform.answerList.length > 5">
          <el-col :span="16">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[5].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
          <el-col :span="8">
            <i class="el-icon-delete" @click="delAnswer(5)" v-if="editform.question.is_can_edit != '2'"></i>
            <el-checkbox v-model="editform.answerList[5].is_true_answer" :disabled="editform.question.is_can_edit == '2'">正确答案</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item label="选项G" :label-width="formLabelWidth" v-if="editform.answerList.length > 6">
          <el-col :span="16">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[6].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
          <el-col :span="8">
            <i class="el-icon-delete" @click="delAnswer(6)" v-if="editform.question.is_can_edit != '2'"></i>
            <el-checkbox v-model="editform.answerList[6].is_true_answer" :disabled="editform.question.is_can_edit == '2'">正确答案</el-checkbox>
          </el-col>
        </el-form-item>

        <!-- <el-form-item label="选项A" :label-width="formLabelWidth">
          <el-col :span="18">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[0].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="选项B" :label-width="formLabelWidth">
          <el-col :span="18">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[1].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="选项C" :label-width="formLabelWidth" v-if="editform.answerList.length > 2">
          <el-col :span="18">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[2].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="选项D" :label-width="formLabelWidth" v-if="editform.answerList.length > 3">
          <el-col :span="18">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[3].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="选项E" :label-width="formLabelWidth" v-if="editform.answerList.length > 4">
          <el-col :span="18">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[4].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="选项F" :label-width="formLabelWidth" v-if="editform.answerList.length > 5">
          <el-col :span="18">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[5].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="选项G" :label-width="formLabelWidth" v-if="editform.answerList.length > 6">
          <el-col :span="18">
            <el-input size="small" placeholder="请输入选项内容" v-model="editform.answerList[6].answer_content" :disabled="editform.question.is_can_edit == '2'"></el-input>
          </el-col>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="updateQuestion" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getQuestionList,deleteQuestion,updateQuestion } from "@/api/growthCamp";
import Pagination from '@/components/Pagination';
import Sticky from "@/components/Sticky";

export default {
  name:'',
  components: { Pagination,Sticky },
  data(){
    return{
      listLoading: true,
      lists:[],
      listQuery: {
        sign_id: this.$route.params.Signid,
        page_num: 1,
        page_size: 10,
        search_question_name: '',
        search_target_day: '',
      },
      total: 0,
      value:'',
      trueAnswer:'',
      sign_name:'',
      radio:[],
      dialogFormVisible: false,
      form:{},
      formLabelWidth: '100px',
      maxAnswerRowNum:'',
      options:[
      ],
      editform:{
        question: {
          "question_content": "我是问题11111111",
          "question_id": ""
        },
        answerList: [
          {
            "answer_content": "11",
            "option_type": "A",
            "option_sort": "1",
            "is_true_answer": false
          },
          {
            "answer_content": "22",
            "option_type": "B",
            "option_sort": "2",
            "is_true_answer": false
          }
        ]
      }
    }
  },
  created(){
    this.getQuestionList();
  },
  methods:{
    getQuestionList(){
      this.listLoading = true;
      getQuestionList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          if(res.result.signInfo){
            this.sign_name = res.result.signInfo.sign_name;
          }
          // this.lists = res.result.questionAnswerList;
          // res.result.questionAnswerList.sort(function(a,b){
          //   return a.id - b.id
          // })
          this.maxAnswerRowNum = res.result.maxAnswerRowNum;
          for (let k = 0,len=res.result.questionAnswerList.length; k < len; k++) {
            this.options.push(
              {
                value: res.result.questionAnswerList[k].question.question_time,
                label: res.result.questionAnswerList[k].question.question_time,
              }
            )
          }

          for (let k = 0,len=res.result.questionAnswerList.length; k < len; k++) {
            res.result.questionAnswerList[k].answerList.sort(function(a,b){
              return a.option_sort - b.option_sort
            })
          }

          //日期去重
          let obj = {};
          this.options = this.options.reduce((cur,next) => {
              obj[next.day] ? "" : obj[next.day] = true && cur.push(next);
              return cur;
          },[]);
          this.lists = res.result.questionAnswerList;
          this.total = Number(res.result.count);
          console.log('this.options',this.options);
        }
      });
    },
    goDel(id){
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteQuestion({question_id:id}).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getQuestionList();
          }
        });
      }).catch(() => {         
      });
    },
    goEdit(v){
      // console.log('goEdit',v);
      // for (let k = 0; k < v.length; k++) {
      //   v[k].answerList.sort((a,b)=>{
      //     return a.option_sort - b.option_sort;
      //   });
      // }
      for (let k = 0, len=v.answerList.length; k < len; k++) {
        if(v.answerList[k].is_true_answer == '1'){
          v.answerList[k].is_true_answer = true;
        }else{
          v.answerList[k].is_true_answer = false;
        }
      }

      this.editform = v;
      this.dialogFormVisible = true;
      
    },
    addSign(){
      let id = this.listQuery.sign_id;
      sessionStorage.setItem('itemBank',2);
      this.$router.push({ path: `../newAddend/${id}` });
    },
    delAnswer(i){
      if(this.editform.answerList.length == 2){
        this.$message({
          message: '至少包含两个选项！',
          type: 'warning'
        });
      }else{
        this.editform.answerList.splice(i,1);
      }
    },
    addAnswer(){
      if(this.editform.answerList.length == 2){
        this.editform.answerList.push(
          {
            "answer_content": "",
            "option_type": "C",
            "option_sort": "3",
            "is_true_answer": "2"
          },
        )
      }else{
        this.editform.answerList.push(
          {
            "answer_content": "",
            "option_type": "D",
            "option_sort": "4",
            "is_true_answer": "2"
          },
        )
      }
    },
    selectAnswer(v){
      for (let k = 0,len = this.editform.answerList.length; k < len; k++) {
        this.editform.answerList[k].is_true_answer = '2';
      }
      this.editform.answerList[v-1].is_true_answer = '1';
    },
    updateQuestion(){
      let data = {
        "question": {
          "question_type": this.editform.question.question_type,
          "question_content": this.editform.question.question_content,
          "question_id": this.editform.question.question_id,
        },
        "answerList": this.editform.answerList
      }
      console.log('updateQuestion', data);
      updateQuestion(data).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.getQuestionList();
        }
      });
    },
    searchData(){
      this.listQuery.page_num = 1;
      this.getQuestionList();
    },
    changePaging(){
      this.getQuestionList();
    },
    getQuestionList2(){
      this.listQuery.page_num = 1;
      this.getQuestionList();
    }
  }
}
</script>

<style lang="scss" scoped>
.app_container{
  padding: 20px;
  h3{
    margin: -5px 0 10px;
  }
  .title-header{
    margin-bottom: 20px;
  }
  .el-icon-delete {
    font-size: 19px;
    margin: 0 7px;
  }
  .trueAnswer{
    color: #57A7FA;
    font-weight: bold;
  }
  .eltables{
    min-height: 500px;
  }
}
</style>
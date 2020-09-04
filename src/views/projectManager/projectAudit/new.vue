<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">{{title}}</el-col>
    </sticky>

    <!-- <el-form v-if="reviseFlag" :model="reviseCase" class="form-wrap" label-width="140px">
      <el-form-item label="历史审核结果：">
        <el-col :span="24" v-for="(item, index) in reviseCase.opinion_content" :key="index">{{item.value}}</el-col>
        <el-col :span="24">提交时间：2019-02-12 11:00:00 审核时候：2019-02-12 11:00:00 1、内容主旨与问题不相符</el-col>
      </el-form-item>
    </el-form>-->

    <!-- <el-form v-for="(form,index) in array" :rules="rules" :key="index" ref="form" :model="form" class="form-wrap gender-wrap" label-width="140px">
      <el-form-item label="*选择问题：">
        <el-col :span="6">
          <el-cascader
            :options="form.options"
            v-model="form.selectedOptions0"
            @change="handleChangeTeam"></el-cascader>
        </el-col>
        <el-col :span="2" v-if="index == 0"><el-button type="primary" @click="addRequest(index)">添加</el-button></el-col>
         <el-col :span="2" v-else><el-button type="primary" @click="reduceRequest(index)">删减</el-button></el-col>
      </el-form-item>
      <el-form-item label="" class="question">
        <el-col :span="12">
          <el-select v-model="form.value0" multiple placeholder="请选择问题" @change="handleChangeReq">
            <el-option
              v-for="item in form.qustion"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5" class="input-prompt">至少选择一个问题，可多选</el-col>
      </el-form-item>
    </el-form>-->

    <el-form
      v-if="examineShow"
      :ref="formProblem"
      :model="formProblem"
      class="form-wrap"
      label-width="140px"
    >
      <el-form-item label="历史审核记录：" prop="case_title">
        <el-col
          :span="24"
          class="history-wrap"
          v-if="optioninfo.length > 0">
          <el-col
            class="history-item"
            v-for="(item, index) in optioninfo"
            :key="index"
            :span="24">
            <el-col :span="24">{{index+1}} 、 {{item.opinion_content}}</el-col>
            <el-col :span="24">提交时间：{{item.create_time}}</el-col>
            <el-col :span="24">
              审核时间：
              <span v-if="item.role_type == 2">教研</span>
              <span v-else-if="item.role_type == 3">项目经理</span>
              /{{item.nickname}}
              {{item.examine_time}}
           </el-col>
          </el-col>
        </el-col>
        <el-col :span="24" class="history-wrap" v-else>暂无历史审核记录</el-col>
      </el-form-item>

      <el-form-item label="问题标签：" prop="case_title">
        <el-col :span="13">
          <el-table
            :height="problemHeight"
            v-loading="problemLoading"
            :data="problemList"
            border
            size="mini"
          >
            <el-table-column label="年龄段">
              <template slot-scope="scope">
                <el-col class="overflow">{{ scope.row.age_label_name }}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="一级标签名称">
              <template slot-scope="scope">{{scope.row.first_label_name}}</template>
            </el-table-column>
            <el-table-column label="二级标签名称">
              <template slot-scope="scope">{{scope.row.second_label_name}}</template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-form-item>

      <el-form-item label="基本信息：" prop="case_title">
        <el-col :span="20">
          <el-table
            :height="informationHeight"
            v-loading="informationLoading"
            :data="informationList"
            border
            size="mini"
          >
            <el-table-column label="*用户姓名">
              <template slot-scope="scope">
                <el-col class="overflow">{{ scope.row.parent_nickname }}</el-col>
              </template>
            </el-table-column>
            <el-table-column label="*用户手机号">
              <template slot-scope="scope">{{scope.row.parent_mobile}}</template>
            </el-table-column>
            <el-table-column label="*训练营名称">
              <template slot-scope="scope">{{scope.row.goods_name}}</template>
            </el-table-column>
            <el-table-column label="*群名称">
              <template slot-scope="scope">{{scope.row.group_name}}</template>
            </el-table-column>
            <el-table-column label="*孩子性别" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.child_sex == 1">男</span>
                <span v-if="scope.row.child_sex == 2">女</span>
                <span v-else>未知</span>
              </template>
            </el-table-column>
            <el-table-column label="*与孩子的关系" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.parent_sex == 1">父亲</span>
                <span v-if="scope.row.parent_sex == 2">母亲</span>
                <span v-else>未知</span>
              </template>
            </el-table-column>
            <el-table-column label="*孩子年龄" width="100">
              <template slot-scope="scope">{{scope.row.child_age?scope.row.child_age:'未知'}}</template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-form-item>
    </el-form>

    <el-form
      :inline="true"
      ref="form"
      :rules="rules"
      :model="form"
      class="form-wrap"
      label-width="140px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="标题：" prop="case_title">
            <el-col :span="24">
              <el-input
                style="width:500px;"
                size="medium"
                placeholder="请输入标题"
                v-model="form.case_title"
              />
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

     <!--  <el-row>
        <el-col :span="24">
          <el-form-item label="用户问题：" prop="first_asked">
            <span class="tips">家长入群后的提问，以及发现提问背后的用户问题</span>
            <el-col :span="24">
              <tinymce v-model="form.first_asked"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row> -->

      <el-row>
        <el-col :span="24">
          <el-form-item label="孩子当时情况：" prop="child_situation">
            <span class="tips">家长认为孩子有什么问题</span>
            <el-col :span="24">
              <tinymce v-model="form.child_situation"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="诊断：" prop="diagnosis">
            <span class="tips">问题分析必须指向家长的行为认知</span>
            <el-col :span="24">
              <tinymce v-model="form.diagnosis"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="建议指导：" prop="suggest">
            <span class="tips">辅导员做了哪些具体的指导(分析、方向、具体步骤等)</span>
            <el-col :span="24">
              <tinymce v-model="form.suggest"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="用户行动：" prop="user_action">
            <span class="tips">家长做了哪些事，必须落实到家长具体行为的改变</span>
            <el-col :span="24">
              <tinymce v-model="form.user_action"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="成效：" prop="effect">
            <span class="tips">孩子的问题改善，改变后孩子的状态</span>
            <el-col :span="24">
              <tinymce v-model="form.effect"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="见证性材料：" prop="case_track">
            <span class="tips"></span>
            <el-col :span="24">
              <tinymce v-model="form.case_track"></tinymce>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="padding-left: 140px;">
        <el-button type="primary" @click="onSubmit('form')">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { getCaseDetail, caseDetailSubmit } from '@/api/project'
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce-water'
export default {
  components: { Sticky, Tinymce },
  data() {
    return {
      examineShow: false,
      problemList: [],
      problemHeight: null,
      problemLoading: false,
      informationHeight: null,
      informationList: [],
      informationLoading: false,
      reviseFlag: false,
      //修订案例的详情
      reviseCase: {
        opinion_content: []
      },
      qustion_id: '', //补充
      revise_id: '', //修订
      title: '',
      array: [],
      form: {
        case_id: null,
        case_title: '',
        // first_asked: '',
        child_situation: '',
        diagnosis: '',
        suggest: '',
        user_action: '',
        effect: '',
        case_track: ''
      },
      formProblem: {},
      optioninfo: [],
      user_name: [],
      user_phone: [],
      training_camp_name: [],
      group_name: [],
      child_sex: [
        { "label": "男", "value": "1" },
        { "label": "女", "value": "2" }
      ],
      child_relation: [
        { "label": "妈妈", "value": "1" },
        { "label": "爸爸", "value": "2" },
        { "label": "其他", "value": "3" },
      ],
      rules: {
        case_title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        // first_asked: [
        //   { required: true, message: '请输入用户问题', trigger: 'blur' }
        // ],
        child_situation: [
          { required: true, message: '请输入孩子当时情况', trigger: 'blur' }
        ],
        diagnosis: [
          { required: true, message: '请输入诊断', trigger: 'blur' }
        ],
        suggest: [
          { required: true, message: '请输入建议指导', trigger: 'blur' }
        ],
        user_action: [
          { required: true, message: '请输入用户行动', trigger: 'blur' }
        ],
        effect: [
          { required: true, message: '请输入成效', trigger: 'blur' }
        ],
        case_track: [
          { required: true, message: '请输入见证性材料', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.caseId = this.$route.params.id;
    console.log(this.caseId, '待审核案例 - 采纳编辑')
    if (this.case_id != 0) {
      this.examineShow = true;
      this.title = "采纳编辑";
      this.getCaseDetail(this.caseId);
    }
  },
  methods: {
    // 待审核案例 采纳 详情
    getCaseDetail(case_id) {
      const map = {
        case_id
      }
      this.problemLoading = true;
      this.informationLoading = true;
      getCaseDetail(map).then((res) => {
        if (res.code == 200) {
          this.problemLoading = false;
          this.informationLoading = false;
          this.problemList = res.result.label_ids;
          this.informationList = res.result.info;
          this.form = res.result.form_data;
          this.optioninfo = res.result.optioninfo;
        }
      })
    },
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.caseDetailSubmit();
        } else {
          this.$message({
            message: '请填写必填项哦',
            type: 'warning'
          });
          return false;
        }
      });
    },
    caseDetailSubmit(){
      const data = this.form;
      data.case_id = this.caseId;
      caseDetailSubmit(data).then(res => {
        if(res.code === 200){
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.$router.go(-1);
        }
      })
    },
    onCancel() {
      this.$confirm('取消后不会保留已修改信息,确认取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.go(-1)
      }).catch(() => {
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  padding: 0 0 10px;
  .table-wrap {
    padding: 10px;
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
.form-wrap {
  padding-top: 20px;
}
.form-wrap {
  .input-prompt {
    font-size: 12px;
    color: red;
    padding-left: 20px;
  }
  #sel-goods-btn {
    width: 200px;
    height: 30px;
    background-color: #fff;
    opacity: 1;
    color: #5a8bff;
    border: 1px solid #ddd;
    cursor: pointer;
  }
  #sel-goods-btn:focus {
    outline: none;
  }
}
.question .el-select {
  width: 510px;
}
.tips {
  font-size: 16px;
  color: #bbb;
  display: inline-block;
  width: 500px;
}
</style>




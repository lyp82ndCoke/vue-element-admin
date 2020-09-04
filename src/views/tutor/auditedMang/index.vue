<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="待审核" name="first">
          <el-tabs v-model="auditedName" type="card" @tab-click="handleTag">
            <el-tab-pane label="待审核问答" name="first">
              <el-col :span="24" class="title-header">
                <el-col :span="5">
                  <el-input
                    size="small"
                    placeholder="问题搜索"
                    prefix-icon="el-icon-search"
                    clearable
                    v-model="searchText"
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
                :height="questionHeight"
                v-loading="questionLoading"
                :data="questionList"
                element-loading-text="Loading"
                border
                fit
                size="mini"
                highlight-current-row
                align="middle"
              >
                <el-table-column label="问题场景" align="center">
                  <template slot-scope="scope">
                    <el-col class="text_overflow">
                      <div @click="questionAlert(scope.row.object_id)">{{ scope.row.title }}</div>
                    </el-col>
                  </template>
                </el-table-column>
                <el-table-column label="答案" align="center">
                  <template slot-scope="scope">
                    <el-col class="overflow">{{ scope.row.answer }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column label="提交人/日期" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.real_name }}</el-col>
                    <el-col :span="24">{{ scope.row.create_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column label="审核意见" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.opinion_content ? scope.row.opinion_content : '-----' }}</el-col>
                    <el-col :span="24">{{ scope.row.opinion_time }}</el-col>
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
                      @click="adoptObject(1,scope.row.object_id)"
                    >采纳</el-button>
                    <el-button
                      size="small"
                      type="text"
                      @click="questionRevise(scope.row.object_id)"
                    >修订</el-button>
                    <el-button
                      size="small"
                      type="text"
                      @click="discardComment(scope.row.object_id)"
                    >废弃</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                class="pagination"
                v-show="questionTotal>0"
                :total="questionTotal"
                :page.sync="listQuery.page_num"
                :limit.sync="listQuery.page_size"
                v-on:pagination="changeQuestion"
              />
            </el-tab-pane>
            <el-tab-pane label="待审核答案" name="second">
              <el-col :span="24" class="title-header">
                <el-col :span="5">
                  <el-input
                    size="small"
                    placeholder="问题搜索"
                    clearable
                    prefix-icon="el-icon-search"
                    v-model="searchText"
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
                :height="answerHeight"
                v-loading="answerLoading"
                :data="answerList"
                element-loading-text="Loading"
                border
                fit
                size="mini"
                highlight-current-row
                align="middle"
              >
                <el-table-column label="问题场景" align="center">
                  <template slot-scope="scope">
                    <el-col class="overflow">{{ scope.row.title }}</el-col>
                  </template>
                </el-table-column>

                <el-table-column label="提交人/日期" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.real_name }}</el-col>
                    <el-col :span="24">{{ scope.row.create_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column label="答案" align="center">
                  <template slot-scope="scope">
                    <el-col class="text_overflow">
                      <div @click="answerAlert(scope.row.object_id)">{{ scope.row.answer }}</div>
                    </el-col>
                  </template>
                </el-table-column>
                <el-table-column label="审核意见" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.opinion_content ? scope.row.opinion_content : '-----' }}</el-col>
                    <el-col :span="24">{{ scope.row.opinion_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="230"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="scope">
                    <el-button size="small" type="text" @click="answerAdopt(2,scope.row.object_id)">采纳</el-button>
                    <el-button
                      size="small"
                      type="text"
                      @click="questionRevise(scope.row.object_id)"
                    >修订</el-button>
                    <el-button
                      size="small"
                      type="text"
                      @click="discardComment(scope.row.object_id)"
                    >废弃</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                class="pagination"
                v-show="answerTotal>0"
                :total="answerTotal"
                :page.sync="listQuery.page_num"
                :limit.sync="listQuery.page_size"
                v-on:pagination="changeAnswer"
              />
            </el-tab-pane>
            <el-tab-pane label="待审核案例" name="third">
              <el-col :span="24" class="title-header">
                <el-col :span="5">
                  <el-input
                    size="small"
                    placeholder="问题搜索"
                    clearable
                    prefix-icon="el-icon-search"
                    v-model="searchText"
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
                align="middle"
              >
                <el-table-column label="案例提交人/日期" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.real_name }}</el-col>
                    <el-col :span="24">{{ scope.row.create_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column label="案例标题" align="center">
                  <template slot-scope="scope">
                    <el-col class="text_overflow">
                      <div @click="caseTitle(scope.row.object_id)">{{ scope.row.title}}</div>
                    </el-col>
                  </template>
                </el-table-column>
                <el-table-column label="审核意见" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.opinion_content ? scope.row.opinion_content : '-----' }}</el-col>
                    <el-col :span="24">{{ scope.row.opinion_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="230"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="scope">
                    <el-button size="small" type="text" @click="caseAdopt(3,scope.row.object_id)">采纳</el-button>
                    <el-button
                      size="small"
                      type="text"
                      @click="questionRevise(scope.row.object_id)"
                    >修订</el-button>
                    <el-button
                      size="small"
                      type="text"
                      @click="discardComment(scope.row.object_id)"
                    >废弃</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                class="pagination"
                v-show="caseTotal>0"
                :total="caseTotal"
                :page.sync="listQuery.page_num"
                :limit.sync="listQuery.page_size"
                v-on:pagination="changeCase"
              />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="已完成审核" name="second">
          <el-tabs v-model="completeName" type="card" @tab-click="handleComplete">
            <el-tab-pane label="已审核问答" name="first">
              <el-col :span="24" class="title-header">
                <el-col :span="5">
                  <el-input
                    size="small"
                    placeholder="问题搜索"
                    clearable
                    prefix-icon="el-icon-search"
                    v-model="searchTextComplete"
                  ></el-input>
                </el-col>
                <el-col :span="2" class="success-btn">
                  <el-button
                    type="success"
                    @click="searchComplete"
                    icon="el-icon-search"
                    size="small"
                  >搜索</el-button>
                </el-col>
              </el-col>
              <el-table
                :height="questionHeightCom"
                v-loading="questionLoadingCom"
                :data="questionListCom"
                element-loading-text="Loading"
                border
                fit
                size="mini"
                highlight-current-row
                align="middle"
              >
                <el-table-column label="问题场景" align="center">
                  <template slot-scope="scope">
                    <el-col class="text_overflow">
                      <div @click="questionAlertShow(scope.row.object_id)">{{ scope.row.title }}</div>
                    </el-col>
                  </template>
                </el-table-column>
                <el-table-column label="答案" align="center">
                  <template slot-scope="scope">
                    <el-col class="overflow">{{ scope.row.answer }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column label="提交人/日期" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.real_name }}</el-col>
                    <el-col :span="24">{{ scope.row.create_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column label="审核意见" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.opinion_content ? scope.row.opinion_content : '-----' }}</el-col>
                    <el-col :span="24">{{ scope.row.opinion_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  label="审核结果"
                  align="center"
                  width="230"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">审核中</span>
                    <span v-else-if="scope.row.status == 2">已采纳</span>
                    <span v-else-if="scope.row.status ==3">修订</span>
                    <span v-else>已废弃</span>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                class="pagination"
                v-show="questionTotalCom>0"
                :total="questionTotalCom"
                :page.sync="listQuery.page_num"
                :limit.sync="listQuery.page_size"
                v-on:pagination="changeQuestionCom"
              />
            </el-tab-pane>
            <el-tab-pane label="已审核答案" name="second">
              <el-col :span="24" class="title-header">
                <el-col :span="5">
                  <el-input
                    size="small"
                    clearable
                    placeholder="问题搜索"
                    prefix-icon="el-icon-search"
                    v-model="searchTextComplete"
                  ></el-input>
                </el-col>
                <el-col :span="2" class="success-btn">
                  <el-button
                    type="success"
                    @click="searchComplete"
                    icon="el-icon-search"
                    size="small"
                  >搜索</el-button>
                </el-col>
              </el-col>
              <el-table
                :height="answerHeightCom"
                v-loading="answerLoadingCom"
                :data="answerListCom"
                element-loading-text="Loading"
                border
                fit
                size="mini"
                highlight-current-row
                align="middle"
              >
                <el-table-column label="问题场景" align="center">
                  <template slot-scope="scope">
                    <el-col class="overflow">{{ scope.row.title }}</el-col>
                  </template>
                </el-table-column>

                <el-table-column label="提交人/日期" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.real_name }}</el-col>
                    <el-col :span="24">{{ scope.row.create_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column label="答案" align="center">
                  <template slot-scope="scope">
                    <el-col class="text_overflow">
                      <div @click="showAnswerDetail(scope.row.object_id)">{{ scope.row.answer }}</div>
                    </el-col>
                  </template>
                </el-table-column>
                <el-table-column label="审核意见" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.opinion_content ? scope.row.opinion_content : '-----' }}</el-col>
                    <el-col :span="24">{{ scope.row.opinion_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  label="审核结果"
                  align="center"
                  width="230"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">审核中</span>
                    <span v-else-if="scope.row.status == 2">已采纳</span>
                    <span v-else-if="scope.row.status ==3">修订</span>
                    <span v-else>已废弃</span>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                class="pagination"
                v-show="answerTotalCom>0"
                :total="answerTotalCom"
                :page.sync="listQuery.page_num"
                :limit.sync="listQuery.page_size"
                v-on:pagination="changeAnswerCom"
              />
            </el-tab-pane>
            <el-tab-pane label="已审核案例" name="third">
              <el-col :span="24" class="title-header">
                <el-col :span="5">
                  <el-input
                    size="small"
                    placeholder="问题搜索"
                    clearable
                    prefix-icon="el-icon-search"
                    v-model="searchTextComplete"
                  ></el-input>
                </el-col>
                <el-col :span="2" class="success-btn">
                  <el-button
                    type="success"
                    @click="searchComplete"
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
                align="middle"
              >
                <el-table-column label="案例提交人/日期" align="center">
                  <template slot-scope="scope">
                    <el-col :span="24">{{ scope.row.real_name }}</el-col>
                    <el-col :span="24">{{ scope.row.create_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column label="案例标题" align="center">
                  <template slot-scope="scope">
                    <el-col class="text_overflow">
                      <div @click="showCaseDetail(scope.row.object_id)">{{ scope.row.title}}</div>
                    </el-col>
                  </template>
                </el-table-column>
                <el-table-column label="审核意见" align="center">
                  <template slot-scope="scope">
                    <!-- <span>{{ scope.row.opinion_content ? scope.row.opinion_content : '-----' }}</span> -->
                    <el-col :span="24">{{ scope.row.opinion_content ? scope.row.opinion_content : '-----' }}</el-col>
                    <el-col :span="24">{{ scope.row.opinion_time }}</el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  label="审核结果"
                  align="center"
                  width="230"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">审核中</span>
                    <span v-else-if="scope.row.status == 2">已采纳</span>
                    <span v-else-if="scope.row.status ==3">修订</span>
                    <span v-else>已废弃</span>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                class="pagination"
                v-show="caseTotalCom>0"
                :total="caseTotalCom"
                :page.sync="listQuery.page_num"
                :limit.sync="listQuery.page_size"
                v-on:pagination="changeCaseCom"
              />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </el-col>

    <!-- 待审核问答 采纳 编辑 alert -->
    <el-col :span="24" v-if="problem_scenario" class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="24">
          <div class="add-com">采纳编辑</div>
        </el-col>
        <el-col :span="24" class="title-header">
          <el-form
            ref="form"
            size="small"
            :rules="rules"
            :model="form"
            label-width="140px"
            class="form_name"
          >
            <!-- <el-form-item label="问题属性：" prop="question_class_id" class="input_element">
                <el-select v-model="form.question_class_id" clearable clearable placeholder="请选择">
                  <el-option
                    v-for="item in problem_arrtibute"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>-->

            <el-row>
              <el-col :span="24">
                <el-form-item label="主题：" required>
                  <!-- 年龄段 -->
                  <el-form-item>
                    <el-select
                      v-model="ageValue"
                      @change="changeAge"
                      size="small"
                      placeholder="请选择年龄段"
                      disabled
                    >
                      <el-option
                        v-for="(item,index) in options"
                        :key="item.label_id"
                        :label="item.title"
                        data-index="index"
                        :value="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- 分类和标签 -->
                  <el-row v-for="(item,index) in form.themeArr" :key="index" style="margin-top:18px;">
                    <el-col :span="5">
                      <!-- 分类 begin -->
                      <el-form-item
                        v-if="optionsTheme.length"
                        :prop="`themeArr.${index}`"
                        :rules="rules.relation_id"
                      >
                        <el-cascader
                          :props="themeProps"
                          size="small"
                          :options="optionsTheme"
                          v-model="form.themeArr[index]"
                          placeholder="请选择主题"
                          @change="handleChange"
                        ></el-cascader>
                      </el-form-item>
                      <el-form-item v-else :prop="`themeArr.${index}`" :rules="rules.relation_id">
                        <el-cascader
                          :props="themeProps"
                          size="small"
                          :options="[]"
                          v-model="form.themeArr[index]"
                          placeholder="请选择主题"
                          @change="handleChange"
                        ></el-cascader>
                      </el-form-item>
                      <!-- 分类 end -->
                    </el-col>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="2">
                      <i
                        class="icon el-icon-circle-plus-outline icon_add"
                        @click="addTheme"
                        v-if="index===0"
                      ></i>
                      <i
                        class="icon el-icon-remove-outline icon_add"
                        v-else
                        @click="removeTheme(index)"
                      ></i>
                    </el-col>
                  </el-row>
                  <!-- </el-col> -->
                </el-form-item>
              </el-col>
            </el-row>

            <!-- <el-row class="input-prompt">
              <el-col :span="6" align="right" style="margin-bottom:10px;">至少选择一个问题，可多选</el-col>
            </el-row>-->

            <el-form-item label="问题场景：" prop="question" class="input_element">
              <el-input
                type="textarea"
                :rows="5"
                resize="none"
                v-model="form.question"
                class="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item label="如何解决：" prop="answer_content">
              <el-input
                type="textarea"
                :rows="5"
                resize="none"
                v-model="form.answer_content"
                class="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item label="历史审核记录" v-if="opinions.length>0">
              <el-col :span="24" v-for="(item, index) in opinions" :key="index">
                <el-row>{{index+1 + '、' + item.opinion_content }}</el-row>
                <el-row>{{'提交时间：' + item.create_time}}</el-row>
              </el-col>
            </el-form-item>

            <el-form-item label="历史审核记录" v-else>
              <el-col :span="24">
                <el-row>暂无审核记录</el-row>
              </el-col>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24" class="btn-bottom">
          <el-col :span="7" align="right">
            <el-button type="primary" @click="sureRelation('form')">保存</el-button>
          </el-col>
          <el-col :span="3" align="right">
            <el-button type="info" @click="questionHidden">取消</el-button>
          </el-col>
        </el-col>
      </el-col>
    </el-col>

    <!-- 待审核答案 答案 alert -->
    <el-col :span="24" v-if="answer_scenario" class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="24">
          <div class="add-com">采纳编辑</div>
        </el-col>
        <el-col :span="24" class="title-header">
          <el-form
            ref="formAnswer"
            size="small"
            :rules="rulesAnswer"
            :model="formAnswer"
            label-width="140px"
            class="form_name"
          >
            <el-form-item label="问题场景：" prop="question" class="input_element">
              <el-input
                type="textarea"
                :rows="6"
                resize="none"
                v-model="formAnswer.question"
                class="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item label="如何解决：" prop="answer_content">
              <el-input
                type="textarea"
                :rows="6"
                resize="none"
                v-model="formAnswer.answer_content"
                class="textarea"
              ></el-input>
            </el-form-item>

            <el-form-item label="历史审核记录" v-if="opinions.length>0">
              <el-col :span="24" v-for="(item, index) in opinions" :key="index">
                <el-row>{{index+1 + '、' + item.opinion_content }}</el-row>
                <el-row>{{'提交时间：' + item.create_time}}</el-row>
              </el-col>
            </el-form-item>

            <el-form-item label="历史审核记录：" v-else>
              <el-col :span="24">
                <el-row>暂无审核记录</el-row>
              </el-col>
            </el-form-item>
            <el-form-item label="已采纳答案：" v-if="historyAnswer.length>0">
              <el-col v-for="(item,index) in historyAnswer" :key="index">
                <p class="disable-p">{{item.answer}}</p>
                {{item.nickname}} {{item.create_time}}
              </el-col>
            </el-form-item>

          </el-form>
        </el-col>

        <el-col :span="24" class="btn-bottom">
          <el-col :span="7" align="right">
            <el-button type="primary" @click="sureAnswer('formAnswer')">保存</el-button>
          </el-col>
          <el-col :span="3" align="right">
            <el-button type="info" @click="answerHidden">取消</el-button>
          </el-col>
        </el-col>
      </el-col>
    </el-col>

    <!-- 修订 alert -->
    <el-col :span="24" v-if="revise" class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="24">
          <div class="add-com">修订意见</div>
        </el-col>
        <el-col :span="24" class="title-header">
          <el-form
            ref="formRevise"
            size="small"
            :rules="rulesRevise"
            :model="formRevise"
            label-width="140px"
            class="form_name"
          >
            <el-form-item label="修订意见：" prop="opinion_content" class="input_element">
              <el-input
                type="textarea"
                :rows="12"
                resize="none"
                v-model="formRevise.opinion_content"
                class="textarea"
              ></el-input>
            </el-form-item>

            <el-form-item label="历史审核记录:" v-if="content.length>0">
              <el-col :span="24" v-for="(item, index) in content" :key="index">
                <el-row>{{index+1 + '、' + item.opinion_content }}</el-row>
                <el-row>{{'提交时间：' + item.create_time}}</el-row>
                <!-- <el-row>{{'审核时间：' + item.opinion_time}}</el-row> -->
              </el-col>
            </el-form-item>

            <el-form-item label="历史审核记录:" v-else>
              <el-col :span="24">
                <el-row>暂无审核记录</el-row>
              </el-col>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24" class="btn-bottom">
          <el-col :span="7" align="right">
            <el-button type="danger" @click="sureRevise('formRevise')">发布</el-button>
          </el-col>
          <el-col :span="3" align="right">
            <el-button type="info" @click="reviseHidden">取消</el-button>
          </el-col>
        </el-col>
      </el-col>
    </el-col>

    <!-- 已审核问答 alert -->
    <div :span="24" v-show="questionAlertDetail" class="alert-wrap" @click.self="hiddenAlertDetail">
      <el-col :span="24" class="alert-content-wrap" style="overflow-y: auto;">
        <el-form
          ref="form"
          :inline="true"
          :model="question_detail"
          class="form-wrap"
          label-width="140px"
        >
          <!-- <el-form-item label="问题属性：" class="item-gender" prop="user_name">
            <template>{{ question_detail.question_class_name }}</template>
          </el-form-item>-->

          <!-- <el-row :span="24">
            <el-col :span="24">
              <el-col :span="3" align="right" class="left-title">主题：</el-col>
              <el-row>{{ question_detail.age_label_name }}</el-row>
              <el-row :span="24" v-for="item in question_detail.label_ids" style="margin-top:10px;">
                <el-col :span="8" align="center">{{ item.first_label_name }}</el-col>
                <el-col :span="4">{{ item.seconr_label_name }}</el-col>
              </el-row>
            </el-col>
          </el-row>-->

          <el-row>
            <el-col :span="24" style="padding-top:20px;">
              <el-col :span="3" align="right" class="left-title">问题场景：</el-col>
              <el-col :span="21">{{ question_detail.question }}</el-col>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24" class="comment-padding">
              <el-col :span="3" align="right" class="left-title">如何解决：</el-col>
              <el-col :span="21">{{ question_detail.answer_content }}</el-col>
            </el-col>
          </el-row>

          <el-form-item label="历史审核记录：" v-if="quest_opinions.length > 0">
            <el-col :span="24" v-for="(item, index) in quest_opinions" :key="index">
              <el-row>{{index+1 + '、' + item.opinion_content }}</el-row>
              <el-row>{{'提交时间：' + item.create_time}}</el-row>
            </el-col>
          </el-form-item>

          <el-form-item label="历史审核记录：" v-else>
            <el-col :span="24">
              <el-row>暂无审核记录</el-row>
            </el-col>
          </el-form-item>

         


        </el-form>
      </el-col>
    </div>

    <!-- 已审核答案 alert -->
    <div :span="24" v-show="answerAlertDetail" class="alert-wrap" @click.self="hiddenAnswerDetail">
      <el-col :span="24" class="alert-content-wrap" style="overflow-y: auto;">
        <el-form
          ref="form"
          :inline="true"
          :model="answer_detail"
          class="form-wrap"
          label-width="140px"
        >
          <el-row>
            <el-col :span="24" class="comment-padding">
              <el-col :span="3" align="right" class="left-title">问题场景：</el-col>
              <el-col :span="21">{{ answer_detail.question }}</el-col>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24" class="comment-padding">
              <el-col :span="3" align="right" class="left-title">如何解决：</el-col>
              <el-col :span="21">{{ answer_detail.answer_content }}</el-col>
            </el-col>
          </el-row>

          <el-form-item label="历史审核记录：" v-if="answer_opinions.length>0">
            <el-col :span="24" v-for="(item, index) in answer_opinions" :key="index">
              <el-row>{{index+1 + '、' + item.opinion_content }}</el-row>
              <el-row>{{'提交时间：' + item.create_time}}</el-row>
            </el-col>
          </el-form-item>
          <el-form-item label="历史审核记录：" v-else>
            <el-col :span="24">
              <el-row>暂无审核记录</el-row>
            </el-col>
          </el-form-item>

          <el-row>
            <el-form-item label="已采纳答案：" v-if="historyAnswer.length>0">
              <el-col v-for="(item,index) in historyAnswer" :key="index">
                <p class="disable-p">{{item.answer}}</p>
                {{item.nickname}} {{item.create_time}}
              </el-col>
            </el-form-item>
          </el-row>
        </el-form>
      </el-col>
    </div>

    <!-- 已审核案例 alert -->
    <div :span="24" v-if="caseAlertDetail" class="alert-wrap" @click.self="hiddenCaseDetail">
      <el-col :span="24" class="alert-content-wrap case-table" style="overflow-y: auto;">
        <el-form
          ref="form"
          :inline="true"
          :model="case_detail"
          class="form-wrap"
          label-width="140px"
        >
          <el-col :span="24">
            <el-form-item label="问题标签：" prop="case_title" style="width:85%;">
              <el-col :span="24">
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
                  <el-table-column label="问题标签">
                    <template slot-scope="scope">{{ scope.row.second_label_name }}</template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="基本信息：" prop="case_title" style="width:85%;">
              <el-col :span="24">
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
                    <template slot-scope="scope">{{scope.row.child_sex == 1 ? '男孩' : '女孩'}}</template>
                  </el-table-column>
                  <el-table-column label="*与孩子的关系" width="100">
                    <template slot-scope="scope">
                      <span v-if="scope.row.child_relation == 1">爸爸</span>
                      <span v-else-if="scope.row.child_relation == 2">妈妈</span>
                      <span v-else>其他</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="*孩子年龄" width="100">
                    <template slot-scope="scope">{{scope.row.child_age}}</template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">标题：</el-col>
            <el-col :span="21">{{ case_detail.case_title }}</el-col>
          </el-col>

          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">用户问题：</el-col>
            <el-col :span="21" v-html="case_detail.first_asked">{{ case_detail.first_asked }}</el-col>
          </el-col>

          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">孩子当时情况：</el-col>
            <el-col
              :span="21"
              v-html="case_detail.child_situation"
            >{{ case_detail.child_situation }}</el-col>
          </el-col>
          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">诊断：</el-col>
            <el-col :span="21" v-html="case_detail.diagnosis">{{ case_detail.diagnosis }}</el-col>
          </el-col>
          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">建议指导：</el-col>
            <el-col :span="21" v-html="case_detail.suggest">{{ case_detail.suggest }}</el-col>
          </el-col>
          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">用户行动：</el-col>
            <el-col :span="21" v-html="case_detail.user_action">{{ case_detail.user_action }}</el-col>
          </el-col>
          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">成效：</el-col>
            <el-col :span="21" v-html="case_detail.effect">{{ case_detail.effect }}</el-col>
          </el-col>
          <el-col :span="24" class="comment-padding">
            <el-col :span="3" align="right" class="left-title">见证性材料：</el-col>
            <el-col :span="21" v-html="case_detail.case_track">{{ case_detail.case_track }}</el-col>
          </el-col>
        </el-form>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getWaitExamineList, getWaitExamineDetail, SubmitWaitDetail, discardQuestion, getAdoptList, adoptSubmitQuestion, adoptSubmitAnswer,
adoptObject } from '@/api/relations'
import { getThemeTree, getSameThemeList } from '@/api/counselor'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      questionAlertDetail: false,
      answerAlertDetail: false,
      caseAlertDetail: false,
      case_detail: {},
      answer_detail: {},
      answer_opinions: [],
      question_detail: {},
      quest_opinions: [],
      ageValue: null,//当前选择年龄值
      single: [
        { value: '' }
      ],
      tagValue: [
        { one: '' }
      ],
      ageIndex: null,
      options: [],
      examine_type: 1, //待审核已完成审核
      type: 1, //区分 问答 答案 案例
      problem_scenario: false,
      answer_scenario: false,
      revise: false,
      activeName: 'first',
      auditedName: 'first',
      radio7: '1',
      alertShow: '',
      //待审核
      questionHeight: null,
      questionLoading: false,
      questionList: [],
      questionTotal: 0,

      answerHeight: null,
      answerLoading: false,
      answerList: [],
      answerTotal: 0,

      caseHeight: null,
      caseLoading: false,
      caseList: [],
      caseTotal: 0,

      //已完成审核
      questionHeightCom: null,
      questionLoadingCom: false,
      questionListCom: [],
      questionTotalCom: 0,

      answerHeightCom: null,
      answerLoadingCom: false,
      answerListCom: [],
      answerTotalCom: 0,

      caseHeightCom: null,
      caseLoadingCom: false,
      caseListCom: [],
      caseTotalCom: 0,


      height: null,
      searchText: '',
      formRevise: {
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
      checkList: [],
      problem_arrtibute: [
        { value: '1', label: '不是问题的问题' },
        { value: '2', label: '是问题的问题' },
        { value: '3', label: '看不见的问题' },
      ],
      searchTextComplete: '',
      completeName: 'first',
      object_id: null,
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
    }
  },
  created() {
    this.goodsListId = this.$route.params.id;
    //获取树形 结构
    this.getThemeTree();
    const map = {
      examine_type: 1,
      type: 1,
      page_num: 1,
      page_size: 10
    }
    this.getWaitExamineList(map);

  },
  methods: {
    // 改变年龄
    changeAge(value) {
      if (this.options[value].children) {
        this.optionsTheme = this.options[value].children;
        this.form.themeArr = [[]];
      } else {
        this.$message({
          type: 'error',
          message: '当前年龄段没有分类'
        })
      }
    },
    // 添加一条主题
    addTheme() {
      const index = this.ageValue;
      if (index !== null) {
        this.form.themeArr.push([])
        this.form.themeArr.splice(1, 0)
      } else {
        this.$message({
          type: 'error',
          message: '请先选择年龄段'
        })
      }
    },
    // 删除主题标签
    removeTheme(index) {
      let themeArr = this.form.themeArr;
      themeArr.splice(index, 1);
    },
    // 选择主题
    handleChange(value) {
      let count = 0;
      let array = this.form.themeArr;
      array.forEach((item, index) => {
        if (JSON.stringify(value) === JSON.stringify(item)) {
          count++
          if (count >= 2) {
            this.$message({
              type: 'error',
              message: '重复选择！'
            });
            this.form.themeArr[index] = [];
          }
        }
      });
      this.getSameThemeList(value);
      // this.form.relation_id = 
    },
    // 获取同类标签lsit
    getSameThemeList(value) {
      const data = {
        age_id: this.options[this.ageValue].label_id,
        first_id: value[0],
        second_id: value[1]
      };
      getSameThemeList(data).then(res => {
        if (res.code == 200) {
          const moreTheme = res.result.list;
          if (moreTheme.length) {
            this.visible = true;
            this.moreTheme = moreTheme;
          }
        }
      })
    },
    // 待审核 已完成审核列表
    getWaitExamineList(map) {
      this.questionLoading = true;
      this.answerLoading = true;
      this.caseLoading = true;
      this.questionLoadingCom = true;
      this.answerLoadingCom = true;
      this.caseLoadingCom = true;

      getWaitExamineList(map ? map : {}).then((res) => {
        if (res.code == 200) {
          const commentList = res.result.list;
          const commentCount = res.result.count;
          if (res.result.examine_type == 1) {
            if (res.result.type == 1) {
              this.questionList = commentList;
              this.questionTotal = commentCount;
            } else if (res.result.type == 2) {
              this.answerList = commentList;
              this.answerTotal = commentCount;
            } else {
              this.caseList = commentList;
              this.caseTotal = commentCount;
            }
          } else if (res.result.examine_type == 2) {
            if (res.result.type == 1) {
              this.questionListCom = commentList;
              this.questionTotalCom = commentCount;
            } else if (res.result.type == 2) {
              this.answerListCom = commentList;
              this.answerTotalCom = commentCount;
            } else {
              this.caseListCom = commentList;
              this.caseTotalCom = commentCount;
            }
          }
          this.questionLoading = false;
          this.answerLoading = false;
          this.caseLoading = false;
          this.questionLoadingCom = false;
          this.answerLoadingCom = false;
          this.caseLoadingCom = false;
        }
      })
    },
    // 待审核问答 问题场景 采纳 alert
    questionAlert(object_id) {
      this.problem_scenario = true;
      this.question_id = object_id; //采纳提交的问答id
      this.form.answer_id = object_id;
      const map = {
        object_id,
        type: this.type
      }
      getAdoptList(map).then((res) => {
        if (res.code == 200) {
          this.opinions = res.result.opinions;

          // this.form = res.result.list;
          this.form.question = res.result.list.question;
          this.form.answer_content = res.result.list.answer_content;

          this.form.answer_id = res.result.list.answer_id;
          const ageValue = res.result.list.relation_id[0][0];
          for (let j = 0; j < this.options.length; j++) {
            if (ageValue == this.options[j].label_id) {
              this.ageValue = j;
            }
          }
          this.changeAge(this.ageValue)
          const relation_id = res.result.list.relation_id;
          var relationArray = [];
          for (let i = 0; i < relation_id.length; i++) {
            relationArray.push(relation_id[i].splice(1))
          }
          this.form.themeArr = relationArray;
          this.form.themeArr.splice(1, 0);
        }
      })
    },
    questionHidden() {
      this.$confirm('离开不会保留已修改的信息哦', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.problem_scenario = false;
        const form = this.form;
        for (let item in form) {
          form[item] = '';
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 问题场景 保存
    sureRelation(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.adoptSubmitQuestion();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    adoptSubmitQuestion() {

      let arr = JSON.parse(JSON.stringify(this.form.themeArr));
      for (let index = 0; index < arr.length; index++) {
        arr[index].unshift(this.options[this.ageValue].label_id)
      }
      this.form.relation_id = arr;
      const map = {
        ...this.form,
        question_id: this.question_id,
        type: this.type
      }
      adoptSubmitQuestion(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '保存成功'
          });
          this.problem_scenario = false;
          const map = {
            examine_type: this.examine_type,
            type: this.type
          }
          this.getWaitExamineList(map);
        }
      })
    },
    // 修订
    questionRevise(object_id) {
      this.formRevise.opinion_content = '';
      this.revise = true;
      this.object_id = object_id;//修订的
      const map = {
        object_id,
        type: this.type
      }
      getWaitExamineDetail(map).then((res) => {
        if (res.code == 200) {
          this.content = res.result.content;
        }
      })
    },
    // 修订 发布
    sureRevise(sureRevise) {
      this.$refs[sureRevise].validate((valid) => {
        if (valid) {
          this.SubmitWaitDetail();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    SubmitWaitDetail() {
      const map = {
        object_id: this.object_id,
        type: this.type,
        ...this.formRevise
      }
      SubmitWaitDetail(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '发布成功'
          });
          this.revise = false;
          const map = {
            examine_type: this.examine_type,
            type: this.type
          }
          this.getWaitExamineList(map);
        }
      })
    },
    reviseHidden() {
      this.$confirm('离开不会保留已修改的信息哦', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.revise = false;
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 待审核答案 答案 alert
    answerAlert(object_id) {
      this.answer_scenario = true;
      this.answer_id = object_id; //采纳提交的问答id
      const map = {
        object_id,
        type: this.type
      }
      getAdoptList(map).then((res) => {
        if (res.code == 200) {
          this.formAnswer = res.result.list;
          this.opinions = res.result.opinions;
          this.historyAnswer = res.result.HistoryAnswer;
        }
      })
    },
    answerHidden() {
      this.$confirm('离开不会保留已修改的信息哦', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.answer_scenario = false;
        this.formAnswer.question = '';
        this.formAnswer.answer_content = '';
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 发布
    sureAnswer(sureAnswer) {
      this.$refs[sureAnswer].validate((valid) => {
        if (valid) {
          this.adoptSubmitAnswer();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    adoptSubmitAnswer() {
      const map = {
        answer_id: this.answer_id,
        ...this.formAnswer,
        type: this.type
      }
      adoptSubmitAnswer(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '保存成功'
          });
          this.answer_scenario = false;
          const map = {
            examine_type: this.examine_type,
            type: this.type
          }
          this.getWaitExamineList(map);
        }
      })
    },
    // 待审核案例 案例标题
    caseTitle(examine_id) {
      this.$router.push({ path: `./caseLibrary/edit/0`, query: { examine_id } })
    },
    handleClick(tab, event) {
      this.examine_type = this.activeName === 'first' ? '1' : '2';
      const map = {
        examine_type: this.examine_type,
        type: this.type
      }
      this.getWaitExamineList(map);
    },
    handleTag(tab, event) {
      this.searchText = '';

      if (this.auditedName == 'first') {
        this.type = 1;
      } else if (this.auditedName == 'second') {
        this.type = 2;
      } else if (this.auditedName == 'third') {
        this.type = 3;
      }
      const map = {
        examine_type: this.examine_type,
        type: this.type
      }
      this.getWaitExamineList(map);
    },
    //待审核 案例 分页
    changeCase(value) {
      const map = {
        examine_type: this.examine_type,
        type: this.type,
        title: this.searchText,
        page_num: value.page,
        page_size: value.limit
      }
      this.getWaitExamineList(map);
    },
    //待审核答案 分页
    changeAnswer(value) {
      const map = {
        examine_type: this.examine_type,
        type: this.type,
        title: this.searchText,
        page_num: value.page,
        page_size: value.limit
      }
      this.getWaitExamineList(map);
    },
    //待审核问答  分页
    changeQuestion(value) {
      const map = {
        examine_type: this.examine_type,
        type: this.type,
        title: this.searchText,
        page_num: value.page,
        page_size: value.limit
      }
      this.getWaitExamineList(map);
    },
    // 搜索 待审核问答 答案 案例
    searchGoods() {
      const map = {
        title: this.searchText,
        examine_type: this.examine_type,
        type: this.type,
        page_num: 1
      }
      this.getWaitExamineList(map);
    },
    // 搜索 已完成 问答 答案 案例
    searchComplete() {
      const map = {
        examine_type: this.examine_type,
        type: this.type,
        title: this.searchTextComplete,
        page_num: 1
      }
      this.getWaitExamineList(map);
    },
    // 已完成审核问答 分页
    changeQuestionCom(value) {
      const map = {
        examine_type: this.examine_type,
        type: this.type,
        page_num: value.page,
        page_size: value.limit,
        title: this.searchTextComplete
      }
      this.getWaitExamineList(map);
    },
    changeCaseCom(value) {
      const map = {
        examine_type: this.examine_type,
        type: this.type,
        page_num: value.page,
        page_size: value.limit,
        title: this.searchTextComplete
      }
      this.getWaitExamineList(map);
    },
    changeAnswerCom(value) {
      const map = {
        examine_type: this.examine_type,
        type: this.type,
        page_num: value.page,
        page_size: value.limit,
        title: this.searchTextComplete
      }
      this.getWaitExamineList(map);
    },
    handleComplete() {
      this.searchTextComplete = '';
      if (this.completeName == 'first') {
        this.type = 1;
      } else if (this.completeName == 'second') {
        this.type = 2;
      } else if (this.completeName == 'third') {
        this.type = 3;
      }
      const map = {
        examine_type: this.examine_type,
        type: this.type
      }
      this.getWaitExamineList(map);
    },
    //待审核问答/答案/案例->废弃
    discardComment(object_id) {
      let disTitle = '';
      if (this.type == 1) {
        disTitle = '问答';
      } else if (this.type == 2) {
        disTitle = '答案';
      } else if (this.type == 3) {
        disTitle = '案例';
      }
      this.$confirm('确认要废弃该' + disTitle + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.discardQuestion(object_id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    discardQuestion(object_id) {
      const map = {
        object_id,
        type: this.type
      }
      discardQuestion(map).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.msg
          });
        }
        const map = {
          examine_type: this.examine_type,
          type: this.type
        }
        this.getWaitExamineList(map);
      })
    },
    //点击 + 
    addDomain() {
      // 点击 + 号时 判断是否选中年龄段
      const ageIndex = this.ageIndex;
      if (ageIndex == 0 || ageIndex) {
        this.form.relation_id.push('');//标签的relation_id
        this.tagValue.push({ one: '' })
        const map = { value: '' };
        this.single.push(map);
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择年龄段哦'
        });
      }
    },
    //点击 -
    removeDomain(index) {
      // console.log(index, 'index')
      const single = this.single;
      const relation_id = this.form.relation_id;
      single.splice(index, 1);
      relation_id.splice(index, 1);
      // console.log(deleteItem, 'deleteItem')
      // // console.log(item, '删除一条---')
      // var index = this.single.indexOf(item)
      // if (index !== -1) {
      // this.single.splice(index, 1)
      // }
      // console.log(this.single, '删除一条 - 维护数据')
      // this.tagValue.splice(deleteItem, 1);
    },
    // 年龄段 change
    handleChangeAge(value) {
      // 年龄段 索引 可以 用来 获取 对应的分类 children
      // console.log(value, '选中的年龄段')
      this.ageIndex = value; //选中的年龄段 index
      this.tagValue.forEach((item) => {
        item.one = [];
      })
      this.form.relation_id = [''];
      // console.log(this.options[this.ageIndex].children, '0-00')
    },
    // 切换分类时
    handleChangeOne(value) {
      // console.log(value, '-----')
      if (!this.options[this.ageIndex].children[value.classIndex].children) {
        this.$message({
          type: 'warning',
          message: '该分类下没有标签哦'
        });
      }
    },
    // 切换标签时
    handleChangeTwo(value) {
      // console.log(this.form)
      // console.log(value, '处理二级标签')
    },
    // 获取树形结构
    getThemeTree() {
      const data = {};
      getThemeTree(data).then(res => {
        if (res.code == 200) {
          this.options = res.result;
        }
      })
    },
    // 已审核问答 alert
    questionAlertShow(object_id) {
      this.questionAlertDetail = true;
      const map = {
        object_id,
        type: this.type
      }
      getAdoptList(map).then((res) => {
        if (res.code == 200) {
          this.question_detail = res.result.list;
          this.quest_opinions = res.result.opinions;
        }
      })
    },
    hiddenAlertDetail() {
      this.questionAlertDetail = false;
      // console.log('123123')
    },
    // 已审核答案 alert
    showAnswerDetail(object_id) {
      this.answerAlertDetail = true;
      const map = {
        object_id,
        type: this.type
      }
      getAdoptList(map).then((res) => {
        if (res.code == 200) {
          this.answer_detail = res.result.list;
          this.answer_opinions = res.result.opinions;
          this.historyAnswer = res.result.HistoryAnswer;
        }
      })
    },
    hiddenAnswerDetail() {
      this.answerAlertDetail = false;
    },
    // 已审核案例 alert
    showCaseDetail(object_id) {
      this.caseAlertDetail = true;
      const map = {
        object_id,
        type: this.type
      }
      getAdoptList(map).then((res) => {
        if (res.code == 200) {
          this.problemList = res.result.label_ids;
          this.informationList = res.result.info;
          this.case_detail = res.result.form_data;
        }
      })
    },
    hiddenCaseDetail() {
      this.caseAlertDetail = false;
    },
    //问答采纳
    adoptObject(type, object_id){
      this.$confirm('确认采纳该问答吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.adoptObjectDetails(type, object_id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消采纳'
        });
      });
    },
    adoptObjectDetails(type, object_id){
      const data = {
        type,
        object_id
      }
      adoptObject(data).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '采纳成功'
          });
        }
        const map = {
          examine_type: this.examine_type,
          type: this.type
        }
        this.getWaitExamineList(map);
      })
    },
    //答案采纳
    answerAdopt(type, object_id){
      this.$confirm('确认采纳该答案吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.adoptObjectDetails(type, object_id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消采纳'
        });
      });
    },
    //案例采纳
    caseAdopt(type, object_id){
      this.$confirm('确认采纳该案例吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.adoptObjectDetails(type, object_id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消采纳'
        });
      });
    }
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
</style>


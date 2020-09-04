<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
        <el-tab-pane label="一级主题标签" name="first">
          <el-col :span="24" class="title-header">
            <el-col :span="4" :xs="10">
              <el-button size="small" type="primary" @click="addFirstTeam()">添加一级主题</el-button>
            </el-col>
            <el-col :span="5" :xs="10">
              <el-input size="small" clearable placeholder="名称搜索" prefix-icon="el-icon-search"
                v-model="formFirst.label_name"></el-input>
            </el-col>
            <el-col :span="2" class="success-btn" :xs="10">
              <el-button type="success" @click="searchFirstList" icon="el-icon-search" size="small">搜索</el-button>
            </el-col>
          </el-col>
          <el-table :height="firstHeight" v-loading="firstLoading" :data="firstList" element-loading-text="Loading"
            border fit size="small" highlight-current-row align="middle">
            <el-table-column label="名称">
              <!-- <template slot-scope="scope">{{ scope.row.title }}</template> -->
              <template slot-scope="{row, $index}">
                <el-input v-if="row.flag" v-model="row.title" autofocus="row.flag"
                  @keyup.enter.native="onSubmit($index, row)" v-on:blur="changeOne"
                  v-on:change="inputblur(row.title, row.label_id, $index)" maxlength="6"></el-input>
                <el-col v-else>{{ row.title }}</el-col>
                <img class="editImg" @click="confirmEdit($index, row)" src="@/assets/404_images/edit.png" alt="编辑">
              </template>
            </el-table-column>
            <el-table-column label="关联年龄数" align="center">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="firstDetail(scope.row.label_id)">
                  {{ scope.row.age_theme_num }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">{{ scope.row.create_time }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="deleteFirst(scope.row.label_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination class="pagination" v-show="firstTotal>0" :total="firstTotal" :page.sync="listQuery.page"
            :limit.sync="listQuery.limit" v-on:pagination="firstChange" />
        </el-tab-pane>
        <el-tab-pane label="二级主题标签" name="second">
          <el-col :span="24" class="title-header">
            <el-col :span="4" :xs="10">
              <el-button size="small" type="primary" @click="addSecond">添加二级主题</el-button>
            </el-col>
            <el-col :span="5" :xs="10">
              <el-input size="small" clearable placeholder="名称搜索" prefix-icon="el-icon-search"
                v-model="formTwo.label_name"></el-input>
            </el-col>
            <el-col :span="2" class="success-btn" :xs="10">
              <el-button type="success" @click="searchSecondList" icon="el-icon-search" size="small">搜索</el-button>
            </el-col>
          </el-col>
          <el-table :height="twoHeight" v-loading="twoLoading" :data="twoList" element-loading-text="Loading" border fit
            size="small" highlight-current-row align="middle">
            <el-table-column label="名称">
              <!-- <template slot-scope="scope">{{ scope.row.label_name }}</template> -->
              <template slot-scope="{row, $index}">
                <el-input v-if="row.flag" v-model="row.title" :autofocus="row.flag"
                  @keyup.enter.native="onSubmitAge($index, row)" maxlength="15" v-on:blur="changeTwo"
                  v-on:change="inputblurage(row.title, row.second_label_id, $index)"></el-input>
                <el-col v-else>{{ row.title }}</el-col>
                <img class="editImg" @click="ageConfirmEdit($index, row)" src="@/assets/404_images/edit.png" alt="编辑">
              </template>
            </el-table-column>
            <el-table-column label="关联主题标签数" align="center">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="twoDetail(scope.row.second_label_id)">
                  {{ scope.row.one_theme_num }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">{{ scope.row.create_time }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="deleteTwo(scope.row.second_label_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination class="pagination" v-show="twoTotal>0" :total="twoTotal" :page.sync="formFirst.page_num"
            :limit.sync="formFirst.page_size" v-on:pagination="towChange" />
        </el-tab-pane>
      </el-tabs>
    </el-col>

    <!-- 添加一级主题标签 alert -->
    <el-col :span="24" v-if="firstAlert" class="alert-wrap" style="z-index: 2000;">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="24">
          <el-col :span="8">
            <div class="add-com" :span="6">添加一级主题标签</div>
          </el-col>
          <!-- {{ sureAddOne + '添加 新增'}} -->
        </el-col>
        <el-col :span="24" class="title-header">
          <el-col :span="16" align="right"></el-col>
        </el-col>
        <!-- 添加一级主题标签 -->
        <el-checkbox-group v-if="sureAddOne == 1" v-model="checkFirstAge" @change="handleFirstAge" class="checkbox">
          <el-checkbox v-for="city in firstAlertList" :label='city.label_id' :key="city.title">{{city.title}}
          </el-checkbox>
        </el-checkbox-group>

        <!-- 新增一级主题标签 -->
        <el-checkbox-group v-else-if="sureAddOne == 0" v-model="checkFirstAge" @change="handleFirstAge"
          class="checkbox">
          <el-checkbox v-for="city in firstAlertList" :label='city.age_label_id' :key="city.title"
            :disabled="city.flag && city.flag == true">{{city.title}}</el-checkbox>
        </el-checkbox-group>

        <el-row :span="10" style="margin-top: 30px;" v-if="show_add">
          <el-col :span="4" class="first-age">*一级主题标签名称</el-col>
          <el-col :span="11">
            <el-input size="small" placeholder="请输入一级主题标签" maxlength="6" v-model="moreFirstTeam" />
          </el-col>
        </el-row>
        <el-col v-if="show_add" :span="24" style="margin-top: 20px;color:#999;">如果添加的一级主题标签库中已存在, 则不允许重复添加, 名称最多为6个字哦
        </el-col>
        <el-col style="margin-top: 30px;">
          <el-button type="info" @click="hiddenFirstAlert">取消</el-button>
          <el-button type="primary" @click="addFirst">确认</el-button>
        </el-col>
      </el-col>
    </el-col>

    <!-- 一级主题标签年龄段详情 alert -->
    <el-col :span="24" v-if="ageDetail" class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="24" class="title-header">
          <el-button type="primary" @click="sureAgeRelation">新增</el-button>
          <el-button type="info" @click="hiddenAgeAlert">取消</el-button>
        </el-col>
        <el-table ref="multipleTable" :height="ageDetailHeight" v-loading="ageDetailLoading" :data="ageDeailList"
          element-loading-text="Loading" tooltip-effect="dark" border fit size="small" highlight-current-row>
          <el-table-column label="年龄">
            <template slot-scope="scope">{{ scope.row.title }}</template>
          </el-table-column>
          <el-table-column label="关联时间">
            <template slot-scope="scope">
              <span style="padding:0 5px;">{{ scope.row.create_time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="removeFirstAge(scope.row.age_label_id)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <pagination
          class="pagination"
          v-show="alertTotal>0"
          :total="alertTotal"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          v-on:pagination="changeAlert"
        /> -->
      </el-col>
    </el-col>

    <!-- 添加二级主题标签 alert -->
    <el-col :span="24" v-if="twoAlert" class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="24">
          <el-col :span="6">
            <div class="add-com" :span="4">添加二级主题标签</div>
          </el-col>
          <!-- {{is_addSecond + '主题'}} -->
        </el-col>
        <el-col :span="24" class="title-header">
          <el-col :span="16" align="right"></el-col>
        </el-col>

        <el-radio-group v-model="radio2" @change="handleSingle" class="radio">
          <el-radio v-for="(item,index) in singleAge"
            :label='`{"index":${index},"value":{"label_id":"${item.age_label_id}","title":"${item.age_label_name}"}}`'
            :key="item.age_label_name">{{item.age_label_name}}</el-radio>
        </el-radio-group>

        <el-checkbox-group v-if="currentValue&&currentValue.index>=0" v-model="checktwoAge[currentValue.index]"
          @change="handletwoAge" class="checkbox">
          <template v-for="(item,index) in multipleLabel">
            <!-- {{item}} -->
            <el-checkbox v-for="(level,levelIndex) in item"
              :label='`{"ageIndex":${index},"label_id":"${level.first_theme_id}","title":"${currentValue.value.title}/${level.first_theme_name}"}`'
              :key="levelIndex" v-if="index == currentValue.index" :data-flag="level.flag">
              <!-- {{`{"ageIndex":${index},"title":"${level.title}","theme_id":"${level.label_id}"}`}} -->
              {{level.first_theme_name}}
            </el-checkbox>
          </template>
        </el-checkbox-group>

        <template v-for="item in checktwoAge">
          <el-tag v-for="(checkItem,index) in item" :key="index" :disable-transitions="false" closable
            @close="handleClose(checkItem)">{{JSON.parse(checkItem).title}}</el-tag>
        </template>

        <el-row :span="10" style="margin-top: 30px;" v-if="is_teamAdd">
          <el-col :span="12">
            <el-input size="small" maxlength="15" placeholder="请输入二级主题标签" v-model="moreSecondTeam" />
          </el-col>
        </el-row>
        <el-col style="margin-top: 30px;">
          <el-button type="info" @click="hiddenTwoAlert">取消</el-button>
          <el-button type="primary" @click="addTwo">确认</el-button>
        </el-col>
      </el-col>
    </el-col>

    <!-- 二级关联年龄数详情 alert -->
    <el-col :span="24" v-if="twoAgeDetail" class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="24" class="title-header">
          <el-button type="primary" @click="secondRelation">新增</el-button>
          <el-button type="info" @click="secondAgeAlert">取消</el-button>
        </el-col>
        <el-table ref="multipleTable" :height="secondTeamHeight" v-loading="secondLoading" :data="secondTeamList"
          element-loading-text="Loading" tooltip-effect="dark" border fit size="small" highlight-current-row>
          <el-table-column label="年龄">
            <template slot-scope="scope">{{ scope.row.age_label_name }}</template>
          </el-table-column>
          <el-table-column label="一级主题标签">
            <template slot-scope="scope">{{ scope.row.first_theme_name }}</template>
          </el-table-column>
          <el-table-column label="关联时间">
            <template slot-scope="scope">
              <span style="padding:0 5px;">{{ scope.row.create_time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="small" type="text"
                @click="removeTwoLevel(scope.row.age_label_id, scope.row.second_label_id, scope.row.first_label_id)">移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination class="pagination" v-show="secondAlertTotal>0" :total="secondAlertTotal" :page.sync="listQuery.page"
          :limit.sync="listQuery.limit" v-on:pagination="secondChange" />
      </el-col>
    </el-col>

    <!-- 二级主题标签 新增 alert -->
    <el-col :span="24" v-if="addRelationSecond" class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-col :span="24">
          <el-col :span="4">
            <div class="add-com" :span="4">增加关联</div>
          </el-col>
          <!-- {{is_addSecond + '主题'}} -->
        </el-col>
        <el-col :span="24" class="title-header">
          <el-col :span="16" align="right"></el-col>
        </el-col>

        <el-radio-group v-model="addRadio" @change="handleAddSecond" class="radio">
          <el-radio v-for="(item,index) in singleAgeArray"
            :label='`{"index":${index},"value":{"label_id":"${item.age_label_id}","title":"${item.age_label_name}"}}`'
            :key="item.age_label_name">{{item.age_label_name}}</el-radio>
        </el-radio-group>
        <!-- {{addCurrent.index}} -->
        <el-checkbox-group v-if="addCurrent&&addCurrent.index>=0" v-model="secondAdd[addCurrent.index]"
          @change="handleRelation" class="checkbox">
          <template v-for="(item,index) in multAddArray">
            <!-- {{item}} -->
            <el-checkbox v-for="(level,levelIndex) in item"
              :label='`{"ageIndex":${index},"label_id":"${level.first_label_id}","title":"${addCurrent.value.title}/${level.title}"}`'
              :key="levelIndex" :disabled="level.flag" v-if="index == addCurrent.index" :data-flag="level.flag">
              <!-- {{`{"ageIndex":${index},"title":"${level.title}","theme_id":"${level.second_label_id}"}`}} -->
              {{level.title}}
            </el-checkbox>
          </template>
        </el-checkbox-group>

        <template v-for="item in secondAdd">
          <el-tag v-for="tag in item" :disable-transitions="false" :key="tag.title" @close="handleAddRemove(tag)"
            closable>{{JSON.parse(tag).title}}</el-tag>
        </template>

        <el-col style="margin-top: 30px;">
          <el-button type="info" @click="hiddenSecond">取消</el-button>
          <el-button type="primary" @click="sureAddSecond">确认</el-button>
        </el-col>
      </el-col>
    </el-col>
  </div>
</template>

<script>
import {
  addLevelfirst,
  firstAgeDetail,
  deleteFirstTheam,
  removeRelationFirst,
  firstTeamList,
  twoTeamList,
  addSecondTheamList,
  searchFirstTheme,
  deleteSecondTheme,
  updateThemeName,
  secondTheamList,
  againaddRelationFirst,
  againaddSubmitFirst,
  addSubmitSecond,
  aglianAddSecondTheme,
  getAgeGroup,
  addLevelTwoTree,
  ageUnderGetOneTheme,
  removeRelationTwo
} from "@/api/teach";
import { getThemeTree } from "@/api/counselor";
import Pagination from "@/components/Pagination";
import Vue from "vue";
import Sticky from "@/components/Sticky";
import Request from "@/utils/request";
export default {
  components: { Pagination },
  data() {
    return {
      formFirst: {
        page_num: 1,
        page_size: 10,
        label_name: ""
      },
      secondAdd: [[]],
      tags: [],
      currentValue: {},
      moreSecondTeam: "",
      show_add: false,
      addRelationSecond: false,
      radio2: { value: { label_id: "" } },
      addRadio: {},
      firstHeight: null,
      firstAlertHeight: null,
      firstAlertList: [],
      checkFirstAge: [], //选中的一级年龄段
      checktwoAge: [[]], //选中的二级主题标签
      activeName2: "first",
      formTwo: {
        page_num: 1,
        page_size: 10,
        label_name: ""
      },
      firstAlert: false,
      twoAlert: false,
      firstLoading: false,
      firstAlertLoading: false,
      firstList: [],
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      moreFirstTeam: "", //添加一级主题标签的多个主题名称
      labelIds: [], //添加一级主题标签 - 选中的年龄段
      ageDetail: false,
      ageDeailList: [], //年龄详情数据
      ageDetailHeight: null,
      ageDetailLoading: false,
      singTeamId: null, //单个主题id
      // alertTotal: 0,
      twoList: [],
      twoHeight: null,
      twoLoading: false,
      firstTotal: 0,
      twoTotal: 0,
      twoAgeDetail: false,
      secondTeamList: [],
      secondLoading: false,
      secondTeamHeight: null,
      singleAge: [], //添加二级主题标签单选年龄段
      multipleLabel: [], //添加二级主题标签多选二级标签
      danxuan: "",
      tagTotal: [], //标签
      sureAddOne: null, //用于区分是添加一级主题标签(1) || 新建(0)
      // is_addSecond:null,//用于区分是添加二级主题标签(1) || 新建(0)
      secondAlertTotal: 0,
      result: [],
      secondThemeId: null,
      multAddArray: [[]], //新增 二级关联关系 维护的一级标签数据
      addCurrent: {},
      singleAgeArray: [], //新增二级主题标签单选年龄段
      tags_second: []
    };
  },
  created() {
    this.oneList();
  },
  methods: {
    // 从年龄列表 获取所有年龄
    getAgeGroup() {
      const map = {
        page_num: 1,
        page_size: 100
      };
      getAgeGroup(map).then(res => {
        if (res.code == 200) {
          this.firstAlertList = res.result.list;
        }
      });
    },
    //获取树形结构
    // getThemeTree(){
    //   getThemeTree().then((res) => {
    //     console.log(res, '获取树形结构---')
    //     if(res.code == 200){
    //       this.firstAlertList = res.result;
    //       this.singleAge = res.result;
    //     }
    //   })
    // },
    // 一级主题标签名称可修改
    onSubmit(index, row) {
      let tableD = this.firstList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      // this.$set(this.showEdit,this.firstList[index].title,true)
    },
    inputblur(title, label_id, index) {
      let tableD = this.firstList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      const map = {
        label_id: label_id,
        label_name: title
      };
      if (!map.label_name) {
        this.$message({
          message: "名称不能为空哦",
          type: "warning"
        });
        this.oneList();
        tableD[index].flag = true;
        return false;
      }
      //一级名称修改接口
      updateThemeName(map).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: "success"
          });
        }
      });
    },
    changeOne() {
      let tableD = this.firstList;
      for (let i = 0; i < tableD.length; i++) {
        tableD[i].flag = false;
      }
    },
    confirmEdit(index, row) {
      let tableD = this.firstList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      tableD[index].flag = true;
    },
    // 二级主题标签名称可修改
    changeTwo() {
      let tableD = this.twoList;
      for (let i = 0; i < tableD.length; i++) {
        tableD[i].flag = false;
      }
    },
    onSubmitAge(index, row) {
      let tableD = this.twoList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      this.$set(this.showEdit, this.twoList[index].label_name, true);
    },
    inputblurage(title, label_id, index) {
      let tableD = this.twoList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      const map = {
        label_id: label_id,
        label_name: title
      };
      if (!map.label_name) {
        this.$message({
          message: "名称不能为空哦",
          type: "warning"
        });
        this.twoTeamList();
        tableD[index].flag = true;
        return false;
      }
      //二级主题标签修改接口
      updateThemeName(map).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: "success"
          });
        }
      });
    },
    ageConfirmEdit(index, row) {
      let tableD = this.twoList;
      tableD.forEach(function (item) {
        item.flag = false;
      });
      tableD[index].flag = true;
    },
    secondChange(val) {
      const map = {
        page_num: val.page,
        page_size: val.limit,
        label_id: this.secondThemeId
      };
      secondTheamList(map).then(res => {
        if (res.code == 200) {
          this.secondTeamList = res.result.list;
          this.secondAlertTotal = res.result.count;
        }
      });
    },
    // 搜索一级主题标签列表
    searchFirstList() {
      this.oneList();
    },
    // 搜索二级主题标签列表
    searchSecondList() {
      this.twoTeamList();
    },
    //选中的一级主题标签年龄段
    handleFirstAge(value) {
      this.checkedValue = value;
      const label_ids = [];
      for (var i = 0; i < value.length; i++) {
        label_ids[i] = value[i];
      }
      this.labelIds = label_ids;
    },
    handleClick(tab, event) {
      if (this.activeName2 == "first") {
        this.formFirst.label_name = '';
        this.formFirst.page_num = 1;
        this.formFirst.page_size = 10;
        this.oneList();
      } else if (this.activeName2 == "second") {
        this.formTwo.label_name = '';
        this.formTwo.page_num = 1;
        this.formTwo.page_size = 10;
        this.twoTeamList();
      }
    },
    // 一级主题标签列表
    oneList() {
      const map = { ...this.formFirst };
      firstTeamList(map).then(res => {
        if (res.code == 200) {
          this.firstList = res.result.list;
          this.firstTotal = res.result.count;
        }
      });
    },
    // 二级主题标签列表
    twoTeamList() {
      const map = { ...this.formTwo };
      twoTeamList(map).then(res => {
        if (res.code == 200) {
          this.twoList = res.result.list;
          this.twoTotal = res.result.count;
        }
      });
    },
    // 一级主题标签列表分页
    firstChange(val) {
      const map = {
        page_num: val.page,
        page_size: val.limit,
        label_name: this.formFirst.label_name
      };
      firstTeamList(map).then(res => {
        if (res.code == 200) {
          this.firstList = res.result.list;
          this.firstTotal = res.result.count;
        }
      });
    },
    // 二级主题标签分页
    towChange(val) {
      const map = {
        page_num: val.page,
        page_size: val.limit,
        label_name: this.formTwo.label_name
      };
      twoTeamList(map).then(res => {
        if (res.code == 200) {
          this.twoList = res.result.list;
          this.twoTotal = res.result.count;
        }
      });
    },
    // 添加一级主题标签列表展示
    addFirstTeam() {
      this.moreFirstTeam = "";
      this.labelIds.length = 0;
      this.firstAlert = true;
      this.show_add = true;
      this.sureAddOne = 1;
      this.getAgeGroup();
      this.checkFirstAge = [];
    },
    // 添加 && 新增 一级主题标签提交
    addFirst() {
      if (this.labelIds.length == 0) {
        this.$message({
          message: "请选择年龄段",
          type: "warning"
        });
        return false;
      }
      if (this.sureAddOne == 1) {
        //添加一级主题
        if (!this.moreFirstTeam) {
          this.$message({
            message: "请填写一级主题标签哦",
            type: "warning"
          });
          return false;
        }
        const map = {
          label_ids: this.labelIds,
          label_name: this.moreFirstTeam ? this.moreFirstTeam : ""
        };
        addLevelfirst(map).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.oneList();
            this.firstAlert = false;
          }
        });
      } else if (this.sureAddOne == 0) {
        //新增一级问题提交
        this.firstAlert = false; //隐藏添加一级主题标签弹框
        this.ageDetail = true; //显示年龄段弹框

        const map_add = {
          one_themeid: this.singTeamId,
          age_label_ids: this.labelIds
        };
        againaddSubmitFirst(map_add).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.firstDetail(this.singTeamId);
            this.labelIds.length = 0;
            this.oneList();
          }
        });
      }
    },
    hiddenFirstAlert() {
      this.$confirm("取消不会保存修改的内容哦?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.sureAddOne == 0) {
            this.ageDetail = true;
            this.firstAlert = false;
          } else if (this.sureAddOne == 1) {
            this.firstAlert = false;
          }
          this.moreFirstTeam = "";
          this.labelIds.length = 0;
          if (this.checkedValue) {
            this.checkedValue.length = 0;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 一级主题标签关联年龄段弹框
    firstDetail(label_id) {
      this.ageDetail = true;
      this.singTeamId = label_id; // 一级主题标签id
      const map = {
        label_id: label_id,
        page_num: 1,
        page_size: 100
      };
      firstAgeDetail(map).then(res => {
        if (res.code == 200) {
          this.ageDeailList = res.result.list;
          // this.alertTotal = res.result.count;
        }
      });
    },
    hiddenAgeAlert() {
      this.ageDetail = false;
    },
    //一级主题标签关联年龄数弹框的新增alert
    sureAgeRelation() {
      this.firstAlert = true;
      this.ageDetail = false;
      this.show_add = false;
      this.sureAddOne = 0;
      this.checkFirstAge.length = 0;
      const ageArray = this.ageDeailList;
      const age_label_ids = [];
      for (let i = 0; i < ageArray.length; i++) {
        age_label_ids.push(ageArray[i].age_label_id);
      }
      const map = {
        one_themeid: this.singTeamId, //一级主题标签 id
        age_label_ids //年龄段id
      };
      againaddRelationFirst(map).then(res => {
        if (res.code == 200) {
          this.firstAlertList = res.result;
        }
      });
    },
    //一级主题标签列表的删除
    deleteFirst(label_id) {
      this.$confirm("确认要删除该主题吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const map = {
            label_id: label_id
          };
          deleteFirstTheam(map).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.oneList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    removeRelationFirst(age_label_id) {
      const map = {
        first_theme_id: this.singTeamId,
        age_label_id
      };
      removeRelationFirst(map).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.firstDetail(this.singTeamId);
          this.oneList();
        }
      });
    },
    //移除一级主题标签的关联年龄数
    removeFirstAge(age_label_id) {
      this.$confirm("确认要移除该年龄段吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.removeRelationFirst(age_label_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //一级主题标签年龄段详情分页
    // changeAlert(val) {
    //   const map = {
    //     page_num: val.page,
    //     page_size: val.limit,
    //     label_id: this.singTeamId
    //   };
    //   firstAgeDetail(map).then(res => {
    //     if (res.code == 200) {
    //       this.ageDeailList = res.result.list;
    //       this.alertTotal = res.result.count;
    //     }
    //   });
    // },
    //移除二级主题标签关联年龄数
    removeTwoLevel(age_label_id, second_label_id, first_label_id) {
      this.$confirm("确认要移除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const map = {
            age_label_id,
            second_label_id,
            first_theme_id: first_label_id
          };
          removeRelationTwo(map).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: res.msg
              });
              this.twoDetail(this.secondThemeId);
              this.twoTeamList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 二级主题标签关联年龄数 alert
    twoDetail(label_id) {
      this.twoAgeDetail = true;
      this.secondThemeId = label_id; //二级主题标签id
      const map = {
        label_id: label_id,
        page_num: 1,
        page_size: 10
      };
      secondTheamList(map).then(res => {
        if (res.code == 200) {
          this.secondTeamList = res.result.list;
          this.secondAlertTotal = res.result.count;
        }
      });
    },
    secondAgeAlert() {
      this.twoAgeDetail = false;
    },
    //添加二级主题标签弹框
    addSecond() {
      this.twoAlert = true;
      this.is_teamAdd = true;
      this.is_addSecond = 1; //用于区分是添加二级 还是 新增
      addLevelTwoTree().then(res => {
        if (res.code == 200) {
          this.singleAge = res.result;
          const levelValue = res.result;
          let levelArray = [];
          for (var i = 0; i < levelValue.length; i++) {
            levelArray.push(levelValue[i].child);
          }
          this.multipleLabel = levelArray;
        }
      });
    },
    // 选中的单选
    handleSingle(value) {
      // console.log(value)
      let currentValue = JSON.parse(`${value}`);
      this.currentValue = currentValue;
      if (this.checktwoAge[currentValue.index]) {
      } else {
        this.checktwoAge[currentValue.index] = [];
      }
    },
    // 选中的二级主题标签的标签多选
    handletwoAge(value) {
      let array = [...value];
      let map = [];
      var checktwoAge = this.checktwoAge;
      for (let i = 0; i < checktwoAge.length; i++) {
        if (checktwoAge[i]) {
          for (let j = 0; j < checktwoAge[i].length; j++) {
            let item = JSON.parse(checktwoAge[i][j]);
            map.push({
              one_themeid: item.label_id,
              age_id: this.singleAge[i].age_label_id
            });
          }
        }
      }
      this.tags = map;
    },
    //添加二级主题标签提交
    addTwo() {
      if (this.tags.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择年龄段 和 一级主题标签哦"
        });
        return false;
      }
      if (this.moreSecondTeam == "") {
        this.$message({
          type: "warning",
          message: "请输入二级主题标签名称哦"
        });
        return false;
      }
      const map = {
        age_and_onetheme: this.tags,
        twotheme_name: this.moreSecondTeam
      };
      addSubmitSecond(map).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.twoTeamList();
          this.twoAlert = false;
          this.tags.length = [];
          this.checktwoAge = [[]];
          this.radio2 = "";
          this.moreSecondTeam = "";
        }
      });
    },
    // 二级主题标签 关联年龄数 新增
    secondRelation() {
      this.twoAgeDetail = false;
      this.addRelationSecond = true;
      this.is_addSecond = 0;
      addLevelTwoTree().then(res => {
        if (res.code == 200) {
          this.singleAgeArray = res.result;
        }
      });
    },
    // 二级主题标签 增加关联 提交
    sureAddSecond() {
      // console.log(this.tags_second, 'tags_second')
      if (this.tags_second.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择年龄段 和 一级主题标签哦"
        });
        return false;
      }
      const map = {
        second_label_id: this.secondThemeId, //二级主题标签id
        age_and_onetheme: this.tags_second
      };
      aglianAddSecondTheme(map).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.twoDetail(this.secondThemeId);
          this.twoTeamList();
          this.addRelationSecond = false;
          this.twoAgeDetail = true;
          this.secondAdd = [[]];
          this.addCurrent = "";
          this.addRadio = "";
          this.tags_second = [];
        }
      });
    },
    hiddenSecond() {
      this.$confirm("此操作不会保存已修改的内容, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.addRelationSecond = false;
          this.twoAgeDetail = true;
          this.secondAdd = [[]];
          this.addCurrent = "";
          this.addRadio = "";
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleClose(tag) {
      let checktwoAge = this.checktwoAge;
      checktwoAge.forEach(item => {
        item.forEach((itemTag, index) => {
          if (tag === itemTag) {
            // console.log(item, '123')
            item.splice(index, 1);
          }
        });
      });
      const map = [];
      for (let i = 0; i < checktwoAge.length; i++) {
        if (checktwoAge[i]) {
          for (let j = 0; j < checktwoAge[i].length; j++) {
            let item = JSON.parse(checktwoAge[i][j]);
            map.push({
              one_themeid: item.label_id,
              age_id: this.singleAge[i].age_label_id
            });
          }
        }
      }
      this.tags = map;
    },
    hiddenTwoAlert() {
      this.$confirm("此操作不会保存已修改的内容, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.twoAlert = false;
          this.tags = [[]];
          this.checktwoAge = [[]];
          this.radio2 = "";
          this.moreSecondTeam = "";
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },

    // 二级主题标签列表的删除
    deleteTwo(label_id) {
      this.$confirm("确认要删除该二级主题标签吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const map = {
            label_id: label_id
          };
          deleteSecondTheme(map).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.twoTeamList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //二级问题 新增
    handleAddSecond(value) {
      const addValue = JSON.parse(`${value}`);
      this.addCurrent = addValue;
      if (this.secondAdd[addValue.index]) {
      } else {
        this.secondAdd[addValue.index] = [];
      }
      const age_label_id = JSON.parse(this.addRadio).value.label_id;
      const twotheme_id = this.secondThemeId;
      const ageIndex = JSON.parse(this.addRadio).index;
      const map = {
        age_label_id,
        twotheme_id
      };
      ageUnderGetOneTheme(map).then(res => {
        if (res.code == 200) {
          const result = res.result;
          this.multAddArray[ageIndex] = result;
          this.multAddArray.splice(1, 0);
        }
      });
    },
    handleRelation(value) {
      let array = [...value];
      let map = [];
      var secondAdd = this.secondAdd;
      for (let i = 0; i < secondAdd.length; i++) {
        if (secondAdd[i]) {
          for (let j = 0; j < secondAdd[i].length; j++) {
            let item = JSON.parse(secondAdd[i][j]);
            map.push({
              first_label_id: item.label_id,
              age_label_id: this.singleAgeArray[i].age_label_id
            });
          }
        }
      }
      this.tags_second = map;
    },
    handleAddRemove(tag) {
      let secondAdd = this.secondAdd;
      secondAdd.forEach(item => {
        item.forEach((itemTag, index) => {
          if (tag === itemTag) {
            item.splice(index, 1);
          }
        });
      });
      let map = [];
      for (let i = 0; i < secondAdd.length; i++) {
        if (secondAdd[i]) {
          for (let j = 0; j < secondAdd[i].length; j++) {
            let item = JSON.parse(secondAdd[i][j]);
            map.push({
              first_label_id: item.label_id,
              age_label_id: this.singleAgeArray[i].age_label_id
            });
          }
        }
      }
      this.tags_second = map;
    }
  }
};
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
}
.success-btn {
  text-align: right;
}
.form-wrap {
  margin-top: 20px;
}
.first-age {
  height: 32px;
  line-height: 32px;
}
.checkbox {
  margin: 20px 0;
}
.checkbox .el-checkbox__label {
  font-size: 18px;
}
.radio .el-radio__label {
  font-size: 18px;
}
.el-tag {
  margin-right: 20px;
  margin-bottom: 10px;
}
.editImg {
  width: 20px;
  height: 20px;
  float: right;
}
.el-table__row td:first-child .cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>


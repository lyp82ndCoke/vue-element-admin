<template>
  <el-col :span="24">
    <!-- 全部title -->
    <el-col class="title-wrap" v-if="type=='all'">
      <el-col :span="5">
        <el-cascader
          size="small"
          placeholder="请选择分类"
          clearable
          expand-trigger="hover"
          filterable
          :options="options"
          :props="props"
          v-model="allForm.relation_id"
          @change="handleChange"
        ></el-cascader>
      </el-col>
      <!-- <el-col :span="5">
        <el-select
          size="small"
          v-model="allForm.class_id"
          placeholder="请选择问题属性"
          @change="attrChange"
        >
          <el-option
            v-for="item in attrOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>-->
      <el-col :span="4">
        <el-input
          size="small"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="allForm.question"
        ></el-input>
      </el-col>
      <el-col :span="2" align="center">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
      </el-col>
      <el-col :span="2" align="center">
        <el-button size="small" @click="clear">清空</el-button>
      </el-col>
      <!-- <el-col :span="5" align="right">
        <el-button size="small" type="primary" @click="news(0)">创建问题</el-button>
      </el-col>-->
    </el-col>
    <!-- 全部title end -->
    <!-- 采纳title begin-->
    <el-col class="title-wrap" v-if="type=='adoption'">
      <el-col :span="10">
        <el-radio-group size="small" v-model="adoptionForm.is_anwser">
          <el-radio-button
            v-for="item in adoptionAttrOptions"
            :key="item.value"
            :label="item.value"
          >待审核{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-col>
    <!-- 采纳title end -->
    <!-- 待审核title begin-->
    <el-col class="title-wrap" v-if="type=='review'">
      <el-col :span="10">
        <el-radio-group
          size="small"
          @change="reviewChangeAttrAnswers"
          v-model="reviewForm.is_anwser"
        >
          <el-radio-button
            v-for="item in reviewAttrOptions"
            :key="item.value"
            :label="item.value"
          >待审核{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="14" align="right">
        审核结果：
        <el-select
          size="small"
          v-model="reviewForm.status"
          placeholder="请选择问题属性"
          @change="reviewChange"
        >
          <el-option
            v-for="item in reviewOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-col>
    <!-- 待审核title end -->
    <el-col :span="24" class="table-wrap">
      <!-- v-loading="loading" element-loading-text="请给我点时间！" -->
      <!-- 全部table -->
      <el-table
        v-loading="loading"
        element-loading-text="请给我点时间！"
        v-if="type=='all'"
        :data="allList"
        size="small"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <!-- 标题模块 begin -->
        <el-table-column align="center" label="问题场景">
          <template slot-scope="scope">
            <span class="text-3">{{ scope.row.question }}</span>
          </template>
        </el-table-column>
        <!-- 标题模块  end -->
        <!-- <el-table-column align="center" label="问题属性">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>-->
        <el-table-column align="center" label="答案数">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.answer_num>0"
              type="text"
              @click="news(scope.row.question_id)"
            >{{ scope.row.answer_num }}</el-button>
            <el-button v-else type="text" disabled>{{ scope.row.answer_num }}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="关联主题数">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.theme_num>0"
              type="text"
              @click="showAlert(scope.row.question_id)"
            >{{ scope.row.theme_num }}</el-button>
            <el-button v-else type="text" disabled>{{ scope.row.theme_num }}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建日期">
          <template slot-scope="scope">
            <el-col>{{ scope.row.create_name }}</el-col>
            <el-col>{{ scope.row.create_time }}</el-col>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布日期">
          <template slot-scope="scope">
            <el-col>{{ scope.row.examine_name }}</el-col>
            <el-col>{{ scope.row.examine_time }}</el-col>
          </template>
        </el-table-column>
        <el-table-column v-loading="loading" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="news(scope.row.question_id)">编辑</el-button>
            <el-button
              type="text"
              style="color:red;"
              @click="delQuestions(scope.row.question_id)"
            >删除</el-button>
            <!-- <el-button type="text">上传文章</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 已采纳 begin -->

      <pagination
        class="pagination"
        v-show="allTotal>0&&type == 'all'"
        :total="allTotal"
        :page.sync="allForm.page_num"
        :limit.sync="allForm.page_size"
        v-on:pagination="getAnswers"
      />
    </el-col>
    <!-- <div style="width:100%;height:100%;"> -->
    <el-col :span="24" v-if="bgShow" class="bg-wrap" @click.native.self="hiddenAlert">
      <el-col :span="24" class="alert-wrap">
        <!-- <i class="el-icon-circle-close close-icon" ></i> -->
        <el-table :data="themeForm.list" stripe style="width: 100%">
          <el-table-column prop="age_label_name" label="年龄">
            <template slot-scope="scope">{{scope.row.age_label_name}}</template>
          </el-table-column>
          <el-table-column prop="first_theme_name" label="一级主题">
            <template slot-scope="scope">{{scope.row.first_theme_name}}</template>
          </el-table-column>
          <el-table-column prop="second_theme_name" label="二级主题">
            <template slot-scope="scope">{{scope.row.second_theme_name}}</template>
          </el-table-column>
        </el-table>
        <pagination
          class="pagination"
          v-show="themeForm.count"
          :total="themeForm.count"
          :page.sync="themeForm.page_num"
          :limit.sync="themeForm.page_size"
          v-on:pagination="getAnswers"
        />
      </el-col>
    </el-col>
    <!-- </div> -->
  </el-col>
</template>

<script>
// import { fetchList } from '@/api/article'
import Pagination from '@/components/Pagination'
import { getAnswers, getThemeList, getThemeTree, getRelationThemeList, delQuestions } from '@/api/counselor'
export default {
  components: { Pagination },
  props: {
    type: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      attrOptions: [{ label: '全部', value: '' }, { label: '是问题的问题', value: '1' }, { label: '不是问题的问题', value: '2' }, { label: '看不见的问题', value: '3' }],
      // 问答和答案属性区分
      adoptionAttrOptions: [
        {
          label: '问答',
          value: '0'
        },
        {
          label: '答案',
          value: '1'
        }
      ],
      reviewAttrOptions: [
        {
          label: '问答',
          value: '0'
        },
        {
          label: '答案',
          value: '1'
        }
      ],
      // 审核结果选项0.全部 1.审核中3.已修订4.已废弃
      reviewOptions: [{ label: '全部', value: '0' }, { label: '待审核', value: '1' }, { label: '修订', value: '3' }, { label: '已废弃', value: '4' }],
      reviewValue: '',
      // 全部formData
      allForm: {
        question: '',
        class_id: '',
        relation_id: [],
        is_anwser: '',
        state: '0',
        page_num: 1,
        page_size: 10
      },
      allList: [],
      allTotal: 0,
      // 已采纳form
      adoptionForm: {
        is_anwser: '1',
        state: '2',
        page_num: 1,
        page_size: 10
      },
      adoptionTotal: 0,
      adoptionList: null,
      // 待审核form
      reviewForm: {
        state: '3',
        is_anwser: '1',
        page_num: 1,
        page_size: 10,
        status: '0'
      },
      reviewTotal: 0,
      reviewList: null,
      loading: false,
      // 主题tree
      props: {
        value: 'label_id',
        label: 'title'
      },
      options: []
      ,
      // 相关主题list
      themeForm: {
        question_id: '',
        page_num: 0,
        page_size: 10,
        list: [],

      },
      // 相关主题弹框显示
      bgShow: false
    }
  },
  created() {
    console.log(this.type)
    this.getThemeTree();
    this.getAnswers();
  },
  methods: {
    // 获取树形结构
    getThemeTree() {
      const data = {};
      getThemeTree(data).then(res => {
        if (res.code == 200) {
          this.options = res.result;
        }
      })
    },
    // 获取全部数据
    getAnswers() {
      // console.log(this.type, '----------')
      let data;
      if (this.type === 'all') {
        // 全部
        // console.log(333)
        data = this.allForm;
        this.getList(data, (res) => {
          this.allList = res.result.list;
          this.allTotal = res.result.count;
          // console.log(this.allList, '00000')
        })
      } else if (this.type === 'adoption') {
        // 已采纳
        data = this.adoptionForm;
        this.getList(data, (res) => {
          this.adoptionList = res.result.list;
          this.adoptionTotal = res.result.count;
        })
      } else if (this.type === 'review') {
        // 待审核
        data = this.reviewForm;
        this.getList(data, (res) => {
          this.reviewList = res.result.list;
          this.reviewTotal = res.result.count;
        })
      }

    },
    // 获取关联主题
    // getRelationThemeList(id) {
    //   this.bgShow = true;
    //   console.log(id)
    //   const data = { id };
    //   getRelationThemeList(data).then(res => {
    //     if (res.code == 200) {
    //       this.themeForm = res.result;
    //       this.bgShow = true;
    //     }
    //   })
    // },
    // 获取列表
    getList(data, cb) {
      // this.loading = true
      // this.$emit('create') // for test
      getAnswers(data).then((res) => {
        this.loading = false;
        cb(res)
        // this.list = res.result.list;
        // this.total = res.result.sign.count;
        // this.seleteVal = res.result.list
      })
    },
    // 选择年龄段/一级主题/二级主题
    handleChange(value) {
      // this.allForm.relation_id = value;
      this.allForm.page_num = 1;
      this.getAnswers();
    },
    // 选择问题属性
    attrChange(value) {
      // this.allForm.class_id = value;
      this.allForm.page_num = 1;
      this.getAnswers();
      // console.log('选择问题属性', value)
    },
    // 已采纳切换问答和答案
    answersChange(value) {
      this.adoptionForm.is_anwser = value;
      this.getAnswers();
      // console.log('切换问答和答案', value)
    },
    // 切换审核状态
    reviewChange(value) {
      this.reviewForm.status = value;
      this.reviewForm.page_num = 1;
      const data = this.reviewForm;

      this.getList(data, res => {
        if (res.code == 200) {
          this.reviewList = res.result.list;
          this.reviewTotal = res.result.count;
        }
      })
      // console.log('切换审核状态', value)
    },
    // 切换审核问答/答案类型
    reviewChangeAttrAnswers(value) {
      // console.log(value)
      this.reviewForm.is_anwser = value;
    },
    // 搜索
    search() {
      // console.log('搜索')
      this.allForm.page_num = 1;
      this.getAnswers()
    },
    // 清空
    clear() {
      this.allForm = {};
      this.getAnswers();
      // console.log('清空')
    },
    // 创建编辑问题
    news(id) {
      this.$router.push({ path: `./edit/${id}` })
    },
    // 删除问答
    delQuestions(question_id) {
      delQuestions({ question_id }).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.getAnswers();
        }
      })
    },
    // 补充案例
    // goAddCase(question_id){
    //   this.$router.push({path:'/tutor/caseLibrary/edit/0',query:{question_id}})
    // },
    // 获取数据并显示主题弹框
    showAlert(question_id) {
      this.themeForm.question_id = question_id;
      const data = this.themeForm;
      getThemeList(data).then(res => {
        if (res.code == 200) {
          this.themeForm = res.result;
          this.bgShow = true;
        }
      })
    },
    // 隐藏主题弹框
    hiddenAlert() {
      this.bgShow = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.title-wrap {
  margin-bottom: 10px;
}
.bg-wrap {
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 200px;
  background-color: rgba(0, 0, 0, 0.7);
  .alert-wrap {
    position: relative;
    overflow: auto;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 10px;
    padding: 50px;
    .close-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 20px;
      color: #ededed;
    }
  }
}
</style>

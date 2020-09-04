<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-col color :span="24">
          <span class="demonstration">时间段：</span>
          <el-date-picker
            size="small"
            v-model="timeVale"
            type="daterange"
            align="right"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="changeTime"
          ></el-date-picker>
        </el-col>
      </el-col>

      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size="mini"
        highlight-current-row
        align="middle"
      >
        <el-table-column label="名次">
          <template slot-scope="scope">{{ scope.row.rank}}</template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span style="padding:0 5px;">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总分">
          <template slot-scope="scope">{{ scope.row.total_score }}</template>
        </el-table-column>
        <el-table-column label="采纳得分" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.adopt_core }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="被分享得分" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.share_score }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="有用得分" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.useful_score }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="阅读得分" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.read_score }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-card class="box-card">
      <div class="text item">采纳：</div>
      <div class="text item">辅导员上传“答案、案例、文章”被采纳后增加对应贡献值，比例【次/N贡献值】</div>
      <div class="text item">被分享：</div>
      <div class="text item">问题被分享后，问题所选择“答案、案例、文章”增加对应贡献值，比例【次/N贡献值】</div>
      <div class="text item">有用：</div>
      <div class="text item">问题被分享后，普通用户游览时点击有用按钮，问题所选择“答案、案例、文章”增加对应贡献值，比例【次/N贡献值】</div>
      <div class="text item">阅读人数：</div>
      <div class="text item">问题被分享后，普通用户阅读人数，问题所选择“答案、案例、文章”增加对应贡献值，比例【次/N贡献值】</div>
    </el-card>
  </div>
</template>

<script>
import { getMyIntegral, getIntegralRule } from '@/api/counselor'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Sticky },

  data() {
    return {
      // 日期值
      timeVale: "",
      // 快捷选项（日期）
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      list: [],
      rule: {
        "adopt": { "answer": 1, "case": 2, "article": 3 },
        "share": { "answer": 1, "case": 2, "article": 3 },
        "useful": { "answer": 1, "case": 2, "article": 3 },
        "read": { "answer": 1, "case": 2, "article": 3 },
      },
      listLoading: false,

    }
  },
  created() {
    // console.log(his.$route.params, '此活动的id')
    // this.getIntegralRule();
    this.getMyIntegral()
  },
  methods: {
    // 获取积分规则
    getIntegralRule() {
      getIntegralRule({}).then(res => {
        if (res.code == 200) {
          this.rule = res.result;

        }
      })
    },
    // 选择时间段
    changeTime() {
      // console.log(this.timeVale, '切换时间')
      this.getMyIntegral()
    },
    // 获取贡献值列表
    getMyIntegral() {
      this.listLoading = true;
      const data = { date: this.timeVale }
      getMyIntegral(data).then(res => {
        this.listLoading = false;
        if (res.code == 200) {
          // this.list[0] = res.result;
          this.$set(this.list, 0, res.result)
        }

      })
    },





  }
}
</script>
<style lang="scss" scoped>
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
.box-card {
  .item {
    line-height: 30px;
    padding: 10px 0;
  }
}
</style>


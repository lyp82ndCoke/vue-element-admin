<template>
  <div class="app-container">
    <el-row>
      <el-col
        :span="24"
        class="table-wrap"
      >
        <el-row>
          <el-col :span="24">

            <el-col :span="3">
              <el-button
                size="small"
                type="primary"
                @click="editRule(0)"
              >新建涨价</el-button>
            </el-col>
            <el-col :span="4">
              <el-select
                size="mini"
                v-model="data.rule_status"
                @change="change"
                placeholder="活动状态"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col
              :offset="12"
              :span="5"
            >
              <el-input
                size="small"
                placeholder="请输入活动名称"
                clearable
                prefix-icon="el-icon-search"
                v-model="data.item_name"
                @keyup.native.enter="change"
              ></el-input>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="24"
            class="title-header"
          >
            <el-table
              :data="list"
              element-loading-text="Loading"
              border
              fit
              size="mini"
              highlight-current-row
              align="middle"
            >
              <el-table-column
                label="活动名称"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col :span="24">{{ scope.row.rule_name }}</el-col>
                </template>
              </el-table-column>
              <el-table-column
                width="250"
                label="活动时间"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col :span="24">显示涨价时间：{{scope.row.display_begn_time}}</el-col>
                  <el-col :span="24">涨价时间：{{scope.row.price_begn_time}}</el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="活动标签"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col :span="24">{{ scope.row.rule_label }}</el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="活动状态"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col :span="24">{{scope.row.rule_status_name}}</el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="订单总金额"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col :span="24">{{scope.row.pay_ment}}</el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="付款订单人数"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col :span="24">{{scope.row.pay_user_cnt}}</el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="付款人数"
                align="center"
              >
                <template slot-scope="scope">
                  <el-col :span="24">{{scope.row.order_cnt}}</el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="230"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <!-- <el-button
                    size="small"
                    type="text"
                    @click="increaseRule(scope.row.rule_id,scope.$index,scope.row)"
                  >使生效</el-button> -->
                  <el-button
                    size="small"
                    type="text"
                    @click="increaseRule(scope.row.rule_id,scope.$index,scope.row)"
                    v-if="scope.row.rule_status&&(scope.row.rule_status==11||scope.row.rule_status==12)"
                  >使失效</el-button>
                  <el-button
                    size="small"
                    type="text"
                    v-if="scope.row.rule_status&&(scope.row.rule_status==11||scope.row.rule_status==12)"
                    @click="editRule(scope.row.rule_id)"
                  >编辑</el-button>
                  <el-button
                    v-else
                    size="small"
                    type="text"
                    @click="viewRule(scope.row.rule_id)"
                  >查看</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              class="pagination"
              v-show="total>0"
              :total="total"
              :page.sync="data.page_no"
              :limit.sync="data.page_size"
              v-on:pagination="getItemList"
            />
          </el-col>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getRuleList, increaseRule } from '@/api/giftCard'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
export default {
  components: { Pagination, Sticky },
  data() {
    return {
      data: {
        rule_name: "",
        rule_status: "10",
        page_no: 1,
        page_size: 10
      },
      list: [],
      total: 0,
      options: [
        {
          value: '10',
          label: '全部'
        }, {
          value: '11',
          label: '未开始'
        }, {
          value: '12',
          label: '进行中'
        }, {
          value: '13',
          label: '已结束'
        }, {
          value: '14',
          label: '已失效'
        }],



    }
  },
  created() {
    // this.getCaseList();
    this.getItemList();

  },
  methods: {
    change() {
      this.data.page_no = 1;
      this.getItemList()
    },
    //获取规则列表
    getItemList() {
      getRuleList(this.data).then(res => {
        if (res.code == 200) {
          this.list = res.result.rows;
          this.total = res.result.total;
        }
      })
    },
    // 使失效
    increaseRule(rule_id, index, row) {
      console.log(row)
      const data = {
        rule_id,
        status: 0
      }
      increaseRule(data).then(res => {
        if (res.code == 200) {
          this.getItemList();
        }
      })
    },
    // 编辑
    editRule(id) {
      this.$router.push({ path: `./news/${id}` })
    },
    // 查看
    viewRule(id) {
      this.$router.push({ path: `./news/${id}?view=1` })
    },







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
.wrap-title {
  color: #606266;
  font-size: 14px;
  font-weight: 700;
}
</style>


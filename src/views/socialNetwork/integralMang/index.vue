<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col :span="10" class="subtitle">贡献值管理</el-col>
    </sticky>
    <el-col :span="24" class="table-wrap">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="加载中"
        border
        fit
        type="index"
        size="small"
        highlight-current-row
        align="middle"
      >
        <el-table-column label>
          <template slot-scope="scope">{{ scope.row.rolename }}</template>
        </el-table-column>
        <el-table-column label="采纳得分">
          <template slot-scope="scope">
            <el-input size="small" v-model="editData.adopt_value" v-if="scope.row.edit"></el-input>
            <span v-else>{{ scope.row.adopt_value }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分享得分">
          <template slot-scope="scope">
            <el-input size="small" v-model="editData.share_value" v-if="scope.row.edit"></el-input>
            <span v-else>{{ scope.row.share_value }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有用得分" align="center">
          <template slot-scope="scope">
            <el-input size="small" v-model="editData.useful_value" v-if="scope.row.edit"></el-input>
            <span v-else>{{ scope.row.useful_value }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="阅读得分" align="center">
          <template slot-scope="scope">
            <el-input size="small" v-model="editData.read_value" v-if="scope.row.edit"></el-input>
            <span v-else>{{ scope.row.read_value }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="操作" align="center">
          <template slot-scope="scope">
            <el-col v-if="scope.row.edit">
              <el-button type="text" size="small" @click="save(scope.$index)">保存</el-button>
              <el-button type="text" @click="cancel(scope.$index)" size="small">取消</el-button>
            </el-col>
            <el-col v-else>
              <el-button type="text" @click="edit(scope.$index)" size="small">编辑</el-button>
            </el-col>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!-- <el-card class="box-card">
      <div class="text item">采纳：</div>
      <div class="text item">辅导员上传“答案、案例、文章”被采纳后增加对应积分，比例【{{rule.adopt.answer}}积分/次】、【{{rule.adopt.case}}积分/次】、【{{rule.adopt.article}}积分/次】</div>
      <div class="text item">被分享次数：</div>
      <div class="text item">问题被分享后，问题所选择“答案、案例、文章”增加对应积分，比例【{{rule.share.answer}}积分/次】、【{{rule.share.case}}积分/次】、【{{rule.share.article}}积分/次】</div>
      <div class="text item">有用：</div>
      <div class="text item">问题被分享后，普通用户游览时点击有用按钮，问题所选择“答案、案例、文章”增加对应积分，比例【{{rule.useful.answer}}积分/次】、【{{rule.useful.case}}积分/次】、【{{rule.useful.article}}积分/次】</div>
      <div class="text item">阅读量：</div>
      <div class="text item">问题被分享后，普通用户阅读人数，问题所选择“答案、案例、文章”增加对应积分，比例【{{rule.read.answer}}积分/次】、【{{rule.read.case}}积分/次】、【{{rule.read.article}}积分/次】</div>
    </el-card>-->
  </div>
</template>

<script>
import { getIntegralTable, changeIntegral, getIntegralRule } from '@/api/counselor'

import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Pagination, Sticky },
  data() {
    return {

      list: [
        // {
        //   "contribution_id": "1",
        //   "adopt_value": "1",
        //   "share_value": "1",
        //   "useful_value": "1",
        //   "read_value": "1",
        //   "role": "1",
        //   edit: false,
        //   "update_time": "2019-05-05 11:35:10",
        //   "rolename": "分享者"
        // },
        // {
        //   "contribution_id": "2",
        //   "adopt_value": "2",
        //   "share_value": "2",
        //   edit: false,
        //   "useful_value": "2",
        //   "read_value": "2",
        //   "role": "2",
        //   "update_time": "2019-05-05 11:35:18",
        //   "rolename": "问题主人"
        // },
        // {
        //   "contribution_id": "3",
        //   "adopt_value": "3",
        //   edit: false,
        //   "share_value": "3",
        //   "useful_value": "3",
        //   "read_value": "3",
        //   "role": "3",
        //   "update_time": "2019-05-05 11:35:24",
        //   "rolename": "回答贡献者"
        // },
        // {
        //   "contribution_id": "4",
        //   "adopt_value": "4",
        //   "share_value": "4",
        //   edit: false,
        //   "useful_value": "4",
        //   "read_value": "4",
        //   "role": "4",
        //   "update_time": "2019-05-05 11:35:29",
        //   "rolename": "案例贡献者"
        // },
        // {
        //   "contribution_id": "5",
        //   "adopt_value": "5",
        //   "share_value": "5",
        //   "useful_value": "5",
        //   edit: false,
        //   "read_value": "5",
        //   "role": "5",
        //   "update_time": "2019-05-05 11:35:35",
        //   "rolename": "文章贡献者"
        // }
      ],
      //  编辑数据临时存储
      editData: {

      },
      // 积分规则
      // rule:{
      //   "adopt":{"answer":1,"case":2,"article":3},
      //   "share":{"answer":1,"case":2,"article":3},
      //   "useful":{"answer":1,"case":2,"article":3},
      //   "read":{"answer":1,"case":2,"article":3},
      // },
      listLoading: true,
    }
  },
  created() {
    this.getIntegralTable();
  },
  methods: {

    // 获取贡献值表
    getIntegralTable() {
      getIntegralTable().then(res => {
        this.listLoading = false;
        if (res.code == 200) {
          this.list = res.result.list;
        }
      })
    },
    // 点击编辑
    edit(index) {
      let bol = true;
      // console.log('index:', index)
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].edit) {
          bol = false;
        }
      }
      if (bol) {
        this.editData = { ...this.list[index] };
        this.list[index].edit = true;
      } else {
        this.$message('请先完成上个编辑')
      }
    },
    // 保存
    save(index) {
      const data = this.editData;
      changeIntegral(data).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.list.splice(index, 1, this.editData);
          this.getIntegralTable();
        } else {
          this.getIntegralTable();
        }
      })
    },
    // 取消
    cancel(index) {
      // console.log('取消', index)
      // this.list[index].edit = false;
      this.getIntegralTable();
    }
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

.box-card {
  .item {
    line-height: 30px;
    padding: 10px 0;
  }
}
</style>


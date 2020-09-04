<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-col :span="3">
          <el-button size="small" type="primary" @click="dialogFormVisible = true">创建训练营</el-button>
        </el-col>
      </el-col>
      <el-table
        element-loading-text="Loading"
        border
        fit
        size="mini"
        highlight-current-row
        align="middle"
        :data="tableData"
      >
        <el-table-column label="训练营名称" align="center" prop="name">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>-->
        </el-table-column>
        <el-table-column label="简介" align="center" prop="intro">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>-->
        </el-table-column>
        <el-table-column label="辅导员" align="center" prop="teacher">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>-->
        </el-table-column>
        <el-table-column label="辅导员简介" align="center" prop="teacher_intro">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>-->
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="editCamp(scope.row.article_id)">编辑训练营</el-button>
            <el-button size="small" type="text" @click="addCampContent(scope.row.article_id)">添加内容</el-button>
            <el-button size="small" type="text" @click="addTerm(scope.row.article_id)">添加营期</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        v-on:pagination="changePaging"
      />
      <el-dialog title="创建训练营" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="训练营名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="训练营简介" :label-width="formLabelWidth">
            <el-input v-model="form.intro" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="选择辅导员" :label-width="formLabelWidth">
            <el-select v-model="form.select" placeholder="请选择辅导员">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
  </div>
</template>

<script>
// import { getScheduleList, closeSchedule, getGroupRoleList, getCounselorList, getGoods, addSchedule, getCounselorDetail, delSchedule, getScheduleMark, getScheduleUserStatus } from '@/api/counselor'
// import Pagination from '@/components/Pagination'
// import Sticky from '@/components/Sticky'
// import Request from '@/utils/request'
import { getCampList } from "@/api/memberCamp";
export default {
  // components: { Pagination, Sticky },
  data() {
    // const host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    return {
      tableData: [
        {
          intro: "2016-05-04",
          name: "王小虎",
          teacher: "普陀区",
          teacher_intro: "上海市普陀区金沙江路 1517 弄"
        },
        {
          intro: "2016-05-04",
          name: "王小虎",
          teacher: "普陀区",
          teacher_intro: "上海市普陀区金沙江路 1517 弄"
        },
        {
          intro: "2016-05-04",
          name: "王小虎",
          teacher: "普陀区",
          teacher_intro: "上海市普陀区金沙江路 1517 弄"
        }
      ],
      dialogFormVisible: false,
      form: {
        name: "",
        intro: "",
        select: ""
      },
      formLabelWidth: "120px"
    };
  },
  created() {
    // 获取训练营商品
    // this.getGoods();
    //获取训练营列表
    this.getList();
    // 获取群角色list
    // this.getGroupRoleList();
    // 获取用户list
    // this.getCounselorList();
  },
  methods: {
    // 获取排版管理列表
    getList() {
      let data = {
        page_num: 1,
        page_size: 10
      };
      this.listLoading = true;
      getCampList(data).then(res => {
        if (res.code == 200) {
          console.log("200", res.data);
          this.list = res.result.list;
          this.total = res.result.sign.count;
          this.listLoading = false;
        }
      });
    },
    addCamp() {},
    editCamp() {
      this.dialogFormVisible = true;
    },
    addCampContent() {
      this.$router.push({ path: "./addcontent" });
    },
    addTerm() {
      this.$router.push({ path: "./addterm" });
    }
  }
};
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
    background-color: rgba(0, 0, 0, 0.5);
    padding: 50px 150px 100px 200px;
  }
  &-content-wrap {
    border-radius: 10px;
    height: 100%;
    width: 100%;
    background-color: #fff;
  }
  &-title {
    background-color: #ededed;
    line-height: 40px;
    padding: 0 10px;
  }
  &-content {
    padding: 30px;
  }
  &-desc {
    border: 1px solid #ededed;
    font-size: 14px;
    font-weight: 500;
    color: rgb(153, 153, 153);
    padding: 10px;
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
.submit-close-btn {
  margin-top: 20px;
}

.icon {
  color: #dedede;
  margin-left: 10px;
  font-size: 25px;
  cursor: pointer;
  &:hover {
    color: #20b6f9;
  }
}
.add-alert-wrap {
  z-index: 1002;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 50px 200px 100px 150px;

  overflow: auto;
  .icon-close {
    position: absolute;
    right: 15px;
    top: 5px;
  }
  .add-content-wrap {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: #fff;
    min-width: 800px;
    border-radius: 10px;
    overflow: auto;
    .add-content-title {
      line-height: 40px;
      text-align: center;
      background-color: #dedede;
    }
    .add-form-wrap {
      padding: 50px;
    }
  }
}

.line {
  text-align: center;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  max-width: 120px;
  /* height: 120px; */
  line-height: 350px;
  text-align: center;
}
.avatar {
  max-width: 120px;
  max-height: 350px;
  display: block;
}
.input-prompt {
  padding: 20px;
}
.export-form {
  color: #fff;
  width: 50px;
  display: block;
  background-color: #409eff;
  border-color: #409eff;
  font-size: 12px;
  border-radius: 3px;
  padding: 8px 5px;
  text-align: center;
}
</style>


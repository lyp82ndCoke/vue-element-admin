<template>
  <div class="app-container">
    <el-col :span="24" class="title-header">
      <el-col :span="4">
        <el-button size="small" type="primary" @click="alertAdv(0)">新建广告</el-button>
      </el-col>
    </el-col>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      size="small"
      highlight-current-row
    >
      <el-table-column label="排序" align="center">
        <!-- <template slot-scope="scope">{{ scope.$index + 1 }}</template> -->
        <template slot-scope="{row, $index}">
          <el-input
            v-if="row.flag"
            v-model="row.orderline"
            autofocus="row.flag"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            @keyup.enter.native="onSubmit($index, row)"
            v-on:blur="changeFlag"
            v-on:change="inputblur(row.orderline, row, $index)"
          ></el-input>
          <el-button
            v-else
            size="small"
            type="text"
            @click="confirmEdit($index, row)"
          >{{row.orderline}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <el-col>
            <img v-if="scope.row.advimg" :src="scope.row.advimg" class="avatar">
          </el-col>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="mark" align="center"></el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center">
        <template slot-scope="scope">
          <el-col class="upper" v-if="scope.row.status == 1">已上架</el-col>
          <el-col class="lower" v-else-if="scope.row.status == 0">已下架</el-col>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="创建时间" prop="addtime" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="alertAdv(scope)">编辑</el-button>
          <el-button
            size="small"
            type="text"
            @click="statusAdv(scope.row.id, scope.row.status)"
          >{{scope.row.status == 1 ? '下架' : '上架'}}</el-button>
          <el-button size="small" type="text" @click="delAdv(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      class="pagination"
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @current-change="getAdvList"
    />

    <!-- 新建广告 alert -->
    <el-col :span="24" v-if="alertShow" class="alert-wrap">
      <el-col :span="24" class="alert-content-wrap">
        <el-form ref="form" :model="form" class="form-wrap" label-width="140px">
          <el-form-item label="*广告图：">
            <el-col :span="5">
              <el-upload
                class="avatar-uploader"
                :action="host"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="form.advimg" :src="form.advimg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
            <el-col :span="7" class="input-prompt">建议尺寸：120*120像素</el-col>
          </el-form-item>
          <el-form-item label="跳转地址：">
            <el-col :span="12">
              <el-input size="small" v-model="form.adv_url"/>
            </el-col>
          </el-form-item>
          <el-form-item label="备注：">
            <el-col :span="12">
              <el-input size="small" v-model="form.mark"/>
            </el-col>
          </el-form-item>
          <!-- <el-form-item label="排序：">
            <el-col :span="12">
              <el-input size="small" v-model="form.orderline"/>
            </el-col>
          </el-form-item>-->
          <el-form-item>
            <el-col :span="8">
              <el-button @click="calcel">取消</el-button>
              <el-button type="primary" @click="onSave">保存</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
  </div>
</template>

<script>
import { newAdv, delAdv, advList, advStatus } from '@/api/table'
import Pagination from '@/components/Pagination'
import Request from '@/utils/request'
export default {
  components: { Pagination },
  data() {
    return {
      options: [{ label: "已上架", value: "1" }, { label: "已下架", value: "2" }],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      alertShow: false,
      form: {
        advimg: '',
        mark: null,
        // orderline: null,
        adv_url: ''
      },
      advId: null,
      host: ''
    }
  },
  created() {
    this.advId = this.$route.params.id;
    this.getAdvList()
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
  },
  methods: {
    // 广告管理 排序修改
    changeFlag() {
      this.list.forEach(item => {
        item.flag = false;
      });
    },
    onSubmit(index, row) {
      this.list.forEach(item => {
        item.flag = false;
      });
    },
    inputblur(orderline, row, index) {
      this.list.forEach(item => {
        item.flag = false;
      });
      const map = {
        id: row.id,
        advimg: row.advimg,
        mark: row.mark,
        orderline,
        actid: row.actid
      }
      if (map.orderline == '') {
        this.$message({
          message: '排序不能为空哦',
          type: 'warning'
        });
        this.getAdvList();
        this.list[index].flag = true;
        return false;
      }
      //排序修改接口
      newAdv(map).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
        }
      })
    },
    confirmEdit(index, row) {
      this.list.forEach(item => {
        item.flag = false;
      });
      this.list[index].flag = true
    },
    // 广告列表
    getAdvList() {
      this.listLoading = true
      advList({actid: this.advId}).then(res => {
        this.listLoading = false;
        const flagList = res.result.list;
        for (let i = 0; i < flagList.length; i++) {
          flagList[i].flag = false;
        }
        this.list = flagList;
        this.total = res.result.list.length;
      })
    },
    // 上下架广告
    statusAdv(id, status) {
      const word = status == 1 ? '下架' : '上架';
      this.$confirm('确认要' + word + '该广告吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认上下架广告
        advStatus({id,status}).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          if (res.code == 200) {
            this.getAdvList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消' + word
        });
      });
    },
    // 删除广告
    delAdv(id) {
      this.$confirm('确认要删除该广告吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //确认删除该广告
        delAdv({id}).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getAdvList();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 新建编辑广告为新的页面
    // goNews(id){
    // this.$router.push({path:'./adv/0'})
    //   const bannerId = id ? id : 0;
    //   this.$router.push({path:`./adv/${id}`})
    // },
    alertAdv(scope) {
      this.alertShow = true;
      if (scope == 0) {
        // 新建广告
      } else {
        //编辑广告
        this.form.advimg = scope.row.advimg;
        this.form.mark = scope.row.mark;
        this.form.orderline = scope.row.orderline;
        this.form.id = scope.row.id;
        this.form.adv_url = scope.row.adv_url;
      }
    },
    handleAvatarSuccess(res, file) {
      this.form.advimg = res.result.urlFile;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式 或者 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    calcel() {
      this.alertShow = false;
    },
    onSave() {
      // this.alertShow = false;
      const map = { ...this.form }
      map.actid = this.advId;
      if (map.advimg == '') {
        this.$message({
          message: '请上传广告图哦',
          type: 'warning'
        });
        return false;
      }
      newAdv(map).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.form.advimg = '';
        this.form.mark = '';
        this.form.orderline = '';
        this.getAdvList();
        this.alertShow = false;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}
.title-header {
  padding: 10px 0;
}
.pagination {
  margin-top: 10px;
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
    padding: 150px 150px 50px 300px;
  }
  &-content-wrap {
    border-radius: 5px;
    height: 80%;
    width: 80%;
    padding: 20px;
    background-color: #fff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.upper {
  color: red;
}
.lower {
  color: #ccc;
}
</style>


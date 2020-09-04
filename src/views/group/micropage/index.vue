<template>
  <div class="app_container">
    <el-col :span="24" class="title-header">
      <el-col :span="4" :xs="10">
        <el-button size="small" type="primary" @click="newPage()">新建微页面</el-button>
      </el-col>
      <!-- <el-col :span="4" :offset="14">
        <el-input v-model="listQuery.item_name" size="small" placeholder="商品名称" @keyup.enter.native="search"></el-input>
      </el-col> -->
    </el-col>
    <el-col :span="24" class="title-content">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit size='mini'
        highlight-current-row>
        <el-table-column label="标题" prop="page_title" align="center" width="400">
        </el-table-column>
        <!-- <el-table-column label="页面浏览人数/浏览次数" prop="times_number" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.view_people_num}}/{{scope.row.view_num}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="创建时间" prop="create_time" align="center">
        </el-table-column>
        <el-table-column label="当前状态" prop="status" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status == '2' ? '已下架' : '已上架'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="setIndex(scope.row.page_id,scope.row.status,scope.row.is_index)">
              {{scope.row.is_index == '1' ? '取消首页' : '设为首页'}}
            </el-button>
            <el-button size="mini" type="text" @click="edit(scope.row.page_id)">编辑</el-button>
            <el-button size="mini" type="text" @click="showDialog(scope.row.page_id,scope.row.is_index)">推广</el-button>
            <el-button size="mini" type="text" @click="updateStatus(scope.row.page_id,scope.row.status)">
              {{scope.row.status == '1' ? '去下架' : '去上架'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination class="pagination" v-show="total>0" :total="total" :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size" v-on:pagination="changePaging" />
    </el-col>
    <el-dialog title="" width="40%" :visible.sync="dialogFormVisible">
      <el-form :model="newform" :rules="rules" ref="newform">
        <el-form-item label="推广链接" :label-width="formLabelWidth">
          <el-col :span="24">
            <span class="codeUrl">{{codeUrl}}</span><br>
            <el-button size="mini" type="primary" @click="copyLink()" class="copylinks"
              :data-clipboard-text="`${codeUrl}`">点击复制链接</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="推广二维码" :label-width="formLabelWidth">
          <el-col :span="18">
            <div id='code'></div>
            <canvas id="canvas" ref="canvas"></canvas>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getPageList, updateStatus, updateIndex } from "@/api/micropage";
import Pagination from '@/components/Pagination';
import Clipboard from 'clipboard';
import QRCode from 'qrcode';
import Base64 from 'js-base64';

export default {
  name: 'growthCamp',
  components: { Pagination, QRCode },
  data() {
    return {
      listLoading: true,
      listQuery: {
        page_num: 1,
        page_size: 10,
      },
      total: 0,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      formLabelWidth: '100px',
      rules: {
        name: [
          { required: true, message: '请输入训练营名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      newform: {
        name: '',
      },
      editform: {
        name: '',
        camp_id: ''
      },
      list: [],
      MOTHER_API: '',
      codeUrl: ''
    }
  },
  created() {
    this.getPageList();
    this.MOTHER_API = process.env.MOTHER_API;
  },
  methods: {
    getPageList() {
      this.listLoading = true;
      getPageList(this.listQuery).then((res) => {
        if (res.code == 200) {
          this.listLoading = false;
          this.list = res.result.pageList;
          this.total = Number(res.result.count);
        }
      })
    },
    updateStatus(id, status) {
      this.$confirm('确定要修改状态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus({ page_id: id, status: status == '1' ? '2' : '1' }).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getPageList();
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });          
      });
    },
    setIndex(id, status, index) {
      // console.log('setIndex',id,status,index);
      if (status == '2') {
        this.$message({
          message: '当前页面为下架状态，请先设置上架',
          type: 'warning'
        });
      } else {
        let key = index == '1' ? '2' : '1';
        this.$confirm('确定要修改状态吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateIndex({ page_id: id, index: key }).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getPageList();
            }
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
      }
    },
    useqrcode(url) {
      var canvas;
      this.$nextTick(() => {
        canvas = this.$refs.canvas;
        QRCode.toCanvas(canvas, url, function (error) {
          if (error) {
            console.error(error);
          } else {
            console.log('QRCode success!');
          }
        })
      })
    },
    showDialog(id, index) {
      this.dialogFormVisible = true;
      const dataBase = {
        page_id: id,
        is_index: index,
        channel: null
      }
      let base = Base64.Base64.encode(JSON.stringify(dataBase));
      this.codeUrl = `${this.MOTHER_API}/#/page?param=${base}`;
      this.useqrcode(this.codeUrl);
    },
    copyLink() {
      var clipboard = new Clipboard('.copylinks')
      clipboard.on('success', e => {
        this.$message({
          message: '复制成功',
          type: 'success'
        });
        clipboard.destroy();
      })
      clipboard.on('error', e => {
        // 不支持复制  
        console.log('该浏览器不支持自动复制');
        // 释放内存  
        clipboard.destroy();
      })
    },
    useqrcode(url) {
      var canvas;
      this.$nextTick(() => {
        canvas = this.$refs.canvas;
        QRCode.toCanvas(canvas, url, function (error) {
          if (error) {
            console.error(error);
          } else {
            console.log('QRCode success!');
          }
        })
      })
    },
    newPage() {
      this.$router.push({ path: `./edit/${0}` });
    },
    edit(id) {
      this.$router.push({ path: `./edit/${id}` });
    },
    changePaging(val) {
      this.getPageList();
    }
  }
}
</script>

<style lang="scss" scoped>
.app_container {
  padding: 20px;
  .title-header {
    margin-bottom: 20px;
  }
  .pagination {
    margin-top: 10px;
  }
  .codeUrl {
    word-wrap: break-word;
    word-break: normal;
  }
}
</style>
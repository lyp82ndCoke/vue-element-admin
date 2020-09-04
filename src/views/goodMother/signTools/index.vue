<template>
  <div class="list_wrap">
    <div class="list-head">
      <el-row>
        <el-col :span="8">
          <el-input v-model="listQuery.search_name" placeholder="请输入搜索内容" clearable class="search_style">
            <el-button slot="append" icon="el-icon-search" @click="moreSignList">搜索</el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" class="created_sign" @click="$router.push({path:`./created/add`})">创建签到</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table_list">
      <el-row>
        <el-col :span="24">
          <el-table v-loading="tableLoading" :data="list" border style="width: 100%" empty-text="暂无签到~">
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column :show-overflow-tooltip="true" label="日签名称" prop="sign_name" align="center" />
            <el-table-column label="创建时间" align="center" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.create_time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建者" prop="create_real_name" align="center" width="100" />
            <el-table-column label="状态" align="center" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 1" class="status_already">已上架</span>
                <span v-else class="un_status">待上架</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="420">
              <template slot-scope="scope">
                <el-button :disabled="scope.row.is_micropage == 1" type="text" size="mini" @click="setHome(scope.row, scope.$index)">显示在微页面</el-button>
                <el-button type="text" size="mini" @click="$router.push({path:`./signInfo/${scope.row.sign_id}/edit`})">编辑</el-button>
                <el-button type="text" size="mini" @click="$router.push({path:`./question/${scope.row.sign_id}`})">添加测评题</el-button>
                <el-button type="text" size="mini" @click="extension(scope.row, scope.$index)">推广</el-button>
                <el-button :disabled="scope.row.status != 1" type="text" size="mini" @click="$router.push({path:`./comment/${scope.row.sign_id}`})">评论</el-button>
                <el-button type="text" size="mini" @click="setStatusFun(scope.row, scope.$index)">{{ scope.row.status == 1 ? '下架' : '上架' }}</el-button>
                <el-button type="text" size="mini" @click="$router.push({path:`./overview/${scope.row.sign_id}`})">数据概览</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <pagination v-if="total > 10" :total="total" :page.sync="listQuery.page_num" :limit.sync="listQuery.page_size" class="pagination" v-on:pagination="moreSignList" />
    <el-dialog :visible.sync="showDialog" width="50%" left>
      <el-form ref="ruleForm" label-width="120px" label-position="left" class="demo-ruleForm">
        <el-form-item label="推广链接：">
          <div class="link_url_wrap">
            <p class="link_url">{{ link_url }}</p>
            <el-button :data-clipboard-text="link_url" type="primary" size="mini" class="copy_button" @click="copyUrl">一键复制</el-button>
          </div>
        </el-form-item>
        <el-form-item label="推广二维码：">
          <div id="qrCode">
            <div id="code" />
            <canvas id="canvas" ref="canvas" />
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import QRCode from 'qrcode'
import Pagination from '@/components/Pagination'
import { signList, setStatus, setMicropage } from '@/api/signDay'
export default {
  components: { Pagination, QRCode },
  data() {
    return {
      link_url: '',
      list: [],
      tableLoading: false,
      showDialog: false,
      total: 0,
      listQuery: {
        search_name: null,
        page_num: 1,
        page_size: 10
      }
    }
  },
  created() {
    this.getSignList()
  },
  methods: {
    setHome(item, index) {
      const signItem = this.list.find((item) => (parseInt(item.is_micropage) === 1))
      if (signItem !== undefined && signItem !== null) {
        this.$alert(`【${signItem.sign_name}】已在微页面展示，请先下架取消展示后在设置`, '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        })
        return
      } else {
        // 如果是下架先上架
        if (parseInt(item.status) === 2) {
          this.signStatus(item, index, () => {
            this.setMicropage(item, index)
          })
        } else {
          this.setMicropage(item, index)
        }
      }
    },
    setMicropage(item, index) {
      setMicropage({ sign_id: item.sign_id })
        .then(res => {
          if (res.code === 200) {
            this.list[index].is_micropage = 1
            this.$message({
              type: 'success',
              message: '设置成功'
            })
          }
        })
    },
    extension(item, index) {
      this.link_url = `${process.env.MOTHER_API}/#/answer?sign_id=${item.sign_id}`
      this.useqrcode(this.link_url)
      this.showDialog = true
      console.log(this.link_url)
    },
    useqrcode(url) {
      var canvas
      this.$nextTick(() => {
        canvas = this.$refs.canvas
        QRCode.toCanvas(canvas, url, function(error) {
          if (error) {
            console.error(error)
          } else {
            console.log('QRCode success!')
          }
        })
      })
    },
    copyUrl() {
      var clipboard = new Clipboard('.copy_button')
      clipboard.on('success', e => {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        console.log('该浏览器不支持自动复制')
        clipboard.destroy()
      })
    },
    // 获取签到列表
    getSignList() {
      this.tableLoading = true
      signList(this.listQuery)
        .then(res => {
          this.tableLoading = false
          console.log(res)
          if (res.code === 200) {
            const data = res.result
            this.list = data.signList
            this.total = data.sign.count
          }
        })
        .catch(error => {
          this.tableLoading = false
          console.log(error)
        })
    },
    setStatusFun(item, index) {
      if (parseInt(item.is_micropage) === 1) {
        this.$confirm(`【${item.sign_name}】已在微页面展示，是否下架并取消展示`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.signStatus(item, index, () => {
            this.list[index].is_micropage = 2
          })
        }).catch(() => {})
      } else {
        this.signStatus(item, index)
      }
    },
    // 调整上下架
    signStatus(item, index, cb) {
      const status = parseInt(item.status) === 1 ? 2 : 1
      const param = {
        sign_id: item.sign_id,
        status: item.status
      }
      setStatus(param)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: `${status === 1 ? '上架成功' : '下架成功'}`,
              type: 'success'
            })
            this.list[index].status = status
            cb()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    moreSignList() { this.getSignList() }
  }
}
</script>

<style lang="scss" scoped>
.list_wrap{
  padding: 20px;
}
.head_title{
  font-size: 20rpx;
  font-weight: 500;
}
.created_sign{
  margin-left: 20px;
}
.table_list{
  margin-top: 20px;
  .status_already{
    color: #67C23A;
  }
  .un_status{
    color: #909399;
  }
}
.link_url_wrap{
  padding-left: 15px;
  .link_url{
    margin: 0;
  }
}
</style>

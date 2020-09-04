<template>
  <div class="app-container">
    <!-- <el-col :span="24" class="title-header">
      <el-col :span="4">
        <el-button size="small" type="primary" @click="goGoods(0)">新建商品</el-button>
      </el-col>
      <el-col :span="4">
        <el-select size="small" v-model="optionsValue" placeholder="全部">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-input
          size="small"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="listQuery.item_name"
        ></el-input>
      </el-col>
      <el-col :span="2" class="success-btn">
        <el-button type="success" icon="el-icon-search" size="small" @click="searchGoods">搜索</el-button>
      </el-col>
    </el-col>-->
    <el-col :span="24" class="title-header">
      <el-col :span="5">
        <el-input size="small" placeholder="请输入商品名称" prefix-icon="el-icon-search" @keyup.enter.native="search"
          v-model="listQuery.item_name"></el-input>
      </el-col>
    </el-col>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit size="small"
      highlight-current-row>
      <!-- <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>-->
      <el-table-column label="商品名称" width="260" align="left">
        <template slot-scope="scope">
          <el-col :span="8">
            <img :src="scope.row.pic_url" class="head-img" alt>
          </el-col>
          <el-col :span="16">{{ scope.row.item_name }}</el-col>
        </template>
      </el-table-column>
      <el-table-column label="一级规格（营期）" align="center">
        <template slot-scope="scope">{{ scope.row.sku1_v }}</template>
      </el-table-column>
      <el-table-column label="群名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.chatroom_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二级规格（辅导员老师）：" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sku2_v }}</span>
        </template>
      </el-table-column>

      <el-table-column label="容量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.plan_user_cnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="二维码" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.qr_code_url" v-if="scope.row.qr_code_url" width="50" height="50" alt>
        </template>
      </el-table-column>
      <el-table-column label="应入群数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.user_cnt}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="余量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.plan_user_cnt-scope.row.user_cnt}}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="已入群人数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.in_room_cnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已购买未入群人数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.no_in_room_cnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已入群未入小程序" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.no_in_xiao_cnt}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建者" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.audio_num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.audio_num}}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" prop="created_at" width="100" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row.chatroom_code,scope.row.item_name)">编辑</el-button>
          <el-button size="mini" type="text" @click="goGroupUsers(scope.row.chatroom_code)">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination class="pagination" v-show="total>0" :total="total" :page.sync="listQuery.page_no"
      :limit.sync="listQuery.page_size" v-on:pagination="getGroupList" />

    <el-dialog title="编辑群信息" :visible.sync="alertShow">
      <el-form label-position="right" ref="addForm" :rules="rules" :model="addForm" label-width="180px">
        <el-form-item label="商品名称：">
          <el-col>{{addForm.item_name}}</el-col>
          <!-- <el-input size="small" v-model="addForm.item_name"></el-input> -->
        </el-form-item>
        <!-- <el-form-item label="规格明细：">
          <el-select v-model="value" @change="skuChange" size="small" placeholder="请选择规格明细">
            <el-option
              v-for="item in counselorOptions"
              :label="item.sku1_v+'-'+item.sku2_v"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="群名称：" prop="chatroom_name">
          <el-input size="small" v-model="addForm.chatroom_name"></el-input>
        </el-form-item>
        <el-form-item label="添加二维码：" prop="qr_code_url">
          <el-col class="qrcode-wrap" @click.native="showQrcode">
            <i class="el-icon-plus"></i>
            <img class="qrcode-img" v-if="addForm.qr_code_url" :src="addForm.qr_code_url" alt>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="二维码类型：">
          <el-input size="small" v-model="addForm.item_name"></el-input> 
        </el-form-item>-->
        <el-form-item label="群序号（先后顺序）：" prop="order_id">
          <el-input size="small" v-model="addForm.order_id"></el-input>
        </el-form-item>

        <el-form-item label="群人数：" prop="plan_user_cnt">
          <el-input size="small" v-model="addForm.plan_user_cnt"></el-input>
        </el-form-item>
        <el-form-item label="添加时间：">
          <el-date-picker @change="timeChange" value-format="yyyyMMdd" size="mini" v-model="slotTime" type="daterange"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <!-- <el-form-item class="form-item-wrap" align="center">
          <el-button type="danger" size="small" @click="closeAdd('addForm')">关闭</el-button>
          <el-button class="btn-bottom" size="small" type="primary" @click="onSubmit('addForm')">添加</el-button>
        </el-form-item>-->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="alertShow=false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="onSubmit('addForm')">确 定</el-button>
      </div>
      <el-dialog width="30%" title="选择二维码" :visible.sync="qrcodeAlert" append-to-body>
        <el-row>
          <el-col v-for="(item,index) in qrcodeList" :span="8" :key="index">
            <img class="qrcode-img-item" :src="item.qr_code_url" @click="tagQrcode(item.qr_code_url, item.qr_code_id)"
              alt>
            <el-col :span="16" style="text-align: center;">{{item.qr_code_name}}</el-col>
          </el-col>
        </el-row>
      </el-dialog>
    </el-dialog>

    <!-- <el-row class="alert-bg" v-if="alertShow">
      <el-col class="add-wrap" :span="24">
        <el-row class="add-title">
          <el-col class="title-text" :span="20">{{title}}</el-col>
        </el-row>
        <el-row class="add-form-wrap">
          <el-form
            class="form-conten-wrap"
            label-position="left"
            ref="addForm"
            :model="addForm"
            label-width="100px"
          >
            <el-form-item label="商品名称：">
              <el-input size="small" v-model="addForm.item_name"></el-input>
            </el-form-item>
            <el-form-item label="一级规格（营期）：">
              <el-input size="small" v-model="addForm.item_name"></el-input>
            </el-form-item>
            <el-form-item label="二级规格（辅导员老师）：">
              <el-input size="small" v-model="addForm.item_name"></el-input>
            </el-form-item>
            <el-form-item label="群名称：">
              <el-input size="small" v-model="addForm.item_name"></el-input>
            </el-form-item>
            <el-form-item label="添加二维码：">
              <el-input size="small" v-model="addForm.item_name"></el-input>
            </el-form-item>
            <el-form-item label="二维码类型：">
              <el-input size="small" v-model="addForm.item_name"></el-input>
            </el-form-item>

            <el-form-item label="群人数：">
              <el-input size="small" v-model="addForm.item_name"></el-input>
            </el-form-item>
            <el-form-item label="添加时间：">
              <el-input size="small" v-model="addForm.item_name"></el-input>
            </el-form-item>
            <el-form-item class="form-item-wrap" align="center">
              <el-button type="danger" size="small" @click="closeAdd('addForm')">关闭</el-button>
              <el-button
                class="btn-bottom"
                size="small"
                type="primary"
                @click="onSubmit('addForm')"
              >添加</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </el-col>
    </el-row>-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getGroupList, getCounselorList, getGroupDetail, getQrcodeList, updateGroup } from '@/api/group'
import Request from '@/utils/request'
export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      // 时间段
      slotTime: [],
      qrcodeList: [],
      qrcodeForm: {
        page_no: 1,
        page_size: 400,
        qr_code_type: ''
      },
      qrcodeAlert: false,
      alertShow: false,
      title: '编辑群信息',
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        item_id: '',
        sku1_kid: '',
        page_no: 1,
        page_size: 10,
        item_name: '',
      },
      addForm: {
        camps_type: 9,
        item_name: ''

      },
      rules: {
        chatroom_name: [
          { required: true, message: '请输入群名称', trigger: 'change' },
        ],
        qr_code_url: [
          { required: true, message: '请上传二维码', trigger: 'change' },
        ],
        order_id: [
          { required: true, message: '请输入群序号（先后顺序）', trigger: 'change' },
        ],
        plan_user_cnt: [
          { required: true, message: '请输入群人数', trigger: 'change' },
        ]
      }
    }
  },
  created() {
    // console.log(this.$route.query)
    if (this.$route.query.item_id && this.$route.query.sku1_kid) {
      this.listQuery.item_id = this.$route.query.item_id;
      this.listQuery.sku1_kid = this.$route.query.sku1_kid;
      this.getGroupList()
    } else {
      this.$message({
        type: 'error',
        message: '没有信息!'
      })
    }

  },
  methods: {
    changePaging(val) {
      this.getGoodsList();
    },
    // 获取库存列表
    getGroupList() {

      this.listLoading = true;
      getGroupList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.list = res.result.rows;
          this.total = res.result.total;
          // console.log(res)
        }
      })

    },
    //  搜索 
    search() {
      this.listQuery.page_no = 1;
      this.getGroupList()
    },
    // 添加
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.addForm.qr_code_id, '添加')
          const map = {
            begin_date: this.addForm.begin_date,
            camps_type: this.addForm.camps_type,
            chatroom_code: this.addForm.chatroom_code,
            chatroom_name: this.addForm.chatroom_name,
            end_date: this.addForm.end_date,
            order_id: this.addForm.order_id,
            plan_user_cnt: this.addForm.plan_user_cnt,
            qr_code_id: this.addForm.qr_code_id
          }

          // console.log(map, '编辑群信息传的参数----')
          if (map.begin_date && map.end_date) {
            updateGroup(map).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '创建成功！'
                })
                this.getGroupList();
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: '营期时间不能为空哦！'
            })
          }

        } else {
          console.log('error submit!!');
          return false;
        }
      });



    },
    // 取消编辑（关闭按钮）
    closeAdd(formName) {
      // console.log(this.$refs[formName].resetFields)
      // this.$refs[formName].resetFields();
      this.alertShow = false;
    },
    // 查看明细
    goGroupUsers(id) {
      this.$router.push({ path: `./userlist/${id}` })
    },
    // 更改时间
    timeChange(val) {
      // console.log('事假', val.length)
      if (val.length == 2) {
        this.addForm.begin_date = val[0]
        this.addForm.end_date = val[1]
      }
    },
    // 获取辅导员老师list
    // getCounselorList() {
    //   getCounselorList().then(res => {
    //     if (res.code == 200) {
    //       this.counselorOptions = res.result;
    //     }
    //   })
    // },
    // 显示二维码list
    showQrcode() {
      this.getQrcodeList();
      this.qrcodeAlert = true;
    },
    // 选择二维码
    // tagQrcode(qr_code_url) {
    //   console.log(qr_code_url)
    //   this.addForm.qr_code_url = qr_code_url;
    //   this.qrcodeAlert = false;
    // },
    getQrcodeList() {
      const data = this.qrcodeForm;
      getQrcodeList(data).then(res => {
        if (res.code == 200) {
          // console.log('二维码list', res.result)
          this.qrcodeList = res.result.rows;
        }
      })
    },
    // 编辑
    edit(chatroom_code, item_name) {
      // this.getGroupDetail(chatroom_code, item_name);
      // console.log('index', chatroom_code)
      getGroupDetail({ chatroom_code }).then(res => {
        if (res.code == 200) {
          // console.log(res.result, this.addForm, '修改群信息的参数看看')
          this.addForm = { ...this.addForm, ...res.result };
          this.slotTime = [`'${res.result.begin_date}'`, `'${res.result.end_date}'`];
          this.alertShow = true;
          this.addForm.item_name = item_name;
        }
      })


    },
    // 选择二维码
    tagQrcode(qr_code_url, qr_code_id) {
      // console.log(qr_code_id, 'qr_code_id')
      this.addForm.qr_code_url = qr_code_url;
      this.addForm.qr_code_id = qr_code_id;
      this.qrcodeAlert = false;
    },
    // 获取二维码list
    getQrcodeList() {
      const data = this.qrcodeForm;
      getQrcodeList(data).then(res => {
        if (res.code == 200) {
          // console.log('二维码list', res.result)
          this.qrcodeList = res.result.rows;
        }
      })
    },




  }
}
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  padding: 20px;
  .head-img {
    width: 50px;
    height: 50px;
  }
  .popularize-wrap {
    z-index: 20;
    position: absolute;
    top: 40%;
    left: 40%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 5px;
    background-color: #ededed;
  }
}
.title-header {
  padding: 10px 0;
}
.success-btn {
  text-align: right;
}
.qrcode-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed #ededed;
  .qrcode-img {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 80px;
  }
}
.qrcode-img-item {
  margin: 10px;
  width: 80px;
  height: 80px;
  cursor: pointer;
}
.alert {
  &-bg {
    z-index: 1002;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    .add-wrap {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 5px;
      height: auto;
      width: 50%;
      overflow: hidden;
      background-color: #fff;
      .add-title {
        font-size: 23px;
        font-weight: 500;
        border: 1px solid #ddd;
        padding: 10px;
      }
      .add-form-wrap {
        padding: 30px 20px;
        .close-icon {
          position: absolute;
          top: 6px;
          right: 10px;
        }
      }
      .form-item-wrap {
        margin: 10px 0;
        .btn-bottom {
          margin: 0 30px;
        }
      }
    }
  }
}
</style>

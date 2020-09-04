<template>
  <div class="app-container">
    <!-- 规格级(一级规格) 【2】 -->
   <!--  <el-col :span="24" class="title-header">
      <el-col :span="5">
        <el-input size="small" placeholder="请输入商品名称" prefix-icon="el-icon-search" @keyup.enter.native="search"
          v-model="listQuery.item_name"></el-input>
      </el-col>
    </el-col> -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit size="small"
      highlight-current-row>
      <el-table-column label="商品名称" width="200" align="center">
        <template slot-scope="scope">
          <el-col :span="8">
            <img :src="scope.row.pic_url" class="head-img" alt>
          </el-col>
          <el-col :span="16">{{ scope.row.item_name }}</el-col>
        </template>
      </el-table-column>
      <el-table-column label="一级规格（营期）" align="center">
        <template slot-scope="scope">{{ scope.row.sku1_name }}</template>
      </el-table-column>
      <el-table-column label="规格编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_no }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="小程序ID" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.item_id_xiao}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="群数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.chatroom_cnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总库存" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.plan_user_cnt}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="二维码" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.pic_url" class="head-img" v-if="scope.row.pic_url" alt>
        </template>
      </el-table-column> -->
      <el-table-column label="已购买人数已支付" align="center" width="85">
        <template slot-scope="scope">
          <span>{{scope.row.user_cnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="可售卖数量待售" align="center" width="85">
        <template slot-scope="scope">
          <span>{{scope.row.quantity}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已占用库存待支付" align="center" width="85">
        <template slot-scope="scope">
          <span>{{scope.row.wait_cnt}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="余量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.plan_user_cnt-scope.row.user_cnt}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="已购买未入群" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.no_room_cnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已入群人数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.in_room_cnt}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="已购买未入群人数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.no_in_room_cnt}}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="已入群未入小程序" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.no_in_xiao_cnt}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="created_at" width="100" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="addShow(scope.row.item_id,scope.$index,scope.row.sku1)">添加
          </el-button>
          <el-button size="mini" type="text" @click="goSku2(scope.row.item_id, scope.row.sku1)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination class="pagination" v-show="total>0" :total="total" :page.sync="listQuery.page_no"
      :limit.sync="listQuery.page_size" v-on:pagination="getSkusList" />

    <el-dialog title="添加库存" :visible.sync="alertShow">
      <el-form label-position="right" ref="addForm" :rules="rules" :model="addForm" label-width="180px">
        <el-form-item label="商品名称：">
          <el-col>{{addForm.item_name}}</el-col>
        </el-form-item>
        <el-form-item label="规格明细：" required>

          <el-select v-model="value" value-key="sku2_vid" @change="skuChange" size="small" style="width:350px;"
            placeholder="请选择规格明细">
            <el-option v-for="item in counselorOptions" :key="item.sku_id" :label="item.sku_data"
              :value='`{"sku1_v":"${item.sku1_v}","sku_id":"${item.sku_id}"}`'></el-option>

            <!-- <el-option
              v-else
              v-for="itm in counselorOptions"
              :label="item.sku1_v +'-'+ item.sku2_v"
              :value='`{"sku1_v":"${itm.sku1_v}","sku_id":"${itm.sku_id}"}`'
            ></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="群名称：" prop="chatroom_name">
          <el-input size="small" v-model="addForm.chatroom_name"></el-input>
        </el-form-item>
        <el-form-item label="添加二维码：" prop="qr_code_url">
          <el-col class="qrcode-wrap" @click.native="showQrcode">
            <i class="el-icon-plus"></i>
            <img class="qrcode-img" v-if="addForm.qr_code_url" :src="addForm.qr_code_url" alt>
          </el-col>
        </el-form-item>
        <el-form-item label="群序号（先后顺序）：" prop="order_id">
          <el-input size="small" v-model="addForm.order_id"></el-input>
        </el-form-item>

        <el-form-item label="群人数：" prop="plan_user_cnt">
          <el-input size="small" v-model="addForm.plan_user_cnt"></el-input>
        </el-form-item>
        <el-form-item label="营期时间：" required>
          <el-date-picker @change="timeChange" value-format="yyyyMMdd" size="mini" v-model="slotTime" type="daterange"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        
        <el-form-item label="营期：" prop="periods">
          <el-input size="small"  onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" v-model="addForm.periods"></el-input>
          <span style="color:red;display: block;">示例：营期为第10期，填写10即可</span>
        </el-form-item>

        <el-form-item label="添加管理员：">
          <el-col :span="24">
            <el-col :span="6">
              <el-col :span="5">
                <el-button type="text" size="mini" @click="addManager">点击添加管理员</el-button>
              </el-col>
            </el-col>
          </el-col>
          <el-col :span="15">
            <el-table border size="mini" :data="selectUser" v-if="selectUser.length>0" style="width: 100%">
              <el-table-column prop="date" label="真实姓名(微信昵称)">
                <template slot-scope="scope">
                  <el-col>{{scope.row.user_name}}</el-col>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="created_at" width="100" label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="removeUser(scope.row.user_id)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>

        <el-form-item label="添加辅导员：">
          <el-col :span="24">
            <el-col :span="6">
              <el-col :span="5">
                <el-button type="text" size="mini" @click="addCounselor">点击添加辅导员</el-button>
              </el-col>
              <span style="color:red;position: absolute;left: -106px;">*</span>
            </el-col>
          </el-col>
          <el-col :span="15">
            <el-table border size="mini" :data="selectCounselor" v-if="selectCounselor.length>0" style="width: 100%">
              <el-table-column prop="date" label="真实姓名(微信昵称)">
                <template slot-scope="scope">
                  <el-col>{{scope.row.user_name}}</el-col>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="created_at" width="100" label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="removeCounselor(scope.row.user_id)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>

        <el-col style="color:red;margin-left:85px;">亲们切记：去训练营中创建营期并关联规格再上架商品，这里无需选择！</el-col>
        <el-form-item label="选择小程序：">
          <el-select v-model="addForm.item_id_xiao" size="small" clearable placeholder="请选择小程序">
            <el-option v-for="(item,index) in miniList" :key="index" :label="item.goodsTitle" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="alertShow=false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="onSubmit('addForm')">确 定</el-button>
      </div>
      <!-- 选择二维码 -->
      <el-dialog width="30%" title="选择二维码" :visible.sync="qrcodeAlert" append-to-body>
        <el-row>
          <el-col :span="12">
            <el-input size="small" clearable v-model="qrcodeForm.qr_code_name" placeholder="请输入二维码名称"
              @clear="handleClear" @keyup.native.enter="getSourcesList"></el-input>
          </el-col>
          <el-col :span="2" class="success-btn" style="margin-left:15px;">
            <el-button type="success" @click="getSourcesList" icon="el-icon-search" size="small">搜索</el-button>
          </el-col>
        </el-row>

        <el-row>
          <el-col v-for="(item,index) in qrcodeList" :span="8" :key="index">
            <img class="qrcode-img-item" :src="item.qr_code_url" @click="tagQrcode(item.qr_code_url,item.qr_code_id)"
              alt>
            <el-col :span="16" style="text-align: center;">{{item.qr_code_name}}</el-col>
          </el-col>
        </el-row>
      </el-dialog>

      <!-- 选择管理员 -->
      <el-dialog width="45%" title="添加管理员" :visible.sync="groupManager" append-to-body>
        <el-row>
          <el-col :span="10">
            <el-input size="small" placeholder="请输入真实姓名或微信昵称" prefix-icon="el-icon-search" clearable
              v-model="manage.user_name"></el-input>
          </el-col>
          <el-col :span="3" align="right">
            <el-button type="success" size="mini" @click="getManagerList">搜索</el-button>
          </el-col>
          <el-col :span="10" align="right">
            <el-button type="primary" size="mini" @click="batchAddition">批量添加</el-button>
          </el-col>

          <el-col :span="24" style="margin-top: 20px;">
            <el-table v-loading="manageLoading" :data="manageList" ref="multipleTable" element-loading-text="Loading"
              border fit size="small" highlight-current-row @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="80" align="center">
              </el-table-column>
              <el-table-column label="真实姓名(微信昵称)" align="center">
                <template slot-scope="scope">
                  <el-col>{{ scope.row.user_name }}</el-col>
                </template>
              </el-table-column>
            </el-table>
            <pagination class="pagination" v-show="manageTotal>0" :total="manageTotal" :page.sync="manage.page_no"
              :limit.sync="manage.page_size" v-on:pagination="getManagerList" />

          </el-col>
        </el-row>
        <el-col :span="24">

        </el-col>
      </el-dialog>

      <!-- 选择辅导员 -->
      <el-dialog width="45%" title="添加辅导员" :visible.sync="groupCounselor" append-to-body>
        <el-row>
          <el-col :span="10">
            <el-input size="small" placeholder="请输入真实姓名或微信昵称" prefix-icon="el-icon-search" clearable
              v-model="counselor.user_name"></el-input>
          </el-col>
          <el-col :span="3" align="right">
            <el-button type="success" size="mini" @click="searchCounselor">搜索</el-button>
          </el-col>
          <el-col :span="10" align="right">
            <el-button type="primary" size="mini" @click="sureCounselor">批量添加</el-button>
          </el-col>

          <el-col :span="24" style="margin-top: 20px;">
            <el-table v-loading="counselorLoading" :data="counselorList" ref="multipleTable"
              element-loading-text="Loading" border fit size="small" highlight-current-row
              @selection-change="handleCounselor">
              <el-table-column type="selection" width="80" align="center">
              </el-table-column>
              <el-table-column label="真实姓名(微信昵称)" align="center">
                <template slot-scope="scope">
                  <el-col>{{ scope.row.user_name }}</el-col>
                </template>
              </el-table-column>
            </el-table>
            <pagination class="pagination" v-show="counselorTotal>0" :total="counselorTotal"
              :page.sync="counselor.page_no" :limit.sync="counselor.page_size" v-on:pagination="getCounselorList" />

          </el-col>
        </el-row>
        <el-col :span="24">

        </el-col>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getSkusList, getGoodsDetail, getManagerList } from '@/api/shopGoods'
import { getMiniProgram } from "@/api/shopGoods"
import { getSourcesList, addChatroom } from '@/api/goodMother'
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
      qrcodeList: [],
      qrcodeForm: {
        page_no: 1,
        page_size: 400,
        qr_code_type: '',
        qr_code_name: ''
      },
      // 时间段
      slotTime: '',
      alertShow: false,
      qrcodeAlert: false,
      title: '添加库存',
      list: [],
      listLoading: false,
      total: 0,
      counselorOptions: [],
      value: '',
      listQuery: {
        page_no: 1,
        page_size: 10,
        item_name: '',
        item_id: ''
      },
      addForm: {
        camps_type: 9,
        qr_code_url: '',
        chatroom_coach: [],
        chatroom_manager: [],
        item_id_xiao: '',
        // item_name: '',

        order_id: 0,
        chatroom_name: '',
        // end_date: '',
        // "item_id": '',
        // plan_user_cnt: '',
        // qr_code_id: '',
        // sku_id: '',
        periods: null,
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
        ],
        periods: [
          { required: true, message: '请输入营期', trigger: 'change' },
        ],
        // item_id_xiao: [ 
        //   { required: true, message: '请选择小程序', trigger: 'change' },
        // ]
      },
      groupManager: false,
      manage: {
        page_no: 1,
        page_size: 10,
        user_name: "",
        user_id_no: ''
      },
      manageLoading: false,
      manageList: [],
      manageTotal: 0,
      selectUser: [],
      handleSelectUser: [],
      groupCounselor: false,
      selectCounselor: [],
      counselor: {
        page_no: 1,
        page_size: 10,
        user_name: "",
        user_id_no: ''
      },
      counselorLoading: false,
      counselorList: [],
      counselorTotal: 0,
      miniList: []
    }
  },
  created() {
    this.getSkusList();
    this.getMiniProgram();
    console.log(this.$route.params.id, '/')
    this.listQuery.item_id = this.$route.params.id;
  },
  methods: {
    // 获取库存列表
    getSkusList() {
      this.listLoading = true;
      getSkusList(this.listQuery).then(res => {
        if (res.code == 200) {
          this.listLoading = false;
          this.list = res.result.rows;
          this.total = res.result.total;
        }
      })
    },
    //  搜索 
    search() {
      this.listQuery.page_no = 1;
      this.getSkusList();
    },
    // 添加
    onSubmit(formName) {
      this.selectUser.forEach(item => {
        //管理员
        this.addForm.chatroom_manager.push({
          mamager_id: item.user_id,
          mamager_name: item.user_name
        })
      })

      this.selectCounselor.forEach(item => {
        this.addForm.chatroom_coach.push({
          coach_id: item.user_id,
          coach_name: item.user_name
        })
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addForm.begin_date && this.addForm.end_date) {
            if (this.addForm.sku_id) {
              if(this.addForm.chatroom_coach.length>0){
                addChatroom(this.addForm).then(res => {
                  if (res.code == 200) {
                    this.alertShow = false;
                    this.$message({
                      type: 'success',
                      message: '创建成功！'
                    })
                    this.getSkusList();
                  }
                })
              }else{
                this.$message({
                  type: 'warning',
                  message: '请选择辅导员！'
                })
              }
            } else {
              this.$message({
                type: 'warning',
                message: '规格明细不能为空哦！'
              })
            }
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
    // 取消添加（关闭按钮）
    closeAdd(formName) {
      this.alertShow = false;
    },
    getGoodsDetail(item_id, sku1) {
      console.log(sku1, 'sku1')

      getGoodsDetail({ item_id, shelf_flag: 1 }).then(res => {
        if (res.code == 200) {
          const skus = res.result.skus;
          var sku1_v;
          var sku2_v;
          var sku3_v;
          console.log(skus, 'skus')
          skus.forEach(item => {
            sku1_v = item.sku1_v;
            sku2_v = item.sku2_v;
            sku3_v = item.sku3_v;
            if (sku3_v) {
              item.sku_data = sku1_v + '--' + sku2_v + '--' + sku3_v;
            } else if (sku2_v) {
              item.sku_data = sku1_v + '--' + sku2_v;
            } else if (sku1_v) {
              item.sku_data = sku1_v;
            }
          })
          // console.log(skus, 'skus')
          // const counselor = [];
          // skus.filter(item => {
          //   if (sku1 == item.sku_id) {
          //     counselor.push(item)
          //   }
          // })
          // console.log(counselor,'counselor')
          this.counselorOptions = skus;
          console.log(this.counselorOptions, 'this.counselorOptions')
        }
      })
    },
    // 查看详情
    goSku2(item_id, sku1) {
      this.$router.push({ path: '../skus', query: { item_id, sku1 } })
    },
    // 添加群显示
    addShow(item_id, index, sku1) {
      console.log(item_id, index)
      this.getGoodsDetail(item_id, sku1)

      // console.log(index, this.list[index])
      this.addForm = { ...this.addForm, ...this.list[index] };
      this.addForm.plan_user_cnt = '';
      this.selectUser.length = 0;
      this.selectCounselor.length = 0;
      this.value = '';
      this.slotTime = '';
      this.addForm.plan_user_cnt = '';
      this.addForm.chatroom_name = '';
      this.addForm.qr_code_url = '';
      this.addForm.order_id = 0;
      this.addForm.chatroom_coach.length = 0;
      this.addForm.chatroom_manager.length = 0;
      this.addForm.item_id_xiao = '';

      this.alertShow = true;

    },
    // sku选择(规格明细)
    skuChange(value) {
      console.log(value)
      const val = JSON.parse(value);
      this.addForm.chatroom_name = val.sku1_v + this.addForm.item_name;
      this.addForm.sku_id = val.sku_id;
    },
    // 时间选择
    timeChange(val) {
      // console.log('事假', val.length)
      if (val.length == 2) {
        this.addForm.begin_date = val[0]
        this.addForm.end_date = val[1]
      }
    },

    // 显示二维码list
    showQrcode() {
      this.getSourcesList();
      this.qrcodeAlert = true;
    },
    // 选择二维码
    tagQrcode(qr_code_url, qr_code_id) {
      // console.log(qr_code_url)
      this.addForm.qr_code_url = qr_code_url;
      this.addForm.qr_code_id = qr_code_id;
      this.qrcodeAlert = false;
    },
    // 获取二维码list
    getSourcesList() {
      const data = this.qrcodeForm;
      getSourcesList(data).then(res => {
        if (res.code == 200) {
          // console.log('二维码list', res.result)
          this.qrcodeList = res.result.rows;
        }
      })
    },
    addManager() {
      this.groupManager = true;
      let userId = [];
      this.selectUser.forEach(item => {
        userId.push(item.user_id);
      })
      this.manage.user_id_no = userId.join(',');
      console.log(this.manage.user_id_no, '管理员选中的id')
      this.getManagerList();
    },
    //  查询管理员辅导员列表
    getManagerList() {
      this.manageLoading = true;
      getManagerList(this.manage).then(res => {
        if (res.code == 200) {
          this.manageLoading = false;
          this.manageList = res.result.rows;
          this.manageTotal = res.result.total;
        }
      })
    },
    handleSelectionChange(val) {
      console.log(val, 'val')
      this.handleSelectUser = val;
    },
    getCounselorList() {
      this.counselorLoading = true;
      getManagerList(this.counselor).then(res => {
        if (res.code == 200) {
          this.counselorLoading = false;
          this.counselorList = res.result.rows;
          this.counselorTotal = res.result.total;
        }
      })
    },
    //批量添加
    batchAddition() {
      this.handleSelectUser.forEach(item => {
        this.selectUser.push(item);
      })
      this.groupManager = false;
    },
    removeUser(user_id) {
      let userId = this.manage.user_id_no.split(',');
      this.selectUser.forEach((item, index) => {
        if (user_id == item.user_id) {
          this.selectUser.splice(index, 1);
        }
      })
      userId.forEach((itm, idx) => {
        if (user_id == itm.user_id) {
          userId.splice(idx, 1)
        }
      })
      this.manage.user_id_no = userId.join(',');
    },
    addCounselor() {
      this.groupCounselor = true;
      let counselorId = [];
      this.selectCounselor.forEach(item => {
        counselorId.push(item.user_id);
      })
      this.counselor.user_id_no = counselorId.join(',');
      console.log(this.counselor.user_id_no, '辅导员选中的id')
      this.getCounselorList();
    },
    sureCounselor() {
      this.counselorData.forEach(item => {
        this.selectCounselor.push(item)
      })
      this.groupCounselor = false;
    },
    handleCounselor(value) {
      // console.log(value,'辅导员')
      console.log(value, 'value')
      this.counselorData = value;
    },
    removeCounselor(user_id) {
      const counelorId = this.counselor.user_id_no.split(',');
      this.selectCounselor.forEach((item, index) => {
        if (item.user_id == user_id) {
          this.selectCounselor.splice(index, 1);
        }
      })
      counelorId.forEach((itm, idx) => {
        if (itm.user_id == user_id) {
          counelorId.splice(idx, 1);
        }
      })
      this.counselor.user_id_no = counelorId.join(',');
    },
    searchCounselor() {
      this.counselor.page_no = 1;
      this.getCounselorList();
    },
    getMiniProgram() {
      getMiniProgram().then(res => {
        if (res.code == 200) {
          this.miniList = res.result;
        }
      })
    },
    handleClear() {
      this.qrcodeForm.page_no = 1;
      this.getSourcesList();
    }
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
.head-img {
  width: 50px;
  height: 50px;
}
</style>

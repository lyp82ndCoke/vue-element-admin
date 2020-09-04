<template>
  <div class="app-container">
    <el-col :span="24" class="table-wrap">
      <el-col :span="24" class="title-header">
        <el-col :span="4" :xs="10">
          <el-button size="small" type="primary" @click="addGrouping()">创建库存（二维码）</el-button>
        </el-col>
        <el-col :span="3">
          <el-select size="small" clearable @change="searchGoodSku" v-model="listQuery.item_id" placeholder="请选择商品名称">
            <el-option v-for="item in goodsList" :key="item.item_id" :label="item.item_name" :value="item.item_id">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="6" align="center">
          <el-select size="small" clearable @change="searchChatroomList" v-model="listQuery.sku_id" placeholder="请选择规格">
            <el-option v-for="item in skuList" :key="item.sku_id" :label="item.skuSeach" :value="item.sku_id">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4" align="center" style="padding:0 20px;">
          <el-input size="small" placeholder="请输入群名称" v-model="listQuery.chatroom_name" clearable>
          </el-input>
        </el-col>

        <el-col :span="4" align="center" style="padding:0 20px;">
          <el-input size="small" placeholder="请输入群编码" v-model="listQuery.chatroom_code" clearable>
          </el-input>
        </el-col>

        <el-col :span="2" class="success-btn" :xs="10">
          <el-button type="success" @click="searchChatroomList" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-col>
      <el-table :height="firstHeight" v-loading="firstLoading" :data="firstList" element-loading-text="Loading" border
        fit size="small" highlight-current-row align="middle">

        <el-table-column label="群分类" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.camps_type == 8">会员学习群(训练营群)</span>
            <span v-else-if="scope.row.camps_type == 9">训练营常规群</span>
          </template>
        </el-table-column>
        <el-table-column label="群辅导员" align="center">
          <template slot-scope="scope">{{ scope.row.coach_name }}</template>
        </el-table-column>
        <el-table-column label="群编码" align="center">
          <template slot-scope="scope">{{ scope.row.chatroom_code }}</template>
        </el-table-column>
        <el-table-column label="群管理员" align="center">
          <template slot-scope="scope">{{ scope.row.mamager_name }}</template>
        </el-table-column>
        <el-table-column label="群名称" align="center">
          <template slot-scope="scope">{{ scope.row.chatroom_name }}</template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{ scope.row.item_name }}</template>
        </el-table-column>
        <el-table-column label="预入群人数" align="center">
          <template slot-scope="scope">{{ scope.row.plan_user_cnt }}</template>
        </el-table-column>
        <el-table-column label="群序号" align="center">
          <template slot-scope="scope">{{ scope.row.order_id }}</template>
        </el-table-column>
        <el-table-column label="二维码名称" align="center">
          <template slot-scope="scope">{{ scope.row.qr_code_name }}</template>
        </el-table-column>
        <el-table-column label="二维码类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.qr_code_type == 1">群</span>
            <span v-else-if="scope.row.qr_code_type == 2">管理员</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="editGrouping(scope.row.chatroom_code, scope.row.item_id)">编辑
            </el-button>
            <!-- <el-button
              size="small"
              type="text"
              @click="onShelf(scope.row.label_id)"
            >上架</el-button>
            <el-button
              size="small"
              type="text"
              @click="onShelf(scope.row.label_id)"
            >下架</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination class="pagination" v-show="firstTotal>0" :total="firstTotal" :page.sync="listQuery.page_no"
        :limit.sync="listQuery.page_size" v-on:pagination="getChatroomList" />
    </el-col>

    <!-- 创建库存 -->
    <el-dialog :title="stockTitle == 1 ? '添加库存' : '编辑库存'" :visible.sync="alertShow" class="dialog-stock">
      <el-form label-position="right" ref="addForm" :rules="rules" :model="addForm" label-width="180px">
        <!--  <el-form-item label="群分类：" required>
          <el-select size="mini" v-model="addForm.camps_type" clearable placeholder="请选择群分类">
            <el-option
              v-for="item in [{label:'训练营常规群',value:9},{label:'会员学习群(训练营群)',value:8}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="商品：" required v-if="stockTitle === 1">
          <el-select size="mini" v-model="value" @change="selectGoods" clearable placeholder="请选择商品">
            <el-option v-for="item in goodsList" :key="item.item_id" :label="item.item_name"
              :value='`{"item_id":"${item.item_id}","item_type":"${item.item_type}","item_name":"${item.item_name}"}`'>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="商品分类：" required>
          <el-select size="mini" disabled  v-model="addForm.item_type" clearable placeholder="请选择商品分类">
            <el-option
              v-for="item in [{label:'训练营商品',value:9},{label:'会员商品',value:8},{label:'普通商品',value:1}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="规格明细：" required v-if="stockTitle === 1">
          <el-select v-model="skuValue" value-key="sku2_vid" @change="skuChange" clearable size="small"
            placeholder="请选择规格明细">
            <el-option v-for="item in createSkuList" :key="item.sku_id" :label="item.skuSeach"
              :value='`{"sku_id":"${item.sku_id}","sku1_v":"${item.sku1_v}"}`'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="群名称：" prop="chatroom_name">
          <el-input size="small" v-model="addForm.chatroom_name"></el-input>
        </el-form-item>

        <el-form-item label="小程序：">
          <el-select size="mini" v-model="addForm.item_id_xiao" clearable placeholder="请选择小程序">
            <el-option v-for="widItem in widgetId" :key="widItem.id" :label="widItem.goodsTitle" :value="widItem.id">
            </el-option>
          </el-select>
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

        <el-form-item label="预入群人数：" prop="plan_user_cnt">
          <el-input size="small" v-model="addForm.plan_user_cnt"></el-input>
        </el-form-item>
        <el-form-item label="群辅导员：" required>
          <el-col>{{addForm.item_name}}</el-col>
        </el-form-item>
        <el-form-item label="群管理员：" required>
          <el-col>{{addForm.item_name}}</el-col>
        </el-form-item>
        <el-form-item label="添加时间：" required>
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
            <img class="qrcode-img-item" :src="item.qr_code_url" @click="tagQrcode(item.qr_code_url,item.qr_code_id)"
              alt>
            <el-col :span="16" style="text-align: center;">{{item.qr_code_name}}</el-col>
          </el-col>
        </el-row>
      </el-dialog>
    </el-dialog>

  </div>
</template>

<script>
import { getChatroomList, addChatroom, getChatroomDetails, updateChatroom } from "@/api/goodMother";
import { getGoods, getGoodsDetail } from "@/api/group"
import { getEduGoods } from "@/api/qecode";


import { getQrcodeList, getCounselorList } from '@/api/group'
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      firstHeight: null,
      firstLoading: false,
      firstList: [],
      alertShow: false,
      skuList: [],
      formTwo: {
        page_num: 1,
        page_size: 10,
        label_name: ""
      },
      listQuery: {
        page_no: 1,
        page_size: 10,
        chatroom_code: "",
        chatroom_name: "",
        item_id: "",
        sku_id: ""
      },
      firstTotal: 0,
      slotTime: '',
      //创建群提交data
      addForm: {
        begin_date: '',
        camps_type: 9,
        chatroom_name: '',
        end_date: '',
        item_id: '',
        item_type: '',
        order_id: 0,
        plan_user_cnt: '',
        qr_code_id: '',
        sku_id: '',
        chatroom_coach: [],
        chatroom_manager: [],
        item_id_xiao: '',


        qr_code_url: '',
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
          { required: true, message: '请输入预入群人数', trigger: 'change' },
        ]
      },
      // counselorOptions: [],
      qrcodeList: [],
      qrcodeAlert: false,
      goodsData: {
        page_no: 1,
        page_size: 100000,
      },
      goodsList: [],
      value: '',
      skuValue: '',
      widgetId: [],
      createSkuList: [],
      qrcodeForm: {
        page_no: 1,
        page_size: 400,
        qr_code_type: ''
      },
      stockTitle: 1, //1添加库存  2编辑库存
    };
  },
  created() {
    this.getChatroomList();
    this.getEduGoods();
    this.getGoods();
  },
  methods: {
    //获取小程序List
    getEduGoods() {
      getEduGoods().then(res => {
        if (res.code == 200) {
          this.widgetId = res.result;
        }
      })
    },
    //获取群List
    getChatroomList() {
      const data = this.listQuery;
      getChatroomList(data).then(res => {
        if (res.code == 200) {
          this.firstList = res.result.rows;
          this.firstTotal = res.result.total;
        }
      })
    },
    searchChatroomList() {
      this.listQuery.page_no = 1;
      this.getChatroomList();
    },
    //获取商品List
    getGoods() {
      const data = this.goodsData;
      getGoods(data).then(res => {
        if (res.code == 200) {
          this.goodsList = res.result.rows;
        }
      })
    },
    //获取商品的sku
    searchGoodSku(value) {
      this.listQuery.page_no = 1;
      this.getChatroomList();
      this.skuList = [];
      this.listQuery.sku_id = '';
      const data = {
        item_id: this.listQuery.item_id
      }
      if (data.item_id) {
        getGoodsDetail(data).then(res => {
          if (res.code == 200) {
            const list = res.result.skus;
            list.forEach((item, index) => {
              let v1 = item.sku1_v ? item.sku1_v : '';
              let v2 = item.sku2_v ? item.sku2_v : '';
              let v3 = item.sku3_v ? item.sku3_v : '';
              list[index].skuSeach = v1 + v2 + v3;
            })
            this.skuList = list;
          }
        })
      }
    },
    // 显示二维码list
    showQrcode() {
      this.getQrcodeList();
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
    getQrcodeList() {
      const data = this.qrcodeForm;
      getQrcodeList(data).then(res => {
        if (res.code == 200) {
          this.qrcodeList = res.result.rows;
        }
      })
    },
    // sku选择(规格明细)
    skuChange(value) {
      const item_name = JSON.parse(this.value).item_name;
      const skuData = JSON.parse(value);

      this.addForm.chatroom_name = skuData.sku1_v + item_name;
      this.addForm.sku_id = skuData.sku_id;
    },
    // 时间选择
    timeChange(val) {
      if (val.length == 2) {
        this.addForm.begin_date = val[0]
        this.addForm.end_date = val[1]
      }
    },
    //商品选择
    selectGoods(value) {
      const data = JSON.parse(value);
      this.addForm.item_id = data.item_id;
      this.addForm.item_type = data.item_type;
      this.addForm.chatroom_name = '';
      this.addForm.sku_id = '';
      this.skuValue = '';
      this.createSkuList = [];

      this.searchGoodsku(this.addForm.item_id);
    },
    // 根据商品id  查出该商品下的sku
    searchGoodsku(item_id) {
      const params = {
        item_id
      }
      if (params.item_id) {
        getGoodsDetail(params).then(res => {
          if (res.code == 200) {
            const list = res.result.skus;
            list.forEach((item, index) => {
              let v1 = item.sku1_v ? item.sku1_v : '';
              let v2 = item.sku2_v ? item.sku2_v : '';
              let v3 = item.sku3_v ? item.sku3_v : '';
              list[index].skuSeach = v1 + v2 + v3;
            })
            console.log(list, 'list----')
            this.createSkuList = list;
          }
        })
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
    //创建好妈妈会员 库存
    addGrouping() {
      this.alertShow = true;
      this.value = '';
      this.skuValue = '';
      this.createSkuList = [];
      const momForm = this.addForm;
      for (let key in momForm) {
        momForm[key] = '';
      }
      momForm['camps_type'] = 9;
      momForm['order_id'] = 0;
      this.slotTime = '';
    },
    editGrouping(chatroom_code, item_id) {
      this.stockTitle = 2;
      this.alertShow = true;
      this.searchGoodsku(item_id);
      this.getChatroomDetails(chatroom_code);

      // console.log(data, '编辑群详情')



      // :value='`{"item_id":"${item.item_id}","item_type":"${item.item_type}","item_name":"${item.item_name}"}`'

      // this.value = `{"item_id":"${data.item_id}","item_type":"${data.item_type}","item_name":"${data.item_name}"}`;
    },
    //获取编辑群的详情
    getChatroomDetails(chatroom_code) {
      getChatroomDetails({ chatroom_code }).then(res => {
        if (res.code == 200) {
          this.addForm = { ...this.addForm, ...res.result };
          this.slotTime = [`'${res.result.begin_date}'`, `'${res.result.end_date}'`];
        }
      })
    },
    addChatroom() {
      addChatroom(this.addForm).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '添加成功！'
          })
          this.getChatroomList();
          this.alertShow = false;
        }
      })
    },
    updateChatroom() {
      // updateChatroom(this.addForm).then(res => {
      //   if(res.code == 200){
      //     this.$message({
      //       type: 'success',
      //       message: '编辑成功！'
      //     })
      //     this.getChatroomList();
      //     this.alertShow = false;
      //   }
      // })
    },
    // 添加
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addForm.begin_date && this.addForm.end_date) {
            if (this.stockTitle === 1) {
              //添加库存
              this.addChatroom();
            } else if (this.stockTitle === 2) {
              //编辑库存
              this.updateChatroom();
            }
          } else {
            this.$message({
              type: 'warning',
              message: '添加时间不能为空哦！'
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
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
.dialog-stock .qrcode-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed #ededed;
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
}
.success-btn {
  text-align: right;
}
.form-wrap {
  margin-top: 20px;
}
.qrcode-img-item {
  margin: 10px;
  width: 80px;
  height: 80px;
  cursor: pointer;
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
</style>


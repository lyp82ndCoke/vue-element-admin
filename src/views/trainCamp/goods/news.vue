<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col
        :span="10"
        class="subtitle"
      >{{title}}</el-col>
    </sticky>
    <el-form
      class="demo-form-inline"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="160px"
      size="small"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="商品名："
            prop="item_name"
          >
            <el-input
              v-model="form.item_name"
              placeholder="请输入商品名"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="是否有群服务："
            prop="chatroom_flag"
          >
            <el-select
              v-model="form.chatroom_flag"
              placeholder="请选择是否有群服务"
            >
              <el-option
                v-for="item in [{label:'是',value:1},{label:'否',value:0}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="是否填写手机号："
            prop="mobile_flag"
          >
            <el-select
              v-model="form.mobile_flag"
              placeholder="请选择是否填写手机号"
            >
              <el-option
                v-for="item in [{label:'是',value:1},{label:'否',value:0}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="是否填写孩子性别"
            prop="sex_flag"
          >
            <el-select
              v-model="form.sex_flag"
              placeholder="请选择是否填写孩子性别"
            >
              <el-option
                v-for="item in [{label:'是',value:1},{label:'否',value:0}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="是否填写孩子关系"
            prop="relation_flag"
          >
            <el-select
              v-model="form.relation_flag"
              placeholder="请选择是否填写孩子关系"
            >
              <el-option
                v-for="item in [{label:'是',value:1},{label:'否',value:0}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="是否填写孩子年龄"
            prop="age_flag"
          >
            <el-select
              v-model="form.age_flag"
              placeholder="请选择是否填写孩子年龄"
            >
              <el-option
                v-for="item in [{label:'是',value:1},{label:'否',value:0}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="是否填写生日"
            prop="birthday_flag"
          >
            <el-select
              v-model="form.birthday_flag"
              placeholder="请选择是否填写生日"
            >
              <el-option
                v-for="item in [{label:'是',value:1},{label:'否',value:0}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="分享描述："
            prop="item_desc"
          >
            <el-input
              v-model="form.item_desc"
              placeholder="请输入分享描述"
            ></el-input>
          </el-form-item>
          <el-row>
            <el-col class="grid-content bg-putple-light">
              <el-form-item
                label="商品图片："
                prop="pic_url"
                class="avater-wrap"
              >
                <el-col>
                  <el-upload
                    class="avatar-uploader"
                    :action="host"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img
                      v-if="form.pic_url"
                      :src="form.pic_url"
                      class="avatar"
                      v-model="form.pic_url"
                    >
                    <i
                      v-else
                      class="el-icon-plus avatar-uploader-icon"
                    ></i>
                  </el-upload>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="现价(分)："
                prop="price"
              >
                <el-input
                  v-model="form.price"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                  placeholder="请输入商品现价"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="原价(分)："
                prop="original_price"
              >
                <el-input
                  v-model="form.original_price"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                  placeholder="请输入商品原价"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="轮播图："
                required
              >
                <span
                  class="banner-img-wrap"
                  v-for="(item,index) in form.slider_img"
                  :key="index"
                >
                  <img
                    class="banner-img"
                    :src="item.img"
                    alt
                  >
                  <span class="banner-img-remove">
                    <i
                      class="el-icon-delete"
                      @click="delBannerImg(index)"
                    ></i>
                  </span>
                </span>
                <el-upload
                  class="upload-demo"
                  :show-file-list="false"
                  :action="host"
                  :on-preview="handlePreview"
                  :on-remove="removeImg"
                  :file-list="fileList"
                  :on-success="updateImg"
                  list-type="picture-card"
                  :before-upload="beforeAvatarUpload"
                >
                  <i class="el-icon-plus"></i>
                  <!-- <div class="el-upload__tip" slot="tip">建议尺寸***</div> -->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item
              label="商品编码："
              prop="item_no"
            >
              <el-input
                v-model="form.item_no"
                placeholder="请输入商品编码"
              ></el-input>
            </el-form-item>
          </el-row>
        </el-col>
        <!-- <el-col :span="12">
          <el-row>
            <el-col :span="20">
              <div class="grid-content">
                <el-form-item label="商品详情：" prop="personal_smart">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 8, maxRows:8 }"
                    placeholder="请输入商品详情"
                    v-model="form.personal_smart"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-col>-->
      </el-row>
      <el-form-item>
        <el-button
          type="primary"
          @click="onGoodSubmit('form')"
          :loading="saveGoods"
        >更新商品基本信息</el-button>
      </el-form-item>

      <el-row></el-row>
      <el-row>
        <!--  <el-form-item label="规格明细：">
          <table class="table-sku" border="1px solid #ccc" id="getSkuk">
            <thead>
              <tr>
                <td v-for="(list,index) in tableData" :key="`list${index}`">{{list['sku_k']}}</td>
                
                <td>价格(元)</td>
                <td>库存</td>
                <td>规格编码</td>
                <td>成本价</td>
                <td>销量</td>
                <td>小程序id</td>
                <td>状态</td>
                <td>操作</td>
              </tr>
            </thead>
            <tbody>
             
              <tr v-for="(sku,index) in skus">
                <td v-for="item in tableData" ref="td">{{getValueName(sku,item)}}</td>
                <td>
                  <el-input required type="text" v-model="sku.sku_price" maxlength="9"></el-input>
                </td>
                <td>
                  <el-input required type="text" v-model="sku.sku_with_hold_quantity" maxlength="9"></el-input>
                </td>
                <td>
                  <el-input required type="text" v-model="sku.sku_item_no" maxlength="9"></el-input>
                </td>
                <td>
                  <el-input required type="text" v-model="sku.sku_cost_price" maxlength="9"></el-input>
                </td>
                <td>
                  <el-input required type="text" v-model="sku.sku_sold_num" maxlength="20"></el-input>
                </td>
                <td>
                  <el-select v-model="sku.item_id_xiao" placeholder="请选择">
                    <el-option
                      v-for="widItem in widgetId"
                      :key="widItem.id"
                      :label="widItem.goodsTitle"
                      :value="widItem.id"
                    ></el-option>
                  </el-select>
                </td>
                <td></td>
                <td></td>
              </tr>
           
            </tbody>
          </table>
        </el-form-item>-->
      </el-row>
    </el-form>

    <el-form
      class="demo-form-inline"
      ref="formSpec"
      :rules="formSpecs"
      :model="formSpec"
      label-width="160px"
      size="small"
    >
      <el-row>
        <el-form-item label="商品规格：">
          <el-row v-for="(item, index) in specMore" :key="index">
            <!-- 规格名 -->
            <el-row style="margin-top:20px;">
              <el-col :span="2">规格名：</el-col>
              <el-col :span="6">
                <el-select
                  v-model="specMore[index].id"
                  filterable
                  clearable
                  allow-create
                  default-first-option
                  placeholder="请选择规格名"
                  value-key="sku_kid"
                  @change="changeSpecName(index)"
                >
                  <el-option
                    v-for="checkItem in specOptions"
                    :key="checkItem.sku_kid"
                    :label="checkItem.sku_k"
                    :value="checkItem"
                  ></el-option>
                </el-select>
                <i
                  class="el-icon-close close-project"
                  @click="removeProject(index)"
                ></i>
              </el-col>
            </el-row>
            <!-- 规格值 -->

            <el-row style="margin-top:20px;">
              <el-col :span="2">规格值：</el-col>
              <el-col
                :span="5"
                v-for="(valueItem,valueIndex) in specMore[index].value"
                :key="valueIndex"
                style="margin-top:20px;"
              >
                <!-- {{valueItem + 'valueItem'}} -->
                <el-select
                  v-model="specMore[index].value[valueIndex]"
                  filterable
                  clearable
                  allow-create
                  default-first-option
                  value-key="sku_vid"
                  placeholder="请选择规格值"
                  @change="handleSpecValue(index, valueIndex)"
                >
                  <el-option
                    v-for="sItem in options[index]"
                    :key="sItem.sku_vid"
                    :label="sItem.sku_v"
                    :value="sItem"
                  ></el-option>
                </el-select>
                <i
                  class="el-icon-close close-project"
                  @click="removeValue(index, valueIndex)"
                ></i>
              </el-col>

              <el-col :span="2">
                <el-button
                  type="text"
                  @click="addSpecValue(index)"
                  style="margin-top:20px;"
                >添加规格值</el-button>
              </el-col>
            </el-row>
          </el-row>
          <el-row style="margin-top:20px;">
            <el-button
              type="primary"
              v-if="specMore.length<=2"
              size="mini"
              @click="addSpecProject"
            >添加规格项目</el-button>
          </el-row>
        </el-form-item>
      </el-row>
      <el-form-item
        v-if="tableData.length"
        label="规格明细："
        required
      >
        <table
          class="table-sku"
          border="1px solid #ccc"
          id="getSkuk"
        >
          <thead>
            <tr>
              <td
                v-for="(list,index) in tableData"
                :key="`list${index}`"
              >{{list['sku_k']}}</td>
              <!-- :data-skukid="list['sku_kid']"
              :data-skuk="list['sku_k']"-->
              <td>价格(分)</td>
              <td>原价(分)</td>
              <td>库存</td>
              <td>规格编码</td>
              <td>成本价(分)</td>
              <td>销量</td>
              <td>小程序id</td>
              <!-- <td>状态</td> -->
              <td>上下架</td>
              <!-- <td>操作</td> -->
            </tr>
          </thead>
          <tbody>
            <!-- <tr v-for="(row,index) in rows" :key="`row${index}`">
              <td v-for="(item,index2) in tableData" ref="td" :key="`item${index2}`">
                v-if="!((row-1)%item['rowspan'])"
                :rowspan="item['rowspan']"
                {{row}}
                {{item|getName(row)}}
            </td>-->
            <!-- </tr> -->
            <tr v-for="(sku,index) in formSpec.skus" :key="index">
              <td v-for="(item,idx) in tableData" :key="idx">{{getValueName(sku,item)}}</td>
              <!-- 价格 -->
              <td>
                <el-col :span="24">
                  <el-form-item
                    :prop="`skus.${index}.sku_price`"
                    :rules="formSpecs.sku_price"
                  >
                    <!-- :prop="`skus.${index}.sku_price`" -->
                    <el-input
                      size="small"
                      type="text"
                      v-model="sku.sku_price"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      maxlength="9"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </td>
              <!-- 原价 -->
              <td>
                <el-col :span="24">
                  <el-form-item
                    :prop="`skus.${index}.sku_original_price`"
                    :rules="formSpecs.sku_original_price"
                  >
                    <!-- :prop="`skus.${index}.sku_price`" -->
                    <el-input
                      size="small"
                      type="text"
                      v-model="sku.sku_original_price"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      maxlength="9"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </td>
              <!-- 库存 -->
              <td>
                <el-col
                  v-if="!form.chatroom_flag"
                  :span="24"
                >
                  <el-form-item
                    :prop="`skus.${index}.sku_with_hold_quantity`"
                    :rules="formSpecs.sku_with_hold_quantity"
                  >
                    <el-input
                      type="text"
                      v-model="sku.sku_with_hold_quantity"
                      placeholder="请在库存管理中设置"
                      maxlength="9"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col v-else>
                  <el-form-item>
                    <el-input
                      type="text"
                      disabled
                      v-model="sku.sku_with_hold_quantity"
                      maxlength="9"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </td>
              <!-- 商品编码 -->
              <td>
                <el-col :span="24">
                  <el-form-item
                    :prop="`skus.${index}.sku_item_no`"
                    :rules="formSpecs.sku_item_no"
                  >
                    <!-- :prop="`skus.${index}.sku_item_no`" -->
                    <el-input
                      size="small"
                      type="text"
                      v-model="sku.sku_item_no"
                      maxlength="9"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </td>
              <!-- 成本价 -->
              <td>
                <el-col :span="24">
                  <el-form-item
                    :prop="`skus.${index}.sku_cost_price`"
                    :rules="formSpecs.sku_cost_price"
                  >
                    <!-- :prop="`skus.${index}.sku_cost_price`" -->
                    <el-input
                      size="small"
                      type="text"
                      v-model="sku.sku_cost_price"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      maxlength="9"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </td>
              <!-- 销量 -->
              <td width="50">
                <el-col :span="24">
                  <el-form-item>
                    {{sku.sku_sold_num?sku.sku_sold_num:0}}
                    <!-- :prop="`skus.${index}.sku_price`" -->
                    <!-- <el-input type="text" disabled v-model="sku.sku_sold_num" maxlength="20"></el-input> -->
                  </el-form-item>
                </el-col>
              </td>
              <!-- 小程序id -->
              <td>
                <!-- <el-input type="text" v-model="sku.item_id_xiao" maxlength="20"></el-input> -->
                <el-col :span="24">
                  <el-form-item
                    :prop="`skus.${index}.item_id_xiao`"
                    :rules="formSpecs.item_id_xiao"
                  >
                    <el-select
                      v-model="sku.item_id_xiao"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="widItem in widgetId"
                        :key="widItem.id"
                        :label="widItem.goodsTitle"
                        :value="widItem.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </td>
              <!-- 状态 -->
              <!-- <td></td> -->
              <!-- 上下架 -->
              <td>
                <el-col :span="24">
                  <el-form-item
                    :prop="`skus.${index}.shelf_flag`"
                    :rules="formSpecs.shelf_flag"
                  >
                    <el-select
                      v-model="sku.shelf_flag"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="shelfItem in shelf"
                        :key="shelfItem.value"
                        :label="shelfItem.label"
                        :value="shelfItem.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </td>
              <!-- 操作 -->
              <!-- <td></td> -->
            </tr>
            <!-- <td>
                <input type="text" v-model="skus[row-1]">
            </td>-->
            <!-- <td>
                <input type="text" v-model="tableList[row-1]['sku_price']">
              </td>
              <td>
                <input type="text" v-model="tableList[row-1]['sku_with_hold_quantity']">
              </td>
              <td>
                <input type="text" v-model="tableList[row-1]['sku_item_no']">
              </td>
              <td>
                <input type="text" v-model="tableList[row-1]['sku_cost_price']">
              </td>
              <td></td>
              <td>
                <el-select v-model="tableList[row-1]['widgetId']" placeholder="请选择">
                  <el-option
                    v-for="item in widgetId"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
            </td>-->

            <!-- </tr> -->
          </tbody>
        </table>
      </el-form-item>
      <!-- v-if="tableData.length" -->
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit('formSpec')"
        >更新商品规格</el-button>
      </el-form-item>
    </el-form>

    <el-form
      class="demo-form-inline"
      ref="formRules"
      :rules="formRule"
      :model="formRules"
      label-width="160px"
      size="small"
    >
      <el-col :span="24">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item
              label="商品详情："
              prop="item_content"
            >
              <!--  <el-input
                type="textarea"
                :autosize="{ minRows: 8, maxRows:8 }"
                placeholder="请输入商品详情"
                v-model="formRules.item_content"
              ></el-input>-->
              <tinymce v-model="formRules.item_content"></tinymce>
            </el-form-item>
          </div>
        </el-col>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmitDetail('formRules')"
          >更新商品详情</el-button>
          <el-button
            type="primary"
            @click="onCancel()"
          >取消</el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
function descartes(list) {
  // console.log(list)
  //parent上一级索引;count指针计数
  var point = {};
  var result = [];
  var pIndex = null;
  var tempCount = 0;
  var temp = [];
  //根据参数列生成指针对象
  // console.log(JSON.stringify(list), 'list')
  for (var index in list) {

    if (typeof list[index] == 'object') {
      point[index] = { 'parent': pIndex, 'count': 0 }
      pIndex = index;
    }
  }
  //单维度数据结构直接返回
  if (pIndex == null) {
    return list;
  }
  //动态生成笛卡尔积
  while (true) {
    for (var index in list) {
      tempCount = point[index]['count'];
      temp.push(list[index][tempCount]);
    }
    //压入结果数组
    result.push(temp);
    temp = [];
    //检查指针最大值问题
    while (true) {
      if (point[index]['count'] + 1 >= list[index].length) {
        point[index]['count'] = 0;
        pIndex = point[index]['parent'];
        if (pIndex == null) {
          // console.log('笛卡尔积：', result)
          return result;
        }
        //赋值parent进行再次检查
        index = pIndex;
      }
      else {
        point[index]['count']++;
        break;
      }
    }
  }
}
import { getGoodsDetail } from "@/api/group";
import {
  getSkuList,
  getSkuValueList,
  addItemContent,
  addItemInfo,
  addSkuProject,
  addSkuValue,
  getEduGoods,
  addItemSkuDetail,
  updateItem,
  getGoodsSkus
} from "@/api/qecode";
import Sticky from "@/components/Sticky";
import Tinymce from "@/components/Tinymce";
export default {
  components: {
    Sticky,
    Tinymce
  },
  data() {
    const host = process.env.BASE_API + "publicmethod/upfile/upload_file";
    return {
      formSpec: {
        item_id: '',
        skus: [
          // {
          //   sku_price: '',
          //   sku_with_hold_quantity: '',
          //   sku_item_no: '',
          //   sku_cost_price: "",
          //   sku_sold_num: "",
          //   item_id_xiao: "",

          //   values: [

          //   ]
          // }
        ]
      },
      //维护的value
      title: "新建商品",
      // 添加按钮显示
      addBtnShow: false,
      // 规格项options
      specOptions: [],
      fileList: [],
      specMore: [],
      //基本资料 提交数据
      form: {
        birthday_flag: 0,
        item_desc: "",
        item_name: "",
        item_no: "",
        chatroom_flag: 0,
        mobile_flag: 0,
        relation_flag: 0,
        age_flag: 0,
        sex_flag: 0,
        item_type: 9,
        original_price: null,
        pic_url: "",
        price: null,
        slider_img: []
      },
      host,
      formSpecs: {
        sku_price: [
          { required: true, message: '请输入商品价格', trigger: "blur" },
        ],
        sku_with_hold_quantity: [
          { required: true, message: '请输入库存', trigger: "blur" },
        ],
        sku_original_price: [
          { required: true, message: '请输入原价', trigger: "blur" },
        ],
        sku_item_no: [
          { required: true, message: '请输入规格编码', trigger: "blur" },
        ],
        sku_cost_price: [
          { required: true, message: '请输入成本价', trigger: "blur" },
        ],
        item_id_xiao: [
          { required: true, message: '选择小程序ID', trigger: "change" },
        ],
        shelf_flag: [
          { required: true, message: '选择上下架', trigger: "change" },
        ],
      },
      rules: {
        item_name: [
          { required: true, message: "请输入商品名", trigger: "blur" }
        ],
        item_desc: [
          { required: true, message: "请输入分享描述", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入商品现价", trigger: "blur" }
        ],
        item_no: [
          { required: true, message: "请输入商品编码", trigger: "blur" }
        ],
        pic_url: [
          { required: true, message: "请上传图片", trigger: "blur" }
        ],
        original_price: [
          { required: true, message: "请输入商品原价", trigger: "blur" }
        ],
        mobile_flag: [
          { required: true, message: "请选择是否填写手机号", trigger: "blur" }
        ],
        relation_flag: [
          { required: true, message: "请选择是否填写孩子关系", trigger: "blur" }
        ],
        age_flag: [
          { required: true, message: "请选择是否填写孩子年龄", trigger: "blur" }
        ],
        birthday_flag: [
          { required: true, message: "请选择是否填写生日", trigger: "blur" }
        ],
        sex_flag: [
          { required: true, message: "请选择是否填写孩子性别", trigger: "blur" }
        ],
        chatroom_flag: [
          { required: true, message: "请选择是否有群服务", trigger: "blur" }
        ]
      },
      options: [[]],
      specValue: [],

      //商品详情 提交
      formRules: {
        item_id: null,
        item_content: ""
      },
      formRule: {
        item_content: [
          { required: true, message: "请输入商品详情", trigger: "blur" }
        ],

      },
      widgetId: [],
      specNameValue: [],
      shelf: [
        { label: '上架', value: 1 },
        { label: '下架', value: 0 }
      ],
      saveGoods: false,
      isGoodsId: 0
    };
  },
  mounted() {
    // console.log('124')
    // console.log(this.options, '123')
  },
  created() {
    // console.log(this.$route.params.id, '124')
    this.isGoodsId = this.$route.params.id;
    if (this.$route.params.id != 0) {
      this.title = "编辑商品";

      this.formRules.item_id = this.$route.params.id;
      this.getGoodsDetail(this.$route.params.id);
    }
    this.getSkuList();
    this.getEduGoods();
  },
  filters: {
    getName: function (obj, index) {
      // console.log(obj, 'obj', index, '123')
      if (obj) {
        // console.log(obj)
        var r = parseInt((index - 1) / obj['rowspan']);
        var l = obj['specLen'] || 1;
        var key = r % l;
        return obj['values'] && obj['values'][key] && obj['values'][key]['sku_v'];
      }
    },
    getvid: function (obj, index) {
      // console.log(obj, index, '123')
      if (obj) {
        // console.log(obj)
        var r = parseInt((index - 1) / obj['rowspan']);
        var l = obj['specLen'] || 1;
        var key = r % l;
        return obj['spec'] && obj['spec'][key] && obj['spec'][key]['sku_vid'];
      }
    },
    getvname: function (obj, index) {
      // console.log(obj, index, '123')
      if (obj) {
        // console.log(obj)
        var r = parseInt((index - 1) / obj['rowspan']);
        var l = obj['specLen'] || 1;
        var key = r % l;
        return obj['spec'] && obj['spec'][key] && obj['spec'][key]['sku1_v'];
      }
    }
  },
  computed: {
    tableData: function () {
      const specMore = this.specMore;
      // console.log(specMore, 'specMore')
      const len = specMore.length;
      var tData = [];
      for (let i = 0; i < len; i++) {
        var row = {};
        // this.specOptions.forEach((item,j)=>{
        //   if (item.sku_kid===this.specMore[i].id) {
        //     row['pName'] =item.sku_k;
        //     return;
        //   }
        // })
        row['sku_k'] = specMore[i].id.sku_k;
        row['sku_kid'] = specMore[i].id.sku_kid;
        row['spec'] = [];
        row['price'] = {};
        row['number'] = {};

        var len2 = specMore[i]['value'].length;
        var specLen = 0;
        for (var j = 0; j < len2; j++) {
          // console.log(specMore[i]['value'][j], '123')
          var spe = {};
          var sku_v = specMore[i]['value'][j].sku_v;
          var sku_vid = specMore[i]['value'][j].sku_vid;
          if (!sku_v) {
            continue;
          }
          ++specLen;
          spe['sku_v'] = sku_v;
          spe['sku_vid'] = sku_vid;
          row['spec'].push(spe);
        }
        row['specLen'] = specLen;
        tData.push(row);
      }
      //获取rowspan
      for (var k = 0, len3 = tData.length; k < len3; k++) {
        var rowspan = 1;
        for (var k1 = k + 1; k1 < len3; k1++) {
          var kSpecLen = tData[k1]['specLen'] || 1;
          rowspan *= kSpecLen;
        }
        tData[k]['rowspan'] = rowspan;
      }

      return tData;
    },
    rows: function () {
      if (!this.tableData) {
        return;
      }

      var rows = 1;
      var tableData = this.tableData;
      var len = tableData.length;
      for (var i = 0; i < len; i++) {
        var specLen = tableData[i]['specLen'] || 1;
        rows *= specLen;
      }
      //每条rowspan都为1情况
      if (rows == 1) {
        return tableData[0]['spec'].length;
      }
      return rows;
    },
    allCheckedLength: function () {
      let length = 0
      this.tableData.forEach(function (item) {
        length += item.spec.length
      })
      return length
    },

    tableList: function () {
      // console.log(JSON.stringify(this.tableData), 'tableData')
      if (!this.tableData) {
        return;
      }
      // var oriSkus = JSON.parse(JSON.stringify(this.tableList))
      // var vmSkus = (this.skus = [])
      // const tList = [];
      // this.tableData.forEach(item => {


      //   if (item.spec && item.spec.length) {
      //     const itemArr = []
      //     item.spec.forEach(specItem => {
      //       specItem = { ...specItem, ...{ sku_k: item.sku_k, sku_kid: item.sku_kid } }
      //       itemArr.push(specItem)
      //     })
      //     tList.push(itemArr)
      //   }

      // })
      // console.log(JSON.stringify(tList), '33333333')
      // let ret = descartes(tList)

      // console.log(JSON.stringify(ret), '就那女的说')

      // for (let i = 0; i < ret.length; i++) {
      //   let sku = {
      //     sku_price: '',
      //     sku_with_hold_quantity: '',
      //     sku_item_no: '',
      //     sku_cost_price: "",
      //     sku_sold_num: "",
      //     item_id_xiao: "",
      //     sku_sold_num: "",
      //   }
      //   sku.values = []
      //   // {
      //   //       sku_kid: 14,
      //   //       sku_vid: 771
      //   //     }
      //   ret[i].forEach(function (item) {
      //     // console.log('哈哈哈item:', item)
      //     sku.values.push({ sku_kid: item.sku_kid, sku_vid: item.sku_vid })
      //   })
      //   if (oriSkus.length >= ret.length) {
      //     sku.SkuCode = oriSkus[i].SkuCode
      //     sku.SkuPrice = oriSkus[i].SkuPrice
      //     sku.StockQuantity = oriSkus[i].StockQuantity
      //   } else {
      //     if (i < oriSkus.length) {
      //       sku.SkuCode = oriSkus[i].SkuCode
      //       sku.SkuPrice = oriSkus[i].SkuPrice
      //       sku.StockQuantity = oriSkus[i].StockQuantity
      //     } else {
      //       sku.SkuCode = ''
      //       sku.SkuPrice = ''
      //       sku.StockQuantity = ''
      //     }
      //   }
      //   vmSkus.push(sku)
      // }









      // item['sku_price'] = "";
      // item['sku_with_hold_quantity'] = "";
      // item['sku_item_no'] = "";
      // item['sku_cost_price'] = "";
      // item['sku_sold_num'] = "";
      // item['item_id_xiao'] = "";
      // item['sku_sold_num'] = "";


      // const tds = document.querySelectorAll('tr');
      // console.log(tds);
      // const length = this.tableData.length;
      let tList = [];
      // let skus = {};
      // tds.forEach((item, index) => {
      //   console.log(item.dataset, index)
      //   if (index) {
      //     tList.push({})
      //   }
      //   for (let i = 0; i < length; i++) {
      //     const element = item.children[i].dataset;
      //     if (index) {

      //       // console.log(element)
      //       let listItem = tList[index - 1];
      //       listItem[`sku${i + 1}_vid`] = element.skuvid;
      //       listItem[`sku${i + 1}_v`] = element.skuv;
      //       listItem[`sku${i + 1}_kid`] = skus[`sku${i + 1}_kid`];
      //       listItem[`sku${i + 1}_k`] = skus[`sku${i + 1}_k`];
      //       listItem['sku_price'] = "";
      //       listItem['sku_with_hold_quantity'] = "";
      //       listItem['sku_item_no'] = "";
      //       listItem['sku_cost_price'] = "";
      //       listItem['sku_sold_num'] = "";
      //       listItem['item_id_xiao'] = "";
      //     } else {
      //       skus[`sku${i + 1}_kid`] = element.skukid;
      //       skus[`sku${i + 1}_k`] = element.skuk;
      //     }

      //     // trItem = { ...trItem, ...element }
      //   }

      // })
      // console.log(JSON.stringify(tList), 'arr')









      // var rows = this.rows;
      // // console.log(rows, 'rows')
      // // console.log(this.$refs.tab111, 'row')
      // var tList = [];
      // let arr = [];
      // var srcData = this.tableData;
      // // console.log(srcData)

      // //console.log(srcData);
      // for (var i = 0; i < rows; i++) {
      //   var listItem = {};
      //   //构建动态项
      //   let specs = [];

      //   //构建固定项(price,number)
      //   listItem['sku_price'] = "";
      //   listItem['sku_with_hold_quantity'] = "";
      //   listItem['sku_item_no'] = "";
      //   listItem['sku_cost_price'] = "";
      //   listItem['sku_sold_num'] = "";
      //   listItem['item_id_xiao'] = "";
      //   // listItem['sku_sold_num'] = "";
      //   tList.push(listItem);
      // }
      return tList;
    }
  },
  methods: {
    // 获取小程序list
    getEduGoods() {
      getEduGoods().then(res => {
        if (res.code == 200) {
          this.widgetId = res.result;
          // console.log(res, '小程序id')
        }
      })
    },

    // 反解笛卡尔积

    //获取sku 规格列表
    getSkuList() {
      getSkuList().then(res => {
        if (res.code == 200) {
          this.specOptions = res.result;
        }
      });
    },
    //添加规格项目
    addSpecProject() {
      if (this.specMore.length <= 2) {
        this.specMore.push({ id: "", value: [''] });
      } else {
        this.addBtnShow = true;
      }
    },


    reBuild: function (val, oldVal) {

      let vm = this
      let oriSkus = JSON.parse(JSON.stringify(this.formSpec.skus))
      let vmSkus = (this.formSpec.skus = [])
      let propertyChecked = []
      let skuCount = 1
      let ori = []
      this.tableData.forEach((item, index) => {
        // console.log(item, 'item')
        let spec = item.spec

        if (spec.length > 0) {
          const itemArr = []
          propertyChecked.push(index)
          skuCount *= spec.length
          item.spec.forEach(specItem => {
            specItem = { ...specItem, ...{ sku_k: item.sku_k, sku_kid: item.sku_kid } }
            itemArr.push(specItem)
          })
          ori.push(itemArr)
        }
      })


      let ret = descartes(ori)
      // console.log(ret, 'ret-----------')
      console.log(JSON.stringify(ret), 'ret+++++++++')
      for (let i = 0; i < ret.length; i++) {
        let sku = {
          sku_price: '',
          sku_with_hold_quantity: '',
          sku_original_price: '',
          sku_item_no: '',
          sku_cost_price: "",
          sku_sold_num: "",
          item_id_xiao: "",
          sku_sold_num: "",
          shelf_flag: "",
          chatroom_flag: this.form.chatroom_flag,
          // mobile_flag: this.form.mobile_flag,
          birthday_flag: this.form.birthday_flag
        }
        sku.values = []
        let sku_id = '';
        ret[i].forEach(function (item) {
          // console.log('哈哈哈item:', item)
          sku.values.push({ sku_kid: item.sku_kid, sku_k: item.sku_k, sku_vid: item.sku_vid, sku_v: item.sku_v })

        })
        // console.log(oriSkus[1].values, ret)
        oriSkus.forEach(item => {
          if (JSON.stringify(item.values) == JSON.stringify(sku.values)) {
            sku.sku_price = item.sku_price
            sku.sku_with_hold_quantity = item.sku_with_hold_quantity
            sku.sku_original_price = item.sku_original_price
            sku.sku_item_no = item.sku_item_no
            sku.sku_cost_price = item.sku_cost_price
            sku.sku_sold_num = item.sku_sold_num
            sku.item_id_xiao = item.item_id_xiao ? parseInt(item.item_id_xiao) : item.item_id_xiao
            sku.shelf_flag = item.shelf_flag
          }
        })
        // if (oriSkus.length >= ret.length) {
        //   sku.sku_price = oriSkus[i].sku_price
        //   sku.sku_with_hold_quantity = oriSkus[i].sku_with_hold_quantity
        //   sku.sku_original_price = oriSkus[i].sku_original_price
        //   sku.sku_item_no = oriSkus[i].sku_item_no
        //   sku.sku_cost_price = oriSkus[i].sku_cost_price
        //   sku.sku_sold_num = oriSkus[i].sku_sold_num
        //   sku.item_id_xiao = oriSkus[i].item_id_xiao ? parseInt(oriSkus[i].item_id_xiao) : oriSkus[i].item_id_xiao
        //   sku.shelf_flag = oriSkus[i].shelf_flag
        // } else {
        //   if (i < oriSkus.length) {
        //     sku.sku_price = oriSkus[i].sku_price
        //     sku.sku_with_hold_quantity = oriSkus[i].sku_with_hold_quantity
        //     sku.sku_original_price = oriSkus[i].sku_original_price
        //     sku.sku_item_no = oriSkus[i].sku_item_no
        //     sku.sku_cost_price = oriSkus[i].sku_cost_price
        //     sku.sku_sold_num = oriSkus[i].sku_sold_num
        //     sku.item_id_xiao = oriSkus[i].item_id_xiao ? parseInt(oriSkus[i].item_id_xiao) : oriSkus[i].item_id_xiao
        //     sku.shelf_flag = oriSkus[i].shelf_flag
        //   } else {
        //     sku.sku_price = ''
        //     sku.sku_with_hold_quantity = ''
        //     sku.sku_original_price = ''
        //     sku.sku_item_no = ''
        //     sku.sku_cost_price = ''
        //     sku.sku_sold_num = ''
        //     sku.item_id_xiao = ''
        //     sku.shelf_flag = ''
        //   }
        // }
        vmSkus.push(sku)
      }



      // console.log(JSON.stringify(vmSkus), 'vmSkus')
    },
    // 获取name
    getValueName: function (sku, property) {
      var valueName = ''
      sku.values.forEach(function (item) {
        // console.log('item:', item)
        // console.log('property:', property)
        var _this = this
        if (item.sku_kid == property.sku_kid) {
          property.spec.forEach(function (itemValue) {
            if (item.sku_vid == itemValue.sku_vid) {
              valueName = itemValue.sku_v
              return false
            }
          })
        }
      })
      return valueName
    },
    // 格式化表格数据
    // reBuild() {
    //   let oriSkus = JSON.parse(JSON.stringify(this.skus))
    //   let vmSkus = (this.skus = [])
    //   const tList = [];
    //   this.tableData.forEach(item => {


    //     if (item.spec && item.spec.length) {
    //       const itemArr = []
    //       item.spec.forEach(specItem => {
    //         specItem = { ...specItem, ...{ sku_k: item.sku_k, sku_kid: item.sku_kid } }
    //         itemArr.push(specItem)
    //       })
    //       tList.push(itemArr)
    //     }

    //   })
    //   console.log(JSON.stringify(tList), '33333333')
    //   let ret = descartes(tList)

    //   console.log(JSON.stringify(ret), '就那女的说')

    //   for (let i = 0; i < ret.length; i++) {
    //     let sku = {
    //       sku_price: '',
    //       sku_with_hold_quantity: '',
    //       sku_item_no: '',
    //       sku_cost_price: "",
    //       sku_sold_num: "",
    //       item_id_xiao: "",
    //       sku_sold_num: "",
    //     }
    //     sku.values = []
    //     ret[i].forEach(function (item) {
    //       // console.log('哈哈哈item:', item)
    //       sku.values.push({ propertyId: item.PropertyId, valueId: item.Id })
    //     })
    //     if (oriSkus.length >= ret.length) {
    //       sku.SkuCode = oriSkus[i].SkuCode
    //       sku.SkuPrice = oriSkus[i].SkuPrice
    //       sku.StockQuantity = oriSkus[i].StockQuantity
    //     } else {
    //       if (i < oriSkus.length) {
    //         sku.SkuCode = oriSkus[i].SkuCode
    //         sku.SkuPrice = oriSkus[i].SkuPrice
    //         sku.StockQuantity = oriSkus[i].StockQuantity
    //       } else {
    //         sku.SkuCode = ''
    //         sku.SkuPrice = ''
    //         sku.StockQuantity = ''
    //       }
    //     }
    //     vmSkus.push(sku)
    //   }
    // },
    //添加规格值
    addSpecValue(index) {
      this.specMore[index].value.push('')
    },
    changeSpecName(index) {
      // console.log(index, "取值");

      const clearValue = this.specMore[index].value;
      console.log(this.specMore[index].suk_kid, 'clearValue')
      for (let i = 0; i < clearValue.length; i++) {
        clearValue[i] = '';
      }

      //创建规格名 
      if (typeof (this.specMore[index].id) === 'string' && this.specMore[index].id != '') {
        // 添加sku规格项
        const createItem = {
          sku_k: this.specMore[index].id
        }
        addSkuProject(createItem).then((res) => {
          if (res.code == 200) {
            this.seleteValue(index);
            this.getSkuList();
            this.$message({
              type: 'success',
              message: '创建成功'
            })
          }
        })
      }
      this.seleteValue(index);
    },
    seleteValue(index, sku_kid) {
      const map = {
        sku_kid: sku_kid || this.specMore[index].id.sku_kid
      };
      getSkuValueList(map).then(res => {
        if (res.code == 200) {
          const list = res.result;
          this.$set(this.options, index, list)
        }
      });
    },
    handleSpecValue(index, valueIndex) {
      console.log(index, 'index', valueIndex, 'valueIndex')
      const specMore = this.specMore[index].value;
      if (typeof (specMore[valueIndex]) === 'string' && specMore[valueIndex]) {
        //创建规格值
        const createValue = {
          sku_v: specMore[valueIndex],
          sku_kid: this.specMore[index].id.sku_kid
        }
        if (createValue.sku_kid) {
          addSkuValue(createValue).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '创建成功'
              })
              this.seleteValue(index);
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请选择规格名哦'
          })
        }
      }
      let count = 0;
      specMore.forEach(item => {
        console.log(specMore[valueIndex], item, 'item')
        if (specMore[valueIndex].sku_vid == item.sku_vid) {
          count++;
        }
      })
      if (count >= 2) {
        this.$message({
          type: 'error',
          message: '选择重复'
        })
        specMore[valueIndex] = '';
      }
      // else{
      //   const item = {
      //     sku_price: '',
      //     sku_with_hold_quantity: '',
      //     sku_item_no: '',
      //     sku_cost_price: "",
      //     sku_sold_num: "",
      //     item_id_xiao: "",
      //     sku_sold_num: "",
      //   }
      // }
    },
    delBannerImg(index) {
      this.form.slider_img.splice(index, 1);
    },
    // 删除轮播图
    removeImg(file, fileList) {
      if (file.response) {
        // console.log(file.response.result.urlFile, fileList);
        const imgUrl = file.response.result.urlFile;
        let slider_img = this.form.slider_img;
        const index = slider_img.indexOf(imgUrl);
        slider_img.splice(index, 1);
      }
    },
    handlePreview(file) {
      // console.log(file);
    },
    // 轮播图上传成功
    updateImg(res, file) {
      if (res.code == 200) {
        this.form.slider_img.push({
          img: res.result.urlFile
        });
      }
      // this.form.slider_img.push(URL.createObjectURL(file.raw))
      // console.log(res, file, "file");
    },
    // 获取商品详情
    getGoodsDetail(item_id) {
      const map = {
        item_id
      };
      getGoodsDetail(map).then(res => {
        if (res.code == 200) {
          this.form = { ...this.form, ...res.result };
          this.formRules = res.result;
          this.formSpec = res.result;
          if (res.result.skus.length) {
            this.formAtTableData(res.result.skus);
          }
        }
      });
    },
    // 格式化tableData
    formAtTableData(skus) {
      console.log(JSON.stringify(skus), '返回的skus')
      let arr1 = [];
      // 循环返回的删库list 再循环values 最后得到arr1 为
      skus.forEach((item, index) => {
        // arr1.push(item.values)
        const values = item.values;
        values.forEach((aItem, aIndex) => {
          arr1.push(JSON.stringify(aItem));
        })

      })
      const data = [...new Set(JSON.parse(JSON.stringify(arr1)))];
      let newData = [];
      const dataJson = [];
      // console.log(data, '返回的skus格式化1')
      data.forEach((item, index) => {
        const JsonItem = JSON.parse(item)
        newData.push(JSON.stringify({
          sku_kid: JsonItem.sku_kid,
          sku_k: JsonItem.sku_k,
        }))
        dataJson.push(JsonItem)
      })

      // console.log(dataJson, '---------')
      // console.log(newData, 'newData')
      newData = [...new Set(newData)];
      const specMore = [];
      // console.log(newData, 'newData')

      newData.forEach((item, index) => {
        // console.log(item, index)
        const itemJson = JSON.parse(item);
        specMore.push({ id: itemJson, value: [] })
        this.seleteValue(index, itemJson.sku_kid)
        // 不不不
        // console.log(specMore[index], item, index, 'specMore')
        dataJson.forEach(aItem => {
          if (itemJson.sku_kid === aItem.sku_kid) {
            specMore[index].value.push({
              sku_kid: itemJson.sku_kid,
              sku_vid: aItem.sku_vid,
              sku_v: aItem.sku_v,
            })
          }
        })
      })
      // console.log(specMore, 'specMore123')

      this.specMore = specMore;
    },
    repeatArrObj() {

    },
    // 上传头像
    handleAvatarSuccess(resData) {
      if (resData.code == 200) {
        this.form.pic_url = resData.result.urlFile;
      }
    },
    // 上传头像
    beforeAvatarUpload(file) {
      const fileType = file.type;
      let isJPG;
      const isLt2M = file.size / 1024 / 1024 < 4;
      // console.log(fileType);
      if (
        fileType == "image/png" ||
        fileType == "image/jpg" ||
        fileType == "image/gif" ||
        fileType == "image/jpeg"
      ) {
        isJPG = true;
      } else {
        this.$message.error("上传海报图片只能是 jpg gif png 格式!");
        isJPG = false;
      }
      if (!isLt2M) {
        this.$message.error("上传海报图片大小不能超过 4MB!");
      }
      return isJPG && isLt2M;
    },
    h(n) {
      return n + "岁";
    },
    addItemInfo() {
      const map = this.form;
      // console.log(JSON.stringify(map), '添加商品传的参数')
      if (map.slider_img.length > 0) {
        addItemInfo(map).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.saveGoods = true;
            this.formRules.item_id = res.result.item_id; //添加商品基本信息 item_id
          } else {
            this.saveGoods = false;
          }
        });
      } else {
        this.$message({
          message: "请上传轮播图哦",
          type: "error"
        });
      }
    },
    updateItem() {
      const map = this.form;
      map.item_id = this.formRules.item_id;
      updateItem(map).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
        }
      });
    },
    // 格式化表格数据
    // formDataTable() {
    //   return new Promise((resolve, reject) => {
    //     const tds = document.querySelectorAll('tr');
    //     console.log(tds);
    //     const length = this.tableData.length;
    //     let arr = [];
    //     let skus = {};
    //     tds.forEach((item, index) => {
    //       console.log(item.dataset, index)
    //       if (index) {
    //         arr.push({})
    //       }
    //       for (let i = 0; i < length; i++) {
    //         const element = item.children[i].dataset;
    //         if (index) {

    //           // console.log(element)
    //           let trItem = arr[index];
    //           arr[index - 1][`sku${i + 1}_kid`] = skus[`sku${i + 1}_kid`];
    //           arr[index - 1][`sku${i + 1}_k`] = skus[`sku${i + 1}_k`];
    //           arr[index - 1][`sku${i + 1}_vid`] = element.skuvid;
    //           arr[index - 1][`sku${i + 1}_v`] = element.skuv;

    //         } else {
    //           skus[`sku${i + 1}_kid`] = element.skukid;
    //           skus[`sku${i + 1}_k`] = element.skuk;
    //         }

    //         // trItem = { ...trItem, ...element }
    //       }

    //     })
    //     console.log(JSON.stringify(arr), 'arr')
    //     resolve(arr);
    //   })
    // },
    //更新商品sku
    onSubmit(formSpec) {
      // this.formDataTable().then((a) => {
      //   console.log(a)

      // })
      this.$refs[formSpec].validate(valid => {
        if (valid) {
          // console.log(this.formSpec.skus, this.formSpec.skus)
          const data = { item_id: this.formRules.item_id, item_sku_detail: this.formSpec.skus };
          // console.log(data.item_sku_detail.length, '1')
          // console.log(data.item_id, '2')
          console.log(this.isGoodsId === 0, 'goodsTitle')
          if (this.isGoodsId == 0) {
            if (data.item_sku_detail.length > 0) {
              addItemSkuDetail(data).then(res => {
                if (res.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '商品规格添加成功！'
                  })
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: '请先添加商品规格哦！'
              })
            }
          } else {
            addItemSkuDetail(data).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '商品规格添加成功！'
                })
              }
            })
          }


        } else {
          console.log("error submit!!");
          return false;
        }
      });


    },
    //移除规格项
    removeProject(index) {
      this.specMore.splice(index, 1)
    },
    //移除规格值
    removeValue(index, valueIndex) {
      this.specMore[index].value.splice(valueIndex, 1);
    },
    //更新商品基本信息
    onGoodSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$route.params.id != 0) {
            //修改
            this.updateItem();
          } else {
            this.addItemInfo();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addItemContent() {
      const map = this.formRules;
      addItemContent(map).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "保存详情成功",
            type: "success"
          });
        }
      });
    },
    //更新商品详情
    onSubmitDetail(formRules) {
      this.$refs[formRules].validate(valid => {
        if (valid) {
          if (this.formRules.item_id) {
            this.addItemContent();
          } else {
            this.$message({
              message: "请先创建商品基本信息哦",
              type: "error"
            });
          }
        } else {
          this.$message({
            message: "请先创建商品基本信息哦",
            type: "error"
          });
          return false;
        }
      });
    },
    onCancel() {
      this.$confirm("取消后不会保留已输入信息,确认取消?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$router.go(-1);
        })
        .catch(() => { });
    }
  },
  watch: {
    allCheckedLength: {
      handler: 'reBuild'
    }
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0 0 20px;
  .demo-form-inline {
    padding: 10px;
  }
  .bg-putple-light {
    .avater-wrap {
      height: 110px;
      .avatar {
        width: 80px;
        width: 80px;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 80px;
        width: 80px;
        line-height: 80px;
        text-align: center;
      }
    }
  }
  .banner-img-wrap {
    display: inline-block;
    height: 140px;
    margin: 10px;
    position: relative;
    cursor: pointer;
    .banner-img {
      height: 100%;
    }
    .banner-img-remove {
      z-index: 20;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-size: 30px;
      display: none;
      background-color: rgba($color: #000000, $alpha: 0.2);
      .el-icon-delete {
        z-index: 10;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        // color: #000000;
      }
      .el-icon-delete:hover {
        color: #1989fa;
      }
    }
    &:hover > .banner-img-remove {
      display: block;
      // background-color: #fff;
    }
  }
}

table {
  border: 0;
}
table.table-sku {
  width: 100%;
  background-color: #fff;
  text-align: left;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
table.table-sku td {
  border: 1px solid #e5e5e5;
  padding: 8px;
}
.close-project {
  font-size: 20px;
}
</style>
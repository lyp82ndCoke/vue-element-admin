<template>
  <div class="app-container-group">
    <sticky class-name="sub-navbar">
      <el-col
        :span="10"
        class="subtitle"
      >{{title}}</el-col>
    </sticky>

    <el-tabs
      v-model="activeName"
      class="tabs-wrap"
    >
      <el-tab-pane
        label="商品基本信息"
        name="first"
      >
        <el-form
          class="demo-form-inline"
          ref="form"
          :rules="rules"
          :model="form"
          label-width="160px"
          size="small"
        >
          <el-row>
            <el-col :span="16">
              <el-form-item
                label="商品名："
                prop="item_name"
              >
                <el-col :span="16">
                  <el-input
                    size="mini"
                    v-model="form.item_name"
                    maxlength="42"
                    placeholder="请输入商品名"></el-input>
                </el-col>
                <el-col
                  :span="8"
                  style="color:red;"
                  align="center"
                >(商品名最多42个字哦)</el-col>
              </el-form-item>
              <el-form-item
                label="请选择商品分类："
                prop="item_type"
              >
                <el-select
                  v-model="form.item_type"
                  placeholder="请选择商品分类"
                >
                  <el-option
                    v-for="item in [{label:'带群',value:9},{label:'不带群',value:8}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="请选择限购标签：">
                <el-col :span="24">
                  <el-col :span="6">
                    <el-col :span="5">
                      <!-- <el-button type="primary" size="mini" @click="relatedGoods">点击关联商品</el-button> -->
                      <el-button
                        type="text"
                        size="mini"
                        @click="relatedLabel"
                      >点击选择标签</el-button>
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <el-table
                    border
                    size="mini"
                    :data="selectLabel"
                    v-if="selectLabel && selectLabel.length>0"
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="date"
                      width="180"
                      label="标签名称"
                    >
                      <template slot-scope="scope">
                        <el-col style="margin-left: 20px;">{{scope.row.label_name}}</el-col>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="date"
                      width="200"
                      label="标签编码"
                    >
                      <template slot-scope="scope">
                        <el-col style="margin-left: 20px;">{{scope.row.label_code}}</el-col>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      align="center"
                      class-name="small-padding fixed-width"
                    >
                      <template slot-scope="scope">
                        <el-button
                          size="small"
                          type="text"
                          @click="removeLabels(scope.row.label_code)"
                        >移除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-form-item>

              <el-form-item label="限购提示页：">
                <el-col :span="13">
                  <el-input
                    size="mini"
                    v-model="form.redirect_url"
                    placeholder="请输入限购提示页"
                  ></el-input>
                </el-col>
                <el-col
                  :span="11"
                  style="color:red;"
                  align="center"
                >(限购提示页必须以https开头哦)</el-col>
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
                label="是否填写孩子性别："
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
                label="是否填写孩子关系："
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
                label="是否填写孩子年龄："
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
                label="是否填写生日："
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
                label="是否关注公众号："
                prop="subscribe_flag">
                <el-select
                  v-model="form.subscribe_flag"
                  placeholder="请选择是否关注公众号">
                  <el-option
                    v-for="item in [{label:'是',value:1},{label:'否',value:0}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                label="是否填写收货地址："
                prop="deliver_flag">
                <el-select
                  v-model="form.deliver_flag"
                  placeholder="请选择是否填写收货地址">
                  <el-option
                    v-for="item in [{label:'是',value:1},{label:'否',value:0}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>

              <!-- 
                不限制购买: astrict_num默认为999999999
                只要限制购买： astrict_num为必填项 && 正整数
              -->
              <el-form-item label="是否限制购买：">
                <el-select
                  v-model="form.astrict_type"
                  placeholder="请选择是否限制购买"
                  @change="astrictChange"
                >
                  <el-option
                    v-for="item in [{label:'不限制',value:-1},{label:'商品级',value:0},{label:'一级规格',value:1},{label:'二级规格',value:2},{label:'三级规格',value:3}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                label="限制数量："
                prop="astrict_num"
              >
                <el-input
                  size="mini"
                  v-model="form.astrict_num"
                  onkeyup="if(value.length==1){value=value.replace(/[^1-9]/g,'')}else{value=value.replace(/\D/g,'')}"
                  placeholder="请输入限制数量"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="输入总库存："
                prop="quantity"
                v-if="form.item_type==8"
              >
                <el-input
                  size="mini"
                  v-model="form.quantity"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                  placeholder="输入总库存"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="输入总库存："
                prop="quantity"
                v-else
              >
                <el-input
                  size="mini"
                  v-model="form.quantity"
                  disabled
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                  placeholder="输入总库存"
                ></el-input>
              </el-form-item>

              <el-form-item label="输入虚拟销量：">
                <el-input
                  size="mini"
                  v-model="form.virtual_num"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                  placeholder="输入虚拟销量"
                ></el-input>
              </el-form-item>

              <!-- <el-form-item label="请选择商品状态：" prop="status">
                <el-select v-model="form.status" placeholder="请选择商品状态">
                  <el-option
                    v-for="item in [{label:'上架',value:1},{label:'下架',value:2}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              -->
              <el-form-item
                label="分享描述："
                prop="item_desc"
              >
                <el-input
                  size="mini"
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
                        />
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
                      size="mini"
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
                      size="mini"
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
                      />
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
                    size="mini"
                    v-model="form.item_no"
                    placeholder="请输入商品编码"
                  ></el-input>
                </el-form-item>
              </el-row>

              <el-row>
                <el-form-item
                  label="支付方式："
                  prop="pay_type_select">
                  <el-checkbox-group v-model="form.pay_type_select">
                    <el-checkbox label="weixin">微信支付</el-checkbox>
                    <el-checkbox label="alipay">支付宝支付</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-row>


            </el-col>
          </el-row>
          <el-form-item>
            <el-button
              type="primary"
              @click="onGoodSubmit('form')"
              :loading="saveGoods"
            >保存商品基本信息</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane
        label="添加商品规格"
        name="second"
      >
        <el-form
          class="demo-form-inline"
          ref="formSpec"
          :rules="formSpecs"
          :model="formSpec"
          label-width="60px"
          size="small"
        >
          <el-row>
            <el-form-item label="商品规格：">
              <el-row
                v-for="(item, index) in specMore"
                :key="index"
              >
                <!-- 规格名 -->
                <el-row class="sku-v-wrap">
                  <el-col :span="2">规格名：</el-col>
                  <el-col
                    :span="6"
                    class="select-wrap"
                  >
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

                <el-row style="margin:10px 0 0 0;">
                  <el-col :span="2">规格值：</el-col>
                  <el-col
                    class="sku-select-wrap"
                    :span="5"
                    v-for="(valueItem,valueIndex) in specMore[index].value"
                    :key="valueIndex"
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
                    >添加规格值</el-button>
                  </el-col>
                </el-row>
              </el-row>
              <el-row>
                <el-button
                  type="primary"
                  v-if="specMore.length<=2"
                  size="mini"
                  @click="addSpecProject"
                >添加规格项目</el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="tagsDragShow=true"
                >自定义排序</el-button>
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
              :style="{'width':mobileWidth+'%'}"
            >
              <thead>
                <tr>
                  <td
                    v-for="(list,index) in tableData"
                    :key="`list${index}`"
                  >{{list['sku_k']}}</td>
                  <!-- :data-skukid="list['sku_kid']"
                  :data-skuk="list['sku_k']"-->
                  <!-- <td>排序(小的在前)</td> -->
                  <td>价格(分)</td>
                  <td>原价(分)</td>
                  <td>库存</td>
                  <td>规格编码</td>
                  <td>成本价(分)</td>
                  <td>销量</td>
                  <td>规格包含件数</td>
                  <!-- <td>状态</td> -->
                  <td>上下架</td>
                  <!-- <td>操作</td> -->
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(sku,index) in formSpec.skus"
                  :key="index"
                >
                  <template v-for="item in tableData">
                    <!-- <td>{{idx  }}{{item.rowspan}}</td> -->
                    <td v-if="index%item.rowspan===0" :rowspan="item.rowspan">{{sku|getValueName(item)}}</td>
                  </template>
                  <!-- 价格 -->
                  <td>
                    <el-col :span="24">
                      <el-form-item
                        :prop="`skus.${index}.sku_price`"
                        :rules="formSpecs.sku_price"
                      >
                        <!-- :prop="`skus.${index}.sku_price`" -->
                        <el-input
                          size="mini"
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
                          size="mini"
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
                      v-if="form.item_type==8"
                      :span="24"
                    >
                      <el-form-item
                        :prop="`skus.${index}.sku_with_hold_quantity`"
                        :rules="formSpecs.sku_with_hold_quantity"
                      >
                        <el-input
                          size="mini"
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
                          size="mini"
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
                          size="mini"
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
                          size="mini"
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
                        <!-- <el-input size="mini" type="text" disabled v-model="sku.sku_sold_num" maxlength="20"></el-input> -->
                      </el-form-item>
                    </el-col>
                  </td>
                  <!-- 规格包含件数 -->
                  <td>
                    <!-- <el-input size="mini" type="text" v-model="sku.item_id_xiao" maxlength="20"></el-input> -->
                    <el-col :span="24">
                      <el-form-item
                        :prop="`skus.${index}.sku_item_num`"
                        :rules="formSpecs.sku_item_num"
                      >
                        <!-- 带群的商品 库存/规格包含件数没有意义 不可输入 -->
                        <el-input
                          size="mini"
                          v-if="form.item_type==8"
                          type="text"
                          v-model="sku.sku_item_num"
                          onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                        ></el-input>
                        <el-input
                          size="mini"
                          v-else
                          disabled
                          type="text"
                          v-model="sku.sku_item_num"
                          onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                        ></el-input>
                        <!-- <el-select
                          v-model="sku.item_id_xiao"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="widItem in widgetId"
                            :key="widItem.id"
                            :label="widItem.goodsTitle"
                            :value="widItem.id"
                          ></el-option>
                        </el-select>-->
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
                <tr>
                  <td colspan="11">
                    批量设置：
                    <el-button
                      type="text"
                      @click="batchOpen('sku_price')"
                    >价格</el-button>
                    <el-button
                      type="text"
                      @click="batchOpen('sku_original_price')"
                    >原价</el-button>
                    <el-button
                      type="text"
                      @click="batchOpen('sku_cost_price')"
                    >成本价</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-form-item>
          <!-- v-if="tableData.length" -->
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit('formSpec')"
            >保存商品规格</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane
        label="添加商品详情"
        name="third"
      >
        <el-form
          class="demo-form-inline"
          ref="formRules"
          :rules="formRule"
          :model="formRules"
          label-width="170px"
          size="mini"
        >
          <el-col :span="24">
            <el-col :span="22">
              <div class="grid-content">
                <el-form-item label="选择模式：">
                  <el-select
                    v-model="value"
                    @change="changeType"
                  >
                    <el-option
                      v-for="item in options2"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <span style="color:red;position: absolute;left: -91px;">*</span>
                </el-form-item>
                <!-- 成长记录只在默认模式下加 -->
                <el-form-item
                  label="是否显示用户好评："
                  prop="case_flag"
                  v-if="value==1"
                >
                  <el-col :span="24">
                    <el-radio
                      v-model="formRules.case_flag"
                      label="1"
                    >显示</el-radio>
                    <el-radio
                      v-model="formRules.case_flag"
                      label="0"
                    >不显示</el-radio>
                  </el-col>
                  <span style="color:red;position: absolute;left: -151px;">*</span>
                </el-form-item>
                <el-form-item label="请选择用户好评分类：" v-if="value==1 && formRules.case_flag==1">
                  
                  <el-col :span="6">
                    <el-select v-model="formRules.sharin_records_type" multiple style="width:430px;" placeholder="全部">
                      <el-option
                        v-for="item in sharinList"
                        :key="item.item_id"
                        :label="item.item_name"
                        :value="item.item_id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </div>
            </el-col>
          </el-col>
          <el-col
            :span="24"
            v-if="value == '1'">
            <el-col :span="24">
              <div class="grid-content">
                <el-form-item
                  label="商品详情："
                  prop="item_content">
                  <tinymce
                    v-model="formRules.item_content"
                    :data="data"
                    :url="url"
                    key="item_content1"
                  ></tinymce>
                </el-form-item>

                <el-form-item label="成效案例：">
                  <tinymce v-model="formRules.programme"></tinymce>
                </el-form-item>

              </div>
            </el-col>
          </el-col>

          <el-col
            :span="24"
            v-if="value == '1'">
            <el-col :span="24">
              <div class="grid-content">
                <el-form-item label="商品目录：">
                  <tinymce v-model="formRules.item_contents"></tinymce>
                </el-form-item>
              </div>
            </el-col>
          </el-col>

          <el-col
            :span="24"
            v-if="value == '2'">
            <el-col :span="24">
              <div class="grid-content">
                <el-form-item
                  label="商品详情："
                  prop="item_content">
                  <tinymce
                    v-model="formRules.item_content2"
                    :data="data2"
                    :url="url2"
                    key="item_content2"
                  ></tinymce>
                </el-form-item>
              </div>
            </el-col>
          </el-col>

          <el-col :span="24">
            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmitDetail('formRules')"
              >保存商品详情</el-button>
              <el-button
                type="primary"
                @click="onCancel()"
              >取消</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- 关联标签 -->
    <el-col
      :span="24"
      v-if="alertLabel"
      class="alert-wrap"
    >
      <el-col
        :span="24"
        class="alert-content-wrap"
      >
        <el-col
          :span="24"
          class="title-header"
        >
          <el-col :span="6">
            <el-input
              size="mini"
              clearable
              placeholder="请输入标签名称"
              prefix-icon="el-icon-search"
              v-model="labels.label_name"
            ></el-input>
          </el-col>
          <el-col
            :span="2"
            align="right"
          >
            <el-button
              type="success"
              class="search-btn"
              size="small"
              @click="searchLabelList"
            >搜索</el-button>
          </el-col>
        </el-col>
        <el-table
          ref="multipleTable"
          size="small"
          border
          :data="labelList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          ></el-table-column>
          <el-table-column label="标签名称">
            <template slot-scope="scope">
              <el-col
                :span="15"
                style="margin-left: 20px;"
              >{{scope.row.label_name}}</el-col>
            </template>
          </el-table-column>
          <el-table-column label="标签编码">
            <template slot-scope="scope">
              <el-col
                :span="15"
                style="margin-left: 20px;"
              >{{scope.row.label_code}}</el-col>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          class="pagination"
          v-show="labelsTotal>0"
          :total="labelsTotal"
          :page.sync="labels.page_no"
          :limit.sync="labels.page_size"
          v-on:pagination="getLabelList"
        />
        <el-col
          :span="16"
          align="left"
          class="sure-margin"
        >
          <el-button
            type="primary"
            @click="handleLabelsMore"
          >批量关联</el-button>
          <el-button
            type="info"
            @click="haddenLabels"
          >取消</el-button>
        </el-col>
      </el-col>
    </el-col>
    <el-dialog
      title="拖拽规格值进行排序"
      :visible.sync="tagsDragShow"
    >
      <el-row class="tags-drag-wrap">
        <el-col v-for="(item, index) in specMore" :key="index">
          <el-col class="tags-drag-title">{{item.id.sku_k}}</el-col>
          <el-col
            :span="24"
            class="item-tag-wrap">
            <draggable
              v-model="specMore[index].value"
              @end="onEnd(index)">
              <span
                class="item-tag"
                v-for="(tag,tagIndex) in item.value"
                :key="tagIndex">
                {{tag.sku_v}}
              </span>
            </draggable>
          </el-col>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
function descartes(list) {
  //parent上一级索引;count指针计数
  var point = {};
  var result = [];
  var pIndex = null;
  var tempCount = 0;
  var temp = [];
  //根据参数列生成指针对象
  for (var index in list) {
    if (typeof list[index] == "object") {
      point[index] = { parent: pIndex, count: 0 };
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
      tempCount = point[index]["count"];
      temp.push(list[index][tempCount]);
    }
    //压入结果数组
    result.push(temp);
    temp = [];
    //检查指针最大值问题
    while (true) {
      if (point[index]["count"] + 1 >= list[index].length) {
        point[index]["count"] = 0;
        pIndex = point[index]["parent"];
        if (pIndex == null) {
          // console.log('笛卡尔积：', result)
          return result;
        }
        //赋值parent进行再次检查
        index = pIndex;
      } else {
        point[index]["count"]++;
        break;
      }
    }
  }
}
function resetSku(list) {
  let oldVal = JSON.parse(JSON.stringify(list));
  oldVal.forEach((val, index) => {
    delete (val["sku_vorder"]);
  })
  return oldVal;
}

import {
  getSkuList,
  getSkuValueList,
  addItemContent,
  addItemInfo,
  addSkuProject,
  addSkuValue,
  addItemSkuDetail,
  updateItem,
  getGoodsSkus,
  getGoodsDetail
} from "@/api/shopGoods";
import { getSharinList } from "@/api/wechat"
import { getLabelList } from "@/api/group";
import Sticky from "@/components/Sticky";
import Tinymce from "@/components/Tinymce";
import Pagination from "@/components/Pagination";
import draggable from 'vuedraggable'
export default {
  components: {
    Sticky,
    Tinymce,
    Pagination,
    draggable
  },
  data() {
    const host = process.env.BASE_API + "publicmethod/upfile/upload_file";
    return {
      tagsDragShow: false,
      data: {
        id: 1
      },
      data2: {
        id: 2
      },
      url: "富文本的参数",
      url2: "富文本的参数",
      activeName: "first",
      formSpec: {
        item_id: "",
        skus: []
      },
      //维护的value
      title: "新建商品",
      // 添加按钮显示
      addBtnShow: false,
      // 规格项options
      specOptions: [],
      fileList: [],
      specMore: [
        {
          id: "",
          value: [""]
        }
      ],
      //基本资料 提交数据
      form: {
        birthday_flag: 0,
        subscribe_flag: 1,
        deliver_flag: 0,
        item_desc: "",
        item_name: "",
        redirect_url: "",
        item_no: "",
        item_type: 9,
        mobile_flag: 0,
        relation_flag: 0,
        age_flag: 0,
        sex_flag: 0,
        original_price: null,
        pic_url: "",
        price: null,
        slider_img: [],
        astrict_type: -1,
        astrict_num: null,
        quantity: 0,
        status: 1,
        virtual_num: 0,
        astrict_label: [],
        details_type: 1,
        pay_type_select: []
      },
      host,
      formSpecs: {
        sku_vorder: [
          { required: true, message: "请输入规格排序", trigger: "blur" }
        ],
        sku_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        sku_with_hold_quantity: [
          { required: true, message: "请输入库存", trigger: "blur" }
        ],
        sku_original_price: [
          { required: true, message: "请输入原价", trigger: "blur" }
        ],
        sku_item_no: [
          { required: true, message: "请输入规格编码", trigger: "blur" }
        ],
        sku_cost_price: [
          { required: true, message: "请输入成本价", trigger: "blur" }
        ],
        sku_item_num: [
          { required: true, message: "规格包含件数", trigger: "change" }
        ],
        shelf_flag: [
          { required: true, message: "选择上下架", trigger: "change" }
        ]
      },
      rules: {
        item_name: [
          { required: true, message: "请输入商品名", trigger: "blur" }
        ],
        redirect_url: [
          { required: true, message: "请输入限购提示页", trigger: "blur" }
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
        subscribe_flag: [
          { required: true, message: "请选择是否关注公众号", trigger: "blur" }
        ],
        deliver_flag: [
          { required: true, message: "请选择是否填写收货地址", trigger: "blur" }
        ],
        sex_flag: [
          { required: true, message: "请选择是否填写孩子性别", trigger: "blur" }
        ],
        item_type: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ],
        quantity: [
          { required: true, message: "请输入总库存", trigger: "blur" }
        ],
        astrict_num: [
          { required: true, message: "请输入限制数量", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择商品状态", trigger: "blur" }
        ],
        pay_type_select: [
          { required: true, message: "请选择支付方式", trigger: "blur" }
        ]
      },
      options: [[]],
      specValue: [],

      //商品详情 提交
      formRules: {
        item_id: "",
        item_content: "",
        item_content2: "",
        item_contents: "",
        case_flag: '1',
        sharin_records_type: [],
        programme: "",
        programme_flag: 1,
      },
      formRule: {
        item_content: [
          { required: true, message: "请输入商品详情", trigger: "blur" }
        ],
        formRules: [
          { required: true, message: "请选择是否显示成长记录", trigger: "blur" }
        ]
      },
      widgetId: [],
      specNameValue: [],
      shelf: [{ label: "上架中", value: 1 }, { label: "下架", value: 0 }],
      saveGoods: false,
      isGoodsId: 0,
      selectLabel: [],
      alertLabel: false,
      labels: {
        label_name: "",
        label_code_no: "",
        page_no: 1,
        page_size: 10
      },
      currentLabel: [],
      labelsTotal: 0,
      labelList: [],
      options2: [
        {
          value: "1",
          label: "默认模式"
        },
        {
          value: "2",
          label: "图片模式"
        }
      ],
      value: "1",
      details_type: "",
      sharinList: [],
      mobileWidth: 100
    };
  },
  mounted() {
    this.vaule = "1";
  },
  created() {
    this.isGoodsId = this.$route.params.id;
    if (this.$route.params.id != 0) {
      this.title = "编辑商品";
      this.formRules.item_id = this.$route.params.id;
      this.getGoodsDetail(this.$route.params.id);
    }
    this.getSkuList();
    this.getLabelList();
    this.getSharinList();
    if(document.documentElement.clientWidth > 640){
      // pc
      this.mobileWidth = 100;
    }else{
      // mobile
      this.mobileWidth = 70;
    }
  },
  filters: {
    // 获取name
    getValueName: function (sku, property) {
      var valueName = "";
      sku.values.forEach(function (item) {
        var _this = this;
        if (item.sku_kid == property.sku_kid) {
          property.spec.forEach(function (itemValue) {
            if (item.sku_vid == itemValue.sku_vid) {
              valueName = itemValue.sku_v;
              return false;
            }
          });
        }
      });
      return valueName;
    }
  },
  computed: {
    tableData: function () {
      const specMore = this.specMore;
      const len = specMore.length;
      var tData = [];
      for (let i = 0; i < len; i++) {
        var row = {};
        row["sku_k"] = specMore[i].id.sku_k;
        row["sku_kid"] = specMore[i].id.sku_kid;
        row["spec"] = [];
        row["price"] = {};
        row["number"] = {};
        var len2 = specMore[i]["value"].length;
        var specLen = 0;
        for (var j = 0; j < len2; j++) {
          var spe = {};
          var sku_v = specMore[i]["value"][j].sku_v;
          var sku_vid = specMore[i]["value"][j].sku_vid;
          var sku_vorder = j + 1;
          if (!sku_v) {
            continue;
          }
          ++specLen;
          spe["sku_v"] = sku_v;
          spe["sku_vid"] = sku_vid;
          spe["sku_vorder"] = sku_vorder;
          row["spec"].push(spe);
        }
        row["specLen"] = specLen;
        tData.push(row);
      }
      //获取rowspan
      for (var k = 0, len3 = tData.length; k < len3; k++) {
        var rowspan = 1;
        for (var k1 = k + 1; k1 < len3; k1++) {
          var kSpecLen = tData[k1]["specLen"] || 1;
          rowspan *= kSpecLen;
        }
        tData[k]["rowspan"] = rowspan;
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
        var specLen = tableData[i]["specLen"] || 1;
        rows *= specLen;
      }
      //每条rowspan都为1情况
      if (rows == 1) {
        return tableData[0]["spec"].length;
      }
      return rows;
    },
    allCheckedLength: function () {
      let length = 0;
      this.tableData.forEach(function (item) {
        length += item.spec.length;
      });
      return length;
    }
  },
  methods: {
    // 批量设置价格/原价/成本价
    batchOpen(type) {
      console.log(this.formSpec.skus)
      let text = "价格";
      if (type == "sku_price") {
        text = "价格";
      } else if (type == "sku_original_price") {
        text = "原价";
      } else if (type == "sku_cost_price") {
        text = "成本价";
      }
      this.$prompt(`请输入商品${text}`, `批量设置${text}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: "number",
        inputPattern: /^\+?[1-9][0-9]*$/,
        inputErrorMessage: `${text}必须大于0`
      }).then(({ value }) => {
        const list = this.formSpec.skus;
        list.forEach(item => {
          item[type] = value;
        })
        this.$message({
          type: 'success',
          message: `${text}批量设置成功！`
        });
      }).catch(() => {

      });
    },
    // 拖拽结束
    onEnd(index) {
      this.specMore[index].value.push({ sku_v: true })
      setTimeout(() => {
        this.specMore[index].value.pop();
      }, 10)
    },
    // 查询标签列表
    getLabelList() {
      getLabelList(this.labels).then(res => {
        if (res.code == 200) {
          this.labelList = res.result.rows;
          this.labelsTotal = res.result.total;
        }
      });
    },
    relatedLabel() {
      let labelCode = [];
      if (this.selectLabel.length != 0) {
        this.selectLabel.forEach(item => {
          if (labelCode.indexOf(item.label_code) === -1) {
            labelCode.push(item.label_code);
          }
        });
        this.labels.label_code_no = labelCode.map(item => item).join(",");
      }
      this.alertLabel = true;
      this.getLabelList();
    },
    searchLabelList() {
      this.labels.page_no = 1;
      this.getLabelList();
    },
    //批量关联标签
    handleSelectionChange(val) {
      this.currentLabel = val;
    },
    removeLabels(label_code) {
      this.selectLabel.forEach((item, index) => {
        if (label_code == item.label_code) {
          this.selectLabel.splice(index, 1);
        }
      });
      this.form.astrict_label.forEach((item, index) => {
        if (label_code == item.label_code) {
          this.form.astrict_label.splice(index, 1);
        }
      });
    },
    handleLabelsMore() {
      this.$confirm("确认关联选中的标签吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.currentLabel.forEach(item => {
            this.selectLabel.push(item);
            // this.form.astrict_label.push(item);
          });
          this.form.astrict_label = this.selectLabel;
          this.alertLabel = false;
          this.$message({
            type: "success",
            message: "关联成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消关联"
          });
        });
    },
    haddenLabels() {
      this.alertLabel = false;
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
        this.specMore.push({ id: "", value: [""] });
      } else {
        this.addBtnShow = true;
      }
    },

    reBuild: function (val, oldVal) {
      let vm = this;
      let oriSkus = JSON.parse(JSON.stringify(this.formSpec.skus));
      let vmSkus = (this.formSpec.skus = []);
      let propertyChecked = [];
      let skuCount = 1;
      let ori = [];
      // 循环表tableData数据
      this.tableData.forEach((item, index) => {
        let spec = item.spec;
        if (spec.length > 0) {
          const itemArr = [];
          propertyChecked.push(index);
          skuCount *= spec.length;
          item.spec.forEach(specItem => {
            specItem = {
              ...specItem,
              ...{ sku_k: item.sku_k, sku_kid: item.sku_kid }
            };
            itemArr.push(specItem);
          });
          ori.push(itemArr);
        }
      });

      let ret = descartes(ori);
      for (let i = 0; i < ret.length; i++) {
        let sku = {
          sku_price: "",
          sku_with_hold_quantity: "",
          sku_original_price: "",
          sku_item_no: "",
          sku_cost_price: "",
          sku_sold_num: "",
          sku_item_num: 1,
          sku_sold_num: "",
          shelf_flag: "",
          // item_type: this.form.item_type,
          // mobile_flag: this.form.mobile_flag,
          birthday_flag: this.form.birthday_flag
        };
        sku.values = [];
        let sku_id = "";
        ret[i].forEach(function (item) {
          sku.values.push({
            sku_kid: item.sku_kid,
            sku_k: item.sku_k,
            sku_vid: item.sku_vid,
            sku_v: item.sku_v,
            sku_vorder: item.sku_vorder
          });
        });
        // console.log(oriSkus[1].values, ret)
        let skuVal = resetSku(sku.values)
        oriSkus.forEach(item => {
          let itemVal = resetSku(item.values)
          if (JSON.stringify(itemVal) == JSON.stringify(skuVal)) {
            sku.sku_price = item.sku_price;
            sku.sku_with_hold_quantity = item.sku_with_hold_quantity;
            sku.sku_original_price = item.sku_original_price;
            sku.sku_item_no = item.sku_item_no;
            sku.sku_cost_price = item.sku_cost_price;
            sku.sku_sold_num = item.sku_sold_num;
            sku.sku_item_num = item.sku_item_num;
            sku.shelf_flag = item.shelf_flag;
            // 新加排序
            // sku.sku_vorder = item.sku_vorder ? item.sku_vorder : 1;
          }
        });
        vmSkus.push(sku);
      }
    },
    
    //添加规格值
    addSpecValue(index) {
      this.specMore[index].value.push("");
    },
    changeSpecName(index) {
      const clearValue = this.specMore[index].value;
      for (let i = 0; i < clearValue.length; i++) {
        clearValue[i] = "";
      }

      //创建规格名
      if (
        typeof this.specMore[index].id === "string" &&
        this.specMore[index].id != ""
      ) {
        // 添加sku规格项
        const createItem = {
          sku_k: this.specMore[index].id
        };
        addSkuProject(createItem).then(res => {
          if (res.code == 200) {
            this.seleteValue(index);
            this.getSkuList();
            this.$message({
              type: "success",
              message: "创建成功"
            });
          }
        });
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
          this.$set(this.options, index, list);
        }
      });
    },
    // 选择规格值
    handleSpecValue(index, valueIndex) {
      const specMore = this.specMore[index].value;
      if (typeof specMore[valueIndex] === "string" && specMore[valueIndex]) {
        //创建规格值
        const createValue = {
          sku_v: specMore[valueIndex],
          sku_kid: this.specMore[index].id.sku_kid
        };
        if (createValue.sku_kid) {
          addSkuValue(createValue).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "创建成功"
              });
              this.seleteValue(index);
            }
          });
        } else {
          this.$message({
            type: "warning",
            message: "请选择规格名哦"
          });
        }
      }
      let count = 0;
      specMore.forEach(item => {
        if (specMore[valueIndex].sku_vid == item.sku_vid) {
          count++;
        }
      });
      if (count >= 2) {
        this.$message({
          type: "error",
          message: "选择重复"
        });
        specMore[valueIndex] = "";
      }
    },
    delBannerImg(index) {
      this.form.slider_img.splice(index, 1);
    },
    // 删除轮播图
    removeImg(file, fileList) {
      if (file.response) {
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
    },
    // 获取商品详情
    getGoodsDetail(item_id) {
      const map = {
        item_id
      };
      getGoodsDetail(map).then(res => {
        if (res.code == 200) {
          this.form = { ...this.form, ...res.result };
          this.form.details_type = res.result.details_type;
          for(let i = 0;i<res.result.pay_type.length;i++){
            this.form.pay_type_select.push(res.result.pay_type[i].pay_type);
          }
          this.formSpec = res.result;
          if (res.result.skus.length) {
            this.formAtTableData(res.result.skus);
          }
          if (res.result.details_type === 2) {
            this.value = "2";
            this.formRules.item_content2 = res.result.item_content;
          } else {
            this.formRules.sharin_records_type = res.result.sharin_records_type ? res.result.sharin_records_type.split(',') : [];
            this.formRules.case_flag = res.result.case_flag + '';
            this.formRules.item_contents = res.result.item_content2;
            this.formRules.item_content = res.result.item_content;
            this.formRules.programme = res.result.programme;
          }
          if (res.result.astrict_num == 999999) {
            this.form.astrict_num = null;
          }
          this.selectLabel = res.result.astrict_label;
        }
      });
    },
    // 格式化tableData
    formAtTableData(skus) {
      let arr1 = [];
      // 循环返回的删库list 再循环values 最后得到arr1 为
      skus.forEach((item, index) => {
        const values = item.values;
        values.forEach((aItem, aIndex) => {
          arr1.push(JSON.stringify(aItem));
        });
      });
      const data = [...new Set(JSON.parse(JSON.stringify(arr1)))];
      let newData = [];
      const dataJson = [];
      data.forEach((item, index) => {
        const JsonItem = JSON.parse(item);
        newData.push(
          JSON.stringify({
            sku_kid: JsonItem.sku_kid,
            sku_k: JsonItem.sku_k
          })
        );
        dataJson.push(JsonItem);
      });
      newData = [...new Set(newData)];
      const specMore = [];
      newData.forEach((item, index) => {
        const itemJson = JSON.parse(item);
        specMore.push({ id: itemJson, value: [] });
        this.seleteValue(index, itemJson.sku_kid);
        dataJson.forEach(aItem => {
          if (itemJson.sku_kid === aItem.sku_kid) {
            specMore[index].value.push({
              sku_kid: itemJson.sku_kid,
              sku_vid: aItem.sku_vid,
              sku_v: aItem.sku_v,
              sku_vorder: aItem.sku_vorder
            });
          }
        });
      });
      this.specMore = specMore;
    },
    repeatArrObj() { },
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
      if (this.form.astrict_num === 0) {
        map.astrict_num = 999999;
      }
      map.pay_type = [];
      for(let i = 0;i<this.form.pay_type_select.length;i++){
        map.pay_type.push({
          pay_type: this.form.pay_type_select[i]
        })
      }
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
      
      if (this.form.astrict_num === 0) {
        map.astrict_num = 999999;
      }
      map.pay_type = [];
      for(let i = 0;i<this.form.pay_type_select.length;i++){
        map.pay_type.push({
          pay_type: this.form.pay_type_select[i]
        })
      }
      updateItem(map).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
        }
      });
    },
    sureAddValiad() {
      const data = {
        item_id: this.formRules.item_id,
        item_sku_detail: this.formSpec.skus,
        item_type: this.form.item_type
      };
      if (this.isGoodsId == 0) {
        if (data.item_sku_detail.length > 0) {
          addItemSkuDetail(data).then(res => {
            if (res.code == 200) {
              this.$notify({
                title: '成功',
                message: '商品规格添加成功！记得在营期绑定商品规格哦~',
                type: 'success'
              });
            }
          });
        } else {
          this.$message({
            type: "error",
            message: "请先添加商品规格哦！"
          });
        }
      } else {
        addItemSkuDetail(data).then(res => {
          if (res.code == 200) {
            this.$notify({
              title: '成功',
              message: '商品规格添加成功！记得在营期绑定商品规格哦~',
              type: 'success'
            });
          }
        });
      }
    },
    //更新商品sku
    onSubmit(formSpec) {
      this.$refs[formSpec].validate(valid => {
        if (valid) {
          if (this.formRules.item_id) {
            this.sureAddValiad();
          } else {
            this.$message({
              message: "请先创建商品基本信息哦",
              type: "error"
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //移除规格项
    removeProject(index) {
      this.specMore.splice(index, 1);
    },
    //移除规格值
    removeValue(index, valueIndex) {
      this.specMore[index].value.splice(valueIndex, 1);
    },
    //更新商品基本信息
    onGoodSubmit(formName) {
      if (this.form.astrict_type == -1) {
        this.form.astrict_num = 999999;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let rx = /(https):\/\/([\w.]+\/?)\S*/i;
          if (this.form.redirect_url && !rx.test(this.form.redirect_url)) {
            this.$message({
              message: "限购提示页必须以https开头的链接哦",
              type: "warning"
            });
            return fasle;
          }
          if (this.$route.params.id != 0) {
            //修改
            this.updateItem();
          } else {
            //新建
            this.addItemInfo();
          }
        } else {
          console.log("error submit!!");
          this.$message({
            message: "您还有未填写的信息哦",
            type: "warning"
          });
          return false;
        }
      });
    },
    changeType(v) {
      this.details_type = v;
    },
    addItemContent() {
      let map = {
        item_id: "",
        item_content: "",
        item_content2: ""
      };
      map.item_content =
        this.details_type == "1"
          ? this.formRules.item_content
          : this.formRules.item_content2;
      map.item_content2 =
        this.details_type == "2" ? "" : this.formRules.item_contents;
      map.item_id = this.formRules.item_id;
      this.formRules.sharin_records_type = this.formRules.sharin_records_type.map(item => item).join(",");
      map.sharin_records_type = this.formRules.sharin_records_type;
      console.log("map", map);
      addItemContent(map).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "保存详情成功",
            type: "success"
          });
          this.$router.go(-1);
        }
      });

      if (this.details_type == "2") {
        this.form.details_type = 2;
        const maps = this.form;
        maps.item_id = this.formRules.item_id;
        if (this.form.astrict_num === 0) {
          maps.astrict_num = 999999;
        }
        maps.pay_type = [];
        for(let i = 0;i<this.form.pay_type_select.length;i++){
          maps.pay_type.push({
            pay_type: this.form.pay_type_select[i]
          })
        }
        updateItem(maps).then(res => {
          if (res.code == 200) {
          }
        });
      } else {
        this.form.details_type = 1;
        const maps = this.form;
        maps.item_id = this.formRules.item_id;
        maps.case_flag = this.formRules.case_flag;
        maps.sharin_records_type = this.formRules.sharin_records_type;
        maps.programme = this.formRules.programme;
        maps.programme_flag = this.formRules.programme_flag;
        if (this.form.astrict_num === 0) {
          maps.astrict_num = 999999;
        }
        maps.pay_type = [];
        for(let i = 0;i<this.form.pay_type_select.length;i++){
          maps.pay_type.push({
            pay_type: this.form.pay_type_select[i]
          })
        }
        updateItem(maps).then(res => {
          if (res.code == 200) {
          }
        });
      }
    },

    //更新商品详情
    onSubmitDetail(formRules) {
      this.details_type = this.value;
      if (this.details_type == "1") {
        if (this.formRules.item_id == "") {
          this.$message({
            message: "请先创建商品基本信息哦",
            type: "error"
          });
        } else if (this.formRules.item_content == "") {
          this.$message({
            message: "请填写商品详情哦",
            type: "error"
          });
        } else if (!this.formRules.case_flag) {
          this.$message({
            message: "请选择是否显示成长记录",
            type: "error"
          });
        } else {
          this.addItemContent();
        }
      } else {
        if (this.formRules.item_id == "") {
          this.$message({
            message: "请先创建商品基本信息哦",
            type: "error"
          });
        } else if (this.formRules.item_content2 == "") {
          this.$message({
            message: "请填写商品详情哦",
            type: "error"
          });
        } else {
          this.addItemContent();
        }
      }
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
    },
    astrictChange(val) {
      this.form.astrict_num = null;
    },
    getSharinList(){
      getSharinList({page_no:1,page_size:1000}).then(res => {
        if(res.code == 200){
          this.sharinList = res.result.rows;
        }
      })
    }
  },
  watch: {
    allCheckedLength: {
      handler: "reBuild"
    }
  }
};
</script>

<style lang="scss">
.app-container-group {
  padding: 0 0 10px;
  .tabs-wrap {
    .el-tabs__content{
      overflow:auto;
    }
    .el-tabs__nav-scroll{
      overflow:auto;
    }
    .el-tabs__nav-wrap {
      overflow:auto;
    }
  }
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
      }
      .el-icon-delete:hover {
        color: #1989fa;
      }
    }
    &:hover > .banner-img-remove {
      display: block;
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
      .title-header {
        margin-bottom: 20px;
      }
      .sure-margin {
        margin-top: 20px;
      }
    }
    &-content-wrap {
      border-radius: 5px;
      height: 100%;
      width: 100%;
      padding: 20px;
      background-color: #fff;
      overflow: auto;
    }
  }
}

table {
  border: 0;
}
table.table-sku {
  background-color: #fff;
  text-align: left;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin: 0;
  }
}
table.table-sku td {
  white-space: nowrap;
  border: 1px solid #e5e5e5;
  padding: 0 8px;
}
.sku-v-wrap {
  margin-top: 15px;
  padding: 5px;
  background: #f8f8f8;
}
.select-wrap {
  position: relative;
}
.sku-select-wrap {
  margin-right: 15px;
  position: relative;
  width: 140px;
}
.close-project {
  position: absolute;
  top: -7px;
  left: -6px;
  padding: 3px;
  font-size: 12px;
  border-radius: 9px;
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;
}
.tags-drag-wrap {
  overflow: auto;
  .tags-drag-title {
    font-weight: 500;
  }
  .item-tag-wrap {
    margin-top: 10px;
    .item-tag {
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      border-radius: 4px;
      padding: 10px 10px;
      background: #ececec;
      margin: 10px;
      cursor: move;
    }
  }
}
</style>
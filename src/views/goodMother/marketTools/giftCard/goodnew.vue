<template>
  <div class="app-container">
    <sticky class-name="sub-navbar">
      <el-col
        :span="10"
        class="subtitle"
      >{{title}}礼品卡</el-col>
    </sticky>

    <el-tabs v-model="activeName" style="margin:20px;">
      <el-tab-pane label="礼品卡基本信息" name="first">
        <el-form
          class="demo-form-inline"
          ref="form"
          :rules="rules"
          :model="form"
          label-width="160px"
          size="small">
          <el-row>
            <el-col :span="24">
              <el-form-item label="关联商品：" class="item-gender" required>
                <el-col :span="24">
                  <el-col :span="6">
                    <el-col :span="5">
                      <el-button type="text" size="mini" v-if="!editCard" @click="relatedGoods">点击关联商品</el-button>
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="6">
                  <el-table
                    border
                    size="mini"
                    :data="sureData"
                    v-if="editCard"
                    style="width: 100%">
                    <el-table-column
                      prop="date"
                      label="商品名称">
                      <template slot-scope="scope">
                        <el-col>{{scope.row.astrict_item_name}}</el-col>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    border
                    size="mini"
                    :data="sureData"
                    v-if="editCard ==false && sureData.length>0"
                    style="width: 100%">
                    <el-table-column
                      prop="date"
                      label="商品名称">
                      <template slot-scope="scope">
                        <el-col>{{scope.row.item_name}}</el-col>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-form-item>

              <el-form-item
                label="礼品卡名称："
                prop="item_name"
              >
                <el-input
                  v-model="form.item_name"
                  placeholder="请输入礼品卡名称"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="请选择限购标签：">
                <el-col :span="24">
                  <el-col :span="6">
                    <el-col :span="5">
                      <!-- <el-button type="primary" size="mini" @click="relatedGoods">点击关联商品</el-button> -->
                      <el-button type="text" size="mini" @click="relatedLabel">点击选择标签</el-button>
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="12">
                  <el-table
                    border
                    size="mini"
                    :data="selectLabel"
                    v-if="selectLabel.length>0"
                    style="width: 100%">
                    <el-table-column
                      prop="date"
                      width="180"
                      label="标签名称">
                      <template slot-scope="scope">
                        <el-col style="margin-left: 20px;">{{scope.row.label_name}}</el-col>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="date"
                      width="200"
                      label="标签编码">
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
                        <el-button size="small" type="text" @click="removeLabels(scope.row.label_code)">移除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-form-item>

              <el-form-item
                label="限购提示页：">
                <el-col :span="12">
                  <el-input
                    v-model="form.redirect_url"
                    placeholder="请输入限购提示页"
                  ></el-input>
                </el-col>
                <el-col :span="4" class="tips" align="center">(限购提示页必须以https开头哦)</el-col>
              </el-form-item>

              <el-form-item
                label="请选择礼品卡状态："
                prop="status">
                <el-select
                  v-model="form.status"
                  placeholder="请选择礼品卡状态"
                >
                  <el-option
                    v-for="item in [{label:'启用',value:1},{label:'禁用',value:2}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-row>
                <el-col class="grid-content bg-putple-light">
                  <el-form-item
                    label="封面图："
                    prop="pic_url"
                    class="avater-wrap"
                  >
                    <el-col :span="5">
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

              <el-form-item label="寄语：" prop="share_msg">
                <el-col :span="24">
                  <el-col :span="18">
                    <el-input
                      type="textarea"
                      resize="none"
                      :autosize="{ minRows: 5, maxRows: 6}"
                      maxlength="50"
                      show-word-limit
                      placeholder="请输入寄语"
                      v-model="form.share_msg"></el-input>
                  </el-col>
                  <el-col :span="3" class="word-tips tips" align="right">
                    (最多输入50字哦)
                  </el-col>
                </el-col>
              </el-form-item>

              
              <el-form-item label="购卡最晚赠送时间：" class="item-gender" required>
                <el-col :span="24">
                  <el-col :span="2">
                    自购卡时起
                  </el-col>
                  
                  <el-col :span="16">
                    <el-col :span="5">
                      <el-form-item prop="give_days">
                        <el-input 
                          v-model="form.give_days" 
                          placeholder="最小1天" 
                          
                          onkeyup="value=value.replace(/[^\d]/g,'')" 
                          size="small"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" align="right">
                      天有效
                    </el-col>
                    <el-col :span="9" align="right" class="tips">
                      代言人购买礼品卡，此礼品卡的到期时间
                    </el-col>
                  </el-col>
                </el-col>
              </el-form-item>

              <el-form-item label="领卡最晚使用时间：" class="item-gender" required>
                <el-col :span="24">
                  <el-col :span="2">
                    自领卡时起
                  </el-col>
                  
                  <el-col :span="16">
                    <el-col :span="5">
                      <el-form-item prop="use_days">
                        <el-input 
                          v-model="form.use_days" 
                          placeholder="最小1天" 
                          
                          onkeyup="value=value.replace(/[^\d]/g,'')" 
                          size="small"></el-input>
                      </el-form-item>
                      
                    </el-col>
                    <el-col :span="2" align="right">
                      天有效
                    </el-col>
                    <el-col :span="12" align="right" class="tips">
                      代言人赠送的礼品卡，此礼品卡自领取到使用的到期时间
                    </el-col>
                  </el-col>
                </el-col>
              </el-form-item>

              <el-form-item label="领卡使用规则：" class="item-gender" prop="exchange_rule">
                <el-col :span="24">
                  <el-radio v-model="form.exchange_rule" label='1' :disabled="editCard">直接使用</el-radio>
                </el-col>
                <el-col :span="24">
                  <el-col :span="4">
                    <el-radio v-model="form.exchange_rule" label='2' :disabled="editCard">使用时需付费购买</el-radio>
                  </el-col>
                  <el-col :span="16">
                    <el-col :span="5" v-if="form.exchange_rule == 2">
                      <el-form-item prop="additional_fee">
                        <el-input 
                          v-model="form.additional_fee"
                          :disabled="editCard"
                          @blur="onblur"
                          onkeyup="value=value.replace(/[^\d]/g,'')"
                          size="small"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" v-else>
                      <el-input 
                        v-model="form.additional_fee" 
                        :disabled="editCard"
                        onkeyup="value=value.replace(/\D|^0/g,'')" 
                        @blur="onblur"
                        size="small"></el-input>
                    </el-col>
                    <el-col :span="4" align="right" class="tips">
                      (价格最小为1分)
                    </el-col>
                  </el-col>
                </el-col>
              </el-form-item>

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
          </el-row>
          <el-form-item>
            <el-button
              type="primary"
              @click="onGoodSubmit('form')"
              :loading="saveGoods"
            >更新商品基本信息</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="礼品卡规格" name="second">
        <el-form
          class="demo-form-inline"
          ref="formSpec"
          :rules="formSpecs"
          :model="formSpec"
          label-width="100px"
          size="small">
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
                  <td>规格包含件数</td>
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
                      :span="24">
                      <el-form-item
                        :prop="`skus.${index}.sku_with_hold_quantity`"
                        :rules="formSpecs.sku_with_hold_quantity">
                        <el-input
                          type="text"
                          v-model="sku.sku_with_hold_quantity"
                          maxlength="9"
                        ></el-input>
                      </el-form-item>
                    </el-col>

                    <!-- <el-col>
                      <el-form-item>
                        <el-input
                          type="text"
                          disabled
                          v-model="sku.sku_with_hold_quantity"
                          maxlength="9"
                        ></el-input>
                      </el-form-item>
                    </el-col> -->
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
                  <!-- 规格包含件数 -->
                  <td>
                    <el-input type="text" v-model="sku.sku_item_num" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
                  </td>
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
      </el-tab-pane>
    </el-tabs>

    
    <!-- 关联商品 -->
    <el-col
      :span="24"
      v-if='alertShow'
      class="alert-wrap">
      <el-col
        :span="24"
        class="alert-content-wrap">
        <el-col
          :span="24"
          class="title-header">
          <el-col :span="6">
            <el-input
              size="small"
              clearable
              placeholder="请输入商品名称"
              prefix-icon="el-icon-search"
              v-model="goods.item_name"
            ></el-input>
          </el-col>
          <el-col :span="2" align="right">
            <el-button
              type="success"
              class="search-btn"
              size="small"
              @click="searchActivity"
            >搜索</el-button>
          </el-col>
        </el-col>
        <el-table
          size="small"
          border
          :data="goodsData">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column width="80">
            <template slot-scope="scope">
              <el-radio
                :label="scope.row.item_id"
                v-model="templateRadio"
                @change.native="getTemplateRow(scope.$index,scope.row.item_id,scope.row)"
              > &nbsp;</el-radio>
            </template>
          </el-table-column>

          <el-table-column label="商品名称">
            <template slot-scope="scope">
              <!-- <el-col :span="2">
                <img align='center' style="width:100%;" :src="scope.row.pic_url" alt="">
              </el-col> -->
              <el-col :span="15" style="margin-left: 20px;">{{scope.row.item_name}}</el-col>
            </template>
          </el-table-column>
          <el-table-column label="商品图片">
            <template slot-scope="scope">
              <el-col :span="2">
                <img align='center' class="head-img" :src="scope.row.pic_url" alt="">
              </el-col>
              <!-- <el-col :span="15" style="margin-left: 20px;">{{scope.row.item_name}}</el-col> -->
            </template>
          </el-table-column>
        </el-table>
        <pagination
          class="pagination"
          v-show="total>0"
          :total="total"
          :page.sync="goods.page_no"
          :limit.sync="goods.page_size"
          v-on:pagination="getItemList"
        />
        <el-col :span="16" align="left" class="sure-margin">
          <el-button type="primary" @click="handleRelationMore">确定</el-button>
          <el-button type="info" @click="hiddenAlert">取消</el-button>
        </el-col>

      </el-col>
    </el-col>

    <!-- 关联标签 -->
    <el-col
      :span="24"
      v-if='alertLabel'
      class="alert-wrap">
      <el-col
        :span="24"
        class="alert-content-wrap">
        <el-col
          :span="24"
          class="title-header">
          <el-col :span="6">
            <el-input
              size="small"
              clearable
              placeholder="请输入标签名称"
              prefix-icon="el-icon-search"
              v-model="labels.label_name"
            ></el-input>
          </el-col>
          <el-col :span="2" align="right">
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
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="标签名称">
            <template slot-scope="scope">
              <el-col :span="15" style="margin-left: 20px;">{{scope.row.label_name}}</el-col>
            </template>
          </el-table-column>
          <el-table-column label="标签编码">
            <template slot-scope="scope">
              <el-col :span="15" style="margin-left: 20px;">{{scope.row.label_code}}</el-col>
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
        <el-col :span="16" align="left" class="sure-margin">
          <el-button type="primary" @click="handleLabelsMore">批量关联</el-button>
          <el-button type="info" @click="haddenLabels">取消</el-button>
        </el-col>

      </el-col>
    </el-col>
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
// import { getGoodsSkus } from "@/api/group";
import {
  getEduGoods
} from "@/api/qecode";
import {
  getSkuList,
  getSkuValueList,
  addItemInfo,
  updateItem,
  addItemContent,
  addSkuProject,
  addSkuValue,
  addItemSkuDetail,
  getGoodsSkus
} from "@/api/giftCard";
import {
  getLabelList
} from "@/api/group"
import {
  getItemList
} from "@/api/shopGoods"
import Sticky from "@/components/Sticky";
import Tinymce from "@/components/Tinymce";
import Pagination from '@/components/Pagination';
export default {
  components: {
    Sticky,
    Tinymce,
    Pagination
  },
  data() {
    const host = process.env.BASE_API + "publicmethod/upfile/upload_file";
    return {
      activeName:"first",
      contract_time: [],//购卡最晚赠送时间
      collar_time: [],//领卡最晚使用时间
      selectLabel: [],
      sureData:[],
      total: 0,
      goods: {
        page_no: 1,
        page_size: 10,
        item_name: "",
        item_id_no: []
      },
      alertTotal:null,
      typeId: 1,
      searchTextgoods: "",
      goodsData: [],
      alertShow: false,
      // isUse: "",
      formSpec: {
        item_id: '',
        skus: []
      },
      //维护的value
      title: "新建",
      // 添加按钮显示
      addBtnShow: false,
      // 规格项options
      specOptions: [],
      fileList: [],
      specMore: [
        {
          id: '',
          value: [""]
        }
      ],
      //创建礼品卡 基本资料 提交数据
      form: {
        birthday_flag: 0,
        item_desc: "",
        item_name: "",
        redirect_url: "",
        item_no: "",
        chatroom_flag: 0,
        mobile_flag: 0,
        relation_flag: 0,
        age_flag: 0,
        sex_flag: 0,
        item_type: 7,
        original_price: 0,
        additional_fee: '',
        astrict_type: -1,
        exchange_rule: null,
        use_obj_rule: 2,
        virtual_num: 0,
        astrict_num: 999999,
        card_value: "",
        least_fee: "",
        quantity: "",
        share_msg: "",
        description: "",
        pic_url: "",
        price: 0,
        slider_img: [],
        status: 1,
        astrict_label: [],
        astrict_item: [],
        give_days: null,
        use_days: null,
        subscribe_flag: 0,
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
        sku_item_num: [
          { required: true, message: '请输入规格包含件数', trigger: "change" },
        ],
        shelf_flag: [
          { required: true, message: '选择上下架', trigger: "change" },
        ],
      },
      rules: {
        item_name: [
          { required: true, message: "请输入礼品卡名称", trigger: "blur" }
        ],
        // redirect_url: [
        //   { required: true, message: "请输入限购提示页", trigger: "blur" }
        // ],
        // item_desc: [
        //   { required: true, message: "请输入分享描述", trigger: "blur" }
        // ],
        price: [
          { required: true, message: "请输入商品现价", trigger: "blur" }
        ],
        item_no: [
          { required: true, message: "请输入商品编码", trigger: "blur" }
        ],
        pic_url: [
          { required: true, message: "请上传封面图", trigger: "blur" }
        ],
        original_price: [
          { required: true, message: "请输入商品原价", trigger: "blur" }
        ],
        // mobile_flag: [
        //   { required: true, message: "请选择是否填写手机号", trigger: "blur" }
        // ],
        // relation_flag: [
        //   { required: true, message: "请选择是否填写孩子关系", trigger: "blur" }
        // ],
        // age_flag: [
        //   { required: true, message: "请选择是否填写孩子年龄", trigger: "blur" }
        // ],
        // birthday_flag: [
        //   { required: true, message: "请选择是否填写生日", trigger: "blur" }
        // ],
        // sex_flag: [
        //   { required: true, message: "请选择是否填写孩子性别", trigger: "blur" }
        // ],
        // chatroom_flag: [
        //   { required: true, message: "请选择是否有群服务", trigger: "blur" }
        // ],
        share_msg: [
          { required: true, message: "请输入寄语", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择礼品卡状态", trigger: "blur" }
        ],
        exchange_rule: [
          { required: true, message: "请选择礼领卡使用规则", trigger: "blur" }
        ],
        additional_fee: [
          { required: true, message: "请选择需付费购买时的金额", trigger: "blur" }
        ],
        use_days: [
          { required: true, message: "请输入领卡最晚使用时间", trigger: "blur" }
        ],
        give_days: [
          { required: true, message: "请输入领卡最晚赠送时间", trigger: "blur" }
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
      isGoodsId: 0,
      templateRadio: null,
      labelList: [],
      labelsTotal: 0,
      alertLabel: false,
      labels: {
        label_name: "",
        label_code_no: "",
        page_no: 1,
        page_size: 10
      },
      currentLabel:[],
      currentGoods:[],
      editCard: false
    };
  },
  mounted() {},
  created() {
    console.log(this.$route, 'type')
    this.isGoodsId = this.$route.params.id;
    if (this.$route.params.id != 0) {
      this.title = "编辑";
      this.editCard = true;
      this.formRules.item_id = this.$route.params.id;
      this.getGoodsSkus(this.$route.params.id);
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
      if (!this.tableData) {
        return;
      }
      let tList = [];
      return tList;
    }
  },
  methods: {
    onblur(){
      // console.log(parseInt(this.form.additional_fee))
      if(parseInt(this.form.additional_fee) >0){
      }else{
        this.form.additional_fee = ''
      }
    },
    // 查询标签列表
    getLabelList(){
      getLabelList(this.labels).then(res => {
        if(res.code == 200){
          this.labelList = res.result.rows;
          this.labelsTotal = res.result.total;
        }
      })
    },
    relatedLabel(){
      let labelCode = [];
      if(this.selectLabel.length != 0){
        this.selectLabel.forEach(item => {
          if(labelCode.indexOf(item.label_code) === -1){
            labelCode.push(item.label_code)
          }
        })
        this.labels.label_code_no = labelCode.map((item)=>item).join(',');
        console.log(this.labels.label_code_no)
      }
      this.alertLabel = true;
      this.getLabelList();
    },
    //批量关联标签
    handleSelectionChange(val){
      this.currentLabel = val;
    },
    removeLabels(label_code){
      this.selectLabel.forEach((item, index) => {
        if(label_code == item.label_code){
          this.selectLabel.splice(index, 1);
        }
      })
      this.form.astrict_label.forEach((item, index) => {
        if(label_code == item.label_code){
          this.form.astrict_label.splice(index, 1);
        }
      })
    },
    handleLabelsMore(){
      this.$confirm('确认关联选中的标签吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.currentLabel.forEach(item => {
          this.selectLabel.push(item);
          // this.form.astrict_label.push(item);
        })
        this.form.astrict_label = this.selectLabel;
        console.log(this.form.astrict_label, 'this.form.astrict_label')
        this.alertLabel = false;
        this.$message({
          type: 'success',
          message: '关联成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消关联'
        });          
      });
    },
    haddenLabels(){
      this.alertLabel = false;
    },
    searchLabelList(){
      this.labels.page_no = 1;
      this.getLabelList();
    },
    getTemplateRow(index, row, list) {
      console.log(row, list)
      this.templateRadio = row;
      this.currentGoods = list;
      // this.sureData.push(list);
      // this.form.item_name = list.item_name;
    },
    // removeGoods(item_id){
    //   this.sureData.forEach((item, index) => {
    //     if(item.item_id === item_id){
    //       this.sureData.splice(index, 1);
    //     }
    //   })
    //   this.form.use_item.forEach((itm, idx) => {
    //     if(itm === item_id){
    //       this.form.use_item.splice(idx, 1)
    //     }
    //   })
    // },
    handleContract(value){
      console.log(value, 'value')
      this.form.effective_date1 = value[0];
      this.form.invalid_date1 = value[1];
    },
    handleCollarCard(value){
      this.form.effective_date2 = value[0];
      this.form.invalid_date2 = value[1];
    },
    searchActivity(){
      this.goods.page_no = 1;
      this.getItemList();
    },
    
    relatedGoods(){
      this.sureData.length = 0;
      this.form.astrict_item.length = 0;
      this.alertShow = true;
      this.getItemList();
    },
    getItemList(){
      const data = this.goods;
      getItemList(data).then(res => {
        if(res.code == 200){
          this.goodsData = res.result.rows;
          this.total = res.result.total;

          // console.log(this.sureData, 'sureData')
          // this.sureData.forEach(row => {
          //   console.log(row,'row')
          //   this.$nextTick(() => {
          //     // console.log(this.$refs.multipleTable, '123')
          //     this.$refs.multipleTable.toggleRowSelection(row,true);
          //   });
          // });
        }
      })
    },
    hiddenAlert(){
     this.alertShow = false;
    },
    handleRelationMore(){
      this.alertShow = false;
      this.sureData.push(this.currentGoods);
      this.form.astrict_item.length = 0;
      this.form.astrict_item.push({
        astrict_item_id: this.currentGoods.item_id,
        astrict_item_name: this.currentGoods.item_name
      });
      console.log(this.currentGoods, 'currentGoods')
      this.form.item_name = this.currentGoods.item_name;
    },
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
          sku_item_num: 1,
          sku_sold_num: "",
          shelf_flag: "",
          chatroom_flag: this.form.chatroom_flag,
          mobile_flag: this.form.mobile_flag,
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
            sku.sku_item_num = item.sku_item_num 
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
    getGoodsSkus(item_id) {
      const map = {
        item_id
      };
      getGoodsSkus(map).then(res => {
        if (res.code == 200) {
          this.form = { ...this.form, ...res.result };
          this.formRules = res.result;
          this.formSpec = res.result;
          if (res.result.skus.length) {
            this.formAtTableData(res.result.skus);
          }
          this.selectLabel = res.result.astrict_label;
          this.sureData = res.result.astrict_item;
          this.contract_time.push(res.result.effective_date1,res.result.effective_date2);
          // this.contract_time.push();
          this.collar_time.push(res.result.invalid_date1,res.result.invalid_date2);
          // this.collar_time.push();
          this.form.exchange_rule = res.result.exchange_rule + '';
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
      console.log(map.astrict_item.length, '添加商品传的参数')
      if(map.astrict_item.length === 0){
        this.$message({
          message: "请关联商品哦",
          type: "warning"
        });
        return false;
      }
      if(map.astrict_label.length === 0){
        this.$message({
          message: "请关联限购标签哦",
          type: "warning"
        });
        return false;
      }
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
    },
    updateItem() {
      const map = this.form;
      map.item_id = this.formRules.item_id;
      map.item_desc = "1234"
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
    validSureAdd(){
      console.log(this.formSpec.skus, 'this.formSpec.skus')
      const data = { item_id: this.formRules.item_id, item_sku_detail: this.formSpec.skus, item_type: this.form.item_type };
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
    },

    //更新商品sku
    onSubmit(formSpec) {
      this.$refs[formSpec].validate(valid => {
        if (valid) {
          if (this.formRules.item_id) {
            this.validSureAdd();
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
          let rx=/(https):\/\/([\w.]+\/?)\S*/i;
          console.log(rx.test(this.form.redirect_url))
          if( this.form.redirect_url && !rx.test(this.form.redirect_url)){
            this.$message({
              message: "限购提示页必须以https开头的链接哦",
              type: "warning"
            });
            return false;
          }
          
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
    // addItemContent() {
    //   const map = this.formRules;
    //   addItemContent(map).then(res => {
    //     if (res.code == 200) {
    //       this.$message({
    //         message: "保存详情成功",
    //         type: "success"
    //       });
    //     }
    //   });
    // },
    //更新商品详情
    // onSubmitDetail(formRules) {
    //   this.$refs[formRules].validate(valid => {
    //     if (valid) {
    //       if (this.formRules.item_id) {
    //         this.addItemContent();
    //       } else {
    //         this.$message({
    //           message: "请先创建商品基本信息哦",
    //           type: "error"
    //         });
    //       }
    //     } else {
    //       this.$message({
    //         message: "请先创建商品基本信息哦",
    //         type: "error"
    //       });
    //       return false;
    //     }
    //   });
    // },
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
    },
    // isUse(val){
    //   console.log(val,'val')
    //   if(val == 1){
    //     this.sureData.length = 0;
    //     this.form.use_item = [];
    //   }
    // }
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
  .tips{
    color: red;
  }
  .head-img{
    width: 100px;
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
    .title-header{
      margin-bottom: 20px;
    }
    .sure-margin{
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
</style>
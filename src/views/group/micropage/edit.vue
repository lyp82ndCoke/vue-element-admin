<template>
  <div class="microPage_container" id="app_container">
    <el-col :span="1.5" class="left_menu_container">
      <el-col :span="6" class="left_menu">
        <span>后台组件</span>
        <el-button size="mini" type="primary" @click="pageTitle()">
          <a href="#left_container">页面设置</a>
        </el-button>
        <el-button size="mini" type="primary" @click="bannerCom()">
          <a href="#target">banner图</a>
        </el-button>
        <el-button size="mini" type="primary" @click="titleCom()">
          <a href="#target">版块标题</a>
        </el-button>
        <el-button size="mini" type="primary" @click="goodsCom()">
          <a href="#target">大图商品</a>
        </el-button>
        <el-button size="mini" type="primary" @click="tinymceCom()">
          <a href="#target">富文本</a>
        </el-button>
      </el-col>
    </el-col>

    <el-col :span="5" class="left_container" id="left_container">
      <el-col :span="24" class="right_header Header">
        <span >微页面手机端</span>
      </el-col>
      <el-col :span="24" class="left_container_header">
        <img src="@/assets/404_images/iphoneBg.png" alt="" width="100%" height="18px" class="topHeader">
        <h5 @click="editPagetitle()">{{ ruleForm.page_title ? ruleForm.page_title : '新建微页面标题' }}</h5>
      </el-col>
      <el-col :span="24" class="left_content">
        <draggable v-model="componentList" @start="drag=true" @end="drag=false" :move="getdata" @update="datadragEnd">
          <div v-for="(element,index) in componentList" :key="element.index">
            <!-- banner图 -->
            <div v-if='element.component_type == "1"' class="banner_left component_left" @click.stop="editBanner(index,$event)" 
              v-bind:class="{ active: index == bannerIndex }" ref="activeElement">
              <div class="bannerList">
                <el-carousel height="150px">
                  <el-carousel-item v-for="(item,Index) in element.banner_list" :key="item.index">
                    <img class="img" :src="item.banner_img_url" width='100%' height="150">
                    <i class="el-icon-circle-close" @click.stop="delBannerItem(index,Index)"></i>
                  </el-carousel-item>
                </el-carousel>
              </div>
              <i class="el-icon-error" @click.stop="delBanner(index)"></i>
            </div>

            <!-- 版块标题 -->
            <div v-if='element.component_type == "2"' class="title_left component_left" v-bind:class="{ active: index == titleIndex }" 
              @click="editTitle(index,$event)" ref="activeElement">
              <span>&nbsp;&nbsp; {{ element.title }}</span>
              <i class="el-icon-error" @click.stop="delTitle(index)"></i>
            </div>

            <!-- 商品介绍大图模式 -->
            <div v-if='element.component_type == "3" && element.style_type == "1"' v-bind:class="{ active: index == goodsIndex }"
              class="goods_list_container1 component_left" @click.prevent="editGoods(index,$event)" ref="activeElement">
              <!-- <draggable v-model="element.goods_list" group="people" @start="drag=true" @end="drag=false"> -->
                <div v-for="(item,Index) in element.goods_list" :key="item.goods_img_url" class="goods1">
                  <img class="img" :src="item.goods_img_url" width='262' height="150">
                  <p class="titles">&nbsp;{{ item.goods_title }}</p>
                  <p>
                    <span>&nbsp;￥{{ item.goods_price }}</span>&nbsp;&nbsp;&nbsp;
                    <span class="linePrice" v-if="item.line_price">￥{{ item.line_price }}</span>&nbsp;&nbsp;&nbsp;
                    <span class="sales_volume" v-if="item.sales_volume">{{ item.sales_volume }}人</span>
                  </p>
                  <i class="el-icon-circle-close" @click.stop="delGoodsItem(index,item,Index)" v-if="element.goods_list.length>1"></i>
                </div>
              <!-- </draggable> -->
              <i class="el-icon-error closeAll" @click.stop="delGoods(index)"></i>
            </div>

            <!-- 商品介绍一行两个 -->
            <div v-if='element.component_type == "3" && element.style_type == "2"' v-bind:class="{ active: index == goodsIndex }"
              class="goods_list_container2 component_left" @click.prevent="editGoods(index,$event)" ref="activeElement">
              <div class="goods_list">
                <div v-for="(item,Index) in element.goods_list" :key="item.index" class="goods2">
                  <p class="goods_list_imgs" :style="{backgroundImage: 'url('+item.goods_img_url+')',
                    backgroundRepeat:'no-repeat', backgroundPosition:'center center', backgroundSize: 'cover'}">
                  </p>
                  <p class="titles">&nbsp;{{ item.goods_title }}</p>
                  <p>
                    <span>￥{{ item.goods_price }}</span>&nbsp;&nbsp;
                    <span class="linePrice" v-if="item.line_price">￥{{ item.line_price }}</span>&nbsp;&nbsp;
                    <span class="sales_volume" v-if="item.sales_volume">{{ item.sales_volume }}人</span>
                  </p>
                  <i class="el-icon-circle-close" @click.stop="delGoodsItem(index,item,Index)"></i>
                </div>
                <i class="el-icon-error" @click.stop="delGoods(index)"></i>
              </div>
            </div>

            <!-- 商品介绍一行三个 -->
            <div v-if='element.component_type == "3" && element.style_type == "3"' v-bind:class="{ active: index == goodsIndex }"
              class="goods_list_container3 component_left" @click.prevent="editGoods(index,$event)" ref="activeElement">
              <div class="goods_list">
                <div v-for="(item,Index) in element.goods_list" :key="item.index" class="goods2">
                  <p class="goods_list_imgs" :style="{backgroundImage: 'url('+item.goods_img_url+')',
                    backgroundRepeat:'no-repeat', backgroundPosition:'center center', backgroundSize: 'cover'}">
                  </p>
                  <p class="titles">&nbsp;{{ item.goods_title }}</p>
                  <p>
                    <span>￥{{ item.goods_price }}</span>&nbsp;&nbsp;
                    <span class="linePrice" v-if="!item.sales_volume&&item.line_price">￥{{ item.line_price }}</span>
                    <span class="sales_volume" v-if="item.sales_volume&&item.line_price">{{ item.sales_volume }}人</span>
                  </p>
                  <i class="el-icon-circle-close" @click.stop="delGoodsItem(index,item,Index)"></i>
                </div>
                <i class="el-icon-error" @click.stop="delGoods(index)"></i>
              </div>
            </div>

            <!-- 富文本 -->
            <div v-if='element.component_type == "4"' class="tinymce_left component_left" v-bind:class="{ active: index == tinymceIndex }"
              @click.stop="editTinymce(index,$event)" ref="activeElement">
              <p v-html="element.content"></p>
              <i class="el-icon-error" @click.stop="delTinymce(index)"></i>
            </div>
          </div>
        </draggable>
      </el-col>
    </el-col>

    <el-col :span="15" class="right_container">
      <el-col :span="24" class="right_content">
        <el-col :span="24" class="right_contents">
          <!-- 页面标题 -->
          <el-col :span="15" class="title_right" v-if="titleDisplay">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="页面名称" prop="page_title">
                <el-input v-model="ruleForm.page_title" placeholder="请输入页面标题"></el-input>
              </el-form-item>
              <el-form-item label="页面分享" prop="share_describe">
                <el-input type="textarea" v-model="ruleForm.share_describe"></el-input>
              </el-form-item>
              <el-form-item label="分享图片" prop="share_img">
                <el-col :span="9">
                  <el-upload
                    class="avatar-uploader"
                    :action="host"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess1"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="ruleForm.share_img" :src="ruleForm.share_img" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
                  </el-upload>
                </el-col>
              </el-form-item>
            </el-form>
          </el-col>
          
          <!-- banner图 -->
          <el-col :span="24" class="banner_right" v-if='bannerDisplay11 && componentList[bannerIndex]' 
          :style='mypagestyle' >
            <draggable v-model="componentList[bannerIndex].banner_list" group="people" @start="drag=true" @end="drag=false">
              <el-col :span="22" v-for="(item,index) in componentList[bannerIndex].banner_list" :key="item.index" 
                class="banner_right_content">
                <el-col :span="16" class="banner_right_item">
                  <el-col :span="6">添加方式:</el-col>  
                  <el-col :span="14">
                    <el-radio v-model="item.add_type" :disabled="item.goods_img_url != '' || item.goods_url != ''" label="1">选择商品</el-radio>
                    <el-radio v-model="item.add_type" :disabled="item.goods_img_url != '' || item.goods_url != ''" label="2">粘贴链接</el-radio>
                  </el-col>
                </el-col>
                <el-col :span="20" class="banner_right_item"  v-if="item.add_type == '1'">
                  <el-col :span="5">添加商品:</el-col>  
                  <el-col :span="6" v-if="item.goods_img_url">
                    <el-button type="text" @click="selectGoods(item)">点击更换商品</el-button>
                  </el-col>
                  <el-col :span="6" v-else>
                    <el-button type="text" @click="selectGoods(item)">点击关联商品</el-button>
                  </el-col>
                </el-col>
                <el-col :span="20" class="banner_right_item banner_right_img" v-if="item.add_type == '1'">
                  <el-col :span="5" align="">商品图:</el-col> 
                  <el-col :span="7" style="border: 1px dashed lightgray;width:162px; height:92px">
                    <img :src="item.goods_img_url" alt="" width='160' height="90">
                  </el-col>
                </el-col>
                <el-col :span="20" class="banner_right_item" v-else>
                  <el-col :span="5">粘贴链接:</el-col> 
                  <el-col :span="15" class="" >
                    <el-input placeholder="请输入链接" v-model="item.goods_url" size="small"></el-input>
                  </el-col> 
                </el-col>
                <el-col :span="20" class="banner_right_item banner_right_img">
                  <el-col :span="5">添加背景图:</el-col>
                  <el-col :span="6" >
                    <el-upload
                      class="avatar-uploader"
                      :action="host"
                      :show-file-list="false"
                      :on-success="(response, file, fileList)=>handleAvatarSuccess33(response, file, fileList, index, bannerIndex)"
                      :before-upload="beforeAvatarUpload">
                      <img v-if="item.banner_img_url" :src="item.banner_img_url" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
                    </el-upload>
                  </el-col>
                  <el-col :span="9">建议尺寸:750*280</el-col>
                </el-col>
                <el-col :span="2" style="position: relative;bottom: 165px;right: -40px;" 
                  v-if="index == componentList[bannerIndex].banner_list.length -1 && item.add_type == '1'">
                  <el-button type="primary" @click="addBanner(bannerIndex)" size="small">新增</el-button>
                </el-col>
                <el-col :span="2" style="position: relative;bottom: 65px;right: -40px;" 
                  v-if="index == componentList[bannerIndex].banner_list.length -1 && item.add_type == '2'">
                  <el-button type="primary" @click="addBanner(bannerIndex)" size="small">新增</el-button>
                </el-col>
              </el-col>
            </draggable>
          </el-col>

          <!-- 版块标题 -->
          <el-col :span="24" class="goods_title_right" v-if='titleDisplay22 && componentList[titleIndex]' :style='mypagestyle'>
            <el-col :span="2">板块标题:</el-col>
            <el-col :span="10">
              <el-input placeholder="请输入板块标题" v-model="componentList[titleIndex].title" size="small"></el-input>
            </el-col>
          </el-col>

          <!-- 商品介绍 -->
          <el-col :span="24" class="goods_right" v-if='goodsDisplay33 && componentList[goodsIndex]' :style='mypagestyle' 
          v-bind:class="{ goods_right_active: componentList[goodsIndex].style_type == '2' || componentList[goodsIndex].style_type == '3' }">
            <draggable v-model="componentList[goodsIndex].goods_list" group="people" @start="drag=true" @end="drag=false">
            <el-col :span="20" v-for="(item,index) in componentList[goodsIndex].goods_list" :key="item.index" 
              class="goods_right_content">
              <el-col :span="20" class="goods_right_item" v-if="index == 0">
                <el-col :span="4">列表样式:</el-col> 
                <el-col :span="16">
                  <el-radio v-model="componentList[goodsIndex].style_type" label="1">大图模式</el-radio>
                  <el-radio v-model="componentList[goodsIndex].style_type" label="2">一行两个</el-radio>
                  <el-radio v-model="componentList[goodsIndex].style_type" label="3">一行三个</el-radio>
                </el-col>
              </el-col>
              <el-col :span="20" class="goods_right_item">
                <el-col :span="4">添加方式:</el-col>
                <el-col :span="10">
                  <el-radio v-model="item.add_type" label="1" :disabled="item.select_goods_img_url != ''" @change="changeAddtype(index)">选择商品</el-radio>
                  <el-radio v-model="item.add_type" label="2" :disabled="item.select_goods_img_url != ''" @change="changeAddtype(index)">粘贴链接</el-radio>
                </el-col>
              </el-col>
              <el-col :span="2" v-if='index == componentList[goodsIndex].goods_list.length -1' :offset="1">
                <el-button type="primary" @click="addGoods(goodsIndex)" size="small">新增</el-button>
              </el-col>
              <el-col v-if="item.add_type == '1'" :span="20" class="goods_right_item">
                <el-col :span="4">选择商品:</el-col> 
                <!-- <el-col :span="6" v-if="item.goods_title">
                  <el-button type="text" @click="selectGoods2(item)">{{item.goods_title === '商品标题，最多显示一行' ? '点击关联商品' : '点击更换商品'}}</el-button>
                </el-col> -->
                <el-col :span="6">
                  <el-button type="text" @click="selectGoods2(item)" v-if="index == 0&&componentList[goodsIndex].goods_list.length == 1">
                    {{item.goods_title === '商品标题，最多显示一行' ? '点击关联商品' : '点击更换商品'}}
                  </el-button>
                  <el-button type="text" @click="selectGoods(item)" v-else>
                    {{item.goods_title === '商品标题，最多显示一行' ? '点击关联商品' : '点击更换商品'}}
                  </el-button>
                </el-col>
              </el-col>
              <el-col :span="20" v-if="item.add_type == '1'" class="goods_right_item goods_right_img">
                <el-col :span="4" align="">商品图:</el-col> 
                <el-col :span="8" class="" style="border:1px dashed lightgray;height:90px;width: 162px;height: 92px;">
                  <img :src="item.select_goods_img_url" alt="" width='160' height="90">
                </el-col>
              </el-col>
              <!-- <el-col :span="20" v-if="item.add_type == '2'" class="goods_right_img">
                <el-col :span="4" align="">商品图:</el-col>
                <el-col :span="8" class="" >
                  <el-upload
                    class="avatar-uploader"
                    :action="host"
                    :show-file-list="false"
                    :on-success="(response, file, fileList)=>handleAvatarSuccess3(response, file, fileList, index, goodsIndex)"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="item.select_goods_img_url" :src="item.select_goods_img_url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
                  </el-upload>
                </el-col>
              </el-col> -->
              <el-col :span="20" class="goods_right_img">
                <el-col :span="4" align="">封面图:</el-col> 
                <el-col :span="8">
                  <el-upload
                    class="avatar-uploader"
                    :action="host"
                    :show-file-list="false"
                    :on-success="(response, file, fileList)=>handleAvatarSuccess44(response, file, fileList, index, goodsIndex)"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="item.goods_img_url" :src="item.goods_img_url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
                  </el-upload>
                </el-col>
                <el-col :span="9">
                  {{componentList[goodsIndex].style_type === '1' ? '建议尺寸:345*150' : '建议尺寸: 400*300'}}
                </el-col>
              </el-col>

              <el-col v-if="item.add_type == '2'" :span="20" class="goods_right_item">
                <el-col :span="4">商品链接:</el-col> 
                <el-col :span="20" class="" >
                  <el-input size="small" v-model="item.goods_url"></el-input>
                </el-col>
              </el-col>
              <el-col v-if="item.add_type == '2'" :span="20" class="goods_right_item">
                <el-col :span="4">商品标题:</el-col> 
                <el-col :span="20" class="" >
                  <el-input size="small" v-model="item.goods_title"></el-input>
                </el-col>
              </el-col>
              <el-col v-if="item.add_type == '2'" :span="20" class="goods_right_item">
                <el-col :span="4">商品价格:</el-col> 
                <el-col :span="20" class="" >
                  <el-input size="small" v-model="item.goods_price"></el-input>
                </el-col>
              </el-col>
              <el-col v-if="item.add_type == '2'" :span="20" class="goods_right_item">
                <el-col :span="4">划线价格:</el-col> 
                <el-col :span="20" class="" >
                  <el-input size="small" v-model="item.line_price"></el-input>
                </el-col>
              </el-col>
              <el-col v-if="item.add_type == '2'" :span="20" class="goods_right_item">
                <el-col :span="4">销量:</el-col> 
                <el-col :span="20" class="" >
                  <el-input size="small" v-model.number="item.sales_volume" type="number" min="1" :max="999999999"></el-input>
                  <!-- <el-input-number size="small" v-model="item.sales_volume" :min="1" :max="999999999"></el-input-number> -->
                </el-col>
              </el-col>
              
            </el-col>
            </draggable>
          </el-col>

          <!-- 富文本 -->
          <el-col :span="21" class="tinymce_right" v-if='tinymceDisplay44 && componentList[tinymceIndex]' :style='mypagestyle'>
            <tinymce v-model="componentList[tinymceIndex].content" :height="320" class="tinymce_right_content"></tinymce>
          </el-col>

          <!-- 商品选择弹窗单选 -->
          <el-dialog title="选择关联商品" width="60%" :visible.sync="dialogFormVisible">
            <el-col :span="24">
              <el-col :span="10">
                <el-input size="small" placeholder="请输入商品名称搜索" prefix-icon="el-icon-search" v-model="listQuery.item_name">
                </el-input>
              </el-col>
              <el-col :span="2" class="success-btn">
                <el-button type="success" @click="searchGoods()" icon="el-icon-search" size="small">搜索</el-button>
              </el-col>
              <el-col :span="5" :offset="2" class="success-btn">
                <el-select v-model="listQuery.item_type" size="small" @change="searchGoods()" placeholder="点击选择类型">
                  <el-option
                    v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-col >
            <el-col :span="24">
              <el-table 
                ref="singleTable"
                highlight-current-row
                tooltip-effect="dark"
                style="width: 100%"
                @current-change="handleCurrentChange"
                :data="goodsData"
                class="dialog-table">
                <el-table-column type="index" width="55" align="center"></el-table-column>
                <el-table-column property="item_name" label="商品名称" align="center"></el-table-column>
                <el-table-column property="item_type" label="商品类型" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.item_type == "7" ? '礼品卡商品' : ( scope.row.item_type == "8" ? '训练营(不带群)' : '训练营(带群)')}}</span>
                  </template>
                </el-table-column>
                <el-table-column property="item_name" label="时间" align="center"></el-table-column>
              </el-table>
            </el-col>
            <el-col :span="24">
              <pagination 
              class="pagination" 
              v-show="total>0" 
              :total="total" 
              :page.sync="listQuery.page_no" 
              :limit.sync="listQuery.page_size" 
              v-on:pagination="changePaging"/>
            </el-col>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false;">取 消</el-button>
              <el-button type="primary" @click="Submit()">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 商品选择弹窗多选 -->
          <el-dialog title="选择关联商品" width="50%" :visible.sync="dialogFormVisible2">
            <el-col :span="24">
              <el-col :span="10">
                <el-input size="small" placeholder="请输入商品名称搜索" prefix-icon="el-icon-search" v-model="listQuery.item_name">
                </el-input>
              </el-col>
              <el-col :span="2" class="success-btn">
                <el-button type="success" @click="searchGoods()" icon="el-icon-search" size="small">搜索</el-button>
              </el-col>
              <el-col :span="5" :offset="2" class="success-btn">
                <el-select v-model="listQuery.item_type" size="small" @change="searchGoods()" placeholder="点击选择类型">
                  <el-option
                    v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-col >
            <el-col :span="24">
              <el-table 
                ref="multipleTable"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                :data="goodsData"
                class="dialog-table">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column property="item_name" label="商品名称" align="center"></el-table-column>
                <el-table-column property="item_type" label="商品类型" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.item_type == "7" ? '礼品卡商品' : ( scope.row.item_type == "8" ? '训练营(不带群)' : '训练营(带群)')}}</span>
                  </template>
                </el-table-column>
                <el-table-column property="item_name" label="时间" align="center"></el-table-column>
              </el-table>
            </el-col>
            <el-col :span="24">
              <pagination 
              class="pagination" 
              v-show="total>0" 
              :total="total" 
              :page.sync="listQuery.page_no" 
              :limit.sync="listQuery.page_size" 
              v-on:pagination="changePaging"/>
            </el-col >
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible2 = false;">取 消</el-button>
              <el-button type="primary" @click="Submit2()">确 定</el-button>
            </div>
          </el-dialog>

        </el-col>
      </el-col>
    </el-col>

    <el-col :span="24" class="left_bottom" id="target">
    </el-col>

    <el-col :span="2" class="app_bottom">
      <el-button type="primary" size="small" @click="submitForm()">保存全部</el-button>
    </el-col>
  </div>
</template>

<script>
import { getPage,insertPage,updatePage } from "@/api/micropage";
import { getItemListAll } from "@/api/shopGoods";
import Tinymce from '@/components/Tinymce'
import Pagination from '@/components/Pagination';
import draggable from 'vuedraggable';

export default {
  name:'',
  components: { Tinymce,Pagination,draggable },
  data(){
    return{
      host:'',
      listQuery: {
        page_no: 1,
        page_size: 8,
        item_name:'',
        item_type:''
      },
      total: 0,
      options: [
        {
          value: '',
          label: '全部类型'
        }, {
          value: '8',
          label: '训练营(不带群)'
        }, {
          value: '9',
          label: '训练营(带群)'
        }, {
          value: '7',
          label: '礼品卡商品'
        }
      ],
      goodsData:[],
      saveData: {
        pageInfo: {},
        componentList:[]
      },
      ruleForm: {
        page_title: '',
        page_title2: '',
        share_describe: '',
        share_img: '',
      },
      rules: {
        page_title: [
          { required: true, message: '请输入页面名称', trigger: 'blur' },
        ],
        share_describe: [
          { required: true, message: '请输入页面分享', trigger: 'blur' },
        ],
        share_img: [
          { required: true, message: '分享图片不能为空', trigger: 'blur' },
        ]
      },
      componentList:[],
      titleDisplay: true,
      tinymceDisplay44: false,
      tinymceDisplay: false,
      goodsDisplay: false,
      goodsDisplay33:false,
      titleDisplay2: false,
      titleDisplay22: false,
      bannerDisplay: false,
      bannerDisplay11:false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      selectGoodsItem: {},
      titles:'',
      titleIndex: null,
      bannerIndex: null,
      goodsIndex: null,
      tinymceIndex: null,
      currentRow: null,
      mypagestyle:{
        position: 'relative',
        top: ''
      },
      multipleSelection: []
    }
  },
  created(){
    this.host = process.env.GROUP_API + '/service/shop/item/file_upload';
    if(this.$route.params.id != '0'){
      this.getPage();
      this.saveData.pageInfo.page_id = this.$route.params.id;
    }
    // this.getItemListAll();
  },
  methods:{
    getPage(){
      getPage({ page_id: this.$route.params.id }).then((res) => {
        if (res.code == 200) {
          //页面标题
          this.ruleForm = res.result.pageInfo;
          this.ruleForm.page_title2 = this.ruleForm.page_title;
          this.componentList = res.result.componentList;
        }
      })
    },
    displayControl(){
      [this.tinymceDisplay,this.goodsDisplay,this.titleDisplay,this.titleDisplay2,
      this.bannerDisplay,this.bannerDisplay11,this.titleDisplay22,this.goodsDisplay33,this.tinymceDisplay44]
      = [false,false,false,false,false,false,false,false,false];
    },
    pageTitle(){
      this.displayControl();
      this.titleDisplay = !this.titleDisplay;
    },
    editPagetitle(){
      this.displayControl();
      this.titleDisplay = true;
    },
    bannerCom(){
      this.displayControl();
      this.bannerDisplay11 = true;
      this.componentList.push(
        {
          component_type: "1",
          banner_list: [
            {
              "banner_img_url": "",
              "goods_id": "",
              "goods_url": "",
              "goods_img_url": "",
              "add_type": "1"
            }
          ]
        }
      )
      this.titleIndex = null;
      this.goodsIndex = null;
      this.tinymceIndex = null;
      this.bannerIndex = this.componentList.length - 1;
      setTimeout(() => {
        this.mypagestyle.top = this.$refs.activeElement[this.$refs.activeElement.length-1].offsetTop - 35 + 'px';
      }, 50);
    },
    addBanner(i){
      this.componentList[i].banner_list.push(
        {
          "banner_img_url": "",
          "goods_id": "",
          "goods_url": "",
          "goods_img_url": "",
          "add_type": "1"
        }
      )
    },
    editBanner(i,e){
      this.displayControl();
      this.bannerDisplay11 = true;
      this.bannerIndex = i;
      this.mypagestyle.top = e.currentTarget.offsetTop - 45 + 'px';
      this.titleIndex = null;
      this.goodsIndex = null;
      this.tinymceIndex = null;
      
      if(e.currentTarget.offsetTop > 0){
        this.mypagestyle.top = e.currentTarget.offsetTop - 47 + 'px';
      }else{
        this.mypagestyle.top = e.pageY - e.offsetY - e.srcElement.parentNode.offsetTop - 95  + 'px';
      }
    },
    delBanner(i){
      this.$confirm('确定删除此商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.componentList.splice(i,1);
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });          
      });
    },
    delBannerItem(index,Index){
      this.$confirm('确定删除此商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(this.componentList[index].banner_list.length == 1){
          this.componentList.splice(index,1);
        }else{
          this.componentList[index].banner_list.splice(Index,1);     
        }
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });          
      });
    },
    titleCom(){
      this.displayControl();
      this.titleDisplay22 = true;
      this.componentList.push(
        {
          component_type: "2",
          title:''
        }
      )
      this.titleIndex = this.componentList.length - 1;
      this.bannerIndex = null;
      this.goodsIndex = null;
      this.tinymceIndex = null;
      setTimeout(() => {
        this.mypagestyle.top = this.$refs.activeElement[this.$refs.activeElement.length-1].offsetTop - 20 + 'px';
      }, 50);
    },
    editTitle(i,e){
      this.displayControl();
      this.titleDisplay22 = true;
      this.titleIndex = i;
      this.bannerIndex = null;
      this.goodsIndex = null;
      this.tinymceIndex = null;

      if(e.currentTarget.offsetTop > 0){
        this.mypagestyle.top = e.currentTarget.offsetTop - 30 + 'px';
      }else{
        this.mypagestyle.top = e.pageY - e.offsetY - 78  + 'px';
      }
    },
    delTitle(i){
      this.$confirm('确定删除此商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.componentList.splice(i,1)
        this.titleIndex = this.componentList.length - 1;
        this.titleDisplay22 = false;
      });
    },
    goodsCom(){
      this.displayControl();
      this.goodsDisplay33 = true;
      this.componentList.push(
        {
          component_type: "3",
          style_type: "1",
          goods_list: [
            {
              "goods_id": "",
              "goods_url": "",
              "goods_img_url": "",
              "select_goods_img_url": "",
              "add_type": "1",
              "goods_title": "商品标题,最多显示一行",
              "line_price": "",
              "sales_volume": "",
              "goods_price": "商品价格"
            }
          ]
        }
      )
      this.goodsIndex = this.componentList.length - 1;
      this.titleIndex = null;
      this.bannerIndex = null;
      this.tinymceIndex = null;
      setTimeout(() => {
        this.mypagestyle.top = this.$refs.activeElement[this.$refs.activeElement.length-1].offsetTop - 35 + 'px';
      }, 50);
    },
    addGoods(i){
      this.componentList[i].goods_list.push(
        {
          "goods_id": "",
          "goods_url": "",
          "goods_img_url": "",
          "select_goods_img_url": "",
          "add_type": "1",
          "goods_title": "商品标题,最多显示一行",
          "line_price": "",
          "goods_price": "商品价格"
        },
      )
    },
    editGoods(i,e){
      this.displayControl();
      this.goodsDisplay33 = true;
      this.goodsIndex = i;
      this.titleIndex = null;
      this.bannerIndex = null;
      this.tinymceIndex = null;
      
      if(e.currentTarget.offsetTop > 0){
        this.mypagestyle.top = e.currentTarget.offsetTop - 37 + 'px';
      }else{
        this.mypagestyle.top = e.pageY - e.offsetY - e.srcElement.parentNode.offsetTop - 88  + 'px';
      }
    },
    changeAddtype(i){
      this.componentList[this.goodsIndex].goods_list[i].goods_img_url = '';
      this.componentList[this.goodsIndex].goods_list[i].goods_title = '商品标题，最多显示一行';
      this.componentList[this.goodsIndex].goods_list[i].goods_price = '商品价格';
      this.componentList[this.goodsIndex].goods_list[i].line_price = '';
      this.componentList[this.goodsIndex].goods_list[i].goods_url = '';
      this.componentList[this.goodsIndex].goods_list[i].select_goods_img_url = '';
    },
    delGoods(i){
      this.$confirm('确定删除此商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.componentList.splice(i,1)
      });
    },
    delGoodsItem(index,v,i){
      this.$confirm('确定删除此商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(this.componentList[index].goods_list.length == 1){
          this.componentList.splice(index,1);
        }else{
          this.componentList[index].goods_list.splice(i,1);   
        }
      });
    },
    tinymceCom(){
      this.displayControl();
      this.tinymceDisplay44 = false;
      setTimeout(() => {
        this.tinymceDisplay44 = true;
      }, 100);
      this.componentList.push(
        {
          component_type: "4",
          content:''
        }
      )
      this.tinymceIndex = this.componentList.length - 1;
      this.titleIndex = null;
      this.bannerIndex = null;
      this.goodsIndex = null;
      setTimeout(() => {
        this.mypagestyle.top = this.$refs.activeElement[this.$refs.activeElement.length-1].offsetTop - 35 + 'px';
      }, 50);
    },
    editTinymce(i,e){
      this.displayControl();
      this.tinymceDisplay44 = false;
      setTimeout(() => {
        this.tinymceDisplay44 = true;
      }, 100);
      this.tinymceIndex = i;
      this.titleIndex = null;
      this.bannerIndex = null;
      this.goodsIndex = null;

      if(e.currentTarget.offsetTop > 0){
        this.mypagestyle.top = e.currentTarget.offsetTop - 34 + 'px';
      }else{
        this.mypagestyle.top = e.pageY - e.offsetY - 89  + 'px';
      }
    },
    delTinymce(i){
      this.$confirm('确定删除此组件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.componentList.splice(i,1);
      });
    },
    //单选
    selectGoods(v){
      this.dialogFormVisible = true;
      this.selectGoodsItem = v;
      // setTimeout(() => {
      //   for (let index = 0; index < this.goodsData.length; index++) {
      //     if(v.goods_id == this.goodsData[index].item_id){
      //       this.setCurrent(this.goodsData[index]);
      //     }
      //   }
      // }, 200);
      this.listQuery.item_id_no = v.goods_id;
      getItemListAll(this.listQuery).then(res => {
        if (res.code == 200) {
          this.goodsData = res.result.rows;
          this.total = res.result.total;
        }
      });
    },
    Submit(v){
      this.dialogFormVisible = false;
      if(this.selectGoodsItem.banner_img_url == ''){
        this.selectGoodsItem.goods_img_url = this.currentRow.pic_url;
        this.listQuery.item_name = '';
      }else{
        this.selectGoodsItem.select_goods_img_url = this.currentRow.pic_url;
      }
      this.selectGoodsItem.goods_id = this.currentRow.item_id;
      this.selectGoodsItem.goods_title = this.currentRow.item_name;
      this.selectGoodsItem.line_price = this.currentRow.original_price;
      this.selectGoodsItem.goods_price = this.currentRow.price;
      this.selectGoodsItem.goods_type = this.currentRow.item_type;
      this.listQuery.item_name = '';
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //多选
    selectGoods2(v){
      this.dialogFormVisible2 = true;
      if(v.goods_id){
        this.selectGoodsItem = v;
        this.listQuery.item_id_no = v.goods_id;
        getItemListAll(this.listQuery).then(res => {
          if (res.code == 200) {
            this.goodsData = res.result.rows;
            this.total = res.result.total;
          }
        });
      }else{
        this.getItemListAll();
        this.selectGoodsItem = v;
      }
    },
    Submit2(){
      this.dialogFormVisible2 = false;
      if(this.componentList[this.goodsIndex].style_type == '1'){
        this.componentList[this.goodsIndex].goods_list.splice(0,1);
        for (let x = 0; x < this.multipleSelection.length; x++) {
          this.componentList[this.goodsIndex].goods_list.unshift(
            {
              select_goods_img_url: this.multipleSelection[x].pic_url,
              goods_id: this.multipleSelection[x].item_id,
              goods_title: this.multipleSelection[x].item_name,
              line_price: this.multipleSelection[x].original_price,
              goods_price: this.multipleSelection[x].price,
              goods_type: this.multipleSelection[x].item_type,
              add_type:'1',
              goods_url: '',
              goods_img_url: '',
            }
          )
        }
      }else{
        this.componentList[this.goodsIndex].goods_list.splice(0,1);
        for (let x = 0; x < this.multipleSelection.length; x++) {
          this.componentList[this.goodsIndex].goods_list.unshift(
            {
              select_goods_img_url: this.multipleSelection[x].pic_url,
              goods_id: this.multipleSelection[x].item_id,
              goods_title: this.multipleSelection[x].item_name,
              line_price: this.multipleSelection[x].original_price,
              goods_price: this.multipleSelection[x].price,
              goods_type: this.multipleSelection[x].item_type,
              add_type:'1',
              goods_url: '',
              goods_img_url: '',
            }
          )
        }
      }
      this.listQuery.item_name = '';
    },
    submitForm(){
      if(this.ruleForm.page_title && this.ruleForm.share_describe && this.ruleForm.share_img){
        this.saveData.pageInfo = {
          page_title: this.ruleForm.page_title,
          share_describe: this.ruleForm.share_describe,
          share_img: this.ruleForm.share_img,
          page_id: this.$route.params.id
        }

        console.log('updatePage.saveData111',this.componentList);
        for (let k = 0,len = this.componentList.length; k < len; k++) {
          if(this.componentList[k].component_type == '1'){
            if(this.componentList[k].banner_list.length === 0){
              this.$message({
                message: 'Banner组件必要信息不能为空，请检查',
                type: 'warning'
              });
              return false;
            }else{
              for (let m = 0; m < this.componentList[k].banner_list.length; m++) {
                if(this.componentList[k].banner_list[m].add_type === '1'){
                  if(this.componentList[k].banner_list[m].banner_img_url === '' ||
                  this.componentList[k].banner_list[m].goods_id === ''){
                    this.$message({
                      message: 'Banner组件必要信息不能为空，请检查',
                      type: 'warning'
                    });
                    return false;
                  }
                }else if(this.componentList[k].banner_list[m].add_type === '2'){
                  if(this.componentList[k].banner_list[m].banner_img_url === '' || 
                  this.componentList[k].banner_list[m].goods_url === ''){
                    this.$message({
                      message: 'Banner组件必要信息不能为空，请检查',
                      type: 'warning'
                    });
                    return false;
                  }
                }
              }
            }
          }else if(this.componentList[k].component_type == '2'){
            if(this.componentList[k].title === ''){
              this.$message({
                message: '组件标题不能为空，请检查',
                type: 'warning'
              });
              return false;
            }
          }else if(this.componentList[k].component_type == '3' && this.componentList[k].style_type == '1' || 
          this.componentList[k].component_type == '3' && this.componentList[k].style_type == '2' ||
          this.componentList[k].component_type == '3' && this.componentList[k].style_type == '3'){
            if(this.componentList[k].goods_list.length === 0){
              this.$message({
                message: '商品组件必要信息不能为空，请检查',
                type: 'warning'
              });
              return false;
            }else{
              for (let m = 0; m < this.componentList[k].goods_list.length; m++) {
                if(this.componentList[k].goods_list[m].add_type === '2' && (Number(this.componentList[k].goods_list[m].sales_volume))<1){
                  this.componentList[k].goods_list[m].sales_volume = ''
                }

                if(this.componentList[k].goods_list[m].add_type === '2'){
                  if(this.componentList[k].goods_list[m].goods_img_url === '' || 
                  this.componentList[k].goods_list[m].goods_title === '' ||
                  this.componentList[k].goods_list[m].goods_url === '' || 
                  this.componentList[k].goods_list[m].goods_price === ''){
                    this.$message({
                      message: '商品组件必要信息不能为空，请检查',
                      type: 'warning'
                    });
                    return false;
                  }
                }else{
                  if(this.componentList[k].goods_list[m].goods_img_url === '' || 
                  this.componentList[k].goods_list[m].select_goods_img_url === '' || 
                  this.componentList[k].goods_list[m].goods_title === '' || 
                  this.componentList[k].goods_list[m].goods_price === ''){
                    this.$message({
                      message: '商品组件必要信息不能为空，请检查',
                      type: 'warning'
                    });
                    return false;
                  }
                }
              }
            }
          }
          else if(this.componentList[k].component_type == '4'){
            if(this.componentList[k].content === ''){
              this.$message({
                message: '富文本组件内容不能为空，请检查',
                type: 'warning'
              });
              return false;
            }
          }
        }
        this.saveData.componentList = this.componentList;
        console.log('updatePage.saveData222',this.saveData);
        if(this.$route.params.id != '0'){
          updatePage( this.saveData ).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              });
              this.$router.push({ name:'micropage' });
            }
          })
        }else{
          insertPage( this.saveData ).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              });
              this.$router.push({ name:'micropage' });
            }
          })
        }
      }else{
        this.$message({
          message: '微页面标题信息不能为空！',
          type: 'warning'
        });
      }   
    },
    getItemListAll(){
      getItemListAll(this.listQuery).then(res => {
        if (res.code == 200) {
          this.goodsData = res.result.rows;
          this.total = res.result.total;
        }
      });
    },
    getdata (evt) {
      // console.log(evt.draggedContext.element.id);
    },
    datadragEnd (evt) {
      // console.log('拖动前的索引 :' + evt.oldIndex);
      // console.log('拖动后的索引 :' + evt.newIndex);
    },
    searchGoods(){
      this.getItemListAll();
    },
    changePaging(){
      this.getItemListAll();
    },
    handleAvatarSuccess1(res, file) {
      this.ruleForm.share_img = res.result.file_url;
    },
    handleAvatarSuccess33(res, file, fileList, index, index2) {
      this.componentList[index2].banner_list[index].banner_img_url = res.result.file_url;
    },
    handleAvatarSuccess44(res, file, fileList, index, index2) {
      this.componentList[index2].goods_list[index].goods_img_url = res.result.file_url;
    },
    handleAvatarSuccess3(res, file, fileList, index, Index1) {
      this.componentList[Index1].goods_list[index].select_goods_img_url = res.result.file_url;
    },
    handleAvatarSuccess4(res, file) {
      this.goods_img_url = res.result.file_url;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 200000;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式 或者 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style lang="scss">
.microPage_container{
  padding: 15px;
  width: 100%;
  min-width: 1700px;
  height: auto;
  .left_menu_container{
    // width: 90px;
    height: 350px;
    margin-right: 10px;
    position: fixed;
    // left: 230px;
    // top: 70px;
    .left_menu{
      width: 90px;
      height: 300px;
      line-height: 50px;
      text-align: center;
      border: 1px solid lightgray;
      // position: fixed;
      // left: 230px;
      // top: 70px;
      .el-button{
        width: 88px;
        text-align: center;
      }
      .el-button+.el-button{
        margin: 0;
      }
    }
  }
  .left_container{
    width: 300px;
    height: auto;
    border: 1px solid gainsboro;
    margin: 0 0 300px 120px;
    .Header{
      text-align: center;
      margin: 5px 0;
    }
    .left_container_header{
      height: 50px;
      width: 100%;
      h5{
        text-align: center;
        overflow: hidden;
        margin-top: 4px;
      }
      border-bottom: 1px solid #ddd;
    }
    .left_content{
      // height: 570px;
      width: 298px;
      height: auto;
      background:#F7F6F9;
      .pubilctitles{
        color: #E60039;
      }
      .banner_left{
        height: 152px;
        width: 276px;
        margin:10px 12px;
        position: relative;
        .el-icon-error{
          position: absolute;
          top: 0px;
          right: 0px;
          z-index: 9;
          display: none;
          font-size: 14px;
        }
        &:hover > .el-icon-error{
          display: block;
        }
        .bannerList{
          width: 274px;
          // min-height: 150px;
          position: relative;
          .el-carousel{
            border-radius: 8px;
          }
          .el-carousel__item{
            overflow: hidden;
            // position: relative;
            .el-icon-circle-close{
              position: absolute;
              top: 13px;
              right: 13px;
              visibility: hidden;
              font-size: 14px;
            }
            &:hover > i{
              visibility: visible;
              z-index: 999;
            }
          }
        }
      }
      .title_left{
        width: 100%;
        height: 30px;
        margin: 5px 0px;
        position: relative;
        background: #fff;
        span{
          width: 100%;
          height: 100%;
          display: block;
          text-align: left;
          font-size: 13px;
          line-height: 30px;
          font-weight: bold;
        }
        i{
          position: absolute;
          top: 3px;
          right: 2px;
          z-index: 9;
          zoom: 0.85;
          display: none;
        }
        &:hover > i{
          display: block;
        }
      }
      .goods_list_container1{
        height: auto;
        width: 277px;
        margin:10px 12px;
        position: relative;
        .closeAll{
          position: absolute;
          top: 0px;
          right: 0px;
          display: none;
          font-size: 14px;
        }
        &:hover > .closeAll{
          display: block;
        }
        .goods1{
          position: relative;
          border-radius: 8px;
          background: #fff;
          height: 208px;
          width: 275px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          img{
            border-radius: 8px;
          }
          i{
            position: absolute;
            top: 13px;
            right: 13px;
            display: none;
            font-size: 14px;
          }
          &:hover > i{
            display: block;
          }
          p{
            width: 100%;
            height: 20px;
            line-height:20px;
            margin: 0;
            font-size: 12px;
            text-align: left;
            text-indent: 5px;
            overflow: hidden;
            span{
              color: #E60039;
            }
            .linePrice{
              text-decoration: line-through;
              color: rgb(97, 97, 97);
            }
          }
          .titles{
            font-weight: 600;
            font-size: 12px;
            overflow: hidden;
            margin: 0;
          }
        }
      }
      .goods_list_container2{
        height: auto;
        width: 276.5px;
        margin:10px 12px;
        div{
          position: relative;
          i{
            position: absolute;
            top: 0px;
            right: 0px;
            display: none;
            font-size: 14px;
          }
          &:hover > i{
            display: block;
          }
        }
        .goods_list{
          height: auto;
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
          // padding: 0;
          // margin: 0;
          .goods2{
            width: 130px;
            height: 145px;
            background: #fff;
            margin: 3px 0;
            border-radius: 8px;
            &:nth-child(even){
              margin-left: 13px;
            }
            i{
              position: absolute;
              top: 10px;
              right: 10px;
              display: none;
              font-size: 14px;
            }
            &:hover > i{
              display: block;
            }
            p{
              height: 22px;
              line-height:22px;
              margin: 0;
              font-size: 12px;
              text-align: left;
              text-indent: 5px;
              overflow: hidden;
              span{
                color: #E60039;
              }
              .linePrice{
                text-decoration: line-through;
                color: rgb(97, 97, 97);
              }
            }
            .titles{
              font-weight: 600;
              font-size: 11px;
              margin: 0;
            }
            .goods_list_imgs{
              width: 130px;
              height: 95px;
              border-radius: 8px 8px 0 0;
            }
          }
        }
      }
      .goods_list_container3{
        height: auto;
        width: 276px;
        margin:10px 12px;
        div{
          position: relative;
          i{
            position: absolute;
            top: 0px;
            right: 0px;
            display: none;
            font-size: 14px;
          }
          &:hover > i{
            display: block;
          }
        }
        .goods_list{
          // height: 106px;
          height: auto;
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          // justify-content: space-between;
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
          .goods2{
            width: 31.5%;
            height: 105px;
            border-radius: 8px;
            background: #fff;
            margin: 5px 0;
            &:nth-child(3n+2){
              margin:5px 7.5px;
            }
            .goods_list_imgs{
              width: 100%;
              height: 62px;
              border-radius: 8px 8px 0 0;
            }
            i{
              position: absolute;
              top: 10px;
              right: 10px;
              display: none;
              font-size: 14px;
            }
            &:hover > i{
              display: block;
            }
            p{
              height: 18px;
              line-height:18px;
              margin: 0;
              font-size: 11px;
              text-align: left;
              text-indent: 3px;
              overflow: hidden;
              .linePrice{
                text-decoration: line-through;
                color: rgb(97, 97, 97);
                
              }
              span{
                color: #E60039;
              }
            }
            .titles{
              font-weight: 600;
              font-size: 11.5px;
              margin:2px 0;
            }
          }
        }
      }
      .tinymce_left{
        width: 296px;
        height: auto;
        margin:10px 0;
        min-height: 120px;
        font-size: 12px;
        border: 1px solid gainsboro;
        // margin: 3px 0;
        position: relative;
        overflow: auto;
        p{
          font-size: 12px;
          width: 98.5%;
          height: 100%;
          text-indent: 5px;
        }
        img{
          max-width: 100%;
          // height: 90px;
        }
        i{
          position: absolute;
          top: 3px;
          right: 3px;
          zoom: 1.2;
          display: none;

        }
        &:hover > i{
          display: block;
        }
        video{
          width: 100%;
          height: 100%;
        }
      }
      .active{
        border: 1.5px solid rgb(255, 8, 8);
      }
    }
  }
  .right_container{
    text-align: center;
    height: auto;
    // width: 100%;
    margin-left: 30px;
    .right_contents{
      height: auto;
      .title_right{
        .avatar{
          height: 110px;
        }
      }
      .tinymce_right{
        width: 750px;
        .tinymce_right_content{
          margin-top: 20px;
          width: 650px;
        }
      }
      .banner_right{
        width: 700px;
        height: 450px;
        overflow: auto;
        margin: 20px 0 240px 0;
        border-radius: 5px;
        padding:5px 0 10px 0;
        .banner_right_content{
          margin: 6px 0;
          border: 1px solid lightgray;
          .banner_right_item{
            height: 35px;
            line-height: 35px;
          }
          .banner_right_img{
            height: 75px;
            line-height: 75px;
            margin:12px 0;
          }
        }
      }
      .goods_right{
        width: 720px;
        height: auto;
        margin: 20px 0 400px 0;
        border-radius: 5px;
        .goods_right_content{
          height: auto;
          margin: 4px 0;
          border: 1px solid lightgray;
          overflow: hidden;
          .goods_right_item{
            height: 34px;
            line-height: 34px;
          }
          .goods_right_img{
            height: 90px;
            line-height: 90px;
            margin: 4px 0;
          }
        }
      }
      .goods_right_active{
        max-height: 620px;
        overflow: auto;
      }
      .goods_title_right{
        margin: 10px 0;
        height: 30px;
        line-height: 30px;
      }
    }
    .avatar {
      width: 100%;
      height: 80px;
      display: block;
    }
  }
  .app_bottom{
    position: fixed;
    right: 20px;
    bottom: 40px;
    text-align: center;
  }
  .left_bottom{
    // width: 100%;
    height: 200px;
    margin-top: 40px;
  }
}
</style>

<style lang="scss">
//弹窗选中底色加深
.right_content{
  .el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: #ebf2fd;
  }
  .el-table__body tr.current-row>td{
    background: #d7e6fb;
  }
}
</style>
<template>
  <div class="app_container">
    <el-col :span="24" class="title-header">
      <el-col :span="6" style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
        &nbsp;&nbsp;<em>{{questionaireInfo.title}}</em>
      </el-col>
      <el-col justify="center" :span="10" :offset="3">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><b @click="activeName='first'" :class="{ 'activeNameClass': activeName == 'first' }">编辑项目</b></el-breadcrumb-item>
          <el-breadcrumb-item><b @click="goSecond()" :class="{ 'activeNameClass': activeName == 'second' }">发布项目</b></el-breadcrumb-item>
          <el-breadcrumb-item><b @click="goData()">统计报表</b></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-col>
    <el-col :span="24" class="title-content title-content1" v-if="activeName=='first'">
      <el-col :span="4" class="left_menu" id="left_menu">
        <el-col :span="23" :offset="3">
          <el-col :span="22" class="left_menu_list">
            <h5>选择题</h5>
            <p @mouseenter="Hover1 = true" @mouseleave="Hover1 = false">
              <el-button plain size="mini" @click="danxuanCom()" :disabled="canEdit">单选题</el-button>
            </p>
            <p @mouseenter="Hover2 = true" @mouseleave="Hover2 = false">
              <el-button plain size="mini" @click="duoxuanCom()" :disabled="canEdit">多选题</el-button>
            </p>
          </el-col>
          <el-col :span="22" class="left_menu_list">
            <h5>填空题</h5>
            <p @mouseenter="Hover3 = true" @mouseleave="Hover3 = false">
              <el-button plain size="mini" @click="tiankongCom()" :disabled="canEdit">填空题</el-button>
            </p>
          </el-col>
          <el-col :span="22" class="left_menu_list">
            <h5>打分排序</h5>
            <p @mouseenter="Hover4 = true" @mouseleave="Hover4 = false">
              <el-button plain size="mini" @click="pingfenCom()" :disabled="canEdit">评分题</el-button>
            </p>
          </el-col>
        </el-col>
      </el-col>
      <el-col :span="16" class="center_menu" ref="centeMenu">
        <el-col class="center_menu_content">
          <el-col class="Hover1 hoverShow" :span="16" v-if="Hover1">
            <b></b>
            <img src="@/assets/images/danxuan.png" alt="" width="100%" height="100%">
          </el-col>
          <el-col class="Hover2 hoverShow" :span="16" v-if="Hover2">
            <b></b>
            <img src="@/assets/images/duoxuan.png" alt="" width="100%" height="100%">
          </el-col>
          <el-col class="Hover3 hoverShow" :span="16" v-if="Hover3">
            <b></b>
            <img src="@/assets/images/tiankong.png" alt="" width="100%" height="100%">
          </el-col>
          <el-col class="Hover4 hoverShow" :span="16" v-if="Hover4">
            <b></b>
            <img src="@/assets/images/dafen.png" alt="" width="100%" height="100%">
          </el-col>
          <el-col class="questionCom questionTitle">
            <el-col :span="14" class="questionnaireName">
              <el-input v-model.trim="questionaireInfo.title" size="small" clearable placeholder="请输入问卷标题" :disabled="canEdit"></el-input>
            </el-col>
            <el-col :span="24">
              <el-input v-model.trim="questionaireInfo.intro" size="small" clearable placeholder="请输入副标题" :disabled="canEdit"></el-input>
            </el-col>
          </el-col>
          <el-col class="questionCom questionContent" :span="24" :class="{ questionContentBorder: this.componentList.length < 1 }">
            <b v-if="!componentList.length">点击左侧题型组件可加入此区域</b>
            <draggable v-model="componentList" @start="drag=true" @end="drag=false" :move="getdata" @update="datadragEnd" :disabled="canEdit">
              <el-col v-for="(element,index) in componentList" :key="element.index">
                <!-- 单选题 -->
                <div v-if='element.componentInfo.component_type == "1"' @click="danxuanQuestion(index)" class="Question danxuanQuestion" ref="centeMenu">
                  <el-form ref="form" :model="form" class="form-wrap" label-width="50px">
                    <el-form-item align="left" :label="(index+1)+'.'">
                      <el-col :span="24">
                        <el-col :span="14">
                          <el-input v-model.trim="element.componentInfo.component_name" size="small" clearable :disabled="canEdit"></el-input>
                        </el-col>
                        <el-col :span="3" :offset="7">
                          <i class="el-icon-rank" title="长按题目拖拽" v-if="!canEdit"></i>
                          <i class="el-icon-tickets" @click="copyQuestion(index)" title="复制此题" v-if="!canEdit"></i>
                          <i class="el-icon-delete" @click="delQuestion(index)" title="删除此题" v-if="!canEdit"></i>
                        </el-col>
                      </el-col>
                      <el-col :span="23" class="answerList">
                        <el-radio-group>
                          <el-col :span="element.componentInfo.style_type == '1' ? 22 : (element.componentInfo.style_type == '2' ? 10 : 6)" 
                          v-for="(item,index2) in element.optionList" :key="item.index" >
                            <el-radio :label="item.option_sort">
                              <el-input v-model.trim="item.option_name" size="small" clearable :disabled="canEdit"
                                :class="{ otherOption: item.show_type == '2' }"></el-input>
                              <el-input v-if="item.show_type == '2'" size="small" disabled
                                :class="{ otherOption: item.show_type == '2' }"></el-input>
                              <i class="el-icon-error" @click="delOption(index,index2)" v-if="!canEdit"></i>
                              <span v-if="item.option_img_url && canEdit">
                                <br><img :src="item.option_img_url" id="uploaddemo4" width="100" height="100">
                              </span>
                              <el-upload
                                :class="{ uploaddemo1:item.option_img_url,uploaddemo2:!item.option_img_url }"
                                :action="host"
                                :show-file-list="false"
                                :on-success="(response, file, fileList)=>handleAvatarSuccess(response, file, fileList, index, index2)"
                                :before-upload="beforeAvatarUpload"
                                list-type="picture" v-if="!canEdit">
                                <img v-if="item.option_img_url" :src="item.option_img_url" class="avatar" width="100" height="100">
                                <i class="el-icon-picture" v-if="item.show_type != '2' && !item.option_img_url"></i>
                                <i class="el-icon-remove" title="删除此照片" v-if="item.option_img_url" @click.stop="delPhoto(index,index2)"></i>
                              </el-upload>
                            </el-radio>
                          </el-col>
                        </el-radio-group>
                      </el-col>
                      <el-col :span="15" :offset="7" class='addOptions'>
                        <el-button size="small" :disabled="canEdit" type="text" @click="addOption(index)">+添加单个选项</el-button>
                        <el-button size="small" :disabled="canEdit" type="text" @click="showOptions = !showOptions">+批量添加选项</el-button>

                        <!-- <el-col :span="15" v-if="showOptions[index]" class="showOptions">
                          <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" size='small'>
                            <el-form-item label="选项内容" v-for="option of options" :key="option.index">
                              <el-input v-model.trim="option.option_name"></el-input>
                            </el-form-item>
                            <el-form-item>
                              <el-button type="primary" @click="addOptions(index)">添加</el-button>
                              <el-button @click="cancelAddOptions(index)">取消</el-button>
                            </el-form-item>
                          </el-form>
                        </el-col> -->

                        <el-button size="small" :disabled="canEdit" type="text" @click="addOtherOption(index)" >+添加[其他]项</el-button>
                      </el-col>
                    </el-form-item>
                  </el-form>
                </div>
                <!-- 多选题 -->
                <div v-if='element.componentInfo.component_type == "2"' @click="duoxuanQuestion(index)" class="Question duoxuanQuestion">
                  <el-form ref="form" :model="form" class="form-wrap" label-width="50px">
                    <el-form-item align="left" :label="(index+1)+'.'">
                      <el-col :span="24">
                        <el-col :span="14">
                          <el-input v-model.trim="element.componentInfo.component_name" size="small" clearable :disabled="canEdit"></el-input>
                        </el-col>
                        <el-col :span="3" :offset="7">
                          <i class="el-icon-rank" title="长按题目拖拽" v-if="!canEdit"></i>
                          <i class="el-icon-tickets" @click="copyQuestion(index)" title="复制此题" v-if="!canEdit"></i>
                          <i class="el-icon-delete" @click="delQuestion(index)" title="删除此题" v-if="!canEdit"></i>
                        </el-col>
                      </el-col>
                      <el-col :span="23" class="answerList">
                        <!-- <el-checkbox-group> -->
                          <el-col :span="element.componentInfo.style_type == '1' ? 22 : (element.componentInfo.style_type == '2' ? 10 : 6)" 
                            v-for="(item,index2) in element.optionList" :key="item.index" :disabled="canEdit"
                            :class="{ uploaddemo3:item.option_img_url }">
                            <el-checkbox :label="item.show_type">
                              <el-input v-model.trim="item.option_name" size="small" clearable :disabled="canEdit"
                                :class="{ otherOption: item.show_type == '2' }"></el-input>
                              <el-input v-if="item.show_type == '2'" size="small" disabled
                                :class="{ otherOption: item.show_type == '2' }"></el-input>
                              <i class="el-icon-error" @click="delOption(index,index2)" v-if="!canEdit"></i>
                              <span v-if="item.option_img_url && canEdit">
                                <br><img :src="item.option_img_url" id="uploaddemo5" width="100" height="100">
                              </span>
                              <el-upload
                                list-type="picture"
                                :class="{ uploaddemo1:item.option_img_url,uploaddemo2:!item.option_img_url }"
                                :action="host"
                                :show-file-list="false"
                                :on-success="(response, file, fileList)=>handleAvatarSuccess(response, file, fileList, index, index2)"
                                :before-upload="beforeAvatarUpload" v-if="!canEdit">
                                <img v-if="item.option_img_url" :src="item.option_img_url" class="avatar" width="100" height="100">
                                <i class="el-icon-picture" v-if="item.show_type != '2' && !item.option_img_url"></i>
                                <i class="el-icon-remove" title="删除此照片" v-if="item.option_img_url" @click.stop="delPhoto(index,index2)"></i>
                              </el-upload>
                            </el-checkbox>
                          </el-col>
                        <!-- </el-checkbox-group> -->
                      </el-col>
                      <el-col :span="15" :offset="7" class='addOptions'>
                        <el-button size="small" :disabled="canEdit" type="text" @click="addOption2(index)">+添加单个选项</el-button>
                        <!-- <el-popover
                          placement="top"
                          width="550"
                          v-model="visible2"
                          trigger="click">
                          <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" size='small'>
                            <el-form-item label="选项内容" v-for="option in options" :key="option.index">
                              <el-input v-model.trim="option.option_name"></el-input>
                            </el-form-item>
                            <el-form-item>
                              <el-button type="primary" @click="addOptions2()">添加</el-button>
                              <el-button @click="cancelAddOptions2()">取消</el-button>
                            </el-form-item>
                          </el-form>
                          <el-button size="small" type="text" slot="reference">+批量添加选项</el-button>
                        </el-popover> -->
                        <el-button size="small" :disabled="canEdit" type="text" @click="showOptions2 = !showOptions2">+批量添加选项</el-button>
                        <el-button size="small" :disabled="canEdit" type="text" @click="addOtherOption2(index)">+添加[其他]项</el-button>
                      </el-col>
                    </el-form-item>
                  </el-form>
                </div>
                <!-- 填空题 -->
                <div :span="24" v-if='element.componentInfo.component_type == "3"' @click="tiankongQuestion(index)" class="Question tiankongQuestion">
                  <el-form ref="form" :model="form" class="form-wrap" label-width="55px">
                    <el-form-item align="left" :label="(index+1)+'.'">
                      <el-col :span="14">
                        <el-input v-model.trim="element.componentInfo.component_name" size="small" clearable :disabled="canEdit"></el-input>
                      </el-col>
                      <el-col :span="3" :offset="7">
                        <i class="el-icon-rank" title="长按题目拖拽" v-if="!canEdit"></i>
                        <i class="el-icon-tickets" @click="copyQuestion(index)" title="复制此题" v-if="!canEdit"></i>
                        <i class="el-icon-delete" @click="delQuestion(index)" title="删除此题" v-if="!canEdit"></i>
                      </el-col>
                      <el-col :span="22">
                        <el-input type="textarea" :rows="element.componentInfo.size_style" size="small" disabled></el-input>
                      </el-col>
                    </el-form-item>
                  </el-form>
                </div>
                <!-- 评分题 -->
                <div :span="24" v-if='element.componentInfo.component_type == "4"' @click="pingfenQuestion(index)" 
                class="Question pingfenQuestion">
                  <el-form ref="form" :model="form" class="form-wrap" label-width="55px">
                    <el-form-item align="left" :label="(index+1)+'.'">
                      <el-col :span="14">
                        <el-input v-model.trim="element.componentInfo.component_name" size="small" clearable :disabled="canEdit"></el-input>
                      </el-col>
                      <el-col :span="3" :offset="7">
                        <i class="el-icon-rank" title="长按题目拖拽" v-if="!canEdit"></i>
                        <i class="el-icon-tickets" @click="copyQuestion(index)" title="复制此题" v-if="!canEdit"></i>
                        <i class="el-icon-delete" @click="delQuestion(index)" title="删除此题" v-if="!canEdit"></i>
                      </el-col>
                      <el-col :span="18">
                        <el-rate disabled></el-rate>
                      </el-col>
                    </el-form-item>
                  </el-form>
                </div>

                <el-col v-if="showOptions" class="showOptions" 
                :class="{ 'showOptionsShadow1':componentList.length > 4, 'showOptionsShadow2':componentList.length > 8,'showOptionsShadow3':componentList.length > 15 }">
                  <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" size='small'>
                    <el-form-item label="选项内容" v-for="option of options" :key="option.index">
                      <el-input v-model.trim="option.option_name"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="addOptions(index)">添加</el-button>
                      <el-button @click="cancelAddOptions()">取消</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-col v-if="showOptions2" class="showOptions" >
                  <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" size='small'>
                    <el-form-item label="选项内容" v-for="option of options" :key="option.index">
                      <el-input v-model.trim="option.option_name"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="addOptions2(index)">添加</el-button>
                      <el-button @click="cancelAddOptions2()">取消</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>

              </el-col>
            </draggable>
          </el-col>

          <el-col class="questionCom questionTypes">
            <el-col :span="24" class="questionTypes_item1">
              <span>*选择调研类型:</span>
              <el-radio v-model="questionaireInfo.questionnaire_type" label="1">训练营</el-radio>
              <el-radio v-model="questionaireInfo.questionnaire_type" label="2">其他</el-radio>
            </el-col>

            <el-col :span="24" class="questionTypes_item1" v-if="questionaireInfo.questionnaire_type == '1'">
              <span>*选择调研目的:</span>
              <el-radio v-model="questionaireInfo.questionnaire_purpose" label="1">开营摸底</el-radio>
              <el-radio v-model="questionaireInfo.questionnaire_purpose" label="2">结营满意度</el-radio>
            </el-col>

            <el-col :span="24" class="questionTypes_item2" v-if="questionaireInfo.questionnaire_type == '1'">
              <span>*选择调研的训练营和群:</span>
              <el-col class="questionTypes_item2_content1">
                <el-col :span="4">
                  <el-select v-model="goods_info" filterable remote reserve-keyword clearable @change="changeGoods" 
                    placeholder="搜索或选择商品"  :remote-method="remoteMethod" :loading="loading" size="small">
                    <el-option
                      v-for="item in goodsList"
                      :key="item.item_id"
                      :label="item.item_name"
                      :value="item.item_id+'_'+item.item_name">
                    </el-option>
                  </el-select>
                </el-col>

                <el-col :span="4">
                  <el-select v-model="listQuery.status1" placeholder="请选择一级规格" @change="changeSkus1" size="small">
                    <el-option
                      v-for="item in options1"
                      :key="item.sku1_vid"
                      :label="item.sku1_v"
                      :value="item.sku1_kid+'_'+item.sku1_k+'&'+item.sku1_vid+'_'+item.sku1_v+'&'+item.sku_unique_code+'&'+item.sku_id">
                    </el-option>
                  </el-select>
                </el-col>

                <el-col :span="4">
                  <el-select v-model="listQuery.status4" filterable remote clearable reserve-keyword @change="changeSkus4"
                    placeholder="搜索或选择营期"  :remote-method="remoteMethod2" :loading="loading2" size="small">
                    <el-option
                      v-for="item in options4" 
                      :key="item.index" 
                      :label="item.label" 
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="1">
                  <el-button type="primary" size="small" @click="addGoodsItem()">添加</el-button>
                </el-col>
              </el-col>
              <el-col class="questionTypes_item2_content2" v-if="goodsList2.length">
                <p>已选择：</p>
                <ul>
                  <li v-for="(item,index) in goodsList2" :key="item.index">
                    <!-- <em>{{ item.goods_name }}</em> -->
                    <!-- <em>{{ item.sku1_v }}</em> -->
                    <!-- <em>&nbsp;{{ item.sku2_v }}</em> -->
                    <!-- <em>&nbsp;{{ item.sku3_v }}</em> -->
                    <!-- <em>{{ item.chatroom_name }}</em> -->
                    <!-- <em v-if="item.chatroom_cnt>=0">({{ item.chatroom_cnt }}人)</em> -->

                    <el-tooltip :content="item.goods_name" placement="top" effect="light">
                      <em>{{ item.goods_name }}</em>
                    </el-tooltip>
                    <el-tooltip :content="item.sku1_v" placement="top" effect="light">
                      <em>{{ item.sku1_v }}</em>
                    </el-tooltip>
                    <el-tooltip :content="item.chatroom_name" placement="top" effect="light">
                      <em>{{ item.chatroom_name }}</em>
                    </el-tooltip>
                    <em v-if="item.chatroom_cnt>=0">({{ item.chatroom_cnt }}人)</em>
                    <i class="el-icon-circle-close" @click="delGoodsItem(index)"></i>
                  </li>
                </ul>
              </el-col>
            </el-col>
            <el-col :span="24" class="questionTypes_item3" v-else>
              <i>问卷对象非通过H5商城支付并入群用户，可选择其他类型。其他类型无调研目标人数</i>
            </el-col>

            <el-col :span="24" class="questionTypes_item4">
              <span>*是否开启分享:</span>
              <el-radio v-model="questionaireInfo.is_open_share" label="2" @change="openShare(true)">关闭</el-radio>
              <el-radio v-model="questionaireInfo.is_open_share" label="1">开启</el-radio>
            </el-col>

            <el-col :span="24" class="questionTypes_item5" v-if="questionaireInfo.is_open_share == '1'">
              <span>*选择要分享的商品:</span>
              <el-select v-model="questionaireInfo.goods_id" filterable remote reserve-keyword clearable 
                placeholder="搜索或选择商品"  :remote-method="remoteMethod" :loading="loading" size="small"
                @change="changeGoods2">
                <el-option
                  v-for="item in goodsList"
                  :key="item.item_id"
                  :label="item.item_name"
                  :value="item.item_id">
                </el-option>
              </el-select>
            </el-col>

            <el-col :span="24" class="questionTypes_item6" v-if="questionaireInfo.is_open_share == '1'">
              <el-col :span="4">
                <span>*填写寄语内容:</span>
              </el-col>
              <el-col :span="12">
                <el-input type="textarea" maxlength="60" show-word-limit :rows="3" placeholder="请输入寄语内容(不超过60字)" 
                v-model.trim="questionaireInfo.default_message"></el-input>
              </el-col>
            </el-col>
          </el-col>

          <el-col class="questionCom questionRemarks">
            <el-col :span="24">
              <el-input v-model.trim="questionaireInfo.remarks" placeholder="请输入备注内容" clearable size="small" :disabled="canEdit"></el-input>
            </el-col>
          </el-col>
          <el-col class="questionCom questionEndButton">
            <el-col :span="13">
              <el-select v-model="optionValue" size="small" class="questionComInfo" :disabled="canEdit">
                <el-option
                  v-for="item in items"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>&nbsp;时显示
              <el-input v-model.trim="questionaireInfo.success_tips" placeholder="请输入提示内容" clearable size="small" :disabled="canEdit"></el-input>
            </el-col>
            <el-col :span="5">
              <el-button plain size="small" @click="questionaireConfirm('1')" :disabled="questionaireEdit == '0'">存到草稿</el-button>
              <el-button type="primary" size="small" @click="questionaireConfirm('2')">&nbsp;&nbsp;发&nbsp;&nbsp;布&nbsp;&nbsp;</el-button>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
      <el-col :span="4" class="right_menu">
        <el-col :span="22" :offset="2" v-if='componentList[questionComIndex]'>
          <p>Q{{questionComIndex+1}}题目设置</p>
          <h5>整题设置</h5>
        </el-col>
        <el-col :span="22" :offset="2" v-if='componentList[questionComIndex]'>
          此题必答
          <el-switch
            v-model="componentList[questionComIndex].componentInfo.is_must_answer"
            active-color="#13ce66"
            inactive-color="#ff4949" :disabled="canEdit">
          </el-switch>
        </el-col>
        <el-col :span="22" :offset="2" v-if="componentList[questionComIndex] && componentList[questionComIndex].componentInfo.style_type">
          <p>题型</p>
          <el-radio-group v-model="componentList[questionComIndex].componentInfo.component_type" size="mini" :disabled="canEdit">
            <el-radio-button label="1">单选</el-radio-button>
            <el-radio-button label="2">多选</el-radio-button>
          </el-radio-group>
          <br>
          <el-col class="selectRange" v-if="componentList[questionComIndex].componentInfo.component_type=='2'">
            <el-col :span="16">
              <el-col :span="6">
                <span class="selectRange1">最少</span>
              </el-col>
              <el-col :span="14">
                <el-select v-model="componentList[questionComIndex].componentInfo.low_select_limit" size="mini" class="selectRange2">
                  <el-option
                    v-for="item in Rangeoptions1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
            <br>
            <!-- <el-col :span="16">
              <el-col :span="6">
                <span>最多</span>
              </el-col>
              <el-col :span="14">
                <el-select v-model="componentList[questionComIndex].componentInfo.high_select_limit" size="mini">
                  <el-option
                    v-for="item in Rangeoptions2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-col> -->
          </el-col>
        </el-col>
        <el-col :span="22" :offset="2" v-if="componentList[questionComIndex] && componentList[questionComIndex].componentInfo.style_type">
          <p>布局</p>
          <el-radio-group v-model="componentList[questionComIndex].componentInfo.style_type" size="mini" :disabled="canEdit">
            <el-radio-button label="1"><span @click="layout = 23">单列</span></el-radio-button>
            <el-radio-button label="2" disabled><span @click="layout = 10">两列</span></el-radio-button>
            <el-radio-button label="3" disabled><span @click="layout = 6">三列</span></el-radio-button>
          </el-radio-group>
        </el-col>
        <!-- <el-col :span="22" :offset="2" v-if="componentList[questionComIndex] && componentList[questionComIndex].componentInfo.size_style">
          <p>布局</p>
          <el-radio-group v-model="componentList[questionComIndex].componentInfo.size_style" size="mini">
            <el-radio-button label="1">小</el-radio-button>
            <el-radio-button label="2">中</el-radio-button>
            <el-radio-button label="3">大</el-radio-button>
          </el-radio-group>
        </el-col> -->
      </el-col>
    </el-col>
    <el-col :span="24" class="title-content title-content2" v-if="activeName=='second'">
      <el-col class="title-content2-main2">
        <h4>分享设置(目前仅支持小程序分享)</h4>
        <el-row class="title-content2-main2-content">
          <el-col :span="11" class="left_share">
            <el-col :span="20">
              <h5>自定义图标</h5>
              <el-col :span="6">
                <el-upload
                  class="avatar-uploader"
                  :action="host"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess2"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="questionaireInfo.wx_share_pic" :src="questionaireInfo.wx_share_pic" class="avatar" width='78'>
                  <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
                </el-upload>
              </el-col>
              <el-col :span="15" class="left_share_right">
                <p>上传图片</p>
                <span>建议上传 300x240px 的png/jpg图片</span>
              </el-col>
            </el-col>
            <el-col :span="20">
              <h5>微信分享标题</h5>
              <el-col :span="24">
                <el-input v-model.trim="questionaireInfo.wx_share_title" placeholder="请输入微信分享标题" size="small"></el-input>
              </el-col>
            </el-col>
            <el-col :span="20">
              <h5>微信分享描述</h5>
              <el-col :span="24">
                <el-input type="textarea" :rows="3" placeholder="请输入微信分享描述" v-model.trim="questionaireInfo.wx_share_intro"></el-input>
              </el-col>
            </el-col>
          </el-col>
          <el-col :span="10" class="right_share" :offset="1">
            <el-col class="right_share_top">
              <h5><span>好友分享预览</span></h5>
              <el-col :span="23" class="right_share_top_content">
                <p>
                  <span>{{questionaireInfo.wx_share_title}}</span>
                  <img :src="questionaireInfo.wx_share_pic" alt="" width="35" height="35" v-if="questionaireInfo.wx_share_pic">
                  <b></b>
                  <img src="@/assets/images/zhima.png" alt="" id="zhima1">
                </p>
              </el-col>
            </el-col>
            <el-col class="right_share_bot">
              <h5><span>朋友圈分享预览</span></h5>
              <el-col :span="23" class="right_share_bot_content">
                <span>微信昵称示例</span>
                <img src="@/assets/images/zhima.png" alt="" id="zhima2">
                <p>
                  <img :src="questionaireInfo.wx_share_pic" alt="" width="35" height="35" v-if="questionaireInfo.wx_share_pic"> {{questionaireInfo.wx_share_title}}
                </p>
              </el-col>
            </el-col>
          </el-col>
        </el-row>
      </el-col>
      <el-col class="title-content2-main3">
        <el-button type="primary" size="small" @click="submitShares()">保存并提交</el-button>
      </el-col>
      
    </el-col>
    <el-col :span="24" class="title-content title-content3" v-if="activeName=='third'">
    </el-col>
  </div>
</template>

<script>
import { getQuestionnaireList,insertQuestionaire,updateQuestionnaire,saveShareConfig,getQuestionnaire,getItemInfo,updateQuestionnaireSpec } from "@/api/growthCamp";
import { getItemList,getGoodsDetail,getChatroomData } from "@/api/shopGoods";
import Pagination from '@/components/Pagination';
import draggable from 'vuedraggable';

export default {
  name:'',
  components: { Pagination,draggable },
  data(){
    return{
      //题目区
      activeName:'first',
      questionaireInfo:{
        title:'',
        intro:'感谢您抽出时间参与本次答题，现在我们就马上开始吧！',
        remarks:'【备注】此项用户端不显示，仅后台可显示；用途或区分独特性的文字说明。',
        status:'1',
        success_tips:"您已完成本次问卷，感谢您的支持与帮助！",
        questionnaire_code:'',
        wx_share_pic:'https://small-programs.oss-cn-beijing.aliyuncs.com/programs/20200317105657.jpg',
        wx_share_title:'',
        wx_share_intro:'',
        questionnaire_type: '1',
        questionnaire_purpose: '',
        is_open_share: '2',
        default_message: '',
        goods_id: '',
        goods_name: '',
      },
      questionComIndex: 0,
      layout: 22,
      items: [
        {
          value: '1',
          label: '正常完成时显示'
        }
      ],
      optionValue:'1',
      componentList:[],
      form: {
        name: '',
        type: [],
        desc: ''
      },
      form: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
      },
      Rangeoptions2:[
        {
          value: '0',
          label: '不限'
        },
        {
          value: '3',
          label: '3'
        },
        {
          value: '4',
          label: '4'
        },
        {
          value: '5',
          label: '5'
        }
      ],
      Rangeoptions1:[
        {
          value: '0',
          label: '不限'
        },
      ],
      fileList:[],
      host:'',
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      options:[
        {
          "option_name": "",
          "option_sort": "2",
          "show_type": "1",
          "option_img_url":""
        },
        {
          "option_name": "",
          "option_sort": "2",
          "show_type": "1",
          "option_img_url":""
        },
        {
          "option_name": "",
          "option_sort": "2",
          "show_type": "1",
          "option_img_url":""
        }
      ],
      visible: false,
      visible2: false,
      questionaireEdit: null,
      Hover1: false,
      Hover2: false,
      Hover3: false,
      Hover4: false,
      showOptions: false,
      showOptions2: false,
      

      //分享区
      questionnaire_code:'',
      wx_share_pic:'https://poster-share.oss-cn-beijing.aliyuncs.com/poster/ZMWHF2601AA7FA0C42B2E65A2AA4ABE253EE.jpg',
      wx_share_title:'我是问卷标题',
      wx_share_intro:'我是分享描述',
      loading: false,
      loading2: false,
      goods_info: null,
      item_id: '',
      listQuery:{
        status1: '',
        status2: '',
        status3: '',
        status4: '',
      },
      goodsData: {
        page_no: 1,
        page_size: 999,
        item_name:''
      },
      tempSku:'',
      goodsList: [],
      options1: [],
      options4: [],
      options5: [],
      goodsList2: [],
      tempData: [],
      canEdit: false,
      isAllChatroomData: false
    }
  },
  created(){
    this.questionnaire_code = this.$route.params.id.split('&')[0];
    this.activeName = this.$route.params.id.split('&')[1] || 'first';
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    this.questionaireEdit = sessionStorage.getItem('questionaireEdit');
    this.canEdit = this.questionaireEdit<1?true:false;

    //复制操作
    this.questionaireCopy = sessionStorage.getItem('questionaireCopy') || null;
    if(this.questionnaire_code.indexOf('new')<0){
      this.getQuestionnaire();
    }
    this.getItemList();
  },
  methods:{
    goData(){
      let code = this.questionnaire_code;
      this.$router.push({ path: `../data/${code}` });
    },
    danxuanQuestion(i){
      this.questionComIndex = i;
    },
    danxuanCom(){
      this.componentList.push(
        {
          "componentInfo": {
            "component_type": "1",
            'component_name':'',
            "is_must_answer": true,
            "low_select_limit": '0',
            "high_select_limit": '0',
            "style_type": "1",
          },
          "optionList": [
            {
              "option_name": "",
              "option_sort": "1",
              "show_type": "1",
              "option_img_url":""
            },
            {
              "option_name": "",
              "option_sort": "2",
              "show_type": "1",
              "option_img_url":""
            }
          ]
        },
      )
      this.questionComIndex = this.componentList.length-1;
    },
    delQuestion(i){
      this.componentList.splice(i,1)
    },
    copyQuestion(i){
      let data = JSON.parse(JSON.stringify(this.componentList[i]));
      this.componentList.splice(i,0,data);
    },
    addOption(i){
      this.componentList[i].optionList.push(
        {
          "option_name": "",
          "option_img_url": "",
          "option_sort": "3",
          "show_type": "1",
        }
      )
    },
    addOtherOption(i){
      this.componentList[i].optionList.push(
        {
          "option_name": "其他",
          "option_img_url": "",
          "show_type": "2",
          "option_sort": "4",
        }
      )
    },
    delOption(i,j){
      this.componentList[i].optionList.splice(j,1)
    },
    delPhoto(i,j){
      this.componentList[i].optionList[j].option_img_url = '';
    },
    addOptions(i){
      this.showOptions = false;
      // this.showOptions2 = false;
      this.options.forEach( v => {
        if(v.option_name){
          this.componentList[this.questionComIndex].optionList.push(v)
        }
      })
      this.options = [
        {
          "option_name": "",
          "option_sort": "2",
          "show_type": "1",
          "option_img_url":""
        },
        {
          "option_name": "",
          "option_sort": "2",
          "show_type": "1",
          "option_img_url":""
        },
        {
          "option_name": "",
          "option_sort": "2",
          "show_type": "1",
          "option_img_url":""
        }
      ]
    },
    cancelAddOptions(i){
      this.showOptions = false;
      this.options.forEach( v => {
        v.option_name = ''
      })
    },
    duoxuanQuestion(i){
      this.Rangeoptions1 = [
        {
          value: '0',
          label: '不限'
        },
      ]
      this.questionComIndex = i;
      if(this.componentList[i].optionList.length + 1 != this.Rangeoptions1.length){
        for (let n = 0; n < this.componentList[i].optionList.length; n++) {
          this.Rangeoptions1.push(
            {
              value: (n+1).toString(),
              label: (n+1).toString()
            }
          )
        }
      }
    },
    duoxuanCom(){
      this.componentList.push(
        {
          "componentInfo": {
            "component_type": "2",
            'component_name':'',
            "is_must_answer": true,
            "low_select_limit": '0',
            "high_select_limit": '0',
            "style_type": "1",
          },
          "optionList": [
            {
              "option_name": "",
              "option_sort": "1",
              "show_type": "1",
              "option_img_url":""
            },
            {
              "option_name": "",
              "option_sort": "2",
              "show_type": "1",
              "option_img_url":""
            }
          ]
        }
      )
      this.questionComIndex = this.componentList.length-1;
      this.Rangeoptions1 = [
        {
          value: '0',
          label: '不限'
        },
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
      ]
    },
    addOption2(i){
      this.componentList[i].optionList.push(
        {
          "option_name": "",
          "option_img_url": "",
          "option_sort": "3",
          "show_type": "1",
        }
      )
      this.Rangeoptions1.push(
        {
          value: this.componentList[i].optionList.length,
          label: this.componentList[i].optionList.length
        }
      )
    },
    addOtherOption2(i){
      this.componentList[i].optionList.push(
        {
          "option_name": "其他",
          "option_img_url": "",
          "show_type": "2",
          "option_sort": "4",
        }
      )
      this.Rangeoptions1.push(
        {
          value: this.componentList[i].optionList.length,
          label: this.componentList[i].optionList.length
        }
      )
    },
    delOption(i,j){
      this.componentList[i].optionList.splice(j,1);
      this.Rangeoptions1.pop();
    },
    addOptions2(){
      this.showOptions2 = false;
      this.options.forEach( v => {
        if(v.option_name){
          this.componentList[this.questionComIndex].optionList.push(v)
        }
      })
      this.options = [
        {
          "option_name": "",
          "option_sort": "2",
          "show_type": "1",
          "option_img_url":""
        },
        {
          "option_name": "",
          "option_sort": "2",
          "show_type": "1",
          "option_img_url":""
        },
        {
          "option_name": "",
          "option_sort": "2",
          "show_type": "1",
          "option_img_url":""
        }
      ]
    },
    cancelAddOptions2(){
      this.showOptions2 = false;
      this.options.forEach( v => {
        v.option_name = ''
      })
    },

    tiankongQuestion(i){
      this.questionComIndex = i;
    },
    tiankongCom(){
      this.componentList.push(
        {
          "componentInfo": {
            "component_type": "3",
            "component_name": "",
            "is_must_answer": true,
            "size_style": "1",
          }
        },
      )
      this.questionComIndex = this.componentList.length-1;
    },

    pingfenQuestion(i){
      this.questionComIndex = i;
    },
    pingfenCom(){
      this.componentList.push(
        {
          "componentInfo": {
            "component_type": "4",
            "is_must_answer": true,
            "component_name": ""
          },
          "optionList":[
            {
              "option_sort": "1",
              "score": "10"
            },
            {
              "option_sort": "2",
              "score": "20"
            },
            {
              "option_sort": "3",
              "score": "30"
            },
            {
              "option_sort": "4",
              "score": "40"
            },
            {
              "option_sort": "5",
              "score": "50"
            }
          ]
        }
      )
      this.questionComIndex = this.componentList.length-1;
    },

    getQuestionnaire(){
      getQuestionnaire({ questionnaire_code: this.questionnaire_code }).then(res => {
        if (res.code == 200) {
          this.questionaireInfo = res.result.questionaireInfo;
          this.componentList = res.result.componentList;
          this.goodsList2 = res.result.questionnaireSpecsList;
          this.componentList.forEach((v,i) => {
            if(this.componentList[i].componentInfo.is_must_answer == '1'){
              this.componentList[i].componentInfo.is_must_answer = true
            }else{
              this.componentList[i].componentInfo.is_must_answer = false
            }
          })
        }
      });
    },
    openShare(v){
      if(v){
        this.questionaireInfo.goods_id = '';
        this.questionaireInfo.goods_name = '';
        this.questionaireInfo.default_message = '';
      }
    },
    questionaireConfirm(key){
      let bool = true;
      if(this.questionaireInfo.intro == '' ){
        bool = false;
        this.$message({
          message: '问卷副标题不能为空，请检查!',
          type: 'warning'
        });
      }else if(this.questionaireInfo.title == '' ){
        bool = false;
        this.$message({
          message: '问卷主标题不能为空，请检查!',
          type: 'warning'
        });
      }else if(this.questionaireInfo.questionnaire_type == '1' && this.questionaireInfo.questionnaire_purpose == '' ){
        bool = false;
        this.$message({
          message: '问卷调研目的不能为空，请检查!',
          type: 'warning'
        });
      }else if(this.questionaireInfo.questionnaire_type == '1' && !this.goodsList2.length){
        bool = false;
        this.$message({
          message: '问卷所调研的群不能为空，请检查!',
          type: 'warning'
        });
      }else if((this.questionaireInfo.is_open_share == '1' && !this.questionaireInfo.goods_id) || 
      (this.questionaireInfo.is_open_share == '1' && !this.questionaireInfo.default_message)){
        bool = false;
        this.$message({
          message: '开启分享后分享商品或寄语内容不能为空，请检查!',
          type: 'warning'
        });
      }else if(bool){
        this.componentList.forEach((v,i)=>{
          if(this.componentList[i].componentInfo.component_name == ''){
            bool = false;
            this.$message({
              message: '第'+(i+1)+'题 题目不能为空，请检查!',
              type: 'warning'
            });
            // return false;
          }else if( this.componentList[i].componentInfo.component_type == '1' || this.componentList[i].componentInfo.component_type == '2'){
            this.componentList[i].optionList.forEach((v,index)=>{
              if( v.option_name == '' && v.option_img_url == '' ){
                bool = false;
                this.$message({
                  message: '第'+(i+1)+'题，第'+(index+1)+'项内容不能为空，请检查!',
                  type: 'warning'
                });
              }
            })
          }
        })

        if(bool){
          let data,componentList = [];
          componentList = JSON.parse(JSON.stringify(this.componentList));
          componentList.forEach( (v,i) => {
            componentList[i].componentInfo.component_sort = i+1;
            if(componentList[i].componentInfo.is_must_answer == true){
              componentList[i].componentInfo.is_must_answer = '1'
            }else{
              componentList[i].componentInfo.is_must_answer = '2'
            }
            if(componentList[i].componentInfo.component_type == '1' || componentList[i].componentInfo.component_type == '2'){
              componentList[i].optionList.forEach( (v,i) => {
                v.option_sort = i+1;
                if(v.option_img_url){
                  v.show_type = '3'
                }else if(v.option_name && v.show_type != '2'){
                  v.show_type = '1'
                }else{
                  v.show_type = '2'
                }
              });
            }
          });

          data = {
            questionaireInfo: this.questionaireInfo,
            componentList: componentList,
            goodsList: this.goodsList2
          }

          data.questionaireInfo.status = key;
          console.log('questionaireConfirm',data);

          if(this.$route.params.id.indexOf('new')<0 && this.questionaireCopy === null){
            if(key == '1'){
              // 编辑存草稿
              updateQuestionnaire(data).then(res => {
                if (res.code == 200) {
                  sessionStorage.setItem('questionaireIndex','second');
                  this.questionaireInfo.questionnaire_code = res.result.questionnaire_code;
                  this.questionaireInfo.wx_share_title = this.questionaireInfo.title;  
                  if(res.result.questionnaire_code){
                    this.submitShares2();
                    setTimeout(() => {
                      this.$router.go(-1)
                    }, 700);
                  }
                }
              });
            }else{
              this.$confirm('保存后将不可进行编辑，确定要执行 "发布" 操作吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // 编辑到发布
                if(this.canEdit){
                  updateQuestionnaireSpec({
                    goodsList: this.goodsList2,
                    questionaireInfo: {
                      questionnaire_code: this.questionaireInfo.questionnaire_code,
                      questionnaire_type: this.questionaireInfo.questionnaire_type,
                      questionnaire_purpose: this.questionaireInfo.questionnaire_purpose,
                      goods_name: this.questionaireInfo.goods_name,
                      goods_id: this.questionaireInfo.goods_id,
                      is_open_share: this.questionaireInfo.is_open_share,
                      default_message: this.questionaireInfo.default_message
                    },
                  }).then(res => {
                    if (res.code == 200) {
                      sessionStorage.setItem('questionaireIndex','first');
                      this.questionaireInfo.wx_share_title = this.questionaireInfo.title;
                      this.submitShares2();
                      // this.activeName = 'second';
                      setTimeout(() => {
                        this.$router.go(-1);
                      }, 700);
                    }
                  });
                }else{
                  updateQuestionnaire(data).then(res => {
                    if (res.code == 200) {
                      sessionStorage.setItem('questionaireIndex','first');
                      this.questionaireInfo.questionnaire_code = res.result.questionnaire_code;
                      this.questionaireInfo.wx_share_title = this.questionaireInfo.title;
                      if(res.result.questionnaire_code){
                        this.submitShares2();
                        this.activeName = 'second';
                      }
                    }
                  });
                }
              })
            }
          }else if(this.$route.params.id.indexOf('new')>0 || 
          (this.$route.params.id.indexOf('new')<0 && this.questionaireCopy === 'true')){
            if(key == '1'){
              // 新增存草稿
              insertQuestionaire(data).then(res => {
                if (res.code == 200) {
                  sessionStorage.setItem('questionaireIndex','second');
                  this.questionaireInfo.questionnaire_code = res.result.questionnaire_code;
                  this.questionaireInfo.wx_share_title = this.questionaireInfo.title;  
                  if(res.result.questionnaire_code){
                    this.submitShares2();
                    setTimeout(() => {
                      this.$router.go(-1)
                    }, 700);
                  }    
                }
              });
            }else{
              this.$confirm('保存后将不可进行编辑，确定要执行 "发布" 操作吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // 新增去发布
                insertQuestionaire(data).then(res => {
                  if (res.code == 200) {
                    sessionStorage.setItem('questionaireIndex','first');
                    this.questionaireInfo.questionnaire_code = res.result.questionnaire_code;
                    this.questionaireInfo.wx_share_title = this.questionaireInfo.title;  
                    if(res.result.questionnaire_code){
                      this.submitShares2();
                      this.activeName = 'second';
                    }                  
                  }
                });
              })
            }
          }

          sessionStorage.removeItem('questionaireCopy', true);
        }
      }
    },
    goSecond(){
      this.activeName = 'second';
    },
    submitShares(){
      let shareData = {
        questionnaire_code: this.questionaireInfo.questionnaire_code,
        wx_share_pic: this.questionaireInfo.wx_share_pic,
        wx_share_title: this.questionaireInfo.wx_share_title,
        wx_share_intro: this.questionaireInfo.wx_share_intro,
      }
      saveShareConfig(shareData).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
          setTimeout(() => {
            this.$router.go(-1)
          }, 600);
        }
      });
    },
    submitShares2(){
      let shareData = {
        questionnaire_code: this.questionaireInfo.questionnaire_code,
        wx_share_pic: this.questionaireInfo.wx_share_pic,
        wx_share_title: this.questionaireInfo.wx_share_title,
        wx_share_intro: this.questionaireInfo.wx_share_intro,
      }
      saveShareConfig(shareData).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
        }
      });
    },
    addGoodsItem(){
      if(this.listQuery.status4 == ''){
        this.$message({
          message: '训练营和群均为必选项，请检查!',
          type: 'warning'
        });
      }else if(this.tempData.indexOf(this.listQuery.status4.split('&')[0]) > -1){
        this.$message({
          message: '该商品所属群已添加，请检查!',
          type: 'warning'
        });
      }else{
        if(this.isAllChatroomData){
          this.options5.forEach(v=>{
            if(v.value != 'allChatroomData'){
              this.goodsList2.push(
                {
                  goods_id: this.goods_info.split('_')[0],
                  goods_name: this.goods_info.split('_')[1],
                  chatroom_code: v.value.split('&')[0],
                  chatroom_name: v.label,
                  // chatroom_cnt: v.value.split('&')[2]=='null'?0:v.value.split('&')[2],

                  sku1_kid: (this.listQuery.status1.split('&')[0]).split('_')[0],
                  sku1_k: (this.listQuery.status1.split('&')[0]).split('_')[1],
                  sku1_vid: (this.listQuery.status1.split('&')[1]).split('_')[0],
                  sku1_v: (this.listQuery.status1.split('&')[1]).split('_')[1],

                  // sku2_kid: (this.listQuery.status2.split('&')[0]).split('_')[0] || '',
                  // sku2_k: (this.listQuery.status2.split('&')[0]).split('_')[1] || '',
                  // sku2_vid: (this.listQuery.status2.split('&')[0]).split('_')[2] || '',
                  // sku2_v: (this.listQuery.status2.split('&')[0]).split('_')[3] || '',
                  
                  // sku3_kid: (this.listQuery.status3.split('&')[0]).split('_')[0] || '',
                  // sku3_k: (this.listQuery.status3.split('&')[0]).split('_')[1] || '',
                  // sku3_vid: (this.listQuery.status3.split('&')[0]).split('_')[2] || '',
                  // sku3_v: (this.listQuery.status3.split('&')[0]).split('_')[3] || '',
                }
              )
            }
          })
        }else{
          this.goodsList2.push(
            {
              goods_id: this.goods_info.split('_')[0],
              goods_name: this.goods_info.split('_')[1],
              chatroom_code: this.listQuery.status4.split('&')[0],
              chatroom_name: this.listQuery.status4.split('&')[1],
              // chatroom_cnt: this.listQuery.status4.split('&')[2]=='null'?0:this.listQuery.status4.split('&')[2],

              sku1_kid: (this.listQuery.status1.split('&')[0]).split('_')[0],
              sku1_k: (this.listQuery.status1.split('&')[0]).split('_')[1],
              sku1_vid: (this.listQuery.status1.split('&')[1]).split('_')[0],
              sku1_v: (this.listQuery.status1.split('&')[1]).split('_')[1],

              // sku2_kid: (this.listQuery.status2.split('&')[0]).split('_')[0] || '',
              // sku2_k: (this.listQuery.status2.split('&')[0]).split('_')[1] || '',
              // sku2_vid: (this.listQuery.status2.split('&')[0]).split('_')[2] || '',
              // sku2_v: (this.listQuery.status2.split('&')[0]).split('_')[3] || '',
              
              // sku3_kid: (this.listQuery.status3.split('&')[0]).split('_')[0] || '',
              // sku3_k: (this.listQuery.status3.split('&')[0]).split('_')[1] || '',
              // sku3_vid: (this.listQuery.status3.split('&')[0]).split('_')[2] || '',
              // sku3_v: (this.listQuery.status3.split('&')[0]).split('_')[3] || '',
            }
          )
        }
        this.goodsList2.forEach(element => {
          this.tempData.push(element.chatroom_code);
        });
      }
      this.goodsList2 = this.unique33(this.goodsList2);
      this.goodsData.item_name = '';
      this.isAllChatroomData = false;
      setTimeout(() => {
        this.goods_info = '';
        this.options1 = [];
        this.options4 = [];
        this.listQuery.status1 = '';
        this.listQuery.status4 = '';
        this.getItemList();
      }, 100);
    },
    delGoodsItem(i){
      this.goodsList2.splice(i,1);
    },
    getItemList(){
      getItemList(this.goodsData).then(res => {
        if (res.code == 200) {
          this.goodsList = res.result.rows;
        }
      });
    },
    //获取优惠券列表
    remoteMethod(query) {
      if (query !== '') {
        this.goodsList = [];
        this.loading = true;
        getItemList(
            {
              page_no: 1,
              page_size: 999,
              item_name: query
            }
          ).then(res => {
          if (res.code == 200) {
            this.goodsList = res.result.rows;
            this.loading = false;
          }
        });
      } else {
        this.goodsList = [];
      }
    },
    getChatroomData(){
      this.listQuery.status4 = '';
      this.options4 = [];
      getChatroomData({  page_no: 1, page_size: 999, item_id: this.item_id, sku_id: this.tempSku }).then( res => {
        if (res.code == 200) {
          res.result.rows.forEach((v,i)=>{
            this.options4.push(
              {
                value: v.chatroom_code+'&'+v.chatroom_name+'&'+v.user_cnt,
                label: v.chatroom_name
              }
            )
          })
        }
      })
    },
    //获取优惠券列表
    remoteMethod2(query) {
      if (query !== '') {
        this.loading2 = true;
        setTimeout(() => {
          getChatroomData({ page_no: 1, page_size: 999, chatroom_name:query, item_id: this.item_id, sku1: this.tempSku }).then( res => {
            if (res.code == 200) {
              this.options4 = [
                {
                  label: '全部',
                  value: 'allChatroomData'
                }
              ];
              this.loading2 = false;
              if(res.result.total){
                res.result.rows.forEach((v,i)=>{
                  this.options4.push(
                    {
                      value: v.chatroom_code+'&'+v.chatroom_name+'&'+v.user_cnt,
                      label: v.chatroom_name
                    }
                  )
                })
              }else{
                this.options4 = [];
              }
            }
          })
        }, 100);
      } 
    },
    changeGoods(v){
      this.getGoodsDetail(v.split('_')[0]||'1111');
      this.listQuery.status1 = '';
      this.listQuery.status4 = '';
      this.options1 = [];
      this.options4 = [];
    },
    changeGoods2(v){
      this.goodsList.forEach(t=>{
        if(t.item_id == v){
          this.questionaireInfo.goods_name = t.item_name;
        }
      })
    },
    //获取规格列表
    getGoodsDetail(n){
      getItemInfo({ item_id: n }).then(res => {
        if (res.code == 200) {
          this.item_id = res.result.item_id;
          let option1 = [];
          this.skus = res.result.skus;
          for (let index = 0,len = res.result.skus.length; index < len; index++) {
            if(res.result.skus[index].sku1_k && res.result.skus[index].sku2_k){
              let a = {
                sku1_k: res.result.skus[index].sku1_k,
                sku1_kid: res.result.skus[index].sku1_kid,
                sku1_v: res.result.skus[index].sku1_v,
                sku1_vid: res.result.skus[index].sku1_vid,
                sku_unique_code: res.result.skus[index].sku_unique_code,
                sku_id: res.result.skus[index].sku_id,
              }
              option1.push(a);
            }else{
              let a = {
                sku1_k: res.result.skus[index].sku1_k,
                sku1_kid: res.result.skus[index].sku1_kid,
                sku1_v: res.result.skus[index].sku1_v,
                sku1_vid: res.result.skus[index].sku1_vid,
                sku_unique_code: res.result.skus[index].sku_unique_code,
                is_bound: res.result.skus[index].is_bound,
                sku_id: res.result.skus[index].sku_id,
              }
              option1.push(a);
            }
          }
          this.options1 = this.unique1(option1);
          this.getChatroomData();
        }
      });
    },
    changeSkus1(v){
      this.tempSku = (v.split('&')[0]).split('_')[0]+'_'+(v.split('&')[1]).split('_')[0];
      this.remoteMethod2();
    },
    changeSkus4(v){
      if(v == 'allChatroomData'){
        this.isAllChatroomData = true;
        this.options5 = this.options4;
      }
    },
    unique1(arr){
      let res = []
      let obj = {}
      for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i].sku1_v]) {
          res.push(arr[i])
          obj[arr[i].sku1_v] = true
        }
      }
      return res;
    },
    unique2(arr){
      let res = []
      let obj = {}
      for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i].sku2_v]) {
          res.push(arr[i])
          obj[arr[i].sku2_v] = true
        }
      }
      return res;
    },
    unique33(arr){
      let res = []
      let obj = {}
      for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i].chatroom_code]) {
          res.push(arr[i])
          obj[arr[i].chatroom_code] = true
        }
      }
      return res;
    },
    handleRemove(file, fileList,i1,i2) {
      // console.log('handleRemove',file, fileList,i1,i2);
    },
    handleAvatarRemove(index, index2){
      this.componentList[index].optionList[index2].option_img_url = '';
    },
    handlePreview(file) {
      // console.log(file);
    },
    handlePictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      // this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file, fileList, index, index2) {
      this.componentList[index].optionList[index2].option_img_url = res.result.urlFile;
    },
    handleAvatarSuccess2(res, file) {
      this.questionaireInfo.wx_share_pic = res.result.urlFile;
    },
    getdata (evt) {
      // console.log(evt.draggedContext.element.id);
    },
    datadragEnd (evt) {
    },
    handleClick(tab, event) {
      // console.log(tab, event);
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
    goDel(id){
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCourse({course_id:id}).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.courseList();
          }
        });
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app_container{
  .title-header{
    margin: 13px 0 7px 0;
    em{
      font: {
        size: 14px;
        style: normal;
      }
    }
    .activeNameClass{
      color: #FF5757;
      text-decoration: underline;
    }
    b{
      cursor: pointer;
    }
  }
  .title-content{
    border-top: 1px solid rgb(218, 216, 216);
    // padding: 10px;
    height: auto;
  }
  .title-content1{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .left_menu{
      height: 100%;
      .left_menu_list{
        h5{
          margin:25px 0 8px 0;
        }
        p{
          display: inline-block;
          width: 68px;
          height: 28px;
          margin: 0;
        }
      }
    }
    .center_menu{
      // width: 100%;
      padding:10px 0;
      border-left: 1px solid lightgray;
      border-right: 1px solid lightgray;
      background: rgba(242, 242, 242, 1);
      overflow: auto;
      height: 86vh;
      .center_menu_content{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: auto;
        position: relative;
        .hoverShow{
          width: 360px;
          height: 120px;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }
        .Hover1{
          height: 130px;
          position: absolute;
          top: 0%;
          left: 5px;
          z-index: 9999;
          b{
            position: relative;
            top: 45px;
            left: -10px;
            z-index: 99;
          }
          b:before,b:after{
            position: absolute;
            content: '';
            border-top: 6px transparent dashed;
            border-left: 6px transparent dashed;
            border-right: 6px #fff dashed;
            border-bottom: 6px transparent dashed;
            z-index: 99;
          }
          b:before{
            border-bottom: 6px transparent solid;
            z-index: 99;
          }
        }
        .Hover2{
          height: 130px;
          position: absolute;
          top: 0px;
          left: 5px;
          z-index: 100;
          b{
            position: relative;
            top: 45px;
            left: -10px;
            z-index: 99;
          }
          b:before,b:after{
            position: absolute;
            content: '';
            border-top: 6px transparent dashed;
            border-left: 6px transparent dashed;
            border-right: 6px #fff dashed;
            border-bottom: 6px transparent dashed;
            z-index: 99;
          }
          b:before{
            border-bottom: 6px transparent solid;
            z-index: 99;
          }
        }
        .Hover3{
          position: absolute;
          top: 75px;
          left: 6px;
          z-index: 99;
          b{
            position: relative;
            top: 45px;
            left: -10px;
            z-index: 99;
          }
          b:before,b:after{
            position: absolute;
            content: '';
            border-top: 6px transparent dashed;
            border-left: 6px transparent dashed;
            border-right: 6px #fff dashed;
            border-bottom: 6px transparent dashed;
            z-index: 99;
          }
          b:before{
            border-bottom: 6px transparent solid;
            z-index: 99;
          }
        }
        .Hover4{
          position: absolute;
          top: 140px;
          left: 6px;
          z-index: 99;
          b{
            position: relative;
            top: 55px;
            left: -10px;
            z-index: 99;
          }
          b:before,b:after{
            position: absolute;
            content: '';
            border-top: 6px transparent dashed;
            border-left: 6px transparent dashed;
            border-right: 6px #fff dashed;
            border-bottom: 6px transparent dashed;
            z-index: 99;
          }
          b:before{
            border-bottom: 6px transparent solid;
            z-index: 99;
          }
        }
      }
      .questionCom{
        margin: 5px 0;
        width: 99%;
        border-radius: 5px;
      }
      .questionTitle{
        background: #fff;
        .questionnaireName{
          margin-left: 170px;
        }
        .el-input{
          margin: 7px 0;
        }
      }
      .questionContentBorder{
        border:1.5px dashed lightgray;
      }
      .questionContent{
        min-height: 450px;
        b{
          margin: 200px auto;
          width: 300px;
          height: 20px;
          text-align: center;
          font-weight: 300;
          display: block;
        }
        .Question{
          margin:10px 0;
          padding:10px 0;
          background: #fff;
          border-radius: 5px;
          i{
            font-size: 14px;
            margin-right: 5px;
            cursor: pointer;
          }
          .otherOption{
            width: 50%;
          }
        }
        .danxuanQuestion{
          img{
            border: 1px solid lightgrey;
            border-radius: 5px;
            margin-top: 25px;
          }
          .el-icon-remove{
            position: relative;
            top: -80px;
            right: 25px;
            font-size: 15px;
          }
          .addOptions{
            margin-top: 10px;
            // position: relative;
            // .showOptions{
            //   position: absolute;
            //   top: -250px;
            //   right: 110px;
            //   height: 240px;
            //   width: 100%;
            //   border-radius: 5px;
            //   padding: 20px;
            //   background: #fff;
            //   box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            // }
          }
          .uploaddemo1{
            width: 80px;
            margin: -15px 0 0 23px;
            img{
              border: 1px solid lightgrey;
              border-radius: 5px;
              margin-top: 25px;
              // position: relative;
            }
          }
          .uploaddemo3{
            height: 110px;
          }

          .answerList{
            height: auto;
          }
        }
        .duoxuanQuestion{
          // width: 100%;
          // height: 150px;
          img{
            border: 1px solid lightgrey;
            border-radius: 5px;
            margin: 10px 0 0 0;
          }
          .el-icon-remove{
            position: relative;
            top: -80px;
            right: 25px;
            font-size: 15px;
          }
          .el-checkbox{
            width: 100%;
          }
          .el-checkbox__label{
            width: 100%;
          }
          .addOptions{
            margin-top: 10px;
          }
          .uploaddemo3{
            height: 150px;
          }
        }
        .tiankongQuestion{
          margin-top: 10px;
        }
        .pingfenQuestion{
          .el-rate{
            zoom: 1.8;
          }
        }

        .showOptions{
          position: fixed;
          top: 170px;
          left: 50%;
          margin-left: -250px;
          height: 240px;
          width: 500px;
          border-radius: 5px;
          padding: 20px;
          background: #fff;
          z-index: 2;
          box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);
        }
        .showOptionsShadow1{
          box-shadow: none;
          box-shadow: 0;
          box-shadow: 0 2px 10px 0 rgba(0,0,0,0.05);
          z-index: 2;
        }
        .showOptionsShadow2{
          box-shadow: none;
          box-shadow: 0;
          box-shadow: 0 2px 10px 0 rgba(0,0,0,0.05);
          z-index: 2;
        }
        .showOptionsShadow3{
          box-shadow: none;
          box-shadow: 0;
          box-shadow: 0 2px 10px 0 rgba(0,0,0,0.05);
          z-index: 2;
        }

      }
      .questionTypes{
        padding-top: 5px;
        background: #fff;
        min-height: 110px;
        span{
          margin:0 20px 0 15px;
          font-size: 15px;
        }
        .questionTypes_item1{
          height: 40px;
          line-height: 40px;
        }
        .questionTypes_item2{
          min-height: 130px;
          margin: 10px 0;
          .questionTypes_item2_content1{
            margin: 10px 0;
            height: 45px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .questionTypes_item2_content2{
            width: 100%;
            min-height: 15px;
            height: auto;
            text-indent: 35px;
            margin-top: 15px;
            ul{
              // height: auto;
              height: 90px;
              overflow: auto;
              li{
                width: 750px;
                height: 30px;
                line-height: 30px;
                list-style: none;
                cursor: pointer;
                em{
                  height: 100%;
                  width: 200px;
                  text-indent: 10px;
                  display: inline-block;
                  font-size: 13px;
                  font-style: normal;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  &:nth-child(4){
                    width: 70px;
                    text-align: center;
                    text-indent: 1px;
                  }
                }
                position: relative;
                i{
                  position: absolute;
                  right: 0;
                  top: 7px;
                  display: none;
                }
                &:hover{
                  i{
                    display: block;
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }
        .questionTypes_item3{
          height: 65px;
          line-height: 65px;
          text-align: center;
          i{
            font-style: normal;
          }
        }
        .questionTypes_item4,.questionTypes_item5{
          height: 25px;
          margin: 5px 0 6px 0;
        }
        .questionTypes_item6{
          min-height: 75px;
          margin: 18px 0;
          height: auto;
        }
      }
      .questionRemarks{
        background: #fff;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .el-input{
          margin: 7px 0;
        }
      }
      .questionEndButton{
        background: #fff;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
      }
      .questionComInfo{
        margin-left: 120px;
      }
    }
    .right_menu{
      // position: absolute;
      // right: 10px;
      // top: 0;
      // background: pink;
      h5{
        width: 100%;
        height: 25px;
        border-bottom: 1px solid #333;
      }
      p{
        margin:20px 0 6px 0;
      }
      .el-radio-button__inner span{
        display: block;
        width: 100%;
        height: 100%;
        
      }
    }
  }
  .title-content2{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background: rgb(243, 243, 243);
    height: auto;
    width: 100%;
    .title-content2-main1{
      height: auto;
      min-height: 20vh;
      width: 70%;
      margin: 15px 0; 
      .title-content2-main1-content{
        width: 100%;
        height: auto;
        min-height: 20vh;
        background: #fff;
        border-radius: 10px;
        .title-content2-main1-content1{
          height: 70px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .title-content2-main1-content2{
          height: auto;
          width: 70%;
          margin-left: 110px;
          min-height: 8vh;
          background: paleturquoise;
        }
      }
    }
    .title-content2-main2{
      height: 71vh;
      width: 70%;
      margin: 15px 0; 
      .title-content2-main2-content{
        width: 100%;
        height: 450px;
        background: #fff;
        border-radius: 6px;
        margin: 10px 0;
        display: flex;
        // flex-direction: column;
        justify-content: center;
        align-items: center;
        h5{
          margin:25px 0 6px 0;
          font-weight: 400;
          span{
            color: rgb(184, 183, 183);
            font-size: 13px;
          }
        }
        .left_share{
          height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-right: 1px solid lightgray;
          .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }
          .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
          }
          .avatar-uploader-icon {
            font-size: 28px;
            color:#409EFF;
            // width: 50px;
            height: 78px;
            line-height: 78px;
            text-align: center;
          }
          .avatar {
            // width: 50px;
            height: 78px;
            display: block;
          }
          .left_share_right{
            margin-left: 10px;
            p{
              font-size: 13px;
              color:#409EFF;
            }
            span{
              font-size: 12px;
              color: rgb(184, 183, 183);
            }
          }
        }
        .right_share{
          padding: 5px 10px;
          .right_share_top{
            // margin: 20px 0;
            .right_share_top_content{
              height: 125px;
              background:#F7F8FA;
              font-size: 12px;
              p{
                height: 90px;
                width: 83%;
                margin: 15px 0px 15px 10px;
                display: inline-block;
                background: #fff;
                border: 1px solid lightgrey;
                position: relative;
                span{
                  position: absolute;
                  top: 10px;
                  left: 10px;
                }
                img{
                  position: absolute;
                  bottom: 5px;
                  right: 10px;
                }
                #zhima1{
                  width: 30px;
                  height: 30px;
                  position: absolute;
                  top: 4px;
                  right: -38px;
                }
                b{
                  position: absolute;
                  top: 15px;
                  right: -11px;
                  transform: rotate(90deg);
                }
                b:before,b:after{
                  position: absolute;
                  content: '';
                  border-top: 5px transparent dashed;
                  border-left: 5px transparent dashed;
                  border-right: 5px transparent dashed;
                  border-bottom: 5px #fff solid;
                }
                b:before{
                  border-bottom: 5px #c7c7c7 solid;
                }
                b:after{
                  top: 1px; 
                  border-bottom: 5px #fff solid;
                }
              }
            }
          }
          .right_share_bot{
            // margin: 10px 0;
            .right_share_bot_content{
              height: 130px;
              background:#F7F8FA;
              font-size: 12px;
              position: relative;
              #zhima2{
                width: 30px;
                height: 30px;
                position: absolute;
                top: 8px;
                left: 10px;
              }
              span{
                height: 30px;
                width: 100%;
                position: absolute;
                top: 12px;
                left: 50px;
              }
              p{
                position: absolute;
                top: 28px;
                right: 20px;

                width: 80%;
                margin-left:40px;
                height: 60px;
                background: #fff;
                border: 1px solid lightgrey;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                img{
                  margin: 0 8px;
                }
              }
            }
          }
        }
      }
    }
    .title-content2-main3{
      height: 5vh;
      width: 100%;
      text-align: center;
      margin: 25px 0;
    }
    h4{
      width: 100%;
      margin: 10px 0;
    }

  }
  .title-content3{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 15px;
    .title-content3-main{
      width: 96%;
      .el-button{
        margin-top: -12px;
      }
    }
  }
}
</style>

<style lang="scss">
.questionTitle{
  .el-input--small .el-input__inner{
    text-align: center;
  }
}
.duoxuanQuestion{
  .el-checkbox__label{
    width: 100%;
  }
  .el-upload-list__item .el-icon-close-tip{
    display: none !important;
  }
}
.pingfenQuestion{
  .el-rate__icon{
    color:lightgray !important;
  }
}
.selectRange{
  height: 45px;
  margin-top: 5px;
  span{
    line-height: 30px;
    font-size: 13px;
  }
}
.answerList{
  i{
    visibility: hidden;
  }
  .el-radio:hover i{
    visibility: visible;
  }
  .el-checkbox:hover i{
    visibility: visible;
  }
  .el-icon-remove{
    visibility: visible;
  }
}
.duoxuanQuestion{
  margin-right:60px;
  position: relative;
  .el-checkbox__input{
    position: absolute;
    top: 9px;
    left: 2px;
  }
  .el-checkbox__label{
    margin-left: 15px;
  }
}
.questionContent{
  .el-radio-group{
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .el-radio{
    width: 100%;
    margin:5px 0;
  }
}
.uploaddemo2{
  display: inline-block;
  .el-upload--picture-card{
    width: 0;
    height: 0;
    line-height: 0;
    border: none;
  }
}
#uploaddemo4{
  margin: 10px 0 10px 22px;
}
#uploaddemo5{
  margin: 10px 0px;
}
</style>
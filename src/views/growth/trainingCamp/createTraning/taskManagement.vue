<template>
  <div class="taskManagement">
    <el-col class="subtitle" :span="21">
      <p><b>{{ camp_times_info.camp_times_name }}</b> 
      <span>营期时间：{{ camp_times_info.camp_times_start_time }}  -  {{ camp_times_info.camp_times_end_time }}</span></p>
    </el-col>
    <el-col :span="21" class="newaddend_container">
      <!-- 头部导航部分 -->
      <el-col :span="24" class="newaddend_container_header">
        <el-steps :active="active" finish-status="success" simple>
          <el-step title="第一步: 添加任务基本信息"></el-step>
          <el-step title="第二步: 添加任务内容"></el-step>
        </el-steps>
      </el-col>

      <!-- 第一步: 添加任务基本信息 -->
      <el-col :span="24" class="newaddend_content1" v-if="active == 1">
        <h4>任务基础信息</h4>
        <el-form ref="campTimesTaskInfo" :model="campTimesTaskInfo" class="form-wrap" label-width="140px">
          <el-form-item label="*小程序端任务展示说明：" prop="sign_start_time">
            <el-col :span="14">
              <el-col :span="16">
                <el-input v-model="campTimesTaskInfo.times_task_info.task_show_title" maxlength="6" placeholder="请填写如：每日任务或每日行动" 
                size="small" clearable></el-input>
              </el-col>
              <el-col :span="6" :offset="1">注：最多6个字</el-col>
            </el-col>
            <el-col :span="14">
              <el-col :span="16">
                <el-input v-model="campTimesTaskInfo.times_task_info.task_show_rules" maxlength="18" placeholder="请填写如：还未开营去看规则和玩法~" 
                size="small" clearable></el-input>
              </el-col>
              <el-col :span="6" :offset="1">注：最多18个字</el-col>
            </el-col>
            <el-col :span="14">
              <el-col :span="16">
                <el-input v-model="campTimesTaskInfo.times_task_info.task_calendar_title" maxlength="6" placeholder="请填写如：今日小锦囊" 
                size="small" clearable></el-input>
              </el-col>
              <el-col :span="6" :offset="1">注：最多6个字</el-col>
            </el-col>
          </el-form-item>
          <el-form-item label="*任务时间：" prop="sign_start_time">
            <el-col :span="10">
              <el-date-picker v-model="timeValue" value-format="yyyy-MM-dd" type="daterange"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small"
                :disabled="timeDisabled" :picker-options="pickerOptions">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="*封面图：" prop="face_img_url">
            <el-col :span="3">
              <el-upload
                class="avatar-uploader"
                :action="host"
                :show-file-list="false"
                :data="uploadPoster"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="campTimesTaskInfo.times_task_info.face_img_url" :src="campTimesTaskInfo.times_task_info.face_img_url" 
                class="avatar" width="100" height="70">
                <i v-else class="el-icon-plus avatar-uploader-icon uploader-head"></i>
              </el-upload>
            </el-col>
            <el-col :span="3" :offset="1">
              图片建议比例 4:3
            </el-col>
          </el-form-item>
          <el-form-item label="*活动规则：">
            <el-col :span="18">
              <tinymce v-model="campTimesTaskInfo.times_task_info.task_rule_content"></tinymce>
            </el-col>
          </el-form-item>
          <el-form-item label="*是否返押金：">
            <el-col :span="24">
              <el-radio v-model="campTimesTaskInfo.times_task_info.is_back_money" label="2" :disabled="timeDisabled">否</el-radio>
              <el-radio v-model="campTimesTaskInfo.times_task_info.is_back_money" label="1" :disabled="timeDisabled">是</el-radio>
              <span v-if="campTimesTaskInfo.times_task_info.is_back_money == '1'">&nbsp;&nbsp;注意：勾选为是，则完成任务周期的每一天任务即返还支付商品金额（可以不连续完成）即返还押金</span>
            </el-col>
          </el-form-item>
          <el-form-item label="*签到显示规则：">
            <el-col :span="10">
              <el-radio v-model="campTimesTaskInfo.times_task_info.task_visible_type" label="1" :disabled="timeDisabled">仅查看当天解锁的任务</el-radio>
              <el-radio v-model="campTimesTaskInfo.times_task_info.task_visible_type" label="2" :disabled="timeDisabled">可查看所有待解锁任务</el-radio>
            </el-col>
          </el-form-item>

          <!-- 任务示例部分 -->
          <h4>任务示例</h4>
          <el-form-item label="*添加示例：">
            <el-col :span="20">
              <el-button type="primary" @click="chooseTaskUser" size="small">选择示例</el-button>
            </el-col>
            <el-col :span="22" class="task_example_list" v-if="campTimesTaskInfo.task_example.task_example_list.length">
              <el-col :span="24">已添加示例：</el-col>
              <el-col :span="24" v-for="(item,index) in campTimesTaskInfo.task_example.task_example_list" :key="item.index" class="task_example_list_content">
                <img :src="item.headimgurl" alt="" width="70" height="50">
                <b>{{item.nickname}}</b>
                <el-popover placement="top" width="800" trigger="click">
                  {{item.details}}<br><br>
                  <span v-for="item in item.pic_url" :key="item.index">
                    <img :src="item" alt="" width="245" height="" style="margin:0 2px;"> 
                  </span>
                  <p slot="reference" v-if="item.details == ''">
                    <span v-for="item in item.pic_url" :key="item.index">
                      <img :src="item" alt="" width="70" height="80" style="margin:0 3px;">
                    </span>
                  </p>
                  <p slot="reference" v-else>
                    {{item.details}}
                  </p>
                </el-popover>
                <el-button type="text" @click="deltasks(index)" size="small">删除</el-button>
              </el-col>
            </el-col>
          </el-form-item>
        </el-form>

        <el-dialog title="选择任务示例" width="75%" :visible.sync="dialogFormVisible2">
          <el-col :span="3">
            <el-select v-model="listQuery.search_category" size="small" @change='changeType1'>
              <el-option
                v-for="item in options1"
                :key="item.task_category" 
                :label="item.task_category_name" 
                :value="item.task_category">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="listQuery.search_essence" size="small" @change='changeType2'>
              <el-option
                v-for="item in options3" 
                :key="item.index" 
                :label="item.label" 
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input size="small" placeholder="请输入昵称或手机号" prefix-icon="el-icon-search" v-model="listQuery.search_title" clearable></el-input>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="searchList()" icon="el-icon-search" size="small">搜索</el-button>
          </el-col>
          <el-col :span="24">
            <el-table 
              ref="multipleTable"
              tooltip-effect="dark"
              height="370"
              style="width: 100%"
              @selection-change="handleSelectionChange1"
              :data="goodsData"
              class="dialog-table">
              <el-table-column type="selection" :selectable='selectInit' width="50" align="center"></el-table-column>
              <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
              <el-table-column property="nickname" label="用户昵称" align="center" width="100"></el-table-column>
              <el-table-column property="mobile" label="手机号码" align="center" width="120"></el-table-column>
              <el-table-column property="task_category" label="任务说明" align="center" width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.task_category_name }}</span>
                  <img :src="scope.row.task_img_url" alt="" width="90" height="60" v-if="scope.row.task_img_url">
                </template>
              </el-table-column>
              <el-table-column property="details" label="任务完成情况" align="center">
                <template slot-scope="scope">
                  <el-popover
                    placement="top"
                    width="800"
                    trigger="click">
                    {{scope.row.details}}<br>
                    <span v-for="item in scope.row.pic_url" :key="item.index">
                      <img :src="item" alt="" width="240" height="" style="margin:0 2px;">
                    </span>
                    <p slot="reference" v-if="scope.row.details == ''">
                      <span v-for="item in scope.row.pic_url" :key="item.index">
                        <img :src="item" alt="" width="70" height="70" style="margin:0 3px;">
                      </span>
                    </p>
                    <p slot="reference" v-else class="elTableColumn">
                      {{scope.row.details}}
                    </p>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column property="submit_date" label="任务完成时间" align="center" width="110"></el-table-column>
              <el-table-column property="zan_num" label="点赞总量" align="center" width="90"></el-table-column>
              <el-table-column property="comment_count_num" label="评论量" align="center" width="70"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <pagination 
              class="pagination" 
              v-show="total>0" 
              :total="total" 
              :page.sync="listQuery.page_num" 
              :limit.sync="listQuery.page_size" 
              v-on:pagination="changePaging"/>
          </el-col >
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible2 = false;listQuery.search = '';" size="small">取 消</el-button>
            <el-button type="primary" @click="bindNewTask1()" size="small">确 定</el-button>
          </div>
        </el-dialog>

        <el-col :span="24" class="submitButtons">
          <el-button @click="cancelSubmit()" size="small">&nbsp;取&nbsp;消&nbsp;</el-button>
          <el-button type="primary" @click="saveSubmit()" size="small">&nbsp;下一步并保存&nbsp;</el-button>
        </el-col>
      </el-col>


      <!-- 第二步: 添加任务内容 -->
      <el-col :span="24" class="newaddend_content2" v-else>
        <el-col class="newaddend_content2_title" :span="24">
          <el-col :span="7"><b>任务设置</b></el-col>
        </el-col>
        <el-col class="task_lists" v-if="taskListDays.length" :span="24">
          <el-col class="task_lists_content" v-for="(item,index) in (taskListDays)" :key="item.index" :span="24">
            <h5 v-if="item.task_content_time_info.is_edit">
              {{ item.task_content_time_info.task_content_time }} - 第{{ (index+1) }}天  
              <i @click="delDay(index,item.task_content_time_info.task_content_time)" :class="{ isHidden: item.task_content_time_info.is_canEditDay }">删除</i> 
              <i @click="editTargetDay(index,item.task_content_time_info.task_content_time)" :class="{ isHidden: item.task_content_time_info.is_canEditDay }">编辑</i>
            </h5>
            <h5 v-if="!item.task_content_time_info.is_edit" @click="cancelEditDay(index,item.task_content_time_info.task_content_time)">
              <el-col :span="3">
                <el-select v-model="item.task_content_time_info.task_content_time" placeholder="选择日期" size="small" @change="editDays">
                  <el-option
                    v-for="item in options4"
                    :key="item.value"
                    :disabled="item.is_selected"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <i @click="delDay(index,item.task_content_time_info.task_content_time)" :class="{ isHidden: item.task_content_time_info.is_canEditDay }">删除</i> 
              <i @click="editTargetDay(index,item.task_content_time_info.task_content_time)" :class="{ isHidden: item.task_content_time_info.is_canEditDay }">编辑</i>
            </h5>
            <el-col class="task_content_list" v-if="item.task_content_list" :span="24">
              <draggable v-model="item.task_content_list" @start="drag=true" @end="drag=false">
                <el-col class="task_content_list_content" v-for="(task,i) in item.task_content_list" :key="task.index" :span="24">
                  <h6>{{ task.task_content_info.task_category_name }}</h6>
                  <img :src="task.task_content_info.task_img_url" alt="" width="70" height="50">
                  <el-popover
                    placement="top"
                    width="600"
                    trigger="click">
                    <p>{{task.task_content_info.task_content}}</p>
                    <b slot="reference">{{task.task_content_info.task_content}}</b>
                  </el-popover>
                  <p>
                    <span :class="{ isHidden: item.task_content_time_info.is_canEditDay }">拖拽排序</span>
                    <span :class="{ isHidden: item.task_content_time_info.is_canEditDay }" @click="editTask(index,i)">编辑</span>
                    <span :class="{ isHidden: item.task_content_time_info.is_canEditDay }" @click="delTask(index,i)">删除</span>
                    <span @click="checkTasks(task.task_content_info.times_task_content_id,index,i,item.task_content_time_info.is_canEditDay)">查看示例</span>
                    <span @click="checkInfo(index,i,item.task_content_time_info.is_canEditDay)">
                      {{ task.task_content_info.task_content_analysis||item.task_content_time_info.is_canEditDay ? '查看解析' : '添加解析' }}
                    </span>
                  </p>
                </el-col>
              </draggable>
            </el-col>
            <p style="width: 200px;" >
              <i @click="addNewTaskDialog(index)" v-if="!item.task_content_time_info.is_canEditDay">+ 添加学习任务</i>
            </p>
          </el-col>
        </el-col>

        <el-col :span="4" class="newaddend_content2_options">
          <el-col :span="18">
            <el-select v-model="value" placeholder="选择日期" size="small" @change="selecteDayIndex" >
              <el-option
                v-for="(item,index) in options4"
                :key="item.index"
                :label="item.label"
                :disabled="item.is_selected"
                :value="item.value+'&'+(index+1)">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="addNewDay()" size="small">&nbsp;新&nbsp;增&nbsp;</el-button>
          </el-col>
        </el-col>

        <el-dialog title="选择任务" width="75%" :visible.sync="dialogFormVisible5">
          <el-col :span="4">
            <el-input size="small" placeholder="请输入关键词" prefix-icon="el-icon-search" v-model="listQuery1.search" clearable></el-input>
          </el-col>
          <el-col :span="3">
            <el-select v-model="listQuery1.task_category" size="small">
              <el-option
                v-for="item in options1"
                :key="item.task_category" 
                :label="item.task_category_name" 
                :value="item.task_category">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="searchList1()" icon="el-icon-search" size="small">搜索</el-button>
          </el-col>
          <el-col :span="24">
            <el-table 
              ref="multipleTable"
              tooltip-effect="dark"
              height="370"
              style="width: 100%"
              @selection-change="handleSelectionChange1"
              :data="goodsData1"
              class="dialog-table">
              <el-table-column type="selection" :selectable='selectInit' width="50" align="center"></el-table-column>
              <el-table-column property="task_category_name" label="分类" align="center" width="80"></el-table-column>
              <el-table-column property="task_cover" label="封面图" align="center" width="180">
                <template slot-scope="scope">
                  <img :src="scope.row.task_cover" alt="" width="90" height="70">
                </template>
              </el-table-column>
              <el-table-column property="task_details" label="任务详情" align="center"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <pagination 
              class="pagination" 
              v-show="total1>0" 
              :total="total1" 
              :page.sync="listQuery1.page_num" 
              :limit.sync="listQuery1.page_size" 
              v-on:pagination="changePaging1"/>
          </el-col >
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible5 = false;listQuery1.search = '';" size="small">取 消</el-button>
            <el-button type="primary" @click="addNewTask()" size="small">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="查看/编辑解析"
          :visible.sync="dialogFormVisible6"
          width="43%">
          <el-col :span="24" style="margin-bottom: 15px;">
            <el-input type="textarea" :rows="7" placeholder="请输入解析内容" v-model="textarea" size="small" :disabled="isCanEditInfo">
            </el-input>
          </el-col>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogFormVisible6 = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitEditInfo">确 定</el-button>
          </span>
        </el-dialog>

        <!-- <el-dialog title="添加/查看解析" :visible.sync="dialogFormVisible6">
          <el-col :span="24">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入解析内容"
              v-model="textarea" size="small">
            </el-input>
          </el-col>
          <div slot="footer" class="dialog-footer2">
            <el-button @click="dialogFormVisible6 = false" size="small">取 消</el-button>
            <el-button type="primary" size="small">确 定</el-button>
            <el-button type="primary" @click="submitEditInfo" size="small">确 定</el-button>
          </div>
        </el-dialog> -->

        <el-dialog title="编辑任务" :visible.sync="dialogFormVisible4">
          <el-form :model="Taskform">
            <el-form-item label="任务分类" :label-width="formLabelWidth">
              <el-radio-group v-model="Taskform.task_category">
                <el-radio :label="item.task_category" v-for="item in options2" :key="item.index">
                  {{item.task_category_name}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="任务封面图" :label-width="formLabelWidth">
              <img src="https://poster-share.oss-cn-beijing.aliyuncs.com/poster/ZMWH0E787BAB33BAACA5AD7D9DB8A46F28F2.jpg" 
              width="100" height="60" alt="">
            </el-form-item>
            <el-form-item label="任务内容" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="2" placeholder="请输入任务内容" v-model="Taskform.task_content">
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible4 = false" size="small">取 消</el-button>
            <el-button type="primary" @click="submitEditTask" size="small">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="选择示例" width="75%" :visible.sync="dialogFormVisible3">
          <el-col :span="4">
            <el-input size="small" placeholder="请输入关键词" prefix-icon="el-icon-search" v-model="listQuery2.search_title" clearable></el-input>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="searchList2()" icon="el-icon-search" size="small">搜索</el-button>
          </el-col>
          <el-col :span="24">
            <el-table 
              ref="multipleTable"
              tooltip-effect="dark"
              height="370"
              style="width: 100%"
              @selection-change="handleSelectionChange2"
              :data="goodsData2"
              class="dialog-table">
              <el-table-column type="selection" :selectable='selectInit' width="50" align="center"></el-table-column>
              <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
              <el-table-column property="nickname" label="用户昵称" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.nickname }}</span>
                  <img :src="scope.row.headimgurl" alt="" width="100" height="60">
                </template>
              </el-table-column>
              <el-table-column property="details" label="任务详情" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.details }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <pagination 
              class="pagination" 
              v-show="total2>0" 
              :total="total2" 
              :page.sync="listQuery2.page_num" 
              :limit.sync="listQuery2.page_size" 
              v-on:pagination="changePaging2"/>
          </el-col >
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible3 = false;listQuery2.search = '';" size="small">取 消</el-button>
            <el-button type="primary" @click="bindNewTask2()" size="small">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="查看已选示例" width="75%" :visible.sync="dialogFormVisible7">
          <el-col :span="24">
            <el-button type="primary" @click="addTasks()" size="small" :disabled="disableValue">添加 示例</el-button>
          </el-col>
          <el-col :span="24">
            <el-table 
              ref="multipleTable"
              tooltip-effect="dark"
              height="370"
              style="width: 100%"
              @selection-change="handleSelectionChange4"
              :data="goodsData4"
              class="dialog-table">
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column property="nickname" label="用户昵称" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.nickname }}</span>
                  <img :src="scope.row.headimgurl" alt="" width="100" height="60">
                </template>
              </el-table-column>
              <el-table-column property="details" label="任务详情" align="center">
                <template slot-scope="scope">
                  <el-popover
                    placement="top"
                    width="800"
                    trigger="click">
                    {{scope.row.details}}<br>
                    <span v-for="item in scope.row.pic_url" :key="item.index">
                      <img :src="item" alt="" width="245" height="" style="margin:0 2px;">
                    </span>
                    <p slot="reference" v-if="scope.row.details == ''">
                      <span v-for="item in scope.row.pic_url" :key="item.index">
                        <img :src="item" alt="" width="70" height="70" style="margin:0 2px;">
                      </span>
                    </p>
                    <p slot="reference" v-else class="elTableColumn">
                      {{scope.row.details}}
                    </p>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width='110'>
                <template slot-scope="scope">
                  <el-button size="mini" @click="delUser(scope.row.task_submit_id)" type="text">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <pagination
              class="pagination" 
              v-show="total3>0" 
              :total="total3" 
              :page.sync="listQuery3.page_num" 
              :limit.sync="listQuery3.page_size" 
              v-on:pagination="changePaging2"/>
          </el-col >
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible7 = false;listQuery3.search = '';" size="small">取 消</el-button>
            <el-button type="primary" @click="bindNewTask3()" size="small">确 定</el-button>
          </div>
        </el-dialog>

        <el-col :span="24" class="submitButtons2">
          <el-button @click="cancelSubmit2()" size="small">&nbsp;上一步&nbsp;</el-button>
          <el-button type="primary" @click="saveSubmit2()" size="small">&nbsp;保存并提交&nbsp;</el-button>
        </el-col>
      </el-col>
    </el-col>
  </div>
</template>

<script>
import { insertTimesTask, updateTimesTask, insertTimesTaskContent, getTimesTaskData, getTaskContentList, 
getTaskContentExplameList, TaskUserCompleted, taskLibraryList, getTaskCategroyList } from "@/api/growthCamp";
import Pagination from "@/components/Pagination";
import Tinymce from '@/components/Tinymce';
import draggable from 'vuedraggable';
import { getPromoList } from '@/api/giftCard';
import { getCouponList } from "@/api/group";
export default {
  components: { Tinymce,Pagination,draggable },
  data() {
    return {
      height: null,
      listQuery: {
        page_num: 1,
        page_size: 10,
        search_category: '',
        search_essence: '',
        search_title: ''
      },
      total: 0,
      listQuery1: {
        page_num: 1,
        page_size: 10,
        search: '',
        task_category: ''
      },
      total1: 0,
      listQuery2: {
        page_num: 1,
        page_size: 10,
        search_status: '1',
        search_category: '',
        search_essence: ''
      },
      total2: 0,
      listQuery3: {
        page_num: 1,
        page_size: 30,
        search_title: '',
        status:''
      },
      total3: 0,
      listQuery4: {
        page_num: 1,
        page_size: 10,
        search_title: '',
        status: ''
      },
      total4: 0,
      timeValue: [],
      timeValue2: [],
      timeValue3: '',
      camp_times_info: {},
      campTimesTaskInfo: {
        "times_task_info": {
          "times_task_id": "",
          "camp_times_id": "",          
          "task_start_time": "",
          "task_end_time": "",
          "face_img_url": "",
          "task_rule_content": "",
          "task_show_title": "",
          "task_show_rules": "",
          "task_calendar_title": "",
          "is_back_money": "2",
          "task_visible_type": "1",
        },
        "task_prize": [],
        "task_example": {
          "task_example_list": []
        }
      },
      goodsData: [],
      goodsData1: [],
      goodsData2: [],
      goodsData3: [],
      goodsData4: [],
      taskListDays: [], 
      options1: [
        {
          task_category_name: '全部类型',
          task_category: '',
        }
      ],
      options2: [],
      options3: [
        {
          value: '',
          label: '全部分类'
        },
        {
          value: '1',
          label: '已精选'
        },
        {
          value: '2',
          label: '未精选'
        },
      ],
      options4:[],
      couponValue: '',
      option2: [],
      timeDisabled: false,
      currIndex: null,
      curreditDay: null,
      originDay: null,
      disableValue: false,
      currTask: 0,
      currIndex1: 0,
      currIndex2: 0,
      uploadPoster: {
        bucket: "zm-edu",
        property: 'taskManagement-poster'
      },
      active: 1,
      value1: '',
      value2: '',
      value: '',
      pickerOptions: {
        disabledDate(time) {
          let startTime = sessionStorage.getItem('checkTask').split('&&')[2];
          let endTime = sessionStorage.getItem('checkTask').split('&&')[3];
          function getNextDate(date, day) { 
          　　var dd = new Date(date);
          　　dd.setDate(dd.getDate() + day);
          　　var y = dd.getFullYear();
          　　var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
          　　var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
          　　return y + "-" + m + "-" + d;
          };
          if(new Date() > new Date(startTime)){
            startTime = getNextDate(new Date(),-1);
          }else{
            startTime = getNextDate(startTime,-1);
          }
          return time.getTime() <= new Date(startTime).getTime() || time.getTime() > new Date(endTime).getTime();
        },
      },
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      dialogFormVisible5: false,
      dialogFormVisible6: false,
      dialogFormVisible7: false,
      formLabelWidth: '110px',
      dateList: [],
      Taskform: {
        task_category: 1,
        task_content: '',
        task_content_example_list: []
      },
      currtask1: -1,
      currtask2: -1,
      input: "",
      list: [],
      loading: false,
      isCanEditInfo: false,
      textarea:'',
    }
  },
  created() {
    this.host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    this.camp_times_info.camp_times_id = sessionStorage.getItem('checkTask').split('&&')[0];
    this.camp_times_info.camp_times_name = sessionStorage.getItem('checkTask').split('&&')[1];
    this.camp_times_info.camp_times_start_time = sessionStorage.getItem('checkTask').split('&&')[2];
    this.camp_times_info.camp_times_end_time = sessionStorage.getItem('checkTask').split('&&')[3];
    this.getTaskCategroyList();
    if (!this.$route.params.Campid.indexOf('tt')) {
      this.campTimesTaskInfo.times_task_id = sessionStorage.getItem('checkTask').split('&&')[4];
      this.getTimesTaskData();
    }
  },
  methods: {
    getTaskCategroyList(){
      getTaskCategroyList().then(res => {
        if(res.code == 200){
          this.options2 = res.result.task_category_list;
          this.options2.forEach(t=>{
            this.options1.push(t)
          })
        }
      })
    },
    getTimesTaskData(){
      getTimesTaskData({
        camp_times_id: sessionStorage.getItem('checkTask').split('&&')[0]
      }).then(res => {
        if (res.code == 200) {
          let d = {
            task_example:{
              task_example_list: null
            }
          };
          //任务基本信息
          d.times_task_info = res.result.times_task_info;
          this.timeValue = [res.result.times_task_info.task_start_time,res.result.times_task_info.task_end_time];
          this.timeValue2 = [res.result.times_task_info.rank_start_time,res.result.times_task_info.rank_end_time];
          this.timeValue3 = res.result.times_task_info.give_prize_time;

          //示例信息
          d.task_example.task_example_list = res.result.example_list;
          this.campTimesTaskInfo = d; this.options4 = [];
          let days = this.formatEveryDay(d.times_task_info.task_start_time,d.times_task_info.task_end_time);
          days.forEach(v=>{
            this.options4.push({
              label: v,
              value: v,
              is_selected: false
            })
          })
          this.timeFormat();
        }
      })
    },
    bindNewTask1(){
      this.multipleSelection1.forEach(v=>{
        this.campTimesTaskInfo.task_example.task_example_list.push(
          {
            "details": v.details,
            "headimgurl": v.headimgurl,
            "nickname": v.nickname,
            "task_category": v.task_category,
            "task_submit_id": v.task_submit_id,
            "pic_url": v.pic_url
          }
        )
      })
      this.dialogFormVisible2 = false;
    },
    cancelSubmit() {
      this.$router.go(-1);
    },
    selecteDayIndex(v){
      this.currIndex = v.split('&')[1] - 1;
    },
    addNewDay(){
      if(!this.value){
        this.$message({
          message: "请选择要添加的日期！",
          type: "warning"
        });
      }else{
        this.taskListDays.push(
          {
            "task_content_time_info": {
              // "target_day": this.value.split('&')[1],
              "task_content_time": this.value.split('&')[0],
              "is_edit": true,
              // "is_selected": false
            },
            "task_content_list": []
          }
        );
        this.options4[this.currIndex].is_selected = true;
      }
      this.taskListDays = this.sortDays(this.taskListDays);
      this.value = '';
    },
    changeType(v){
      this.option2 = [];
      if(v == '1'){
        this.getCouponList();
      }else{
        this.getPromoList();
      }
    },
    editTask(i,j){
      this.currtask1 = i;
      this.currtask2 = j;
      this.dialogFormVisible4 = true;
      this.Taskform.task_category = (this.taskListDays[i].task_content_list[j].task_content_info.task_category);
      this.Taskform.task_content = this.taskListDays[i].task_content_list[j].task_content_info.task_content;
      this.Taskform.task_content_example_list = this.taskListDays[i].task_content_list[j].task_content_info.task_content_example_list;
    },
    submitEditTask(){
      this.dialogFormVisible4 = false;
      this.taskListDays[this.currtask1].task_content_list[this.currtask2].task_content_info.task_category = this.Taskform.task_category;
      this.options2.forEach(n=>{
        if(n.task_category == this.Taskform.task_category){
          this.taskListDays[this.currtask1].task_content_list[this.currtask2].task_content_info.task_category_name = n.task_category_name;
        }
      })
      this.taskListDays[this.currtask1].task_content_list[this.currtask2].task_content_info.task_content = this.Taskform.task_content;
      this.taskListDays[this.currtask1].task_content_list[this.currtask2].task_content_info.task_content_example_list = this.Taskform.task_content_example_list;
    },
    delTask(i,j){
      this.taskListDays[i].task_content_list.splice(j,1);
    },    
    addNewTaskDialog(i){
      this.dialogFormVisible5=true;
      this.currTask = i;
      this.listQuery1.page_num = 1;
      this.taskLibraryList();
    },
    taskLibraryList(){
      taskLibraryList(this.listQuery1).then(res => {
        if (res.code == 200) {
          this.total1 = Number(res.result.sign.count);
          //处理过滤
          let temp = [];
          this.taskListDays.forEach(v=>{
            v.task_content_list.forEach(k=>{
              temp.push(k.task_content_info.task_id);
            })
          })
          res.result.list.forEach(v=>{
            v.status = '1'
            if(temp.includes(v.task_id)){
              v.status = '2';
            }
          })
          this.goodsData1 = res.result.list;
        }
      });
    },
    //新增任务确定框
    addNewTask(){
      this.multipleSelection1.forEach(v=>{
        this.taskListDays[this.currTask].task_content_list.push(
          {
            task_content_info:{
              "task_id": v.task_id,
              "task_category": v.task_category,
              "task_category_name": v.task_category_name,
              "task_img_url": v.task_cover,
              "task_content": v.task_details,
            },
            task_content_example_list:[]
          }
        )
      })
      this.dialogFormVisible5 = false;
    },
    //查看示例
    checkTasks(id,i1,i2,disableValue){
      this.dialogFormVisible7 = true;
      this.currIndex1 = i1;
      this.currIndex2 = i2;
      this.disableValue = disableValue;
      if(this.taskListDays[this.currIndex1].task_content_list[this.currIndex2].task_content_example_list){
        this.total3 = this.taskListDays[this.currIndex1].task_content_list[this.currIndex2].task_content_example_list.length;
        this.goodsData4 = this.taskListDays[this.currIndex1].task_content_list[this.currIndex2].task_content_example_list;
      }else{
        // this.goodsData4 = [];
        //先获取已绑定的示例
        getTaskContentExplameList({ times_task_content_id: id }).then(res => {
          if (res.code == 200) {
            // this.goodsData3 = res.result;
            this.goodsData4 = res.result;
            this.total3 = this.goodsData4.length;
            //已经有绑定的数据
            if(this.goodsData4.length){
              this.taskListDays[this.currIndex1].task_content_list[this.currIndex2].task_content_example_list = [];
              this.taskListDays[this.currIndex1].task_content_list[this.currIndex2].task_content_example_list = this.goodsData4;
            }else{
              //没有绑定数据
              this.taskListDays[this.currIndex1].task_content_list[this.currIndex2].task_content_example_list = [];
            }
          }
        });
      }
    },
    //添加示例弹窗
    addTasks(i1,i2){
      this.dialogFormVisible3 = true;
      this.dialogFormVisible7 = false;
      this.getList();
      this.currIndex1 = i1 || this.currIndex1;
      this.currIndex2 = i2 || this.currIndex2;
    },
    checkInfo(i1,i2,boolean){
      this.dialogFormVisible6 = true;
      this.currIndex1 = i1;
      this.currIndex2 = i2;
      this.textarea = this.taskListDays[this.currIndex1].task_content_list[this.currIndex2].task_content_info.task_content_analysis || '暂无数据...';
      this.isCanEditInfo = boolean;
    },
    submitEditInfo(){
      this.dialogFormVisible6 = false;
      this.taskListDays[this.currIndex1].task_content_list[this.currIndex2].task_content_info.task_content_analysis = this.textarea;
    },
    //示例列表
    getList(){
      TaskUserCompleted(this.listQuery2).then(res => {
        if (res.code == 200) {
          this.total2 = Number(res.result.sign.count);
          res.result.userList.forEach(k=>{
            k.status = '1';
          })
          let tempList = JSON.parse(JSON.stringify(res.result.userList));
          let tempData = this.taskListDays[this.currIndex1].task_content_list[this.currIndex2].task_content_example_list;
          if(tempData.length){
            tempList.forEach(v=>{
              tempData.forEach(item=>{
                if(v.task_submit_id == item.task_submit_id){
                  v.status = '2';
                }
              })
            })
          }
          this.goodsData2 = tempList;
        }
      });
    },
    //点击确定新增示例
    bindNewTask2(){
      this.dialogFormVisible7 = false;
      this.multipleSelection2.forEach(v=>{
        this.taskListDays[this.currIndex1].task_content_list[this.currIndex2].task_content_example_list.push(
          {
            "details": v.details,
            "headimgurl": v.headimgurl,
            "nickname": v.nickname,
            "task_category": v.task_category,
            "task_submit_id": v.task_submit_id
          }
        )
      })
      this.dialogFormVisible3 = false;
    },
    delUser(id){
      this.taskListDays[this.currIndex1].task_content_list[this.currIndex2].task_content_example_list.forEach((v,i)=>{
        if(v.task_submit_id == id){
          this.taskListDays[this.currIndex1].task_content_list[this.currIndex2].task_content_example_list.splice(i,1);
        }
      })
    },
    //保存操作本地已选示例弹窗
    bindNewTask3(){
      this.dialogFormVisible7 = false;
    },
    deltask(i){
      this.campTimesTaskInfo.task_prize.award_list.splice(i,1);
    },
    deltasks(i){
      this.campTimesTaskInfo.task_example.task_example_list.splice(i,1);
    },
    saveSubmit(){
      //判断必填项不能为空
      if(!this.timeValue.length){
        this.$message({
          message: '任务时间不能为空，请检查！',
          type: 'warning'
        });
        return false;
      }else if(!this.campTimesTaskInfo.times_task_info.task_show_title || !this.campTimesTaskInfo.times_task_info.task_show_rules || 
      !this.campTimesTaskInfo.times_task_info.task_calendar_title){
        this.$message({
          message: '小程序端任务展示说明不能为空，请检查！',
          type: 'warning'
        });
        return false;
      }else if(!this.campTimesTaskInfo.times_task_info.face_img_url){
        this.$message({
          message: '任务封面图不能为空，请检查！',
          type: 'warning'
        });
        return false;
      }else if(!this.campTimesTaskInfo.times_task_info.task_rule_content){
        this.$message({
          message: '任务活动规则不能为空，请检查！',
          type: 'warning'
        });
        return false;
      }else if(this.campTimesTaskInfo.task_example.task_example_list.length < 1){
        this.$message({
          message: '任务示例不能为空，请检查！',
          type: 'warning'
        });
        return false;
      }else{
        // this.getTaskContentList();
        
        //任务基本信息处理
        this.campTimesTaskInfo.times_task_info.camp_times_id = this.camp_times_info.camp_times_id;
        this.campTimesTaskInfo.times_task_info.task_start_time = this.timeValue[0];
        this.campTimesTaskInfo.times_task_info.task_end_time = this.timeValue[1];
        this.campTimesTaskInfo.times_task_info.rank_start_time = this.timeValue2[0];
        this.campTimesTaskInfo.times_task_info.rank_end_time = this.timeValue2[1];
        this.campTimesTaskInfo.times_task_info.give_prize_time = this.timeValue3;

        //日期时间处理
        this.options4 = [];
        let days = this.formatEveryDay(this.campTimesTaskInfo.times_task_info.task_start_time,this.campTimesTaskInfo.times_task_info.task_end_time);
        days.forEach(v=>{
          this.options4.push({
            label: v,
            value: v,
            is_selected: false
          })
        })

        // console.log('saveSubmit',this.campTimesTaskInfo);
        if(this.campTimesTaskInfo.times_task_info.times_task_id){
          //编辑更新
          updateTimesTask(this.campTimesTaskInfo).then(res => {
            if (res.code == 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.active = 2;
              this.campTimesTaskInfo.times_task_info.times_task_id = 
              res.result.times_task_id || this.campTimesTaskInfo.times_task_info.times_task_id;
              setTimeout(() => {
                this.getTaskContentList();
              }, 800);
            }
          });
        }else{
          //新建
          insertTimesTask(this.campTimesTaskInfo).then(res => {
            if (res.code == 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.active = 2;
              this.campTimesTaskInfo.times_task_info.times_task_id = 
              res.result.times_task_id || this.campTimesTaskInfo.times_task_info.times_task_id;
              setTimeout(() => {
                this.getTaskContentList();
              }, 800);
            }
          });
        }
      }
    },
    
    //第二步获取详情
    getTaskContentList(){
      getTaskContentList({ 
        camp_times_id: this.campTimesTaskInfo.times_task_info.camp_times_id,
        times_task_id: this.campTimesTaskInfo.times_task_info.times_task_id
      }).then(res => {
        if (res.code == 200) {
          function getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
              month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
          }
          // this.taskListDays = res.result;
          let a = [],b=[];
          res.result.forEach(v=>{
            v.task_content_time_info.is_edit = true;
              a.push(
                {
                  task_content_time_info: v.task_content_time_info,
                  task_content_list: v.task_content_list
                }
              )
          })
          b = a;
          b.forEach(m=>{
            m.task_content_list.forEach(k=>{
              m.task_content_list.push(
                {
                  "task_content_info": {
                    "task_id": k.task_id,
                    "task_category": k.task_category,
                    "task_category_name": k.task_category_name,
                    "task_img_url": k.task_img_url,
                    "task_content": k.task_content,
                    "times_task_content_id": k.times_task_content_id,
                    "task_content_analysis": k.task_content_analysis
                  }
                }
              )
            })
          })
          let c = b;
          for (let k = 0; k < c.length; k++) {
            for (var i = c[k].task_content_list.length-1;i >= 0 ;i--) {
              if (c[k].task_content_list[i].task_category) {
                c[k].task_content_list.splice(i,1);
              }
            }
          }
          this.taskListDays = c;
          this.taskListDays.forEach(v=>{
            this.options4.forEach(k=>{
              if(v.task_content_time_info.task_content_time == k.value){
                k.is_selected = true;
              }
            })
            if( getNowFormatDate() >= v.task_content_time_info.task_content_time ){
              v.task_content_time_info.is_canEditDay = true;
            }else{
              v.task_content_time_info.is_canEditDay = false;
            }
          })
          this.options4.forEach(k=>{
            if(getNowFormatDate() >= k.value){
              k.is_selected = true;
            }
          })
          // console.log('第二步获取详情',this.taskListDays);
        }
      })
    },  
    getPromoList(){
      this.option2 = [];
      getPromoList({ status_code: "",page_no: 1,page_size: 250 }).then(res => {
        if (res.code == 200) {
          res.result.rows.forEach( v => {
            this.option2.push({
              title:v.card_name,
              id: v.card_code,
              conditions: v.at_least || 0,
              denominations: v.card_value,
              coupon_type: '2',
              at_least: v.at_least || 0
            })
          })
        }
      })
    },
    getCouponList(){
      getCouponList({ kdt_id: '1655766', group_type: '9', page_no: 1, page_size: 250 }).then(res => {
        if (res.code == 200) {
          this.option2 = res.result.rows;
        }
      })
    },
    changeType(v){
      this.option2 = [];
      if(v == '1'){
        this.couponValue = '';
        this.getCouponList();
      }else{
        this.couponValue = '';
        this.getPromoList();
      }
    },
    //获取优惠券列表
    remoteMethod(query) {
      if (query !== '') {
        this.option2 = [];
        this.loading = true;
        if(this.prizeform.coupon_type == '1'){
          getCouponList({ kdt_id: '1655766', group_type: '9', page_no: 1, page_size: 250,coupon_name: query }).then(res => {
            if (res.code == 200) {
              this.loading = false;
              this.option2 = res.result.rows;
            }
          })
        }else{
          getPromoList({ status_code: "",page_no: 1, page_size: 250,card_name: query }).then(res => {
            if (res.code == 200) {
              this.loading = false;
              res.result.rows.forEach( v => {
                this.option2.push({
                  title:v.card_name,
                  id: v.card_code,
                  conditions: v.at_least || 0,
                  denominations: v.card_value,
                  coupon_type: '2',
                  at_least: v.at_least || 0,
                })
              })
            }
          })
        }
      } else {
        this.option2 = [];
      }
    },
    delDay(i,day){
      this.taskListDays.splice(i,1);
      this.options4.forEach(v=>{
        if(day == v.label){
          v.is_selected = false;
        }
      })
    },
    editTargetDay(i,d){
      this.taskListDays[i].task_content_time_info.is_edit = !this.taskListDays[i].task_content_time_info.is_edit;
      this.originDay = d;
    },
    cancelEditDay(i){
      if(this.originDay == this.taskListDays[i].task_content_time_info.task_content_time){
      }else{
        this.taskListDays.forEach(v=>{
          this.options4.forEach(k=>{
            if(v.task_content_time_info.task_content_time == k.value){
              k.is_selected = true;
            }
            if(k.value == this.originDay){
              k.is_selected = false;
            }
          })
        })
      }
      this.taskListDays[i].task_content_time_info.is_edit = true;
      this.taskListDays = this.sortDays(this.taskListDays);
    },
    editDays(v){
      this.curreditDay = v;
    },
    cancelSubmit2(){
      this.active = 1;
      this.getTimesTaskData();
    },
    saveSubmit2(){
      if(this.campTimesTaskInfo.times_task_info.times_task_id){
        let bool = true;
        this.taskListDays.forEach((v,i)=>{
          v.task_content_time_info.target_day = (i+1).toString();
          if(v.task_content_list.length<1){
            bool = false;
          }
        })
        if(bool){
          let datas = {
            "times_task_info": {
              camp_times_id: this.campTimesTaskInfo.times_task_info.camp_times_id,
              times_task_id: this.campTimesTaskInfo.times_task_info.times_task_id,
            },
            "task_content": this.taskListDays
          }
          insertTimesTaskContent(datas).then(res => {
            if (res.code == 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.$router.go(-1);
            }
          });
        }else{
          this.$message({
            message: '目标天数下任务不能为空，请检查！',
            type: 'warning'
          });
        }
      }else{
        this.$message({
          message: '请先检查保存第一步信息的提交！',
          type: 'warning'
        });
      }
    },
    selectInit(row,index){
      if(row.status == '1'){
        //可选
         return true;
      }else{    
         return false;
      }
    },
    chooseTaskUser(){
      this.dialogFormVisible2=true;
      this.listQuery.page_num = 1;
      this.TaskUserCompleted();
    },
    TaskUserCompleted(){
      TaskUserCompleted(this.listQuery).then(res => {
        if (res.code == 200) {
          this.total = Number(res.result.sign.count);
          //过滤已选择的
          for (var i = res.result.userList.length-1;i >= 0 ;i--) {
            res.result.userList[i].status = '1';
            for (var j = this.campTimesTaskInfo.task_example.task_example_list.length-1;j >= 0 ;j--) {
              if(res.result.userList[i].task_submit_id == this.campTimesTaskInfo.task_example.task_example_list[j].task_submit_id){
                // res.result.userList.splice(i,1);
                res.result.userList[i].status = '2';
              }
            }
          }
          this.goodsData = res.result.userList;
        }
      });
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
    handleAvatarSuccess(res, file) {
      this.campTimesTaskInfo.times_task_info.face_img_url = res.result.urlFile;
    },
    handleAvatarSuccess2(res, file) {
      this.prizeform.prize_img = res.result.urlFile;
    },
    changeType1(v){},
    changeType2(v){},
    handleSelectionChange1(val) {
      this.multipleSelection1 = val;
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
    },
    handleSelectionChange4(val) {
      this.multipleSelection4 = val;
    },
    searchList(){
      this.listQuery.page_num = 1;
      this.TaskUserCompleted();
    },
    changePaging(){
      this.TaskUserCompleted();
    },
    searchList1(){
      this.listQuery1.page_num = 1;
      this.taskLibraryList();
    },
    changePaging1(){
      this.taskLibraryList();
    },
    searchList2(){
      this.listQuery2.page_num = 1;
      this.getList();
    },
    changePaging2(){
      this.getList();
    },
    // sortDays(p){
    //   return function(a,b){
	  //       var value1 = a[property];
	  //       var value2 = b[property];
	  //       return  value2 - value1;
	  //   }
    // }
    //日期降序排列
    sortDays(arr) {
      return arr.sort(function (a, b) {
        return a.task_content_time_info.task_content_time > b.task_content_time_info.task_content_time ? 1 : -1;
      });
    },
    formatEveryDay(start,end){
      function getDate(datestr) {
        var temp = datestr.split("-");
        var date = new Date(temp[0], temp[1] - 1, temp[2]);
        return date;
      }

      let dateList = [];
      var startTime = getDate(start);
      var endTime = getDate(end);
      while ((endTime.getTime() - startTime.getTime()) >= 0) {
        var year = startTime.getFullYear();
        var month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1;
        var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
        dateList.push(year + "-" + month + "-" + day);
        startTime.setDate(startTime.getDate() + 1);
      }
      return dateList;
    },
    timeFormat() {
      this.timeDisabled = Boolean(getNowFormatDate() >= this.campTimesTaskInfo.times_task_info.task_start_time);
      function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      }
      function daysBetween(sDate1, sDate2) {
        var time1 = Date.parse(new Date(sDate1));
        var time2 = Date.parse(new Date(sDate2));
        var nDays = Math.abs(parseInt((time2 - time1) / 1000 / 3600 / 24)) + 1;
        return nDays;
      };
      function formatEveryDay(start, end) {
        let dateList = [];
        var startTime = getDate(start);
        var endTime = getDate(end);
        while ((endTime.getTime() - startTime.getTime()) >= 0) {
          var year = startTime.getFullYear();
          var month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1;
          var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
          dateList.push(year + "-" + month + "-" + day);
          startTime.setDate(startTime.getDate() + 1);
        }
        return dateList;
      }
      function getDate(datestr) {
        var temp = datestr.split("-");
        var date = new Date(temp[0], temp[1] - 1, temp[2]);
        return date;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.taskManagement{
  padding: 20px;
  .subtitle{
    height: 70px;
    border: 1px solid #333;
    line-height: 55px;
    p{
      margin: 8px 0;
      text-indent: 30px;
      span{
        margin-left: 20px;
      }
    }
  }
  .newaddend_container {
    .newaddend_container_header {
      height: 45px;
      margin:10px 0 5px 0;
      p {
        width: 100%;
        height: 45px;
        line-height: 45px;
        background: rgb(228, 228, 228);
        display: flex;
        justify-content: space-around;
        margin: 0;
        span {
          cursor: pointer;
        }
      }
    }
    .newaddend_content1 {
      margin-bottom: 50px;
      h4{
        margin: 13px 0;
      }
      .isHidden{
        visibility: hidden !important;
      }
      .submitButtons{
        position: fixed;
        left: 45%;
        bottom: 10px;
      }
      .award_list{
        .award_list_content{
          width: 100%;
          min-height: 40px;
          display: flex;
          justify-content: space-around;
          align-items: flex-start;
          background: rgb(235, 235, 235);
          margin: 5px 0;
          &:hover b{
            visibility: visible;
          }
          h5{
            width:16%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 13px;
            margin: 8px 0;
          }
          section{
            min-height: 50px;
            line-height: 20px;
            width:560px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            p{
              width: 500px;
              float: left;
              margin-left: 15px;
            }
          }
          aside{
            width:560px;
            p{
              margin: 8px 0;
            }
            i{
              font-style: normal;
            }
            span{
              display: inline-block;
              width: 60px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              background: lightgray;
            }
          }
          b{
            float: right;
            margin-left: 10px;
            visibility: hidden;
            cursor: pointer;
          }
          
        }
      }
      .task_example_list{
        // height: 40px;
        .task_example_list_content{
          margin: 5px 0;
          height: 60px;
          background: rgb(235, 235, 235);
          display: flex;
          justify-content: space-around;
          align-items: center;
          b{
            width: 80px;
          }
          span{
            width: auto;
          }
          p{
            width: 680px;
            height: 50px;
            line-height: 17px;
            font-style: normal;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;     
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }
      ul {
        width: 500px;
        list-style: none;
        padding: 0;
        li {
          height: 20px;
          line-height: 20px;
          overflow: hidden;
          position: relative;
          em{
            font-style: normal;
            font-size: 12px;
            width: 80px;
            height: 20px;
            text-align: center;
            display: inline-block;
            background: lightgray;
          }
          b{
            font-weight: 400;
          }
          span {
            width: 220px;
          }
          i {
            visibility: hidden;
            // position: absolute;
            // top: 8px;
            // right: 5px;
          }
          &:hover i {
            visibility: visible;
          }
        }
      }
    }
    .newaddend_content2 {
      width: 100%;
      .isHidden{
        // visibility: hidden !important;
        display: none !important;
      }
      .newaddend_content2_title{
        height: 45px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        p{
          width: 30%;
          font-size: 16px;
          font-weight: bold;
        }
      }
      .task_lists{
        width: 100%;
        margin-bottom: 35px;
        .task_lists_content{
          margin-bottom: 30px;
          i{
            font-style: normal;
            cursor: pointer;
          }
          h5{
            width: 100%;
            height: 40px;
            line-height: 40px;
            background: rgb(241, 240, 240);
            font-size: 15px;
            margin: 10px 0;
            padding:0 20px;
            .el-icon-delete {
              font-size: 18px;
              float: right;
              margin:13px 25px 0 0;
              color: #333;
            }
            i{
              float: right;
              margin-left: 10px;
              color:#409EFF;
              font-weight: 400;
            }
          }
          .task_content_list{
            .task_content_list_content{
              height: 60px;
              margin: 5px 0;
              background: rgb(235, 235, 235);
              display: flex;
              justify-content: space-around;
              align-items: center;
              h6{
                font-size: 15px;
                height: 40px;
                width: auto;
                min-width: 70px;
                text-align: center;
                line-height: 40px;
                border-right: 1px solid #333;
              }
              img{
                display: inline-block;
              }
              b{
                display: inline-block;
                width: 730px;
                // height: 55px;
                font-size: 12.5px;
                overflow: hidden;
                text-overflow: ellipsis;     
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                cursor: pointer;
              }
              p{
                width: 175px;
                height: 50px;
                font-size: 14px;
                // margin-left: 10px;
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                align-items: center;
                span{
                  cursor: pointer;
                  margin:0 10px;
                }
              }
            }
          }
        }
      }
      .newaddend_content2_options{
        margin-bottom: 40px;
      }
      .submitButtons2{
        position: fixed;
        left: 45%;
        bottom: 10px;
      }
    }
  }
}
</style>
<style lang="scss">
.taskManagement {
  .avatar-uploader .el-upload{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
  .el-dialog__body{
    padding: 5px 20px;
  }
  .elTableColumn{
    overflow: hidden;
    text-overflow: ellipsis;     
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .el-popper{
    height: auto;
    // min-height: 200px;
    max-height: 400px; 
    overflow: auto;
  }
}
</style>
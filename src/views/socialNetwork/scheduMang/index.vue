<template>
  <div class="app-container">
    <el-col
      :span="24"
      class="table-wrap"
    >
      <el-col
        :span="24"
        class="title-header"
      >
        <el-col :span="4">
          <el-select
            size="small"
            @change="changeStatus"
            v-model="listQuery.status"
            placeholder="全部"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col
          :span="5"
          style="padding:0 20px;"
          align="center"
        >
          <el-input
            size="small"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="listQuery.group_name"
            @keyup.enter.native="search"
          ></el-input>
        </el-col>
        <el-col
          :span="5"
          style="padding:0 20px;"
          align="center"
        >
          <el-input
            size="small"
            placeholder="请输入角色名"
            prefix-icon="el-icon-search"
            v-model="listQuery.nickname "
            @keyup.enter.native="search"
          ></el-input>
        </el-col>
        <el-col
          :span="7"
          align="right"
        >
          <el-button
            size="small"
            type="primary"
            @click="goNews(0,0)"
          >添加排班</el-button>
        </el-col>
        <el-col
          :span="2"
          align="right"
        >
          <a :href="processHost + 'tutorship/scheduling/schedulingList?output=1&special=skip&page_size='+listQuery.page_size+'&group_name='+listQuery.group_name+'&page_num='+listQuery.page_num+'&status='+listQuery.status+'&nickname='+listQuery.nickname" class="export-form">导出</a>
        </el-col>
      </el-col>

      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        size="mini"
        highlight-current-row
        align="middle"
      >
        <el-table-column label="序号">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="排班明细（群名称）">
          <template slot-scope="scope">
            <span style="padding:0 5px;">{{ scope.row.group_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建">
          <template slot-scope="scope">{{ scope.row.create_system_name }}</template>
        </el-table-column>
        <el-table-column
          label="角色名"
          align="center"
        >
          <template slot-scope="scope">
            <el-col v-for="(item,index) in scope.row.persons" :key="index">{{ item.group_name}}：{{item.nickname}}</el-col>
          </template>
        </el-table-column>
        <el-table-column
          class-name="status-col"
          label="预计（天）"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.except_days }}</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="status-col"
          label="开始时间"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.start_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="status-col"
          label="结束时间"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.end_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="status-col"
          label="状态"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">已关闭</span>
            <span v-if="scope.row.status==2">排期中</span>
            <span v-if="scope.row.status==3">进行中</span>
            <span v-if="scope.row.status==4">已过期</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status!=1"
              size="small"
              type="text"
              @click="goNews(scope.row.scheduling_id,scope.row.status)"
            >变更</el-button>
            <el-button
              v-if="scope.row.status==4||scope.row.status==3"
              size="small"
              type="text"
              @click="closeScheduAlert(scope.row.scheduling_id)"
            >关闭</el-button>
            <el-button
              v-if="scope.row.status==1"
              size="small"
              type="text"
              @click="catSchedu(scope.row.scheduling_id)"
            >查看</el-button>
            <el-button
              v-if="scope.row.status==2"
              size="small"
              type="text"
              @click="delSchedu(scope.$index,scope.row.scheduling_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page_num"
        :limit.sync="listQuery.page_size"
        v-on:pagination="getList"
      />
    </el-col>
    <el-row
      align="center"
      class="alert-wrap"
      v-if="showAlertWrap"
    >
      <el-col
        :span="15"
        class="alert-content-wrap"
      >
        <el-col
          :span="24"
          class="alert-title"
          align="right"
        >
          <i
            class="el-icon-circle-close"
            @click="closeAlert"
          ></i>
        </el-col>
        <el-col
          :span="24"
          class="alert-content"
        >
          <el-col v-if="close">
            <el-col style="margin-bottom:10px;">备注：</el-col>
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 8}"
              placeholder="请输入内容"
              v-model="closeForm.remarks"
            ></el-input>
            <el-button
              class="submit-close-btn"
              size="small"
              type="primary"
              @click="submitDesc"
            >关闭</el-button>
          </el-col>
          <el-col v-else>
            <el-col style="margin-bottom:10px;">备注：</el-col>
            <el-col class="alert-desc">{{closeForm.remarks}}</el-col>
          </el-col>
        </el-col>
      </el-col>
    </el-row>
    <el-row
      class="add-alert-wrap"
      v-if="addWrap"
      @click.native.self="onCancel"
    >
      <!-- 新建排班 -->
      <el-col
        :span="24"
        class="add-content-wrap"
        v-if="edit==0"
      >
        <i
          class="el-icon-close icon-close"
          @click="onCancel"
        ></i>
        <el-col class="add-content-title">排班管理</el-col>
        <el-col class="add-form-wrap">
          <el-form
            ref="form"
            size="small"
            :rules="rules"
            :model="form"
            label-width="140px"
          >
            <el-form-item
              label="训练营名称："
              prop="good_id"
            >
              <el-select
                prop="group_id"
                v-model="goods"
                placeholder="请选择训练营类型"
                @change="handleCamp"
              >
                <el-option
                  v-for="item in campOptions"
                  :key="item.goods_id"
                  :label="item.goods_name"
                  :value='`{"goods_id":"${item.goods_id}","goods_name":"${item.goods_name}"}`'
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              prop="group_name"
              label="群名称："
            >
              <el-input
                v-model="form.group_name"
                :autosize="{ minRows: 5, maxRows: 5}"
                placeholder="请输入群名称"
              />
            </el-form-item>
            <!-- 时间段 -->
            <el-form-item
              label="开始/结束时间："
              prop="time_slot"
            >
              <el-date-picker
                size="small"
                v-model="form.time_slot"
                type="daterange"
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="timeChange"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input
                type="textarea"
                v-model="form.remarks"
              />
            </el-form-item>
            <el-form-item
              label="选择人员/角色："
              required
            >
              <el-row v-for="(item,index) in form.persons" :key="index">
                <el-col :span="8">
                  <el-form-item
                    :prop="`persons.${index}.user_uuid`"
                    :rules="rules.nickname"
                  >
                    <!-- multiple -->
                    <el-select
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="remoteMethod"
                      :loading="counselorLoading"
                      v-model="item.user_uuid"
                      @change="getScheduleUserStatus(item.user_uuid,index)"
                      placeholder="请选择辅导员"
                    >
                      <el-option
                        v-for="counselorItem in counselorOptions"
                        :key="counselorItem.user_uuid"
                        :label="counselorItem.nickname + counselorItem.mobile"
                        :value="counselorItem.user_uuid"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :prop="`persons.${index}.group_id`"
                    :rules="rules.group_id"
                  >
                    <el-select
                      v-model="item.group_id"
                      placeholder="请选择群角色"
                    >
                      <el-option
                        v-for="roleItem in groupRoles"
                        :key="roleItem.group_id"
                        :label="roleItem.group_role"
                        :value="roleItem.group_id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1">
                  <i
                    v-if="index===0"
                    @click="addRole"
                    class="icon el-icon-circle-plus-outline"
                  ></i>
                  <i
                    v-else
                    @click="removeRole(index)"
                    class="icon el-icon-remove-outline"
                  ></i>
                </el-col>
                <el-col v-if="item.scheduList&&item.scheduList.length">
                  <el-col>
                    岗位职责：{{item.station.first_station_name}}/{{item.station.second_station_name}}
                  </el-col>
                  <el-col v-for="(scheduItem,scheduIndex) in item.scheduList" :key="scheduIndex">
                    TA目前正在参与<span style="color:red;">“{{scheduItem.group_name}}”</span>，距离空闲还有{{scheduItem.diffrence_day}}天；请慎重选择
                  </el-col>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              prop="poster_img"
              label="海报："
            >
              <el-col :span="8">
                <el-upload
                  class="avatar-uploader"
                  :action="host"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img
                    v-if="form.poster_img"
                    :src="form.poster_img"
                    class="avatar"
                  >
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                  ></i>
                </el-upload>
              </el-col>
              <el-col
                :span="10"
                class="input-prompt"
              >图片上传格式为：gif、jpg、png、jpeg；建议尺寸750像素 X 1334像素</el-col>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit('form')"
              >确定</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-col>
      <!-- 进行中变更排班edit=3 -->
      <el-col
        :span="24"
        class="add-content-wrap"
        v-else-if="edit==3"
      >
        <i
          class="el-icon-close icon-close"
          @click="onCancel"
        ></i>
        <el-col class="add-content-title">排班管理</el-col>
        <el-col class="add-form-wrap">
          <el-form
            ref="editForm"
            size="small"
            :rules="rules"
            :model="editForm"
            label-width="140px"
          >
            <el-form-item
              label="训练营名称："
              required
            >{{editForm.good_name}}</el-form-item>
            <el-form-item
              required
              label="群名称："
            >{{editForm.group_name}}</el-form-item>
            <!-- 时间段 -->
            <el-form-item
              label="开始/结束时间："
              prop="time_slot"
            >
              <el-date-picker
                v-model="editForm.time_slot[0]"
                type="date"
                value-format="yyyy-MM-dd"
                disabled
                placeholder="选择日期"
              ></el-date-picker>—
              <el-date-picker
                v-model="editForm.time_slot[1]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input
                type="textarea"
                v-model="editForm.remarks"
              />
            </el-form-item>
            <el-form-item
              label="选择人员/角色："
              required
            >
              <el-row v-for="(item,index) in editForm.persons" :key="index">
                <el-col :span="8">
                  <el-form-item
                    :prop="`persons.${index}.user_uuid`"
                    :rules="rules.nickname"
                  >

                    <el-select
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="remoteMethod"
                      :loading="counselorLoading"
                      v-model="item.user_uuid"
                      @change="getScheduleUserStatus(item.user_uuid,index)"
                      placeholder="请选择辅导员"
                    >

                      <el-option
                        v-for="counselorItem in counselorOptions"
                        :key="counselorItem.user_uuid"
                        :label="counselorItem.nickname + counselorItem.mobile"
                        :value="counselorItem.user_uuid"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :prop="`persons.${index}.group_id`"
                    :rules="rules.group_id"
                  >
                    <el-select
                      v-model="item.group_id"
                      placeholder="请选择群角色"
                    >
                      <el-option
                        v-for="roleItem in groupRoles"
                        :key="roleItem.group_id"
                        :label="roleItem.group_role"
                        :value="roleItem.group_id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1">
                  <i
                    v-if="index===0"
                    @click="addRoleEdit"
                    class="icon el-icon-circle-plus-outline"
                  ></i>
                  <i
                    v-else
                    @click="removeRoleEdit(index)"
                    class="icon el-icon-remove-outline"
                  ></i>
                </el-col>
                <el-col v-if="item.scheduList&&item.scheduList.length">
                  <el-col>
                    岗位职责：{{item.station.first_station_name}}/{{item.station.second_station_name}}
                  </el-col>
                  <el-col v-for="(scheduItem,scheduIndex) in item.scheduList" :key="scheduIndex">
                    TA目前正在参与<span style="color:red;">“{{scheduItem.group_name}}”</span>，距离空闲还有{{scheduItem.diffrence_day}}天；请慎重选择
                  </el-col>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              prop="poster_img"
              label="海报："
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
                    v-if="editForm.poster_img"
                    :src="editForm.poster_img"
                    class="avatar"
                  >
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                  ></i>
                </el-upload>
              </el-col>
              <el-col
                :span="18"
                class="input-prompt"
              >图片上传格式为：gif、jpg、png、jpeg；建议尺寸750像素 X 1334像素</el-col>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit('editForm')"
              >确定</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-col>
      <!-- 排期中变更 edit=2 -->
      <el-col
        :span="24"
        class="add-content-wrap"
        v-else-if="edit==2"
      >
        <i
          class="el-icon-close icon-close"
          @click="onCancel"
        ></i>
        <el-col class="add-content-title">排班管理</el-col>
        <el-col class="add-form-wrap">
          <el-form
            ref="scheduleForm"
            size="small"
            :rules="rules"
            :model="scheduleForm"
            label-width="140px"
          >
            <el-form-item
              label="训练营名称："
              prop="good_id"
            >
              <el-select
                prop="group_id"
                v-model="scheduleGoods"
                placeholder="请选择训练营类型"
                @change="handleSchedule"
              >
                <el-option
                  v-for="item in campOptions"
                  :key="item.goods_id"
                  :label="item.goods_name"
                  :value='`{"goods_id":"${item.goods_id}","goods_name":"${item.goods_name}"}`'
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              prop="group_name"
              label="群名称："
            >
              <el-input
                v-model="scheduleForm.group_name"
                :autosize="{ minRows: 5, maxRows: 5}"
                placeholder="请输入群名称"
              />
            </el-form-item>
            <!-- 时间段 -->
            <el-form-item
              label="开始/结束时间："
              prop="time_slot"
            >
              <el-date-picker
                size="small"
                v-model="scheduleForm.time_slot"
                type="daterange"
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="timeChange"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input
                type="textarea"
                v-model="scheduleForm.remarks"
              />
            </el-form-item>
            <el-form-item
              label="选择人员/角色："
              required
            >
              <el-row v-for="(item,index) in scheduleForm.persons" :key="index">
                <el-col :span="8">
                  <el-form-item
                    :prop="`persons.${index}.user_uuid`"
                    :rules="rules.nickname"
                  >
                    <el-select
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="remoteMethod"
                      :loading="counselorLoading"
                      v-model="item.user_uuid"
                      @change="getScheduleUserStatus(item.user_uuid,index)"
                      placeholder="请选择辅导员"
                    >
                      <el-option
                        v-for="counselorItem in counselorOptions"
                        :key="counselorItem.user_uuid"
                        :label="counselorItem.nickname + counselorItem.mobile"
                        :value="counselorItem.user_uuid"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :prop="`persons.${index}.group_id`"
                    :rules="rules.group_id"
                  >
                    <el-select
                      v-model="item.group_id"
                      placeholder="请选择群角色"
                    >
                      <el-option
                        v-for="roleItem in groupRoles"
                        :key="roleItem.group_id"
                        :label="roleItem.group_role"
                        :value="roleItem.group_id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1">
                  <i
                    v-if="index===0"
                    @click="addRole"
                    class="icon el-icon-circle-plus-outline"
                  ></i>
                  <i
                    v-else
                    @click="removeRole(index)"
                    class="icon el-icon-remove-outline"
                  ></i>
                </el-col>

                <el-col v-if="item.scheduList&&item.scheduList.length">
                  <el-col>
                    岗位职责：{{item.station.first_station_name}}/{{item.station.second_station_name}}
                  </el-col>
                  <el-col v-for="(scheduItem,idx) in item.scheduList" :key="idx">
                    TA目前正在参与<span style="color:red;">“{{scheduItem.group_name}}”</span>，距离空闲还有{{scheduItem.diffrence_day}}天；请慎重选择
                  </el-col>
                </el-col>
              </el-row>

            </el-form-item>

            <el-form-item
              prop="poster_img"
              label="海报："
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
                    v-if="scheduleForm.poster_img"
                    :src="scheduleForm.poster_img"
                    class="avatar"
                  >
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                  ></i>
                </el-upload>
              </el-col>
              <el-col
                :span="18"
                class="input-prompt"
              >图片上传格式为：gif、jpg、png、jpeg；建议尺寸750像素 X 1334像素</el-col>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit('scheduleForm')"
              >确定</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-col>
      <!-- 已过期变更 edit=4 -->
      <el-col
        :span="24"
        class="add-content-wrap"
        v-else-if="edit==4"
      >
        <i
          class="el-icon-close icon-close"
          @click="onCancel"
        ></i>
        <el-col class="add-content-title">排班管理</el-col>
        <el-col class="add-form-wrap">
          <el-form
            ref="expiredForm"
            size="small"
            :rules="rules"
            :model="expiredForm"
            label-width="140px"
          >
            <el-form-item
              label="训练营名称："
              required
            >{{expiredForm.good_name}}</el-form-item>
            <el-form-item
              required
              label="群名称："
            >{{expiredForm.group_name}}</el-form-item>
            <!-- 时间段 -->
            <el-form-item
              label="开始/结束时间："
              prop="time_slot"
            >
              <el-date-picker
                v-model="expiredForm.time_slot[0]"
                type="date"
                value-format="yyyy-MM-dd"
                disabled
                placeholder="选择日期"
              ></el-date-picker>—
              <el-date-picker
                v-model="expiredForm.time_slot[1]"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                disabled
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input
                type="textarea"
                v-model="expiredForm.remarks"
              />
            </el-form-item>
            <el-form-item
              label="选择人员/角色："
              required
            >
              <el-row v-for="(item,index) in expiredForm.persons" :key="index">
                <el-col :span="8">
                  <el-form-item
                    :prop="`persons.${index}.user_uuid`"
                    :rules="rules.nickname"
                  >
                    <el-select
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="remoteMethod"
                      :loading="counselorLoading"
                      v-model="item.user_uuid"
                      @change="getScheduleUserStatus(item.user_uuid,index)"
                      placeholder="请选择辅导员"
                    >
                      <el-option
                        v-for="counselorItem in counselorOptions"
                        :key="counselorItem.user_uuid"
                        :label="counselorItem.nickname + counselorItem.mobile"
                        :value="counselorItem.user_uuid"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :prop="`persons.${index}.group_id`"
                    :rules="rules.group_id"
                  >
                    <el-select
                      v-model="item.group_id"
                      placeholder="请选择群角色"
                    >
                      <el-option
                        v-for="roleItem in groupRoles"
                        :key="roleItem.group_id"
                        :label="roleItem.group_role"
                        :value="roleItem.group_id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1">
                  <i
                    v-if="index===0"
                    @click="addRole"
                    class="icon el-icon-circle-plus-outline"
                  ></i>
                  <i
                    v-else
                    @click="removeRole(index)"
                    class="icon el-icon-remove-outline"
                  ></i>
                </el-col>
                <el-col v-if="item.scheduList&&item.scheduList.length">
                  <el-col>
                    岗位职责：{{item.station.first_station_name}}/{{item.station.second_station_name}}
                  </el-col>
                  <el-col v-for="(scheduItem,index) in item.scheduList" :key="index">
                    TA目前正在参与<span style="color:red;">“{{scheduItem.group_name}}”</span>，距离空闲还有{{scheduItem.diffrence_day}}天；请慎重选择
                  </el-col>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              prop="poster_img"
              label="海报："
            >
              <el-col :span="5">
                <img
                  :src="expiredForm.poster_img"
                  class="avatar"
                >
              </el-col>
              <el-col
                :span="18"
                class="input-prompt"
              >图片上传格式为：gif、jpg、png、jpeg；建议尺寸750像素 X 1334像素</el-col>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit('expiredForm')"
              >确定</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getScheduleList, closeSchedule, getGroupRoleList, getCounselorList, getGoods, addSchedule, getCounselorDetail, delSchedule, getScheduleMark, getScheduleUserStatus } from '@/api/counselor'
import Pagination from '@/components/Pagination'
import Sticky from '@/components/Sticky'
import Request from '@/utils/request'
export default {
  components: { Pagination, Sticky },
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
    const host = process.env.BASE_API + 'publicmethod/upfile/upload_file';
    return {
      options: [{ label: "全部", value: '' }, { label: "排期中", value: 2 }, { label: "进行中", value: 3 }, { label: "已过期", value: 4 }, { label: "已关闭", value: 1 }],
      list: [{}], // 此活动关联的商品数据
      listLoading: false,
      total: 0,
      listQuery: {
        status: '',
        page_num: 1,
        page_size: 10,
        group_name: '',
        nickname: ''
      },
      closeForm: {
        scheduling_uuid: '',
        remarks: ''
      },
      close: false,
      showAlertWrap: false,
      addWrap: false,

      // 进行中修改form
      editForm: {
        id: "1",
        scheduling_id: "",
        good_id: "",
        good_name: "",
        group_name: "",
        time_slot: [],
        remarks: "",
        persons: [
          //   {
          //   "user_uuid": "4545454",
          //   "group_id": 1
          // },
          // {
          //   "user_uuid": "2222",
          //   "group_id": 3
          // }
        ],
        poster_img: "",
        create_system_uuid: "",
        create_time: "",
        status: "1",
      },
      // 已过期修改form
      expiredForm: {
        id: "1",
        scheduling_id: "",
        good_name: "",
        group_name: "",
        time_slot: [],
        remarks: "备注",
        persons: [
        ],
        poster_img: "",
        create_system_uuid: "",
        create_time: "",
        status: "1",
      },
      // 排期中form
      scheduleGoods:"",
      scheduleForm: {
        "id": 1,
        "scheduling_id": "",
        "good_id": "1",
        "good_name": "",
        "group_name": "",
        time_slot: [],
        "remarks": "",
        "persons": [],
        "poster_img": "",
        "create_system_uuid": "",
        "create_time": "",
        "status": 1,
        "is_delete": 2,
        "good_name": ""
      },
      // 新建、编辑排班
      // 进入状态
      // 2 排期中 3进行中  4已过期  1已关闭
      edit: 0,
      // 上传图片host
      host,
      // 训练营(商品)
      campOptions: [],
      // 群角色
      groupRoles: [],
      // 辅导员列表
      counselorOptions: [],
      // 群角色list
      roleOptions: [],
      // 远程搜索辅导员
      counselorLoading: false,
      // 用户排班状态list
      userScheduList: [],
      // 提交新建的form值
      goods: '',
      form: {
        good_id: '',
        good_name: '',
        group_name: '',
        scheduling_id: '',
        poster_img: '',
        persons: [{ user_uuid: '', group_id: '' }],
      },
      rules: {
        good_id: [
          {
            required: true, message: '请选择训练营', trigger: 'change'
          }
        ],
        group_name: [
          { required: true, message: '请输入群名称', trigger: 'blur' }
        ],
        time_slot: [
          { required: true, message: '请选择开始/结束时间', trigger: 'change' }
        ],
        nickname: [
          { required: true, message: '请选择辅导员', trigger: 'blur' },
        ],
        poster_img: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        group_id: [
          { required: true, message: '请选择群角色', trigger: 'change' }
        ],
        // exportHost:'',
        processHost: ''
      }
    }
  },
  created() {
    this.processHost = process.env.BASE_API;
    // this.exportHost = process.env.BASE_API + 'tutorship/scheduling/schedulingList?output=1&special=skip&page_size='+this.listQuery.page_size+'&group_name='+this.listQuery.group_name+'&page_num='+this.listQuery.page_num+'&status='+this.listQuery.status+'&nickname='+this.listQuery.nickname;

    // 获取训练营商品
    this.getGoods();
    this.getList();
    // 获取群角色list
    this.getGroupRoleList();
    // 获取用户list
    this.getCounselorList();
  },
  methods: {
    // 获取排版管理列表
    getList() {
      const data = this.listQuery;
      this.listLoading = true;
      // console.log(data)
      getScheduleList(data).then(res => {
        if (res.code == 200) {
          this.list = res.result.list;
          this.total = res.result.sign.count;
          this.listLoading = false;
        }
      })
    },
    // 搜索
    search() {
      this.listQuery.page_num = 1;
      this.getList()
    },
    // 状态选择
    changeStatus() {
      this.listQuery.page_num = 1;
      this.getList()
    },
    // 查看
    catSchedu(scheduling_id) {
      const data = {
        scheduling_uuid: scheduling_id
      }
      getScheduleMark(data).then(res => {
        if (res.code == 200) {
          this.closeForm = res.result;
        }
      })
      this.close = false;
      this.showAlert();
    },
    // 关闭按钮
    closeScheduAlert(id) {
      this.closeForm.scheduling_uuid = id;
      this.close = true;
      this.showAlert();
    },
    // 添加排班
    goNews(scheduling_id, edit) {
      this.edit = edit;
      this.addWrap = true;
      if (scheduling_id === 0) {
        return false;
      }
      this.form.scheduling_id = scheduling_id;
      this.getCounselorDetail();


      // this.$router.push({ path: `./news/${id}` })
    },
    // 删除排班
    delSchedu(index, id) {
      const data = { scheduling_uuid: id }
      this.$confirm('取消后不会保留已输入信息,确认取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSchedule(data).then(res => {
          if (res.code == 200) {
            this.getList();
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        })
      }).catch(() => {
      });
      // this.
    },
    // 显示弹框
    showAlert() {
      this.showAlertWrap = true;
    },
    closeAlert() {
      this.closeForm = {};
      this.showAlertWrap = false;
    },
    // 提交关闭备注
    submitDesc() {
      if (this.closeForm.scheduling_uuid && this.closeForm.remarks) {
        const data = this.closeForm;
        closeSchedule(data).then(res => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '关闭成功'
            })
            this.showAlertWrap = false;
            this.closeForm.scheduling_uuid = '';
            this.closeForm.remarks = '';
            // this.list[index].remarks = { ...this.remarks };
            this.getList();
            // this.list[index].status = '4';
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请填写完整'
        })
      }

    },
    // 获取用户当前排班状态
    getScheduleUserStatus(user_uuid, index) {
      getScheduleUserStatus({ user_uuid }).then(res => {
        if (res.code == 200) {
          // console.log(res, '----排班状态')
          const edit = this.edit;
          if (edit == 2) {
            this.$set(this.scheduleForm.persons[index], 'scheduList', res.result.list)
            this.$set(this.scheduleForm.persons[index], 'station', res.result.station)
            // this.scheduleForm.persons[index].scheduList = res.result.list;
            // this.scheduleForm.persons[index].station = res.result.station;
          } else if (edit == 0) {
            this.$set(this.form.persons[index], 'scheduList', res.result.list)
            this.$set(this.form.persons[index], 'station', res.result.station)
            // this.form.persons[index].scheduList = res.result.list;
            // this.form.persons[index].station = res.result.station;
          } else if (edit == 3) {
            this.$set(this.editForm.persons[index], 'scheduList', res.result.list)
            this.$set(this.editForm.persons[index], 'station', res.result.station)
            // this.editForm.persons[index].scheduList = res.result.list;
            // this.editForm.persons[index].station = res.result.station;
          } else if (edit == 4) {
            this.$set(this.expiredForm.persons[index], 'scheduList', res.result.list)
            this.$set(this.expiredForm.persons[index], 'station', res.result.station)
            // this.expiredForm.persons[index].scheduList = res.result.list;
            // this.expiredForm.persons[index].station = res.result.station;

          }
        }
      })
    },


    // 新建、编辑排班函数
    // 获取群角色
    getGroupRoleList() {
      getGroupRoleList().then(res => {
        if (res.code == 200) {
          this.groupRoles = res.result;
        }
      })
    },
    // 获取辅导员list
    getCounselorList(nickname) {
      const data = {
        is_select: 1,
        nickname,
        page_size: 10000
      }
      getCounselorList(data).then(res => {
        if (res.code == 200) {
          this.counselorOptions = res.result.list;
        }
      })
    },
    // 获取训练营list（训练营）
    getGoods() {
      getGoods().then(res => {
        if (res.code == 200) {
          this.campOptions = res.result.list;
        }
      })
    },
    // 时间段改变
    timeChange() {
      // console.log(this.form.time_slot)
    },
    // 添加角色人员
    //进行中编辑
    addRoleEdit() {
      this.editForm.persons.push({})
    },
    // 新建编辑
    addRole() {
      const edit = this.edit;
      if (edit == 2) {
        this.scheduleForm.persons.push({})
      } else if (edit == 0) {
        this.form.persons.push({})
      } else if (edit == 3) {
        this.editForm.persons.push({})
      } else if (edit == 4) {
        this.expiredForm.persons.push({})
      }

    },
    // 新建排班 选中训练营
    handleCamp(value){
      const data = JSON.parse(value);
      this.form.good_id = data.goods_id;
      this.form.good_name = data.goods_name;
    },
    // 排期中 变更排班 选中训练营
    handleSchedule(value){
      const data = JSON.parse(value);
      this.scheduleForm.good_id = data.goods_id;
      this.scheduleForm.good_name = data.goods_name;
    },
    // 新建删除
    removeRole(index) {
      let arr = [];
      const edit = this.edit;
      if (edit == 2) {
        // this.scheduleForm.persons.push({})
        arr = this.scheduleForm.persons;
        arr.splice(index, 1);
        this.scheduleForm.persons = arr;
      } else if (edit == 0) {
        arr = this.form.persons;
        arr.splice(index, 1);
        this.form.persons = arr;
      } else if (edit == 3) {
        arr = this.editForm.persons;
        arr.splice(index, 1);
        this.editForm.persons = arr;
      } else if (edit == 4) {
        arr = this.expiredForm.persons;
        arr.splice(index, 1);
        this.expiredForm.persons = arr;
      }

    },
    // 进行中编辑删除
    removeRoleEdit(index) {
      let arr = this.editForm.persons;
      arr.splice(index, 1);
      this.editForm.persons = arr;
    },
    // 远程搜索辅导员方法
    remoteMethod(query) {
      this.getCounselorList(query);
      // console.log(query)
    },
    // 上传海报
    handleAvatarSuccess(resData) {
      if (resData.code == 200) {
        if (this.edit) {
          if (this.edit == 2) {
            // 排期中
            this.scheduleForm.poster_img = resData.result.urlFile;
          } else if (this.edit == 3) {
            // 进行中
            this.editForm.poster_img = resData.result.urlFile;
          } else if (this.edit == 4) {
            // 已过期
            this.expiredForm.poster_img = resData.result.urlFile;
          }
        } else {
          this.form.poster_img = resData.result.urlFile;
        }

      }
    },
    // 图片上传之前验证
    beforeAvatarUpload(file) {
      const fileType = file.type;
      let isJPG;
      const isLt2M = file.size / 1024 / 1024 < 4;
      // console.log(fileType)
      if (fileType == 'image/png' || fileType == 'image/jpg' || fileType == 'image/gif' || fileType == 'image/jpeg') {
        isJPG = true;
      } else {
        this.$message.error('上传海报图片只能是 jpg gif png 格式!');
        isJPG = false;
      }
      if (!isLt2M) {
        this.$message.error('上传海报图片大小不能超过 4MB!');
      }
      return isJPG && isLt2M;
    },
    onCancel() {
      this.$confirm('取消后不会保留已输入信息,确认取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.userScheduList = [];
        this.addWrap = false;
      }).catch(() => {
      });
    },

    // s提交
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let form = {};
          if (this.edit) {
            if (this.edit == 2) {
              // 排期中
              form = this.scheduleForm;
            } else if (this.edit == 3) {
              // 进行中
              form = this.editForm;
            } else if (this.edit == 4) {
              // 已过期
              form = this.expiredForm;
            }
          } else {
            form = this.form;
          }
          this.userScheduList = [];
          this.addCounselor(form);
        } else {
          console.log('error submit!!');
          return false;
        }

      });
    },
    // 新建编辑排班
    addCounselor(form) {
      addSchedule(form).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: "提交成功！"
          })

          this.addWrap = false;
          this.form = {
            good_id: '',
            group_name: '',
            scheduling_id: '',
            poster_img: '',
            persons: [{ user_uuid: '', group_id: '' }],
          };
          this.getList();
          // this.$alert('提交成功!', '提示', {
          //   confirmButtonText: '确定',
          //   type: 'success',
          //   center: true
          // }).then(() => {
          //   // this.$router.go(-1)
          // }).catch(() => {
          //   // this.$router.go(-1)
          // })
        }
      })
    },

    // 获取排班信息
    getCounselorDetail() {
      let data = {
        scheduling_id: this.form.scheduling_id
      }
      // console.log(data)
      getCounselorDetail(data).then(res => {

        if (res.code == 200) {
          const data = res.result;
          if (this.edit) {
            if (this.edit == 2) {
              // 排期中
              this.scheduleForm = data;
              const campData = {
                goods_id: data.good_id,
                goods_name: data.good_name
              }
              this.scheduleGoods = JSON.stringify(campData);
            } else if (this.edit == 3) {
              // 进行中
              this.editForm = data;
            } else if (this.edit == 4) {
              // 已过期
              this.expiredForm = data;
            }
          } else {
            this.form = data;
          }
        }

      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
    background-color: rgba(0, 0, 0, 0.5);
    padding: 50px 150px 100px 200px;
  }
  &-content-wrap {
    border-radius: 10px;
    height: 100%;
    width: 100%;
    background-color: #fff;
  }
  &-title {
    background-color: #ededed;
    line-height: 40px;
    padding: 0 10px;
  }
  &-content {
    padding: 30px;
  }
  &-desc {
    border: 1px solid #ededed;
    font-size: 14px;
    font-weight: 500;
    color: rgb(153, 153, 153);
    padding: 10px;
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
.submit-close-btn {
  margin-top: 20px;
}

.icon {
  color: #dedede;
  margin-left: 10px;
  font-size: 25px;
  cursor: pointer;
  &:hover {
    color: #20b6f9;
  }
}
.add-alert-wrap {
  z-index: 1002;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 50px 200px 100px 150px;

  overflow: auto;
  .icon-close {
    position: absolute;
    right: 15px;
    top: 5px;
  }
  .add-content-wrap {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: #fff;
    min-width: 800px;
    border-radius: 10px;
    overflow: auto;
    .add-content-title {
      line-height: 40px;
      text-align: center;
      background-color: #dedede;
    }
    .add-form-wrap {
      padding: 50px;
    }
  }
}

.line {
  text-align: center;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  max-width: 120px;
  /* height: 120px; */
  line-height: 350px;
  text-align: center;
}
.avatar {
  max-width: 120px;
  max-height: 350px;
  display: block;
}
.input-prompt {
  padding: 20px;
}
.export-form{
  color: #fff;
  width: 50px;
  display: block;
  background-color: #409EFF;
  border-color: #409EFF;
  font-size: 12px;
  border-radius: 3px;
  padding: 8px 5px;
  text-align: center;
}
</style>


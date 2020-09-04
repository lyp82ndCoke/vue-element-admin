<template>
  <div class="base_message">
    <el-row>
      <el-form ref="formSign" :model="form" label-width="100px">
        <el-form-item>
          <span slot="label" class="label_name"><i>*</i>签到名称</span>
          <el-col :span="8">
            <el-input v-model="form.sign_name" placeholder="请输入签到名称" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="label_name"><i>*</i>签到日期</span>
          <el-col v-if="!showSingleDate" :span="18">
            <el-date-picker :picker-options="pickerOptions" v-model="dateTime" :unlink-panels="true" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="checkDate"/><span v-if="totalDay > 0" class="check_day">已选 <i class="day_num">{{ totalDay }}</i> 天</span><span v-if="pageType == 'edit'" class="prop_text">（如果延长签到日期，记得添加试题哦！）</span>
          </el-col>
          <el-col v-else :span="18">
            <el-date-picker v-model="dateTime[0]" type="date" disabled placeholder="开始日期" /> 至 <el-date-picker :picker-options="pickerOptions" v-model="editEndTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="结束日期" @change="checkDate" /><span v-if="totalDay > 0" class="check_day">已选 <i class="day_num">{{ totalDay }}</i> 天</span><span v-if="pageType == 'edit'" class="prop_text">（如果延长签到日期，记得添加试题哦！）</span>
          </el-col>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="label_name"><i>*</i>分享标题</span>
          <el-col :span="8">
            <el-input v-model="form.share_title" placeholder="请输入分享标题" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="label_name"><i>*</i>分享描述</span>
          <el-col :span="8">
            <el-input v-model="form.share_intro" type="textarea" placeholder="请输入分享描述" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="label_name"><i>*</i>分享图片</span>
          <el-col :span="8">
            <div class="upload_wrap">
              <el-upload :action="host" :show-file-list="false" :on-success="(val, file) => handleShareSuccess(val, file)" :data="uoloadSignDay" :before-upload="beforeAvatarUpload" class="avatar-uploader share_pic">
                <img v-if="share_img" :src="share_img" class="share_image">
                <i v-else class="el-icon-plus share_uploader_icon" />
              </el-upload>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="label_name"><i>*</i>活动规则</span>
          <el-col :span="18">
            <tinymce v-model="form.sign_rule" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="label_name"><i>*</i>签到广告</span>
          <draggable v-model="ad_list" @start="drag=true" @end="drag=false">
            <div v-for="(item, index) in ad_list" :key="index" class="upload_wrap item_upload">
              <div class="upload_wrap">
                <el-upload :action="host" :show-file-list="false" :on-success="(val, file) => handleAvatarSuccess(val, file, index)" :data="uoloadSignDay" :before-upload="beforeAvatarUpload" class="avatar-uploader sign_adv_upload">
                  <img v-if="item.ad_picture" :src="item.ad_picture" class="adv_image">
                  <i v-else class="el-icon-plus uploader_icon" />
                </el-upload>
                <el-button type="danger" size="mini" circle icon="el-icon-delete" class="upload_button" @click="deleteAdv(index)"/>
              </div>
              <div class="link_wrap">
                <el-col :span="10">
                  跳转链接地址：<el-input v-model="item.ad_skip" placeholder="请输入跳转链接" clearable class="link_url_input"/>
                </el-col>
              </div>
            </div>
          </draggable>
          <div :style="{'margin-top': ad_list.length <= 0 ? '' : '20px'}">
            <el-button type="primary" size="small" @click="addAdvPic"><i class="el-icon-upload el-icon--right" />添加广告图</el-button><span v-if="ad_list.length > 0" class="prop_text">（可拖拽排序）</span>
          </div>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="label_name"><i>*</i>上传海报</span>
          <el-col :span="24">
            <draggable v-model="stencil_list" @start="drag=true" @end="drag=false">
              <div v-for="(item, index) in stencil_list" :key="index" class="upload_template">
                <div class="template_text">模板{{ numberList[index] }}</div>
                <el-upload :action="host" :show-file-list="false" :on-success="(val, file) => handleTemplateSuccess(val, file, index)" :data="uoloadSignDay" :before-upload="beforeAvatarUpload" class="avatar-uploader sign_template_upload">
                  <div v-if="item.stencil_url && item.stencil_flg == 'A'" :style="{'background': item.stencil_url ? `url('${item.stencil_url}')` : ''}" class="template_one" >
                    <div class="user_info">
                      <div class="user_info_head">
                        <div class="user_icon" />
                        <div class="user_message">
                          <span>新家长小A</span>
                          <span>刚刚在【新家长大学】完成了签到</span>
                        </div>
                      </div>
                      <div class="staty_info">
                        <div class="staty_left">
                          <span class="staty_text">累计学习</span>
                          <span class="day_text"><i class="day_num">112</i>天</span>
                        </div>
                        <div class="staty_right">
                          <span class="staty_text">行动力超过</span>
                          <span class="day_text"><i class="day_num">89%</i>的父母</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="item.stencil_url && item.stencil_flg == 'B'" :style="{'background': item.stencil_url ? `url('${item.stencil_url}')` : ''}" class="template_two">
                    <div class="goods_content">要从根本上解决孩子的“网瘾”问题，只能从家庭教育开始。需要家长从根本上改变自己的教育理念和教育技巧。没有家长的改变，就不可能有孩子的改善。------尹建莉</div>
                    <div class="user_info">
                      <div class="user_info_head">
                        <div class="user_icon" />
                        <div class="user_message">
                          <span>新家长小A</span>
                          <span>刚刚在【新家长大学】完成了签到</span>
                        </div>
                      </div>
                      <div class="staty_info">
                        <div class="staty_left">
                          <span class="staty_text">累计学习</span>
                          <span class="day_text"><i class="day_num">112</i>天</span>
                        </div>
                        <div class="staty_right">
                          <span class="staty_text">行动力超过</span>
                          <span class="day_text"><i class="day_num">89%</i>的父母</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="item.stencil_url && item.stencil_flg == 'C'" :style="{'background': item.stencil_url ? `url('${item.stencil_url}')` : ''}" class="template_three">
                    <div class="user_info user_info_three">
                      <div class="user_info_head user_head_three">
                        <div class="user_icon" />
                        <div class="user_message">
                          <span>新家长小A</span>
                          <span style="color:#666 !important;">刚刚在【新家长大学】完成了签到</span>
                        </div>
                      </div>
                      <p class="total_text">打败<span class="parent_num">89%</span>的父母，你敢来挑战吗？</p>
                      <div class="question_wrap">
                        <p class="question_title">当家长跟爷爷奶奶打电话时，爷爷奶奶想跟孩子聊聊但孩子正在玩游戏不愿意聊天，怎么办当家长跟爷爷奶奶打电话时，爷爷奶奶想跟孩子聊聊但孩子正在玩游戏不愿意聊天，怎么办当家长跟爷爷奶奶打电话时，爷爷奶奶想跟孩子聊聊但孩子正在玩游戏不愿意聊天，怎么办当家长跟爷爷奶奶打电话时，爷爷奶奶想跟孩子聊聊但孩子正在玩游戏不愿意聊天，怎么办</p>
                      </div>
                    </div>
                  </div>
                  <i v-else class="el-icon-plus template_icon" />
                </el-upload>
                <div class="upload_wrap thumbnail_wrap">
                  <p class="thumbnail_text">
                    <span class="asterisk_icon">*</span>
                    <span class="asterisk_text">上传缩略图</span>
                  </p>
                  <el-upload :action="host" :show-file-list="false" :on-success="(val, file) => handleThumbnailSuccess(val, file, index)" :data="uoloadSignDay" :before-upload="beforeAvatarUpload" class="avatar-uploader share_pic">
                    <img v-if="item.stencil_thumbnail_url" :src="item.stencil_thumbnail_url" class="share_image">
                    <i v-else class="el-icon-plus share_uploader_icon" />
                  </el-upload>
                </div>
              </div>
            </draggable>
          </el-col>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="label_name"><i>*</i>签到权益</span>
          <el-col :span="18">
            <el-input-number v-model="form.integral_points" :min="1" :max="1000000" label="请输入积分数量"/><span style="margin-left:10px;">每日签到送 <i class="day_integral">{{ form.integral_points }}</i> 积分</span>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="18">
            <el-button type="primary" size="medium" @click="saveData">{{ pageType == 'edit' ? '修改并保存' : '保 存' }}</el-button>
            <el-button size="medium" @click="cancelClick">取 消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- <div class="fiex_bottom">
      <el-button size="medium" @click="cancelClick">取 消</el-button>
      <el-button type="primary" size="medium" @click="saveData">{{ pageType == 'edit' ? '修改并保存' : '保存' }}</el-button>
    </div> -->
  </div>
</template>

<script>
import timeTools from '@/utils/timeFromat'
import Tinymce from '@/components/Tinymce'
import draggable from 'vuedraggable'
import { createSign, getSignInfo, modifySign } from '@/api/signDay'
export default {
  components: { Tinymce, draggable },
  data() {
    return {
      host: `${process.env.BASE_API}publicmethod/upfile/upload_file`,
      uoloadSignDay: {
        bucket: 'zm-public-image',
        property: 'portalSign/signDay'
      },
      form: {
        integral_points: 1
      },
      ad_list: [],
      dateTime: [],
      stencil_list: [
        { stencil_url: '', stencil_flg: 'A', stencil_thumbnail_url: '' },
        { stencil_url: '', stencil_flg: 'B', stencil_thumbnail_url: '' },
        { stencil_url: '', stencil_flg: 'C', stencil_thumbnail_url: '' }
      ],
      numberList: ['一', '二', '三'],
      pickerOptions: {
        disabledDate(time) { return time.getTime() < Date.now() }
      },
      showDialogForm: false,
      totalDay: null,
      reward_id: null,
      editEndTime: '',
      showSingleDate: false,
      share_img: ''
    }
  },
  computed: {
    pageType() {
      return this.$route.params.type
    },
    signId() {
      return this.$route.params.sign_id
    }
  },
  created() {
    if (this.pageType === 'edit') { // 编辑
      getSignInfo({ sign_id: this.signId })
        .then(res => {
          if (res.code === 200) {
            const info = res.result.signInfo
            this.form = {
              integral_points: info.reward_list[0]['integral_points'],
              sign_name: info.sign_name,
              sign_rule: info.sign_rule,
              share_intro: info.share_intro,
              share_title: info.share_title
            }
            this.share_img = info.share_img
            this.reward_id = info.reward_list[0]['reward_id']
            this.dateTime = [info.sign_start_time, info.sign_end_time]
            this.editEndTime = info.sign_end_time
            const startDate = new Date(this.dateTime[0]).getTime()
            const nowDate = new Date(timeTools.formatDate(new Date(), 'YYYY-MM-DD')).getTime()
            if (nowDate >= startDate) {
              this.showSingleDate = true
            } else {
              this.showSingleDate = false
            }
            this.ad_list = Array.from(info.ad_list, (item) => ({ ad_picture: item.ad_picture, ad_skip: item.ad_skip }))
            this.stencil_list = Array.from(info.stencil_list, (el) => ({ stencil_url: el.stencil_url, stencil_thumbnail_url: el.stencil_thumbnail_url, stencil_flg: el.stencil_flg, stencil_id: el.stencil_id }))
            this.totalDay = this.datedifference(this.dateTime[0], this.dateTime[1])
          }
        })
    }
  },
  methods: {
    cancelClick() {
      if (this.pageType === 'add') {
        this.$confirm('您确定取消吗？取消后您的信息不被保留', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.go(-1)
        }).catch(() => {})
      } else {
        this.$router.go(-1)
      }
    },
    addAdvPic() {
      const item = { ad_picture: '', ad_skip: '' }
      this.ad_list.push(item)
    },
    beforeAvatarUpload(file) {
      const fileType = file.type
      let isJPG
      const isLt2M = file.size / 1024 / 1024 < 4
      if (fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/gif' || fileType === 'image/jpeg') {
        isJPG = true
      } else {
        this.$message.error('上传广告图片只能是 jpg gif png 格式!')
        isJPG = false
      }
      if (!isLt2M) {
        this.$message.error('上传广告图片大小不能超过 4MB!')
      }
      return isJPG && isLt2M
    },
    deleteAdv(index) {
      this.ad_list.splice(index, 1)
    },
    checkDate(time) {
      if (this.showSingleDate) {
        if (time) { this.totalDay = this.datedifference(this.dateTime[0], this.editEndTime) } else { this.totalDay = 0 }
      } else {
        if (time) { this.totalDay = this.datedifference(time[0], time[1]) } else { this.totalDay = 0 }
      }
    },
    saveData() {
      if (!this.form.sign_name) {
        this.$message({
          message: '请填写签到名称',
          type: 'warning'
        })
        return
      }
      if (this.pageType !== 'edit' && this.dateTime.length <= 0) {
        this.$message({
          message: '请选择签到日期',
          type: 'warning'
        })
        return
      }
      if (this.pageType === 'edit' && !this.editEndTime) {
        this.$message({
          message: '请选择签到结束日期',
          type: 'warning'
        })
        return
      }
      if (!this.form.share_title) {
        this.$message({
          message: '请填写分享标题',
          type: 'warning'
        })
        return
      }
      if (!this.form.share_intro) {
        this.$message({
          message: '请填写分享描述',
          type: 'warning'
        })
        return
      }
      if (!this.share_img) {
        this.$message({
          message: '请上传分享图片',
          type: 'warning'
        })
        return
      }
      if (!this.form.sign_rule) {
        this.$message({
          message: '请填写签到规则',
          type: 'warning'
        })
        return
      }
      if (this.ad_list.length <= 0) {
        this.$message({
          message: '请上传签到广告',
          type: 'warning'
        })
        return
      } else {
        for (let index = 0; index < this.ad_list.length; index++) {
          const element = this.ad_list[index]
          if (element.ad_picture) {
            if (!element.ad_skip) {
              this.$message({
                message: `请给第${index + 1}条广告添加跳转链接地址`,
                type: 'warning'
              })
              return
            }
          }
        }
      }
      for (let index = 0; index < this.stencil_list.length; index++) {
        const item = this.stencil_list[index]
        if (!item.stencil_url) {
          this.$message({
            message: `请上传第${index + 1}个模板`,
            type: 'warning'
          })
          return
        }
        if (!item.stencil_thumbnail_url) {
          this.$message({
            message: `请上传第${index + 1}个模板的缩略图`,
            type: 'warning'
          })
          return
        }
      }
      if (!this.form.integral_points) {
        this.$message({
          message: '请填写签到权益',
          type: 'warning'
        })
        return
      }
      const ad_list = this.ad_list.map((el, index) => {
        return { ad_picture: el.ad_picture, ad_skip: el.ad_skip, ad_sort: index + 1 }
      })
      const stencil_list = this.stencil_list.map((el, index) => {
        if (this.pageType === 'edit') {
          return { stencil_url: el.stencil_url, stencil_thumbnail_url: el.stencil_thumbnail_url, stencil_sort: index + 1, stencil_id: el.stencil_id }
        }
        return { stencil_url: el.stencil_url, stencil_thumbnail_url: el.stencil_thumbnail_url, stencil_sort: index + 1 }
      })
      const params = {
        ad_list: ad_list,
        stencil_list: stencil_list,
        reward_list: this.pageType === 'edit' ? [{ trigger: 1, integral_points: this.form.integral_points, reward_id: this.reward_id }] : [{ trigger: 1, integral_points: this.form.integral_points }],
        sign_rule: this.form.sign_rule,
        sign_name: this.form.sign_name,
        share_title: this.form.share_title,
        share_intro: this.form.share_intro,
        share_img: this.share_img,
        sign_start_time: this.dateTime[0],
        sign_end_time: this.pageType === 'edit' ? this.editEndTime : this.dateTime[1]
      }
      if (this.pageType === 'edit') {
        params.sign_id = this.signId
        modifySign(params)
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$router.go(-1)
            }
          })
        return
      }
      createSign(params)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$router.replace({ path: `../question/${res.result.signInfo['sign_id']}` })
          }
        })
        .catch(erroe => {})
    },
    // 两个时间相差天数
    datedifference(sDate1, sDate2) {
      const date1 = Date.parse(sDate1)
      const date2 = Date.parse(sDate2)
      let dateSpan = date2 - date1
      dateSpan = Math.abs(dateSpan)
      return Math.floor(dateSpan / (24 * 3600 * 1000)) + 1
    },
    handleShareSuccess(res, file) {
      this.share_img = res.result.urlFile
    },
    handleThumbnailSuccess(res, file, index) {
      this.stencil_list[index].stencil_thumbnail_url = res.result.urlFile
    },
    handleAvatarSuccess(res, file, index) {
      this.ad_list[index].ad_picture = res.result.urlFile
    },
    handleTemplateSuccess(res, file, index) {
      this.stencil_list[index].stencil_url = res.result.urlFile
    }
  }
}
</script>

<style lang="scss" scoped>
.base_message{
  padding: 20px;
  position: relative;
  left: 0;
  top: 0;
  .label_name{
    i {
      font-style: normal;
      color: #F56C6C;
      margin-right: 5px;
      font-size: 16px;
    }
  }
  .check_day{
    margin-left: 20px;
    .day_num{
      color: #F56C6C;
      font-style: normal;
      font-weight: 700;
    }
  }
}
.upload_wrap{
  overflow: hidden;
  .sign_adv_upload{
    width: 300px;
    height: 100px;
    float: left;
    margin-right: 20px;
    .uploader_icon{
      line-height: 98px;
      font-size: 30px;
      color: #999;
    }
    .adv_image{
      width: 300px;
      height: 98px;
      float: left;
    }
  }
  .upload_button{
    margin-top: 37px;
  }
  .link_url_input{
    width: 80%;
  }
  .share_pic{
    width: 100px;
    height: 100px;
    line-height: 0 !important;
  }
  .share_image{
    width: 95px;
    height: 95px;
    border-radius: 6px;
  }
  .share_uploader_icon{
    line-height: 98px;
    font-size: 30px;
    color: #999;
  }
}
.thumbnail_wrap{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  .thumbnail_text{
    margin-right: 25px;
    .asterisk_icon{
      color:#F56C6C;
      font-size: 16px;
    }
    .asterisk_text{
      font-size: 16px;
      font-weight: 500;
    }
  }
}
.item_upload{
  margin-top: 10px;
}
.item_upload:first-child{
  margin-top: 0px;
}
.prop_text{
  font-size: 12px;
  margin-left: 10px;
  color: #F56C6C;
}
.link_wrap{
  margin-top: 10px;
}
.add_button{
  margin-top: 20px;
}
.upload_template{
  float: left;
  margin-right: 20px;
  border-right: 1px dashed #d9d9d9;
  padding-right: 20px;
  .template_text{
    text-align: center;
    font-weight: 500;
    font-size: 20px;
  }
}
.upload_template:last-child{
  border-right:none;
}
.sign_template_upload{
  width:290px;
  height: 400px;
  .template_icon{
    line-height: 400px;
    font-size: 50px;
    color: #999;
  }
  .template_one{
    padding: 40px 20px 0;
    height: 400px;
    background-size: 100% 100% !important;
    background-repeat: no-repeat !important;
  }
  .template_two{
    padding: 20px 20px 0;
    height: 400px;
    background-size: 100% 100% !important;
    background-repeat: no-repeat !important;
    .goods_content{
      height: 190px;
      font-size: 12px;
      font-weight: 400;
      line-height: normal !important;
      margin-bottom: 10px;
      text-align: left;
      color: #fff;
    }
  }
  .template_three{
    height: 400px;
    background-size: 100% 100% !important;
    background-repeat: no-repeat !important;
    .user_info_three{
      padding-bottom: 15px;
      height: 400px;
      background: none;
    }
    .user_head_three{
      padding: 25px 0 0 30px !important;
    }
    .total_text{
      font-size:14px;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height: normal !important;
      margin: 19px 0 0;
      .parent_num{
        font-size:20px;
        font-weight:500;
        color:rgba(51,51,51,1);
      }
    }
    .question_wrap{
      margin: 20px 30px 0;
      border-radius: 6px;
      .question_title{
        font-size:12px;
        font-weight:400;
        color:rgba(51,51,51,.9);
        line-height: normal;
        text-align: left;
        margin: 0;
      }
    }
  }
  .user_info{
    background:rgba(255,255,255, .7);
    border-radius:6px;
    .user_info_head{
      padding: 10px 0 0 15px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .user_icon{
        background: url('../../../assets/images/zhima.png') no-repeat;
        background-size: 100%;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .user_message{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
        height: 30px;
        line-height: normal !important;
        font-size: 12px !important;
      }
    }
    .staty_info{
      padding: 9px 15px 15px;
      border-top: 1px solid rgba(250,250,250, .5);
      display: flex;
      align-items: center;
      margin: 0px 15px 0;
      .staty_left, .staty_right{
        display: flex;
        flex-direction:column;
        justify-content: space-between;
        text-align: center;
        width: 50%;
        .staty_text{
          font-size:12px;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height: normal !important;
        }
        .day_text{
          font-size:12px;
          font-weight:300;
          color:rgba(51,51,51,1);
          line-height: normal !important;
          .day_num{
            font-size:16px !important;
            font-weight:500 !important;
            color:rgba(51,51,51,1);
            font-style: normal;
          }
        }
      }
    }
  }
}
.day_integral{
  font-style: normal;
  color: #F56C6C;
  font-size: 16px;
}
.fiex_bottom{
  // position: fixed;
  // left: 50%;
  // bottom: 20px;
  // transform: translateX(-50%);
  // -webkit-transform: translateX(-50%);
  // -moz-transform: translateX(-50%);
  // -o-transform: translateX(-50%);
}
</style>

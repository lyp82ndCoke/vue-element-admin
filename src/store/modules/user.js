import { login, logout, getInfo, getWxUnionid, bindWxUnionid, counsellorRequestId } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { formatRouter } from '@/utils/formatRouter'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    title: '',
    group: '',
    unionid: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_UNIONID: (state, unionid) => {
      state.unionid = unionid
    },
    SET_USERID: (state, user_id) => {
      state.user_id = user_id
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_TITLE: (state, title) => {
      state.title = title
    },
    SET_GROUP: (state, group) => {
      state.group = group
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const mobile = userInfo.mobile.trim()
      return new Promise((resolve, reject) => {
        login(mobile, userInfo.password)
          .then(response => {
            const data = response.result
            console.log(data)
            setToken(data.access_token)
            commit('SET_TOKEN', data.access_token)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 绑定微信unionID
    BindWxUnionid({ commit }, code) {
      return new Promise((resolve, reject) => {
        console.log(user.state)
        // user.GetInfo
        const unionid = user.state.unionid;
        if (!unionid) {
          getWxUnionid(code)
            .then(response => {
              console.log("绑定微信id", response)
              const wx_unionid = response.result.unionid;
              const wx_nickname = response.result.nickname;
              const wx_headimgurl = response.result.headimgurl;
              if (wx_unionid) {
                console.log(wx_unionid)
                const data = {
                  wx_unionid,
                  wx_nickname,
                  wx_headimgurl
                }
                bindWxUnionid(data).then(res => {
                  commit('SET_UNIONID', wx_unionid)
                  // const url = `${window.location.origin}${window.location.pathname}`
                  // window.location = url;
                  resolve()
                })
              }
            })
        }

      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      // console.log('获取用户信息')
      return new Promise((resolve, reject) => {
        getInfo()
          .then(response => {
            const data = response.result
            if (data.rule_name && data.rule_name.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', data.rule_name)
              formatRouter(data.rule_name)
            } else {
              reject('getInfo: user_id must be a non-null array !')
            }
            commit('SET_NAME', data.real_name)
            commit('SET_AVATAR', data.head_portrait)
            commit('SET_TITLE', data.title)
            commit('SET_UNIONID', data.wx_unionid)
            commit('SET_USERID', data.user_id)
            commit('SET_GROUP', data.group_title)
            // if (!data.wx_unionid) {
            //     const APPID = "wxec395e2c015ff846", REDIRECT_URI = window.location.href;
            //     window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_login#wechat_redirect`

            // }

            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user

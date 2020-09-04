'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  BASE_API: '"https://zdata.zmedc.com/manage/"', //后台测试环境
  MALL_API: '"https://zdata.zmedc.com"',//商城测试
  MOTHER_API: '"https://xdata.zmedc.com/zmshoptest"',//好妈妈代言人h5测试环境

  GROUP_API: '"https://xdata.zmedc.com"', //h5入群正式,没有测试环境
})

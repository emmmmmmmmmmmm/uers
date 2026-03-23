import un from 'unicorn-ui'
import Vue from 'vue'
import mutationTypes from '@/store/mutation-types'
/**
 * 当前模块的数据状态模型
 */
const state = {

  logInfo: '',
  logInfo2: '',
  tableData: [],
  totalNum: 0,
  pageSize: 10,
  currentPage: 1,
  cache: []
}
/**
 * 当前视图模块的状态更新操作集合
 */
const mutations = {

  queryDetailTraceXX (state, payload) {
    state.logInfo = payload
  },
  queryDetailTraceXXX (state, payload) {
    state.logInfo2 = payload
  },
  setLog(state, payload) {
    const list = Array.isArray(payload) ? payload : []
    state.cache = list
    state.totalNum = list.length
    state.currentPage = 1
  },
  setPageSize(state, payload) {
    state.pageSize = payload
  },
  setCurTableData(state, payload) {
    let start = payload.start
    let end = payload.end
    state.tableData = state.cache.slice(start, end)
  },
  setCurrentPage(state, payload) {
    state.currentPage = payload
  }
}
/**
 * 当前视图模块的交互行为集合
 */
const actions = {
  getInfo ({commit, state, rootState, dispatch}, payload) {
    return un.post('/sys/sysLog', payload || {}).then(res => res.json()).then((json) => {
      if (json.code === '0') {
        commit('queryDetailTraceXX', '获取日志')
        commit('setLog', json.result || [])
        commit('setCurrentPage', 1)
        commit('setCurTableData', { start: 0, end: state.pageSize })
        return json
      }

      throw new Error(json.msg || '日志查询失败')
    }).catch(err => {
      commit(mutationTypes.SHOW_MESSAGE, {
        dialogType: 'confirm',
        params: {
          title: '错误',
          message: err.message || '日志查询失败',
          type: 'error',
          showCancelButton: false
        }
      }, { root: true })
      throw err
    })
  },
  getInfo2 ({commit, state, rootState, dispatch}, payload) {
    un.get('http://localhost:8083/test2', {traceId: '2'}).then(res => res.json()).then((json) => {
      commit('queryDetailTraceXXX', json.msg)
    }).catch(err => { console.log('=====' + err) })
  }


  // queryLogInfoList ({commit, state, rootState, dispatch}, payload) {
  //   un.post('/wu/test', {traceId: '1'}).then((res) => res.json()).then((json) => {
  //     if (json.code === '0') {
  //       commit('queryDetailTraceXX', json.msg)
  //     } else {
  //       Message({
  //         showClose: true,
  //         message: '未查询到相关调用链',
  //         type: 'warning'
  //       })
  //     }
  //   }).catch((e) => {
  //     Message({
  //       showClose: true,
  //       message: e,
  //       type: 'error'
  //     })
  //   })
  // }
}
/**
 * 导出store信息
 */
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

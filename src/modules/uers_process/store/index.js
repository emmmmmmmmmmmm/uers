import mutationTypes from '@/store/mutation-types.js'
import un from 'unicorn-ui'

const createTabState = () => ({
  loading: false,
  tableData: [],
  cacheData: [],
  totalNum: 0,
  pageSize: 10,
  currentPage: 1,
  fetchNum: 50,
  queryForm: {
    tableName: '',
    belongLine:'',
    date: ''
  },
  tableOptions:[],
  lineOptions:[]
})

const state = {
  todeal: createTabState(),
  mySubmission: createTabState(),
  flowToMe: createTabState(),
  processed: createTabState(),
  dictList: [],
  operCardShow: false,
  currentBranch: { procId: '' }
}

const createTabMutations = (prefix) => ({
  [`${prefix}Loading`](state, payload) {
    state[prefix].loading = payload
  },
  
  [`${prefix}TableData`](state, payload) {
    // state[prefix].tableData = state[prefix].cacheData.slice(payload.start, payload.end)

    if(!payload||(!payload.start&&!payload.end)){
      const currentPage = state[prefix].currentPage
      const pageSize = state[prefix].pageSize
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize
      state[prefix].tableData = state[prefix].cacheData.slice(start,end)
    }else{
      state[prefix].tableData = state[prefix].cacheData.slice(payload.start, payload.end)
    }

  },
  [`${prefix}CacheData`](state, payload) {
    const startIndex = state[prefix].cacheData.length
    state[prefix].cacheData.push(...payload.list)
    state[prefix].totalNum = payload.totalNum

    //从数据中提取唯一的tableName和belongLine作为下拉选项
    if(payload.list && payload.list.length > 0){
      //提取所有的唯一tableName
      const tableNames = [...new Set(
        state[prefix].cacheData
          .map(item => item.tableName)
          .filter(name => name) //过滤空值
      )]

    //提取所有的唯一belongLine
    const belongLines = [...new Set(
      state[prefix].cacheData
        .map(item => item.belongLine)
        .filter(line => line) //过滤空值
    )]

    //一次性生成所有选项，避免中间状态
    const newTableOptions = tableNames.map(name => ({
      label:name,
      value:name
    }))

    const newLineOptions = belongLines.map(line => ({
      label: line,
      value: line
    }))

    //赋值
    state[prefix].tableOptions = newTableOptions
    state[prefix].lineOptions = newLineOptions
    
    //调试日志
    console.log(`[${prefix}] tableName选项：`, tableNames.length, newTableOptions)
    console.log(`[${prefix}] belongLine选项：`, belongLines.length, newLineOptions)
    console.log(`[${prefix}] 赋值后验证 - tableOptions:`, state[prefix].tableOptions)
    console.log(`[${prefix}] 赋值后验证 - lineOptions:`, state[prefix].lineOptions)
    }

    state[prefix].tableData = state[prefix].cacheData.slice(
      startIndex, 
      startIndex + state[prefix].pageSize
    )
  },
  [`${prefix}ClearData`](state) {
    state[prefix].cacheData = []
    state[prefix].tableData = []
    state[prefix].totalNum = 0
  },
  [`${prefix}PageSize`](state, payload) {
    state[prefix].pageSize = payload
  },
  [`${prefix}CurrentPage`](state, payload) {
    state[prefix].currentPage = payload
  },
  [`${prefix}FetchNum`](state, payload) {
    state[prefix].fetchNum = payload
  },
  [`${prefix}QueryForm`](state, payload) {
    state[prefix].queryForm = { ...state[prefix].queryForm, ...payload }
  }
})

const mutations = {
  ...createTabMutations('todeal'),
  ...createTabMutations('mySubmission'),
  ...createTabMutations('flowToMe'),
  ...createTabMutations('processed'),
  setDictList(state, payload) {
    state.dictList = payload
  },
  setOperCardShow(state, payload) {
    state.operCardShow = payload
  },
  setCurrentBranch(state, payload) {
    state.currentBranch = payload
  }
}

const createTabAction = (prefix, apiPath) => async ({ commit, state }, payload) => {
  commit(`${prefix}Loading`, true)
  try {
    const params = {
      begNum: (payload.init ? 1 : state[prefix].currentPage),
      fetchNum: state[prefix].fetchNum,
      ...state[prefix].queryForm,
      ...(payload.date && { 
        startDate: payload.date[0], 
        endDate: payload.date[1] 
      })
    }
    
    const res = await un.post(apiPath, params)
    const json = await res.json()
    
    if (json.code === '0') {
      if (payload.init) {
        commit(`${prefix}ClearData`)
        commit(`${prefix}CurrentPage`, 1)
      }
      commit(`${prefix}CacheData`, json.result)
    } else {
      throw new Error(json.msg)
    }
  } catch (e) {
    commit(mutationTypes.SHOW_MESSAGE, {
      dialogType: 'confirm',
      params: {
        title: un.i18n.toLocale('error', state.language),
        message: e.message,
        type: 'error',
        showCancelButton: false
      }
    }, { root: true })
  } finally {
    setTimeout(() => commit(`${prefix}Loading`, false), 500)
  }
}

const actions = {
  getProcessTodeal: createTabAction('todeal', '/task/toDeal/get'),
  //getMySubmissions: createTabAction('mySubmission', '/submission/list/get'),
  getMySubmissions: createTabAction('mySubmission', '/task/userTask/get'),
  //getFlowsToMe: createTabAction('flowToMe', '/flow/tome/get'),
  getFlowsToMe: createTabAction('flowToMe', '/task/flowToMe/get'),
  getProcessedTasks: createTabAction('processed', '/task/taskList/get'),

  // 新增删除任务API调用
  async deleteTask({ commit }, payload) {
    try {
      const res = await un.post('/task/info/delete', payload);
      const json = await res.json();
      
      // 根据返回码处理结果
      if (json.code === '0') {
        return json; // 返回成功结果
      } else {
        throw new Error(json.msg || this.$t('deleteFailed'));
      }
    } catch (e) {
      commit(mutationTypes.SHOW_MESSAGE, {
        dialogType: 'confirm',
        params: {
          title: un.i18n.toLocale('error', state.language),
          message: e.message,
          type: 'error',
          showCancelButton: false
        }
      }, { root: true });
      throw e;
    }
  },

    // 任务审核同意
    async approveFlowTask({ commit }, payload) {

      try {
        const res = await un.post('/task/info/approve', payload);
        const json = await res.json();
        
        // 根据返回码处理结果
        if (json.code === '0') {
          return json; // 返回成功结果
        } else {
          throw new Error(json.msg || this.$t('approveFailed'));
        }
      } catch (e) {
        commit(mutationTypes.SHOW_MESSAGE, {
          dialogType: 'confirm',
          params: {
            title: un.i18n.toLocale('error', state.language),
            message: e.message,
            type: 'error',
            showCancelButton: false
          }
        }, { root: true });
        throw e;
      }
    },
  
  resetQueryForm({ commit }, { tab }) {
    commit(`${tab}QueryForm`, { tableName: '', belongLine: '',date: '' })
  },
  
  handleSizeChange({ commit }, { tab, size }) {
    commit(`${tab}PageSize`, size)
    commit(`${tab}CurrentPage`, 1)
  },
  
  handleCurrentChange({ commit }, { tab, page }) {
    commit(`${tab}CurrentPage`, page)
    commit(`${tab}tableData`)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
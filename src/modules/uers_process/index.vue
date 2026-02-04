<template>
  <un-card class="agency-wrap page-wrapper" type="form">
    <un-tabs v-model="activeTab" @tab-click="handleTabChange">

        <!-- 全部任务 -->
        <un-tab-pane :label="$t('taskProcessed')" name="processed">
        <query-form 
          :form="processed.queryForm" 
          @reset="resetQueryForm('processed')" 
          @submit="fetchData('processed')" 
          @export="exportToExcel('processed')"
        />

        <un-table 
          :data="processed.tableData" 
          v-loading="processed.loading"
          :max-height="350"
          :unicorn-loading-text="$t('Waiting for loading')"
          unicorn-loading-spinner="un-icon-loading"
          stripe
          :row-style="{ height: '40px' }"
          :header-row-style="{ height: '40px' }"
          style="width: 100%"
        >
          <un-table-column type="index" :label="$t('NO.')" width="80" align="center"></un-table-column>
          <un-table-column prop="taskId" :label="$t('taskId')" width="150" align="center"></un-table-column>
          <un-table-column prop="tableName" :label="$t('tableName')" width="200" align="center"></un-table-column>
          <un-table-column prop="belongLine" :label="$t('belongLine')" width="100" align="center"></un-table-column>
          <un-table-column prop="taskUser" :label="$t('taskUser')" width="200" align="center"></un-table-column>
          <un-table-column prop="startTime" :label="$t('startTime')" width="200" align="center"></un-table-column>

          <un-table-column prop="taskStatus" :label="$t('taskStatus')" width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.taskStatus==='1'">{{ $t('inProcess') }}</span>
              <span v-else-if="scope.row.taskStatus==='2'" >{{ $t('completed') }}</span>
              <span v-else>{{ $t('unknow') }}</span>
            </template>
          </un-table-column>

          <un-table-column prop="currentUsers" :label="$t('currentUsers')" width="200" align="center"></un-table-column>
          
        </un-table>
        <pagination-footer 
          :total="processed.totalNum"
          :current-page.sync="processed.currentPage"
          :page-size.sync="processed.pageSize"
          @size-change="handleSizeChange('processed', $event)"
          @current-change="handleCurrentChange('processed', $event)"
        />
      </un-tab-pane>    


      <!-- 待处理任务 -->
      <un-tab-pane :label="$t('toDealTask')" name="todeal">
        <un-table 
          :data="todeal.tableData" 
          v-loading="todeal.loading"
          :unicorn-loading-text="$t('Waiting for loading')"
          unicorn-loading-spinner="un-icon-loading"
          @selection-change="handleSelectionChange"
          stripe
          :row-style="{ height: '40px' }"
          :header-row-style="{ height: '40px' }"
          style="width: 100%"
        >
          <un-table-column prop="taskId" :label="$t('taskId')" width="150" align="center"></un-table-column>
          <un-table-column prop="tableName" :label="$t('tableName')" width="200" align="center"></un-table-column>
          <un-table-column prop="belongLine" :label="$t('belongLine')" width="100" align="center"></un-table-column>
          <un-table-column prop="taskUser" :label="$t('taskUser')" width="200" align="center"></un-table-column>
          <un-table-column prop="startTime" :label="$t('startTime')" width="200" align="center"></un-table-column>
          <un-table-column prop="taskStatus" :label="$t('taskStatus')" width="120" align="center"></un-table-column>
          <un-table-column prop="currentUsers" :label="$t('currentUsers')" width="200" align="center"></un-table-column>
          <un-table-column :label="$t('operation')" width="140" fixed="right" align="center">
            <template #default="{ row }">
              <!-- <un-button type="text" @click="navigateTo('approval', row)">{{ $t('approval') }}</un-button> -->
              <un-button type="text" @click="approval(row)">{{ $t('approval') }}</un-button>
            </template>
          </un-table-column>
        </un-table>
        <pagination-footer 
          :total="todeal.totalNum" 
          :selected-count="selectedCount"
          :current-page.sync="todeal.currentPage"
          :page-size.sync="todeal.pageSize"
          @size-change="handleSizeChange('todeal', $event)"
          @current-change="handleCurrentChange('todeal', $event)"
        />
        <!-- <action-buttons :disabled="buttonDisabled" /> -->
      </un-tab-pane>

      <!-- 我提交的 -->
      <un-tab-pane :label="$t('mySubmission')" name="mySubmission">
        <query-form 
          :form="mySubmission.queryForm" 
          @reset="resetQueryForm('mySubmission')" 
          @submit="fetchData('mySubmission')" 
          @export="exportToExcel('mySubmission')"
        />
        <un-table 
          :data="mySubmission.tableData" 
          v-loading="mySubmission.loading"
          :max-height="350"
          :unicorn-loading-text="$t('Waiting for loading')"
          unicorn-loading-spinner="un-icon-loading"
          stripe
          :row-style="{ height: '40px' }"
          :header-row-style="{ height: '40px' }"
          style="width: 100%"
        >
          <un-table-column prop="taskId" :label="$t('taskId')" width="150" align="center"></un-table-column>
          <un-table-column prop="tableName" :label="$t('tableName')" width="200" align="center"></un-table-column>
          <un-table-column prop="belongLine" :label="$t('belongLine')" width="100" align="center"></un-table-column>
          <un-table-column prop="taskUser" :label="$t('taskUser')" width="200" align="center"></un-table-column>
          <un-table-column prop="startTime" :label="$t('startTime')" width="200" align="center"></un-table-column>

          <un-table-column prop="taskStatus" :label="$t('taskStatus')" width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.taskStatus==='1'">{{ $t('inProcess') }}</span>
              <span v-else-if="scope.row.taskStatus==='2'" >{{ $t('completed') }}</span>
              <span v-else>{{ $t('unknow') }}</span>
            </template>
          </un-table-column>
          
          <un-table-column prop="currentUsers" :label="$t('currentUsers')" width="200" align="center"></un-table-column>


          <un-table-column :label="$t('operation')" width="140" fixed="right" align="center">
            <template #default="{ row }">
              <un-button
                  type="text"
                  :disabled="row.currentNote !== '1'"
                  @click="deleteSubmission(row)">
                {{ $t('delete') }}
              </un-button>
            </template>
          </un-table-column>

        </un-table>
        <pagination-footer 
          :total="mySubmission.totalNum"
          :current-page.sync="mySubmission.currentPage"
          :page-size.sync="mySubmission.pageSize"
          @size-change="handleSizeChange('mySubmission', $event)"
          @current-change="handleCurrentChange('mySubmission', $event)"
        />
      </un-tab-pane>

      <!-- 流经我的 -->
      <un-tab-pane :label="$t('flowToMe')" name="flowToMe">
        <query-form 
          :form="flowToMe.queryForm" 
          @reset="resetQueryForm('flowToMe')" 
          @submit="fetchData('flowToMe')" 
          @export="exportToExcel('mySubmission')"
        />
        <un-table 
          :data="flowToMe.tableData" 
          v-loading="flowToMe.loading"
          :unicorn-loading-text="$t('Waiting for loading')"
          unicorn-loading-spinner="un-icon-loading"
          stripe
          :row-style="{ height: '40px' }"
          :header-row-style="{ height: '40px' }"
          style="width: 100%"
        >
          <un-table-column prop="procId" :label="$t('procId')" width="100" align="center"></un-table-column>
          <un-table-column prop="title" :label="$t('title')" width="240" align="center"></un-table-column>
          <un-table-column prop="submitUser" :label="$t('submitUser')" width="150" align="center"></un-table-column>
          <un-table-column prop="submitDate" :label="$t('submitDate')" min-width="220" align="center"></un-table-column>
          <un-table-column prop="status" :label="$t('status')" width="120" align="center"></un-table-column>
          <un-table-column :label="$t('operation')" width="200" fixed="right">
            <template #default="{ row }">
              <un-button type="text" @click="approveFlow(row)">{{ $t('approve') }}</un-button>
              <un-button type="text" @click="rejectFlow(row)">{{ $t('reject') }}</un-button>
            </template>
          </un-table-column>
        </un-table>
        <pagination-footer 
          :total="flowToMe.totalNum"
          :current-page.sync="flowToMe.currentPage"
          :page-size.sync="flowToMe.pageSize"
          @size-change="handleSizeChange('flowToMe', $event)"
          @current-change="handleCurrentChange('flowToMe', $event)"
        />
      </un-tab-pane>


    </un-tabs>
  </un-card>
</template>

<script>
import un from 'unicorn-ui'
import store from '@/modules/uers_process/store'
import i18n from '@/modules/uers_process/i18n'

const PaginationFooter = {
  props: {
    total: Number,
    selectedCount: Number,
    currentPage: Number,
    pageSize: Number
  },
  template: `
    <div class="pageDiv">
      <div class="totalNum">
        {{ $t('inAll') }} {{ total }} {{ $t('projects') }}
        <span v-if="selectedCount > 0">
          , {{ $t('have chosen') }} {{ selectedCount }} {{ $t('projects') }}
        </span>
      </div>
      <un-pagination
        background
        @size-change="$emit('size-change', $event)"
        @current-change="$emit('current-change', $event)"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="prev, pager, next, sizes, jumper"
        :total="total"
      />
    </div>
  `
}

const QueryForm = {
  props: { form: Object },
  template: `
    <un-form :model="form" class="query-form" :inline="true">

    <un-form-item :label="$t('tableName')">
        <un-input v-model="form.tableName" :placeholder="$t('tableName')" class="form-input"></un-input>
    </un-form-item> 
    
    <un-form-item :label="$t('belongLine')">
        <un-input v-model="form.belongLine" :placeholder="$t('belongLine')" class="form-input"></un-input>
    </un-form-item> 

      <un-form-item :label="$t('date')">
        <un-date-picker
          class="date-input"
          v-model="form.date"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          type="datetimerange"
          :start-placeholder="$t('startDate')"
          :end-placeholder="$t('endDate')"
          range-separator="-"
        />
      </un-form-item>

      <un-form-item>
        <un-button type="primary" class="query-button" @click="$emit('submit')">{{ $t('query') }}</un-button>
        <un-button class="query-button" @click="form.tableName = ''; form.belongLine = ''; form.date = ''; $emit('reset')">{{ $t('reset') }}</un-button>
        <un-button type="success" class="query-button" @click="$emit('export')">{{ $t('exportExcel') }}</un-button>
      </un-form-item>

    </un-form>
  `
}

export default un.component({
  components: { PaginationFooter, QueryForm },
  
  data() {
    return {
      activeTab: 'processed',
      selectItem: []
    }
  },
  
  created() {
    this.initTabData('processed')
  },
  
  computed: {
    todeal() { return this.$store.state.agencyTask.todeal },
    mySubmission() { return this.$store.state.agencyTask.mySubmission },
    flowToMe() { return this.$store.state.agencyTask.flowToMe },
    processed() { return this.$store.state.agencyTask.processed },
    selectedCount() { return this.selectItem.length },
    buttonDisabled() { return this.activeTab !== 'todeal' || this.selectedCount === 0 }
  },
  
  methods: {
    initTabData(tab) {
      const actions = {
        todeal: 'getProcessTodeal',
        mySubmission: 'getMySubmissions',
        flowToMe: 'getFlowsToMe',
        processed: 'getProcessedTasks'
      }
      // 添加清除选中项逻辑
      if (tab === 'processed') this.selectItem = [];
      // 直接调用映射后的action方法
      this[actions[tab]]({ init: true })
    },
    
    handleTabChange({ name }) {
      this.activeTab = name
      this.initTabData(name)
    },
    
    fetchData(tab) {
        this.initTabData(tab);
      //this.$store.dispatch(`get${tab.charAt(0).toUpperCase() + tab.slice(1)}`, { init: true })
    },
    
    resetQueryForm(tab) {
      this.$store.dispatch('resetQueryForm', { tab })
      this.fetchData(tab)
    },
    
    handleSizeChange(tab, size) {
      // this.$store.dispatch('handleSizeChange', { tab, size })
      // this.fetchData(tab)

      this.$store.commit(`agencyTask/${tab}PageSize`, size)
      this.$store.commit(`agencyTask/${tab}CurrentPage`, 1)
      this.$store.commit(`agencyTask/${tab}TableData`)

    },
    
    handleCurrentChange(tab, page) {
      // this.$store.dispatch('handleCurrentChange', { tab, page })
      // this.fetchData(tab)

      this.$store.commit(`agencyTask/${tab}CurrentPage`, page)
      this.$store.commit(`agencyTask/${tab}TableData`)

    },
    
    handleSelectionChange(val) {
      this.selectItem = val
    },
    
    /**
    navigateTo(path, row) {
      //this.$store.commit('setCurrentBranch', row)
      //this.$store.commit('setOperCardShow', true)
      //this.gotoPage({
      //  url: '/approval_detail',
      //  params: { ...row, init: true }
      //})
    },
    */

    async approval(row) {
      try {
        // 确认对话框
        await this.$confirm(this.$t('confirmDelete'), this.$t('warning'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        });
        
        // 构建删除参数
        const approveParams = {
          taskId: row.taskId,
          belongLine: row.belongLine
        };
        
        // 调用审批API

      } catch (e) {
        // 用户取消删除时不显示错误
        if (e !== 'cancel' && e !== 'close') {
          this.$message.error(e.message || this.$t('approveFailed'));
        }
      }
    },

    async deleteSubmission(row) {
      try {
        // 确认对话框
        await this.$confirm(this.$t('confirmDelete'), this.$t('warning'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        });
        
        // 构建删除参数
        const deleteParams = {
          taskId: row.taskId,
          belongLine: row.belongLine,
          startTime: row.startTime
        };
        
        // 调用删除API
        //const response = await this.$store.dispatch('agencyTask/deleteTask', deleteParams);
        const response = await this.deleteTask(deleteParams);

        if (response.code === '0') {
          this.$message.success(this.$t('deleteSuccess'));
          this.fetchData('mySubmission'); // 刷新表格数据
        } else {
          this.$message.error(response.msg || this.$t('deleteFailed'));
        }
      } catch (e) {
        // 用户取消删除时不显示错误
        if (e !== 'cancel' && e !== 'close') {
          this.$message.error(e.message || this.$t('deleteFailed'));
        }
      }
    },


    // 删除任务
    async deleteTaskInfo(row) {
      try {
        // 确认对话框
        await this.$confirm(this.$t('confirmDelete'), this.$t('warning'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        });
        
        // 构建删除参数
        const deleteParams = {
          taskId: row.taskId,
          belongLine: row.belongLine,
          startTime: row.startTime
        };
        
        // 调用删除API
        //const response = await this.$store.dispatch('agencyTask/deleteTask', deleteParams);
        const response = await this.deleteTask(deleteParams);

        if (response.code === '0') {
          this.$message.success(this.$t('deleteSuccess'));
          this.fetchData('processed'); // 刷新表格数据
        } else {
          this.$message.error(response.msg || this.$t('deleteFailed'));
        }
      } catch (e) {
        // 用户取消删除时不显示错误
        if (e !== 'cancel' && e !== 'close') {
          this.$message.error(e.message || this.$t('deleteFailed'));
        }
      }
    },

    // 审核通过
    async approveFlow(row) {
      try {
        await this.$confirm(this.$t('confirmApprove'), this.$t('warning'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'info'
        });

         // 构建审核参数
        const approveFlowParams = {
          taskId: row.taskId,
          belongLine: row.belongLine,
          startTime: row.startTime
        }; 

        // 调用审批API
        const response = await this.approveFlowTask(approveFlowParams);

        if (response.code === '0') {
          this.$message.success(this.$t('approveSuccess'));
          this.fetchData('processed'); // 刷新表格数据
        } else {
          this.$message.error(response.msg || this.$t('approveFailed'));
        }
      } catch (e) {
        // 用户取消时不显示错误
        if (e !== 'cancel' && e !== 'close') {
          this.$message.error(e.message || this.$t('approveFailed'));
        }
      }
    },
    
    async rejectFlow(row) {
      try {
        await this.$confirm(this.$t('confirmReject'), this.$t('prompt'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        })
        // 调用驳回API
        this.$message.success(this.$t('rejectSuccess'))
        this.fetchData('flowToMe')
      } catch (e) {}
    },

    //导出excel
    async exportToExcel(tab){
      const loading = this.$loading(
        {
          lock:true,
          text:this.$t('exporting')||('正在导出')
          //TODO EXCEL导出需要调dsp加密接口，功能待实现
        }
      )
    }

  }
}, {
  mutations: {
    'self': ['setOperCardShow', 'setCurrentBranch'],
    'global': ['gotoPage', 'showMessage']
  },
    actions: {
      'self': [ 'getProcessTodeal','getMySubmissions','getFlowsToMe','getProcessedTasks','deleteTask','approveFlowTask']
    }
}, {
  mName: 'agencyTask',
  store,
  i18n
})
</script>

<style lang="scss" scoped>
.agency-wrap {
  background: none;
  margin: 0 !important;
  padding: 0 !important;
  
  .un-tabs__header {
    padding-left: 20px;
    margin-bottom: 0;
    background: #f8f8f8;
  }
  
  .un-tabs__content {
    margin: 16px;
    padding: 24px;
    background: #fff;
    min-height: 74.33vh;
  }
  
  .un-tabs__item {
    color: rgba(51, 51, 51, 0.65);
    
    &.is-active, &:hover {
      color: #e25355;
    }
  }
  
  .un-table {
    td, th { padding: 0; text-align: center; }
  }
  
  .query-form {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    margin-top: 10px;
    
    .un-form-item {
      width: 33.3%;
      margin-right: 0;
      
      .form-input { width: 70%; }
      .date-input { width: 70%; }
    }
    
    .query-button {
      font-size: 14px;
      padding: 0 15px;
      height: 32px;
      margin-left: 10px;
    }
  }
  
  .pageDiv {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .totalNum {
      font-size: 14px;
      color: #999999;
    }
    
    .un-pagination {
      margin-top: 16px;
      
      .btn-next, .btn-prev, li {
        min-width: 28px;
        height: 28px;
        line-height: 28px;
      }
    }
  }
  
  .button-wrap {
    text-align: center;
    margin-top: 34px;
    
    .agency-button {
      width: 65px;
      height: 32px;
      margin: 0 5px;
    }
  }
}
</style>
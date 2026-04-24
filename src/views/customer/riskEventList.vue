<template>
  <div>
    <el-form
      class="wrap-query-form special-form-item"
      label-position="left"
      label-width="auto"
      size="small"
    >
      <el-row>
        <!-- 日期组件 -->
        <el-col :span='7'>
          <el-form-item label="风险事件维护日期：">
            <datePicker
              :startDate.sync="queryForm.startMantDate"
              :endDate.sync="queryForm.endMantDate"
            ></datePicker>
          </el-form-item>
        </el-col>
        <el-col :span='7'>
          <el-form-item label="客户归属机构/部门：">
            <dept-tree
              v-model="queryForm.custBlngOrgn"
              :treeData="treeData"
              :showCheckbox="true"
            ></dept-tree>
          </el-form-item>
        </el-col>
        <el-col :span='7'>
          <el-form-item label="风险事件类型：">
            <el-select
              v-model="queryForm.riskEvntTyp"
              clearable
              placeholder="请选择风险事件类型"
            >
              <el-option
                v-for="item in riskEvntTypeList"
                :key="item.parmVluCod"
                :label="item.parmVlu"
                :value="item.parmVluCod"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='3'>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearch"
              size="small"
            >查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="审核状态:">
            <el-select
              v-model="queryForm.confirmStatus"
              clearable
            >
              <el-option
                v-for="item in codeList['BRIN0145']"
                :key="item.parmVluCod"
                :label="item.parmVlu"
                :value="item.parmVluCod"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 客户信息查询组件 -->
        <el-col :span="12">
          <custForm
            :custCod.sync="queryForm.custCod"
            :custNam.sync="queryForm.custNam"
          ></custForm>
        </el-col>
      </el-row>
    </el-form>
    <section class="wrap-operation">
      <div class="wrap-export">
        <el-button
          @click="openDialog('exportPart')"
          size="small"
          v-if="prmObject.export"
        >导出选项</el-button>
        <el-button
          @click="openDialog('exportAll')"
          size="small"
          v-if="prmObject.exportAll"
        >导出全部</el-button>
      </div>
    </section>
    <el-card class="wrap-list">
      <el-table
        ref="multipleTable"
        :data="riskEventList"
        size="small"
        v-loading="tableLoading"
        style="width: 100%"
        :header-cell-style="{
                    'color':'#34354B',
                    'background':'#F9F9FB',
                    'box-shadow':'inset 0 0 0 0 #DCDFE6',
                    'border-radius':'4px 4px 0px 0px'
                }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="40"
          fixed
        >
        </el-table-column>
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="60"
          fixed
        >
          <template slot-scope="scope">
            <span>{{(currentPage - 1) * limit + (scope.$index + 1)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="custCod"
          min-width="200"
          label="客户编号"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="客户类型"
          min-width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{getCurrentDic(scope.row.custTyp, custTypList)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="custNam"
          label="客户名称"
          min-width="200"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="证件类型"
          min-width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{getCurrentDic(scope.row.idTyp, idTypeList)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="idNum"
          label="证件号码"
          min-width="200"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="custBlngOrgn"
          width="200"
          label="客户归属机构/部门"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="风险事件类型"
          min-width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{getCurrentDic(scope.row.riskEvntTyp, riskEvntTypeList)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="riskEvntDesc"
          label="风险事件描述"
          min-width="200"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="riskEvntSource"
          label="风险事件来源"
          min-width="200"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="riskEvntDesc"
          min-width="200"
          align="center"
          label="风险事件状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span :class="filterStatus(getCurrentDic(scope.row.status, statusList))">{{getCurrentDic(scope.row.status, statusList)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="riskEvntEfftDate"
          min-width="200"
          label="风险事件生效日期"
        >
        </el-table-column>
        <el-table-column
          prop="riskEvntExpiDate"
          min-width="200"
          label="风险事件失效日期"
        >
        </el-table-column>
        <el-table-column
          prop="riskEvntMantDate"
          min-width="200"
          label="风险事件维护日期"
        >
        </el-table-column>
        <el-table-column
          min-width="200"
          prop="fileId"
          label="附件"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              class="down-file"
              @click="downFile(scope.row.fileId, scope.row.fileName)"
              v-if="scope.row.fileId"
            >{{scope.row.fileName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="confirmStatus"
          min-width="100"
          label="审核状态"
        >
          <template slot-scope="scope">
            <span>{{scope.row.confirmStatus | dictionaryFormat(codeList['BRIN0145'])}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="150"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              :class="prmObject.history ? 'list-actions' : 'disable-actions'"
              :disabled="!prmObject.history"
              @click="toHistoryList(scope.row.id)"
            >历史记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="turn-page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 30, 40, 50]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <dia
      :title="dialogTitle"
      :isShow.sync="dialogVisible"
    >
      <span slot="body">{{dialogMsg}}</span>
      <span slot="two-btns">
        <el-button
          @click="cancelDialog"
          size="small"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="diaConfirm"
          size="small"
        >确 定</el-button>
      </span>
    </dia>
  </div>
</template>

<script>
import dia from '@/components/Dialog'
import datePicker from '@/components/datePicker'
import custForm from '@/components/custInfo/form'
import accoForm from '@/components/accoInfo/form'
import cascader from '@/components/cascader'
import deptTree from '@/views/permission/role/BranchTree'
import common from '@/utils/common'
export default {
  name: 'RiskEventList',
  components: {
    deptTree,
    dia,
    custForm,
    accoForm,
    datePicker,
    cascader
  },
  data () {
    return {
      codeList: {},
      treeData: [],
      tableLoading: false,
      dialogTitle: '提示',
      dialogVisible: false,
      dialogMsg: '',
      deptId: '',
      idKey: 'id',
      multipleSelection: [],
      multipleSelectionAll: [],
      currentPage: 1,
      limit: 20,
      total: 0,
      riskEvntTypeList: [], // 事件类型
      custTypList: [], // 客户类型
      idTypeList: [], // 证件类型
      statusList: [], // 事件状态
      riskEventList: [],
      queryForm: {
        startMantDate: '',
        endMantDate: '',
        riskEvntTyp: '',
        custBlngOrgn: '',
        custCod: '',
        custTyp: '',
        custNam: '',
        idTyp: '',
        idNum: ''
      },
      riskIdList: [],
      prmObject: {
        export: true,
        add: true,
        history: true,
        modify: true,
        exportAll: true,
        delete: true
      }
    }
  },
  created () {
    common.getPrmBtn(this.prmObject)
    if (this.$route.meta.isBack) {
      this.$api.myApi.role.getRoleDept().then(res => {
        if (res.retCode === '0') {
          this.treeData = res.result.deptList
          this.$nextTick(() => {
            this.queryForm = JSON.parse(window.sessionStorage.getItem('queryFormRiskEvent'))
            this.getEventList()
          })
        } else {
          this.$error(res.retMsg)
        }
      })
    } else {
      // this.queryForm.endMantDate = common.getFormmatDate(new Date())
      // let lastYear = new Date().getFullYear() - 1
      // this.queryForm.startMantDate = common.getFormmatDate(new Date(new Date().setFullYear(lastYear)))
      this.getDeptList()
    }
    this.dicvluList({ parmCod: 'BRIN0014', status: 0 }, 1) // 风险事件类型
    this.dicvluList({ parmCod: 'BRIN0016', status: 0 }, 2) // 客户类型
    this.dicvluList({ parmCod: 'BRIN0021', status: 0 }, 3) // 证件类型
    this.dicvluList({ parmCod: 'BRIN0015', status: 0 }, 4) // 事件状态
    common.getDicListMore(['BRIN0145']).then(res => { this.codeList = res })
  },
  beforeRouteEnter (to, from, next) {
    if (from.path === '/customer/riskAdd' || from.path === '/customer/riskModify' || from.path === '/customer/historyList') {
      to.meta.isBack = true
    } else {
      to.meta.isBack = false
    }
    next()
  },
  watch: {
    $route () {
      common.getPrmBtn(this.prmObject)
    }
  },
  methods: {
    downFile (id, name) {
      let params = {
        id: id
      }
      this.$api.myApi.infoNotice.getFile(params).then(res => {
        if (res.retCode === '0') {
          common.dataToFile(
            res.result.file,
            name
          )
          this.$success(res.retMsg)
        } else {
          this.$error(res.retMsg)
        }
      })
    },
    getEventList () {
      this.tableLoading = true
      let params = {
        limit: this.limit,
        currentPage: this.currentPage
      }
      Object.assign(params, this.queryForm)
      this.$api.myApi.customer.getList(params).then(res => {
        this.tableLoading = false
        if (res.retCode === '0') {
          if (res.result.list.length > 0) {
            this.riskEventList = res.result.list
            this.total = res.result.totalNum
          } else {
            this.riskEventList = []
            this.total = 0
          }
          setTimeout(() => {
            this.setSelectRow()
          }, 200)
        } else {
          return this.$error(res.retMsg)
        }
      }).catch(() => {
        this.tableLoading = false
        return this.$error('获取客户风险事件失败')
      })
    },
    getDeptList () {
      this.$api.myApi.role.getRoleDept().then(res => {
        if (res.retCode === '0') {
          this.treeData = res.result.deptList
          this.$nextTick(() => {
            // this.queryForm.custBlngOrgn = localStorage.getItem('deptNo')
            const deptData = this.treeData.filter(item => item.deptId === localStorage.getItem('deptNo'))
            const r = common.findChildrenKey(deptData, 'deptId')
            this.queryForm.custBlngOrgn = r.join()

            this.getEventList()
          })
        } else {
          this.$error(res.retMsg)
        }
      })
    },
    onSearch () {
      this.currentPage = 1
      this.limit = 20
      if (this.queryForm.startMantDate === null || this.queryForm.endMantDate === null) {
        this.$message.warning('风险事件维护日期不能为空')
      } else {
        this.getEventList()
      }
    },
    // 设置选中方法
    setSelectRow () {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length === 0) {
        return
      }
      let idKey = this.idKey
      let selectAllIds = []
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      this.$refs.multipleTable.clearSelection()
      for (let i = 0; i < this.riskEventList.length; i++) {
        if (selectAllIds.indexOf(this.riskEventList[i][idKey]) >= 0) {
          // 设置选中
          this.$refs.multipleTable.toggleRowSelection(this.riskEventList[i], true)
        }
      }
    },
    // 跨页选择
    changePageCoreRecordData () {
      let idKey = this.idKey
      let that = this
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection
        return
      }
      let selectAllIds = []
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      let selectIds = []
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey])
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row)
        }
      })
      let noSelectIds = []
      this.riskEventList.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey])
        }
      })
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] === id) {
              that.multipleSelectionAll.splice(i, 1)
              break
            }
          }
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getAllSelectionData () {
      this.riskIdList = []
      this.changePageCoreRecordData()
      for (let i = 0; i < this.multipleSelectionAll.length; i++) {
        this.riskIdList.push(this.multipleSelectionAll[i][this.idKey])
      }
    },
    openDialog (type, userId) {
      this.getAllSelectionData()
      if (type === 'exportAll') {
        if (this.riskEventList.length === 0) {
          return this.$message.warning('查询结果为空，不可导出')
        }
        this.dialogMsg = '是否按照当前查询条件导出全部数据？'
        this.cancelDiaMsg = '导出'
        this.dialogType = 'exportAll'
      } else {
        if (this.multipleSelection.length === 0) {
          return this.$message.warning('请选择一条记录')
        }
        if (type === 'exportPart') {
          this.dialogMsg = '确认导出选中数据？'
          this.cancelDiaMsg = '导出'
          this.dialogType = 'exportPart'
        } else {
          if (type === 'delete') {
            if (this.multipleSelection.length === 500) {
              return this.$message.warning('批量删除最多为500条')
            }
            this.dialogMsg = '确定删除所选中的客户风险事件信息吗'
            this.cancelDiaMsg = '删除'
            this.dialogType = 'delete'
          }
        }
      }
      this.dialogVisible = true
    },
    diaConfirm () {
      this.dialogVisible = false
      if (this.dialogType === 'exportAll') {
        this.exportInfo('all')
      } else if (this.dialogType === 'exportPart') {
        this.exportInfo('part')
      } else if (this.dialogType === 'delete') {
        this.delete()
      }
    },
    cancelDialog () {
      this.dialogVisible = false
    },
    exportInfo (type) {
      if (type === 'all') {
        this.$api.myApi.customer.exportAllEvent(this.queryForm).then(res => {
          if (res.retCode === '0') {
            common.dataToFile(
              res.result.file,
              '客户风险事件统计.xls',
              'application/vnd.ms-excel'
            )
            return this.$success('导出成功')
          } else {
            return this.$error(res.retMsg)
          }
        })
      } else {
        if (this.riskIdList.length > common.exportNumLimit) {
          return this.$message.warning(`导出条数大于${common.exportNumLimit}条，请重新选择`)
        }
        this.$api.myApi.customer.exportEvent(
          { riskIdList: this.riskIdList }
        ).then(res => {
          if (res.retCode === '0') {
            common.dataToFile(
              res.result.file,
              '客户风险事件统计.xls',
              'application/vnd.ms-excel'
            )
            return this.$success('导出成功')
          } else {
            return this.$error(res.retMsg)
          }
        }).catch(() => {
          return this.$error('导出失败')
        })
      }
    },
    delete () {
      this.$api.myApi.customer.deleteEvent(
        {
          riskIdList: this.riskIdList
        }
      ).then(res => {
        if (res.retCode === '0') {
          this.getEventList()
          this.$refs.multipleTable.clearSelection()
          this.multipleSelectionAll = []
          return this.$success('删除成功')
        } else {
          this.$refs.multipleTable.clearSelection()
          this.multipleSelectionAll = []
          return this.$error(res.retMsg)
        }
      }).catch(() => {
        return this.$error('删除失败')
      })
    },
    handleSizeChange (val) {
      this.changePageCoreRecordData()
      this.limit = val
      this.getEventList()
    },
    handleCurrentChange (val) {
      this.changePageCoreRecordData()
      this.currentPage = val
      this.getEventList()
    },
    toHistoryList (id) {
      window.sessionStorage.setItem('queryFormRiskEvent', JSON.stringify(this.queryForm))
      const fatherPath = this.$route.path
      this.$router.push({
        path: 'historyList',
        query: { id, fatherPath }
      })
    },
    dicvluList (params, type) {
      this.$api.myApi.customer.dicvluList(params).then(res => {
        if (res.retCode === '0') {
          if (type === 1) {
            this.riskEvntTypeList = res.result.list
          } else if (type === 2) {
            this.custTypList = res.result.list
          } else if (type === 3) {
            this.idTypeList = res.result.list
          } else {
            this.statusList = res.result.list
          }
        }
      })
    },
    // 获取当前的字典名称
    getCurrentDic (code, data) {
      let result = ''
      data.map(item => {
        if (item.parmVluCod === code) {
          result = item.parmVlu
        }
      })
      return result
    },
    // 接收行政区划代码
    cascaderStr (val) {
    },
    filterStatus (value) {
      if (value === '活跃') {
        return 'success-status'
      } else {
        return 'pending-status'
      }
    }
  }
}
</script>

<template>
  <div class="page-wrapper sys-monitor-wrap">
    <div class="search-wrapper">
      <un-form inline>
        <un-form-item label="开始日期">
          <un-date-picker
            v-model="opStartDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择开始日期"
            :picker-options="startPickerOptions"
          />
        </un-form-item>
        <un-form-item label="结束日期">
          <un-date-picker 
            v-model="opEndDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择结束日期"
            :picker-options="endPickerOptions"
          />
        </un-form-item>
        <un-form-item>
          <un-button type="primary" @click="handleSearch">查询</un-button>
          <un-button @click="resetSearch">重置</un-button>
        </un-form-item>
      </un-form>
    </div>
    <un-table
        :data="tableData"
        style="width: 100%"
        stripe
        :default-sort="{prop: 'op_time', order: 'descending'}"
        :row-style="{'height':'40px'}"
        :header-row-style="{'height':'40px'}"
        :class="['limitmaxheight',{isBorder: tableData.length === 0}]"
      >
        <un-table-column prop="op_time" label="日期" sortable width="180" align="center"></un-table-column>
        <un-table-column prop="op_user" label="操作人ID" sortable width="180" align="center"></un-table-column>
        <un-table-column prop="name" label="操作人姓名" sortable width="180" align="center"></un-table-column>
        <un-table-column prop="op_detail" label="日志内容" align="center"></un-table-column>
      </un-table>
      <div class="pageDiv">
        <div class="totalNum">总共{{totalNum}}个项目</div>
        <un-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="prev, pager, next, sizes, jumper"
          :total="totalNum"
          >
        </un-pagination>
      </div>
  </div>
</template>

<script>
import un from 'unicorn-ui'
import store from '@/modules/sys_monitor/store'

export default un.component(
  {
    data () {
      return {
        opStartDate: '',
        opEndDate: ''
      }
    },
    computed: {
      curPage: {
        get: function () {
          return this.currentPage
        },
        set: function (newVal) {
          this.setCurrentPage(newVal)
        }
      },
      startPickerOptions(){
        return{
          disabledDate:(time)=>{
            const currentDate = new Date(this.today + ' 00:00:00').getTime()
            const minDate = new Date(this.minStartDate + ' 00:00:00').getTime()
            const endDate = this.opEndDate ? new Date(this.opEndDate + '00:00:00').getTime() : currentDate
            return time.getTime() < minDate || time.getTime() > endDate
          }
        }  
      },
      endPickerOptions(){
        return{
            disabledDate:(time)=>{
            const currentDate = new Date(this.today + ' 00:00:00').getTime()
            const startDate = this.opStartDate ? new Date(this.opStartDate + '00:00:00').getTime() : new Date(this.minStartDate + '00:00:00').getTime()
            return time.getTime() < startDate || time.getTime() > currentDate
             }         
          }
      },
      today(){
        return this.formatDate(new Date())
     },
     minStartDate(){
      return this.formatDate(this.getOffsetMonthDate(new Date(), -6))
     }
    },
    created () {
      this.initDefaultDates()
      this.handleSearch()
    },
    methods: {
      formatter (row, column) {
        return row.address
      },
      formatDate(date){
        const year = date.getFullYear()
        const month = `${date.getMonth() + 1}`.padStart(2,'0')
        const day = `${date.getDate()}`.padStart(2,0)
        return `${year}-${month}-${day}`
      },
      getOffsetMonthDate(baseDate,offsetMonth){
        const date = new Date(baseDate)
        const day = date.getDate()
        date.setDate(1)
        date.setMonth(date.getMonth() + offsetMonth)
        const lastDay = new Date(date.getFullYear(),date.getMonth() + 1,0).getDate()
        date.setDate(Math.min(day,lastDay))
        return date
      },
      initDefaultDates(){
        this.opEndDate = this.today
        this.opStartDate = this.formatDate(this.getOffsetMonthDate(new Date(),-5))
      },
      handleSearch(){
        this.setCurrentPage(1)
        this.getInfo({
          opStartDate: this.opStartDate,
          opEndDate: this.opEndDate
        })
      },
      resetSearch(){
        this.initDefaultDates()
        this.handleSearch()
      },
      handleSizeChange (size) {
        this.setPageSize(size)
        this.setCurrentPage(1)
        if (size <= this.totalNum) {
          this.setCurTableData({ start: 0, end: size })
        } else {
          this.setCurTableData({ start: 0, end: this.totalNum })
        }
      },
      handleCurrentChange (newPage) {
        console.log(`当前页: ${newPage}`)
        this.setCurrentPage(newPage)
        if (newPage <= Math.ceil(this.totalNum / this.pageSize)) {
          this.setCurTableData({
            start: (newPage - 1) * this.pageSize,
            end: newPage * this.pageSize
          })
        } else {
          this.setCurTableData({ start: 0, end: this.totalNum })
        }
      }
    }
  },
  {
    state: {
      self: ['logInfo', 'tableData', 'totalNum', 'pageSize', 'currentPage', 'cache']
    },
    mutations: {
      self: [
        'queryDetailTraceXX',
        'queryDetailTraceXXX',
        'setLog',
        'setPageSize',
        'setCurTableData',
        'setCurrentPage'
      ]
    },
    actions: {
      self: ['getInfo', 'getInfo2']
    }
  },
  {
    mName: 'sysMonitor',
    store
  }
)
</script>

<style lang="scss">
@media only screen and(min-height:801px) {
  .limitmaxheight.un-table td, .limitmaxheight.un-table th{
    padding: 0px;
  }
}
.sys-monitor-wrap {
  .search-wrapper{
    margin-bottom: 16px;

    .un-form{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    .un-form-item{
      margin-bottom: 12px;
      margin-right: 16px;
    }
  }
}
.item-top-wrapper {
  .item-list-wrapper {
    .item-search-wrapper {
      .un-input {
        .un-input__suffix {
          right: 10px;
          cursor: pointer;
        }
      }
    }
    .un-table {
      &.limitmaxheight {
        td,th{
          padding: 0;
        }
      }
      .table-icon-wrapper {
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        float: left;
        .table-icon {
          &.icon-minus:before {
            content: "\E621";
          }
        }
      }
      tr.un-table__row {
        &.item-row-level-2 {
          > td:first-child > div.cell {
            padding-left: 24px;
          }
        }
        &.item-row-level-3 {
          > td:first-child > div.cell {
            padding-left: 38px;
          }
        }
        &.item-row-level-4 {
          > td:first-child > div.cell {
            padding-left: 52px;
          }
        }
        &.item-row-level-5 {
          > td:first-child > div.cell {
            padding-left: 66px;
          }
        }
        div.cell {
          white-space: nowrap;
        }
      }
    }
  }
}
.pageDiv{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .totalNum{
    font-size: 14px;
    color: #999999;
  }
  .un-pagination.is-background {
    margin-top: 16px;
    .btn-next, .btn-prev, .un-pager li{
      min-width: 28px;
      height: 28px;
      line-height: 28px;
    }
    .un-select {
      .un-input {
          .un-input__inner{
          line-height: 10px;
          }
        }
    }
  }
}
</style>

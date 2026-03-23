<template>
  <div class="page-wrapper sys-monitor-wrap">
    <un-table
        :data="tableData"
        style="width: 100%"
        stripe
        :default-sort="{prop: 'op_date', order: 'descending'}"
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
          :total="totalNum">
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
      return {}
    },
    computed: {
      curPage: {
        get: function () {
          return this.currentPage
        },
        set: function (newVal) {
          this.setCurrentPage(newVal)
        }
      }
    },
    created () {
      this.getInfo()
      //this.setCurTableData({start:0, end:this.totalNum});
    },
    methods: {
      formatter (row, column) {
        return row.address
      },
      handleSizeChange (size) {
        this.setPageSize(size)
        if (size <= this.totalNum) {
          this.setCurTableData({ start: 0, end: size })
        } else {
          this.setCurTableData({ start: 0, end: this.totalNum })
        }
      },
      handleCurrentChange (newPage) {
        console.log(`当前页: ${newPage}`)
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

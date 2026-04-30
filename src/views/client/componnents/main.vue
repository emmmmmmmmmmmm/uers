<template>
  <div class="wrap-con">
    <section class="wrap-tabs-order">
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="客户识别"
          name="first"
          class="tabs-class"
        >
          <natural-info
            v-if="clientType==='11'"
            :userInfo='userInfo1'
            :customerInfo='customerInfo1'
          ></natural-info>
          <no-natural-info
            v-else
            :userInfo='userInfo2'
            :customerInfo='customerInfo2'
          ></no-natural-info>
          <recognition
            v-if="regTyp==='1'"
            :frRegRson='frRegRson'
            ref="frRecognition"
            @downloadRelated="downloadRelated"
          ></recognition>
          <re-recognition
            v-else
            :reRegRson='reRegRson'
            ref="reRecognition"
          ></re-recognition>
        </el-tab-pane>
        <el-tab-pane
          label="账户信息"
          name="second"
          class="tabs-class"
          style="margin: 0 -20px"
        >
          <account ref="account"></account>
        </el-tab-pane>
        <el-tab-pane
          label="报告信息"
          name="third"
          class="tabs-class"
        >
          <abnormal-report></abnormal-report>
        </el-tab-pane>
        <!-- <el-tab-pane
          label="交易信息"
          name="fourth"
          class="tabs-class"
        >
          <business ref="Business"></business>
        </el-tab-pane> -->
        <el-tab-pane
          label="历史识别情况"
          name="fifth"
          class="tabs-class"
          style="margin: 0 -20px"
        >
          <history-discriminate ref="HistoryDiscriminate"></history-discriminate>
        </el-tab-pane>
        <el-tab-pane
          label="历史评级结果"
          name="sixth"
          class="tabs-class"
          style="margin: 0 -20px"
        >
          <history-records
            :cstNo="cstNo"
            evalStas=""
          ></history-records>
        </el-tab-pane>
      </el-tabs>
    </section>
    <div class="wrap-btn">
      <el-button
        type="primary"
        size="mini"
        v-if="type!=='1' && activeName=='first'"
        @click="confirm('0')"
      >提交</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="type!=='1' && activeName=='first'"
        @click="confirm('1')"
      >暂存</el-button>
      <el-button
        size="mini"
        @click="back"
      >返回</el-button>
    </div>
  </div>
</template>
<script>
import NaturalInfo from './Info/NaturalInfo' // 自然人信息
import NoNaturalInfo from './Info/NoNaturalInfo' // 非自然人信息
import ReRecognition from './Info/ReRecognition' // 重新/持续识别信息
import Recognition from './Info/Recognition' // 初次识别信息
import Account from './Account' // 账户信息
import AbnormalReport from '@/views/customer/components/AbnormalReport' // 报告信息
import Business from './Business' // 交易信息
import HistoryDiscriminate from './HistoryDiscriminate' // 历史识别情况
import HistoryRecords from '@/views/customerRisk/components/HistoryRecords' // 历史评级结果
import common from '../../../utils/common'
export default {
  name: 'ClientDetail',
  components: {
    NaturalInfo,
    NoNaturalInfo,
    ReRecognition,
    Recognition,
    Account,
    AbnormalReport,
    Business,
    HistoryDiscriminate,
    HistoryRecords
  },
  data () {
    return {
      activeName: 'first',
      clientType: '',
      regTyp: '',
      type: '',
      userInfo1: {}, // 自然人基本信息
      userInfo2: {}, // 非自然人基本信息
      customerInfo1: {}, // 自然人其他信息
      customerInfo2: {}, // 非自然人其他信息
      frRegRson: {}, // 初次识别
      reRegRson: {}, // 重新/持续识别,
      cstNo: this.$route.query
    }
  },
  created () {
    this.clientType = this.$route.query.cstType ? this.$route.query.cstType : this.$route.query.custType
    this.regTyp = this.$route.query.regTyp
    this.type = this.$route.query.type
    this.getClientInfo() // 客户身份识别-详情-客户信息
  },
  methods: {
    getClientInfo () {
      let params = {
        id: this.$route.query.id
      }
      this.$api.myApi.client.getClientInfo(params).then(res => {
        if (res.retCode === '0') {
          if (this.clientType === '11') {
            this.userInfo1 = res.result.bpStdPers // 自然人基本信息
            this.customerInfo1 = res.result.bpStdPersOther // 非自然人其他信息
          } else {
            this.userInfo2 = res.result.bpStdUnits // 非自然人基本信息
            this.customerInfo2 = res.result.bpStdUnitsOther // 非自然人其他信息
          }
          if (this.regTyp === '1') {
            this.frRegRson = res.result.frRegRson // 初次识别
          } else {
            this.reRegRson = res.result.reRegRson // 重新/持续识别
          }
        } else {
          return this.$error(res.retMsg)
        }
      })
    },
    confirm (type) {
      if (this.regTyp === '1' && type === '0') {
        // 初次识别提交
        this.$refs.frRecognition.editPut((data) => {
          if (data === '0') {
            this.back()
          }
        })
      } else if (this.regTyp === '1' && type === '1') {
        // 初次识别暂存
        this.$refs.frRecognition.editSave((data) => {
          if (data === '0') {
            // this.back()
          }
        })
      } else if (this.regTyp !== '1' && type === '0') {
        // 重新/持续识别提交
        this.$refs.reRecognition.editPut((data) => {
          if (data === '0') {
            this.back()
          }
        })
      } else {
        // 重新/持续识别暂存
        this.$refs.reRecognition.editSave((data) => {
          if (data === '0') {
            // this.back()
          }
        })
      }
    },
    // 取消
    back () {
      this.$router.push(this.$route.query.path)
    },
    // 下载客户关联数据
    downloadRelated (ruleOid) {
      let reasonList = this.regTyp === '1'
        ? (this.frRegRson && this.frRegRson.reasonList) || []
        : (this.reRegRson && this.reRegRson.reasonList) || []
      let target = reasonList.find(r => r.ruleOid === ruleOid)

      if (!target) {
        this.$message.error('没有找到数据')
        return
      }

      let params = {
        reasonList: [target],
        cstNo: this.userInfo1.cstNo || this.userInfo2.cstNo
      }
      if (this.clientType === '11') {
        params.persDto = this.userInfo1
      } else {
        params.unitsDto = this.userInfo2
      }

      this.$api.myApi.client.downloadRelated(params).then(res => {
        if (res.retCode !== '0') {
          return this.$message.error(res.retMsg || '下载失败')
        }
        let baseName = res.result.fileName || '关联客户'
        let fileName = /\.xlsx?$/i.test(baseName) ? baseName : baseName + '.xls'
        let ok = common.dataToFile(res.result.file, fileName, 'application/vnd.ms-excel')
        if (ok) {
          this.$message.success('下载成功')
        } else {
          this.$message.error('下载失败')
        }
      }).catch(() => {
        this.$message.error('下载失败')
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .wrap-con {
  .tabs-class{
    margin-bottom:10px;
    background: unset!important;
    border-radius: 4px 4px 8px 8px;
  }
  }
  .sus-ana-class {
    margin:0 20px;
    background: #fff;
    border-radius: 4px 4px 8px 8px;
  }
  .el-card.is-always-shadow /deep/ .el-card__body {
    padding-top: 0;
  }
  .wrap-btn{
    padding: 20px 0;
    text-align: center;
  }
</style>

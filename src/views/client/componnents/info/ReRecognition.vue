<template>
  <div class="wrap-form">
    <div class="wrap-main">
      <el-row>
        <el-col :span="24">
          <section class="com-detail-item-class">
            <p style="font-weight: bold;margin-bottom: 20px;font-size: 15px">重新/持续识别原因：</p>
            <div class="con-list">
              <el-table
                :data="reRegRson.reasonList"
                style="width: 100%"
                border
              >
                <el-table-column
                  prop="cstName"
                  label="主体名称"
                >
                </el-table-column>
                <el-table-column
                  label="主体身份"
                  prop="cstType"
                >
                </el-table-column>
                <el-table-column
                  prop="ruleName"
                  label="命中规则"
                >
                </el-table-column>

                <el-table-column
                label="关联客户信息"
              >
                <template slot-scope="scope">
                  <span v-if="Number(scope.row.relatedCount) === 0">/</span>
                  <span v-else class="a" @click="downloadRelated(scope.row.ruleOid)">下载数据</span>
                </template>
              </el-table-column>

              </el-table>
            </div>
          </section>
          <section class="com-detail-item-class">
            <el-form
              ref="checkListForm"
              :model="form"
              :rules="rules0"
            >
              <el-form-item
                label="重新/持续识别措施"
                prop="checkList"
              >
                <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <el-checkbox-group
                  v-model="form.checkList"
                  @change="chengeEven"
                >
                  <ul class="actionStyle">
                    <li
                      class="li"
                      v-for="(item,index) in mesrList"
                      :key="index"
                    >
                      <el-checkbox
                        :key="item.reRegMesr"
                        :label="item.reRegMesr"
                        :value="item.reRegMesr"
                        :disabled="disabled"
                      >{{item.reRegMesrDesc}}
                      </el-checkbox>
                    </li>
                  </ul>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item
                label=""
                prop="textarea"
              >
                <el-input
                  type="textarea"
                  :rows="3"
                  :placeholder="check?'':'请输入内容'"
                  :disabled="check"
                  :minlength="1"
                  v-model="form.textarea"
                >
                </el-input>
              </el-form-item>
            </el-form>
          </section>
          <section class="com-detail-item-class">
            <el-form
              ref="selectForm"
              :model="form"
              :rules="rules0"
              class="wrap-form"
              label-position="left"
              label-width="auto"
              size="small"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label="识别结论："
                    prop="regCnlu"
                  >
                    <!-- bankcdr -->
                    <el-input
                      v-if="type === '1'?true:false"
                      class="input-query"
                      :value="form.regCnlu||form.regCnlu===0?form.regCnlu==1?'一般关注':form.regCnlu==2?'持续关注':form.regCnlu==3?'重点关注':'':''"
                      size="mini"
                      :disabled="disabled"
                    >
                    </el-input>
                    <el-select
                      v-else
                      class="input-query"
                      v-model="form.regCnlu"
                      placeholder="请选择"
                      clearable
                      size="mini"
                      :disabled="disabled"
                    >
                      <el-option
                        v-for="item in regCnluList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <!-- /bankcdr -->
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="是否调整风险等级："
                    prop="isRglrRisk"
                  >
                    <!-- bankcdr -->
                    <el-input
                      v-if="type === '1'?true:false"
                      class="input-query"
                      :value="form.isRglrRisk||form.isRglrRisk===0?form.isRglrRisk==0?'是':form.isRglrRisk==1?'否':'':''"
                      size="mini"
                      :disabled="disabled"
                    ></el-input>
                    <el-select
                      v-else
                      class="input-query"
                      v-model="form.isRglrRisk"
                      placeholder="请选择"
                      clearable
                      size="mini"
                      :disabled="disabled"
                    >
                      <el-option
                        v-for="item in isRglrRiskList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <!-- /bankcdr -->
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="是否异常："
                    prop="isExp"
                  >
                    <!-- bankcdr -->
                    <el-input
                      v-if="type === '1'?true:false"
                      class="input-query"
                      :value="form.isExp||form.isExp===0?form.isExp==0?'是':form.isExp==1?'否':'':''"
                      size="mini"
                      :disabled="disabled"
                    ></el-input>
                    <el-select
                      v-else
                      class="input-query"
                      v-model="form.isExp"
                      placeholder="请选择"
                      clearable
                      size="mini"
                      :disabled="disabled"
                    >
                      <el-option
                        v-for="item in isExpList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <!-- /bankcdr -->
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </section>
          <section class="com-detail-item-class">
            <el-form
              ref="rusultForm"
              :model="form"
              :rules="rules0"
            >
              <el-row>
                <span class="resultLable">{{resultLable}}</span>
              </el-row>
              <el-row>
                <el-col :span='16'>
                  <el-form-item
                    prop="result"
                  >
                    <!-- bankcdr -->
                    <text-component
                      v-model="form.result"
                      :maxLength="500"
                      :disabled="disabled"
                    ></text-component>
                  </el-form-item>
                </el-col>
                <el-col :span='8' class="upload">
                  <upload-file
                    v-if="!disabled"
                    :fileTip="'（支持TXT、DOC、XLS、DOCX、XLSX、JPG、PNG、PDF、ZIP、RAR格式，大小不超过20M，最多可上传5个）'"
                    :fileArr.sync="fileList"
                    :downFilePath="downFilePath"
                  ></upload-file>
                  <div v-else >
                    <p class="a" v-for="item in form.file" :key="item.id" @click="download(item.id,item.name)">{{item.name}}</p>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </section>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import common from '@/utils/common'
import TextComponent from '@/components/textarea'
import uploadFile from '@/components/uploadFile'
export default {
  name: 'ReRecognition',
  components: {
    TextComponent,
    uploadFile
  },
  data () {
    return {
      type: '',
      disabled: false,
      check: true,
      rules0: {},
      rules: {
        result: [
          { required: true, message: '处理结果必输', trigger: 'blur' },
          { max: 500, message: '最多输入500个字符', trigger: 'blur' }
        ],
        checkList: [
          { required: true, message: '请至少选择一项重识别措施', trigger: 'change' }
        ],
        regCnlu: [
          { required: true, message: '请选择识别结论', trigger: 'change' }
        ],
        isRglrRisk: [
          { required: true, message: '请选择是否调整风险等级', trigger: 'change' }
        ],
        isExp: [
          { required: true, message: '请选择是否异常', trigger: 'change' }
        ]
      },
      rules1: {
        result: [
          { required: true, message: '处理结果必输', trigger: 'blur' },
          { max: 500, message: '最多输入500个字符', trigger: 'blur' }
        ],
        checkList: [
          { required: true, message: '请至少选择一项重识别措施', trigger: 'change' }
        ],
        textarea: [
          { required: true, message: '请输入其他可依法采取的措施', trigger: 'blur' },
          { max: 500, message: '最多输入500个字符', trigger: 'blur' }
        ],
        regCnlu: [
          { required: true, message: '请选择识别结论', trigger: 'change' }
        ],
        isRglrRisk: [
          { required: true, message: '请选择是否调整风险等级', trigger: 'change' }
        ],
        isExp: [
          { required: true, message: '请选择是否异常', trigger: 'change' }
        ]
      },
      form: {
        result: '', // 处理结果
        checkList: [],
        textarea: '',
        regCnlu: '',
        isRglrRisk: '',
        isExp: '',
        file: []
      },
      regCnluList: [], // 识别结论
      isRglrRiskList: [], // 是否调整风险等级
      isExpList: [], // 是否异常
      // bank-wangnn
      resultLable: '处理结果（必输）',
      // bank-wangnn
      mesrList: [],
      fileList: [],
      downFilePath: 'investigation.investigationDownFile'
    }
  },
  props: {
    reRegRson: {
      type: Object
    }
  },
  created () {
    this.dicvluList()
    this.type = this.$route.query.type
    this.selectFlag() // 查看1回复2
  },
  methods: {
    selectFlag () {
      this.form = {
        result: '', // 处理结果
        checkList: [],
        textarea: '',
        regCnlu: '',
        isRglrRisk: '',
        isExp: '',
        file: []
      }
      if (this.type === '1') {
        this.check = true
        this.disabled = true
        this.resultLable = '处理结果'
      }
      if (this.reRegRson.file && this.reRegRson.file[0].id) {
        this.fileList = this.reRegRson.file
        this.form.file = this.reRegRson.file
      }
      this.form.regCnlu = this.reRegRson.regCnlu
      this.form.isRglrRisk = this.reRegRson.isRglrRisk
      this.form.isExp = this.reRegRson.isExp
      this.form.result = this.reRegRson.prcsRslt
      // bank-wangnn
      if (this.reRegRson.regMesr && this.reRegRson.regMesr.mesrList) {
        this.reRegRson.regMesr.mesrList.forEach((item, index) => {
          if (item.isChecked === '0') {
            this.form.checkList.push(item.reRegMesr)
          }
        })
        this.form.textarea = this.reRegRson.regMesr.othMesrDesc
        this.mesrList = this.reRegRson.regMesr.mesrList
      }
      // bank-wangnn
    },
    chengeEven (e) {
      for (let i = 0; i < e.length; i++) {
        if (e[i] === 'A009') {
          this.check = false
          return
        } else {
          this.check = true
        }
      }
      if (this.check === true) {
        this.form.textarea = ''
      }
      if (e.length === 0) {
        this.check = true
      }
    },
    // 修改提交
    editPut (callback) {
      let resultValid = false
      let checkListValid = false
      let selectValid = false
      if (!this.check) {
        this.$refs.checkListForm.rules = this.rules1
      } else {
        this.$refs.checkListForm.rules = this.rules
      }
      this.$refs.rusultForm.rules = this.rules
      this.$refs.rusultForm.validate((valid) => {
        if (valid) {
          resultValid = true
        }
      })
      this.$refs.selectForm.rules = this.rules
      this.$refs.selectForm.validate((valid) => {
        if (valid) {
          selectValid = true
        }
      })
      this.$refs.checkListForm.validate((valid) => {
        if (valid) {
          checkListValid = true
        }
      })

      if (resultValid && checkListValid && selectValid) {
        let obj = {
          idList: this.form.checkList,
          othMesrDesc: this.form.textarea
        }
        let params = {
          id: this.$route.query.id,
          reRegMesr: obj,
          regCnlu: this.form.regCnlu,
          isRglrRisk: this.form.isRglrRisk,
          isExp: this.form.isExp,
          prcsRslt: this.form.result
        }
        if (this.fileList[0]) {
          params.file = this.fileList
        }
        this.$confirm('是否提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.myApi.client.reRecognitionConfirm(params)
            .then(res => {
              if (res.retCode === '0') {
                this.$message.success(res.retMsg)
                let num = '0'
                callback(num)
              } else {
                this.$message.error(res.retMsg)
              }
            })
        }).catch(() => {
          this.$message.info('取消提交')
        })
      }
    },
    // 修改暂存
    editSave (callback) {
      let obj = {
        idList: this.form.checkList,
        othMesrDesc: this.form.textarea
      }
      let params = {
        id: this.$route.query.id,
        reRegMesr: obj,
        regCnlu: this.form.regCnlu,
        isRglrRisk: this.form.isRglrRisk,
        isExp: this.form.isExp,
        prcsRslt: this.form.result
      }
      if (this.fileList[0]) {
        params.file = this.fileList
      }
      this.$confirm('是否暂存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.myApi.client.reRecognitionSave(params)
          .then(res => {
            if (res.retCode === '0') {
              this.$message.success(res.retMsg)
              let num = '0'
              callback(num)
            } else {
              this.$message.error(res.retMsg)
            }
          })
      }).catch(() => {
        this.$message.info('取消暂存')
      })
    },
    // 下载关联客户数据
    downloadRelated (ruleOid) {
      this.$emit('downloadRelated', ruleOid)
    },
    // 下载附件
    download (id, name) {
      this.$api.myApi.investigation.investigationDownFile({ id }).then(res => {
        if (res.retCode === '0') {
          let result = common.dataToFile(res.result.file, name, 'application/vnd.ms-excel')
          if (result) {
            this.$success(res.retMsg)
          } else {
            this.$error(res.retMsg)
          }
        } else {
          this.$error(res.retMsg)
        }
      }).catch(() => {
        this.$info('取消下载')
      })
    },
    // 下拉框字典值
    dicvluList () {
      common.getDicList('BRIN0029', '0').then(res => {
        this.isExpList = res
      }).then(() => {
        common.getDicList('BRIN0046', '0').then((res) => {
          this.regCnluList = res
        }).then(() => {
          common.getDicList('BRIN0029', '0').then((res) => {
            this.isRglrRiskList = res
          })// 是否调整风险等级
        })// 识别结论
      })// 是否调整风险等级
    }
  },
  watch: {
    reRegRson (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.reRegRson = newValue
        this.reRegRson.regMesr.mesrList.forEach((item, index) => {
          if (item.isChecked === '0') {
            this.form.checkList.push(item.reRegMesr)
            // bank-wangnn
            if (item.reRegMesr === 'A009' && this.type !== '1') {
              this.check = false
            } else {
              this.check = true
            }
            // bank-wangnn
          }
        })
        this.mesrList = this.reRegRson.regMesr.mesrList
        this.form.textarea = this.reRegRson.regMesr.othMesrDesc
        this.form.regCnlu = this.reRegRson.regCnlu
        this.form.isRglrRisk = this.reRegRson.isRglrRisk
        this.form.isExp = this.reRegRson.isExp
        this.form.result = this.reRegRson.prcsRslt
        if (this.reRegRson.file && this.reRegRson.file[0].id) {
          this.fileList = this.reRegRson.file
          this.form.file = this.reRegRson.file
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .actionStyle {
    padding-inline-start: 0;
  }
  .li{
    list-style: none;
  }
  /deep/ .wrap-form .el-input {
    width: 200px!important;
  }
  .wrap-form {
    margin: 0;
    padding-bottom: 10px;
    background: #fff;
  }
  /deep/ .el-form-item__label-wrap{
    margin-left: 0!important;
  }

  .wrap-main{
    padding: 0 20px;
  }
  .resultLable{
    color: rgba(0, 0, 0, 0.58);
    font-weight: bolder;
    line-height: 40px;
  }
  .a{
    cursor: pointer;
    color:#5086FF;
    margin-left: 10% !important;
    text-align: left;
  }
  .upload{
    padding-left: 20px
  }
  </style>

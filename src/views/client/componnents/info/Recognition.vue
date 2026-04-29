<template>
  <div class="wrap-form">
    <div class="wrap-main">
      <el-row>
        <section class="com-detail-item-class circle-class">
          <p style="font-weight: bold;margin-bottom: 20px;font-size: 15px">初次识别原因：</p>
          <div class="con-list">
            <el-table
              :data="frRegRson.reasonList"
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
      </el-row>

      <section class="com-detail-item-class circle-class">
        <el-form
          ref="selectForm"
          :model="form"
          :rules="type === '1' ? rules0 : rules"
          class="wrap-form"
          label-position="left"
          label-width="auto"
          size="small"
        >
          <el-row>
            <!-- bankcdr -->
            <el-col :span="8">
              <el-form-item
                label="识别结论："
                prop="regCnlu"
              >
                <el-input
                  v-if="type === '1'?true:false"
                  :value="form.regCnlu||form.regCnlu===0?form.regCnlu==1?'一般关注':form.regCnlu==2?'持续关注':form.regCnlu==3?'重点关注':'':''"
                  size="mini"
                  :disabled="disabled"
                >
                </el-input>
                <el-select
                  v-else
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
              </el-form-item>
            </el-col>
            <!-- /bankcdr -->

            <el-col :span="8">
              <el-form-item
                label="是否异常："
                prop="isExp"
              >
                <!-- bankcdr -->
                <el-input
                  v-if="type === '1'?true:false"
                  :value="form.isExp||form.isExp===0?form.isExp==0?'是':form.isExp==1?'否':'':''"
                  size="mini"
                  :disabled="disabled"
                ></el-input>
                <el-select
                  v-else
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
      <section class="com-detail-item-class circle-class">
        <el-form
          ref="rusultForm"
          :model="form"
          :rules="type === '1' ? rules0 : rules"
        >
          <el-row>
            <span class="resultLable">处理结果</span>
          </el-row>
          <el-row>
            <el-col :span='16'>
              <el-form-item
                prop="result"
              >
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
    </div>
  </div>
</template>
<script>
import common from '@/utils/common'
import TextComponent from '@/components/textarea'
import uploadFile from '@/components/uploadFile'
export default {
  name: 'Recognition',
  components: {
    TextComponent,
    uploadFile
  },
  data () {
    return {
      type: '',
      disabled: false,
      rules0: {},
      rules: {
        result: [
          { max: 500, message: '最多输入500个字符', trigger: 'blur' }
        ],
        regCnlu: [
          { required: true, message: '请选择识别结论', trigger: 'change' }
        ],
        isExp: [
          { required: true, message: '请选择是否异常', trigger: 'change' }
        ]
      },
      form: {
        result: '', // 处理结果
        regCnlu: '',
        isExp: ''
      },
      regCnluList: [], // 识别结论
      isExpList: [], // 是否异常
      fileList: [],
      downFilePath: 'investigation.investigationDownFile'
    }
  },
  props: {
    frRegRson: {
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
      if (this.type === '1') {
        this.disabled = true
      } else {
        if (this.frRegRson.file && this.frRegRson.file[0].id) {
          this.fileList = this.frRegRson.file
          this.form.file = this.frRegRson.file
        }
      }
      this.form.regCnlu = this.frRegRson.regCnlu
      this.form.isExp = this.frRegRson.isExp
      this.form.result = this.frRegRson.prcsRslt
    },

    // 修改提交
    editPut (callback) {
      this.$refs.selectForm.rules = this.rules
      this.$refs.rusultForm.rules = this.rules
      let resultValid = false
      let selectValid = false
      this.$refs.rusultForm.validate((valid) => {
        if (valid) {
          resultValid = true
        }
      })
      this.$refs.selectForm.validate((valid) => {
        if (valid) {
          selectValid = true
        }
      })
      if (resultValid && selectValid) {
        let params = {
          id: this.$route.query.id,
          regCnlu: this.form.regCnlu,
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
          this.$api.myApi.client.recognitionConfirm(params)
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
      let params = {
        id: this.$route.query.id,
        regCnlu: this.form.regCnlu,
        isExp: this.form.isExp,
        prcsRslt: this.form.result
      }
      if (this.fileList[0]) {
        console.log('this.fileList', this.fileList[0], this.fileList[0].base64)
        params.file = this.fileList
      }
      this.$confirm('是否暂存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.myApi.client.recognitionSave(params)
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
    // 下载客户关联数据
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
        })// 识别结论
      })// 是否调整风险等级
    }
  },
  watch: {
    frRegRson (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.frRegRson = newValue
        this.form.regCnlu = this.frRegRson.regCnlu
        this.form.isExp = this.frRegRson.isExp
        this.form.result = this.frRegRson.prcsRslt
        if (this.frRegRson.file && this.frRegRson.file[0].id) {
          this.fileList = this.frRegRson.file
          this.form.file = this.frRegRson.file
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
.circle-class{
  padding-left: 12px;
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

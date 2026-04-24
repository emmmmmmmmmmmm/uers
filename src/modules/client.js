import { get, post } from '@/utils/http'

export default {
  /**
   * 接口含义：客户身份识别-查询-列表
   */
  getQueryList: function (param) {
    return post('dubhe/client/query/list', param)
  },
  /**
   * 接口含义：客户身份识别-查询-导出选项
   */
  exportQuery: function (param) {
    return post('dubhe/client/query/export', param)
  },
  /**
   * 接口含义：客户身份识别-查询-导出全部
   */
  exportAllQuery: function (param) {
    return post('dubhe/client/query/exportAll', param)
  },
  /**
   * 接口含义：客户身份识别-详情-客户信息
   */
  getClientInfo: function (param) {
    return get('dubhe/client/query/info', param)
  },
  /**
   * 接口含义：客户身份识别-详情-账户信息
   */
  getAccountList: function (param) {
    return get('dubhe/client/account/list', param)
  },
  /**
   * 接口含义：客户身份识别-详情-账户信息
   */
  getAccountInfo: function (param) {
    return get('dubhe/client/account/info', param)
  },
  /**
   * 接口含义：客户身份识别-详情-报告信息列表（暂不实现）
   */
  getReportList: function (param) {
    return get('dubhe/client/report/list', param)
  },
  /**
   * 接口含义：客户身份识别-详情-交易信息列表
   */
  getBusinessList: function (param) {
    return get('dubhe/client/business/list', param)
  },
  /**
   * 接口含义：客户身份识别-详情-交易信息详情
   */
  getBusinessInfo: function (param) {
    return get('dubhe/client/business/info', param)
  },
  /**
   * 接口含义：客户身份识别-详情-历史识别列表
   */
  getHistoryDiscriminateList: function (param) {
    return get('dubhe/client/history-discriminate/list', param)
  },
  /**
   * 接口含义：客户身份识别-详情-历史评级列表（暂不实现）
   */
  getHistoryGradeList: function (param) {
    return get('dubhe/client/history-grade/list', param)
  },
  /**
   * 接口含义：客户重新识别-处理-列表
   */
  getReRecognitionList: function (param) {
    return post('dubhe/client/re-recognition/list', param)
  },
  /**
   * 接口含义：客户重新识别-处理-导出选项详情
   */
  exportInfo: function (param) {
    return post('dubhe/client/re-recognition/export', param)
  },
  /**
   * 接口含义：客户重新识别-处理-导出全部详情
   */
  exportAllInfo: function (param) {
    return post('dubhe/client/re-recognition/exportAll', param)
  },
  /**
   * 接口含义：客户重新识别-处理-处理结果上传
   */
  upload: function (param) {
    return post('dubhe/client/re-recognition/upload', param)
  },
  /**
   * 接口含义：客户重新识别-处理-暂存
   */
  reRecognitionSave: function (param) {
    return post('dubhe/client/re-recognition/save', param)
  },
  /**
   * 接口含义：客户重新识别-处理-提交
   */
  reRecognitionConfirm: function (param) {
    return post('dubhe/client/re-recognition/confirm', param)
  },
  /**
   * 接口含义：客户初次识别-处理-列表
   */
  getRecognitionList: function (param) {
    return post('dubhe/client/recognition/list', param)
  },
  /**
   * 接口含义：客户初次识别-处理-识别选项
   */
  recognitionOptions: function (param) {
    return post('dubhe/client/recognition/options', param)
  },
  /**
   * 接口含义：客户初次识别-处理-识别全部
   */
  recognitionAll: function (param) {
    return post('dubhe/client/recognition/all', param)
  },
  /**
   * 接口含义：客户初次识别-处理-暂存
   */
  recognitionSave: function (param) {
    return post('dubhe/client/recognition/save', param)
  },
  /**
   * 接口含义：客户初次识别-处理-提交
   */
  recognitionConfirm: function (param) {
    return post('dubhe/client/recognition/confirm', param)
  },
  /**
   * 接口含义：字典值
   */
  dicvluList: function (param) {
    return get('dicmanage/dicvlu/list', param)
  },
  /**
   * 接口含义：获取识别规则列表
   */
  getRegRuleList: function (param) {
    return get('dubhe/client/regRule/list', param)
  },
  /**
   * 接口含义：客户身份识别-详情-下载关联客户数据
   */
  downloadRelatedList: function (param) {
    return post('dubhe/client/query/downloadRelatedList', param)
  }
}

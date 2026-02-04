<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>欢迎使用 Vue.js 项目</h2>
    
    <el-divider></el-divider>
    
    <div class="demo-section">
      <h3>Element UI 组件示例</h3>
      <el-button type="primary" @click="handleClick">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </div>

    <el-divider></el-divider>

    <h3>快速链接</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Vue 核心文档</a></li>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="https://element.eleme.io/#/zh-CN" target="_blank">Element UI</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    handleClick () {
      this.$message({
        message: '按钮点击成功！',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.hello {
  padding: 20px;
}
h1, h2 {
  font-weight: normal;
}
.demo-section {
  margin: 20px 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

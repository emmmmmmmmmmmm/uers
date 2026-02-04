# uers

> A Vue.js project

## 构建步骤

``` bash
# 安装依赖
npm install

# 启动开发服务器，地址：localhost:8080
npm run dev

# 生产环境构建
npm run build

# 构建主题
npm run build:theme

# 完整构建（主题+代码）
npm run dist

# 代码检查
npm run lint
```

## 项目结构

```
uers/
├── build/              # 构建配置文件
├── config/             # 项目配置
├── src/                # 源代码
│   ├── assets/         # 静态资源
│   ├── components/     # 公共组件
│   ├── router/         # 路由配置
│   ├── store/          # Vuex状态管理
│   ├── views/          # 页面组件
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── static/             # 静态文件
├── index.html          # HTML模板
└── package.json        # 项目依赖
```

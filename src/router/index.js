import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/uers_process',
      name: '/uers_process',
      component: uers_process,
      meta: { title: 'uers_process' },
      children: [
        { path: '/uers_process/approval', name: '/uers_process/approval', component: processApproval, meta: { title: 'processApproval', parentPath: '/uers_process' } }
      ]
    }
  ]
})

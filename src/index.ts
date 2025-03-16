import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import '@/style/index.scss'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './routes'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 创建 Vue 应用实例
const app = createApp(App)

// 注册 Element Plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 创建 Pinia 实例并挂载到应用
const pinia = createPinia()

// 使用 Pinia、ElementPlus 和路由，并挂载应用
app.use(pinia).use(ElementPlus).use(router).mount('#root')
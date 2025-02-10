import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import '@/style/index.scss'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './routes'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia).use(ElementPlus).use(router)
app.mount('#root')

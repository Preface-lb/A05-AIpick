import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UserLoginInfo } from '@/type/user'

export const useLoginStore = defineStore('login', () => {
  const loginInfo = ref<UserLoginInfo | null>()
  const isLogin = ref<boolean>(false)
  function setLoginStore(data: UserLoginInfo | null) {
    isLogin.value = true
    loginInfo.value = data
  }
  function clearLoginStore() {
    isLogin.value = false
    loginInfo.value = null
  }
  return {
    isLogin,
    loginInfo,
    setLoginStore,
    clearLoginStore,
  }
})

import { reactive } from 'vue'

export const storeLogin = reactive({
  userName: '',
  token: '',
  authenticated: false
})
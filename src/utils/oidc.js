import {
  UserManager,
  WebStorageStateStore
} from 'oidc-client'
import { LocalStorage } from 'quasar'
import { useAuthStore } from 'stores/auth'
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
const authorityURL =
  'https://auth.lab.supercomputing.link/auth/realmsco-com/protocol/openid-connect/auth'
const clientID = 'scn-portalwetsite'
const clientSecret = 'R70P45J72AznNJssuKINxciVbwP9cQGy'
const settings = {
  // *OIDC/OAuth2提供程序的URL
  authority: authorityURL,
  // *在OIDC/OAuth2中注册的客户端应用程序标识符
  client_id: clientID,
  client_secret: clientSecret,
  // *希望从OIDC/OAuth2提供程序获得的响应类型（默认值：“id_token”）
  response_type: 'code',
  // *从OIDC/OAuth2提供程序请求的范围（默认值：“openid”）
  scope: 'openid profile',
  // *客户端应用程序的重定向URI，用于接收来自OIDC/OAuth2提供程序的响应
  redirect_uri: `${window.location.origin}/oidc/call-back`,
  // OIDC/OAuth2注销后重定向URI
  post_logout_redirect_uri: `${window.location}`,
  // 是否应从配置文件中删除OIDC协议声明（默认值：true）
  filterProtocolClaims: true,
  // 包含处理静默续订的代码的页面的URL
  silent_redirect_uri: `${window.location.origin}/oidc/silent-renew`,
  // 指示在访问令牌到期之前是否应自动尝试续订该令牌的标志（默认值：false）
  automaticSilentRenew: true,
  // 将在用户在OP上执行注销时引发事件（默认值：true）
  monitorSession: true,
  // 检查用户会话的间隔（毫秒）（默认值：2000）
  checkSessionInterval: 2000,
  // 如果用户有访问令牌，将在注销时调用吊销端点（默认值：false）
  revokeAccessTokenOnSignout: true,
  // 用于为当前经过身份验证的用户持久化用户的存储对象（默认：session storage）
  userStore: new WebStorageStateStore({ store: window.localStorage })
}

const oidc = new UserManager(settings)

oidc.events.addUserLoaded(async function(user, ...args) {
  LocalStorage.set('token', user.access_token)
  LocalStorage.set('expires_at', user.expires_at)
})

oidc.events.addAccessTokenExpired(function(...args) {
  console.log('-> Access token expired', args)
  oidc.signinSilent()
  oidc
    .signinSilentCallback()
    .then((res) => {
      console.log('Silent renew success')
    })
    .catch((e) => {
      console.log('Silent renew failure')
    })
})

const $OidcMgr = {
  // 跳转到登录页面
  login: () => {
    return oidc.signinRedirect({ state: window.location.href })
  },
  silentin: () => {
    return oidc.signinSilent()
  },
  logout: async() => {
    const AuthStore = useAuthStore()
    await oidc.signoutRedirect()
    LocalStorage.remove('token')
    LocalStorage.remove('expires_at')
    AuthStore.logout()
  },
  get_user: async() => {
    const AuthStore = useAuthStore()
    const user = await oidc.getUser()
    const userinfo = {
      id: user?.profile.sub,
      name: `${user?.profile?.family_name}${user?.profile?.given_name}`,
      email: user?.profile.email,
      role: user?.profile['https://hasura.io/jwt/claims'][0]['x-hasura-allowed-roles'][0]
    }
    AuthStore.set_user(userinfo)
    // LocalStorage.set('info', userinfo)
    return userinfo
    // return oidc.getUser()
  },
  call_back: () => {
    return oidc.signinCallback().then(() => {
      window.location.href = '/'
    })
  }
}

// export default boot(({app}) => {
//   // for use inside Vue files (Options API) through and this.$oidc
//   // app.config.globalProperties.$oidc = oidc;
//   // app.config.globalProperties.$OidcMgr = OidcMgr
// });
export { oidc, $OidcMgr }

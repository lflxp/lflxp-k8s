import { find, assign } from 'lodash'
import faker from 'faker/locale/zh_CN'
import { service, serviceForMock, request, requestForMock, mock } from '@/api/_service.js'
import * as tools from '@/api/_tools.js'

const users = [
  { username: 'admin', password: 'admin', uuid: 'admin-uuid', name: 'Admin' },
  { username: 'editor', password: 'editor', uuid: 'editor-uuid', name: 'Editor' },
  { username: 'user1', password: 'user1', uuid: 'user1-uuid', name: 'User1' }
]

/**
 * @description 登录
 * @param {Object} data 登录携带的信息
 */
export function SYS_USER_LOGIN (data = {}) {
  console.log('SYS_USER_LOGIN 1', data);
  // 模拟数据
  // mock
  //   .onAny('/login')
  //   .reply(config => {
  //     const user = find(users, tools.parse(config.data))
  //     console.log('SYS_USER_LOGIN 3', user);
  //     return user
  //       ? tools.responseSuccess(assign({}, user, { token: faker.random.uuid() }))
  //       : tools.responseError({}, '账号或密码不正确')
  //   })
  // 接口请求
  console.log('SYS_USER_LOGIN 2', data);
  // return requestForMock({
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

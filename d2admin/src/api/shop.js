import { request } from '@/api/_service.js'

export function repolist() {
    return request({
        url: '/shop/list',
        method: 'get'
    })
}

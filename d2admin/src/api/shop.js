import { request } from '@/api/_service.js'

export function repolist() {
    return request({
        url: '/shop/list',
        method: 'get'
    })
}

export function repotest() {
    return request({
        url: '/shop/test',
        method: 'get'
    })
}
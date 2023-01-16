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

export function repoparam(path) {
    return request({
        url: '/shop/param?path=' + path,
        method: 'get'
    })
}

export function repoparamPost(path,data) {
    return request({
        url: '/shop/param?path=' + path,
        method: 'post',
        data: data
    })
}

export function repoparamDel(path) {
    return request({
        url: '/shop/param?path=' + path,
        method: 'delete'
    })
}
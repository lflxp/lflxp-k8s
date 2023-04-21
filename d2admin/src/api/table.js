import { request } from '@/api/_service.js'

export function tablelist() {
    return request({
        url: '/tablelist',
        method: 'get'
    })
}

export function apiserver(data) {
    return request({
        url: '/gvr/list',
        method: 'post',
        data
    })
}

export function apiput(data) {
    return request({
        url: '/gvr',
        method: 'put',
        data
    })
}

export function apidelete(data) {
    return request({
        url: '/gvr',
        method: 'delete',
        data
    })
}

export function apipatch(data) {
    return request({
        url: '/gvr/patchstrate',
        method: 'patch',
        data
    })
}

export function apiresource() {
    return request({
        url: '/gvr/all',
        method: 'get'
    })
}

export function apinamespace() {
    return request({
        url: '/gvr/namespace',
        method: 'get'
    })
}
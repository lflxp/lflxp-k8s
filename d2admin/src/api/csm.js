import { request } from '@/api/_service.js'

export function agentlist() {
    return request({
        url: '/alive/agent?fast=true',
        method: 'get'
    })
}

export function hbcheck() {
    return request({
        url: '/alive/hbcheck',
        method: 'get'
    })
}

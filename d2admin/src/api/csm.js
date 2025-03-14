import { request } from '@/api/_service.js'

export function agentlist() {
    return request({
        url: '/alive/agent?fast=true',
        method: 'get'
    })
}

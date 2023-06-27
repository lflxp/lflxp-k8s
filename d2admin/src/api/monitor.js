import { request } from '@/api/_service.js'

export function prom(query) {
    return request({
        url: '/monitor/prometheus/api/v1/query?query=' + query,
        method: 'get'
    })
}

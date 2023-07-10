import { request } from '@/api/_service.js'

export function prom(query) {
    return request({
        url: '/monitor/prometheus/api/v1/query?query=' + query,
        method: 'get'
    })
}

export function metricsNode() {
    return request({
        url: '/monitor/metrics/node',
        method: 'get'
    })
}

export function metricsPod(ns) {
    return request({
        url: '/monitor/metrics/pod/' + ns,
        method: 'get'
    })
}
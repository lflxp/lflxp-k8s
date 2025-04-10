import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState, useEffect } from 'react';
import request from '@/api/request'; 
import { toast } from '@/hooks/use-toast'

export function Total() {
  const [pods, setPods] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [cm, setCm] = useState([]);

  const fetchData = async () => {
    try {
      const response = await request.post('/api/gvr/list', {
        group: "",
        version: "v1",
        resource: "pods",
        namespace: "",
      });
      // console.log('请求接口成功:', response.data.items)
      setPods(response.data.items);

      const response2 = await request.post('/api/gvr/list', {
        group: "",
        version: "v1",
        resource: "namespaces",
        namespace: "",
      });
      // console.log('请求接口成功:', response.data.items)
      setNamespaces(response2.data.items);

      const response3 = await request.post('/api/gvr/list', {
        group: "",
        version: "v1",
        resource: "nodes",
        namespace: "",
      });
      // console.log('请求接口成功:', response.data.items)
      setNodes(response3.data.items);

      const response4 = await request.post('/api/gvr/list', {
        group: "",
        version: "v1",
        resource: "configmaps",
        namespace: "",
      });
      // console.log('请求接口成功:', response.data.items)
      setCm(response4.data.items);
    } catch (error) {
      toast({
        title: '请求接口出错',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>
              {JSON.stringify(error, null, 2)}
            </code>
          </pre>
        ),
      })
    }
  };

  useEffect(() => {
    fetchData();
  },[]);

  return (
    <>
      <Card onClick={() => window.location.href = '/shadcn/pods'}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Pods 
          </CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{ pods.length }</div>
          <p className='text-xs text-muted-foreground'>
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
           Namespaces 
          </CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
            <circle cx='9' cy='7' r='4' />
            <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>+{ namespaces.length }</div>
          <p className='text-xs text-muted-foreground'>
            +180.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card onClick={() => window.location.href = '/shadcn/nodes'}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Nodes</CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <rect width='20' height='14' x='2' y='5' rx='2' />
            <path d='M2 10h20' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>+{nodes.length}</div>
          <p className='text-xs text-muted-foreground'>
            +19% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            ConfigMaps 
          </CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>+{cm.length}</div>
          <p className='text-xs text-muted-foreground'>
            +201 since last hour
          </p>
        </CardContent>
      </Card>
    </>
  )
}
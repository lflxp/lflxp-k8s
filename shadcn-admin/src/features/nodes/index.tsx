import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { NodesTable } from './components/nodes-table'
import { NodesPrimaryButtons } from './components/nodes-primary-buttons'
import NodesProvider from './context/nodes-context'
import { useState, useEffect } from 'react';
import request from '@/api/request'; 
import { toast } from '@/hooks/use-toast'
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { NodesDialogs } from './components/nodes-dialogs'

export default function Nodes() {
  const [nodesData, setNodesData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await request.post('/api/gvr/list', {
        group: "",
        version: "v1",
        resource: "nodes",
        namespace: "",
      });
      // console.log('请求接口成功:', response.data.items)
      setNodesData(response.data.items);
      const response2 = await request.get('/api/monitor/metrics/node');
      // console.log('请求接口成功 metrics:', response2.data.items)
      const result = response.data.items.map(item => ({
        ...item,
        metrics: response2.data.items.find(node => 
          node.metadata.name === item.metadata.name
        )
      }));
      setNodesData(result);
      console.log('请求接口成功 metrics:', result)
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
    <NodesProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Kubernetes Nodes</h2>
            <p className='text-muted-foreground'>
              查看和管理您的Kubernetes集群节点信息
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <NodesPrimaryButtons />
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新
            </Button>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <NodesTable data={nodesData} columns={columns} />
        </div>
      </Main>
      <NodesDialogs />
    </NodesProvider>
  )
}
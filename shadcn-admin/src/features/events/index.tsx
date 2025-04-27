import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { NodesTable } from './components/nodes-table'
// import { NodesPrimaryButtons } from './components/nodes-primary-buttons'
import EventsProvider from './context/context'
import { useState, useEffect } from 'react';
import request from '@/api/request'; 
import { toast } from '@/hooks/use-toast'
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { EventsDialogs } from './components/nodes-dialogs'

export default function Events() {
  const [eventsData, setEventsData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await request.post('/api/gvr/list', {
        group: "",
        version: "v1",
        resource: "events",
        namespace: "",
      });
      console.log('请求接口成功:', response.data.items)
      setEventsData(response.data.items);
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
    const interval = setInterval(fetchData, 10000); // 每60秒刷新一次
    return () => clearInterval(interval); // 清除定时器
  },[]);

  return (
    <EventsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>事件管理</h2>
            <p className='text-muted-foreground'>
              查看K8S事件日志
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* <NodesPrimaryButtons /> */}
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
          <NodesTable data={eventsData} columns={columns} />
        </div>
      </Main>
      <EventsDialogs />
    </EventsProvider>
  )
}
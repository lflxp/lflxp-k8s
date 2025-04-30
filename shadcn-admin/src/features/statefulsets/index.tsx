import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/tasks-dialogs'
// import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/tasks-context'
import request from '@/api/request'; 
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast'
// import TerminalUI from '@/components/terminal/ui';
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable"

export default function StatefulSet() {
  const [statefulsetsData, setStatefulsetsData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await request.post('/api/gvr/list', {
        group: "apps",
        version: "v1",
        resource: "statefulsets",
        fast: true
      });
      // console.log('请求接口成功:', response.data)
      setStatefulsetsData(response.data);
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

    // 设置定时刷新，这里设置为每 5 分钟（300000 毫秒）刷新一次，你可以根据需求调整
    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 3000);

    // // 组件卸载时清除定时器，避免内存泄漏
    // return () => clearInterval(intervalId);
  }, []);

  return (
    <TasksProvider>
        {/* Header - 20% height */}
        <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>

        <Main>
          <div className="h-full flex flex-col">
            <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>StatefulSet</h2>
                <p className='text-muted-foreground'>
                  StatefulSets是一种用于管理有状态应用程序的Kubernetes控制器。它们提供了稳定的持久化存储、唯一的网络标识符和有序的部署和扩展功能。StatefulSets适用于需要稳定身份和持久存储的应用程序，如数据库和分布式系统。
                </p>
              </div>
            </div>
            <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 mr-[1px]'>
              <DataTable data={statefulsetsData} columns={columns} fetchData={fetchData} />
            </div>
          </div>
        </Main>
      <TasksDialogs />
    </TasksProvider>
  )
}

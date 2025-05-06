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

export default function Job() {
  const [jobData, setJobData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await request.post('/api/gvr/list', {
        group: "batch",
        version: "v1",
        resource: "jobs",
        namespace: "",
        fast: true
      });
      // console.log('请求接口成功:', response.data)
      setJobData(response.data);
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
                <h2 className='text-2xl font-bold tracking-tight'>Jobs</h2>
                <p className='text-muted-foreground'>
                  Job是Kubernetes中用于批处理任务的API对象。它可以确保指定数量的Pod成功终止，并且可以在完成后自动清理。Job通常用于执行一次性任务，例如数据处理、备份等。
                </p>
              </div>
            </div>
            <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 mr-[1px]'>
              <DataTable data={jobData} columns={columns} fetchData={fetchData} />
            </div>
          </div>
        </Main>
      <TasksDialogs fetchData={fetchData} />
    </TasksProvider>
  )
}

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

export default function Secret() {
  const [secretData, setSecretData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await request.post('/api/gvr/list', {
        group: "",
        version: "v1",
        resource: "secrets",
        fast: true
      });
      // console.log('请求接口成功:', response.data)
      setSecretData(response.data);
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
                <h2 className='text-2xl font-bold tracking-tight'>Secret</h2>
                <p className='text-muted-foreground'>
                  Secrets是Kubernetes中用于存储敏感信息的对象，例如密码、OAuth令牌和SSH密钥。与ConfigMap类似，Secrets也可以存储配置信息，但它们的内容是经过编码的，并且在Kubernetes API中以更安全的方式处理。Secrets可以被挂载为卷或作为环境变量传递给容器。
                </p>
              </div>
            </div>
            <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 mr-[1px]'>
              <DataTable data={secretData} columns={columns} fetchData={fetchData} />
            </div>
          </div>
        </Main>
      <TasksDialogs />
    </TasksProvider>
  )
}

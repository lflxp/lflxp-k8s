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

export default function ConfigMap() {
  const [configmapsData, setConfigmapsData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await request.post('/api/gvr/list', {
        group: "",
        version: "v1",
        resource: "configmaps",
        fast: true
      });
      // console.log('请求接口成功:', response.data)
      setConfigmapsData(response.data);
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
                <h2 className='text-2xl font-bold tracking-tight'>ConfigMap</h2>
                <p className='text-muted-foreground'>
                  ConfigMap是Kubernetes中用于存储非机密数据的API对象。它允许用户将配置数据分离到独立的对象中，从而使应用程序和服务能够更灵活地使用这些配置。ConfigMap可以存储键值对、文件或目录等数据，并可以在Pod中以环境变量、命令行参数或挂载为文件的方式使用。通过ConfigMap，用户可以轻松地管理和更新应用程序的配置，而无需重新构建镜像或修改代码。
                </p>
                <p className='text-muted-foreground'>
                  通过使用ConfigMap，用户可以将配置与应用程序代码分离，从而实现更好的可维护性和灵活性。ConfigMap支持动态更新，允许在不重启Pod的情况下更新配置。
                </p>
              </div>
            </div>
            <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 mr-[1px]'>
              <DataTable data={configmapsData} columns={columns} fetchData={fetchData} />
            </div>
          </div>
        </Main>
      <TasksDialogs />
    </TasksProvider>
  )
}

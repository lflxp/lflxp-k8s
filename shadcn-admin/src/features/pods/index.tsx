import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/tasks-context'
// import { tasks } from './data/tasks'
import request from '@/api/request'; 
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast'

export default function Pods() {
  // 定义一个状态来存储接口返回的数据
  const [podsData, setPodsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.post('/api/gvr/list', {
          group: "",
          version: "v1",
          resource: "pods",
          fast: true
        });
        // 更新状态
        setPodsData(response.data);
      } catch (error) {
        // console.error('请求接口出错:', error);
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

    fetchData();
  }, []);

  return (
    <TasksProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>Pods</h2>
              <p className='text-muted-foreground'>
                Here&apos;s a list of your tasks for this month!
              </p>
            </div>
            <TasksPrimaryButtons />
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
            {/* 使用接口返回的数据 */}
            <DataTable data={podsData} columns={columns} />
          </div>
        </Main>

        <TasksDialogs />
    </TasksProvider>
  )
}

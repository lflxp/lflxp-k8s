import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { apps } from './data/apps'
import request from '@/api/request'; 
import { toast } from '@/hooks/use-toast'
import { useState, useEffect } from 'react';
import { Repo } from './data/schema'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const appText = new Map<string, string>([
  ['all', '全部'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
  ['yes', '废弃'],
  ['no', '正式'],
  ['deprecated', 'Deprecated'],
  ['notDeprecated', 'Not Deprecated'],
  ['deprecated', 'Deprecated'],
  ['notDeprecated', 'Not Deprecated'],
])

export default function Helm() {
  const [sort, setSort] = useState('ascending')
  const [appType, setAppType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentData, setCurrentData] = useState('');
  const [selectedRepo, setSelectedRepo] = useState('');
  const [repolist, setRepolist] = useState([]);
  const [applist, setApplist] = useState<Repo>({
    apiVersion: '',
    entries: {},
  });

  const fetchData = async () => {
    try {
      const response = await request.get('/api/helm/repo/list');
      console.log('请求接口成功:', response.data)
      setRepolist(response.data);
      // 默认选第一个
      if (response.data.length > 0) {
        // setCurrentData(response.data[0].name);
        // console.log('当前选中的数据:', response.data[0].name,'2', currentData)
        setSelectedRepo(response.data[0].name);
        const applist = await request.get('/api/helm/release/list/' + response.data[0].name + '?fast=true');
        console.log('请求接口成功:', applist.data)
        setApplist(applist.data);
      }
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

  const onChangeRepo = async (repoName: string) => {
    setSelectedRepo(repoName);
    try {
      const applist = await request.get('/api/helm/release/list/' + repoName + '?fast=true');
      console.log('请求接口成功:', applist.data)
      setApplist(applist.data);
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
    // const interval = setInterval(fetchData, 10000); // 每60秒刷新一次
    // return () => clearInterval(interval); // 清除定时器
  },[]);

  const filteredApps = apps
    .sort((a, b) =>
      sort === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((app) =>
      appType === 'connected'
        ? app.connected
        : appType === 'notConnected'
          ? !app.connected
          : true
    )
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredApps2 = Object.entries(applist.entries)
    .sort(([a, avalue], [b, bvalue]) =>
      sort === 'ascending'
        ? a.localeCompare(b)
        : b.localeCompare(a)
    )
    .filter(([key, value]) =>
      appType === 'yes'
        ? value[0].deprecated
        : appType === 'no'
          ? !value[0].deprecated
          : true
    ) 
    .filter(([key, value]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            应用商店
          </h1>
          <p className='text-muted-foreground'>
            Here&apos;s a list of your apps for the integration!
          </p>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter apps...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={appType} onValueChange={setAppType}>
              <SelectTrigger className='w-36'>
                <SelectValue>{appText.get(appType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>全部</SelectItem>
                <SelectItem value='yes'>废弃</SelectItem>
                <SelectItem value='no'>正式</SelectItem>
              </SelectContent>
            </Select>
            <Select value={appType} onValueChange={onChangeRepo}>
              <SelectTrigger className='w-36'>
                <SelectValue>{selectedRepo}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {repolist.map((repo) => (
                  <SelectItem key={repo.name} value={repo.name}>
                    {repo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className='w-16'>
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='ascending'>
                <div className='flex items-center gap-4'>
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value='descending'>
                <div className='flex items-center gap-4'>
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className='shadow' />
        {/* <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredApps.map((app) => (
            <li
              key={app.name}
              className='rounded-lg border p-4 hover:shadow-md'
            >
              <div className='mb-8 flex items-center justify-between'>
                <div
                  className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                >
                  {app.logo}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className={`${app.connected ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
                >
                  {app.connected ? 'Connected' : 'Connect'}
                </Button>
              </div>
              <div>
                <h2 className='mb-1 font-semibold'>{app.name}</h2>
                <p className='line-clamp-2 text-gray-500'>{app.desc}</p>
              </div>
            </li>
          ))}
        </ul> */}
        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
            {filteredApps2.map(([key, value]) => (
            <li
              key={key}
              className='rounded-lg border p-4 hover:shadow-md'
            >
              <div className='mb-8 flex items-center justify-between'>
              <div
                className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
              >
                <Avatar>
                  <AvatarImage src={value[0].icon} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              {value[0].version}
              <Button
                variant='outline'
                size='sm'
                className={`${value.connected ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
              >
                {value.connected ? 'Connected' : 'Connect'}
              </Button>
              </div>
              <div>
                <h2
                className={`mb-1 font-semibold ${
                  value[0].deprecated ? 'line-through text-yellow-500' : ''
                }`}
                style={{
                  textDecoration: value[0].deprecated ? 'line-through' : 'none',
                }}
                >
                {key}
                </h2>
              <p className='line-clamp-2 text-gray-500'>{value[0].description}</p>
              </div>
            </li>
            ))}
        </ul>
      </Main>
    </>
  )
}

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
import { CRDsDialogs } from './components/nodes-dialogs'
import { ApiResource, ApiResourceResult, ResourceResult, ApiGroup } from './data/schema'

export default function CRDS() {
  const [crdData, setCrdData] = useState<ApiResourceResult[]>([]);

  const fetchData = async () => {
    try {
      const response = await request.get('/api/gvr/all');

      // console.log('请求接口成功:', response.data)
      const apiResourceList: ApiResourceResult[] = [];
      response.data.apiresourceListSlice.forEach((item: ApiResource) => {
        item.resources.forEach((resource: ResourceResult) => {
          const apiGroup = item.groupVersion.split('/')[0];
          const apiVersion = item.apiVersion;
          const kind = resource.kind;
          const resourceName = resource.name;
          const namespaced = resource.namespaced;
          const singularName = resource.singularName;
          const shortName = resource.shortNames || []

          apiResourceList.push({
            group: apiGroup,
            version: apiVersion,
            kind: kind,
            name: resourceName,
            namespaced: namespaced,
            singularName: singularName,
            shortNames: shortName,
            verbs: resource.verbs,
          });
        });
      })

      response.data.apigroup.forEach((item: ApiGroup) => {
        if (item.name !== '') {
          const apiGroup = item.name;
          const apiVersion = item.preferredVersion.version;

          apiResourceList.push({
            group: apiGroup,
            version: apiVersion,
            kind: '',
            name: item.name,
            namespaced: '',
            singularName: '',
            shortNames: [],
            verbs: [],
          });
        }
      })
      
      // setCrdData(response.data.items);
      // setApiGroup(response.data.apigroup);
      // setApiResource(response.data.apiresource);
      // console.log('请求接口成功:', apiResourceList)
      setCrdData(apiResourceList);
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
            <h2 className='text-2xl font-bold tracking-tight'>自定义资源</h2>
            <p className='text-muted-foreground'>
              查看所有自定义资源
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <NodesTable data={crdData} columns={columns} fetchData={fetchData} />
        </div>
      </Main>
      <CRDsDialogs />
    </EventsProvider>
  )
}
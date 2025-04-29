import { useCRDs } from '../context/context'
import { CRDDetail } from './events-mutate-drawer'
import { useEffect, useState } from 'react'
import request from '@/api/request'; 
import { toast } from '@/hooks/use-toast'
import { Crd } from '../data/schema'

export function CRDsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, setCRDName } = useCRDs()
  const [data, setData] = useState<Crd[]>([]);

  const fetchData = async () => {
    try {
      // console.log('请求接口参数:', currentRow);
      const response = await request.post('/api/gvr/list', {
        resource: currentRow?.name,
        group: currentRow?.version === undefined ? "" : currentRow?.group,
        version: currentRow?.version === undefined ? currentRow?.group : currentRow?.version,
        namespace: "",
      });
      // console.log('请求接口成功:', response.data.items);
      setData(response.data.items);
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
  }, []);
  return (
    <>
      {currentRow && (<CRDDetail
        key='CRD-detail'
        open={open === 'detail'}
        onOpenChange={() => {
          setOpen(null)
          setCRDName(undefined)
          setTimeout(() => {
            setCurrentRow(null)
          }, 500)
        }}
        CRDName={currentRow?.name}
        // columns={columns}
        data={data}
        fetchData={fetchData}
      />)}
    </>
  )
}

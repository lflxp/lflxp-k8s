import { Button } from '@/components/ui/button'
import { Node } from '../data/schema'
import request from '@/api/request'
import { toast } from '@/hooks/use-toast'
import { useState, useEffect } from 'react'

interface DataTableRowActionsProps {
  row: Node
}

export default function DataTableRowActions({
  row,
}: DataTableRowActionsProps) {
    const [loading, setLoading] = useState(row);

    useEffect(() => {
      setLoading(row);
    }, [row]);

    const handleClick = async () => {
      if (!window.confirm(`确定要${loading?.spec?.unschedulable ? '恢复调度' : '禁止调度'}该节点吗？`)) {
        return;
      }
      try {
          if (loading?.spec?.unschedulable) {
              const response = await request.patch('/api/gvr/patchstrate', {
                  group: "",
                  version: "v1",
                  resource: "nodes",
                  name: loading?.metadata.name,
                  patchdatastrate: {
                      spec: {
                          unschedulable: false
                      }
                  }
                });
                console.log('请求接口成功:', response.data)
                toast({
                    title: '恢复操作成功',
                    // description: (
                    //     <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    //         <code className='text-white'>
                    //             {JSON.stringify(response.data, null, 2)}
                    //         </code>
                    //     </pre>
                    // ),
                })
                if (loading && loading.spec) {
                    setLoading({ ...loading, spec: { ...loading.spec, unschedulable: false } });
                }
          } else {
              const response = await request.patch('/api/gvr/patchstrate', {
                  group: "",
                  version: "v1",
                  resource: "nodes",
                  name: loading?.metadata.name,
                  patchdatastrate: {
                      spec: {
                          unschedulable: true
                      }
                  }
                });
                console.log('请求接口成功:', response.data)
                toast({
                    title: '禁用操作成功',
                    // description: (
                    //     <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    //         <code className='text-white'>
                    //             {JSON.stringify(response.data, null, 2)}
                    //         </code>
                    //     </pre>
                    // ),
                })
                if (row && row.spec) {
                    // row.spec.unschedulable = true;
                    setLoading({ ...loading, spec: { ...loading.spec, unschedulable: true } });
                }
          }
      } catch (error) {
        console.log('请求接口出错:', error)
        toast({
            title: '操作失败',
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

    return  (
      <Button
          variant='ghost'
          className={`flex h-8 w-8 p-0 data-[state=open]:bg-muted ${
          loading?.spec?.unschedulable ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600'
          }`}
          onClick={handleClick}
      >
          {loading?.spec?.unschedulable ? '恢复调度' : '禁止调度'}
      </Button>
    ) 
}
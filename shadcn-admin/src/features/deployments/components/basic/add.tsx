import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState, useEffect } from 'react';
import request from '@/api/request'; 
import { toast } from '@/hooks/use-toast'
import { useTasks } from '../../context/tasks-context'

interface AddProps {
    types: string
    name: string
    namespace: string
    keys: string
    values: string
    kind: string
}

export function Add({
  types,
  kind,
  name,
  namespace,
  keys,
  values
}: AddProps) {
  const { currentRow, setCurrentRow } = useTasks();
  const [inputValue, setInputValue] = useState<string>('');
  const [inputKey, setInputKey] = useState<string>('');
  const handleAdd = async () => {
    // Perform the add operation here
    // console.log("Add operation performed")
    if (!inputKey || !inputValue) {
      toast({
        title: '键或值不能为空',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>
              {JSON.stringify({ key: inputKey, value: inputValue }, null, 2)}
            </code>
          </pre>
        ),
      })
      return;
    }
    try {
      if (kind === 'label') {
        const resp = await request.patch('/api/gvr/patchstrate', {
          group: "apps",
          version: "v1",
          resource: "deployments",
          name: name,
          namespace: namespace,
          patchdatastrate: {
            metadata: {
              labels: {
                [inputKey]: inputValue
              }
            }
          }
        });
        // console.log('resp labels', resp)
        // setkv(inputKey, inputValue);
        const newData = { ...currentRow, crd: resp.data };
        setCurrentRow(newData);
      } else if (kind === 'annotation') {
        const resp = await request.patch('/api/gvr/patchstrate', {
          group: "apps",
          version: "v1",
          resource: "deployments",
          name: name,
          namespace: namespace,
          patchdatastrate: {
            metadata: {
              annotations: {
                [inputKey]: inputValue
              }
            }
          }
        });
        // console.log('resp labels', resp)
        // setkv(inputKey, inputValue);
        const newData = { ...currentRow, crd: resp.data };
        setCurrentRow(newData);
      }
      toast({
        title: '请求成功',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>
              {JSON.stringify({ key: inputKey, value: inputValue }, null, 2)}
            </code>
          </pre>
        ),
      }) 

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
  }
  const handleDelete = async () => {
    // Perform the delete operation here
    if (!inputKey) {
      toast({
        title: '键不能为空',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>
              {JSON.stringify({ key: inputKey }, null, 2)}
            </code>
          </pre>
        ),
      })
      return;
    }
    if (!window.confirm(`确定要删除键 ${inputKey} 吗？`)) {
      return;
    }
    try {
      if (kind === 'label') {
        const newRow = { ...currentRow };
        if (newRow.metadata?.labels) {
          delete newRow.metadata.labels[inputKey];
        }

        const resp = await request.patch('/api/gvr/patchstrate', {
          group: "apps",
          version: "v1",
          resource: "deployments",
          name: name,
          namespace: namespace,
          patchdatastrate: {
            metadata: {
              labels: {
                [inputKey]: null
              }
            }
          }
        });
        // console.log('resp delete labels', resp)
        // setkv(inputKey, inputValue);
        const newData = { ...currentRow, crd: resp.data };
        setCurrentRow(newData);
      } else if (kind === 'annotation') {
        const newRow = { ...currentRow };
        if (newRow.metadata?.annotations) {
          delete newRow.metadata.annotations[inputKey];
        }

        const resp = await request.patch('/api/gvr/patchstrate', {
          group: "apps",
          version: "v1",
          resource: "deployments",
          name: name,
          namespace: namespace,
          patchdatastrate: {
            metadata: {
              annotations: {
                [inputKey]: null
              }
            }
          }
        });
        // console.log('resp delete annotations', resp)
        // setkv(inputKey, inputValue);
        const newData = { ...currentRow, crd: resp.data };
        setCurrentRow(newData);
      }
      toast({
        title: '删除成功',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>
              {JSON.stringify({ key: inputKey, value: inputValue }, null, 2)}
            </code>
          </pre>
        ),
      }) 

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
  }

  useEffect(() => {
    setInputValue(values);
    setInputKey(keys);
  }, [values, keys]);

  const handleSubmit = () => {
    if (types === 'add') {
      handleAdd();
    } else if (types === 'edit') {
      handleAdd();
    } else if (types === 'delete') {
      handleDelete();
    }
  }

  return (
    <Sheet >
      <SheetTrigger asChild>
        {types === 'edit' ? (
          <Button size="sm" variant="link" className="w-20 text-blue-300 hover:text-blue-500" onClick={handleAdd}>
            编辑
          </Button>
        ) : types === 'delete' ? (
          <Button size="sm" variant="link" className="w-20 text-red-300 hover:text-red-500" onClick={handleDelete}>
            删除
          </Button>
        ) : types === 'add' ? (
          <Button size="sm" variant="link" className="w-20 text-green-300 hover:text-green-500" onClick={handleAdd}>
            添加
          </Button>
        ) : null}
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>
            { types === 'edit' ? '编辑' : types === 'add' ? '添加' : types === 'delete' ? '删除' : null } 节点 { name } { kind === 'label' ? '标签' : kind === 'annotation' ? '注释' : '' }
          </SheetTitle>
          <SheetDescription>
            新增节点 { name } { kind === 'label' ? '标签' : kind === 'annotation' ? '注释' : '' }，请填写相关信息。
            { types === 'edit' ? '编辑节点' : types === 'add' ? '添加节点' : types === 'delete' ? '删除节点' : null } { name } { kind === 'label' ? '标签' : kind === 'annotation' ? '注释' : '' }，请填写相关信息。
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              键
            </Label>
            <Input id="name" value={inputKey} disabled={types !== 'add'} onChange={(e) => setInputKey(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              值
            </Label>
            <Input id="username" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleSubmit}>提交</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

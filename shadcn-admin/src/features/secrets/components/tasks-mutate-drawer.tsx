import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { Pod } from '../data/schema'
import { Textarea } from "@/components/ui/textarea"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { useState, useEffect } from 'react'
import { poddemo } from '../data/data'
import JsonView from 'react-json-view'

export interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Pod
}

export function TasksMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow

  const [jsonText, setJsonText] = useState('');
  const [addjsonText, setAddJsonText] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // 当currentRow变化时更新jsonText
  useEffect(() => {
    if (currentRow?.raw) {
      setJsonText(JSON.stringify(currentRow.raw, null, 2));
    }

    setAddJsonText(JSON.stringify(poddemo, null, 2));
  }, [currentRow]);

  const handleUpdate = () => {
    try {
      if (!currentRow?.namespace || !currentRow?.name) {
        toast({
          title: "更新失败",
          description: "缺少必要的Pod信息",
          variant: "destructive",
        });
        return;
      }

      const updatedData = {
        group: "",
        version: "v1",
        resource: "secrets",
        namespace: currentRow.namespace,
        name: currentRow.name,
        data: JSON.parse(jsonText)
      };
      
      fetch('/api/gvr', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('更新失败');
        }
        return response.json();
      })
      .then(_data => {
        toast({
          title: "更新成功",
          description: `Secret ${currentRow?.name} 已更新`,
        });
        onOpenChange(false);
      })
      .catch(_error => {
        toast({
          title: "更新失败",
          description: "请检查网络连接或联系管理员",
          variant: "destructive",
        });
      });
    } catch (_error) {
      toast({
        title: "JSON格式错误",
        description: "请检查JSON格式是否正确",
        variant: "destructive",
      });
    }
  };

  const handleAdd = () => {
    try {
      const tmp = JSON.parse(addjsonText)
      if (tmp.metadata.name === '') {
        toast({
          title: "缺少必要条件",
          description: "metdata.name 不能为空",
        })
      }
      const AdddData = {
        group: "",
        version: "v1",
        resource: "secrets",
        namespace: tmp.metadata.namespace === '' ? 'default' : tmp.metadata.namespace,
        name: tmp.metadata.name,
        data: tmp
      };
      
      fetch('/api/gvr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(AdddData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('新增失败');
        }
        return response.json();
      })
      .then(_data => {
        toast({
          title: "新增成功",
          description: `Secret ${tmp.metadata.name} 已创建`,
        });
        onOpenChange(false);
      })
      .catch(_error => {
        toast({
          title: "新增失败",
          description: "请检查网络连接或联系管理员",
          variant: "destructive",
        });
      });
    } catch (_error) {
      toast({
        title: "JSON格式错误",
        description: "请检查JSON格式是否正确",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
      }}
    >
      <SheetContent side="right" className="w-[50%] sm:max-w-[90%] flex flex-col overflow-y-auto">
        <SheetHeader className='text-left'>
          <SheetTitle>{isUpdate ? '更新' : '创建'} Pod</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? '更新Pod配置信息'
              : '创建新的Pod配置'}
          </SheetDescription>
        </SheetHeader>
        { isUpdate ? (
          <>
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? '切换到视图模式' : '切换到编辑模式'}
              </Button>
            </div>
            { isEditMode ? (
              <Textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="flex-1 font-mono resize-none"
                placeholder="请输入JSON数据..."
              />
            ) : (
              <JsonView 
                src={currentRow?.raw || {}} 
                enableClipboard={true}
                displayDataTypes={false}
                name={false}
              />
            )}
          </>
        ) : (
          <Textarea
            value={addjsonText}
            onChange={(e) => {
              setAddJsonText(e.target.value);
            }}
            className="flex-1 font-mono resize-none"
            placeholder="请输入Pod配置..."
          />
        )}
        
        <SheetFooter className='gap-2 mt-4'>
          <SheetClose asChild>
            <Button variant='outline'>关闭</Button>
          </SheetClose>
          { isUpdate ? (
            isEditMode && (
              <Button form='tasks-form' onClick={handleUpdate}>
                更新配置
              </Button>
            )
            
          ) : (
            <Button form='tasks-form' onClick={handleAdd}>
              新建
            </Button>
          )}
         
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

interface PodTerminalDrawerProps {
  open: boolean
  onOpenChange: () => void
  podName?: string
  namespace?: string
  containerName?: string
}

export function PodTerminalDrawer({ 
  open, 
  onOpenChange, 
  podName,
  namespace,
  containerName,
}: PodTerminalDrawerProps) {
  const terminalUrl = `/ws/logs/html/${namespace}/${podName}/${containerName}`

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80vh] mt-0">
        <div className="w-full h-full">
          <iframe 
            src={terminalUrl}
            className="w-full h-full rounded-md border"
            style={{ minHeight: "500px" }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function PodSSHDrawer({ 
  open, 
  onOpenChange, 
  podName,
  namespace,
  containerName,
}: PodTerminalDrawerProps) {
  const terminalUrl = `/ws/ssh/html/${namespace}/${podName}/${containerName}`

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80vh] mt-0">
        <div className="w-full h-full">
          <iframe 
            src={terminalUrl}
            className="w-full h-full rounded-md"
            style={{ minHeight: "500px" }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

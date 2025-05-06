import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Props } from './tasks-mutate-drawer'
import { SectionCards } from './cards'
import { CCComponent } from '../data/data'
import { useState, useEffect } from 'react'
import JsonView from 'react-json-view'
import { toast } from '@/hooks/use-toast'
import { Textarea } from "@/components/ui/textarea"
import Container from "./basic/container"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Labels, Annotations } from "./basic/labels"
import Status from "./basic/status"
import Relative from "./basic/relative"
import Affinity from "./basic/affinity"
import Event from "./basic/event"
import { useTasks } from '../context/tasks-context'


export function PodDetailDrawer({
  open, 
  onOpenChange, 
  currentRow 
}: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const { setCurrentRow } = useTasks();

  // 当currentRow变化时更新jsonText
  useEffect(() => {
    if (currentRow?.crd) {
      setJsonText(JSON.stringify(currentRow.crd, null, 2));
    }
  }, [currentRow]);

  const handleUpdate = () => {
    try {
      const updatedData = {
        group: "apps",
        version: "v1",
        resource: "deployments",
        namespace: currentRow?.crd?.metadata?.namespace,
        name: currentRow?.crd?.metadata?.name,
        data: isEditMode ? JSON.parse(jsonText) : currentRow?.crd
      };
      
      fetch('/api/gvr', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      })
      .then(response => response.json())
      .then(_data => {
        // console.log('Updated data:', _data);
        const newData = {
          ...currentRow,
          crd: _data.data
        };
        setCurrentRow(newData);
        toast({
          title: "更新成功",
          description: `Deployments ${currentRow?.crd?.metadata?.name} 配置已更新`,
        });
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        {/* <DrawerHeader className="text-center">
          <DrawerTitle>Pod 详情 [{currentRow?.raw?.metadata?.namespace } / {currentRow?.raw?.metadata?.name}]</DrawerTitle>
        </DrawerHeader> */}
        <Tabs defaultValue="container" className="w-full">
        <TabsList className="grid w-full grid-cols-5 gap-2">
          <TabsTrigger value="container">
            容器
            <Avatar className="h-5 w-5 ml-1">
              <AvatarFallback className="text-xs">
                {currentRow.crd.spec.template.spec.containers?.length || 0 }
              </AvatarFallback>
            </Avatar>
          </TabsTrigger>
          <TabsTrigger value="label">
            标签
            <Avatar className="h-5 w-5 ml-1">
              <AvatarFallback className="text-xs">
                {currentRow?.crd?.metadata?.labels ? Object.keys(currentRow.crd.metadata.labels).length : 0}
              </AvatarFallback>
            </Avatar>
          </TabsTrigger>
          <TabsTrigger value="annotation">
            注释
            <Avatar className="h-5 w-5 ml-1">
              <AvatarFallback className="text-xs">
                {currentRow?.crd?.metadata?.annotations ? Object.keys(currentRow.crd.metadata.annotations).length : 0}
              </AvatarFallback>
            </Avatar>
          </TabsTrigger>
          <TabsTrigger value="status">
            状态
            <Avatar className="h-5 w-5 ml-1">
              <AvatarFallback className="text-xs">
                {currentRow?.crd?.metadata?.annotations ? Object.keys(currentRow.crd.status?.conditions).length : 0}
              </AvatarFallback>
            </Avatar>
          </TabsTrigger>
          {/* <TabsTrigger value="diaodu">调度</TabsTrigger>
          <TabsTrigger value="event">事件</TabsTrigger>
          <TabsTrigger value="relative">相关资源</TabsTrigger>
          <TabsTrigger value="monitor">监控</TabsTrigger> */}
          <TabsTrigger value="jsondata">查看或编辑</TabsTrigger>
        </TabsList>
        <TabsContent value="container" className="h-[80vh] overflow-y-auto">
          <Container currentRow={currentRow} />
        </TabsContent>
        <TabsContent value="label" className="h-[80vh] overflow-y-auto">
          <Labels currentRow={currentRow} />
        </TabsContent>
        <TabsContent value="annotation" className="h-[80vh] overflow-y-auto">
          <Annotations currentRow={currentRow} />
        </TabsContent>
        <TabsContent value="status" className="h-[80vh] overflow-y-auto">
          <Status currentRow={currentRow} />
        </TabsContent>
        <TabsContent value="relative" className="h-[80vh] overflow-y-auto">
          <Relative currentRow={currentRow} />
        </TabsContent>
        <TabsContent value="diaodu" className="h-[80vh] overflow-y-auto">
          <Affinity currentRow={currentRow} />
        </TabsContent>
        <TabsContent value="event" className="h-[80vh] overflow-y-auto">
          <Event currentRow={currentRow} />
        </TabsContent>
        <TabsContent value="monitor" className="h-[80vh] overflow-y-auto">
          <div className="h-[80vh] grid grid-cols-2 gap-2">
            <div className="rounded-md">
              <Card className="h-full border rounded-md overflow-y-auto">
                <CCComponent />
              </Card>
            </div>
            <div className="rounded-md">
              <SectionCards/>
            </div>
            <div className="rounded-md h-full overflow-y-auto overflow-x-auto bg-gray-800 border border-gray-600">
              <pre className='text-white whitespace-pre-wrap h-full p-4'>
                <code>
                  {/* 添加调试信息 */}
                  {currentRow 
                    ? JSON.stringify(currentRow.crd, null, 2) 
                    : 'currentRow is undefined or null'}
                </code>
              </pre>
            </div> 
          </div>
        </TabsContent>
        <TabsContent value="jsondata" className="h-[80vh] overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>{currentRow?.crd.metadata.name}</CardTitle>
              <CardDescription>
                命名空间：{currentRow?.crd.metadata.namespace}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-end mb-4">
                { isEditMode && <Button variant="ghost" onClick={handleUpdate}>
                    更新
                  </Button>}
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  {isEditMode? '切换到视图模式' : '切换到编辑模式'}
                </Button>
              </div>
              {isEditMode ? (
                <Textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  className="min-h-[500px] font-mono"
                  placeholder="请输入JSON数据..."
                />
              ) : (
                <JsonView 
                  src={currentRow?.crd || {}} 
                  enableClipboard={true}
                  displayDataTypes={false}
                  name={false}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent> 
      </Tabs>
    </DrawerContent>
  </Drawer>
  )
}

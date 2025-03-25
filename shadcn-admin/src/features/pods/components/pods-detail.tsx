import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Props } from './tasks-mutate-drawer'
import { SectionCards } from './cards'
import { CCComponent } from '../data/data'
import { useMemo, useState, useEffect } from 'react'
import JsonView from 'react-json-view'
import { toast } from '@/hooks/use-toast'
import { Textarea } from "@/components/ui/textarea"

export function PodDetailDrawer({
  open, 
  onOpenChange, 
  currentRow 
}: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [jsonText, setJsonText] = useState('');

  // 当currentRow变化时更新jsonText
  useEffect(() => {
    if (currentRow?.raw) {
      setJsonText(JSON.stringify(currentRow.raw, null, 2));
    }
  }, [currentRow]);

  const handleUpdate = () => {
    try {
      const updatedData = {
        group: "",
        version: "v1",
        resource: "pods",
        namespace: currentRow?.raw?.metadata?.namespace,
        name: currentRow?.raw?.metadata?.name,
        data: isEditMode ? JSON.parse(jsonText) : currentRow?.raw
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
        toast({
          title: "更新成功",
          description: "Pod配置已更新",
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

  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.raw ||!currentRow.raw.status) return [];
    return Object.entries(currentRow.raw.status).map(([key, value]) => (
        <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{JSON.stringify(value)}</TableCell>
        </TableRow>
    ));
  }, [currentRow]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTitle>Pod Detail</DrawerTitle>
      <DrawerContent>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-5 gap-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="monitor">Monitor</TabsTrigger>
            <TabsTrigger value="rawdata">属性</TabsTrigger>
            <TabsTrigger value="jsondata">原始JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="h-[80vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Pedro Duarte" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@peduarte" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password" className="h-[80vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
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
                      ? JSON.stringify(currentRow.raw, null, 2) 
                      : 'currentRow is undefined or null'}
                  </code>
                </pre>
              </div> 
            </div>
          </TabsContent>
          <TabsContent value="jsondata" className="h-[80vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>原始JSON查看或编辑</CardTitle>
                <CardDescription>
                  可以查看原始CRD数据结构并进行修改
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-end mb-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    {isEditMode ? '切换到视图模式' : '切换到编辑模式'}
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
                    src={currentRow?.raw || {}} 
                    enableClipboard={true}
                    displayDataTypes={false}
                    name={false}
                  />
                )}
              </CardContent>
              { isEditMode && <CardFooter>
                <Button onClick={handleUpdate}>
                  更新
                </Button>
              </CardFooter>}
            </Card>
          </TabsContent> 
          <TabsContent value="rawdata" className="h-[80vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>RAWDATA</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Table>
                  <TableCaption>A list of your recent invoices.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">属性</TableHead>
                      <TableHead>值</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRow && Object.entries(currentRow.raw.metadata).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{key}</TableCell>
                        <TableCell>{JSON.stringify(value)}</TableCell>
                      </TableRow>
                    ))}
                    {statusRows} 
                    {currentRow && Object.entries(currentRow.raw.spec).map(([key, value]) => (
                      key !== 'containers' && (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{key}</TableCell>
                          <TableCell>{JSON.stringify(value)}</TableCell>
                        </TableRow>
                      )
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total</TableCell>
                      <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>

                <Table>
                  <TableCaption>A list of your recent invoices.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">属性</TableHead>
                      <TableHead className="w-[auto]">值</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRow && currentRow.raw.spec.containers.map((container, index) => (
                      // 遍历 containers 数组
                      Object.entries(container).map(([key, value]) => (
                        // 遍历每个 container 对象的键值对
                        <TableRow key={`${index}-${key}`}>
                          <TableCell className="font-medium">{key}</TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="max-w-[300px] truncate">
                                    {JSON.stringify(value)}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[400px] whitespace-pre-wrap">
                                  {JSON.stringify(value)}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    ))}
                  </TableBody>
                </Table> 
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent> 
        </Tabs>
      </DrawerContent>
    </Drawer>
  )
}

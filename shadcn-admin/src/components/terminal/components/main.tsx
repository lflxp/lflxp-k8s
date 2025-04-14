
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
import { useTerminals } from '../context/terminal-context'
import { toast } from '@/hooks/use-toast'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export default function UI() {
  const { currentRow, setCurrentRow, list, setList, containerName } = useTerminals();

  return (
    <>
      <Tabs defaultValue="account" className="w-full">
        <div className="relative">
          <TabsList 
            className="flex overflow-x-auto scrollbar-hide space-x-1"
            style={{ 
              scrollBehavior: 'smooth',
              justifyContent: 'flex-start' // 强制左对齐
            }}
            ref={(el) => {
              if (el) {
                el.scrollLeft = 0;
                const handleScroll = () => {
                  const { scrollLeft, scrollWidth, clientWidth } = el;
                };
                el.addEventListener('scroll', handleScroll);
                return () => el.removeEventListener('scroll', handleScroll);
              }
            }}
          >
            {list.length > 0 ? (
              list.map((item, index) => (
                <ContextMenu
                  key={index}
                  >
                  <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
                    <TabsTrigger 
                      key={index} 
                      value={`tab-${index}`} 
                      className="relative group whitespace-nowrap min-w-[120px] flex-shrink-0"
                    >
                      <span className="pr-4">
                        {containerName || `Terminal ${list.length} - ${index + 1}`}
                      </span>
                    </TabsTrigger>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-64">
                    <ContextMenuItem inset onClick={(index) => {
                      const tmp = [...list];
                      tmp.splice(index, 1);
                      setList(tmp);
                      setCurrentRow(tmp[0]);
                    }}>
                      关闭
                      <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem inset onClick={(index) => {
                      const tmp = [...list.filter((_, i) => i !== index)];
                      setList(tmp);
                      setCurrentRow(tmp[0]);
                    }}>
                      关闭其他
                      <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
            ) : (
              <>
                <TabsTrigger value="account" className="whitespace-nowrap flex-shrink-0">
                  Account
                </TabsTrigger>
                <TabsTrigger value="password" className="whitespace-nowrap flex-shrink-0">
                  Password
                </TabsTrigger>
              </>
            )}
          </TabsList>
          <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
        {list.length > 0 ? (
          list.map((item, index) => (
            <TabsContent key={`tab-${index}`} value={`tab-${index}`}>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{containerName || `Terminal ${index + 1}`}</CardTitle>
                  <CardDescription>
                    {item.kind === 'log' ? '日志终端' : '交互终端'}
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        // 在这里添加删除逻辑
                        const tmp = {
                          kind: 'log',
                          data: {
                            name: 'Demo1',
                            namespace: 'default',
                            container: 'demo',
                            image: 'nginx',
                            command: 'nginx',
                            args: ['-g', 'daemon off;'],
                            env: [
                              { name: 'ENV1', value: 'VALUE1' },
                              { name: 'ENV2', value: 'VALUE2' },
                            ],
                            url: 'http://localhost:8080',
                          }
                        }
                        list.push(tmp);
                        setList([...list]);
                        setCurrentRow(tmp);
                        toast({
                          title: '请求接口出错',
                          description: (
                            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                              <code className='text-white'>
                                关闭tabs
                              </code>
                            </pre>
                          ),
                        })
                      }}
                    >
                      ×111111
                    </Button>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-0">
                  <div className="h-full bg-black text-white p-4">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(item.data, null, 2)}</pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))
        ) : (
          <>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>
                    Make changes to your account here. Click save when you're done.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    onClick={(e) => {
                      e.stopPropagation();
                      // 在这里添加删除逻辑
                      const tmp = {
                        kind: 'log',
                        data: {
                          name: 'Demo1',
                          namespace: 'default',
                          container: 'demo',
                          image: 'nginx',
                          command: 'nginx',
                          args: ['-g', 'daemon off;'],
                          env: [
                            { name: 'ENV1', value: 'VALUE1' },
                            { name: 'ENV2', value: 'VALUE2' },
                          ],
                          url: 'http://localhost:8080',
                        }
                      }
                      list.push(tmp);
                      setList([...list]);
                      setCurrentRow(tmp);
                      toast({
                        title: '请求接口出错',
                        description: (
                          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                            <code className='text-white'>
                              关闭tabs
                            </code>
                          </pre>
                        ),
                      })
                    }}
                  >
                    222222×
                  </Button>
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
            <TabsContent value="password">
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
          </>
        )}
      </Tabs>  
    </>
  )
}
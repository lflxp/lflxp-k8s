import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card } from "@/components/ui/card"; 
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

export default function K8S() {
    return (
        <>
        <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
            {/* 移除原本的刷新按钮 */}
          </div>
        </Header>

        <Main>
          <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>K8S</h2>
              <p className='text-muted-foreground'>
                Here&apos;s a list of your tasks for this month!
              </p>
            </div>
            {/* 传递 fetchData 方法给 TasksPrimaryButtons 组件 */}
            <p>hhh</p>
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
            <Card className="h-[calc(100vh)] w-full flex justify-center items-center">
              <ResizablePanelGroup
                  direction="horizontal"
                  className="w-full h-full max-w-full md:min-w-[450px]"
              >
                  <ResizablePanel defaultSize={50}>
                      <div className="flex h-full items-center justify-center p-6">
                          <span className="font-semibold">One</span>
                      </div>
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={50}>
                      <ResizablePanelGroup direction="vertical" className="h-full">
                          <ResizablePanel defaultSize={25}>
                              <div className="flex h-full items-center justify-center p-6">
                                  <span className="font-semibold">Two</span>
                              </div>
                          </ResizablePanel>
                          <ResizableHandle />
                          <ResizablePanel defaultSize={75}>
                              <div className="flex h-full items-center justify-center p-6">
                                  <span className="font-semibold">Three</span>
                              </div>
                          </ResizablePanel>
                      </ResizablePanelGroup>
                  </ResizablePanel>
              </ResizablePanelGroup>
            </Card>
          </div>
        </Main>
        </>
        // 修改 Card 组件的样式，添加高度和左边距
    );
}
  
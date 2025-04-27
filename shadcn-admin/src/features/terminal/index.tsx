import { Card } from "@/components/ui/card"; 
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

export default function TTY() {
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
              <h2 className='text-2xl font-bold tracking-tight'>终端</h2>
              <p className='text-muted-foreground'>
                远程访问k8s集群的终端
              </p>
            </div>
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
<<<<<<< HEAD
            <Card className="h-[100vh] w-full flex justify-center items-center border-none">
              <iframe
              src="/tty"
              className="w-full h-full"
              frameBorder="0"
              title="K8S Terminal"
=======
            <Card className="h-[calc(100vh)] w-full flex justify-center items-center">
              <iframe
                src="/tty"
                className="w-full h-full"
                frameBorder="0"
                title="K8S Terminal"
>>>>>>> 6eb0de6b9 (backup)
              />
            </Card>
          </div>
        </Main>
        </>
        // 修改 Card 组件的样式，添加高度和左边距
    );
}
  
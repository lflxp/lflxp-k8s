import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function NodesPrimaryButtons() {
  return (
    <div className='flex items-center space-x-2'>
      <Button>
        <Plus className='mr-2 h-4 w-4' />
        添加节点
      </Button>
      <Button variant='outline'>刷新</Button>
    </div>
  )
}
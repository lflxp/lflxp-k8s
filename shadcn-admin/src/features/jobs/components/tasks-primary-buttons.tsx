import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useTasks } from '../context/tasks-context'

interface TasksPrimaryButtonsProps {
  fetchData: () => Promise<void>;
}

export const TasksPrimaryButtons = ({ fetchData }: TasksPrimaryButtonsProps) => {
  const { setOpen } = useTasks()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import</span> <IconDownload size={18} />
      </Button>
      <Button className='space-x-1' variant='outline' onClick={() => setOpen('create')}>
        <span>Create</span> <IconPlus size={18} />
      </Button>
      <Button onClick={fetchData} variant='outline'>刷新</Button>
    </div>
  )
}

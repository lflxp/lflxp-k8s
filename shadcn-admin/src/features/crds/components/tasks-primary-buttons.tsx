import { Button } from '@/components/ui/button'

interface TasksPrimaryButtonsProps {
  fetchData: () => Promise<void>;
}

export const TasksPrimaryButtons = ({ fetchData }: TasksPrimaryButtonsProps) => {
  return (
    <div className='flex gap-2'>
      <Button onClick={fetchData} variant='outline'>刷新</Button>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTasks } from '../../context/tasks-context'
import { Pod } from '../../data/schema'
import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { callTypes } from '../../data/data'
import { Check, Minus } from "lucide-react"

export interface RawDataProps {
  currentRow?: Pod
}

const getContainerState = (state: any) => {
  if (state.running) return 'Running';
  if (state.waiting) return 'Waiting';
  if (state.terminated) return 'Terminated';
  if (state.successed) return 'Successed';
  if (state.failed) return 'Failed';
  if (state.pending) return 'Pending';
  return 'Unknown';
};

export default function Container({
  currentRow
}: RawDataProps) {
  const { setOpen, setCurrentRow, setContainerName } = useTasks()
  const containerRows = useMemo(() => {
    if (!currentRow || !currentRow.raw || !currentRow.raw.status) return [];
    
    // 合并容器状态和初始化容器状态
    const containerStatuses = currentRow.raw.status.containerStatuses || [];
    const initContainerStatuses = currentRow.raw.status.initContainerStatuses || [];
    // 遍历initContainerStatuses 加上initContainer: true
    initContainerStatuses.forEach((container: any) => {
      container.initContainer = true;
    }) 
    const allContainers = [...containerStatuses, ...initContainerStatuses];

    return allContainers.map((container, index) => (
      <TableRow key={`${container.name}-${index}`}>
        <TableCell>
          <div className='flex space-x-2'>
            <Badge variant='outline' className={cn('capitalize', callTypes.get(getContainerState(container.state)))}>
              {getContainerState(container.state)}
            </Badge>
          </div>
        </TableCell>
        <TableCell className="font-medium">{container.name}</TableCell>
        <TableCell className="font-medium">
          {container.ready ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Minus className="h-4 w-4 text-gray-400" />
          )}
        </TableCell>
        <TableCell className="font-medium">
          { container.image }
        </TableCell>
        <TableCell className="font-medium">
          {container.initContainer ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Minus className="h-4 w-4 text-gray-400" />
          )}
        </TableCell>
        <TableCell className="font-medium">
          { container.restartCount }
        </TableCell>
        <TableCell className="font-medium">
          { container.started ? 'True' : 'False'  }
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => {
                setCurrentRow(currentRow)
                setContainerName(container.name)
                setOpen('terminal')
              }}
            >
              日志
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => {
                setCurrentRow(currentRow)
                setContainerName(container.name)
                setOpen('ssh')
              }}
            >
              SSH
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  }, [currentRow]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentRow?.raw.metadata.name}</CardTitle>
        <CardDescription>
          命名空间：{currentRow?.raw.metadata.namespace}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Table>
          <TableCaption>容器详情</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Ready</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>InitContainer</TableHead>
              <TableHead>Restart</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {containerRows} 
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>

      </CardContent>
      {/* <CardFooter>
        <Button>Save password</Button>
      </CardFooter> */}
    </Card>
  )
}
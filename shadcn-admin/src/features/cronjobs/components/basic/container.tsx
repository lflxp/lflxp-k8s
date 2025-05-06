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
import { Pod } from '../../data/schema'
import { useMemo } from 'react'

export interface crdDataProps {
  currentRow?: Pod
}

export default function Container({
  currentRow
}: crdDataProps) {
  const containerRows = useMemo(() => {
    if (!currentRow || !currentRow.crd || !currentRow.crd.spec) return [];
    
    const allContainers = currentRow.crd.spec.jobTemplate.spec.template.spec.containers

    return allContainers.map((container, index) => (
      <TableRow key={`${container.name}-${index}`}>
        <TableCell className="font-medium">{container.name}</TableCell>
        <TableCell className="font-medium">
          {container.imagePullPolicy}
        </TableCell>
        <TableCell className="font-medium">
            <div className="w-48 truncate hover:whitespace-normal">
            {container.image}
            </div>
        </TableCell>
        <TableCell>
          <div className="w-48 truncate hover:whitespace-normal">
            { container.command ? container.command.join(' ') : '-' } 
          </div>
        </TableCell>
        <TableCell>
          <div className="w-48 truncate hover:whitespace-normal">
            { container.args ? container.args.join(' ') : '-' } 
          </div>
        </TableCell>
        <TableCell className="font-medium">
          <div className="w-48 truncate hover:whitespace-normal">
            { currentRow.crd.spec.schedule }
          </div>
        </TableCell>
        <TableCell className="font-medium">
          { currentRow.crd.spec.jobTemplate.spec.template.spec.schedulerName }
        </TableCell>
        <TableCell className="font-medium">
          { currentRow.crd.spec.failedJobsHistoryLimit }
        </TableCell>
        <TableCell className="font-medium">
          { currentRow.crd.spec.concurrencyPolicy }
        </TableCell>
      </TableRow>
    ));
  }, [currentRow]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentRow?.crd.metadata.name}</CardTitle>
        <CardDescription>
          命名空间：{currentRow?.crd.metadata.namespace}
          <br />
          最近一次调度时间：{currentRow?.crd.status?.lastScheduleTime}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Table>
          <TableCaption>容器详情</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>ImagePullPolicy</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Command</TableHead>
              <TableHead>Args</TableHead>
              <TableHead>SCHEDULE</TableHead>
              <TableHead>SchedulerName</TableHead>
              <TableHead>FailedJobsHistoryLimit</TableHead>
              <TableHead>ConcurrencyPolicy</TableHead>
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
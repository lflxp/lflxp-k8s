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
    
    const allContainers = currentRow.crd.spec.template.spec.containers

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
          {currentRow.crd.status.conditions ? currentRow.crd.status.conditions[0].reason : '-'}
        </TableCell>
        <TableCell className="font-medium">
          <div className="w-48">
            {/* { JSON.stringify(currentRow.crd.spec.selector.matchLabels, null, 2) } */}
            {Object.entries(currentRow?.crd?.spec.selector.matchLabels).map(([key, value]) => 
              `${key}=${value as string}`).reduce((prev, curr) => `${prev}, ${curr}`)}
          </div>
        </TableCell>
        <TableCell className="font-medium">
          <div className="w-48 truncate hover:whitespace-normal">
            { currentRow.crd.status.failed === undefined ? '-' : currentRow.crd.status.failed }
          </div>
        </TableCell>
        <TableCell className="font-medium">
          <div className="w-48 truncate hover:whitespace-normal">
            { currentRow.crd.status.succeeded === undefined ? '-' : currentRow.crd.status.succeeded }
          </div>
        </TableCell>
        <TableCell className="font-medium">
          <div className="w-48 truncate hover:whitespace-normal">
            { currentRow.crd.status.ready === undefined ? '-' : currentRow.crd.status.ready }
          </div>
        </TableCell>
        <TableCell className="font-medium">
          { currentRow.crd.spec.template.spec.schedulerName }
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
              <TableHead>REASON</TableHead>
              <TableHead>Selector</TableHead>
              <TableHead>FAILED</TableHead>
              <TableHead>SUCCEEDED</TableHead>
              <TableHead>READY</TableHead>
              <TableHead>SchedulerName</TableHead>
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
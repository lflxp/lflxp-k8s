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

export default function Active({
  currentRow
}: crdDataProps) {
  const containerRows = useMemo(() => {
    if (!currentRow || !currentRow.crd.status || !currentRow.crd.status.active) return [];
    
    const allContainers = currentRow.crd.status.active

    return allContainers.map((container, index) => (
      <TableRow key={`${container.name}-${index}`}>
        <TableCell className="font-medium">{container.uid}</TableCell>
        <TableCell className="font-medium">
            <div className="w-48 truncate hover:whitespace-normal">
            {container.kind}
            </div>
        </TableCell>
        <TableCell className="font-medium">{container.name}</TableCell>
        <TableCell className="font-medium">{container.namespace}</TableCell>
        <TableCell className="font-medium">
          {container.resourceVersion}
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
              <TableHead>Uid</TableHead>
              <TableHead>Kind</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Namespace</TableHead>
              <TableHead>ResourceVersion</TableHead>
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
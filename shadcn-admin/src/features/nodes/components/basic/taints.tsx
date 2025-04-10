import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
} from "@/components/ui/table"
import { Node } from '../../data/schema'
import { useMemo } from 'react'


export interface RawDataProps {
  currentRow?: Node | null
}

export function Taints({
  currentRow
}: RawDataProps) {
  const taintsRows = useMemo(() => {
    if (!currentRow ||!currentRow.spec.taints) return [];
    return Object.entries(currentRow.spec.taints).map(([key, info]) => (
      <TableRow key={key}>
          <TableCell className="text-red-500">{info.effect}</TableCell>
          <TableCell>{info.key}</TableCell>
          <TableCell>{info.value}</TableCell>
      </TableRow>
    ));
  }, [currentRow]);

  return (
    <>
    { currentRow?.spec?.taints && <Card className="mt-4">
        <CardHeader>
          <CardTitle>污点</CardTitle>
          <CardDescription>
            Taints是Kubernetes中的一个概念，用于标记节点或Pod，以防止它们被调度到不合适的节点上。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <Table className="max-h-[300px] overflow-y-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>Effect</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taintsRows} 
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    }
    </>
  )
}

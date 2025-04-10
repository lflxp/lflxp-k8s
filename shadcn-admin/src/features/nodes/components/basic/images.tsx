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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Node } from '../../data/schema'
import { useMemo } from 'react'
import { Label } from "@/components/ui/label"


export interface RawDataProps {
  currentRow?: Node | null
}

export function Images({
  currentRow
}: RawDataProps) {
  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.status?.images) return [];
    return Object.entries(currentRow.status?.images || {}).map(([key, image]) => (
        <TableRow key={key || Math.random()}>
            {image.names && (
              <> 
                <TableCell className="max-w-[40vw] overflow-hidden whitespace-nowrap text-ellipsis hover:overflow-visible hover:whitespace-normal">{image.names[0]}</TableCell>
                <TableCell className="max-w-[40vw] overflow-hidden whitespace-nowrap text-ellipsis hover:overflow-visible hover:whitespace-normal">{image.names.length > 1 ? image.names[1] : ''}</TableCell>
              </>
            )}
            <TableCell>{(function() {
              const bytes = image.sizeBytes;
              if (bytes < 1024) {
                return `${bytes} B`;
              } else if (bytes < 1024 * 1024) {
                return `${(bytes / 1024).toFixed(2)} KB`;
              } else if (bytes < 1024 * 1024 * 1024) {
                return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
              } else {
                return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
              }
            })()}</TableCell>
        </TableRow>
    ));
  }, [currentRow]);

  return (
    <>
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>节点镜像</CardTitle>
        <CardDescription>
          节点镜像是指节点上运行的镜像。这些镜像包含了节点的操作系统、运行时和应用程序。
          节点镜像通常是由Kubernetes管理的，Kubernetes会自动下载和管理这些镜像。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
          <Table className="max-h-[300px] overflow-y-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Hash</TableHead>
                <TableHead>镜像</TableHead>
                <TableHead className="w-[10vh]">大小</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statusRows} 
            </TableBody>
          </Table>
      </CardContent>
    </Card>
    </>
  )
}

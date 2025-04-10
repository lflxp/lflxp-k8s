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

export function Conditions({
  currentRow
}: RawDataProps) {
  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.status?.conditions) return [];
    return Object.entries(currentRow.status.conditions).map(([key, info]) => (
      <TableRow key={key}>
          <TableCell>{info.type}</TableCell>
          <TableCell className={`font-medium ${info.status === 'True' ? 'text-green-500' : 'text-red-500'}`}>{info.status}</TableCell>
          <TableCell>{info.reason}</TableCell>
          <TableCell>{info.message}</TableCell>
          <TableCell>{new Date(info.lastHeartbeatTime).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</TableCell>
          <TableCell>{new Date(info.lastTransitionTime).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</TableCell>
      </TableRow>
    ));
  }, [currentRow]);

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
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Conditions</CardTitle>
        <CardDescription>
          Conditions是Kubernetes中用于描述节点或Pod状态的字段。它们通常用于指示节点或Pod是否正常运行，以及是否有任何问题需要注意。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
          <Table className="max-h-[300px] overflow-y-auto">
            <TableHeader>
              <TableRow>
                <TableHead>类型</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>原因</TableHead>
                <TableHead>消息</TableHead>
                <TableHead>最近一次心跳</TableHead>
                <TableHead>最近一次通信</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statusRows} 
            </TableBody>
          </Table>
      </CardContent>
    </Card>

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

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

export interface RawDataProps {
  currentRow?: Node | null
}

export function Capacity({
  currentRow
}: RawDataProps) {
  const formatBytes = (bytes, key) => {
    if (key === 'cpu' || key === 'pods' || key === 'hugepages-1Gi' || key === 'hugepages-2Mi' || key === 'ephemeral-storage') {
      if (key === 'ephemeral-storage' && typeof bytes === 'string') {
        const match = bytes.match(/(\d+)([a-zA-Z]+)/);
        if (match) {
          const value = parseInt(match[1], 10);
          const unit = match[2];
          switch (unit) {
            case 'Ki':
              bytes = value * 1024;
              break;
            case 'Mi':
              bytes = value * 1024 * 1024;
              break;
            case 'Gi':
              bytes = value * 1024 * 1024 * 1024;
              break;
            default:
              return 'N/A';
          }
        } else {
          return 'N/A';
        }
      }
      return String(bytes);
    }
    if (typeof bytes === 'number') {
      // 直接进入后续格式化逻辑
    } else if (typeof bytes === 'string') {
      const match = bytes.match(/(\d+)([a-zA-Z]+)/);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
        switch (unit) {
          case 'Ki':
            bytes = value * 1024;
            break;
          case 'Mi':
            bytes = value * 1024 * 1024;
            break;
          case 'Gi':
            bytes = value * 1024 * 1024 * 1024;
            break;
          default:
            return 'N/A';
        }
      } else {
        return 'N/A';
      }
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
  };

  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.status?.allocatable ||!currentRow.status?.capacity) return [];
    const allKeys = new Set([...Object.keys(currentRow.status.allocatable), ...Object.keys(currentRow.status.capacity)]);
    return Array.from(allKeys).map(key => {
      const allocatable = currentRow.status.allocatable[key] || 0;
      const capacity = currentRow.status.capacity[key] || 0;
      return (
        <TableRow key={`combined-${key}`}>
          <TableCell className="font-medium">{key}</TableCell>
          <TableCell>{formatBytes(allocatable,key)}</TableCell>
          <TableCell>{formatBytes(capacity,key)}</TableCell>
        </TableRow>
      );
    });
  }, [currentRow]);

  return (
    <>
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>节点信息</CardTitle>
        <CardDescription>
          节点信息是Kubernetes中用于描述节点的字段。它们通常用于标识节点的类型、状态、版本等。
          {/* {currentRow?.status?.addresses?.map((address) => {
            return address.type === 'InternalIP' && (
              <Label key={address.type} className="bg-blue-500 text-white">
                {address.type} - {address.address}
              </Label>
            )}
          )} */}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
          <Table className="max-h-[300px] overflow-y-auto">
            <TableHeader>
              <TableRow>
                <TableHead>类型</TableHead>
                <TableHead>可分配</TableHead>
                <TableHead>容量</TableHead>
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

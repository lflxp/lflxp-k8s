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

export function Nodes({
  currentRow
}: RawDataProps) {
  const statusRows = useMemo(() => {
    if (!currentRow) return [];
    let rows = [];
    if (currentRow.spec) {
      rows = rows.concat(Object.entries(currentRow.spec).map(([key, value]) => (
        <TableRow key={`spec-${key}`}>
          <TableCell className="font-medium">spec.{key}</TableCell>
          <TableCell>{key === 'taints' ? JSON.stringify(value) : String(value) as React.ReactNode}</TableCell>
        </TableRow>
      )));
    }
    if (currentRow.status?.addresses) {
      rows = rows.concat(currentRow.status.addresses.map((address, index) => (
        <TableRow key={`address-${index}`}>
          <TableCell className="font-medium">status.addresses[{index}].{address.type}</TableCell>
          <TableCell>{String(address.address) as React.ReactNode}</TableCell>
        </TableRow>
      )));
    }
    if (currentRow.status?.daemonEndpoints) {
      rows = rows.concat(Object.entries(currentRow.status.daemonEndpoints).map(([key, value]) => (
        <TableRow key={`daemonEndpoints-${key}`}>
          <TableCell className="font-medium">status.daemonEndpoints.{key}</TableCell>
          <TableCell>{String(value.Port) as React.ReactNode}</TableCell>
        </TableRow>
      )));
    }
    if (currentRow.status?.nodeInfo) {
      rows = rows.concat(Object.entries(currentRow.status.nodeInfo).map(([key, value]) => (
        <TableRow key={key}>
          <TableCell className="font-medium">{key}</TableCell>
          <TableCell>{String(value) as React.ReactNode}</TableCell>
        </TableRow>
      )));
    }
    return rows;
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
            {/* <TableHeader>
              <TableRow>
                <TableHead>键</TableHead>
                <TableHead>值</TableHead>
              </TableRow>
            </TableHeader> */}
            <TableBody>
              {statusRows} 
            </TableBody>
          </Table>
      </CardContent>
    </Card>
    </>
  )
}

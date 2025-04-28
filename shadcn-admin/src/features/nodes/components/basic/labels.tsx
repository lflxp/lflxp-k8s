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
  // TableHead,
  // TableHeader,
  TableRow,
} from "@/components/ui/table"
// import { Node } from '../../data/schema'
import { useMemo } from 'react'
import { Add } from './add'
import { useNodes } from '../../context/nodes-context'

// export interface RawDataProps {
//   currentRow?: Node | null
// }

export function Labels() {
  const { currentRow } = useNodes();

  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.metadata.labels) return [];
    return Object.entries(currentRow.metadata.labels).map(([key, value]) => (
        <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{value as React.ReactNode}</TableCell>
            <TableCell>
                <div className="flex space-x-2">
                  <Add 
                  types="edit" 
                  kind="label" 
                  name={currentRow?.metadata?.name || ''}
                  keys={key} 
                  values={typeof value === 'string' ? value : ''} 
                  />
                  <Add 
                  types="delete" 
                  kind="label" 
                  name={currentRow?.metadata?.name || ''} 
                  keys={key} 
                  values={typeof value === 'string' ? value : ''} 
                  />
                </div>
            </TableCell>
        </TableRow>
    ));
  }, [currentRow]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Labels
          <Add 
            types="add" 
            kind="label" 
            name={currentRow ? currentRow.metadata.name : ''}
            keys="" 
            values=""
            /> 
        </CardTitle>
        <CardDescription>
          Labels是Kubernetes中用于标识资源的字段。它们通常用于标识资源的类型、状态、版本等。
          Labels可以是任意的键值对，它们可以用于标识资源的类型、状态、版本等。
          Labels通常用于标识资源的类型、状态、版本等。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Table>
          {/* <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">键</TableHead>
              <TableHead className="w-[50%]">值</TableHead>
            </TableRow>
          </TableHeader> */}
          <TableBody>
            {statusRows} 
          </TableBody>
        </Table>

      </CardContent>
    </Card>
  )
}

export function Annotations() {
  const { currentRow } = useNodes();

  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.metadata.annotations) return [];
    return Object.entries(currentRow.metadata.annotations).map(([key, value]) => (
        <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{value as React.ReactNode}</TableCell>
            <TableCell>
                <div className="flex space-x-2">
                  <Add 
                  types="edit" 
                  kind="annotation" 
                  name={currentRow.metadata.name} 
                  keys={key} 
                  values={typeof value === 'string' ? value : ''} 
                  />
                  <Add 
                  types="delete" 
                  kind="annotation" 
                  name={currentRow.metadata.name} 
                  keys={key} 
                  values={typeof value === 'string' ? value : ''} 
                  />
                </div>
            </TableCell>
        </TableRow>
    ));
  }, [currentRow]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annotations
          <Add 
            types="add" 
            kind="annotation" 
            name={currentRow ? currentRow.metadata.name : ''} 
            keys="" 
            values=""
            /> 
        </CardTitle>
        <CardDescription>
          Annotations是Kubernetes中用于存储元数据的字段。它们通常用于存储额外的信息，例如描述、标签等。
          Annotations可以是任意的键值对，它们可以用于存储任何类型的信息，例如描述、标签、版本等。
          Annotations通常用于存储元数据，例如描述、标签、版本等。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Table>
          {/* <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">键</TableHead>
              <TableHead className="w-[50%]">值</TableHead>
            </TableRow>
          </TableHeader> */}
          <TableBody>
            {statusRows} 
          </TableBody>
        </Table>

      </CardContent>
    </Card>
  )
}
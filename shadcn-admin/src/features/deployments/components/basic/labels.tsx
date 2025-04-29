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
import { Pod } from '../../data/schema'
import { useMemo } from 'react'
import { Add } from './add'

export interface crdDataProps {
  currentRow?: Pod
}

export function Labels({
  currentRow
}: crdDataProps) {
  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.crd ||!currentRow.crd.metadata.labels) return [];
    return Object.entries(currentRow.crd.metadata.labels).map(([key, value]) => (
        <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{value as React.ReactNode}</TableCell>
            <TableCell>
                <div className="flex space-x-2">
                  <Add 
                  types="edit" 
                  kind="label" 
                  name={currentRow?.crd?.metadata?.name || ''}
                  namespace={currentRow?.crd?.metadata?.namespace || ''}
                  keys={key} 
                  values={typeof value === 'string' ? value : ''} 
                  />
                  <Add 
                  types="delete" 
                  kind="label" 
                  name={currentRow?.crd?.metadata?.name || ''} 
                  namespace={currentRow?.crd?.metadata?.namespace || ''}
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
          {currentRow?.crd.metadata.name}
          <Add 
            types="add" 
            kind="label" 
            name={currentRow ? currentRow.crd.metadata.name : ''}
            namespace={currentRow ? currentRow.crd.metadata.namespace : ''}
            keys="" 
            values=""
            />   
        </CardTitle>
        <CardDescription>
          命名空间：{currentRow?.crd.metadata.namespace}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">键</TableHead>
              <TableHead className="w-[50%]">值</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statusRows} 
          </TableBody>
        </Table>

      </CardContent>
    </Card>
  )
}

export function Annotations({
  currentRow
}: crdDataProps) {
  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.crd ||!currentRow.crd.metadata.annotations) return [];
    return Object.entries(currentRow.crd.metadata.annotations).map(([key, value]) => (
        <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{value as React.ReactNode}</TableCell>
            <TableCell>
                <div className="flex space-x-2">
                  <Add 
                  types="edit" 
                  kind="annotation" 
                  name={currentRow?.crd?.metadata?.name || ''}
                  namespace={currentRow?.crd?.metadata?.namespace || ''}
                  keys={key} 
                  values={typeof value === 'string' ? value : ''} 
                  />
                  <Add 
                  types="delete" 
                  kind="annotation" 
                  name={currentRow?.crd?.metadata?.name || ''} 
                  namespace={currentRow?.crd?.metadata?.namespace || ''}
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
          {currentRow?.crd.metadata.name}
          <Add 
            types="add" 
            kind="annotation" 
            name={currentRow ? currentRow.crd.metadata.name : ''}
            namespace={currentRow ? currentRow.crd.metadata.namespace : ''}
            keys="" 
            values=""
            />     
        </CardTitle>
        <CardDescription>
          命名空间：{currentRow?.crd.metadata.namespace}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">键</TableHead>
              <TableHead className="w-[50%]">值</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statusRows} 
          </TableBody>
        </Table>

      </CardContent>
    </Card>
  )
}
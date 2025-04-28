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
import { Pod } from '../../data/schema'
import { useMemo } from 'react'
import { Add } from './add'

export interface RawDataProps {
  currentRow?: Pod
}

export function Labels({
  currentRow
}: RawDataProps) {
  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.raw ||!currentRow.raw.metadata.labels) return [];
    return Object.entries(currentRow.raw.metadata.labels).map(([key, value]) => (
        <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{value as React.ReactNode}</TableCell>
            <TableCell>
                <div className="flex space-x-2">
                  <Add 
                  types="edit" 
                  kind="label" 
                  name={currentRow?.raw.metadata?.name || ''}
                  namespace={currentRow?.raw.metadata?.namespace || ''}
                  keys={key} 
                  values={typeof value === 'string' ? value : ''} 
                  />
                  <Add 
                  types="delete" 
                  kind="label" 
                  name={currentRow?.raw.metadata?.name || ''} 
                  namespace={currentRow?.raw.metadata?.namespace || ''}
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
          {currentRow?.raw.metadata.name}
          <Add 
            types="add" 
            kind="label" 
            name={currentRow ? currentRow?.raw?.metadata.name : ''}
            namespace={currentRow?.raw.metadata.namespace || ''}
            keys="" 
            values=""
            />   
        </CardTitle>
        <CardDescription>
          命名空间：{currentRow?.raw.metadata.namespace}
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

export function Annotations({
  currentRow
}: RawDataProps) {
  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.raw ||!currentRow.raw.metadata.annotations) return [];
    return Object.entries(currentRow.raw.metadata.annotations).map(([key, value]) => (
        <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{value as React.ReactNode}</TableCell>
            <TableCell>
                <div className="flex space-x-2">
                  <Add 
                  types="edit" 
                  kind="annotation" 
                  name={currentRow?.raw.metadata?.name || ''}
                  namespace={currentRow?.raw.metadata?.namespace || ''}
                  keys={key} 
                  values={typeof value === 'string' ? value : ''} 
                  />
                  <Add 
                  types="delete" 
                  kind="annotation" 
                  name={currentRow?.raw.metadata?.name || ''} 
                  namespace={currentRow?.raw.metadata?.namespace || ''}
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
          {currentRow?.raw.metadata.name}
          <Add 
            types="add" 
            kind="annotation" 
            name={currentRow ? currentRow?.raw?.metadata.name : ''}
            namespace={currentRow?.raw.metadata.namespace || ''}
            keys="" 
            values=""
            />   
        </CardTitle>
        <CardDescription>
          命名空间：{currentRow?.raw.metadata.namespace}
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
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
import { Add } from './add'

export interface crdDataProps {
  currentRow?: Pod
}

export default function Container({
  currentRow
}: crdDataProps) {
  const containerRows = useMemo(() => {
    if (!currentRow || !currentRow.crd || !currentRow.crd.data) return [];
    
    return Object.entries(currentRow.crd.data).map(([key, value]) => (
      <TableRow key={`${key}`}>
        <TableCell className="font-medium">{key}</TableCell>
        <TableCell className="w-[80vh] font-medium break-words">
          {value as string}
        </TableCell>
        <TableCell>
            <div className="flex space-x-2">
              <Add 
              types="edit" 
              kind="data" 
              name={currentRow?.crd?.metadata?.name || ''}
              namespace={currentRow?.crd?.metadata?.namespace || ''}
              keys={key} 
              values={typeof value === 'string' ? value : ''} 
              />
              <Add 
              types="delete" 
              kind="data" 
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

  const binaryRows = useMemo(() => {
    if (!currentRow || !currentRow.crd || !currentRow.crd.stringData) return [];
    
    return Object.entries(currentRow.crd.stringData).map(([key, value]) => (
      <TableRow key={`${key}`}>
        <TableCell className="font-medium">{key}</TableCell>
        <TableCell className="w-[80vh] font-medium break-words">
          {value as string}
        </TableCell>
        <TableCell>
            <div className="flex space-x-2">
              <Add 
              types="edit" 
              kind="data" 
              name={currentRow?.crd?.metadata?.name || ''}
              namespace={currentRow?.crd?.metadata?.namespace || ''}
              keys={key} 
              values={typeof value === 'string' ? value : ''} 
              />
              <Add 
              types="delete" 
              kind="data" 
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
            kind="data" 
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
          <TableCaption>容器详情</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {containerRows} 
            {binaryRows}
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
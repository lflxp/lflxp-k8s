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
import { Check, Minus } from "lucide-react"

export interface crdDataProps {
  currentRow?: Pod
}

export default function Status({
  currentRow
}: crdDataProps) {
  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.crd ||!currentRow.crd.status||!currentRow.crd.status.conditions) return [];
    return Object.entries(currentRow.crd.status.conditions).map((cond, index) => (
        <TableRow key={index}>
            <TableCell className="font-medium">{(cond[1] as {type: string}).type}</TableCell>
            <TableCell>
              {(cond[1] as {status: string}).status === 'True' ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Minus className="h-4 w-4 text-gray-400" />
              )}
            </TableCell>
            <TableCell>{(cond[1] as {lastTransitionTime: string}).lastTransitionTime}</TableCell>
        </TableRow>
    ));
  }, [currentRow]);

  const aba = useMemo(() => {
    if (!currentRow ||!currentRow.crd ||!currentRow.crd.status) return [];
    const result = [];
    
    if (currentRow.crd.status.availableReplicas) {
      result.push(
        <TableRow key="availableReplicas">
          <TableCell className="font-medium">availableReplicas</TableCell>
          <TableCell>{currentRow.crd.status.availableReplicas}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      );
    }

    if (currentRow.crd.status.observedGeneration) {
      result.push(
        <TableRow key="observedGeneration">
          <TableCell className="font-medium">observedGeneration</TableCell>
          <TableCell>{currentRow.crd.status.observedGeneration}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      );
    }

    if (currentRow.crd.status.readyReplicas) {
      result.push(
        <TableRow key="readyReplicas">
          <TableCell className="font-medium">readyReplicas</TableCell>
          <TableCell>{currentRow.crd.status.readyReplicas}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      );
    }

    if (currentRow.crd.status.replicas) {
      result.push(
        <TableRow key="replicas">
          <TableCell className="font-medium">replicas</TableCell>
          <TableCell>{currentRow.crd.status.replicas}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      );
    }

    if (currentRow.crd.status.updatedReplicas) {
      result.push(
        <TableRow key="updatedReplicas">
          <TableCell className="font-medium">updatedReplicas</TableCell>
          <TableCell>{currentRow.crd.status.updatedReplicas}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      );
    }

    return result;
  }, [currentRow]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentRow?.crd.metadata.name}</CardTitle>
        <CardDescription>
          命名空间：{currentRow?.crd.metadata.namespace}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Condition</TableHead>
              <TableHead className="w-[30%]">Status</TableHead>
              <TableHead className="w-[40%]">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statusRows} 
            {aba}
          </TableBody>
        </Table>

      </CardContent>
    </Card>
  )
}

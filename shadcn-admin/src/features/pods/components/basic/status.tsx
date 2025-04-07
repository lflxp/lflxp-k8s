import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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

export interface RawDataProps {
  currentRow?: Pod
}

export default function Status({
  currentRow
}: RawDataProps) {
  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.raw ||!currentRow.raw.status||!currentRow.raw.status.conditions) return [];
    return Object.entries(currentRow.raw.status.conditions).map((cond, index) => (
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

  return (
    <Card>
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
          </TableBody>
        </Table>

      </CardContent>
    </Card>
  )
}

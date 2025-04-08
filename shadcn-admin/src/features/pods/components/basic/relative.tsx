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
import RawData from "./rawdata"

export interface RawDataProps {
  currentRow?: Pod
}

const getVolumeState = (state: any) => {
  if (state.emptyDir) return 'emptyDir';
  if (state.persistentVolumeClaim) return 'persistenVolumeClaim';
  if (state.configMap) return 'configMap';
  if (state.secret) return 'secret';
  if (state.projected) return 'projected';
  return 'Unknown';
};

export default function Relative({
  currentRow
}: RawDataProps) {
  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.raw ||!currentRow.raw.metadata.ownerReferences) return [];
    return Object.entries(currentRow.raw.metadata.ownerReferences).map((cond, index) => (
        <TableRow key={index}>
            <TableCell className="font-medium">{(cond[1] as {name: string}).name}</TableCell>
            <TableCell className="font-medium">{(cond[1] as {kind: string}).kind}</TableCell>
            <TableCell>
              {(cond[1] as {controller?: boolean}).controller ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Minus className="h-4 w-4 text-gray-400" />
              )}
            </TableCell>
            <TableCell>
              {(cond[1] as {blockOwnerDeletion?: boolean}).blockOwnerDeletion ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Minus className="h-4 w-4 text-gray-400" />
              )}
            </TableCell>
        </TableRow>
    ));
  }, [currentRow]);

  const volumeRows = useMemo(() => {
    if (!currentRow ||!currentRow.raw ||!currentRow.raw.spec.volumes) return [];
    return Object.entries(currentRow.raw.spec.volumes).map((cond, index) => (
        <TableRow key={index}>
            <TableCell className="font-medium">{(cond[1] as {name: string}).name}</TableCell>
            <TableCell className="font-medium">{getVolumeState(cond[1])}</TableCell>
            <TableCell className="font-medium">
              {JSON.stringify(cond[1], null, 2)}
            </TableCell>
        </TableRow>
    ));
  }, [currentRow]);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            关联References {currentRow?.raw.metadata.ownerReferences?.length}
          </CardTitle>
          <CardDescription>
            OwnerReferences 
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          { currentRow?.raw.metadata.ownerReferences && 
            <div className="mb-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Controller</TableHead>
                    <TableHead>是否集联删除</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statusRows} 
                </TableBody>
              </Table>
            </div>
          }
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            引用资源 {currentRow?.raw.spec.volumes.length}
          </CardTitle>
          <CardDescription>
            磁盘卷配置 
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          { currentRow?.raw.spec.volumes && 
            <div className="mb-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volumeRows} 
                </TableBody>
              </Table>
            </div>
          }
        </CardContent>
      </Card>
      <RawData currentRow={currentRow}/>
    </>
  )
}

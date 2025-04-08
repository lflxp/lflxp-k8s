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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Pod } from '../../data/schema'
import { useMemo } from 'react'

export interface RawDataProps {
  currentRow?: Pod
}

export default function RawData({
  currentRow
}: RawDataProps) {
  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.raw ||!currentRow.raw.status) return [];
    return Object.entries(currentRow.raw.status).map(([key, value]) => (
        <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{JSON.stringify(value)}</TableCell>
        </TableRow>
    ));
  }, [currentRow]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{currentRow?.raw.metadata.name}</CardTitle>
          <CardDescription>
            命名空间：{currentRow?.raw.metadata.namespace}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">属性</TableHead>
                <TableHead>值</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRow && Object.entries(currentRow.raw.metadata).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{key}</TableCell>
                  <TableCell>{JSON.stringify(value)}</TableCell>
                </TableRow>
              ))}
              {statusRows} 
              {currentRow && Object.entries(currentRow.raw.spec).map(([key, value]) => (
                key !== 'containers' && (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell>{JSON.stringify(value)}</TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Container信息</CardTitle>
          <CardDescription>
            Container原始信息展示
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">属性</TableHead>
                <TableHead className="w-[auto]">值</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRow && currentRow.raw.spec.containers.map((container: any, index: number) => (
                // 遍历 containers 数组
                Object.entries(container).map(([key, value]) => (
                  // 遍历每个 container 对象的键值对
                  <TableRow key={`${index}-${key}`}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="whitespace-pre-wrap break-all">
                              {JSON.stringify(value)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="whitespace-pre-wrap break-all">
                            {JSON.stringify(value)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table> 
        </CardContent>
      </Card>
    </>
  )
}
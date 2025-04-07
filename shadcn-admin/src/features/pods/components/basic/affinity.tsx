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

export default function Affinity({
  currentRow
}: RawDataProps) {
  const affinityRows = useMemo(() => {
    if (!currentRow || !currentRow.raw || !currentRow.raw.spec.affinity) return [];
    
    const affinity = currentRow.raw.spec.affinity;
    const rows = [];
    
    // 节点亲和性
    if (affinity.nodeAffinity) {
      // 硬亲和性
      if (affinity.nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution) {
        rows.push(
          <TableRow key="node-affinity-required">
            <TableCell className="font-medium">节点亲和性</TableCell>
            <TableCell className="font-medium">硬亲和性</TableCell>
            <TableCell>
              {JSON.stringify(affinity.nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution, null, 2)}
            </TableCell>
          </TableRow>
        );
      }
      
      // 软亲和性
      if (affinity.nodeAffinity.preferredDuringSchedulingIgnoredDuringExecution) {
        rows.push(
          <TableRow key="node-affinity-preferred">
            <TableCell className="font-medium">节点亲和性</TableCell>
            <TableCell className="font-medium">软亲和性</TableCell>
            <TableCell>
              {JSON.stringify(affinity.nodeAffinity.preferredDuringSchedulingIgnoredDuringExecution, null, 2)}
            </TableCell>
          </TableRow>
        );
      }
    }
    
    // Pod亲和性
    if (affinity.podAffinity) {
      // 硬亲和性
      if (affinity.podAffinity.requiredDuringSchedulingIgnoredDuringExecution) {
        rows.push(
          <TableRow key="pod-affinity-required">
            <TableCell className="font-medium">Pod亲和性</TableCell>
            <TableCell className="font-medium">硬亲和性</TableCell>
            <TableCell>
              {JSON.stringify(affinity.podAffinity.requiredDuringSchedulingIgnoredDuringExecution, null, 2)}
            </TableCell>
          </TableRow>
        );
      }
      
      // 软亲和性
      if (affinity.podAffinity.preferredDuringSchedulingIgnoredDuringExecution) {
        rows.push(
          <TableRow key="pod-affinity-preferred">
            <TableCell className="font-medium">Pod亲和性</TableCell>
            <TableCell className="font-medium">软亲和性</TableCell>
            <TableCell>
              {JSON.stringify(affinity.podAffinity.preferredDuringSchedulingIgnoredDuringExecution, null, 2)}
            </TableCell>
          </TableRow>
        );
      }
    }
    
    // Pod反亲和性
    if (affinity.podAntiAffinity) {
      // 硬反亲和性
      if (affinity.podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution) {
        rows.push(
          <TableRow key="pod-anti-affinity-required">
            <TableCell className="font-medium">Pod反亲和性</TableCell>
            <TableCell className="font-medium">硬反亲和性</TableCell>
            <TableCell>
              {JSON.stringify(affinity.podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution, null, 2)}
            </TableCell>
          </TableRow>
        );
      }
      
      // 软反亲和性
      if (affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution) {
        rows.push(
          <TableRow key="pod-anti-affinity-preferred">
            <TableCell className="font-medium">Pod反亲和性</TableCell>
            <TableCell className="font-medium">软反亲和性</TableCell>
            <TableCell>
              {JSON.stringify(affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution, null, 2)}
            </TableCell>
          </TableRow>
        );
      }
    }
    
    return rows;
  }, [currentRow]);

  const tolerationRows = useMemo(() => {
    if (!currentRow || !currentRow.raw || !currentRow.raw.spec.tolerations) return [];
    
    return currentRow.raw.spec.tolerations.map((toleration, index) => (
      <TableRow key={index}>
        <TableCell className="font-medium">{toleration.key || '-'}</TableCell>
        <TableCell className="font-medium">{toleration.operator || '-'}</TableCell>
        <TableCell className="font-medium">{toleration.value || '-'}</TableCell>
        <TableCell className="font-medium">{toleration.effect || '-'}</TableCell>
        <TableCell className="font-medium">
          {toleration.tolerationSeconds ? toleration.tolerationSeconds : '无限期'}
        </TableCell>
      </TableRow>
    ));
  }, [currentRow]);

  return (
    <>
      { currentRow?.raw.spec.affinity &&
      <Card>
        <CardContent className="space-y-2">
            <div className="mb-2">
              <h3 className="text-lg text-left font-semibold">亲和性配置</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>类型</TableHead>
                    <TableHead>亲和性类型</TableHead>
                    <TableHead>配置详情</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affinityRows} 
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card> }
      <Card className="mt-4">
        <CardContent className="space-y-2">
          { currentRow?.raw.spec.tolerations && 
            <div className="mb-2">
              <h3 className="text-lg text-left font-semibold">容忍度配置 {currentRow?.raw.spec.tolerations.length}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Effect</TableHead>
                    <TableHead>容忍时间(秒)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tolerationRows} 
                </TableBody>
              </Table>
            </div>
          }
        </CardContent>
      </Card>
    </>
  )
}
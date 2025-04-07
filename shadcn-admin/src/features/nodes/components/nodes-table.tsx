import { ColumnDef } from '@tanstack/react-table'
import { DataTable, DataTableProps } from './data-table'
import { Node } from '../data/schema'
import request from '@/api/request'; 
import { toast } from '@/hooks/use-toast'

export const columns: ColumnDef<Node>[] = [
  {
    id: 'name',
    header: '节点名称',
    cell: ({ row }) => row.original.metadata.name,
  },
  {
    id: 'status',
    header: '状态',
    cell: ({ row }) => {
      const conditions = row.original.status?.conditions || [];
      const readyCondition = conditions.find((condition) => condition.type === 'Ready');
      const allFalseExceptReady = conditions.filter((condition) => condition.type !== 'Ready').every((condition) => condition.status === 'False');
      const statusText = (readyCondition && readyCondition.status === 'True') || allFalseExceptReady ? 'Active' : '警告';
      const statusColor = (readyCondition && readyCondition.status === 'True') || allFalseExceptReady ? 'green' : 'red';
      const message = conditions.filter((condition) => (condition.type === 'Ready' && condition.status === 'False') || (condition.type !== 'Ready' && condition.status === 'True')).map((condition) => condition.message).join('\n');
      return (
        <span style={{ color: statusColor }} title={message}>
          {statusText}
        </span>
      );
    }
  },
  {
    id: 'Kubernetes',
    header: 'Kubernetes',
    cell: ({ row }) => {
      const kubeletVersion = row.original.status?.nodeInfo?.kubeletVersion;
      return kubeletVersion || 'N/A';
    },
  },
  {
    id: 'OS',
    header: 'OS',
    cell: ({ row }) => {
      const osImage = row.original.status?.nodeInfo?.osImage;
      return osImage || 'N/A';
    },
  },
  { // 找到CPU使用率列
    accessorKey: 'cpuUsage',
    header: 'CPU使用率',
    cell: ({ row }) => {
      // try {
      //   const response2 = request.get('/api/monitor/metrics/node');
      //   console.log('请求接口成功 metrics:', response2.data.items)
      //   const metrics = response2.data.items;
      //   const allocatableCPU = row.original.status?.allocatable?.cpu;
      //   const nodeName = row.original.metadata.name;
      //   const nodeMetrics = metrics.find(metricdata => metricdata.metadata.name === nodeName);
      //   const usedCPU = nodeMetrics?.usage?.cpu;
      //   const cpuUsage = allocatableCPU && usedCPU ? (usedCPU / allocatableCPU) * 100 : null;
      //   return cpuUsage ? (
      //     <div>
      //       <progress value={cpuUsage} max="100"></progress>
      //       <span>{cpuUsage.toFixed(2)}%</span>
      //     </div>
      //   ) : 'N/A'
      // } catch (error) {
      //   toast({
      //     title: '请求接口出错',
      //     description: (
      //       <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
      //         <code className='text-white'>
      //           {JSON.stringify(error, null, 2)}
      //         </code>
      //       </pre>
      //     ),
      //   })
      // }
      return 'N/A';
    }
  }, // 更新CPU使用率列的计算逻辑
  {
    accessorKey: 'memoryUsage',
    header: '内存使用率',
  },
  {
    id: 'kernelVersion',
    header: '内核版本',
    cell: ({ row }) => {
      const kernelVersion = row.original.status?.nodeInfo?.kernelVersion;
      return kernelVersion || 'N/A';
    }
  },
  {
    id: 'arch',
    header: '架构',
    cell: ({ row }) => {
      const arch = row.original.status?.nodeInfo?.architecture;
      return arch || 'N/A';
    }
  },
  {
    accessorKey: '操作系统',
    header: 'operatingSystem',
    cell: ({ row }) => {
      const operatingSystem = row.original.status?.nodeInfo?.operatingSystem;
      return operatingSystem || 'N/A';
    }
  },
]

export function NodesTable({
  columns,
  data,
}: DataTableProps<Node>) {
  // const { loading, error } = useNodes()

  // if (loading) return <div>加载中...</div>
  // if (error) return <div>错误: {error}</div>

  return <DataTable columns={columns} data={data} />;
}
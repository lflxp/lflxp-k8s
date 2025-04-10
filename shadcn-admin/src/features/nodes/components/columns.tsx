import { ColumnDef } from '@tanstack/react-table'
import { Node } from '../data/schema'
import { toast } from '@/hooks/use-toast'
import { DataTableColumnHeader } from './data-table-column-header'
import { useNodes } from '../context/nodes-context'
import { Label } from "@/components/ui/label"

export const columns: ColumnDef<Node>[] = [
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
    id: 'name',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='节点名称' />
      ),
    cell: ({ row }) => {
        const { setOpen, setCurrentRow } = useNodes()
        const openDrawer = () => {
          setOpen('detail')
          setCurrentRow(row.original)
        };
  
        return (
          <div>
            <div className='w-48 overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible text-blue-500 hover:text-blue-600 cursor-pointer' onClick={openDrawer}>{row.original.metadata.name}</div>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
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
      const osImage = row.original?.status?.nodeInfo?.osImage;
      return osImage || 'N/A';
    },
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
    accessorKey: 'operatingSystem',
    header: '操作系统',
    cell: ({ row }) => {
      const operatingSystem = row.original.status?.nodeInfo?.operatingSystem;
      return operatingSystem || 'N/A';
    }
  },
  {
    id: 'ip',
    header: 'IP地址',
    cell: ({ row }) => {
      const internalIPs = row.original.status?.addresses?.filter((address) => address.type === 'InternalIP') || [];
      return internalIPs.map((address) => (
        <Label key={address.type} className="text-blue-600">
          {address.address}
        </Label>
      ));
    }
  },
  { // 找到CPU使用率列
    accessorKey: 'cpuUsage',
    header: 'CPU使用率',
    cell: ({ row }) => {
      try {
        const allocatableCPU = row.original.status?.allocatable?.cpu;
        const nodeMetrics = row.original.metrics;
        const usedCPU = nodeMetrics?.usage?.cpu;
        
        // 转换CPU值（如"812m"转0.812）
        const parseCPU = (cpu: string) => {
          if (!cpu) return 0;
          if (cpu.endsWith('m')) return parseFloat(cpu) / 1000;
          if (cpu.endsWith('n')) return parseFloat(cpu) / 1000000000;
          return parseFloat(cpu);
        };
        
        const allocatable = parseCPU(allocatableCPU);
        const used = parseCPU(usedCPU);
        const cpuUsage = allocatable && used ? (used / allocatable) * 100 : null;
        // console.log('CPU使用率:', cpuUsage, 'allocatableCPU:', allocatableCPU, 'usedCPU:', usedCPU)
        return cpuUsage ? (
          <div className="relative w-full">
            <div className="w-full h-6 rounded-full border border-gray-200 bg-gray-100 overflow-hidden relative">
              <div 
                className={`h-full transition-all duration-300 absolute top-0 left-0 ${
                  cpuUsage < 30 ? 'bg-green-400' : 
                  cpuUsage < 60 ? 'bg-yellow-400' : 
                  cpuUsage < 80 ? 'bg-orange-400' : 
                  'bg-red-500'
                }`}
                style={{ width: `${cpuUsage}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800 z-10">
                {cpuUsage.toFixed(2)}%
              </span>
            </div>
          </div>
        ) : 'N/A'
      } catch (error) {
        toast({
          title: '请求接口出错',
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white'>
                {JSON.stringify(error, null, 2)}
              </code>
            </pre>
          ),
        })
      }
      // return 'N/A';
    }
  }, // 更新CPU使用率列的计算逻辑
  {
    accessorKey: 'memoryUsage',
    header: '内存使用率',
    cell: ({ row }) => {
      try {
        const allocatableMemory = row.original.status?.allocatable?.memory;
        const nodeMetrics = row.original.metrics;
        const usedMemory = nodeMetrics?.usage?.memory;
        
        // 转换内存值（如"812Ki"转字节数）
        const parseMemory = (memory: string) => {
          if (!memory) return 0;
          if (memory.endsWith('Ki')) return parseFloat(memory) * 1024;
          if (memory.endsWith('Mi')) return parseFloat(memory) * 1024 * 1024;
          if (memory.endsWith('Gi')) return parseFloat(memory) * 1024 * 1024 * 1024;
          return parseFloat(memory);
        };
        
        const allocatable = parseMemory(allocatableMemory);
        const used = parseMemory(usedMemory);
        const memoryUsage = allocatable && used ? (used / allocatable) * 100 : null;
        // console.log('内存使用率:', memoryUsage, 'allocatableMemory:', allocatableMemory, 'usedMemory:', usedMemory)
        return memoryUsage ? (
          <div className="relative w-full">
            <div className="w-full h-6 rounded-full border border-gray-200 bg-gray-100 overflow-hidden relative">
              <div 
                className={`h-full transition-all duration-300 absolute top-0 left-0 ${
                  memoryUsage < 30 ? 'bg-green-400' : 
                  memoryUsage < 60 ? 'bg-yellow-400' : 
                  memoryUsage < 80 ? 'bg-orange-400' : 
                  'bg-red-500'
                }`}
                style={{ width: `${memoryUsage}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800 z-10">
                {memoryUsage.toFixed(2)}%
              </span>
            </div>
          </div>
        ) : 'N/A'
      } catch (error) {
        toast({
          title: '请求接口出错',
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white'>
                {JSON.stringify(error, null, 2)}
              </code>
            </pre>
          ),
        })
      }
      // return 'N/A';
    }
  },
  {
    accessorKey: 'creationTimestamp',
    header: '创建时间',
    cell: ({ row }) => {
      const creationTimestamp = row.original.metadata?.creationTimestamp;
      return creationTimestamp ? new Date(creationTimestamp).toLocaleString() : 'N/A';
    }
  },
]
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { callTypes, statuses } from '../data/data'
import { Pod } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTasks } from '../context/tasks-context'



export const columns: ColumnDef<Pod>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Id' />
    ),
    cell: ({ row }) => <div className='w-fit'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='状态' />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      const badgeColor = callTypes.get(row.getValue("status"))
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {row.getValue('status')}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='名称' />
    ),
    cell: ({ row }) => {
      const { setOpen, setCurrentRow } = useTasks()
      const openDrawer = () => {
        setOpen('detail')
        setCurrentRow(row.original)
      };

      return (
        <div>
          <div className='w-48 overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible hover:text-blue-600 cursor-pointer' onClick={openDrawer}>{row.getValue("name")}</div>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'namespace',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='命名空间' />
    ),
    cell: ({ row }) => <div className='w-fit'>{row.getValue("namespace")}</div>,
  },
  {
    accessorKey: 'images',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='镜像' />
    ),
    cell: ({ row }) => {
      // 获取 containerStatuses 数组
      const containerStatuses = row.original.containerStatuses || [];
      // 提取所有 image
      const images = containerStatuses.map(status => status.image);
  
      if (images.length === 0) return <div>-</div>;
  
      return (
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="max-w-[200px] truncate">
                  {images[0]}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[400px] whitespace-pre-wrap">
                {images.map((image, index) => (
                  <div key={index}>{image}</div>
                ))}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {images.length > 1 && (
            <span className="ml-1 text-xs text-muted-foreground">
              +{images.length - 1} more
            </span>
          )}
        </div>
      );
    },
    enableHiding: true
  },   
  {
    accessorKey: 'ready',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='就绪容器' />
    ),
    cell: ({ row }) => {
      const lengths = row.original.containerStatuses?.length || 0;
      const ready = row.original.containerStatuses?.filter((status) => status.ready).length || 0;
      const renderBoxes = () => {
        const boxes = [];
        for (let i = 0; i < ready; i++) {
          boxes.push(<span key={i} className="bg-green-500 w-3 h-3 inline-block mr-1"></span>);
        }
        for (let i = 0; i < lengths - ready; i++) {
          boxes.push(<span key={i + ready} className="bg-gray-300 w-3 h-3 inline-block mr-1"></span>);
        }
        return boxes;
      };
  
      return (
        <div className='w-fit'>
          {renderBoxes()}
        </div>
      );
    }
  },
  {
    accessorKey: 'restart',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='重启次数' />
    ),
    cell: ({ row }) => <div className='w-fit'>{row.getValue("restart")}</div>,
  },
  {
    id: 'controller',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='控制器' />
    ),
    cell: ({ row }) => <div className='w-fit'>{row.original.raw.metadata.ownerReferences?.[0]?.kind}</div>,
  },
  {
    id: 'qos',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='QoS' />
    ),
    cell: ({ row }) => <div className='w-fit'>{row.original.raw.status?.qosClass}</div>,
  },
  {
    accessorKey: 'podip',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='容器IP' />
    ),
    cell: ({ row }) => <div className='w-fit'>{row.getValue("podip")}</div>,
  },
  {
    accessorKey: 'hostip',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='主机IP' />
    ),
    cell: ({ row }) => <div className='w-fit'>{row.getValue("hostip")}</div>,
  },
  {
    accessorKey: 'createtime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='运行时间' />
    ),
    cell: ({ row }) => {
      // 提取计算时间差的逻辑到一个函数中
      const calculateTimeDifference = (startTime: number) => {
        const endTime = Date.now();
        const diff = endTime - startTime;
      
        const DAY_IN_MS = 24 * 3600 * 1000;
        const HOUR_IN_MS = 3600 * 1000;
        const MINUTE_IN_MS = 60 * 1000;
      
        const days = Math.floor(diff / DAY_IN_MS);
        const remainingAfterDays = diff % DAY_IN_MS;
        const hours = Math.floor(remainingAfterDays / HOUR_IN_MS);
        const remainingAfterHours = remainingAfterDays % HOUR_IN_MS;
        const minutes = Math.floor(remainingAfterHours / MINUTE_IN_MS);
        const remainingAfterMinutes = remainingAfterHours % MINUTE_IN_MS;
        const seconds = Math.round(remainingAfterMinutes / 1000);
      
        return { days, hours, minutes, seconds };
      };
      
      const createTimeString = (days: number, hours: number, minutes: number, seconds: number) => {
        let timeString = '';
        if (days > 0) {
          timeString += `${days}d `;
        }
        if (hours > 0) {
          timeString += `${hours}h `;
        }
        if (minutes > 0) {
          timeString += `${minutes}m `;
        }
        if (seconds > 0) {
          timeString += `${seconds}s`;
        }
        return timeString;
      };
      
      const startTime = new Date(row.getValue("createtime")).getTime();
      const { days, hours, minutes, seconds } = calculateTimeDifference(startTime);
      const timeFn = createTimeString(days, hours, minutes, seconds);
      
      return (
        <div className='w-fit'>{timeFn}</div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

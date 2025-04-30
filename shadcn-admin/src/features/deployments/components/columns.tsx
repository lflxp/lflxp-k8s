import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Pod } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTasks } from '../context/tasks-context'
import { Badge } from '@/components/ui/badge'

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
    accessorKey: 'avtive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='状态' />
    ),
    cell: ({ row }) => {
      const status = row.original?.crd?.status?.availableReplicas ? (
        <Badge variant="outline" className='text-green-500 border-none'>Running</Badge>
      ) : (
        <Badge variant="outline" className='text-red-500 border-none'>Progressing</Badge>
      )

      return status
    },
    enableSorting: false,
    enableHiding: false,
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
        // console.log('row', row.original)
        setCurrentRow(row.original)
      };

      return (
        <div>
          <div className='overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible hover:text-blue-600 cursor-pointer' onClick={openDrawer}>{row.original?.name}</div>
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
    cell: ({ row }) => <div className='w-fit'>{row.original?.namespace}</div>,
  },
  {
    accessorKey: 'images',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='镜像' />
    ),
    cell: ({ row }) => {
      // 获取 containerStatuses 数组
      const containerStatuses = row.original?.crd?.spec?.template?.spec?.containers || [];
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
    accessorKey: 'replicas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='副本数' />
    ),
    cell: ({ row }) => {
      return row.original.crd.spec.replicas || 0;
    }
  },
  {
    accessorKey: 'uptodate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='UP TO DATE' />
    ),
    cell: ({ row }) => {
      return row.original.status?.updatedReplicas || 0;
    }
  },
  {
    accessorKey: 'avaliable',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='AVALIABLE' />
    ),
    cell: ({ row }) => {
      return row.original.status?.availableReplicas || 0;
    }
  },
  {
    accessorKey: 'ready',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='就绪容器' />
    ),
    cell: ({ row }) => {
      const unready = row.original.status?.unavailableReplicas || 0;
      const ready = row.original.status?.availableReplicas || 0;
      const renderBoxes = () => {
        const boxes = [];
        for (let i = 0; i < ready; i++) {
          boxes.push(<span key={i} className="bg-green-500 w-3 h-3 inline-block mr-1"></span>);
        }
        for (let i = 0; i < unready; i++) {
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
      
      const startTime = new Date(row.original.crd.metadata?.creationTimestamp || '').getTime();
      // console.log('startTime', startTime)
      const { days, hours, minutes, seconds } = calculateTimeDifference(startTime);
      const timeFn = createTimeString(days, hours, minutes, seconds);
      
      return (
        <div className='w-fit'>{timeFn}</div>
      );
    },
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]

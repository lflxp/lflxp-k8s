import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Pod } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTasks } from '../context/tasks-context'
import { Badge } from '@/components/ui/badge'
import { DataTableRowActions } from './data-table-row-actions'

function calculateTimeDifference(startTimeStr: string, endTimeStr: string) {
  // 将时间字符串转换为 Date 对象
  const startTime = new Date(startTimeStr);
  if (endTimeStr === '') {
    endTimeStr = new Date().toString();
  }
  const endTime = new Date(endTimeStr);

  // 检查日期是否有效
  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return "无效的时间格式";
  }

  // 计算时间差值（毫秒）
  const differenceInMs = endTime.getTime() - startTime.getTime();

  // 将差值转换为秒、分钟、小时等
  const seconds = Math.floor(differenceInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // 剩余的时间
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  // 构建结果字符串
  let result = "";
  if (days > 0) {
      result += `${days} 天 `;
  }
  if (remainingHours > 0) {
      result += `${remainingHours} 小时 `;
  }
  if (remainingMinutes > 0) {
      result += `${remainingMinutes} 分钟 `;
  }
  if (remainingSeconds > 0) {
      result += `${remainingSeconds} 秒`;
  }

  return result || "时间差值为 0";
}


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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='状态' />
    ),
    cell: ({ row }) => {
      const status = row.original?.crd?.status?.succeeded ? (
        <Badge variant="outline" className='text-green-500 border-none'>{row.original?.crd?.status?.conditions ? row.original?.crd?.status?.conditions[0].type : 'Failed'}</Badge>
      ) : (
        <Badge variant="outline" className='text-red-500 border-none'>{row.original?.crd?.status?.conditions ? row.original?.crd?.status?.conditions[0].type : 'Failed'}</Badge>
      )

      return status
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pods' />
    ),
    cell: ({ row }) => {
      const status = row.original?.crd?.status?.active ? row.original?.crd?.status?.active : 0; 

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
    accessorKey: 'completions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='COMPLETIONS' />
    ),
    cell: ({ row }) => {
      return row.original?.crd?.status?.succeeded ? (
        <Badge variant="outline" className='text-green-500 border-none'>{row.original?.crd?.status?.succeeded}/{row.original?.crd?.spec.completions}</Badge>
      ) : (
        <Badge variant="outline" className='text-red-500 border-none'>0/{row.original?.crd?.spec.completions}</Badge>
      );
    }
  },
  {
    accessorKey: 'duration',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='DURATION' />
    ),
    cell: ({ row }) => {
      return row.original?.crd?.status?.conditions ? calculateTimeDifference(row.original?.crd?.status?.startTime, row.original?.crd?.status?.conditions[0].lastTransitionTime) : calculateTimeDifference(row.original?.crd?.status?.startTime, '');
    }
  },
  {
    accessorKey: 'selector',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='NODE SELECTOR' />
    ),
    cell: ({ row }) => {
      return row.original?.crd?.spec?.template.spec.nodeSelector
        ? Object.entries(row.original.crd.spec.template.spec.nodeSelector).map(([key, value]: [string, string]) => `${key}=${value}`)
        : '-';
    },
    enableSorting: false,
    enableHiding: false,
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
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

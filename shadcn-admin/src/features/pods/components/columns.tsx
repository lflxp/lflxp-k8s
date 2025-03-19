import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { labels, priorities, statuses } from '../data/data'
import { Pod } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => <div className='w-48 overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible'>{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'namespace',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Namespace' />
    ),
    cell: ({ row }) => <div className='w-fit'>{row.getValue("namespace")}</div>,
  },
  {
    accessorKey: 'ready',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ready' />
    ),
    cell: ({ row }) => {
      const lengths = row.original.containerStatuses?.length
      const ready = row.original.containerStatuses?.filter((status) => status.ready).length
      return (
        <div className='w-fit'>{ready}/{lengths}</div>
      )
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
          timeString += `${days} 天 `;
        }
        if (hours > 0) {
          timeString += `${hours} 小时 `;
        }
        if (minutes > 0) {
          timeString += `${minutes} 分钟 `;
        }
        if (seconds > 0) {
          timeString += `${seconds} 秒`;
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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className='flex w-[100px] items-center'>
          {status.icon && (
            <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

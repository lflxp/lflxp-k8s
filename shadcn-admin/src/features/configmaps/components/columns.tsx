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
    accessorKey: 'data',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Data' />
    ),
    cell: ({ row }) => {
      return (
        <div className='w-fit'>
          {row.original?.crd?.data
        ? Object.keys(row.original.crd.data).length 
        : '0'}
        </div>
      )
    }
  },
  {
    accessorKey: 'capatibility',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='大小' />
    ),
    cell: ({ row }) => {
      return (
        <div className='w-fit'>
          {row.original?.crd?.data
            ? (() => {
                const totalBytes = Object.values(row.original.crd.data).reduce((acc, value) => acc + (value?.length || 0), 0);
                if (totalBytes >= 1024 * 1024) {
                  return (totalBytes / (1024 * 1024)).toFixed(2) + ' MB';
                } else if (totalBytes >= 1024) {
                  return (totalBytes / 1024).toFixed(2) + ' KB';
                } else {
                  return totalBytes + ' bytes';
                }
              })()
            : '0 bytes'}
        </div>
      )
    }
  },
  {
    accessorKey: 'owner',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='OwnerReferences' />
    ),
    cell: ({ row }) => {
      const ownerReferences = row.original?.crd?.metadata?.ownerReferences;
      if (!ownerReferences || ownerReferences.length === 0) {
        return '-';
      }
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className='w-fit'>
              {ownerReferences.map((owner, index) => (
                <div key={index} className='text-ellipsis overflow-hidden whitespace-nowrap hover:overflow-visible hover:text-blue-600 cursor-pointer'>
                  {`${owner.kind}/${owner.name}`}
                </div>
              ))}
            </TooltipTrigger>
            <TooltipContent>
              {ownerReferences.map((owner, index) => (
                <div key={index}>{`${owner.kind}/${owner.name}`}</div>
              ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
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

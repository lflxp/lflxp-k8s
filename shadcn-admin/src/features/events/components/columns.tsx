import { ColumnDef } from '@tanstack/react-table'
import { Event } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { useEvents } from '../context/context'
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Event>[] = [
  {
    id: 'type',
    header: '级别',
    cell: ({ row }) => {
      return (
        <Badge
          className={`${
        row.original?.type === 'Normal'
          ? 'bg-green-500 text-white'
          : row.original?.type === 'Warning'
          ? 'bg-red-500 text-white'
          : 'bg-gray-500 text-white'
          }`}
        >
          {row.original?.type || 'Unknown'}
        </Badge>
      );
    }
  },
  {
    id: 'name',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='名称' />
      ),
    cell: ({ row }) => {  
      const {setOpen, setCurrentRow} = useEvents();
      const openDrawer = () => {
        setCurrentRow(row.original);
        setOpen('detail');
      };

        return (
          <div>
            <div className='w-48 overflow-hidden text-ellipsis whitespace-nowrap hover:whitespace-normal hover:overflow-visible text-blue-500 hover:text-blue-600 cursor-pointer' onClick={openDrawer}>{row.original.involvedObject.name}</div>
            {/* {roles.length > 0 ? roles : ''} */}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
  },
  {
    id: 'namespaces',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='命名空间' />
      ),
    cell: ({ row }) => {
        return row.original.metadata.namespace ? (
          <div className='flex items-center'>
            <div className='w-fit'>{row.original.metadata.namespace}</div>
          </div>
        ) : (
          <div className='w-fit'>default</div>
        );
      },
      enableSorting: true,
      enableHiding: false,
  },
  {
    id: '类型',
    header: '类型',
    cell: ({ row }) => {
      return row.original?.involvedObject?.kind ? (
        <div className='flex items-center'>
          <div className='w-fit'>{row.original.involvedObject.kind}</div>
        </div>
      ) : (
        <div className='w-fit'>default</div>
      );
    },
  },
  {
    id: 'reason',
    header: '原因',
    cell: ({ row }) => {
      return row.original?.reason;
    }
  },
  {
    id: 'message',
    header: '详情',
    cell: ({ row }) => {
      return row.original?.message;
    }
  },
  {
    id: 'source',
    header: '来源',
    cell: ({ row }) => {
      return row.original?.source?.component;
    }
  },
  {
    id: 'count',
    header: '次数',
    cell: ({ row }) => {
      return row.original?.count || 'N/A';
    }
  },
  {
    accessorKey: 'creationTimestamp',
    header: '最近一次',
    cell: ({ row }) => {
      const creationTimestamp = row.original?.lastTimestamp || row.original?.metadata?.creationTimestamp;
      if (!creationTimestamp) return 'N/A';

      const timeDifference = Date.now() - new Date(creationTimestamp).getTime();
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days}d`;
      if (hours > 0) return `${hours}h`;
      if (minutes > 0) return `${minutes}m`;
      return `${seconds}s`;
    }
  }
]
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { Crd } from '../data/schema'
import { SheetDemo } from "./detail"

export const columns: ColumnDef<Crd>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Name' />
      ),
    cell: ({ row }) => {  
        return (
          <div>
            {row.original.metadata.name} {SheetDemo(row.original, row.original.metadata.name)}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
  },
  {
    accessorKey: 'kind',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Kind' />
      ),
    cell: ({ row }) => {
        return row.original.kind;
      },
      enableSorting: true,
      enableHiding: false,
  },
  {
    id: 'namespace',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Namespace' />
      ),
    cell: ({ row }) => {
        return row.original.metadata.namespace;
      },
      enableSorting: true,
      enableHiding: false,
  },
  {
    id: 'createdAt',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Creation Timestamp' />
      ),
    cell: ({ row }) => {
        return row.original?.metadata.creationTimestamp ? (
          <div className='w-fit'>
            {new Date(row.original.metadata.creationTimestamp).toLocaleString()}
          </div>
        ) : (
          <div className='w-fit'>N/A</div>
        );
      },
      enableSorting: true,
      enableHiding: false,
  },
]
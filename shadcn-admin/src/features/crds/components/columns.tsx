import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { useCRDs } from '../context/context'
import { ApiResourceResult } from '../data/schema'

export const columns: ColumnDef<ApiResourceResult>[] = [
  {
    id: 'name',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Name' />
      ),
    cell: ({ row }) => {  
      const {setOpen, setCurrentRow} = useCRDs();
      const openDrawer = () => {
        setCurrentRow(row.original);
        setOpen('detail');
      };

        return (
            <div>
            {row.original.name.includes('/') ? (
              <div className='w-48 overflow-hidden text-ellipsis whitespace-nowrap text-gray-500 cursor-default'>
              {row.original.name}
              </div>
            ) : (
              <div
              className='w-48 overflow-hidden text-ellipsis whitespace-nowrap hover:whitespace-normal hover:overflow-visible text-blue-500 hover:text-blue-600 cursor-pointer'
              onClick={openDrawer}
              >
              {row.original.name}
              </div>
            )}
            </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
  },
  {
    id: 'shortNames',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Short Names' />
      ),
    cell: ({ row }) => {
        return row.original.shortNames ? row.original.shortNames[0] : 'N/A';
      },
      enableSorting: true,
      enableHiding: false,
  },
  {
    id: 'apiversion',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='API Version' />
      ),
    cell: ({ row }) => {
        return row.original.version || '';
      },
      enableSorting: true,
      enableHiding: false,
  },
  {
    id: 'group',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Group' />
      ),
    cell: ({ row }) => {
        return row.original.group || 'N/A';
      },
      enableSorting: true,
      enableHiding: false,
  },
  {
    id: 'namespaces',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Namespaced' />
      ),
    cell: ({ row }) => {
        return row.original.namespaced ? (
          <div className='text-xs text-green-500'>
            {row.original.namespaced ? 'true' : 'false'}
          </div>
        ) : (
          <div className='text-xs text-red-500'>
            {row.original.namespaced ? 'true' : 'false'}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
  },
  {
    id: 'kind',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Kind' />
      ),
    cell: ({ row }) => {
        return row.original.kind
      },
      enableSorting: true,
      enableHiding: false,
  },
  {
    id: 'verbs',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Verbs' />
      ),
    cell: ({ row }) => {
        return row.original?.verbs && row.original.verbs.length > 0 ? (
          <div className='w-48 overflow-hidden text-ellipsis whitespace-nowrap hover:whitespace-normal hover:overflow-visible'>
            {row.original.verbs.join(', ')}
          </div>
        ) : '';
      },
      enableSorting: true,
      enableHiding: false,
  },
  // {
  //   id: 'singularNames',
  //   header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title='Singular Names' />
  //     ),
  //   cell: ({ row }) => {
  //       return row.original?.singularName;
  //     },
  //     enableSorting: true,
  //     enableHiding: false,
  // }, 
]
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { TasksPrimaryButtons } from './tasks-primary-buttons'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  originalData: TData[]
  fetchData: () => Promise<void>;
}

export function DataTableToolbar<TData>({
  table,
  originalData,
  fetchData,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  // console.log('table status', table.getColumn('status'))
  // const namespaces: { value: string; label: string; icon: typeof IconArrowRight }[] = [];
  // console.log('originalData', originalData)
  const namespaces = [...new Set(originalData.map(row => row.crd?.metadata.namespace))]
  .map(namespace => ({
    value: namespace,
    label: namespace
  }));

  // const hostips = [...new Set(originalData.map(row => row.hostip))]
  // .map(hostip => ({
  //   value: hostip,
  //   label: hostip
  // }));

  // const statuss = [...new Set(originalData.map(row => row.status))]
  // .map(status => ({
  //   value: status,
  //   label: status
  // }));


  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter tasks...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
            {/* {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='状态筛选'
              options={statuss}
            />
            )} */}
            {table.getColumn('namespace') && (
            <DataTableFacetedFilter
              column={table.getColumn('namespace')}
              title='命名空间筛选'
              options={namespaces}
            />
            )}
            {/* {table.getColumn('hostip') && (
            <DataTableFacetedFilter
              column={table.getColumn('hostip')}
              title='主机IP筛选'
              options={hostips}
            />
            )} */}
          {/* {table.getColumn('priority') && (
            <DataTableFacetedFilter
              column={table.getColumn('priority')}
              title='Priority'
              options={priorities}
            />
          )} */}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
      <TasksPrimaryButtons fetchData={fetchData} />
    </div>
  )
}

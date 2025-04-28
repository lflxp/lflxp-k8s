import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { TasksPrimaryButtons } from './tasks-primary-buttons'

interface DataTableToolbarProps<TData extends { namespace: string }> {
  table: Table<TData>
  originalData: TData[]
  fetchData: () => Promise<void>;
}

export function DataTableToolbar<TData extends { namespace: string }>({
  table,
  originalData,
  fetchData,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  // console.log('table status', table.getColumn('status'))
  // const namespaces: { value: string; label: string; icon: typeof IconArrowRight }[] = [];

  const apiversions = [...new Set(originalData.map(row => row.version))]
  .map(version => ({
    value: version,
    label: version
  }));

  const groups = [...new Set(originalData.map(row => row.group))]
  .map(group => ({
    value: group,
    label: group
  }));

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
            {table.getColumn('version') && (
            <DataTableFacetedFilter
              column={table.getColumn('version')}
              title='API Version 筛选'
              options={apiversions}
            />
            )}
            {table.getColumn('group') && (
            <DataTableFacetedFilter
              column={table.getColumn('group')}
              title='Group 筛选'
              options={groups}
            />
            )}
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
      {/* <DataTableViewOptions table={table} /> */}
      <TasksPrimaryButtons fetchData={fetchData} />
    </div>
  )
}

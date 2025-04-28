import { DataTable, DataTableProps } from './data-table'
// import { Node } from '../data/schema'

export function NodesTable({
  columns,
  data,
  fetchData,
}: DataTableProps<TData, TValue>) {
  // const { loading, error } = useNodes()

  // if (loading) return <div>加载中...</div>
  // if (error) return <div>错误: {error}</div>

  return <DataTable columns={columns} data={data} fetchData={fetchData} />;
}
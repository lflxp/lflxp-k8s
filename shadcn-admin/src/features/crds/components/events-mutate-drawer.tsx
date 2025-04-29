import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer"
import { DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect } from 'react'
import * as React from 'react'
import { SheetDemo } from "./detail"
import { Input } from "@/components/ui/input"

interface CRDDrawerProps<TData>  {
  open: boolean
  onOpenChange: () => void
  CRDName?: string
  // columns: ColumnDef<TData, TValue>[]
  data: TData[]
  fetchData: () => Promise<void>
}

export function CRDDetail<TData>({ 
  open, 
  onOpenChange, 
  CRDName,
  // columns,
  data,
  fetchData
}: CRDDrawerProps<TData>) {
  useEffect(() => {
    fetchData();
  }, []);

  const [filterText, setFilterText] = React.useState("");

  const filteredData = React.useMemo(() => {
    if (!filterText) return data;
    return data.filter((item) =>
      item.metadata.name.toLowerCase().includes(filterText.toLowerCase()) ||
      (item.metadata.namespace && item.metadata.namespace.toLowerCase().includes(filterText.toLowerCase()))
    );
  }, [filterText, data]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-4">
        <DialogTitle className="flex justify-center items-center mb-5">
          {CRDName} 节点详情
        <DrawerClose className="absolute top-2 right-4">
            <span className="flex items-center justify-center w-6 h-6 cursor-pointer hover:scale-110 hover:font-bold transition-transform">
            ✕
            </span>
        </DrawerClose>
        </DialogTitle>
        
        <div className="h-[80vh] space-y-4 h-max-[450px] w-full overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white pb-2">
            <Input onChange={handleFilterChange} placeholder="搜索Name or Namespace" />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px] text-gray-600 font-medium">Name</TableHead>
                  <TableHead className="text-gray-600 font-medium">Kind</TableHead>
                  <TableHead className="text-gray-600 font-medium">Namespace</TableHead>
                  <TableHead className="text-right text-gray-600 font-medium">Creation Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((invoice) => (
                  <TableRow key={invoice.metadata.uid} className="hover:bg-gray-100 transition-colors">
                    <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer">
                      {SheetDemo(invoice, invoice.metadata.name)}
                    </TableCell>
                    <TableCell className="text-gray-700">{invoice.kind}</TableCell>
                    <TableCell className="text-gray-700">{invoice.metadata.namespace || 'N/A'}</TableCell>
                    <TableCell className="text-right text-gray-700">{new Date(invoice.metadata.creationTimestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="font-semibold text-gray-700">总计</TableCell>
                  <TableCell className="text-right font-semibold text-gray-700">{filteredData.length}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          {/* <DataTablePagination table={table} /> */}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
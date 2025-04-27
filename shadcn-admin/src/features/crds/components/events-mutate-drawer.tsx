import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer"
import { DialogTitle } from "@/components/ui/dialog";
import { useCRDs } from '../context/context'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import request from '@/api/request'; 
import { toast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'
import { SheetDemo } from "./detail"

interface CRDDrawerProps {
  open: boolean
  onOpenChange: () => void
  CRDName?: string
}

export function CRDDetail({ 
  open, 
  onOpenChange, 
  CRDName
}: CRDDrawerProps) {
  const { currentRow } = useCRDs()
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      console.log('请求接口参数:', currentRow);
      const response = await request.post('/api/gvr/list', {
        resource: currentRow?.name,
        group: currentRow?.version === undefined ? "" : currentRow?.group,
        version: currentRow?.version === undefined ? currentRow?.group : currentRow?.version,
        namespace: "",
      });
      console.log('请求接口成功:', response.data.items);
      setData(response.data.items || []);
    } catch (error) {
      toast({
        title: '请求接口出错',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>
              {JSON.stringify(error, null, 2)}
            </code>
          </pre>
        ),
      })
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full mt-0">
        <DialogTitle className="flex justify-center items-center mb-5">
          {CRDName} 节点详情
        <DrawerClose className="absolute top-2 right-4">
            <span className="flex items-center justify-center w-6 h-6 cursor-pointer hover:scale-110 hover:font-bold transition-transform">
            ✕
            </span>
        </DrawerClose>
        </DialogTitle>
        
        <div className="w-full h-full overflow-y-auto p-4 bg-gray-50 rounded-lg shadow-md">
          <Table className="min-w-full border border-gray-200">
            <TableCaption className="text-lg font-semibold text-gray-700">{currentRow.kind}</TableCaption>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[150px] text-gray-600 font-medium">Name</TableHead>
                <TableHead className="text-gray-600 font-medium">Kind</TableHead>
                <TableHead className="text-gray-600 font-medium">Namespace</TableHead>
                <TableHead className="text-right text-gray-600 font-medium">Creation Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((invoice) => (
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
            <TableFooter className="bg-gray-100">
              <TableRow>
                <TableCell colSpan={3} className="font-semibold text-gray-700">Total</TableCell>
                <TableCell className="text-right font-semibold text-gray-700">{data.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
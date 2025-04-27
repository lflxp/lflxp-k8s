import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer"
import { DialogTitle } from "@/components/ui/dialog";
import JsonView from 'react-json-view'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEvents } from '../context/context'

interface EventDrawerProps {
  open: boolean
  onOpenChange: () => void
  EventName?: string
}

export function EventDetail({ 
  open, 
  onOpenChange, 
  EventName
}: EventDrawerProps) {
  const { currentRow } = useEvents()
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full mt-0">
        <DialogTitle className="flex justify-center items-center mb-5">
          {EventName} 节点详情
            <DrawerClose className="absolute top-2 right-4">
                <span className="flex items-center justify-center w-6 h-6 cursor-pointer hover:scale-110 hover:font-bold transition-transform">
                ✕
                </span>
            </DrawerClose>
        </DialogTitle>
        
        <div className="w-full h-full">
          <Card>
                <CardHeader>
                  <CardTitle>原始JSON</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-start mb-4">
                    <JsonView 
                      src={currentRow || {}} 
                      enableClipboard={true}
                      displayDataTypes={false}
                      name={false}
                    />
                  </div>
                </CardContent>
              </Card>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
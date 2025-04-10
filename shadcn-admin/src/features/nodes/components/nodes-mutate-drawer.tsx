import { Node } from '../data/schema'
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { DialogTitle } from "@/components/ui/dialog";
import { Labels, Annotations } from "./basic/labels";
import { Images } from "./basic/images";
import { Nodes } from "./basic/nodes";
import { Conditions } from "./basic/conditions";
import JsonView from 'react-json-view'
import { Taints } from "./basic/taints";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Capacity } from './basic/capacity';
import {
  Card,
  CardContent,
} from "@/components/ui/card"

interface NodeDrawerProps {
  open: boolean
  onOpenChange: () => void
  nodeName?: string
  currentRow?: Node | null
}

export function NodeDetail({ 
  open, 
  onOpenChange, 
  nodeName,
  currentRow
}: NodeDrawerProps) {

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80vh] mt-0">
        <DialogTitle className="flex justify-center items-center mb-5">{nodeName} 节点详情</DialogTitle>
        <div className="w-full h-full">
          <Tabs defaultValue="nodeinfo" className="w-full">
            <TabsList className="grid w-full grid-cols-8 gap-2">
              <TabsTrigger value="nodeinfo">
                节点信息
                <Avatar className="h-5 w-5 ml-1">
                  <AvatarFallback className="text-xs">
                    {currentRow?.status?.nodeInfo ? Object.keys(currentRow.status?.nodeInfo).length : 0}
                  </AvatarFallback>
                </Avatar>
              </TabsTrigger>
              <TabsTrigger value="capacity">
                容量
                <Avatar className="h-5 w-5 ml-1">
                  <AvatarFallback className="text-xs">
                    {currentRow?.status?.capacity ? Object.keys(currentRow.status?.capacity).length : 0}
                  </AvatarFallback>
                </Avatar>
              </TabsTrigger>
              <TabsTrigger value="labels">
                标签
                <Avatar className="h-5 w-5 ml-1">
                  <AvatarFallback className="text-xs">
                    {currentRow?.metadata?.labels ? Object.keys(currentRow.metadata.labels).length : 0}
                  </AvatarFallback>
                </Avatar>
              </TabsTrigger>
              <TabsTrigger value="annotations">
                注释
                <Avatar className="h-5 w-5 ml-1">
                  <AvatarFallback className="text-xs">
                    {currentRow?.metadata?.annotations ? Object.keys(currentRow.metadata.annotations).length : 0}
                  </AvatarFallback>
                </Avatar>  
              </TabsTrigger>
              <TabsTrigger value="conditions">
                告警
                <Avatar className="h-5 w-5 ml-1">
                  <AvatarFallback className="text-xs">
                    {currentRow?.status?.conditions ? Object.keys(currentRow.status?.conditions).length : 0}
                  </AvatarFallback>
                </Avatar>
              </TabsTrigger>
              <TabsTrigger value='taints'>
                污点
                <Avatar className="h-5 w-5 ml-1">
                  <AvatarFallback className="text-xs">
                    {currentRow?.spec?.taints ? Object.keys(currentRow.spec?.taints).length : 0}
                  </AvatarFallback>
                </Avatar>
              </TabsTrigger>
              <TabsTrigger value="images">
                镜像
                <Avatar className="h-5 w-5 ml-1">
                  <AvatarFallback className="text-xs">
                    {currentRow?.status?.images ? Object.keys(currentRow.status?.images).length : 0}
                  </AvatarFallback>
                </Avatar>  
              </TabsTrigger>
              <TabsTrigger value='rawdata'>
                原始JSON
              </TabsTrigger>
            </TabsList>
            <TabsContent value="nodeinfo" className="h-[80vh] overflow-y-auto">
              <Nodes currentRow={currentRow} />
            </TabsContent>
            <TabsContent value="capacity" className="h-[80vh] overflow-y-auto">
              <Capacity currentRow={currentRow} />
            </TabsContent>
            <TabsContent value="labels" className="h-[80vh] overflow-y-auto">
              <Labels currentRow={currentRow} />
            </TabsContent>
            <TabsContent value="annotations" className="h-[80vh] overflow-y-auto">
              <Annotations currentRow={currentRow} />
            </TabsContent>
            <TabsContent value="images" className="h-[80vh] overflow-y-auto">
              <Images currentRow={currentRow} />
            </TabsContent>
            <TabsContent value="conditions" className="h-[80vh] overflow-y-auto">
              <Conditions currentRow={currentRow} />
            </TabsContent>
            <TabsContent value="taints" className="h-[80vh] overflow-y-auto">
              <Taints currentRow={currentRow} />
            </TabsContent>
            <TabsContent value="rawdata" className="h-[80vh] overflow-y-auto">
              <Card>
                {/* <CardHeader>
                  <CardTitle>原始JSON</CardTitle>
                </CardHeader> */}
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
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
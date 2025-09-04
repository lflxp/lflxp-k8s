import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import ReactJsonView from 'react-json-view'

export function SheetDemo(data: TData[], name: string) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-blue-400 hover:text-green-600"
        >
          {name}
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className="bg-white h-[70vh] w-full"
      >
        <DrawerHeader>
          <DrawerTitle>{name}</DrawerTitle>
        </DrawerHeader>
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <ReactJsonView src={data} />
          </div>
        <DrawerFooter>
          <DrawerClose asChild>
        <Button type="button">关闭</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

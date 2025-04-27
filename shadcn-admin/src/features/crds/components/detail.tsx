import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SheetDemo(data: TData[], name: string) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link">{name}</Button>
      </SheetTrigger>
      <SheetContent className="w-[45%] sm:max-w-[425px]">
      <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
      </SheetHeader>
      <div className="h-full">
          <div className="items-center h-full w-full">
          <Textarea
          className="h-full w-full"
          placeholder="Type your message here."
          value={JSON.stringify(data, null, 2)}
          readOnly
          />
          </div>
      </div>
      <SheetFooter>
          <SheetClose asChild>
          <Button type="submit">关闭</Button>
          </SheetClose>
      </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

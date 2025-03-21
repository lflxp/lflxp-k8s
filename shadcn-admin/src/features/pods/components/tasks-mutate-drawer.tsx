import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { 
  Card,
} from '@/components/ui/card'
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

import { SelectDropdown } from '@/components/select-dropdown'
import { Pod } from '../data/schema'
import { CCComponent } from '../data/data'
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { SectionCards } from './cards'
import { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Pod
}

const podSchema = z.object({
  id: z.number(),
  hostip: z.string(),
  name: z.string(),
  namespace: z.string(),
  podip: z.string(),
  restart: z.number(),
  status: z.string(),
  createtime: z.string(),
  containerStatuses: z.array(z.object({
    name: z.string(),
    state: z.object({
      running: z.object({
        startedAt: z.string().optional()
      }).optional(),
      waiting: z.object({
        reason: z.string().optional(),
        message: z.string().optional()
      }).optional(),
      terminated: z.object({
        exitCode: z.number(),
        reason: z.string().optional(),
        message: z.string().optional(),
        finishedAt: z.string().optional()
      }).optional()
    }).optional(),
    ready: z.boolean(),
    restartCount: z.number(),
    image: z.string(),
    imageID: z.string(),
    containerID: z.string().optional()
  })).optional()
});

type PodsForm = z.infer<typeof podSchema>

export function TasksMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow

  const form = useForm<PodsForm>({
    resolver: zodResolver(podSchema),
    defaultValues: currentRow ?? {
      id: 0,
      hostip: '',
      name: '',
      namespace: '',
      podip: '',
      restart: 0,
      status: '',
      createtime: '',
      containerStatuses: []
    },
  })

  const onSubmit = (data: PodsForm) => {
    // do something with the form data
    onOpenChange(false)
    form.reset()
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-left'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Task</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the task by providing necessary info.'
              : 'Add a new task by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='tasks-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-5'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a title' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Status</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select dropdown'
                    items={[
                      { label: 'Running', value: 'Running' },
                      { label: 'Succeeded', value: 'Succeeded' },
                      { label: 'Unknown', value: 'Unknown' },
                      { label: 'Failed', value: 'Failed' },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='namespace'
              render={({ field }) => (
                <FormItem className='relative space-y-3'>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col space-y-1'
                    >
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='documentation' />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          Documentation
                        </FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='feature' />
                        </FormControl>
                        <FormLabel className='font-normal'>Feature</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='bug' />
                        </FormControl>
                        <FormLabel className='font-normal'>Bug</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='namespace'
              render={({ field }) => (
                <FormItem className='relative space-y-3'>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col space-y-1'
                    >
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='high' />
                        </FormControl>
                        <FormLabel className='font-normal'>High</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='medium' />
                        </FormControl>
                        <FormLabel className='font-normal'>Medium</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='low' />
                        </FormControl>
                        <FormLabel className='font-normal'>Low</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='tasks-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

interface PodTerminalDrawerProps {
  open: boolean
  onOpenChange: () => void
  podName?: string
  namespace?: string
  containerName?: string
}

export function PodTerminalDrawer({ 
  open, 
  onOpenChange, 
  podName,
  namespace,
  containerName,
}: PodTerminalDrawerProps) {
  const terminalUrl = `/ws/logs/html/${namespace}/${podName}/${containerName}`

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80vh]">
        {/* <DrawerHeader>
          <DrawerTitle>Terminal: {namespace}/{podName}:{containerName}</DrawerTitle>
        </DrawerHeader> */}
        <div className="w-full h-full">
          <iframe 
            src={terminalUrl}
            className="w-full h-full rounded-md border"
            style={{ minHeight: "500px" }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function PodSSHDrawer({ 
  open, 
  onOpenChange, 
  podName,
  namespace,
  containerName,
}: PodTerminalDrawerProps) {
  const terminalUrl = `/ws/ssh/html/${namespace}/${podName}/${containerName}`

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80vh]">
        {/* <DrawerHeader>
          <DrawerTitle>Terminal: {namespace}/{podName}:{containerName}</DrawerTitle>
        </DrawerHeader> */}
        <div className="w-full h-full">
          <iframe 
            src={terminalUrl}
            className="w-full h-full rounded-md"
            style={{ minHeight: "500px" }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function PodDetailDrawer({ 
  open, 
  onOpenChange, 
  currentRow 
}: Props) {
  const statusRows = useMemo(() => {
    if (!currentRow ||!currentRow.raw ||!currentRow.raw.status) return [];
    return Object.entries(currentRow.raw.status).map(([key, value]) => (
        <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{JSON.stringify(value)}</TableCell>
        </TableRow>
    ));
  }, [currentRow]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTitle>Pod Detail</DrawerTitle>
      <DrawerContent>
        <div className="h-[80vh] grid grid-cols-4 gap-2">
          <div className="rounded-md">
            <Card className="h-full border rounded-md overflow-y-auto">
              <CCComponent />
            </Card>
          </div>
          <div className="rounded-md">
            <SectionCards/>
          </div>
          <div className="rounded-md h-full overflow-y-auto **overflow-x-auto**">
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">属性</TableHead>
                  <TableHead className="w-[auto]">值</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRow && currentRow.raw.spec.containers.map((container, index) => (
                  // 遍历 containers 数组
                  Object.entries(container).map(([key, value]) => (
                    // 遍历每个 container 对象的键值对
                    <TableRow key={`${index}-${key}`}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="max-w-[300px] truncate">
                                {JSON.stringify(value)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[400px] whitespace-pre-wrap">
                              {JSON.stringify(value)}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                ))}
              </TableBody>
            </Table> 
          </div> 
          <div className="rounded-md h-full overflow-y-auto">
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">属性</TableHead>
                  <TableHead>值</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRow && Object.entries(currentRow.raw.metadata).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell>{JSON.stringify(value)}</TableCell>
                  </TableRow>
                ))}
                {statusRows} 
                {currentRow && Object.entries(currentRow.raw.spec).map(([key, value]) => (
                  key !== 'containers' && (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>{JSON.stringify(value)}</TableCell>
                    </TableRow>
                  )
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
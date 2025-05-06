import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pod } from '../../data/schema'
import { useState, useEffect } from 'react';
import request from '@/api/request';
import { toast } from '@/hooks/use-toast'
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export interface RawDataProps {
  currentRow?: Pod
}

export default function Event({
  currentRow
}: RawDataProps) {
  const [eventsData, setEventsData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await request.post('/api/gvr/list', {
        group: "",
        version: "v1",
        resource: "events",
        listoptions: {
          fieldSelector: `involvedObject.name=${currentRow?.raw?.metadata?.name},involvedObject.namespace=${currentRow?.raw?.metadata?.namespace}`,
          limit: 1000,
          sortBy: 'lastTimestamp',
          sortOrder: 'desc',
        }
      });
      // console.log('请求接口成功:', response.data.items)
      setEventsData(response.data.items);
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

  const calculateTimeDifference = (startTime: number) => {
    const endTime = Date.now();
    const diff = endTime - startTime;
  
    const DAY_IN_MS = 24 * 3600 * 1000;
    const HOUR_IN_MS = 3600 * 1000;
    const MINUTE_IN_MS = 60 * 1000;
  
    const days = Math.floor(diff / DAY_IN_MS);
    const remainingAfterDays = diff % DAY_IN_MS;
    const hours = Math.floor(remainingAfterDays / HOUR_IN_MS);
    const remainingAfterHours = remainingAfterDays % HOUR_IN_MS;
    const minutes = Math.floor(remainingAfterHours / MINUTE_IN_MS);
    const remainingAfterMinutes = remainingAfterHours % MINUTE_IN_MS;
    const seconds = Math.round(remainingAfterMinutes / 1000);
  
    return { days, hours, minutes, seconds };
  };
  
  const createTimeString = (days: number, hours: number, minutes: number, seconds: number) => {
    let timeString = '';
    if (days > 0) {
      timeString += `${days}d `;
    }
    if (hours > 0) {
      timeString += `${hours}h `;
    }
    if (minutes > 0) {
      timeString += `${minutes}m `;
    }
    if (seconds > 0) {
      timeString += `${seconds}s`;
    }
    return timeString;
  };

  const formatTime = (time: string) => {
    const startTime = new Date(time).getTime();
    const { days, hours, minutes, seconds } = calculateTimeDifference(startTime);
    return createTimeString(days, hours, minutes, seconds);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      { eventsData.length > 0 && 
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{eventsData[0].involvedObject.name}</CardTitle>
              <CardDescription>
                命名空间：{eventsData[0].involvedObject.namespace}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新
            </Button>
          </div>
        </CardHeader>
      }
      <CardContent className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[100px]">Namespace</TableHead> */}
              <TableHead className="w-[40px]">Kind</TableHead>
              <TableHead className="w-[100px]">Reason</TableHead>
              <TableHead className="w-[500px]">Message</TableHead>
              <TableHead className="w-[80px]">Source</TableHead>
              <TableHead className="w-[80px]">Type</TableHead>
              <TableHead className="w-[80px]">Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              eventsData.length > 0 && eventsData.map((event, index) => (
                <TableRow key={index}>
                  {/* <TableCell className="max-w-[200px] truncate" title={event.involvedObject.name}>
                    {event.involvedObject.name}
                  </TableCell>
                  <TableCell>{event.involvedObject.namespace}</TableCell> */}
                  <TableCell>{event.involvedObject.kind}</TableCell>
                  <TableCell>{event.reason}</TableCell>
                  <TableCell className="whitespace-pre-wrap break-all max-w-[300px]">
                    {event.message}
                  </TableCell>
                  <TableCell>{event.source.component}</TableCell>
                  <TableCell>{event.type}</TableCell>
                  <TableCell>
                    <div className='w-fit'>
                      {formatTime(event.lastTimestamp)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

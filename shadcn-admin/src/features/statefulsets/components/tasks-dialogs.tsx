import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useTasks } from '../context/tasks-context'
import { TasksImportDialog } from './tasks-import-dialog'
import { TasksMutateDrawer, PodTerminalDrawer, PodSSHDrawer } from './tasks-mutate-drawer'
import { PodDetailDrawer } from './pods-detail'

interface TD {
  fetchData: () => void
}

export function TasksDialogs({
  fetchData,
}: TD) {
  const { open, setOpen, currentRow, setCurrentRow, containerName, setContainerName } = useTasks()

  const handleUpdate = () => {
    try {
      if (!currentRow?.namespace || !currentRow?.name) {
        toast({
          title: "更新失败",
          description: "缺少必要的Pod信息",
          variant: "destructive",
        });
        return;
      }

      const updatedData = {
        group: "apps",
        version: "v1",
        resource: "statefulsets",
        namespace: currentRow?.namespace,
        name: currentRow?.name
      };
      
      fetch('/api/gvr', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('刪除失败');
        }
        return response.json();
      })
      .then(_data => {
        fetchData();
        toast({
          title: "刪除成功",
          description: `StatefulSet ${currentRow?.name}已刪除`,
        });
      })
      .catch(_error => {
        toast({
          title: "刪除失败",
          description: "请检查网络连接或联系管理员",
          variant: "destructive",
        });
      });
    } catch (_error) {
      toast({
        title: "JSON格式错误",
        description: "请检查JSON格式是否正确",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <TasksMutateDrawer
        key='task-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <TasksImportDialog
        key='tasks-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`task-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <PodTerminalDrawer
            key={`pod-terminal-${currentRow.name}`}
            open={open === 'terminal'}
            onOpenChange={() => {
              setOpen(null)
              setContainerName(undefined)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            podName={currentRow.name}
            namespace={currentRow.namespace}
            containerName={containerName}
          />

          <PodDetailDrawer
            key={`pod-detail-${currentRow.name}`}
            open={open === 'detail'}
            onOpenChange={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <PodSSHDrawer
            key={`pod-ssh-${currentRow.name}`}
            open={open === 'ssh'}
            onOpenChange={() => {
              setOpen(null)
              setContainerName(undefined)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            podName={currentRow.name}
            namespace={currentRow.namespace}
            containerName={containerName}
          />

          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              handleUpdate()
            }}
            name={currentRow.name}
            namespace={currentRow.namespace}
            className='max-w-md'
            title={`Delete StatefulSet: ${currentRow.namespace}/${currentRow.name} ?`}
            desc={
              <>
                You are about to delete a StatefulSet with the Name{' '}
                <strong>{currentRow.namespace}/{currentRow.name}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}

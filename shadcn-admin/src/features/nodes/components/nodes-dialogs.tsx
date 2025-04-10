import { useNodes } from '../context/nodes-context'
import { NodeDetail } from './nodes-mutate-drawer'

export function NodesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, setNodeName } = useNodes()

  return (
    <>
      {currentRow && (<NodeDetail
        key='node-detail'
        open={open === 'detail'}
        onOpenChange={() => {
          setOpen(null)
          setNodeName(undefined)
          setTimeout(() => {
            setCurrentRow(null)
          }, 500)
        }}
        nodeName={currentRow?.metadata.name}
        currentRow={currentRow}
      />)}
    </>
  )
}

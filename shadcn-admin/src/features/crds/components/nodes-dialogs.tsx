import { useCRDs } from '../context/context'
import { CRDDetail } from './events-mutate-drawer'

export function CRDsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, setCRDName } = useCRDs()

  return (
    <>
      {currentRow && (<CRDDetail
        key='CRD-detail'
        open={open === 'detail'}
        onOpenChange={() => {
          setOpen(null)
          setCRDName(undefined)
          setTimeout(() => {
            setCurrentRow(null)
          }, 500)
        }}
        CRDName={currentRow?.name}
      />)}
    </>
  )
}

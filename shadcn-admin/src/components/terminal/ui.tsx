import { Card, CardContent } from '../ui/card'
import UI from './components/main'
import { TerminalProvider } from './context/terminal-context'

export default function TerminalUI() {
  return (
    <TerminalProvider>
      <Card className="m-0 p-0 border-none shadow-none">
        <CardContent className="p-1">
          <UI />
        </CardContent>
      </Card>
    </TerminalProvider>
  )
}
import { ValidationError } from '@/types/predictions'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ValidationResultsProps {
  errors: ValidationError[]
  isValid: boolean
  isChecking: boolean
}

export function ValidationResults({ errors, isValid, isChecking }: ValidationResultsProps) {
  if (isChecking) return null
  
  if (isValid && errors.length === 0) {
    return (
      <Alert className="border-accent/50 bg-accent/10 text-accent">
        <CheckCircle2 className="h-4 w-4 text-accent" />
        <AlertTitle>Validation Passed!</AlertTitle>
        <AlertDescription>
          Your CSV file is formatted correctly and ready for submission.
        </AlertDescription>
      </Alert>
    )
  }

  if (errors.length > 0) {
    return (
      <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertTitle>Validation Failed</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-2 font-medium">Found {errors.length} errors in your file:</p>
          <ScrollArea className="h-40 rounded-md border border-destructive/20 bg-background/50 p-4">
            <ul className="space-y-2 text-sm">
              {errors.map((err, idx) => (
                <li key={idx} className="flex gap-2 text-destructive/90">
                  <span className="font-mono bg-destructive/20 px-1 rounded text-xs py-0.5 mt-0.5 h-fit whitespace-nowrap">
                    Row {err.row}
                  </span>
                  <div>
                    <span className="font-semibold">{err.column}:</span> {err.message}
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}

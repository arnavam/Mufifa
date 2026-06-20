import { RegisterForm } from '@/components/auth/register-form'
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: "Register | µFifa '26",
  description: 'Create an account for the ML Prediction Challenge',
}

export default function RegisterPage() {
  const isClosed = process.env.NEXT_PUBLIC_REGISTRATIONS_CLOSED === 'true'

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
            µFifa &apos;26
          </h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">
            Prediction Challenge
          </p>
        </div>
        
        {isClosed ? (
          <div className="glass-panel p-8 text-center space-y-4 rounded-xl">
            <h2 className="text-xl font-bold text-destructive">Registrations Closed</h2>
            <p className="text-muted-foreground">
              The tournament has officially begun and no new prediction entries are being accepted.
            </p>
            <div className="pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          </div>
        ) : (
          <RegisterForm />
        )}
      </div>
    </div>
  )
}

import { RegisterForm } from '@/components/auth/register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Register | µFifa '26",
  description: 'Create an account for the ML Prediction Challenge',
}

export default function RegisterPage() {
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
        <RegisterForm />
      </div>
    </div>
  )
}

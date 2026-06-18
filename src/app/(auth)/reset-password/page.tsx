'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState, useTransition } from 'react'
import { resetPassword } from '@/actions/auth'
import { toast } from 'sonner'
import Link from 'next/link'

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const resetSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
})

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  })

  function onSubmit(values: z.infer<typeof resetSchema>) {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', values.email)
      
      const result = await resetPassword(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        setSuccess(true)
        toast.success("Check your email for reset instructions")
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
            µFifa &apos;26
          </h1>
        </div>
        
        {success ? (
          <Card className="w-full max-w-md mx-auto glass-panel border-accent/20">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight text-accent">Check your email</CardTitle>
              <CardDescription>
                We&apos;ve sent an email to {form.getValues('email')} with instructions to reset your password.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link href="/login" className="w-full">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Return to Login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-w-md mx-auto glass-panel border-accent/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-center neon-text-green">
                Reset Password
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} className="bg-background/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 neon-border-green transition-all" disabled={isPending}>
                    {isPending ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/login" className="text-accent hover:underline font-medium">
                  Back to Login
                </Link>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

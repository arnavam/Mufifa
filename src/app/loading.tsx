export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin neon-box-green"></div>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-accent">
          µ
        </div>
      </div>
      <p className="mt-6 text-muted-foreground font-mono uppercase tracking-widest text-sm animate-pulse">
        Loading Data...
      </p>
    </div>
  )
}

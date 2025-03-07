export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}

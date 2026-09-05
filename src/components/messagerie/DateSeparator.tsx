export function DateSeparator({ label }: { label: string }) {
  return (
    <div className="my-2 flex justify-center">
      <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

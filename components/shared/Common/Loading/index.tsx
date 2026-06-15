const Loading = () => ( <div className="flex  justify-center items-center pt-10">
    <span className="relative flex size-4">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
      <span className="relative inline-flex size-4 rounded-full bg-primary-foreground"></span>
    </span>
  </div>
)

export default Loading;
function Stats() {
return (
    <div className="relative accounts bg-white text-black dark:bg-black dark:text-white">
    <div className="title h-64 w-full flex items-center justify-center">
      <h1 className="text-6xl">Stats</h1>
    </div>

    <div className="absolute m-auto top-0 left-0 right-0 bottom-0 animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full"></div>
  </div>
)
}

export default Stats;
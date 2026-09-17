export default function ProductLoading() {
    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-16 animate-pulse">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                    <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
                        <div className="flex md:flex-col gap-3">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="w-20 h-24 md:w-24 md:h-28 bg-zinc-900 rounded-2xl border border-zinc-800" />
                            ))}
                        </div>
                        <div className="w-full h-[420px] sm:h-[520px] lg:h-[650px] bg-zinc-900 rounded-3xl border border-zinc-800" />
                    </div>

                    <div className="lg:col-span-5 flex flex-col space-y-8">
                        <div className="space-y-4">
                            <div className="w-32 h-6 bg-zinc-900 rounded-full" />
                            <div className="w-full h-12 bg-zinc-900 rounded-xl" />
                            <div className="w-36 h-8 bg-zinc-900 rounded-xl" />
                        </div>
                        <div className="border-t border-b border-zinc-800 py-6 space-y-3">
                            <div className="w-full h-4 bg-zinc-900 rounded" />
                            <div className="w-full h-4 bg-zinc-900 rounded" />
                            <div className="w-2/3 h-4 bg-zinc-900 rounded" />
                        </div>
                        <div className="w-full h-14 bg-zinc-900 rounded-2xl" />
                        <div className="w-full h-14 bg-zinc-900 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
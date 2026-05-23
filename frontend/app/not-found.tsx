export default function NotFound() {
    return (
        <div className="h-screen px-4 flex items-center justify-center">
            <div className="w-full max-w-3xl grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-4 lg:gap-6 items-center">
            <div className="relative rounded-2xl overflow-hidden">
                <img
                    src="/empty-folder.png"
                    alt="404 Not Found"
                    className="mx-auto w-48 h-48 object-contain"
                />
            </div>
            <div className="text-center lg:text-left">
                <h1 className="text-6xl font-bold mb-4">Page Not Found</h1>
                <p className="text-xl text-gray-600 mb-8">
                    We're sorry, we couldn't find the page you requested..
                </p>
            </div>
            </div>
        </div>
    );
}


import { Link } from "@/lib/router-compat";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-[1280px] mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-7xl font-bold gradient-text">404</h1>
            <h2 className="text-4xl font-bold">Page Not Found</h2>
            <p className="text-lg text-[#C7C4D8] max-w-2xl mx-auto">
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              to="/"
              className="px-8 py-3 rounded-[12px] bg-gradient-indigo-cyan text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Back to Home
            </Link>
            <Link
              to="/tools"
              className="px-8 py-3 rounded-[12px] border border-[#464555] text-[#DAE2FD] font-semibold hover:bg-[rgba(23,31,51,0.40)] transition-colors"
            >
              Go to Tools Page
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}

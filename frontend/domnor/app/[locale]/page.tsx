import Home from "@/components/home/home";
import ErrorBoundary from "@/errorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen overflow-hidden">
        <Home />
      </div>
    </ErrorBoundary>
  );
}

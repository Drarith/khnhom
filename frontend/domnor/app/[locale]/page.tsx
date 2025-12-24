import Home from "@/components/home/home";
import ErrorBoundary from "@/errorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  );
}

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, ShieldAlert } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}


class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log this to your telemetry (Sentry/Datadog) quietly in the background
    console.error("Boundary caught error:", error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface FallbackProps {
  onReset: () => void;
}

const ErrorFallback: React.FC<FallbackProps> = ({ onReset }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-[#1E293B]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-slate-100 text-center relative overflow-hidden">
        
        {/* Subtle decorative accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />

        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-indigo-50 rounded-2xl">
            <ShieldAlert className="w-12 h-12 text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-3">
          Taking a quick break
        </h1>
        
        <p className="text-slate-500 leading-relaxed mb-10">
          We are having a bit of trouble loading. Usually, a quick refresh gets everything back on track.
        </p>

        <div className="space-y-3">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all active:scale-[0.98]"
          >
            <RefreshCw size={20} className="animate-spin-reverse" />
            Refresh Page
          </button>
          
        </div>
      </div>

      {/* Modern minimal background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
    </div>
  );
};

export default ErrorBoundary;
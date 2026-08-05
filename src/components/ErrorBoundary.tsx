import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#050816] px-4 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-red/15 ring-1 ring-accent-red/30">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-xl font-semibold text-white">Something went wrong</h1>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            The application hit an unexpected error. Reloading the page usually fixes it.
          </p>
          {this.state.message && (
            <pre className="mt-4 max-w-md overflow-x-auto rounded-lg bg-white/[0.03] px-3 py-2 text-left text-xs text-slate-500">
              {this.state.message}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-6 py-3 text-sm font-semibold text-white"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

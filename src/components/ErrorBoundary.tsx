import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught Error in RECON 2026 App:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#02180e] text-[#f1f5f9] flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-black/80 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-950/50 animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">
                Application Recovery
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                RECON 2026 encountered a temporary rendering state issue. Click below to refresh and restore full application functionality.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-3 text-[11px] text-red-300 font-mono text-left overflow-x-auto max-h-32">
                {this.state.error.message || 'Unknown runtime exception'}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-black" />
                <span>Reload Website & Restore</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

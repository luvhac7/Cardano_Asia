import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
                    <div className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-lg p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-4 text-red-500">
                            <AlertCircle className="w-8 h-8" />
                            <h1 className="text-xl font-bold">Something went wrong</h1>
                        </div>
                        <div className="bg-black/50 p-4 rounded text-sm font-mono text-red-200 overflow-auto max-h-64 mb-4">
                            {this.state.error?.message}
                        </div>
                        <button
                            className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                            onClick={() => window.location.reload()}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

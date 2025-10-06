"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console for now; in a real app you'd send this to an external error tracker.
    // eslint-disable-next-line no-console
    console.error("Uncaught error in ErrorBoundary:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    // Full reload as a last resort
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children as React.ReactElement;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6 border">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Đã có lỗi xảy ra</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Xin lỗi — một lỗi đã xảy ra khi hiển thị trang này. Bạn có thể thử làm mới hoặc thử lại.
          </p>

          {this.state.error && (
            <details className="mb-4 text-xs text-muted-foreground">
              <summary className="cursor-pointer">Chi tiết lỗi (nhấn để mở)</summary>
              <pre className="whitespace-pre-wrap mt-2 text-xs text-red-600 dark:text-red-400">
                {String(this.state.error && this.state.error.stack ? this.state.error.stack : this.state.error)}
              </pre>
            </details>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={this.handleReset}
              className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Thử lại
            </button>
            <button
              onClick={this.handleReload}
              className="px-3 py-2 rounded bg-orange-500 hover:bg-orange-600 text-sm text-white"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      </div>
    );
  }
}
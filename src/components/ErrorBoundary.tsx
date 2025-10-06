"use client";

import React from "react";

interface State {
  hasError: boolean;
  error?: Error | null;
  info?: string;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null, info: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, info: undefined };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You could send this to remote logging here
    this.setState({ hasError: true, error, info: info.componentStack });
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[40vh] flex items-start justify-center p-6">
          <div className="max-w-3xl w-full bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-md p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-700">Có lỗi xảy ra khi tải trang</h2>
            <p className="text-sm text-muted-foreground mt-2">Ứng dụng gặp sự cố; bạn có thể tải lại trang hoặc gửi lỗi này cho nhóm phát triển.</p>

            <div className="mt-4">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-200">Error message</div>
              <pre className="mt-2 max-h-36 overflow-auto text-xs p-2 bg-gray-50 dark:bg-gray-900 rounded border text-red-700">
                {String(this.state.error?.message || "No message")}
              </pre>

              <div className="mt-3">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-200">Component stack</div>
                <pre className="mt-2 max-h-48 overflow-auto text-xs p-2 bg-gray-50 dark:bg-gray-900 rounded border">{this.state.info || "No stack available"}</pre>
              </div>

              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={this.handleReload}
                  className="px-3 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Tải lại trang
                </button>
                <button
                  onClick={() => {
                    // copy details to clipboard for easy reporting
                    const payload = `Error: ${String(this.state.error?.message || "")}\n\nStack:\n${this.state.info || ""}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(payload).then(() => {
                        // eslint-disable-next-line no-console
                        console.log("Error details copied to clipboard");
                      });
                    }
                  }}
                  className="px-3 py-1 rounded border"
                >
                  Sao chép lỗi
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // You can also log the error to an error reporting service here
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-bg-cream dark:bg-dark-bg text-text-primary dark:text-dark-text">
          <Card className="text-center">
            <h2 className="text-xl font-bold text-burgundy-curtain mb-4">Something went wrong.</h2>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="text-sm text-left text-text-secondary dark:text-dark-text-secondary mt-4 p-2 border border-border-light dark:border-dark-border rounded-md">
                <summary>Error Details</summary>
                <pre className="whitespace-pre-wrap break-words mt-2">
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <Button onClick={() => window.location.reload()} className="mt-6 bg-indigo-deep">
              Refresh Page
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

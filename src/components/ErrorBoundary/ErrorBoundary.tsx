import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContent}>
            <h2>Something went wrong</h2>
            <p>We're sorry for the inconvenience. The error has been logged.</p>
            {process.env.NODE_ENV === 'development' && (
              <details className={styles.errorDetails}>
                <summary>Error details</summary>
                <pre>{this.state.error?.toString()}</pre>
                <div>{this.state.errorInfo?.componentStack}</div>
              </details>
            )}
            <button 
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

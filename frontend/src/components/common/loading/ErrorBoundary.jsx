import React, { Component } from 'react';
import ErrorState from './ErrorState';

/**
 * ErrorBoundary
 * Catches JavaScript errors anywhere in child component trees,
 * logs them, and displays a recovery fallback without blanking the application.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="py-8">
          <ErrorState
            title={this.props.title || 'Something went wrong in this section'}
            message={
              this.state.error?.message ||
              'An unexpected rendering error occurred. You can retry or refresh the page.'
            }
            onRetry={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

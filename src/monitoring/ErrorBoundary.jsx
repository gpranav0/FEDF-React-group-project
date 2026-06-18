import React, { Component } from 'react';
import { logger } from './logger';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Component crash detected in ErrorBoundary', { error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-rose-100 rounded-full text-rose-600">
                <AlertCircle className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
            <p className="text-slate-600 text-sm">
              We encountered an unexpected error. Our team has been notified.
            </p>
            <button 
              onClick={this.handleReload}
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Reload Application
            </button>
            {import.meta.env.DEV && (
               <div className="mt-4 p-3 bg-slate-100 rounded text-left overflow-auto text-xs text-rose-600">
                 {this.state.error?.toString()}
               </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

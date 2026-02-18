import { Component, type ReactNode } from 'react';
import { Button } from '@zunftgewerk/ui';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', {
      error,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="bg-destructive/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
            <span className="text-destructive text-2xl font-bold" aria-hidden="true">
              !
            </span>
          </div>

          <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">
            Etwas ist schiefgelaufen
          </h2>

          <p className="text-muted-foreground mb-8 max-w-md">
            Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
          </p>

          <Button
            onClick={() => this.setState({ hasError: false, error: null })}
            size="lg"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Erneut versuchen
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

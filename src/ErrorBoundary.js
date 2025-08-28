import { Component } from 'react';
import * as Sentry from '@sentry/react';
import { Button, Result } from 'antd';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(err, info) {
    if(process.env.NODE_ENV === 'production'){
      Sentry.captureException(err);
    }
  }

  render() {
    if(this.state.hasError) {
      return (
        <Result
          status="500"
          title="Oops! Something went wrong..."
          subTitle="We've just notified our development team about this issue in order to solve it as soon as possible."
          extra={<Button type="primary" onClick={() => window.location.reload()}>Reload page</Button>}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
import { Component } from 'react';

export default class GtsErrorBoundary extends Component {
  componentDidCatch(error) {
    if (
      error instanceof DOMException &&
      error.message.includes('insertBefore')
    ) {
      window.location.reload();
      return;
    }
    console.error('GtsErrorBoundary caught:', error);
  }

  render() {
    return this.props.children;
  }
}

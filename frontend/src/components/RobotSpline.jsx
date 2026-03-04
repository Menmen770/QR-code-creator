import { Component } from "react";
import Spline from "@splinetool/react-spline";

class SplineErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default function RobotSpline() {
  return (
    <SplineErrorBoundary>
      <div className="robot-spline">
        <Spline scene="https://prod.spline.design/AHHyKEjSk7bONU9P/scene.splinecode" />
      </div>
    </SplineErrorBoundary>
  );
}

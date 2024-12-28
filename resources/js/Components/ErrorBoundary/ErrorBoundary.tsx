import {ErrorInfo, PropsWithChildren} from "react";
import {ErrorBoundary as ErrorBoundaryComponent} from "react-error-boundary"
import ErrorBoundaryInner from "./ErrorBoundaryInner";
import {TDebugInfo} from "./types";

type Props = PropsWithChildren<{
  className?: string
  debugInfo?: TDebugInfo
}>

export default function ErrorBoundary({children, className, debugInfo}: Props) {
  const onError = (error: Error, error_info: ErrorInfo) => {
    console.error(error);
  }

  return <ErrorBoundaryComponent onError={onError} FallbackComponent={(props) => <ErrorBoundaryInner className={className} debugInfo={debugInfo} {...props}/>}>
    {children}
  </ErrorBoundaryComponent>;
}

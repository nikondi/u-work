import {FallbackProps} from "react-error-boundary";

export type ParsedLine = Record<('function'|'file'|'line'|'char'), string> | string
export type TDebugInfo = Partial<{
  componentName: string
  componentStack: string
}>

export type BoundaryInnerProps = {
  className?: string
  debugInfo?: TDebugInfo
} & FallbackProps

export type ErrorData = {
  stack: string
  message: string
  url: string
  debugInfo: TDebugInfo
}

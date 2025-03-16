import 'react'

declare module 'react' {
  export type ReactNode = React.ReactChild | React.ReactFragment | React.ReactPortal | boolean | null | undefined
  export type ReactElement = React.ReactElement<any, any>
  export type KeyboardEvent<T = Element> = React.BaseSyntheticEvent<any, any, any>
  export type HTMLAttributes<T> = React.HTMLAttributes<T>
  export type ButtonHTMLAttributes<T> = React.ButtonHTMLAttributes<T>
  export type ForwardedRef<T> = ((instance: T | null) => void) | React.MutableRefObject<T | null> | null
} 
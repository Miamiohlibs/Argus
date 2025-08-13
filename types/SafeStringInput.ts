export type SafeStringifyInput =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: any };

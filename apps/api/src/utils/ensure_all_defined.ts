function ensureAllDefined<T extends Record<string, any>>(
  obj: T
): obj is { [K in keyof T]-?: NonNullable<T[K]> } {
  return Object.values(obj).every(val => !_.isNil(val));
}

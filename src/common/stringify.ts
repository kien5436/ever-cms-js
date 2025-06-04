import fastSafeStringify from 'fast-safe-stringify';

export default function stringify(...inputs: unknown[]): string {

  return inputs
    .map((item) => {

      if ('string' === typeof item) return item;

      if ('symbol' === typeof item || 'bigint' === typeof item) return item.toString();

      if (item instanceof Error) return item.stack;

      return fastSafeStringify(item, (_, v) => {

        if ('symbol' === typeof v || 'bigint' === typeof v) return v.toString();

        if (v instanceof Error) return v.stack;

        return v as unknown;
      }, 2);
    })
    .join(' ');
}

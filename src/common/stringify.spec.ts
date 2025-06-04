import stringify from './stringify';

describe('stringify', () => {

  it('should handle strings', () => {
    expect(stringify('hello')).toBe('hello');
  });

  it('should handle numbers', () => {
    expect(stringify(1)).toBe('1');
    expect(stringify(0)).toBe('0');
    expect(stringify(-1)).toBe('-1');
    expect(stringify(NaN)).toBe('null');
    expect(stringify(Infinity)).toBe('null');
  });

  it('should handle booleans', () => {
    expect(stringify(true)).toBe('true');
    expect(stringify(false)).toBe('false');
  });

  it('should handle null and undefined', () => {
    expect(stringify(null)).toBe('null');
    expect(stringify(undefined)).toBe('');
  });

  it('should handle symbols', () => {
    const sym = Symbol('test');

    expect(stringify(sym)).toBe(sym.toString());
  });

  it('should handle Errors', () => {
    const error = new Error('test error');

    expect(stringify(error)).toBe(error.stack);
  });

  it('should handle plain objects', () => {
    const obj = { a: 1, b: 'two' };

    expect(stringify(obj)).toBe(JSON.stringify(obj, null, 2));
  });

  it('should handle arrays', () => {
    const arr = [1, 'two', { three: 3 }];

    expect(stringify(arr)).toBe(JSON.stringify(arr, null, 2));
  });

  it('should handle Dates', () => {
    const date = new Date('2023-01-01');

    expect(stringify(date)).toBe(JSON.stringify(date, null, 2));
  });

  it('should handle RegExp', () => {
    const regex = /test/g;

    expect(stringify(regex)).toBe(JSON.stringify(regex, null, 2));
  });

  it('should handle Maps', () => {
    const map = new Map([['a', 1]]);

    expect(stringify(map)).toBe(JSON.stringify(map, null, 2));
  });

  it('should handle Sets', () => {
    const set = new Set([1, 2, 3]);

    expect(stringify(set)).toBe(JSON.stringify(set, null, 2));
  });

  it('should handle circular references', () => {
    const obj: { a: number; self?: unknown } = { a: 1 };

    obj.self = obj;
    const result = stringify(obj);

    expect(result).toContain('"a": 1');
    expect(result).toContain('"self": "[Circular]"');
  });

  it('should handle functions', () => {
    // eslint-disable-next-line no-empty-function
    const fn = () => { };

    expect(stringify(fn)).toBe('');
  });

  it('should handle class instances', () => {
    class TestClass { constructor(public val: number) { } }
    expect(stringify(new TestClass(42))).toBe(JSON.stringify(new TestClass(42), null, 2));
  });

  it('should handle BigInt', () => {
    const big = BigInt(9007199254740992); // max bigint number

    expect(stringify(big)).toBe(big.toString());
  });

  it('should handle mixed types', () => {
    const error = new Error('test error');
    const input = [
      'string',
      42,
      true,
      null,
      undefined,
      Symbol('test'),
      error,
      { a: 1 },
      [1, 2, 3],
    ];
    const expected = [
      'string',
      '42',
      'true',
      'null',
      '',
      'Symbol(test)',
      error.stack,
      JSON.stringify({ a: 1 }, null, 2),
      JSON.stringify([1, 2, 3], null, 2),
    ].join(' ');

    expect(stringify(...input)).toBe(expected);
  });

  it('should handle empty input', () => {
    expect(stringify()).toBe('');
  });

  it('should handle very long strings without truncation or errors', () => {
    // 10KB string (much larger than typical use cases)
    const longString = 'A'.repeat(10 * 1024);
    const result = stringify(longString);

    expect(result).toBe(longString);
    expect(result.length).toBe(10 * 1024);
  });

  it('should handle special characters in strings', () => {
    const specialChars = [
      '👽 Unicode emoji',
      'Line\nbreaks\tand\ttabs',
      'Escaped quotes: "\'',
      '\\Backslashes\\',
      'Null byte: \0',
      'Text with 中文 русский ελληνικά',
      '~!@#$%^&*()_+`-=[]{}|;:\',./<>?',
    ];

    specialChars.forEach((input) => {
      expect(stringify(input)).toBe(input);
    });
  });
});

const sum = (a: number, b: number) => a + b;

test('add 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toEqual(3);
});

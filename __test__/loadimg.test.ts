import loadImage from '../src/utils/loadimage';

let testUrl = '';

test('Test loadImage function', async () => {
  expect.assertions(1);
  jest.setTimeout(6000)

  try {
    const imgTag: HTMLImageElement = await loadImage(testUrl);
    expect(imgTag.tagName).toEqual('IMG');
  } catch (error) {
    expect(error.message).toBe('time out');
  }
});

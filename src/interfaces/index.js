export async function init() {
  const time = {
    Date,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
  };

  return {
    time,
    fetch: fetch.bind(globalThis),
  };
}

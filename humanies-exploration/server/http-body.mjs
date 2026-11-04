/** Bound streamed upstream bodies, including when Content-Length is absent. */
export async function readLimitedBody(response, maxBytes = 2_000_000) {
  if (Number(response.headers.get('Content-Length')) > maxBytes || !response.body) throw new Error('Invalid upstream body size');
  const reader = response.body.getReader();
  const chunks = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) throw new Error('Upstream body too large');
      chunks.push(value);
    }
  } finally { await reader.cancel().catch(() => {}); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}

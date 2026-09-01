SLUDGEQUEST LIVE FULLSTACK v8.1

Fixes Cloudflare build error in v8:
- Removed nested browser-side JavaScript template literals that broke the outer INDEX_HTML template literal.
- Cloudflare error was: Expected ";" but found "$" in worker.js around battleRecord.

Deploy exactly like before:
1. Replace worker.js in GitHub.
2. Commit to main.
3. Cloudflare should auto-build/deploy.

The v8 Plant vs. Plant features remain included.

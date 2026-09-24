#!/usr/bin/env python3
"""Serve _site/ for local preview, with caching switched off.

Why not plain `python3 -m http.server`: it sends Last-Modified, so the browser
caches pages on http://localhost:<port>. That origin has served several different
trees over this project's life (the repo root, then _site/), and the paths
overlap — /skills/ used to be a redirect stub and is now a real page. A browser
holding the old stub serves it from cache without touching the network, and the
stub bounces to /?page=skills, which resolves back to /skills/: an unbreakable
redirect loop that no rebuild can clear. `Cache-Control: no-store` means a
preview always shows what was just built.
"""

import http.server
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
DIRECTORY = sys.argv[2] if len(sys.argv) > 2 else '_site'


class NoStoreHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, max-age=0')
        super().end_headers()


if __name__ == '__main__':
    http.server.test(HandlerClass=NoStoreHandler, port=PORT, bind='')

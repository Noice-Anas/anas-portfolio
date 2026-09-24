#!/usr/bin/env python3
"""Serve _site/ for local preview, always revalidating with the server.

Why not plain `python3 -m http.server`: it sends Last-Modified with no
Cache-Control, so the browser caches pages on http://localhost:<port>
heuristically and serves them without asking. That origin has served several
different trees over this project's life (the repo root, then _site/), and the
paths overlap: /skills/ used to be a redirect stub and is now a real page. A
browser holding the old stub serves it from cache without touching the network,
and the stub bounces to /?page=skills, which resolves back to /skills/: an
unbreakable redirect loop that no rebuild can clear.

`Cache-Control: no-cache` closes that: the browser may keep a copy but must ask
first on every use, and SimpleHTTPRequestHandler answers If-Modified-Since
against the file's mtime, so a fresh build always wins (200) and an unchanged
file is a cheap 304. It used to be `no-store`, which also kept that guarantee
but made every tab click re-download every font and image (text reflowing and
thumbnails popping in, which production never does) and kept pages out of the
back/forward cache.
"""

import http.server
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
DIRECTORY = sys.argv[2] if len(sys.argv) > 2 else '_site'


class RevalidateHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


if __name__ == '__main__':
    http.server.test(HandlerClass=RevalidateHandler, port=PORT, bind='')

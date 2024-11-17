from http.server import SimpleHTTPRequestHandler, HTTPServer
import os

class BrotliHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")

        # If serving Brotli-compressed files, set the appropriate header
        if self.path.endswith(".br"):
            self.send_header("Content-Encoding", "br")
            # Strip '.br' extension for serving the file
            self.path = self.path[:-3]
        super().end_headers()

    def do_GET(self):
        # Serve Brotli file if it exists
        if os.path.exists(self.path[1:] + ".br"):
            self.path += ".br"
        super().do_GET()

# Set the server to listen on port 8000
PORT = 8000
httpd = HTTPServer(('localhost', PORT), BrotliHTTPRequestHandler)
print(f"Serving on port {PORT}")
httpd.serve_forever()

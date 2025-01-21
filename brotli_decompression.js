// Brotli decompression script for Unity WebGL
(function() {
    const BrotliDecoder = typeof BrotliDecode === "undefined" ? self.BrotliDecode : BrotliDecode;

    function decompress(input) {
        if (BrotliDecoder) {
            return BrotliDecoder(input);
        } else {
            console.error("BrotliDecode is not available in this environment.");
            return null;
        }
    }

    // Hook into UnityLoader to decompress files
    const originalFetch = self.fetch;

    self.fetch = async function(resource, init) {
        if (resource.endsWith(".br")) {
            // Fetch the Brotli-compressed resource
            const response = await originalFetch(resource, init);
            const buffer = await response.arrayBuffer();

            // Decompress the Brotli file
            const decompressedBuffer = decompress(new Uint8Array(buffer));
            if (!decompressedBuffer) {
                throw new Error(`Failed to decompress Brotli file: ${resource}`);
            }

            return new Response(decompressedBuffer, {
                status: 200,
                statusText: "OK",
                headers: response.headers,
            });
        } else {
            return originalFetch(resource, init);
        }
    };

    console.log("Custom Brotli decompression script initialized.");
})();

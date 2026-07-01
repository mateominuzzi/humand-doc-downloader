// Vercel Serverless Function — proxies file downloads from cdn-1.humand.co
// Needed to bypass CORS restrictions when downloading from the browser.

export default async function handler(req, res) {
  // Only allow GET
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
          }

            const { url } = req.query;

              // Validate: only proxy Humand CDN URLs
                if (
                    !url ||
                        (!url.startsWith("https://cdn-1.humand.co/") &&
                              !url.startsWith("https://cdn.humand.co/"))
                                ) {
                                    return res.status(400).json({ error: "URL no permitida" });
                                      }

                                        try {
                                            const upstream = await fetch(decodeURIComponent(url), {
                                                  headers: { "User-Agent": "HumandDocDownloader/1.0" },
                                                      });

                                                          if (!upstream.ok) {
                                                                return res
                                                                        .status(upstream.status)
                                                                                .json({ error: `CDN respondio ${upstream.status}` });
                                                                                    }

                                                                                        const contentType =
                                                                                              upstream.headers.get("content-type") || "application/octet-stream";
                                                                                                  const buffer = await upstream.arrayBuffer();

                                                                                                      res.setHeader("Content-Type", contentType);
                                                                                                          res.setHeader("Access-Control-Allow-Origin", "*");
                                                                                                              res.setHeader("Cache-Control", "private, max-age=3600");
                                                                                                                  res.send(Buffer.from(buffer));
                                                                                                                    } catch (err) {
                                                                                                                        console.error("Proxy error:", err);
                                                                                                                            res.status(500).json({ error: err.message });
                                                                                                                              }
                                                                                                                              }

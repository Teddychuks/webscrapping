const axios = require("axios");
const cheerio = require("cheerio");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ message: "URL parameter is required" });
    }

    try {
      const response = await axios.get(url, {
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 404;
        },
      });

      const $ = cheerio.load(response.data);
      const title = $("title").text();

      if (title) {
        return res.status(200).json({ title });
      } else {
        return res.status(404).json({ message: "Title not found" });
      }
    } catch (error) {
      console.error("Error scraping the URL:", error);

      if (axios.isAxiosError(error) && error.response) {
        const $ = cheerio.load(error.response.data);
        const title = $("title").text();
        if (title) {
          return res.status(error.response.status).json({ title });
        } else {
          return res.status(error.response.status).json({
            message: "Failed to retrieve the title",
            details: error.response.statusText,
          });
        }
      } else {
        return res.status(500).json({
          message: "An unexpected error occurred",
          details: error.message,
        });
      }
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

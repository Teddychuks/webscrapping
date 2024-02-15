const axios = require("axios");
const cheerio = require("cheerio");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ message: "URL parameter is required" });
    }

    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const title = $("title").text();

      res.status(200).json({ title });
    } catch (error) {
      console.error("Error scraping the URL:", error);

      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          return res.status(404).json({ message: "URL not found: 404 Error" });
        }

        if (error.response) {
          res.status(error.response.status).json({
            message: "Error retrieving URL",
            details: error.response.data,
          });
        } else if (error.request) {
          res.status(500).json({ message: "No response received from URL" });
        } else {
          res.status(500).json({
            message: "Error setting up request to URL",
            details: error.message,
          });
        }
      } else {
        res.status(500).json({
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

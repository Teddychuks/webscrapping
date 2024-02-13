// Import axios to make HTTP requests
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
      // Use the generic selector for the <title> tag
      const title = $("title").text();

      res.status(200).json({ title });
    } catch (error) {
      console.error("Error scraping the URL:", error);
      res.status(500).json({ message: "Error scraping the URL" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

"use client";
import React, { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`/api/scrape?url=${encodedUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    if (data.title) {
      setTitle(data.title);
    } else {
      alert("Failed to fetch the title");
    }
  }
  return (
    <div>
      <h1>Webpage Title Scraper</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL here"
        />
        <button type="submit">Get Title</button>
      </form>
      {title && <p>Page Title: {title}</p>}
    </div>
  );
}

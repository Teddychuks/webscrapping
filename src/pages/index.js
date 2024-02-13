"use client";
import Image from "next/image";
import React, { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
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
      setUrl("");
      setIsLoading(false);
    } else {
      alert("Failed to fetch the title");
      setUrl("");
      setIsLoading(false);
    }
  }
  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            Get title from any url
          </h1>
          <p className="mb-8 leading-relaxed font-bold text-lg flex items-center justify-center gap-3  ">
            Title:
            {isLoading ? (
              <div class="animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-green-600 rounded-full">
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              <span className="text-green-400">{title}</span>
            )}
          </p>
          <div className="flex w-full md:justify-start justify-center items-end">
            <div className="relative mr-4 md:w-full lg:w-full xl:w-1/2 w-2/4">
              <form>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL here"
                  className="w-full bg-gray-100 rounded border bg-opacity-50 border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-transparent focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </form>
            </div>
            <button
              onClick={handleSubmit}
              className=" text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              Send
            </button>
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <div className="object-cover object-center rounded-lg overflow-hidden">
            <Image
              src="/earth.jpg"
              alt="hero"
              width={720}
              height={600}
              layout="responsive"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

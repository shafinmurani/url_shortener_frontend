"use client";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from 'react';
import { shortenUrl } from "@/services/shorten";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from 'framer-motion';
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner";

export default function ShortenURL() {
  const [url, setUrl] = React.useState("");
  const [shortUrl, setShortUrl] = React.useState("");
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errorDescription, setErrorDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/i;

  const darkStyles = {
    main: "flex min-h-screen flex-col items-center justify-center p-24 bg-[#18181b] text-white",
    card: "mb-32 flex w-full max-w-5xl flex-col items-center justify-center bg-[#23232a] rounded-xl shadow-2xl border border-[#333] p-8", // Added padding
    heading: "text-4xl font-bold mb-8 text-white drop-shadow-lg",
    input: "w-full p-4 text-lg bg-[#23232a] text-white border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]",
    button: "mt-4 w-full p-4 text-lg font-bold rounded-lg bg-[#6366f1] text-white shadow-lg transition-all duration-200 border-2 border-transparent hover:shadow-2xl hover:border-[#a5b4fc] hover:ring-2 hover:ring-[#a5b4fc] focus:outline-none focus:ring-2 focus:ring-[#6366f1] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
    alert: "mb-4 bg-[#23232a] text-white border border-[#6366f1] rounded-lg shadow-lg",
    success: "flex-1 bg-[#23232a] text-[#a5b4fc] border border-[#6366f1] rounded-lg shadow-lg px-4 py-2 flex items-center justify-between",
  };

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShortUrl("");
    setError(false);
    setErrorMessage("");
    setErrorDescription("");
    if (!url) {
      setError(true);
      setErrorMessage("Please enter a URL.");
      setErrorDescription("");
      return;
    }
    if (!urlRegex.test(url)) {
      setError(true);
      setErrorMessage("Invalid URL format. URL must start with http:// or https://");
      setErrorDescription("");
      return;
    }
    if (url.length > 2048) {
      setError(true);
      setErrorMessage("URL is too long. Maximum length is 2048 characters.");
      setErrorDescription("");
      return;
    }
    setLoading(true);
    try {
      const shortUrlResult = await shortenUrl(url);
      setShortUrl(shortUrlResult);
    } catch (error) {
      setError(true);
      setErrorMessage("Failed to shorten URL.");
      setErrorDescription(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={darkStyles.main}>
      <div className={darkStyles.card}>
        <h1 className={darkStyles.heading}>URL Shortener</h1>
        {error && (
          <Alert variant="destructive" className={darkStyles.alert}>
            <AlertTitle>{errorMessage}</AlertTitle>
            {errorDescription && <AlertDescription>{errorDescription}</AlertDescription>}
          </Alert>
        )}
        {shortUrl && (
          <div className="mb-4 w-full flex justify-center">
            <Alert variant="success" className={darkStyles.success}>
              <a
                href={"https://url-shortener-ten-peach.vercel.app/" + shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#a5b4fc] break-all mr-4"
                style={{ maxWidth: '70%' }}
              >
                https://url-shortener-ten-peach.vercel.app/{shortUrl}
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("https://url-shortener-ten-peach.vercel.app/" + shortUrl)
                  toast.success("Copied to clipboard!")
                }}
                className={darkStyles.button + " !mt-0 !w-auto !p-2 !text-base !rounded-md flex items-center justify-center"}
                type="button"
                aria-label="Copy to clipboard"
                style={{ padding: 0, width: 36, height: 36 }}
                disabled={loading}
              >
                {/* Copy Icon (SVG) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="#a5b4fc" strokeWidth="2" fill="none" />
                  <rect x="3" y="3" width="13" height="13" rx="2" stroke="#a5b4fc" strokeWidth="2" fill="none" />
                </svg>
              </button>
            </Alert>
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full">
          <Input
            type="url"
            placeholder="Enter your URL here"
            className={darkStyles.input}
            value={url}
            onChange={handleInputChange}
            disabled={loading}
          />
          <Button
            className={darkStyles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-[#a5b4fc] border-t-transparent rounded-full mr-2"
                />
                Loading...
              </span>
            ) : (
              'Shorten URL'
            )}
          </Button>
          <Toaster richColors />
        </form>
      </div>
    </main>
  );
}

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from 'react'
import { shortenUrl } from "@/services/shorten";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ShortenURL() {
  const [url, setUrl] = React.useState("");
  const [shortUrl, setShortUrl] = React.useState("");
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errorDescription, setErrorDescription] = React.useState("");


  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  const handleShortenClick = () => {
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
    if (!/^https?:\/\//i.test(url)) {

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
    shortenUrl(url)
      .then((shortUrl) => {
        setShortUrl(shortUrl);
      })
      .catch((error) => {
        setError(true);
        setErrorMessage("Failed to shorten URL.");
        setErrorDescription(error.message || "An unexpected error occurred.");
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="mb-32 flex w-full max-w-5xl flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">URL Shortener</h1>
        <div className="w-full max-w-xl">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{errorMessage}</AlertTitle>
              {errorDescription && <AlertDescription>{errorDescription}</AlertDescription>}
            </Alert>
          )}
          {shortUrl && (
            <div className="flex items-center mb-4">
              <Alert variant="success" className="flex-1 mr-2">
                <a href={"http://localhost:3000/url/" + shortUrl} target="_blank" rel="noopener noreferrer" className="underline">http://localhost:3000/url/{shortUrl}</a>
              </Alert>
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(shortUrl)}
              >
                Copy
              </Button>
            </div>
          )}
          <Input
            type="url"
            placeholder="Enter your URL here"
            className="w-full p-4 text-lg"
            value={url}
            onChange={handleInputChange}
          />
          <Button
            className="mt-4 w-full p-4 text-lg"
            onClick={handleShortenClick}
          >
            Shorten URL
          </Button>
        </div>
      </div>
    </main>
  );
}

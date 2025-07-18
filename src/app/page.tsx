"use client";

import { useEffect, useState } from 'react';
import React from 'react';

import './globals.css';
import { Geist_Mono, Inter } from 'next/font/google';
import { Badge } from "@/components/ui/badge";
import { Github } from 'lucide-react';
import GitHubButton from 'react-github-btn';

type NopeApiResponse = {
  success: boolean;
  data: {
    language: string;
    nope: string;
  };
  error: any;
  message: string;
};

import {
  Card,
  CardContent,
} from "@/components/ui/card"

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-geist-mono',
});

const inter = Inter({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-inter',
});


export default function Page() {
  return(
    <main>
      <div className="fixed top-4 right-4 z-50 px-4 py-2 rounded-md font-medium transition-colors duration-200 shadow-lg">
        <GitHubButton
          href="https://github.com/Err0r430/nope-rs"
          data-color-scheme="no-preference: dark; light: light; dark: dark;"
          data-size="large"
          data-show-count="true"
          aria-label="Star Err0r430/nope-rs on GitHub"
        >
          Star
        </GitHubButton>
      </div>
      
      <div className="fixed inset-0 -z-10
        bg-[linear-gradient(to_right,#73737320_1px,transparent_1px),linear-gradient(to_bottom,#73737320_1px,transparent_1px)]
        bg-[size:20px_20px]"
        aria-hidden="true"
        />
      <div className="relative min-h-screen flex items-center justify-center">
        

        <Header />
      </div>
    </main>
)
};

function Header(props: {}) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
        <h1 className={`${geistMono.className} text-5xl font-bold text-red-400`}>Want to decline someone with style?</h1>
        <p className={`${inter.className} mt-10 text-2xl`}>This is The NopeAPI <Badge variant="outline" className='bg-primary align-middle'>v1.0</Badge></p>
        <NopeCard />
      </div>
  )
};

function NopeCard() {
  const apiURL = "/api/nope";
  const [content, setContent] = useState<NopeApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(apiURL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setContent(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card className="max-w-5xs flex mx-auto mt-10">
      <CardContent>
        {loading && (
          <p className={`${inter.className} text-center`}>Loading...</p>
        )}
        {error && (
          <p className={`${inter.className} text-center text-red-500`}>Error: {error}</p>
        )}
        {content && !loading && !error && (
          <h2 className={`${geistMono.className} text-2xl font-bold mb-4`}>{content.data.nope}</h2>
        )}
      </CardContent>
    </Card>
  )
}
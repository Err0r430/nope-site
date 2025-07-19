"use client";

import { useEffect, useState, useRef } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

function InteractiveGrid() {
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleMouseLeave = () => {
      setMousePos({ x: -999, y: -999 });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const gridSize = 50;
  const radius = 150;

  const calculateOpacity = (linePos: number, mouseCoord: number) => {
    const distance = Math.abs(linePos - mouseCoord);
    
    if (distance > radius) return 0.05;
    
    const normalizedDistance = distance / radius;
    const fisheye = 1 - Math.pow(normalizedDistance, 0.8);
    return 0.05 + (0.1 * fisheye);
  };

  if (dimensions.width === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg 
        width="100%" 
        height="100%" 
        className="absolute inset-0"
      >
        {Array.from({ length: Math.ceil(dimensions.width / gridSize) + 1 }, (_, i) => {
          const x = i * gridSize;
          return (
            <line
              key={`v-${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2="100%"
              stroke="currentColor"
              strokeWidth="1"
              opacity={calculateOpacity(x, mousePos.x)}
              className="transition-opacity duration-75"
            />
          );
        })}
        {Array.from({ length: Math.ceil(dimensions.height / gridSize) + 1 }, (_, i) => {
          const y = i * gridSize;
          return (
            <line
              key={`h-${i}`}
              x1={0}
              y1={y}
              x2="100%"
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              opacity={calculateOpacity(y, mousePos.y)}
              className="transition-opacity duration-75"
            />
          );
        })}
      </svg>
    </div>
  );
}


export default function Page() {
  return (
    <main className="relative min-h-screen">
      <InteractiveGrid />
      <motion.div 
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.div
          className="px-4 py-2 rounded-md font-medium transition-colors duration-200 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <GitHubButton
            href="https://github.com/Err0r430/nope-rs"
            data-color-scheme="no-preference: dark; light: light; dark: dark;"
            data-size="large"
            data-show-count="true"
            aria-label="Star Err0r430/nope-rs on GitHub"
          >
            Star
          </GitHubButton>
        </motion.div>
      </motion.div>
      
      <div className="relative min-h-screen flex items-center justify-center z-10">
        <Header />
      </div>
    </main>
  );
};

function Header() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.h1 
        className={`${geistMono.className} text-3xl md:text-5xl font-bold text-red-400 text-center`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Want to decline someone with style?
      </motion.h1>
      
      <motion.div
        className="flex items-center gap-3 mt-6 md:mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <p className={`${inter.className} text-xl md:text-2xl`}>
          Nope.rs. Extremely lightweight No-As-A-Service
        </p>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
        </motion.div>
      </motion.div>
      
      <NopeCard />
    </div>
  );
};

function NopeCard() {
  const apiURL = "/api/nope";
  const [content, setContent] = useState<NopeApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    if (content?.data.nope) {
      try {
        await navigator.clipboard.writeText(content.data.nope);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="mt-8 md:mt-10 w-full max-w-md">
      <motion.div
        layout
        transition={{ layout: { duration: 0.5, type: "spring", bounce: 0.5 } }}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCopy}
        className="cursor-pointer"
      >
        <Card className="mx-auto shadow-lg border-2 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
          <CardContent className="p-6 min-h-[80px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.p 
                  key="loading"
                  className={`${inter.className} text-center text-muted-foreground`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Loading...
                </motion.p>
              )}
              {error && (
                <motion.p 
                  key="error"
                  className={`${inter.className} text-center text-red-500`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Error: {error}
                </motion.p>
              )}
              {content && !loading && !error && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <h2 className={`${geistMono.className} text-xl md:text-2xl font-bold mb-2`}>
                    {content.data.nope}
                  </h2>
                  <p className={`${inter.className} text-sm text-muted-foreground`}>
                    Click to copy
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                      className="text-2xl mb-2"
                    >
                      ✓
                    </motion.div>
                    <p className={`${inter.className} text-sm font-medium text-green-600 dark:text-green-400`}>
                      Copied to clipboard!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
"use client";

import { DialogsProvider } from '@toolpad/core/useDialogs';

import { Geist, Geist_Mono } from "next/font/google";

import "@/app/globals.css";
import styles from "@/app/page.module.css";

import { SnackbarProvider } from "notistack";
import { Header, Sidebar, Main } from "@/components/layout";

import React, { useEffect } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { cleanupMotionResponseListener, setupMotionResponseListener } from '@/stores/motionResponse';
import { initializeSqliteDb } from '@/services/sqlite';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    setupMotionResponseListener();
    window.addEventListener('beforeunload', cleanupMotionResponseListener);
    return () => {
      window.removeEventListener('beforeunload', cleanupMotionResponseListener);
    };
  }, []);

  useEffect(() => {
    initializeSqliteDb()
  }, []);

  return (
    <html lang="en"　suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <DialogsProvider>
            <SnackbarProvider>

              <Header />
              <Sidebar />
              <Main className={styles.main} > {children} </Main>

            </SnackbarProvider>
          </DialogsProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

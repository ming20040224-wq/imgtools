"use client"

import Script from "next/script"

const GA_ID = "G-XXXXXXXXXX" // 替换为你的 Google Analytics ID

export function Analytics() {
  // Don't load analytics if GA_ID is not set
  if (GA_ID === "G-XXXXXXXXXX") return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}

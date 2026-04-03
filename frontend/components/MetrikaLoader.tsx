"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { getSiteSettings } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    __yaCounterId?: number;
    __metrikaReady?: boolean;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function MetrikaLoader() {
  const [counterId, setCounterId] = useState<string>("");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    getSiteSettings()
      .then((settings) => {
        if (settings.metrika_enabled && settings.metrika_counter_id) {
          window.__yaCounterId = Number(settings.metrika_counter_id);
          window.dataLayer = window.dataLayer || [];
          setCounterId(settings.metrika_counter_id);
        }
      })
      .catch(() => {
        setCounterId("");
      });
  }, []);

  useEffect(() => {
    if (!counterId || typeof window === "undefined") {
      return;
    }

    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    if (typeof window.ym === "function" && typeof window.__yaCounterId === "number") {
      try {
        window.ym(window.__yaCounterId, "hit", url, {
          title: document.title,
          referer: document.referrer,
        });
      } catch {}
    }

    void trackEvent("page_view", { title: document.title, url });
  }, [counterId, pathname, searchParams]);

  if (!counterId) {
    return null;
  }

  return (
    <>
      <Script id="yandex-metrika-init" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          ym(${counterId}, "init", {
            ssr:true,
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true,
            ecommerce:"dataLayer",
            referrer: document.referrer,
            url: location.href
          });
          window.__metrikaReady = true;
        `}
      </Script>
      <noscript>
        <div>
          <img src={`https://mc.yandex.ru/watch/${counterId}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
        </div>
      </noscript>
    </>
  );
}

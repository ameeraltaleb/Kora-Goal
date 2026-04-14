"use client";

import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  sources: { url: string; label: string }[];
  onAutoSwitch?: (newIndex: number) => void;
}

export default function VideoPlayer({ sources, onAutoSwitch }: VideoPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const currentSource = sources[currentIndex]?.url || '';
  const isM3u8 = currentSource.includes('.m3u8');
  const hasSources = sources.length > 0 && currentSource;

  if (!hasSources) {
    return (
      <div style={{
        width: '100%', aspectRatio: '16/9', background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px'
      }}>
        <span style={{ fontSize: '3rem' }}>📡</span>
        <p style={{ color: 'var(--text-secondary)' }}>لا توجد مصادر للبث حالياً</p>
      </div>
    );
  }

  // Switch Server Logic
  const handleSwitch = (index: number) => {
    setCurrentIndex(index);
    setIsError(false);
    setIsLoading(true);
  };

  const reportError = () => {
    setIsError(true);
    if (currentIndex < sources.length - 1) {
      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        handleSwitch(nextIndex);
        if (onAutoSwitch) onAutoSwitch(nextIndex);
      }, 3000);
    }
  };

  // HLS Initialization
  useEffect(() => {
    if (!isM3u8 || !videoRef.current) return;

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        maxBufferLength: 30,
        enableWorker: true
      });
      hlsRef.current = hls;

      hls.loadSource(currentSource);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        videoRef.current?.play().catch(() => {
          console.warn("Autoplay prevented");
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("fatal network error encountered, try to recover");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("fatal media error encountered, try to recover");
              hls.recoverMediaError();
              break;
            default:
              // cannot recover
              hls.destroy();
              reportError();
              break;
          }
        }
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari native support
      videoRef.current.src = currentSource;
      videoRef.current.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        videoRef.current?.play();
      });
      videoRef.current.addEventListener('error', reportError);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [currentSource, isM3u8]);

  return (
    <div className={styles.playerWrapper}>
      <div className={styles.iframeContainer}>
        {isLoading && (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>جاري تحضير البث المباشر...</p>
          </div>
        )}

        {isError && (
          <div className={styles.errorOverlay}>
            <p>عذراً، هذا السيرفر لا يعمل حالياً.</p>
            <p>يتم الآن التحويل تلقائياً لسيرفر آخر...</p>
          </div>
        )}

        {!isError && (
          isM3u8 ? (
            <video
              ref={videoRef}
              className={styles.iframe}
              controls
              autoPlay
              muted
              aria-label="مشغل البث المباشر"
            />
          ) : (
            <iframe
              ref={iframeRef}
              src={currentSource}
              className={styles.iframe}
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              title={`سيرفر البث: ${sources[currentIndex]?.label || ''}`}
            />
          )
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.serverTitle}>اختر السيرفر:</div>
        <div className={styles.serverButtons}>
          {sources.map((source, index) => (
            <button
              key={index}
              className={`${styles.serverBtn} ${currentIndex === index ? styles.active : ''}`}
              onClick={() => handleSwitch(index)}
              aria-pressed={currentIndex === index}
              aria-label={`سيرفر ${source.label}`}
            >
              {source.label}
            </button>
          ))}
        </div>

        <button className={styles.reportBtn} onClick={reportError}>
          ⚠️ أبلغ عن مشكلة
        </button>
      </div>
    </div>
  );
}

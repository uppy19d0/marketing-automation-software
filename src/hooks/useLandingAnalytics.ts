import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../config/api';

interface AnalyticsEvent {
  landingPageId: string;
  eventType: 'page_view' | 'scroll' | 'button_click' | 'form_focus' | 'form_submit' | 'exit_intent';
  metadata?: Record<string, any>;
}

interface DeviceInfo {
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
}

export function useLandingAnalytics(landingPageId: string | undefined) {
  const [startTime] = useState(Date.now());
  const [maxScroll, setMaxScroll] = useState(0);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const hasTrackedView = useRef(false);

  // Detectar información del dispositivo
  const getDeviceInfo = (): DeviceInfo => {
    const ua = navigator.userAgent;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Detectar tipo de dispositivo
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (screenWidth < 768) {
      deviceType = 'mobile';
    } else if (screenWidth < 1024) {
      deviceType = 'tablet';
    }

    // Detectar navegador
    let browser = 'Unknown';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';

    // Detectar OS
    let os = 'Unknown';
    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return {
      userAgent: ua,
      screenWidth,
      screenHeight,
      deviceType,
      browser,
      os,
    };
  };

  // Track page view
  useEffect(() => {
    if (!landingPageId) return;
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;
      trackEvent('page_view', {
        device: getDeviceInfo(),
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        url: window.location.href,
      });
    }
  }, [landingPageId]);

  // Track scroll depth
  useEffect(() => {
    if (!landingPageId) return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);

      if (scrollPercent > maxScroll) {
        setMaxScroll(scrollPercent);

        // Track milestones: 25%, 50%, 75%, 100%
        if (
          (scrollPercent >= 25 && maxScroll < 25) ||
          (scrollPercent >= 50 && maxScroll < 50) ||
          (scrollPercent >= 75 && maxScroll < 75) ||
          (scrollPercent >= 100 && maxScroll < 100)
        ) {
          trackEvent('scroll', {
            scrollDepth: scrollPercent,
            timestamp: new Date().toISOString(),
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [landingPageId, maxScroll]);

  // Track time on page and send before unload
  useEffect(() => {
    if (!landingPageId) return;

    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000); // segundos

      // Usar sendBeacon para enviar datos antes de cerrar
      const data = {
        landingPageId,
        eventType: 'exit_intent',
        metadata: {
          timeOnPage,
          maxScrollDepth: maxScroll,
          timestamp: new Date().toISOString(),
        },
      };

      const beaconBody = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon(
        `${API_BASE_URL}/landing-pages/${landingPageId}/track`,
        beaconBody
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [landingPageId, startTime, maxScroll]);

  // Función para trackear eventos
  const trackEvent = async (
    eventType: AnalyticsEvent['eventType'],
    metadata?: Record<string, any>
  ) => {
    if (!landingPageId) return;

    const event: AnalyticsEvent = {
      landingPageId,
      eventType,
      metadata,
    };

    setEvents((prev) => [...prev, event]);

    // Enviar al backend
    try {
      await fetch(`${API_BASE_URL}/landing-pages/${landingPageId}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  // Función para trackear clicks en botones
  const trackButtonClick = (buttonText: string) => {
    trackEvent('button_click', {
      buttonText,
      timestamp: new Date().toISOString(),
      device: getDeviceInfo(),
    });
  };

  // Función para trackear foco en formulario
  const trackFormFocus = (fieldName: string) => {
    trackEvent('form_focus', {
      fieldName,
      timestamp: new Date().toISOString(),
    });
  };

  // Función para trackear envío de formulario
  const trackFormSubmit = (formData: Record<string, any>) => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    trackEvent('form_submit', {
      timeOnPage,
      scrollDepth: maxScroll,
      timestamp: new Date().toISOString(),
      device: getDeviceInfo(),
      formSnapshot: formData,
    });
  };

  return {
    trackEvent,
    trackButtonClick,
    trackFormFocus,
    trackFormSubmit,
    events,
    timeOnPage: Math.round((Date.now() - startTime) / 1000),
    maxScrollDepth: maxScroll,
  };
}

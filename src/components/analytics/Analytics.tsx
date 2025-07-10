import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface AnalyticsEvent {
  event_type: string;
  page_path?: string;
  metadata?: any;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;
  private deviceInfo: any;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.deviceInfo = this.getDeviceInfo();
  }

  static getInstance() {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo() {
    const ua = navigator.userAgent;
    return {
      device_type: /Mobile|Android|iPhone|iPad/.test(ua) ? 'mobile' : 
                   /Tablet|iPad/.test(ua) ? 'tablet' : 'desktop',
      browser: this.getBrowser(ua),
      os: this.getOS(ua),
      user_agent: ua,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    };
  }

  private getBrowser(ua: string) {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOS(ua: string) {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  async track(event: AnalyticsEvent, userId?: string) {
    try {
      await supabase.from('analytics').insert({
        event_type: event.event_type,
        page_path: event.page_path || window.location.pathname,
        user_id: userId || null,
        session_id: this.sessionId,
        referrer: document.referrer || null,
        metadata: {
          ...event.metadata,
          ...this.deviceInfo,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Erro ao enviar analytics:', error);
    }
  }

  // Métodos específicos para eventos comuns
  trackPageView(path?: string, userId?: string) {
    this.track({
      event_type: 'page_view',
      page_path: path,
      metadata: {
        title: document.title,
        url: window.location.href
      }
    }, userId);
  }

  trackProductView(productId: string, productName: string, userId?: string) {
    this.track({
      event_type: 'product_view',
      metadata: {
        product_id: productId,
        product_name: productName
      }
    }, userId);
  }

  trackCartAdd(productId: string, quantity: number, price: number, userId?: string) {
    this.track({
      event_type: 'cart_add',
      metadata: {
        product_id: productId,
        quantity,
        price,
        value: price * quantity
      }
    }, userId);
  }

  trackPurchase(orderId: string, value: number, items: any[], userId?: string) {
    this.track({
      event_type: 'purchase',
      metadata: {
        order_id: orderId,
        value,
        items,
        currency: 'BRL'
      }
    }, userId);
  }

  trackSearch(query: string, results: number, userId?: string) {
    this.track({
      event_type: 'search',
      metadata: {
        query,
        results_count: results
      }
    }, userId);
  }
}

export const useAnalytics = () => {
  const location = useLocation();
  const { user } = useAuth();
  const analytics = AnalyticsService.getInstance();

  useEffect(() => {
    // Track page view automaticamente
    analytics.trackPageView(location.pathname, user?.id);
  }, [location.pathname, user?.id]);

  return {
    trackPageView: (path?: string) => analytics.trackPageView(path, user?.id),
    trackProductView: (productId: string, productName: string) => 
      analytics.trackProductView(productId, productName, user?.id),
    trackCartAdd: (productId: string, quantity: number, price: number) => 
      analytics.trackCartAdd(productId, quantity, price, user?.id),
    trackPurchase: (orderId: string, value: number, items: any[]) => 
      analytics.trackPurchase(orderId, value, items, user?.id),
    trackSearch: (query: string, results: number) => 
      analytics.trackSearch(query, results, user?.id),
    trackCustomEvent: (eventType: string, metadata?: any) => 
      analytics.track({ event_type: eventType, metadata }, user?.id)
  };
};

// Componente para incluir no App.tsx
export const Analytics = () => {
  useAnalytics(); // Inicia o tracking automático
  return null;
};
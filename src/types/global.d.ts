// Google Analytics 4 타입 정의
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: {
        [key: string]: any;
      }
    ) => void;
    dataLayer: any[];
  }

  // PWA 관련 타입
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }

  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }
}

// Next.js 환경변수 타입 (GA4, PWA, Notion)
declare namespace NodeJS {
  interface ProcessEnv {
    // Google Analytics
    NEXT_PUBLIC_GA_ID?: string;

    // PWA 설정
    NEXT_PUBLIC_APP_NAME?: string;
    NEXT_PUBLIC_APP_DESCRIPTION?: string;

    // Notion CMS
    NOTION_API_KEY?: string;
    NOTION_DATABASE_ID?: string;
  }
}

export {};

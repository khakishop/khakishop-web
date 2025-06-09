import { useEffect, useState } from 'react';

interface LocalTimeDisplayProps {
  date?: string | Date;
  format?: 'full' | 'date' | 'time';
  className?: string;
  fallback?: string;
}

export function LocalTimeDisplay({ 
  date, 
  format = 'full', 
  className = '',
  fallback = ''
}: LocalTimeDisplayProps) {
  const [displayTime, setDisplayTime] = useState<string | null>(null);

  useEffect(() => {
    const targetDate = date ? new Date(date) : new Date();
    
    let timeString = '';
    switch (format) {
      case 'full':
        timeString = targetDate.toLocaleString('ko-KR');
        break;
      case 'date':
        timeString = targetDate.toLocaleDateString('ko-KR');
        break;
      case 'time':
        timeString = targetDate.toLocaleTimeString('ko-KR');
        break;
      default:
        timeString = targetDate.toLocaleString('ko-KR');
    }
    
    setDisplayTime(timeString);
  }, [date, format]);

  // SSR 시에는 fallback 또는 빈 문자열 반환
  if (!displayTime) {
    return fallback ? <span className={className}>{fallback}</span> : null;
  }

  return <span className={className}>{displayTime}</span>;
}

// 특정 날짜를 표시하는 컴포넌트
export function LocalDateDisplay({ 
  date, 
  className = '',
  fallback = ''
}: {
  date: string | Date;
  className?: string;
  fallback?: string;
}) {
  return (
    <LocalTimeDisplay 
      date={date} 
      format="date" 
      className={className}
      fallback={fallback}
    />
  );
}

// 현재 시간을 표시하는 컴포넌트
export function CurrentTimeDisplay({ 
  className = '',
  fallback = '로딩 중...'
}: {
  className?: string;
  fallback?: string;
}) {
  return (
    <LocalTimeDisplay 
      format="full" 
      className={className}
      fallback={fallback}
    />
  );
} 
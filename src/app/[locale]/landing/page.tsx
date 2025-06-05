import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { LandingClient } from './LandingClient';

// 메타데이터 export
export const metadata: Metadata = {
  title: 'khaki shop - 커튼과 블라인드의 새로운 기준',
  description: '고품질 커튼, 블라인드, 전동 시스템으로 공간을 완성하는 khaki shop. 전문 컨설팅부터 시공까지 원스톱 서비스.',
  keywords: '커튼, 블라인드, 전동커튼, 인테리어, khaki shop',
  openGraph: {
    title: 'khaki shop - 커튼과 블라인드의 새로운 기준',
    description: '고품질 커튼, 블라인드, 전동 시스템으로 공간을 완성하는 khaki shop',
    type: 'website',
  }
};

export default function LandingPage() {
  return <LandingClient />;
} 
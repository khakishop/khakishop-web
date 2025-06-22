"use client";

/**
 * ================================================================================
 * ✏️ 프로젝트 편집 페이지
 * ================================================================================
 * 
 * 기능:
 * - 프로젝트 상세 정보 편집 (제목, 설명, 위치, 날짜 등)
 * - Before/After 스토리 편집
 * - 제품 상세 정보 편집 (커튼/블라인드 스펙)
 * - 이미지 갤러리 관리
 * - 실시간 미리보기
 * - 자동 저장 기능
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getProjectBySlug, Project } from '../../../../../../data/projects';

interface ProjectEditPageProps {
  params: { slug: string; locale: string };
}

interface ProjectFormData extends Omit<Project, 'slug'> {
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  beforeStory?: string;
  afterStory?: string;
  productSpecs?: {
    curtainType?: string;
    blindType?: string;
    motorSystem?: string;
    fabricDetails?: string;
    dimensions?: string;
    installation?: string;
  };
}

export default function ProjectEditPage({ params }: ProjectEditPageProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'images' | 'seo' | 'preview'>('basic');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // 프로젝트 데이터 로드
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        const projectData = getProjectBySlug(params.slug);

        if (!projectData) {
          router.push('/admin/projects');
          return;
        }

        setProject(projectData);
        setFormData({
          ...projectData,
          isPublished: true, // 기본값
          seoTitle: projectData.title,
          seoDescription: projectData.description,
          beforeStory: '',
          afterStory: '',
          productSpecs: {
            curtainType: '',
            blindType: '',
            motorSystem: '',
            fabricDetails: '',
            dimensions: '',
            installation: ''
          }
        });
      } catch (error) {
        console.error('프로젝트 로드 실패:', error);
        router.push('/admin/projects');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [params.slug, router]);

  // 폼 데이터 업데이트
  const updateFormData = useCallback((updates: Partial<ProjectFormData>) => {
    setFormData(prev => prev ? { ...prev, ...updates } : null);
    setHasUnsavedChanges(true);
  }, []);

  // 자동 저장 (5초마다)
  useEffect(() => {
    if (!hasUnsavedChanges || !formData) return;

    const autoSaveTimer = setTimeout(() => {
      handleSave(true); // 자동 저장
    }, 5000);

    return () => clearTimeout(autoSaveTimer);
  }, [hasUnsavedChanges, formData]);

  // 저장 함수
  const handleSave = async (isAutoSave = false) => {
    if (!formData) return;

    try {
      setIsSaving(true);

      // API 호출로 프로젝트 업데이트
      const response = await fetch(`/api/admin/projects/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '저장 중 오류가 발생했습니다.');
      }

      setHasUnsavedChanges(false);

      if (!isAutoSave) {
        // 성공 알림
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = '프로젝트가 성공적으로 저장되었습니다.';
        document.body.appendChild(notification);

        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }
    } catch (error) {
      console.error('저장 실패:', error);

      // 에러 알림
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.';
      document.body.appendChild(notification);

      setTimeout(() => {
        document.body.removeChild(notification);
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // 페이지 떠날 때 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로젝트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!project || !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">프로젝트를 찾을 수 없습니다.</p>
          <Link href="/admin/projects" className="text-blue-600 hover:underline mt-2 inline-block">
            프로젝트 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/projects"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← 프로젝트 목록
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {project.title} 편집
                </h1>
                <p className="text-sm text-gray-600">
                  {hasUnsavedChanges && (
                    <span className="text-orange-600">• 저장되지 않은 변경사항이 있습니다</span>
                  )}
                  {isSaving && (
                    <span className="text-blue-600">• 저장 중...</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSave(false)}
                disabled={!hasUnsavedChanges || isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>

              <Link
                href={`/ko/projects/${project.slug}`}
                target="_blank"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                웹사이트에서 보기
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 사이드바 - 탭 메뉴 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: 'basic', label: '기본 정보', icon: '📝' },
                  { id: 'content', label: '콘텐츠', icon: '📄' },
                  { id: 'images', label: '이미지', icon: '🖼️' },
                  { id: 'seo', label: 'SEO', icon: '🔍' },
                  { id: 'preview', label: '미리보기', icon: '👁️' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* 발행 상태 */}
              <div className="mt-6 pt-4 border-t">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => updateFormData({ isPublished: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">공개</span>
                </label>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* 기본 정보 탭 */}
              {activeTab === 'basic' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">기본 정보</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        프로젝트 제목
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateFormData({ title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="프로젝트 제목을 입력하세요"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          위치
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => updateFormData({ location: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="예: 강남구"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          연도
                        </label>
                        <input
                          type="text"
                          value={formData.year}
                          onChange={(e) => updateFormData({ year: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="예: 2024"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          카테고리
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => updateFormData({ category: e.target.value as Project['category'] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Residential">주거</option>
                          <option value="Commercial">상업</option>
                          <option value="F&B">카페/레스토랑</option>
                          <option value="Healthcare">의료</option>
                          <option value="Cultural">문화/예술</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          면적
                        </label>
                        <input
                          type="text"
                          value={formData.area || ''}
                          onChange={(e) => updateFormData({ area: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="예: 150㎡"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        클라이언트
                      </label>
                      <input
                        type="text"
                        value={formData.client || ''}
                        onChange={(e) => updateFormData({ client: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="예: 개인 주택"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        프로젝트 설명
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        컨셉
                      </label>
                      <textarea
                        value={formData.concept || ''}
                        onChange={(e) => updateFormData({ concept: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="프로젝트의 핵심 컨셉을 입력하세요"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 콘텐츠 탭 */}
              {activeTab === 'content' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">콘텐츠 관리</h2>

                  <div className="space-y-8">
                    {/* Before/After 스토리 */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Before/After 스토리</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Before 스토리
                          </label>
                          <textarea
                            value={formData.beforeStory || ''}
                            onChange={(e) => updateFormData({ beforeStory: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="시공 전 상황을 설명하세요"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            After 스토리
                          </label>
                          <textarea
                            value={formData.afterStory || ''}
                            onChange={(e) => updateFormData({ afterStory: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="시공 후 결과를 설명하세요"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 주요 특징 */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">주요 특징</h3>
                      <div className="space-y-2">
                        {(formData.features || []).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...(formData.features || [])];
                                newFeatures[index] = e.target.value;
                                updateFormData({ features: newFeatures });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="특징을 입력하세요"
                            />
                            <button
                              onClick={() => {
                                const newFeatures = formData.features?.filter((_, i) => i !== index) || [];
                                updateFormData({ features: newFeatures });
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newFeatures = [...(formData.features || []), ''];
                            updateFormData({ features: newFeatures });
                          }}
                          className="w-full px-3 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-gray-400 hover:text-gray-600 transition-colors"
                        >
                          + 특징 추가
                        </button>
                      </div>
                    </div>

                    {/* 사용 소재 */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">사용 소재</h3>
                      <div className="space-y-2">
                        {(formData.materials || []).map((material, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={material}
                              onChange={(e) => {
                                const newMaterials = [...(formData.materials || [])];
                                newMaterials[index] = e.target.value;
                                updateFormData({ materials: newMaterials });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="소재를 입력하세요"
                            />
                            <button
                              onClick={() => {
                                const newMaterials = formData.materials?.filter((_, i) => i !== index) || [];
                                updateFormData({ materials: newMaterials });
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newMaterials = [...(formData.materials || []), ''];
                            updateFormData({ materials: newMaterials });
                          }}
                          className="w-full px-3 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-gray-400 hover:text-gray-600 transition-colors"
                        >
                          + 소재 추가
                        </button>
                      </div>
                    </div>

                    {/* 제품 상세 스펙 */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">제품 상세 스펙</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            커튼 타입
                          </label>
                          <input
                            type="text"
                            value={formData.productSpecs?.curtainType || ''}
                            onChange={(e) => updateFormData({
                              productSpecs: { ...formData.productSpecs, curtainType: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="예: 리넨 커튼"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            블라인드 타입
                          </label>
                          <input
                            type="text"
                            value={formData.productSpecs?.blindType || ''}
                            onChange={(e) => updateFormData({
                              productSpecs: { ...formData.productSpecs, blindType: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="예: 베네치안 블라인드"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            모터 시스템
                          </label>
                          <input
                            type="text"
                            value={formData.productSpecs?.motorSystem || ''}
                            onChange={(e) => updateFormData({
                              productSpecs: { ...formData.productSpecs, motorSystem: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="예: 스마트 모터"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            설치 방식
                          </label>
                          <input
                            type="text"
                            value={formData.productSpecs?.installation || ''}
                            onChange={(e) => updateFormData({
                              productSpecs: { ...formData.productSpecs, installation: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="예: 천장 매립형"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          원단 상세
                        </label>
                        <textarea
                          value={formData.productSpecs?.fabricDetails || ''}
                          onChange={(e) => updateFormData({
                            productSpecs: { ...formData.productSpecs, fabricDetails: e.target.value }
                          })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="원단의 특성, 색상, 질감 등을 설명하세요"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 이미지 탭 */}
              {activeTab === 'images' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">이미지 관리</h2>

                  <div className="space-y-6">
                    {/* 메인 이미지 */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">메인 이미지</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <img
                            src={formData.mainImage}
                            alt="메인 이미지"
                            className="mx-auto h-48 w-auto object-cover rounded-lg mb-4"
                          />
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">메인 이미지</p>
                            <input
                              type="text"
                              value={formData.mainImage}
                              onChange={(e) => updateFormData({ mainImage: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="이미지 URL을 입력하세요"
                            />
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                              이미지 업로드
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 갤러리 이미지 */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">갤러리 이미지</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(formData.galleryImages || []).map((image, index) => (
                          <div key={index} className="relative border border-gray-300 rounded-lg p-2">
                            <img
                              src={image}
                              alt={`갤러리 ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg mb-2"
                            />
                            <input
                              type="text"
                              value={image}
                              onChange={(e) => {
                                const newGallery = [...(formData.galleryImages || [])];
                                newGallery[index] = e.target.value;
                                updateFormData({ galleryImages: newGallery });
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                              placeholder="이미지 URL"
                            />
                            <button
                              onClick={() => {
                                const newGallery = formData.galleryImages?.filter((_, i) => i !== index) || [];
                                updateFormData({ galleryImages: newGallery });
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newGallery = [...(formData.galleryImages || []), ''];
                            updateFormData({ galleryImages: newGallery });
                          }}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          이미지 추가
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO 탭 */}
              {activeTab === 'seo' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">SEO 설정</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO 제목
                      </label>
                      <input
                        type="text"
                        value={formData.seoTitle || ''}
                        onChange={(e) => updateFormData({ seoTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="검색 엔진에 표시될 제목"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        권장 길이: 50-60자 (현재: {(formData.seoTitle || '').length}자)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO 설명
                      </label>
                      <textarea
                        value={formData.seoDescription || ''}
                        onChange={(e) => updateFormData({ seoDescription: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="검색 엔진에 표시될 설명"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        권장 길이: 150-160자 (현재: {(formData.seoDescription || '').length}자)
                      </p>
                    </div>

                    {/* SEO 미리보기 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">검색 결과 미리보기</h3>
                      <div className="bg-white border rounded-lg p-4">
                        <h4 className="text-lg text-blue-600 mb-1 truncate">
                          {formData.seoTitle || formData.title}
                        </h4>
                        <p className="text-sm text-green-600 mb-2">
                          khakishop.com/projects/{project.slug}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {formData.seoDescription || formData.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 미리보기 탭 */}
              {activeTab === 'preview' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-gray-900">실시간 미리보기</h2>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPreviewMode('desktop')}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${previewMode === 'desktop'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        데스크톱
                      </button>
                      <button
                        onClick={() => setPreviewMode('mobile')}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${previewMode === 'mobile'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        모바일
                      </button>
                    </div>
                  </div>

                  <div className={`border rounded-lg overflow-hidden ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''
                    }`}>
                    <div className="bg-white p-6">
                      <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                          {formData.title}
                        </h1>
                        <p className="text-gray-600">
                          {formData.location} • {formData.year}
                        </p>
                      </div>

                      <div className="aspect-video bg-gray-200 rounded-lg mb-6 overflow-hidden">
                        <img
                          src={formData.mainImage}
                          alt={formData.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {formData.description}
                        </p>

                        {formData.concept && (
                          <div className="mt-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">컨셉</h3>
                            <p className="text-gray-600">{formData.concept}</p>
                          </div>
                        )}

                        {formData.features && formData.features.length > 0 && (
                          <div className="mt-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">주요 특징</h3>
                            <ul className="space-y-1">
                              {formData.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-gray-600">
                                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
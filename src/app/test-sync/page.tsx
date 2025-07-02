'use client';

// import { useUnifiedData } from '@/hooks/useUnifiedData';
// import { DataSyncProvider, useDataSync } from '@/components/DataSyncProvider';

function TestContent() {
  // const { data, loading, error, updateData } = useUnifiedData('curtain');
  // const { triggerRefresh, isRefreshing } = useDataSync();

  const data: any[] = []; // 임시 데이터
  const loading = false;
  const error = null;
  const isRefreshing = false;

  const handleAddTest = async () => {
    const testData = [
      { id: 1, name: '테스트 커튼 1', price: '50000' },
      { id: 2, name: '테스트 커튼 2', price: '75000' },
    ];

    // const success = await updateData(testData);
    const success = true; // 임시
    if (success) {
      // triggerRefresh();
      alert('데이터 업데이트 성공!');
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🔄 실시간 동기화 테스트</h1>

      <button
        onClick={handleAddTest}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        disabled={isRefreshing}
      >
        {isRefreshing ? '업데이트 중...' : '테스트 데이터 추가'}
      </button>

      <div className="border p-4 rounded">
        <h2 className="font-bold">현재 커튼 데이터 ({data.length}개):</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}

export default function TestSyncPage() {
  return (
    // <DataSyncProvider>
    <TestContent />
    // </DataSyncProvider>
  );
}

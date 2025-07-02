'use client';

import React, { createContext, useContext, useState } from 'react';

interface DataSyncContextType {
  lastUpdate: string;
  triggerRefresh: () => void;
  isRefreshing: boolean;
}

const DataSyncContext = createContext<DataSyncContextType | undefined>(
  undefined
);

export function useDataSync() {
  const context = useContext(DataSyncContext);
  if (!context) {
    throw new Error('useDataSync must be used within DataSyncProvider');
  }
  return context;
}

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const [lastUpdate, setLastUpdate] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setLastUpdate(new Date().toISOString());

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <DataSyncContext.Provider
      value={{ lastUpdate, triggerRefresh, isRefreshing }}
    >
      {children}
    </DataSyncContext.Provider>
  );
}

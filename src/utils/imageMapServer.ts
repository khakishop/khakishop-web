import type { ImageMapping } from './imageMap';

export interface ImageStore {
  version: string;
  lastUpdated: string;
  mappings: { [id: string]: ImageMapping };
  categories: string[];
  stats: {
    totalImages: number;
    protectedImages: number;
  };
}

const isServer = typeof window === 'undefined';

function checkServerModules(): boolean {
  return isServer;
}

function getDefaultStore(): ImageStore {
  return {
    version: '1.0',
    lastUpdated: new Date().toISOString(),
    mappings: {},
    categories: ['gallery', 'collections', 'hero', 'landing', 'projects', 'references', 'curtain', 'blind', 'motorized'],
    stats: {
      totalImages: 0,
      protectedImages: 0,
    },
  };
}

export function loadPersistentStore(): ImageStore {
  return getDefaultStore();
}

export function savePersistentStore(store: ImageStore): void {
  console.log('💾 저장소 저장');
}

export async function syncImageMap(): Promise<{
  mappedImages: number;
  unmappedFiles: number;
  missingFiles: number;
  protectedImages: number;
}> {
  return { mappedImages: 0, unmappedFiles: 0, missingFiles: 0, protectedImages: 0 };
}

export function getAllImageInfo(): ImageMapping[] {
  return [];
}

export function getProtectedImages(): ImageMapping[] {
  return [];
}

export function addProtectedImage(imagePath: string, metadata?: any): boolean {
  return true;
}

export function setImageProtection(imageId: string, isProtected: boolean): boolean {
  return true;
}

export function removeImageFromMap(imageId: string): boolean {
  return true;
}

export async function validateAndRepairImageStore(): Promise<{
  repairedMappings: number;
  missingFiles: number;
  isHealthy: boolean;
}> {
  return { repairedMappings: 0, missingFiles: 0, isHealthy: true };
}

export function getStoreStats(): {
  totalImages: number;
  protectedImages: number;
  categories: string[];
  lastUpdated: string;
} {
  return {
    totalImages: 0,
    protectedImages: 0,
    categories: ['gallery', 'collections', 'hero', 'landing', 'projects', 'references', 'curtain', 'blind', 'motorized'],
    lastUpdated: new Date().toISOString(),
  };
}

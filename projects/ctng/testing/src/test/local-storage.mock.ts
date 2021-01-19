export class LocalStorageMock {
  setItem(key: string, value: any): void {
    throw new Error('Method not implemented.');
  }
  getItem(key: string) {
    return 'mock-item';
  }
  key(index: number): string {
    throw new Error('Method not implemented.');
  }
  clear(): void {
    throw new Error('Method not implemented.');
  }
  removeItem(key: string): void {
    throw new Error('Method not implemented.');
  }
}

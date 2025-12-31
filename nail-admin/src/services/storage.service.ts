class StorageService {
  private prefix = "nail_admin_";

  set<T>(key: string, value: T): void {
    const serialized = JSON.stringify(value);
    localStorage.setItem(this.prefix + key, serialized);
  }

  get<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(this.prefix + key);
    if (!item) return defaultValue;
    try {
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key));
  }
}

export const storage = new StorageService();

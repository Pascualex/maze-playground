export class List<T> {
  private storage: T[];

  constructor() {
    this.storage = new Array<T>();
  }

  public clear(): void {
    this.storage.length = 0;
  }

  public add(value: T): void {
    this.storage.push(value);
  }

  public get(index: number): T | null {
    if (index < 0 || index >= this.storage.length) return null;
    return this.storage[index];
  }

  public size(): number {
    return this.storage.length;
  }

  public isEmpty(): boolean {
    return this.storage.length == 0;
  }
}
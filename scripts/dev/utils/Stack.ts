export class Stack<T> {
  private storage: T[];

  constructor() {
    this.storage = new Array<T>();
  }

  public clear(): void {
    this.storage.length = 0;
  }

  public push(element: T): void {
    this.storage.push(element);
  }

  public pop(): T | null {
    const element: T | undefined = this.storage.pop();
    if (element == undefined) return null;
    return element;
  }

  public size(): number {
    return this.storage.length;
  }

  public isEmpty(): boolean {
    return this.storage.length == 0;
  }
}
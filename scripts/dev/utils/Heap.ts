export class Heap<T extends HeapElement> {
  private storage: T[];

  constructor() {
    this.storage = [];
  }

  public push(element: T): void {
    this.storage.push(element);
    this.bubbleUp(this.storage.length - 1);
  }

  public pop(): T | null {
    const result: T = this.storage[0];
    const end: T | undefined = this.storage.pop();
    if (end == undefined) return null;
    if (this.storage.length > 0) {
      this.storage[0] = end;
      this.sinkDown(0);
    }
    return result;
  }

  public size(): number {
    return this.storage.length;
  }

  public isEmpty(): boolean {
    return this.storage.length == 0;
  }

  public clear(): void {
    this.storage.length = 0;
  }

  private bubbleUp(index: number) {
    const element: T = this.storage[index];
    while (index > 0) {
      const parentIndex = Math.floor((index + 1) / 2) - 1;
      const parent = this.storage[parentIndex];
      if (element.compare(parent) >= 0) break;
      this.storage[parentIndex] = element;
      this.storage[index] = parent;
      index = parentIndex;
    }
  }

  private sinkDown(index: number) {
    const length: number = this.storage.length;
    const element: T = this.storage[index];
    let swap: number | null = null;
    do {
      const child2Index: number = (index + 1) * 2;
      const child1Index: number = child2Index - 1;
      let child1: T | null = null;
      swap = null;

      if (child1Index < length) {
        child1 = this.storage[child1Index];
        if (child1.compare(element) < 0) swap = child1Index;
      }

      if (child2Index < length) {
        const child2: T = this.storage[child2Index];
        if (child2.compare(child1 == null ? element : child1) < 0) {
          swap = child2Index;
        }
      }

      if (swap != null) {
        this.storage[index] = this.storage[swap];
        this.storage[swap] = element;
        index = swap;
      }
    } while (swap != null);
  }
} 

abstract class HeapElement {
  public abstract compare(other: HeapElement): number;
}
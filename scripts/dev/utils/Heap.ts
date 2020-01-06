export class Heap<T> {
  private storage: T[];
  private scoreFunction: ((x: T) => number);

  constructor(scoreFunction: ((x: T) => number)) {
    this.storage = [];
    this.scoreFunction = scoreFunction;
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
    const score: number = this.scoreFunction(element);
    while (index > 0) {
      const parentIndex = Math.floor((index + 1) / 2) - 1;
      const parent = this.storage[parentIndex];
      if (score >= this.scoreFunction(parent)) break;
      this.storage[parentIndex] = element;
      this.storage[index] = parent;
      index = parentIndex;
    }
  }

  private sinkDown(index: number) {
    const length: number = this.storage.length;
    const element: T = this.storage[index];
    const elementScore: number = this.scoreFunction(element);
    let swap: number | null = null;
    do {
      const child2Index: number = (index + 1) * 2;
      const child1Index: number = child2Index - 1;
      swap = null;
      let child1Score: number | null = null;

      if (child1Index < length) {
        const child1: T = this.storage[child1Index];
        child1Score = this.scoreFunction(child1);
        if (child1Score < elementScore) swap = child1Index;
      }

      if (child2Index < length) {
        const child2: T = this.storage[child2Index];
        const child2Score: number = this.scoreFunction(child2);
        if (child2Score < (child1Score == null ? elementScore : child1Score)) {
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
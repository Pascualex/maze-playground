export class Queue<T> {
  private storage: T[];

  constructor() {
    this.storage = new Array<T>();
  }

  public clear(): void {
    this.storage.length = 0;
  }

  public enqueue(value: T): void {
    this.storage.push(value);
  }

  public dequeue(): T | null {
    const value: T | undefined = this.storage.shift();
    if (value == undefined) return null;
    return value;
  }

  public size(): number {
    return this.storage.length;
  }

  public isEmpty(): boolean {
    return this.storage.length == 0;
  }

  public shuffle(): void {
    let currentIndex: number = this.storage.length;
  
    while (0 != currentIndex) {
      let randomIndex: number = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      let aux: T = this.storage[currentIndex];
      this.storage[currentIndex] = this.storage[randomIndex];
      this.storage[randomIndex] = aux;
    }
  }
}
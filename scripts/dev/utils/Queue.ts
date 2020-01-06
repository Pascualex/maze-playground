export class Queue<T> {
  private storage: T[];

  constructor() {
    this.storage = new Array<T>();
  }

  public clear(): void {
    this.storage.length = 0;
  }

  public enqueue(element: T): void {
    this.storage.push(element);
  }

  public dequeue(): T | null {
    const element: T | undefined = this.storage.shift();
    if (element == undefined) return null;
    return element;
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
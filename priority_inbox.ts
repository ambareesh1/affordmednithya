import axios from "axios";

interface Notification {
  ID: string;
  Type: "Event" | "Result" | "Placement";
  Message: string;
  Timestamp: string;
}

const WEIGHTS: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function getPriority(n: Notification): number {
  const weight = WEIGHTS[n.Type] || 0;
  const recency = new Date(n.Timestamp).getTime();
  return weight * 1_000_000_000_000 + recency;
}

class MaxHeap {
  private heap: Notification[] = [];

  private parent(i: number) {
    return Math.floor((i - 1) / 2);
  }
  private left(i: number) {
    return 2 * i + 1;
  }
  private right(i: number) {
    return 2 * i + 2;
  }

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private siftUp(i: number) {
    while (i > 0 && getPriority(this.heap[i]) > getPriority(this.heap[this.parent(i)])) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  private siftDown(i: number) {
    let max = i;
    const l = this.left(i);
    const r = this.right(i);
    if (l < this.heap.length && getPriority(this.heap[l]) > getPriority(this.heap[max])) max = l;
    if (r < this.heap.length && getPriority(this.heap[r]) > getPriority(this.heap[max])) max = r;
    if (max !== i) {
      this.swap(i, max);
      this.siftDown(max);
    }
  }

  push(n: Notification) {
    this.heap.push(n);
    this.siftUp(this.heap.length - 1);
  }

  pop(): Notification | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  size(): number {
    return this.heap.length;
  }
}

function getTopN(notifications: Notification[], n: number): Notification[] {
  const heap = new MaxHeap();
  for (const notification of notifications) {
    heap.push(notification);
  }
  const result: Notification[] = [];
  for (let i = 0; i < n && heap.size() > 0; i++) {
    const top = heap.pop();
    if (top) result.push(top);
  }
  return result;
}

async function fetchAllNotifications(): Promise<Notification[]> {
  const token = process.env.AUTH_TOKEN;
  const response = await axios.get("http://4.224.186.213/evaluation-service/notifications", {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit: 100, page: 1 },
  });
  return response.data.notifications || response.data || [];
}

async function main() {
  const notifications = await fetchAllNotifications();
  const top10 = getTopN(notifications, 10);
  console.log(JSON.stringify(top10, null, 2));
}

main();

import _ from 'lodash';
import Heap from 'heap-js';
import fs from 'fs';

interface Node<T> {
    id: string;
    vector: T;
    data: any;
    neighbors: Array<string | null>;
    level: number;
  }

interface Config {
  maxLevel: number;
  neighborSize: number;
  efConstruction: number;
}

type DistanceFunction<T> = (a: T, b: T) => number;

class HNSW<T> {
  public nodes: Map<string, Node<T>>;
  public config: Config;
  public distanceFunction: DistanceFunction<T>;

  constructor(config: Config, distanceFunction: DistanceFunction<T>) {
    this.config = config;
    this.distanceFunction = distanceFunction;
    this.nodes = new Map<string, Node<T>>();
  }


  public addNode(id: string, vector: T, data: any = {}): void {
    const level = this.getRandomLevel();
    const node: Node<T> = {
      id,
      vector,
      data,
      neighbors: new Array(this.config.maxLevel).fill(null),
      level,
    };
    this.nodes.set(id,node);
    this.addToGraph(node, level);
  }

  private addToGraph(node: Node<T>, level: number): void {
    if (level === 0) {
      return;
    }

    const neighbors = this.getNeighbors(node, level - 1);
    const heap = new Heap<{ id: string; distance: number }>((a, b) =>
      a.distance - b.distance
    );

    for (const neighborId of neighbors) {
      const neighbor = this.nodes.get(neighborId);
      const distance = this.distanceFunction(node.vector, neighbor.vector);
      heap.push({ id: neighborId, distance });

      if (heap.size() > this.config.efConstruction) {
        heap.pop();
      }
    }

    for (let i = heap.size() - 1; i >= 0; i--) {
      const neighborId = heap.peek()?.id as string;
      const neighbor = this.nodes.get(neighborId);
      node.neighbors[level - 1] = neighborId;
      neighbor.neighbors[level] = node.id;
    }
  }

  private getRandomLevel(): number {
    let level = 0;
    while (Math.random() < 0.5 && level < this.config.maxLevel - 1) {
      level++;
    }
    return level;
  }

  private getNeighbors(node: Node<T>, level: number): string[] {
    if (level === 0) {
      return [];
    }
  
    const neighbors = [];
    let neighborId = node.neighbors[level - 1];
    while (neighborId !== null) {
      neighbors.push(neighborId);
      let neighbor = this.nodes.get(neighborId);
      neighborId = neighbor ? neighbor.neighbors[level - 1] : null;
    }
    return neighbors;
  }

  public getDistance(a: T, b: T): number {
    return this.distanceFunction(a, b);
  }
}



interface VectorDatabase<T> {
  add(id: string, vector: T): void;
  search(query: T, k: number): string[];
}

interface HNSWIndex<T> {
  nodes: any;
  config: Config;
}

class HNSWVectorDatabase<T> implements VectorDatabase<T> {
  private readonly index: HNSW<T>;
  private readonly indexPath: string;

  constructor(indexPath: string, distanceFunction: DistanceFunction<T>) {
    this.indexPath = indexPath;
    try {
      const data = fs.readFileSync(indexPath, 'utf-8');
      const index: HNSWIndex<T> = JSON.parse(data);
      this.index = new HNSW<T>(index.config, distanceFunction);
      this.index.nodes = new Map(Object.entries(index.nodes));
    } catch (err) {
      this.index = new HNSW<T>({
        maxLevel: 6,
        neighborSize: 32,
        efConstruction: 200,
      }, distanceFunction);
    }
  }

  public add(id: string, vector: T, data: any = {content: 'random'}): void {
    this.index.addNode(id, vector, data);
    this.saveIndex();
  }
  private compareArrays(arr1: any[], arr2: any[]): boolean {
    if (arr1.length < 2 || arr2.length < 2) {
      return false; // Arrays must have at least two elements to compare the first two
    }
    const firstTwo1 = arr1.slice(0, 2);
    const firstTwo2 = arr2.slice(0, 2);
    return firstTwo1.every((val, index) => val === firstTwo2[index]);
  }
  public searchData(query: Partial<{ [key in keyof T]: T[key] }>, k: number): any[] {
    const result: Node<T>[] = [];
    this.index.nodes.forEach((node,id) => {
      if (this.isMatch(node.data, query)) {
        result.push(node.data);
      }
    })
    return result.slice(0, k);
  }
  private isMatch(data: any, query: Partial<{ [key in keyof T]: T[key] }>): boolean {
    for (const key in query) {
      if (Array.isArray(query[key])) return this.compareArrays(query[key] as any[], data[key])
      if (data && query[key] !== undefined && data[key] !== query[key]) {
        return false;
      }
    }
    return true;
  }

  public search(query: T, k: number): string[] {
    const distances = new Heap<{ id: string; distance: number; data: any }>((a, b) =>
      b.distance - a.distance
    );
    this.index.nodes.forEach((node, id) => {
      const distance = this.index.getDistance(query, node.vector);
      distances.push({ id, distance, data: node.data });
      if (distances.size() > k) {
        distances.pop();
      }
    });
    return distances
      .toArray()
      .reverse()
      .map((item) => item.data);
  }
  public delete(id: string) {
    let k = this.index.nodes.get(id)
    this.index.nodes.delete(id)
    this.saveIndex()
    return {events: k.data}
  }
  private saveIndex(): void {
    const index: HNSWIndex<T> = {
      nodes: Object.fromEntries(this.index.nodes),
      config: this.index.config,
    };
    fs.writeFileSync(this.indexPath, JSON.stringify(index));
  }
}

function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2);
  }
  return Math.sqrt(sum);
}


export default HNSWVectorDatabase
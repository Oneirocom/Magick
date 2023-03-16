import _ from 'lodash';
import Heap from 'heap-js';
import fs from 'fs';

interface Node<T> {
    id: string;
    vector: T;
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
  public nodes: Node<T>[] = [];
  public config: Config;
  public distanceFunction: DistanceFunction<T>;

  constructor(config: Config, distanceFunction: DistanceFunction<T>) {
    this.config = config;
    this.distanceFunction = distanceFunction;
  }

  public addNode(id: string, vector: T): void {
    const level = this.getRandomLevel();
    const node: Node<T> = {
      id,
      vector,
      neighbors: new Array(this.config.maxLevel).fill(null),
      level,
    };
    this.nodes.push(node);
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
      const neighbor = this.nodes[neighborId];
      const distance = this.distanceFunction(node.vector, neighbor.vector);
      heap.push({ id: neighborId, distance });

      if (heap.size() > this.config.efConstruction) {
        heap.pop();
      }
    }

    for (let i = heap.size() - 1; i >= 0; i--) {
      const neighborId = heap.peek()?.id as string;
      const neighbor = this.nodes[neighborId];
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
      neighborId = this.nodes.find((n) => n.id === neighborId)?.neighbors[level - 1] || null;
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
  nodes: Node<T>[];
  config: Config;
}

class HNSWVectorDatabase<T> implements VectorDatabase<T> {
  private readonly index: HNSW<T>;
  private readonly vectors: Map<string, T> = new Map<string, T>();
  private readonly indexPath: string;

  constructor(indexPath: string, distanceFunction: DistanceFunction<T>) {
    this.indexPath = indexPath;
    try {
      const data = fs.readFileSync(indexPath, 'utf-8');
      const index: HNSWIndex<T> = JSON.parse(data);
      this.index = new HNSW<T>(index.config, distanceFunction);
      this.index.nodes = index.nodes;
      for (const node of index.nodes) {
        this.vectors.set(node.id, node.vector);
      }
    } catch (err) {
      this.index = new HNSW<T>({
        maxLevel: 6,
        neighborSize: 32,
        efConstruction: 200,
      }, distanceFunction);
    }
  }

  public add(id: string, vector: T): void {
    this.index.addNode(id, vector);
    this.vectors.set(id, vector);
    this.saveIndex();
  }

  public search(query: T, k: number): string[] {
    const distances = new Heap<{ id: string; distance: number }>((a, b) =>
      b.distance - a.distance
    );
    for (const [id, vector] of this.vectors.entries()) {
      const distance = this.index.getDistance(query, vector);
      distances.push({ id, distance });
      if (distances.size() > k) {
        distances.pop();
      }
    }
    return distances
      .toArray()
      .reverse()
      .map((item) => item.id);
  }

  private saveIndex(): void {
    const index: HNSWIndex<T> = {
      nodes: this.index.nodes,
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
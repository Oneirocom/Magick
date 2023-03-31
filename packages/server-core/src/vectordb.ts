// DOCUMENTED 
import fs from 'fs';
import Heap from 'heap-js';

/**
 * Interface for HNSW node representation
 */
interface Node<T> {
  id: string;
  vector: T;
  data: any;
  neighbors: Array<string | null>;
  level: number;
}

/**
 * Interface for HNSW configuration options
 */
interface Config {
  maxLevel: number;
  neighborSize: number;
  efConstruction: number;
}

/**
 * Type alias for the distance function
 */
type DistanceFunction<T> = (a: T, b: T) => number;

/**
 * Hierarchical Navigable Small World (HNSW) implementation
 */
class HNSW<T> {
  public nodes: Map<string, Node<T>>;
  public config: Config;
  public distanceFunction: DistanceFunction<T>;

  /**
   * HNSW constructor
   * @param {Config} config - Configuration options for HNSW
   * @param {DistanceFunction<T>} distanceFunction - The distance function to compare vectors
   */
  constructor(config: Config, distanceFunction: DistanceFunction<T>) {
    this.config = config;
    this.distanceFunction = distanceFunction;
    this.nodes = new Map<string, Node<T>>();
  }

  /**
   * Adds a new node to the HNSW graph
   * @param {string} id - The unique identifier of the node
   * @param {T} vector - The feature vector of the node
   * @param {any} data - Additional data associated with the node
   */
  public addNode(id: string, vector: T, data: any = {}): void {
    const level = this.getRandomLevel();
    const node: Node<T> = {
      id,
      vector,
      data,
      neighbors: new Array(this.config.maxLevel).fill(null),
      level,
    };
    this.nodes.set(id, node);
    this.addToGraph(node, level);
  }

  /**
   * Adds a node to the graph at the specified level
   * @param {Node<T>} node - The node to add to the graph
   * @param {number} level - The level to add the node at
   */
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

  /**
   * Randomly generates a level for a new node
   * @returns {number} The randomly generated level
   */
  private getRandomLevel(): number {
    let level = 0;
    while (Math.random() < 0.5 && level < this.config.maxLevel - 1) {
      level++;
    }
    return level;
  }

  /**
   * Get neighbors of a node at the specified level
   * @param {Node<T>} node - The node to get neighbors for
   * @param {number} level - The level to get neighbors at
   * @returns {string[]} A list of neighbor ids
   */
  private getNeighbors(node: Node<T>, level: number): string[] {
    if (level === 0) {
      return [];
    }
  
    const neighbors = [];
    let neighborId = node.neighbors[level - 1];
    while (neighborId !== null) {
      neighbors.push(neighborId);
      const neighbor = this.nodes.get(neighborId);
      neighborId = neighbor ? neighbor.neighbors[level - 1] : null;
    }
    return neighbors;
  }

  /**
   * Calculate the distance between two vectors
   * @param {T} a - The first vector
   * @param {T} b - The second vector
   * @returns {number} The distance between the two vectors
   */
  public getDistance(a: T, b: T): number {
    return this.distanceFunction(a, b);
  }
}

/**
 * Interface for vector database functionality
 */
interface VectorDatabase<T> {
  add(id: string, vector: T): void;
  search(query: T, k: number): string[];
}

/**
 * Interface for HNSW index representation
 */
interface HNSWIndex<T> {
  nodes: any;
  config: Config;
}

/**
 * HNSW vector database implementation
 */
class HNSWVectorDatabase<T> implements VectorDatabase<T> {
  private readonly index: HNSW<T>;
  private readonly indexPath: string;

  /**
   * HNSWVectorDatabase constructor
   * @param {string} indexPath - The path to store the index file
   * @param {DistanceFunction<T>} distanceFunction - The distance function to compare vectors
   */
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

  /**
   * Adds an item to the database
   * @param {string} id - The unique identifier of the item
   * @param {T} vector - The feature vector of the item
   * @param {any} data - Additional data associated with the item
   */
  public add(id: string, vector: T, data: any = {content: 'random'}): void {
    this.index.addNode(id, vector, data);
    this.saveIndex();
  }

  /**
   * Compares the first two elements of two arrays
   * @param {any[]} arr1 - The first array
   * @param {any[]} arr2 - The second array
   * @returns {boolean} True if the first two elements of both arrays are equal, false otherwise
   */
  private compareArrays(arr1: any[], arr2: any[]): boolean {
    if (arr1.length < 2 || arr2.length < 2) {
      return false; // Arrays must have at least two elements to compare the first two
    }
    const firstTwo1 = arr1.slice(0, 2);
    const firstTwo2 = arr2.slice(0, 2);
    return firstTwo1.every((val, index) => val === firstTwo2[index]);
  }

  /**
   * Search data using partial matches of object keys
   * @param {Partial<{ [key in keyof T]: T[key] }>} query - The query object to match against stored data
   * @param {number} k - The maximum number of results to return
   * @returns {any[]} A list of matched data up to the specified maximum results
   */
  public searchData(query: Partial<{ [key in keyof T]: T[key] }>, k: number): any[] {
    const result: Node<T>[] = [];
    this.index.nodes.forEach((node,id) => {
      if (this.isMatch(node.data, query)) {
        result.push(node.data);
      }
    })
    return result.slice(0, k);
  }

  /**
   * Checks if data matches a given query object
   * @param {any} data - The data object to match against the query
   * @param {Partial<{ [key in keyof T]: T[key] }>}</param query - The query object to match against stored data
   * @returns {boolean} True if the data object matches the query, false otherwise
   */
  private isMatch(data: any, query: Partial<{ [key in keyof T]: T[key] }>): boolean {
    for (const key in query) {
      if (Array.isArray(query[key])) return this.compareArrays(query[key] as any[], data[key])
      if (data && query[key] !== undefined && data[key] !== query[key]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Search vectors for k closest items to the query vector
   * @param {T} query - The query vector to search for
   * @param {number} k - The maximum number of closest items to return
   * @returns {string[]} A list of closest item ids
   */
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

  /**
   * Deletes an item from the database
   * @param {string} id - The unique identifier of the item to delete
   * @returns {{events: any}} The removed item's data
   */
  public delete(id: string) {
    const k = this.index.nodes.get(id)
    this.index.nodes.delete(id)
    this.saveIndex()
    return { events: k?.data }
  }

  /**
   * Saves the current index to a file
   */
  private saveIndex(): void {
    const index: HNSWIndex<T> = {
      nodes: Object.fromEntries(this.index.nodes),
      config: this.index.config,
    };
    fs.writeFileSync(this.indexPath, JSON.stringify(index));
  }
}

/**
 * Calculates the Euclidean distance between two vectors
 * @param {number[]} a - The first vector
 * @param {number[]} b - The second vector
 * @returns {number} The Euclidean distance between the two vectors
 */
function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2);
  }
  return Math.sqrt(sum);
}

export default HNSWVectorDatabase;
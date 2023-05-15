// DOCUMENTED 
import { Connection, Input, Node, Output } from 'rete';

/**
 * Namespace for interfaces related to Rete Editor events.
 */
export namespace ReteEventInterfaces {

  /**
   * Interface for handling node creation event.
   */
  export interface OnCreated {
    created(node: Node): void;
  }

  /**
   * Interface for handling node destruction event.
   */
  export interface OnDestroyed {
    destroyed(node: Node): void;
  }

  /**
   * Interface for handling node input/output connection event.
   */
  export interface OnConnect {
    onconnect(io: Input | Output): boolean;
  }

  /**
   * Interface for handling input/output connection event.
   */
  export interface OnConnected {
    connected(io: Connection): void;
  }

  /**
   * Interface for handling input/output disconnection event.
   */
  export interface OnDisconnect {
    ondisconnect(io: Connection): boolean;
  }

  /**
   * Interface for handling input/output disconnection event.
   */
  export interface OnDisconnected {
    disconnected(io: Connection): void;
  }
}

/**
 * Type definition for OnCreated interface.
 */
type OnCreated = ReteEventInterfaces.OnCreated;

/**
 * Type definition for OnDestroyed interface.
 */
type OnDestroyed = ReteEventInterfaces.OnDestroyed;

/**
 * Type definition for OnConnect interface.
 */
type OnConnect = ReteEventInterfaces.OnConnect;

/**
 * Type definition for OnConnected interface.
 */
type OnConnected = ReteEventInterfaces.OnConnected;

/**
 * Type definition for OnDisconnect interface.
 */
type OnDisconnect = ReteEventInterfaces.OnDisconnect;

/**
 * Type definition for OnDisconnected interface.
 */
type OnDisconnected = ReteEventInterfaces.OnDisconnected;

/**
 * Export interfaces and types.
 */
export {
  OnCreated,
  OnDestroyed,
  OnConnect,
  OnConnected,
  OnDisconnect,
  OnDisconnected,
};

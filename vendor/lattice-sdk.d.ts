// Types for the part of lattice-sdk.js this site uses; the full types are the
// SDK's own (packages/client/src/chain-nodes.ts).

export type Fetch = (input: string | URL, init?: RequestInit) => Promise<Response>;

export class ChainOfflineError extends Error {
  readonly chainPath: readonly string[];
  constructor(chainPath: readonly string[]);
}

export interface ChainNode {
  readonly url: string;
  readonly found: boolean;
}

export interface ChainNodesOptions {
  readonly fetch?: Fetch;
  readonly ttlMilliseconds?: number;
  readonly timeoutMilliseconds?: number;
  readonly now?: () => number;
}

export class ChainNodes {
  readonly startURL: string;
  constructor(startURL: string, options?: ChainNodesOptions);
  list(chainPath: readonly string[]): Promise<ChainNode[]>;
  read<T>(chainPath: readonly string[], read: (node: ChainNode) => Promise<T>): Promise<T>;
}

// Types for the part of lattice-sdk.js this site uses; the full types are the
// SDK's own (packages/client/src/node-finder.ts).

export type Fetch = (input: string | URL, init?: RequestInit) => Promise<Response>;

export class ChainOfflineError extends Error {
  readonly chainPath: readonly string[];
  constructor(chainPath: readonly string[]);
}

export interface ChainNode {
  readonly url: string;
  readonly found: boolean;
}

export interface ChainNodeFinderOptions {
  readonly fetch?: Fetch;
  readonly ttlMilliseconds?: number;
  readonly timeoutMilliseconds?: number;
  readonly now?: () => number;
}

export class ChainNodeFinder {
  readonly startURL: string;
  constructor(startURL: string, options?: ChainNodeFinderOptions);
  serves(url: string, chainPath: readonly string[], signal?: AbortSignal): Promise<boolean>;
  nodeFor(chainPath: readonly string[]): Promise<ChainNode>;
  forget(chainPath: readonly string[], node: ChainNode): Promise<void>;
}

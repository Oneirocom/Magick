
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model agent_credentials
 * 
 */
export type agent_credentials = $Result.DefaultSelection<Prisma.$agent_credentialsPayload>
/**
 * Model agents
 * 
 */
export type agents = $Result.DefaultSelection<Prisma.$agentsPayload>
/**
 * Model chatMessages
 * 
 */
export type chatMessages = $Result.DefaultSelection<Prisma.$chatMessagesPayload>
/**
 * Model credentials
 * 
 */
export type credentials = $Result.DefaultSelection<Prisma.$credentialsPayload>
/**
 * Model documents
 * 
 */
export type documents = $Result.DefaultSelection<Prisma.$documentsPayload>
/**
 * Model embeddings
 * 
 */
export type embeddings = $Result.DefaultSelection<Prisma.$embeddingsPayload>
/**
 * Model public_events
 * 
 */
export type public_events = $Result.DefaultSelection<Prisma.$public_eventsPayload>
/**
 * Model graphEvents
 * 
 */
export type graphEvents = $Result.DefaultSelection<Prisma.$graphEventsPayload>
/**
 * Model public_knex_migrations
 * 
 */
export type public_knex_migrations = $Result.DefaultSelection<Prisma.$public_knex_migrationsPayload>
/**
 * Model public_knex_migrations_lock
 * 
 */
export type public_knex_migrations_lock = $Result.DefaultSelection<Prisma.$public_knex_migrations_lockPayload>
/**
 * Model knowledge
 * 
 */
export type knowledge = $Result.DefaultSelection<Prisma.$knowledgePayload>
/**
 * Model pluginState
 * 
 */
export type pluginState = $Result.DefaultSelection<Prisma.$pluginStatePayload>
/**
 * Model request
 * 
 */
export type request = $Result.DefaultSelection<Prisma.$requestPayload>
/**
 * Model spellReleases
 * 
 */
export type spellReleases = $Result.DefaultSelection<Prisma.$spellReleasesPayload>
/**
 * Model spells
 * 
 */
export type spells = $Result.DefaultSelection<Prisma.$spellsPayload>
/**
 * Model tasks
 * 
 */
export type tasks = $Result.DefaultSelection<Prisma.$tasksPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Agent_credentials
 * const agent_credentials = await prisma.agent_credentials.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Agent_credentials
   * const agent_credentials = await prisma.agent_credentials.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.agent_credentials`: Exposes CRUD operations for the **agent_credentials** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Agent_credentials
    * const agent_credentials = await prisma.agent_credentials.findMany()
    * ```
    */
  get agent_credentials(): Prisma.agent_credentialsDelegate<ExtArgs>;

  /**
   * `prisma.agents`: Exposes CRUD operations for the **agents** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Agents
    * const agents = await prisma.agents.findMany()
    * ```
    */
  get agents(): Prisma.agentsDelegate<ExtArgs>;

  /**
   * `prisma.chatMessages`: Exposes CRUD operations for the **chatMessages** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessages
    * const chatMessages = await prisma.chatMessages.findMany()
    * ```
    */
  get chatMessages(): Prisma.chatMessagesDelegate<ExtArgs>;

  /**
   * `prisma.credentials`: Exposes CRUD operations for the **credentials** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Credentials
    * const credentials = await prisma.credentials.findMany()
    * ```
    */
  get credentials(): Prisma.credentialsDelegate<ExtArgs>;

  /**
   * `prisma.documents`: Exposes CRUD operations for the **documents** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.documents.findMany()
    * ```
    */
  get documents(): Prisma.documentsDelegate<ExtArgs>;

  /**
   * `prisma.embeddings`: Exposes CRUD operations for the **embeddings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Embeddings
    * const embeddings = await prisma.embeddings.findMany()
    * ```
    */
  get embeddings(): Prisma.embeddingsDelegate<ExtArgs>;

  /**
   * `prisma.public_events`: Exposes CRUD operations for the **public_events** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Public_events
    * const public_events = await prisma.public_events.findMany()
    * ```
    */
  get public_events(): Prisma.public_eventsDelegate<ExtArgs>;

  /**
   * `prisma.graphEvents`: Exposes CRUD operations for the **graphEvents** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GraphEvents
    * const graphEvents = await prisma.graphEvents.findMany()
    * ```
    */
  get graphEvents(): Prisma.graphEventsDelegate<ExtArgs>;

  /**
   * `prisma.public_knex_migrations`: Exposes CRUD operations for the **public_knex_migrations** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Public_knex_migrations
    * const public_knex_migrations = await prisma.public_knex_migrations.findMany()
    * ```
    */
  get public_knex_migrations(): Prisma.public_knex_migrationsDelegate<ExtArgs>;

  /**
   * `prisma.public_knex_migrations_lock`: Exposes CRUD operations for the **public_knex_migrations_lock** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Public_knex_migrations_locks
    * const public_knex_migrations_locks = await prisma.public_knex_migrations_lock.findMany()
    * ```
    */
  get public_knex_migrations_lock(): Prisma.public_knex_migrations_lockDelegate<ExtArgs>;

  /**
   * `prisma.knowledge`: Exposes CRUD operations for the **knowledge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Knowledges
    * const knowledges = await prisma.knowledge.findMany()
    * ```
    */
  get knowledge(): Prisma.knowledgeDelegate<ExtArgs>;

  /**
   * `prisma.pluginState`: Exposes CRUD operations for the **pluginState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PluginStates
    * const pluginStates = await prisma.pluginState.findMany()
    * ```
    */
  get pluginState(): Prisma.pluginStateDelegate<ExtArgs>;

  /**
   * `prisma.request`: Exposes CRUD operations for the **request** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Requests
    * const requests = await prisma.request.findMany()
    * ```
    */
  get request(): Prisma.requestDelegate<ExtArgs>;

  /**
   * `prisma.spellReleases`: Exposes CRUD operations for the **spellReleases** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SpellReleases
    * const spellReleases = await prisma.spellReleases.findMany()
    * ```
    */
  get spellReleases(): Prisma.spellReleasesDelegate<ExtArgs>;

  /**
   * `prisma.spells`: Exposes CRUD operations for the **spells** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Spells
    * const spells = await prisma.spells.findMany()
    * ```
    */
  get spells(): Prisma.spellsDelegate<ExtArgs>;

  /**
   * `prisma.tasks`: Exposes CRUD operations for the **tasks** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.tasks.findMany()
    * ```
    */
  get tasks(): Prisma.tasksDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.9.1
   * Query Engine version: 23fdc5965b1e05fc54e5f26ed3de66776b93de64
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    agent_credentials: 'agent_credentials',
    agents: 'agents',
    chatMessages: 'chatMessages',
    credentials: 'credentials',
    documents: 'documents',
    embeddings: 'embeddings',
    public_events: 'public_events',
    graphEvents: 'graphEvents',
    public_knex_migrations: 'public_knex_migrations',
    public_knex_migrations_lock: 'public_knex_migrations_lock',
    knowledge: 'knowledge',
    pluginState: 'pluginState',
    request: 'request',
    spellReleases: 'spellReleases',
    spells: 'spells',
    tasks: 'tasks'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'agent_credentials' | 'agents' | 'chatMessages' | 'credentials' | 'documents' | 'embeddings' | 'public_events' | 'graphEvents' | 'public_knex_migrations' | 'public_knex_migrations_lock' | 'knowledge' | 'pluginState' | 'request' | 'spellReleases' | 'spells' | 'tasks'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      agent_credentials: {
        payload: Prisma.$agent_credentialsPayload<ExtArgs>
        fields: Prisma.agent_credentialsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.agent_credentialsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agent_credentialsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.agent_credentialsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agent_credentialsPayload>
          }
          findFirst: {
            args: Prisma.agent_credentialsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agent_credentialsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.agent_credentialsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agent_credentialsPayload>
          }
          findMany: {
            args: Prisma.agent_credentialsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agent_credentialsPayload>[]
          }
          create: {
            args: Prisma.agent_credentialsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agent_credentialsPayload>
          }
          createMany: {
            args: Prisma.agent_credentialsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.agent_credentialsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agent_credentialsPayload>
          }
          update: {
            args: Prisma.agent_credentialsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agent_credentialsPayload>
          }
          deleteMany: {
            args: Prisma.agent_credentialsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.agent_credentialsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.agent_credentialsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agent_credentialsPayload>
          }
          aggregate: {
            args: Prisma.Agent_credentialsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateAgent_credentials>
          }
          groupBy: {
            args: Prisma.agent_credentialsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Agent_credentialsGroupByOutputType>[]
          }
          count: {
            args: Prisma.agent_credentialsCountArgs<ExtArgs>,
            result: $Utils.Optional<Agent_credentialsCountAggregateOutputType> | number
          }
        }
      }
      agents: {
        payload: Prisma.$agentsPayload<ExtArgs>
        fields: Prisma.agentsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.agentsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agentsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.agentsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agentsPayload>
          }
          findFirst: {
            args: Prisma.agentsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agentsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.agentsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agentsPayload>
          }
          findMany: {
            args: Prisma.agentsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agentsPayload>[]
          }
          create: {
            args: Prisma.agentsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agentsPayload>
          }
          createMany: {
            args: Prisma.agentsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.agentsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agentsPayload>
          }
          update: {
            args: Prisma.agentsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agentsPayload>
          }
          deleteMany: {
            args: Prisma.agentsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.agentsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.agentsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$agentsPayload>
          }
          aggregate: {
            args: Prisma.AgentsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateAgents>
          }
          groupBy: {
            args: Prisma.agentsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<AgentsGroupByOutputType>[]
          }
          count: {
            args: Prisma.agentsCountArgs<ExtArgs>,
            result: $Utils.Optional<AgentsCountAggregateOutputType> | number
          }
        }
      }
      chatMessages: {
        payload: Prisma.$chatMessagesPayload<ExtArgs>
        fields: Prisma.chatMessagesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.chatMessagesFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$chatMessagesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.chatMessagesFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$chatMessagesPayload>
          }
          findFirst: {
            args: Prisma.chatMessagesFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$chatMessagesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.chatMessagesFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$chatMessagesPayload>
          }
          findMany: {
            args: Prisma.chatMessagesFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$chatMessagesPayload>[]
          }
          create: {
            args: Prisma.chatMessagesCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$chatMessagesPayload>
          }
          createMany: {
            args: Prisma.chatMessagesCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.chatMessagesDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$chatMessagesPayload>
          }
          update: {
            args: Prisma.chatMessagesUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$chatMessagesPayload>
          }
          deleteMany: {
            args: Prisma.chatMessagesDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.chatMessagesUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.chatMessagesUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$chatMessagesPayload>
          }
          aggregate: {
            args: Prisma.ChatMessagesAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateChatMessages>
          }
          groupBy: {
            args: Prisma.chatMessagesGroupByArgs<ExtArgs>,
            result: $Utils.Optional<ChatMessagesGroupByOutputType>[]
          }
          count: {
            args: Prisma.chatMessagesCountArgs<ExtArgs>,
            result: $Utils.Optional<ChatMessagesCountAggregateOutputType> | number
          }
        }
      }
      credentials: {
        payload: Prisma.$credentialsPayload<ExtArgs>
        fields: Prisma.credentialsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.credentialsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$credentialsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.credentialsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$credentialsPayload>
          }
          findFirst: {
            args: Prisma.credentialsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$credentialsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.credentialsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$credentialsPayload>
          }
          findMany: {
            args: Prisma.credentialsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$credentialsPayload>[]
          }
          create: {
            args: Prisma.credentialsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$credentialsPayload>
          }
          createMany: {
            args: Prisma.credentialsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.credentialsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$credentialsPayload>
          }
          update: {
            args: Prisma.credentialsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$credentialsPayload>
          }
          deleteMany: {
            args: Prisma.credentialsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.credentialsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.credentialsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$credentialsPayload>
          }
          aggregate: {
            args: Prisma.CredentialsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateCredentials>
          }
          groupBy: {
            args: Prisma.credentialsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<CredentialsGroupByOutputType>[]
          }
          count: {
            args: Prisma.credentialsCountArgs<ExtArgs>,
            result: $Utils.Optional<CredentialsCountAggregateOutputType> | number
          }
        }
      }
      documents: {
        payload: Prisma.$documentsPayload<ExtArgs>
        fields: Prisma.documentsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.documentsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$documentsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.documentsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$documentsPayload>
          }
          findFirst: {
            args: Prisma.documentsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$documentsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.documentsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$documentsPayload>
          }
          findMany: {
            args: Prisma.documentsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$documentsPayload>[]
          }
          create: {
            args: Prisma.documentsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$documentsPayload>
          }
          createMany: {
            args: Prisma.documentsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.documentsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$documentsPayload>
          }
          update: {
            args: Prisma.documentsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$documentsPayload>
          }
          deleteMany: {
            args: Prisma.documentsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.documentsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.documentsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$documentsPayload>
          }
          aggregate: {
            args: Prisma.DocumentsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateDocuments>
          }
          groupBy: {
            args: Prisma.documentsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<DocumentsGroupByOutputType>[]
          }
          count: {
            args: Prisma.documentsCountArgs<ExtArgs>,
            result: $Utils.Optional<DocumentsCountAggregateOutputType> | number
          }
        }
      }
      embeddings: {
        payload: Prisma.$embeddingsPayload<ExtArgs>
        fields: Prisma.embeddingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.embeddingsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$embeddingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.embeddingsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$embeddingsPayload>
          }
          findFirst: {
            args: Prisma.embeddingsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$embeddingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.embeddingsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$embeddingsPayload>
          }
          findMany: {
            args: Prisma.embeddingsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$embeddingsPayload>[]
          }
          create: {
            args: Prisma.embeddingsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$embeddingsPayload>
          }
          createMany: {
            args: Prisma.embeddingsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.embeddingsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$embeddingsPayload>
          }
          update: {
            args: Prisma.embeddingsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$embeddingsPayload>
          }
          deleteMany: {
            args: Prisma.embeddingsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.embeddingsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.embeddingsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$embeddingsPayload>
          }
          aggregate: {
            args: Prisma.EmbeddingsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateEmbeddings>
          }
          groupBy: {
            args: Prisma.embeddingsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<EmbeddingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.embeddingsCountArgs<ExtArgs>,
            result: $Utils.Optional<EmbeddingsCountAggregateOutputType> | number
          }
        }
      }
      public_events: {
        payload: Prisma.$public_eventsPayload<ExtArgs>
        fields: Prisma.public_eventsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.public_eventsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_eventsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.public_eventsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_eventsPayload>
          }
          findFirst: {
            args: Prisma.public_eventsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_eventsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.public_eventsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_eventsPayload>
          }
          findMany: {
            args: Prisma.public_eventsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_eventsPayload>[]
          }
          create: {
            args: Prisma.public_eventsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_eventsPayload>
          }
          createMany: {
            args: Prisma.public_eventsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.public_eventsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_eventsPayload>
          }
          update: {
            args: Prisma.public_eventsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_eventsPayload>
          }
          deleteMany: {
            args: Prisma.public_eventsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.public_eventsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.public_eventsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_eventsPayload>
          }
          aggregate: {
            args: Prisma.Public_eventsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregatePublic_events>
          }
          groupBy: {
            args: Prisma.public_eventsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Public_eventsGroupByOutputType>[]
          }
          count: {
            args: Prisma.public_eventsCountArgs<ExtArgs>,
            result: $Utils.Optional<Public_eventsCountAggregateOutputType> | number
          }
        }
      }
      graphEvents: {
        payload: Prisma.$graphEventsPayload<ExtArgs>
        fields: Prisma.graphEventsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.graphEventsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$graphEventsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.graphEventsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$graphEventsPayload>
          }
          findFirst: {
            args: Prisma.graphEventsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$graphEventsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.graphEventsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$graphEventsPayload>
          }
          findMany: {
            args: Prisma.graphEventsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$graphEventsPayload>[]
          }
          create: {
            args: Prisma.graphEventsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$graphEventsPayload>
          }
          createMany: {
            args: Prisma.graphEventsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.graphEventsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$graphEventsPayload>
          }
          update: {
            args: Prisma.graphEventsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$graphEventsPayload>
          }
          deleteMany: {
            args: Prisma.graphEventsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.graphEventsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.graphEventsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$graphEventsPayload>
          }
          aggregate: {
            args: Prisma.GraphEventsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateGraphEvents>
          }
          groupBy: {
            args: Prisma.graphEventsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<GraphEventsGroupByOutputType>[]
          }
          count: {
            args: Prisma.graphEventsCountArgs<ExtArgs>,
            result: $Utils.Optional<GraphEventsCountAggregateOutputType> | number
          }
        }
      }
      public_knex_migrations: {
        payload: Prisma.$public_knex_migrationsPayload<ExtArgs>
        fields: Prisma.public_knex_migrationsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.public_knex_migrationsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrationsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.public_knex_migrationsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrationsPayload>
          }
          findFirst: {
            args: Prisma.public_knex_migrationsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrationsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.public_knex_migrationsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrationsPayload>
          }
          findMany: {
            args: Prisma.public_knex_migrationsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrationsPayload>[]
          }
          create: {
            args: Prisma.public_knex_migrationsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrationsPayload>
          }
          createMany: {
            args: Prisma.public_knex_migrationsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.public_knex_migrationsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrationsPayload>
          }
          update: {
            args: Prisma.public_knex_migrationsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrationsPayload>
          }
          deleteMany: {
            args: Prisma.public_knex_migrationsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.public_knex_migrationsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.public_knex_migrationsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrationsPayload>
          }
          aggregate: {
            args: Prisma.Public_knex_migrationsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregatePublic_knex_migrations>
          }
          groupBy: {
            args: Prisma.public_knex_migrationsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Public_knex_migrationsGroupByOutputType>[]
          }
          count: {
            args: Prisma.public_knex_migrationsCountArgs<ExtArgs>,
            result: $Utils.Optional<Public_knex_migrationsCountAggregateOutputType> | number
          }
        }
      }
      public_knex_migrations_lock: {
        payload: Prisma.$public_knex_migrations_lockPayload<ExtArgs>
        fields: Prisma.public_knex_migrations_lockFieldRefs
        operations: {
          findUnique: {
            args: Prisma.public_knex_migrations_lockFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrations_lockPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.public_knex_migrations_lockFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrations_lockPayload>
          }
          findFirst: {
            args: Prisma.public_knex_migrations_lockFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrations_lockPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.public_knex_migrations_lockFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrations_lockPayload>
          }
          findMany: {
            args: Prisma.public_knex_migrations_lockFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrations_lockPayload>[]
          }
          create: {
            args: Prisma.public_knex_migrations_lockCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrations_lockPayload>
          }
          createMany: {
            args: Prisma.public_knex_migrations_lockCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.public_knex_migrations_lockDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrations_lockPayload>
          }
          update: {
            args: Prisma.public_knex_migrations_lockUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrations_lockPayload>
          }
          deleteMany: {
            args: Prisma.public_knex_migrations_lockDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.public_knex_migrations_lockUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.public_knex_migrations_lockUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$public_knex_migrations_lockPayload>
          }
          aggregate: {
            args: Prisma.Public_knex_migrations_lockAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregatePublic_knex_migrations_lock>
          }
          groupBy: {
            args: Prisma.public_knex_migrations_lockGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Public_knex_migrations_lockGroupByOutputType>[]
          }
          count: {
            args: Prisma.public_knex_migrations_lockCountArgs<ExtArgs>,
            result: $Utils.Optional<Public_knex_migrations_lockCountAggregateOutputType> | number
          }
        }
      }
      knowledge: {
        payload: Prisma.$knowledgePayload<ExtArgs>
        fields: Prisma.knowledgeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.knowledgeFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$knowledgePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.knowledgeFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$knowledgePayload>
          }
          findFirst: {
            args: Prisma.knowledgeFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$knowledgePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.knowledgeFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$knowledgePayload>
          }
          findMany: {
            args: Prisma.knowledgeFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$knowledgePayload>[]
          }
          create: {
            args: Prisma.knowledgeCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$knowledgePayload>
          }
          createMany: {
            args: Prisma.knowledgeCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.knowledgeDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$knowledgePayload>
          }
          update: {
            args: Prisma.knowledgeUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$knowledgePayload>
          }
          deleteMany: {
            args: Prisma.knowledgeDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.knowledgeUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.knowledgeUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$knowledgePayload>
          }
          aggregate: {
            args: Prisma.KnowledgeAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateKnowledge>
          }
          groupBy: {
            args: Prisma.knowledgeGroupByArgs<ExtArgs>,
            result: $Utils.Optional<KnowledgeGroupByOutputType>[]
          }
          count: {
            args: Prisma.knowledgeCountArgs<ExtArgs>,
            result: $Utils.Optional<KnowledgeCountAggregateOutputType> | number
          }
        }
      }
      pluginState: {
        payload: Prisma.$pluginStatePayload<ExtArgs>
        fields: Prisma.pluginStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.pluginStateFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$pluginStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.pluginStateFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$pluginStatePayload>
          }
          findFirst: {
            args: Prisma.pluginStateFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$pluginStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.pluginStateFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$pluginStatePayload>
          }
          findMany: {
            args: Prisma.pluginStateFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$pluginStatePayload>[]
          }
          create: {
            args: Prisma.pluginStateCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$pluginStatePayload>
          }
          createMany: {
            args: Prisma.pluginStateCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.pluginStateDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$pluginStatePayload>
          }
          update: {
            args: Prisma.pluginStateUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$pluginStatePayload>
          }
          deleteMany: {
            args: Prisma.pluginStateDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.pluginStateUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.pluginStateUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$pluginStatePayload>
          }
          aggregate: {
            args: Prisma.PluginStateAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregatePluginState>
          }
          groupBy: {
            args: Prisma.pluginStateGroupByArgs<ExtArgs>,
            result: $Utils.Optional<PluginStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.pluginStateCountArgs<ExtArgs>,
            result: $Utils.Optional<PluginStateCountAggregateOutputType> | number
          }
        }
      }
      request: {
        payload: Prisma.$requestPayload<ExtArgs>
        fields: Prisma.requestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.requestFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$requestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.requestFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$requestPayload>
          }
          findFirst: {
            args: Prisma.requestFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$requestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.requestFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$requestPayload>
          }
          findMany: {
            args: Prisma.requestFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$requestPayload>[]
          }
          create: {
            args: Prisma.requestCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$requestPayload>
          }
          createMany: {
            args: Prisma.requestCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.requestDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$requestPayload>
          }
          update: {
            args: Prisma.requestUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$requestPayload>
          }
          deleteMany: {
            args: Prisma.requestDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.requestUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.requestUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$requestPayload>
          }
          aggregate: {
            args: Prisma.RequestAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateRequest>
          }
          groupBy: {
            args: Prisma.requestGroupByArgs<ExtArgs>,
            result: $Utils.Optional<RequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.requestCountArgs<ExtArgs>,
            result: $Utils.Optional<RequestCountAggregateOutputType> | number
          }
        }
      }
      spellReleases: {
        payload: Prisma.$spellReleasesPayload<ExtArgs>
        fields: Prisma.spellReleasesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.spellReleasesFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellReleasesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.spellReleasesFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellReleasesPayload>
          }
          findFirst: {
            args: Prisma.spellReleasesFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellReleasesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.spellReleasesFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellReleasesPayload>
          }
          findMany: {
            args: Prisma.spellReleasesFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellReleasesPayload>[]
          }
          create: {
            args: Prisma.spellReleasesCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellReleasesPayload>
          }
          createMany: {
            args: Prisma.spellReleasesCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.spellReleasesDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellReleasesPayload>
          }
          update: {
            args: Prisma.spellReleasesUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellReleasesPayload>
          }
          deleteMany: {
            args: Prisma.spellReleasesDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.spellReleasesUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.spellReleasesUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellReleasesPayload>
          }
          aggregate: {
            args: Prisma.SpellReleasesAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSpellReleases>
          }
          groupBy: {
            args: Prisma.spellReleasesGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SpellReleasesGroupByOutputType>[]
          }
          count: {
            args: Prisma.spellReleasesCountArgs<ExtArgs>,
            result: $Utils.Optional<SpellReleasesCountAggregateOutputType> | number
          }
        }
      }
      spells: {
        payload: Prisma.$spellsPayload<ExtArgs>
        fields: Prisma.spellsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.spellsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.spellsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellsPayload>
          }
          findFirst: {
            args: Prisma.spellsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.spellsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellsPayload>
          }
          findMany: {
            args: Prisma.spellsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellsPayload>[]
          }
          create: {
            args: Prisma.spellsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellsPayload>
          }
          createMany: {
            args: Prisma.spellsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.spellsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellsPayload>
          }
          update: {
            args: Prisma.spellsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellsPayload>
          }
          deleteMany: {
            args: Prisma.spellsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.spellsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.spellsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$spellsPayload>
          }
          aggregate: {
            args: Prisma.SpellsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSpells>
          }
          groupBy: {
            args: Prisma.spellsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SpellsGroupByOutputType>[]
          }
          count: {
            args: Prisma.spellsCountArgs<ExtArgs>,
            result: $Utils.Optional<SpellsCountAggregateOutputType> | number
          }
        }
      }
      tasks: {
        payload: Prisma.$tasksPayload<ExtArgs>
        fields: Prisma.tasksFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tasksFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$tasksPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tasksFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$tasksPayload>
          }
          findFirst: {
            args: Prisma.tasksFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$tasksPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tasksFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$tasksPayload>
          }
          findMany: {
            args: Prisma.tasksFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$tasksPayload>[]
          }
          create: {
            args: Prisma.tasksCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$tasksPayload>
          }
          createMany: {
            args: Prisma.tasksCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.tasksDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$tasksPayload>
          }
          update: {
            args: Prisma.tasksUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$tasksPayload>
          }
          deleteMany: {
            args: Prisma.tasksDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.tasksUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.tasksUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$tasksPayload>
          }
          aggregate: {
            args: Prisma.TasksAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTasks>
          }
          groupBy: {
            args: Prisma.tasksGroupByArgs<ExtArgs>,
            result: $Utils.Optional<TasksGroupByOutputType>[]
          }
          count: {
            args: Prisma.tasksCountArgs<ExtArgs>,
            result: $Utils.Optional<TasksCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AgentsCountOutputType
   */

  export type AgentsCountOutputType = {
    agent_credentials: number
    chatMessages: number
    graphEvents: number
    pluginState: number
    spellReleases_spellReleases_agentIdToagents: number
  }

  export type AgentsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent_credentials?: boolean | AgentsCountOutputTypeCountAgent_credentialsArgs
    chatMessages?: boolean | AgentsCountOutputTypeCountChatMessagesArgs
    graphEvents?: boolean | AgentsCountOutputTypeCountGraphEventsArgs
    pluginState?: boolean | AgentsCountOutputTypeCountPluginStateArgs
    spellReleases_spellReleases_agentIdToagents?: boolean | AgentsCountOutputTypeCountSpellReleases_spellReleases_agentIdToagentsArgs
  }

  // Custom InputTypes

  /**
   * AgentsCountOutputType without action
   */
  export type AgentsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentsCountOutputType
     */
    select?: AgentsCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * AgentsCountOutputType without action
   */
  export type AgentsCountOutputTypeCountAgent_credentialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: agent_credentialsWhereInput
  }


  /**
   * AgentsCountOutputType without action
   */
  export type AgentsCountOutputTypeCountChatMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: chatMessagesWhereInput
  }


  /**
   * AgentsCountOutputType without action
   */
  export type AgentsCountOutputTypeCountGraphEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: graphEventsWhereInput
  }


  /**
   * AgentsCountOutputType without action
   */
  export type AgentsCountOutputTypeCountPluginStateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pluginStateWhereInput
  }


  /**
   * AgentsCountOutputType without action
   */
  export type AgentsCountOutputTypeCountSpellReleases_spellReleases_agentIdToagentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: spellReleasesWhereInput
  }



  /**
   * Count Type CredentialsCountOutputType
   */

  export type CredentialsCountOutputType = {
    agent_credentials: number
  }

  export type CredentialsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent_credentials?: boolean | CredentialsCountOutputTypeCountAgent_credentialsArgs
  }

  // Custom InputTypes

  /**
   * CredentialsCountOutputType without action
   */
  export type CredentialsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CredentialsCountOutputType
     */
    select?: CredentialsCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * CredentialsCountOutputType without action
   */
  export type CredentialsCountOutputTypeCountAgent_credentialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: agent_credentialsWhereInput
  }



  /**
   * Count Type SpellReleasesCountOutputType
   */

  export type SpellReleasesCountOutputType = {
    agents_agents_currentSpellReleaseIdTospellReleases: number
    spells: number
  }

  export type SpellReleasesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agents_agents_currentSpellReleaseIdTospellReleases?: boolean | SpellReleasesCountOutputTypeCountAgents_agents_currentSpellReleaseIdTospellReleasesArgs
    spells?: boolean | SpellReleasesCountOutputTypeCountSpellsArgs
  }

  // Custom InputTypes

  /**
   * SpellReleasesCountOutputType without action
   */
  export type SpellReleasesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpellReleasesCountOutputType
     */
    select?: SpellReleasesCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * SpellReleasesCountOutputType without action
   */
  export type SpellReleasesCountOutputTypeCountAgents_agents_currentSpellReleaseIdTospellReleasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: agentsWhereInput
  }


  /**
   * SpellReleasesCountOutputType without action
   */
  export type SpellReleasesCountOutputTypeCountSpellsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: spellsWhereInput
  }



  /**
   * Models
   */

  /**
   * Model agent_credentials
   */

  export type AggregateAgent_credentials = {
    _count: Agent_credentialsCountAggregateOutputType | null
    _min: Agent_credentialsMinAggregateOutputType | null
    _max: Agent_credentialsMaxAggregateOutputType | null
  }

  export type Agent_credentialsMinAggregateOutputType = {
    agentId: string | null
    credentialId: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Agent_credentialsMaxAggregateOutputType = {
    agentId: string | null
    credentialId: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Agent_credentialsCountAggregateOutputType = {
    agentId: number
    credentialId: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Agent_credentialsMinAggregateInputType = {
    agentId?: true
    credentialId?: true
    created_at?: true
    updated_at?: true
  }

  export type Agent_credentialsMaxAggregateInputType = {
    agentId?: true
    credentialId?: true
    created_at?: true
    updated_at?: true
  }

  export type Agent_credentialsCountAggregateInputType = {
    agentId?: true
    credentialId?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Agent_credentialsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which agent_credentials to aggregate.
     */
    where?: agent_credentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of agent_credentials to fetch.
     */
    orderBy?: agent_credentialsOrderByWithRelationAndSearchRelevanceInput | agent_credentialsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: agent_credentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` agent_credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` agent_credentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned agent_credentials
    **/
    _count?: true | Agent_credentialsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Agent_credentialsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Agent_credentialsMaxAggregateInputType
  }

  export type GetAgent_credentialsAggregateType<T extends Agent_credentialsAggregateArgs> = {
        [P in keyof T & keyof AggregateAgent_credentials]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgent_credentials[P]>
      : GetScalarType<T[P], AggregateAgent_credentials[P]>
  }




  export type agent_credentialsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: agent_credentialsWhereInput
    orderBy?: agent_credentialsOrderByWithAggregationInput | agent_credentialsOrderByWithAggregationInput[]
    by: Agent_credentialsScalarFieldEnum[] | Agent_credentialsScalarFieldEnum
    having?: agent_credentialsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Agent_credentialsCountAggregateInputType | true
    _min?: Agent_credentialsMinAggregateInputType
    _max?: Agent_credentialsMaxAggregateInputType
  }

  export type Agent_credentialsGroupByOutputType = {
    agentId: string
    credentialId: string
    created_at: Date
    updated_at: Date
    _count: Agent_credentialsCountAggregateOutputType | null
    _min: Agent_credentialsMinAggregateOutputType | null
    _max: Agent_credentialsMaxAggregateOutputType | null
  }

  type GetAgent_credentialsGroupByPayload<T extends agent_credentialsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Agent_credentialsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Agent_credentialsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Agent_credentialsGroupByOutputType[P]>
            : GetScalarType<T[P], Agent_credentialsGroupByOutputType[P]>
        }
      >
    >


  export type agent_credentialsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    agentId?: boolean
    credentialId?: boolean
    created_at?: boolean
    updated_at?: boolean
    agents?: boolean | agentsDefaultArgs<ExtArgs>
    credentials?: boolean | credentialsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agent_credentials"]>

  export type agent_credentialsSelectScalar = {
    agentId?: boolean
    credentialId?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type agent_credentialsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agents?: boolean | agentsDefaultArgs<ExtArgs>
    credentials?: boolean | credentialsDefaultArgs<ExtArgs>
  }


  export type $agent_credentialsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "agent_credentials"
    objects: {
      agents: Prisma.$agentsPayload<ExtArgs>
      credentials: Prisma.$credentialsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      agentId: string
      credentialId: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["agent_credentials"]>
    composites: {}
  }


  type agent_credentialsGetPayload<S extends boolean | null | undefined | agent_credentialsDefaultArgs> = $Result.GetResult<Prisma.$agent_credentialsPayload, S>

  type agent_credentialsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<agent_credentialsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Agent_credentialsCountAggregateInputType | true
    }

  export interface agent_credentialsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['agent_credentials'], meta: { name: 'agent_credentials' } }
    /**
     * Find zero or one Agent_credentials that matches the filter.
     * @param {agent_credentialsFindUniqueArgs} args - Arguments to find a Agent_credentials
     * @example
     * // Get one Agent_credentials
     * const agent_credentials = await prisma.agent_credentials.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends agent_credentialsFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, agent_credentialsFindUniqueArgs<ExtArgs>>
    ): Prisma__agent_credentialsClient<$Result.GetResult<Prisma.$agent_credentialsPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Agent_credentials that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {agent_credentialsFindUniqueOrThrowArgs} args - Arguments to find a Agent_credentials
     * @example
     * // Get one Agent_credentials
     * const agent_credentials = await prisma.agent_credentials.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends agent_credentialsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, agent_credentialsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__agent_credentialsClient<$Result.GetResult<Prisma.$agent_credentialsPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Agent_credentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agent_credentialsFindFirstArgs} args - Arguments to find a Agent_credentials
     * @example
     * // Get one Agent_credentials
     * const agent_credentials = await prisma.agent_credentials.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends agent_credentialsFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, agent_credentialsFindFirstArgs<ExtArgs>>
    ): Prisma__agent_credentialsClient<$Result.GetResult<Prisma.$agent_credentialsPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Agent_credentials that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agent_credentialsFindFirstOrThrowArgs} args - Arguments to find a Agent_credentials
     * @example
     * // Get one Agent_credentials
     * const agent_credentials = await prisma.agent_credentials.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends agent_credentialsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, agent_credentialsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__agent_credentialsClient<$Result.GetResult<Prisma.$agent_credentialsPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Agent_credentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agent_credentialsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Agent_credentials
     * const agent_credentials = await prisma.agent_credentials.findMany()
     * 
     * // Get first 10 Agent_credentials
     * const agent_credentials = await prisma.agent_credentials.findMany({ take: 10 })
     * 
     * // Only select the `agentId`
     * const agent_credentialsWithAgentIdOnly = await prisma.agent_credentials.findMany({ select: { agentId: true } })
     * 
    **/
    findMany<T extends agent_credentialsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, agent_credentialsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$agent_credentialsPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Agent_credentials.
     * @param {agent_credentialsCreateArgs} args - Arguments to create a Agent_credentials.
     * @example
     * // Create one Agent_credentials
     * const Agent_credentials = await prisma.agent_credentials.create({
     *   data: {
     *     // ... data to create a Agent_credentials
     *   }
     * })
     * 
    **/
    create<T extends agent_credentialsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, agent_credentialsCreateArgs<ExtArgs>>
    ): Prisma__agent_credentialsClient<$Result.GetResult<Prisma.$agent_credentialsPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Agent_credentials.
     *     @param {agent_credentialsCreateManyArgs} args - Arguments to create many Agent_credentials.
     *     @example
     *     // Create many Agent_credentials
     *     const agent_credentials = await prisma.agent_credentials.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends agent_credentialsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, agent_credentialsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Agent_credentials.
     * @param {agent_credentialsDeleteArgs} args - Arguments to delete one Agent_credentials.
     * @example
     * // Delete one Agent_credentials
     * const Agent_credentials = await prisma.agent_credentials.delete({
     *   where: {
     *     // ... filter to delete one Agent_credentials
     *   }
     * })
     * 
    **/
    delete<T extends agent_credentialsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, agent_credentialsDeleteArgs<ExtArgs>>
    ): Prisma__agent_credentialsClient<$Result.GetResult<Prisma.$agent_credentialsPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Agent_credentials.
     * @param {agent_credentialsUpdateArgs} args - Arguments to update one Agent_credentials.
     * @example
     * // Update one Agent_credentials
     * const agent_credentials = await prisma.agent_credentials.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends agent_credentialsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, agent_credentialsUpdateArgs<ExtArgs>>
    ): Prisma__agent_credentialsClient<$Result.GetResult<Prisma.$agent_credentialsPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Agent_credentials.
     * @param {agent_credentialsDeleteManyArgs} args - Arguments to filter Agent_credentials to delete.
     * @example
     * // Delete a few Agent_credentials
     * const { count } = await prisma.agent_credentials.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends agent_credentialsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, agent_credentialsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Agent_credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agent_credentialsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Agent_credentials
     * const agent_credentials = await prisma.agent_credentials.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends agent_credentialsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, agent_credentialsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Agent_credentials.
     * @param {agent_credentialsUpsertArgs} args - Arguments to update or create a Agent_credentials.
     * @example
     * // Update or create a Agent_credentials
     * const agent_credentials = await prisma.agent_credentials.upsert({
     *   create: {
     *     // ... data to create a Agent_credentials
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Agent_credentials we want to update
     *   }
     * })
    **/
    upsert<T extends agent_credentialsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, agent_credentialsUpsertArgs<ExtArgs>>
    ): Prisma__agent_credentialsClient<$Result.GetResult<Prisma.$agent_credentialsPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Agent_credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agent_credentialsCountArgs} args - Arguments to filter Agent_credentials to count.
     * @example
     * // Count the number of Agent_credentials
     * const count = await prisma.agent_credentials.count({
     *   where: {
     *     // ... the filter for the Agent_credentials we want to count
     *   }
     * })
    **/
    count<T extends agent_credentialsCountArgs>(
      args?: Subset<T, agent_credentialsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Agent_credentialsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Agent_credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Agent_credentialsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Agent_credentialsAggregateArgs>(args: Subset<T, Agent_credentialsAggregateArgs>): Prisma.PrismaPromise<GetAgent_credentialsAggregateType<T>>

    /**
     * Group by Agent_credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agent_credentialsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends agent_credentialsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: agent_credentialsGroupByArgs['orderBy'] }
        : { orderBy?: agent_credentialsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, agent_credentialsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgent_credentialsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the agent_credentials model
   */
  readonly fields: agent_credentialsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for agent_credentials.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__agent_credentialsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    agents<T extends agentsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, agentsDefaultArgs<ExtArgs>>): Prisma__agentsClient<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    credentials<T extends credentialsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, credentialsDefaultArgs<ExtArgs>>): Prisma__credentialsClient<$Result.GetResult<Prisma.$credentialsPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the agent_credentials model
   */ 
  interface agent_credentialsFieldRefs {
    readonly agentId: FieldRef<"agent_credentials", 'String'>
    readonly credentialId: FieldRef<"agent_credentials", 'String'>
    readonly created_at: FieldRef<"agent_credentials", 'DateTime'>
    readonly updated_at: FieldRef<"agent_credentials", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * agent_credentials findUnique
   */
  export type agent_credentialsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agent_credentials
     */
    select?: agent_credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agent_credentialsInclude<ExtArgs> | null
    /**
     * Filter, which agent_credentials to fetch.
     */
    where: agent_credentialsWhereUniqueInput
  }


  /**
   * agent_credentials findUniqueOrThrow
   */
  export type agent_credentialsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agent_credentials
     */
    select?: agent_credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agent_credentialsInclude<ExtArgs> | null
    /**
     * Filter, which agent_credentials to fetch.
     */
    where: agent_credentialsWhereUniqueInput
  }


  /**
   * agent_credentials findFirst
   */
  export type agent_credentialsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agent_credentials
     */
    select?: agent_credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agent_credentialsInclude<ExtArgs> | null
    /**
     * Filter, which agent_credentials to fetch.
     */
    where?: agent_credentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of agent_credentials to fetch.
     */
    orderBy?: agent_credentialsOrderByWithRelationAndSearchRelevanceInput | agent_credentialsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for agent_credentials.
     */
    cursor?: agent_credentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` agent_credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` agent_credentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of agent_credentials.
     */
    distinct?: Agent_credentialsScalarFieldEnum | Agent_credentialsScalarFieldEnum[]
  }


  /**
   * agent_credentials findFirstOrThrow
   */
  export type agent_credentialsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agent_credentials
     */
    select?: agent_credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agent_credentialsInclude<ExtArgs> | null
    /**
     * Filter, which agent_credentials to fetch.
     */
    where?: agent_credentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of agent_credentials to fetch.
     */
    orderBy?: agent_credentialsOrderByWithRelationAndSearchRelevanceInput | agent_credentialsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for agent_credentials.
     */
    cursor?: agent_credentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` agent_credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` agent_credentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of agent_credentials.
     */
    distinct?: Agent_credentialsScalarFieldEnum | Agent_credentialsScalarFieldEnum[]
  }


  /**
   * agent_credentials findMany
   */
  export type agent_credentialsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agent_credentials
     */
    select?: agent_credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agent_credentialsInclude<ExtArgs> | null
    /**
     * Filter, which agent_credentials to fetch.
     */
    where?: agent_credentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of agent_credentials to fetch.
     */
    orderBy?: agent_credentialsOrderByWithRelationAndSearchRelevanceInput | agent_credentialsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing agent_credentials.
     */
    cursor?: agent_credentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` agent_credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` agent_credentials.
     */
    skip?: number
    distinct?: Agent_credentialsScalarFieldEnum | Agent_credentialsScalarFieldEnum[]
  }


  /**
   * agent_credentials create
   */
  export type agent_credentialsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agent_credentials
     */
    select?: agent_credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agent_credentialsInclude<ExtArgs> | null
    /**
     * The data needed to create a agent_credentials.
     */
    data: XOR<agent_credentialsCreateInput, agent_credentialsUncheckedCreateInput>
  }


  /**
   * agent_credentials createMany
   */
  export type agent_credentialsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many agent_credentials.
     */
    data: agent_credentialsCreateManyInput | agent_credentialsCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * agent_credentials update
   */
  export type agent_credentialsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agent_credentials
     */
    select?: agent_credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agent_credentialsInclude<ExtArgs> | null
    /**
     * The data needed to update a agent_credentials.
     */
    data: XOR<agent_credentialsUpdateInput, agent_credentialsUncheckedUpdateInput>
    /**
     * Choose, which agent_credentials to update.
     */
    where: agent_credentialsWhereUniqueInput
  }


  /**
   * agent_credentials updateMany
   */
  export type agent_credentialsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update agent_credentials.
     */
    data: XOR<agent_credentialsUpdateManyMutationInput, agent_credentialsUncheckedUpdateManyInput>
    /**
     * Filter which agent_credentials to update
     */
    where?: agent_credentialsWhereInput
  }


  /**
   * agent_credentials upsert
   */
  export type agent_credentialsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agent_credentials
     */
    select?: agent_credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agent_credentialsInclude<ExtArgs> | null
    /**
     * The filter to search for the agent_credentials to update in case it exists.
     */
    where: agent_credentialsWhereUniqueInput
    /**
     * In case the agent_credentials found by the `where` argument doesn't exist, create a new agent_credentials with this data.
     */
    create: XOR<agent_credentialsCreateInput, agent_credentialsUncheckedCreateInput>
    /**
     * In case the agent_credentials was found with the provided `where` argument, update it with this data.
     */
    update: XOR<agent_credentialsUpdateInput, agent_credentialsUncheckedUpdateInput>
  }


  /**
   * agent_credentials delete
   */
  export type agent_credentialsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agent_credentials
     */
    select?: agent_credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agent_credentialsInclude<ExtArgs> | null
    /**
     * Filter which agent_credentials to delete.
     */
    where: agent_credentialsWhereUniqueInput
  }


  /**
   * agent_credentials deleteMany
   */
  export type agent_credentialsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which agent_credentials to delete
     */
    where?: agent_credentialsWhereInput
  }


  /**
   * agent_credentials without action
   */
  export type agent_credentialsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agent_credentials
     */
    select?: agent_credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agent_credentialsInclude<ExtArgs> | null
  }



  /**
   * Model agents
   */

  export type AggregateAgents = {
    _count: AgentsCountAggregateOutputType | null
    _min: AgentsMinAggregateOutputType | null
    _max: AgentsMaxAggregateOutputType | null
  }

  export type AgentsMinAggregateOutputType = {
    id: string | null
    publicVariables: string | null
    secrets: string | null
    name: string | null
    enabled: boolean | null
    updatedAt: string | null
    pingedAt: string | null
    projectId: string | null
    runState: string | null
    image: string | null
    rootSpellId: string | null
    default: boolean | null
    createdAt: Date | null
    currentSpellReleaseId: string | null
    embedModel: string | null
    version: string | null
    embeddingProvider: string | null
    embeddingModel: string | null
    isDraft: boolean | null
  }

  export type AgentsMaxAggregateOutputType = {
    id: string | null
    publicVariables: string | null
    secrets: string | null
    name: string | null
    enabled: boolean | null
    updatedAt: string | null
    pingedAt: string | null
    projectId: string | null
    runState: string | null
    image: string | null
    rootSpellId: string | null
    default: boolean | null
    createdAt: Date | null
    currentSpellReleaseId: string | null
    embedModel: string | null
    version: string | null
    embeddingProvider: string | null
    embeddingModel: string | null
    isDraft: boolean | null
  }

  export type AgentsCountAggregateOutputType = {
    id: number
    rootSpell: number
    publicVariables: number
    secrets: number
    name: number
    enabled: number
    updatedAt: number
    pingedAt: number
    projectId: number
    data: number
    runState: number
    image: number
    rootSpellId: number
    default: number
    createdAt: number
    currentSpellReleaseId: number
    embedModel: number
    version: number
    embeddingProvider: number
    embeddingModel: number
    isDraft: number
    _all: number
  }


  export type AgentsMinAggregateInputType = {
    id?: true
    publicVariables?: true
    secrets?: true
    name?: true
    enabled?: true
    updatedAt?: true
    pingedAt?: true
    projectId?: true
    runState?: true
    image?: true
    rootSpellId?: true
    default?: true
    createdAt?: true
    currentSpellReleaseId?: true
    embedModel?: true
    version?: true
    embeddingProvider?: true
    embeddingModel?: true
    isDraft?: true
  }

  export type AgentsMaxAggregateInputType = {
    id?: true
    publicVariables?: true
    secrets?: true
    name?: true
    enabled?: true
    updatedAt?: true
    pingedAt?: true
    projectId?: true
    runState?: true
    image?: true
    rootSpellId?: true
    default?: true
    createdAt?: true
    currentSpellReleaseId?: true
    embedModel?: true
    version?: true
    embeddingProvider?: true
    embeddingModel?: true
    isDraft?: true
  }

  export type AgentsCountAggregateInputType = {
    id?: true
    rootSpell?: true
    publicVariables?: true
    secrets?: true
    name?: true
    enabled?: true
    updatedAt?: true
    pingedAt?: true
    projectId?: true
    data?: true
    runState?: true
    image?: true
    rootSpellId?: true
    default?: true
    createdAt?: true
    currentSpellReleaseId?: true
    embedModel?: true
    version?: true
    embeddingProvider?: true
    embeddingModel?: true
    isDraft?: true
    _all?: true
  }

  export type AgentsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which agents to aggregate.
     */
    where?: agentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of agents to fetch.
     */
    orderBy?: agentsOrderByWithRelationAndSearchRelevanceInput | agentsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: agentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` agents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` agents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned agents
    **/
    _count?: true | AgentsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentsMaxAggregateInputType
  }

  export type GetAgentsAggregateType<T extends AgentsAggregateArgs> = {
        [P in keyof T & keyof AggregateAgents]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgents[P]>
      : GetScalarType<T[P], AggregateAgents[P]>
  }




  export type agentsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: agentsWhereInput
    orderBy?: agentsOrderByWithAggregationInput | agentsOrderByWithAggregationInput[]
    by: AgentsScalarFieldEnum[] | AgentsScalarFieldEnum
    having?: agentsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentsCountAggregateInputType | true
    _min?: AgentsMinAggregateInputType
    _max?: AgentsMaxAggregateInputType
  }

  export type AgentsGroupByOutputType = {
    id: string
    rootSpell: JsonValue | null
    publicVariables: string | null
    secrets: string | null
    name: string | null
    enabled: boolean | null
    updatedAt: string | null
    pingedAt: string | null
    projectId: string | null
    data: JsonValue | null
    runState: string
    image: string | null
    rootSpellId: string | null
    default: boolean
    createdAt: Date | null
    currentSpellReleaseId: string | null
    embedModel: string | null
    version: string
    embeddingProvider: string | null
    embeddingModel: string | null
    isDraft: boolean
    _count: AgentsCountAggregateOutputType | null
    _min: AgentsMinAggregateOutputType | null
    _max: AgentsMaxAggregateOutputType | null
  }

  type GetAgentsGroupByPayload<T extends agentsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentsGroupByOutputType[P]>
            : GetScalarType<T[P], AgentsGroupByOutputType[P]>
        }
      >
    >


  export type agentsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rootSpell?: boolean
    publicVariables?: boolean
    secrets?: boolean
    name?: boolean
    enabled?: boolean
    updatedAt?: boolean
    pingedAt?: boolean
    projectId?: boolean
    data?: boolean
    runState?: boolean
    image?: boolean
    rootSpellId?: boolean
    default?: boolean
    createdAt?: boolean
    currentSpellReleaseId?: boolean
    embedModel?: boolean
    version?: boolean
    embeddingProvider?: boolean
    embeddingModel?: boolean
    isDraft?: boolean
    agent_credentials?: boolean | agents$agent_credentialsArgs<ExtArgs>
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: boolean | agents$spellReleases_agents_currentSpellReleaseIdTospellReleasesArgs<ExtArgs>
    chatMessages?: boolean | agents$chatMessagesArgs<ExtArgs>
    graphEvents?: boolean | agents$graphEventsArgs<ExtArgs>
    pluginState?: boolean | agents$pluginStateArgs<ExtArgs>
    spellReleases_spellReleases_agentIdToagents?: boolean | agents$spellReleases_spellReleases_agentIdToagentsArgs<ExtArgs>
    _count?: boolean | AgentsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agents"]>

  export type agentsSelectScalar = {
    id?: boolean
    rootSpell?: boolean
    publicVariables?: boolean
    secrets?: boolean
    name?: boolean
    enabled?: boolean
    updatedAt?: boolean
    pingedAt?: boolean
    projectId?: boolean
    data?: boolean
    runState?: boolean
    image?: boolean
    rootSpellId?: boolean
    default?: boolean
    createdAt?: boolean
    currentSpellReleaseId?: boolean
    embedModel?: boolean
    version?: boolean
    embeddingProvider?: boolean
    embeddingModel?: boolean
    isDraft?: boolean
  }

  export type agentsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent_credentials?: boolean | agents$agent_credentialsArgs<ExtArgs>
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: boolean | agents$spellReleases_agents_currentSpellReleaseIdTospellReleasesArgs<ExtArgs>
    chatMessages?: boolean | agents$chatMessagesArgs<ExtArgs>
    graphEvents?: boolean | agents$graphEventsArgs<ExtArgs>
    pluginState?: boolean | agents$pluginStateArgs<ExtArgs>
    spellReleases_spellReleases_agentIdToagents?: boolean | agents$spellReleases_spellReleases_agentIdToagentsArgs<ExtArgs>
    _count?: boolean | AgentsCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $agentsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "agents"
    objects: {
      agent_credentials: Prisma.$agent_credentialsPayload<ExtArgs>[]
      spellReleases_agents_currentSpellReleaseIdTospellReleases: Prisma.$spellReleasesPayload<ExtArgs> | null
      chatMessages: Prisma.$chatMessagesPayload<ExtArgs>[]
      graphEvents: Prisma.$graphEventsPayload<ExtArgs>[]
      pluginState: Prisma.$pluginStatePayload<ExtArgs>[]
      spellReleases_spellReleases_agentIdToagents: Prisma.$spellReleasesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      rootSpell: Prisma.JsonValue | null
      publicVariables: string | null
      secrets: string | null
      name: string | null
      enabled: boolean | null
      updatedAt: string | null
      pingedAt: string | null
      projectId: string | null
      data: Prisma.JsonValue | null
      runState: string
      image: string | null
      rootSpellId: string | null
      default: boolean
      createdAt: Date | null
      currentSpellReleaseId: string | null
      embedModel: string | null
      version: string
      embeddingProvider: string | null
      embeddingModel: string | null
      isDraft: boolean
    }, ExtArgs["result"]["agents"]>
    composites: {}
  }


  type agentsGetPayload<S extends boolean | null | undefined | agentsDefaultArgs> = $Result.GetResult<Prisma.$agentsPayload, S>

  type agentsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<agentsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AgentsCountAggregateInputType | true
    }

  export interface agentsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['agents'], meta: { name: 'agents' } }
    /**
     * Find zero or one Agents that matches the filter.
     * @param {agentsFindUniqueArgs} args - Arguments to find a Agents
     * @example
     * // Get one Agents
     * const agents = await prisma.agents.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends agentsFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, agentsFindUniqueArgs<ExtArgs>>
    ): Prisma__agentsClient<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Agents that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {agentsFindUniqueOrThrowArgs} args - Arguments to find a Agents
     * @example
     * // Get one Agents
     * const agents = await prisma.agents.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends agentsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, agentsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__agentsClient<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Agents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agentsFindFirstArgs} args - Arguments to find a Agents
     * @example
     * // Get one Agents
     * const agents = await prisma.agents.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends agentsFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, agentsFindFirstArgs<ExtArgs>>
    ): Prisma__agentsClient<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Agents that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agentsFindFirstOrThrowArgs} args - Arguments to find a Agents
     * @example
     * // Get one Agents
     * const agents = await prisma.agents.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends agentsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, agentsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__agentsClient<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Agents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agentsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Agents
     * const agents = await prisma.agents.findMany()
     * 
     * // Get first 10 Agents
     * const agents = await prisma.agents.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentsWithIdOnly = await prisma.agents.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends agentsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, agentsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Agents.
     * @param {agentsCreateArgs} args - Arguments to create a Agents.
     * @example
     * // Create one Agents
     * const Agents = await prisma.agents.create({
     *   data: {
     *     // ... data to create a Agents
     *   }
     * })
     * 
    **/
    create<T extends agentsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, agentsCreateArgs<ExtArgs>>
    ): Prisma__agentsClient<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Agents.
     *     @param {agentsCreateManyArgs} args - Arguments to create many Agents.
     *     @example
     *     // Create many Agents
     *     const agents = await prisma.agents.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends agentsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, agentsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Agents.
     * @param {agentsDeleteArgs} args - Arguments to delete one Agents.
     * @example
     * // Delete one Agents
     * const Agents = await prisma.agents.delete({
     *   where: {
     *     // ... filter to delete one Agents
     *   }
     * })
     * 
    **/
    delete<T extends agentsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, agentsDeleteArgs<ExtArgs>>
    ): Prisma__agentsClient<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Agents.
     * @param {agentsUpdateArgs} args - Arguments to update one Agents.
     * @example
     * // Update one Agents
     * const agents = await prisma.agents.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends agentsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, agentsUpdateArgs<ExtArgs>>
    ): Prisma__agentsClient<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Agents.
     * @param {agentsDeleteManyArgs} args - Arguments to filter Agents to delete.
     * @example
     * // Delete a few Agents
     * const { count } = await prisma.agents.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends agentsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, agentsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Agents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agentsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Agents
     * const agents = await prisma.agents.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends agentsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, agentsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Agents.
     * @param {agentsUpsertArgs} args - Arguments to update or create a Agents.
     * @example
     * // Update or create a Agents
     * const agents = await prisma.agents.upsert({
     *   create: {
     *     // ... data to create a Agents
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Agents we want to update
     *   }
     * })
    **/
    upsert<T extends agentsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, agentsUpsertArgs<ExtArgs>>
    ): Prisma__agentsClient<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Agents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agentsCountArgs} args - Arguments to filter Agents to count.
     * @example
     * // Count the number of Agents
     * const count = await prisma.agents.count({
     *   where: {
     *     // ... the filter for the Agents we want to count
     *   }
     * })
    **/
    count<T extends agentsCountArgs>(
      args?: Subset<T, agentsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Agents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentsAggregateArgs>(args: Subset<T, AgentsAggregateArgs>): Prisma.PrismaPromise<GetAgentsAggregateType<T>>

    /**
     * Group by Agents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agentsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends agentsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: agentsGroupByArgs['orderBy'] }
        : { orderBy?: agentsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, agentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the agents model
   */
  readonly fields: agentsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for agents.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__agentsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    agent_credentials<T extends agents$agent_credentialsArgs<ExtArgs> = {}>(args?: Subset<T, agents$agent_credentialsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$agent_credentialsPayload<ExtArgs>, T, 'findMany'> | Null>;

    spellReleases_agents_currentSpellReleaseIdTospellReleases<T extends agents$spellReleases_agents_currentSpellReleaseIdTospellReleasesArgs<ExtArgs> = {}>(args?: Subset<T, agents$spellReleases_agents_currentSpellReleaseIdTospellReleasesArgs<ExtArgs>>): Prisma__spellReleasesClient<$Result.GetResult<Prisma.$spellReleasesPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    chatMessages<T extends agents$chatMessagesArgs<ExtArgs> = {}>(args?: Subset<T, agents$chatMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$chatMessagesPayload<ExtArgs>, T, 'findMany'> | Null>;

    graphEvents<T extends agents$graphEventsArgs<ExtArgs> = {}>(args?: Subset<T, agents$graphEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$graphEventsPayload<ExtArgs>, T, 'findMany'> | Null>;

    pluginState<T extends agents$pluginStateArgs<ExtArgs> = {}>(args?: Subset<T, agents$pluginStateArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pluginStatePayload<ExtArgs>, T, 'findMany'> | Null>;

    spellReleases_spellReleases_agentIdToagents<T extends agents$spellReleases_spellReleases_agentIdToagentsArgs<ExtArgs> = {}>(args?: Subset<T, agents$spellReleases_spellReleases_agentIdToagentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$spellReleasesPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the agents model
   */ 
  interface agentsFieldRefs {
    readonly id: FieldRef<"agents", 'String'>
    readonly rootSpell: FieldRef<"agents", 'Json'>
    readonly publicVariables: FieldRef<"agents", 'String'>
    readonly secrets: FieldRef<"agents", 'String'>
    readonly name: FieldRef<"agents", 'String'>
    readonly enabled: FieldRef<"agents", 'Boolean'>
    readonly updatedAt: FieldRef<"agents", 'String'>
    readonly pingedAt: FieldRef<"agents", 'String'>
    readonly projectId: FieldRef<"agents", 'String'>
    readonly data: FieldRef<"agents", 'Json'>
    readonly runState: FieldRef<"agents", 'String'>
    readonly image: FieldRef<"agents", 'String'>
    readonly rootSpellId: FieldRef<"agents", 'String'>
    readonly default: FieldRef<"agents", 'Boolean'>
    readonly createdAt: FieldRef<"agents", 'DateTime'>
    readonly currentSpellReleaseId: FieldRef<"agents", 'String'>
    readonly embedModel: FieldRef<"agents", 'String'>
    readonly version: FieldRef<"agents", 'String'>
    readonly embeddingProvider: FieldRef<"agents", 'String'>
    readonly embeddingModel: FieldRef<"agents", 'String'>
    readonly isDraft: FieldRef<"agents", 'Boolean'>
  }
    

  // Custom InputTypes

  /**
   * agents findUnique
   */
  export type agentsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agents
     */
    select?: agentsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agentsInclude<ExtArgs> | null
    /**
     * Filter, which agents to fetch.
     */
    where: agentsWhereUniqueInput
  }


  /**
   * agents findUniqueOrThrow
   */
  export type agentsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agents
     */
    select?: agentsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agentsInclude<ExtArgs> | null
    /**
     * Filter, which agents to fetch.
     */
    where: agentsWhereUniqueInput
  }


  /**
   * agents findFirst
   */
  export type agentsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agents
     */
    select?: agentsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agentsInclude<ExtArgs> | null
    /**
     * Filter, which agents to fetch.
     */
    where?: agentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of agents to fetch.
     */
    orderBy?: agentsOrderByWithRelationAndSearchRelevanceInput | agentsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for agents.
     */
    cursor?: agentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` agents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` agents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of agents.
     */
    distinct?: AgentsScalarFieldEnum | AgentsScalarFieldEnum[]
  }


  /**
   * agents findFirstOrThrow
   */
  export type agentsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agents
     */
    select?: agentsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agentsInclude<ExtArgs> | null
    /**
     * Filter, which agents to fetch.
     */
    where?: agentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of agents to fetch.
     */
    orderBy?: agentsOrderByWithRelationAndSearchRelevanceInput | agentsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for agents.
     */
    cursor?: agentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` agents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` agents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of agents.
     */
    distinct?: AgentsScalarFieldEnum | AgentsScalarFieldEnum[]
  }


  /**
   * agents findMany
   */
  export type agentsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agents
     */
    select?: agentsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agentsInclude<ExtArgs> | null
    /**
     * Filter, which agents to fetch.
     */
    where?: agentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of agents to fetch.
     */
    orderBy?: agentsOrderByWithRelationAndSearchRelevanceInput | agentsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing agents.
     */
    cursor?: agentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` agents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` agents.
     */
    skip?: number
    distinct?: AgentsScalarFieldEnum | AgentsScalarFieldEnum[]
  }


  /**
   * agents create
   */
  export type agentsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agents
     */
    select?: agentsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agentsInclude<ExtArgs> | null
    /**
     * The data needed to create a agents.
     */
    data: XOR<agentsCreateInput, agentsUncheckedCreateInput>
  }


  /**
   * agents createMany
   */
  export type agentsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many agents.
     */
    data: agentsCreateManyInput | agentsCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * agents update
   */
  export type agentsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agents
     */
    select?: agentsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agentsInclude<ExtArgs> | null
    /**
     * The data needed to update a agents.
     */
    data: XOR<agentsUpdateInput, agentsUncheckedUpdateInput>
    /**
     * Choose, which agents to update.
     */
    where: agentsWhereUniqueInput
  }


  /**
   * agents updateMany
   */
  export type agentsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update agents.
     */
    data: XOR<agentsUpdateManyMutationInput, agentsUncheckedUpdateManyInput>
    /**
     * Filter which agents to update
     */
    where?: agentsWhereInput
  }


  /**
   * agents upsert
   */
  export type agentsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agents
     */
    select?: agentsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agentsInclude<ExtArgs> | null
    /**
     * The filter to search for the agents to update in case it exists.
     */
    where: agentsWhereUniqueInput
    /**
     * In case the agents found by the `where` argument doesn't exist, create a new agents with this data.
     */
    create: XOR<agentsCreateInput, agentsUncheckedCreateInput>
    /**
     * In case the agents was found with the provided `where` argument, update it with this data.
     */
    update: XOR<agentsUpdateInput, agentsUncheckedUpdateInput>
  }


  /**
   * agents delete
   */
  export type agentsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agents
     */
    select?: agentsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agentsInclude<ExtArgs> | null
    /**
     * Filter which agents to delete.
     */
    where: agentsWhereUniqueInput
  }


  /**
   * agents deleteMany
   */
  export type agentsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which agents to delete
     */
    where?: agentsWhereInput
  }


  /**
   * agents.agent_credentials
   */
  export type agents$agent_credentialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agent_credentials
     */
    select?: agent_credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agent_credentialsInclude<ExtArgs> | null
    where?: agent_credentialsWhereInput
    orderBy?: agent_credentialsOrderByWithRelationAndSearchRelevanceInput | agent_credentialsOrderByWithRelationAndSearchRelevanceInput[]
    cursor?: agent_credentialsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Agent_credentialsScalarFieldEnum | Agent_credentialsScalarFieldEnum[]
  }


  /**
   * agents.spellReleases_agents_currentSpellReleaseIdTospellReleases
   */
  export type agents$spellReleases_agents_currentSpellReleaseIdTospellReleasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spellReleases
     */
    select?: spellReleasesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellReleasesInclude<ExtArgs> | null
    where?: spellReleasesWhereInput
  }


  /**
   * agents.chatMessages
   */
  export type agents$chatMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chatMessages
     */
    select?: chatMessagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: chatMessagesInclude<ExtArgs> | null
    where?: chatMessagesWhereInput
    orderBy?: chatMessagesOrderByWithRelationAndSearchRelevanceInput | chatMessagesOrderByWithRelationAndSearchRelevanceInput[]
    cursor?: chatMessagesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessagesScalarFieldEnum | ChatMessagesScalarFieldEnum[]
  }


  /**
   * agents.graphEvents
   */
  export type agents$graphEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the graphEvents
     */
    select?: graphEventsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: graphEventsInclude<ExtArgs> | null
    where?: graphEventsWhereInput
    orderBy?: graphEventsOrderByWithRelationAndSearchRelevanceInput | graphEventsOrderByWithRelationAndSearchRelevanceInput[]
    cursor?: graphEventsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GraphEventsScalarFieldEnum | GraphEventsScalarFieldEnum[]
  }


  /**
   * agents.pluginState
   */
  export type agents$pluginStateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pluginState
     */
    select?: pluginStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: pluginStateInclude<ExtArgs> | null
    where?: pluginStateWhereInput
    orderBy?: pluginStateOrderByWithRelationAndSearchRelevanceInput | pluginStateOrderByWithRelationAndSearchRelevanceInput[]
    cursor?: pluginStateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PluginStateScalarFieldEnum | PluginStateScalarFieldEnum[]
  }


  /**
   * agents.spellReleases_spellReleases_agentIdToagents
   */
  export type agents$spellReleases_spellReleases_agentIdToagentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spellReleases
     */
    select?: spellReleasesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellReleasesInclude<ExtArgs> | null
    where?: spellReleasesWhereInput
    orderBy?: spellReleasesOrderByWithRelationAndSearchRelevanceInput | spellReleasesOrderByWithRelationAndSearchRelevanceInput[]
    cursor?: spellReleasesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpellReleasesScalarFieldEnum | SpellReleasesScalarFieldEnum[]
  }


  /**
   * agents without action
   */
  export type agentsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agents
     */
    select?: agentsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agentsInclude<ExtArgs> | null
  }



  /**
   * Model chatMessages
   */

  export type AggregateChatMessages = {
    _count: ChatMessagesCountAggregateOutputType | null
    _min: ChatMessagesMinAggregateOutputType | null
    _max: ChatMessagesMaxAggregateOutputType | null
  }

  export type ChatMessagesMinAggregateOutputType = {
    id: string | null
    agentId: string | null
    sender: string | null
    connector: string | null
    content: string | null
    conversationId: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ChatMessagesMaxAggregateOutputType = {
    id: string | null
    agentId: string | null
    sender: string | null
    connector: string | null
    content: string | null
    conversationId: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ChatMessagesCountAggregateOutputType = {
    id: number
    agentId: number
    sender: number
    connector: number
    content: number
    conversationId: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ChatMessagesMinAggregateInputType = {
    id?: true
    agentId?: true
    sender?: true
    connector?: true
    content?: true
    conversationId?: true
    created_at?: true
    updated_at?: true
  }

  export type ChatMessagesMaxAggregateInputType = {
    id?: true
    agentId?: true
    sender?: true
    connector?: true
    content?: true
    conversationId?: true
    created_at?: true
    updated_at?: true
  }

  export type ChatMessagesCountAggregateInputType = {
    id?: true
    agentId?: true
    sender?: true
    connector?: true
    content?: true
    conversationId?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ChatMessagesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which chatMessages to aggregate.
     */
    where?: chatMessagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chatMessages to fetch.
     */
    orderBy?: chatMessagesOrderByWithRelationAndSearchRelevanceInput | chatMessagesOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: chatMessagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned chatMessages
    **/
    _count?: true | ChatMessagesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessagesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessagesMaxAggregateInputType
  }

  export type GetChatMessagesAggregateType<T extends ChatMessagesAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessages]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessages[P]>
      : GetScalarType<T[P], AggregateChatMessages[P]>
  }




  export type chatMessagesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: chatMessagesWhereInput
    orderBy?: chatMessagesOrderByWithAggregationInput | chatMessagesOrderByWithAggregationInput[]
    by: ChatMessagesScalarFieldEnum[] | ChatMessagesScalarFieldEnum
    having?: chatMessagesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessagesCountAggregateInputType | true
    _min?: ChatMessagesMinAggregateInputType
    _max?: ChatMessagesMaxAggregateInputType
  }

  export type ChatMessagesGroupByOutputType = {
    id: string
    agentId: string
    sender: string | null
    connector: string
    content: string | null
    conversationId: string | null
    created_at: Date
    updated_at: Date
    _count: ChatMessagesCountAggregateOutputType | null
    _min: ChatMessagesMinAggregateOutputType | null
    _max: ChatMessagesMaxAggregateOutputType | null
  }

  type GetChatMessagesGroupByPayload<T extends chatMessagesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatMessagesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessagesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessagesGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessagesGroupByOutputType[P]>
        }
      >
    >


  export type chatMessagesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentId?: boolean
    sender?: boolean
    connector?: boolean
    content?: boolean
    conversationId?: boolean
    created_at?: boolean
    updated_at?: boolean
    agents?: boolean | agentsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessages"]>

  export type chatMessagesSelectScalar = {
    id?: boolean
    agentId?: boolean
    sender?: boolean
    connector?: boolean
    content?: boolean
    conversationId?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type chatMessagesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agents?: boolean | agentsDefaultArgs<ExtArgs>
  }


  export type $chatMessagesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "chatMessages"
    objects: {
      agents: Prisma.$agentsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      agentId: string
      sender: string | null
      connector: string
      content: string | null
      conversationId: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["chatMessages"]>
    composites: {}
  }


  type chatMessagesGetPayload<S extends boolean | null | undefined | chatMessagesDefaultArgs> = $Result.GetResult<Prisma.$chatMessagesPayload, S>

  type chatMessagesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<chatMessagesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ChatMessagesCountAggregateInputType | true
    }

  export interface chatMessagesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['chatMessages'], meta: { name: 'chatMessages' } }
    /**
     * Find zero or one ChatMessages that matches the filter.
     * @param {chatMessagesFindUniqueArgs} args - Arguments to find a ChatMessages
     * @example
     * // Get one ChatMessages
     * const chatMessages = await prisma.chatMessages.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends chatMessagesFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, chatMessagesFindUniqueArgs<ExtArgs>>
    ): Prisma__chatMessagesClient<$Result.GetResult<Prisma.$chatMessagesPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one ChatMessages that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {chatMessagesFindUniqueOrThrowArgs} args - Arguments to find a ChatMessages
     * @example
     * // Get one ChatMessages
     * const chatMessages = await prisma.chatMessages.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends chatMessagesFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, chatMessagesFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__chatMessagesClient<$Result.GetResult<Prisma.$chatMessagesPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chatMessagesFindFirstArgs} args - Arguments to find a ChatMessages
     * @example
     * // Get one ChatMessages
     * const chatMessages = await prisma.chatMessages.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends chatMessagesFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, chatMessagesFindFirstArgs<ExtArgs>>
    ): Prisma__chatMessagesClient<$Result.GetResult<Prisma.$chatMessagesPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first ChatMessages that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chatMessagesFindFirstOrThrowArgs} args - Arguments to find a ChatMessages
     * @example
     * // Get one ChatMessages
     * const chatMessages = await prisma.chatMessages.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends chatMessagesFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, chatMessagesFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__chatMessagesClient<$Result.GetResult<Prisma.$chatMessagesPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chatMessagesFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessages.findMany()
     * 
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessages.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMessagesWithIdOnly = await prisma.chatMessages.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends chatMessagesFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, chatMessagesFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$chatMessagesPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a ChatMessages.
     * @param {chatMessagesCreateArgs} args - Arguments to create a ChatMessages.
     * @example
     * // Create one ChatMessages
     * const ChatMessages = await prisma.chatMessages.create({
     *   data: {
     *     // ... data to create a ChatMessages
     *   }
     * })
     * 
    **/
    create<T extends chatMessagesCreateArgs<ExtArgs>>(
      args: SelectSubset<T, chatMessagesCreateArgs<ExtArgs>>
    ): Prisma__chatMessagesClient<$Result.GetResult<Prisma.$chatMessagesPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many ChatMessages.
     *     @param {chatMessagesCreateManyArgs} args - Arguments to create many ChatMessages.
     *     @example
     *     // Create many ChatMessages
     *     const chatMessages = await prisma.chatMessages.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends chatMessagesCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, chatMessagesCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ChatMessages.
     * @param {chatMessagesDeleteArgs} args - Arguments to delete one ChatMessages.
     * @example
     * // Delete one ChatMessages
     * const ChatMessages = await prisma.chatMessages.delete({
     *   where: {
     *     // ... filter to delete one ChatMessages
     *   }
     * })
     * 
    **/
    delete<T extends chatMessagesDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, chatMessagesDeleteArgs<ExtArgs>>
    ): Prisma__chatMessagesClient<$Result.GetResult<Prisma.$chatMessagesPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one ChatMessages.
     * @param {chatMessagesUpdateArgs} args - Arguments to update one ChatMessages.
     * @example
     * // Update one ChatMessages
     * const chatMessages = await prisma.chatMessages.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends chatMessagesUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, chatMessagesUpdateArgs<ExtArgs>>
    ): Prisma__chatMessagesClient<$Result.GetResult<Prisma.$chatMessagesPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more ChatMessages.
     * @param {chatMessagesDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessages.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends chatMessagesDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, chatMessagesDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chatMessagesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessages = await prisma.chatMessages.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends chatMessagesUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, chatMessagesUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChatMessages.
     * @param {chatMessagesUpsertArgs} args - Arguments to update or create a ChatMessages.
     * @example
     * // Update or create a ChatMessages
     * const chatMessages = await prisma.chatMessages.upsert({
     *   create: {
     *     // ... data to create a ChatMessages
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessages we want to update
     *   }
     * })
    **/
    upsert<T extends chatMessagesUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, chatMessagesUpsertArgs<ExtArgs>>
    ): Prisma__chatMessagesClient<$Result.GetResult<Prisma.$chatMessagesPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chatMessagesCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessages.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends chatMessagesCountArgs>(
      args?: Subset<T, chatMessagesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessagesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessagesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessagesAggregateArgs>(args: Subset<T, ChatMessagesAggregateArgs>): Prisma.PrismaPromise<GetChatMessagesAggregateType<T>>

    /**
     * Group by ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chatMessagesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends chatMessagesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: chatMessagesGroupByArgs['orderBy'] }
        : { orderBy?: chatMessagesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, chatMessagesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessagesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the chatMessages model
   */
  readonly fields: chatMessagesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for chatMessages.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__chatMessagesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    agents<T extends agentsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, agentsDefaultArgs<ExtArgs>>): Prisma__agentsClient<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the chatMessages model
   */ 
  interface chatMessagesFieldRefs {
    readonly id: FieldRef<"chatMessages", 'String'>
    readonly agentId: FieldRef<"chatMessages", 'String'>
    readonly sender: FieldRef<"chatMessages", 'String'>
    readonly connector: FieldRef<"chatMessages", 'String'>
    readonly content: FieldRef<"chatMessages", 'String'>
    readonly conversationId: FieldRef<"chatMessages", 'String'>
    readonly created_at: FieldRef<"chatMessages", 'DateTime'>
    readonly updated_at: FieldRef<"chatMessages", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * chatMessages findUnique
   */
  export type chatMessagesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chatMessages
     */
    select?: chatMessagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: chatMessagesInclude<ExtArgs> | null
    /**
     * Filter, which chatMessages to fetch.
     */
    where: chatMessagesWhereUniqueInput
  }


  /**
   * chatMessages findUniqueOrThrow
   */
  export type chatMessagesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chatMessages
     */
    select?: chatMessagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: chatMessagesInclude<ExtArgs> | null
    /**
     * Filter, which chatMessages to fetch.
     */
    where: chatMessagesWhereUniqueInput
  }


  /**
   * chatMessages findFirst
   */
  export type chatMessagesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chatMessages
     */
    select?: chatMessagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: chatMessagesInclude<ExtArgs> | null
    /**
     * Filter, which chatMessages to fetch.
     */
    where?: chatMessagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chatMessages to fetch.
     */
    orderBy?: chatMessagesOrderByWithRelationAndSearchRelevanceInput | chatMessagesOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for chatMessages.
     */
    cursor?: chatMessagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of chatMessages.
     */
    distinct?: ChatMessagesScalarFieldEnum | ChatMessagesScalarFieldEnum[]
  }


  /**
   * chatMessages findFirstOrThrow
   */
  export type chatMessagesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chatMessages
     */
    select?: chatMessagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: chatMessagesInclude<ExtArgs> | null
    /**
     * Filter, which chatMessages to fetch.
     */
    where?: chatMessagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chatMessages to fetch.
     */
    orderBy?: chatMessagesOrderByWithRelationAndSearchRelevanceInput | chatMessagesOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for chatMessages.
     */
    cursor?: chatMessagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of chatMessages.
     */
    distinct?: ChatMessagesScalarFieldEnum | ChatMessagesScalarFieldEnum[]
  }


  /**
   * chatMessages findMany
   */
  export type chatMessagesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chatMessages
     */
    select?: chatMessagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: chatMessagesInclude<ExtArgs> | null
    /**
     * Filter, which chatMessages to fetch.
     */
    where?: chatMessagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chatMessages to fetch.
     */
    orderBy?: chatMessagesOrderByWithRelationAndSearchRelevanceInput | chatMessagesOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing chatMessages.
     */
    cursor?: chatMessagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chatMessages.
     */
    skip?: number
    distinct?: ChatMessagesScalarFieldEnum | ChatMessagesScalarFieldEnum[]
  }


  /**
   * chatMessages create
   */
  export type chatMessagesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chatMessages
     */
    select?: chatMessagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: chatMessagesInclude<ExtArgs> | null
    /**
     * The data needed to create a chatMessages.
     */
    data: XOR<chatMessagesCreateInput, chatMessagesUncheckedCreateInput>
  }


  /**
   * chatMessages createMany
   */
  export type chatMessagesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many chatMessages.
     */
    data: chatMessagesCreateManyInput | chatMessagesCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * chatMessages update
   */
  export type chatMessagesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chatMessages
     */
    select?: chatMessagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: chatMessagesInclude<ExtArgs> | null
    /**
     * The data needed to update a chatMessages.
     */
    data: XOR<chatMessagesUpdateInput, chatMessagesUncheckedUpdateInput>
    /**
     * Choose, which chatMessages to update.
     */
    where: chatMessagesWhereUniqueInput
  }


  /**
   * chatMessages updateMany
   */
  export type chatMessagesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update chatMessages.
     */
    data: XOR<chatMessagesUpdateManyMutationInput, chatMessagesUncheckedUpdateManyInput>
    /**
     * Filter which chatMessages to update
     */
    where?: chatMessagesWhereInput
  }


  /**
   * chatMessages upsert
   */
  export type chatMessagesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chatMessages
     */
    select?: chatMessagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: chatMessagesInclude<ExtArgs> | null
    /**
     * The filter to search for the chatMessages to update in case it exists.
     */
    where: chatMessagesWhereUniqueInput
    /**
     * In case the chatMessages found by the `where` argument doesn't exist, create a new chatMessages with this data.
     */
    create: XOR<chatMessagesCreateInput, chatMessagesUncheckedCreateInput>
    /**
     * In case the chatMessages was found with the provided `where` argument, update it with this data.
     */
    update: XOR<chatMessagesUpdateInput, chatMessagesUncheckedUpdateInput>
  }


  /**
   * chatMessages delete
   */
  export type chatMessagesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chatMessages
     */
    select?: chatMessagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: chatMessagesInclude<ExtArgs> | null
    /**
     * Filter which chatMessages to delete.
     */
    where: chatMessagesWhereUniqueInput
  }


  /**
   * chatMessages deleteMany
   */
  export type chatMessagesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which chatMessages to delete
     */
    where?: chatMessagesWhereInput
  }


  /**
   * chatMessages without action
   */
  export type chatMessagesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chatMessages
     */
    select?: chatMessagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: chatMessagesInclude<ExtArgs> | null
  }



  /**
   * Model credentials
   */

  export type AggregateCredentials = {
    _count: CredentialsCountAggregateOutputType | null
    _min: CredentialsMinAggregateOutputType | null
    _max: CredentialsMaxAggregateOutputType | null
  }

  export type CredentialsMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    serviceType: string | null
    credentialType: string | null
    value: string | null
    description: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CredentialsMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    serviceType: string | null
    credentialType: string | null
    value: string | null
    description: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CredentialsCountAggregateOutputType = {
    id: number
    projectId: number
    name: number
    serviceType: number
    credentialType: number
    value: number
    description: number
    metadata: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type CredentialsMinAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    serviceType?: true
    credentialType?: true
    value?: true
    description?: true
    created_at?: true
    updated_at?: true
  }

  export type CredentialsMaxAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    serviceType?: true
    credentialType?: true
    value?: true
    description?: true
    created_at?: true
    updated_at?: true
  }

  export type CredentialsCountAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    serviceType?: true
    credentialType?: true
    value?: true
    description?: true
    metadata?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type CredentialsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which credentials to aggregate.
     */
    where?: credentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of credentials to fetch.
     */
    orderBy?: credentialsOrderByWithRelationAndSearchRelevanceInput | credentialsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: credentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` credentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned credentials
    **/
    _count?: true | CredentialsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CredentialsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CredentialsMaxAggregateInputType
  }

  export type GetCredentialsAggregateType<T extends CredentialsAggregateArgs> = {
        [P in keyof T & keyof AggregateCredentials]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCredentials[P]>
      : GetScalarType<T[P], AggregateCredentials[P]>
  }




  export type credentialsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: credentialsWhereInput
    orderBy?: credentialsOrderByWithAggregationInput | credentialsOrderByWithAggregationInput[]
    by: CredentialsScalarFieldEnum[] | CredentialsScalarFieldEnum
    having?: credentialsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CredentialsCountAggregateInputType | true
    _min?: CredentialsMinAggregateInputType
    _max?: CredentialsMaxAggregateInputType
  }

  export type CredentialsGroupByOutputType = {
    id: string
    projectId: string
    name: string
    serviceType: string
    credentialType: string
    value: string
    description: string | null
    metadata: JsonValue | null
    created_at: Date
    updated_at: Date
    _count: CredentialsCountAggregateOutputType | null
    _min: CredentialsMinAggregateOutputType | null
    _max: CredentialsMaxAggregateOutputType | null
  }

  type GetCredentialsGroupByPayload<T extends credentialsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CredentialsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CredentialsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CredentialsGroupByOutputType[P]>
            : GetScalarType<T[P], CredentialsGroupByOutputType[P]>
        }
      >
    >


  export type credentialsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    serviceType?: boolean
    credentialType?: boolean
    value?: boolean
    description?: boolean
    metadata?: boolean
    created_at?: boolean
    updated_at?: boolean
    agent_credentials?: boolean | credentials$agent_credentialsArgs<ExtArgs>
    _count?: boolean | CredentialsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["credentials"]>

  export type credentialsSelectScalar = {
    id?: boolean
    projectId?: boolean
    name?: boolean
    serviceType?: boolean
    credentialType?: boolean
    value?: boolean
    description?: boolean
    metadata?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type credentialsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent_credentials?: boolean | credentials$agent_credentialsArgs<ExtArgs>
    _count?: boolean | CredentialsCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $credentialsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "credentials"
    objects: {
      agent_credentials: Prisma.$agent_credentialsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      name: string
      serviceType: string
      credentialType: string
      value: string
      description: string | null
      metadata: Prisma.JsonValue | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["credentials"]>
    composites: {}
  }


  type credentialsGetPayload<S extends boolean | null | undefined | credentialsDefaultArgs> = $Result.GetResult<Prisma.$credentialsPayload, S>

  type credentialsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<credentialsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CredentialsCountAggregateInputType | true
    }

  export interface credentialsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['credentials'], meta: { name: 'credentials' } }
    /**
     * Find zero or one Credentials that matches the filter.
     * @param {credentialsFindUniqueArgs} args - Arguments to find a Credentials
     * @example
     * // Get one Credentials
     * const credentials = await prisma.credentials.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends credentialsFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, credentialsFindUniqueArgs<ExtArgs>>
    ): Prisma__credentialsClient<$Result.GetResult<Prisma.$credentialsPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Credentials that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {credentialsFindUniqueOrThrowArgs} args - Arguments to find a Credentials
     * @example
     * // Get one Credentials
     * const credentials = await prisma.credentials.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends credentialsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, credentialsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__credentialsClient<$Result.GetResult<Prisma.$credentialsPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Credentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {credentialsFindFirstArgs} args - Arguments to find a Credentials
     * @example
     * // Get one Credentials
     * const credentials = await prisma.credentials.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends credentialsFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, credentialsFindFirstArgs<ExtArgs>>
    ): Prisma__credentialsClient<$Result.GetResult<Prisma.$credentialsPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Credentials that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {credentialsFindFirstOrThrowArgs} args - Arguments to find a Credentials
     * @example
     * // Get one Credentials
     * const credentials = await prisma.credentials.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends credentialsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, credentialsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__credentialsClient<$Result.GetResult<Prisma.$credentialsPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Credentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {credentialsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Credentials
     * const credentials = await prisma.credentials.findMany()
     * 
     * // Get first 10 Credentials
     * const credentials = await prisma.credentials.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const credentialsWithIdOnly = await prisma.credentials.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends credentialsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, credentialsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$credentialsPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Credentials.
     * @param {credentialsCreateArgs} args - Arguments to create a Credentials.
     * @example
     * // Create one Credentials
     * const Credentials = await prisma.credentials.create({
     *   data: {
     *     // ... data to create a Credentials
     *   }
     * })
     * 
    **/
    create<T extends credentialsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, credentialsCreateArgs<ExtArgs>>
    ): Prisma__credentialsClient<$Result.GetResult<Prisma.$credentialsPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Credentials.
     *     @param {credentialsCreateManyArgs} args - Arguments to create many Credentials.
     *     @example
     *     // Create many Credentials
     *     const credentials = await prisma.credentials.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends credentialsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, credentialsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Credentials.
     * @param {credentialsDeleteArgs} args - Arguments to delete one Credentials.
     * @example
     * // Delete one Credentials
     * const Credentials = await prisma.credentials.delete({
     *   where: {
     *     // ... filter to delete one Credentials
     *   }
     * })
     * 
    **/
    delete<T extends credentialsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, credentialsDeleteArgs<ExtArgs>>
    ): Prisma__credentialsClient<$Result.GetResult<Prisma.$credentialsPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Credentials.
     * @param {credentialsUpdateArgs} args - Arguments to update one Credentials.
     * @example
     * // Update one Credentials
     * const credentials = await prisma.credentials.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends credentialsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, credentialsUpdateArgs<ExtArgs>>
    ): Prisma__credentialsClient<$Result.GetResult<Prisma.$credentialsPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Credentials.
     * @param {credentialsDeleteManyArgs} args - Arguments to filter Credentials to delete.
     * @example
     * // Delete a few Credentials
     * const { count } = await prisma.credentials.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends credentialsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, credentialsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {credentialsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Credentials
     * const credentials = await prisma.credentials.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends credentialsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, credentialsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Credentials.
     * @param {credentialsUpsertArgs} args - Arguments to update or create a Credentials.
     * @example
     * // Update or create a Credentials
     * const credentials = await prisma.credentials.upsert({
     *   create: {
     *     // ... data to create a Credentials
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Credentials we want to update
     *   }
     * })
    **/
    upsert<T extends credentialsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, credentialsUpsertArgs<ExtArgs>>
    ): Prisma__credentialsClient<$Result.GetResult<Prisma.$credentialsPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {credentialsCountArgs} args - Arguments to filter Credentials to count.
     * @example
     * // Count the number of Credentials
     * const count = await prisma.credentials.count({
     *   where: {
     *     // ... the filter for the Credentials we want to count
     *   }
     * })
    **/
    count<T extends credentialsCountArgs>(
      args?: Subset<T, credentialsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CredentialsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CredentialsAggregateArgs>(args: Subset<T, CredentialsAggregateArgs>): Prisma.PrismaPromise<GetCredentialsAggregateType<T>>

    /**
     * Group by Credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {credentialsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends credentialsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: credentialsGroupByArgs['orderBy'] }
        : { orderBy?: credentialsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, credentialsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCredentialsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the credentials model
   */
  readonly fields: credentialsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for credentials.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__credentialsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    agent_credentials<T extends credentials$agent_credentialsArgs<ExtArgs> = {}>(args?: Subset<T, credentials$agent_credentialsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$agent_credentialsPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the credentials model
   */ 
  interface credentialsFieldRefs {
    readonly id: FieldRef<"credentials", 'String'>
    readonly projectId: FieldRef<"credentials", 'String'>
    readonly name: FieldRef<"credentials", 'String'>
    readonly serviceType: FieldRef<"credentials", 'String'>
    readonly credentialType: FieldRef<"credentials", 'String'>
    readonly value: FieldRef<"credentials", 'String'>
    readonly description: FieldRef<"credentials", 'String'>
    readonly metadata: FieldRef<"credentials", 'Json'>
    readonly created_at: FieldRef<"credentials", 'DateTime'>
    readonly updated_at: FieldRef<"credentials", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * credentials findUnique
   */
  export type credentialsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the credentials
     */
    select?: credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: credentialsInclude<ExtArgs> | null
    /**
     * Filter, which credentials to fetch.
     */
    where: credentialsWhereUniqueInput
  }


  /**
   * credentials findUniqueOrThrow
   */
  export type credentialsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the credentials
     */
    select?: credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: credentialsInclude<ExtArgs> | null
    /**
     * Filter, which credentials to fetch.
     */
    where: credentialsWhereUniqueInput
  }


  /**
   * credentials findFirst
   */
  export type credentialsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the credentials
     */
    select?: credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: credentialsInclude<ExtArgs> | null
    /**
     * Filter, which credentials to fetch.
     */
    where?: credentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of credentials to fetch.
     */
    orderBy?: credentialsOrderByWithRelationAndSearchRelevanceInput | credentialsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for credentials.
     */
    cursor?: credentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` credentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of credentials.
     */
    distinct?: CredentialsScalarFieldEnum | CredentialsScalarFieldEnum[]
  }


  /**
   * credentials findFirstOrThrow
   */
  export type credentialsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the credentials
     */
    select?: credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: credentialsInclude<ExtArgs> | null
    /**
     * Filter, which credentials to fetch.
     */
    where?: credentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of credentials to fetch.
     */
    orderBy?: credentialsOrderByWithRelationAndSearchRelevanceInput | credentialsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for credentials.
     */
    cursor?: credentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` credentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of credentials.
     */
    distinct?: CredentialsScalarFieldEnum | CredentialsScalarFieldEnum[]
  }


  /**
   * credentials findMany
   */
  export type credentialsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the credentials
     */
    select?: credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: credentialsInclude<ExtArgs> | null
    /**
     * Filter, which credentials to fetch.
     */
    where?: credentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of credentials to fetch.
     */
    orderBy?: credentialsOrderByWithRelationAndSearchRelevanceInput | credentialsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing credentials.
     */
    cursor?: credentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` credentials.
     */
    skip?: number
    distinct?: CredentialsScalarFieldEnum | CredentialsScalarFieldEnum[]
  }


  /**
   * credentials create
   */
  export type credentialsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the credentials
     */
    select?: credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: credentialsInclude<ExtArgs> | null
    /**
     * The data needed to create a credentials.
     */
    data: XOR<credentialsCreateInput, credentialsUncheckedCreateInput>
  }


  /**
   * credentials createMany
   */
  export type credentialsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many credentials.
     */
    data: credentialsCreateManyInput | credentialsCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * credentials update
   */
  export type credentialsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the credentials
     */
    select?: credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: credentialsInclude<ExtArgs> | null
    /**
     * The data needed to update a credentials.
     */
    data: XOR<credentialsUpdateInput, credentialsUncheckedUpdateInput>
    /**
     * Choose, which credentials to update.
     */
    where: credentialsWhereUniqueInput
  }


  /**
   * credentials updateMany
   */
  export type credentialsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update credentials.
     */
    data: XOR<credentialsUpdateManyMutationInput, credentialsUncheckedUpdateManyInput>
    /**
     * Filter which credentials to update
     */
    where?: credentialsWhereInput
  }


  /**
   * credentials upsert
   */
  export type credentialsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the credentials
     */
    select?: credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: credentialsInclude<ExtArgs> | null
    /**
     * The filter to search for the credentials to update in case it exists.
     */
    where: credentialsWhereUniqueInput
    /**
     * In case the credentials found by the `where` argument doesn't exist, create a new credentials with this data.
     */
    create: XOR<credentialsCreateInput, credentialsUncheckedCreateInput>
    /**
     * In case the credentials was found with the provided `where` argument, update it with this data.
     */
    update: XOR<credentialsUpdateInput, credentialsUncheckedUpdateInput>
  }


  /**
   * credentials delete
   */
  export type credentialsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the credentials
     */
    select?: credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: credentialsInclude<ExtArgs> | null
    /**
     * Filter which credentials to delete.
     */
    where: credentialsWhereUniqueInput
  }


  /**
   * credentials deleteMany
   */
  export type credentialsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which credentials to delete
     */
    where?: credentialsWhereInput
  }


  /**
   * credentials.agent_credentials
   */
  export type credentials$agent_credentialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agent_credentials
     */
    select?: agent_credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agent_credentialsInclude<ExtArgs> | null
    where?: agent_credentialsWhereInput
    orderBy?: agent_credentialsOrderByWithRelationAndSearchRelevanceInput | agent_credentialsOrderByWithRelationAndSearchRelevanceInput[]
    cursor?: agent_credentialsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Agent_credentialsScalarFieldEnum | Agent_credentialsScalarFieldEnum[]
  }


  /**
   * credentials without action
   */
  export type credentialsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the credentials
     */
    select?: credentialsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: credentialsInclude<ExtArgs> | null
  }



  /**
   * Model documents
   */

  export type AggregateDocuments = {
    _count: DocumentsCountAggregateOutputType | null
    _min: DocumentsMinAggregateOutputType | null
    _max: DocumentsMaxAggregateOutputType | null
  }

  export type DocumentsMinAggregateOutputType = {
    id: string | null
    type: string | null
    projectId: string | null
    date: string | null
  }

  export type DocumentsMaxAggregateOutputType = {
    id: string | null
    type: string | null
    projectId: string | null
    date: string | null
  }

  export type DocumentsCountAggregateOutputType = {
    id: number
    type: number
    projectId: number
    date: number
    metadata: number
    _all: number
  }


  export type DocumentsMinAggregateInputType = {
    id?: true
    type?: true
    projectId?: true
    date?: true
  }

  export type DocumentsMaxAggregateInputType = {
    id?: true
    type?: true
    projectId?: true
    date?: true
  }

  export type DocumentsCountAggregateInputType = {
    id?: true
    type?: true
    projectId?: true
    date?: true
    metadata?: true
    _all?: true
  }

  export type DocumentsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which documents to aggregate.
     */
    where?: documentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of documents to fetch.
     */
    orderBy?: documentsOrderByWithRelationAndSearchRelevanceInput | documentsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: documentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned documents
    **/
    _count?: true | DocumentsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentsMaxAggregateInputType
  }

  export type GetDocumentsAggregateType<T extends DocumentsAggregateArgs> = {
        [P in keyof T & keyof AggregateDocuments]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocuments[P]>
      : GetScalarType<T[P], AggregateDocuments[P]>
  }




  export type documentsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: documentsWhereInput
    orderBy?: documentsOrderByWithAggregationInput | documentsOrderByWithAggregationInput[]
    by: DocumentsScalarFieldEnum[] | DocumentsScalarFieldEnum
    having?: documentsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentsCountAggregateInputType | true
    _min?: DocumentsMinAggregateInputType
    _max?: DocumentsMaxAggregateInputType
  }

  export type DocumentsGroupByOutputType = {
    id: string
    type: string | null
    projectId: string | null
    date: string | null
    metadata: JsonValue | null
    _count: DocumentsCountAggregateOutputType | null
    _min: DocumentsMinAggregateOutputType | null
    _max: DocumentsMaxAggregateOutputType | null
  }

  type GetDocumentsGroupByPayload<T extends documentsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentsGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentsGroupByOutputType[P]>
        }
      >
    >


  export type documentsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    projectId?: boolean
    date?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["documents"]>

  export type documentsSelectScalar = {
    id?: boolean
    type?: boolean
    projectId?: boolean
    date?: boolean
    metadata?: boolean
  }


  export type $documentsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "documents"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string | null
      projectId: string | null
      date: string | null
      metadata: Prisma.JsonValue | null
    }, ExtArgs["result"]["documents"]>
    composites: {}
  }


  type documentsGetPayload<S extends boolean | null | undefined | documentsDefaultArgs> = $Result.GetResult<Prisma.$documentsPayload, S>

  type documentsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<documentsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DocumentsCountAggregateInputType | true
    }

  export interface documentsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['documents'], meta: { name: 'documents' } }
    /**
     * Find zero or one Documents that matches the filter.
     * @param {documentsFindUniqueArgs} args - Arguments to find a Documents
     * @example
     * // Get one Documents
     * const documents = await prisma.documents.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends documentsFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, documentsFindUniqueArgs<ExtArgs>>
    ): Prisma__documentsClient<$Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Documents that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {documentsFindUniqueOrThrowArgs} args - Arguments to find a Documents
     * @example
     * // Get one Documents
     * const documents = await prisma.documents.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends documentsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, documentsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__documentsClient<$Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {documentsFindFirstArgs} args - Arguments to find a Documents
     * @example
     * // Get one Documents
     * const documents = await prisma.documents.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends documentsFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, documentsFindFirstArgs<ExtArgs>>
    ): Prisma__documentsClient<$Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Documents that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {documentsFindFirstOrThrowArgs} args - Arguments to find a Documents
     * @example
     * // Get one Documents
     * const documents = await prisma.documents.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends documentsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, documentsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__documentsClient<$Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {documentsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.documents.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.documents.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentsWithIdOnly = await prisma.documents.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends documentsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, documentsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Documents.
     * @param {documentsCreateArgs} args - Arguments to create a Documents.
     * @example
     * // Create one Documents
     * const Documents = await prisma.documents.create({
     *   data: {
     *     // ... data to create a Documents
     *   }
     * })
     * 
    **/
    create<T extends documentsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, documentsCreateArgs<ExtArgs>>
    ): Prisma__documentsClient<$Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Documents.
     *     @param {documentsCreateManyArgs} args - Arguments to create many Documents.
     *     @example
     *     // Create many Documents
     *     const documents = await prisma.documents.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends documentsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, documentsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Documents.
     * @param {documentsDeleteArgs} args - Arguments to delete one Documents.
     * @example
     * // Delete one Documents
     * const Documents = await prisma.documents.delete({
     *   where: {
     *     // ... filter to delete one Documents
     *   }
     * })
     * 
    **/
    delete<T extends documentsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, documentsDeleteArgs<ExtArgs>>
    ): Prisma__documentsClient<$Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Documents.
     * @param {documentsUpdateArgs} args - Arguments to update one Documents.
     * @example
     * // Update one Documents
     * const documents = await prisma.documents.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends documentsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, documentsUpdateArgs<ExtArgs>>
    ): Prisma__documentsClient<$Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Documents.
     * @param {documentsDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.documents.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends documentsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, documentsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {documentsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const documents = await prisma.documents.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends documentsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, documentsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Documents.
     * @param {documentsUpsertArgs} args - Arguments to update or create a Documents.
     * @example
     * // Update or create a Documents
     * const documents = await prisma.documents.upsert({
     *   create: {
     *     // ... data to create a Documents
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Documents we want to update
     *   }
     * })
    **/
    upsert<T extends documentsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, documentsUpsertArgs<ExtArgs>>
    ): Prisma__documentsClient<$Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {documentsCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.documents.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends documentsCountArgs>(
      args?: Subset<T, documentsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentsAggregateArgs>(args: Subset<T, DocumentsAggregateArgs>): Prisma.PrismaPromise<GetDocumentsAggregateType<T>>

    /**
     * Group by Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {documentsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends documentsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: documentsGroupByArgs['orderBy'] }
        : { orderBy?: documentsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, documentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the documents model
   */
  readonly fields: documentsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for documents.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__documentsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the documents model
   */ 
  interface documentsFieldRefs {
    readonly id: FieldRef<"documents", 'String'>
    readonly type: FieldRef<"documents", 'String'>
    readonly projectId: FieldRef<"documents", 'String'>
    readonly date: FieldRef<"documents", 'String'>
    readonly metadata: FieldRef<"documents", 'Json'>
  }
    

  // Custom InputTypes

  /**
   * documents findUnique
   */
  export type documentsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the documents
     */
    select?: documentsSelect<ExtArgs> | null
    /**
     * Filter, which documents to fetch.
     */
    where: documentsWhereUniqueInput
  }


  /**
   * documents findUniqueOrThrow
   */
  export type documentsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the documents
     */
    select?: documentsSelect<ExtArgs> | null
    /**
     * Filter, which documents to fetch.
     */
    where: documentsWhereUniqueInput
  }


  /**
   * documents findFirst
   */
  export type documentsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the documents
     */
    select?: documentsSelect<ExtArgs> | null
    /**
     * Filter, which documents to fetch.
     */
    where?: documentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of documents to fetch.
     */
    orderBy?: documentsOrderByWithRelationAndSearchRelevanceInput | documentsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for documents.
     */
    cursor?: documentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of documents.
     */
    distinct?: DocumentsScalarFieldEnum | DocumentsScalarFieldEnum[]
  }


  /**
   * documents findFirstOrThrow
   */
  export type documentsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the documents
     */
    select?: documentsSelect<ExtArgs> | null
    /**
     * Filter, which documents to fetch.
     */
    where?: documentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of documents to fetch.
     */
    orderBy?: documentsOrderByWithRelationAndSearchRelevanceInput | documentsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for documents.
     */
    cursor?: documentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of documents.
     */
    distinct?: DocumentsScalarFieldEnum | DocumentsScalarFieldEnum[]
  }


  /**
   * documents findMany
   */
  export type documentsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the documents
     */
    select?: documentsSelect<ExtArgs> | null
    /**
     * Filter, which documents to fetch.
     */
    where?: documentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of documents to fetch.
     */
    orderBy?: documentsOrderByWithRelationAndSearchRelevanceInput | documentsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing documents.
     */
    cursor?: documentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` documents.
     */
    skip?: number
    distinct?: DocumentsScalarFieldEnum | DocumentsScalarFieldEnum[]
  }


  /**
   * documents create
   */
  export type documentsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the documents
     */
    select?: documentsSelect<ExtArgs> | null
    /**
     * The data needed to create a documents.
     */
    data: XOR<documentsCreateInput, documentsUncheckedCreateInput>
  }


  /**
   * documents createMany
   */
  export type documentsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many documents.
     */
    data: documentsCreateManyInput | documentsCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * documents update
   */
  export type documentsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the documents
     */
    select?: documentsSelect<ExtArgs> | null
    /**
     * The data needed to update a documents.
     */
    data: XOR<documentsUpdateInput, documentsUncheckedUpdateInput>
    /**
     * Choose, which documents to update.
     */
    where: documentsWhereUniqueInput
  }


  /**
   * documents updateMany
   */
  export type documentsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update documents.
     */
    data: XOR<documentsUpdateManyMutationInput, documentsUncheckedUpdateManyInput>
    /**
     * Filter which documents to update
     */
    where?: documentsWhereInput
  }


  /**
   * documents upsert
   */
  export type documentsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the documents
     */
    select?: documentsSelect<ExtArgs> | null
    /**
     * The filter to search for the documents to update in case it exists.
     */
    where: documentsWhereUniqueInput
    /**
     * In case the documents found by the `where` argument doesn't exist, create a new documents with this data.
     */
    create: XOR<documentsCreateInput, documentsUncheckedCreateInput>
    /**
     * In case the documents was found with the provided `where` argument, update it with this data.
     */
    update: XOR<documentsUpdateInput, documentsUncheckedUpdateInput>
  }


  /**
   * documents delete
   */
  export type documentsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the documents
     */
    select?: documentsSelect<ExtArgs> | null
    /**
     * Filter which documents to delete.
     */
    where: documentsWhereUniqueInput
  }


  /**
   * documents deleteMany
   */
  export type documentsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which documents to delete
     */
    where?: documentsWhereInput
  }


  /**
   * documents without action
   */
  export type documentsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the documents
     */
    select?: documentsSelect<ExtArgs> | null
  }



  /**
   * Model embeddings
   */

  export type AggregateEmbeddings = {
    _count: EmbeddingsCountAggregateOutputType | null
    _avg: EmbeddingsAvgAggregateOutputType | null
    _sum: EmbeddingsSumAggregateOutputType | null
    _min: EmbeddingsMinAggregateOutputType | null
    _max: EmbeddingsMaxAggregateOutputType | null
  }

  export type EmbeddingsAvgAggregateOutputType = {
    id: number | null
    index: number | null
  }

  export type EmbeddingsSumAggregateOutputType = {
    id: number | null
    index: number | null
  }

  export type EmbeddingsMinAggregateOutputType = {
    id: number | null
    documentId: string | null
    content: string | null
    index: number | null
  }

  export type EmbeddingsMaxAggregateOutputType = {
    id: number | null
    documentId: string | null
    content: string | null
    index: number | null
  }

  export type EmbeddingsCountAggregateOutputType = {
    id: number
    documentId: number
    content: number
    index: number
    _all: number
  }


  export type EmbeddingsAvgAggregateInputType = {
    id?: true
    index?: true
  }

  export type EmbeddingsSumAggregateInputType = {
    id?: true
    index?: true
  }

  export type EmbeddingsMinAggregateInputType = {
    id?: true
    documentId?: true
    content?: true
    index?: true
  }

  export type EmbeddingsMaxAggregateInputType = {
    id?: true
    documentId?: true
    content?: true
    index?: true
  }

  export type EmbeddingsCountAggregateInputType = {
    id?: true
    documentId?: true
    content?: true
    index?: true
    _all?: true
  }

  export type EmbeddingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which embeddings to aggregate.
     */
    where?: embeddingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of embeddings to fetch.
     */
    orderBy?: embeddingsOrderByWithRelationAndSearchRelevanceInput | embeddingsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: embeddingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` embeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` embeddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned embeddings
    **/
    _count?: true | EmbeddingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EmbeddingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EmbeddingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmbeddingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmbeddingsMaxAggregateInputType
  }

  export type GetEmbeddingsAggregateType<T extends EmbeddingsAggregateArgs> = {
        [P in keyof T & keyof AggregateEmbeddings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmbeddings[P]>
      : GetScalarType<T[P], AggregateEmbeddings[P]>
  }




  export type embeddingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: embeddingsWhereInput
    orderBy?: embeddingsOrderByWithAggregationInput | embeddingsOrderByWithAggregationInput[]
    by: EmbeddingsScalarFieldEnum[] | EmbeddingsScalarFieldEnum
    having?: embeddingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmbeddingsCountAggregateInputType | true
    _avg?: EmbeddingsAvgAggregateInputType
    _sum?: EmbeddingsSumAggregateInputType
    _min?: EmbeddingsMinAggregateInputType
    _max?: EmbeddingsMaxAggregateInputType
  }

  export type EmbeddingsGroupByOutputType = {
    id: number
    documentId: string | null
    content: string | null
    index: number | null
    _count: EmbeddingsCountAggregateOutputType | null
    _avg: EmbeddingsAvgAggregateOutputType | null
    _sum: EmbeddingsSumAggregateOutputType | null
    _min: EmbeddingsMinAggregateOutputType | null
    _max: EmbeddingsMaxAggregateOutputType | null
  }

  type GetEmbeddingsGroupByPayload<T extends embeddingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmbeddingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmbeddingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmbeddingsGroupByOutputType[P]>
            : GetScalarType<T[P], EmbeddingsGroupByOutputType[P]>
        }
      >
    >


  export type embeddingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    content?: boolean
    index?: boolean
  }, ExtArgs["result"]["embeddings"]>

  export type embeddingsSelectScalar = {
    id?: boolean
    documentId?: boolean
    content?: boolean
    index?: boolean
  }


  export type $embeddingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "embeddings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      documentId: string | null
      content: string | null
      index: number | null
    }, ExtArgs["result"]["embeddings"]>
    composites: {}
  }


  type embeddingsGetPayload<S extends boolean | null | undefined | embeddingsDefaultArgs> = $Result.GetResult<Prisma.$embeddingsPayload, S>

  type embeddingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<embeddingsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EmbeddingsCountAggregateInputType | true
    }

  export interface embeddingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['embeddings'], meta: { name: 'embeddings' } }
    /**
     * Find zero or one Embeddings that matches the filter.
     * @param {embeddingsFindUniqueArgs} args - Arguments to find a Embeddings
     * @example
     * // Get one Embeddings
     * const embeddings = await prisma.embeddings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends embeddingsFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, embeddingsFindUniqueArgs<ExtArgs>>
    ): Prisma__embeddingsClient<$Result.GetResult<Prisma.$embeddingsPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Embeddings that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {embeddingsFindUniqueOrThrowArgs} args - Arguments to find a Embeddings
     * @example
     * // Get one Embeddings
     * const embeddings = await prisma.embeddings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends embeddingsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, embeddingsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__embeddingsClient<$Result.GetResult<Prisma.$embeddingsPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Embeddings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {embeddingsFindFirstArgs} args - Arguments to find a Embeddings
     * @example
     * // Get one Embeddings
     * const embeddings = await prisma.embeddings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends embeddingsFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, embeddingsFindFirstArgs<ExtArgs>>
    ): Prisma__embeddingsClient<$Result.GetResult<Prisma.$embeddingsPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Embeddings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {embeddingsFindFirstOrThrowArgs} args - Arguments to find a Embeddings
     * @example
     * // Get one Embeddings
     * const embeddings = await prisma.embeddings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends embeddingsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, embeddingsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__embeddingsClient<$Result.GetResult<Prisma.$embeddingsPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Embeddings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {embeddingsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Embeddings
     * const embeddings = await prisma.embeddings.findMany()
     * 
     * // Get first 10 Embeddings
     * const embeddings = await prisma.embeddings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const embeddingsWithIdOnly = await prisma.embeddings.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends embeddingsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, embeddingsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$embeddingsPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Embeddings.
     * @param {embeddingsCreateArgs} args - Arguments to create a Embeddings.
     * @example
     * // Create one Embeddings
     * const Embeddings = await prisma.embeddings.create({
     *   data: {
     *     // ... data to create a Embeddings
     *   }
     * })
     * 
    **/
    create<T extends embeddingsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, embeddingsCreateArgs<ExtArgs>>
    ): Prisma__embeddingsClient<$Result.GetResult<Prisma.$embeddingsPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Embeddings.
     *     @param {embeddingsCreateManyArgs} args - Arguments to create many Embeddings.
     *     @example
     *     // Create many Embeddings
     *     const embeddings = await prisma.embeddings.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends embeddingsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, embeddingsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Embeddings.
     * @param {embeddingsDeleteArgs} args - Arguments to delete one Embeddings.
     * @example
     * // Delete one Embeddings
     * const Embeddings = await prisma.embeddings.delete({
     *   where: {
     *     // ... filter to delete one Embeddings
     *   }
     * })
     * 
    **/
    delete<T extends embeddingsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, embeddingsDeleteArgs<ExtArgs>>
    ): Prisma__embeddingsClient<$Result.GetResult<Prisma.$embeddingsPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Embeddings.
     * @param {embeddingsUpdateArgs} args - Arguments to update one Embeddings.
     * @example
     * // Update one Embeddings
     * const embeddings = await prisma.embeddings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends embeddingsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, embeddingsUpdateArgs<ExtArgs>>
    ): Prisma__embeddingsClient<$Result.GetResult<Prisma.$embeddingsPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Embeddings.
     * @param {embeddingsDeleteManyArgs} args - Arguments to filter Embeddings to delete.
     * @example
     * // Delete a few Embeddings
     * const { count } = await prisma.embeddings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends embeddingsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, embeddingsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Embeddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {embeddingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Embeddings
     * const embeddings = await prisma.embeddings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends embeddingsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, embeddingsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Embeddings.
     * @param {embeddingsUpsertArgs} args - Arguments to update or create a Embeddings.
     * @example
     * // Update or create a Embeddings
     * const embeddings = await prisma.embeddings.upsert({
     *   create: {
     *     // ... data to create a Embeddings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Embeddings we want to update
     *   }
     * })
    **/
    upsert<T extends embeddingsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, embeddingsUpsertArgs<ExtArgs>>
    ): Prisma__embeddingsClient<$Result.GetResult<Prisma.$embeddingsPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Embeddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {embeddingsCountArgs} args - Arguments to filter Embeddings to count.
     * @example
     * // Count the number of Embeddings
     * const count = await prisma.embeddings.count({
     *   where: {
     *     // ... the filter for the Embeddings we want to count
     *   }
     * })
    **/
    count<T extends embeddingsCountArgs>(
      args?: Subset<T, embeddingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmbeddingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Embeddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmbeddingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmbeddingsAggregateArgs>(args: Subset<T, EmbeddingsAggregateArgs>): Prisma.PrismaPromise<GetEmbeddingsAggregateType<T>>

    /**
     * Group by Embeddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {embeddingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends embeddingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: embeddingsGroupByArgs['orderBy'] }
        : { orderBy?: embeddingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, embeddingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmbeddingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the embeddings model
   */
  readonly fields: embeddingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for embeddings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__embeddingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the embeddings model
   */ 
  interface embeddingsFieldRefs {
    readonly id: FieldRef<"embeddings", 'Int'>
    readonly documentId: FieldRef<"embeddings", 'String'>
    readonly content: FieldRef<"embeddings", 'String'>
    readonly index: FieldRef<"embeddings", 'Int'>
  }
    

  // Custom InputTypes

  /**
   * embeddings findUnique
   */
  export type embeddingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the embeddings
     */
    select?: embeddingsSelect<ExtArgs> | null
    /**
     * Filter, which embeddings to fetch.
     */
    where: embeddingsWhereUniqueInput
  }


  /**
   * embeddings findUniqueOrThrow
   */
  export type embeddingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the embeddings
     */
    select?: embeddingsSelect<ExtArgs> | null
    /**
     * Filter, which embeddings to fetch.
     */
    where: embeddingsWhereUniqueInput
  }


  /**
   * embeddings findFirst
   */
  export type embeddingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the embeddings
     */
    select?: embeddingsSelect<ExtArgs> | null
    /**
     * Filter, which embeddings to fetch.
     */
    where?: embeddingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of embeddings to fetch.
     */
    orderBy?: embeddingsOrderByWithRelationAndSearchRelevanceInput | embeddingsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for embeddings.
     */
    cursor?: embeddingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` embeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` embeddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of embeddings.
     */
    distinct?: EmbeddingsScalarFieldEnum | EmbeddingsScalarFieldEnum[]
  }


  /**
   * embeddings findFirstOrThrow
   */
  export type embeddingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the embeddings
     */
    select?: embeddingsSelect<ExtArgs> | null
    /**
     * Filter, which embeddings to fetch.
     */
    where?: embeddingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of embeddings to fetch.
     */
    orderBy?: embeddingsOrderByWithRelationAndSearchRelevanceInput | embeddingsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for embeddings.
     */
    cursor?: embeddingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` embeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` embeddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of embeddings.
     */
    distinct?: EmbeddingsScalarFieldEnum | EmbeddingsScalarFieldEnum[]
  }


  /**
   * embeddings findMany
   */
  export type embeddingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the embeddings
     */
    select?: embeddingsSelect<ExtArgs> | null
    /**
     * Filter, which embeddings to fetch.
     */
    where?: embeddingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of embeddings to fetch.
     */
    orderBy?: embeddingsOrderByWithRelationAndSearchRelevanceInput | embeddingsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing embeddings.
     */
    cursor?: embeddingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` embeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` embeddings.
     */
    skip?: number
    distinct?: EmbeddingsScalarFieldEnum | EmbeddingsScalarFieldEnum[]
  }


  /**
   * embeddings create
   */
  export type embeddingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the embeddings
     */
    select?: embeddingsSelect<ExtArgs> | null
    /**
     * The data needed to create a embeddings.
     */
    data?: XOR<embeddingsCreateInput, embeddingsUncheckedCreateInput>
  }


  /**
   * embeddings createMany
   */
  export type embeddingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many embeddings.
     */
    data: embeddingsCreateManyInput | embeddingsCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * embeddings update
   */
  export type embeddingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the embeddings
     */
    select?: embeddingsSelect<ExtArgs> | null
    /**
     * The data needed to update a embeddings.
     */
    data: XOR<embeddingsUpdateInput, embeddingsUncheckedUpdateInput>
    /**
     * Choose, which embeddings to update.
     */
    where: embeddingsWhereUniqueInput
  }


  /**
   * embeddings updateMany
   */
  export type embeddingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update embeddings.
     */
    data: XOR<embeddingsUpdateManyMutationInput, embeddingsUncheckedUpdateManyInput>
    /**
     * Filter which embeddings to update
     */
    where?: embeddingsWhereInput
  }


  /**
   * embeddings upsert
   */
  export type embeddingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the embeddings
     */
    select?: embeddingsSelect<ExtArgs> | null
    /**
     * The filter to search for the embeddings to update in case it exists.
     */
    where: embeddingsWhereUniqueInput
    /**
     * In case the embeddings found by the `where` argument doesn't exist, create a new embeddings with this data.
     */
    create: XOR<embeddingsCreateInput, embeddingsUncheckedCreateInput>
    /**
     * In case the embeddings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<embeddingsUpdateInput, embeddingsUncheckedUpdateInput>
  }


  /**
   * embeddings delete
   */
  export type embeddingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the embeddings
     */
    select?: embeddingsSelect<ExtArgs> | null
    /**
     * Filter which embeddings to delete.
     */
    where: embeddingsWhereUniqueInput
  }


  /**
   * embeddings deleteMany
   */
  export type embeddingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which embeddings to delete
     */
    where?: embeddingsWhereInput
  }


  /**
   * embeddings without action
   */
  export type embeddingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the embeddings
     */
    select?: embeddingsSelect<ExtArgs> | null
  }



  /**
   * Model public_events
   */

  export type AggregatePublic_events = {
    _count: Public_eventsCountAggregateOutputType | null
    _min: Public_eventsMinAggregateOutputType | null
    _max: Public_eventsMaxAggregateOutputType | null
  }

  export type Public_eventsMinAggregateOutputType = {
    id: string | null
    type: string | null
    observer: string | null
    sender: string | null
    client: string | null
    channel: string | null
    channelType: string | null
    projectId: string | null
    content: string | null
    agentId: string | null
    date: string | null
    rawData: string | null
    connector: string | null
  }

  export type Public_eventsMaxAggregateOutputType = {
    id: string | null
    type: string | null
    observer: string | null
    sender: string | null
    client: string | null
    channel: string | null
    channelType: string | null
    projectId: string | null
    content: string | null
    agentId: string | null
    date: string | null
    rawData: string | null
    connector: string | null
  }

  export type Public_eventsCountAggregateOutputType = {
    id: number
    type: number
    observer: number
    sender: number
    client: number
    channel: number
    channelType: number
    projectId: number
    content: number
    agentId: number
    entities: number
    date: number
    rawData: number
    connector: number
    _all: number
  }


  export type Public_eventsMinAggregateInputType = {
    id?: true
    type?: true
    observer?: true
    sender?: true
    client?: true
    channel?: true
    channelType?: true
    projectId?: true
    content?: true
    agentId?: true
    date?: true
    rawData?: true
    connector?: true
  }

  export type Public_eventsMaxAggregateInputType = {
    id?: true
    type?: true
    observer?: true
    sender?: true
    client?: true
    channel?: true
    channelType?: true
    projectId?: true
    content?: true
    agentId?: true
    date?: true
    rawData?: true
    connector?: true
  }

  export type Public_eventsCountAggregateInputType = {
    id?: true
    type?: true
    observer?: true
    sender?: true
    client?: true
    channel?: true
    channelType?: true
    projectId?: true
    content?: true
    agentId?: true
    entities?: true
    date?: true
    rawData?: true
    connector?: true
    _all?: true
  }

  export type Public_eventsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which public_events to aggregate.
     */
    where?: public_eventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of public_events to fetch.
     */
    orderBy?: public_eventsOrderByWithRelationAndSearchRelevanceInput | public_eventsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: public_eventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` public_events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` public_events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned public_events
    **/
    _count?: true | Public_eventsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Public_eventsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Public_eventsMaxAggregateInputType
  }

  export type GetPublic_eventsAggregateType<T extends Public_eventsAggregateArgs> = {
        [P in keyof T & keyof AggregatePublic_events]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePublic_events[P]>
      : GetScalarType<T[P], AggregatePublic_events[P]>
  }




  export type public_eventsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: public_eventsWhereInput
    orderBy?: public_eventsOrderByWithAggregationInput | public_eventsOrderByWithAggregationInput[]
    by: Public_eventsScalarFieldEnum[] | Public_eventsScalarFieldEnum
    having?: public_eventsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Public_eventsCountAggregateInputType | true
    _min?: Public_eventsMinAggregateInputType
    _max?: Public_eventsMaxAggregateInputType
  }

  export type Public_eventsGroupByOutputType = {
    id: string
    type: string | null
    observer: string | null
    sender: string | null
    client: string | null
    channel: string | null
    channelType: string | null
    projectId: string | null
    content: string | null
    agentId: string | null
    entities: string[]
    date: string | null
    rawData: string | null
    connector: string | null
    _count: Public_eventsCountAggregateOutputType | null
    _min: Public_eventsMinAggregateOutputType | null
    _max: Public_eventsMaxAggregateOutputType | null
  }

  type GetPublic_eventsGroupByPayload<T extends public_eventsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Public_eventsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Public_eventsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Public_eventsGroupByOutputType[P]>
            : GetScalarType<T[P], Public_eventsGroupByOutputType[P]>
        }
      >
    >


  export type public_eventsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    observer?: boolean
    sender?: boolean
    client?: boolean
    channel?: boolean
    channelType?: boolean
    projectId?: boolean
    content?: boolean
    agentId?: boolean
    entities?: boolean
    date?: boolean
    rawData?: boolean
    connector?: boolean
  }, ExtArgs["result"]["public_events"]>

  export type public_eventsSelectScalar = {
    id?: boolean
    type?: boolean
    observer?: boolean
    sender?: boolean
    client?: boolean
    channel?: boolean
    channelType?: boolean
    projectId?: boolean
    content?: boolean
    agentId?: boolean
    entities?: boolean
    date?: boolean
    rawData?: boolean
    connector?: boolean
  }


  export type $public_eventsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "public_events"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string | null
      observer: string | null
      sender: string | null
      client: string | null
      channel: string | null
      channelType: string | null
      projectId: string | null
      content: string | null
      agentId: string | null
      entities: string[]
      date: string | null
      rawData: string | null
      connector: string | null
    }, ExtArgs["result"]["public_events"]>
    composites: {}
  }


  type public_eventsGetPayload<S extends boolean | null | undefined | public_eventsDefaultArgs> = $Result.GetResult<Prisma.$public_eventsPayload, S>

  type public_eventsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<public_eventsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Public_eventsCountAggregateInputType | true
    }

  export interface public_eventsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['public_events'], meta: { name: 'public_events' } }
    /**
     * Find zero or one Public_events that matches the filter.
     * @param {public_eventsFindUniqueArgs} args - Arguments to find a Public_events
     * @example
     * // Get one Public_events
     * const public_events = await prisma.public_events.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends public_eventsFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, public_eventsFindUniqueArgs<ExtArgs>>
    ): Prisma__public_eventsClient<$Result.GetResult<Prisma.$public_eventsPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Public_events that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {public_eventsFindUniqueOrThrowArgs} args - Arguments to find a Public_events
     * @example
     * // Get one Public_events
     * const public_events = await prisma.public_events.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends public_eventsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, public_eventsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__public_eventsClient<$Result.GetResult<Prisma.$public_eventsPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Public_events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_eventsFindFirstArgs} args - Arguments to find a Public_events
     * @example
     * // Get one Public_events
     * const public_events = await prisma.public_events.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends public_eventsFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, public_eventsFindFirstArgs<ExtArgs>>
    ): Prisma__public_eventsClient<$Result.GetResult<Prisma.$public_eventsPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Public_events that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_eventsFindFirstOrThrowArgs} args - Arguments to find a Public_events
     * @example
     * // Get one Public_events
     * const public_events = await prisma.public_events.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends public_eventsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, public_eventsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__public_eventsClient<$Result.GetResult<Prisma.$public_eventsPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Public_events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_eventsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Public_events
     * const public_events = await prisma.public_events.findMany()
     * 
     * // Get first 10 Public_events
     * const public_events = await prisma.public_events.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const public_eventsWithIdOnly = await prisma.public_events.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends public_eventsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, public_eventsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$public_eventsPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Public_events.
     * @param {public_eventsCreateArgs} args - Arguments to create a Public_events.
     * @example
     * // Create one Public_events
     * const Public_events = await prisma.public_events.create({
     *   data: {
     *     // ... data to create a Public_events
     *   }
     * })
     * 
    **/
    create<T extends public_eventsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, public_eventsCreateArgs<ExtArgs>>
    ): Prisma__public_eventsClient<$Result.GetResult<Prisma.$public_eventsPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Public_events.
     *     @param {public_eventsCreateManyArgs} args - Arguments to create many Public_events.
     *     @example
     *     // Create many Public_events
     *     const public_events = await prisma.public_events.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends public_eventsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, public_eventsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Public_events.
     * @param {public_eventsDeleteArgs} args - Arguments to delete one Public_events.
     * @example
     * // Delete one Public_events
     * const Public_events = await prisma.public_events.delete({
     *   where: {
     *     // ... filter to delete one Public_events
     *   }
     * })
     * 
    **/
    delete<T extends public_eventsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, public_eventsDeleteArgs<ExtArgs>>
    ): Prisma__public_eventsClient<$Result.GetResult<Prisma.$public_eventsPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Public_events.
     * @param {public_eventsUpdateArgs} args - Arguments to update one Public_events.
     * @example
     * // Update one Public_events
     * const public_events = await prisma.public_events.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends public_eventsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, public_eventsUpdateArgs<ExtArgs>>
    ): Prisma__public_eventsClient<$Result.GetResult<Prisma.$public_eventsPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Public_events.
     * @param {public_eventsDeleteManyArgs} args - Arguments to filter Public_events to delete.
     * @example
     * // Delete a few Public_events
     * const { count } = await prisma.public_events.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends public_eventsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, public_eventsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Public_events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_eventsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Public_events
     * const public_events = await prisma.public_events.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends public_eventsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, public_eventsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Public_events.
     * @param {public_eventsUpsertArgs} args - Arguments to update or create a Public_events.
     * @example
     * // Update or create a Public_events
     * const public_events = await prisma.public_events.upsert({
     *   create: {
     *     // ... data to create a Public_events
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Public_events we want to update
     *   }
     * })
    **/
    upsert<T extends public_eventsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, public_eventsUpsertArgs<ExtArgs>>
    ): Prisma__public_eventsClient<$Result.GetResult<Prisma.$public_eventsPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Public_events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_eventsCountArgs} args - Arguments to filter Public_events to count.
     * @example
     * // Count the number of Public_events
     * const count = await prisma.public_events.count({
     *   where: {
     *     // ... the filter for the Public_events we want to count
     *   }
     * })
    **/
    count<T extends public_eventsCountArgs>(
      args?: Subset<T, public_eventsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Public_eventsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Public_events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Public_eventsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Public_eventsAggregateArgs>(args: Subset<T, Public_eventsAggregateArgs>): Prisma.PrismaPromise<GetPublic_eventsAggregateType<T>>

    /**
     * Group by Public_events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_eventsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends public_eventsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: public_eventsGroupByArgs['orderBy'] }
        : { orderBy?: public_eventsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, public_eventsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPublic_eventsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the public_events model
   */
  readonly fields: public_eventsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for public_events.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__public_eventsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the public_events model
   */ 
  interface public_eventsFieldRefs {
    readonly id: FieldRef<"public_events", 'String'>
    readonly type: FieldRef<"public_events", 'String'>
    readonly observer: FieldRef<"public_events", 'String'>
    readonly sender: FieldRef<"public_events", 'String'>
    readonly client: FieldRef<"public_events", 'String'>
    readonly channel: FieldRef<"public_events", 'String'>
    readonly channelType: FieldRef<"public_events", 'String'>
    readonly projectId: FieldRef<"public_events", 'String'>
    readonly content: FieldRef<"public_events", 'String'>
    readonly agentId: FieldRef<"public_events", 'String'>
    readonly entities: FieldRef<"public_events", 'String[]'>
    readonly date: FieldRef<"public_events", 'String'>
    readonly rawData: FieldRef<"public_events", 'String'>
    readonly connector: FieldRef<"public_events", 'String'>
  }
    

  // Custom InputTypes

  /**
   * public_events findUnique
   */
  export type public_eventsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_events
     */
    select?: public_eventsSelect<ExtArgs> | null
    /**
     * Filter, which public_events to fetch.
     */
    where: public_eventsWhereUniqueInput
  }


  /**
   * public_events findUniqueOrThrow
   */
  export type public_eventsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_events
     */
    select?: public_eventsSelect<ExtArgs> | null
    /**
     * Filter, which public_events to fetch.
     */
    where: public_eventsWhereUniqueInput
  }


  /**
   * public_events findFirst
   */
  export type public_eventsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_events
     */
    select?: public_eventsSelect<ExtArgs> | null
    /**
     * Filter, which public_events to fetch.
     */
    where?: public_eventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of public_events to fetch.
     */
    orderBy?: public_eventsOrderByWithRelationAndSearchRelevanceInput | public_eventsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for public_events.
     */
    cursor?: public_eventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` public_events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` public_events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of public_events.
     */
    distinct?: Public_eventsScalarFieldEnum | Public_eventsScalarFieldEnum[]
  }


  /**
   * public_events findFirstOrThrow
   */
  export type public_eventsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_events
     */
    select?: public_eventsSelect<ExtArgs> | null
    /**
     * Filter, which public_events to fetch.
     */
    where?: public_eventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of public_events to fetch.
     */
    orderBy?: public_eventsOrderByWithRelationAndSearchRelevanceInput | public_eventsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for public_events.
     */
    cursor?: public_eventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` public_events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` public_events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of public_events.
     */
    distinct?: Public_eventsScalarFieldEnum | Public_eventsScalarFieldEnum[]
  }


  /**
   * public_events findMany
   */
  export type public_eventsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_events
     */
    select?: public_eventsSelect<ExtArgs> | null
    /**
     * Filter, which public_events to fetch.
     */
    where?: public_eventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of public_events to fetch.
     */
    orderBy?: public_eventsOrderByWithRelationAndSearchRelevanceInput | public_eventsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing public_events.
     */
    cursor?: public_eventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` public_events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` public_events.
     */
    skip?: number
    distinct?: Public_eventsScalarFieldEnum | Public_eventsScalarFieldEnum[]
  }


  /**
   * public_events create
   */
  export type public_eventsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_events
     */
    select?: public_eventsSelect<ExtArgs> | null
    /**
     * The data needed to create a public_events.
     */
    data: XOR<public_eventsCreateInput, public_eventsUncheckedCreateInput>
  }


  /**
   * public_events createMany
   */
  export type public_eventsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many public_events.
     */
    data: public_eventsCreateManyInput | public_eventsCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * public_events update
   */
  export type public_eventsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_events
     */
    select?: public_eventsSelect<ExtArgs> | null
    /**
     * The data needed to update a public_events.
     */
    data: XOR<public_eventsUpdateInput, public_eventsUncheckedUpdateInput>
    /**
     * Choose, which public_events to update.
     */
    where: public_eventsWhereUniqueInput
  }


  /**
   * public_events updateMany
   */
  export type public_eventsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update public_events.
     */
    data: XOR<public_eventsUpdateManyMutationInput, public_eventsUncheckedUpdateManyInput>
    /**
     * Filter which public_events to update
     */
    where?: public_eventsWhereInput
  }


  /**
   * public_events upsert
   */
  export type public_eventsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_events
     */
    select?: public_eventsSelect<ExtArgs> | null
    /**
     * The filter to search for the public_events to update in case it exists.
     */
    where: public_eventsWhereUniqueInput
    /**
     * In case the public_events found by the `where` argument doesn't exist, create a new public_events with this data.
     */
    create: XOR<public_eventsCreateInput, public_eventsUncheckedCreateInput>
    /**
     * In case the public_events was found with the provided `where` argument, update it with this data.
     */
    update: XOR<public_eventsUpdateInput, public_eventsUncheckedUpdateInput>
  }


  /**
   * public_events delete
   */
  export type public_eventsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_events
     */
    select?: public_eventsSelect<ExtArgs> | null
    /**
     * Filter which public_events to delete.
     */
    where: public_eventsWhereUniqueInput
  }


  /**
   * public_events deleteMany
   */
  export type public_eventsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which public_events to delete
     */
    where?: public_eventsWhereInput
  }


  /**
   * public_events without action
   */
  export type public_eventsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_events
     */
    select?: public_eventsSelect<ExtArgs> | null
  }



  /**
   * Model graphEvents
   */

  export type AggregateGraphEvents = {
    _count: GraphEventsCountAggregateOutputType | null
    _min: GraphEventsMinAggregateOutputType | null
    _max: GraphEventsMaxAggregateOutputType | null
  }

  export type GraphEventsMinAggregateOutputType = {
    id: string | null
    agentId: string | null
    sender: string | null
    connector: string | null
    channel: string | null
    content: string | null
    eventType: string | null
    created_at: Date | null
    updated_at: Date | null
    observer: string | null
  }

  export type GraphEventsMaxAggregateOutputType = {
    id: string | null
    agentId: string | null
    sender: string | null
    connector: string | null
    channel: string | null
    content: string | null
    eventType: string | null
    created_at: Date | null
    updated_at: Date | null
    observer: string | null
  }

  export type GraphEventsCountAggregateOutputType = {
    id: number
    agentId: number
    sender: number
    connector: number
    connectorData: number
    channel: number
    content: number
    eventType: number
    created_at: number
    updated_at: number
    event: number
    observer: number
    _all: number
  }


  export type GraphEventsMinAggregateInputType = {
    id?: true
    agentId?: true
    sender?: true
    connector?: true
    channel?: true
    content?: true
    eventType?: true
    created_at?: true
    updated_at?: true
    observer?: true
  }

  export type GraphEventsMaxAggregateInputType = {
    id?: true
    agentId?: true
    sender?: true
    connector?: true
    channel?: true
    content?: true
    eventType?: true
    created_at?: true
    updated_at?: true
    observer?: true
  }

  export type GraphEventsCountAggregateInputType = {
    id?: true
    agentId?: true
    sender?: true
    connector?: true
    connectorData?: true
    channel?: true
    content?: true
    eventType?: true
    created_at?: true
    updated_at?: true
    event?: true
    observer?: true
    _all?: true
  }

  export type GraphEventsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which graphEvents to aggregate.
     */
    where?: graphEventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of graphEvents to fetch.
     */
    orderBy?: graphEventsOrderByWithRelationAndSearchRelevanceInput | graphEventsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: graphEventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` graphEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` graphEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned graphEvents
    **/
    _count?: true | GraphEventsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GraphEventsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GraphEventsMaxAggregateInputType
  }

  export type GetGraphEventsAggregateType<T extends GraphEventsAggregateArgs> = {
        [P in keyof T & keyof AggregateGraphEvents]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGraphEvents[P]>
      : GetScalarType<T[P], AggregateGraphEvents[P]>
  }




  export type graphEventsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: graphEventsWhereInput
    orderBy?: graphEventsOrderByWithAggregationInput | graphEventsOrderByWithAggregationInput[]
    by: GraphEventsScalarFieldEnum[] | GraphEventsScalarFieldEnum
    having?: graphEventsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GraphEventsCountAggregateInputType | true
    _min?: GraphEventsMinAggregateInputType
    _max?: GraphEventsMaxAggregateInputType
  }

  export type GraphEventsGroupByOutputType = {
    id: string
    agentId: string
    sender: string
    connector: string
    connectorData: JsonValue | null
    channel: string | null
    content: string
    eventType: string
    created_at: Date
    updated_at: Date
    event: JsonValue | null
    observer: string | null
    _count: GraphEventsCountAggregateOutputType | null
    _min: GraphEventsMinAggregateOutputType | null
    _max: GraphEventsMaxAggregateOutputType | null
  }

  type GetGraphEventsGroupByPayload<T extends graphEventsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GraphEventsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GraphEventsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GraphEventsGroupByOutputType[P]>
            : GetScalarType<T[P], GraphEventsGroupByOutputType[P]>
        }
      >
    >


  export type graphEventsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentId?: boolean
    sender?: boolean
    connector?: boolean
    connectorData?: boolean
    channel?: boolean
    content?: boolean
    eventType?: boolean
    created_at?: boolean
    updated_at?: boolean
    event?: boolean
    observer?: boolean
    agents?: boolean | agentsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["graphEvents"]>

  export type graphEventsSelectScalar = {
    id?: boolean
    agentId?: boolean
    sender?: boolean
    connector?: boolean
    connectorData?: boolean
    channel?: boolean
    content?: boolean
    eventType?: boolean
    created_at?: boolean
    updated_at?: boolean
    event?: boolean
    observer?: boolean
  }

  export type graphEventsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agents?: boolean | agentsDefaultArgs<ExtArgs>
  }


  export type $graphEventsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "graphEvents"
    objects: {
      agents: Prisma.$agentsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      agentId: string
      sender: string
      connector: string
      connectorData: Prisma.JsonValue | null
      channel: string | null
      content: string
      eventType: string
      created_at: Date
      updated_at: Date
      event: Prisma.JsonValue | null
      observer: string | null
    }, ExtArgs["result"]["graphEvents"]>
    composites: {}
  }


  type graphEventsGetPayload<S extends boolean | null | undefined | graphEventsDefaultArgs> = $Result.GetResult<Prisma.$graphEventsPayload, S>

  type graphEventsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<graphEventsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GraphEventsCountAggregateInputType | true
    }

  export interface graphEventsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['graphEvents'], meta: { name: 'graphEvents' } }
    /**
     * Find zero or one GraphEvents that matches the filter.
     * @param {graphEventsFindUniqueArgs} args - Arguments to find a GraphEvents
     * @example
     * // Get one GraphEvents
     * const graphEvents = await prisma.graphEvents.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends graphEventsFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, graphEventsFindUniqueArgs<ExtArgs>>
    ): Prisma__graphEventsClient<$Result.GetResult<Prisma.$graphEventsPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one GraphEvents that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {graphEventsFindUniqueOrThrowArgs} args - Arguments to find a GraphEvents
     * @example
     * // Get one GraphEvents
     * const graphEvents = await prisma.graphEvents.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends graphEventsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, graphEventsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__graphEventsClient<$Result.GetResult<Prisma.$graphEventsPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first GraphEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {graphEventsFindFirstArgs} args - Arguments to find a GraphEvents
     * @example
     * // Get one GraphEvents
     * const graphEvents = await prisma.graphEvents.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends graphEventsFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, graphEventsFindFirstArgs<ExtArgs>>
    ): Prisma__graphEventsClient<$Result.GetResult<Prisma.$graphEventsPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first GraphEvents that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {graphEventsFindFirstOrThrowArgs} args - Arguments to find a GraphEvents
     * @example
     * // Get one GraphEvents
     * const graphEvents = await prisma.graphEvents.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends graphEventsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, graphEventsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__graphEventsClient<$Result.GetResult<Prisma.$graphEventsPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more GraphEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {graphEventsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GraphEvents
     * const graphEvents = await prisma.graphEvents.findMany()
     * 
     * // Get first 10 GraphEvents
     * const graphEvents = await prisma.graphEvents.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const graphEventsWithIdOnly = await prisma.graphEvents.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends graphEventsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, graphEventsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$graphEventsPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a GraphEvents.
     * @param {graphEventsCreateArgs} args - Arguments to create a GraphEvents.
     * @example
     * // Create one GraphEvents
     * const GraphEvents = await prisma.graphEvents.create({
     *   data: {
     *     // ... data to create a GraphEvents
     *   }
     * })
     * 
    **/
    create<T extends graphEventsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, graphEventsCreateArgs<ExtArgs>>
    ): Prisma__graphEventsClient<$Result.GetResult<Prisma.$graphEventsPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many GraphEvents.
     *     @param {graphEventsCreateManyArgs} args - Arguments to create many GraphEvents.
     *     @example
     *     // Create many GraphEvents
     *     const graphEvents = await prisma.graphEvents.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends graphEventsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, graphEventsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GraphEvents.
     * @param {graphEventsDeleteArgs} args - Arguments to delete one GraphEvents.
     * @example
     * // Delete one GraphEvents
     * const GraphEvents = await prisma.graphEvents.delete({
     *   where: {
     *     // ... filter to delete one GraphEvents
     *   }
     * })
     * 
    **/
    delete<T extends graphEventsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, graphEventsDeleteArgs<ExtArgs>>
    ): Prisma__graphEventsClient<$Result.GetResult<Prisma.$graphEventsPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one GraphEvents.
     * @param {graphEventsUpdateArgs} args - Arguments to update one GraphEvents.
     * @example
     * // Update one GraphEvents
     * const graphEvents = await prisma.graphEvents.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends graphEventsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, graphEventsUpdateArgs<ExtArgs>>
    ): Prisma__graphEventsClient<$Result.GetResult<Prisma.$graphEventsPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more GraphEvents.
     * @param {graphEventsDeleteManyArgs} args - Arguments to filter GraphEvents to delete.
     * @example
     * // Delete a few GraphEvents
     * const { count } = await prisma.graphEvents.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends graphEventsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, graphEventsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GraphEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {graphEventsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GraphEvents
     * const graphEvents = await prisma.graphEvents.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends graphEventsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, graphEventsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GraphEvents.
     * @param {graphEventsUpsertArgs} args - Arguments to update or create a GraphEvents.
     * @example
     * // Update or create a GraphEvents
     * const graphEvents = await prisma.graphEvents.upsert({
     *   create: {
     *     // ... data to create a GraphEvents
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GraphEvents we want to update
     *   }
     * })
    **/
    upsert<T extends graphEventsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, graphEventsUpsertArgs<ExtArgs>>
    ): Prisma__graphEventsClient<$Result.GetResult<Prisma.$graphEventsPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of GraphEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {graphEventsCountArgs} args - Arguments to filter GraphEvents to count.
     * @example
     * // Count the number of GraphEvents
     * const count = await prisma.graphEvents.count({
     *   where: {
     *     // ... the filter for the GraphEvents we want to count
     *   }
     * })
    **/
    count<T extends graphEventsCountArgs>(
      args?: Subset<T, graphEventsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GraphEventsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GraphEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraphEventsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GraphEventsAggregateArgs>(args: Subset<T, GraphEventsAggregateArgs>): Prisma.PrismaPromise<GetGraphEventsAggregateType<T>>

    /**
     * Group by GraphEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {graphEventsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends graphEventsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: graphEventsGroupByArgs['orderBy'] }
        : { orderBy?: graphEventsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, graphEventsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGraphEventsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the graphEvents model
   */
  readonly fields: graphEventsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for graphEvents.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__graphEventsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    agents<T extends agentsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, agentsDefaultArgs<ExtArgs>>): Prisma__agentsClient<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the graphEvents model
   */ 
  interface graphEventsFieldRefs {
    readonly id: FieldRef<"graphEvents", 'String'>
    readonly agentId: FieldRef<"graphEvents", 'String'>
    readonly sender: FieldRef<"graphEvents", 'String'>
    readonly connector: FieldRef<"graphEvents", 'String'>
    readonly connectorData: FieldRef<"graphEvents", 'Json'>
    readonly channel: FieldRef<"graphEvents", 'String'>
    readonly content: FieldRef<"graphEvents", 'String'>
    readonly eventType: FieldRef<"graphEvents", 'String'>
    readonly created_at: FieldRef<"graphEvents", 'DateTime'>
    readonly updated_at: FieldRef<"graphEvents", 'DateTime'>
    readonly event: FieldRef<"graphEvents", 'Json'>
    readonly observer: FieldRef<"graphEvents", 'String'>
  }
    

  // Custom InputTypes

  /**
   * graphEvents findUnique
   */
  export type graphEventsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the graphEvents
     */
    select?: graphEventsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: graphEventsInclude<ExtArgs> | null
    /**
     * Filter, which graphEvents to fetch.
     */
    where: graphEventsWhereUniqueInput
  }


  /**
   * graphEvents findUniqueOrThrow
   */
  export type graphEventsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the graphEvents
     */
    select?: graphEventsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: graphEventsInclude<ExtArgs> | null
    /**
     * Filter, which graphEvents to fetch.
     */
    where: graphEventsWhereUniqueInput
  }


  /**
   * graphEvents findFirst
   */
  export type graphEventsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the graphEvents
     */
    select?: graphEventsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: graphEventsInclude<ExtArgs> | null
    /**
     * Filter, which graphEvents to fetch.
     */
    where?: graphEventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of graphEvents to fetch.
     */
    orderBy?: graphEventsOrderByWithRelationAndSearchRelevanceInput | graphEventsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for graphEvents.
     */
    cursor?: graphEventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` graphEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` graphEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of graphEvents.
     */
    distinct?: GraphEventsScalarFieldEnum | GraphEventsScalarFieldEnum[]
  }


  /**
   * graphEvents findFirstOrThrow
   */
  export type graphEventsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the graphEvents
     */
    select?: graphEventsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: graphEventsInclude<ExtArgs> | null
    /**
     * Filter, which graphEvents to fetch.
     */
    where?: graphEventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of graphEvents to fetch.
     */
    orderBy?: graphEventsOrderByWithRelationAndSearchRelevanceInput | graphEventsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for graphEvents.
     */
    cursor?: graphEventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` graphEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` graphEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of graphEvents.
     */
    distinct?: GraphEventsScalarFieldEnum | GraphEventsScalarFieldEnum[]
  }


  /**
   * graphEvents findMany
   */
  export type graphEventsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the graphEvents
     */
    select?: graphEventsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: graphEventsInclude<ExtArgs> | null
    /**
     * Filter, which graphEvents to fetch.
     */
    where?: graphEventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of graphEvents to fetch.
     */
    orderBy?: graphEventsOrderByWithRelationAndSearchRelevanceInput | graphEventsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing graphEvents.
     */
    cursor?: graphEventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` graphEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` graphEvents.
     */
    skip?: number
    distinct?: GraphEventsScalarFieldEnum | GraphEventsScalarFieldEnum[]
  }


  /**
   * graphEvents create
   */
  export type graphEventsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the graphEvents
     */
    select?: graphEventsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: graphEventsInclude<ExtArgs> | null
    /**
     * The data needed to create a graphEvents.
     */
    data: XOR<graphEventsCreateInput, graphEventsUncheckedCreateInput>
  }


  /**
   * graphEvents createMany
   */
  export type graphEventsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many graphEvents.
     */
    data: graphEventsCreateManyInput | graphEventsCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * graphEvents update
   */
  export type graphEventsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the graphEvents
     */
    select?: graphEventsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: graphEventsInclude<ExtArgs> | null
    /**
     * The data needed to update a graphEvents.
     */
    data: XOR<graphEventsUpdateInput, graphEventsUncheckedUpdateInput>
    /**
     * Choose, which graphEvents to update.
     */
    where: graphEventsWhereUniqueInput
  }


  /**
   * graphEvents updateMany
   */
  export type graphEventsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update graphEvents.
     */
    data: XOR<graphEventsUpdateManyMutationInput, graphEventsUncheckedUpdateManyInput>
    /**
     * Filter which graphEvents to update
     */
    where?: graphEventsWhereInput
  }


  /**
   * graphEvents upsert
   */
  export type graphEventsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the graphEvents
     */
    select?: graphEventsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: graphEventsInclude<ExtArgs> | null
    /**
     * The filter to search for the graphEvents to update in case it exists.
     */
    where: graphEventsWhereUniqueInput
    /**
     * In case the graphEvents found by the `where` argument doesn't exist, create a new graphEvents with this data.
     */
    create: XOR<graphEventsCreateInput, graphEventsUncheckedCreateInput>
    /**
     * In case the graphEvents was found with the provided `where` argument, update it with this data.
     */
    update: XOR<graphEventsUpdateInput, graphEventsUncheckedUpdateInput>
  }


  /**
   * graphEvents delete
   */
  export type graphEventsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the graphEvents
     */
    select?: graphEventsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: graphEventsInclude<ExtArgs> | null
    /**
     * Filter which graphEvents to delete.
     */
    where: graphEventsWhereUniqueInput
  }


  /**
   * graphEvents deleteMany
   */
  export type graphEventsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which graphEvents to delete
     */
    where?: graphEventsWhereInput
  }


  /**
   * graphEvents without action
   */
  export type graphEventsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the graphEvents
     */
    select?: graphEventsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: graphEventsInclude<ExtArgs> | null
  }



  /**
   * Model public_knex_migrations
   */

  export type AggregatePublic_knex_migrations = {
    _count: Public_knex_migrationsCountAggregateOutputType | null
    _avg: Public_knex_migrationsAvgAggregateOutputType | null
    _sum: Public_knex_migrationsSumAggregateOutputType | null
    _min: Public_knex_migrationsMinAggregateOutputType | null
    _max: Public_knex_migrationsMaxAggregateOutputType | null
  }

  export type Public_knex_migrationsAvgAggregateOutputType = {
    id: number | null
    batch: number | null
  }

  export type Public_knex_migrationsSumAggregateOutputType = {
    id: number | null
    batch: number | null
  }

  export type Public_knex_migrationsMinAggregateOutputType = {
    id: number | null
    name: string | null
    batch: number | null
    migration_time: Date | null
  }

  export type Public_knex_migrationsMaxAggregateOutputType = {
    id: number | null
    name: string | null
    batch: number | null
    migration_time: Date | null
  }

  export type Public_knex_migrationsCountAggregateOutputType = {
    id: number
    name: number
    batch: number
    migration_time: number
    _all: number
  }


  export type Public_knex_migrationsAvgAggregateInputType = {
    id?: true
    batch?: true
  }

  export type Public_knex_migrationsSumAggregateInputType = {
    id?: true
    batch?: true
  }

  export type Public_knex_migrationsMinAggregateInputType = {
    id?: true
    name?: true
    batch?: true
    migration_time?: true
  }

  export type Public_knex_migrationsMaxAggregateInputType = {
    id?: true
    name?: true
    batch?: true
    migration_time?: true
  }

  export type Public_knex_migrationsCountAggregateInputType = {
    id?: true
    name?: true
    batch?: true
    migration_time?: true
    _all?: true
  }

  export type Public_knex_migrationsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which public_knex_migrations to aggregate.
     */
    where?: public_knex_migrationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of public_knex_migrations to fetch.
     */
    orderBy?: public_knex_migrationsOrderByWithRelationAndSearchRelevanceInput | public_knex_migrationsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: public_knex_migrationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` public_knex_migrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` public_knex_migrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned public_knex_migrations
    **/
    _count?: true | Public_knex_migrationsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Public_knex_migrationsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Public_knex_migrationsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Public_knex_migrationsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Public_knex_migrationsMaxAggregateInputType
  }

  export type GetPublic_knex_migrationsAggregateType<T extends Public_knex_migrationsAggregateArgs> = {
        [P in keyof T & keyof AggregatePublic_knex_migrations]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePublic_knex_migrations[P]>
      : GetScalarType<T[P], AggregatePublic_knex_migrations[P]>
  }




  export type public_knex_migrationsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: public_knex_migrationsWhereInput
    orderBy?: public_knex_migrationsOrderByWithAggregationInput | public_knex_migrationsOrderByWithAggregationInput[]
    by: Public_knex_migrationsScalarFieldEnum[] | Public_knex_migrationsScalarFieldEnum
    having?: public_knex_migrationsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Public_knex_migrationsCountAggregateInputType | true
    _avg?: Public_knex_migrationsAvgAggregateInputType
    _sum?: Public_knex_migrationsSumAggregateInputType
    _min?: Public_knex_migrationsMinAggregateInputType
    _max?: Public_knex_migrationsMaxAggregateInputType
  }

  export type Public_knex_migrationsGroupByOutputType = {
    id: number
    name: string | null
    batch: number | null
    migration_time: Date | null
    _count: Public_knex_migrationsCountAggregateOutputType | null
    _avg: Public_knex_migrationsAvgAggregateOutputType | null
    _sum: Public_knex_migrationsSumAggregateOutputType | null
    _min: Public_knex_migrationsMinAggregateOutputType | null
    _max: Public_knex_migrationsMaxAggregateOutputType | null
  }

  type GetPublic_knex_migrationsGroupByPayload<T extends public_knex_migrationsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Public_knex_migrationsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Public_knex_migrationsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Public_knex_migrationsGroupByOutputType[P]>
            : GetScalarType<T[P], Public_knex_migrationsGroupByOutputType[P]>
        }
      >
    >


  export type public_knex_migrationsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    batch?: boolean
    migration_time?: boolean
  }, ExtArgs["result"]["public_knex_migrations"]>

  export type public_knex_migrationsSelectScalar = {
    id?: boolean
    name?: boolean
    batch?: boolean
    migration_time?: boolean
  }


  export type $public_knex_migrationsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "public_knex_migrations"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string | null
      batch: number | null
      migration_time: Date | null
    }, ExtArgs["result"]["public_knex_migrations"]>
    composites: {}
  }


  type public_knex_migrationsGetPayload<S extends boolean | null | undefined | public_knex_migrationsDefaultArgs> = $Result.GetResult<Prisma.$public_knex_migrationsPayload, S>

  type public_knex_migrationsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<public_knex_migrationsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Public_knex_migrationsCountAggregateInputType | true
    }

  export interface public_knex_migrationsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['public_knex_migrations'], meta: { name: 'public_knex_migrations' } }
    /**
     * Find zero or one Public_knex_migrations that matches the filter.
     * @param {public_knex_migrationsFindUniqueArgs} args - Arguments to find a Public_knex_migrations
     * @example
     * // Get one Public_knex_migrations
     * const public_knex_migrations = await prisma.public_knex_migrations.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends public_knex_migrationsFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, public_knex_migrationsFindUniqueArgs<ExtArgs>>
    ): Prisma__public_knex_migrationsClient<$Result.GetResult<Prisma.$public_knex_migrationsPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Public_knex_migrations that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {public_knex_migrationsFindUniqueOrThrowArgs} args - Arguments to find a Public_knex_migrations
     * @example
     * // Get one Public_knex_migrations
     * const public_knex_migrations = await prisma.public_knex_migrations.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends public_knex_migrationsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, public_knex_migrationsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__public_knex_migrationsClient<$Result.GetResult<Prisma.$public_knex_migrationsPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Public_knex_migrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_knex_migrationsFindFirstArgs} args - Arguments to find a Public_knex_migrations
     * @example
     * // Get one Public_knex_migrations
     * const public_knex_migrations = await prisma.public_knex_migrations.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends public_knex_migrationsFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, public_knex_migrationsFindFirstArgs<ExtArgs>>
    ): Prisma__public_knex_migrationsClient<$Result.GetResult<Prisma.$public_knex_migrationsPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Public_knex_migrations that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_knex_migrationsFindFirstOrThrowArgs} args - Arguments to find a Public_knex_migrations
     * @example
     * // Get one Public_knex_migrations
     * const public_knex_migrations = await prisma.public_knex_migrations.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends public_knex_migrationsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, public_knex_migrationsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__public_knex_migrationsClient<$Result.GetResult<Prisma.$public_knex_migrationsPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Public_knex_migrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_knex_migrationsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Public_knex_migrations
     * const public_knex_migrations = await prisma.public_knex_migrations.findMany()
     * 
     * // Get first 10 Public_knex_migrations
     * const public_knex_migrations = await prisma.public_knex_migrations.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const public_knex_migrationsWithIdOnly = await prisma.public_knex_migrations.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends public_knex_migrationsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, public_knex_migrationsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$public_knex_migrationsPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Public_knex_migrations.
     * @param {public_knex_migrationsCreateArgs} args - Arguments to create a Public_knex_migrations.
     * @example
     * // Create one Public_knex_migrations
     * const Public_knex_migrations = await prisma.public_knex_migrations.create({
     *   data: {
     *     // ... data to create a Public_knex_migrations
     *   }
     * })
     * 
    **/
    create<T extends public_knex_migrationsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, public_knex_migrationsCreateArgs<ExtArgs>>
    ): Prisma__public_knex_migrationsClient<$Result.GetResult<Prisma.$public_knex_migrationsPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Public_knex_migrations.
     *     @param {public_knex_migrationsCreateManyArgs} args - Arguments to create many Public_knex_migrations.
     *     @example
     *     // Create many Public_knex_migrations
     *     const public_knex_migrations = await prisma.public_knex_migrations.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends public_knex_migrationsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, public_knex_migrationsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Public_knex_migrations.
     * @param {public_knex_migrationsDeleteArgs} args - Arguments to delete one Public_knex_migrations.
     * @example
     * // Delete one Public_knex_migrations
     * const Public_knex_migrations = await prisma.public_knex_migrations.delete({
     *   where: {
     *     // ... filter to delete one Public_knex_migrations
     *   }
     * })
     * 
    **/
    delete<T extends public_knex_migrationsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, public_knex_migrationsDeleteArgs<ExtArgs>>
    ): Prisma__public_knex_migrationsClient<$Result.GetResult<Prisma.$public_knex_migrationsPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Public_knex_migrations.
     * @param {public_knex_migrationsUpdateArgs} args - Arguments to update one Public_knex_migrations.
     * @example
     * // Update one Public_knex_migrations
     * const public_knex_migrations = await prisma.public_knex_migrations.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends public_knex_migrationsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, public_knex_migrationsUpdateArgs<ExtArgs>>
    ): Prisma__public_knex_migrationsClient<$Result.GetResult<Prisma.$public_knex_migrationsPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Public_knex_migrations.
     * @param {public_knex_migrationsDeleteManyArgs} args - Arguments to filter Public_knex_migrations to delete.
     * @example
     * // Delete a few Public_knex_migrations
     * const { count } = await prisma.public_knex_migrations.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends public_knex_migrationsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, public_knex_migrationsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Public_knex_migrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_knex_migrationsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Public_knex_migrations
     * const public_knex_migrations = await prisma.public_knex_migrations.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends public_knex_migrationsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, public_knex_migrationsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Public_knex_migrations.
     * @param {public_knex_migrationsUpsertArgs} args - Arguments to update or create a Public_knex_migrations.
     * @example
     * // Update or create a Public_knex_migrations
     * const public_knex_migrations = await prisma.public_knex_migrations.upsert({
     *   create: {
     *     // ... data to create a Public_knex_migrations
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Public_knex_migrations we want to update
     *   }
     * })
    **/
    upsert<T extends public_knex_migrationsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, public_knex_migrationsUpsertArgs<ExtArgs>>
    ): Prisma__public_knex_migrationsClient<$Result.GetResult<Prisma.$public_knex_migrationsPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Public_knex_migrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_knex_migrationsCountArgs} args - Arguments to filter Public_knex_migrations to count.
     * @example
     * // Count the number of Public_knex_migrations
     * const count = await prisma.public_knex_migrations.count({
     *   where: {
     *     // ... the filter for the Public_knex_migrations we want to count
     *   }
     * })
    **/
    count<T extends public_knex_migrationsCountArgs>(
      args?: Subset<T, public_knex_migrationsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Public_knex_migrationsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Public_knex_migrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Public_knex_migrationsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Public_knex_migrationsAggregateArgs>(args: Subset<T, Public_knex_migrationsAggregateArgs>): Prisma.PrismaPromise<GetPublic_knex_migrationsAggregateType<T>>

    /**
     * Group by Public_knex_migrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_knex_migrationsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends public_knex_migrationsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: public_knex_migrationsGroupByArgs['orderBy'] }
        : { orderBy?: public_knex_migrationsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, public_knex_migrationsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPublic_knex_migrationsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the public_knex_migrations model
   */
  readonly fields: public_knex_migrationsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for public_knex_migrations.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__public_knex_migrationsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the public_knex_migrations model
   */ 
  interface public_knex_migrationsFieldRefs {
    readonly id: FieldRef<"public_knex_migrations", 'Int'>
    readonly name: FieldRef<"public_knex_migrations", 'String'>
    readonly batch: FieldRef<"public_knex_migrations", 'Int'>
    readonly migration_time: FieldRef<"public_knex_migrations", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * public_knex_migrations findUnique
   */
  export type public_knex_migrationsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations
     */
    select?: public_knex_migrationsSelect<ExtArgs> | null
    /**
     * Filter, which public_knex_migrations to fetch.
     */
    where: public_knex_migrationsWhereUniqueInput
  }


  /**
   * public_knex_migrations findUniqueOrThrow
   */
  export type public_knex_migrationsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations
     */
    select?: public_knex_migrationsSelect<ExtArgs> | null
    /**
     * Filter, which public_knex_migrations to fetch.
     */
    where: public_knex_migrationsWhereUniqueInput
  }


  /**
   * public_knex_migrations findFirst
   */
  export type public_knex_migrationsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations
     */
    select?: public_knex_migrationsSelect<ExtArgs> | null
    /**
     * Filter, which public_knex_migrations to fetch.
     */
    where?: public_knex_migrationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of public_knex_migrations to fetch.
     */
    orderBy?: public_knex_migrationsOrderByWithRelationAndSearchRelevanceInput | public_knex_migrationsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for public_knex_migrations.
     */
    cursor?: public_knex_migrationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` public_knex_migrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` public_knex_migrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of public_knex_migrations.
     */
    distinct?: Public_knex_migrationsScalarFieldEnum | Public_knex_migrationsScalarFieldEnum[]
  }


  /**
   * public_knex_migrations findFirstOrThrow
   */
  export type public_knex_migrationsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations
     */
    select?: public_knex_migrationsSelect<ExtArgs> | null
    /**
     * Filter, which public_knex_migrations to fetch.
     */
    where?: public_knex_migrationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of public_knex_migrations to fetch.
     */
    orderBy?: public_knex_migrationsOrderByWithRelationAndSearchRelevanceInput | public_knex_migrationsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for public_knex_migrations.
     */
    cursor?: public_knex_migrationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` public_knex_migrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` public_knex_migrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of public_knex_migrations.
     */
    distinct?: Public_knex_migrationsScalarFieldEnum | Public_knex_migrationsScalarFieldEnum[]
  }


  /**
   * public_knex_migrations findMany
   */
  export type public_knex_migrationsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations
     */
    select?: public_knex_migrationsSelect<ExtArgs> | null
    /**
     * Filter, which public_knex_migrations to fetch.
     */
    where?: public_knex_migrationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of public_knex_migrations to fetch.
     */
    orderBy?: public_knex_migrationsOrderByWithRelationAndSearchRelevanceInput | public_knex_migrationsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing public_knex_migrations.
     */
    cursor?: public_knex_migrationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` public_knex_migrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` public_knex_migrations.
     */
    skip?: number
    distinct?: Public_knex_migrationsScalarFieldEnum | Public_knex_migrationsScalarFieldEnum[]
  }


  /**
   * public_knex_migrations create
   */
  export type public_knex_migrationsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations
     */
    select?: public_knex_migrationsSelect<ExtArgs> | null
    /**
     * The data needed to create a public_knex_migrations.
     */
    data?: XOR<public_knex_migrationsCreateInput, public_knex_migrationsUncheckedCreateInput>
  }


  /**
   * public_knex_migrations createMany
   */
  export type public_knex_migrationsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many public_knex_migrations.
     */
    data: public_knex_migrationsCreateManyInput | public_knex_migrationsCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * public_knex_migrations update
   */
  export type public_knex_migrationsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations
     */
    select?: public_knex_migrationsSelect<ExtArgs> | null
    /**
     * The data needed to update a public_knex_migrations.
     */
    data: XOR<public_knex_migrationsUpdateInput, public_knex_migrationsUncheckedUpdateInput>
    /**
     * Choose, which public_knex_migrations to update.
     */
    where: public_knex_migrationsWhereUniqueInput
  }


  /**
   * public_knex_migrations updateMany
   */
  export type public_knex_migrationsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update public_knex_migrations.
     */
    data: XOR<public_knex_migrationsUpdateManyMutationInput, public_knex_migrationsUncheckedUpdateManyInput>
    /**
     * Filter which public_knex_migrations to update
     */
    where?: public_knex_migrationsWhereInput
  }


  /**
   * public_knex_migrations upsert
   */
  export type public_knex_migrationsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations
     */
    select?: public_knex_migrationsSelect<ExtArgs> | null
    /**
     * The filter to search for the public_knex_migrations to update in case it exists.
     */
    where: public_knex_migrationsWhereUniqueInput
    /**
     * In case the public_knex_migrations found by the `where` argument doesn't exist, create a new public_knex_migrations with this data.
     */
    create: XOR<public_knex_migrationsCreateInput, public_knex_migrationsUncheckedCreateInput>
    /**
     * In case the public_knex_migrations was found with the provided `where` argument, update it with this data.
     */
    update: XOR<public_knex_migrationsUpdateInput, public_knex_migrationsUncheckedUpdateInput>
  }


  /**
   * public_knex_migrations delete
   */
  export type public_knex_migrationsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations
     */
    select?: public_knex_migrationsSelect<ExtArgs> | null
    /**
     * Filter which public_knex_migrations to delete.
     */
    where: public_knex_migrationsWhereUniqueInput
  }


  /**
   * public_knex_migrations deleteMany
   */
  export type public_knex_migrationsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which public_knex_migrations to delete
     */
    where?: public_knex_migrationsWhereInput
  }


  /**
   * public_knex_migrations without action
   */
  export type public_knex_migrationsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations
     */
    select?: public_knex_migrationsSelect<ExtArgs> | null
  }



  /**
   * Model public_knex_migrations_lock
   */

  export type AggregatePublic_knex_migrations_lock = {
    _count: Public_knex_migrations_lockCountAggregateOutputType | null
    _avg: Public_knex_migrations_lockAvgAggregateOutputType | null
    _sum: Public_knex_migrations_lockSumAggregateOutputType | null
    _min: Public_knex_migrations_lockMinAggregateOutputType | null
    _max: Public_knex_migrations_lockMaxAggregateOutputType | null
  }

  export type Public_knex_migrations_lockAvgAggregateOutputType = {
    index: number | null
    is_locked: number | null
  }

  export type Public_knex_migrations_lockSumAggregateOutputType = {
    index: number | null
    is_locked: number | null
  }

  export type Public_knex_migrations_lockMinAggregateOutputType = {
    index: number | null
    is_locked: number | null
  }

  export type Public_knex_migrations_lockMaxAggregateOutputType = {
    index: number | null
    is_locked: number | null
  }

  export type Public_knex_migrations_lockCountAggregateOutputType = {
    index: number
    is_locked: number
    _all: number
  }


  export type Public_knex_migrations_lockAvgAggregateInputType = {
    index?: true
    is_locked?: true
  }

  export type Public_knex_migrations_lockSumAggregateInputType = {
    index?: true
    is_locked?: true
  }

  export type Public_knex_migrations_lockMinAggregateInputType = {
    index?: true
    is_locked?: true
  }

  export type Public_knex_migrations_lockMaxAggregateInputType = {
    index?: true
    is_locked?: true
  }

  export type Public_knex_migrations_lockCountAggregateInputType = {
    index?: true
    is_locked?: true
    _all?: true
  }

  export type Public_knex_migrations_lockAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which public_knex_migrations_lock to aggregate.
     */
    where?: public_knex_migrations_lockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of public_knex_migrations_locks to fetch.
     */
    orderBy?: public_knex_migrations_lockOrderByWithRelationAndSearchRelevanceInput | public_knex_migrations_lockOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: public_knex_migrations_lockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` public_knex_migrations_locks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` public_knex_migrations_locks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned public_knex_migrations_locks
    **/
    _count?: true | Public_knex_migrations_lockCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Public_knex_migrations_lockAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Public_knex_migrations_lockSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Public_knex_migrations_lockMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Public_knex_migrations_lockMaxAggregateInputType
  }

  export type GetPublic_knex_migrations_lockAggregateType<T extends Public_knex_migrations_lockAggregateArgs> = {
        [P in keyof T & keyof AggregatePublic_knex_migrations_lock]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePublic_knex_migrations_lock[P]>
      : GetScalarType<T[P], AggregatePublic_knex_migrations_lock[P]>
  }




  export type public_knex_migrations_lockGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: public_knex_migrations_lockWhereInput
    orderBy?: public_knex_migrations_lockOrderByWithAggregationInput | public_knex_migrations_lockOrderByWithAggregationInput[]
    by: Public_knex_migrations_lockScalarFieldEnum[] | Public_knex_migrations_lockScalarFieldEnum
    having?: public_knex_migrations_lockScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Public_knex_migrations_lockCountAggregateInputType | true
    _avg?: Public_knex_migrations_lockAvgAggregateInputType
    _sum?: Public_knex_migrations_lockSumAggregateInputType
    _min?: Public_knex_migrations_lockMinAggregateInputType
    _max?: Public_knex_migrations_lockMaxAggregateInputType
  }

  export type Public_knex_migrations_lockGroupByOutputType = {
    index: number
    is_locked: number | null
    _count: Public_knex_migrations_lockCountAggregateOutputType | null
    _avg: Public_knex_migrations_lockAvgAggregateOutputType | null
    _sum: Public_knex_migrations_lockSumAggregateOutputType | null
    _min: Public_knex_migrations_lockMinAggregateOutputType | null
    _max: Public_knex_migrations_lockMaxAggregateOutputType | null
  }

  type GetPublic_knex_migrations_lockGroupByPayload<T extends public_knex_migrations_lockGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Public_knex_migrations_lockGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Public_knex_migrations_lockGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Public_knex_migrations_lockGroupByOutputType[P]>
            : GetScalarType<T[P], Public_knex_migrations_lockGroupByOutputType[P]>
        }
      >
    >


  export type public_knex_migrations_lockSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    index?: boolean
    is_locked?: boolean
  }, ExtArgs["result"]["public_knex_migrations_lock"]>

  export type public_knex_migrations_lockSelectScalar = {
    index?: boolean
    is_locked?: boolean
  }


  export type $public_knex_migrations_lockPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "public_knex_migrations_lock"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      index: number
      is_locked: number | null
    }, ExtArgs["result"]["public_knex_migrations_lock"]>
    composites: {}
  }


  type public_knex_migrations_lockGetPayload<S extends boolean | null | undefined | public_knex_migrations_lockDefaultArgs> = $Result.GetResult<Prisma.$public_knex_migrations_lockPayload, S>

  type public_knex_migrations_lockCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<public_knex_migrations_lockFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Public_knex_migrations_lockCountAggregateInputType | true
    }

  export interface public_knex_migrations_lockDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['public_knex_migrations_lock'], meta: { name: 'public_knex_migrations_lock' } }
    /**
     * Find zero or one Public_knex_migrations_lock that matches the filter.
     * @param {public_knex_migrations_lockFindUniqueArgs} args - Arguments to find a Public_knex_migrations_lock
     * @example
     * // Get one Public_knex_migrations_lock
     * const public_knex_migrations_lock = await prisma.public_knex_migrations_lock.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends public_knex_migrations_lockFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, public_knex_migrations_lockFindUniqueArgs<ExtArgs>>
    ): Prisma__public_knex_migrations_lockClient<$Result.GetResult<Prisma.$public_knex_migrations_lockPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Public_knex_migrations_lock that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {public_knex_migrations_lockFindUniqueOrThrowArgs} args - Arguments to find a Public_knex_migrations_lock
     * @example
     * // Get one Public_knex_migrations_lock
     * const public_knex_migrations_lock = await prisma.public_knex_migrations_lock.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends public_knex_migrations_lockFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, public_knex_migrations_lockFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__public_knex_migrations_lockClient<$Result.GetResult<Prisma.$public_knex_migrations_lockPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Public_knex_migrations_lock that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_knex_migrations_lockFindFirstArgs} args - Arguments to find a Public_knex_migrations_lock
     * @example
     * // Get one Public_knex_migrations_lock
     * const public_knex_migrations_lock = await prisma.public_knex_migrations_lock.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends public_knex_migrations_lockFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, public_knex_migrations_lockFindFirstArgs<ExtArgs>>
    ): Prisma__public_knex_migrations_lockClient<$Result.GetResult<Prisma.$public_knex_migrations_lockPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Public_knex_migrations_lock that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_knex_migrations_lockFindFirstOrThrowArgs} args - Arguments to find a Public_knex_migrations_lock
     * @example
     * // Get one Public_knex_migrations_lock
     * const public_knex_migrations_lock = await prisma.public_knex_migrations_lock.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends public_knex_migrations_lockFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, public_knex_migrations_lockFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__public_knex_migrations_lockClient<$Result.GetResult<Prisma.$public_knex_migrations_lockPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Public_knex_migrations_locks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_knex_migrations_lockFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Public_knex_migrations_locks
     * const public_knex_migrations_locks = await prisma.public_knex_migrations_lock.findMany()
     * 
     * // Get first 10 Public_knex_migrations_locks
     * const public_knex_migrations_locks = await prisma.public_knex_migrations_lock.findMany({ take: 10 })
     * 
     * // Only select the `index`
     * const public_knex_migrations_lockWithIndexOnly = await prisma.public_knex_migrations_lock.findMany({ select: { index: true } })
     * 
    **/
    findMany<T extends public_knex_migrations_lockFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, public_knex_migrations_lockFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$public_knex_migrations_lockPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Public_knex_migrations_lock.
     * @param {public_knex_migrations_lockCreateArgs} args - Arguments to create a Public_knex_migrations_lock.
     * @example
     * // Create one Public_knex_migrations_lock
     * const Public_knex_migrations_lock = await prisma.public_knex_migrations_lock.create({
     *   data: {
     *     // ... data to create a Public_knex_migrations_lock
     *   }
     * })
     * 
    **/
    create<T extends public_knex_migrations_lockCreateArgs<ExtArgs>>(
      args: SelectSubset<T, public_knex_migrations_lockCreateArgs<ExtArgs>>
    ): Prisma__public_knex_migrations_lockClient<$Result.GetResult<Prisma.$public_knex_migrations_lockPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Public_knex_migrations_locks.
     *     @param {public_knex_migrations_lockCreateManyArgs} args - Arguments to create many Public_knex_migrations_locks.
     *     @example
     *     // Create many Public_knex_migrations_locks
     *     const public_knex_migrations_lock = await prisma.public_knex_migrations_lock.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends public_knex_migrations_lockCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, public_knex_migrations_lockCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Public_knex_migrations_lock.
     * @param {public_knex_migrations_lockDeleteArgs} args - Arguments to delete one Public_knex_migrations_lock.
     * @example
     * // Delete one Public_knex_migrations_lock
     * const Public_knex_migrations_lock = await prisma.public_knex_migrations_lock.delete({
     *   where: {
     *     // ... filter to delete one Public_knex_migrations_lock
     *   }
     * })
     * 
    **/
    delete<T extends public_knex_migrations_lockDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, public_knex_migrations_lockDeleteArgs<ExtArgs>>
    ): Prisma__public_knex_migrations_lockClient<$Result.GetResult<Prisma.$public_knex_migrations_lockPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Public_knex_migrations_lock.
     * @param {public_knex_migrations_lockUpdateArgs} args - Arguments to update one Public_knex_migrations_lock.
     * @example
     * // Update one Public_knex_migrations_lock
     * const public_knex_migrations_lock = await prisma.public_knex_migrations_lock.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends public_knex_migrations_lockUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, public_knex_migrations_lockUpdateArgs<ExtArgs>>
    ): Prisma__public_knex_migrations_lockClient<$Result.GetResult<Prisma.$public_knex_migrations_lockPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Public_knex_migrations_locks.
     * @param {public_knex_migrations_lockDeleteManyArgs} args - Arguments to filter Public_knex_migrations_locks to delete.
     * @example
     * // Delete a few Public_knex_migrations_locks
     * const { count } = await prisma.public_knex_migrations_lock.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends public_knex_migrations_lockDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, public_knex_migrations_lockDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Public_knex_migrations_locks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_knex_migrations_lockUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Public_knex_migrations_locks
     * const public_knex_migrations_lock = await prisma.public_knex_migrations_lock.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends public_knex_migrations_lockUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, public_knex_migrations_lockUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Public_knex_migrations_lock.
     * @param {public_knex_migrations_lockUpsertArgs} args - Arguments to update or create a Public_knex_migrations_lock.
     * @example
     * // Update or create a Public_knex_migrations_lock
     * const public_knex_migrations_lock = await prisma.public_knex_migrations_lock.upsert({
     *   create: {
     *     // ... data to create a Public_knex_migrations_lock
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Public_knex_migrations_lock we want to update
     *   }
     * })
    **/
    upsert<T extends public_knex_migrations_lockUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, public_knex_migrations_lockUpsertArgs<ExtArgs>>
    ): Prisma__public_knex_migrations_lockClient<$Result.GetResult<Prisma.$public_knex_migrations_lockPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Public_knex_migrations_locks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_knex_migrations_lockCountArgs} args - Arguments to filter Public_knex_migrations_locks to count.
     * @example
     * // Count the number of Public_knex_migrations_locks
     * const count = await prisma.public_knex_migrations_lock.count({
     *   where: {
     *     // ... the filter for the Public_knex_migrations_locks we want to count
     *   }
     * })
    **/
    count<T extends public_knex_migrations_lockCountArgs>(
      args?: Subset<T, public_knex_migrations_lockCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Public_knex_migrations_lockCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Public_knex_migrations_lock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Public_knex_migrations_lockAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Public_knex_migrations_lockAggregateArgs>(args: Subset<T, Public_knex_migrations_lockAggregateArgs>): Prisma.PrismaPromise<GetPublic_knex_migrations_lockAggregateType<T>>

    /**
     * Group by Public_knex_migrations_lock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {public_knex_migrations_lockGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends public_knex_migrations_lockGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: public_knex_migrations_lockGroupByArgs['orderBy'] }
        : { orderBy?: public_knex_migrations_lockGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, public_knex_migrations_lockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPublic_knex_migrations_lockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the public_knex_migrations_lock model
   */
  readonly fields: public_knex_migrations_lockFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for public_knex_migrations_lock.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__public_knex_migrations_lockClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the public_knex_migrations_lock model
   */ 
  interface public_knex_migrations_lockFieldRefs {
    readonly index: FieldRef<"public_knex_migrations_lock", 'Int'>
    readonly is_locked: FieldRef<"public_knex_migrations_lock", 'Int'>
  }
    

  // Custom InputTypes

  /**
   * public_knex_migrations_lock findUnique
   */
  export type public_knex_migrations_lockFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations_lock
     */
    select?: public_knex_migrations_lockSelect<ExtArgs> | null
    /**
     * Filter, which public_knex_migrations_lock to fetch.
     */
    where: public_knex_migrations_lockWhereUniqueInput
  }


  /**
   * public_knex_migrations_lock findUniqueOrThrow
   */
  export type public_knex_migrations_lockFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations_lock
     */
    select?: public_knex_migrations_lockSelect<ExtArgs> | null
    /**
     * Filter, which public_knex_migrations_lock to fetch.
     */
    where: public_knex_migrations_lockWhereUniqueInput
  }


  /**
   * public_knex_migrations_lock findFirst
   */
  export type public_knex_migrations_lockFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations_lock
     */
    select?: public_knex_migrations_lockSelect<ExtArgs> | null
    /**
     * Filter, which public_knex_migrations_lock to fetch.
     */
    where?: public_knex_migrations_lockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of public_knex_migrations_locks to fetch.
     */
    orderBy?: public_knex_migrations_lockOrderByWithRelationAndSearchRelevanceInput | public_knex_migrations_lockOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for public_knex_migrations_locks.
     */
    cursor?: public_knex_migrations_lockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` public_knex_migrations_locks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` public_knex_migrations_locks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of public_knex_migrations_locks.
     */
    distinct?: Public_knex_migrations_lockScalarFieldEnum | Public_knex_migrations_lockScalarFieldEnum[]
  }


  /**
   * public_knex_migrations_lock findFirstOrThrow
   */
  export type public_knex_migrations_lockFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations_lock
     */
    select?: public_knex_migrations_lockSelect<ExtArgs> | null
    /**
     * Filter, which public_knex_migrations_lock to fetch.
     */
    where?: public_knex_migrations_lockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of public_knex_migrations_locks to fetch.
     */
    orderBy?: public_knex_migrations_lockOrderByWithRelationAndSearchRelevanceInput | public_knex_migrations_lockOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for public_knex_migrations_locks.
     */
    cursor?: public_knex_migrations_lockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` public_knex_migrations_locks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` public_knex_migrations_locks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of public_knex_migrations_locks.
     */
    distinct?: Public_knex_migrations_lockScalarFieldEnum | Public_knex_migrations_lockScalarFieldEnum[]
  }


  /**
   * public_knex_migrations_lock findMany
   */
  export type public_knex_migrations_lockFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations_lock
     */
    select?: public_knex_migrations_lockSelect<ExtArgs> | null
    /**
     * Filter, which public_knex_migrations_locks to fetch.
     */
    where?: public_knex_migrations_lockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of public_knex_migrations_locks to fetch.
     */
    orderBy?: public_knex_migrations_lockOrderByWithRelationAndSearchRelevanceInput | public_knex_migrations_lockOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing public_knex_migrations_locks.
     */
    cursor?: public_knex_migrations_lockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` public_knex_migrations_locks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` public_knex_migrations_locks.
     */
    skip?: number
    distinct?: Public_knex_migrations_lockScalarFieldEnum | Public_knex_migrations_lockScalarFieldEnum[]
  }


  /**
   * public_knex_migrations_lock create
   */
  export type public_knex_migrations_lockCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations_lock
     */
    select?: public_knex_migrations_lockSelect<ExtArgs> | null
    /**
     * The data needed to create a public_knex_migrations_lock.
     */
    data?: XOR<public_knex_migrations_lockCreateInput, public_knex_migrations_lockUncheckedCreateInput>
  }


  /**
   * public_knex_migrations_lock createMany
   */
  export type public_knex_migrations_lockCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many public_knex_migrations_locks.
     */
    data: public_knex_migrations_lockCreateManyInput | public_knex_migrations_lockCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * public_knex_migrations_lock update
   */
  export type public_knex_migrations_lockUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations_lock
     */
    select?: public_knex_migrations_lockSelect<ExtArgs> | null
    /**
     * The data needed to update a public_knex_migrations_lock.
     */
    data: XOR<public_knex_migrations_lockUpdateInput, public_knex_migrations_lockUncheckedUpdateInput>
    /**
     * Choose, which public_knex_migrations_lock to update.
     */
    where: public_knex_migrations_lockWhereUniqueInput
  }


  /**
   * public_knex_migrations_lock updateMany
   */
  export type public_knex_migrations_lockUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update public_knex_migrations_locks.
     */
    data: XOR<public_knex_migrations_lockUpdateManyMutationInput, public_knex_migrations_lockUncheckedUpdateManyInput>
    /**
     * Filter which public_knex_migrations_locks to update
     */
    where?: public_knex_migrations_lockWhereInput
  }


  /**
   * public_knex_migrations_lock upsert
   */
  export type public_knex_migrations_lockUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations_lock
     */
    select?: public_knex_migrations_lockSelect<ExtArgs> | null
    /**
     * The filter to search for the public_knex_migrations_lock to update in case it exists.
     */
    where: public_knex_migrations_lockWhereUniqueInput
    /**
     * In case the public_knex_migrations_lock found by the `where` argument doesn't exist, create a new public_knex_migrations_lock with this data.
     */
    create: XOR<public_knex_migrations_lockCreateInput, public_knex_migrations_lockUncheckedCreateInput>
    /**
     * In case the public_knex_migrations_lock was found with the provided `where` argument, update it with this data.
     */
    update: XOR<public_knex_migrations_lockUpdateInput, public_knex_migrations_lockUncheckedUpdateInput>
  }


  /**
   * public_knex_migrations_lock delete
   */
  export type public_knex_migrations_lockDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations_lock
     */
    select?: public_knex_migrations_lockSelect<ExtArgs> | null
    /**
     * Filter which public_knex_migrations_lock to delete.
     */
    where: public_knex_migrations_lockWhereUniqueInput
  }


  /**
   * public_knex_migrations_lock deleteMany
   */
  export type public_knex_migrations_lockDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which public_knex_migrations_locks to delete
     */
    where?: public_knex_migrations_lockWhereInput
  }


  /**
   * public_knex_migrations_lock without action
   */
  export type public_knex_migrations_lockDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the public_knex_migrations_lock
     */
    select?: public_knex_migrations_lockSelect<ExtArgs> | null
  }



  /**
   * Model knowledge
   */

  export type AggregateKnowledge = {
    _count: KnowledgeCountAggregateOutputType | null
    _min: KnowledgeMinAggregateOutputType | null
    _max: KnowledgeMaxAggregateOutputType | null
  }

  export type KnowledgeMinAggregateOutputType = {
    id: string | null
    name: string | null
    sourceUrl: string | null
    dataType: string | null
    data: string | null
    projectId: string | null
    memoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KnowledgeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    sourceUrl: string | null
    dataType: string | null
    data: string | null
    projectId: string | null
    memoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KnowledgeCountAggregateOutputType = {
    id: number
    name: number
    sourceUrl: number
    dataType: number
    data: number
    projectId: number
    metadata: number
    memoryId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KnowledgeMinAggregateInputType = {
    id?: true
    name?: true
    sourceUrl?: true
    dataType?: true
    data?: true
    projectId?: true
    memoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KnowledgeMaxAggregateInputType = {
    id?: true
    name?: true
    sourceUrl?: true
    dataType?: true
    data?: true
    projectId?: true
    memoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KnowledgeCountAggregateInputType = {
    id?: true
    name?: true
    sourceUrl?: true
    dataType?: true
    data?: true
    projectId?: true
    metadata?: true
    memoryId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KnowledgeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which knowledge to aggregate.
     */
    where?: knowledgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of knowledges to fetch.
     */
    orderBy?: knowledgeOrderByWithRelationAndSearchRelevanceInput | knowledgeOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: knowledgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` knowledges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` knowledges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned knowledges
    **/
    _count?: true | KnowledgeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KnowledgeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KnowledgeMaxAggregateInputType
  }

  export type GetKnowledgeAggregateType<T extends KnowledgeAggregateArgs> = {
        [P in keyof T & keyof AggregateKnowledge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKnowledge[P]>
      : GetScalarType<T[P], AggregateKnowledge[P]>
  }




  export type knowledgeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: knowledgeWhereInput
    orderBy?: knowledgeOrderByWithAggregationInput | knowledgeOrderByWithAggregationInput[]
    by: KnowledgeScalarFieldEnum[] | KnowledgeScalarFieldEnum
    having?: knowledgeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KnowledgeCountAggregateInputType | true
    _min?: KnowledgeMinAggregateInputType
    _max?: KnowledgeMaxAggregateInputType
  }

  export type KnowledgeGroupByOutputType = {
    id: string
    name: string
    sourceUrl: string | null
    dataType: string | null
    data: string | null
    projectId: string
    metadata: JsonValue | null
    memoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    _count: KnowledgeCountAggregateOutputType | null
    _min: KnowledgeMinAggregateOutputType | null
    _max: KnowledgeMaxAggregateOutputType | null
  }

  type GetKnowledgeGroupByPayload<T extends knowledgeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KnowledgeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KnowledgeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KnowledgeGroupByOutputType[P]>
            : GetScalarType<T[P], KnowledgeGroupByOutputType[P]>
        }
      >
    >


  export type knowledgeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    sourceUrl?: boolean
    dataType?: boolean
    data?: boolean
    projectId?: boolean
    metadata?: boolean
    memoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["knowledge"]>

  export type knowledgeSelectScalar = {
    id?: boolean
    name?: boolean
    sourceUrl?: boolean
    dataType?: boolean
    data?: boolean
    projectId?: boolean
    metadata?: boolean
    memoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $knowledgePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "knowledge"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      sourceUrl: string | null
      dataType: string | null
      data: string | null
      projectId: string
      metadata: Prisma.JsonValue | null
      memoryId: string | null
      createdAt: Date | null
      updatedAt: Date | null
    }, ExtArgs["result"]["knowledge"]>
    composites: {}
  }


  type knowledgeGetPayload<S extends boolean | null | undefined | knowledgeDefaultArgs> = $Result.GetResult<Prisma.$knowledgePayload, S>

  type knowledgeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<knowledgeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: KnowledgeCountAggregateInputType | true
    }

  export interface knowledgeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['knowledge'], meta: { name: 'knowledge' } }
    /**
     * Find zero or one Knowledge that matches the filter.
     * @param {knowledgeFindUniqueArgs} args - Arguments to find a Knowledge
     * @example
     * // Get one Knowledge
     * const knowledge = await prisma.knowledge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends knowledgeFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, knowledgeFindUniqueArgs<ExtArgs>>
    ): Prisma__knowledgeClient<$Result.GetResult<Prisma.$knowledgePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Knowledge that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {knowledgeFindUniqueOrThrowArgs} args - Arguments to find a Knowledge
     * @example
     * // Get one Knowledge
     * const knowledge = await prisma.knowledge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends knowledgeFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, knowledgeFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__knowledgeClient<$Result.GetResult<Prisma.$knowledgePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Knowledge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knowledgeFindFirstArgs} args - Arguments to find a Knowledge
     * @example
     * // Get one Knowledge
     * const knowledge = await prisma.knowledge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends knowledgeFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, knowledgeFindFirstArgs<ExtArgs>>
    ): Prisma__knowledgeClient<$Result.GetResult<Prisma.$knowledgePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Knowledge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knowledgeFindFirstOrThrowArgs} args - Arguments to find a Knowledge
     * @example
     * // Get one Knowledge
     * const knowledge = await prisma.knowledge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends knowledgeFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, knowledgeFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__knowledgeClient<$Result.GetResult<Prisma.$knowledgePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Knowledges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knowledgeFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Knowledges
     * const knowledges = await prisma.knowledge.findMany()
     * 
     * // Get first 10 Knowledges
     * const knowledges = await prisma.knowledge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const knowledgeWithIdOnly = await prisma.knowledge.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends knowledgeFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, knowledgeFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$knowledgePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Knowledge.
     * @param {knowledgeCreateArgs} args - Arguments to create a Knowledge.
     * @example
     * // Create one Knowledge
     * const Knowledge = await prisma.knowledge.create({
     *   data: {
     *     // ... data to create a Knowledge
     *   }
     * })
     * 
    **/
    create<T extends knowledgeCreateArgs<ExtArgs>>(
      args: SelectSubset<T, knowledgeCreateArgs<ExtArgs>>
    ): Prisma__knowledgeClient<$Result.GetResult<Prisma.$knowledgePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Knowledges.
     *     @param {knowledgeCreateManyArgs} args - Arguments to create many Knowledges.
     *     @example
     *     // Create many Knowledges
     *     const knowledge = await prisma.knowledge.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends knowledgeCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, knowledgeCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Knowledge.
     * @param {knowledgeDeleteArgs} args - Arguments to delete one Knowledge.
     * @example
     * // Delete one Knowledge
     * const Knowledge = await prisma.knowledge.delete({
     *   where: {
     *     // ... filter to delete one Knowledge
     *   }
     * })
     * 
    **/
    delete<T extends knowledgeDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, knowledgeDeleteArgs<ExtArgs>>
    ): Prisma__knowledgeClient<$Result.GetResult<Prisma.$knowledgePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Knowledge.
     * @param {knowledgeUpdateArgs} args - Arguments to update one Knowledge.
     * @example
     * // Update one Knowledge
     * const knowledge = await prisma.knowledge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends knowledgeUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, knowledgeUpdateArgs<ExtArgs>>
    ): Prisma__knowledgeClient<$Result.GetResult<Prisma.$knowledgePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Knowledges.
     * @param {knowledgeDeleteManyArgs} args - Arguments to filter Knowledges to delete.
     * @example
     * // Delete a few Knowledges
     * const { count } = await prisma.knowledge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends knowledgeDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, knowledgeDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Knowledges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knowledgeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Knowledges
     * const knowledge = await prisma.knowledge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends knowledgeUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, knowledgeUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Knowledge.
     * @param {knowledgeUpsertArgs} args - Arguments to update or create a Knowledge.
     * @example
     * // Update or create a Knowledge
     * const knowledge = await prisma.knowledge.upsert({
     *   create: {
     *     // ... data to create a Knowledge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Knowledge we want to update
     *   }
     * })
    **/
    upsert<T extends knowledgeUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, knowledgeUpsertArgs<ExtArgs>>
    ): Prisma__knowledgeClient<$Result.GetResult<Prisma.$knowledgePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Knowledges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knowledgeCountArgs} args - Arguments to filter Knowledges to count.
     * @example
     * // Count the number of Knowledges
     * const count = await prisma.knowledge.count({
     *   where: {
     *     // ... the filter for the Knowledges we want to count
     *   }
     * })
    **/
    count<T extends knowledgeCountArgs>(
      args?: Subset<T, knowledgeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KnowledgeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Knowledge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KnowledgeAggregateArgs>(args: Subset<T, KnowledgeAggregateArgs>): Prisma.PrismaPromise<GetKnowledgeAggregateType<T>>

    /**
     * Group by Knowledge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knowledgeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends knowledgeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: knowledgeGroupByArgs['orderBy'] }
        : { orderBy?: knowledgeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, knowledgeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKnowledgeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the knowledge model
   */
  readonly fields: knowledgeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for knowledge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__knowledgeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the knowledge model
   */ 
  interface knowledgeFieldRefs {
    readonly id: FieldRef<"knowledge", 'String'>
    readonly name: FieldRef<"knowledge", 'String'>
    readonly sourceUrl: FieldRef<"knowledge", 'String'>
    readonly dataType: FieldRef<"knowledge", 'String'>
    readonly data: FieldRef<"knowledge", 'String'>
    readonly projectId: FieldRef<"knowledge", 'String'>
    readonly metadata: FieldRef<"knowledge", 'Json'>
    readonly memoryId: FieldRef<"knowledge", 'String'>
    readonly createdAt: FieldRef<"knowledge", 'DateTime'>
    readonly updatedAt: FieldRef<"knowledge", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * knowledge findUnique
   */
  export type knowledgeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the knowledge
     */
    select?: knowledgeSelect<ExtArgs> | null
    /**
     * Filter, which knowledge to fetch.
     */
    where: knowledgeWhereUniqueInput
  }


  /**
   * knowledge findUniqueOrThrow
   */
  export type knowledgeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the knowledge
     */
    select?: knowledgeSelect<ExtArgs> | null
    /**
     * Filter, which knowledge to fetch.
     */
    where: knowledgeWhereUniqueInput
  }


  /**
   * knowledge findFirst
   */
  export type knowledgeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the knowledge
     */
    select?: knowledgeSelect<ExtArgs> | null
    /**
     * Filter, which knowledge to fetch.
     */
    where?: knowledgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of knowledges to fetch.
     */
    orderBy?: knowledgeOrderByWithRelationAndSearchRelevanceInput | knowledgeOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for knowledges.
     */
    cursor?: knowledgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` knowledges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` knowledges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of knowledges.
     */
    distinct?: KnowledgeScalarFieldEnum | KnowledgeScalarFieldEnum[]
  }


  /**
   * knowledge findFirstOrThrow
   */
  export type knowledgeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the knowledge
     */
    select?: knowledgeSelect<ExtArgs> | null
    /**
     * Filter, which knowledge to fetch.
     */
    where?: knowledgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of knowledges to fetch.
     */
    orderBy?: knowledgeOrderByWithRelationAndSearchRelevanceInput | knowledgeOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for knowledges.
     */
    cursor?: knowledgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` knowledges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` knowledges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of knowledges.
     */
    distinct?: KnowledgeScalarFieldEnum | KnowledgeScalarFieldEnum[]
  }


  /**
   * knowledge findMany
   */
  export type knowledgeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the knowledge
     */
    select?: knowledgeSelect<ExtArgs> | null
    /**
     * Filter, which knowledges to fetch.
     */
    where?: knowledgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of knowledges to fetch.
     */
    orderBy?: knowledgeOrderByWithRelationAndSearchRelevanceInput | knowledgeOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing knowledges.
     */
    cursor?: knowledgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` knowledges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` knowledges.
     */
    skip?: number
    distinct?: KnowledgeScalarFieldEnum | KnowledgeScalarFieldEnum[]
  }


  /**
   * knowledge create
   */
  export type knowledgeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the knowledge
     */
    select?: knowledgeSelect<ExtArgs> | null
    /**
     * The data needed to create a knowledge.
     */
    data: XOR<knowledgeCreateInput, knowledgeUncheckedCreateInput>
  }


  /**
   * knowledge createMany
   */
  export type knowledgeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many knowledges.
     */
    data: knowledgeCreateManyInput | knowledgeCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * knowledge update
   */
  export type knowledgeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the knowledge
     */
    select?: knowledgeSelect<ExtArgs> | null
    /**
     * The data needed to update a knowledge.
     */
    data: XOR<knowledgeUpdateInput, knowledgeUncheckedUpdateInput>
    /**
     * Choose, which knowledge to update.
     */
    where: knowledgeWhereUniqueInput
  }


  /**
   * knowledge updateMany
   */
  export type knowledgeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update knowledges.
     */
    data: XOR<knowledgeUpdateManyMutationInput, knowledgeUncheckedUpdateManyInput>
    /**
     * Filter which knowledges to update
     */
    where?: knowledgeWhereInput
  }


  /**
   * knowledge upsert
   */
  export type knowledgeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the knowledge
     */
    select?: knowledgeSelect<ExtArgs> | null
    /**
     * The filter to search for the knowledge to update in case it exists.
     */
    where: knowledgeWhereUniqueInput
    /**
     * In case the knowledge found by the `where` argument doesn't exist, create a new knowledge with this data.
     */
    create: XOR<knowledgeCreateInput, knowledgeUncheckedCreateInput>
    /**
     * In case the knowledge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<knowledgeUpdateInput, knowledgeUncheckedUpdateInput>
  }


  /**
   * knowledge delete
   */
  export type knowledgeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the knowledge
     */
    select?: knowledgeSelect<ExtArgs> | null
    /**
     * Filter which knowledge to delete.
     */
    where: knowledgeWhereUniqueInput
  }


  /**
   * knowledge deleteMany
   */
  export type knowledgeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which knowledges to delete
     */
    where?: knowledgeWhereInput
  }


  /**
   * knowledge without action
   */
  export type knowledgeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the knowledge
     */
    select?: knowledgeSelect<ExtArgs> | null
  }



  /**
   * Model pluginState
   */

  export type AggregatePluginState = {
    _count: PluginStateCountAggregateOutputType | null
    _min: PluginStateMinAggregateOutputType | null
    _max: PluginStateMaxAggregateOutputType | null
  }

  export type PluginStateMinAggregateOutputType = {
    id: string | null
    agentId: string | null
    plugin: string | null
  }

  export type PluginStateMaxAggregateOutputType = {
    id: string | null
    agentId: string | null
    plugin: string | null
  }

  export type PluginStateCountAggregateOutputType = {
    id: number
    agentId: number
    state: number
    plugin: number
    _all: number
  }


  export type PluginStateMinAggregateInputType = {
    id?: true
    agentId?: true
    plugin?: true
  }

  export type PluginStateMaxAggregateInputType = {
    id?: true
    agentId?: true
    plugin?: true
  }

  export type PluginStateCountAggregateInputType = {
    id?: true
    agentId?: true
    state?: true
    plugin?: true
    _all?: true
  }

  export type PluginStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pluginState to aggregate.
     */
    where?: pluginStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pluginStates to fetch.
     */
    orderBy?: pluginStateOrderByWithRelationAndSearchRelevanceInput | pluginStateOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: pluginStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pluginStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pluginStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned pluginStates
    **/
    _count?: true | PluginStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PluginStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PluginStateMaxAggregateInputType
  }

  export type GetPluginStateAggregateType<T extends PluginStateAggregateArgs> = {
        [P in keyof T & keyof AggregatePluginState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePluginState[P]>
      : GetScalarType<T[P], AggregatePluginState[P]>
  }




  export type pluginStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pluginStateWhereInput
    orderBy?: pluginStateOrderByWithAggregationInput | pluginStateOrderByWithAggregationInput[]
    by: PluginStateScalarFieldEnum[] | PluginStateScalarFieldEnum
    having?: pluginStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PluginStateCountAggregateInputType | true
    _min?: PluginStateMinAggregateInputType
    _max?: PluginStateMaxAggregateInputType
  }

  export type PluginStateGroupByOutputType = {
    id: string
    agentId: string | null
    state: JsonValue | null
    plugin: string | null
    _count: PluginStateCountAggregateOutputType | null
    _min: PluginStateMinAggregateOutputType | null
    _max: PluginStateMaxAggregateOutputType | null
  }

  type GetPluginStateGroupByPayload<T extends pluginStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PluginStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PluginStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PluginStateGroupByOutputType[P]>
            : GetScalarType<T[P], PluginStateGroupByOutputType[P]>
        }
      >
    >


  export type pluginStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentId?: boolean
    state?: boolean
    plugin?: boolean
    agents?: boolean | pluginState$agentsArgs<ExtArgs>
  }, ExtArgs["result"]["pluginState"]>

  export type pluginStateSelectScalar = {
    id?: boolean
    agentId?: boolean
    state?: boolean
    plugin?: boolean
  }

  export type pluginStateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agents?: boolean | pluginState$agentsArgs<ExtArgs>
  }


  export type $pluginStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "pluginState"
    objects: {
      agents: Prisma.$agentsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      agentId: string | null
      state: Prisma.JsonValue | null
      plugin: string | null
    }, ExtArgs["result"]["pluginState"]>
    composites: {}
  }


  type pluginStateGetPayload<S extends boolean | null | undefined | pluginStateDefaultArgs> = $Result.GetResult<Prisma.$pluginStatePayload, S>

  type pluginStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<pluginStateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PluginStateCountAggregateInputType | true
    }

  export interface pluginStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['pluginState'], meta: { name: 'pluginState' } }
    /**
     * Find zero or one PluginState that matches the filter.
     * @param {pluginStateFindUniqueArgs} args - Arguments to find a PluginState
     * @example
     * // Get one PluginState
     * const pluginState = await prisma.pluginState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends pluginStateFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, pluginStateFindUniqueArgs<ExtArgs>>
    ): Prisma__pluginStateClient<$Result.GetResult<Prisma.$pluginStatePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one PluginState that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {pluginStateFindUniqueOrThrowArgs} args - Arguments to find a PluginState
     * @example
     * // Get one PluginState
     * const pluginState = await prisma.pluginState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends pluginStateFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, pluginStateFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__pluginStateClient<$Result.GetResult<Prisma.$pluginStatePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first PluginState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pluginStateFindFirstArgs} args - Arguments to find a PluginState
     * @example
     * // Get one PluginState
     * const pluginState = await prisma.pluginState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends pluginStateFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, pluginStateFindFirstArgs<ExtArgs>>
    ): Prisma__pluginStateClient<$Result.GetResult<Prisma.$pluginStatePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first PluginState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pluginStateFindFirstOrThrowArgs} args - Arguments to find a PluginState
     * @example
     * // Get one PluginState
     * const pluginState = await prisma.pluginState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends pluginStateFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, pluginStateFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__pluginStateClient<$Result.GetResult<Prisma.$pluginStatePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more PluginStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pluginStateFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PluginStates
     * const pluginStates = await prisma.pluginState.findMany()
     * 
     * // Get first 10 PluginStates
     * const pluginStates = await prisma.pluginState.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pluginStateWithIdOnly = await prisma.pluginState.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends pluginStateFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, pluginStateFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pluginStatePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a PluginState.
     * @param {pluginStateCreateArgs} args - Arguments to create a PluginState.
     * @example
     * // Create one PluginState
     * const PluginState = await prisma.pluginState.create({
     *   data: {
     *     // ... data to create a PluginState
     *   }
     * })
     * 
    **/
    create<T extends pluginStateCreateArgs<ExtArgs>>(
      args: SelectSubset<T, pluginStateCreateArgs<ExtArgs>>
    ): Prisma__pluginStateClient<$Result.GetResult<Prisma.$pluginStatePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many PluginStates.
     *     @param {pluginStateCreateManyArgs} args - Arguments to create many PluginStates.
     *     @example
     *     // Create many PluginStates
     *     const pluginState = await prisma.pluginState.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends pluginStateCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, pluginStateCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PluginState.
     * @param {pluginStateDeleteArgs} args - Arguments to delete one PluginState.
     * @example
     * // Delete one PluginState
     * const PluginState = await prisma.pluginState.delete({
     *   where: {
     *     // ... filter to delete one PluginState
     *   }
     * })
     * 
    **/
    delete<T extends pluginStateDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, pluginStateDeleteArgs<ExtArgs>>
    ): Prisma__pluginStateClient<$Result.GetResult<Prisma.$pluginStatePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one PluginState.
     * @param {pluginStateUpdateArgs} args - Arguments to update one PluginState.
     * @example
     * // Update one PluginState
     * const pluginState = await prisma.pluginState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends pluginStateUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, pluginStateUpdateArgs<ExtArgs>>
    ): Prisma__pluginStateClient<$Result.GetResult<Prisma.$pluginStatePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more PluginStates.
     * @param {pluginStateDeleteManyArgs} args - Arguments to filter PluginStates to delete.
     * @example
     * // Delete a few PluginStates
     * const { count } = await prisma.pluginState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends pluginStateDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, pluginStateDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PluginStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pluginStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PluginStates
     * const pluginState = await prisma.pluginState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends pluginStateUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, pluginStateUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PluginState.
     * @param {pluginStateUpsertArgs} args - Arguments to update or create a PluginState.
     * @example
     * // Update or create a PluginState
     * const pluginState = await prisma.pluginState.upsert({
     *   create: {
     *     // ... data to create a PluginState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PluginState we want to update
     *   }
     * })
    **/
    upsert<T extends pluginStateUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, pluginStateUpsertArgs<ExtArgs>>
    ): Prisma__pluginStateClient<$Result.GetResult<Prisma.$pluginStatePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of PluginStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pluginStateCountArgs} args - Arguments to filter PluginStates to count.
     * @example
     * // Count the number of PluginStates
     * const count = await prisma.pluginState.count({
     *   where: {
     *     // ... the filter for the PluginStates we want to count
     *   }
     * })
    **/
    count<T extends pluginStateCountArgs>(
      args?: Subset<T, pluginStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PluginStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PluginState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PluginStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PluginStateAggregateArgs>(args: Subset<T, PluginStateAggregateArgs>): Prisma.PrismaPromise<GetPluginStateAggregateType<T>>

    /**
     * Group by PluginState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pluginStateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends pluginStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: pluginStateGroupByArgs['orderBy'] }
        : { orderBy?: pluginStateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, pluginStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPluginStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the pluginState model
   */
  readonly fields: pluginStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for pluginState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__pluginStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    agents<T extends pluginState$agentsArgs<ExtArgs> = {}>(args?: Subset<T, pluginState$agentsArgs<ExtArgs>>): Prisma__agentsClient<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the pluginState model
   */ 
  interface pluginStateFieldRefs {
    readonly id: FieldRef<"pluginState", 'String'>
    readonly agentId: FieldRef<"pluginState", 'String'>
    readonly state: FieldRef<"pluginState", 'Json'>
    readonly plugin: FieldRef<"pluginState", 'String'>
  }
    

  // Custom InputTypes

  /**
   * pluginState findUnique
   */
  export type pluginStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pluginState
     */
    select?: pluginStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: pluginStateInclude<ExtArgs> | null
    /**
     * Filter, which pluginState to fetch.
     */
    where: pluginStateWhereUniqueInput
  }


  /**
   * pluginState findUniqueOrThrow
   */
  export type pluginStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pluginState
     */
    select?: pluginStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: pluginStateInclude<ExtArgs> | null
    /**
     * Filter, which pluginState to fetch.
     */
    where: pluginStateWhereUniqueInput
  }


  /**
   * pluginState findFirst
   */
  export type pluginStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pluginState
     */
    select?: pluginStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: pluginStateInclude<ExtArgs> | null
    /**
     * Filter, which pluginState to fetch.
     */
    where?: pluginStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pluginStates to fetch.
     */
    orderBy?: pluginStateOrderByWithRelationAndSearchRelevanceInput | pluginStateOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pluginStates.
     */
    cursor?: pluginStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pluginStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pluginStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pluginStates.
     */
    distinct?: PluginStateScalarFieldEnum | PluginStateScalarFieldEnum[]
  }


  /**
   * pluginState findFirstOrThrow
   */
  export type pluginStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pluginState
     */
    select?: pluginStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: pluginStateInclude<ExtArgs> | null
    /**
     * Filter, which pluginState to fetch.
     */
    where?: pluginStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pluginStates to fetch.
     */
    orderBy?: pluginStateOrderByWithRelationAndSearchRelevanceInput | pluginStateOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pluginStates.
     */
    cursor?: pluginStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pluginStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pluginStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pluginStates.
     */
    distinct?: PluginStateScalarFieldEnum | PluginStateScalarFieldEnum[]
  }


  /**
   * pluginState findMany
   */
  export type pluginStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pluginState
     */
    select?: pluginStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: pluginStateInclude<ExtArgs> | null
    /**
     * Filter, which pluginStates to fetch.
     */
    where?: pluginStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pluginStates to fetch.
     */
    orderBy?: pluginStateOrderByWithRelationAndSearchRelevanceInput | pluginStateOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing pluginStates.
     */
    cursor?: pluginStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pluginStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pluginStates.
     */
    skip?: number
    distinct?: PluginStateScalarFieldEnum | PluginStateScalarFieldEnum[]
  }


  /**
   * pluginState create
   */
  export type pluginStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pluginState
     */
    select?: pluginStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: pluginStateInclude<ExtArgs> | null
    /**
     * The data needed to create a pluginState.
     */
    data?: XOR<pluginStateCreateInput, pluginStateUncheckedCreateInput>
  }


  /**
   * pluginState createMany
   */
  export type pluginStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many pluginStates.
     */
    data: pluginStateCreateManyInput | pluginStateCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * pluginState update
   */
  export type pluginStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pluginState
     */
    select?: pluginStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: pluginStateInclude<ExtArgs> | null
    /**
     * The data needed to update a pluginState.
     */
    data: XOR<pluginStateUpdateInput, pluginStateUncheckedUpdateInput>
    /**
     * Choose, which pluginState to update.
     */
    where: pluginStateWhereUniqueInput
  }


  /**
   * pluginState updateMany
   */
  export type pluginStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update pluginStates.
     */
    data: XOR<pluginStateUpdateManyMutationInput, pluginStateUncheckedUpdateManyInput>
    /**
     * Filter which pluginStates to update
     */
    where?: pluginStateWhereInput
  }


  /**
   * pluginState upsert
   */
  export type pluginStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pluginState
     */
    select?: pluginStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: pluginStateInclude<ExtArgs> | null
    /**
     * The filter to search for the pluginState to update in case it exists.
     */
    where: pluginStateWhereUniqueInput
    /**
     * In case the pluginState found by the `where` argument doesn't exist, create a new pluginState with this data.
     */
    create: XOR<pluginStateCreateInput, pluginStateUncheckedCreateInput>
    /**
     * In case the pluginState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<pluginStateUpdateInput, pluginStateUncheckedUpdateInput>
  }


  /**
   * pluginState delete
   */
  export type pluginStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pluginState
     */
    select?: pluginStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: pluginStateInclude<ExtArgs> | null
    /**
     * Filter which pluginState to delete.
     */
    where: pluginStateWhereUniqueInput
  }


  /**
   * pluginState deleteMany
   */
  export type pluginStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pluginStates to delete
     */
    where?: pluginStateWhereInput
  }


  /**
   * pluginState.agents
   */
  export type pluginState$agentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agents
     */
    select?: agentsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agentsInclude<ExtArgs> | null
    where?: agentsWhereInput
  }


  /**
   * pluginState without action
   */
  export type pluginStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pluginState
     */
    select?: pluginStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: pluginStateInclude<ExtArgs> | null
  }



  /**
   * Model request
   */

  export type AggregateRequest = {
    _count: RequestCountAggregateOutputType | null
    _avg: RequestAvgAggregateOutputType | null
    _sum: RequestSumAggregateOutputType | null
    _min: RequestMinAggregateOutputType | null
    _max: RequestMaxAggregateOutputType | null
  }

  export type RequestAvgAggregateOutputType = {
    duration: number | null
    statusCode: number | null
    cost: number | null
  }

  export type RequestSumAggregateOutputType = {
    duration: number | null
    statusCode: number | null
    cost: number | null
  }

  export type RequestMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    requestData: string | null
    responseData: string | null
    duration: number | null
    status: string | null
    statusCode: number | null
    model: string | null
    parameters: string | null
    createdAt: Date | null
    provider: string | null
    type: string | null
    hidden: boolean | null
    processed: boolean | null
    cost: number | null
    spell: string | null
    nodeId: string | null
    agentId: string | null
  }

  export type RequestMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    requestData: string | null
    responseData: string | null
    duration: number | null
    status: string | null
    statusCode: number | null
    model: string | null
    parameters: string | null
    createdAt: Date | null
    provider: string | null
    type: string | null
    hidden: boolean | null
    processed: boolean | null
    cost: number | null
    spell: string | null
    nodeId: string | null
    agentId: string | null
  }

  export type RequestCountAggregateOutputType = {
    id: number
    projectId: number
    requestData: number
    responseData: number
    duration: number
    status: number
    statusCode: number
    model: number
    parameters: number
    createdAt: number
    provider: number
    type: number
    hidden: number
    processed: number
    cost: number
    spell: number
    nodeId: number
    agentId: number
    _all: number
  }


  export type RequestAvgAggregateInputType = {
    duration?: true
    statusCode?: true
    cost?: true
  }

  export type RequestSumAggregateInputType = {
    duration?: true
    statusCode?: true
    cost?: true
  }

  export type RequestMinAggregateInputType = {
    id?: true
    projectId?: true
    requestData?: true
    responseData?: true
    duration?: true
    status?: true
    statusCode?: true
    model?: true
    parameters?: true
    createdAt?: true
    provider?: true
    type?: true
    hidden?: true
    processed?: true
    cost?: true
    spell?: true
    nodeId?: true
    agentId?: true
  }

  export type RequestMaxAggregateInputType = {
    id?: true
    projectId?: true
    requestData?: true
    responseData?: true
    duration?: true
    status?: true
    statusCode?: true
    model?: true
    parameters?: true
    createdAt?: true
    provider?: true
    type?: true
    hidden?: true
    processed?: true
    cost?: true
    spell?: true
    nodeId?: true
    agentId?: true
  }

  export type RequestCountAggregateInputType = {
    id?: true
    projectId?: true
    requestData?: true
    responseData?: true
    duration?: true
    status?: true
    statusCode?: true
    model?: true
    parameters?: true
    createdAt?: true
    provider?: true
    type?: true
    hidden?: true
    processed?: true
    cost?: true
    spell?: true
    nodeId?: true
    agentId?: true
    _all?: true
  }

  export type RequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which request to aggregate.
     */
    where?: requestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of requests to fetch.
     */
    orderBy?: requestOrderByWithRelationAndSearchRelevanceInput | requestOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: requestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` requests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` requests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned requests
    **/
    _count?: true | RequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RequestMaxAggregateInputType
  }

  export type GetRequestAggregateType<T extends RequestAggregateArgs> = {
        [P in keyof T & keyof AggregateRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRequest[P]>
      : GetScalarType<T[P], AggregateRequest[P]>
  }




  export type requestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: requestWhereInput
    orderBy?: requestOrderByWithAggregationInput | requestOrderByWithAggregationInput[]
    by: RequestScalarFieldEnum[] | RequestScalarFieldEnum
    having?: requestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RequestCountAggregateInputType | true
    _avg?: RequestAvgAggregateInputType
    _sum?: RequestSumAggregateInputType
    _min?: RequestMinAggregateInputType
    _max?: RequestMaxAggregateInputType
  }

  export type RequestGroupByOutputType = {
    id: string
    projectId: string
    requestData: string | null
    responseData: string | null
    duration: number
    status: string | null
    statusCode: number | null
    model: string | null
    parameters: string | null
    createdAt: Date | null
    provider: string
    type: string
    hidden: boolean
    processed: boolean
    cost: number | null
    spell: string | null
    nodeId: string | null
    agentId: string
    _count: RequestCountAggregateOutputType | null
    _avg: RequestAvgAggregateOutputType | null
    _sum: RequestSumAggregateOutputType | null
    _min: RequestMinAggregateOutputType | null
    _max: RequestMaxAggregateOutputType | null
  }

  type GetRequestGroupByPayload<T extends requestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RequestGroupByOutputType[P]>
            : GetScalarType<T[P], RequestGroupByOutputType[P]>
        }
      >
    >


  export type requestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    requestData?: boolean
    responseData?: boolean
    duration?: boolean
    status?: boolean
    statusCode?: boolean
    model?: boolean
    parameters?: boolean
    createdAt?: boolean
    provider?: boolean
    type?: boolean
    hidden?: boolean
    processed?: boolean
    cost?: boolean
    spell?: boolean
    nodeId?: boolean
    agentId?: boolean
  }, ExtArgs["result"]["request"]>

  export type requestSelectScalar = {
    id?: boolean
    projectId?: boolean
    requestData?: boolean
    responseData?: boolean
    duration?: boolean
    status?: boolean
    statusCode?: boolean
    model?: boolean
    parameters?: boolean
    createdAt?: boolean
    provider?: boolean
    type?: boolean
    hidden?: boolean
    processed?: boolean
    cost?: boolean
    spell?: boolean
    nodeId?: boolean
    agentId?: boolean
  }


  export type $requestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "request"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      requestData: string | null
      responseData: string | null
      duration: number
      status: string | null
      statusCode: number | null
      model: string | null
      parameters: string | null
      createdAt: Date | null
      provider: string
      type: string
      hidden: boolean
      processed: boolean
      cost: number | null
      spell: string | null
      nodeId: string | null
      agentId: string
    }, ExtArgs["result"]["request"]>
    composites: {}
  }


  type requestGetPayload<S extends boolean | null | undefined | requestDefaultArgs> = $Result.GetResult<Prisma.$requestPayload, S>

  type requestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<requestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RequestCountAggregateInputType | true
    }

  export interface requestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['request'], meta: { name: 'request' } }
    /**
     * Find zero or one Request that matches the filter.
     * @param {requestFindUniqueArgs} args - Arguments to find a Request
     * @example
     * // Get one Request
     * const request = await prisma.request.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends requestFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, requestFindUniqueArgs<ExtArgs>>
    ): Prisma__requestClient<$Result.GetResult<Prisma.$requestPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Request that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {requestFindUniqueOrThrowArgs} args - Arguments to find a Request
     * @example
     * // Get one Request
     * const request = await prisma.request.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends requestFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, requestFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__requestClient<$Result.GetResult<Prisma.$requestPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Request that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requestFindFirstArgs} args - Arguments to find a Request
     * @example
     * // Get one Request
     * const request = await prisma.request.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends requestFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, requestFindFirstArgs<ExtArgs>>
    ): Prisma__requestClient<$Result.GetResult<Prisma.$requestPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Request that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requestFindFirstOrThrowArgs} args - Arguments to find a Request
     * @example
     * // Get one Request
     * const request = await prisma.request.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends requestFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, requestFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__requestClient<$Result.GetResult<Prisma.$requestPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Requests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requestFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Requests
     * const requests = await prisma.request.findMany()
     * 
     * // Get first 10 Requests
     * const requests = await prisma.request.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const requestWithIdOnly = await prisma.request.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends requestFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, requestFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$requestPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Request.
     * @param {requestCreateArgs} args - Arguments to create a Request.
     * @example
     * // Create one Request
     * const Request = await prisma.request.create({
     *   data: {
     *     // ... data to create a Request
     *   }
     * })
     * 
    **/
    create<T extends requestCreateArgs<ExtArgs>>(
      args: SelectSubset<T, requestCreateArgs<ExtArgs>>
    ): Prisma__requestClient<$Result.GetResult<Prisma.$requestPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Requests.
     *     @param {requestCreateManyArgs} args - Arguments to create many Requests.
     *     @example
     *     // Create many Requests
     *     const request = await prisma.request.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends requestCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, requestCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Request.
     * @param {requestDeleteArgs} args - Arguments to delete one Request.
     * @example
     * // Delete one Request
     * const Request = await prisma.request.delete({
     *   where: {
     *     // ... filter to delete one Request
     *   }
     * })
     * 
    **/
    delete<T extends requestDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, requestDeleteArgs<ExtArgs>>
    ): Prisma__requestClient<$Result.GetResult<Prisma.$requestPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Request.
     * @param {requestUpdateArgs} args - Arguments to update one Request.
     * @example
     * // Update one Request
     * const request = await prisma.request.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends requestUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, requestUpdateArgs<ExtArgs>>
    ): Prisma__requestClient<$Result.GetResult<Prisma.$requestPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Requests.
     * @param {requestDeleteManyArgs} args - Arguments to filter Requests to delete.
     * @example
     * // Delete a few Requests
     * const { count } = await prisma.request.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends requestDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, requestDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Requests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Requests
     * const request = await prisma.request.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends requestUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, requestUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Request.
     * @param {requestUpsertArgs} args - Arguments to update or create a Request.
     * @example
     * // Update or create a Request
     * const request = await prisma.request.upsert({
     *   create: {
     *     // ... data to create a Request
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Request we want to update
     *   }
     * })
    **/
    upsert<T extends requestUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, requestUpsertArgs<ExtArgs>>
    ): Prisma__requestClient<$Result.GetResult<Prisma.$requestPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Requests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requestCountArgs} args - Arguments to filter Requests to count.
     * @example
     * // Count the number of Requests
     * const count = await prisma.request.count({
     *   where: {
     *     // ... the filter for the Requests we want to count
     *   }
     * })
    **/
    count<T extends requestCountArgs>(
      args?: Subset<T, requestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Request.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RequestAggregateArgs>(args: Subset<T, RequestAggregateArgs>): Prisma.PrismaPromise<GetRequestAggregateType<T>>

    /**
     * Group by Request.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends requestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: requestGroupByArgs['orderBy'] }
        : { orderBy?: requestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, requestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the request model
   */
  readonly fields: requestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for request.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__requestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the request model
   */ 
  interface requestFieldRefs {
    readonly id: FieldRef<"request", 'String'>
    readonly projectId: FieldRef<"request", 'String'>
    readonly requestData: FieldRef<"request", 'String'>
    readonly responseData: FieldRef<"request", 'String'>
    readonly duration: FieldRef<"request", 'Int'>
    readonly status: FieldRef<"request", 'String'>
    readonly statusCode: FieldRef<"request", 'Int'>
    readonly model: FieldRef<"request", 'String'>
    readonly parameters: FieldRef<"request", 'String'>
    readonly createdAt: FieldRef<"request", 'DateTime'>
    readonly provider: FieldRef<"request", 'String'>
    readonly type: FieldRef<"request", 'String'>
    readonly hidden: FieldRef<"request", 'Boolean'>
    readonly processed: FieldRef<"request", 'Boolean'>
    readonly cost: FieldRef<"request", 'Float'>
    readonly spell: FieldRef<"request", 'String'>
    readonly nodeId: FieldRef<"request", 'String'>
    readonly agentId: FieldRef<"request", 'String'>
  }
    

  // Custom InputTypes

  /**
   * request findUnique
   */
  export type requestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the request
     */
    select?: requestSelect<ExtArgs> | null
    /**
     * Filter, which request to fetch.
     */
    where: requestWhereUniqueInput
  }


  /**
   * request findUniqueOrThrow
   */
  export type requestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the request
     */
    select?: requestSelect<ExtArgs> | null
    /**
     * Filter, which request to fetch.
     */
    where: requestWhereUniqueInput
  }


  /**
   * request findFirst
   */
  export type requestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the request
     */
    select?: requestSelect<ExtArgs> | null
    /**
     * Filter, which request to fetch.
     */
    where?: requestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of requests to fetch.
     */
    orderBy?: requestOrderByWithRelationAndSearchRelevanceInput | requestOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for requests.
     */
    cursor?: requestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` requests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` requests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of requests.
     */
    distinct?: RequestScalarFieldEnum | RequestScalarFieldEnum[]
  }


  /**
   * request findFirstOrThrow
   */
  export type requestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the request
     */
    select?: requestSelect<ExtArgs> | null
    /**
     * Filter, which request to fetch.
     */
    where?: requestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of requests to fetch.
     */
    orderBy?: requestOrderByWithRelationAndSearchRelevanceInput | requestOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for requests.
     */
    cursor?: requestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` requests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` requests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of requests.
     */
    distinct?: RequestScalarFieldEnum | RequestScalarFieldEnum[]
  }


  /**
   * request findMany
   */
  export type requestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the request
     */
    select?: requestSelect<ExtArgs> | null
    /**
     * Filter, which requests to fetch.
     */
    where?: requestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of requests to fetch.
     */
    orderBy?: requestOrderByWithRelationAndSearchRelevanceInput | requestOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing requests.
     */
    cursor?: requestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` requests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` requests.
     */
    skip?: number
    distinct?: RequestScalarFieldEnum | RequestScalarFieldEnum[]
  }


  /**
   * request create
   */
  export type requestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the request
     */
    select?: requestSelect<ExtArgs> | null
    /**
     * The data needed to create a request.
     */
    data: XOR<requestCreateInput, requestUncheckedCreateInput>
  }


  /**
   * request createMany
   */
  export type requestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many requests.
     */
    data: requestCreateManyInput | requestCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * request update
   */
  export type requestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the request
     */
    select?: requestSelect<ExtArgs> | null
    /**
     * The data needed to update a request.
     */
    data: XOR<requestUpdateInput, requestUncheckedUpdateInput>
    /**
     * Choose, which request to update.
     */
    where: requestWhereUniqueInput
  }


  /**
   * request updateMany
   */
  export type requestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update requests.
     */
    data: XOR<requestUpdateManyMutationInput, requestUncheckedUpdateManyInput>
    /**
     * Filter which requests to update
     */
    where?: requestWhereInput
  }


  /**
   * request upsert
   */
  export type requestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the request
     */
    select?: requestSelect<ExtArgs> | null
    /**
     * The filter to search for the request to update in case it exists.
     */
    where: requestWhereUniqueInput
    /**
     * In case the request found by the `where` argument doesn't exist, create a new request with this data.
     */
    create: XOR<requestCreateInput, requestUncheckedCreateInput>
    /**
     * In case the request was found with the provided `where` argument, update it with this data.
     */
    update: XOR<requestUpdateInput, requestUncheckedUpdateInput>
  }


  /**
   * request delete
   */
  export type requestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the request
     */
    select?: requestSelect<ExtArgs> | null
    /**
     * Filter which request to delete.
     */
    where: requestWhereUniqueInput
  }


  /**
   * request deleteMany
   */
  export type requestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which requests to delete
     */
    where?: requestWhereInput
  }


  /**
   * request without action
   */
  export type requestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the request
     */
    select?: requestSelect<ExtArgs> | null
  }



  /**
   * Model spellReleases
   */

  export type AggregateSpellReleases = {
    _count: SpellReleasesCountAggregateOutputType | null
    _min: SpellReleasesMinAggregateOutputType | null
    _max: SpellReleasesMaxAggregateOutputType | null
  }

  export type SpellReleasesMinAggregateOutputType = {
    id: string | null
    description: string | null
    agentId: string | null
    spellId: string | null
    projectId: string | null
    createdAt: Date | null
  }

  export type SpellReleasesMaxAggregateOutputType = {
    id: string | null
    description: string | null
    agentId: string | null
    spellId: string | null
    projectId: string | null
    createdAt: Date | null
  }

  export type SpellReleasesCountAggregateOutputType = {
    id: number
    description: number
    agentId: number
    spellId: number
    projectId: number
    createdAt: number
    _all: number
  }


  export type SpellReleasesMinAggregateInputType = {
    id?: true
    description?: true
    agentId?: true
    spellId?: true
    projectId?: true
    createdAt?: true
  }

  export type SpellReleasesMaxAggregateInputType = {
    id?: true
    description?: true
    agentId?: true
    spellId?: true
    projectId?: true
    createdAt?: true
  }

  export type SpellReleasesCountAggregateInputType = {
    id?: true
    description?: true
    agentId?: true
    spellId?: true
    projectId?: true
    createdAt?: true
    _all?: true
  }

  export type SpellReleasesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which spellReleases to aggregate.
     */
    where?: spellReleasesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of spellReleases to fetch.
     */
    orderBy?: spellReleasesOrderByWithRelationAndSearchRelevanceInput | spellReleasesOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: spellReleasesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` spellReleases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` spellReleases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned spellReleases
    **/
    _count?: true | SpellReleasesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpellReleasesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpellReleasesMaxAggregateInputType
  }

  export type GetSpellReleasesAggregateType<T extends SpellReleasesAggregateArgs> = {
        [P in keyof T & keyof AggregateSpellReleases]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpellReleases[P]>
      : GetScalarType<T[P], AggregateSpellReleases[P]>
  }




  export type spellReleasesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: spellReleasesWhereInput
    orderBy?: spellReleasesOrderByWithAggregationInput | spellReleasesOrderByWithAggregationInput[]
    by: SpellReleasesScalarFieldEnum[] | SpellReleasesScalarFieldEnum
    having?: spellReleasesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpellReleasesCountAggregateInputType | true
    _min?: SpellReleasesMinAggregateInputType
    _max?: SpellReleasesMaxAggregateInputType
  }

  export type SpellReleasesGroupByOutputType = {
    id: string
    description: string | null
    agentId: string
    spellId: string | null
    projectId: string | null
    createdAt: Date | null
    _count: SpellReleasesCountAggregateOutputType | null
    _min: SpellReleasesMinAggregateOutputType | null
    _max: SpellReleasesMaxAggregateOutputType | null
  }

  type GetSpellReleasesGroupByPayload<T extends spellReleasesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpellReleasesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpellReleasesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpellReleasesGroupByOutputType[P]>
            : GetScalarType<T[P], SpellReleasesGroupByOutputType[P]>
        }
      >
    >


  export type spellReleasesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    description?: boolean
    agentId?: boolean
    spellId?: boolean
    projectId?: boolean
    createdAt?: boolean
    agents_agents_currentSpellReleaseIdTospellReleases?: boolean | spellReleases$agents_agents_currentSpellReleaseIdTospellReleasesArgs<ExtArgs>
    agents_spellReleases_agentIdToagents?: boolean | agentsDefaultArgs<ExtArgs>
    spells?: boolean | spellReleases$spellsArgs<ExtArgs>
    _count?: boolean | SpellReleasesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spellReleases"]>

  export type spellReleasesSelectScalar = {
    id?: boolean
    description?: boolean
    agentId?: boolean
    spellId?: boolean
    projectId?: boolean
    createdAt?: boolean
  }

  export type spellReleasesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agents_agents_currentSpellReleaseIdTospellReleases?: boolean | spellReleases$agents_agents_currentSpellReleaseIdTospellReleasesArgs<ExtArgs>
    agents_spellReleases_agentIdToagents?: boolean | agentsDefaultArgs<ExtArgs>
    spells?: boolean | spellReleases$spellsArgs<ExtArgs>
    _count?: boolean | SpellReleasesCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $spellReleasesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "spellReleases"
    objects: {
      agents_agents_currentSpellReleaseIdTospellReleases: Prisma.$agentsPayload<ExtArgs>[]
      agents_spellReleases_agentIdToagents: Prisma.$agentsPayload<ExtArgs>
      spells: Prisma.$spellsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      description: string | null
      agentId: string
      spellId: string | null
      projectId: string | null
      createdAt: Date | null
    }, ExtArgs["result"]["spellReleases"]>
    composites: {}
  }


  type spellReleasesGetPayload<S extends boolean | null | undefined | spellReleasesDefaultArgs> = $Result.GetResult<Prisma.$spellReleasesPayload, S>

  type spellReleasesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<spellReleasesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SpellReleasesCountAggregateInputType | true
    }

  export interface spellReleasesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['spellReleases'], meta: { name: 'spellReleases' } }
    /**
     * Find zero or one SpellReleases that matches the filter.
     * @param {spellReleasesFindUniqueArgs} args - Arguments to find a SpellReleases
     * @example
     * // Get one SpellReleases
     * const spellReleases = await prisma.spellReleases.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends spellReleasesFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, spellReleasesFindUniqueArgs<ExtArgs>>
    ): Prisma__spellReleasesClient<$Result.GetResult<Prisma.$spellReleasesPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one SpellReleases that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {spellReleasesFindUniqueOrThrowArgs} args - Arguments to find a SpellReleases
     * @example
     * // Get one SpellReleases
     * const spellReleases = await prisma.spellReleases.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends spellReleasesFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, spellReleasesFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__spellReleasesClient<$Result.GetResult<Prisma.$spellReleasesPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first SpellReleases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {spellReleasesFindFirstArgs} args - Arguments to find a SpellReleases
     * @example
     * // Get one SpellReleases
     * const spellReleases = await prisma.spellReleases.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends spellReleasesFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, spellReleasesFindFirstArgs<ExtArgs>>
    ): Prisma__spellReleasesClient<$Result.GetResult<Prisma.$spellReleasesPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first SpellReleases that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {spellReleasesFindFirstOrThrowArgs} args - Arguments to find a SpellReleases
     * @example
     * // Get one SpellReleases
     * const spellReleases = await prisma.spellReleases.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends spellReleasesFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, spellReleasesFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__spellReleasesClient<$Result.GetResult<Prisma.$spellReleasesPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more SpellReleases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {spellReleasesFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SpellReleases
     * const spellReleases = await prisma.spellReleases.findMany()
     * 
     * // Get first 10 SpellReleases
     * const spellReleases = await prisma.spellReleases.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const spellReleasesWithIdOnly = await prisma.spellReleases.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends spellReleasesFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, spellReleasesFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$spellReleasesPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a SpellReleases.
     * @param {spellReleasesCreateArgs} args - Arguments to create a SpellReleases.
     * @example
     * // Create one SpellReleases
     * const SpellReleases = await prisma.spellReleases.create({
     *   data: {
     *     // ... data to create a SpellReleases
     *   }
     * })
     * 
    **/
    create<T extends spellReleasesCreateArgs<ExtArgs>>(
      args: SelectSubset<T, spellReleasesCreateArgs<ExtArgs>>
    ): Prisma__spellReleasesClient<$Result.GetResult<Prisma.$spellReleasesPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many SpellReleases.
     *     @param {spellReleasesCreateManyArgs} args - Arguments to create many SpellReleases.
     *     @example
     *     // Create many SpellReleases
     *     const spellReleases = await prisma.spellReleases.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends spellReleasesCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, spellReleasesCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SpellReleases.
     * @param {spellReleasesDeleteArgs} args - Arguments to delete one SpellReleases.
     * @example
     * // Delete one SpellReleases
     * const SpellReleases = await prisma.spellReleases.delete({
     *   where: {
     *     // ... filter to delete one SpellReleases
     *   }
     * })
     * 
    **/
    delete<T extends spellReleasesDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, spellReleasesDeleteArgs<ExtArgs>>
    ): Prisma__spellReleasesClient<$Result.GetResult<Prisma.$spellReleasesPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one SpellReleases.
     * @param {spellReleasesUpdateArgs} args - Arguments to update one SpellReleases.
     * @example
     * // Update one SpellReleases
     * const spellReleases = await prisma.spellReleases.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends spellReleasesUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, spellReleasesUpdateArgs<ExtArgs>>
    ): Prisma__spellReleasesClient<$Result.GetResult<Prisma.$spellReleasesPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more SpellReleases.
     * @param {spellReleasesDeleteManyArgs} args - Arguments to filter SpellReleases to delete.
     * @example
     * // Delete a few SpellReleases
     * const { count } = await prisma.spellReleases.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends spellReleasesDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, spellReleasesDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpellReleases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {spellReleasesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SpellReleases
     * const spellReleases = await prisma.spellReleases.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends spellReleasesUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, spellReleasesUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SpellReleases.
     * @param {spellReleasesUpsertArgs} args - Arguments to update or create a SpellReleases.
     * @example
     * // Update or create a SpellReleases
     * const spellReleases = await prisma.spellReleases.upsert({
     *   create: {
     *     // ... data to create a SpellReleases
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SpellReleases we want to update
     *   }
     * })
    **/
    upsert<T extends spellReleasesUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, spellReleasesUpsertArgs<ExtArgs>>
    ): Prisma__spellReleasesClient<$Result.GetResult<Prisma.$spellReleasesPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of SpellReleases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {spellReleasesCountArgs} args - Arguments to filter SpellReleases to count.
     * @example
     * // Count the number of SpellReleases
     * const count = await prisma.spellReleases.count({
     *   where: {
     *     // ... the filter for the SpellReleases we want to count
     *   }
     * })
    **/
    count<T extends spellReleasesCountArgs>(
      args?: Subset<T, spellReleasesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpellReleasesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SpellReleases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpellReleasesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpellReleasesAggregateArgs>(args: Subset<T, SpellReleasesAggregateArgs>): Prisma.PrismaPromise<GetSpellReleasesAggregateType<T>>

    /**
     * Group by SpellReleases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {spellReleasesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends spellReleasesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: spellReleasesGroupByArgs['orderBy'] }
        : { orderBy?: spellReleasesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, spellReleasesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpellReleasesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the spellReleases model
   */
  readonly fields: spellReleasesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for spellReleases.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__spellReleasesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    agents_agents_currentSpellReleaseIdTospellReleases<T extends spellReleases$agents_agents_currentSpellReleaseIdTospellReleasesArgs<ExtArgs> = {}>(args?: Subset<T, spellReleases$agents_agents_currentSpellReleaseIdTospellReleasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'findMany'> | Null>;

    agents_spellReleases_agentIdToagents<T extends agentsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, agentsDefaultArgs<ExtArgs>>): Prisma__agentsClient<$Result.GetResult<Prisma.$agentsPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    spells<T extends spellReleases$spellsArgs<ExtArgs> = {}>(args?: Subset<T, spellReleases$spellsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$spellsPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the spellReleases model
   */ 
  interface spellReleasesFieldRefs {
    readonly id: FieldRef<"spellReleases", 'String'>
    readonly description: FieldRef<"spellReleases", 'String'>
    readonly agentId: FieldRef<"spellReleases", 'String'>
    readonly spellId: FieldRef<"spellReleases", 'String'>
    readonly projectId: FieldRef<"spellReleases", 'String'>
    readonly createdAt: FieldRef<"spellReleases", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * spellReleases findUnique
   */
  export type spellReleasesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spellReleases
     */
    select?: spellReleasesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellReleasesInclude<ExtArgs> | null
    /**
     * Filter, which spellReleases to fetch.
     */
    where: spellReleasesWhereUniqueInput
  }


  /**
   * spellReleases findUniqueOrThrow
   */
  export type spellReleasesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spellReleases
     */
    select?: spellReleasesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellReleasesInclude<ExtArgs> | null
    /**
     * Filter, which spellReleases to fetch.
     */
    where: spellReleasesWhereUniqueInput
  }


  /**
   * spellReleases findFirst
   */
  export type spellReleasesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spellReleases
     */
    select?: spellReleasesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellReleasesInclude<ExtArgs> | null
    /**
     * Filter, which spellReleases to fetch.
     */
    where?: spellReleasesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of spellReleases to fetch.
     */
    orderBy?: spellReleasesOrderByWithRelationAndSearchRelevanceInput | spellReleasesOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for spellReleases.
     */
    cursor?: spellReleasesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` spellReleases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` spellReleases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of spellReleases.
     */
    distinct?: SpellReleasesScalarFieldEnum | SpellReleasesScalarFieldEnum[]
  }


  /**
   * spellReleases findFirstOrThrow
   */
  export type spellReleasesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spellReleases
     */
    select?: spellReleasesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellReleasesInclude<ExtArgs> | null
    /**
     * Filter, which spellReleases to fetch.
     */
    where?: spellReleasesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of spellReleases to fetch.
     */
    orderBy?: spellReleasesOrderByWithRelationAndSearchRelevanceInput | spellReleasesOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for spellReleases.
     */
    cursor?: spellReleasesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` spellReleases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` spellReleases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of spellReleases.
     */
    distinct?: SpellReleasesScalarFieldEnum | SpellReleasesScalarFieldEnum[]
  }


  /**
   * spellReleases findMany
   */
  export type spellReleasesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spellReleases
     */
    select?: spellReleasesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellReleasesInclude<ExtArgs> | null
    /**
     * Filter, which spellReleases to fetch.
     */
    where?: spellReleasesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of spellReleases to fetch.
     */
    orderBy?: spellReleasesOrderByWithRelationAndSearchRelevanceInput | spellReleasesOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing spellReleases.
     */
    cursor?: spellReleasesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` spellReleases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` spellReleases.
     */
    skip?: number
    distinct?: SpellReleasesScalarFieldEnum | SpellReleasesScalarFieldEnum[]
  }


  /**
   * spellReleases create
   */
  export type spellReleasesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spellReleases
     */
    select?: spellReleasesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellReleasesInclude<ExtArgs> | null
    /**
     * The data needed to create a spellReleases.
     */
    data: XOR<spellReleasesCreateInput, spellReleasesUncheckedCreateInput>
  }


  /**
   * spellReleases createMany
   */
  export type spellReleasesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many spellReleases.
     */
    data: spellReleasesCreateManyInput | spellReleasesCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * spellReleases update
   */
  export type spellReleasesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spellReleases
     */
    select?: spellReleasesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellReleasesInclude<ExtArgs> | null
    /**
     * The data needed to update a spellReleases.
     */
    data: XOR<spellReleasesUpdateInput, spellReleasesUncheckedUpdateInput>
    /**
     * Choose, which spellReleases to update.
     */
    where: spellReleasesWhereUniqueInput
  }


  /**
   * spellReleases updateMany
   */
  export type spellReleasesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update spellReleases.
     */
    data: XOR<spellReleasesUpdateManyMutationInput, spellReleasesUncheckedUpdateManyInput>
    /**
     * Filter which spellReleases to update
     */
    where?: spellReleasesWhereInput
  }


  /**
   * spellReleases upsert
   */
  export type spellReleasesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spellReleases
     */
    select?: spellReleasesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellReleasesInclude<ExtArgs> | null
    /**
     * The filter to search for the spellReleases to update in case it exists.
     */
    where: spellReleasesWhereUniqueInput
    /**
     * In case the spellReleases found by the `where` argument doesn't exist, create a new spellReleases with this data.
     */
    create: XOR<spellReleasesCreateInput, spellReleasesUncheckedCreateInput>
    /**
     * In case the spellReleases was found with the provided `where` argument, update it with this data.
     */
    update: XOR<spellReleasesUpdateInput, spellReleasesUncheckedUpdateInput>
  }


  /**
   * spellReleases delete
   */
  export type spellReleasesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spellReleases
     */
    select?: spellReleasesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellReleasesInclude<ExtArgs> | null
    /**
     * Filter which spellReleases to delete.
     */
    where: spellReleasesWhereUniqueInput
  }


  /**
   * spellReleases deleteMany
   */
  export type spellReleasesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which spellReleases to delete
     */
    where?: spellReleasesWhereInput
  }


  /**
   * spellReleases.agents_agents_currentSpellReleaseIdTospellReleases
   */
  export type spellReleases$agents_agents_currentSpellReleaseIdTospellReleasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agents
     */
    select?: agentsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: agentsInclude<ExtArgs> | null
    where?: agentsWhereInput
    orderBy?: agentsOrderByWithRelationAndSearchRelevanceInput | agentsOrderByWithRelationAndSearchRelevanceInput[]
    cursor?: agentsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgentsScalarFieldEnum | AgentsScalarFieldEnum[]
  }


  /**
   * spellReleases.spells
   */
  export type spellReleases$spellsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spells
     */
    select?: spellsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellsInclude<ExtArgs> | null
    where?: spellsWhereInput
    orderBy?: spellsOrderByWithRelationAndSearchRelevanceInput | spellsOrderByWithRelationAndSearchRelevanceInput[]
    cursor?: spellsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpellsScalarFieldEnum | SpellsScalarFieldEnum[]
  }


  /**
   * spellReleases without action
   */
  export type spellReleasesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spellReleases
     */
    select?: spellReleasesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellReleasesInclude<ExtArgs> | null
  }



  /**
   * Model spells
   */

  export type AggregateSpells = {
    _count: SpellsCountAggregateOutputType | null
    _min: SpellsMinAggregateOutputType | null
    _max: SpellsMaxAggregateOutputType | null
  }

  export type SpellsMinAggregateOutputType = {
    id: string | null
    name: string | null
    projectId: string | null
    createdAt: string | null
    updatedAt: string | null
    type: string | null
    spellReleaseId: string | null
  }

  export type SpellsMaxAggregateOutputType = {
    id: string | null
    name: string | null
    projectId: string | null
    createdAt: string | null
    updatedAt: string | null
    type: string | null
    spellReleaseId: string | null
  }

  export type SpellsCountAggregateOutputType = {
    id: number
    name: number
    projectId: number
    graph: number
    createdAt: number
    updatedAt: number
    type: number
    spellReleaseId: number
    _all: number
  }


  export type SpellsMinAggregateInputType = {
    id?: true
    name?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
    type?: true
    spellReleaseId?: true
  }

  export type SpellsMaxAggregateInputType = {
    id?: true
    name?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
    type?: true
    spellReleaseId?: true
  }

  export type SpellsCountAggregateInputType = {
    id?: true
    name?: true
    projectId?: true
    graph?: true
    createdAt?: true
    updatedAt?: true
    type?: true
    spellReleaseId?: true
    _all?: true
  }

  export type SpellsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which spells to aggregate.
     */
    where?: spellsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of spells to fetch.
     */
    orderBy?: spellsOrderByWithRelationAndSearchRelevanceInput | spellsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: spellsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` spells from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` spells.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned spells
    **/
    _count?: true | SpellsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpellsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpellsMaxAggregateInputType
  }

  export type GetSpellsAggregateType<T extends SpellsAggregateArgs> = {
        [P in keyof T & keyof AggregateSpells]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpells[P]>
      : GetScalarType<T[P], AggregateSpells[P]>
  }




  export type spellsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: spellsWhereInput
    orderBy?: spellsOrderByWithAggregationInput | spellsOrderByWithAggregationInput[]
    by: SpellsScalarFieldEnum[] | SpellsScalarFieldEnum
    having?: spellsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpellsCountAggregateInputType | true
    _min?: SpellsMinAggregateInputType
    _max?: SpellsMaxAggregateInputType
  }

  export type SpellsGroupByOutputType = {
    id: string
    name: string | null
    projectId: string | null
    graph: JsonValue | null
    createdAt: string | null
    updatedAt: string | null
    type: string | null
    spellReleaseId: string | null
    _count: SpellsCountAggregateOutputType | null
    _min: SpellsMinAggregateOutputType | null
    _max: SpellsMaxAggregateOutputType | null
  }

  type GetSpellsGroupByPayload<T extends spellsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpellsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpellsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpellsGroupByOutputType[P]>
            : GetScalarType<T[P], SpellsGroupByOutputType[P]>
        }
      >
    >


  export type spellsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    projectId?: boolean
    graph?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    type?: boolean
    spellReleaseId?: boolean
    spellReleases?: boolean | spells$spellReleasesArgs<ExtArgs>
  }, ExtArgs["result"]["spells"]>

  export type spellsSelectScalar = {
    id?: boolean
    name?: boolean
    projectId?: boolean
    graph?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    type?: boolean
    spellReleaseId?: boolean
  }

  export type spellsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    spellReleases?: boolean | spells$spellReleasesArgs<ExtArgs>
  }


  export type $spellsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "spells"
    objects: {
      spellReleases: Prisma.$spellReleasesPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      projectId: string | null
      graph: Prisma.JsonValue | null
      createdAt: string | null
      updatedAt: string | null
      type: string | null
      spellReleaseId: string | null
    }, ExtArgs["result"]["spells"]>
    composites: {}
  }


  type spellsGetPayload<S extends boolean | null | undefined | spellsDefaultArgs> = $Result.GetResult<Prisma.$spellsPayload, S>

  type spellsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<spellsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SpellsCountAggregateInputType | true
    }

  export interface spellsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['spells'], meta: { name: 'spells' } }
    /**
     * Find zero or one Spells that matches the filter.
     * @param {spellsFindUniqueArgs} args - Arguments to find a Spells
     * @example
     * // Get one Spells
     * const spells = await prisma.spells.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends spellsFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, spellsFindUniqueArgs<ExtArgs>>
    ): Prisma__spellsClient<$Result.GetResult<Prisma.$spellsPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Spells that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {spellsFindUniqueOrThrowArgs} args - Arguments to find a Spells
     * @example
     * // Get one Spells
     * const spells = await prisma.spells.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends spellsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, spellsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__spellsClient<$Result.GetResult<Prisma.$spellsPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Spells that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {spellsFindFirstArgs} args - Arguments to find a Spells
     * @example
     * // Get one Spells
     * const spells = await prisma.spells.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends spellsFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, spellsFindFirstArgs<ExtArgs>>
    ): Prisma__spellsClient<$Result.GetResult<Prisma.$spellsPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Spells that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {spellsFindFirstOrThrowArgs} args - Arguments to find a Spells
     * @example
     * // Get one Spells
     * const spells = await prisma.spells.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends spellsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, spellsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__spellsClient<$Result.GetResult<Prisma.$spellsPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Spells that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {spellsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Spells
     * const spells = await prisma.spells.findMany()
     * 
     * // Get first 10 Spells
     * const spells = await prisma.spells.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const spellsWithIdOnly = await prisma.spells.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends spellsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, spellsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$spellsPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Spells.
     * @param {spellsCreateArgs} args - Arguments to create a Spells.
     * @example
     * // Create one Spells
     * const Spells = await prisma.spells.create({
     *   data: {
     *     // ... data to create a Spells
     *   }
     * })
     * 
    **/
    create<T extends spellsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, spellsCreateArgs<ExtArgs>>
    ): Prisma__spellsClient<$Result.GetResult<Prisma.$spellsPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Spells.
     *     @param {spellsCreateManyArgs} args - Arguments to create many Spells.
     *     @example
     *     // Create many Spells
     *     const spells = await prisma.spells.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends spellsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, spellsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Spells.
     * @param {spellsDeleteArgs} args - Arguments to delete one Spells.
     * @example
     * // Delete one Spells
     * const Spells = await prisma.spells.delete({
     *   where: {
     *     // ... filter to delete one Spells
     *   }
     * })
     * 
    **/
    delete<T extends spellsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, spellsDeleteArgs<ExtArgs>>
    ): Prisma__spellsClient<$Result.GetResult<Prisma.$spellsPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Spells.
     * @param {spellsUpdateArgs} args - Arguments to update one Spells.
     * @example
     * // Update one Spells
     * const spells = await prisma.spells.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends spellsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, spellsUpdateArgs<ExtArgs>>
    ): Prisma__spellsClient<$Result.GetResult<Prisma.$spellsPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Spells.
     * @param {spellsDeleteManyArgs} args - Arguments to filter Spells to delete.
     * @example
     * // Delete a few Spells
     * const { count } = await prisma.spells.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends spellsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, spellsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Spells.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {spellsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Spells
     * const spells = await prisma.spells.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends spellsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, spellsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Spells.
     * @param {spellsUpsertArgs} args - Arguments to update or create a Spells.
     * @example
     * // Update or create a Spells
     * const spells = await prisma.spells.upsert({
     *   create: {
     *     // ... data to create a Spells
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Spells we want to update
     *   }
     * })
    **/
    upsert<T extends spellsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, spellsUpsertArgs<ExtArgs>>
    ): Prisma__spellsClient<$Result.GetResult<Prisma.$spellsPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Spells.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {spellsCountArgs} args - Arguments to filter Spells to count.
     * @example
     * // Count the number of Spells
     * const count = await prisma.spells.count({
     *   where: {
     *     // ... the filter for the Spells we want to count
     *   }
     * })
    **/
    count<T extends spellsCountArgs>(
      args?: Subset<T, spellsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpellsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Spells.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpellsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpellsAggregateArgs>(args: Subset<T, SpellsAggregateArgs>): Prisma.PrismaPromise<GetSpellsAggregateType<T>>

    /**
     * Group by Spells.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {spellsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends spellsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: spellsGroupByArgs['orderBy'] }
        : { orderBy?: spellsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, spellsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpellsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the spells model
   */
  readonly fields: spellsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for spells.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__spellsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    spellReleases<T extends spells$spellReleasesArgs<ExtArgs> = {}>(args?: Subset<T, spells$spellReleasesArgs<ExtArgs>>): Prisma__spellReleasesClient<$Result.GetResult<Prisma.$spellReleasesPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the spells model
   */ 
  interface spellsFieldRefs {
    readonly id: FieldRef<"spells", 'String'>
    readonly name: FieldRef<"spells", 'String'>
    readonly projectId: FieldRef<"spells", 'String'>
    readonly graph: FieldRef<"spells", 'Json'>
    readonly createdAt: FieldRef<"spells", 'String'>
    readonly updatedAt: FieldRef<"spells", 'String'>
    readonly type: FieldRef<"spells", 'String'>
    readonly spellReleaseId: FieldRef<"spells", 'String'>
  }
    

  // Custom InputTypes

  /**
   * spells findUnique
   */
  export type spellsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spells
     */
    select?: spellsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellsInclude<ExtArgs> | null
    /**
     * Filter, which spells to fetch.
     */
    where: spellsWhereUniqueInput
  }


  /**
   * spells findUniqueOrThrow
   */
  export type spellsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spells
     */
    select?: spellsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellsInclude<ExtArgs> | null
    /**
     * Filter, which spells to fetch.
     */
    where: spellsWhereUniqueInput
  }


  /**
   * spells findFirst
   */
  export type spellsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spells
     */
    select?: spellsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellsInclude<ExtArgs> | null
    /**
     * Filter, which spells to fetch.
     */
    where?: spellsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of spells to fetch.
     */
    orderBy?: spellsOrderByWithRelationAndSearchRelevanceInput | spellsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for spells.
     */
    cursor?: spellsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` spells from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` spells.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of spells.
     */
    distinct?: SpellsScalarFieldEnum | SpellsScalarFieldEnum[]
  }


  /**
   * spells findFirstOrThrow
   */
  export type spellsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spells
     */
    select?: spellsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellsInclude<ExtArgs> | null
    /**
     * Filter, which spells to fetch.
     */
    where?: spellsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of spells to fetch.
     */
    orderBy?: spellsOrderByWithRelationAndSearchRelevanceInput | spellsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for spells.
     */
    cursor?: spellsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` spells from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` spells.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of spells.
     */
    distinct?: SpellsScalarFieldEnum | SpellsScalarFieldEnum[]
  }


  /**
   * spells findMany
   */
  export type spellsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spells
     */
    select?: spellsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellsInclude<ExtArgs> | null
    /**
     * Filter, which spells to fetch.
     */
    where?: spellsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of spells to fetch.
     */
    orderBy?: spellsOrderByWithRelationAndSearchRelevanceInput | spellsOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing spells.
     */
    cursor?: spellsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` spells from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` spells.
     */
    skip?: number
    distinct?: SpellsScalarFieldEnum | SpellsScalarFieldEnum[]
  }


  /**
   * spells create
   */
  export type spellsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spells
     */
    select?: spellsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellsInclude<ExtArgs> | null
    /**
     * The data needed to create a spells.
     */
    data: XOR<spellsCreateInput, spellsUncheckedCreateInput>
  }


  /**
   * spells createMany
   */
  export type spellsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many spells.
     */
    data: spellsCreateManyInput | spellsCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * spells update
   */
  export type spellsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spells
     */
    select?: spellsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellsInclude<ExtArgs> | null
    /**
     * The data needed to update a spells.
     */
    data: XOR<spellsUpdateInput, spellsUncheckedUpdateInput>
    /**
     * Choose, which spells to update.
     */
    where: spellsWhereUniqueInput
  }


  /**
   * spells updateMany
   */
  export type spellsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update spells.
     */
    data: XOR<spellsUpdateManyMutationInput, spellsUncheckedUpdateManyInput>
    /**
     * Filter which spells to update
     */
    where?: spellsWhereInput
  }


  /**
   * spells upsert
   */
  export type spellsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spells
     */
    select?: spellsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellsInclude<ExtArgs> | null
    /**
     * The filter to search for the spells to update in case it exists.
     */
    where: spellsWhereUniqueInput
    /**
     * In case the spells found by the `where` argument doesn't exist, create a new spells with this data.
     */
    create: XOR<spellsCreateInput, spellsUncheckedCreateInput>
    /**
     * In case the spells was found with the provided `where` argument, update it with this data.
     */
    update: XOR<spellsUpdateInput, spellsUncheckedUpdateInput>
  }


  /**
   * spells delete
   */
  export type spellsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spells
     */
    select?: spellsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellsInclude<ExtArgs> | null
    /**
     * Filter which spells to delete.
     */
    where: spellsWhereUniqueInput
  }


  /**
   * spells deleteMany
   */
  export type spellsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which spells to delete
     */
    where?: spellsWhereInput
  }


  /**
   * spells.spellReleases
   */
  export type spells$spellReleasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spellReleases
     */
    select?: spellReleasesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellReleasesInclude<ExtArgs> | null
    where?: spellReleasesWhereInput
  }


  /**
   * spells without action
   */
  export type spellsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the spells
     */
    select?: spellsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: spellsInclude<ExtArgs> | null
  }



  /**
   * Model tasks
   */

  export type AggregateTasks = {
    _count: TasksCountAggregateOutputType | null
    _avg: TasksAvgAggregateOutputType | null
    _sum: TasksSumAggregateOutputType | null
    _min: TasksMinAggregateOutputType | null
    _max: TasksMaxAggregateOutputType | null
  }

  export type TasksAvgAggregateOutputType = {
    id: number | null
  }

  export type TasksSumAggregateOutputType = {
    id: number | null
  }

  export type TasksMinAggregateOutputType = {
    id: number | null
    status: string | null
    type: string | null
    objective: string | null
    projectId: string | null
    date: string | null
    steps: string | null
    agentId: string | null
  }

  export type TasksMaxAggregateOutputType = {
    id: number | null
    status: string | null
    type: string | null
    objective: string | null
    projectId: string | null
    date: string | null
    steps: string | null
    agentId: string | null
  }

  export type TasksCountAggregateOutputType = {
    id: number
    status: number
    type: number
    objective: number
    eventData: number
    projectId: number
    date: number
    steps: number
    agentId: number
    _all: number
  }


  export type TasksAvgAggregateInputType = {
    id?: true
  }

  export type TasksSumAggregateInputType = {
    id?: true
  }

  export type TasksMinAggregateInputType = {
    id?: true
    status?: true
    type?: true
    objective?: true
    projectId?: true
    date?: true
    steps?: true
    agentId?: true
  }

  export type TasksMaxAggregateInputType = {
    id?: true
    status?: true
    type?: true
    objective?: true
    projectId?: true
    date?: true
    steps?: true
    agentId?: true
  }

  export type TasksCountAggregateInputType = {
    id?: true
    status?: true
    type?: true
    objective?: true
    eventData?: true
    projectId?: true
    date?: true
    steps?: true
    agentId?: true
    _all?: true
  }

  export type TasksAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tasks to aggregate.
     */
    where?: tasksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tasks to fetch.
     */
    orderBy?: tasksOrderByWithRelationAndSearchRelevanceInput | tasksOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tasksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tasks
    **/
    _count?: true | TasksCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TasksAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TasksSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TasksMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TasksMaxAggregateInputType
  }

  export type GetTasksAggregateType<T extends TasksAggregateArgs> = {
        [P in keyof T & keyof AggregateTasks]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTasks[P]>
      : GetScalarType<T[P], AggregateTasks[P]>
  }




  export type tasksGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tasksWhereInput
    orderBy?: tasksOrderByWithAggregationInput | tasksOrderByWithAggregationInput[]
    by: TasksScalarFieldEnum[] | TasksScalarFieldEnum
    having?: tasksScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TasksCountAggregateInputType | true
    _avg?: TasksAvgAggregateInputType
    _sum?: TasksSumAggregateInputType
    _min?: TasksMinAggregateInputType
    _max?: TasksMaxAggregateInputType
  }

  export type TasksGroupByOutputType = {
    id: number
    status: string
    type: string
    objective: string
    eventData: JsonValue
    projectId: string
    date: string | null
    steps: string
    agentId: string | null
    _count: TasksCountAggregateOutputType | null
    _avg: TasksAvgAggregateOutputType | null
    _sum: TasksSumAggregateOutputType | null
    _min: TasksMinAggregateOutputType | null
    _max: TasksMaxAggregateOutputType | null
  }

  type GetTasksGroupByPayload<T extends tasksGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TasksGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TasksGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TasksGroupByOutputType[P]>
            : GetScalarType<T[P], TasksGroupByOutputType[P]>
        }
      >
    >


  export type tasksSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    type?: boolean
    objective?: boolean
    eventData?: boolean
    projectId?: boolean
    date?: boolean
    steps?: boolean
    agentId?: boolean
  }, ExtArgs["result"]["tasks"]>

  export type tasksSelectScalar = {
    id?: boolean
    status?: boolean
    type?: boolean
    objective?: boolean
    eventData?: boolean
    projectId?: boolean
    date?: boolean
    steps?: boolean
    agentId?: boolean
  }


  export type $tasksPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tasks"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      status: string
      type: string
      objective: string
      eventData: Prisma.JsonValue
      projectId: string
      date: string | null
      steps: string
      agentId: string | null
    }, ExtArgs["result"]["tasks"]>
    composites: {}
  }


  type tasksGetPayload<S extends boolean | null | undefined | tasksDefaultArgs> = $Result.GetResult<Prisma.$tasksPayload, S>

  type tasksCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<tasksFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TasksCountAggregateInputType | true
    }

  export interface tasksDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tasks'], meta: { name: 'tasks' } }
    /**
     * Find zero or one Tasks that matches the filter.
     * @param {tasksFindUniqueArgs} args - Arguments to find a Tasks
     * @example
     * // Get one Tasks
     * const tasks = await prisma.tasks.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends tasksFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, tasksFindUniqueArgs<ExtArgs>>
    ): Prisma__tasksClient<$Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Tasks that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {tasksFindUniqueOrThrowArgs} args - Arguments to find a Tasks
     * @example
     * // Get one Tasks
     * const tasks = await prisma.tasks.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends tasksFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, tasksFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__tasksClient<$Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tasksFindFirstArgs} args - Arguments to find a Tasks
     * @example
     * // Get one Tasks
     * const tasks = await prisma.tasks.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends tasksFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, tasksFindFirstArgs<ExtArgs>>
    ): Prisma__tasksClient<$Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Tasks that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tasksFindFirstOrThrowArgs} args - Arguments to find a Tasks
     * @example
     * // Get one Tasks
     * const tasks = await prisma.tasks.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends tasksFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, tasksFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__tasksClient<$Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tasksFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.tasks.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.tasks.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tasksWithIdOnly = await prisma.tasks.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends tasksFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, tasksFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Tasks.
     * @param {tasksCreateArgs} args - Arguments to create a Tasks.
     * @example
     * // Create one Tasks
     * const Tasks = await prisma.tasks.create({
     *   data: {
     *     // ... data to create a Tasks
     *   }
     * })
     * 
    **/
    create<T extends tasksCreateArgs<ExtArgs>>(
      args: SelectSubset<T, tasksCreateArgs<ExtArgs>>
    ): Prisma__tasksClient<$Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Tasks.
     *     @param {tasksCreateManyArgs} args - Arguments to create many Tasks.
     *     @example
     *     // Create many Tasks
     *     const tasks = await prisma.tasks.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends tasksCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, tasksCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Tasks.
     * @param {tasksDeleteArgs} args - Arguments to delete one Tasks.
     * @example
     * // Delete one Tasks
     * const Tasks = await prisma.tasks.delete({
     *   where: {
     *     // ... filter to delete one Tasks
     *   }
     * })
     * 
    **/
    delete<T extends tasksDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, tasksDeleteArgs<ExtArgs>>
    ): Prisma__tasksClient<$Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Tasks.
     * @param {tasksUpdateArgs} args - Arguments to update one Tasks.
     * @example
     * // Update one Tasks
     * const tasks = await prisma.tasks.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends tasksUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, tasksUpdateArgs<ExtArgs>>
    ): Prisma__tasksClient<$Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Tasks.
     * @param {tasksDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.tasks.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends tasksDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, tasksDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tasksUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const tasks = await prisma.tasks.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends tasksUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, tasksUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Tasks.
     * @param {tasksUpsertArgs} args - Arguments to update or create a Tasks.
     * @example
     * // Update or create a Tasks
     * const tasks = await prisma.tasks.upsert({
     *   create: {
     *     // ... data to create a Tasks
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tasks we want to update
     *   }
     * })
    **/
    upsert<T extends tasksUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, tasksUpsertArgs<ExtArgs>>
    ): Prisma__tasksClient<$Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tasksCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.tasks.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends tasksCountArgs>(
      args?: Subset<T, tasksCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TasksCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TasksAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TasksAggregateArgs>(args: Subset<T, TasksAggregateArgs>): Prisma.PrismaPromise<GetTasksAggregateType<T>>

    /**
     * Group by Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tasksGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tasksGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tasksGroupByArgs['orderBy'] }
        : { orderBy?: tasksGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tasksGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTasksGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tasks model
   */
  readonly fields: tasksFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tasks.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tasksClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the tasks model
   */ 
  interface tasksFieldRefs {
    readonly id: FieldRef<"tasks", 'Int'>
    readonly status: FieldRef<"tasks", 'String'>
    readonly type: FieldRef<"tasks", 'String'>
    readonly objective: FieldRef<"tasks", 'String'>
    readonly eventData: FieldRef<"tasks", 'Json'>
    readonly projectId: FieldRef<"tasks", 'String'>
    readonly date: FieldRef<"tasks", 'String'>
    readonly steps: FieldRef<"tasks", 'String'>
    readonly agentId: FieldRef<"tasks", 'String'>
  }
    

  // Custom InputTypes

  /**
   * tasks findUnique
   */
  export type tasksFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tasks
     */
    select?: tasksSelect<ExtArgs> | null
    /**
     * Filter, which tasks to fetch.
     */
    where: tasksWhereUniqueInput
  }


  /**
   * tasks findUniqueOrThrow
   */
  export type tasksFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tasks
     */
    select?: tasksSelect<ExtArgs> | null
    /**
     * Filter, which tasks to fetch.
     */
    where: tasksWhereUniqueInput
  }


  /**
   * tasks findFirst
   */
  export type tasksFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tasks
     */
    select?: tasksSelect<ExtArgs> | null
    /**
     * Filter, which tasks to fetch.
     */
    where?: tasksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tasks to fetch.
     */
    orderBy?: tasksOrderByWithRelationAndSearchRelevanceInput | tasksOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tasks.
     */
    cursor?: tasksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tasks.
     */
    distinct?: TasksScalarFieldEnum | TasksScalarFieldEnum[]
  }


  /**
   * tasks findFirstOrThrow
   */
  export type tasksFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tasks
     */
    select?: tasksSelect<ExtArgs> | null
    /**
     * Filter, which tasks to fetch.
     */
    where?: tasksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tasks to fetch.
     */
    orderBy?: tasksOrderByWithRelationAndSearchRelevanceInput | tasksOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tasks.
     */
    cursor?: tasksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tasks.
     */
    distinct?: TasksScalarFieldEnum | TasksScalarFieldEnum[]
  }


  /**
   * tasks findMany
   */
  export type tasksFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tasks
     */
    select?: tasksSelect<ExtArgs> | null
    /**
     * Filter, which tasks to fetch.
     */
    where?: tasksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tasks to fetch.
     */
    orderBy?: tasksOrderByWithRelationAndSearchRelevanceInput | tasksOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tasks.
     */
    cursor?: tasksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tasks.
     */
    skip?: number
    distinct?: TasksScalarFieldEnum | TasksScalarFieldEnum[]
  }


  /**
   * tasks create
   */
  export type tasksCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tasks
     */
    select?: tasksSelect<ExtArgs> | null
    /**
     * The data needed to create a tasks.
     */
    data: XOR<tasksCreateInput, tasksUncheckedCreateInput>
  }


  /**
   * tasks createMany
   */
  export type tasksCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tasks.
     */
    data: tasksCreateManyInput | tasksCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * tasks update
   */
  export type tasksUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tasks
     */
    select?: tasksSelect<ExtArgs> | null
    /**
     * The data needed to update a tasks.
     */
    data: XOR<tasksUpdateInput, tasksUncheckedUpdateInput>
    /**
     * Choose, which tasks to update.
     */
    where: tasksWhereUniqueInput
  }


  /**
   * tasks updateMany
   */
  export type tasksUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tasks.
     */
    data: XOR<tasksUpdateManyMutationInput, tasksUncheckedUpdateManyInput>
    /**
     * Filter which tasks to update
     */
    where?: tasksWhereInput
  }


  /**
   * tasks upsert
   */
  export type tasksUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tasks
     */
    select?: tasksSelect<ExtArgs> | null
    /**
     * The filter to search for the tasks to update in case it exists.
     */
    where: tasksWhereUniqueInput
    /**
     * In case the tasks found by the `where` argument doesn't exist, create a new tasks with this data.
     */
    create: XOR<tasksCreateInput, tasksUncheckedCreateInput>
    /**
     * In case the tasks was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tasksUpdateInput, tasksUncheckedUpdateInput>
  }


  /**
   * tasks delete
   */
  export type tasksDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tasks
     */
    select?: tasksSelect<ExtArgs> | null
    /**
     * Filter which tasks to delete.
     */
    where: tasksWhereUniqueInput
  }


  /**
   * tasks deleteMany
   */
  export type tasksDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tasks to delete
     */
    where?: tasksWhereInput
  }


  /**
   * tasks without action
   */
  export type tasksDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tasks
     */
    select?: tasksSelect<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Agent_credentialsScalarFieldEnum: {
    agentId: 'agentId',
    credentialId: 'credentialId',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Agent_credentialsScalarFieldEnum = (typeof Agent_credentialsScalarFieldEnum)[keyof typeof Agent_credentialsScalarFieldEnum]


  export const AgentsScalarFieldEnum: {
    id: 'id',
    rootSpell: 'rootSpell',
    publicVariables: 'publicVariables',
    secrets: 'secrets',
    name: 'name',
    enabled: 'enabled',
    updatedAt: 'updatedAt',
    pingedAt: 'pingedAt',
    projectId: 'projectId',
    data: 'data',
    runState: 'runState',
    image: 'image',
    rootSpellId: 'rootSpellId',
    default: 'default',
    createdAt: 'createdAt',
    currentSpellReleaseId: 'currentSpellReleaseId',
    embedModel: 'embedModel',
    version: 'version',
    embeddingProvider: 'embeddingProvider',
    embeddingModel: 'embeddingModel',
    isDraft: 'isDraft'
  };

  export type AgentsScalarFieldEnum = (typeof AgentsScalarFieldEnum)[keyof typeof AgentsScalarFieldEnum]


  export const ChatMessagesScalarFieldEnum: {
    id: 'id',
    agentId: 'agentId',
    sender: 'sender',
    connector: 'connector',
    content: 'content',
    conversationId: 'conversationId',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ChatMessagesScalarFieldEnum = (typeof ChatMessagesScalarFieldEnum)[keyof typeof ChatMessagesScalarFieldEnum]


  export const CredentialsScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    name: 'name',
    serviceType: 'serviceType',
    credentialType: 'credentialType',
    value: 'value',
    description: 'description',
    metadata: 'metadata',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type CredentialsScalarFieldEnum = (typeof CredentialsScalarFieldEnum)[keyof typeof CredentialsScalarFieldEnum]


  export const DocumentsScalarFieldEnum: {
    id: 'id',
    type: 'type',
    projectId: 'projectId',
    date: 'date',
    metadata: 'metadata'
  };

  export type DocumentsScalarFieldEnum = (typeof DocumentsScalarFieldEnum)[keyof typeof DocumentsScalarFieldEnum]


  export const EmbeddingsScalarFieldEnum: {
    id: 'id',
    documentId: 'documentId',
    content: 'content',
    index: 'index'
  };

  export type EmbeddingsScalarFieldEnum = (typeof EmbeddingsScalarFieldEnum)[keyof typeof EmbeddingsScalarFieldEnum]


  export const Public_eventsScalarFieldEnum: {
    id: 'id',
    type: 'type',
    observer: 'observer',
    sender: 'sender',
    client: 'client',
    channel: 'channel',
    channelType: 'channelType',
    projectId: 'projectId',
    content: 'content',
    agentId: 'agentId',
    entities: 'entities',
    date: 'date',
    rawData: 'rawData',
    connector: 'connector'
  };

  export type Public_eventsScalarFieldEnum = (typeof Public_eventsScalarFieldEnum)[keyof typeof Public_eventsScalarFieldEnum]


  export const GraphEventsScalarFieldEnum: {
    id: 'id',
    agentId: 'agentId',
    sender: 'sender',
    connector: 'connector',
    connectorData: 'connectorData',
    channel: 'channel',
    content: 'content',
    eventType: 'eventType',
    created_at: 'created_at',
    updated_at: 'updated_at',
    event: 'event',
    observer: 'observer'
  };

  export type GraphEventsScalarFieldEnum = (typeof GraphEventsScalarFieldEnum)[keyof typeof GraphEventsScalarFieldEnum]


  export const Public_knex_migrationsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    batch: 'batch',
    migration_time: 'migration_time'
  };

  export type Public_knex_migrationsScalarFieldEnum = (typeof Public_knex_migrationsScalarFieldEnum)[keyof typeof Public_knex_migrationsScalarFieldEnum]


  export const Public_knex_migrations_lockScalarFieldEnum: {
    index: 'index',
    is_locked: 'is_locked'
  };

  export type Public_knex_migrations_lockScalarFieldEnum = (typeof Public_knex_migrations_lockScalarFieldEnum)[keyof typeof Public_knex_migrations_lockScalarFieldEnum]


  export const KnowledgeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    sourceUrl: 'sourceUrl',
    dataType: 'dataType',
    data: 'data',
    projectId: 'projectId',
    metadata: 'metadata',
    memoryId: 'memoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KnowledgeScalarFieldEnum = (typeof KnowledgeScalarFieldEnum)[keyof typeof KnowledgeScalarFieldEnum]


  export const PluginStateScalarFieldEnum: {
    id: 'id',
    agentId: 'agentId',
    state: 'state',
    plugin: 'plugin'
  };

  export type PluginStateScalarFieldEnum = (typeof PluginStateScalarFieldEnum)[keyof typeof PluginStateScalarFieldEnum]


  export const RequestScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    requestData: 'requestData',
    responseData: 'responseData',
    duration: 'duration',
    status: 'status',
    statusCode: 'statusCode',
    model: 'model',
    parameters: 'parameters',
    createdAt: 'createdAt',
    provider: 'provider',
    type: 'type',
    hidden: 'hidden',
    processed: 'processed',
    cost: 'cost',
    spell: 'spell',
    nodeId: 'nodeId',
    agentId: 'agentId'
  };

  export type RequestScalarFieldEnum = (typeof RequestScalarFieldEnum)[keyof typeof RequestScalarFieldEnum]


  export const SpellReleasesScalarFieldEnum: {
    id: 'id',
    description: 'description',
    agentId: 'agentId',
    spellId: 'spellId',
    projectId: 'projectId',
    createdAt: 'createdAt'
  };

  export type SpellReleasesScalarFieldEnum = (typeof SpellReleasesScalarFieldEnum)[keyof typeof SpellReleasesScalarFieldEnum]


  export const SpellsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    projectId: 'projectId',
    graph: 'graph',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    type: 'type',
    spellReleaseId: 'spellReleaseId'
  };

  export type SpellsScalarFieldEnum = (typeof SpellsScalarFieldEnum)[keyof typeof SpellsScalarFieldEnum]


  export const TasksScalarFieldEnum: {
    id: 'id',
    status: 'status',
    type: 'type',
    objective: 'objective',
    eventData: 'eventData',
    projectId: 'projectId',
    date: 'date',
    steps: 'steps',
    agentId: 'agentId'
  };

  export type TasksScalarFieldEnum = (typeof TasksScalarFieldEnum)[keyof typeof TasksScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const agent_credentialsOrderByRelevanceFieldEnum: {
    agentId: 'agentId',
    credentialId: 'credentialId'
  };

  export type agent_credentialsOrderByRelevanceFieldEnum = (typeof agent_credentialsOrderByRelevanceFieldEnum)[keyof typeof agent_credentialsOrderByRelevanceFieldEnum]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const agentsOrderByRelevanceFieldEnum: {
    id: 'id',
    publicVariables: 'publicVariables',
    secrets: 'secrets',
    name: 'name',
    updatedAt: 'updatedAt',
    pingedAt: 'pingedAt',
    projectId: 'projectId',
    runState: 'runState',
    image: 'image',
    rootSpellId: 'rootSpellId',
    currentSpellReleaseId: 'currentSpellReleaseId',
    embedModel: 'embedModel',
    version: 'version',
    embeddingProvider: 'embeddingProvider',
    embeddingModel: 'embeddingModel'
  };

  export type agentsOrderByRelevanceFieldEnum = (typeof agentsOrderByRelevanceFieldEnum)[keyof typeof agentsOrderByRelevanceFieldEnum]


  export const chatMessagesOrderByRelevanceFieldEnum: {
    id: 'id',
    agentId: 'agentId',
    sender: 'sender',
    connector: 'connector',
    content: 'content',
    conversationId: 'conversationId'
  };

  export type chatMessagesOrderByRelevanceFieldEnum = (typeof chatMessagesOrderByRelevanceFieldEnum)[keyof typeof chatMessagesOrderByRelevanceFieldEnum]


  export const credentialsOrderByRelevanceFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    name: 'name',
    serviceType: 'serviceType',
    credentialType: 'credentialType',
    value: 'value',
    description: 'description'
  };

  export type credentialsOrderByRelevanceFieldEnum = (typeof credentialsOrderByRelevanceFieldEnum)[keyof typeof credentialsOrderByRelevanceFieldEnum]


  export const documentsOrderByRelevanceFieldEnum: {
    id: 'id',
    type: 'type',
    projectId: 'projectId',
    date: 'date'
  };

  export type documentsOrderByRelevanceFieldEnum = (typeof documentsOrderByRelevanceFieldEnum)[keyof typeof documentsOrderByRelevanceFieldEnum]


  export const embeddingsOrderByRelevanceFieldEnum: {
    documentId: 'documentId',
    content: 'content'
  };

  export type embeddingsOrderByRelevanceFieldEnum = (typeof embeddingsOrderByRelevanceFieldEnum)[keyof typeof embeddingsOrderByRelevanceFieldEnum]


  export const public_eventsOrderByRelevanceFieldEnum: {
    id: 'id',
    type: 'type',
    observer: 'observer',
    sender: 'sender',
    client: 'client',
    channel: 'channel',
    channelType: 'channelType',
    projectId: 'projectId',
    content: 'content',
    agentId: 'agentId',
    entities: 'entities',
    date: 'date',
    rawData: 'rawData',
    connector: 'connector'
  };

  export type public_eventsOrderByRelevanceFieldEnum = (typeof public_eventsOrderByRelevanceFieldEnum)[keyof typeof public_eventsOrderByRelevanceFieldEnum]


  export const graphEventsOrderByRelevanceFieldEnum: {
    id: 'id',
    agentId: 'agentId',
    sender: 'sender',
    connector: 'connector',
    channel: 'channel',
    content: 'content',
    eventType: 'eventType',
    observer: 'observer'
  };

  export type graphEventsOrderByRelevanceFieldEnum = (typeof graphEventsOrderByRelevanceFieldEnum)[keyof typeof graphEventsOrderByRelevanceFieldEnum]


  export const public_knex_migrationsOrderByRelevanceFieldEnum: {
    name: 'name'
  };

  export type public_knex_migrationsOrderByRelevanceFieldEnum = (typeof public_knex_migrationsOrderByRelevanceFieldEnum)[keyof typeof public_knex_migrationsOrderByRelevanceFieldEnum]


  export const knowledgeOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    sourceUrl: 'sourceUrl',
    dataType: 'dataType',
    data: 'data',
    projectId: 'projectId',
    memoryId: 'memoryId'
  };

  export type knowledgeOrderByRelevanceFieldEnum = (typeof knowledgeOrderByRelevanceFieldEnum)[keyof typeof knowledgeOrderByRelevanceFieldEnum]


  export const pluginStateOrderByRelevanceFieldEnum: {
    id: 'id',
    agentId: 'agentId',
    plugin: 'plugin'
  };

  export type pluginStateOrderByRelevanceFieldEnum = (typeof pluginStateOrderByRelevanceFieldEnum)[keyof typeof pluginStateOrderByRelevanceFieldEnum]


  export const requestOrderByRelevanceFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    requestData: 'requestData',
    responseData: 'responseData',
    status: 'status',
    model: 'model',
    parameters: 'parameters',
    provider: 'provider',
    type: 'type',
    spell: 'spell',
    nodeId: 'nodeId',
    agentId: 'agentId'
  };

  export type requestOrderByRelevanceFieldEnum = (typeof requestOrderByRelevanceFieldEnum)[keyof typeof requestOrderByRelevanceFieldEnum]


  export const spellReleasesOrderByRelevanceFieldEnum: {
    id: 'id',
    description: 'description',
    agentId: 'agentId',
    spellId: 'spellId',
    projectId: 'projectId'
  };

  export type spellReleasesOrderByRelevanceFieldEnum = (typeof spellReleasesOrderByRelevanceFieldEnum)[keyof typeof spellReleasesOrderByRelevanceFieldEnum]


  export const spellsOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    projectId: 'projectId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    type: 'type',
    spellReleaseId: 'spellReleaseId'
  };

  export type spellsOrderByRelevanceFieldEnum = (typeof spellsOrderByRelevanceFieldEnum)[keyof typeof spellsOrderByRelevanceFieldEnum]


  export const tasksOrderByRelevanceFieldEnum: {
    status: 'status',
    type: 'type',
    objective: 'objective',
    projectId: 'projectId',
    date: 'date',
    steps: 'steps',
    agentId: 'agentId'
  };

  export type tasksOrderByRelevanceFieldEnum = (typeof tasksOrderByRelevanceFieldEnum)[keyof typeof tasksOrderByRelevanceFieldEnum]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type agent_credentialsWhereInput = {
    AND?: agent_credentialsWhereInput | agent_credentialsWhereInput[]
    OR?: agent_credentialsWhereInput[]
    NOT?: agent_credentialsWhereInput | agent_credentialsWhereInput[]
    agentId?: UuidFilter<"agent_credentials"> | string
    credentialId?: UuidFilter<"agent_credentials"> | string
    created_at?: DateTimeFilter<"agent_credentials"> | Date | string
    updated_at?: DateTimeFilter<"agent_credentials"> | Date | string
    agents?: XOR<AgentsRelationFilter, agentsWhereInput>
    credentials?: XOR<CredentialsRelationFilter, credentialsWhereInput>
  }

  export type agent_credentialsOrderByWithRelationAndSearchRelevanceInput = {
    agentId?: SortOrder
    credentialId?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    agents?: agentsOrderByWithRelationAndSearchRelevanceInput
    credentials?: credentialsOrderByWithRelationAndSearchRelevanceInput
    _relevance?: agent_credentialsOrderByRelevanceInput
  }

  export type agent_credentialsWhereUniqueInput = Prisma.AtLeast<{
    agentId_credentialId?: agent_credentialsAgentIdCredentialIdCompoundUniqueInput
    AND?: agent_credentialsWhereInput | agent_credentialsWhereInput[]
    OR?: agent_credentialsWhereInput[]
    NOT?: agent_credentialsWhereInput | agent_credentialsWhereInput[]
    agentId?: UuidFilter<"agent_credentials"> | string
    credentialId?: UuidFilter<"agent_credentials"> | string
    created_at?: DateTimeFilter<"agent_credentials"> | Date | string
    updated_at?: DateTimeFilter<"agent_credentials"> | Date | string
    agents?: XOR<AgentsRelationFilter, agentsWhereInput>
    credentials?: XOR<CredentialsRelationFilter, credentialsWhereInput>
  }, "agentId_credentialId">

  export type agent_credentialsOrderByWithAggregationInput = {
    agentId?: SortOrder
    credentialId?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: agent_credentialsCountOrderByAggregateInput
    _max?: agent_credentialsMaxOrderByAggregateInput
    _min?: agent_credentialsMinOrderByAggregateInput
  }

  export type agent_credentialsScalarWhereWithAggregatesInput = {
    AND?: agent_credentialsScalarWhereWithAggregatesInput | agent_credentialsScalarWhereWithAggregatesInput[]
    OR?: agent_credentialsScalarWhereWithAggregatesInput[]
    NOT?: agent_credentialsScalarWhereWithAggregatesInput | agent_credentialsScalarWhereWithAggregatesInput[]
    agentId?: UuidWithAggregatesFilter<"agent_credentials"> | string
    credentialId?: UuidWithAggregatesFilter<"agent_credentials"> | string
    created_at?: DateTimeWithAggregatesFilter<"agent_credentials"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"agent_credentials"> | Date | string
  }

  export type agentsWhereInput = {
    AND?: agentsWhereInput | agentsWhereInput[]
    OR?: agentsWhereInput[]
    NOT?: agentsWhereInput | agentsWhereInput[]
    id?: UuidFilter<"agents"> | string
    rootSpell?: JsonNullableFilter<"agents">
    publicVariables?: StringNullableFilter<"agents"> | string | null
    secrets?: StringNullableFilter<"agents"> | string | null
    name?: StringNullableFilter<"agents"> | string | null
    enabled?: BoolNullableFilter<"agents"> | boolean | null
    updatedAt?: StringNullableFilter<"agents"> | string | null
    pingedAt?: StringNullableFilter<"agents"> | string | null
    projectId?: StringNullableFilter<"agents"> | string | null
    data?: JsonNullableFilter<"agents">
    runState?: StringFilter<"agents"> | string
    image?: StringNullableFilter<"agents"> | string | null
    rootSpellId?: UuidNullableFilter<"agents"> | string | null
    default?: BoolFilter<"agents"> | boolean
    createdAt?: DateTimeNullableFilter<"agents"> | Date | string | null
    currentSpellReleaseId?: UuidNullableFilter<"agents"> | string | null
    embedModel?: StringNullableFilter<"agents"> | string | null
    version?: StringFilter<"agents"> | string
    embeddingProvider?: StringNullableFilter<"agents"> | string | null
    embeddingModel?: StringNullableFilter<"agents"> | string | null
    isDraft?: BoolFilter<"agents"> | boolean
    agent_credentials?: Agent_credentialsListRelationFilter
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: XOR<SpellReleasesNullableRelationFilter, spellReleasesWhereInput> | null
    chatMessages?: ChatMessagesListRelationFilter
    graphEvents?: GraphEventsListRelationFilter
    pluginState?: PluginStateListRelationFilter
    spellReleases_spellReleases_agentIdToagents?: SpellReleasesListRelationFilter
  }

  export type agentsOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    rootSpell?: SortOrderInput | SortOrder
    publicVariables?: SortOrderInput | SortOrder
    secrets?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    enabled?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    pingedAt?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    data?: SortOrderInput | SortOrder
    runState?: SortOrder
    image?: SortOrderInput | SortOrder
    rootSpellId?: SortOrderInput | SortOrder
    default?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    currentSpellReleaseId?: SortOrderInput | SortOrder
    embedModel?: SortOrderInput | SortOrder
    version?: SortOrder
    embeddingProvider?: SortOrderInput | SortOrder
    embeddingModel?: SortOrderInput | SortOrder
    isDraft?: SortOrder
    agent_credentials?: agent_credentialsOrderByRelationAggregateInput
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: spellReleasesOrderByWithRelationAndSearchRelevanceInput
    chatMessages?: chatMessagesOrderByRelationAggregateInput
    graphEvents?: graphEventsOrderByRelationAggregateInput
    pluginState?: pluginStateOrderByRelationAggregateInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesOrderByRelationAggregateInput
    _relevance?: agentsOrderByRelevanceInput
  }

  export type agentsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: agentsWhereInput | agentsWhereInput[]
    OR?: agentsWhereInput[]
    NOT?: agentsWhereInput | agentsWhereInput[]
    rootSpell?: JsonNullableFilter<"agents">
    publicVariables?: StringNullableFilter<"agents"> | string | null
    secrets?: StringNullableFilter<"agents"> | string | null
    name?: StringNullableFilter<"agents"> | string | null
    enabled?: BoolNullableFilter<"agents"> | boolean | null
    updatedAt?: StringNullableFilter<"agents"> | string | null
    pingedAt?: StringNullableFilter<"agents"> | string | null
    projectId?: StringNullableFilter<"agents"> | string | null
    data?: JsonNullableFilter<"agents">
    runState?: StringFilter<"agents"> | string
    image?: StringNullableFilter<"agents"> | string | null
    rootSpellId?: UuidNullableFilter<"agents"> | string | null
    default?: BoolFilter<"agents"> | boolean
    createdAt?: DateTimeNullableFilter<"agents"> | Date | string | null
    currentSpellReleaseId?: UuidNullableFilter<"agents"> | string | null
    embedModel?: StringNullableFilter<"agents"> | string | null
    version?: StringFilter<"agents"> | string
    embeddingProvider?: StringNullableFilter<"agents"> | string | null
    embeddingModel?: StringNullableFilter<"agents"> | string | null
    isDraft?: BoolFilter<"agents"> | boolean
    agent_credentials?: Agent_credentialsListRelationFilter
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: XOR<SpellReleasesNullableRelationFilter, spellReleasesWhereInput> | null
    chatMessages?: ChatMessagesListRelationFilter
    graphEvents?: GraphEventsListRelationFilter
    pluginState?: PluginStateListRelationFilter
    spellReleases_spellReleases_agentIdToagents?: SpellReleasesListRelationFilter
  }, "id" | "id">

  export type agentsOrderByWithAggregationInput = {
    id?: SortOrder
    rootSpell?: SortOrderInput | SortOrder
    publicVariables?: SortOrderInput | SortOrder
    secrets?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    enabled?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    pingedAt?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    data?: SortOrderInput | SortOrder
    runState?: SortOrder
    image?: SortOrderInput | SortOrder
    rootSpellId?: SortOrderInput | SortOrder
    default?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    currentSpellReleaseId?: SortOrderInput | SortOrder
    embedModel?: SortOrderInput | SortOrder
    version?: SortOrder
    embeddingProvider?: SortOrderInput | SortOrder
    embeddingModel?: SortOrderInput | SortOrder
    isDraft?: SortOrder
    _count?: agentsCountOrderByAggregateInput
    _max?: agentsMaxOrderByAggregateInput
    _min?: agentsMinOrderByAggregateInput
  }

  export type agentsScalarWhereWithAggregatesInput = {
    AND?: agentsScalarWhereWithAggregatesInput | agentsScalarWhereWithAggregatesInput[]
    OR?: agentsScalarWhereWithAggregatesInput[]
    NOT?: agentsScalarWhereWithAggregatesInput | agentsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"agents"> | string
    rootSpell?: JsonNullableWithAggregatesFilter<"agents">
    publicVariables?: StringNullableWithAggregatesFilter<"agents"> | string | null
    secrets?: StringNullableWithAggregatesFilter<"agents"> | string | null
    name?: StringNullableWithAggregatesFilter<"agents"> | string | null
    enabled?: BoolNullableWithAggregatesFilter<"agents"> | boolean | null
    updatedAt?: StringNullableWithAggregatesFilter<"agents"> | string | null
    pingedAt?: StringNullableWithAggregatesFilter<"agents"> | string | null
    projectId?: StringNullableWithAggregatesFilter<"agents"> | string | null
    data?: JsonNullableWithAggregatesFilter<"agents">
    runState?: StringWithAggregatesFilter<"agents"> | string
    image?: StringNullableWithAggregatesFilter<"agents"> | string | null
    rootSpellId?: UuidNullableWithAggregatesFilter<"agents"> | string | null
    default?: BoolWithAggregatesFilter<"agents"> | boolean
    createdAt?: DateTimeNullableWithAggregatesFilter<"agents"> | Date | string | null
    currentSpellReleaseId?: UuidNullableWithAggregatesFilter<"agents"> | string | null
    embedModel?: StringNullableWithAggregatesFilter<"agents"> | string | null
    version?: StringWithAggregatesFilter<"agents"> | string
    embeddingProvider?: StringNullableWithAggregatesFilter<"agents"> | string | null
    embeddingModel?: StringNullableWithAggregatesFilter<"agents"> | string | null
    isDraft?: BoolWithAggregatesFilter<"agents"> | boolean
  }

  export type chatMessagesWhereInput = {
    AND?: chatMessagesWhereInput | chatMessagesWhereInput[]
    OR?: chatMessagesWhereInput[]
    NOT?: chatMessagesWhereInput | chatMessagesWhereInput[]
    id?: UuidFilter<"chatMessages"> | string
    agentId?: UuidFilter<"chatMessages"> | string
    sender?: StringNullableFilter<"chatMessages"> | string | null
    connector?: StringFilter<"chatMessages"> | string
    content?: StringNullableFilter<"chatMessages"> | string | null
    conversationId?: StringNullableFilter<"chatMessages"> | string | null
    created_at?: DateTimeFilter<"chatMessages"> | Date | string
    updated_at?: DateTimeFilter<"chatMessages"> | Date | string
    agents?: XOR<AgentsRelationFilter, agentsWhereInput>
  }

  export type chatMessagesOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    agentId?: SortOrder
    sender?: SortOrderInput | SortOrder
    connector?: SortOrder
    content?: SortOrderInput | SortOrder
    conversationId?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    agents?: agentsOrderByWithRelationAndSearchRelevanceInput
    _relevance?: chatMessagesOrderByRelevanceInput
  }

  export type chatMessagesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: chatMessagesWhereInput | chatMessagesWhereInput[]
    OR?: chatMessagesWhereInput[]
    NOT?: chatMessagesWhereInput | chatMessagesWhereInput[]
    agentId?: UuidFilter<"chatMessages"> | string
    sender?: StringNullableFilter<"chatMessages"> | string | null
    connector?: StringFilter<"chatMessages"> | string
    content?: StringNullableFilter<"chatMessages"> | string | null
    conversationId?: StringNullableFilter<"chatMessages"> | string | null
    created_at?: DateTimeFilter<"chatMessages"> | Date | string
    updated_at?: DateTimeFilter<"chatMessages"> | Date | string
    agents?: XOR<AgentsRelationFilter, agentsWhereInput>
  }, "id">

  export type chatMessagesOrderByWithAggregationInput = {
    id?: SortOrder
    agentId?: SortOrder
    sender?: SortOrderInput | SortOrder
    connector?: SortOrder
    content?: SortOrderInput | SortOrder
    conversationId?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: chatMessagesCountOrderByAggregateInput
    _max?: chatMessagesMaxOrderByAggregateInput
    _min?: chatMessagesMinOrderByAggregateInput
  }

  export type chatMessagesScalarWhereWithAggregatesInput = {
    AND?: chatMessagesScalarWhereWithAggregatesInput | chatMessagesScalarWhereWithAggregatesInput[]
    OR?: chatMessagesScalarWhereWithAggregatesInput[]
    NOT?: chatMessagesScalarWhereWithAggregatesInput | chatMessagesScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"chatMessages"> | string
    agentId?: UuidWithAggregatesFilter<"chatMessages"> | string
    sender?: StringNullableWithAggregatesFilter<"chatMessages"> | string | null
    connector?: StringWithAggregatesFilter<"chatMessages"> | string
    content?: StringNullableWithAggregatesFilter<"chatMessages"> | string | null
    conversationId?: StringNullableWithAggregatesFilter<"chatMessages"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"chatMessages"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"chatMessages"> | Date | string
  }

  export type credentialsWhereInput = {
    AND?: credentialsWhereInput | credentialsWhereInput[]
    OR?: credentialsWhereInput[]
    NOT?: credentialsWhereInput | credentialsWhereInput[]
    id?: UuidFilter<"credentials"> | string
    projectId?: StringFilter<"credentials"> | string
    name?: StringFilter<"credentials"> | string
    serviceType?: StringFilter<"credentials"> | string
    credentialType?: StringFilter<"credentials"> | string
    value?: StringFilter<"credentials"> | string
    description?: StringNullableFilter<"credentials"> | string | null
    metadata?: JsonNullableFilter<"credentials">
    created_at?: DateTimeFilter<"credentials"> | Date | string
    updated_at?: DateTimeFilter<"credentials"> | Date | string
    agent_credentials?: Agent_credentialsListRelationFilter
  }

  export type credentialsOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    serviceType?: SortOrder
    credentialType?: SortOrder
    value?: SortOrder
    description?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    agent_credentials?: agent_credentialsOrderByRelationAggregateInput
    _relevance?: credentialsOrderByRelevanceInput
  }

  export type credentialsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: credentialsWhereInput | credentialsWhereInput[]
    OR?: credentialsWhereInput[]
    NOT?: credentialsWhereInput | credentialsWhereInput[]
    projectId?: StringFilter<"credentials"> | string
    name?: StringFilter<"credentials"> | string
    serviceType?: StringFilter<"credentials"> | string
    credentialType?: StringFilter<"credentials"> | string
    value?: StringFilter<"credentials"> | string
    description?: StringNullableFilter<"credentials"> | string | null
    metadata?: JsonNullableFilter<"credentials">
    created_at?: DateTimeFilter<"credentials"> | Date | string
    updated_at?: DateTimeFilter<"credentials"> | Date | string
    agent_credentials?: Agent_credentialsListRelationFilter
  }, "id" | "id">

  export type credentialsOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    serviceType?: SortOrder
    credentialType?: SortOrder
    value?: SortOrder
    description?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: credentialsCountOrderByAggregateInput
    _max?: credentialsMaxOrderByAggregateInput
    _min?: credentialsMinOrderByAggregateInput
  }

  export type credentialsScalarWhereWithAggregatesInput = {
    AND?: credentialsScalarWhereWithAggregatesInput | credentialsScalarWhereWithAggregatesInput[]
    OR?: credentialsScalarWhereWithAggregatesInput[]
    NOT?: credentialsScalarWhereWithAggregatesInput | credentialsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"credentials"> | string
    projectId?: StringWithAggregatesFilter<"credentials"> | string
    name?: StringWithAggregatesFilter<"credentials"> | string
    serviceType?: StringWithAggregatesFilter<"credentials"> | string
    credentialType?: StringWithAggregatesFilter<"credentials"> | string
    value?: StringWithAggregatesFilter<"credentials"> | string
    description?: StringNullableWithAggregatesFilter<"credentials"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"credentials">
    created_at?: DateTimeWithAggregatesFilter<"credentials"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"credentials"> | Date | string
  }

  export type documentsWhereInput = {
    AND?: documentsWhereInput | documentsWhereInput[]
    OR?: documentsWhereInput[]
    NOT?: documentsWhereInput | documentsWhereInput[]
    id?: UuidFilter<"documents"> | string
    type?: StringNullableFilter<"documents"> | string | null
    projectId?: StringNullableFilter<"documents"> | string | null
    date?: StringNullableFilter<"documents"> | string | null
    metadata?: JsonNullableFilter<"documents">
  }

  export type documentsOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    type?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    date?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    _relevance?: documentsOrderByRelevanceInput
  }

  export type documentsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: documentsWhereInput | documentsWhereInput[]
    OR?: documentsWhereInput[]
    NOT?: documentsWhereInput | documentsWhereInput[]
    type?: StringNullableFilter<"documents"> | string | null
    projectId?: StringNullableFilter<"documents"> | string | null
    date?: StringNullableFilter<"documents"> | string | null
    metadata?: JsonNullableFilter<"documents">
  }, "id">

  export type documentsOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    date?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: documentsCountOrderByAggregateInput
    _max?: documentsMaxOrderByAggregateInput
    _min?: documentsMinOrderByAggregateInput
  }

  export type documentsScalarWhereWithAggregatesInput = {
    AND?: documentsScalarWhereWithAggregatesInput | documentsScalarWhereWithAggregatesInput[]
    OR?: documentsScalarWhereWithAggregatesInput[]
    NOT?: documentsScalarWhereWithAggregatesInput | documentsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"documents"> | string
    type?: StringNullableWithAggregatesFilter<"documents"> | string | null
    projectId?: StringNullableWithAggregatesFilter<"documents"> | string | null
    date?: StringNullableWithAggregatesFilter<"documents"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"documents">
  }

  export type embeddingsWhereInput = {
    AND?: embeddingsWhereInput | embeddingsWhereInput[]
    OR?: embeddingsWhereInput[]
    NOT?: embeddingsWhereInput | embeddingsWhereInput[]
    id?: IntFilter<"embeddings"> | number
    documentId?: UuidNullableFilter<"embeddings"> | string | null
    content?: StringNullableFilter<"embeddings"> | string | null
    index?: IntNullableFilter<"embeddings"> | number | null
  }

  export type embeddingsOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    documentId?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    index?: SortOrderInput | SortOrder
    _relevance?: embeddingsOrderByRelevanceInput
  }

  export type embeddingsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: embeddingsWhereInput | embeddingsWhereInput[]
    OR?: embeddingsWhereInput[]
    NOT?: embeddingsWhereInput | embeddingsWhereInput[]
    documentId?: UuidNullableFilter<"embeddings"> | string | null
    content?: StringNullableFilter<"embeddings"> | string | null
    index?: IntNullableFilter<"embeddings"> | number | null
  }, "id">

  export type embeddingsOrderByWithAggregationInput = {
    id?: SortOrder
    documentId?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    index?: SortOrderInput | SortOrder
    _count?: embeddingsCountOrderByAggregateInput
    _avg?: embeddingsAvgOrderByAggregateInput
    _max?: embeddingsMaxOrderByAggregateInput
    _min?: embeddingsMinOrderByAggregateInput
    _sum?: embeddingsSumOrderByAggregateInput
  }

  export type embeddingsScalarWhereWithAggregatesInput = {
    AND?: embeddingsScalarWhereWithAggregatesInput | embeddingsScalarWhereWithAggregatesInput[]
    OR?: embeddingsScalarWhereWithAggregatesInput[]
    NOT?: embeddingsScalarWhereWithAggregatesInput | embeddingsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"embeddings"> | number
    documentId?: UuidNullableWithAggregatesFilter<"embeddings"> | string | null
    content?: StringNullableWithAggregatesFilter<"embeddings"> | string | null
    index?: IntNullableWithAggregatesFilter<"embeddings"> | number | null
  }

  export type public_eventsWhereInput = {
    AND?: public_eventsWhereInput | public_eventsWhereInput[]
    OR?: public_eventsWhereInput[]
    NOT?: public_eventsWhereInput | public_eventsWhereInput[]
    id?: UuidFilter<"public_events"> | string
    type?: StringNullableFilter<"public_events"> | string | null
    observer?: StringNullableFilter<"public_events"> | string | null
    sender?: StringNullableFilter<"public_events"> | string | null
    client?: StringNullableFilter<"public_events"> | string | null
    channel?: StringNullableFilter<"public_events"> | string | null
    channelType?: StringNullableFilter<"public_events"> | string | null
    projectId?: StringNullableFilter<"public_events"> | string | null
    content?: StringNullableFilter<"public_events"> | string | null
    agentId?: StringNullableFilter<"public_events"> | string | null
    entities?: StringNullableListFilter<"public_events">
    date?: StringNullableFilter<"public_events"> | string | null
    rawData?: StringNullableFilter<"public_events"> | string | null
    connector?: StringNullableFilter<"public_events"> | string | null
  }

  export type public_eventsOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    type?: SortOrderInput | SortOrder
    observer?: SortOrderInput | SortOrder
    sender?: SortOrderInput | SortOrder
    client?: SortOrderInput | SortOrder
    channel?: SortOrderInput | SortOrder
    channelType?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    agentId?: SortOrderInput | SortOrder
    entities?: SortOrder
    date?: SortOrderInput | SortOrder
    rawData?: SortOrderInput | SortOrder
    connector?: SortOrderInput | SortOrder
    _relevance?: public_eventsOrderByRelevanceInput
  }

  export type public_eventsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: public_eventsWhereInput | public_eventsWhereInput[]
    OR?: public_eventsWhereInput[]
    NOT?: public_eventsWhereInput | public_eventsWhereInput[]
    type?: StringNullableFilter<"public_events"> | string | null
    observer?: StringNullableFilter<"public_events"> | string | null
    sender?: StringNullableFilter<"public_events"> | string | null
    client?: StringNullableFilter<"public_events"> | string | null
    channel?: StringNullableFilter<"public_events"> | string | null
    channelType?: StringNullableFilter<"public_events"> | string | null
    projectId?: StringNullableFilter<"public_events"> | string | null
    content?: StringNullableFilter<"public_events"> | string | null
    agentId?: StringNullableFilter<"public_events"> | string | null
    entities?: StringNullableListFilter<"public_events">
    date?: StringNullableFilter<"public_events"> | string | null
    rawData?: StringNullableFilter<"public_events"> | string | null
    connector?: StringNullableFilter<"public_events"> | string | null
  }, "id">

  export type public_eventsOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrderInput | SortOrder
    observer?: SortOrderInput | SortOrder
    sender?: SortOrderInput | SortOrder
    client?: SortOrderInput | SortOrder
    channel?: SortOrderInput | SortOrder
    channelType?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    agentId?: SortOrderInput | SortOrder
    entities?: SortOrder
    date?: SortOrderInput | SortOrder
    rawData?: SortOrderInput | SortOrder
    connector?: SortOrderInput | SortOrder
    _count?: public_eventsCountOrderByAggregateInput
    _max?: public_eventsMaxOrderByAggregateInput
    _min?: public_eventsMinOrderByAggregateInput
  }

  export type public_eventsScalarWhereWithAggregatesInput = {
    AND?: public_eventsScalarWhereWithAggregatesInput | public_eventsScalarWhereWithAggregatesInput[]
    OR?: public_eventsScalarWhereWithAggregatesInput[]
    NOT?: public_eventsScalarWhereWithAggregatesInput | public_eventsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"public_events"> | string
    type?: StringNullableWithAggregatesFilter<"public_events"> | string | null
    observer?: StringNullableWithAggregatesFilter<"public_events"> | string | null
    sender?: StringNullableWithAggregatesFilter<"public_events"> | string | null
    client?: StringNullableWithAggregatesFilter<"public_events"> | string | null
    channel?: StringNullableWithAggregatesFilter<"public_events"> | string | null
    channelType?: StringNullableWithAggregatesFilter<"public_events"> | string | null
    projectId?: StringNullableWithAggregatesFilter<"public_events"> | string | null
    content?: StringNullableWithAggregatesFilter<"public_events"> | string | null
    agentId?: StringNullableWithAggregatesFilter<"public_events"> | string | null
    entities?: StringNullableListFilter<"public_events">
    date?: StringNullableWithAggregatesFilter<"public_events"> | string | null
    rawData?: StringNullableWithAggregatesFilter<"public_events"> | string | null
    connector?: StringNullableWithAggregatesFilter<"public_events"> | string | null
  }

  export type graphEventsWhereInput = {
    AND?: graphEventsWhereInput | graphEventsWhereInput[]
    OR?: graphEventsWhereInput[]
    NOT?: graphEventsWhereInput | graphEventsWhereInput[]
    id?: UuidFilter<"graphEvents"> | string
    agentId?: UuidFilter<"graphEvents"> | string
    sender?: StringFilter<"graphEvents"> | string
    connector?: StringFilter<"graphEvents"> | string
    connectorData?: JsonNullableFilter<"graphEvents">
    channel?: StringNullableFilter<"graphEvents"> | string | null
    content?: StringFilter<"graphEvents"> | string
    eventType?: StringFilter<"graphEvents"> | string
    created_at?: DateTimeFilter<"graphEvents"> | Date | string
    updated_at?: DateTimeFilter<"graphEvents"> | Date | string
    event?: JsonNullableFilter<"graphEvents">
    observer?: StringNullableFilter<"graphEvents"> | string | null
    agents?: XOR<AgentsRelationFilter, agentsWhereInput>
  }

  export type graphEventsOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    agentId?: SortOrder
    sender?: SortOrder
    connector?: SortOrder
    connectorData?: SortOrderInput | SortOrder
    channel?: SortOrderInput | SortOrder
    content?: SortOrder
    eventType?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    event?: SortOrderInput | SortOrder
    observer?: SortOrderInput | SortOrder
    agents?: agentsOrderByWithRelationAndSearchRelevanceInput
    _relevance?: graphEventsOrderByRelevanceInput
  }

  export type graphEventsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: graphEventsWhereInput | graphEventsWhereInput[]
    OR?: graphEventsWhereInput[]
    NOT?: graphEventsWhereInput | graphEventsWhereInput[]
    agentId?: UuidFilter<"graphEvents"> | string
    sender?: StringFilter<"graphEvents"> | string
    connector?: StringFilter<"graphEvents"> | string
    connectorData?: JsonNullableFilter<"graphEvents">
    channel?: StringNullableFilter<"graphEvents"> | string | null
    content?: StringFilter<"graphEvents"> | string
    eventType?: StringFilter<"graphEvents"> | string
    created_at?: DateTimeFilter<"graphEvents"> | Date | string
    updated_at?: DateTimeFilter<"graphEvents"> | Date | string
    event?: JsonNullableFilter<"graphEvents">
    observer?: StringNullableFilter<"graphEvents"> | string | null
    agents?: XOR<AgentsRelationFilter, agentsWhereInput>
  }, "id">

  export type graphEventsOrderByWithAggregationInput = {
    id?: SortOrder
    agentId?: SortOrder
    sender?: SortOrder
    connector?: SortOrder
    connectorData?: SortOrderInput | SortOrder
    channel?: SortOrderInput | SortOrder
    content?: SortOrder
    eventType?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    event?: SortOrderInput | SortOrder
    observer?: SortOrderInput | SortOrder
    _count?: graphEventsCountOrderByAggregateInput
    _max?: graphEventsMaxOrderByAggregateInput
    _min?: graphEventsMinOrderByAggregateInput
  }

  export type graphEventsScalarWhereWithAggregatesInput = {
    AND?: graphEventsScalarWhereWithAggregatesInput | graphEventsScalarWhereWithAggregatesInput[]
    OR?: graphEventsScalarWhereWithAggregatesInput[]
    NOT?: graphEventsScalarWhereWithAggregatesInput | graphEventsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"graphEvents"> | string
    agentId?: UuidWithAggregatesFilter<"graphEvents"> | string
    sender?: StringWithAggregatesFilter<"graphEvents"> | string
    connector?: StringWithAggregatesFilter<"graphEvents"> | string
    connectorData?: JsonNullableWithAggregatesFilter<"graphEvents">
    channel?: StringNullableWithAggregatesFilter<"graphEvents"> | string | null
    content?: StringWithAggregatesFilter<"graphEvents"> | string
    eventType?: StringWithAggregatesFilter<"graphEvents"> | string
    created_at?: DateTimeWithAggregatesFilter<"graphEvents"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"graphEvents"> | Date | string
    event?: JsonNullableWithAggregatesFilter<"graphEvents">
    observer?: StringNullableWithAggregatesFilter<"graphEvents"> | string | null
  }

  export type public_knex_migrationsWhereInput = {
    AND?: public_knex_migrationsWhereInput | public_knex_migrationsWhereInput[]
    OR?: public_knex_migrationsWhereInput[]
    NOT?: public_knex_migrationsWhereInput | public_knex_migrationsWhereInput[]
    id?: IntFilter<"public_knex_migrations"> | number
    name?: StringNullableFilter<"public_knex_migrations"> | string | null
    batch?: IntNullableFilter<"public_knex_migrations"> | number | null
    migration_time?: DateTimeNullableFilter<"public_knex_migrations"> | Date | string | null
  }

  export type public_knex_migrationsOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    batch?: SortOrderInput | SortOrder
    migration_time?: SortOrderInput | SortOrder
    _relevance?: public_knex_migrationsOrderByRelevanceInput
  }

  export type public_knex_migrationsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: public_knex_migrationsWhereInput | public_knex_migrationsWhereInput[]
    OR?: public_knex_migrationsWhereInput[]
    NOT?: public_knex_migrationsWhereInput | public_knex_migrationsWhereInput[]
    name?: StringNullableFilter<"public_knex_migrations"> | string | null
    batch?: IntNullableFilter<"public_knex_migrations"> | number | null
    migration_time?: DateTimeNullableFilter<"public_knex_migrations"> | Date | string | null
  }, "id">

  export type public_knex_migrationsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    batch?: SortOrderInput | SortOrder
    migration_time?: SortOrderInput | SortOrder
    _count?: public_knex_migrationsCountOrderByAggregateInput
    _avg?: public_knex_migrationsAvgOrderByAggregateInput
    _max?: public_knex_migrationsMaxOrderByAggregateInput
    _min?: public_knex_migrationsMinOrderByAggregateInput
    _sum?: public_knex_migrationsSumOrderByAggregateInput
  }

  export type public_knex_migrationsScalarWhereWithAggregatesInput = {
    AND?: public_knex_migrationsScalarWhereWithAggregatesInput | public_knex_migrationsScalarWhereWithAggregatesInput[]
    OR?: public_knex_migrationsScalarWhereWithAggregatesInput[]
    NOT?: public_knex_migrationsScalarWhereWithAggregatesInput | public_knex_migrationsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"public_knex_migrations"> | number
    name?: StringNullableWithAggregatesFilter<"public_knex_migrations"> | string | null
    batch?: IntNullableWithAggregatesFilter<"public_knex_migrations"> | number | null
    migration_time?: DateTimeNullableWithAggregatesFilter<"public_knex_migrations"> | Date | string | null
  }

  export type public_knex_migrations_lockWhereInput = {
    AND?: public_knex_migrations_lockWhereInput | public_knex_migrations_lockWhereInput[]
    OR?: public_knex_migrations_lockWhereInput[]
    NOT?: public_knex_migrations_lockWhereInput | public_knex_migrations_lockWhereInput[]
    index?: IntFilter<"public_knex_migrations_lock"> | number
    is_locked?: IntNullableFilter<"public_knex_migrations_lock"> | number | null
  }

  export type public_knex_migrations_lockOrderByWithRelationAndSearchRelevanceInput = {
    index?: SortOrder
    is_locked?: SortOrderInput | SortOrder
  }

  export type public_knex_migrations_lockWhereUniqueInput = Prisma.AtLeast<{
    index?: number
    AND?: public_knex_migrations_lockWhereInput | public_knex_migrations_lockWhereInput[]
    OR?: public_knex_migrations_lockWhereInput[]
    NOT?: public_knex_migrations_lockWhereInput | public_knex_migrations_lockWhereInput[]
    is_locked?: IntNullableFilter<"public_knex_migrations_lock"> | number | null
  }, "index">

  export type public_knex_migrations_lockOrderByWithAggregationInput = {
    index?: SortOrder
    is_locked?: SortOrderInput | SortOrder
    _count?: public_knex_migrations_lockCountOrderByAggregateInput
    _avg?: public_knex_migrations_lockAvgOrderByAggregateInput
    _max?: public_knex_migrations_lockMaxOrderByAggregateInput
    _min?: public_knex_migrations_lockMinOrderByAggregateInput
    _sum?: public_knex_migrations_lockSumOrderByAggregateInput
  }

  export type public_knex_migrations_lockScalarWhereWithAggregatesInput = {
    AND?: public_knex_migrations_lockScalarWhereWithAggregatesInput | public_knex_migrations_lockScalarWhereWithAggregatesInput[]
    OR?: public_knex_migrations_lockScalarWhereWithAggregatesInput[]
    NOT?: public_knex_migrations_lockScalarWhereWithAggregatesInput | public_knex_migrations_lockScalarWhereWithAggregatesInput[]
    index?: IntWithAggregatesFilter<"public_knex_migrations_lock"> | number
    is_locked?: IntNullableWithAggregatesFilter<"public_knex_migrations_lock"> | number | null
  }

  export type knowledgeWhereInput = {
    AND?: knowledgeWhereInput | knowledgeWhereInput[]
    OR?: knowledgeWhereInput[]
    NOT?: knowledgeWhereInput | knowledgeWhereInput[]
    id?: UuidFilter<"knowledge"> | string
    name?: StringFilter<"knowledge"> | string
    sourceUrl?: StringNullableFilter<"knowledge"> | string | null
    dataType?: StringNullableFilter<"knowledge"> | string | null
    data?: StringNullableFilter<"knowledge"> | string | null
    projectId?: StringFilter<"knowledge"> | string
    metadata?: JsonNullableFilter<"knowledge">
    memoryId?: StringNullableFilter<"knowledge"> | string | null
    createdAt?: DateTimeNullableFilter<"knowledge"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"knowledge"> | Date | string | null
  }

  export type knowledgeOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    name?: SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    dataType?: SortOrderInput | SortOrder
    data?: SortOrderInput | SortOrder
    projectId?: SortOrder
    metadata?: SortOrderInput | SortOrder
    memoryId?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _relevance?: knowledgeOrderByRelevanceInput
  }

  export type knowledgeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: knowledgeWhereInput | knowledgeWhereInput[]
    OR?: knowledgeWhereInput[]
    NOT?: knowledgeWhereInput | knowledgeWhereInput[]
    name?: StringFilter<"knowledge"> | string
    sourceUrl?: StringNullableFilter<"knowledge"> | string | null
    dataType?: StringNullableFilter<"knowledge"> | string | null
    data?: StringNullableFilter<"knowledge"> | string | null
    projectId?: StringFilter<"knowledge"> | string
    metadata?: JsonNullableFilter<"knowledge">
    memoryId?: StringNullableFilter<"knowledge"> | string | null
    createdAt?: DateTimeNullableFilter<"knowledge"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"knowledge"> | Date | string | null
  }, "id">

  export type knowledgeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    dataType?: SortOrderInput | SortOrder
    data?: SortOrderInput | SortOrder
    projectId?: SortOrder
    metadata?: SortOrderInput | SortOrder
    memoryId?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: knowledgeCountOrderByAggregateInput
    _max?: knowledgeMaxOrderByAggregateInput
    _min?: knowledgeMinOrderByAggregateInput
  }

  export type knowledgeScalarWhereWithAggregatesInput = {
    AND?: knowledgeScalarWhereWithAggregatesInput | knowledgeScalarWhereWithAggregatesInput[]
    OR?: knowledgeScalarWhereWithAggregatesInput[]
    NOT?: knowledgeScalarWhereWithAggregatesInput | knowledgeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"knowledge"> | string
    name?: StringWithAggregatesFilter<"knowledge"> | string
    sourceUrl?: StringNullableWithAggregatesFilter<"knowledge"> | string | null
    dataType?: StringNullableWithAggregatesFilter<"knowledge"> | string | null
    data?: StringNullableWithAggregatesFilter<"knowledge"> | string | null
    projectId?: StringWithAggregatesFilter<"knowledge"> | string
    metadata?: JsonNullableWithAggregatesFilter<"knowledge">
    memoryId?: StringNullableWithAggregatesFilter<"knowledge"> | string | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"knowledge"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"knowledge"> | Date | string | null
  }

  export type pluginStateWhereInput = {
    AND?: pluginStateWhereInput | pluginStateWhereInput[]
    OR?: pluginStateWhereInput[]
    NOT?: pluginStateWhereInput | pluginStateWhereInput[]
    id?: UuidFilter<"pluginState"> | string
    agentId?: UuidNullableFilter<"pluginState"> | string | null
    state?: JsonNullableFilter<"pluginState">
    plugin?: StringNullableFilter<"pluginState"> | string | null
    agents?: XOR<AgentsNullableRelationFilter, agentsWhereInput> | null
  }

  export type pluginStateOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    agentId?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    plugin?: SortOrderInput | SortOrder
    agents?: agentsOrderByWithRelationAndSearchRelevanceInput
    _relevance?: pluginStateOrderByRelevanceInput
  }

  export type pluginStateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    agentId_plugin?: pluginStateAgentIdPluginCompoundUniqueInput
    AND?: pluginStateWhereInput | pluginStateWhereInput[]
    OR?: pluginStateWhereInput[]
    NOT?: pluginStateWhereInput | pluginStateWhereInput[]
    agentId?: UuidNullableFilter<"pluginState"> | string | null
    state?: JsonNullableFilter<"pluginState">
    plugin?: StringNullableFilter<"pluginState"> | string | null
    agents?: XOR<AgentsNullableRelationFilter, agentsWhereInput> | null
  }, "id" | "agentId_plugin">

  export type pluginStateOrderByWithAggregationInput = {
    id?: SortOrder
    agentId?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    plugin?: SortOrderInput | SortOrder
    _count?: pluginStateCountOrderByAggregateInput
    _max?: pluginStateMaxOrderByAggregateInput
    _min?: pluginStateMinOrderByAggregateInput
  }

  export type pluginStateScalarWhereWithAggregatesInput = {
    AND?: pluginStateScalarWhereWithAggregatesInput | pluginStateScalarWhereWithAggregatesInput[]
    OR?: pluginStateScalarWhereWithAggregatesInput[]
    NOT?: pluginStateScalarWhereWithAggregatesInput | pluginStateScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"pluginState"> | string
    agentId?: UuidNullableWithAggregatesFilter<"pluginState"> | string | null
    state?: JsonNullableWithAggregatesFilter<"pluginState">
    plugin?: StringNullableWithAggregatesFilter<"pluginState"> | string | null
  }

  export type requestWhereInput = {
    AND?: requestWhereInput | requestWhereInput[]
    OR?: requestWhereInput[]
    NOT?: requestWhereInput | requestWhereInput[]
    id?: UuidFilter<"request"> | string
    projectId?: StringFilter<"request"> | string
    requestData?: StringNullableFilter<"request"> | string | null
    responseData?: StringNullableFilter<"request"> | string | null
    duration?: IntFilter<"request"> | number
    status?: StringNullableFilter<"request"> | string | null
    statusCode?: IntNullableFilter<"request"> | number | null
    model?: StringNullableFilter<"request"> | string | null
    parameters?: StringNullableFilter<"request"> | string | null
    createdAt?: DateTimeNullableFilter<"request"> | Date | string | null
    provider?: StringFilter<"request"> | string
    type?: StringFilter<"request"> | string
    hidden?: BoolFilter<"request"> | boolean
    processed?: BoolFilter<"request"> | boolean
    cost?: FloatNullableFilter<"request"> | number | null
    spell?: StringNullableFilter<"request"> | string | null
    nodeId?: StringNullableFilter<"request"> | string | null
    agentId?: StringFilter<"request"> | string
  }

  export type requestOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    projectId?: SortOrder
    requestData?: SortOrderInput | SortOrder
    responseData?: SortOrderInput | SortOrder
    duration?: SortOrder
    status?: SortOrderInput | SortOrder
    statusCode?: SortOrderInput | SortOrder
    model?: SortOrderInput | SortOrder
    parameters?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    provider?: SortOrder
    type?: SortOrder
    hidden?: SortOrder
    processed?: SortOrder
    cost?: SortOrderInput | SortOrder
    spell?: SortOrderInput | SortOrder
    nodeId?: SortOrderInput | SortOrder
    agentId?: SortOrder
    _relevance?: requestOrderByRelevanceInput
  }

  export type requestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: requestWhereInput | requestWhereInput[]
    OR?: requestWhereInput[]
    NOT?: requestWhereInput | requestWhereInput[]
    projectId?: StringFilter<"request"> | string
    requestData?: StringNullableFilter<"request"> | string | null
    responseData?: StringNullableFilter<"request"> | string | null
    duration?: IntFilter<"request"> | number
    status?: StringNullableFilter<"request"> | string | null
    statusCode?: IntNullableFilter<"request"> | number | null
    model?: StringNullableFilter<"request"> | string | null
    parameters?: StringNullableFilter<"request"> | string | null
    createdAt?: DateTimeNullableFilter<"request"> | Date | string | null
    provider?: StringFilter<"request"> | string
    type?: StringFilter<"request"> | string
    hidden?: BoolFilter<"request"> | boolean
    processed?: BoolFilter<"request"> | boolean
    cost?: FloatNullableFilter<"request"> | number | null
    spell?: StringNullableFilter<"request"> | string | null
    nodeId?: StringNullableFilter<"request"> | string | null
    agentId?: StringFilter<"request"> | string
  }, "id">

  export type requestOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    requestData?: SortOrderInput | SortOrder
    responseData?: SortOrderInput | SortOrder
    duration?: SortOrder
    status?: SortOrderInput | SortOrder
    statusCode?: SortOrderInput | SortOrder
    model?: SortOrderInput | SortOrder
    parameters?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    provider?: SortOrder
    type?: SortOrder
    hidden?: SortOrder
    processed?: SortOrder
    cost?: SortOrderInput | SortOrder
    spell?: SortOrderInput | SortOrder
    nodeId?: SortOrderInput | SortOrder
    agentId?: SortOrder
    _count?: requestCountOrderByAggregateInput
    _avg?: requestAvgOrderByAggregateInput
    _max?: requestMaxOrderByAggregateInput
    _min?: requestMinOrderByAggregateInput
    _sum?: requestSumOrderByAggregateInput
  }

  export type requestScalarWhereWithAggregatesInput = {
    AND?: requestScalarWhereWithAggregatesInput | requestScalarWhereWithAggregatesInput[]
    OR?: requestScalarWhereWithAggregatesInput[]
    NOT?: requestScalarWhereWithAggregatesInput | requestScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"request"> | string
    projectId?: StringWithAggregatesFilter<"request"> | string
    requestData?: StringNullableWithAggregatesFilter<"request"> | string | null
    responseData?: StringNullableWithAggregatesFilter<"request"> | string | null
    duration?: IntWithAggregatesFilter<"request"> | number
    status?: StringNullableWithAggregatesFilter<"request"> | string | null
    statusCode?: IntNullableWithAggregatesFilter<"request"> | number | null
    model?: StringNullableWithAggregatesFilter<"request"> | string | null
    parameters?: StringNullableWithAggregatesFilter<"request"> | string | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"request"> | Date | string | null
    provider?: StringWithAggregatesFilter<"request"> | string
    type?: StringWithAggregatesFilter<"request"> | string
    hidden?: BoolWithAggregatesFilter<"request"> | boolean
    processed?: BoolWithAggregatesFilter<"request"> | boolean
    cost?: FloatNullableWithAggregatesFilter<"request"> | number | null
    spell?: StringNullableWithAggregatesFilter<"request"> | string | null
    nodeId?: StringNullableWithAggregatesFilter<"request"> | string | null
    agentId?: StringWithAggregatesFilter<"request"> | string
  }

  export type spellReleasesWhereInput = {
    AND?: spellReleasesWhereInput | spellReleasesWhereInput[]
    OR?: spellReleasesWhereInput[]
    NOT?: spellReleasesWhereInput | spellReleasesWhereInput[]
    id?: UuidFilter<"spellReleases"> | string
    description?: StringNullableFilter<"spellReleases"> | string | null
    agentId?: UuidFilter<"spellReleases"> | string
    spellId?: UuidNullableFilter<"spellReleases"> | string | null
    projectId?: StringNullableFilter<"spellReleases"> | string | null
    createdAt?: DateTimeNullableFilter<"spellReleases"> | Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: AgentsListRelationFilter
    agents_spellReleases_agentIdToagents?: XOR<AgentsRelationFilter, agentsWhereInput>
    spells?: SpellsListRelationFilter
  }

  export type spellReleasesOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    description?: SortOrderInput | SortOrder
    agentId?: SortOrder
    spellId?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    agents_agents_currentSpellReleaseIdTospellReleases?: agentsOrderByRelationAggregateInput
    agents_spellReleases_agentIdToagents?: agentsOrderByWithRelationAndSearchRelevanceInput
    spells?: spellsOrderByRelationAggregateInput
    _relevance?: spellReleasesOrderByRelevanceInput
  }

  export type spellReleasesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: spellReleasesWhereInput | spellReleasesWhereInput[]
    OR?: spellReleasesWhereInput[]
    NOT?: spellReleasesWhereInput | spellReleasesWhereInput[]
    description?: StringNullableFilter<"spellReleases"> | string | null
    agentId?: UuidFilter<"spellReleases"> | string
    spellId?: UuidNullableFilter<"spellReleases"> | string | null
    projectId?: StringNullableFilter<"spellReleases"> | string | null
    createdAt?: DateTimeNullableFilter<"spellReleases"> | Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: AgentsListRelationFilter
    agents_spellReleases_agentIdToagents?: XOR<AgentsRelationFilter, agentsWhereInput>
    spells?: SpellsListRelationFilter
  }, "id">

  export type spellReleasesOrderByWithAggregationInput = {
    id?: SortOrder
    description?: SortOrderInput | SortOrder
    agentId?: SortOrder
    spellId?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    _count?: spellReleasesCountOrderByAggregateInput
    _max?: spellReleasesMaxOrderByAggregateInput
    _min?: spellReleasesMinOrderByAggregateInput
  }

  export type spellReleasesScalarWhereWithAggregatesInput = {
    AND?: spellReleasesScalarWhereWithAggregatesInput | spellReleasesScalarWhereWithAggregatesInput[]
    OR?: spellReleasesScalarWhereWithAggregatesInput[]
    NOT?: spellReleasesScalarWhereWithAggregatesInput | spellReleasesScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"spellReleases"> | string
    description?: StringNullableWithAggregatesFilter<"spellReleases"> | string | null
    agentId?: UuidWithAggregatesFilter<"spellReleases"> | string
    spellId?: UuidNullableWithAggregatesFilter<"spellReleases"> | string | null
    projectId?: StringNullableWithAggregatesFilter<"spellReleases"> | string | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"spellReleases"> | Date | string | null
  }

  export type spellsWhereInput = {
    AND?: spellsWhereInput | spellsWhereInput[]
    OR?: spellsWhereInput[]
    NOT?: spellsWhereInput | spellsWhereInput[]
    id?: UuidFilter<"spells"> | string
    name?: StringNullableFilter<"spells"> | string | null
    projectId?: StringNullableFilter<"spells"> | string | null
    graph?: JsonNullableFilter<"spells">
    createdAt?: StringNullableFilter<"spells"> | string | null
    updatedAt?: StringNullableFilter<"spells"> | string | null
    type?: StringNullableFilter<"spells"> | string | null
    spellReleaseId?: UuidNullableFilter<"spells"> | string | null
    spellReleases?: XOR<SpellReleasesNullableRelationFilter, spellReleasesWhereInput> | null
  }

  export type spellsOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    graph?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    spellReleaseId?: SortOrderInput | SortOrder
    spellReleases?: spellReleasesOrderByWithRelationAndSearchRelevanceInput
    _relevance?: spellsOrderByRelevanceInput
  }

  export type spellsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: spellsWhereInput | spellsWhereInput[]
    OR?: spellsWhereInput[]
    NOT?: spellsWhereInput | spellsWhereInput[]
    name?: StringNullableFilter<"spells"> | string | null
    projectId?: StringNullableFilter<"spells"> | string | null
    graph?: JsonNullableFilter<"spells">
    createdAt?: StringNullableFilter<"spells"> | string | null
    updatedAt?: StringNullableFilter<"spells"> | string | null
    type?: StringNullableFilter<"spells"> | string | null
    spellReleaseId?: UuidNullableFilter<"spells"> | string | null
    spellReleases?: XOR<SpellReleasesNullableRelationFilter, spellReleasesWhereInput> | null
  }, "id">

  export type spellsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    graph?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    spellReleaseId?: SortOrderInput | SortOrder
    _count?: spellsCountOrderByAggregateInput
    _max?: spellsMaxOrderByAggregateInput
    _min?: spellsMinOrderByAggregateInput
  }

  export type spellsScalarWhereWithAggregatesInput = {
    AND?: spellsScalarWhereWithAggregatesInput | spellsScalarWhereWithAggregatesInput[]
    OR?: spellsScalarWhereWithAggregatesInput[]
    NOT?: spellsScalarWhereWithAggregatesInput | spellsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"spells"> | string
    name?: StringNullableWithAggregatesFilter<"spells"> | string | null
    projectId?: StringNullableWithAggregatesFilter<"spells"> | string | null
    graph?: JsonNullableWithAggregatesFilter<"spells">
    createdAt?: StringNullableWithAggregatesFilter<"spells"> | string | null
    updatedAt?: StringNullableWithAggregatesFilter<"spells"> | string | null
    type?: StringNullableWithAggregatesFilter<"spells"> | string | null
    spellReleaseId?: UuidNullableWithAggregatesFilter<"spells"> | string | null
  }

  export type tasksWhereInput = {
    AND?: tasksWhereInput | tasksWhereInput[]
    OR?: tasksWhereInput[]
    NOT?: tasksWhereInput | tasksWhereInput[]
    id?: IntFilter<"tasks"> | number
    status?: StringFilter<"tasks"> | string
    type?: StringFilter<"tasks"> | string
    objective?: StringFilter<"tasks"> | string
    eventData?: JsonFilter<"tasks">
    projectId?: StringFilter<"tasks"> | string
    date?: StringNullableFilter<"tasks"> | string | null
    steps?: StringFilter<"tasks"> | string
    agentId?: StringNullableFilter<"tasks"> | string | null
  }

  export type tasksOrderByWithRelationAndSearchRelevanceInput = {
    id?: SortOrder
    status?: SortOrder
    type?: SortOrder
    objective?: SortOrder
    eventData?: SortOrder
    projectId?: SortOrder
    date?: SortOrderInput | SortOrder
    steps?: SortOrder
    agentId?: SortOrderInput | SortOrder
    _relevance?: tasksOrderByRelevanceInput
  }

  export type tasksWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: tasksWhereInput | tasksWhereInput[]
    OR?: tasksWhereInput[]
    NOT?: tasksWhereInput | tasksWhereInput[]
    status?: StringFilter<"tasks"> | string
    type?: StringFilter<"tasks"> | string
    objective?: StringFilter<"tasks"> | string
    eventData?: JsonFilter<"tasks">
    projectId?: StringFilter<"tasks"> | string
    date?: StringNullableFilter<"tasks"> | string | null
    steps?: StringFilter<"tasks"> | string
    agentId?: StringNullableFilter<"tasks"> | string | null
  }, "id">

  export type tasksOrderByWithAggregationInput = {
    id?: SortOrder
    status?: SortOrder
    type?: SortOrder
    objective?: SortOrder
    eventData?: SortOrder
    projectId?: SortOrder
    date?: SortOrderInput | SortOrder
    steps?: SortOrder
    agentId?: SortOrderInput | SortOrder
    _count?: tasksCountOrderByAggregateInput
    _avg?: tasksAvgOrderByAggregateInput
    _max?: tasksMaxOrderByAggregateInput
    _min?: tasksMinOrderByAggregateInput
    _sum?: tasksSumOrderByAggregateInput
  }

  export type tasksScalarWhereWithAggregatesInput = {
    AND?: tasksScalarWhereWithAggregatesInput | tasksScalarWhereWithAggregatesInput[]
    OR?: tasksScalarWhereWithAggregatesInput[]
    NOT?: tasksScalarWhereWithAggregatesInput | tasksScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"tasks"> | number
    status?: StringWithAggregatesFilter<"tasks"> | string
    type?: StringWithAggregatesFilter<"tasks"> | string
    objective?: StringWithAggregatesFilter<"tasks"> | string
    eventData?: JsonWithAggregatesFilter<"tasks">
    projectId?: StringWithAggregatesFilter<"tasks"> | string
    date?: StringNullableWithAggregatesFilter<"tasks"> | string | null
    steps?: StringWithAggregatesFilter<"tasks"> | string
    agentId?: StringNullableWithAggregatesFilter<"tasks"> | string | null
  }

  export type agent_credentialsCreateInput = {
    created_at?: Date | string
    updated_at?: Date | string
    agents: agentsCreateNestedOneWithoutAgent_credentialsInput
    credentials: credentialsCreateNestedOneWithoutAgent_credentialsInput
  }

  export type agent_credentialsUncheckedCreateInput = {
    agentId: string
    credentialId: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type agent_credentialsUpdateInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    agents?: agentsUpdateOneRequiredWithoutAgent_credentialsNestedInput
    credentials?: credentialsUpdateOneRequiredWithoutAgent_credentialsNestedInput
  }

  export type agent_credentialsUncheckedUpdateInput = {
    agentId?: StringFieldUpdateOperationsInput | string
    credentialId?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type agent_credentialsCreateManyInput = {
    agentId: string
    credentialId: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type agent_credentialsUpdateManyMutationInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type agent_credentialsUncheckedUpdateManyInput = {
    agentId?: StringFieldUpdateOperationsInput | string
    credentialId?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type agentsCreateInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    agent_credentials?: agent_credentialsCreateNestedManyWithoutAgentsInput
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: spellReleasesCreateNestedOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput
    chatMessages?: chatMessagesCreateNestedManyWithoutAgentsInput
    graphEvents?: graphEventsCreateNestedManyWithoutAgentsInput
    pluginState?: pluginStateCreateNestedManyWithoutAgentsInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput
  }

  export type agentsUncheckedCreateInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    currentSpellReleaseId?: string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    agent_credentials?: agent_credentialsUncheckedCreateNestedManyWithoutAgentsInput
    chatMessages?: chatMessagesUncheckedCreateNestedManyWithoutAgentsInput
    graphEvents?: graphEventsUncheckedCreateNestedManyWithoutAgentsInput
    pluginState?: pluginStateUncheckedCreateNestedManyWithoutAgentsInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUncheckedCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput
  }

  export type agentsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    agent_credentials?: agent_credentialsUpdateManyWithoutAgentsNestedInput
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: spellReleasesUpdateOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesNestedInput
    chatMessages?: chatMessagesUpdateManyWithoutAgentsNestedInput
    graphEvents?: graphEventsUpdateManyWithoutAgentsNestedInput
    pluginState?: pluginStateUpdateManyWithoutAgentsNestedInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput
  }

  export type agentsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentSpellReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    agent_credentials?: agent_credentialsUncheckedUpdateManyWithoutAgentsNestedInput
    chatMessages?: chatMessagesUncheckedUpdateManyWithoutAgentsNestedInput
    graphEvents?: graphEventsUncheckedUpdateManyWithoutAgentsNestedInput
    pluginState?: pluginStateUncheckedUpdateManyWithoutAgentsNestedInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUncheckedUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput
  }

  export type agentsCreateManyInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    currentSpellReleaseId?: string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
  }

  export type agentsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
  }

  export type agentsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentSpellReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
  }

  export type chatMessagesCreateInput = {
    id?: string
    sender?: string | null
    connector: string
    content?: string | null
    conversationId?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    agents: agentsCreateNestedOneWithoutChatMessagesInput
  }

  export type chatMessagesUncheckedCreateInput = {
    id?: string
    agentId: string
    sender?: string | null
    connector: string
    content?: string | null
    conversationId?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type chatMessagesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: NullableStringFieldUpdateOperationsInput | string | null
    connector?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    agents?: agentsUpdateOneRequiredWithoutChatMessagesNestedInput
  }

  export type chatMessagesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    sender?: NullableStringFieldUpdateOperationsInput | string | null
    connector?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type chatMessagesCreateManyInput = {
    id?: string
    agentId: string
    sender?: string | null
    connector: string
    content?: string | null
    conversationId?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type chatMessagesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: NullableStringFieldUpdateOperationsInput | string | null
    connector?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type chatMessagesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    sender?: NullableStringFieldUpdateOperationsInput | string | null
    connector?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type credentialsCreateInput = {
    id?: string
    projectId: string
    name: string
    serviceType: string
    credentialType: string
    value: string
    description?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    agent_credentials?: agent_credentialsCreateNestedManyWithoutCredentialsInput
  }

  export type credentialsUncheckedCreateInput = {
    id?: string
    projectId: string
    name: string
    serviceType: string
    credentialType: string
    value: string
    description?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    agent_credentials?: agent_credentialsUncheckedCreateNestedManyWithoutCredentialsInput
  }

  export type credentialsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    credentialType?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    agent_credentials?: agent_credentialsUpdateManyWithoutCredentialsNestedInput
  }

  export type credentialsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    credentialType?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    agent_credentials?: agent_credentialsUncheckedUpdateManyWithoutCredentialsNestedInput
  }

  export type credentialsCreateManyInput = {
    id?: string
    projectId: string
    name: string
    serviceType: string
    credentialType: string
    value: string
    description?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type credentialsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    credentialType?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type credentialsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    credentialType?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type documentsCreateInput = {
    id: string
    type?: string | null
    projectId?: string | null
    date?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type documentsUncheckedCreateInput = {
    id: string
    type?: string | null
    projectId?: string | null
    date?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type documentsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type documentsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type documentsCreateManyInput = {
    id: string
    type?: string | null
    projectId?: string | null
    date?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type documentsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type documentsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type embeddingsCreateInput = {
    documentId?: string | null
    content?: string | null
    index?: number | null
  }

  export type embeddingsUncheckedCreateInput = {
    id?: number
    documentId?: string | null
    content?: string | null
    index?: number | null
  }

  export type embeddingsUpdateInput = {
    documentId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    index?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type embeddingsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    documentId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    index?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type embeddingsCreateManyInput = {
    id?: number
    documentId?: string | null
    content?: string | null
    index?: number | null
  }

  export type embeddingsUpdateManyMutationInput = {
    documentId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    index?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type embeddingsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    documentId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    index?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type public_eventsCreateInput = {
    id: string
    type?: string | null
    observer?: string | null
    sender?: string | null
    client?: string | null
    channel?: string | null
    channelType?: string | null
    projectId?: string | null
    content?: string | null
    agentId?: string | null
    entities?: public_eventsCreateentitiesInput | string[]
    date?: string | null
    rawData?: string | null
    connector?: string | null
  }

  export type public_eventsUncheckedCreateInput = {
    id: string
    type?: string | null
    observer?: string | null
    sender?: string | null
    client?: string | null
    channel?: string | null
    channelType?: string | null
    projectId?: string | null
    content?: string | null
    agentId?: string | null
    entities?: public_eventsCreateentitiesInput | string[]
    date?: string | null
    rawData?: string | null
    connector?: string | null
  }

  export type public_eventsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    observer?: NullableStringFieldUpdateOperationsInput | string | null
    sender?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    channelType?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    entities?: public_eventsUpdateentitiesInput | string[]
    date?: NullableStringFieldUpdateOperationsInput | string | null
    rawData?: NullableStringFieldUpdateOperationsInput | string | null
    connector?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type public_eventsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    observer?: NullableStringFieldUpdateOperationsInput | string | null
    sender?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    channelType?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    entities?: public_eventsUpdateentitiesInput | string[]
    date?: NullableStringFieldUpdateOperationsInput | string | null
    rawData?: NullableStringFieldUpdateOperationsInput | string | null
    connector?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type public_eventsCreateManyInput = {
    id: string
    type?: string | null
    observer?: string | null
    sender?: string | null
    client?: string | null
    channel?: string | null
    channelType?: string | null
    projectId?: string | null
    content?: string | null
    agentId?: string | null
    entities?: public_eventsCreateentitiesInput | string[]
    date?: string | null
    rawData?: string | null
    connector?: string | null
  }

  export type public_eventsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    observer?: NullableStringFieldUpdateOperationsInput | string | null
    sender?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    channelType?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    entities?: public_eventsUpdateentitiesInput | string[]
    date?: NullableStringFieldUpdateOperationsInput | string | null
    rawData?: NullableStringFieldUpdateOperationsInput | string | null
    connector?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type public_eventsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    observer?: NullableStringFieldUpdateOperationsInput | string | null
    sender?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    channelType?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    entities?: public_eventsUpdateentitiesInput | string[]
    date?: NullableStringFieldUpdateOperationsInput | string | null
    rawData?: NullableStringFieldUpdateOperationsInput | string | null
    connector?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type graphEventsCreateInput = {
    id?: string
    sender: string
    connector: string
    connectorData?: NullableJsonNullValueInput | InputJsonValue
    channel?: string | null
    content: string
    eventType: string
    created_at?: Date | string
    updated_at?: Date | string
    event?: NullableJsonNullValueInput | InputJsonValue
    observer?: string | null
    agents: agentsCreateNestedOneWithoutGraphEventsInput
  }

  export type graphEventsUncheckedCreateInput = {
    id?: string
    agentId: string
    sender: string
    connector: string
    connectorData?: NullableJsonNullValueInput | InputJsonValue
    channel?: string | null
    content: string
    eventType: string
    created_at?: Date | string
    updated_at?: Date | string
    event?: NullableJsonNullValueInput | InputJsonValue
    observer?: string | null
  }

  export type graphEventsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    connector?: StringFieldUpdateOperationsInput | string
    connectorData?: NullableJsonNullValueInput | InputJsonValue
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: NullableJsonNullValueInput | InputJsonValue
    observer?: NullableStringFieldUpdateOperationsInput | string | null
    agents?: agentsUpdateOneRequiredWithoutGraphEventsNestedInput
  }

  export type graphEventsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    connector?: StringFieldUpdateOperationsInput | string
    connectorData?: NullableJsonNullValueInput | InputJsonValue
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: NullableJsonNullValueInput | InputJsonValue
    observer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type graphEventsCreateManyInput = {
    id?: string
    agentId: string
    sender: string
    connector: string
    connectorData?: NullableJsonNullValueInput | InputJsonValue
    channel?: string | null
    content: string
    eventType: string
    created_at?: Date | string
    updated_at?: Date | string
    event?: NullableJsonNullValueInput | InputJsonValue
    observer?: string | null
  }

  export type graphEventsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    connector?: StringFieldUpdateOperationsInput | string
    connectorData?: NullableJsonNullValueInput | InputJsonValue
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: NullableJsonNullValueInput | InputJsonValue
    observer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type graphEventsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    connector?: StringFieldUpdateOperationsInput | string
    connectorData?: NullableJsonNullValueInput | InputJsonValue
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: NullableJsonNullValueInput | InputJsonValue
    observer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type public_knex_migrationsCreateInput = {
    name?: string | null
    batch?: number | null
    migration_time?: Date | string | null
  }

  export type public_knex_migrationsUncheckedCreateInput = {
    id?: number
    name?: string | null
    batch?: number | null
    migration_time?: Date | string | null
  }

  export type public_knex_migrationsUpdateInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    batch?: NullableIntFieldUpdateOperationsInput | number | null
    migration_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type public_knex_migrationsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    batch?: NullableIntFieldUpdateOperationsInput | number | null
    migration_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type public_knex_migrationsCreateManyInput = {
    id?: number
    name?: string | null
    batch?: number | null
    migration_time?: Date | string | null
  }

  export type public_knex_migrationsUpdateManyMutationInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    batch?: NullableIntFieldUpdateOperationsInput | number | null
    migration_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type public_knex_migrationsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    batch?: NullableIntFieldUpdateOperationsInput | number | null
    migration_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type public_knex_migrations_lockCreateInput = {
    is_locked?: number | null
  }

  export type public_knex_migrations_lockUncheckedCreateInput = {
    index?: number
    is_locked?: number | null
  }

  export type public_knex_migrations_lockUpdateInput = {
    is_locked?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type public_knex_migrations_lockUncheckedUpdateInput = {
    index?: IntFieldUpdateOperationsInput | number
    is_locked?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type public_knex_migrations_lockCreateManyInput = {
    index?: number
    is_locked?: number | null
  }

  export type public_knex_migrations_lockUpdateManyMutationInput = {
    is_locked?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type public_knex_migrations_lockUncheckedUpdateManyInput = {
    index?: IntFieldUpdateOperationsInput | number
    is_locked?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type knowledgeCreateInput = {
    id?: string
    name: string
    sourceUrl?: string | null
    dataType?: string | null
    data?: string | null
    projectId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    memoryId?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type knowledgeUncheckedCreateInput = {
    id?: string
    name: string
    sourceUrl?: string | null
    dataType?: string | null
    data?: string | null
    projectId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    memoryId?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type knowledgeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    dataType?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    memoryId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type knowledgeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    dataType?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    memoryId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type knowledgeCreateManyInput = {
    id?: string
    name: string
    sourceUrl?: string | null
    dataType?: string | null
    data?: string | null
    projectId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    memoryId?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type knowledgeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    dataType?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    memoryId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type knowledgeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    dataType?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    memoryId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type pluginStateCreateInput = {
    id?: string
    state?: NullableJsonNullValueInput | InputJsonValue
    plugin?: string | null
    agents?: agentsCreateNestedOneWithoutPluginStateInput
  }

  export type pluginStateUncheckedCreateInput = {
    id?: string
    agentId?: string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    plugin?: string | null
  }

  export type pluginStateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    state?: NullableJsonNullValueInput | InputJsonValue
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
    agents?: agentsUpdateOneWithoutPluginStateNestedInput
  }

  export type pluginStateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type pluginStateCreateManyInput = {
    id?: string
    agentId?: string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    plugin?: string | null
  }

  export type pluginStateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    state?: NullableJsonNullValueInput | InputJsonValue
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type pluginStateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableJsonNullValueInput | InputJsonValue
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type requestCreateInput = {
    id: string
    projectId: string
    requestData?: string | null
    responseData?: string | null
    duration: number
    status?: string | null
    statusCode?: number | null
    model?: string | null
    parameters?: string | null
    createdAt?: Date | string | null
    provider: string
    type: string
    hidden?: boolean
    processed?: boolean
    cost?: number | null
    spell?: string | null
    nodeId?: string | null
    agentId?: string
  }

  export type requestUncheckedCreateInput = {
    id: string
    projectId: string
    requestData?: string | null
    responseData?: string | null
    duration: number
    status?: string | null
    statusCode?: number | null
    model?: string | null
    parameters?: string | null
    createdAt?: Date | string | null
    provider: string
    type: string
    hidden?: boolean
    processed?: boolean
    cost?: number | null
    spell?: string | null
    nodeId?: string | null
    agentId?: string
  }

  export type requestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    requestData?: NullableStringFieldUpdateOperationsInput | string | null
    responseData?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    parameters?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    provider?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    hidden?: BoolFieldUpdateOperationsInput | boolean
    processed?: BoolFieldUpdateOperationsInput | boolean
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    spell?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: StringFieldUpdateOperationsInput | string
  }

  export type requestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    requestData?: NullableStringFieldUpdateOperationsInput | string | null
    responseData?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    parameters?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    provider?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    hidden?: BoolFieldUpdateOperationsInput | boolean
    processed?: BoolFieldUpdateOperationsInput | boolean
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    spell?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: StringFieldUpdateOperationsInput | string
  }

  export type requestCreateManyInput = {
    id: string
    projectId: string
    requestData?: string | null
    responseData?: string | null
    duration: number
    status?: string | null
    statusCode?: number | null
    model?: string | null
    parameters?: string | null
    createdAt?: Date | string | null
    provider: string
    type: string
    hidden?: boolean
    processed?: boolean
    cost?: number | null
    spell?: string | null
    nodeId?: string | null
    agentId?: string
  }

  export type requestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    requestData?: NullableStringFieldUpdateOperationsInput | string | null
    responseData?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    parameters?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    provider?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    hidden?: BoolFieldUpdateOperationsInput | boolean
    processed?: BoolFieldUpdateOperationsInput | boolean
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    spell?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: StringFieldUpdateOperationsInput | string
  }

  export type requestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    requestData?: NullableStringFieldUpdateOperationsInput | string | null
    responseData?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    status?: NullableStringFieldUpdateOperationsInput | string | null
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    parameters?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    provider?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    hidden?: BoolFieldUpdateOperationsInput | boolean
    processed?: BoolFieldUpdateOperationsInput | boolean
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    spell?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: StringFieldUpdateOperationsInput | string
  }

  export type spellReleasesCreateInput = {
    id: string
    description?: string | null
    spellId?: string | null
    projectId?: string | null
    createdAt?: Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: agentsCreateNestedManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput
    agents_spellReleases_agentIdToagents: agentsCreateNestedOneWithoutSpellReleases_spellReleases_agentIdToagentsInput
    spells?: spellsCreateNestedManyWithoutSpellReleasesInput
  }

  export type spellReleasesUncheckedCreateInput = {
    id: string
    description?: string | null
    agentId: string
    spellId?: string | null
    projectId?: string | null
    createdAt?: Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: agentsUncheckedCreateNestedManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput
    spells?: spellsUncheckedCreateNestedManyWithoutSpellReleasesInput
  }

  export type spellReleasesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    spellId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: agentsUpdateManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesNestedInput
    agents_spellReleases_agentIdToagents?: agentsUpdateOneRequiredWithoutSpellReleases_spellReleases_agentIdToagentsNestedInput
    spells?: spellsUpdateManyWithoutSpellReleasesNestedInput
  }

  export type spellReleasesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: StringFieldUpdateOperationsInput | string
    spellId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: agentsUncheckedUpdateManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesNestedInput
    spells?: spellsUncheckedUpdateManyWithoutSpellReleasesNestedInput
  }

  export type spellReleasesCreateManyInput = {
    id: string
    description?: string | null
    agentId: string
    spellId?: string | null
    projectId?: string | null
    createdAt?: Date | string | null
  }

  export type spellReleasesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    spellId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type spellReleasesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: StringFieldUpdateOperationsInput | string
    spellId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type spellsCreateInput = {
    id: string
    name?: string | null
    projectId?: string | null
    graph?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: string | null
    updatedAt?: string | null
    type?: string | null
    spellReleases?: spellReleasesCreateNestedOneWithoutSpellsInput
  }

  export type spellsUncheckedCreateInput = {
    id: string
    name?: string | null
    projectId?: string | null
    graph?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: string | null
    updatedAt?: string | null
    type?: string | null
    spellReleaseId?: string | null
  }

  export type spellsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    graph?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    spellReleases?: spellReleasesUpdateOneWithoutSpellsNestedInput
  }

  export type spellsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    graph?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    spellReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type spellsCreateManyInput = {
    id: string
    name?: string | null
    projectId?: string | null
    graph?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: string | null
    updatedAt?: string | null
    type?: string | null
    spellReleaseId?: string | null
  }

  export type spellsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    graph?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type spellsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    graph?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    spellReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tasksCreateInput = {
    status: string
    type: string
    objective: string
    eventData: JsonNullValueInput | InputJsonValue
    projectId: string
    date?: string | null
    steps: string
    agentId?: string | null
  }

  export type tasksUncheckedCreateInput = {
    id?: number
    status: string
    type: string
    objective: string
    eventData: JsonNullValueInput | InputJsonValue
    projectId: string
    date?: string | null
    steps: string
    agentId?: string | null
  }

  export type tasksUpdateInput = {
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    objective?: StringFieldUpdateOperationsInput | string
    eventData?: JsonNullValueInput | InputJsonValue
    projectId?: StringFieldUpdateOperationsInput | string
    date?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tasksUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    objective?: StringFieldUpdateOperationsInput | string
    eventData?: JsonNullValueInput | InputJsonValue
    projectId?: StringFieldUpdateOperationsInput | string
    date?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tasksCreateManyInput = {
    id?: number
    status: string
    type: string
    objective: string
    eventData: JsonNullValueInput | InputJsonValue
    projectId: string
    date?: string | null
    steps: string
    agentId?: string | null
  }

  export type tasksUpdateManyMutationInput = {
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    objective?: StringFieldUpdateOperationsInput | string
    eventData?: JsonNullValueInput | InputJsonValue
    projectId?: StringFieldUpdateOperationsInput | string
    date?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tasksUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    objective?: StringFieldUpdateOperationsInput | string
    eventData?: JsonNullValueInput | InputJsonValue
    projectId?: StringFieldUpdateOperationsInput | string
    date?: NullableStringFieldUpdateOperationsInput | string | null
    steps?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AgentsRelationFilter = {
    is?: agentsWhereInput
    isNot?: agentsWhereInput
  }

  export type CredentialsRelationFilter = {
    is?: credentialsWhereInput
    isNot?: credentialsWhereInput
  }

  export type agent_credentialsOrderByRelevanceInput = {
    fields: agent_credentialsOrderByRelevanceFieldEnum | agent_credentialsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type agent_credentialsAgentIdCredentialIdCompoundUniqueInput = {
    agentId: string
    credentialId: string
  }

  export type agent_credentialsCountOrderByAggregateInput = {
    agentId?: SortOrder
    credentialId?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type agent_credentialsMaxOrderByAggregateInput = {
    agentId?: SortOrder
    credentialId?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type agent_credentialsMinOrderByAggregateInput = {
    agentId?: SortOrder
    credentialId?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type Agent_credentialsListRelationFilter = {
    every?: agent_credentialsWhereInput
    some?: agent_credentialsWhereInput
    none?: agent_credentialsWhereInput
  }

  export type SpellReleasesNullableRelationFilter = {
    is?: spellReleasesWhereInput | null
    isNot?: spellReleasesWhereInput | null
  }

  export type ChatMessagesListRelationFilter = {
    every?: chatMessagesWhereInput
    some?: chatMessagesWhereInput
    none?: chatMessagesWhereInput
  }

  export type GraphEventsListRelationFilter = {
    every?: graphEventsWhereInput
    some?: graphEventsWhereInput
    none?: graphEventsWhereInput
  }

  export type PluginStateListRelationFilter = {
    every?: pluginStateWhereInput
    some?: pluginStateWhereInput
    none?: pluginStateWhereInput
  }

  export type SpellReleasesListRelationFilter = {
    every?: spellReleasesWhereInput
    some?: spellReleasesWhereInput
    none?: spellReleasesWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type agent_credentialsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type chatMessagesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type graphEventsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type pluginStateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type spellReleasesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type agentsOrderByRelevanceInput = {
    fields: agentsOrderByRelevanceFieldEnum | agentsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type agentsCountOrderByAggregateInput = {
    id?: SortOrder
    rootSpell?: SortOrder
    publicVariables?: SortOrder
    secrets?: SortOrder
    name?: SortOrder
    enabled?: SortOrder
    updatedAt?: SortOrder
    pingedAt?: SortOrder
    projectId?: SortOrder
    data?: SortOrder
    runState?: SortOrder
    image?: SortOrder
    rootSpellId?: SortOrder
    default?: SortOrder
    createdAt?: SortOrder
    currentSpellReleaseId?: SortOrder
    embedModel?: SortOrder
    version?: SortOrder
    embeddingProvider?: SortOrder
    embeddingModel?: SortOrder
    isDraft?: SortOrder
  }

  export type agentsMaxOrderByAggregateInput = {
    id?: SortOrder
    publicVariables?: SortOrder
    secrets?: SortOrder
    name?: SortOrder
    enabled?: SortOrder
    updatedAt?: SortOrder
    pingedAt?: SortOrder
    projectId?: SortOrder
    runState?: SortOrder
    image?: SortOrder
    rootSpellId?: SortOrder
    default?: SortOrder
    createdAt?: SortOrder
    currentSpellReleaseId?: SortOrder
    embedModel?: SortOrder
    version?: SortOrder
    embeddingProvider?: SortOrder
    embeddingModel?: SortOrder
    isDraft?: SortOrder
  }

  export type agentsMinOrderByAggregateInput = {
    id?: SortOrder
    publicVariables?: SortOrder
    secrets?: SortOrder
    name?: SortOrder
    enabled?: SortOrder
    updatedAt?: SortOrder
    pingedAt?: SortOrder
    projectId?: SortOrder
    runState?: SortOrder
    image?: SortOrder
    rootSpellId?: SortOrder
    default?: SortOrder
    createdAt?: SortOrder
    currentSpellReleaseId?: SortOrder
    embedModel?: SortOrder
    version?: SortOrder
    embeddingProvider?: SortOrder
    embeddingModel?: SortOrder
    isDraft?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type chatMessagesOrderByRelevanceInput = {
    fields: chatMessagesOrderByRelevanceFieldEnum | chatMessagesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type chatMessagesCountOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    sender?: SortOrder
    connector?: SortOrder
    content?: SortOrder
    conversationId?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type chatMessagesMaxOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    sender?: SortOrder
    connector?: SortOrder
    content?: SortOrder
    conversationId?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type chatMessagesMinOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    sender?: SortOrder
    connector?: SortOrder
    content?: SortOrder
    conversationId?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type credentialsOrderByRelevanceInput = {
    fields: credentialsOrderByRelevanceFieldEnum | credentialsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type credentialsCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    serviceType?: SortOrder
    credentialType?: SortOrder
    value?: SortOrder
    description?: SortOrder
    metadata?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type credentialsMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    serviceType?: SortOrder
    credentialType?: SortOrder
    value?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type credentialsMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    serviceType?: SortOrder
    credentialType?: SortOrder
    value?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type documentsOrderByRelevanceInput = {
    fields: documentsOrderByRelevanceFieldEnum | documentsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type documentsCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    projectId?: SortOrder
    date?: SortOrder
    metadata?: SortOrder
  }

  export type documentsMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    projectId?: SortOrder
    date?: SortOrder
  }

  export type documentsMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    projectId?: SortOrder
    date?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type embeddingsOrderByRelevanceInput = {
    fields: embeddingsOrderByRelevanceFieldEnum | embeddingsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type embeddingsCountOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    content?: SortOrder
    index?: SortOrder
  }

  export type embeddingsAvgOrderByAggregateInput = {
    id?: SortOrder
    index?: SortOrder
  }

  export type embeddingsMaxOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    content?: SortOrder
    index?: SortOrder
  }

  export type embeddingsMinOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    content?: SortOrder
    index?: SortOrder
  }

  export type embeddingsSumOrderByAggregateInput = {
    id?: SortOrder
    index?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type public_eventsOrderByRelevanceInput = {
    fields: public_eventsOrderByRelevanceFieldEnum | public_eventsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type public_eventsCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    observer?: SortOrder
    sender?: SortOrder
    client?: SortOrder
    channel?: SortOrder
    channelType?: SortOrder
    projectId?: SortOrder
    content?: SortOrder
    agentId?: SortOrder
    entities?: SortOrder
    date?: SortOrder
    rawData?: SortOrder
    connector?: SortOrder
  }

  export type public_eventsMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    observer?: SortOrder
    sender?: SortOrder
    client?: SortOrder
    channel?: SortOrder
    channelType?: SortOrder
    projectId?: SortOrder
    content?: SortOrder
    agentId?: SortOrder
    date?: SortOrder
    rawData?: SortOrder
    connector?: SortOrder
  }

  export type public_eventsMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    observer?: SortOrder
    sender?: SortOrder
    client?: SortOrder
    channel?: SortOrder
    channelType?: SortOrder
    projectId?: SortOrder
    content?: SortOrder
    agentId?: SortOrder
    date?: SortOrder
    rawData?: SortOrder
    connector?: SortOrder
  }

  export type graphEventsOrderByRelevanceInput = {
    fields: graphEventsOrderByRelevanceFieldEnum | graphEventsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type graphEventsCountOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    sender?: SortOrder
    connector?: SortOrder
    connectorData?: SortOrder
    channel?: SortOrder
    content?: SortOrder
    eventType?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    event?: SortOrder
    observer?: SortOrder
  }

  export type graphEventsMaxOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    sender?: SortOrder
    connector?: SortOrder
    channel?: SortOrder
    content?: SortOrder
    eventType?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    observer?: SortOrder
  }

  export type graphEventsMinOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    sender?: SortOrder
    connector?: SortOrder
    channel?: SortOrder
    content?: SortOrder
    eventType?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    observer?: SortOrder
  }

  export type public_knex_migrationsOrderByRelevanceInput = {
    fields: public_knex_migrationsOrderByRelevanceFieldEnum | public_knex_migrationsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type public_knex_migrationsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    batch?: SortOrder
    migration_time?: SortOrder
  }

  export type public_knex_migrationsAvgOrderByAggregateInput = {
    id?: SortOrder
    batch?: SortOrder
  }

  export type public_knex_migrationsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    batch?: SortOrder
    migration_time?: SortOrder
  }

  export type public_knex_migrationsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    batch?: SortOrder
    migration_time?: SortOrder
  }

  export type public_knex_migrationsSumOrderByAggregateInput = {
    id?: SortOrder
    batch?: SortOrder
  }

  export type public_knex_migrations_lockCountOrderByAggregateInput = {
    index?: SortOrder
    is_locked?: SortOrder
  }

  export type public_knex_migrations_lockAvgOrderByAggregateInput = {
    index?: SortOrder
    is_locked?: SortOrder
  }

  export type public_knex_migrations_lockMaxOrderByAggregateInput = {
    index?: SortOrder
    is_locked?: SortOrder
  }

  export type public_knex_migrations_lockMinOrderByAggregateInput = {
    index?: SortOrder
    is_locked?: SortOrder
  }

  export type public_knex_migrations_lockSumOrderByAggregateInput = {
    index?: SortOrder
    is_locked?: SortOrder
  }

  export type knowledgeOrderByRelevanceInput = {
    fields: knowledgeOrderByRelevanceFieldEnum | knowledgeOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type knowledgeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sourceUrl?: SortOrder
    dataType?: SortOrder
    data?: SortOrder
    projectId?: SortOrder
    metadata?: SortOrder
    memoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type knowledgeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sourceUrl?: SortOrder
    dataType?: SortOrder
    data?: SortOrder
    projectId?: SortOrder
    memoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type knowledgeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sourceUrl?: SortOrder
    dataType?: SortOrder
    data?: SortOrder
    projectId?: SortOrder
    memoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentsNullableRelationFilter = {
    is?: agentsWhereInput | null
    isNot?: agentsWhereInput | null
  }

  export type pluginStateOrderByRelevanceInput = {
    fields: pluginStateOrderByRelevanceFieldEnum | pluginStateOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type pluginStateAgentIdPluginCompoundUniqueInput = {
    agentId: string
    plugin: string
  }

  export type pluginStateCountOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    state?: SortOrder
    plugin?: SortOrder
  }

  export type pluginStateMaxOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    plugin?: SortOrder
  }

  export type pluginStateMinOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    plugin?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type requestOrderByRelevanceInput = {
    fields: requestOrderByRelevanceFieldEnum | requestOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type requestCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    requestData?: SortOrder
    responseData?: SortOrder
    duration?: SortOrder
    status?: SortOrder
    statusCode?: SortOrder
    model?: SortOrder
    parameters?: SortOrder
    createdAt?: SortOrder
    provider?: SortOrder
    type?: SortOrder
    hidden?: SortOrder
    processed?: SortOrder
    cost?: SortOrder
    spell?: SortOrder
    nodeId?: SortOrder
    agentId?: SortOrder
  }

  export type requestAvgOrderByAggregateInput = {
    duration?: SortOrder
    statusCode?: SortOrder
    cost?: SortOrder
  }

  export type requestMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    requestData?: SortOrder
    responseData?: SortOrder
    duration?: SortOrder
    status?: SortOrder
    statusCode?: SortOrder
    model?: SortOrder
    parameters?: SortOrder
    createdAt?: SortOrder
    provider?: SortOrder
    type?: SortOrder
    hidden?: SortOrder
    processed?: SortOrder
    cost?: SortOrder
    spell?: SortOrder
    nodeId?: SortOrder
    agentId?: SortOrder
  }

  export type requestMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    requestData?: SortOrder
    responseData?: SortOrder
    duration?: SortOrder
    status?: SortOrder
    statusCode?: SortOrder
    model?: SortOrder
    parameters?: SortOrder
    createdAt?: SortOrder
    provider?: SortOrder
    type?: SortOrder
    hidden?: SortOrder
    processed?: SortOrder
    cost?: SortOrder
    spell?: SortOrder
    nodeId?: SortOrder
    agentId?: SortOrder
  }

  export type requestSumOrderByAggregateInput = {
    duration?: SortOrder
    statusCode?: SortOrder
    cost?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type AgentsListRelationFilter = {
    every?: agentsWhereInput
    some?: agentsWhereInput
    none?: agentsWhereInput
  }

  export type SpellsListRelationFilter = {
    every?: spellsWhereInput
    some?: spellsWhereInput
    none?: spellsWhereInput
  }

  export type agentsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type spellsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type spellReleasesOrderByRelevanceInput = {
    fields: spellReleasesOrderByRelevanceFieldEnum | spellReleasesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type spellReleasesCountOrderByAggregateInput = {
    id?: SortOrder
    description?: SortOrder
    agentId?: SortOrder
    spellId?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
  }

  export type spellReleasesMaxOrderByAggregateInput = {
    id?: SortOrder
    description?: SortOrder
    agentId?: SortOrder
    spellId?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
  }

  export type spellReleasesMinOrderByAggregateInput = {
    id?: SortOrder
    description?: SortOrder
    agentId?: SortOrder
    spellId?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
  }

  export type spellsOrderByRelevanceInput = {
    fields: spellsOrderByRelevanceFieldEnum | spellsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type spellsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    projectId?: SortOrder
    graph?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    spellReleaseId?: SortOrder
  }

  export type spellsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    spellReleaseId?: SortOrder
  }

  export type spellsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    spellReleaseId?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type tasksOrderByRelevanceInput = {
    fields: tasksOrderByRelevanceFieldEnum | tasksOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type tasksCountOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    type?: SortOrder
    objective?: SortOrder
    eventData?: SortOrder
    projectId?: SortOrder
    date?: SortOrder
    steps?: SortOrder
    agentId?: SortOrder
  }

  export type tasksAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type tasksMaxOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    type?: SortOrder
    objective?: SortOrder
    projectId?: SortOrder
    date?: SortOrder
    steps?: SortOrder
    agentId?: SortOrder
  }

  export type tasksMinOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    type?: SortOrder
    objective?: SortOrder
    projectId?: SortOrder
    date?: SortOrder
    steps?: SortOrder
    agentId?: SortOrder
  }

  export type tasksSumOrderByAggregateInput = {
    id?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type agentsCreateNestedOneWithoutAgent_credentialsInput = {
    create?: XOR<agentsCreateWithoutAgent_credentialsInput, agentsUncheckedCreateWithoutAgent_credentialsInput>
    connectOrCreate?: agentsCreateOrConnectWithoutAgent_credentialsInput
    connect?: agentsWhereUniqueInput
  }

  export type credentialsCreateNestedOneWithoutAgent_credentialsInput = {
    create?: XOR<credentialsCreateWithoutAgent_credentialsInput, credentialsUncheckedCreateWithoutAgent_credentialsInput>
    connectOrCreate?: credentialsCreateOrConnectWithoutAgent_credentialsInput
    connect?: credentialsWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type agentsUpdateOneRequiredWithoutAgent_credentialsNestedInput = {
    create?: XOR<agentsCreateWithoutAgent_credentialsInput, agentsUncheckedCreateWithoutAgent_credentialsInput>
    connectOrCreate?: agentsCreateOrConnectWithoutAgent_credentialsInput
    upsert?: agentsUpsertWithoutAgent_credentialsInput
    connect?: agentsWhereUniqueInput
    update?: XOR<XOR<agentsUpdateToOneWithWhereWithoutAgent_credentialsInput, agentsUpdateWithoutAgent_credentialsInput>, agentsUncheckedUpdateWithoutAgent_credentialsInput>
  }

  export type credentialsUpdateOneRequiredWithoutAgent_credentialsNestedInput = {
    create?: XOR<credentialsCreateWithoutAgent_credentialsInput, credentialsUncheckedCreateWithoutAgent_credentialsInput>
    connectOrCreate?: credentialsCreateOrConnectWithoutAgent_credentialsInput
    upsert?: credentialsUpsertWithoutAgent_credentialsInput
    connect?: credentialsWhereUniqueInput
    update?: XOR<XOR<credentialsUpdateToOneWithWhereWithoutAgent_credentialsInput, credentialsUpdateWithoutAgent_credentialsInput>, credentialsUncheckedUpdateWithoutAgent_credentialsInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type agent_credentialsCreateNestedManyWithoutAgentsInput = {
    create?: XOR<agent_credentialsCreateWithoutAgentsInput, agent_credentialsUncheckedCreateWithoutAgentsInput> | agent_credentialsCreateWithoutAgentsInput[] | agent_credentialsUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: agent_credentialsCreateOrConnectWithoutAgentsInput | agent_credentialsCreateOrConnectWithoutAgentsInput[]
    createMany?: agent_credentialsCreateManyAgentsInputEnvelope
    connect?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
  }

  export type spellReleasesCreateNestedOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput = {
    create?: XOR<spellReleasesCreateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput, spellReleasesUncheckedCreateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput>
    connectOrCreate?: spellReleasesCreateOrConnectWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput
    connect?: spellReleasesWhereUniqueInput
  }

  export type chatMessagesCreateNestedManyWithoutAgentsInput = {
    create?: XOR<chatMessagesCreateWithoutAgentsInput, chatMessagesUncheckedCreateWithoutAgentsInput> | chatMessagesCreateWithoutAgentsInput[] | chatMessagesUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: chatMessagesCreateOrConnectWithoutAgentsInput | chatMessagesCreateOrConnectWithoutAgentsInput[]
    createMany?: chatMessagesCreateManyAgentsInputEnvelope
    connect?: chatMessagesWhereUniqueInput | chatMessagesWhereUniqueInput[]
  }

  export type graphEventsCreateNestedManyWithoutAgentsInput = {
    create?: XOR<graphEventsCreateWithoutAgentsInput, graphEventsUncheckedCreateWithoutAgentsInput> | graphEventsCreateWithoutAgentsInput[] | graphEventsUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: graphEventsCreateOrConnectWithoutAgentsInput | graphEventsCreateOrConnectWithoutAgentsInput[]
    createMany?: graphEventsCreateManyAgentsInputEnvelope
    connect?: graphEventsWhereUniqueInput | graphEventsWhereUniqueInput[]
  }

  export type pluginStateCreateNestedManyWithoutAgentsInput = {
    create?: XOR<pluginStateCreateWithoutAgentsInput, pluginStateUncheckedCreateWithoutAgentsInput> | pluginStateCreateWithoutAgentsInput[] | pluginStateUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: pluginStateCreateOrConnectWithoutAgentsInput | pluginStateCreateOrConnectWithoutAgentsInput[]
    createMany?: pluginStateCreateManyAgentsInputEnvelope
    connect?: pluginStateWhereUniqueInput | pluginStateWhereUniqueInput[]
  }

  export type spellReleasesCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput = {
    create?: XOR<spellReleasesCreateWithoutAgents_spellReleases_agentIdToagentsInput, spellReleasesUncheckedCreateWithoutAgents_spellReleases_agentIdToagentsInput> | spellReleasesCreateWithoutAgents_spellReleases_agentIdToagentsInput[] | spellReleasesUncheckedCreateWithoutAgents_spellReleases_agentIdToagentsInput[]
    connectOrCreate?: spellReleasesCreateOrConnectWithoutAgents_spellReleases_agentIdToagentsInput | spellReleasesCreateOrConnectWithoutAgents_spellReleases_agentIdToagentsInput[]
    createMany?: spellReleasesCreateManyAgents_spellReleases_agentIdToagentsInputEnvelope
    connect?: spellReleasesWhereUniqueInput | spellReleasesWhereUniqueInput[]
  }

  export type agent_credentialsUncheckedCreateNestedManyWithoutAgentsInput = {
    create?: XOR<agent_credentialsCreateWithoutAgentsInput, agent_credentialsUncheckedCreateWithoutAgentsInput> | agent_credentialsCreateWithoutAgentsInput[] | agent_credentialsUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: agent_credentialsCreateOrConnectWithoutAgentsInput | agent_credentialsCreateOrConnectWithoutAgentsInput[]
    createMany?: agent_credentialsCreateManyAgentsInputEnvelope
    connect?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
  }

  export type chatMessagesUncheckedCreateNestedManyWithoutAgentsInput = {
    create?: XOR<chatMessagesCreateWithoutAgentsInput, chatMessagesUncheckedCreateWithoutAgentsInput> | chatMessagesCreateWithoutAgentsInput[] | chatMessagesUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: chatMessagesCreateOrConnectWithoutAgentsInput | chatMessagesCreateOrConnectWithoutAgentsInput[]
    createMany?: chatMessagesCreateManyAgentsInputEnvelope
    connect?: chatMessagesWhereUniqueInput | chatMessagesWhereUniqueInput[]
  }

  export type graphEventsUncheckedCreateNestedManyWithoutAgentsInput = {
    create?: XOR<graphEventsCreateWithoutAgentsInput, graphEventsUncheckedCreateWithoutAgentsInput> | graphEventsCreateWithoutAgentsInput[] | graphEventsUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: graphEventsCreateOrConnectWithoutAgentsInput | graphEventsCreateOrConnectWithoutAgentsInput[]
    createMany?: graphEventsCreateManyAgentsInputEnvelope
    connect?: graphEventsWhereUniqueInput | graphEventsWhereUniqueInput[]
  }

  export type pluginStateUncheckedCreateNestedManyWithoutAgentsInput = {
    create?: XOR<pluginStateCreateWithoutAgentsInput, pluginStateUncheckedCreateWithoutAgentsInput> | pluginStateCreateWithoutAgentsInput[] | pluginStateUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: pluginStateCreateOrConnectWithoutAgentsInput | pluginStateCreateOrConnectWithoutAgentsInput[]
    createMany?: pluginStateCreateManyAgentsInputEnvelope
    connect?: pluginStateWhereUniqueInput | pluginStateWhereUniqueInput[]
  }

  export type spellReleasesUncheckedCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput = {
    create?: XOR<spellReleasesCreateWithoutAgents_spellReleases_agentIdToagentsInput, spellReleasesUncheckedCreateWithoutAgents_spellReleases_agentIdToagentsInput> | spellReleasesCreateWithoutAgents_spellReleases_agentIdToagentsInput[] | spellReleasesUncheckedCreateWithoutAgents_spellReleases_agentIdToagentsInput[]
    connectOrCreate?: spellReleasesCreateOrConnectWithoutAgents_spellReleases_agentIdToagentsInput | spellReleasesCreateOrConnectWithoutAgents_spellReleases_agentIdToagentsInput[]
    createMany?: spellReleasesCreateManyAgents_spellReleases_agentIdToagentsInputEnvelope
    connect?: spellReleasesWhereUniqueInput | spellReleasesWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type agent_credentialsUpdateManyWithoutAgentsNestedInput = {
    create?: XOR<agent_credentialsCreateWithoutAgentsInput, agent_credentialsUncheckedCreateWithoutAgentsInput> | agent_credentialsCreateWithoutAgentsInput[] | agent_credentialsUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: agent_credentialsCreateOrConnectWithoutAgentsInput | agent_credentialsCreateOrConnectWithoutAgentsInput[]
    upsert?: agent_credentialsUpsertWithWhereUniqueWithoutAgentsInput | agent_credentialsUpsertWithWhereUniqueWithoutAgentsInput[]
    createMany?: agent_credentialsCreateManyAgentsInputEnvelope
    set?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    disconnect?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    delete?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    connect?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    update?: agent_credentialsUpdateWithWhereUniqueWithoutAgentsInput | agent_credentialsUpdateWithWhereUniqueWithoutAgentsInput[]
    updateMany?: agent_credentialsUpdateManyWithWhereWithoutAgentsInput | agent_credentialsUpdateManyWithWhereWithoutAgentsInput[]
    deleteMany?: agent_credentialsScalarWhereInput | agent_credentialsScalarWhereInput[]
  }

  export type spellReleasesUpdateOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesNestedInput = {
    create?: XOR<spellReleasesCreateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput, spellReleasesUncheckedCreateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput>
    connectOrCreate?: spellReleasesCreateOrConnectWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput
    upsert?: spellReleasesUpsertWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput
    disconnect?: spellReleasesWhereInput | boolean
    delete?: spellReleasesWhereInput | boolean
    connect?: spellReleasesWhereUniqueInput
    update?: XOR<XOR<spellReleasesUpdateToOneWithWhereWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput, spellReleasesUpdateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput>, spellReleasesUncheckedUpdateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput>
  }

  export type chatMessagesUpdateManyWithoutAgentsNestedInput = {
    create?: XOR<chatMessagesCreateWithoutAgentsInput, chatMessagesUncheckedCreateWithoutAgentsInput> | chatMessagesCreateWithoutAgentsInput[] | chatMessagesUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: chatMessagesCreateOrConnectWithoutAgentsInput | chatMessagesCreateOrConnectWithoutAgentsInput[]
    upsert?: chatMessagesUpsertWithWhereUniqueWithoutAgentsInput | chatMessagesUpsertWithWhereUniqueWithoutAgentsInput[]
    createMany?: chatMessagesCreateManyAgentsInputEnvelope
    set?: chatMessagesWhereUniqueInput | chatMessagesWhereUniqueInput[]
    disconnect?: chatMessagesWhereUniqueInput | chatMessagesWhereUniqueInput[]
    delete?: chatMessagesWhereUniqueInput | chatMessagesWhereUniqueInput[]
    connect?: chatMessagesWhereUniqueInput | chatMessagesWhereUniqueInput[]
    update?: chatMessagesUpdateWithWhereUniqueWithoutAgentsInput | chatMessagesUpdateWithWhereUniqueWithoutAgentsInput[]
    updateMany?: chatMessagesUpdateManyWithWhereWithoutAgentsInput | chatMessagesUpdateManyWithWhereWithoutAgentsInput[]
    deleteMany?: chatMessagesScalarWhereInput | chatMessagesScalarWhereInput[]
  }

  export type graphEventsUpdateManyWithoutAgentsNestedInput = {
    create?: XOR<graphEventsCreateWithoutAgentsInput, graphEventsUncheckedCreateWithoutAgentsInput> | graphEventsCreateWithoutAgentsInput[] | graphEventsUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: graphEventsCreateOrConnectWithoutAgentsInput | graphEventsCreateOrConnectWithoutAgentsInput[]
    upsert?: graphEventsUpsertWithWhereUniqueWithoutAgentsInput | graphEventsUpsertWithWhereUniqueWithoutAgentsInput[]
    createMany?: graphEventsCreateManyAgentsInputEnvelope
    set?: graphEventsWhereUniqueInput | graphEventsWhereUniqueInput[]
    disconnect?: graphEventsWhereUniqueInput | graphEventsWhereUniqueInput[]
    delete?: graphEventsWhereUniqueInput | graphEventsWhereUniqueInput[]
    connect?: graphEventsWhereUniqueInput | graphEventsWhereUniqueInput[]
    update?: graphEventsUpdateWithWhereUniqueWithoutAgentsInput | graphEventsUpdateWithWhereUniqueWithoutAgentsInput[]
    updateMany?: graphEventsUpdateManyWithWhereWithoutAgentsInput | graphEventsUpdateManyWithWhereWithoutAgentsInput[]
    deleteMany?: graphEventsScalarWhereInput | graphEventsScalarWhereInput[]
  }

  export type pluginStateUpdateManyWithoutAgentsNestedInput = {
    create?: XOR<pluginStateCreateWithoutAgentsInput, pluginStateUncheckedCreateWithoutAgentsInput> | pluginStateCreateWithoutAgentsInput[] | pluginStateUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: pluginStateCreateOrConnectWithoutAgentsInput | pluginStateCreateOrConnectWithoutAgentsInput[]
    upsert?: pluginStateUpsertWithWhereUniqueWithoutAgentsInput | pluginStateUpsertWithWhereUniqueWithoutAgentsInput[]
    createMany?: pluginStateCreateManyAgentsInputEnvelope
    set?: pluginStateWhereUniqueInput | pluginStateWhereUniqueInput[]
    disconnect?: pluginStateWhereUniqueInput | pluginStateWhereUniqueInput[]
    delete?: pluginStateWhereUniqueInput | pluginStateWhereUniqueInput[]
    connect?: pluginStateWhereUniqueInput | pluginStateWhereUniqueInput[]
    update?: pluginStateUpdateWithWhereUniqueWithoutAgentsInput | pluginStateUpdateWithWhereUniqueWithoutAgentsInput[]
    updateMany?: pluginStateUpdateManyWithWhereWithoutAgentsInput | pluginStateUpdateManyWithWhereWithoutAgentsInput[]
    deleteMany?: pluginStateScalarWhereInput | pluginStateScalarWhereInput[]
  }

  export type spellReleasesUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput = {
    create?: XOR<spellReleasesCreateWithoutAgents_spellReleases_agentIdToagentsInput, spellReleasesUncheckedCreateWithoutAgents_spellReleases_agentIdToagentsInput> | spellReleasesCreateWithoutAgents_spellReleases_agentIdToagentsInput[] | spellReleasesUncheckedCreateWithoutAgents_spellReleases_agentIdToagentsInput[]
    connectOrCreate?: spellReleasesCreateOrConnectWithoutAgents_spellReleases_agentIdToagentsInput | spellReleasesCreateOrConnectWithoutAgents_spellReleases_agentIdToagentsInput[]
    upsert?: spellReleasesUpsertWithWhereUniqueWithoutAgents_spellReleases_agentIdToagentsInput | spellReleasesUpsertWithWhereUniqueWithoutAgents_spellReleases_agentIdToagentsInput[]
    createMany?: spellReleasesCreateManyAgents_spellReleases_agentIdToagentsInputEnvelope
    set?: spellReleasesWhereUniqueInput | spellReleasesWhereUniqueInput[]
    disconnect?: spellReleasesWhereUniqueInput | spellReleasesWhereUniqueInput[]
    delete?: spellReleasesWhereUniqueInput | spellReleasesWhereUniqueInput[]
    connect?: spellReleasesWhereUniqueInput | spellReleasesWhereUniqueInput[]
    update?: spellReleasesUpdateWithWhereUniqueWithoutAgents_spellReleases_agentIdToagentsInput | spellReleasesUpdateWithWhereUniqueWithoutAgents_spellReleases_agentIdToagentsInput[]
    updateMany?: spellReleasesUpdateManyWithWhereWithoutAgents_spellReleases_agentIdToagentsInput | spellReleasesUpdateManyWithWhereWithoutAgents_spellReleases_agentIdToagentsInput[]
    deleteMany?: spellReleasesScalarWhereInput | spellReleasesScalarWhereInput[]
  }

  export type agent_credentialsUncheckedUpdateManyWithoutAgentsNestedInput = {
    create?: XOR<agent_credentialsCreateWithoutAgentsInput, agent_credentialsUncheckedCreateWithoutAgentsInput> | agent_credentialsCreateWithoutAgentsInput[] | agent_credentialsUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: agent_credentialsCreateOrConnectWithoutAgentsInput | agent_credentialsCreateOrConnectWithoutAgentsInput[]
    upsert?: agent_credentialsUpsertWithWhereUniqueWithoutAgentsInput | agent_credentialsUpsertWithWhereUniqueWithoutAgentsInput[]
    createMany?: agent_credentialsCreateManyAgentsInputEnvelope
    set?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    disconnect?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    delete?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    connect?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    update?: agent_credentialsUpdateWithWhereUniqueWithoutAgentsInput | agent_credentialsUpdateWithWhereUniqueWithoutAgentsInput[]
    updateMany?: agent_credentialsUpdateManyWithWhereWithoutAgentsInput | agent_credentialsUpdateManyWithWhereWithoutAgentsInput[]
    deleteMany?: agent_credentialsScalarWhereInput | agent_credentialsScalarWhereInput[]
  }

  export type chatMessagesUncheckedUpdateManyWithoutAgentsNestedInput = {
    create?: XOR<chatMessagesCreateWithoutAgentsInput, chatMessagesUncheckedCreateWithoutAgentsInput> | chatMessagesCreateWithoutAgentsInput[] | chatMessagesUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: chatMessagesCreateOrConnectWithoutAgentsInput | chatMessagesCreateOrConnectWithoutAgentsInput[]
    upsert?: chatMessagesUpsertWithWhereUniqueWithoutAgentsInput | chatMessagesUpsertWithWhereUniqueWithoutAgentsInput[]
    createMany?: chatMessagesCreateManyAgentsInputEnvelope
    set?: chatMessagesWhereUniqueInput | chatMessagesWhereUniqueInput[]
    disconnect?: chatMessagesWhereUniqueInput | chatMessagesWhereUniqueInput[]
    delete?: chatMessagesWhereUniqueInput | chatMessagesWhereUniqueInput[]
    connect?: chatMessagesWhereUniqueInput | chatMessagesWhereUniqueInput[]
    update?: chatMessagesUpdateWithWhereUniqueWithoutAgentsInput | chatMessagesUpdateWithWhereUniqueWithoutAgentsInput[]
    updateMany?: chatMessagesUpdateManyWithWhereWithoutAgentsInput | chatMessagesUpdateManyWithWhereWithoutAgentsInput[]
    deleteMany?: chatMessagesScalarWhereInput | chatMessagesScalarWhereInput[]
  }

  export type graphEventsUncheckedUpdateManyWithoutAgentsNestedInput = {
    create?: XOR<graphEventsCreateWithoutAgentsInput, graphEventsUncheckedCreateWithoutAgentsInput> | graphEventsCreateWithoutAgentsInput[] | graphEventsUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: graphEventsCreateOrConnectWithoutAgentsInput | graphEventsCreateOrConnectWithoutAgentsInput[]
    upsert?: graphEventsUpsertWithWhereUniqueWithoutAgentsInput | graphEventsUpsertWithWhereUniqueWithoutAgentsInput[]
    createMany?: graphEventsCreateManyAgentsInputEnvelope
    set?: graphEventsWhereUniqueInput | graphEventsWhereUniqueInput[]
    disconnect?: graphEventsWhereUniqueInput | graphEventsWhereUniqueInput[]
    delete?: graphEventsWhereUniqueInput | graphEventsWhereUniqueInput[]
    connect?: graphEventsWhereUniqueInput | graphEventsWhereUniqueInput[]
    update?: graphEventsUpdateWithWhereUniqueWithoutAgentsInput | graphEventsUpdateWithWhereUniqueWithoutAgentsInput[]
    updateMany?: graphEventsUpdateManyWithWhereWithoutAgentsInput | graphEventsUpdateManyWithWhereWithoutAgentsInput[]
    deleteMany?: graphEventsScalarWhereInput | graphEventsScalarWhereInput[]
  }

  export type pluginStateUncheckedUpdateManyWithoutAgentsNestedInput = {
    create?: XOR<pluginStateCreateWithoutAgentsInput, pluginStateUncheckedCreateWithoutAgentsInput> | pluginStateCreateWithoutAgentsInput[] | pluginStateUncheckedCreateWithoutAgentsInput[]
    connectOrCreate?: pluginStateCreateOrConnectWithoutAgentsInput | pluginStateCreateOrConnectWithoutAgentsInput[]
    upsert?: pluginStateUpsertWithWhereUniqueWithoutAgentsInput | pluginStateUpsertWithWhereUniqueWithoutAgentsInput[]
    createMany?: pluginStateCreateManyAgentsInputEnvelope
    set?: pluginStateWhereUniqueInput | pluginStateWhereUniqueInput[]
    disconnect?: pluginStateWhereUniqueInput | pluginStateWhereUniqueInput[]
    delete?: pluginStateWhereUniqueInput | pluginStateWhereUniqueInput[]
    connect?: pluginStateWhereUniqueInput | pluginStateWhereUniqueInput[]
    update?: pluginStateUpdateWithWhereUniqueWithoutAgentsInput | pluginStateUpdateWithWhereUniqueWithoutAgentsInput[]
    updateMany?: pluginStateUpdateManyWithWhereWithoutAgentsInput | pluginStateUpdateManyWithWhereWithoutAgentsInput[]
    deleteMany?: pluginStateScalarWhereInput | pluginStateScalarWhereInput[]
  }

  export type spellReleasesUncheckedUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput = {
    create?: XOR<spellReleasesCreateWithoutAgents_spellReleases_agentIdToagentsInput, spellReleasesUncheckedCreateWithoutAgents_spellReleases_agentIdToagentsInput> | spellReleasesCreateWithoutAgents_spellReleases_agentIdToagentsInput[] | spellReleasesUncheckedCreateWithoutAgents_spellReleases_agentIdToagentsInput[]
    connectOrCreate?: spellReleasesCreateOrConnectWithoutAgents_spellReleases_agentIdToagentsInput | spellReleasesCreateOrConnectWithoutAgents_spellReleases_agentIdToagentsInput[]
    upsert?: spellReleasesUpsertWithWhereUniqueWithoutAgents_spellReleases_agentIdToagentsInput | spellReleasesUpsertWithWhereUniqueWithoutAgents_spellReleases_agentIdToagentsInput[]
    createMany?: spellReleasesCreateManyAgents_spellReleases_agentIdToagentsInputEnvelope
    set?: spellReleasesWhereUniqueInput | spellReleasesWhereUniqueInput[]
    disconnect?: spellReleasesWhereUniqueInput | spellReleasesWhereUniqueInput[]
    delete?: spellReleasesWhereUniqueInput | spellReleasesWhereUniqueInput[]
    connect?: spellReleasesWhereUniqueInput | spellReleasesWhereUniqueInput[]
    update?: spellReleasesUpdateWithWhereUniqueWithoutAgents_spellReleases_agentIdToagentsInput | spellReleasesUpdateWithWhereUniqueWithoutAgents_spellReleases_agentIdToagentsInput[]
    updateMany?: spellReleasesUpdateManyWithWhereWithoutAgents_spellReleases_agentIdToagentsInput | spellReleasesUpdateManyWithWhereWithoutAgents_spellReleases_agentIdToagentsInput[]
    deleteMany?: spellReleasesScalarWhereInput | spellReleasesScalarWhereInput[]
  }

  export type agentsCreateNestedOneWithoutChatMessagesInput = {
    create?: XOR<agentsCreateWithoutChatMessagesInput, agentsUncheckedCreateWithoutChatMessagesInput>
    connectOrCreate?: agentsCreateOrConnectWithoutChatMessagesInput
    connect?: agentsWhereUniqueInput
  }

  export type agentsUpdateOneRequiredWithoutChatMessagesNestedInput = {
    create?: XOR<agentsCreateWithoutChatMessagesInput, agentsUncheckedCreateWithoutChatMessagesInput>
    connectOrCreate?: agentsCreateOrConnectWithoutChatMessagesInput
    upsert?: agentsUpsertWithoutChatMessagesInput
    connect?: agentsWhereUniqueInput
    update?: XOR<XOR<agentsUpdateToOneWithWhereWithoutChatMessagesInput, agentsUpdateWithoutChatMessagesInput>, agentsUncheckedUpdateWithoutChatMessagesInput>
  }

  export type agent_credentialsCreateNestedManyWithoutCredentialsInput = {
    create?: XOR<agent_credentialsCreateWithoutCredentialsInput, agent_credentialsUncheckedCreateWithoutCredentialsInput> | agent_credentialsCreateWithoutCredentialsInput[] | agent_credentialsUncheckedCreateWithoutCredentialsInput[]
    connectOrCreate?: agent_credentialsCreateOrConnectWithoutCredentialsInput | agent_credentialsCreateOrConnectWithoutCredentialsInput[]
    createMany?: agent_credentialsCreateManyCredentialsInputEnvelope
    connect?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
  }

  export type agent_credentialsUncheckedCreateNestedManyWithoutCredentialsInput = {
    create?: XOR<agent_credentialsCreateWithoutCredentialsInput, agent_credentialsUncheckedCreateWithoutCredentialsInput> | agent_credentialsCreateWithoutCredentialsInput[] | agent_credentialsUncheckedCreateWithoutCredentialsInput[]
    connectOrCreate?: agent_credentialsCreateOrConnectWithoutCredentialsInput | agent_credentialsCreateOrConnectWithoutCredentialsInput[]
    createMany?: agent_credentialsCreateManyCredentialsInputEnvelope
    connect?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
  }

  export type agent_credentialsUpdateManyWithoutCredentialsNestedInput = {
    create?: XOR<agent_credentialsCreateWithoutCredentialsInput, agent_credentialsUncheckedCreateWithoutCredentialsInput> | agent_credentialsCreateWithoutCredentialsInput[] | agent_credentialsUncheckedCreateWithoutCredentialsInput[]
    connectOrCreate?: agent_credentialsCreateOrConnectWithoutCredentialsInput | agent_credentialsCreateOrConnectWithoutCredentialsInput[]
    upsert?: agent_credentialsUpsertWithWhereUniqueWithoutCredentialsInput | agent_credentialsUpsertWithWhereUniqueWithoutCredentialsInput[]
    createMany?: agent_credentialsCreateManyCredentialsInputEnvelope
    set?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    disconnect?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    delete?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    connect?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    update?: agent_credentialsUpdateWithWhereUniqueWithoutCredentialsInput | agent_credentialsUpdateWithWhereUniqueWithoutCredentialsInput[]
    updateMany?: agent_credentialsUpdateManyWithWhereWithoutCredentialsInput | agent_credentialsUpdateManyWithWhereWithoutCredentialsInput[]
    deleteMany?: agent_credentialsScalarWhereInput | agent_credentialsScalarWhereInput[]
  }

  export type agent_credentialsUncheckedUpdateManyWithoutCredentialsNestedInput = {
    create?: XOR<agent_credentialsCreateWithoutCredentialsInput, agent_credentialsUncheckedCreateWithoutCredentialsInput> | agent_credentialsCreateWithoutCredentialsInput[] | agent_credentialsUncheckedCreateWithoutCredentialsInput[]
    connectOrCreate?: agent_credentialsCreateOrConnectWithoutCredentialsInput | agent_credentialsCreateOrConnectWithoutCredentialsInput[]
    upsert?: agent_credentialsUpsertWithWhereUniqueWithoutCredentialsInput | agent_credentialsUpsertWithWhereUniqueWithoutCredentialsInput[]
    createMany?: agent_credentialsCreateManyCredentialsInputEnvelope
    set?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    disconnect?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    delete?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    connect?: agent_credentialsWhereUniqueInput | agent_credentialsWhereUniqueInput[]
    update?: agent_credentialsUpdateWithWhereUniqueWithoutCredentialsInput | agent_credentialsUpdateWithWhereUniqueWithoutCredentialsInput[]
    updateMany?: agent_credentialsUpdateManyWithWhereWithoutCredentialsInput | agent_credentialsUpdateManyWithWhereWithoutCredentialsInput[]
    deleteMany?: agent_credentialsScalarWhereInput | agent_credentialsScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type public_eventsCreateentitiesInput = {
    set: string[]
  }

  export type public_eventsUpdateentitiesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type agentsCreateNestedOneWithoutGraphEventsInput = {
    create?: XOR<agentsCreateWithoutGraphEventsInput, agentsUncheckedCreateWithoutGraphEventsInput>
    connectOrCreate?: agentsCreateOrConnectWithoutGraphEventsInput
    connect?: agentsWhereUniqueInput
  }

  export type agentsUpdateOneRequiredWithoutGraphEventsNestedInput = {
    create?: XOR<agentsCreateWithoutGraphEventsInput, agentsUncheckedCreateWithoutGraphEventsInput>
    connectOrCreate?: agentsCreateOrConnectWithoutGraphEventsInput
    upsert?: agentsUpsertWithoutGraphEventsInput
    connect?: agentsWhereUniqueInput
    update?: XOR<XOR<agentsUpdateToOneWithWhereWithoutGraphEventsInput, agentsUpdateWithoutGraphEventsInput>, agentsUncheckedUpdateWithoutGraphEventsInput>
  }

  export type agentsCreateNestedOneWithoutPluginStateInput = {
    create?: XOR<agentsCreateWithoutPluginStateInput, agentsUncheckedCreateWithoutPluginStateInput>
    connectOrCreate?: agentsCreateOrConnectWithoutPluginStateInput
    connect?: agentsWhereUniqueInput
  }

  export type agentsUpdateOneWithoutPluginStateNestedInput = {
    create?: XOR<agentsCreateWithoutPluginStateInput, agentsUncheckedCreateWithoutPluginStateInput>
    connectOrCreate?: agentsCreateOrConnectWithoutPluginStateInput
    upsert?: agentsUpsertWithoutPluginStateInput
    disconnect?: agentsWhereInput | boolean
    delete?: agentsWhereInput | boolean
    connect?: agentsWhereUniqueInput
    update?: XOR<XOR<agentsUpdateToOneWithWhereWithoutPluginStateInput, agentsUpdateWithoutPluginStateInput>, agentsUncheckedUpdateWithoutPluginStateInput>
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type agentsCreateNestedManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput = {
    create?: XOR<agentsCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput, agentsUncheckedCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput> | agentsCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[] | agentsUncheckedCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    connectOrCreate?: agentsCreateOrConnectWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput | agentsCreateOrConnectWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    createMany?: agentsCreateManySpellReleases_agents_currentSpellReleaseIdTospellReleasesInputEnvelope
    connect?: agentsWhereUniqueInput | agentsWhereUniqueInput[]
  }

  export type agentsCreateNestedOneWithoutSpellReleases_spellReleases_agentIdToagentsInput = {
    create?: XOR<agentsCreateWithoutSpellReleases_spellReleases_agentIdToagentsInput, agentsUncheckedCreateWithoutSpellReleases_spellReleases_agentIdToagentsInput>
    connectOrCreate?: agentsCreateOrConnectWithoutSpellReleases_spellReleases_agentIdToagentsInput
    connect?: agentsWhereUniqueInput
  }

  export type spellsCreateNestedManyWithoutSpellReleasesInput = {
    create?: XOR<spellsCreateWithoutSpellReleasesInput, spellsUncheckedCreateWithoutSpellReleasesInput> | spellsCreateWithoutSpellReleasesInput[] | spellsUncheckedCreateWithoutSpellReleasesInput[]
    connectOrCreate?: spellsCreateOrConnectWithoutSpellReleasesInput | spellsCreateOrConnectWithoutSpellReleasesInput[]
    createMany?: spellsCreateManySpellReleasesInputEnvelope
    connect?: spellsWhereUniqueInput | spellsWhereUniqueInput[]
  }

  export type agentsUncheckedCreateNestedManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput = {
    create?: XOR<agentsCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput, agentsUncheckedCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput> | agentsCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[] | agentsUncheckedCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    connectOrCreate?: agentsCreateOrConnectWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput | agentsCreateOrConnectWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    createMany?: agentsCreateManySpellReleases_agents_currentSpellReleaseIdTospellReleasesInputEnvelope
    connect?: agentsWhereUniqueInput | agentsWhereUniqueInput[]
  }

  export type spellsUncheckedCreateNestedManyWithoutSpellReleasesInput = {
    create?: XOR<spellsCreateWithoutSpellReleasesInput, spellsUncheckedCreateWithoutSpellReleasesInput> | spellsCreateWithoutSpellReleasesInput[] | spellsUncheckedCreateWithoutSpellReleasesInput[]
    connectOrCreate?: spellsCreateOrConnectWithoutSpellReleasesInput | spellsCreateOrConnectWithoutSpellReleasesInput[]
    createMany?: spellsCreateManySpellReleasesInputEnvelope
    connect?: spellsWhereUniqueInput | spellsWhereUniqueInput[]
  }

  export type agentsUpdateManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesNestedInput = {
    create?: XOR<agentsCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput, agentsUncheckedCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput> | agentsCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[] | agentsUncheckedCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    connectOrCreate?: agentsCreateOrConnectWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput | agentsCreateOrConnectWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    upsert?: agentsUpsertWithWhereUniqueWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput | agentsUpsertWithWhereUniqueWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    createMany?: agentsCreateManySpellReleases_agents_currentSpellReleaseIdTospellReleasesInputEnvelope
    set?: agentsWhereUniqueInput | agentsWhereUniqueInput[]
    disconnect?: agentsWhereUniqueInput | agentsWhereUniqueInput[]
    delete?: agentsWhereUniqueInput | agentsWhereUniqueInput[]
    connect?: agentsWhereUniqueInput | agentsWhereUniqueInput[]
    update?: agentsUpdateWithWhereUniqueWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput | agentsUpdateWithWhereUniqueWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    updateMany?: agentsUpdateManyWithWhereWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput | agentsUpdateManyWithWhereWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    deleteMany?: agentsScalarWhereInput | agentsScalarWhereInput[]
  }

  export type agentsUpdateOneRequiredWithoutSpellReleases_spellReleases_agentIdToagentsNestedInput = {
    create?: XOR<agentsCreateWithoutSpellReleases_spellReleases_agentIdToagentsInput, agentsUncheckedCreateWithoutSpellReleases_spellReleases_agentIdToagentsInput>
    connectOrCreate?: agentsCreateOrConnectWithoutSpellReleases_spellReleases_agentIdToagentsInput
    upsert?: agentsUpsertWithoutSpellReleases_spellReleases_agentIdToagentsInput
    connect?: agentsWhereUniqueInput
    update?: XOR<XOR<agentsUpdateToOneWithWhereWithoutSpellReleases_spellReleases_agentIdToagentsInput, agentsUpdateWithoutSpellReleases_spellReleases_agentIdToagentsInput>, agentsUncheckedUpdateWithoutSpellReleases_spellReleases_agentIdToagentsInput>
  }

  export type spellsUpdateManyWithoutSpellReleasesNestedInput = {
    create?: XOR<spellsCreateWithoutSpellReleasesInput, spellsUncheckedCreateWithoutSpellReleasesInput> | spellsCreateWithoutSpellReleasesInput[] | spellsUncheckedCreateWithoutSpellReleasesInput[]
    connectOrCreate?: spellsCreateOrConnectWithoutSpellReleasesInput | spellsCreateOrConnectWithoutSpellReleasesInput[]
    upsert?: spellsUpsertWithWhereUniqueWithoutSpellReleasesInput | spellsUpsertWithWhereUniqueWithoutSpellReleasesInput[]
    createMany?: spellsCreateManySpellReleasesInputEnvelope
    set?: spellsWhereUniqueInput | spellsWhereUniqueInput[]
    disconnect?: spellsWhereUniqueInput | spellsWhereUniqueInput[]
    delete?: spellsWhereUniqueInput | spellsWhereUniqueInput[]
    connect?: spellsWhereUniqueInput | spellsWhereUniqueInput[]
    update?: spellsUpdateWithWhereUniqueWithoutSpellReleasesInput | spellsUpdateWithWhereUniqueWithoutSpellReleasesInput[]
    updateMany?: spellsUpdateManyWithWhereWithoutSpellReleasesInput | spellsUpdateManyWithWhereWithoutSpellReleasesInput[]
    deleteMany?: spellsScalarWhereInput | spellsScalarWhereInput[]
  }

  export type agentsUncheckedUpdateManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesNestedInput = {
    create?: XOR<agentsCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput, agentsUncheckedCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput> | agentsCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[] | agentsUncheckedCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    connectOrCreate?: agentsCreateOrConnectWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput | agentsCreateOrConnectWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    upsert?: agentsUpsertWithWhereUniqueWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput | agentsUpsertWithWhereUniqueWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    createMany?: agentsCreateManySpellReleases_agents_currentSpellReleaseIdTospellReleasesInputEnvelope
    set?: agentsWhereUniqueInput | agentsWhereUniqueInput[]
    disconnect?: agentsWhereUniqueInput | agentsWhereUniqueInput[]
    delete?: agentsWhereUniqueInput | agentsWhereUniqueInput[]
    connect?: agentsWhereUniqueInput | agentsWhereUniqueInput[]
    update?: agentsUpdateWithWhereUniqueWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput | agentsUpdateWithWhereUniqueWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    updateMany?: agentsUpdateManyWithWhereWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput | agentsUpdateManyWithWhereWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    deleteMany?: agentsScalarWhereInput | agentsScalarWhereInput[]
  }

  export type spellsUncheckedUpdateManyWithoutSpellReleasesNestedInput = {
    create?: XOR<spellsCreateWithoutSpellReleasesInput, spellsUncheckedCreateWithoutSpellReleasesInput> | spellsCreateWithoutSpellReleasesInput[] | spellsUncheckedCreateWithoutSpellReleasesInput[]
    connectOrCreate?: spellsCreateOrConnectWithoutSpellReleasesInput | spellsCreateOrConnectWithoutSpellReleasesInput[]
    upsert?: spellsUpsertWithWhereUniqueWithoutSpellReleasesInput | spellsUpsertWithWhereUniqueWithoutSpellReleasesInput[]
    createMany?: spellsCreateManySpellReleasesInputEnvelope
    set?: spellsWhereUniqueInput | spellsWhereUniqueInput[]
    disconnect?: spellsWhereUniqueInput | spellsWhereUniqueInput[]
    delete?: spellsWhereUniqueInput | spellsWhereUniqueInput[]
    connect?: spellsWhereUniqueInput | spellsWhereUniqueInput[]
    update?: spellsUpdateWithWhereUniqueWithoutSpellReleasesInput | spellsUpdateWithWhereUniqueWithoutSpellReleasesInput[]
    updateMany?: spellsUpdateManyWithWhereWithoutSpellReleasesInput | spellsUpdateManyWithWhereWithoutSpellReleasesInput[]
    deleteMany?: spellsScalarWhereInput | spellsScalarWhereInput[]
  }

  export type spellReleasesCreateNestedOneWithoutSpellsInput = {
    create?: XOR<spellReleasesCreateWithoutSpellsInput, spellReleasesUncheckedCreateWithoutSpellsInput>
    connectOrCreate?: spellReleasesCreateOrConnectWithoutSpellsInput
    connect?: spellReleasesWhereUniqueInput
  }

  export type spellReleasesUpdateOneWithoutSpellsNestedInput = {
    create?: XOR<spellReleasesCreateWithoutSpellsInput, spellReleasesUncheckedCreateWithoutSpellsInput>
    connectOrCreate?: spellReleasesCreateOrConnectWithoutSpellsInput
    upsert?: spellReleasesUpsertWithoutSpellsInput
    disconnect?: spellReleasesWhereInput | boolean
    delete?: spellReleasesWhereInput | boolean
    connect?: spellReleasesWhereUniqueInput
    update?: XOR<XOR<spellReleasesUpdateToOneWithWhereWithoutSpellsInput, spellReleasesUpdateWithoutSpellsInput>, spellReleasesUncheckedUpdateWithoutSpellsInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type agentsCreateWithoutAgent_credentialsInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: spellReleasesCreateNestedOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput
    chatMessages?: chatMessagesCreateNestedManyWithoutAgentsInput
    graphEvents?: graphEventsCreateNestedManyWithoutAgentsInput
    pluginState?: pluginStateCreateNestedManyWithoutAgentsInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput
  }

  export type agentsUncheckedCreateWithoutAgent_credentialsInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    currentSpellReleaseId?: string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    chatMessages?: chatMessagesUncheckedCreateNestedManyWithoutAgentsInput
    graphEvents?: graphEventsUncheckedCreateNestedManyWithoutAgentsInput
    pluginState?: pluginStateUncheckedCreateNestedManyWithoutAgentsInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUncheckedCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput
  }

  export type agentsCreateOrConnectWithoutAgent_credentialsInput = {
    where: agentsWhereUniqueInput
    create: XOR<agentsCreateWithoutAgent_credentialsInput, agentsUncheckedCreateWithoutAgent_credentialsInput>
  }

  export type credentialsCreateWithoutAgent_credentialsInput = {
    id?: string
    projectId: string
    name: string
    serviceType: string
    credentialType: string
    value: string
    description?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type credentialsUncheckedCreateWithoutAgent_credentialsInput = {
    id?: string
    projectId: string
    name: string
    serviceType: string
    credentialType: string
    value: string
    description?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type credentialsCreateOrConnectWithoutAgent_credentialsInput = {
    where: credentialsWhereUniqueInput
    create: XOR<credentialsCreateWithoutAgent_credentialsInput, credentialsUncheckedCreateWithoutAgent_credentialsInput>
  }

  export type agentsUpsertWithoutAgent_credentialsInput = {
    update: XOR<agentsUpdateWithoutAgent_credentialsInput, agentsUncheckedUpdateWithoutAgent_credentialsInput>
    create: XOR<agentsCreateWithoutAgent_credentialsInput, agentsUncheckedCreateWithoutAgent_credentialsInput>
    where?: agentsWhereInput
  }

  export type agentsUpdateToOneWithWhereWithoutAgent_credentialsInput = {
    where?: agentsWhereInput
    data: XOR<agentsUpdateWithoutAgent_credentialsInput, agentsUncheckedUpdateWithoutAgent_credentialsInput>
  }

  export type agentsUpdateWithoutAgent_credentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: spellReleasesUpdateOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesNestedInput
    chatMessages?: chatMessagesUpdateManyWithoutAgentsNestedInput
    graphEvents?: graphEventsUpdateManyWithoutAgentsNestedInput
    pluginState?: pluginStateUpdateManyWithoutAgentsNestedInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput
  }

  export type agentsUncheckedUpdateWithoutAgent_credentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentSpellReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    chatMessages?: chatMessagesUncheckedUpdateManyWithoutAgentsNestedInput
    graphEvents?: graphEventsUncheckedUpdateManyWithoutAgentsNestedInput
    pluginState?: pluginStateUncheckedUpdateManyWithoutAgentsNestedInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUncheckedUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput
  }

  export type credentialsUpsertWithoutAgent_credentialsInput = {
    update: XOR<credentialsUpdateWithoutAgent_credentialsInput, credentialsUncheckedUpdateWithoutAgent_credentialsInput>
    create: XOR<credentialsCreateWithoutAgent_credentialsInput, credentialsUncheckedCreateWithoutAgent_credentialsInput>
    where?: credentialsWhereInput
  }

  export type credentialsUpdateToOneWithWhereWithoutAgent_credentialsInput = {
    where?: credentialsWhereInput
    data: XOR<credentialsUpdateWithoutAgent_credentialsInput, credentialsUncheckedUpdateWithoutAgent_credentialsInput>
  }

  export type credentialsUpdateWithoutAgent_credentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    credentialType?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type credentialsUncheckedUpdateWithoutAgent_credentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    credentialType?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type agent_credentialsCreateWithoutAgentsInput = {
    created_at?: Date | string
    updated_at?: Date | string
    credentials: credentialsCreateNestedOneWithoutAgent_credentialsInput
  }

  export type agent_credentialsUncheckedCreateWithoutAgentsInput = {
    credentialId: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type agent_credentialsCreateOrConnectWithoutAgentsInput = {
    where: agent_credentialsWhereUniqueInput
    create: XOR<agent_credentialsCreateWithoutAgentsInput, agent_credentialsUncheckedCreateWithoutAgentsInput>
  }

  export type agent_credentialsCreateManyAgentsInputEnvelope = {
    data: agent_credentialsCreateManyAgentsInput | agent_credentialsCreateManyAgentsInput[]
    skipDuplicates?: boolean
  }

  export type spellReleasesCreateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput = {
    id: string
    description?: string | null
    spellId?: string | null
    projectId?: string | null
    createdAt?: Date | string | null
    agents_spellReleases_agentIdToagents: agentsCreateNestedOneWithoutSpellReleases_spellReleases_agentIdToagentsInput
    spells?: spellsCreateNestedManyWithoutSpellReleasesInput
  }

  export type spellReleasesUncheckedCreateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput = {
    id: string
    description?: string | null
    agentId: string
    spellId?: string | null
    projectId?: string | null
    createdAt?: Date | string | null
    spells?: spellsUncheckedCreateNestedManyWithoutSpellReleasesInput
  }

  export type spellReleasesCreateOrConnectWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput = {
    where: spellReleasesWhereUniqueInput
    create: XOR<spellReleasesCreateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput, spellReleasesUncheckedCreateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput>
  }

  export type chatMessagesCreateWithoutAgentsInput = {
    id?: string
    sender?: string | null
    connector: string
    content?: string | null
    conversationId?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type chatMessagesUncheckedCreateWithoutAgentsInput = {
    id?: string
    sender?: string | null
    connector: string
    content?: string | null
    conversationId?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type chatMessagesCreateOrConnectWithoutAgentsInput = {
    where: chatMessagesWhereUniqueInput
    create: XOR<chatMessagesCreateWithoutAgentsInput, chatMessagesUncheckedCreateWithoutAgentsInput>
  }

  export type chatMessagesCreateManyAgentsInputEnvelope = {
    data: chatMessagesCreateManyAgentsInput | chatMessagesCreateManyAgentsInput[]
    skipDuplicates?: boolean
  }

  export type graphEventsCreateWithoutAgentsInput = {
    id?: string
    sender: string
    connector: string
    connectorData?: NullableJsonNullValueInput | InputJsonValue
    channel?: string | null
    content: string
    eventType: string
    created_at?: Date | string
    updated_at?: Date | string
    event?: NullableJsonNullValueInput | InputJsonValue
    observer?: string | null
  }

  export type graphEventsUncheckedCreateWithoutAgentsInput = {
    id?: string
    sender: string
    connector: string
    connectorData?: NullableJsonNullValueInput | InputJsonValue
    channel?: string | null
    content: string
    eventType: string
    created_at?: Date | string
    updated_at?: Date | string
    event?: NullableJsonNullValueInput | InputJsonValue
    observer?: string | null
  }

  export type graphEventsCreateOrConnectWithoutAgentsInput = {
    where: graphEventsWhereUniqueInput
    create: XOR<graphEventsCreateWithoutAgentsInput, graphEventsUncheckedCreateWithoutAgentsInput>
  }

  export type graphEventsCreateManyAgentsInputEnvelope = {
    data: graphEventsCreateManyAgentsInput | graphEventsCreateManyAgentsInput[]
    skipDuplicates?: boolean
  }

  export type pluginStateCreateWithoutAgentsInput = {
    id?: string
    state?: NullableJsonNullValueInput | InputJsonValue
    plugin?: string | null
  }

  export type pluginStateUncheckedCreateWithoutAgentsInput = {
    id?: string
    state?: NullableJsonNullValueInput | InputJsonValue
    plugin?: string | null
  }

  export type pluginStateCreateOrConnectWithoutAgentsInput = {
    where: pluginStateWhereUniqueInput
    create: XOR<pluginStateCreateWithoutAgentsInput, pluginStateUncheckedCreateWithoutAgentsInput>
  }

  export type pluginStateCreateManyAgentsInputEnvelope = {
    data: pluginStateCreateManyAgentsInput | pluginStateCreateManyAgentsInput[]
    skipDuplicates?: boolean
  }

  export type spellReleasesCreateWithoutAgents_spellReleases_agentIdToagentsInput = {
    id: string
    description?: string | null
    spellId?: string | null
    projectId?: string | null
    createdAt?: Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: agentsCreateNestedManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput
    spells?: spellsCreateNestedManyWithoutSpellReleasesInput
  }

  export type spellReleasesUncheckedCreateWithoutAgents_spellReleases_agentIdToagentsInput = {
    id: string
    description?: string | null
    spellId?: string | null
    projectId?: string | null
    createdAt?: Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: agentsUncheckedCreateNestedManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput
    spells?: spellsUncheckedCreateNestedManyWithoutSpellReleasesInput
  }

  export type spellReleasesCreateOrConnectWithoutAgents_spellReleases_agentIdToagentsInput = {
    where: spellReleasesWhereUniqueInput
    create: XOR<spellReleasesCreateWithoutAgents_spellReleases_agentIdToagentsInput, spellReleasesUncheckedCreateWithoutAgents_spellReleases_agentIdToagentsInput>
  }

  export type spellReleasesCreateManyAgents_spellReleases_agentIdToagentsInputEnvelope = {
    data: spellReleasesCreateManyAgents_spellReleases_agentIdToagentsInput | spellReleasesCreateManyAgents_spellReleases_agentIdToagentsInput[]
    skipDuplicates?: boolean
  }

  export type agent_credentialsUpsertWithWhereUniqueWithoutAgentsInput = {
    where: agent_credentialsWhereUniqueInput
    update: XOR<agent_credentialsUpdateWithoutAgentsInput, agent_credentialsUncheckedUpdateWithoutAgentsInput>
    create: XOR<agent_credentialsCreateWithoutAgentsInput, agent_credentialsUncheckedCreateWithoutAgentsInput>
  }

  export type agent_credentialsUpdateWithWhereUniqueWithoutAgentsInput = {
    where: agent_credentialsWhereUniqueInput
    data: XOR<agent_credentialsUpdateWithoutAgentsInput, agent_credentialsUncheckedUpdateWithoutAgentsInput>
  }

  export type agent_credentialsUpdateManyWithWhereWithoutAgentsInput = {
    where: agent_credentialsScalarWhereInput
    data: XOR<agent_credentialsUpdateManyMutationInput, agent_credentialsUncheckedUpdateManyWithoutAgentsInput>
  }

  export type agent_credentialsScalarWhereInput = {
    AND?: agent_credentialsScalarWhereInput | agent_credentialsScalarWhereInput[]
    OR?: agent_credentialsScalarWhereInput[]
    NOT?: agent_credentialsScalarWhereInput | agent_credentialsScalarWhereInput[]
    agentId?: UuidFilter<"agent_credentials"> | string
    credentialId?: UuidFilter<"agent_credentials"> | string
    created_at?: DateTimeFilter<"agent_credentials"> | Date | string
    updated_at?: DateTimeFilter<"agent_credentials"> | Date | string
  }

  export type spellReleasesUpsertWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput = {
    update: XOR<spellReleasesUpdateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput, spellReleasesUncheckedUpdateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput>
    create: XOR<spellReleasesCreateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput, spellReleasesUncheckedCreateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput>
    where?: spellReleasesWhereInput
  }

  export type spellReleasesUpdateToOneWithWhereWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput = {
    where?: spellReleasesWhereInput
    data: XOR<spellReleasesUpdateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput, spellReleasesUncheckedUpdateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput>
  }

  export type spellReleasesUpdateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    spellId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agents_spellReleases_agentIdToagents?: agentsUpdateOneRequiredWithoutSpellReleases_spellReleases_agentIdToagentsNestedInput
    spells?: spellsUpdateManyWithoutSpellReleasesNestedInput
  }

  export type spellReleasesUncheckedUpdateWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: StringFieldUpdateOperationsInput | string
    spellId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    spells?: spellsUncheckedUpdateManyWithoutSpellReleasesNestedInput
  }

  export type chatMessagesUpsertWithWhereUniqueWithoutAgentsInput = {
    where: chatMessagesWhereUniqueInput
    update: XOR<chatMessagesUpdateWithoutAgentsInput, chatMessagesUncheckedUpdateWithoutAgentsInput>
    create: XOR<chatMessagesCreateWithoutAgentsInput, chatMessagesUncheckedCreateWithoutAgentsInput>
  }

  export type chatMessagesUpdateWithWhereUniqueWithoutAgentsInput = {
    where: chatMessagesWhereUniqueInput
    data: XOR<chatMessagesUpdateWithoutAgentsInput, chatMessagesUncheckedUpdateWithoutAgentsInput>
  }

  export type chatMessagesUpdateManyWithWhereWithoutAgentsInput = {
    where: chatMessagesScalarWhereInput
    data: XOR<chatMessagesUpdateManyMutationInput, chatMessagesUncheckedUpdateManyWithoutAgentsInput>
  }

  export type chatMessagesScalarWhereInput = {
    AND?: chatMessagesScalarWhereInput | chatMessagesScalarWhereInput[]
    OR?: chatMessagesScalarWhereInput[]
    NOT?: chatMessagesScalarWhereInput | chatMessagesScalarWhereInput[]
    id?: UuidFilter<"chatMessages"> | string
    agentId?: UuidFilter<"chatMessages"> | string
    sender?: StringNullableFilter<"chatMessages"> | string | null
    connector?: StringFilter<"chatMessages"> | string
    content?: StringNullableFilter<"chatMessages"> | string | null
    conversationId?: StringNullableFilter<"chatMessages"> | string | null
    created_at?: DateTimeFilter<"chatMessages"> | Date | string
    updated_at?: DateTimeFilter<"chatMessages"> | Date | string
  }

  export type graphEventsUpsertWithWhereUniqueWithoutAgentsInput = {
    where: graphEventsWhereUniqueInput
    update: XOR<graphEventsUpdateWithoutAgentsInput, graphEventsUncheckedUpdateWithoutAgentsInput>
    create: XOR<graphEventsCreateWithoutAgentsInput, graphEventsUncheckedCreateWithoutAgentsInput>
  }

  export type graphEventsUpdateWithWhereUniqueWithoutAgentsInput = {
    where: graphEventsWhereUniqueInput
    data: XOR<graphEventsUpdateWithoutAgentsInput, graphEventsUncheckedUpdateWithoutAgentsInput>
  }

  export type graphEventsUpdateManyWithWhereWithoutAgentsInput = {
    where: graphEventsScalarWhereInput
    data: XOR<graphEventsUpdateManyMutationInput, graphEventsUncheckedUpdateManyWithoutAgentsInput>
  }

  export type graphEventsScalarWhereInput = {
    AND?: graphEventsScalarWhereInput | graphEventsScalarWhereInput[]
    OR?: graphEventsScalarWhereInput[]
    NOT?: graphEventsScalarWhereInput | graphEventsScalarWhereInput[]
    id?: UuidFilter<"graphEvents"> | string
    agentId?: UuidFilter<"graphEvents"> | string
    sender?: StringFilter<"graphEvents"> | string
    connector?: StringFilter<"graphEvents"> | string
    connectorData?: JsonNullableFilter<"graphEvents">
    channel?: StringNullableFilter<"graphEvents"> | string | null
    content?: StringFilter<"graphEvents"> | string
    eventType?: StringFilter<"graphEvents"> | string
    created_at?: DateTimeFilter<"graphEvents"> | Date | string
    updated_at?: DateTimeFilter<"graphEvents"> | Date | string
    event?: JsonNullableFilter<"graphEvents">
    observer?: StringNullableFilter<"graphEvents"> | string | null
  }

  export type pluginStateUpsertWithWhereUniqueWithoutAgentsInput = {
    where: pluginStateWhereUniqueInput
    update: XOR<pluginStateUpdateWithoutAgentsInput, pluginStateUncheckedUpdateWithoutAgentsInput>
    create: XOR<pluginStateCreateWithoutAgentsInput, pluginStateUncheckedCreateWithoutAgentsInput>
  }

  export type pluginStateUpdateWithWhereUniqueWithoutAgentsInput = {
    where: pluginStateWhereUniqueInput
    data: XOR<pluginStateUpdateWithoutAgentsInput, pluginStateUncheckedUpdateWithoutAgentsInput>
  }

  export type pluginStateUpdateManyWithWhereWithoutAgentsInput = {
    where: pluginStateScalarWhereInput
    data: XOR<pluginStateUpdateManyMutationInput, pluginStateUncheckedUpdateManyWithoutAgentsInput>
  }

  export type pluginStateScalarWhereInput = {
    AND?: pluginStateScalarWhereInput | pluginStateScalarWhereInput[]
    OR?: pluginStateScalarWhereInput[]
    NOT?: pluginStateScalarWhereInput | pluginStateScalarWhereInput[]
    id?: UuidFilter<"pluginState"> | string
    agentId?: UuidNullableFilter<"pluginState"> | string | null
    state?: JsonNullableFilter<"pluginState">
    plugin?: StringNullableFilter<"pluginState"> | string | null
  }

  export type spellReleasesUpsertWithWhereUniqueWithoutAgents_spellReleases_agentIdToagentsInput = {
    where: spellReleasesWhereUniqueInput
    update: XOR<spellReleasesUpdateWithoutAgents_spellReleases_agentIdToagentsInput, spellReleasesUncheckedUpdateWithoutAgents_spellReleases_agentIdToagentsInput>
    create: XOR<spellReleasesCreateWithoutAgents_spellReleases_agentIdToagentsInput, spellReleasesUncheckedCreateWithoutAgents_spellReleases_agentIdToagentsInput>
  }

  export type spellReleasesUpdateWithWhereUniqueWithoutAgents_spellReleases_agentIdToagentsInput = {
    where: spellReleasesWhereUniqueInput
    data: XOR<spellReleasesUpdateWithoutAgents_spellReleases_agentIdToagentsInput, spellReleasesUncheckedUpdateWithoutAgents_spellReleases_agentIdToagentsInput>
  }

  export type spellReleasesUpdateManyWithWhereWithoutAgents_spellReleases_agentIdToagentsInput = {
    where: spellReleasesScalarWhereInput
    data: XOR<spellReleasesUpdateManyMutationInput, spellReleasesUncheckedUpdateManyWithoutAgents_spellReleases_agentIdToagentsInput>
  }

  export type spellReleasesScalarWhereInput = {
    AND?: spellReleasesScalarWhereInput | spellReleasesScalarWhereInput[]
    OR?: spellReleasesScalarWhereInput[]
    NOT?: spellReleasesScalarWhereInput | spellReleasesScalarWhereInput[]
    id?: UuidFilter<"spellReleases"> | string
    description?: StringNullableFilter<"spellReleases"> | string | null
    agentId?: UuidFilter<"spellReleases"> | string
    spellId?: UuidNullableFilter<"spellReleases"> | string | null
    projectId?: StringNullableFilter<"spellReleases"> | string | null
    createdAt?: DateTimeNullableFilter<"spellReleases"> | Date | string | null
  }

  export type agentsCreateWithoutChatMessagesInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    agent_credentials?: agent_credentialsCreateNestedManyWithoutAgentsInput
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: spellReleasesCreateNestedOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput
    graphEvents?: graphEventsCreateNestedManyWithoutAgentsInput
    pluginState?: pluginStateCreateNestedManyWithoutAgentsInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput
  }

  export type agentsUncheckedCreateWithoutChatMessagesInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    currentSpellReleaseId?: string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    agent_credentials?: agent_credentialsUncheckedCreateNestedManyWithoutAgentsInput
    graphEvents?: graphEventsUncheckedCreateNestedManyWithoutAgentsInput
    pluginState?: pluginStateUncheckedCreateNestedManyWithoutAgentsInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUncheckedCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput
  }

  export type agentsCreateOrConnectWithoutChatMessagesInput = {
    where: agentsWhereUniqueInput
    create: XOR<agentsCreateWithoutChatMessagesInput, agentsUncheckedCreateWithoutChatMessagesInput>
  }

  export type agentsUpsertWithoutChatMessagesInput = {
    update: XOR<agentsUpdateWithoutChatMessagesInput, agentsUncheckedUpdateWithoutChatMessagesInput>
    create: XOR<agentsCreateWithoutChatMessagesInput, agentsUncheckedCreateWithoutChatMessagesInput>
    where?: agentsWhereInput
  }

  export type agentsUpdateToOneWithWhereWithoutChatMessagesInput = {
    where?: agentsWhereInput
    data: XOR<agentsUpdateWithoutChatMessagesInput, agentsUncheckedUpdateWithoutChatMessagesInput>
  }

  export type agentsUpdateWithoutChatMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    agent_credentials?: agent_credentialsUpdateManyWithoutAgentsNestedInput
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: spellReleasesUpdateOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesNestedInput
    graphEvents?: graphEventsUpdateManyWithoutAgentsNestedInput
    pluginState?: pluginStateUpdateManyWithoutAgentsNestedInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput
  }

  export type agentsUncheckedUpdateWithoutChatMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentSpellReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    agent_credentials?: agent_credentialsUncheckedUpdateManyWithoutAgentsNestedInput
    graphEvents?: graphEventsUncheckedUpdateManyWithoutAgentsNestedInput
    pluginState?: pluginStateUncheckedUpdateManyWithoutAgentsNestedInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUncheckedUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput
  }

  export type agent_credentialsCreateWithoutCredentialsInput = {
    created_at?: Date | string
    updated_at?: Date | string
    agents: agentsCreateNestedOneWithoutAgent_credentialsInput
  }

  export type agent_credentialsUncheckedCreateWithoutCredentialsInput = {
    agentId: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type agent_credentialsCreateOrConnectWithoutCredentialsInput = {
    where: agent_credentialsWhereUniqueInput
    create: XOR<agent_credentialsCreateWithoutCredentialsInput, agent_credentialsUncheckedCreateWithoutCredentialsInput>
  }

  export type agent_credentialsCreateManyCredentialsInputEnvelope = {
    data: agent_credentialsCreateManyCredentialsInput | agent_credentialsCreateManyCredentialsInput[]
    skipDuplicates?: boolean
  }

  export type agent_credentialsUpsertWithWhereUniqueWithoutCredentialsInput = {
    where: agent_credentialsWhereUniqueInput
    update: XOR<agent_credentialsUpdateWithoutCredentialsInput, agent_credentialsUncheckedUpdateWithoutCredentialsInput>
    create: XOR<agent_credentialsCreateWithoutCredentialsInput, agent_credentialsUncheckedCreateWithoutCredentialsInput>
  }

  export type agent_credentialsUpdateWithWhereUniqueWithoutCredentialsInput = {
    where: agent_credentialsWhereUniqueInput
    data: XOR<agent_credentialsUpdateWithoutCredentialsInput, agent_credentialsUncheckedUpdateWithoutCredentialsInput>
  }

  export type agent_credentialsUpdateManyWithWhereWithoutCredentialsInput = {
    where: agent_credentialsScalarWhereInput
    data: XOR<agent_credentialsUpdateManyMutationInput, agent_credentialsUncheckedUpdateManyWithoutCredentialsInput>
  }

  export type agentsCreateWithoutGraphEventsInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    agent_credentials?: agent_credentialsCreateNestedManyWithoutAgentsInput
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: spellReleasesCreateNestedOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput
    chatMessages?: chatMessagesCreateNestedManyWithoutAgentsInput
    pluginState?: pluginStateCreateNestedManyWithoutAgentsInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput
  }

  export type agentsUncheckedCreateWithoutGraphEventsInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    currentSpellReleaseId?: string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    agent_credentials?: agent_credentialsUncheckedCreateNestedManyWithoutAgentsInput
    chatMessages?: chatMessagesUncheckedCreateNestedManyWithoutAgentsInput
    pluginState?: pluginStateUncheckedCreateNestedManyWithoutAgentsInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUncheckedCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput
  }

  export type agentsCreateOrConnectWithoutGraphEventsInput = {
    where: agentsWhereUniqueInput
    create: XOR<agentsCreateWithoutGraphEventsInput, agentsUncheckedCreateWithoutGraphEventsInput>
  }

  export type agentsUpsertWithoutGraphEventsInput = {
    update: XOR<agentsUpdateWithoutGraphEventsInput, agentsUncheckedUpdateWithoutGraphEventsInput>
    create: XOR<agentsCreateWithoutGraphEventsInput, agentsUncheckedCreateWithoutGraphEventsInput>
    where?: agentsWhereInput
  }

  export type agentsUpdateToOneWithWhereWithoutGraphEventsInput = {
    where?: agentsWhereInput
    data: XOR<agentsUpdateWithoutGraphEventsInput, agentsUncheckedUpdateWithoutGraphEventsInput>
  }

  export type agentsUpdateWithoutGraphEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    agent_credentials?: agent_credentialsUpdateManyWithoutAgentsNestedInput
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: spellReleasesUpdateOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesNestedInput
    chatMessages?: chatMessagesUpdateManyWithoutAgentsNestedInput
    pluginState?: pluginStateUpdateManyWithoutAgentsNestedInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput
  }

  export type agentsUncheckedUpdateWithoutGraphEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentSpellReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    agent_credentials?: agent_credentialsUncheckedUpdateManyWithoutAgentsNestedInput
    chatMessages?: chatMessagesUncheckedUpdateManyWithoutAgentsNestedInput
    pluginState?: pluginStateUncheckedUpdateManyWithoutAgentsNestedInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUncheckedUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput
  }

  export type agentsCreateWithoutPluginStateInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    agent_credentials?: agent_credentialsCreateNestedManyWithoutAgentsInput
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: spellReleasesCreateNestedOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput
    chatMessages?: chatMessagesCreateNestedManyWithoutAgentsInput
    graphEvents?: graphEventsCreateNestedManyWithoutAgentsInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput
  }

  export type agentsUncheckedCreateWithoutPluginStateInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    currentSpellReleaseId?: string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    agent_credentials?: agent_credentialsUncheckedCreateNestedManyWithoutAgentsInput
    chatMessages?: chatMessagesUncheckedCreateNestedManyWithoutAgentsInput
    graphEvents?: graphEventsUncheckedCreateNestedManyWithoutAgentsInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUncheckedCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput
  }

  export type agentsCreateOrConnectWithoutPluginStateInput = {
    where: agentsWhereUniqueInput
    create: XOR<agentsCreateWithoutPluginStateInput, agentsUncheckedCreateWithoutPluginStateInput>
  }

  export type agentsUpsertWithoutPluginStateInput = {
    update: XOR<agentsUpdateWithoutPluginStateInput, agentsUncheckedUpdateWithoutPluginStateInput>
    create: XOR<agentsCreateWithoutPluginStateInput, agentsUncheckedCreateWithoutPluginStateInput>
    where?: agentsWhereInput
  }

  export type agentsUpdateToOneWithWhereWithoutPluginStateInput = {
    where?: agentsWhereInput
    data: XOR<agentsUpdateWithoutPluginStateInput, agentsUncheckedUpdateWithoutPluginStateInput>
  }

  export type agentsUpdateWithoutPluginStateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    agent_credentials?: agent_credentialsUpdateManyWithoutAgentsNestedInput
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: spellReleasesUpdateOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesNestedInput
    chatMessages?: chatMessagesUpdateManyWithoutAgentsNestedInput
    graphEvents?: graphEventsUpdateManyWithoutAgentsNestedInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput
  }

  export type agentsUncheckedUpdateWithoutPluginStateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentSpellReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    agent_credentials?: agent_credentialsUncheckedUpdateManyWithoutAgentsNestedInput
    chatMessages?: chatMessagesUncheckedUpdateManyWithoutAgentsNestedInput
    graphEvents?: graphEventsUncheckedUpdateManyWithoutAgentsNestedInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUncheckedUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput
  }

  export type agentsCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    agent_credentials?: agent_credentialsCreateNestedManyWithoutAgentsInput
    chatMessages?: chatMessagesCreateNestedManyWithoutAgentsInput
    graphEvents?: graphEventsCreateNestedManyWithoutAgentsInput
    pluginState?: pluginStateCreateNestedManyWithoutAgentsInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput
  }

  export type agentsUncheckedCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    agent_credentials?: agent_credentialsUncheckedCreateNestedManyWithoutAgentsInput
    chatMessages?: chatMessagesUncheckedCreateNestedManyWithoutAgentsInput
    graphEvents?: graphEventsUncheckedCreateNestedManyWithoutAgentsInput
    pluginState?: pluginStateUncheckedCreateNestedManyWithoutAgentsInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUncheckedCreateNestedManyWithoutAgents_spellReleases_agentIdToagentsInput
  }

  export type agentsCreateOrConnectWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput = {
    where: agentsWhereUniqueInput
    create: XOR<agentsCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput, agentsUncheckedCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput>
  }

  export type agentsCreateManySpellReleases_agents_currentSpellReleaseIdTospellReleasesInputEnvelope = {
    data: agentsCreateManySpellReleases_agents_currentSpellReleaseIdTospellReleasesInput | agentsCreateManySpellReleases_agents_currentSpellReleaseIdTospellReleasesInput[]
    skipDuplicates?: boolean
  }

  export type agentsCreateWithoutSpellReleases_spellReleases_agentIdToagentsInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    agent_credentials?: agent_credentialsCreateNestedManyWithoutAgentsInput
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: spellReleasesCreateNestedOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesInput
    chatMessages?: chatMessagesCreateNestedManyWithoutAgentsInput
    graphEvents?: graphEventsCreateNestedManyWithoutAgentsInput
    pluginState?: pluginStateCreateNestedManyWithoutAgentsInput
  }

  export type agentsUncheckedCreateWithoutSpellReleases_spellReleases_agentIdToagentsInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    currentSpellReleaseId?: string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
    agent_credentials?: agent_credentialsUncheckedCreateNestedManyWithoutAgentsInput
    chatMessages?: chatMessagesUncheckedCreateNestedManyWithoutAgentsInput
    graphEvents?: graphEventsUncheckedCreateNestedManyWithoutAgentsInput
    pluginState?: pluginStateUncheckedCreateNestedManyWithoutAgentsInput
  }

  export type agentsCreateOrConnectWithoutSpellReleases_spellReleases_agentIdToagentsInput = {
    where: agentsWhereUniqueInput
    create: XOR<agentsCreateWithoutSpellReleases_spellReleases_agentIdToagentsInput, agentsUncheckedCreateWithoutSpellReleases_spellReleases_agentIdToagentsInput>
  }

  export type spellsCreateWithoutSpellReleasesInput = {
    id: string
    name?: string | null
    projectId?: string | null
    graph?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: string | null
    updatedAt?: string | null
    type?: string | null
  }

  export type spellsUncheckedCreateWithoutSpellReleasesInput = {
    id: string
    name?: string | null
    projectId?: string | null
    graph?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: string | null
    updatedAt?: string | null
    type?: string | null
  }

  export type spellsCreateOrConnectWithoutSpellReleasesInput = {
    where: spellsWhereUniqueInput
    create: XOR<spellsCreateWithoutSpellReleasesInput, spellsUncheckedCreateWithoutSpellReleasesInput>
  }

  export type spellsCreateManySpellReleasesInputEnvelope = {
    data: spellsCreateManySpellReleasesInput | spellsCreateManySpellReleasesInput[]
    skipDuplicates?: boolean
  }

  export type agentsUpsertWithWhereUniqueWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput = {
    where: agentsWhereUniqueInput
    update: XOR<agentsUpdateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput, agentsUncheckedUpdateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput>
    create: XOR<agentsCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput, agentsUncheckedCreateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput>
  }

  export type agentsUpdateWithWhereUniqueWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput = {
    where: agentsWhereUniqueInput
    data: XOR<agentsUpdateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput, agentsUncheckedUpdateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput>
  }

  export type agentsUpdateManyWithWhereWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput = {
    where: agentsScalarWhereInput
    data: XOR<agentsUpdateManyMutationInput, agentsUncheckedUpdateManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput>
  }

  export type agentsScalarWhereInput = {
    AND?: agentsScalarWhereInput | agentsScalarWhereInput[]
    OR?: agentsScalarWhereInput[]
    NOT?: agentsScalarWhereInput | agentsScalarWhereInput[]
    id?: UuidFilter<"agents"> | string
    rootSpell?: JsonNullableFilter<"agents">
    publicVariables?: StringNullableFilter<"agents"> | string | null
    secrets?: StringNullableFilter<"agents"> | string | null
    name?: StringNullableFilter<"agents"> | string | null
    enabled?: BoolNullableFilter<"agents"> | boolean | null
    updatedAt?: StringNullableFilter<"agents"> | string | null
    pingedAt?: StringNullableFilter<"agents"> | string | null
    projectId?: StringNullableFilter<"agents"> | string | null
    data?: JsonNullableFilter<"agents">
    runState?: StringFilter<"agents"> | string
    image?: StringNullableFilter<"agents"> | string | null
    rootSpellId?: UuidNullableFilter<"agents"> | string | null
    default?: BoolFilter<"agents"> | boolean
    createdAt?: DateTimeNullableFilter<"agents"> | Date | string | null
    currentSpellReleaseId?: UuidNullableFilter<"agents"> | string | null
    embedModel?: StringNullableFilter<"agents"> | string | null
    version?: StringFilter<"agents"> | string
    embeddingProvider?: StringNullableFilter<"agents"> | string | null
    embeddingModel?: StringNullableFilter<"agents"> | string | null
    isDraft?: BoolFilter<"agents"> | boolean
  }

  export type agentsUpsertWithoutSpellReleases_spellReleases_agentIdToagentsInput = {
    update: XOR<agentsUpdateWithoutSpellReleases_spellReleases_agentIdToagentsInput, agentsUncheckedUpdateWithoutSpellReleases_spellReleases_agentIdToagentsInput>
    create: XOR<agentsCreateWithoutSpellReleases_spellReleases_agentIdToagentsInput, agentsUncheckedCreateWithoutSpellReleases_spellReleases_agentIdToagentsInput>
    where?: agentsWhereInput
  }

  export type agentsUpdateToOneWithWhereWithoutSpellReleases_spellReleases_agentIdToagentsInput = {
    where?: agentsWhereInput
    data: XOR<agentsUpdateWithoutSpellReleases_spellReleases_agentIdToagentsInput, agentsUncheckedUpdateWithoutSpellReleases_spellReleases_agentIdToagentsInput>
  }

  export type agentsUpdateWithoutSpellReleases_spellReleases_agentIdToagentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    agent_credentials?: agent_credentialsUpdateManyWithoutAgentsNestedInput
    spellReleases_agents_currentSpellReleaseIdTospellReleases?: spellReleasesUpdateOneWithoutAgents_agents_currentSpellReleaseIdTospellReleasesNestedInput
    chatMessages?: chatMessagesUpdateManyWithoutAgentsNestedInput
    graphEvents?: graphEventsUpdateManyWithoutAgentsNestedInput
    pluginState?: pluginStateUpdateManyWithoutAgentsNestedInput
  }

  export type agentsUncheckedUpdateWithoutSpellReleases_spellReleases_agentIdToagentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentSpellReleaseId?: NullableStringFieldUpdateOperationsInput | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    agent_credentials?: agent_credentialsUncheckedUpdateManyWithoutAgentsNestedInput
    chatMessages?: chatMessagesUncheckedUpdateManyWithoutAgentsNestedInput
    graphEvents?: graphEventsUncheckedUpdateManyWithoutAgentsNestedInput
    pluginState?: pluginStateUncheckedUpdateManyWithoutAgentsNestedInput
  }

  export type spellsUpsertWithWhereUniqueWithoutSpellReleasesInput = {
    where: spellsWhereUniqueInput
    update: XOR<spellsUpdateWithoutSpellReleasesInput, spellsUncheckedUpdateWithoutSpellReleasesInput>
    create: XOR<spellsCreateWithoutSpellReleasesInput, spellsUncheckedCreateWithoutSpellReleasesInput>
  }

  export type spellsUpdateWithWhereUniqueWithoutSpellReleasesInput = {
    where: spellsWhereUniqueInput
    data: XOR<spellsUpdateWithoutSpellReleasesInput, spellsUncheckedUpdateWithoutSpellReleasesInput>
  }

  export type spellsUpdateManyWithWhereWithoutSpellReleasesInput = {
    where: spellsScalarWhereInput
    data: XOR<spellsUpdateManyMutationInput, spellsUncheckedUpdateManyWithoutSpellReleasesInput>
  }

  export type spellsScalarWhereInput = {
    AND?: spellsScalarWhereInput | spellsScalarWhereInput[]
    OR?: spellsScalarWhereInput[]
    NOT?: spellsScalarWhereInput | spellsScalarWhereInput[]
    id?: UuidFilter<"spells"> | string
    name?: StringNullableFilter<"spells"> | string | null
    projectId?: StringNullableFilter<"spells"> | string | null
    graph?: JsonNullableFilter<"spells">
    createdAt?: StringNullableFilter<"spells"> | string | null
    updatedAt?: StringNullableFilter<"spells"> | string | null
    type?: StringNullableFilter<"spells"> | string | null
    spellReleaseId?: UuidNullableFilter<"spells"> | string | null
  }

  export type spellReleasesCreateWithoutSpellsInput = {
    id: string
    description?: string | null
    spellId?: string | null
    projectId?: string | null
    createdAt?: Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: agentsCreateNestedManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput
    agents_spellReleases_agentIdToagents: agentsCreateNestedOneWithoutSpellReleases_spellReleases_agentIdToagentsInput
  }

  export type spellReleasesUncheckedCreateWithoutSpellsInput = {
    id: string
    description?: string | null
    agentId: string
    spellId?: string | null
    projectId?: string | null
    createdAt?: Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: agentsUncheckedCreateNestedManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput
  }

  export type spellReleasesCreateOrConnectWithoutSpellsInput = {
    where: spellReleasesWhereUniqueInput
    create: XOR<spellReleasesCreateWithoutSpellsInput, spellReleasesUncheckedCreateWithoutSpellsInput>
  }

  export type spellReleasesUpsertWithoutSpellsInput = {
    update: XOR<spellReleasesUpdateWithoutSpellsInput, spellReleasesUncheckedUpdateWithoutSpellsInput>
    create: XOR<spellReleasesCreateWithoutSpellsInput, spellReleasesUncheckedCreateWithoutSpellsInput>
    where?: spellReleasesWhereInput
  }

  export type spellReleasesUpdateToOneWithWhereWithoutSpellsInput = {
    where?: spellReleasesWhereInput
    data: XOR<spellReleasesUpdateWithoutSpellsInput, spellReleasesUncheckedUpdateWithoutSpellsInput>
  }

  export type spellReleasesUpdateWithoutSpellsInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    spellId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: agentsUpdateManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesNestedInput
    agents_spellReleases_agentIdToagents?: agentsUpdateOneRequiredWithoutSpellReleases_spellReleases_agentIdToagentsNestedInput
  }

  export type spellReleasesUncheckedUpdateWithoutSpellsInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: StringFieldUpdateOperationsInput | string
    spellId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: agentsUncheckedUpdateManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesNestedInput
  }

  export type agent_credentialsCreateManyAgentsInput = {
    credentialId: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type chatMessagesCreateManyAgentsInput = {
    id?: string
    sender?: string | null
    connector: string
    content?: string | null
    conversationId?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type graphEventsCreateManyAgentsInput = {
    id?: string
    sender: string
    connector: string
    connectorData?: NullableJsonNullValueInput | InputJsonValue
    channel?: string | null
    content: string
    eventType: string
    created_at?: Date | string
    updated_at?: Date | string
    event?: NullableJsonNullValueInput | InputJsonValue
    observer?: string | null
  }

  export type pluginStateCreateManyAgentsInput = {
    id?: string
    state?: NullableJsonNullValueInput | InputJsonValue
    plugin?: string | null
  }

  export type spellReleasesCreateManyAgents_spellReleases_agentIdToagentsInput = {
    id: string
    description?: string | null
    spellId?: string | null
    projectId?: string | null
    createdAt?: Date | string | null
  }

  export type agent_credentialsUpdateWithoutAgentsInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    credentials?: credentialsUpdateOneRequiredWithoutAgent_credentialsNestedInput
  }

  export type agent_credentialsUncheckedUpdateWithoutAgentsInput = {
    credentialId?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type agent_credentialsUncheckedUpdateManyWithoutAgentsInput = {
    credentialId?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type chatMessagesUpdateWithoutAgentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: NullableStringFieldUpdateOperationsInput | string | null
    connector?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type chatMessagesUncheckedUpdateWithoutAgentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: NullableStringFieldUpdateOperationsInput | string | null
    connector?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type chatMessagesUncheckedUpdateManyWithoutAgentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: NullableStringFieldUpdateOperationsInput | string | null
    connector?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type graphEventsUpdateWithoutAgentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    connector?: StringFieldUpdateOperationsInput | string
    connectorData?: NullableJsonNullValueInput | InputJsonValue
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: NullableJsonNullValueInput | InputJsonValue
    observer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type graphEventsUncheckedUpdateWithoutAgentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    connector?: StringFieldUpdateOperationsInput | string
    connectorData?: NullableJsonNullValueInput | InputJsonValue
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: NullableJsonNullValueInput | InputJsonValue
    observer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type graphEventsUncheckedUpdateManyWithoutAgentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    connector?: StringFieldUpdateOperationsInput | string
    connectorData?: NullableJsonNullValueInput | InputJsonValue
    channel?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: NullableJsonNullValueInput | InputJsonValue
    observer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type pluginStateUpdateWithoutAgentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    state?: NullableJsonNullValueInput | InputJsonValue
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type pluginStateUncheckedUpdateWithoutAgentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    state?: NullableJsonNullValueInput | InputJsonValue
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type pluginStateUncheckedUpdateManyWithoutAgentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    state?: NullableJsonNullValueInput | InputJsonValue
    plugin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type spellReleasesUpdateWithoutAgents_spellReleases_agentIdToagentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    spellId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: agentsUpdateManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesNestedInput
    spells?: spellsUpdateManyWithoutSpellReleasesNestedInput
  }

  export type spellReleasesUncheckedUpdateWithoutAgents_spellReleases_agentIdToagentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    spellId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agents_agents_currentSpellReleaseIdTospellReleases?: agentsUncheckedUpdateManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesNestedInput
    spells?: spellsUncheckedUpdateManyWithoutSpellReleasesNestedInput
  }

  export type spellReleasesUncheckedUpdateManyWithoutAgents_spellReleases_agentIdToagentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    spellId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type agent_credentialsCreateManyCredentialsInput = {
    agentId: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type agent_credentialsUpdateWithoutCredentialsInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    agents?: agentsUpdateOneRequiredWithoutAgent_credentialsNestedInput
  }

  export type agent_credentialsUncheckedUpdateWithoutCredentialsInput = {
    agentId?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type agent_credentialsUncheckedUpdateManyWithoutCredentialsInput = {
    agentId?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type agentsCreateManySpellReleases_agents_currentSpellReleaseIdTospellReleasesInput = {
    id: string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: string | null
    secrets?: string | null
    name?: string | null
    enabled?: boolean | null
    updatedAt?: string | null
    pingedAt?: string | null
    projectId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: string
    image?: string | null
    rootSpellId?: string | null
    default?: boolean
    createdAt?: Date | string | null
    embedModel?: string | null
    version?: string
    embeddingProvider?: string | null
    embeddingModel?: string | null
    isDraft?: boolean
  }

  export type spellsCreateManySpellReleasesInput = {
    id: string
    name?: string | null
    projectId?: string | null
    graph?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: string | null
    updatedAt?: string | null
    type?: string | null
  }

  export type agentsUpdateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    agent_credentials?: agent_credentialsUpdateManyWithoutAgentsNestedInput
    chatMessages?: chatMessagesUpdateManyWithoutAgentsNestedInput
    graphEvents?: graphEventsUpdateManyWithoutAgentsNestedInput
    pluginState?: pluginStateUpdateManyWithoutAgentsNestedInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput
  }

  export type agentsUncheckedUpdateWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
    agent_credentials?: agent_credentialsUncheckedUpdateManyWithoutAgentsNestedInput
    chatMessages?: chatMessagesUncheckedUpdateManyWithoutAgentsNestedInput
    graphEvents?: graphEventsUncheckedUpdateManyWithoutAgentsNestedInput
    pluginState?: pluginStateUncheckedUpdateManyWithoutAgentsNestedInput
    spellReleases_spellReleases_agentIdToagents?: spellReleasesUncheckedUpdateManyWithoutAgents_spellReleases_agentIdToagentsNestedInput
  }

  export type agentsUncheckedUpdateManyWithoutSpellReleases_agents_currentSpellReleaseIdTospellReleasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    rootSpell?: NullableJsonNullValueInput | InputJsonValue
    publicVariables?: NullableStringFieldUpdateOperationsInput | string | null
    secrets?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: NullableBoolFieldUpdateOperationsInput | boolean | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    pingedAt?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    runState?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    rootSpellId?: NullableStringFieldUpdateOperationsInput | string | null
    default?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    embedModel?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    embeddingProvider?: NullableStringFieldUpdateOperationsInput | string | null
    embeddingModel?: NullableStringFieldUpdateOperationsInput | string | null
    isDraft?: BoolFieldUpdateOperationsInput | boolean
  }

  export type spellsUpdateWithoutSpellReleasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    graph?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type spellsUncheckedUpdateWithoutSpellReleasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    graph?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type spellsUncheckedUpdateManyWithoutSpellReleasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    graph?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use AgentsCountOutputTypeDefaultArgs instead
     */
    export type AgentsCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AgentsCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CredentialsCountOutputTypeDefaultArgs instead
     */
    export type CredentialsCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CredentialsCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SpellReleasesCountOutputTypeDefaultArgs instead
     */
    export type SpellReleasesCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SpellReleasesCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use agent_credentialsDefaultArgs instead
     */
    export type agent_credentialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = agent_credentialsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use agentsDefaultArgs instead
     */
    export type agentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = agentsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use chatMessagesDefaultArgs instead
     */
    export type chatMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = chatMessagesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use credentialsDefaultArgs instead
     */
    export type credentialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = credentialsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use documentsDefaultArgs instead
     */
    export type documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = documentsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use embeddingsDefaultArgs instead
     */
    export type embeddingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = embeddingsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use public_eventsDefaultArgs instead
     */
    export type public_eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = public_eventsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use graphEventsDefaultArgs instead
     */
    export type graphEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = graphEventsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use public_knex_migrationsDefaultArgs instead
     */
    export type public_knex_migrationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = public_knex_migrationsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use public_knex_migrations_lockDefaultArgs instead
     */
    export type public_knex_migrations_lockArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = public_knex_migrations_lockDefaultArgs<ExtArgs>
    /**
     * @deprecated Use knowledgeDefaultArgs instead
     */
    export type knowledgeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = knowledgeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use pluginStateDefaultArgs instead
     */
    export type pluginStateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = pluginStateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use requestDefaultArgs instead
     */
    export type requestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = requestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use spellReleasesDefaultArgs instead
     */
    export type spellReleasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = spellReleasesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use spellsDefaultArgs instead
     */
    export type spellsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = spellsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use tasksDefaultArgs instead
     */
    export type tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = tasksDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
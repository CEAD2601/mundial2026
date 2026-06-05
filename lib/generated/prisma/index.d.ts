
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Setting
 * 
 */
export type Setting = $Result.DefaultSelection<Prisma.$SettingPayload>
/**
 * Model Team
 * 
 */
export type Team = $Result.DefaultSelection<Prisma.$TeamPayload>
/**
 * Model Match
 * 
 */
export type Match = $Result.DefaultSelection<Prisma.$MatchPayload>
/**
 * Model Participant
 * 
 */
export type Participant = $Result.DefaultSelection<Prisma.$ParticipantPayload>
/**
 * Model Prediction
 * 
 */
export type Prediction = $Result.DefaultSelection<Prisma.$PredictionPayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model RankingSnapshot
 * 
 */
export type RankingSnapshot = $Result.DefaultSelection<Prisma.$RankingSnapshotPayload>
/**
 * Model LiveResultsLog
 * 
 */
export type LiveResultsLog = $Result.DefaultSelection<Prisma.$LiveResultsLogPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const MatchStatus: {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED'
};

export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus]


export const MatchResult: {
  G1: 'G1',
  E: 'E',
  G2: 'G2'
};

export type MatchResult = (typeof MatchResult)[keyof typeof MatchResult]


export const PaymentStatus: {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]

}

export type MatchStatus = $Enums.MatchStatus

export const MatchStatus: typeof $Enums.MatchStatus

export type MatchResult = $Enums.MatchResult

export const MatchResult: typeof $Enums.MatchResult

export type PaymentStatus = $Enums.PaymentStatus

export const PaymentStatus: typeof $Enums.PaymentStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Settings
 * const settings = await prisma.setting.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Settings
   * const settings = await prisma.setting.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.setting`: Exposes CRUD operations for the **Setting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Settings
    * const settings = await prisma.setting.findMany()
    * ```
    */
  get setting(): Prisma.SettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.team`: Exposes CRUD operations for the **Team** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Teams
    * const teams = await prisma.team.findMany()
    * ```
    */
  get team(): Prisma.TeamDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.match`: Exposes CRUD operations for the **Match** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Matches
    * const matches = await prisma.match.findMany()
    * ```
    */
  get match(): Prisma.MatchDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.participant`: Exposes CRUD operations for the **Participant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Participants
    * const participants = await prisma.participant.findMany()
    * ```
    */
  get participant(): Prisma.ParticipantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.prediction`: Exposes CRUD operations for the **Prediction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Predictions
    * const predictions = await prisma.prediction.findMany()
    * ```
    */
  get prediction(): Prisma.PredictionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rankingSnapshot`: Exposes CRUD operations for the **RankingSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RankingSnapshots
    * const rankingSnapshots = await prisma.rankingSnapshot.findMany()
    * ```
    */
  get rankingSnapshot(): Prisma.RankingSnapshotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.liveResultsLog`: Exposes CRUD operations for the **LiveResultsLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LiveResultsLogs
    * const liveResultsLogs = await prisma.liveResultsLog.findMany()
    * ```
    */
  get liveResultsLog(): Prisma.LiveResultsLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

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

  type SelectAndOmit = {
    select: any
    omit: any
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
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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
    Setting: 'Setting',
    Team: 'Team',
    Match: 'Match',
    Participant: 'Participant',
    Prediction: 'Prediction',
    Payment: 'Payment',
    RankingSnapshot: 'RankingSnapshot',
    LiveResultsLog: 'LiveResultsLog',
    AuditLog: 'AuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "setting" | "team" | "match" | "participant" | "prediction" | "payment" | "rankingSnapshot" | "liveResultsLog" | "auditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Setting: {
        payload: Prisma.$SettingPayload<ExtArgs>
        fields: Prisma.SettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          findFirst: {
            args: Prisma.SettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          findMany: {
            args: Prisma.SettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          create: {
            args: Prisma.SettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          createMany: {
            args: Prisma.SettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          delete: {
            args: Prisma.SettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          update: {
            args: Prisma.SettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          deleteMany: {
            args: Prisma.SettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SettingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          upsert: {
            args: Prisma.SettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          aggregate: {
            args: Prisma.SettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSetting>
          }
          groupBy: {
            args: Prisma.SettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<SettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.SettingCountArgs<ExtArgs>
            result: $Utils.Optional<SettingCountAggregateOutputType> | number
          }
        }
      }
      Team: {
        payload: Prisma.$TeamPayload<ExtArgs>
        fields: Prisma.TeamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findFirst: {
            args: Prisma.TeamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findMany: {
            args: Prisma.TeamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          create: {
            args: Prisma.TeamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          createMany: {
            args: Prisma.TeamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          delete: {
            args: Prisma.TeamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          update: {
            args: Prisma.TeamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          deleteMany: {
            args: Prisma.TeamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          upsert: {
            args: Prisma.TeamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          aggregate: {
            args: Prisma.TeamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeam>
          }
          groupBy: {
            args: Prisma.TeamGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamCountArgs<ExtArgs>
            result: $Utils.Optional<TeamCountAggregateOutputType> | number
          }
        }
      }
      Match: {
        payload: Prisma.$MatchPayload<ExtArgs>
        fields: Prisma.MatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findFirst: {
            args: Prisma.MatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findMany: {
            args: Prisma.MatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          create: {
            args: Prisma.MatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          createMany: {
            args: Prisma.MatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          delete: {
            args: Prisma.MatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          update: {
            args: Prisma.MatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          deleteMany: {
            args: Prisma.MatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          upsert: {
            args: Prisma.MatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          aggregate: {
            args: Prisma.MatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatch>
          }
          groupBy: {
            args: Prisma.MatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchCountArgs<ExtArgs>
            result: $Utils.Optional<MatchCountAggregateOutputType> | number
          }
        }
      }
      Participant: {
        payload: Prisma.$ParticipantPayload<ExtArgs>
        fields: Prisma.ParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          findFirst: {
            args: Prisma.ParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          findMany: {
            args: Prisma.ParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>[]
          }
          create: {
            args: Prisma.ParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          createMany: {
            args: Prisma.ParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>[]
          }
          delete: {
            args: Prisma.ParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          update: {
            args: Prisma.ParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          deleteMany: {
            args: Prisma.ParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ParticipantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>[]
          }
          upsert: {
            args: Prisma.ParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantPayload>
          }
          aggregate: {
            args: Prisma.ParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateParticipant>
          }
          groupBy: {
            args: Prisma.ParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<ParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.ParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<ParticipantCountAggregateOutputType> | number
          }
        }
      }
      Prediction: {
        payload: Prisma.$PredictionPayload<ExtArgs>
        fields: Prisma.PredictionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PredictionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PredictionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictionPayload>
          }
          findFirst: {
            args: Prisma.PredictionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PredictionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictionPayload>
          }
          findMany: {
            args: Prisma.PredictionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictionPayload>[]
          }
          create: {
            args: Prisma.PredictionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictionPayload>
          }
          createMany: {
            args: Prisma.PredictionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PredictionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictionPayload>[]
          }
          delete: {
            args: Prisma.PredictionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictionPayload>
          }
          update: {
            args: Prisma.PredictionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictionPayload>
          }
          deleteMany: {
            args: Prisma.PredictionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PredictionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PredictionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictionPayload>[]
          }
          upsert: {
            args: Prisma.PredictionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictionPayload>
          }
          aggregate: {
            args: Prisma.PredictionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrediction>
          }
          groupBy: {
            args: Prisma.PredictionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PredictionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PredictionCountArgs<ExtArgs>
            result: $Utils.Optional<PredictionCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      RankingSnapshot: {
        payload: Prisma.$RankingSnapshotPayload<ExtArgs>
        fields: Prisma.RankingSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RankingSnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RankingSnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>
          }
          findFirst: {
            args: Prisma.RankingSnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RankingSnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>
          }
          findMany: {
            args: Prisma.RankingSnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>[]
          }
          create: {
            args: Prisma.RankingSnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>
          }
          createMany: {
            args: Prisma.RankingSnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RankingSnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>[]
          }
          delete: {
            args: Prisma.RankingSnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>
          }
          update: {
            args: Prisma.RankingSnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.RankingSnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RankingSnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RankingSnapshotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>[]
          }
          upsert: {
            args: Prisma.RankingSnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RankingSnapshotPayload>
          }
          aggregate: {
            args: Prisma.RankingSnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRankingSnapshot>
          }
          groupBy: {
            args: Prisma.RankingSnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<RankingSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.RankingSnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<RankingSnapshotCountAggregateOutputType> | number
          }
        }
      }
      LiveResultsLog: {
        payload: Prisma.$LiveResultsLogPayload<ExtArgs>
        fields: Prisma.LiveResultsLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LiveResultsLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LiveResultsLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LiveResultsLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LiveResultsLogPayload>
          }
          findFirst: {
            args: Prisma.LiveResultsLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LiveResultsLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LiveResultsLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LiveResultsLogPayload>
          }
          findMany: {
            args: Prisma.LiveResultsLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LiveResultsLogPayload>[]
          }
          create: {
            args: Prisma.LiveResultsLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LiveResultsLogPayload>
          }
          createMany: {
            args: Prisma.LiveResultsLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LiveResultsLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LiveResultsLogPayload>[]
          }
          delete: {
            args: Prisma.LiveResultsLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LiveResultsLogPayload>
          }
          update: {
            args: Prisma.LiveResultsLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LiveResultsLogPayload>
          }
          deleteMany: {
            args: Prisma.LiveResultsLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LiveResultsLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LiveResultsLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LiveResultsLogPayload>[]
          }
          upsert: {
            args: Prisma.LiveResultsLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LiveResultsLogPayload>
          }
          aggregate: {
            args: Prisma.LiveResultsLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLiveResultsLog>
          }
          groupBy: {
            args: Prisma.LiveResultsLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<LiveResultsLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.LiveResultsLogCountArgs<ExtArgs>
            result: $Utils.Optional<LiveResultsLogCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    setting?: SettingOmit
    team?: TeamOmit
    match?: MatchOmit
    participant?: ParticipantOmit
    prediction?: PredictionOmit
    payment?: PaymentOmit
    rankingSnapshot?: RankingSnapshotOmit
    liveResultsLog?: LiveResultsLogOmit
    auditLog?: AuditLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
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
   * Count Type TeamCountOutputType
   */

  export type TeamCountOutputType = {
    matchesAsTeam1: number
    matchesAsTeam2: number
  }

  export type TeamCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    matchesAsTeam1?: boolean | TeamCountOutputTypeCountMatchesAsTeam1Args
    matchesAsTeam2?: boolean | TeamCountOutputTypeCountMatchesAsTeam2Args
  }

  // Custom InputTypes
  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamCountOutputType
     */
    select?: TeamCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountMatchesAsTeam1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountMatchesAsTeam2Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }


  /**
   * Count Type MatchCountOutputType
   */

  export type MatchCountOutputType = {
    predictions: number
  }

  export type MatchCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    predictions?: boolean | MatchCountOutputTypeCountPredictionsArgs
  }

  // Custom InputTypes
  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCountOutputType
     */
    select?: MatchCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeCountPredictionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PredictionWhereInput
  }


  /**
   * Count Type ParticipantCountOutputType
   */

  export type ParticipantCountOutputType = {
    predictions: number
  }

  export type ParticipantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    predictions?: boolean | ParticipantCountOutputTypeCountPredictionsArgs
  }

  // Custom InputTypes
  /**
   * ParticipantCountOutputType without action
   */
  export type ParticipantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantCountOutputType
     */
    select?: ParticipantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ParticipantCountOutputType without action
   */
  export type ParticipantCountOutputTypeCountPredictionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PredictionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Setting
   */

  export type AggregateSetting = {
    _count: SettingCountAggregateOutputType | null
    _avg: SettingAvgAggregateOutputType | null
    _sum: SettingSumAggregateOutputType | null
    _min: SettingMinAggregateOutputType | null
    _max: SettingMaxAggregateOutputType | null
  }

  export type SettingAvgAggregateOutputType = {
    entryPriceUsd: number | null
    manualExchangeRate: number | null
    firstPrizePercent: number | null
    secondPrizePercent: number | null
    organizationPercent: number | null
  }

  export type SettingSumAggregateOutputType = {
    entryPriceUsd: number | null
    manualExchangeRate: number | null
    firstPrizePercent: number | null
    secondPrizePercent: number | null
    organizationPercent: number | null
  }

  export type SettingMinAggregateOutputType = {
    id: string | null
    appName: string | null
    entryPriceUsd: number | null
    paymentPhone: string | null
    paymentNationalId: string | null
    paymentBank: string | null
    exchangeRateCurrency: string | null
    manualExchangeRate: number | null
    manualExchangeRateDate: Date | null
    firstPrizePercent: number | null
    secondPrizePercent: number | null
    organizationPercent: number | null
    deadline: Date | null
    rankingVisible: boolean | null
    showOnlyPaidParticipants: boolean | null
    allowPublicPredictionViewAfterDeadline: boolean | null
    tiebreakerRules: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SettingMaxAggregateOutputType = {
    id: string | null
    appName: string | null
    entryPriceUsd: number | null
    paymentPhone: string | null
    paymentNationalId: string | null
    paymentBank: string | null
    exchangeRateCurrency: string | null
    manualExchangeRate: number | null
    manualExchangeRateDate: Date | null
    firstPrizePercent: number | null
    secondPrizePercent: number | null
    organizationPercent: number | null
    deadline: Date | null
    rankingVisible: boolean | null
    showOnlyPaidParticipants: boolean | null
    allowPublicPredictionViewAfterDeadline: boolean | null
    tiebreakerRules: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SettingCountAggregateOutputType = {
    id: number
    appName: number
    entryPriceUsd: number
    paymentPhone: number
    paymentNationalId: number
    paymentBank: number
    exchangeRateCurrency: number
    manualExchangeRate: number
    manualExchangeRateDate: number
    firstPrizePercent: number
    secondPrizePercent: number
    organizationPercent: number
    deadline: number
    rankingVisible: number
    showOnlyPaidParticipants: number
    allowPublicPredictionViewAfterDeadline: number
    tiebreakerRules: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SettingAvgAggregateInputType = {
    entryPriceUsd?: true
    manualExchangeRate?: true
    firstPrizePercent?: true
    secondPrizePercent?: true
    organizationPercent?: true
  }

  export type SettingSumAggregateInputType = {
    entryPriceUsd?: true
    manualExchangeRate?: true
    firstPrizePercent?: true
    secondPrizePercent?: true
    organizationPercent?: true
  }

  export type SettingMinAggregateInputType = {
    id?: true
    appName?: true
    entryPriceUsd?: true
    paymentPhone?: true
    paymentNationalId?: true
    paymentBank?: true
    exchangeRateCurrency?: true
    manualExchangeRate?: true
    manualExchangeRateDate?: true
    firstPrizePercent?: true
    secondPrizePercent?: true
    organizationPercent?: true
    deadline?: true
    rankingVisible?: true
    showOnlyPaidParticipants?: true
    allowPublicPredictionViewAfterDeadline?: true
    tiebreakerRules?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SettingMaxAggregateInputType = {
    id?: true
    appName?: true
    entryPriceUsd?: true
    paymentPhone?: true
    paymentNationalId?: true
    paymentBank?: true
    exchangeRateCurrency?: true
    manualExchangeRate?: true
    manualExchangeRateDate?: true
    firstPrizePercent?: true
    secondPrizePercent?: true
    organizationPercent?: true
    deadline?: true
    rankingVisible?: true
    showOnlyPaidParticipants?: true
    allowPublicPredictionViewAfterDeadline?: true
    tiebreakerRules?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SettingCountAggregateInputType = {
    id?: true
    appName?: true
    entryPriceUsd?: true
    paymentPhone?: true
    paymentNationalId?: true
    paymentBank?: true
    exchangeRateCurrency?: true
    manualExchangeRate?: true
    manualExchangeRateDate?: true
    firstPrizePercent?: true
    secondPrizePercent?: true
    organizationPercent?: true
    deadline?: true
    rankingVisible?: true
    showOnlyPaidParticipants?: true
    allowPublicPredictionViewAfterDeadline?: true
    tiebreakerRules?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Setting to aggregate.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Settings
    **/
    _count?: true | SettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SettingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SettingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SettingMaxAggregateInputType
  }

  export type GetSettingAggregateType<T extends SettingAggregateArgs> = {
        [P in keyof T & keyof AggregateSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSetting[P]>
      : GetScalarType<T[P], AggregateSetting[P]>
  }




  export type SettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SettingWhereInput
    orderBy?: SettingOrderByWithAggregationInput | SettingOrderByWithAggregationInput[]
    by: SettingScalarFieldEnum[] | SettingScalarFieldEnum
    having?: SettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SettingCountAggregateInputType | true
    _avg?: SettingAvgAggregateInputType
    _sum?: SettingSumAggregateInputType
    _min?: SettingMinAggregateInputType
    _max?: SettingMaxAggregateInputType
  }

  export type SettingGroupByOutputType = {
    id: string
    appName: string
    entryPriceUsd: number
    paymentPhone: string
    paymentNationalId: string
    paymentBank: string
    exchangeRateCurrency: string
    manualExchangeRate: number | null
    manualExchangeRateDate: Date | null
    firstPrizePercent: number
    secondPrizePercent: number
    organizationPercent: number
    deadline: Date | null
    rankingVisible: boolean
    showOnlyPaidParticipants: boolean
    allowPublicPredictionViewAfterDeadline: boolean
    tiebreakerRules: string
    createdAt: Date
    updatedAt: Date
    _count: SettingCountAggregateOutputType | null
    _avg: SettingAvgAggregateOutputType | null
    _sum: SettingSumAggregateOutputType | null
    _min: SettingMinAggregateOutputType | null
    _max: SettingMaxAggregateOutputType | null
  }

  type GetSettingGroupByPayload<T extends SettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SettingGroupByOutputType[P]>
            : GetScalarType<T[P], SettingGroupByOutputType[P]>
        }
      >
    >


  export type SettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    appName?: boolean
    entryPriceUsd?: boolean
    paymentPhone?: boolean
    paymentNationalId?: boolean
    paymentBank?: boolean
    exchangeRateCurrency?: boolean
    manualExchangeRate?: boolean
    manualExchangeRateDate?: boolean
    firstPrizePercent?: boolean
    secondPrizePercent?: boolean
    organizationPercent?: boolean
    deadline?: boolean
    rankingVisible?: boolean
    showOnlyPaidParticipants?: boolean
    allowPublicPredictionViewAfterDeadline?: boolean
    tiebreakerRules?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    appName?: boolean
    entryPriceUsd?: boolean
    paymentPhone?: boolean
    paymentNationalId?: boolean
    paymentBank?: boolean
    exchangeRateCurrency?: boolean
    manualExchangeRate?: boolean
    manualExchangeRateDate?: boolean
    firstPrizePercent?: boolean
    secondPrizePercent?: boolean
    organizationPercent?: boolean
    deadline?: boolean
    rankingVisible?: boolean
    showOnlyPaidParticipants?: boolean
    allowPublicPredictionViewAfterDeadline?: boolean
    tiebreakerRules?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    appName?: boolean
    entryPriceUsd?: boolean
    paymentPhone?: boolean
    paymentNationalId?: boolean
    paymentBank?: boolean
    exchangeRateCurrency?: boolean
    manualExchangeRate?: boolean
    manualExchangeRateDate?: boolean
    firstPrizePercent?: boolean
    secondPrizePercent?: boolean
    organizationPercent?: boolean
    deadline?: boolean
    rankingVisible?: boolean
    showOnlyPaidParticipants?: boolean
    allowPublicPredictionViewAfterDeadline?: boolean
    tiebreakerRules?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectScalar = {
    id?: boolean
    appName?: boolean
    entryPriceUsd?: boolean
    paymentPhone?: boolean
    paymentNationalId?: boolean
    paymentBank?: boolean
    exchangeRateCurrency?: boolean
    manualExchangeRate?: boolean
    manualExchangeRateDate?: boolean
    firstPrizePercent?: boolean
    secondPrizePercent?: boolean
    organizationPercent?: boolean
    deadline?: boolean
    rankingVisible?: boolean
    showOnlyPaidParticipants?: boolean
    allowPublicPredictionViewAfterDeadline?: boolean
    tiebreakerRules?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "appName" | "entryPriceUsd" | "paymentPhone" | "paymentNationalId" | "paymentBank" | "exchangeRateCurrency" | "manualExchangeRate" | "manualExchangeRateDate" | "firstPrizePercent" | "secondPrizePercent" | "organizationPercent" | "deadline" | "rankingVisible" | "showOnlyPaidParticipants" | "allowPublicPredictionViewAfterDeadline" | "tiebreakerRules" | "createdAt" | "updatedAt", ExtArgs["result"]["setting"]>

  export type $SettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Setting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      appName: string
      entryPriceUsd: number
      paymentPhone: string
      paymentNationalId: string
      paymentBank: string
      exchangeRateCurrency: string
      manualExchangeRate: number | null
      manualExchangeRateDate: Date | null
      firstPrizePercent: number
      secondPrizePercent: number
      organizationPercent: number
      deadline: Date | null
      rankingVisible: boolean
      showOnlyPaidParticipants: boolean
      allowPublicPredictionViewAfterDeadline: boolean
      tiebreakerRules: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["setting"]>
    composites: {}
  }

  type SettingGetPayload<S extends boolean | null | undefined | SettingDefaultArgs> = $Result.GetResult<Prisma.$SettingPayload, S>

  type SettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SettingCountAggregateInputType | true
    }

  export interface SettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Setting'], meta: { name: 'Setting' } }
    /**
     * Find zero or one Setting that matches the filter.
     * @param {SettingFindUniqueArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettingFindUniqueArgs>(args: SelectSubset<T, SettingFindUniqueArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Setting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SettingFindUniqueOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettingFindUniqueOrThrowArgs>(args: SelectSubset<T, SettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Setting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettingFindFirstArgs>(args?: SelectSubset<T, SettingFindFirstArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Setting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettingFindFirstOrThrowArgs>(args?: SelectSubset<T, SettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Settings
     * const settings = await prisma.setting.findMany()
     * 
     * // Get first 10 Settings
     * const settings = await prisma.setting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const settingWithIdOnly = await prisma.setting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SettingFindManyArgs>(args?: SelectSubset<T, SettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Setting.
     * @param {SettingCreateArgs} args - Arguments to create a Setting.
     * @example
     * // Create one Setting
     * const Setting = await prisma.setting.create({
     *   data: {
     *     // ... data to create a Setting
     *   }
     * })
     * 
     */
    create<T extends SettingCreateArgs>(args: SelectSubset<T, SettingCreateArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Settings.
     * @param {SettingCreateManyArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const setting = await prisma.setting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SettingCreateManyArgs>(args?: SelectSubset<T, SettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Settings and returns the data saved in the database.
     * @param {SettingCreateManyAndReturnArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const setting = await prisma.setting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Settings and only return the `id`
     * const settingWithIdOnly = await prisma.setting.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SettingCreateManyAndReturnArgs>(args?: SelectSubset<T, SettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Setting.
     * @param {SettingDeleteArgs} args - Arguments to delete one Setting.
     * @example
     * // Delete one Setting
     * const Setting = await prisma.setting.delete({
     *   where: {
     *     // ... filter to delete one Setting
     *   }
     * })
     * 
     */
    delete<T extends SettingDeleteArgs>(args: SelectSubset<T, SettingDeleteArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Setting.
     * @param {SettingUpdateArgs} args - Arguments to update one Setting.
     * @example
     * // Update one Setting
     * const setting = await prisma.setting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SettingUpdateArgs>(args: SelectSubset<T, SettingUpdateArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Settings.
     * @param {SettingDeleteManyArgs} args - Arguments to filter Settings to delete.
     * @example
     * // Delete a few Settings
     * const { count } = await prisma.setting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SettingDeleteManyArgs>(args?: SelectSubset<T, SettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Settings
     * const setting = await prisma.setting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SettingUpdateManyArgs>(args: SelectSubset<T, SettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings and returns the data updated in the database.
     * @param {SettingUpdateManyAndReturnArgs} args - Arguments to update many Settings.
     * @example
     * // Update many Settings
     * const setting = await prisma.setting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Settings and only return the `id`
     * const settingWithIdOnly = await prisma.setting.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SettingUpdateManyAndReturnArgs>(args: SelectSubset<T, SettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Setting.
     * @param {SettingUpsertArgs} args - Arguments to update or create a Setting.
     * @example
     * // Update or create a Setting
     * const setting = await prisma.setting.upsert({
     *   create: {
     *     // ... data to create a Setting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Setting we want to update
     *   }
     * })
     */
    upsert<T extends SettingUpsertArgs>(args: SelectSubset<T, SettingUpsertArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingCountArgs} args - Arguments to filter Settings to count.
     * @example
     * // Count the number of Settings
     * const count = await prisma.setting.count({
     *   where: {
     *     // ... the filter for the Settings we want to count
     *   }
     * })
    **/
    count<T extends SettingCountArgs>(
      args?: Subset<T, SettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SettingAggregateArgs>(args: Subset<T, SettingAggregateArgs>): Prisma.PrismaPromise<GetSettingAggregateType<T>>

    /**
     * Group by Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingGroupByArgs} args - Group by arguments.
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
      T extends SettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettingGroupByArgs['orderBy'] }
        : { orderBy?: SettingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Setting model
   */
  readonly fields: SettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Setting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Setting model
   */
  interface SettingFieldRefs {
    readonly id: FieldRef<"Setting", 'String'>
    readonly appName: FieldRef<"Setting", 'String'>
    readonly entryPriceUsd: FieldRef<"Setting", 'Float'>
    readonly paymentPhone: FieldRef<"Setting", 'String'>
    readonly paymentNationalId: FieldRef<"Setting", 'String'>
    readonly paymentBank: FieldRef<"Setting", 'String'>
    readonly exchangeRateCurrency: FieldRef<"Setting", 'String'>
    readonly manualExchangeRate: FieldRef<"Setting", 'Float'>
    readonly manualExchangeRateDate: FieldRef<"Setting", 'DateTime'>
    readonly firstPrizePercent: FieldRef<"Setting", 'Float'>
    readonly secondPrizePercent: FieldRef<"Setting", 'Float'>
    readonly organizationPercent: FieldRef<"Setting", 'Float'>
    readonly deadline: FieldRef<"Setting", 'DateTime'>
    readonly rankingVisible: FieldRef<"Setting", 'Boolean'>
    readonly showOnlyPaidParticipants: FieldRef<"Setting", 'Boolean'>
    readonly allowPublicPredictionViewAfterDeadline: FieldRef<"Setting", 'Boolean'>
    readonly tiebreakerRules: FieldRef<"Setting", 'String'>
    readonly createdAt: FieldRef<"Setting", 'DateTime'>
    readonly updatedAt: FieldRef<"Setting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Setting findUnique
   */
  export type SettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting findUniqueOrThrow
   */
  export type SettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting findFirst
   */
  export type SettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting findFirstOrThrow
   */
  export type SettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting findMany
   */
  export type SettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting create
   */
  export type SettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data needed to create a Setting.
     */
    data: XOR<SettingCreateInput, SettingUncheckedCreateInput>
  }

  /**
   * Setting createMany
   */
  export type SettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Settings.
     */
    data: SettingCreateManyInput | SettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Setting createManyAndReturn
   */
  export type SettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data used to create many Settings.
     */
    data: SettingCreateManyInput | SettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Setting update
   */
  export type SettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data needed to update a Setting.
     */
    data: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>
    /**
     * Choose, which Setting to update.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting updateMany
   */
  export type SettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingUpdateManyMutationInput, SettingUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to update.
     */
    limit?: number
  }

  /**
   * Setting updateManyAndReturn
   */
  export type SettingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingUpdateManyMutationInput, SettingUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to update.
     */
    limit?: number
  }

  /**
   * Setting upsert
   */
  export type SettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The filter to search for the Setting to update in case it exists.
     */
    where: SettingWhereUniqueInput
    /**
     * In case the Setting found by the `where` argument doesn't exist, create a new Setting with this data.
     */
    create: XOR<SettingCreateInput, SettingUncheckedCreateInput>
    /**
     * In case the Setting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>
  }

  /**
   * Setting delete
   */
  export type SettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter which Setting to delete.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting deleteMany
   */
  export type SettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to delete
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to delete.
     */
    limit?: number
  }

  /**
   * Setting without action
   */
  export type SettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
  }


  /**
   * Model Team
   */

  export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  export type TeamMinAggregateOutputType = {
    id: string | null
    officialName: string | null
    displayName: string | null
    shortName: string | null
    fifaCode: string | null
    isoCode: string | null
    flagEmoji: string | null
    group: string | null
    aliases: string | null
    createdAt: Date | null
  }

  export type TeamMaxAggregateOutputType = {
    id: string | null
    officialName: string | null
    displayName: string | null
    shortName: string | null
    fifaCode: string | null
    isoCode: string | null
    flagEmoji: string | null
    group: string | null
    aliases: string | null
    createdAt: Date | null
  }

  export type TeamCountAggregateOutputType = {
    id: number
    officialName: number
    displayName: number
    shortName: number
    fifaCode: number
    isoCode: number
    flagEmoji: number
    group: number
    aliases: number
    createdAt: number
    _all: number
  }


  export type TeamMinAggregateInputType = {
    id?: true
    officialName?: true
    displayName?: true
    shortName?: true
    fifaCode?: true
    isoCode?: true
    flagEmoji?: true
    group?: true
    aliases?: true
    createdAt?: true
  }

  export type TeamMaxAggregateInputType = {
    id?: true
    officialName?: true
    displayName?: true
    shortName?: true
    fifaCode?: true
    isoCode?: true
    flagEmoji?: true
    group?: true
    aliases?: true
    createdAt?: true
  }

  export type TeamCountAggregateInputType = {
    id?: true
    officialName?: true
    displayName?: true
    shortName?: true
    fifaCode?: true
    isoCode?: true
    flagEmoji?: true
    group?: true
    aliases?: true
    createdAt?: true
    _all?: true
  }

  export type TeamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Team to aggregate.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Teams
    **/
    _count?: true | TeamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMaxAggregateInputType
  }

  export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
        [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeam[P]>
      : GetScalarType<T[P], AggregateTeam[P]>
  }




  export type TeamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamWhereInput
    orderBy?: TeamOrderByWithAggregationInput | TeamOrderByWithAggregationInput[]
    by: TeamScalarFieldEnum[] | TeamScalarFieldEnum
    having?: TeamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamCountAggregateInputType | true
    _min?: TeamMinAggregateInputType
    _max?: TeamMaxAggregateInputType
  }

  export type TeamGroupByOutputType = {
    id: string
    officialName: string
    displayName: string
    shortName: string
    fifaCode: string
    isoCode: string
    flagEmoji: string
    group: string
    aliases: string
    createdAt: Date
    _count: TeamCountAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamGroupByOutputType[P]>
            : GetScalarType<T[P], TeamGroupByOutputType[P]>
        }
      >
    >


  export type TeamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    officialName?: boolean
    displayName?: boolean
    shortName?: boolean
    fifaCode?: boolean
    isoCode?: boolean
    flagEmoji?: boolean
    group?: boolean
    aliases?: boolean
    createdAt?: boolean
    matchesAsTeam1?: boolean | Team$matchesAsTeam1Args<ExtArgs>
    matchesAsTeam2?: boolean | Team$matchesAsTeam2Args<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    officialName?: boolean
    displayName?: boolean
    shortName?: boolean
    fifaCode?: boolean
    isoCode?: boolean
    flagEmoji?: boolean
    group?: boolean
    aliases?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["team"]>

  export type TeamSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    officialName?: boolean
    displayName?: boolean
    shortName?: boolean
    fifaCode?: boolean
    isoCode?: boolean
    flagEmoji?: boolean
    group?: boolean
    aliases?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["team"]>

  export type TeamSelectScalar = {
    id?: boolean
    officialName?: boolean
    displayName?: boolean
    shortName?: boolean
    fifaCode?: boolean
    isoCode?: boolean
    flagEmoji?: boolean
    group?: boolean
    aliases?: boolean
    createdAt?: boolean
  }

  export type TeamOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "officialName" | "displayName" | "shortName" | "fifaCode" | "isoCode" | "flagEmoji" | "group" | "aliases" | "createdAt", ExtArgs["result"]["team"]>
  export type TeamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    matchesAsTeam1?: boolean | Team$matchesAsTeam1Args<ExtArgs>
    matchesAsTeam2?: boolean | Team$matchesAsTeam2Args<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TeamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TeamIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TeamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Team"
    objects: {
      matchesAsTeam1: Prisma.$MatchPayload<ExtArgs>[]
      matchesAsTeam2: Prisma.$MatchPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      officialName: string
      displayName: string
      shortName: string
      fifaCode: string
      isoCode: string
      flagEmoji: string
      group: string
      aliases: string
      createdAt: Date
    }, ExtArgs["result"]["team"]>
    composites: {}
  }

  type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = $Result.GetResult<Prisma.$TeamPayload, S>

  type TeamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamCountAggregateInputType | true
    }

  export interface TeamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Team'], meta: { name: 'Team' } }
    /**
     * Find zero or one Team that matches the filter.
     * @param {TeamFindUniqueArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamFindUniqueArgs>(args: SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Team that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamFindUniqueOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamFindFirstArgs>(args?: SelectSubset<T, TeamFindFirstArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Teams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teams
     * const teams = await prisma.team.findMany()
     * 
     * // Get first 10 Teams
     * const teams = await prisma.team.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamWithIdOnly = await prisma.team.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamFindManyArgs>(args?: SelectSubset<T, TeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Team.
     * @param {TeamCreateArgs} args - Arguments to create a Team.
     * @example
     * // Create one Team
     * const Team = await prisma.team.create({
     *   data: {
     *     // ... data to create a Team
     *   }
     * })
     * 
     */
    create<T extends TeamCreateArgs>(args: SelectSubset<T, TeamCreateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Teams.
     * @param {TeamCreateManyArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamCreateManyArgs>(args?: SelectSubset<T, TeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Teams and returns the data saved in the database.
     * @param {TeamCreateManyAndReturnArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Team.
     * @param {TeamDeleteArgs} args - Arguments to delete one Team.
     * @example
     * // Delete one Team
     * const Team = await prisma.team.delete({
     *   where: {
     *     // ... filter to delete one Team
     *   }
     * })
     * 
     */
    delete<T extends TeamDeleteArgs>(args: SelectSubset<T, TeamDeleteArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Team.
     * @param {TeamUpdateArgs} args - Arguments to update one Team.
     * @example
     * // Update one Team
     * const team = await prisma.team.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamUpdateArgs>(args: SelectSubset<T, TeamUpdateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Teams.
     * @param {TeamDeleteManyArgs} args - Arguments to filter Teams to delete.
     * @example
     * // Delete a few Teams
     * const { count } = await prisma.team.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamDeleteManyArgs>(args?: SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamUpdateManyArgs>(args: SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams and returns the data updated in the database.
     * @param {TeamUpdateManyAndReturnArgs} args - Arguments to update many Teams.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Team.
     * @param {TeamUpsertArgs} args - Arguments to update or create a Team.
     * @example
     * // Update or create a Team
     * const team = await prisma.team.upsert({
     *   create: {
     *     // ... data to create a Team
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Team we want to update
     *   }
     * })
     */
    upsert<T extends TeamUpsertArgs>(args: SelectSubset<T, TeamUpsertArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamCountArgs} args - Arguments to filter Teams to count.
     * @example
     * // Count the number of Teams
     * const count = await prisma.team.count({
     *   where: {
     *     // ... the filter for the Teams we want to count
     *   }
     * })
    **/
    count<T extends TeamCountArgs>(
      args?: Subset<T, TeamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TeamAggregateArgs>(args: Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>

    /**
     * Group by Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamGroupByArgs} args - Group by arguments.
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
      T extends TeamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamGroupByArgs['orderBy'] }
        : { orderBy?: TeamGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Team model
   */
  readonly fields: TeamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Team.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    matchesAsTeam1<T extends Team$matchesAsTeam1Args<ExtArgs> = {}>(args?: Subset<T, Team$matchesAsTeam1Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    matchesAsTeam2<T extends Team$matchesAsTeam2Args<ExtArgs> = {}>(args?: Subset<T, Team$matchesAsTeam2Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Team model
   */
  interface TeamFieldRefs {
    readonly id: FieldRef<"Team", 'String'>
    readonly officialName: FieldRef<"Team", 'String'>
    readonly displayName: FieldRef<"Team", 'String'>
    readonly shortName: FieldRef<"Team", 'String'>
    readonly fifaCode: FieldRef<"Team", 'String'>
    readonly isoCode: FieldRef<"Team", 'String'>
    readonly flagEmoji: FieldRef<"Team", 'String'>
    readonly group: FieldRef<"Team", 'String'>
    readonly aliases: FieldRef<"Team", 'String'>
    readonly createdAt: FieldRef<"Team", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Team findUnique
   */
  export type TeamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findUniqueOrThrow
   */
  export type TeamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findFirst
   */
  export type TeamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findFirstOrThrow
   */
  export type TeamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findMany
   */
  export type TeamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Teams to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team create
   */
  export type TeamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to create a Team.
     */
    data: XOR<TeamCreateInput, TeamUncheckedCreateInput>
  }

  /**
   * Team createMany
   */
  export type TeamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team createManyAndReturn
   */
  export type TeamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team update
   */
  export type TeamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to update a Team.
     */
    data: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
    /**
     * Choose, which Team to update.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team updateMany
   */
  export type TeamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team updateManyAndReturn
   */
  export type TeamUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team upsert
   */
  export type TeamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The filter to search for the Team to update in case it exists.
     */
    where: TeamWhereUniqueInput
    /**
     * In case the Team found by the `where` argument doesn't exist, create a new Team with this data.
     */
    create: XOR<TeamCreateInput, TeamUncheckedCreateInput>
    /**
     * In case the Team was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
  }

  /**
   * Team delete
   */
  export type TeamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter which Team to delete.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team deleteMany
   */
  export type TeamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Teams to delete
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to delete.
     */
    limit?: number
  }

  /**
   * Team.matchesAsTeam1
   */
  export type Team$matchesAsTeam1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Team.matchesAsTeam2
   */
  export type Team$matchesAsTeam2Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Team without action
   */
  export type TeamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
  }


  /**
   * Model Match
   */

  export type AggregateMatch = {
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  export type MatchAvgAggregateOutputType = {
    matchNumber: number | null
    team1Goals: number | null
    team2Goals: number | null
    autoDetectedTeam1Goals: number | null
    autoDetectedTeam2Goals: number | null
  }

  export type MatchSumAggregateOutputType = {
    matchNumber: number | null
    team1Goals: number | null
    team2Goals: number | null
    autoDetectedTeam1Goals: number | null
    autoDetectedTeam2Goals: number | null
  }

  export type MatchMinAggregateOutputType = {
    id: string | null
    matchNumber: number | null
    group: string | null
    team1Id: string | null
    team2Id: string | null
    kickoffUtc: Date | null
    venue: string | null
    city: string | null
    source: string | null
    status: $Enums.MatchStatus | null
    team1Goals: number | null
    team2Goals: number | null
    result: $Enums.MatchResult | null
    resultUpdatedAt: Date | null
    resultSource: string | null
    autoDetectedTeam1Goals: number | null
    autoDetectedTeam2Goals: number | null
    autoDetectedResult: $Enums.MatchResult | null
    autoDetectedSource: string | null
    autoDetectionConfidence: string | null
    autoDetectedAt: Date | null
    autoResultStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MatchMaxAggregateOutputType = {
    id: string | null
    matchNumber: number | null
    group: string | null
    team1Id: string | null
    team2Id: string | null
    kickoffUtc: Date | null
    venue: string | null
    city: string | null
    source: string | null
    status: $Enums.MatchStatus | null
    team1Goals: number | null
    team2Goals: number | null
    result: $Enums.MatchResult | null
    resultUpdatedAt: Date | null
    resultSource: string | null
    autoDetectedTeam1Goals: number | null
    autoDetectedTeam2Goals: number | null
    autoDetectedResult: $Enums.MatchResult | null
    autoDetectedSource: string | null
    autoDetectionConfidence: string | null
    autoDetectedAt: Date | null
    autoResultStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MatchCountAggregateOutputType = {
    id: number
    matchNumber: number
    group: number
    team1Id: number
    team2Id: number
    kickoffUtc: number
    venue: number
    city: number
    source: number
    status: number
    team1Goals: number
    team2Goals: number
    result: number
    resultUpdatedAt: number
    resultSource: number
    autoDetectedTeam1Goals: number
    autoDetectedTeam2Goals: number
    autoDetectedResult: number
    autoDetectedSource: number
    autoDetectionConfidence: number
    autoDetectedAt: number
    autoResultStatus: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MatchAvgAggregateInputType = {
    matchNumber?: true
    team1Goals?: true
    team2Goals?: true
    autoDetectedTeam1Goals?: true
    autoDetectedTeam2Goals?: true
  }

  export type MatchSumAggregateInputType = {
    matchNumber?: true
    team1Goals?: true
    team2Goals?: true
    autoDetectedTeam1Goals?: true
    autoDetectedTeam2Goals?: true
  }

  export type MatchMinAggregateInputType = {
    id?: true
    matchNumber?: true
    group?: true
    team1Id?: true
    team2Id?: true
    kickoffUtc?: true
    venue?: true
    city?: true
    source?: true
    status?: true
    team1Goals?: true
    team2Goals?: true
    result?: true
    resultUpdatedAt?: true
    resultSource?: true
    autoDetectedTeam1Goals?: true
    autoDetectedTeam2Goals?: true
    autoDetectedResult?: true
    autoDetectedSource?: true
    autoDetectionConfidence?: true
    autoDetectedAt?: true
    autoResultStatus?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MatchMaxAggregateInputType = {
    id?: true
    matchNumber?: true
    group?: true
    team1Id?: true
    team2Id?: true
    kickoffUtc?: true
    venue?: true
    city?: true
    source?: true
    status?: true
    team1Goals?: true
    team2Goals?: true
    result?: true
    resultUpdatedAt?: true
    resultSource?: true
    autoDetectedTeam1Goals?: true
    autoDetectedTeam2Goals?: true
    autoDetectedResult?: true
    autoDetectedSource?: true
    autoDetectionConfidence?: true
    autoDetectedAt?: true
    autoResultStatus?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MatchCountAggregateInputType = {
    id?: true
    matchNumber?: true
    group?: true
    team1Id?: true
    team2Id?: true
    kickoffUtc?: true
    venue?: true
    city?: true
    source?: true
    status?: true
    team1Goals?: true
    team2Goals?: true
    result?: true
    resultUpdatedAt?: true
    resultSource?: true
    autoDetectedTeam1Goals?: true
    autoDetectedTeam2Goals?: true
    autoDetectedResult?: true
    autoDetectedSource?: true
    autoDetectionConfidence?: true
    autoDetectedAt?: true
    autoResultStatus?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Match to aggregate.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Matches
    **/
    _count?: true | MatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchMaxAggregateInputType
  }

  export type GetMatchAggregateType<T extends MatchAggregateArgs> = {
        [P in keyof T & keyof AggregateMatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatch[P]>
      : GetScalarType<T[P], AggregateMatch[P]>
  }




  export type MatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithAggregationInput | MatchOrderByWithAggregationInput[]
    by: MatchScalarFieldEnum[] | MatchScalarFieldEnum
    having?: MatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchCountAggregateInputType | true
    _avg?: MatchAvgAggregateInputType
    _sum?: MatchSumAggregateInputType
    _min?: MatchMinAggregateInputType
    _max?: MatchMaxAggregateInputType
  }

  export type MatchGroupByOutputType = {
    id: string
    matchNumber: number
    group: string
    team1Id: string
    team2Id: string
    kickoffUtc: Date
    venue: string
    city: string
    source: string
    status: $Enums.MatchStatus
    team1Goals: number | null
    team2Goals: number | null
    result: $Enums.MatchResult | null
    resultUpdatedAt: Date | null
    resultSource: string | null
    autoDetectedTeam1Goals: number | null
    autoDetectedTeam2Goals: number | null
    autoDetectedResult: $Enums.MatchResult | null
    autoDetectedSource: string | null
    autoDetectionConfidence: string | null
    autoDetectedAt: Date | null
    autoResultStatus: string | null
    createdAt: Date
    updatedAt: Date
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  type GetMatchGroupByPayload<T extends MatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchGroupByOutputType[P]>
            : GetScalarType<T[P], MatchGroupByOutputType[P]>
        }
      >
    >


  export type MatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchNumber?: boolean
    group?: boolean
    team1Id?: boolean
    team2Id?: boolean
    kickoffUtc?: boolean
    venue?: boolean
    city?: boolean
    source?: boolean
    status?: boolean
    team1Goals?: boolean
    team2Goals?: boolean
    result?: boolean
    resultUpdatedAt?: boolean
    resultSource?: boolean
    autoDetectedTeam1Goals?: boolean
    autoDetectedTeam2Goals?: boolean
    autoDetectedResult?: boolean
    autoDetectedSource?: boolean
    autoDetectionConfidence?: boolean
    autoDetectedAt?: boolean
    autoResultStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    team1?: boolean | TeamDefaultArgs<ExtArgs>
    team2?: boolean | TeamDefaultArgs<ExtArgs>
    predictions?: boolean | Match$predictionsArgs<ExtArgs>
    _count?: boolean | MatchCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchNumber?: boolean
    group?: boolean
    team1Id?: boolean
    team2Id?: boolean
    kickoffUtc?: boolean
    venue?: boolean
    city?: boolean
    source?: boolean
    status?: boolean
    team1Goals?: boolean
    team2Goals?: boolean
    result?: boolean
    resultUpdatedAt?: boolean
    resultSource?: boolean
    autoDetectedTeam1Goals?: boolean
    autoDetectedTeam2Goals?: boolean
    autoDetectedResult?: boolean
    autoDetectedSource?: boolean
    autoDetectionConfidence?: boolean
    autoDetectedAt?: boolean
    autoResultStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    team1?: boolean | TeamDefaultArgs<ExtArgs>
    team2?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchNumber?: boolean
    group?: boolean
    team1Id?: boolean
    team2Id?: boolean
    kickoffUtc?: boolean
    venue?: boolean
    city?: boolean
    source?: boolean
    status?: boolean
    team1Goals?: boolean
    team2Goals?: boolean
    result?: boolean
    resultUpdatedAt?: boolean
    resultSource?: boolean
    autoDetectedTeam1Goals?: boolean
    autoDetectedTeam2Goals?: boolean
    autoDetectedResult?: boolean
    autoDetectedSource?: boolean
    autoDetectionConfidence?: boolean
    autoDetectedAt?: boolean
    autoResultStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    team1?: boolean | TeamDefaultArgs<ExtArgs>
    team2?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectScalar = {
    id?: boolean
    matchNumber?: boolean
    group?: boolean
    team1Id?: boolean
    team2Id?: boolean
    kickoffUtc?: boolean
    venue?: boolean
    city?: boolean
    source?: boolean
    status?: boolean
    team1Goals?: boolean
    team2Goals?: boolean
    result?: boolean
    resultUpdatedAt?: boolean
    resultSource?: boolean
    autoDetectedTeam1Goals?: boolean
    autoDetectedTeam2Goals?: boolean
    autoDetectedResult?: boolean
    autoDetectedSource?: boolean
    autoDetectionConfidence?: boolean
    autoDetectedAt?: boolean
    autoResultStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MatchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "matchNumber" | "group" | "team1Id" | "team2Id" | "kickoffUtc" | "venue" | "city" | "source" | "status" | "team1Goals" | "team2Goals" | "result" | "resultUpdatedAt" | "resultSource" | "autoDetectedTeam1Goals" | "autoDetectedTeam2Goals" | "autoDetectedResult" | "autoDetectedSource" | "autoDetectionConfidence" | "autoDetectedAt" | "autoResultStatus" | "createdAt" | "updatedAt", ExtArgs["result"]["match"]>
  export type MatchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team1?: boolean | TeamDefaultArgs<ExtArgs>
    team2?: boolean | TeamDefaultArgs<ExtArgs>
    predictions?: boolean | Match$predictionsArgs<ExtArgs>
    _count?: boolean | MatchCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MatchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team1?: boolean | TeamDefaultArgs<ExtArgs>
    team2?: boolean | TeamDefaultArgs<ExtArgs>
  }
  export type MatchIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team1?: boolean | TeamDefaultArgs<ExtArgs>
    team2?: boolean | TeamDefaultArgs<ExtArgs>
  }

  export type $MatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Match"
    objects: {
      team1: Prisma.$TeamPayload<ExtArgs>
      team2: Prisma.$TeamPayload<ExtArgs>
      predictions: Prisma.$PredictionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      matchNumber: number
      group: string
      team1Id: string
      team2Id: string
      kickoffUtc: Date
      venue: string
      city: string
      source: string
      status: $Enums.MatchStatus
      team1Goals: number | null
      team2Goals: number | null
      result: $Enums.MatchResult | null
      resultUpdatedAt: Date | null
      resultSource: string | null
      autoDetectedTeam1Goals: number | null
      autoDetectedTeam2Goals: number | null
      autoDetectedResult: $Enums.MatchResult | null
      autoDetectedSource: string | null
      autoDetectionConfidence: string | null
      autoDetectedAt: Date | null
      autoResultStatus: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["match"]>
    composites: {}
  }

  type MatchGetPayload<S extends boolean | null | undefined | MatchDefaultArgs> = $Result.GetResult<Prisma.$MatchPayload, S>

  type MatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchCountAggregateInputType | true
    }

  export interface MatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Match'], meta: { name: 'Match' } }
    /**
     * Find zero or one Match that matches the filter.
     * @param {MatchFindUniqueArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchFindUniqueArgs>(args: SelectSubset<T, MatchFindUniqueArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Match that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchFindUniqueOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchFindFirstArgs>(args?: SelectSubset<T, MatchFindFirstArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Matches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Matches
     * const matches = await prisma.match.findMany()
     * 
     * // Get first 10 Matches
     * const matches = await prisma.match.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchWithIdOnly = await prisma.match.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchFindManyArgs>(args?: SelectSubset<T, MatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Match.
     * @param {MatchCreateArgs} args - Arguments to create a Match.
     * @example
     * // Create one Match
     * const Match = await prisma.match.create({
     *   data: {
     *     // ... data to create a Match
     *   }
     * })
     * 
     */
    create<T extends MatchCreateArgs>(args: SelectSubset<T, MatchCreateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Matches.
     * @param {MatchCreateManyArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchCreateManyArgs>(args?: SelectSubset<T, MatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Matches and returns the data saved in the database.
     * @param {MatchCreateManyAndReturnArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Match.
     * @param {MatchDeleteArgs} args - Arguments to delete one Match.
     * @example
     * // Delete one Match
     * const Match = await prisma.match.delete({
     *   where: {
     *     // ... filter to delete one Match
     *   }
     * })
     * 
     */
    delete<T extends MatchDeleteArgs>(args: SelectSubset<T, MatchDeleteArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Match.
     * @param {MatchUpdateArgs} args - Arguments to update one Match.
     * @example
     * // Update one Match
     * const match = await prisma.match.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchUpdateArgs>(args: SelectSubset<T, MatchUpdateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Matches.
     * @param {MatchDeleteManyArgs} args - Arguments to filter Matches to delete.
     * @example
     * // Delete a few Matches
     * const { count } = await prisma.match.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchDeleteManyArgs>(args?: SelectSubset<T, MatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchUpdateManyArgs>(args: SelectSubset<T, MatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches and returns the data updated in the database.
     * @param {MatchUpdateManyAndReturnArgs} args - Arguments to update many Matches.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Match.
     * @param {MatchUpsertArgs} args - Arguments to update or create a Match.
     * @example
     * // Update or create a Match
     * const match = await prisma.match.upsert({
     *   create: {
     *     // ... data to create a Match
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Match we want to update
     *   }
     * })
     */
    upsert<T extends MatchUpsertArgs>(args: SelectSubset<T, MatchUpsertArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCountArgs} args - Arguments to filter Matches to count.
     * @example
     * // Count the number of Matches
     * const count = await prisma.match.count({
     *   where: {
     *     // ... the filter for the Matches we want to count
     *   }
     * })
    **/
    count<T extends MatchCountArgs>(
      args?: Subset<T, MatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MatchAggregateArgs>(args: Subset<T, MatchAggregateArgs>): Prisma.PrismaPromise<GetMatchAggregateType<T>>

    /**
     * Group by Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchGroupByArgs} args - Group by arguments.
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
      T extends MatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchGroupByArgs['orderBy'] }
        : { orderBy?: MatchGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Match model
   */
  readonly fields: MatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Match.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    team1<T extends TeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeamDefaultArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    team2<T extends TeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeamDefaultArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    predictions<T extends Match$predictionsArgs<ExtArgs> = {}>(args?: Subset<T, Match$predictionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PredictionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Match model
   */
  interface MatchFieldRefs {
    readonly id: FieldRef<"Match", 'String'>
    readonly matchNumber: FieldRef<"Match", 'Int'>
    readonly group: FieldRef<"Match", 'String'>
    readonly team1Id: FieldRef<"Match", 'String'>
    readonly team2Id: FieldRef<"Match", 'String'>
    readonly kickoffUtc: FieldRef<"Match", 'DateTime'>
    readonly venue: FieldRef<"Match", 'String'>
    readonly city: FieldRef<"Match", 'String'>
    readonly source: FieldRef<"Match", 'String'>
    readonly status: FieldRef<"Match", 'MatchStatus'>
    readonly team1Goals: FieldRef<"Match", 'Int'>
    readonly team2Goals: FieldRef<"Match", 'Int'>
    readonly result: FieldRef<"Match", 'MatchResult'>
    readonly resultUpdatedAt: FieldRef<"Match", 'DateTime'>
    readonly resultSource: FieldRef<"Match", 'String'>
    readonly autoDetectedTeam1Goals: FieldRef<"Match", 'Int'>
    readonly autoDetectedTeam2Goals: FieldRef<"Match", 'Int'>
    readonly autoDetectedResult: FieldRef<"Match", 'MatchResult'>
    readonly autoDetectedSource: FieldRef<"Match", 'String'>
    readonly autoDetectionConfidence: FieldRef<"Match", 'String'>
    readonly autoDetectedAt: FieldRef<"Match", 'DateTime'>
    readonly autoResultStatus: FieldRef<"Match", 'String'>
    readonly createdAt: FieldRef<"Match", 'DateTime'>
    readonly updatedAt: FieldRef<"Match", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Match findUnique
   */
  export type MatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findUniqueOrThrow
   */
  export type MatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findFirst
   */
  export type MatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findFirstOrThrow
   */
  export type MatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findMany
   */
  export type MatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Matches to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match create
   */
  export type MatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to create a Match.
     */
    data: XOR<MatchCreateInput, MatchUncheckedCreateInput>
  }

  /**
   * Match createMany
   */
  export type MatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Match createManyAndReturn
   */
  export type MatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Match update
   */
  export type MatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to update a Match.
     */
    data: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
    /**
     * Choose, which Match to update.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match updateMany
   */
  export type MatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
  }

  /**
   * Match updateManyAndReturn
   */
  export type MatchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Match upsert
   */
  export type MatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The filter to search for the Match to update in case it exists.
     */
    where: MatchWhereUniqueInput
    /**
     * In case the Match found by the `where` argument doesn't exist, create a new Match with this data.
     */
    create: XOR<MatchCreateInput, MatchUncheckedCreateInput>
    /**
     * In case the Match was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
  }

  /**
   * Match delete
   */
  export type MatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter which Match to delete.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match deleteMany
   */
  export type MatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Matches to delete
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to delete.
     */
    limit?: number
  }

  /**
   * Match.predictions
   */
  export type Match$predictionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionInclude<ExtArgs> | null
    where?: PredictionWhereInput
    orderBy?: PredictionOrderByWithRelationInput | PredictionOrderByWithRelationInput[]
    cursor?: PredictionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PredictionScalarFieldEnum | PredictionScalarFieldEnum[]
  }

  /**
   * Match without action
   */
  export type MatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
  }


  /**
   * Model Participant
   */

  export type AggregateParticipant = {
    _count: ParticipantCountAggregateOutputType | null
    _min: ParticipantMinAggregateOutputType | null
    _max: ParticipantMaxAggregateOutputType | null
  }

  export type ParticipantMinAggregateOutputType = {
    id: string | null
    fullName: string | null
    nationalId: string | null
    phone: string | null
    email: string | null
    city: string | null
    participationCode: string | null
    confirmationHash: string | null
    submittedAt: Date | null
    isComplete: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ParticipantMaxAggregateOutputType = {
    id: string | null
    fullName: string | null
    nationalId: string | null
    phone: string | null
    email: string | null
    city: string | null
    participationCode: string | null
    confirmationHash: string | null
    submittedAt: Date | null
    isComplete: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ParticipantCountAggregateOutputType = {
    id: number
    fullName: number
    nationalId: number
    phone: number
    email: number
    city: number
    participationCode: number
    confirmationHash: number
    submittedAt: number
    isComplete: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ParticipantMinAggregateInputType = {
    id?: true
    fullName?: true
    nationalId?: true
    phone?: true
    email?: true
    city?: true
    participationCode?: true
    confirmationHash?: true
    submittedAt?: true
    isComplete?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ParticipantMaxAggregateInputType = {
    id?: true
    fullName?: true
    nationalId?: true
    phone?: true
    email?: true
    city?: true
    participationCode?: true
    confirmationHash?: true
    submittedAt?: true
    isComplete?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ParticipantCountAggregateInputType = {
    id?: true
    fullName?: true
    nationalId?: true
    phone?: true
    email?: true
    city?: true
    participationCode?: true
    confirmationHash?: true
    submittedAt?: true
    isComplete?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Participant to aggregate.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Participants
    **/
    _count?: true | ParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ParticipantMaxAggregateInputType
  }

  export type GetParticipantAggregateType<T extends ParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateParticipant[P]>
      : GetScalarType<T[P], AggregateParticipant[P]>
  }




  export type ParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipantWhereInput
    orderBy?: ParticipantOrderByWithAggregationInput | ParticipantOrderByWithAggregationInput[]
    by: ParticipantScalarFieldEnum[] | ParticipantScalarFieldEnum
    having?: ParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ParticipantCountAggregateInputType | true
    _min?: ParticipantMinAggregateInputType
    _max?: ParticipantMaxAggregateInputType
  }

  export type ParticipantGroupByOutputType = {
    id: string
    fullName: string
    nationalId: string
    phone: string
    email: string | null
    city: string | null
    participationCode: string
    confirmationHash: string | null
    submittedAt: Date | null
    isComplete: boolean
    createdAt: Date
    updatedAt: Date
    _count: ParticipantCountAggregateOutputType | null
    _min: ParticipantMinAggregateOutputType | null
    _max: ParticipantMaxAggregateOutputType | null
  }

  type GetParticipantGroupByPayload<T extends ParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], ParticipantGroupByOutputType[P]>
        }
      >
    >


  export type ParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    nationalId?: boolean
    phone?: boolean
    email?: boolean
    city?: boolean
    participationCode?: boolean
    confirmationHash?: boolean
    submittedAt?: boolean
    isComplete?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    predictions?: boolean | Participant$predictionsArgs<ExtArgs>
    payment?: boolean | Participant$paymentArgs<ExtArgs>
    ranking?: boolean | Participant$rankingArgs<ExtArgs>
    _count?: boolean | ParticipantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["participant"]>

  export type ParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    nationalId?: boolean
    phone?: boolean
    email?: boolean
    city?: boolean
    participationCode?: boolean
    confirmationHash?: boolean
    submittedAt?: boolean
    isComplete?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["participant"]>

  export type ParticipantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    nationalId?: boolean
    phone?: boolean
    email?: boolean
    city?: boolean
    participationCode?: boolean
    confirmationHash?: boolean
    submittedAt?: boolean
    isComplete?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["participant"]>

  export type ParticipantSelectScalar = {
    id?: boolean
    fullName?: boolean
    nationalId?: boolean
    phone?: boolean
    email?: boolean
    city?: boolean
    participationCode?: boolean
    confirmationHash?: boolean
    submittedAt?: boolean
    isComplete?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ParticipantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fullName" | "nationalId" | "phone" | "email" | "city" | "participationCode" | "confirmationHash" | "submittedAt" | "isComplete" | "createdAt" | "updatedAt", ExtArgs["result"]["participant"]>
  export type ParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    predictions?: boolean | Participant$predictionsArgs<ExtArgs>
    payment?: boolean | Participant$paymentArgs<ExtArgs>
    ranking?: boolean | Participant$rankingArgs<ExtArgs>
    _count?: boolean | ParticipantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ParticipantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Participant"
    objects: {
      predictions: Prisma.$PredictionPayload<ExtArgs>[]
      payment: Prisma.$PaymentPayload<ExtArgs> | null
      ranking: Prisma.$RankingSnapshotPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fullName: string
      nationalId: string
      phone: string
      email: string | null
      city: string | null
      participationCode: string
      confirmationHash: string | null
      submittedAt: Date | null
      isComplete: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["participant"]>
    composites: {}
  }

  type ParticipantGetPayload<S extends boolean | null | undefined | ParticipantDefaultArgs> = $Result.GetResult<Prisma.$ParticipantPayload, S>

  type ParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ParticipantCountAggregateInputType | true
    }

  export interface ParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Participant'], meta: { name: 'Participant' } }
    /**
     * Find zero or one Participant that matches the filter.
     * @param {ParticipantFindUniqueArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ParticipantFindUniqueArgs>(args: SelectSubset<T, ParticipantFindUniqueArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Participant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ParticipantFindUniqueOrThrowArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, ParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Participant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantFindFirstArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ParticipantFindFirstArgs>(args?: SelectSubset<T, ParticipantFindFirstArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Participant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantFindFirstOrThrowArgs} args - Arguments to find a Participant
     * @example
     * // Get one Participant
     * const participant = await prisma.participant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, ParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Participants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Participants
     * const participants = await prisma.participant.findMany()
     * 
     * // Get first 10 Participants
     * const participants = await prisma.participant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const participantWithIdOnly = await prisma.participant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ParticipantFindManyArgs>(args?: SelectSubset<T, ParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Participant.
     * @param {ParticipantCreateArgs} args - Arguments to create a Participant.
     * @example
     * // Create one Participant
     * const Participant = await prisma.participant.create({
     *   data: {
     *     // ... data to create a Participant
     *   }
     * })
     * 
     */
    create<T extends ParticipantCreateArgs>(args: SelectSubset<T, ParticipantCreateArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Participants.
     * @param {ParticipantCreateManyArgs} args - Arguments to create many Participants.
     * @example
     * // Create many Participants
     * const participant = await prisma.participant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ParticipantCreateManyArgs>(args?: SelectSubset<T, ParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Participants and returns the data saved in the database.
     * @param {ParticipantCreateManyAndReturnArgs} args - Arguments to create many Participants.
     * @example
     * // Create many Participants
     * const participant = await prisma.participant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Participants and only return the `id`
     * const participantWithIdOnly = await prisma.participant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, ParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Participant.
     * @param {ParticipantDeleteArgs} args - Arguments to delete one Participant.
     * @example
     * // Delete one Participant
     * const Participant = await prisma.participant.delete({
     *   where: {
     *     // ... filter to delete one Participant
     *   }
     * })
     * 
     */
    delete<T extends ParticipantDeleteArgs>(args: SelectSubset<T, ParticipantDeleteArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Participant.
     * @param {ParticipantUpdateArgs} args - Arguments to update one Participant.
     * @example
     * // Update one Participant
     * const participant = await prisma.participant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ParticipantUpdateArgs>(args: SelectSubset<T, ParticipantUpdateArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Participants.
     * @param {ParticipantDeleteManyArgs} args - Arguments to filter Participants to delete.
     * @example
     * // Delete a few Participants
     * const { count } = await prisma.participant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ParticipantDeleteManyArgs>(args?: SelectSubset<T, ParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Participants
     * const participant = await prisma.participant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ParticipantUpdateManyArgs>(args: SelectSubset<T, ParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Participants and returns the data updated in the database.
     * @param {ParticipantUpdateManyAndReturnArgs} args - Arguments to update many Participants.
     * @example
     * // Update many Participants
     * const participant = await prisma.participant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Participants and only return the `id`
     * const participantWithIdOnly = await prisma.participant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ParticipantUpdateManyAndReturnArgs>(args: SelectSubset<T, ParticipantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Participant.
     * @param {ParticipantUpsertArgs} args - Arguments to update or create a Participant.
     * @example
     * // Update or create a Participant
     * const participant = await prisma.participant.upsert({
     *   create: {
     *     // ... data to create a Participant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Participant we want to update
     *   }
     * })
     */
    upsert<T extends ParticipantUpsertArgs>(args: SelectSubset<T, ParticipantUpsertArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantCountArgs} args - Arguments to filter Participants to count.
     * @example
     * // Count the number of Participants
     * const count = await prisma.participant.count({
     *   where: {
     *     // ... the filter for the Participants we want to count
     *   }
     * })
    **/
    count<T extends ParticipantCountArgs>(
      args?: Subset<T, ParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Participant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ParticipantAggregateArgs>(args: Subset<T, ParticipantAggregateArgs>): Prisma.PrismaPromise<GetParticipantAggregateType<T>>

    /**
     * Group by Participant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantGroupByArgs} args - Group by arguments.
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
      T extends ParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ParticipantGroupByArgs['orderBy'] }
        : { orderBy?: ParticipantGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Participant model
   */
  readonly fields: ParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Participant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    predictions<T extends Participant$predictionsArgs<ExtArgs> = {}>(args?: Subset<T, Participant$predictionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PredictionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    payment<T extends Participant$paymentArgs<ExtArgs> = {}>(args?: Subset<T, Participant$paymentArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    ranking<T extends Participant$rankingArgs<ExtArgs> = {}>(args?: Subset<T, Participant$rankingArgs<ExtArgs>>): Prisma__RankingSnapshotClient<$Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Participant model
   */
  interface ParticipantFieldRefs {
    readonly id: FieldRef<"Participant", 'String'>
    readonly fullName: FieldRef<"Participant", 'String'>
    readonly nationalId: FieldRef<"Participant", 'String'>
    readonly phone: FieldRef<"Participant", 'String'>
    readonly email: FieldRef<"Participant", 'String'>
    readonly city: FieldRef<"Participant", 'String'>
    readonly participationCode: FieldRef<"Participant", 'String'>
    readonly confirmationHash: FieldRef<"Participant", 'String'>
    readonly submittedAt: FieldRef<"Participant", 'DateTime'>
    readonly isComplete: FieldRef<"Participant", 'Boolean'>
    readonly createdAt: FieldRef<"Participant", 'DateTime'>
    readonly updatedAt: FieldRef<"Participant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Participant findUnique
   */
  export type ParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant findUniqueOrThrow
   */
  export type ParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant findFirst
   */
  export type ParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Participants.
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Participants.
     */
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Participant findFirstOrThrow
   */
  export type ParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participant to fetch.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Participants.
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Participants.
     */
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Participant findMany
   */
  export type ParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter, which Participants to fetch.
     */
    where?: ParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participants to fetch.
     */
    orderBy?: ParticipantOrderByWithRelationInput | ParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Participants.
     */
    cursor?: ParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Participants.
     */
    distinct?: ParticipantScalarFieldEnum | ParticipantScalarFieldEnum[]
  }

  /**
   * Participant create
   */
  export type ParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a Participant.
     */
    data: XOR<ParticipantCreateInput, ParticipantUncheckedCreateInput>
  }

  /**
   * Participant createMany
   */
  export type ParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Participants.
     */
    data: ParticipantCreateManyInput | ParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Participant createManyAndReturn
   */
  export type ParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * The data used to create many Participants.
     */
    data: ParticipantCreateManyInput | ParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Participant update
   */
  export type ParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a Participant.
     */
    data: XOR<ParticipantUpdateInput, ParticipantUncheckedUpdateInput>
    /**
     * Choose, which Participant to update.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant updateMany
   */
  export type ParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Participants.
     */
    data: XOR<ParticipantUpdateManyMutationInput, ParticipantUncheckedUpdateManyInput>
    /**
     * Filter which Participants to update
     */
    where?: ParticipantWhereInput
    /**
     * Limit how many Participants to update.
     */
    limit?: number
  }

  /**
   * Participant updateManyAndReturn
   */
  export type ParticipantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * The data used to update Participants.
     */
    data: XOR<ParticipantUpdateManyMutationInput, ParticipantUncheckedUpdateManyInput>
    /**
     * Filter which Participants to update
     */
    where?: ParticipantWhereInput
    /**
     * Limit how many Participants to update.
     */
    limit?: number
  }

  /**
   * Participant upsert
   */
  export type ParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the Participant to update in case it exists.
     */
    where: ParticipantWhereUniqueInput
    /**
     * In case the Participant found by the `where` argument doesn't exist, create a new Participant with this data.
     */
    create: XOR<ParticipantCreateInput, ParticipantUncheckedCreateInput>
    /**
     * In case the Participant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ParticipantUpdateInput, ParticipantUncheckedUpdateInput>
  }

  /**
   * Participant delete
   */
  export type ParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
    /**
     * Filter which Participant to delete.
     */
    where: ParticipantWhereUniqueInput
  }

  /**
   * Participant deleteMany
   */
  export type ParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Participants to delete
     */
    where?: ParticipantWhereInput
    /**
     * Limit how many Participants to delete.
     */
    limit?: number
  }

  /**
   * Participant.predictions
   */
  export type Participant$predictionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionInclude<ExtArgs> | null
    where?: PredictionWhereInput
    orderBy?: PredictionOrderByWithRelationInput | PredictionOrderByWithRelationInput[]
    cursor?: PredictionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PredictionScalarFieldEnum | PredictionScalarFieldEnum[]
  }

  /**
   * Participant.payment
   */
  export type Participant$paymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
  }

  /**
   * Participant.ranking
   */
  export type Participant$rankingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RankingSnapshot
     */
    select?: RankingSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RankingSnapshot
     */
    omit?: RankingSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingSnapshotInclude<ExtArgs> | null
    where?: RankingSnapshotWhereInput
  }

  /**
   * Participant without action
   */
  export type ParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participant
     */
    select?: ParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participant
     */
    omit?: ParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParticipantInclude<ExtArgs> | null
  }


  /**
   * Model Prediction
   */

  export type AggregatePrediction = {
    _count: PredictionCountAggregateOutputType | null
    _avg: PredictionAvgAggregateOutputType | null
    _sum: PredictionSumAggregateOutputType | null
    _min: PredictionMinAggregateOutputType | null
    _max: PredictionMaxAggregateOutputType | null
  }

  export type PredictionAvgAggregateOutputType = {
    predictedTeam1Goals: number | null
    predictedTeam2Goals: number | null
    points: number | null
    goalDifferenceError: number | null
  }

  export type PredictionSumAggregateOutputType = {
    predictedTeam1Goals: number | null
    predictedTeam2Goals: number | null
    points: number | null
    goalDifferenceError: number | null
  }

  export type PredictionMinAggregateOutputType = {
    id: string | null
    participantId: string | null
    matchId: string | null
    predictedTeam1Goals: number | null
    predictedTeam2Goals: number | null
    predictedResult: $Enums.MatchResult | null
    points: number | null
    isExactScore: boolean | null
    isCorrectResult: boolean | null
    goalDifferenceError: number | null
    createdAt: Date | null
  }

  export type PredictionMaxAggregateOutputType = {
    id: string | null
    participantId: string | null
    matchId: string | null
    predictedTeam1Goals: number | null
    predictedTeam2Goals: number | null
    predictedResult: $Enums.MatchResult | null
    points: number | null
    isExactScore: boolean | null
    isCorrectResult: boolean | null
    goalDifferenceError: number | null
    createdAt: Date | null
  }

  export type PredictionCountAggregateOutputType = {
    id: number
    participantId: number
    matchId: number
    predictedTeam1Goals: number
    predictedTeam2Goals: number
    predictedResult: number
    points: number
    isExactScore: number
    isCorrectResult: number
    goalDifferenceError: number
    createdAt: number
    _all: number
  }


  export type PredictionAvgAggregateInputType = {
    predictedTeam1Goals?: true
    predictedTeam2Goals?: true
    points?: true
    goalDifferenceError?: true
  }

  export type PredictionSumAggregateInputType = {
    predictedTeam1Goals?: true
    predictedTeam2Goals?: true
    points?: true
    goalDifferenceError?: true
  }

  export type PredictionMinAggregateInputType = {
    id?: true
    participantId?: true
    matchId?: true
    predictedTeam1Goals?: true
    predictedTeam2Goals?: true
    predictedResult?: true
    points?: true
    isExactScore?: true
    isCorrectResult?: true
    goalDifferenceError?: true
    createdAt?: true
  }

  export type PredictionMaxAggregateInputType = {
    id?: true
    participantId?: true
    matchId?: true
    predictedTeam1Goals?: true
    predictedTeam2Goals?: true
    predictedResult?: true
    points?: true
    isExactScore?: true
    isCorrectResult?: true
    goalDifferenceError?: true
    createdAt?: true
  }

  export type PredictionCountAggregateInputType = {
    id?: true
    participantId?: true
    matchId?: true
    predictedTeam1Goals?: true
    predictedTeam2Goals?: true
    predictedResult?: true
    points?: true
    isExactScore?: true
    isCorrectResult?: true
    goalDifferenceError?: true
    createdAt?: true
    _all?: true
  }

  export type PredictionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Prediction to aggregate.
     */
    where?: PredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Predictions to fetch.
     */
    orderBy?: PredictionOrderByWithRelationInput | PredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Predictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Predictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Predictions
    **/
    _count?: true | PredictionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PredictionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PredictionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PredictionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PredictionMaxAggregateInputType
  }

  export type GetPredictionAggregateType<T extends PredictionAggregateArgs> = {
        [P in keyof T & keyof AggregatePrediction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrediction[P]>
      : GetScalarType<T[P], AggregatePrediction[P]>
  }




  export type PredictionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PredictionWhereInput
    orderBy?: PredictionOrderByWithAggregationInput | PredictionOrderByWithAggregationInput[]
    by: PredictionScalarFieldEnum[] | PredictionScalarFieldEnum
    having?: PredictionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PredictionCountAggregateInputType | true
    _avg?: PredictionAvgAggregateInputType
    _sum?: PredictionSumAggregateInputType
    _min?: PredictionMinAggregateInputType
    _max?: PredictionMaxAggregateInputType
  }

  export type PredictionGroupByOutputType = {
    id: string
    participantId: string
    matchId: string
    predictedTeam1Goals: number
    predictedTeam2Goals: number
    predictedResult: $Enums.MatchResult
    points: number
    isExactScore: boolean | null
    isCorrectResult: boolean | null
    goalDifferenceError: number | null
    createdAt: Date
    _count: PredictionCountAggregateOutputType | null
    _avg: PredictionAvgAggregateOutputType | null
    _sum: PredictionSumAggregateOutputType | null
    _min: PredictionMinAggregateOutputType | null
    _max: PredictionMaxAggregateOutputType | null
  }

  type GetPredictionGroupByPayload<T extends PredictionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PredictionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PredictionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PredictionGroupByOutputType[P]>
            : GetScalarType<T[P], PredictionGroupByOutputType[P]>
        }
      >
    >


  export type PredictionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    matchId?: boolean
    predictedTeam1Goals?: boolean
    predictedTeam2Goals?: boolean
    predictedResult?: boolean
    points?: boolean
    isExactScore?: boolean
    isCorrectResult?: boolean
    goalDifferenceError?: boolean
    createdAt?: boolean
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["prediction"]>

  export type PredictionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    matchId?: boolean
    predictedTeam1Goals?: boolean
    predictedTeam2Goals?: boolean
    predictedResult?: boolean
    points?: boolean
    isExactScore?: boolean
    isCorrectResult?: boolean
    goalDifferenceError?: boolean
    createdAt?: boolean
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["prediction"]>

  export type PredictionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    matchId?: boolean
    predictedTeam1Goals?: boolean
    predictedTeam2Goals?: boolean
    predictedResult?: boolean
    points?: boolean
    isExactScore?: boolean
    isCorrectResult?: boolean
    goalDifferenceError?: boolean
    createdAt?: boolean
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["prediction"]>

  export type PredictionSelectScalar = {
    id?: boolean
    participantId?: boolean
    matchId?: boolean
    predictedTeam1Goals?: boolean
    predictedTeam2Goals?: boolean
    predictedResult?: boolean
    points?: boolean
    isExactScore?: boolean
    isCorrectResult?: boolean
    goalDifferenceError?: boolean
    createdAt?: boolean
  }

  export type PredictionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "participantId" | "matchId" | "predictedTeam1Goals" | "predictedTeam2Goals" | "predictedResult" | "points" | "isExactScore" | "isCorrectResult" | "goalDifferenceError" | "createdAt", ExtArgs["result"]["prediction"]>
  export type PredictionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }
  export type PredictionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }
  export type PredictionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
    match?: boolean | MatchDefaultArgs<ExtArgs>
  }

  export type $PredictionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Prediction"
    objects: {
      participant: Prisma.$ParticipantPayload<ExtArgs>
      match: Prisma.$MatchPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      participantId: string
      matchId: string
      predictedTeam1Goals: number
      predictedTeam2Goals: number
      predictedResult: $Enums.MatchResult
      points: number
      isExactScore: boolean | null
      isCorrectResult: boolean | null
      goalDifferenceError: number | null
      createdAt: Date
    }, ExtArgs["result"]["prediction"]>
    composites: {}
  }

  type PredictionGetPayload<S extends boolean | null | undefined | PredictionDefaultArgs> = $Result.GetResult<Prisma.$PredictionPayload, S>

  type PredictionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PredictionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PredictionCountAggregateInputType | true
    }

  export interface PredictionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Prediction'], meta: { name: 'Prediction' } }
    /**
     * Find zero or one Prediction that matches the filter.
     * @param {PredictionFindUniqueArgs} args - Arguments to find a Prediction
     * @example
     * // Get one Prediction
     * const prediction = await prisma.prediction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PredictionFindUniqueArgs>(args: SelectSubset<T, PredictionFindUniqueArgs<ExtArgs>>): Prisma__PredictionClient<$Result.GetResult<Prisma.$PredictionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Prediction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PredictionFindUniqueOrThrowArgs} args - Arguments to find a Prediction
     * @example
     * // Get one Prediction
     * const prediction = await prisma.prediction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PredictionFindUniqueOrThrowArgs>(args: SelectSubset<T, PredictionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PredictionClient<$Result.GetResult<Prisma.$PredictionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Prediction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictionFindFirstArgs} args - Arguments to find a Prediction
     * @example
     * // Get one Prediction
     * const prediction = await prisma.prediction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PredictionFindFirstArgs>(args?: SelectSubset<T, PredictionFindFirstArgs<ExtArgs>>): Prisma__PredictionClient<$Result.GetResult<Prisma.$PredictionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Prediction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictionFindFirstOrThrowArgs} args - Arguments to find a Prediction
     * @example
     * // Get one Prediction
     * const prediction = await prisma.prediction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PredictionFindFirstOrThrowArgs>(args?: SelectSubset<T, PredictionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PredictionClient<$Result.GetResult<Prisma.$PredictionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Predictions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Predictions
     * const predictions = await prisma.prediction.findMany()
     * 
     * // Get first 10 Predictions
     * const predictions = await prisma.prediction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const predictionWithIdOnly = await prisma.prediction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PredictionFindManyArgs>(args?: SelectSubset<T, PredictionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PredictionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Prediction.
     * @param {PredictionCreateArgs} args - Arguments to create a Prediction.
     * @example
     * // Create one Prediction
     * const Prediction = await prisma.prediction.create({
     *   data: {
     *     // ... data to create a Prediction
     *   }
     * })
     * 
     */
    create<T extends PredictionCreateArgs>(args: SelectSubset<T, PredictionCreateArgs<ExtArgs>>): Prisma__PredictionClient<$Result.GetResult<Prisma.$PredictionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Predictions.
     * @param {PredictionCreateManyArgs} args - Arguments to create many Predictions.
     * @example
     * // Create many Predictions
     * const prediction = await prisma.prediction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PredictionCreateManyArgs>(args?: SelectSubset<T, PredictionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Predictions and returns the data saved in the database.
     * @param {PredictionCreateManyAndReturnArgs} args - Arguments to create many Predictions.
     * @example
     * // Create many Predictions
     * const prediction = await prisma.prediction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Predictions and only return the `id`
     * const predictionWithIdOnly = await prisma.prediction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PredictionCreateManyAndReturnArgs>(args?: SelectSubset<T, PredictionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PredictionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Prediction.
     * @param {PredictionDeleteArgs} args - Arguments to delete one Prediction.
     * @example
     * // Delete one Prediction
     * const Prediction = await prisma.prediction.delete({
     *   where: {
     *     // ... filter to delete one Prediction
     *   }
     * })
     * 
     */
    delete<T extends PredictionDeleteArgs>(args: SelectSubset<T, PredictionDeleteArgs<ExtArgs>>): Prisma__PredictionClient<$Result.GetResult<Prisma.$PredictionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Prediction.
     * @param {PredictionUpdateArgs} args - Arguments to update one Prediction.
     * @example
     * // Update one Prediction
     * const prediction = await prisma.prediction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PredictionUpdateArgs>(args: SelectSubset<T, PredictionUpdateArgs<ExtArgs>>): Prisma__PredictionClient<$Result.GetResult<Prisma.$PredictionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Predictions.
     * @param {PredictionDeleteManyArgs} args - Arguments to filter Predictions to delete.
     * @example
     * // Delete a few Predictions
     * const { count } = await prisma.prediction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PredictionDeleteManyArgs>(args?: SelectSubset<T, PredictionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Predictions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Predictions
     * const prediction = await prisma.prediction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PredictionUpdateManyArgs>(args: SelectSubset<T, PredictionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Predictions and returns the data updated in the database.
     * @param {PredictionUpdateManyAndReturnArgs} args - Arguments to update many Predictions.
     * @example
     * // Update many Predictions
     * const prediction = await prisma.prediction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Predictions and only return the `id`
     * const predictionWithIdOnly = await prisma.prediction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PredictionUpdateManyAndReturnArgs>(args: SelectSubset<T, PredictionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PredictionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Prediction.
     * @param {PredictionUpsertArgs} args - Arguments to update or create a Prediction.
     * @example
     * // Update or create a Prediction
     * const prediction = await prisma.prediction.upsert({
     *   create: {
     *     // ... data to create a Prediction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Prediction we want to update
     *   }
     * })
     */
    upsert<T extends PredictionUpsertArgs>(args: SelectSubset<T, PredictionUpsertArgs<ExtArgs>>): Prisma__PredictionClient<$Result.GetResult<Prisma.$PredictionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Predictions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictionCountArgs} args - Arguments to filter Predictions to count.
     * @example
     * // Count the number of Predictions
     * const count = await prisma.prediction.count({
     *   where: {
     *     // ... the filter for the Predictions we want to count
     *   }
     * })
    **/
    count<T extends PredictionCountArgs>(
      args?: Subset<T, PredictionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PredictionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Prediction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PredictionAggregateArgs>(args: Subset<T, PredictionAggregateArgs>): Prisma.PrismaPromise<GetPredictionAggregateType<T>>

    /**
     * Group by Prediction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictionGroupByArgs} args - Group by arguments.
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
      T extends PredictionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PredictionGroupByArgs['orderBy'] }
        : { orderBy?: PredictionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PredictionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPredictionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Prediction model
   */
  readonly fields: PredictionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Prediction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PredictionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participant<T extends ParticipantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ParticipantDefaultArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    match<T extends MatchDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MatchDefaultArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Prediction model
   */
  interface PredictionFieldRefs {
    readonly id: FieldRef<"Prediction", 'String'>
    readonly participantId: FieldRef<"Prediction", 'String'>
    readonly matchId: FieldRef<"Prediction", 'String'>
    readonly predictedTeam1Goals: FieldRef<"Prediction", 'Int'>
    readonly predictedTeam2Goals: FieldRef<"Prediction", 'Int'>
    readonly predictedResult: FieldRef<"Prediction", 'MatchResult'>
    readonly points: FieldRef<"Prediction", 'Int'>
    readonly isExactScore: FieldRef<"Prediction", 'Boolean'>
    readonly isCorrectResult: FieldRef<"Prediction", 'Boolean'>
    readonly goalDifferenceError: FieldRef<"Prediction", 'Int'>
    readonly createdAt: FieldRef<"Prediction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Prediction findUnique
   */
  export type PredictionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionInclude<ExtArgs> | null
    /**
     * Filter, which Prediction to fetch.
     */
    where: PredictionWhereUniqueInput
  }

  /**
   * Prediction findUniqueOrThrow
   */
  export type PredictionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionInclude<ExtArgs> | null
    /**
     * Filter, which Prediction to fetch.
     */
    where: PredictionWhereUniqueInput
  }

  /**
   * Prediction findFirst
   */
  export type PredictionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionInclude<ExtArgs> | null
    /**
     * Filter, which Prediction to fetch.
     */
    where?: PredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Predictions to fetch.
     */
    orderBy?: PredictionOrderByWithRelationInput | PredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Predictions.
     */
    cursor?: PredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Predictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Predictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Predictions.
     */
    distinct?: PredictionScalarFieldEnum | PredictionScalarFieldEnum[]
  }

  /**
   * Prediction findFirstOrThrow
   */
  export type PredictionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionInclude<ExtArgs> | null
    /**
     * Filter, which Prediction to fetch.
     */
    where?: PredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Predictions to fetch.
     */
    orderBy?: PredictionOrderByWithRelationInput | PredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Predictions.
     */
    cursor?: PredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Predictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Predictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Predictions.
     */
    distinct?: PredictionScalarFieldEnum | PredictionScalarFieldEnum[]
  }

  /**
   * Prediction findMany
   */
  export type PredictionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionInclude<ExtArgs> | null
    /**
     * Filter, which Predictions to fetch.
     */
    where?: PredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Predictions to fetch.
     */
    orderBy?: PredictionOrderByWithRelationInput | PredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Predictions.
     */
    cursor?: PredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Predictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Predictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Predictions.
     */
    distinct?: PredictionScalarFieldEnum | PredictionScalarFieldEnum[]
  }

  /**
   * Prediction create
   */
  export type PredictionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionInclude<ExtArgs> | null
    /**
     * The data needed to create a Prediction.
     */
    data: XOR<PredictionCreateInput, PredictionUncheckedCreateInput>
  }

  /**
   * Prediction createMany
   */
  export type PredictionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Predictions.
     */
    data: PredictionCreateManyInput | PredictionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Prediction createManyAndReturn
   */
  export type PredictionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * The data used to create many Predictions.
     */
    data: PredictionCreateManyInput | PredictionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Prediction update
   */
  export type PredictionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionInclude<ExtArgs> | null
    /**
     * The data needed to update a Prediction.
     */
    data: XOR<PredictionUpdateInput, PredictionUncheckedUpdateInput>
    /**
     * Choose, which Prediction to update.
     */
    where: PredictionWhereUniqueInput
  }

  /**
   * Prediction updateMany
   */
  export type PredictionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Predictions.
     */
    data: XOR<PredictionUpdateManyMutationInput, PredictionUncheckedUpdateManyInput>
    /**
     * Filter which Predictions to update
     */
    where?: PredictionWhereInput
    /**
     * Limit how many Predictions to update.
     */
    limit?: number
  }

  /**
   * Prediction updateManyAndReturn
   */
  export type PredictionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * The data used to update Predictions.
     */
    data: XOR<PredictionUpdateManyMutationInput, PredictionUncheckedUpdateManyInput>
    /**
     * Filter which Predictions to update
     */
    where?: PredictionWhereInput
    /**
     * Limit how many Predictions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Prediction upsert
   */
  export type PredictionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionInclude<ExtArgs> | null
    /**
     * The filter to search for the Prediction to update in case it exists.
     */
    where: PredictionWhereUniqueInput
    /**
     * In case the Prediction found by the `where` argument doesn't exist, create a new Prediction with this data.
     */
    create: XOR<PredictionCreateInput, PredictionUncheckedCreateInput>
    /**
     * In case the Prediction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PredictionUpdateInput, PredictionUncheckedUpdateInput>
  }

  /**
   * Prediction delete
   */
  export type PredictionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionInclude<ExtArgs> | null
    /**
     * Filter which Prediction to delete.
     */
    where: PredictionWhereUniqueInput
  }

  /**
   * Prediction deleteMany
   */
  export type PredictionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Predictions to delete
     */
    where?: PredictionWhereInput
    /**
     * Limit how many Predictions to delete.
     */
    limit?: number
  }

  /**
   * Prediction without action
   */
  export type PredictionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prediction
     */
    select?: PredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Prediction
     */
    omit?: PredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PredictionInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amountUsd: number | null
    exchangeRate: number | null
    amountVes: number | null
  }

  export type PaymentSumAggregateOutputType = {
    amountUsd: number | null
    exchangeRate: number | null
    amountVes: number | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    participantId: string | null
    amountUsd: number | null
    exchangeRate: number | null
    exchangeRateDate: Date | null
    amountVes: number | null
    senderBank: string | null
    paymentReference: string | null
    paymentDate: Date | null
    paymentProofPath: string | null
    paymentStatus: $Enums.PaymentStatus | null
    adminNotes: string | null
    verifiedAt: Date | null
    rejectedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    participantId: string | null
    amountUsd: number | null
    exchangeRate: number | null
    exchangeRateDate: Date | null
    amountVes: number | null
    senderBank: string | null
    paymentReference: string | null
    paymentDate: Date | null
    paymentProofPath: string | null
    paymentStatus: $Enums.PaymentStatus | null
    adminNotes: string | null
    verifiedAt: Date | null
    rejectedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    participantId: number
    amountUsd: number
    exchangeRate: number
    exchangeRateDate: number
    amountVes: number
    senderBank: number
    paymentReference: number
    paymentDate: number
    paymentProofPath: number
    paymentStatus: number
    adminNotes: number
    verifiedAt: number
    rejectedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amountUsd?: true
    exchangeRate?: true
    amountVes?: true
  }

  export type PaymentSumAggregateInputType = {
    amountUsd?: true
    exchangeRate?: true
    amountVes?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    participantId?: true
    amountUsd?: true
    exchangeRate?: true
    exchangeRateDate?: true
    amountVes?: true
    senderBank?: true
    paymentReference?: true
    paymentDate?: true
    paymentProofPath?: true
    paymentStatus?: true
    adminNotes?: true
    verifiedAt?: true
    rejectedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    participantId?: true
    amountUsd?: true
    exchangeRate?: true
    exchangeRateDate?: true
    amountVes?: true
    senderBank?: true
    paymentReference?: true
    paymentDate?: true
    paymentProofPath?: true
    paymentStatus?: true
    adminNotes?: true
    verifiedAt?: true
    rejectedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    participantId?: true
    amountUsd?: true
    exchangeRate?: true
    exchangeRateDate?: true
    amountVes?: true
    senderBank?: true
    paymentReference?: true
    paymentDate?: true
    paymentProofPath?: true
    paymentStatus?: true
    adminNotes?: true
    verifiedAt?: true
    rejectedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    participantId: string
    amountUsd: number
    exchangeRate: number | null
    exchangeRateDate: Date | null
    amountVes: number | null
    senderBank: string | null
    paymentReference: string | null
    paymentDate: Date | null
    paymentProofPath: string | null
    paymentStatus: $Enums.PaymentStatus
    adminNotes: string | null
    verifiedAt: Date | null
    rejectedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    amountUsd?: boolean
    exchangeRate?: boolean
    exchangeRateDate?: boolean
    amountVes?: boolean
    senderBank?: boolean
    paymentReference?: boolean
    paymentDate?: boolean
    paymentProofPath?: boolean
    paymentStatus?: boolean
    adminNotes?: boolean
    verifiedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    amountUsd?: boolean
    exchangeRate?: boolean
    exchangeRateDate?: boolean
    amountVes?: boolean
    senderBank?: boolean
    paymentReference?: boolean
    paymentDate?: boolean
    paymentProofPath?: boolean
    paymentStatus?: boolean
    adminNotes?: boolean
    verifiedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    amountUsd?: boolean
    exchangeRate?: boolean
    exchangeRateDate?: boolean
    amountVes?: boolean
    senderBank?: boolean
    paymentReference?: boolean
    paymentDate?: boolean
    paymentProofPath?: boolean
    paymentStatus?: boolean
    adminNotes?: boolean
    verifiedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    participantId?: boolean
    amountUsd?: boolean
    exchangeRate?: boolean
    exchangeRateDate?: boolean
    amountVes?: boolean
    senderBank?: boolean
    paymentReference?: boolean
    paymentDate?: boolean
    paymentProofPath?: boolean
    paymentStatus?: boolean
    adminNotes?: boolean
    verifiedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "participantId" | "amountUsd" | "exchangeRate" | "exchangeRateDate" | "amountVes" | "senderBank" | "paymentReference" | "paymentDate" | "paymentProofPath" | "paymentStatus" | "adminNotes" | "verifiedAt" | "rejectedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      participant: Prisma.$ParticipantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      participantId: string
      amountUsd: number
      exchangeRate: number | null
      exchangeRateDate: Date | null
      amountVes: number | null
      senderBank: string | null
      paymentReference: string | null
      paymentDate: Date | null
      paymentProofPath: string | null
      paymentStatus: $Enums.PaymentStatus
      adminNotes: string | null
      verifiedAt: Date | null
      rejectedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments and returns the data updated in the database.
     * @param {PaymentUpdateManyAndReturnArgs} args - Arguments to update many Payments.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
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
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participant<T extends ParticipantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ParticipantDefaultArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly participantId: FieldRef<"Payment", 'String'>
    readonly amountUsd: FieldRef<"Payment", 'Float'>
    readonly exchangeRate: FieldRef<"Payment", 'Float'>
    readonly exchangeRateDate: FieldRef<"Payment", 'DateTime'>
    readonly amountVes: FieldRef<"Payment", 'Float'>
    readonly senderBank: FieldRef<"Payment", 'String'>
    readonly paymentReference: FieldRef<"Payment", 'String'>
    readonly paymentDate: FieldRef<"Payment", 'DateTime'>
    readonly paymentProofPath: FieldRef<"Payment", 'String'>
    readonly paymentStatus: FieldRef<"Payment", 'PaymentStatus'>
    readonly adminNotes: FieldRef<"Payment", 'String'>
    readonly verifiedAt: FieldRef<"Payment", 'DateTime'>
    readonly rejectedAt: FieldRef<"Payment", 'DateTime'>
    readonly createdAt: FieldRef<"Payment", 'DateTime'>
    readonly updatedAt: FieldRef<"Payment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment updateManyAndReturn
   */
  export type PaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model RankingSnapshot
   */

  export type AggregateRankingSnapshot = {
    _count: RankingSnapshotCountAggregateOutputType | null
    _avg: RankingSnapshotAvgAggregateOutputType | null
    _sum: RankingSnapshotSumAggregateOutputType | null
    _min: RankingSnapshotMinAggregateOutputType | null
    _max: RankingSnapshotMaxAggregateOutputType | null
  }

  export type RankingSnapshotAvgAggregateOutputType = {
    totalPoints: number | null
    exactScores: number | null
    correctResults: number | null
    wrongPredictions: number | null
    pendingPredictions: number | null
    playedMatches: number | null
    totalGoalDiffError: number | null
    effectivenessPercent: number | null
    currentPosition: number | null
    previousPosition: number | null
  }

  export type RankingSnapshotSumAggregateOutputType = {
    totalPoints: number | null
    exactScores: number | null
    correctResults: number | null
    wrongPredictions: number | null
    pendingPredictions: number | null
    playedMatches: number | null
    totalGoalDiffError: number | null
    effectivenessPercent: number | null
    currentPosition: number | null
    previousPosition: number | null
  }

  export type RankingSnapshotMinAggregateOutputType = {
    id: string | null
    participantId: string | null
    totalPoints: number | null
    exactScores: number | null
    correctResults: number | null
    wrongPredictions: number | null
    pendingPredictions: number | null
    playedMatches: number | null
    totalGoalDiffError: number | null
    effectivenessPercent: number | null
    currentPosition: number | null
    previousPosition: number | null
    updatedAt: Date | null
  }

  export type RankingSnapshotMaxAggregateOutputType = {
    id: string | null
    participantId: string | null
    totalPoints: number | null
    exactScores: number | null
    correctResults: number | null
    wrongPredictions: number | null
    pendingPredictions: number | null
    playedMatches: number | null
    totalGoalDiffError: number | null
    effectivenessPercent: number | null
    currentPosition: number | null
    previousPosition: number | null
    updatedAt: Date | null
  }

  export type RankingSnapshotCountAggregateOutputType = {
    id: number
    participantId: number
    totalPoints: number
    exactScores: number
    correctResults: number
    wrongPredictions: number
    pendingPredictions: number
    playedMatches: number
    totalGoalDiffError: number
    effectivenessPercent: number
    currentPosition: number
    previousPosition: number
    updatedAt: number
    _all: number
  }


  export type RankingSnapshotAvgAggregateInputType = {
    totalPoints?: true
    exactScores?: true
    correctResults?: true
    wrongPredictions?: true
    pendingPredictions?: true
    playedMatches?: true
    totalGoalDiffError?: true
    effectivenessPercent?: true
    currentPosition?: true
    previousPosition?: true
  }

  export type RankingSnapshotSumAggregateInputType = {
    totalPoints?: true
    exactScores?: true
    correctResults?: true
    wrongPredictions?: true
    pendingPredictions?: true
    playedMatches?: true
    totalGoalDiffError?: true
    effectivenessPercent?: true
    currentPosition?: true
    previousPosition?: true
  }

  export type RankingSnapshotMinAggregateInputType = {
    id?: true
    participantId?: true
    totalPoints?: true
    exactScores?: true
    correctResults?: true
    wrongPredictions?: true
    pendingPredictions?: true
    playedMatches?: true
    totalGoalDiffError?: true
    effectivenessPercent?: true
    currentPosition?: true
    previousPosition?: true
    updatedAt?: true
  }

  export type RankingSnapshotMaxAggregateInputType = {
    id?: true
    participantId?: true
    totalPoints?: true
    exactScores?: true
    correctResults?: true
    wrongPredictions?: true
    pendingPredictions?: true
    playedMatches?: true
    totalGoalDiffError?: true
    effectivenessPercent?: true
    currentPosition?: true
    previousPosition?: true
    updatedAt?: true
  }

  export type RankingSnapshotCountAggregateInputType = {
    id?: true
    participantId?: true
    totalPoints?: true
    exactScores?: true
    correctResults?: true
    wrongPredictions?: true
    pendingPredictions?: true
    playedMatches?: true
    totalGoalDiffError?: true
    effectivenessPercent?: true
    currentPosition?: true
    previousPosition?: true
    updatedAt?: true
    _all?: true
  }

  export type RankingSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RankingSnapshot to aggregate.
     */
    where?: RankingSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RankingSnapshots to fetch.
     */
    orderBy?: RankingSnapshotOrderByWithRelationInput | RankingSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RankingSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RankingSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RankingSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RankingSnapshots
    **/
    _count?: true | RankingSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RankingSnapshotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RankingSnapshotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RankingSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RankingSnapshotMaxAggregateInputType
  }

  export type GetRankingSnapshotAggregateType<T extends RankingSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateRankingSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRankingSnapshot[P]>
      : GetScalarType<T[P], AggregateRankingSnapshot[P]>
  }




  export type RankingSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RankingSnapshotWhereInput
    orderBy?: RankingSnapshotOrderByWithAggregationInput | RankingSnapshotOrderByWithAggregationInput[]
    by: RankingSnapshotScalarFieldEnum[] | RankingSnapshotScalarFieldEnum
    having?: RankingSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RankingSnapshotCountAggregateInputType | true
    _avg?: RankingSnapshotAvgAggregateInputType
    _sum?: RankingSnapshotSumAggregateInputType
    _min?: RankingSnapshotMinAggregateInputType
    _max?: RankingSnapshotMaxAggregateInputType
  }

  export type RankingSnapshotGroupByOutputType = {
    id: string
    participantId: string
    totalPoints: number
    exactScores: number
    correctResults: number
    wrongPredictions: number
    pendingPredictions: number
    playedMatches: number
    totalGoalDiffError: number
    effectivenessPercent: number
    currentPosition: number
    previousPosition: number | null
    updatedAt: Date
    _count: RankingSnapshotCountAggregateOutputType | null
    _avg: RankingSnapshotAvgAggregateOutputType | null
    _sum: RankingSnapshotSumAggregateOutputType | null
    _min: RankingSnapshotMinAggregateOutputType | null
    _max: RankingSnapshotMaxAggregateOutputType | null
  }

  type GetRankingSnapshotGroupByPayload<T extends RankingSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RankingSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RankingSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RankingSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], RankingSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type RankingSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    totalPoints?: boolean
    exactScores?: boolean
    correctResults?: boolean
    wrongPredictions?: boolean
    pendingPredictions?: boolean
    playedMatches?: boolean
    totalGoalDiffError?: boolean
    effectivenessPercent?: boolean
    currentPosition?: boolean
    previousPosition?: boolean
    updatedAt?: boolean
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rankingSnapshot"]>

  export type RankingSnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    totalPoints?: boolean
    exactScores?: boolean
    correctResults?: boolean
    wrongPredictions?: boolean
    pendingPredictions?: boolean
    playedMatches?: boolean
    totalGoalDiffError?: boolean
    effectivenessPercent?: boolean
    currentPosition?: boolean
    previousPosition?: boolean
    updatedAt?: boolean
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rankingSnapshot"]>

  export type RankingSnapshotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    totalPoints?: boolean
    exactScores?: boolean
    correctResults?: boolean
    wrongPredictions?: boolean
    pendingPredictions?: boolean
    playedMatches?: boolean
    totalGoalDiffError?: boolean
    effectivenessPercent?: boolean
    currentPosition?: boolean
    previousPosition?: boolean
    updatedAt?: boolean
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rankingSnapshot"]>

  export type RankingSnapshotSelectScalar = {
    id?: boolean
    participantId?: boolean
    totalPoints?: boolean
    exactScores?: boolean
    correctResults?: boolean
    wrongPredictions?: boolean
    pendingPredictions?: boolean
    playedMatches?: boolean
    totalGoalDiffError?: boolean
    effectivenessPercent?: boolean
    currentPosition?: boolean
    previousPosition?: boolean
    updatedAt?: boolean
  }

  export type RankingSnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "participantId" | "totalPoints" | "exactScores" | "correctResults" | "wrongPredictions" | "pendingPredictions" | "playedMatches" | "totalGoalDiffError" | "effectivenessPercent" | "currentPosition" | "previousPosition" | "updatedAt", ExtArgs["result"]["rankingSnapshot"]>
  export type RankingSnapshotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }
  export type RankingSnapshotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }
  export type RankingSnapshotIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | ParticipantDefaultArgs<ExtArgs>
  }

  export type $RankingSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RankingSnapshot"
    objects: {
      participant: Prisma.$ParticipantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      participantId: string
      totalPoints: number
      exactScores: number
      correctResults: number
      wrongPredictions: number
      pendingPredictions: number
      playedMatches: number
      totalGoalDiffError: number
      effectivenessPercent: number
      currentPosition: number
      previousPosition: number | null
      updatedAt: Date
    }, ExtArgs["result"]["rankingSnapshot"]>
    composites: {}
  }

  type RankingSnapshotGetPayload<S extends boolean | null | undefined | RankingSnapshotDefaultArgs> = $Result.GetResult<Prisma.$RankingSnapshotPayload, S>

  type RankingSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RankingSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RankingSnapshotCountAggregateInputType | true
    }

  export interface RankingSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RankingSnapshot'], meta: { name: 'RankingSnapshot' } }
    /**
     * Find zero or one RankingSnapshot that matches the filter.
     * @param {RankingSnapshotFindUniqueArgs} args - Arguments to find a RankingSnapshot
     * @example
     * // Get one RankingSnapshot
     * const rankingSnapshot = await prisma.rankingSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RankingSnapshotFindUniqueArgs>(args: SelectSubset<T, RankingSnapshotFindUniqueArgs<ExtArgs>>): Prisma__RankingSnapshotClient<$Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RankingSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RankingSnapshotFindUniqueOrThrowArgs} args - Arguments to find a RankingSnapshot
     * @example
     * // Get one RankingSnapshot
     * const rankingSnapshot = await prisma.rankingSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RankingSnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, RankingSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RankingSnapshotClient<$Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RankingSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingSnapshotFindFirstArgs} args - Arguments to find a RankingSnapshot
     * @example
     * // Get one RankingSnapshot
     * const rankingSnapshot = await prisma.rankingSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RankingSnapshotFindFirstArgs>(args?: SelectSubset<T, RankingSnapshotFindFirstArgs<ExtArgs>>): Prisma__RankingSnapshotClient<$Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RankingSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingSnapshotFindFirstOrThrowArgs} args - Arguments to find a RankingSnapshot
     * @example
     * // Get one RankingSnapshot
     * const rankingSnapshot = await prisma.rankingSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RankingSnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, RankingSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__RankingSnapshotClient<$Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RankingSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RankingSnapshots
     * const rankingSnapshots = await prisma.rankingSnapshot.findMany()
     * 
     * // Get first 10 RankingSnapshots
     * const rankingSnapshots = await prisma.rankingSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rankingSnapshotWithIdOnly = await prisma.rankingSnapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RankingSnapshotFindManyArgs>(args?: SelectSubset<T, RankingSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RankingSnapshot.
     * @param {RankingSnapshotCreateArgs} args - Arguments to create a RankingSnapshot.
     * @example
     * // Create one RankingSnapshot
     * const RankingSnapshot = await prisma.rankingSnapshot.create({
     *   data: {
     *     // ... data to create a RankingSnapshot
     *   }
     * })
     * 
     */
    create<T extends RankingSnapshotCreateArgs>(args: SelectSubset<T, RankingSnapshotCreateArgs<ExtArgs>>): Prisma__RankingSnapshotClient<$Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RankingSnapshots.
     * @param {RankingSnapshotCreateManyArgs} args - Arguments to create many RankingSnapshots.
     * @example
     * // Create many RankingSnapshots
     * const rankingSnapshot = await prisma.rankingSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RankingSnapshotCreateManyArgs>(args?: SelectSubset<T, RankingSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RankingSnapshots and returns the data saved in the database.
     * @param {RankingSnapshotCreateManyAndReturnArgs} args - Arguments to create many RankingSnapshots.
     * @example
     * // Create many RankingSnapshots
     * const rankingSnapshot = await prisma.rankingSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RankingSnapshots and only return the `id`
     * const rankingSnapshotWithIdOnly = await prisma.rankingSnapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RankingSnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, RankingSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RankingSnapshot.
     * @param {RankingSnapshotDeleteArgs} args - Arguments to delete one RankingSnapshot.
     * @example
     * // Delete one RankingSnapshot
     * const RankingSnapshot = await prisma.rankingSnapshot.delete({
     *   where: {
     *     // ... filter to delete one RankingSnapshot
     *   }
     * })
     * 
     */
    delete<T extends RankingSnapshotDeleteArgs>(args: SelectSubset<T, RankingSnapshotDeleteArgs<ExtArgs>>): Prisma__RankingSnapshotClient<$Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RankingSnapshot.
     * @param {RankingSnapshotUpdateArgs} args - Arguments to update one RankingSnapshot.
     * @example
     * // Update one RankingSnapshot
     * const rankingSnapshot = await prisma.rankingSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RankingSnapshotUpdateArgs>(args: SelectSubset<T, RankingSnapshotUpdateArgs<ExtArgs>>): Prisma__RankingSnapshotClient<$Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RankingSnapshots.
     * @param {RankingSnapshotDeleteManyArgs} args - Arguments to filter RankingSnapshots to delete.
     * @example
     * // Delete a few RankingSnapshots
     * const { count } = await prisma.rankingSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RankingSnapshotDeleteManyArgs>(args?: SelectSubset<T, RankingSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RankingSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RankingSnapshots
     * const rankingSnapshot = await prisma.rankingSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RankingSnapshotUpdateManyArgs>(args: SelectSubset<T, RankingSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RankingSnapshots and returns the data updated in the database.
     * @param {RankingSnapshotUpdateManyAndReturnArgs} args - Arguments to update many RankingSnapshots.
     * @example
     * // Update many RankingSnapshots
     * const rankingSnapshot = await prisma.rankingSnapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RankingSnapshots and only return the `id`
     * const rankingSnapshotWithIdOnly = await prisma.rankingSnapshot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RankingSnapshotUpdateManyAndReturnArgs>(args: SelectSubset<T, RankingSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RankingSnapshot.
     * @param {RankingSnapshotUpsertArgs} args - Arguments to update or create a RankingSnapshot.
     * @example
     * // Update or create a RankingSnapshot
     * const rankingSnapshot = await prisma.rankingSnapshot.upsert({
     *   create: {
     *     // ... data to create a RankingSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RankingSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends RankingSnapshotUpsertArgs>(args: SelectSubset<T, RankingSnapshotUpsertArgs<ExtArgs>>): Prisma__RankingSnapshotClient<$Result.GetResult<Prisma.$RankingSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RankingSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingSnapshotCountArgs} args - Arguments to filter RankingSnapshots to count.
     * @example
     * // Count the number of RankingSnapshots
     * const count = await prisma.rankingSnapshot.count({
     *   where: {
     *     // ... the filter for the RankingSnapshots we want to count
     *   }
     * })
    **/
    count<T extends RankingSnapshotCountArgs>(
      args?: Subset<T, RankingSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RankingSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RankingSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RankingSnapshotAggregateArgs>(args: Subset<T, RankingSnapshotAggregateArgs>): Prisma.PrismaPromise<GetRankingSnapshotAggregateType<T>>

    /**
     * Group by RankingSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RankingSnapshotGroupByArgs} args - Group by arguments.
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
      T extends RankingSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RankingSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: RankingSnapshotGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RankingSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRankingSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RankingSnapshot model
   */
  readonly fields: RankingSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RankingSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RankingSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participant<T extends ParticipantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ParticipantDefaultArgs<ExtArgs>>): Prisma__ParticipantClient<$Result.GetResult<Prisma.$ParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RankingSnapshot model
   */
  interface RankingSnapshotFieldRefs {
    readonly id: FieldRef<"RankingSnapshot", 'String'>
    readonly participantId: FieldRef<"RankingSnapshot", 'String'>
    readonly totalPoints: FieldRef<"RankingSnapshot", 'Int'>
    readonly exactScores: FieldRef<"RankingSnapshot", 'Int'>
    readonly correctResults: FieldRef<"RankingSnapshot", 'Int'>
    readonly wrongPredictions: FieldRef<"RankingSnapshot", 'Int'>
    readonly pendingPredictions: FieldRef<"RankingSnapshot", 'Int'>
    readonly playedMatches: FieldRef<"RankingSnapshot", 'Int'>
    readonly totalGoalDiffError: FieldRef<"RankingSnapshot", 'Int'>
    readonly effectivenessPercent: FieldRef<"RankingSnapshot", 'Float'>
    readonly currentPosition: FieldRef<"RankingSnapshot", 'Int'>
    readonly previousPosition: FieldRef<"RankingSnapshot", 'Int'>
    readonly updatedAt: FieldRef<"RankingSnapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RankingSnapshot findUnique
   */
  export type RankingSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RankingSnapshot
     */
    select?: RankingSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RankingSnapshot
     */
    omit?: RankingSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which RankingSnapshot to fetch.
     */
    where: RankingSnapshotWhereUniqueInput
  }

  /**
   * RankingSnapshot findUniqueOrThrow
   */
  export type RankingSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RankingSnapshot
     */
    select?: RankingSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RankingSnapshot
     */
    omit?: RankingSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which RankingSnapshot to fetch.
     */
    where: RankingSnapshotWhereUniqueInput
  }

  /**
   * RankingSnapshot findFirst
   */
  export type RankingSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RankingSnapshot
     */
    select?: RankingSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RankingSnapshot
     */
    omit?: RankingSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which RankingSnapshot to fetch.
     */
    where?: RankingSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RankingSnapshots to fetch.
     */
    orderBy?: RankingSnapshotOrderByWithRelationInput | RankingSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RankingSnapshots.
     */
    cursor?: RankingSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RankingSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RankingSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RankingSnapshots.
     */
    distinct?: RankingSnapshotScalarFieldEnum | RankingSnapshotScalarFieldEnum[]
  }

  /**
   * RankingSnapshot findFirstOrThrow
   */
  export type RankingSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RankingSnapshot
     */
    select?: RankingSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RankingSnapshot
     */
    omit?: RankingSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which RankingSnapshot to fetch.
     */
    where?: RankingSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RankingSnapshots to fetch.
     */
    orderBy?: RankingSnapshotOrderByWithRelationInput | RankingSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RankingSnapshots.
     */
    cursor?: RankingSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RankingSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RankingSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RankingSnapshots.
     */
    distinct?: RankingSnapshotScalarFieldEnum | RankingSnapshotScalarFieldEnum[]
  }

  /**
   * RankingSnapshot findMany
   */
  export type RankingSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RankingSnapshot
     */
    select?: RankingSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RankingSnapshot
     */
    omit?: RankingSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which RankingSnapshots to fetch.
     */
    where?: RankingSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RankingSnapshots to fetch.
     */
    orderBy?: RankingSnapshotOrderByWithRelationInput | RankingSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RankingSnapshots.
     */
    cursor?: RankingSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RankingSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RankingSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RankingSnapshots.
     */
    distinct?: RankingSnapshotScalarFieldEnum | RankingSnapshotScalarFieldEnum[]
  }

  /**
   * RankingSnapshot create
   */
  export type RankingSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RankingSnapshot
     */
    select?: RankingSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RankingSnapshot
     */
    omit?: RankingSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to create a RankingSnapshot.
     */
    data: XOR<RankingSnapshotCreateInput, RankingSnapshotUncheckedCreateInput>
  }

  /**
   * RankingSnapshot createMany
   */
  export type RankingSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RankingSnapshots.
     */
    data: RankingSnapshotCreateManyInput | RankingSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RankingSnapshot createManyAndReturn
   */
  export type RankingSnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RankingSnapshot
     */
    select?: RankingSnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RankingSnapshot
     */
    omit?: RankingSnapshotOmit<ExtArgs> | null
    /**
     * The data used to create many RankingSnapshots.
     */
    data: RankingSnapshotCreateManyInput | RankingSnapshotCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingSnapshotIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RankingSnapshot update
   */
  export type RankingSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RankingSnapshot
     */
    select?: RankingSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RankingSnapshot
     */
    omit?: RankingSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to update a RankingSnapshot.
     */
    data: XOR<RankingSnapshotUpdateInput, RankingSnapshotUncheckedUpdateInput>
    /**
     * Choose, which RankingSnapshot to update.
     */
    where: RankingSnapshotWhereUniqueInput
  }

  /**
   * RankingSnapshot updateMany
   */
  export type RankingSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RankingSnapshots.
     */
    data: XOR<RankingSnapshotUpdateManyMutationInput, RankingSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which RankingSnapshots to update
     */
    where?: RankingSnapshotWhereInput
    /**
     * Limit how many RankingSnapshots to update.
     */
    limit?: number
  }

  /**
   * RankingSnapshot updateManyAndReturn
   */
  export type RankingSnapshotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RankingSnapshot
     */
    select?: RankingSnapshotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RankingSnapshot
     */
    omit?: RankingSnapshotOmit<ExtArgs> | null
    /**
     * The data used to update RankingSnapshots.
     */
    data: XOR<RankingSnapshotUpdateManyMutationInput, RankingSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which RankingSnapshots to update
     */
    where?: RankingSnapshotWhereInput
    /**
     * Limit how many RankingSnapshots to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingSnapshotIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RankingSnapshot upsert
   */
  export type RankingSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RankingSnapshot
     */
    select?: RankingSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RankingSnapshot
     */
    omit?: RankingSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingSnapshotInclude<ExtArgs> | null
    /**
     * The filter to search for the RankingSnapshot to update in case it exists.
     */
    where: RankingSnapshotWhereUniqueInput
    /**
     * In case the RankingSnapshot found by the `where` argument doesn't exist, create a new RankingSnapshot with this data.
     */
    create: XOR<RankingSnapshotCreateInput, RankingSnapshotUncheckedCreateInput>
    /**
     * In case the RankingSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RankingSnapshotUpdateInput, RankingSnapshotUncheckedUpdateInput>
  }

  /**
   * RankingSnapshot delete
   */
  export type RankingSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RankingSnapshot
     */
    select?: RankingSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RankingSnapshot
     */
    omit?: RankingSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingSnapshotInclude<ExtArgs> | null
    /**
     * Filter which RankingSnapshot to delete.
     */
    where: RankingSnapshotWhereUniqueInput
  }

  /**
   * RankingSnapshot deleteMany
   */
  export type RankingSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RankingSnapshots to delete
     */
    where?: RankingSnapshotWhereInput
    /**
     * Limit how many RankingSnapshots to delete.
     */
    limit?: number
  }

  /**
   * RankingSnapshot without action
   */
  export type RankingSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RankingSnapshot
     */
    select?: RankingSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RankingSnapshot
     */
    omit?: RankingSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RankingSnapshotInclude<ExtArgs> | null
  }


  /**
   * Model LiveResultsLog
   */

  export type AggregateLiveResultsLog = {
    _count: LiveResultsLogCountAggregateOutputType | null
    _avg: LiveResultsLogAvgAggregateOutputType | null
    _sum: LiveResultsLogSumAggregateOutputType | null
    _min: LiveResultsLogMinAggregateOutputType | null
    _max: LiveResultsLogMaxAggregateOutputType | null
  }

  export type LiveResultsLogAvgAggregateOutputType = {
    detectedGoals1: number | null
    detectedGoals2: number | null
  }

  export type LiveResultsLogSumAggregateOutputType = {
    detectedGoals1: number | null
    detectedGoals2: number | null
  }

  export type LiveResultsLogMinAggregateOutputType = {
    id: string | null
    type: string | null
    message: string | null
    matchId: string | null
    source: string | null
    confidence: string | null
    detectedGoals1: number | null
    detectedGoals2: number | null
    adminAction: string | null
    rawData: string | null
    createdAt: Date | null
  }

  export type LiveResultsLogMaxAggregateOutputType = {
    id: string | null
    type: string | null
    message: string | null
    matchId: string | null
    source: string | null
    confidence: string | null
    detectedGoals1: number | null
    detectedGoals2: number | null
    adminAction: string | null
    rawData: string | null
    createdAt: Date | null
  }

  export type LiveResultsLogCountAggregateOutputType = {
    id: number
    type: number
    message: number
    matchId: number
    source: number
    confidence: number
    detectedGoals1: number
    detectedGoals2: number
    adminAction: number
    rawData: number
    createdAt: number
    _all: number
  }


  export type LiveResultsLogAvgAggregateInputType = {
    detectedGoals1?: true
    detectedGoals2?: true
  }

  export type LiveResultsLogSumAggregateInputType = {
    detectedGoals1?: true
    detectedGoals2?: true
  }

  export type LiveResultsLogMinAggregateInputType = {
    id?: true
    type?: true
    message?: true
    matchId?: true
    source?: true
    confidence?: true
    detectedGoals1?: true
    detectedGoals2?: true
    adminAction?: true
    rawData?: true
    createdAt?: true
  }

  export type LiveResultsLogMaxAggregateInputType = {
    id?: true
    type?: true
    message?: true
    matchId?: true
    source?: true
    confidence?: true
    detectedGoals1?: true
    detectedGoals2?: true
    adminAction?: true
    rawData?: true
    createdAt?: true
  }

  export type LiveResultsLogCountAggregateInputType = {
    id?: true
    type?: true
    message?: true
    matchId?: true
    source?: true
    confidence?: true
    detectedGoals1?: true
    detectedGoals2?: true
    adminAction?: true
    rawData?: true
    createdAt?: true
    _all?: true
  }

  export type LiveResultsLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LiveResultsLog to aggregate.
     */
    where?: LiveResultsLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LiveResultsLogs to fetch.
     */
    orderBy?: LiveResultsLogOrderByWithRelationInput | LiveResultsLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LiveResultsLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LiveResultsLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LiveResultsLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LiveResultsLogs
    **/
    _count?: true | LiveResultsLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LiveResultsLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LiveResultsLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LiveResultsLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LiveResultsLogMaxAggregateInputType
  }

  export type GetLiveResultsLogAggregateType<T extends LiveResultsLogAggregateArgs> = {
        [P in keyof T & keyof AggregateLiveResultsLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLiveResultsLog[P]>
      : GetScalarType<T[P], AggregateLiveResultsLog[P]>
  }




  export type LiveResultsLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LiveResultsLogWhereInput
    orderBy?: LiveResultsLogOrderByWithAggregationInput | LiveResultsLogOrderByWithAggregationInput[]
    by: LiveResultsLogScalarFieldEnum[] | LiveResultsLogScalarFieldEnum
    having?: LiveResultsLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LiveResultsLogCountAggregateInputType | true
    _avg?: LiveResultsLogAvgAggregateInputType
    _sum?: LiveResultsLogSumAggregateInputType
    _min?: LiveResultsLogMinAggregateInputType
    _max?: LiveResultsLogMaxAggregateInputType
  }

  export type LiveResultsLogGroupByOutputType = {
    id: string
    type: string
    message: string
    matchId: string | null
    source: string | null
    confidence: string | null
    detectedGoals1: number | null
    detectedGoals2: number | null
    adminAction: string | null
    rawData: string | null
    createdAt: Date
    _count: LiveResultsLogCountAggregateOutputType | null
    _avg: LiveResultsLogAvgAggregateOutputType | null
    _sum: LiveResultsLogSumAggregateOutputType | null
    _min: LiveResultsLogMinAggregateOutputType | null
    _max: LiveResultsLogMaxAggregateOutputType | null
  }

  type GetLiveResultsLogGroupByPayload<T extends LiveResultsLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LiveResultsLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LiveResultsLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LiveResultsLogGroupByOutputType[P]>
            : GetScalarType<T[P], LiveResultsLogGroupByOutputType[P]>
        }
      >
    >


  export type LiveResultsLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    message?: boolean
    matchId?: boolean
    source?: boolean
    confidence?: boolean
    detectedGoals1?: boolean
    detectedGoals2?: boolean
    adminAction?: boolean
    rawData?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["liveResultsLog"]>

  export type LiveResultsLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    message?: boolean
    matchId?: boolean
    source?: boolean
    confidence?: boolean
    detectedGoals1?: boolean
    detectedGoals2?: boolean
    adminAction?: boolean
    rawData?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["liveResultsLog"]>

  export type LiveResultsLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    message?: boolean
    matchId?: boolean
    source?: boolean
    confidence?: boolean
    detectedGoals1?: boolean
    detectedGoals2?: boolean
    adminAction?: boolean
    rawData?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["liveResultsLog"]>

  export type LiveResultsLogSelectScalar = {
    id?: boolean
    type?: boolean
    message?: boolean
    matchId?: boolean
    source?: boolean
    confidence?: boolean
    detectedGoals1?: boolean
    detectedGoals2?: boolean
    adminAction?: boolean
    rawData?: boolean
    createdAt?: boolean
  }

  export type LiveResultsLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "message" | "matchId" | "source" | "confidence" | "detectedGoals1" | "detectedGoals2" | "adminAction" | "rawData" | "createdAt", ExtArgs["result"]["liveResultsLog"]>

  export type $LiveResultsLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LiveResultsLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      message: string
      matchId: string | null
      source: string | null
      confidence: string | null
      detectedGoals1: number | null
      detectedGoals2: number | null
      adminAction: string | null
      rawData: string | null
      createdAt: Date
    }, ExtArgs["result"]["liveResultsLog"]>
    composites: {}
  }

  type LiveResultsLogGetPayload<S extends boolean | null | undefined | LiveResultsLogDefaultArgs> = $Result.GetResult<Prisma.$LiveResultsLogPayload, S>

  type LiveResultsLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LiveResultsLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LiveResultsLogCountAggregateInputType | true
    }

  export interface LiveResultsLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LiveResultsLog'], meta: { name: 'LiveResultsLog' } }
    /**
     * Find zero or one LiveResultsLog that matches the filter.
     * @param {LiveResultsLogFindUniqueArgs} args - Arguments to find a LiveResultsLog
     * @example
     * // Get one LiveResultsLog
     * const liveResultsLog = await prisma.liveResultsLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LiveResultsLogFindUniqueArgs>(args: SelectSubset<T, LiveResultsLogFindUniqueArgs<ExtArgs>>): Prisma__LiveResultsLogClient<$Result.GetResult<Prisma.$LiveResultsLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LiveResultsLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LiveResultsLogFindUniqueOrThrowArgs} args - Arguments to find a LiveResultsLog
     * @example
     * // Get one LiveResultsLog
     * const liveResultsLog = await prisma.liveResultsLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LiveResultsLogFindUniqueOrThrowArgs>(args: SelectSubset<T, LiveResultsLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LiveResultsLogClient<$Result.GetResult<Prisma.$LiveResultsLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LiveResultsLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LiveResultsLogFindFirstArgs} args - Arguments to find a LiveResultsLog
     * @example
     * // Get one LiveResultsLog
     * const liveResultsLog = await prisma.liveResultsLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LiveResultsLogFindFirstArgs>(args?: SelectSubset<T, LiveResultsLogFindFirstArgs<ExtArgs>>): Prisma__LiveResultsLogClient<$Result.GetResult<Prisma.$LiveResultsLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LiveResultsLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LiveResultsLogFindFirstOrThrowArgs} args - Arguments to find a LiveResultsLog
     * @example
     * // Get one LiveResultsLog
     * const liveResultsLog = await prisma.liveResultsLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LiveResultsLogFindFirstOrThrowArgs>(args?: SelectSubset<T, LiveResultsLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__LiveResultsLogClient<$Result.GetResult<Prisma.$LiveResultsLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LiveResultsLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LiveResultsLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LiveResultsLogs
     * const liveResultsLogs = await prisma.liveResultsLog.findMany()
     * 
     * // Get first 10 LiveResultsLogs
     * const liveResultsLogs = await prisma.liveResultsLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const liveResultsLogWithIdOnly = await prisma.liveResultsLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LiveResultsLogFindManyArgs>(args?: SelectSubset<T, LiveResultsLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LiveResultsLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LiveResultsLog.
     * @param {LiveResultsLogCreateArgs} args - Arguments to create a LiveResultsLog.
     * @example
     * // Create one LiveResultsLog
     * const LiveResultsLog = await prisma.liveResultsLog.create({
     *   data: {
     *     // ... data to create a LiveResultsLog
     *   }
     * })
     * 
     */
    create<T extends LiveResultsLogCreateArgs>(args: SelectSubset<T, LiveResultsLogCreateArgs<ExtArgs>>): Prisma__LiveResultsLogClient<$Result.GetResult<Prisma.$LiveResultsLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LiveResultsLogs.
     * @param {LiveResultsLogCreateManyArgs} args - Arguments to create many LiveResultsLogs.
     * @example
     * // Create many LiveResultsLogs
     * const liveResultsLog = await prisma.liveResultsLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LiveResultsLogCreateManyArgs>(args?: SelectSubset<T, LiveResultsLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LiveResultsLogs and returns the data saved in the database.
     * @param {LiveResultsLogCreateManyAndReturnArgs} args - Arguments to create many LiveResultsLogs.
     * @example
     * // Create many LiveResultsLogs
     * const liveResultsLog = await prisma.liveResultsLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LiveResultsLogs and only return the `id`
     * const liveResultsLogWithIdOnly = await prisma.liveResultsLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LiveResultsLogCreateManyAndReturnArgs>(args?: SelectSubset<T, LiveResultsLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LiveResultsLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LiveResultsLog.
     * @param {LiveResultsLogDeleteArgs} args - Arguments to delete one LiveResultsLog.
     * @example
     * // Delete one LiveResultsLog
     * const LiveResultsLog = await prisma.liveResultsLog.delete({
     *   where: {
     *     // ... filter to delete one LiveResultsLog
     *   }
     * })
     * 
     */
    delete<T extends LiveResultsLogDeleteArgs>(args: SelectSubset<T, LiveResultsLogDeleteArgs<ExtArgs>>): Prisma__LiveResultsLogClient<$Result.GetResult<Prisma.$LiveResultsLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LiveResultsLog.
     * @param {LiveResultsLogUpdateArgs} args - Arguments to update one LiveResultsLog.
     * @example
     * // Update one LiveResultsLog
     * const liveResultsLog = await prisma.liveResultsLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LiveResultsLogUpdateArgs>(args: SelectSubset<T, LiveResultsLogUpdateArgs<ExtArgs>>): Prisma__LiveResultsLogClient<$Result.GetResult<Prisma.$LiveResultsLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LiveResultsLogs.
     * @param {LiveResultsLogDeleteManyArgs} args - Arguments to filter LiveResultsLogs to delete.
     * @example
     * // Delete a few LiveResultsLogs
     * const { count } = await prisma.liveResultsLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LiveResultsLogDeleteManyArgs>(args?: SelectSubset<T, LiveResultsLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LiveResultsLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LiveResultsLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LiveResultsLogs
     * const liveResultsLog = await prisma.liveResultsLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LiveResultsLogUpdateManyArgs>(args: SelectSubset<T, LiveResultsLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LiveResultsLogs and returns the data updated in the database.
     * @param {LiveResultsLogUpdateManyAndReturnArgs} args - Arguments to update many LiveResultsLogs.
     * @example
     * // Update many LiveResultsLogs
     * const liveResultsLog = await prisma.liveResultsLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LiveResultsLogs and only return the `id`
     * const liveResultsLogWithIdOnly = await prisma.liveResultsLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LiveResultsLogUpdateManyAndReturnArgs>(args: SelectSubset<T, LiveResultsLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LiveResultsLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LiveResultsLog.
     * @param {LiveResultsLogUpsertArgs} args - Arguments to update or create a LiveResultsLog.
     * @example
     * // Update or create a LiveResultsLog
     * const liveResultsLog = await prisma.liveResultsLog.upsert({
     *   create: {
     *     // ... data to create a LiveResultsLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LiveResultsLog we want to update
     *   }
     * })
     */
    upsert<T extends LiveResultsLogUpsertArgs>(args: SelectSubset<T, LiveResultsLogUpsertArgs<ExtArgs>>): Prisma__LiveResultsLogClient<$Result.GetResult<Prisma.$LiveResultsLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LiveResultsLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LiveResultsLogCountArgs} args - Arguments to filter LiveResultsLogs to count.
     * @example
     * // Count the number of LiveResultsLogs
     * const count = await prisma.liveResultsLog.count({
     *   where: {
     *     // ... the filter for the LiveResultsLogs we want to count
     *   }
     * })
    **/
    count<T extends LiveResultsLogCountArgs>(
      args?: Subset<T, LiveResultsLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LiveResultsLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LiveResultsLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LiveResultsLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LiveResultsLogAggregateArgs>(args: Subset<T, LiveResultsLogAggregateArgs>): Prisma.PrismaPromise<GetLiveResultsLogAggregateType<T>>

    /**
     * Group by LiveResultsLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LiveResultsLogGroupByArgs} args - Group by arguments.
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
      T extends LiveResultsLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LiveResultsLogGroupByArgs['orderBy'] }
        : { orderBy?: LiveResultsLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LiveResultsLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLiveResultsLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LiveResultsLog model
   */
  readonly fields: LiveResultsLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LiveResultsLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LiveResultsLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LiveResultsLog model
   */
  interface LiveResultsLogFieldRefs {
    readonly id: FieldRef<"LiveResultsLog", 'String'>
    readonly type: FieldRef<"LiveResultsLog", 'String'>
    readonly message: FieldRef<"LiveResultsLog", 'String'>
    readonly matchId: FieldRef<"LiveResultsLog", 'String'>
    readonly source: FieldRef<"LiveResultsLog", 'String'>
    readonly confidence: FieldRef<"LiveResultsLog", 'String'>
    readonly detectedGoals1: FieldRef<"LiveResultsLog", 'Int'>
    readonly detectedGoals2: FieldRef<"LiveResultsLog", 'Int'>
    readonly adminAction: FieldRef<"LiveResultsLog", 'String'>
    readonly rawData: FieldRef<"LiveResultsLog", 'String'>
    readonly createdAt: FieldRef<"LiveResultsLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LiveResultsLog findUnique
   */
  export type LiveResultsLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LiveResultsLog
     */
    select?: LiveResultsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LiveResultsLog
     */
    omit?: LiveResultsLogOmit<ExtArgs> | null
    /**
     * Filter, which LiveResultsLog to fetch.
     */
    where: LiveResultsLogWhereUniqueInput
  }

  /**
   * LiveResultsLog findUniqueOrThrow
   */
  export type LiveResultsLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LiveResultsLog
     */
    select?: LiveResultsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LiveResultsLog
     */
    omit?: LiveResultsLogOmit<ExtArgs> | null
    /**
     * Filter, which LiveResultsLog to fetch.
     */
    where: LiveResultsLogWhereUniqueInput
  }

  /**
   * LiveResultsLog findFirst
   */
  export type LiveResultsLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LiveResultsLog
     */
    select?: LiveResultsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LiveResultsLog
     */
    omit?: LiveResultsLogOmit<ExtArgs> | null
    /**
     * Filter, which LiveResultsLog to fetch.
     */
    where?: LiveResultsLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LiveResultsLogs to fetch.
     */
    orderBy?: LiveResultsLogOrderByWithRelationInput | LiveResultsLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LiveResultsLogs.
     */
    cursor?: LiveResultsLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LiveResultsLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LiveResultsLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LiveResultsLogs.
     */
    distinct?: LiveResultsLogScalarFieldEnum | LiveResultsLogScalarFieldEnum[]
  }

  /**
   * LiveResultsLog findFirstOrThrow
   */
  export type LiveResultsLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LiveResultsLog
     */
    select?: LiveResultsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LiveResultsLog
     */
    omit?: LiveResultsLogOmit<ExtArgs> | null
    /**
     * Filter, which LiveResultsLog to fetch.
     */
    where?: LiveResultsLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LiveResultsLogs to fetch.
     */
    orderBy?: LiveResultsLogOrderByWithRelationInput | LiveResultsLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LiveResultsLogs.
     */
    cursor?: LiveResultsLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LiveResultsLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LiveResultsLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LiveResultsLogs.
     */
    distinct?: LiveResultsLogScalarFieldEnum | LiveResultsLogScalarFieldEnum[]
  }

  /**
   * LiveResultsLog findMany
   */
  export type LiveResultsLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LiveResultsLog
     */
    select?: LiveResultsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LiveResultsLog
     */
    omit?: LiveResultsLogOmit<ExtArgs> | null
    /**
     * Filter, which LiveResultsLogs to fetch.
     */
    where?: LiveResultsLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LiveResultsLogs to fetch.
     */
    orderBy?: LiveResultsLogOrderByWithRelationInput | LiveResultsLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LiveResultsLogs.
     */
    cursor?: LiveResultsLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LiveResultsLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LiveResultsLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LiveResultsLogs.
     */
    distinct?: LiveResultsLogScalarFieldEnum | LiveResultsLogScalarFieldEnum[]
  }

  /**
   * LiveResultsLog create
   */
  export type LiveResultsLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LiveResultsLog
     */
    select?: LiveResultsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LiveResultsLog
     */
    omit?: LiveResultsLogOmit<ExtArgs> | null
    /**
     * The data needed to create a LiveResultsLog.
     */
    data: XOR<LiveResultsLogCreateInput, LiveResultsLogUncheckedCreateInput>
  }

  /**
   * LiveResultsLog createMany
   */
  export type LiveResultsLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LiveResultsLogs.
     */
    data: LiveResultsLogCreateManyInput | LiveResultsLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LiveResultsLog createManyAndReturn
   */
  export type LiveResultsLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LiveResultsLog
     */
    select?: LiveResultsLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LiveResultsLog
     */
    omit?: LiveResultsLogOmit<ExtArgs> | null
    /**
     * The data used to create many LiveResultsLogs.
     */
    data: LiveResultsLogCreateManyInput | LiveResultsLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LiveResultsLog update
   */
  export type LiveResultsLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LiveResultsLog
     */
    select?: LiveResultsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LiveResultsLog
     */
    omit?: LiveResultsLogOmit<ExtArgs> | null
    /**
     * The data needed to update a LiveResultsLog.
     */
    data: XOR<LiveResultsLogUpdateInput, LiveResultsLogUncheckedUpdateInput>
    /**
     * Choose, which LiveResultsLog to update.
     */
    where: LiveResultsLogWhereUniqueInput
  }

  /**
   * LiveResultsLog updateMany
   */
  export type LiveResultsLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LiveResultsLogs.
     */
    data: XOR<LiveResultsLogUpdateManyMutationInput, LiveResultsLogUncheckedUpdateManyInput>
    /**
     * Filter which LiveResultsLogs to update
     */
    where?: LiveResultsLogWhereInput
    /**
     * Limit how many LiveResultsLogs to update.
     */
    limit?: number
  }

  /**
   * LiveResultsLog updateManyAndReturn
   */
  export type LiveResultsLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LiveResultsLog
     */
    select?: LiveResultsLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LiveResultsLog
     */
    omit?: LiveResultsLogOmit<ExtArgs> | null
    /**
     * The data used to update LiveResultsLogs.
     */
    data: XOR<LiveResultsLogUpdateManyMutationInput, LiveResultsLogUncheckedUpdateManyInput>
    /**
     * Filter which LiveResultsLogs to update
     */
    where?: LiveResultsLogWhereInput
    /**
     * Limit how many LiveResultsLogs to update.
     */
    limit?: number
  }

  /**
   * LiveResultsLog upsert
   */
  export type LiveResultsLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LiveResultsLog
     */
    select?: LiveResultsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LiveResultsLog
     */
    omit?: LiveResultsLogOmit<ExtArgs> | null
    /**
     * The filter to search for the LiveResultsLog to update in case it exists.
     */
    where: LiveResultsLogWhereUniqueInput
    /**
     * In case the LiveResultsLog found by the `where` argument doesn't exist, create a new LiveResultsLog with this data.
     */
    create: XOR<LiveResultsLogCreateInput, LiveResultsLogUncheckedCreateInput>
    /**
     * In case the LiveResultsLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LiveResultsLogUpdateInput, LiveResultsLogUncheckedUpdateInput>
  }

  /**
   * LiveResultsLog delete
   */
  export type LiveResultsLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LiveResultsLog
     */
    select?: LiveResultsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LiveResultsLog
     */
    omit?: LiveResultsLogOmit<ExtArgs> | null
    /**
     * Filter which LiveResultsLog to delete.
     */
    where: LiveResultsLogWhereUniqueInput
  }

  /**
   * LiveResultsLog deleteMany
   */
  export type LiveResultsLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LiveResultsLogs to delete
     */
    where?: LiveResultsLogWhereInput
    /**
     * Limit how many LiveResultsLogs to delete.
     */
    limit?: number
  }

  /**
   * LiveResultsLog without action
   */
  export type LiveResultsLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LiveResultsLog
     */
    select?: LiveResultsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LiveResultsLog
     */
    omit?: LiveResultsLogOmit<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    oldValue: string | null
    newValue: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    oldValue: string | null
    newValue: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    userId: number
    action: number
    entityType: number
    entityId: number
    oldValue: number
    newValue: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    entityType?: true
    entityId?: true
    oldValue?: true
    newValue?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    entityType?: true
    entityId?: true
    oldValue?: true
    newValue?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    entityType?: true
    entityId?: true
    oldValue?: true
    newValue?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    userId: string | null
    action: string
    entityType: string
    entityId: string | null
    oldValue: string | null
    newValue: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    userId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "action" | "entityType" | "entityId" | "oldValue" | "newValue" | "createdAt", ExtArgs["result"]["auditLog"]>

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      action: string
      entityType: string
      entityId: string | null
      oldValue: string | null
      newValue: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
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
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly entityType: FieldRef<"AuditLog", 'String'>
    readonly entityId: FieldRef<"AuditLog", 'String'>
    readonly oldValue: FieldRef<"AuditLog", 'String'>
    readonly newValue: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
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


  export const SettingScalarFieldEnum: {
    id: 'id',
    appName: 'appName',
    entryPriceUsd: 'entryPriceUsd',
    paymentPhone: 'paymentPhone',
    paymentNationalId: 'paymentNationalId',
    paymentBank: 'paymentBank',
    exchangeRateCurrency: 'exchangeRateCurrency',
    manualExchangeRate: 'manualExchangeRate',
    manualExchangeRateDate: 'manualExchangeRateDate',
    firstPrizePercent: 'firstPrizePercent',
    secondPrizePercent: 'secondPrizePercent',
    organizationPercent: 'organizationPercent',
    deadline: 'deadline',
    rankingVisible: 'rankingVisible',
    showOnlyPaidParticipants: 'showOnlyPaidParticipants',
    allowPublicPredictionViewAfterDeadline: 'allowPublicPredictionViewAfterDeadline',
    tiebreakerRules: 'tiebreakerRules',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SettingScalarFieldEnum = (typeof SettingScalarFieldEnum)[keyof typeof SettingScalarFieldEnum]


  export const TeamScalarFieldEnum: {
    id: 'id',
    officialName: 'officialName',
    displayName: 'displayName',
    shortName: 'shortName',
    fifaCode: 'fifaCode',
    isoCode: 'isoCode',
    flagEmoji: 'flagEmoji',
    group: 'group',
    aliases: 'aliases',
    createdAt: 'createdAt'
  };

  export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum]


  export const MatchScalarFieldEnum: {
    id: 'id',
    matchNumber: 'matchNumber',
    group: 'group',
    team1Id: 'team1Id',
    team2Id: 'team2Id',
    kickoffUtc: 'kickoffUtc',
    venue: 'venue',
    city: 'city',
    source: 'source',
    status: 'status',
    team1Goals: 'team1Goals',
    team2Goals: 'team2Goals',
    result: 'result',
    resultUpdatedAt: 'resultUpdatedAt',
    resultSource: 'resultSource',
    autoDetectedTeam1Goals: 'autoDetectedTeam1Goals',
    autoDetectedTeam2Goals: 'autoDetectedTeam2Goals',
    autoDetectedResult: 'autoDetectedResult',
    autoDetectedSource: 'autoDetectedSource',
    autoDetectionConfidence: 'autoDetectionConfidence',
    autoDetectedAt: 'autoDetectedAt',
    autoResultStatus: 'autoResultStatus',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MatchScalarFieldEnum = (typeof MatchScalarFieldEnum)[keyof typeof MatchScalarFieldEnum]


  export const ParticipantScalarFieldEnum: {
    id: 'id',
    fullName: 'fullName',
    nationalId: 'nationalId',
    phone: 'phone',
    email: 'email',
    city: 'city',
    participationCode: 'participationCode',
    confirmationHash: 'confirmationHash',
    submittedAt: 'submittedAt',
    isComplete: 'isComplete',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ParticipantScalarFieldEnum = (typeof ParticipantScalarFieldEnum)[keyof typeof ParticipantScalarFieldEnum]


  export const PredictionScalarFieldEnum: {
    id: 'id',
    participantId: 'participantId',
    matchId: 'matchId',
    predictedTeam1Goals: 'predictedTeam1Goals',
    predictedTeam2Goals: 'predictedTeam2Goals',
    predictedResult: 'predictedResult',
    points: 'points',
    isExactScore: 'isExactScore',
    isCorrectResult: 'isCorrectResult',
    goalDifferenceError: 'goalDifferenceError',
    createdAt: 'createdAt'
  };

  export type PredictionScalarFieldEnum = (typeof PredictionScalarFieldEnum)[keyof typeof PredictionScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    participantId: 'participantId',
    amountUsd: 'amountUsd',
    exchangeRate: 'exchangeRate',
    exchangeRateDate: 'exchangeRateDate',
    amountVes: 'amountVes',
    senderBank: 'senderBank',
    paymentReference: 'paymentReference',
    paymentDate: 'paymentDate',
    paymentProofPath: 'paymentProofPath',
    paymentStatus: 'paymentStatus',
    adminNotes: 'adminNotes',
    verifiedAt: 'verifiedAt',
    rejectedAt: 'rejectedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const RankingSnapshotScalarFieldEnum: {
    id: 'id',
    participantId: 'participantId',
    totalPoints: 'totalPoints',
    exactScores: 'exactScores',
    correctResults: 'correctResults',
    wrongPredictions: 'wrongPredictions',
    pendingPredictions: 'pendingPredictions',
    playedMatches: 'playedMatches',
    totalGoalDiffError: 'totalGoalDiffError',
    effectivenessPercent: 'effectivenessPercent',
    currentPosition: 'currentPosition',
    previousPosition: 'previousPosition',
    updatedAt: 'updatedAt'
  };

  export type RankingSnapshotScalarFieldEnum = (typeof RankingSnapshotScalarFieldEnum)[keyof typeof RankingSnapshotScalarFieldEnum]


  export const LiveResultsLogScalarFieldEnum: {
    id: 'id',
    type: 'type',
    message: 'message',
    matchId: 'matchId',
    source: 'source',
    confidence: 'confidence',
    detectedGoals1: 'detectedGoals1',
    detectedGoals2: 'detectedGoals2',
    adminAction: 'adminAction',
    rawData: 'rawData',
    createdAt: 'createdAt'
  };

  export type LiveResultsLogScalarFieldEnum = (typeof LiveResultsLogScalarFieldEnum)[keyof typeof LiveResultsLogScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    oldValue: 'oldValue',
    newValue: 'newValue',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


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
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


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
   * Reference to a field of type 'MatchStatus'
   */
  export type EnumMatchStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchStatus'>
    


  /**
   * Reference to a field of type 'MatchStatus[]'
   */
  export type ListEnumMatchStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchStatus[]'>
    


  /**
   * Reference to a field of type 'MatchResult'
   */
  export type EnumMatchResultFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchResult'>
    


  /**
   * Reference to a field of type 'MatchResult[]'
   */
  export type ListEnumMatchResultFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchResult[]'>
    


  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>
    


  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type SettingWhereInput = {
    AND?: SettingWhereInput | SettingWhereInput[]
    OR?: SettingWhereInput[]
    NOT?: SettingWhereInput | SettingWhereInput[]
    id?: StringFilter<"Setting"> | string
    appName?: StringFilter<"Setting"> | string
    entryPriceUsd?: FloatFilter<"Setting"> | number
    paymentPhone?: StringFilter<"Setting"> | string
    paymentNationalId?: StringFilter<"Setting"> | string
    paymentBank?: StringFilter<"Setting"> | string
    exchangeRateCurrency?: StringFilter<"Setting"> | string
    manualExchangeRate?: FloatNullableFilter<"Setting"> | number | null
    manualExchangeRateDate?: DateTimeNullableFilter<"Setting"> | Date | string | null
    firstPrizePercent?: FloatFilter<"Setting"> | number
    secondPrizePercent?: FloatFilter<"Setting"> | number
    organizationPercent?: FloatFilter<"Setting"> | number
    deadline?: DateTimeNullableFilter<"Setting"> | Date | string | null
    rankingVisible?: BoolFilter<"Setting"> | boolean
    showOnlyPaidParticipants?: BoolFilter<"Setting"> | boolean
    allowPublicPredictionViewAfterDeadline?: BoolFilter<"Setting"> | boolean
    tiebreakerRules?: StringFilter<"Setting"> | string
    createdAt?: DateTimeFilter<"Setting"> | Date | string
    updatedAt?: DateTimeFilter<"Setting"> | Date | string
  }

  export type SettingOrderByWithRelationInput = {
    id?: SortOrder
    appName?: SortOrder
    entryPriceUsd?: SortOrder
    paymentPhone?: SortOrder
    paymentNationalId?: SortOrder
    paymentBank?: SortOrder
    exchangeRateCurrency?: SortOrder
    manualExchangeRate?: SortOrderInput | SortOrder
    manualExchangeRateDate?: SortOrderInput | SortOrder
    firstPrizePercent?: SortOrder
    secondPrizePercent?: SortOrder
    organizationPercent?: SortOrder
    deadline?: SortOrderInput | SortOrder
    rankingVisible?: SortOrder
    showOnlyPaidParticipants?: SortOrder
    allowPublicPredictionViewAfterDeadline?: SortOrder
    tiebreakerRules?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SettingWhereInput | SettingWhereInput[]
    OR?: SettingWhereInput[]
    NOT?: SettingWhereInput | SettingWhereInput[]
    appName?: StringFilter<"Setting"> | string
    entryPriceUsd?: FloatFilter<"Setting"> | number
    paymentPhone?: StringFilter<"Setting"> | string
    paymentNationalId?: StringFilter<"Setting"> | string
    paymentBank?: StringFilter<"Setting"> | string
    exchangeRateCurrency?: StringFilter<"Setting"> | string
    manualExchangeRate?: FloatNullableFilter<"Setting"> | number | null
    manualExchangeRateDate?: DateTimeNullableFilter<"Setting"> | Date | string | null
    firstPrizePercent?: FloatFilter<"Setting"> | number
    secondPrizePercent?: FloatFilter<"Setting"> | number
    organizationPercent?: FloatFilter<"Setting"> | number
    deadline?: DateTimeNullableFilter<"Setting"> | Date | string | null
    rankingVisible?: BoolFilter<"Setting"> | boolean
    showOnlyPaidParticipants?: BoolFilter<"Setting"> | boolean
    allowPublicPredictionViewAfterDeadline?: BoolFilter<"Setting"> | boolean
    tiebreakerRules?: StringFilter<"Setting"> | string
    createdAt?: DateTimeFilter<"Setting"> | Date | string
    updatedAt?: DateTimeFilter<"Setting"> | Date | string
  }, "id">

  export type SettingOrderByWithAggregationInput = {
    id?: SortOrder
    appName?: SortOrder
    entryPriceUsd?: SortOrder
    paymentPhone?: SortOrder
    paymentNationalId?: SortOrder
    paymentBank?: SortOrder
    exchangeRateCurrency?: SortOrder
    manualExchangeRate?: SortOrderInput | SortOrder
    manualExchangeRateDate?: SortOrderInput | SortOrder
    firstPrizePercent?: SortOrder
    secondPrizePercent?: SortOrder
    organizationPercent?: SortOrder
    deadline?: SortOrderInput | SortOrder
    rankingVisible?: SortOrder
    showOnlyPaidParticipants?: SortOrder
    allowPublicPredictionViewAfterDeadline?: SortOrder
    tiebreakerRules?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SettingCountOrderByAggregateInput
    _avg?: SettingAvgOrderByAggregateInput
    _max?: SettingMaxOrderByAggregateInput
    _min?: SettingMinOrderByAggregateInput
    _sum?: SettingSumOrderByAggregateInput
  }

  export type SettingScalarWhereWithAggregatesInput = {
    AND?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[]
    OR?: SettingScalarWhereWithAggregatesInput[]
    NOT?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Setting"> | string
    appName?: StringWithAggregatesFilter<"Setting"> | string
    entryPriceUsd?: FloatWithAggregatesFilter<"Setting"> | number
    paymentPhone?: StringWithAggregatesFilter<"Setting"> | string
    paymentNationalId?: StringWithAggregatesFilter<"Setting"> | string
    paymentBank?: StringWithAggregatesFilter<"Setting"> | string
    exchangeRateCurrency?: StringWithAggregatesFilter<"Setting"> | string
    manualExchangeRate?: FloatNullableWithAggregatesFilter<"Setting"> | number | null
    manualExchangeRateDate?: DateTimeNullableWithAggregatesFilter<"Setting"> | Date | string | null
    firstPrizePercent?: FloatWithAggregatesFilter<"Setting"> | number
    secondPrizePercent?: FloatWithAggregatesFilter<"Setting"> | number
    organizationPercent?: FloatWithAggregatesFilter<"Setting"> | number
    deadline?: DateTimeNullableWithAggregatesFilter<"Setting"> | Date | string | null
    rankingVisible?: BoolWithAggregatesFilter<"Setting"> | boolean
    showOnlyPaidParticipants?: BoolWithAggregatesFilter<"Setting"> | boolean
    allowPublicPredictionViewAfterDeadline?: BoolWithAggregatesFilter<"Setting"> | boolean
    tiebreakerRules?: StringWithAggregatesFilter<"Setting"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Setting"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Setting"> | Date | string
  }

  export type TeamWhereInput = {
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    id?: StringFilter<"Team"> | string
    officialName?: StringFilter<"Team"> | string
    displayName?: StringFilter<"Team"> | string
    shortName?: StringFilter<"Team"> | string
    fifaCode?: StringFilter<"Team"> | string
    isoCode?: StringFilter<"Team"> | string
    flagEmoji?: StringFilter<"Team"> | string
    group?: StringFilter<"Team"> | string
    aliases?: StringFilter<"Team"> | string
    createdAt?: DateTimeFilter<"Team"> | Date | string
    matchesAsTeam1?: MatchListRelationFilter
    matchesAsTeam2?: MatchListRelationFilter
  }

  export type TeamOrderByWithRelationInput = {
    id?: SortOrder
    officialName?: SortOrder
    displayName?: SortOrder
    shortName?: SortOrder
    fifaCode?: SortOrder
    isoCode?: SortOrder
    flagEmoji?: SortOrder
    group?: SortOrder
    aliases?: SortOrder
    createdAt?: SortOrder
    matchesAsTeam1?: MatchOrderByRelationAggregateInput
    matchesAsTeam2?: MatchOrderByRelationAggregateInput
  }

  export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    fifaCode?: string
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    officialName?: StringFilter<"Team"> | string
    displayName?: StringFilter<"Team"> | string
    shortName?: StringFilter<"Team"> | string
    isoCode?: StringFilter<"Team"> | string
    flagEmoji?: StringFilter<"Team"> | string
    group?: StringFilter<"Team"> | string
    aliases?: StringFilter<"Team"> | string
    createdAt?: DateTimeFilter<"Team"> | Date | string
    matchesAsTeam1?: MatchListRelationFilter
    matchesAsTeam2?: MatchListRelationFilter
  }, "id" | "fifaCode">

  export type TeamOrderByWithAggregationInput = {
    id?: SortOrder
    officialName?: SortOrder
    displayName?: SortOrder
    shortName?: SortOrder
    fifaCode?: SortOrder
    isoCode?: SortOrder
    flagEmoji?: SortOrder
    group?: SortOrder
    aliases?: SortOrder
    createdAt?: SortOrder
    _count?: TeamCountOrderByAggregateInput
    _max?: TeamMaxOrderByAggregateInput
    _min?: TeamMinOrderByAggregateInput
  }

  export type TeamScalarWhereWithAggregatesInput = {
    AND?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    OR?: TeamScalarWhereWithAggregatesInput[]
    NOT?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Team"> | string
    officialName?: StringWithAggregatesFilter<"Team"> | string
    displayName?: StringWithAggregatesFilter<"Team"> | string
    shortName?: StringWithAggregatesFilter<"Team"> | string
    fifaCode?: StringWithAggregatesFilter<"Team"> | string
    isoCode?: StringWithAggregatesFilter<"Team"> | string
    flagEmoji?: StringWithAggregatesFilter<"Team"> | string
    group?: StringWithAggregatesFilter<"Team"> | string
    aliases?: StringWithAggregatesFilter<"Team"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Team"> | Date | string
  }

  export type MatchWhereInput = {
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    id?: StringFilter<"Match"> | string
    matchNumber?: IntFilter<"Match"> | number
    group?: StringFilter<"Match"> | string
    team1Id?: StringFilter<"Match"> | string
    team2Id?: StringFilter<"Match"> | string
    kickoffUtc?: DateTimeFilter<"Match"> | Date | string
    venue?: StringFilter<"Match"> | string
    city?: StringFilter<"Match"> | string
    source?: StringFilter<"Match"> | string
    status?: EnumMatchStatusFilter<"Match"> | $Enums.MatchStatus
    team1Goals?: IntNullableFilter<"Match"> | number | null
    team2Goals?: IntNullableFilter<"Match"> | number | null
    result?: EnumMatchResultNullableFilter<"Match"> | $Enums.MatchResult | null
    resultUpdatedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    resultSource?: StringNullableFilter<"Match"> | string | null
    autoDetectedTeam1Goals?: IntNullableFilter<"Match"> | number | null
    autoDetectedTeam2Goals?: IntNullableFilter<"Match"> | number | null
    autoDetectedResult?: EnumMatchResultNullableFilter<"Match"> | $Enums.MatchResult | null
    autoDetectedSource?: StringNullableFilter<"Match"> | string | null
    autoDetectionConfidence?: StringNullableFilter<"Match"> | string | null
    autoDetectedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    autoResultStatus?: StringNullableFilter<"Match"> | string | null
    createdAt?: DateTimeFilter<"Match"> | Date | string
    updatedAt?: DateTimeFilter<"Match"> | Date | string
    team1?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    team2?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    predictions?: PredictionListRelationFilter
  }

  export type MatchOrderByWithRelationInput = {
    id?: SortOrder
    matchNumber?: SortOrder
    group?: SortOrder
    team1Id?: SortOrder
    team2Id?: SortOrder
    kickoffUtc?: SortOrder
    venue?: SortOrder
    city?: SortOrder
    source?: SortOrder
    status?: SortOrder
    team1Goals?: SortOrderInput | SortOrder
    team2Goals?: SortOrderInput | SortOrder
    result?: SortOrderInput | SortOrder
    resultUpdatedAt?: SortOrderInput | SortOrder
    resultSource?: SortOrderInput | SortOrder
    autoDetectedTeam1Goals?: SortOrderInput | SortOrder
    autoDetectedTeam2Goals?: SortOrderInput | SortOrder
    autoDetectedResult?: SortOrderInput | SortOrder
    autoDetectedSource?: SortOrderInput | SortOrder
    autoDetectionConfidence?: SortOrderInput | SortOrder
    autoDetectedAt?: SortOrderInput | SortOrder
    autoResultStatus?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    team1?: TeamOrderByWithRelationInput
    team2?: TeamOrderByWithRelationInput
    predictions?: PredictionOrderByRelationAggregateInput
  }

  export type MatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    matchNumber?: number
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    group?: StringFilter<"Match"> | string
    team1Id?: StringFilter<"Match"> | string
    team2Id?: StringFilter<"Match"> | string
    kickoffUtc?: DateTimeFilter<"Match"> | Date | string
    venue?: StringFilter<"Match"> | string
    city?: StringFilter<"Match"> | string
    source?: StringFilter<"Match"> | string
    status?: EnumMatchStatusFilter<"Match"> | $Enums.MatchStatus
    team1Goals?: IntNullableFilter<"Match"> | number | null
    team2Goals?: IntNullableFilter<"Match"> | number | null
    result?: EnumMatchResultNullableFilter<"Match"> | $Enums.MatchResult | null
    resultUpdatedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    resultSource?: StringNullableFilter<"Match"> | string | null
    autoDetectedTeam1Goals?: IntNullableFilter<"Match"> | number | null
    autoDetectedTeam2Goals?: IntNullableFilter<"Match"> | number | null
    autoDetectedResult?: EnumMatchResultNullableFilter<"Match"> | $Enums.MatchResult | null
    autoDetectedSource?: StringNullableFilter<"Match"> | string | null
    autoDetectionConfidence?: StringNullableFilter<"Match"> | string | null
    autoDetectedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    autoResultStatus?: StringNullableFilter<"Match"> | string | null
    createdAt?: DateTimeFilter<"Match"> | Date | string
    updatedAt?: DateTimeFilter<"Match"> | Date | string
    team1?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    team2?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    predictions?: PredictionListRelationFilter
  }, "id" | "matchNumber">

  export type MatchOrderByWithAggregationInput = {
    id?: SortOrder
    matchNumber?: SortOrder
    group?: SortOrder
    team1Id?: SortOrder
    team2Id?: SortOrder
    kickoffUtc?: SortOrder
    venue?: SortOrder
    city?: SortOrder
    source?: SortOrder
    status?: SortOrder
    team1Goals?: SortOrderInput | SortOrder
    team2Goals?: SortOrderInput | SortOrder
    result?: SortOrderInput | SortOrder
    resultUpdatedAt?: SortOrderInput | SortOrder
    resultSource?: SortOrderInput | SortOrder
    autoDetectedTeam1Goals?: SortOrderInput | SortOrder
    autoDetectedTeam2Goals?: SortOrderInput | SortOrder
    autoDetectedResult?: SortOrderInput | SortOrder
    autoDetectedSource?: SortOrderInput | SortOrder
    autoDetectionConfidence?: SortOrderInput | SortOrder
    autoDetectedAt?: SortOrderInput | SortOrder
    autoResultStatus?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MatchCountOrderByAggregateInput
    _avg?: MatchAvgOrderByAggregateInput
    _max?: MatchMaxOrderByAggregateInput
    _min?: MatchMinOrderByAggregateInput
    _sum?: MatchSumOrderByAggregateInput
  }

  export type MatchScalarWhereWithAggregatesInput = {
    AND?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    OR?: MatchScalarWhereWithAggregatesInput[]
    NOT?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Match"> | string
    matchNumber?: IntWithAggregatesFilter<"Match"> | number
    group?: StringWithAggregatesFilter<"Match"> | string
    team1Id?: StringWithAggregatesFilter<"Match"> | string
    team2Id?: StringWithAggregatesFilter<"Match"> | string
    kickoffUtc?: DateTimeWithAggregatesFilter<"Match"> | Date | string
    venue?: StringWithAggregatesFilter<"Match"> | string
    city?: StringWithAggregatesFilter<"Match"> | string
    source?: StringWithAggregatesFilter<"Match"> | string
    status?: EnumMatchStatusWithAggregatesFilter<"Match"> | $Enums.MatchStatus
    team1Goals?: IntNullableWithAggregatesFilter<"Match"> | number | null
    team2Goals?: IntNullableWithAggregatesFilter<"Match"> | number | null
    result?: EnumMatchResultNullableWithAggregatesFilter<"Match"> | $Enums.MatchResult | null
    resultUpdatedAt?: DateTimeNullableWithAggregatesFilter<"Match"> | Date | string | null
    resultSource?: StringNullableWithAggregatesFilter<"Match"> | string | null
    autoDetectedTeam1Goals?: IntNullableWithAggregatesFilter<"Match"> | number | null
    autoDetectedTeam2Goals?: IntNullableWithAggregatesFilter<"Match"> | number | null
    autoDetectedResult?: EnumMatchResultNullableWithAggregatesFilter<"Match"> | $Enums.MatchResult | null
    autoDetectedSource?: StringNullableWithAggregatesFilter<"Match"> | string | null
    autoDetectionConfidence?: StringNullableWithAggregatesFilter<"Match"> | string | null
    autoDetectedAt?: DateTimeNullableWithAggregatesFilter<"Match"> | Date | string | null
    autoResultStatus?: StringNullableWithAggregatesFilter<"Match"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Match"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Match"> | Date | string
  }

  export type ParticipantWhereInput = {
    AND?: ParticipantWhereInput | ParticipantWhereInput[]
    OR?: ParticipantWhereInput[]
    NOT?: ParticipantWhereInput | ParticipantWhereInput[]
    id?: StringFilter<"Participant"> | string
    fullName?: StringFilter<"Participant"> | string
    nationalId?: StringFilter<"Participant"> | string
    phone?: StringFilter<"Participant"> | string
    email?: StringNullableFilter<"Participant"> | string | null
    city?: StringNullableFilter<"Participant"> | string | null
    participationCode?: StringFilter<"Participant"> | string
    confirmationHash?: StringNullableFilter<"Participant"> | string | null
    submittedAt?: DateTimeNullableFilter<"Participant"> | Date | string | null
    isComplete?: BoolFilter<"Participant"> | boolean
    createdAt?: DateTimeFilter<"Participant"> | Date | string
    updatedAt?: DateTimeFilter<"Participant"> | Date | string
    predictions?: PredictionListRelationFilter
    payment?: XOR<PaymentNullableScalarRelationFilter, PaymentWhereInput> | null
    ranking?: XOR<RankingSnapshotNullableScalarRelationFilter, RankingSnapshotWhereInput> | null
  }

  export type ParticipantOrderByWithRelationInput = {
    id?: SortOrder
    fullName?: SortOrder
    nationalId?: SortOrder
    phone?: SortOrder
    email?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    participationCode?: SortOrder
    confirmationHash?: SortOrderInput | SortOrder
    submittedAt?: SortOrderInput | SortOrder
    isComplete?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    predictions?: PredictionOrderByRelationAggregateInput
    payment?: PaymentOrderByWithRelationInput
    ranking?: RankingSnapshotOrderByWithRelationInput
  }

  export type ParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    nationalId?: string
    participationCode?: string
    AND?: ParticipantWhereInput | ParticipantWhereInput[]
    OR?: ParticipantWhereInput[]
    NOT?: ParticipantWhereInput | ParticipantWhereInput[]
    fullName?: StringFilter<"Participant"> | string
    phone?: StringFilter<"Participant"> | string
    email?: StringNullableFilter<"Participant"> | string | null
    city?: StringNullableFilter<"Participant"> | string | null
    confirmationHash?: StringNullableFilter<"Participant"> | string | null
    submittedAt?: DateTimeNullableFilter<"Participant"> | Date | string | null
    isComplete?: BoolFilter<"Participant"> | boolean
    createdAt?: DateTimeFilter<"Participant"> | Date | string
    updatedAt?: DateTimeFilter<"Participant"> | Date | string
    predictions?: PredictionListRelationFilter
    payment?: XOR<PaymentNullableScalarRelationFilter, PaymentWhereInput> | null
    ranking?: XOR<RankingSnapshotNullableScalarRelationFilter, RankingSnapshotWhereInput> | null
  }, "id" | "nationalId" | "participationCode">

  export type ParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    fullName?: SortOrder
    nationalId?: SortOrder
    phone?: SortOrder
    email?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    participationCode?: SortOrder
    confirmationHash?: SortOrderInput | SortOrder
    submittedAt?: SortOrderInput | SortOrder
    isComplete?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ParticipantCountOrderByAggregateInput
    _max?: ParticipantMaxOrderByAggregateInput
    _min?: ParticipantMinOrderByAggregateInput
  }

  export type ParticipantScalarWhereWithAggregatesInput = {
    AND?: ParticipantScalarWhereWithAggregatesInput | ParticipantScalarWhereWithAggregatesInput[]
    OR?: ParticipantScalarWhereWithAggregatesInput[]
    NOT?: ParticipantScalarWhereWithAggregatesInput | ParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Participant"> | string
    fullName?: StringWithAggregatesFilter<"Participant"> | string
    nationalId?: StringWithAggregatesFilter<"Participant"> | string
    phone?: StringWithAggregatesFilter<"Participant"> | string
    email?: StringNullableWithAggregatesFilter<"Participant"> | string | null
    city?: StringNullableWithAggregatesFilter<"Participant"> | string | null
    participationCode?: StringWithAggregatesFilter<"Participant"> | string
    confirmationHash?: StringNullableWithAggregatesFilter<"Participant"> | string | null
    submittedAt?: DateTimeNullableWithAggregatesFilter<"Participant"> | Date | string | null
    isComplete?: BoolWithAggregatesFilter<"Participant"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Participant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Participant"> | Date | string
  }

  export type PredictionWhereInput = {
    AND?: PredictionWhereInput | PredictionWhereInput[]
    OR?: PredictionWhereInput[]
    NOT?: PredictionWhereInput | PredictionWhereInput[]
    id?: StringFilter<"Prediction"> | string
    participantId?: StringFilter<"Prediction"> | string
    matchId?: StringFilter<"Prediction"> | string
    predictedTeam1Goals?: IntFilter<"Prediction"> | number
    predictedTeam2Goals?: IntFilter<"Prediction"> | number
    predictedResult?: EnumMatchResultFilter<"Prediction"> | $Enums.MatchResult
    points?: IntFilter<"Prediction"> | number
    isExactScore?: BoolNullableFilter<"Prediction"> | boolean | null
    isCorrectResult?: BoolNullableFilter<"Prediction"> | boolean | null
    goalDifferenceError?: IntNullableFilter<"Prediction"> | number | null
    createdAt?: DateTimeFilter<"Prediction"> | Date | string
    participant?: XOR<ParticipantScalarRelationFilter, ParticipantWhereInput>
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
  }

  export type PredictionOrderByWithRelationInput = {
    id?: SortOrder
    participantId?: SortOrder
    matchId?: SortOrder
    predictedTeam1Goals?: SortOrder
    predictedTeam2Goals?: SortOrder
    predictedResult?: SortOrder
    points?: SortOrder
    isExactScore?: SortOrderInput | SortOrder
    isCorrectResult?: SortOrderInput | SortOrder
    goalDifferenceError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    participant?: ParticipantOrderByWithRelationInput
    match?: MatchOrderByWithRelationInput
  }

  export type PredictionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    participantId_matchId?: PredictionParticipantIdMatchIdCompoundUniqueInput
    AND?: PredictionWhereInput | PredictionWhereInput[]
    OR?: PredictionWhereInput[]
    NOT?: PredictionWhereInput | PredictionWhereInput[]
    participantId?: StringFilter<"Prediction"> | string
    matchId?: StringFilter<"Prediction"> | string
    predictedTeam1Goals?: IntFilter<"Prediction"> | number
    predictedTeam2Goals?: IntFilter<"Prediction"> | number
    predictedResult?: EnumMatchResultFilter<"Prediction"> | $Enums.MatchResult
    points?: IntFilter<"Prediction"> | number
    isExactScore?: BoolNullableFilter<"Prediction"> | boolean | null
    isCorrectResult?: BoolNullableFilter<"Prediction"> | boolean | null
    goalDifferenceError?: IntNullableFilter<"Prediction"> | number | null
    createdAt?: DateTimeFilter<"Prediction"> | Date | string
    participant?: XOR<ParticipantScalarRelationFilter, ParticipantWhereInput>
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
  }, "id" | "participantId_matchId">

  export type PredictionOrderByWithAggregationInput = {
    id?: SortOrder
    participantId?: SortOrder
    matchId?: SortOrder
    predictedTeam1Goals?: SortOrder
    predictedTeam2Goals?: SortOrder
    predictedResult?: SortOrder
    points?: SortOrder
    isExactScore?: SortOrderInput | SortOrder
    isCorrectResult?: SortOrderInput | SortOrder
    goalDifferenceError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PredictionCountOrderByAggregateInput
    _avg?: PredictionAvgOrderByAggregateInput
    _max?: PredictionMaxOrderByAggregateInput
    _min?: PredictionMinOrderByAggregateInput
    _sum?: PredictionSumOrderByAggregateInput
  }

  export type PredictionScalarWhereWithAggregatesInput = {
    AND?: PredictionScalarWhereWithAggregatesInput | PredictionScalarWhereWithAggregatesInput[]
    OR?: PredictionScalarWhereWithAggregatesInput[]
    NOT?: PredictionScalarWhereWithAggregatesInput | PredictionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Prediction"> | string
    participantId?: StringWithAggregatesFilter<"Prediction"> | string
    matchId?: StringWithAggregatesFilter<"Prediction"> | string
    predictedTeam1Goals?: IntWithAggregatesFilter<"Prediction"> | number
    predictedTeam2Goals?: IntWithAggregatesFilter<"Prediction"> | number
    predictedResult?: EnumMatchResultWithAggregatesFilter<"Prediction"> | $Enums.MatchResult
    points?: IntWithAggregatesFilter<"Prediction"> | number
    isExactScore?: BoolNullableWithAggregatesFilter<"Prediction"> | boolean | null
    isCorrectResult?: BoolNullableWithAggregatesFilter<"Prediction"> | boolean | null
    goalDifferenceError?: IntNullableWithAggregatesFilter<"Prediction"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Prediction"> | Date | string
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    participantId?: StringFilter<"Payment"> | string
    amountUsd?: FloatFilter<"Payment"> | number
    exchangeRate?: FloatNullableFilter<"Payment"> | number | null
    exchangeRateDate?: DateTimeNullableFilter<"Payment"> | Date | string | null
    amountVes?: FloatNullableFilter<"Payment"> | number | null
    senderBank?: StringNullableFilter<"Payment"> | string | null
    paymentReference?: StringNullableFilter<"Payment"> | string | null
    paymentDate?: DateTimeNullableFilter<"Payment"> | Date | string | null
    paymentProofPath?: StringNullableFilter<"Payment"> | string | null
    paymentStatus?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    adminNotes?: StringNullableFilter<"Payment"> | string | null
    verifiedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    participant?: XOR<ParticipantScalarRelationFilter, ParticipantWhereInput>
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    participantId?: SortOrder
    amountUsd?: SortOrder
    exchangeRate?: SortOrderInput | SortOrder
    exchangeRateDate?: SortOrderInput | SortOrder
    amountVes?: SortOrderInput | SortOrder
    senderBank?: SortOrderInput | SortOrder
    paymentReference?: SortOrderInput | SortOrder
    paymentDate?: SortOrderInput | SortOrder
    paymentProofPath?: SortOrderInput | SortOrder
    paymentStatus?: SortOrder
    adminNotes?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    rejectedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    participant?: ParticipantOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    participantId?: string
    paymentReference?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    amountUsd?: FloatFilter<"Payment"> | number
    exchangeRate?: FloatNullableFilter<"Payment"> | number | null
    exchangeRateDate?: DateTimeNullableFilter<"Payment"> | Date | string | null
    amountVes?: FloatNullableFilter<"Payment"> | number | null
    senderBank?: StringNullableFilter<"Payment"> | string | null
    paymentDate?: DateTimeNullableFilter<"Payment"> | Date | string | null
    paymentProofPath?: StringNullableFilter<"Payment"> | string | null
    paymentStatus?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    adminNotes?: StringNullableFilter<"Payment"> | string | null
    verifiedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    participant?: XOR<ParticipantScalarRelationFilter, ParticipantWhereInput>
  }, "id" | "participantId" | "paymentReference">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    participantId?: SortOrder
    amountUsd?: SortOrder
    exchangeRate?: SortOrderInput | SortOrder
    exchangeRateDate?: SortOrderInput | SortOrder
    amountVes?: SortOrderInput | SortOrder
    senderBank?: SortOrderInput | SortOrder
    paymentReference?: SortOrderInput | SortOrder
    paymentDate?: SortOrderInput | SortOrder
    paymentProofPath?: SortOrderInput | SortOrder
    paymentStatus?: SortOrder
    adminNotes?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    rejectedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    participantId?: StringWithAggregatesFilter<"Payment"> | string
    amountUsd?: FloatWithAggregatesFilter<"Payment"> | number
    exchangeRate?: FloatNullableWithAggregatesFilter<"Payment"> | number | null
    exchangeRateDate?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
    amountVes?: FloatNullableWithAggregatesFilter<"Payment"> | number | null
    senderBank?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    paymentReference?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    paymentDate?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
    paymentProofPath?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    paymentStatus?: EnumPaymentStatusWithAggregatesFilter<"Payment"> | $Enums.PaymentStatus
    adminNotes?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
    rejectedAt?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
  }

  export type RankingSnapshotWhereInput = {
    AND?: RankingSnapshotWhereInput | RankingSnapshotWhereInput[]
    OR?: RankingSnapshotWhereInput[]
    NOT?: RankingSnapshotWhereInput | RankingSnapshotWhereInput[]
    id?: StringFilter<"RankingSnapshot"> | string
    participantId?: StringFilter<"RankingSnapshot"> | string
    totalPoints?: IntFilter<"RankingSnapshot"> | number
    exactScores?: IntFilter<"RankingSnapshot"> | number
    correctResults?: IntFilter<"RankingSnapshot"> | number
    wrongPredictions?: IntFilter<"RankingSnapshot"> | number
    pendingPredictions?: IntFilter<"RankingSnapshot"> | number
    playedMatches?: IntFilter<"RankingSnapshot"> | number
    totalGoalDiffError?: IntFilter<"RankingSnapshot"> | number
    effectivenessPercent?: FloatFilter<"RankingSnapshot"> | number
    currentPosition?: IntFilter<"RankingSnapshot"> | number
    previousPosition?: IntNullableFilter<"RankingSnapshot"> | number | null
    updatedAt?: DateTimeFilter<"RankingSnapshot"> | Date | string
    participant?: XOR<ParticipantScalarRelationFilter, ParticipantWhereInput>
  }

  export type RankingSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    participantId?: SortOrder
    totalPoints?: SortOrder
    exactScores?: SortOrder
    correctResults?: SortOrder
    wrongPredictions?: SortOrder
    pendingPredictions?: SortOrder
    playedMatches?: SortOrder
    totalGoalDiffError?: SortOrder
    effectivenessPercent?: SortOrder
    currentPosition?: SortOrder
    previousPosition?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    participant?: ParticipantOrderByWithRelationInput
  }

  export type RankingSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    participantId?: string
    AND?: RankingSnapshotWhereInput | RankingSnapshotWhereInput[]
    OR?: RankingSnapshotWhereInput[]
    NOT?: RankingSnapshotWhereInput | RankingSnapshotWhereInput[]
    totalPoints?: IntFilter<"RankingSnapshot"> | number
    exactScores?: IntFilter<"RankingSnapshot"> | number
    correctResults?: IntFilter<"RankingSnapshot"> | number
    wrongPredictions?: IntFilter<"RankingSnapshot"> | number
    pendingPredictions?: IntFilter<"RankingSnapshot"> | number
    playedMatches?: IntFilter<"RankingSnapshot"> | number
    totalGoalDiffError?: IntFilter<"RankingSnapshot"> | number
    effectivenessPercent?: FloatFilter<"RankingSnapshot"> | number
    currentPosition?: IntFilter<"RankingSnapshot"> | number
    previousPosition?: IntNullableFilter<"RankingSnapshot"> | number | null
    updatedAt?: DateTimeFilter<"RankingSnapshot"> | Date | string
    participant?: XOR<ParticipantScalarRelationFilter, ParticipantWhereInput>
  }, "id" | "participantId">

  export type RankingSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    participantId?: SortOrder
    totalPoints?: SortOrder
    exactScores?: SortOrder
    correctResults?: SortOrder
    wrongPredictions?: SortOrder
    pendingPredictions?: SortOrder
    playedMatches?: SortOrder
    totalGoalDiffError?: SortOrder
    effectivenessPercent?: SortOrder
    currentPosition?: SortOrder
    previousPosition?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: RankingSnapshotCountOrderByAggregateInput
    _avg?: RankingSnapshotAvgOrderByAggregateInput
    _max?: RankingSnapshotMaxOrderByAggregateInput
    _min?: RankingSnapshotMinOrderByAggregateInput
    _sum?: RankingSnapshotSumOrderByAggregateInput
  }

  export type RankingSnapshotScalarWhereWithAggregatesInput = {
    AND?: RankingSnapshotScalarWhereWithAggregatesInput | RankingSnapshotScalarWhereWithAggregatesInput[]
    OR?: RankingSnapshotScalarWhereWithAggregatesInput[]
    NOT?: RankingSnapshotScalarWhereWithAggregatesInput | RankingSnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RankingSnapshot"> | string
    participantId?: StringWithAggregatesFilter<"RankingSnapshot"> | string
    totalPoints?: IntWithAggregatesFilter<"RankingSnapshot"> | number
    exactScores?: IntWithAggregatesFilter<"RankingSnapshot"> | number
    correctResults?: IntWithAggregatesFilter<"RankingSnapshot"> | number
    wrongPredictions?: IntWithAggregatesFilter<"RankingSnapshot"> | number
    pendingPredictions?: IntWithAggregatesFilter<"RankingSnapshot"> | number
    playedMatches?: IntWithAggregatesFilter<"RankingSnapshot"> | number
    totalGoalDiffError?: IntWithAggregatesFilter<"RankingSnapshot"> | number
    effectivenessPercent?: FloatWithAggregatesFilter<"RankingSnapshot"> | number
    currentPosition?: IntWithAggregatesFilter<"RankingSnapshot"> | number
    previousPosition?: IntNullableWithAggregatesFilter<"RankingSnapshot"> | number | null
    updatedAt?: DateTimeWithAggregatesFilter<"RankingSnapshot"> | Date | string
  }

  export type LiveResultsLogWhereInput = {
    AND?: LiveResultsLogWhereInput | LiveResultsLogWhereInput[]
    OR?: LiveResultsLogWhereInput[]
    NOT?: LiveResultsLogWhereInput | LiveResultsLogWhereInput[]
    id?: StringFilter<"LiveResultsLog"> | string
    type?: StringFilter<"LiveResultsLog"> | string
    message?: StringFilter<"LiveResultsLog"> | string
    matchId?: StringNullableFilter<"LiveResultsLog"> | string | null
    source?: StringNullableFilter<"LiveResultsLog"> | string | null
    confidence?: StringNullableFilter<"LiveResultsLog"> | string | null
    detectedGoals1?: IntNullableFilter<"LiveResultsLog"> | number | null
    detectedGoals2?: IntNullableFilter<"LiveResultsLog"> | number | null
    adminAction?: StringNullableFilter<"LiveResultsLog"> | string | null
    rawData?: StringNullableFilter<"LiveResultsLog"> | string | null
    createdAt?: DateTimeFilter<"LiveResultsLog"> | Date | string
  }

  export type LiveResultsLogOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    message?: SortOrder
    matchId?: SortOrderInput | SortOrder
    source?: SortOrderInput | SortOrder
    confidence?: SortOrderInput | SortOrder
    detectedGoals1?: SortOrderInput | SortOrder
    detectedGoals2?: SortOrderInput | SortOrder
    adminAction?: SortOrderInput | SortOrder
    rawData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type LiveResultsLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LiveResultsLogWhereInput | LiveResultsLogWhereInput[]
    OR?: LiveResultsLogWhereInput[]
    NOT?: LiveResultsLogWhereInput | LiveResultsLogWhereInput[]
    type?: StringFilter<"LiveResultsLog"> | string
    message?: StringFilter<"LiveResultsLog"> | string
    matchId?: StringNullableFilter<"LiveResultsLog"> | string | null
    source?: StringNullableFilter<"LiveResultsLog"> | string | null
    confidence?: StringNullableFilter<"LiveResultsLog"> | string | null
    detectedGoals1?: IntNullableFilter<"LiveResultsLog"> | number | null
    detectedGoals2?: IntNullableFilter<"LiveResultsLog"> | number | null
    adminAction?: StringNullableFilter<"LiveResultsLog"> | string | null
    rawData?: StringNullableFilter<"LiveResultsLog"> | string | null
    createdAt?: DateTimeFilter<"LiveResultsLog"> | Date | string
  }, "id">

  export type LiveResultsLogOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    message?: SortOrder
    matchId?: SortOrderInput | SortOrder
    source?: SortOrderInput | SortOrder
    confidence?: SortOrderInput | SortOrder
    detectedGoals1?: SortOrderInput | SortOrder
    detectedGoals2?: SortOrderInput | SortOrder
    adminAction?: SortOrderInput | SortOrder
    rawData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LiveResultsLogCountOrderByAggregateInput
    _avg?: LiveResultsLogAvgOrderByAggregateInput
    _max?: LiveResultsLogMaxOrderByAggregateInput
    _min?: LiveResultsLogMinOrderByAggregateInput
    _sum?: LiveResultsLogSumOrderByAggregateInput
  }

  export type LiveResultsLogScalarWhereWithAggregatesInput = {
    AND?: LiveResultsLogScalarWhereWithAggregatesInput | LiveResultsLogScalarWhereWithAggregatesInput[]
    OR?: LiveResultsLogScalarWhereWithAggregatesInput[]
    NOT?: LiveResultsLogScalarWhereWithAggregatesInput | LiveResultsLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LiveResultsLog"> | string
    type?: StringWithAggregatesFilter<"LiveResultsLog"> | string
    message?: StringWithAggregatesFilter<"LiveResultsLog"> | string
    matchId?: StringNullableWithAggregatesFilter<"LiveResultsLog"> | string | null
    source?: StringNullableWithAggregatesFilter<"LiveResultsLog"> | string | null
    confidence?: StringNullableWithAggregatesFilter<"LiveResultsLog"> | string | null
    detectedGoals1?: IntNullableWithAggregatesFilter<"LiveResultsLog"> | number | null
    detectedGoals2?: IntNullableWithAggregatesFilter<"LiveResultsLog"> | number | null
    adminAction?: StringNullableWithAggregatesFilter<"LiveResultsLog"> | string | null
    rawData?: StringNullableWithAggregatesFilter<"LiveResultsLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LiveResultsLog"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringNullableFilter<"AuditLog"> | string | null
    oldValue?: StringNullableFilter<"AuditLog"> | string | null
    newValue?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    oldValue?: SortOrderInput | SortOrder
    newValue?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    userId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringNullableFilter<"AuditLog"> | string | null
    oldValue?: StringNullableFilter<"AuditLog"> | string | null
    newValue?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    oldValue?: SortOrderInput | SortOrder
    newValue?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    userId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    entityType?: StringWithAggregatesFilter<"AuditLog"> | string
    entityId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    oldValue?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    newValue?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type SettingCreateInput = {
    id?: string
    appName?: string
    entryPriceUsd?: number
    paymentPhone?: string
    paymentNationalId?: string
    paymentBank?: string
    exchangeRateCurrency?: string
    manualExchangeRate?: number | null
    manualExchangeRateDate?: Date | string | null
    firstPrizePercent?: number
    secondPrizePercent?: number
    organizationPercent?: number
    deadline?: Date | string | null
    rankingVisible?: boolean
    showOnlyPaidParticipants?: boolean
    allowPublicPredictionViewAfterDeadline?: boolean
    tiebreakerRules?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SettingUncheckedCreateInput = {
    id?: string
    appName?: string
    entryPriceUsd?: number
    paymentPhone?: string
    paymentNationalId?: string
    paymentBank?: string
    exchangeRateCurrency?: string
    manualExchangeRate?: number | null
    manualExchangeRateDate?: Date | string | null
    firstPrizePercent?: number
    secondPrizePercent?: number
    organizationPercent?: number
    deadline?: Date | string | null
    rankingVisible?: boolean
    showOnlyPaidParticipants?: boolean
    allowPublicPredictionViewAfterDeadline?: boolean
    tiebreakerRules?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SettingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    appName?: StringFieldUpdateOperationsInput | string
    entryPriceUsd?: FloatFieldUpdateOperationsInput | number
    paymentPhone?: StringFieldUpdateOperationsInput | string
    paymentNationalId?: StringFieldUpdateOperationsInput | string
    paymentBank?: StringFieldUpdateOperationsInput | string
    exchangeRateCurrency?: StringFieldUpdateOperationsInput | string
    manualExchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    manualExchangeRateDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstPrizePercent?: FloatFieldUpdateOperationsInput | number
    secondPrizePercent?: FloatFieldUpdateOperationsInput | number
    organizationPercent?: FloatFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rankingVisible?: BoolFieldUpdateOperationsInput | boolean
    showOnlyPaidParticipants?: BoolFieldUpdateOperationsInput | boolean
    allowPublicPredictionViewAfterDeadline?: BoolFieldUpdateOperationsInput | boolean
    tiebreakerRules?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    appName?: StringFieldUpdateOperationsInput | string
    entryPriceUsd?: FloatFieldUpdateOperationsInput | number
    paymentPhone?: StringFieldUpdateOperationsInput | string
    paymentNationalId?: StringFieldUpdateOperationsInput | string
    paymentBank?: StringFieldUpdateOperationsInput | string
    exchangeRateCurrency?: StringFieldUpdateOperationsInput | string
    manualExchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    manualExchangeRateDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstPrizePercent?: FloatFieldUpdateOperationsInput | number
    secondPrizePercent?: FloatFieldUpdateOperationsInput | number
    organizationPercent?: FloatFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rankingVisible?: BoolFieldUpdateOperationsInput | boolean
    showOnlyPaidParticipants?: BoolFieldUpdateOperationsInput | boolean
    allowPublicPredictionViewAfterDeadline?: BoolFieldUpdateOperationsInput | boolean
    tiebreakerRules?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingCreateManyInput = {
    id?: string
    appName?: string
    entryPriceUsd?: number
    paymentPhone?: string
    paymentNationalId?: string
    paymentBank?: string
    exchangeRateCurrency?: string
    manualExchangeRate?: number | null
    manualExchangeRateDate?: Date | string | null
    firstPrizePercent?: number
    secondPrizePercent?: number
    organizationPercent?: number
    deadline?: Date | string | null
    rankingVisible?: boolean
    showOnlyPaidParticipants?: boolean
    allowPublicPredictionViewAfterDeadline?: boolean
    tiebreakerRules?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SettingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    appName?: StringFieldUpdateOperationsInput | string
    entryPriceUsd?: FloatFieldUpdateOperationsInput | number
    paymentPhone?: StringFieldUpdateOperationsInput | string
    paymentNationalId?: StringFieldUpdateOperationsInput | string
    paymentBank?: StringFieldUpdateOperationsInput | string
    exchangeRateCurrency?: StringFieldUpdateOperationsInput | string
    manualExchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    manualExchangeRateDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstPrizePercent?: FloatFieldUpdateOperationsInput | number
    secondPrizePercent?: FloatFieldUpdateOperationsInput | number
    organizationPercent?: FloatFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rankingVisible?: BoolFieldUpdateOperationsInput | boolean
    showOnlyPaidParticipants?: BoolFieldUpdateOperationsInput | boolean
    allowPublicPredictionViewAfterDeadline?: BoolFieldUpdateOperationsInput | boolean
    tiebreakerRules?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    appName?: StringFieldUpdateOperationsInput | string
    entryPriceUsd?: FloatFieldUpdateOperationsInput | number
    paymentPhone?: StringFieldUpdateOperationsInput | string
    paymentNationalId?: StringFieldUpdateOperationsInput | string
    paymentBank?: StringFieldUpdateOperationsInput | string
    exchangeRateCurrency?: StringFieldUpdateOperationsInput | string
    manualExchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    manualExchangeRateDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstPrizePercent?: FloatFieldUpdateOperationsInput | number
    secondPrizePercent?: FloatFieldUpdateOperationsInput | number
    organizationPercent?: FloatFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rankingVisible?: BoolFieldUpdateOperationsInput | boolean
    showOnlyPaidParticipants?: BoolFieldUpdateOperationsInput | boolean
    allowPublicPredictionViewAfterDeadline?: BoolFieldUpdateOperationsInput | boolean
    tiebreakerRules?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamCreateInput = {
    id?: string
    officialName: string
    displayName: string
    shortName: string
    fifaCode: string
    isoCode: string
    flagEmoji?: string
    group: string
    aliases?: string
    createdAt?: Date | string
    matchesAsTeam1?: MatchCreateNestedManyWithoutTeam1Input
    matchesAsTeam2?: MatchCreateNestedManyWithoutTeam2Input
  }

  export type TeamUncheckedCreateInput = {
    id?: string
    officialName: string
    displayName: string
    shortName: string
    fifaCode: string
    isoCode: string
    flagEmoji?: string
    group: string
    aliases?: string
    createdAt?: Date | string
    matchesAsTeam1?: MatchUncheckedCreateNestedManyWithoutTeam1Input
    matchesAsTeam2?: MatchUncheckedCreateNestedManyWithoutTeam2Input
  }

  export type TeamUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    officialName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    fifaCode?: StringFieldUpdateOperationsInput | string
    isoCode?: StringFieldUpdateOperationsInput | string
    flagEmoji?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    aliases?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matchesAsTeam1?: MatchUpdateManyWithoutTeam1NestedInput
    matchesAsTeam2?: MatchUpdateManyWithoutTeam2NestedInput
  }

  export type TeamUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    officialName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    fifaCode?: StringFieldUpdateOperationsInput | string
    isoCode?: StringFieldUpdateOperationsInput | string
    flagEmoji?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    aliases?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matchesAsTeam1?: MatchUncheckedUpdateManyWithoutTeam1NestedInput
    matchesAsTeam2?: MatchUncheckedUpdateManyWithoutTeam2NestedInput
  }

  export type TeamCreateManyInput = {
    id?: string
    officialName: string
    displayName: string
    shortName: string
    fifaCode: string
    isoCode: string
    flagEmoji?: string
    group: string
    aliases?: string
    createdAt?: Date | string
  }

  export type TeamUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    officialName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    fifaCode?: StringFieldUpdateOperationsInput | string
    isoCode?: StringFieldUpdateOperationsInput | string
    flagEmoji?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    aliases?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    officialName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    fifaCode?: StringFieldUpdateOperationsInput | string
    isoCode?: StringFieldUpdateOperationsInput | string
    flagEmoji?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    aliases?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchCreateInput = {
    id?: string
    matchNumber: number
    group: string
    kickoffUtc: Date | string
    venue?: string
    city?: string
    source?: string
    status?: $Enums.MatchStatus
    team1Goals?: number | null
    team2Goals?: number | null
    result?: $Enums.MatchResult | null
    resultUpdatedAt?: Date | string | null
    resultSource?: string | null
    autoDetectedTeam1Goals?: number | null
    autoDetectedTeam2Goals?: number | null
    autoDetectedResult?: $Enums.MatchResult | null
    autoDetectedSource?: string | null
    autoDetectionConfidence?: string | null
    autoDetectedAt?: Date | string | null
    autoResultStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    team1: TeamCreateNestedOneWithoutMatchesAsTeam1Input
    team2: TeamCreateNestedOneWithoutMatchesAsTeam2Input
    predictions?: PredictionCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateInput = {
    id?: string
    matchNumber: number
    group: string
    team1Id: string
    team2Id: string
    kickoffUtc: Date | string
    venue?: string
    city?: string
    source?: string
    status?: $Enums.MatchStatus
    team1Goals?: number | null
    team2Goals?: number | null
    result?: $Enums.MatchResult | null
    resultUpdatedAt?: Date | string | null
    resultSource?: string | null
    autoDetectedTeam1Goals?: number | null
    autoDetectedTeam2Goals?: number | null
    autoDetectedResult?: $Enums.MatchResult | null
    autoDetectedSource?: string | null
    autoDetectionConfidence?: string | null
    autoDetectedAt?: Date | string | null
    autoResultStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    predictions?: PredictionUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchNumber?: IntFieldUpdateOperationsInput | number
    group?: StringFieldUpdateOperationsInput | string
    kickoffUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    team1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    team2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    result?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    resultUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resultSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedTeam1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedTeam2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedResult?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    autoDetectedSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectionConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoResultStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team1?: TeamUpdateOneRequiredWithoutMatchesAsTeam1NestedInput
    team2?: TeamUpdateOneRequiredWithoutMatchesAsTeam2NestedInput
    predictions?: PredictionUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchNumber?: IntFieldUpdateOperationsInput | number
    group?: StringFieldUpdateOperationsInput | string
    team1Id?: StringFieldUpdateOperationsInput | string
    team2Id?: StringFieldUpdateOperationsInput | string
    kickoffUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    team1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    team2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    result?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    resultUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resultSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedTeam1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedTeam2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedResult?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    autoDetectedSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectionConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoResultStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    predictions?: PredictionUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchCreateManyInput = {
    id?: string
    matchNumber: number
    group: string
    team1Id: string
    team2Id: string
    kickoffUtc: Date | string
    venue?: string
    city?: string
    source?: string
    status?: $Enums.MatchStatus
    team1Goals?: number | null
    team2Goals?: number | null
    result?: $Enums.MatchResult | null
    resultUpdatedAt?: Date | string | null
    resultSource?: string | null
    autoDetectedTeam1Goals?: number | null
    autoDetectedTeam2Goals?: number | null
    autoDetectedResult?: $Enums.MatchResult | null
    autoDetectedSource?: string | null
    autoDetectionConfidence?: string | null
    autoDetectedAt?: Date | string | null
    autoResultStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchNumber?: IntFieldUpdateOperationsInput | number
    group?: StringFieldUpdateOperationsInput | string
    kickoffUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    team1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    team2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    result?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    resultUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resultSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedTeam1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedTeam2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedResult?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    autoDetectedSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectionConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoResultStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchNumber?: IntFieldUpdateOperationsInput | number
    group?: StringFieldUpdateOperationsInput | string
    team1Id?: StringFieldUpdateOperationsInput | string
    team2Id?: StringFieldUpdateOperationsInput | string
    kickoffUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    team1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    team2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    result?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    resultUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resultSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedTeam1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedTeam2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedResult?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    autoDetectedSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectionConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoResultStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantCreateInput = {
    id?: string
    fullName: string
    nationalId: string
    phone: string
    email?: string | null
    city?: string | null
    participationCode: string
    confirmationHash?: string | null
    submittedAt?: Date | string | null
    isComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    predictions?: PredictionCreateNestedManyWithoutParticipantInput
    payment?: PaymentCreateNestedOneWithoutParticipantInput
    ranking?: RankingSnapshotCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateInput = {
    id?: string
    fullName: string
    nationalId: string
    phone: string
    email?: string | null
    city?: string | null
    participationCode: string
    confirmationHash?: string | null
    submittedAt?: Date | string | null
    isComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    predictions?: PredictionUncheckedCreateNestedManyWithoutParticipantInput
    payment?: PaymentUncheckedCreateNestedOneWithoutParticipantInput
    ranking?: RankingSnapshotUncheckedCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    nationalId?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    participationCode?: StringFieldUpdateOperationsInput | string
    confirmationHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    predictions?: PredictionUpdateManyWithoutParticipantNestedInput
    payment?: PaymentUpdateOneWithoutParticipantNestedInput
    ranking?: RankingSnapshotUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    nationalId?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    participationCode?: StringFieldUpdateOperationsInput | string
    confirmationHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    predictions?: PredictionUncheckedUpdateManyWithoutParticipantNestedInput
    payment?: PaymentUncheckedUpdateOneWithoutParticipantNestedInput
    ranking?: RankingSnapshotUncheckedUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantCreateManyInput = {
    id?: string
    fullName: string
    nationalId: string
    phone: string
    email?: string | null
    city?: string | null
    participationCode: string
    confirmationHash?: string | null
    submittedAt?: Date | string | null
    isComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    nationalId?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    participationCode?: StringFieldUpdateOperationsInput | string
    confirmationHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    nationalId?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    participationCode?: StringFieldUpdateOperationsInput | string
    confirmationHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictionCreateInput = {
    id?: string
    predictedTeam1Goals: number
    predictedTeam2Goals: number
    predictedResult: $Enums.MatchResult
    points?: number
    isExactScore?: boolean | null
    isCorrectResult?: boolean | null
    goalDifferenceError?: number | null
    createdAt?: Date | string
    participant: ParticipantCreateNestedOneWithoutPredictionsInput
    match: MatchCreateNestedOneWithoutPredictionsInput
  }

  export type PredictionUncheckedCreateInput = {
    id?: string
    participantId: string
    matchId: string
    predictedTeam1Goals: number
    predictedTeam2Goals: number
    predictedResult: $Enums.MatchResult
    points?: number
    isExactScore?: boolean | null
    isCorrectResult?: boolean | null
    goalDifferenceError?: number | null
    createdAt?: Date | string
  }

  export type PredictionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    predictedTeam1Goals?: IntFieldUpdateOperationsInput | number
    predictedTeam2Goals?: IntFieldUpdateOperationsInput | number
    predictedResult?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    points?: IntFieldUpdateOperationsInput | number
    isExactScore?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isCorrectResult?: NullableBoolFieldUpdateOperationsInput | boolean | null
    goalDifferenceError?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participant?: ParticipantUpdateOneRequiredWithoutPredictionsNestedInput
    match?: MatchUpdateOneRequiredWithoutPredictionsNestedInput
  }

  export type PredictionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    predictedTeam1Goals?: IntFieldUpdateOperationsInput | number
    predictedTeam2Goals?: IntFieldUpdateOperationsInput | number
    predictedResult?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    points?: IntFieldUpdateOperationsInput | number
    isExactScore?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isCorrectResult?: NullableBoolFieldUpdateOperationsInput | boolean | null
    goalDifferenceError?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictionCreateManyInput = {
    id?: string
    participantId: string
    matchId: string
    predictedTeam1Goals: number
    predictedTeam2Goals: number
    predictedResult: $Enums.MatchResult
    points?: number
    isExactScore?: boolean | null
    isCorrectResult?: boolean | null
    goalDifferenceError?: number | null
    createdAt?: Date | string
  }

  export type PredictionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    predictedTeam1Goals?: IntFieldUpdateOperationsInput | number
    predictedTeam2Goals?: IntFieldUpdateOperationsInput | number
    predictedResult?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    points?: IntFieldUpdateOperationsInput | number
    isExactScore?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isCorrectResult?: NullableBoolFieldUpdateOperationsInput | boolean | null
    goalDifferenceError?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    predictedTeam1Goals?: IntFieldUpdateOperationsInput | number
    predictedTeam2Goals?: IntFieldUpdateOperationsInput | number
    predictedResult?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    points?: IntFieldUpdateOperationsInput | number
    isExactScore?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isCorrectResult?: NullableBoolFieldUpdateOperationsInput | boolean | null
    goalDifferenceError?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateInput = {
    id?: string
    amountUsd?: number
    exchangeRate?: number | null
    exchangeRateDate?: Date | string | null
    amountVes?: number | null
    senderBank?: string | null
    paymentReference?: string | null
    paymentDate?: Date | string | null
    paymentProofPath?: string | null
    paymentStatus?: $Enums.PaymentStatus
    adminNotes?: string | null
    verifiedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participant: ParticipantCreateNestedOneWithoutPaymentInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    participantId: string
    amountUsd?: number
    exchangeRate?: number | null
    exchangeRateDate?: Date | string | null
    amountVes?: number | null
    senderBank?: string | null
    paymentReference?: string | null
    paymentDate?: Date | string | null
    paymentProofPath?: string | null
    paymentStatus?: $Enums.PaymentStatus
    adminNotes?: string | null
    verifiedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amountUsd?: FloatFieldUpdateOperationsInput | number
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    exchangeRateDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amountVes?: NullableFloatFieldUpdateOperationsInput | number | null
    senderBank?: NullableStringFieldUpdateOperationsInput | string | null
    paymentReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProofPath?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participant?: ParticipantUpdateOneRequiredWithoutPaymentNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    amountUsd?: FloatFieldUpdateOperationsInput | number
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    exchangeRateDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amountVes?: NullableFloatFieldUpdateOperationsInput | number | null
    senderBank?: NullableStringFieldUpdateOperationsInput | string | null
    paymentReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProofPath?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateManyInput = {
    id?: string
    participantId: string
    amountUsd?: number
    exchangeRate?: number | null
    exchangeRateDate?: Date | string | null
    amountVes?: number | null
    senderBank?: string | null
    paymentReference?: string | null
    paymentDate?: Date | string | null
    paymentProofPath?: string | null
    paymentStatus?: $Enums.PaymentStatus
    adminNotes?: string | null
    verifiedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amountUsd?: FloatFieldUpdateOperationsInput | number
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    exchangeRateDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amountVes?: NullableFloatFieldUpdateOperationsInput | number | null
    senderBank?: NullableStringFieldUpdateOperationsInput | string | null
    paymentReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProofPath?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    amountUsd?: FloatFieldUpdateOperationsInput | number
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    exchangeRateDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amountVes?: NullableFloatFieldUpdateOperationsInput | number | null
    senderBank?: NullableStringFieldUpdateOperationsInput | string | null
    paymentReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProofPath?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RankingSnapshotCreateInput = {
    id?: string
    totalPoints?: number
    exactScores?: number
    correctResults?: number
    wrongPredictions?: number
    pendingPredictions?: number
    playedMatches?: number
    totalGoalDiffError?: number
    effectivenessPercent?: number
    currentPosition?: number
    previousPosition?: number | null
    updatedAt?: Date | string
    participant: ParticipantCreateNestedOneWithoutRankingInput
  }

  export type RankingSnapshotUncheckedCreateInput = {
    id?: string
    participantId: string
    totalPoints?: number
    exactScores?: number
    correctResults?: number
    wrongPredictions?: number
    pendingPredictions?: number
    playedMatches?: number
    totalGoalDiffError?: number
    effectivenessPercent?: number
    currentPosition?: number
    previousPosition?: number | null
    updatedAt?: Date | string
  }

  export type RankingSnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalPoints?: IntFieldUpdateOperationsInput | number
    exactScores?: IntFieldUpdateOperationsInput | number
    correctResults?: IntFieldUpdateOperationsInput | number
    wrongPredictions?: IntFieldUpdateOperationsInput | number
    pendingPredictions?: IntFieldUpdateOperationsInput | number
    playedMatches?: IntFieldUpdateOperationsInput | number
    totalGoalDiffError?: IntFieldUpdateOperationsInput | number
    effectivenessPercent?: FloatFieldUpdateOperationsInput | number
    currentPosition?: IntFieldUpdateOperationsInput | number
    previousPosition?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participant?: ParticipantUpdateOneRequiredWithoutRankingNestedInput
  }

  export type RankingSnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    totalPoints?: IntFieldUpdateOperationsInput | number
    exactScores?: IntFieldUpdateOperationsInput | number
    correctResults?: IntFieldUpdateOperationsInput | number
    wrongPredictions?: IntFieldUpdateOperationsInput | number
    pendingPredictions?: IntFieldUpdateOperationsInput | number
    playedMatches?: IntFieldUpdateOperationsInput | number
    totalGoalDiffError?: IntFieldUpdateOperationsInput | number
    effectivenessPercent?: FloatFieldUpdateOperationsInput | number
    currentPosition?: IntFieldUpdateOperationsInput | number
    previousPosition?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RankingSnapshotCreateManyInput = {
    id?: string
    participantId: string
    totalPoints?: number
    exactScores?: number
    correctResults?: number
    wrongPredictions?: number
    pendingPredictions?: number
    playedMatches?: number
    totalGoalDiffError?: number
    effectivenessPercent?: number
    currentPosition?: number
    previousPosition?: number | null
    updatedAt?: Date | string
  }

  export type RankingSnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalPoints?: IntFieldUpdateOperationsInput | number
    exactScores?: IntFieldUpdateOperationsInput | number
    correctResults?: IntFieldUpdateOperationsInput | number
    wrongPredictions?: IntFieldUpdateOperationsInput | number
    pendingPredictions?: IntFieldUpdateOperationsInput | number
    playedMatches?: IntFieldUpdateOperationsInput | number
    totalGoalDiffError?: IntFieldUpdateOperationsInput | number
    effectivenessPercent?: FloatFieldUpdateOperationsInput | number
    currentPosition?: IntFieldUpdateOperationsInput | number
    previousPosition?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RankingSnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    totalPoints?: IntFieldUpdateOperationsInput | number
    exactScores?: IntFieldUpdateOperationsInput | number
    correctResults?: IntFieldUpdateOperationsInput | number
    wrongPredictions?: IntFieldUpdateOperationsInput | number
    pendingPredictions?: IntFieldUpdateOperationsInput | number
    playedMatches?: IntFieldUpdateOperationsInput | number
    totalGoalDiffError?: IntFieldUpdateOperationsInput | number
    effectivenessPercent?: FloatFieldUpdateOperationsInput | number
    currentPosition?: IntFieldUpdateOperationsInput | number
    previousPosition?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LiveResultsLogCreateInput = {
    id?: string
    type: string
    message: string
    matchId?: string | null
    source?: string | null
    confidence?: string | null
    detectedGoals1?: number | null
    detectedGoals2?: number | null
    adminAction?: string | null
    rawData?: string | null
    createdAt?: Date | string
  }

  export type LiveResultsLogUncheckedCreateInput = {
    id?: string
    type: string
    message: string
    matchId?: string | null
    source?: string | null
    confidence?: string | null
    detectedGoals1?: number | null
    detectedGoals2?: number | null
    adminAction?: string | null
    rawData?: string | null
    createdAt?: Date | string
  }

  export type LiveResultsLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableStringFieldUpdateOperationsInput | string | null
    detectedGoals1?: NullableIntFieldUpdateOperationsInput | number | null
    detectedGoals2?: NullableIntFieldUpdateOperationsInput | number | null
    adminAction?: NullableStringFieldUpdateOperationsInput | string | null
    rawData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LiveResultsLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableStringFieldUpdateOperationsInput | string | null
    detectedGoals1?: NullableIntFieldUpdateOperationsInput | number | null
    detectedGoals2?: NullableIntFieldUpdateOperationsInput | number | null
    adminAction?: NullableStringFieldUpdateOperationsInput | string | null
    rawData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LiveResultsLogCreateManyInput = {
    id?: string
    type: string
    message: string
    matchId?: string | null
    source?: string | null
    confidence?: string | null
    detectedGoals1?: number | null
    detectedGoals2?: number | null
    adminAction?: string | null
    rawData?: string | null
    createdAt?: Date | string
  }

  export type LiveResultsLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableStringFieldUpdateOperationsInput | string | null
    detectedGoals1?: NullableIntFieldUpdateOperationsInput | number | null
    detectedGoals2?: NullableIntFieldUpdateOperationsInput | number | null
    adminAction?: NullableStringFieldUpdateOperationsInput | string | null
    rawData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LiveResultsLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableStringFieldUpdateOperationsInput | string | null
    detectedGoals1?: NullableIntFieldUpdateOperationsInput | number | null
    detectedGoals2?: NullableIntFieldUpdateOperationsInput | number | null
    adminAction?: NullableStringFieldUpdateOperationsInput | string | null
    rawData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    userId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    oldValue?: string | null
    newValue?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    userId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    oldValue?: string | null
    newValue?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    userId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    oldValue?: string | null
    newValue?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SettingCountOrderByAggregateInput = {
    id?: SortOrder
    appName?: SortOrder
    entryPriceUsd?: SortOrder
    paymentPhone?: SortOrder
    paymentNationalId?: SortOrder
    paymentBank?: SortOrder
    exchangeRateCurrency?: SortOrder
    manualExchangeRate?: SortOrder
    manualExchangeRateDate?: SortOrder
    firstPrizePercent?: SortOrder
    secondPrizePercent?: SortOrder
    organizationPercent?: SortOrder
    deadline?: SortOrder
    rankingVisible?: SortOrder
    showOnlyPaidParticipants?: SortOrder
    allowPublicPredictionViewAfterDeadline?: SortOrder
    tiebreakerRules?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettingAvgOrderByAggregateInput = {
    entryPriceUsd?: SortOrder
    manualExchangeRate?: SortOrder
    firstPrizePercent?: SortOrder
    secondPrizePercent?: SortOrder
    organizationPercent?: SortOrder
  }

  export type SettingMaxOrderByAggregateInput = {
    id?: SortOrder
    appName?: SortOrder
    entryPriceUsd?: SortOrder
    paymentPhone?: SortOrder
    paymentNationalId?: SortOrder
    paymentBank?: SortOrder
    exchangeRateCurrency?: SortOrder
    manualExchangeRate?: SortOrder
    manualExchangeRateDate?: SortOrder
    firstPrizePercent?: SortOrder
    secondPrizePercent?: SortOrder
    organizationPercent?: SortOrder
    deadline?: SortOrder
    rankingVisible?: SortOrder
    showOnlyPaidParticipants?: SortOrder
    allowPublicPredictionViewAfterDeadline?: SortOrder
    tiebreakerRules?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettingMinOrderByAggregateInput = {
    id?: SortOrder
    appName?: SortOrder
    entryPriceUsd?: SortOrder
    paymentPhone?: SortOrder
    paymentNationalId?: SortOrder
    paymentBank?: SortOrder
    exchangeRateCurrency?: SortOrder
    manualExchangeRate?: SortOrder
    manualExchangeRateDate?: SortOrder
    firstPrizePercent?: SortOrder
    secondPrizePercent?: SortOrder
    organizationPercent?: SortOrder
    deadline?: SortOrder
    rankingVisible?: SortOrder
    showOnlyPaidParticipants?: SortOrder
    allowPublicPredictionViewAfterDeadline?: SortOrder
    tiebreakerRules?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettingSumOrderByAggregateInput = {
    entryPriceUsd?: SortOrder
    manualExchangeRate?: SortOrder
    firstPrizePercent?: SortOrder
    secondPrizePercent?: SortOrder
    organizationPercent?: SortOrder
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
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type MatchListRelationFilter = {
    every?: MatchWhereInput
    some?: MatchWhereInput
    none?: MatchWhereInput
  }

  export type MatchOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TeamCountOrderByAggregateInput = {
    id?: SortOrder
    officialName?: SortOrder
    displayName?: SortOrder
    shortName?: SortOrder
    fifaCode?: SortOrder
    isoCode?: SortOrder
    flagEmoji?: SortOrder
    group?: SortOrder
    aliases?: SortOrder
    createdAt?: SortOrder
  }

  export type TeamMaxOrderByAggregateInput = {
    id?: SortOrder
    officialName?: SortOrder
    displayName?: SortOrder
    shortName?: SortOrder
    fifaCode?: SortOrder
    isoCode?: SortOrder
    flagEmoji?: SortOrder
    group?: SortOrder
    aliases?: SortOrder
    createdAt?: SortOrder
  }

  export type TeamMinOrderByAggregateInput = {
    id?: SortOrder
    officialName?: SortOrder
    displayName?: SortOrder
    shortName?: SortOrder
    fifaCode?: SortOrder
    isoCode?: SortOrder
    flagEmoji?: SortOrder
    group?: SortOrder
    aliases?: SortOrder
    createdAt?: SortOrder
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

  export type EnumMatchStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchStatus | EnumMatchStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchStatusFilter<$PrismaModel> | $Enums.MatchStatus
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

  export type EnumMatchResultNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResult | EnumMatchResultFieldRefInput<$PrismaModel> | null
    in?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMatchResultNullableFilter<$PrismaModel> | $Enums.MatchResult | null
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
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type TeamScalarRelationFilter = {
    is?: TeamWhereInput
    isNot?: TeamWhereInput
  }

  export type PredictionListRelationFilter = {
    every?: PredictionWhereInput
    some?: PredictionWhereInput
    none?: PredictionWhereInput
  }

  export type PredictionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MatchCountOrderByAggregateInput = {
    id?: SortOrder
    matchNumber?: SortOrder
    group?: SortOrder
    team1Id?: SortOrder
    team2Id?: SortOrder
    kickoffUtc?: SortOrder
    venue?: SortOrder
    city?: SortOrder
    source?: SortOrder
    status?: SortOrder
    team1Goals?: SortOrder
    team2Goals?: SortOrder
    result?: SortOrder
    resultUpdatedAt?: SortOrder
    resultSource?: SortOrder
    autoDetectedTeam1Goals?: SortOrder
    autoDetectedTeam2Goals?: SortOrder
    autoDetectedResult?: SortOrder
    autoDetectedSource?: SortOrder
    autoDetectionConfidence?: SortOrder
    autoDetectedAt?: SortOrder
    autoResultStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MatchAvgOrderByAggregateInput = {
    matchNumber?: SortOrder
    team1Goals?: SortOrder
    team2Goals?: SortOrder
    autoDetectedTeam1Goals?: SortOrder
    autoDetectedTeam2Goals?: SortOrder
  }

  export type MatchMaxOrderByAggregateInput = {
    id?: SortOrder
    matchNumber?: SortOrder
    group?: SortOrder
    team1Id?: SortOrder
    team2Id?: SortOrder
    kickoffUtc?: SortOrder
    venue?: SortOrder
    city?: SortOrder
    source?: SortOrder
    status?: SortOrder
    team1Goals?: SortOrder
    team2Goals?: SortOrder
    result?: SortOrder
    resultUpdatedAt?: SortOrder
    resultSource?: SortOrder
    autoDetectedTeam1Goals?: SortOrder
    autoDetectedTeam2Goals?: SortOrder
    autoDetectedResult?: SortOrder
    autoDetectedSource?: SortOrder
    autoDetectionConfidence?: SortOrder
    autoDetectedAt?: SortOrder
    autoResultStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MatchMinOrderByAggregateInput = {
    id?: SortOrder
    matchNumber?: SortOrder
    group?: SortOrder
    team1Id?: SortOrder
    team2Id?: SortOrder
    kickoffUtc?: SortOrder
    venue?: SortOrder
    city?: SortOrder
    source?: SortOrder
    status?: SortOrder
    team1Goals?: SortOrder
    team2Goals?: SortOrder
    result?: SortOrder
    resultUpdatedAt?: SortOrder
    resultSource?: SortOrder
    autoDetectedTeam1Goals?: SortOrder
    autoDetectedTeam2Goals?: SortOrder
    autoDetectedResult?: SortOrder
    autoDetectedSource?: SortOrder
    autoDetectionConfidence?: SortOrder
    autoDetectedAt?: SortOrder
    autoResultStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MatchSumOrderByAggregateInput = {
    matchNumber?: SortOrder
    team1Goals?: SortOrder
    team2Goals?: SortOrder
    autoDetectedTeam1Goals?: SortOrder
    autoDetectedTeam2Goals?: SortOrder
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

  export type EnumMatchStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchStatus | EnumMatchStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchStatusWithAggregatesFilter<$PrismaModel> | $Enums.MatchStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMatchStatusFilter<$PrismaModel>
    _max?: NestedEnumMatchStatusFilter<$PrismaModel>
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

  export type EnumMatchResultNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResult | EnumMatchResultFieldRefInput<$PrismaModel> | null
    in?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMatchResultNullableWithAggregatesFilter<$PrismaModel> | $Enums.MatchResult | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMatchResultNullableFilter<$PrismaModel>
    _max?: NestedEnumMatchResultNullableFilter<$PrismaModel>
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
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type PaymentNullableScalarRelationFilter = {
    is?: PaymentWhereInput | null
    isNot?: PaymentWhereInput | null
  }

  export type RankingSnapshotNullableScalarRelationFilter = {
    is?: RankingSnapshotWhereInput | null
    isNot?: RankingSnapshotWhereInput | null
  }

  export type ParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    nationalId?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    city?: SortOrder
    participationCode?: SortOrder
    confirmationHash?: SortOrder
    submittedAt?: SortOrder
    isComplete?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    nationalId?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    city?: SortOrder
    participationCode?: SortOrder
    confirmationHash?: SortOrder
    submittedAt?: SortOrder
    isComplete?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    nationalId?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    city?: SortOrder
    participationCode?: SortOrder
    confirmationHash?: SortOrder
    submittedAt?: SortOrder
    isComplete?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumMatchResultFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResult | EnumMatchResultFieldRefInput<$PrismaModel>
    in?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchResultFilter<$PrismaModel> | $Enums.MatchResult
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type ParticipantScalarRelationFilter = {
    is?: ParticipantWhereInput
    isNot?: ParticipantWhereInput
  }

  export type MatchScalarRelationFilter = {
    is?: MatchWhereInput
    isNot?: MatchWhereInput
  }

  export type PredictionParticipantIdMatchIdCompoundUniqueInput = {
    participantId: string
    matchId: string
  }

  export type PredictionCountOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    matchId?: SortOrder
    predictedTeam1Goals?: SortOrder
    predictedTeam2Goals?: SortOrder
    predictedResult?: SortOrder
    points?: SortOrder
    isExactScore?: SortOrder
    isCorrectResult?: SortOrder
    goalDifferenceError?: SortOrder
    createdAt?: SortOrder
  }

  export type PredictionAvgOrderByAggregateInput = {
    predictedTeam1Goals?: SortOrder
    predictedTeam2Goals?: SortOrder
    points?: SortOrder
    goalDifferenceError?: SortOrder
  }

  export type PredictionMaxOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    matchId?: SortOrder
    predictedTeam1Goals?: SortOrder
    predictedTeam2Goals?: SortOrder
    predictedResult?: SortOrder
    points?: SortOrder
    isExactScore?: SortOrder
    isCorrectResult?: SortOrder
    goalDifferenceError?: SortOrder
    createdAt?: SortOrder
  }

  export type PredictionMinOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    matchId?: SortOrder
    predictedTeam1Goals?: SortOrder
    predictedTeam2Goals?: SortOrder
    predictedResult?: SortOrder
    points?: SortOrder
    isExactScore?: SortOrder
    isCorrectResult?: SortOrder
    goalDifferenceError?: SortOrder
    createdAt?: SortOrder
  }

  export type PredictionSumOrderByAggregateInput = {
    predictedTeam1Goals?: SortOrder
    predictedTeam2Goals?: SortOrder
    points?: SortOrder
    goalDifferenceError?: SortOrder
  }

  export type EnumMatchResultWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResult | EnumMatchResultFieldRefInput<$PrismaModel>
    in?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchResultWithAggregatesFilter<$PrismaModel> | $Enums.MatchResult
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMatchResultFilter<$PrismaModel>
    _max?: NestedEnumMatchResultFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    amountUsd?: SortOrder
    exchangeRate?: SortOrder
    exchangeRateDate?: SortOrder
    amountVes?: SortOrder
    senderBank?: SortOrder
    paymentReference?: SortOrder
    paymentDate?: SortOrder
    paymentProofPath?: SortOrder
    paymentStatus?: SortOrder
    adminNotes?: SortOrder
    verifiedAt?: SortOrder
    rejectedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amountUsd?: SortOrder
    exchangeRate?: SortOrder
    amountVes?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    amountUsd?: SortOrder
    exchangeRate?: SortOrder
    exchangeRateDate?: SortOrder
    amountVes?: SortOrder
    senderBank?: SortOrder
    paymentReference?: SortOrder
    paymentDate?: SortOrder
    paymentProofPath?: SortOrder
    paymentStatus?: SortOrder
    adminNotes?: SortOrder
    verifiedAt?: SortOrder
    rejectedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    amountUsd?: SortOrder
    exchangeRate?: SortOrder
    exchangeRateDate?: SortOrder
    amountVes?: SortOrder
    senderBank?: SortOrder
    paymentReference?: SortOrder
    paymentDate?: SortOrder
    paymentProofPath?: SortOrder
    paymentStatus?: SortOrder
    adminNotes?: SortOrder
    verifiedAt?: SortOrder
    rejectedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amountUsd?: SortOrder
    exchangeRate?: SortOrder
    amountVes?: SortOrder
  }

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type RankingSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    totalPoints?: SortOrder
    exactScores?: SortOrder
    correctResults?: SortOrder
    wrongPredictions?: SortOrder
    pendingPredictions?: SortOrder
    playedMatches?: SortOrder
    totalGoalDiffError?: SortOrder
    effectivenessPercent?: SortOrder
    currentPosition?: SortOrder
    previousPosition?: SortOrder
    updatedAt?: SortOrder
  }

  export type RankingSnapshotAvgOrderByAggregateInput = {
    totalPoints?: SortOrder
    exactScores?: SortOrder
    correctResults?: SortOrder
    wrongPredictions?: SortOrder
    pendingPredictions?: SortOrder
    playedMatches?: SortOrder
    totalGoalDiffError?: SortOrder
    effectivenessPercent?: SortOrder
    currentPosition?: SortOrder
    previousPosition?: SortOrder
  }

  export type RankingSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    totalPoints?: SortOrder
    exactScores?: SortOrder
    correctResults?: SortOrder
    wrongPredictions?: SortOrder
    pendingPredictions?: SortOrder
    playedMatches?: SortOrder
    totalGoalDiffError?: SortOrder
    effectivenessPercent?: SortOrder
    currentPosition?: SortOrder
    previousPosition?: SortOrder
    updatedAt?: SortOrder
  }

  export type RankingSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    totalPoints?: SortOrder
    exactScores?: SortOrder
    correctResults?: SortOrder
    wrongPredictions?: SortOrder
    pendingPredictions?: SortOrder
    playedMatches?: SortOrder
    totalGoalDiffError?: SortOrder
    effectivenessPercent?: SortOrder
    currentPosition?: SortOrder
    previousPosition?: SortOrder
    updatedAt?: SortOrder
  }

  export type RankingSnapshotSumOrderByAggregateInput = {
    totalPoints?: SortOrder
    exactScores?: SortOrder
    correctResults?: SortOrder
    wrongPredictions?: SortOrder
    pendingPredictions?: SortOrder
    playedMatches?: SortOrder
    totalGoalDiffError?: SortOrder
    effectivenessPercent?: SortOrder
    currentPosition?: SortOrder
    previousPosition?: SortOrder
  }

  export type LiveResultsLogCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    message?: SortOrder
    matchId?: SortOrder
    source?: SortOrder
    confidence?: SortOrder
    detectedGoals1?: SortOrder
    detectedGoals2?: SortOrder
    adminAction?: SortOrder
    rawData?: SortOrder
    createdAt?: SortOrder
  }

  export type LiveResultsLogAvgOrderByAggregateInput = {
    detectedGoals1?: SortOrder
    detectedGoals2?: SortOrder
  }

  export type LiveResultsLogMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    message?: SortOrder
    matchId?: SortOrder
    source?: SortOrder
    confidence?: SortOrder
    detectedGoals1?: SortOrder
    detectedGoals2?: SortOrder
    adminAction?: SortOrder
    rawData?: SortOrder
    createdAt?: SortOrder
  }

  export type LiveResultsLogMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    message?: SortOrder
    matchId?: SortOrder
    source?: SortOrder
    confidence?: SortOrder
    detectedGoals1?: SortOrder
    detectedGoals2?: SortOrder
    adminAction?: SortOrder
    rawData?: SortOrder
    createdAt?: SortOrder
  }

  export type LiveResultsLogSumOrderByAggregateInput = {
    detectedGoals1?: SortOrder
    detectedGoals2?: SortOrder
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    createdAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type MatchCreateNestedManyWithoutTeam1Input = {
    create?: XOR<MatchCreateWithoutTeam1Input, MatchUncheckedCreateWithoutTeam1Input> | MatchCreateWithoutTeam1Input[] | MatchUncheckedCreateWithoutTeam1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutTeam1Input | MatchCreateOrConnectWithoutTeam1Input[]
    createMany?: MatchCreateManyTeam1InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchCreateNestedManyWithoutTeam2Input = {
    create?: XOR<MatchCreateWithoutTeam2Input, MatchUncheckedCreateWithoutTeam2Input> | MatchCreateWithoutTeam2Input[] | MatchUncheckedCreateWithoutTeam2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutTeam2Input | MatchCreateOrConnectWithoutTeam2Input[]
    createMany?: MatchCreateManyTeam2InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutTeam1Input = {
    create?: XOR<MatchCreateWithoutTeam1Input, MatchUncheckedCreateWithoutTeam1Input> | MatchCreateWithoutTeam1Input[] | MatchUncheckedCreateWithoutTeam1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutTeam1Input | MatchCreateOrConnectWithoutTeam1Input[]
    createMany?: MatchCreateManyTeam1InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutTeam2Input = {
    create?: XOR<MatchCreateWithoutTeam2Input, MatchUncheckedCreateWithoutTeam2Input> | MatchCreateWithoutTeam2Input[] | MatchUncheckedCreateWithoutTeam2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutTeam2Input | MatchCreateOrConnectWithoutTeam2Input[]
    createMany?: MatchCreateManyTeam2InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchUpdateManyWithoutTeam1NestedInput = {
    create?: XOR<MatchCreateWithoutTeam1Input, MatchUncheckedCreateWithoutTeam1Input> | MatchCreateWithoutTeam1Input[] | MatchUncheckedCreateWithoutTeam1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutTeam1Input | MatchCreateOrConnectWithoutTeam1Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutTeam1Input | MatchUpsertWithWhereUniqueWithoutTeam1Input[]
    createMany?: MatchCreateManyTeam1InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutTeam1Input | MatchUpdateWithWhereUniqueWithoutTeam1Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutTeam1Input | MatchUpdateManyWithWhereWithoutTeam1Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUpdateManyWithoutTeam2NestedInput = {
    create?: XOR<MatchCreateWithoutTeam2Input, MatchUncheckedCreateWithoutTeam2Input> | MatchCreateWithoutTeam2Input[] | MatchUncheckedCreateWithoutTeam2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutTeam2Input | MatchCreateOrConnectWithoutTeam2Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutTeam2Input | MatchUpsertWithWhereUniqueWithoutTeam2Input[]
    createMany?: MatchCreateManyTeam2InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutTeam2Input | MatchUpdateWithWhereUniqueWithoutTeam2Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutTeam2Input | MatchUpdateManyWithWhereWithoutTeam2Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutTeam1NestedInput = {
    create?: XOR<MatchCreateWithoutTeam1Input, MatchUncheckedCreateWithoutTeam1Input> | MatchCreateWithoutTeam1Input[] | MatchUncheckedCreateWithoutTeam1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutTeam1Input | MatchCreateOrConnectWithoutTeam1Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutTeam1Input | MatchUpsertWithWhereUniqueWithoutTeam1Input[]
    createMany?: MatchCreateManyTeam1InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutTeam1Input | MatchUpdateWithWhereUniqueWithoutTeam1Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutTeam1Input | MatchUpdateManyWithWhereWithoutTeam1Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutTeam2NestedInput = {
    create?: XOR<MatchCreateWithoutTeam2Input, MatchUncheckedCreateWithoutTeam2Input> | MatchCreateWithoutTeam2Input[] | MatchUncheckedCreateWithoutTeam2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutTeam2Input | MatchCreateOrConnectWithoutTeam2Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutTeam2Input | MatchUpsertWithWhereUniqueWithoutTeam2Input[]
    createMany?: MatchCreateManyTeam2InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutTeam2Input | MatchUpdateWithWhereUniqueWithoutTeam2Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutTeam2Input | MatchUpdateManyWithWhereWithoutTeam2Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type TeamCreateNestedOneWithoutMatchesAsTeam1Input = {
    create?: XOR<TeamCreateWithoutMatchesAsTeam1Input, TeamUncheckedCreateWithoutMatchesAsTeam1Input>
    connectOrCreate?: TeamCreateOrConnectWithoutMatchesAsTeam1Input
    connect?: TeamWhereUniqueInput
  }

  export type TeamCreateNestedOneWithoutMatchesAsTeam2Input = {
    create?: XOR<TeamCreateWithoutMatchesAsTeam2Input, TeamUncheckedCreateWithoutMatchesAsTeam2Input>
    connectOrCreate?: TeamCreateOrConnectWithoutMatchesAsTeam2Input
    connect?: TeamWhereUniqueInput
  }

  export type PredictionCreateNestedManyWithoutMatchInput = {
    create?: XOR<PredictionCreateWithoutMatchInput, PredictionUncheckedCreateWithoutMatchInput> | PredictionCreateWithoutMatchInput[] | PredictionUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: PredictionCreateOrConnectWithoutMatchInput | PredictionCreateOrConnectWithoutMatchInput[]
    createMany?: PredictionCreateManyMatchInputEnvelope
    connect?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
  }

  export type PredictionUncheckedCreateNestedManyWithoutMatchInput = {
    create?: XOR<PredictionCreateWithoutMatchInput, PredictionUncheckedCreateWithoutMatchInput> | PredictionCreateWithoutMatchInput[] | PredictionUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: PredictionCreateOrConnectWithoutMatchInput | PredictionCreateOrConnectWithoutMatchInput[]
    createMany?: PredictionCreateManyMatchInputEnvelope
    connect?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumMatchStatusFieldUpdateOperationsInput = {
    set?: $Enums.MatchStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableEnumMatchResultFieldUpdateOperationsInput = {
    set?: $Enums.MatchResult | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type TeamUpdateOneRequiredWithoutMatchesAsTeam1NestedInput = {
    create?: XOR<TeamCreateWithoutMatchesAsTeam1Input, TeamUncheckedCreateWithoutMatchesAsTeam1Input>
    connectOrCreate?: TeamCreateOrConnectWithoutMatchesAsTeam1Input
    upsert?: TeamUpsertWithoutMatchesAsTeam1Input
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutMatchesAsTeam1Input, TeamUpdateWithoutMatchesAsTeam1Input>, TeamUncheckedUpdateWithoutMatchesAsTeam1Input>
  }

  export type TeamUpdateOneRequiredWithoutMatchesAsTeam2NestedInput = {
    create?: XOR<TeamCreateWithoutMatchesAsTeam2Input, TeamUncheckedCreateWithoutMatchesAsTeam2Input>
    connectOrCreate?: TeamCreateOrConnectWithoutMatchesAsTeam2Input
    upsert?: TeamUpsertWithoutMatchesAsTeam2Input
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutMatchesAsTeam2Input, TeamUpdateWithoutMatchesAsTeam2Input>, TeamUncheckedUpdateWithoutMatchesAsTeam2Input>
  }

  export type PredictionUpdateManyWithoutMatchNestedInput = {
    create?: XOR<PredictionCreateWithoutMatchInput, PredictionUncheckedCreateWithoutMatchInput> | PredictionCreateWithoutMatchInput[] | PredictionUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: PredictionCreateOrConnectWithoutMatchInput | PredictionCreateOrConnectWithoutMatchInput[]
    upsert?: PredictionUpsertWithWhereUniqueWithoutMatchInput | PredictionUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: PredictionCreateManyMatchInputEnvelope
    set?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    disconnect?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    delete?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    connect?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    update?: PredictionUpdateWithWhereUniqueWithoutMatchInput | PredictionUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: PredictionUpdateManyWithWhereWithoutMatchInput | PredictionUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: PredictionScalarWhereInput | PredictionScalarWhereInput[]
  }

  export type PredictionUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: XOR<PredictionCreateWithoutMatchInput, PredictionUncheckedCreateWithoutMatchInput> | PredictionCreateWithoutMatchInput[] | PredictionUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: PredictionCreateOrConnectWithoutMatchInput | PredictionCreateOrConnectWithoutMatchInput[]
    upsert?: PredictionUpsertWithWhereUniqueWithoutMatchInput | PredictionUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: PredictionCreateManyMatchInputEnvelope
    set?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    disconnect?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    delete?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    connect?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    update?: PredictionUpdateWithWhereUniqueWithoutMatchInput | PredictionUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: PredictionUpdateManyWithWhereWithoutMatchInput | PredictionUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: PredictionScalarWhereInput | PredictionScalarWhereInput[]
  }

  export type PredictionCreateNestedManyWithoutParticipantInput = {
    create?: XOR<PredictionCreateWithoutParticipantInput, PredictionUncheckedCreateWithoutParticipantInput> | PredictionCreateWithoutParticipantInput[] | PredictionUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: PredictionCreateOrConnectWithoutParticipantInput | PredictionCreateOrConnectWithoutParticipantInput[]
    createMany?: PredictionCreateManyParticipantInputEnvelope
    connect?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
  }

  export type PaymentCreateNestedOneWithoutParticipantInput = {
    create?: XOR<PaymentCreateWithoutParticipantInput, PaymentUncheckedCreateWithoutParticipantInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutParticipantInput
    connect?: PaymentWhereUniqueInput
  }

  export type RankingSnapshotCreateNestedOneWithoutParticipantInput = {
    create?: XOR<RankingSnapshotCreateWithoutParticipantInput, RankingSnapshotUncheckedCreateWithoutParticipantInput>
    connectOrCreate?: RankingSnapshotCreateOrConnectWithoutParticipantInput
    connect?: RankingSnapshotWhereUniqueInput
  }

  export type PredictionUncheckedCreateNestedManyWithoutParticipantInput = {
    create?: XOR<PredictionCreateWithoutParticipantInput, PredictionUncheckedCreateWithoutParticipantInput> | PredictionCreateWithoutParticipantInput[] | PredictionUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: PredictionCreateOrConnectWithoutParticipantInput | PredictionCreateOrConnectWithoutParticipantInput[]
    createMany?: PredictionCreateManyParticipantInputEnvelope
    connect?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedOneWithoutParticipantInput = {
    create?: XOR<PaymentCreateWithoutParticipantInput, PaymentUncheckedCreateWithoutParticipantInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutParticipantInput
    connect?: PaymentWhereUniqueInput
  }

  export type RankingSnapshotUncheckedCreateNestedOneWithoutParticipantInput = {
    create?: XOR<RankingSnapshotCreateWithoutParticipantInput, RankingSnapshotUncheckedCreateWithoutParticipantInput>
    connectOrCreate?: RankingSnapshotCreateOrConnectWithoutParticipantInput
    connect?: RankingSnapshotWhereUniqueInput
  }

  export type PredictionUpdateManyWithoutParticipantNestedInput = {
    create?: XOR<PredictionCreateWithoutParticipantInput, PredictionUncheckedCreateWithoutParticipantInput> | PredictionCreateWithoutParticipantInput[] | PredictionUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: PredictionCreateOrConnectWithoutParticipantInput | PredictionCreateOrConnectWithoutParticipantInput[]
    upsert?: PredictionUpsertWithWhereUniqueWithoutParticipantInput | PredictionUpsertWithWhereUniqueWithoutParticipantInput[]
    createMany?: PredictionCreateManyParticipantInputEnvelope
    set?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    disconnect?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    delete?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    connect?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    update?: PredictionUpdateWithWhereUniqueWithoutParticipantInput | PredictionUpdateWithWhereUniqueWithoutParticipantInput[]
    updateMany?: PredictionUpdateManyWithWhereWithoutParticipantInput | PredictionUpdateManyWithWhereWithoutParticipantInput[]
    deleteMany?: PredictionScalarWhereInput | PredictionScalarWhereInput[]
  }

  export type PaymentUpdateOneWithoutParticipantNestedInput = {
    create?: XOR<PaymentCreateWithoutParticipantInput, PaymentUncheckedCreateWithoutParticipantInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutParticipantInput
    upsert?: PaymentUpsertWithoutParticipantInput
    disconnect?: PaymentWhereInput | boolean
    delete?: PaymentWhereInput | boolean
    connect?: PaymentWhereUniqueInput
    update?: XOR<XOR<PaymentUpdateToOneWithWhereWithoutParticipantInput, PaymentUpdateWithoutParticipantInput>, PaymentUncheckedUpdateWithoutParticipantInput>
  }

  export type RankingSnapshotUpdateOneWithoutParticipantNestedInput = {
    create?: XOR<RankingSnapshotCreateWithoutParticipantInput, RankingSnapshotUncheckedCreateWithoutParticipantInput>
    connectOrCreate?: RankingSnapshotCreateOrConnectWithoutParticipantInput
    upsert?: RankingSnapshotUpsertWithoutParticipantInput
    disconnect?: RankingSnapshotWhereInput | boolean
    delete?: RankingSnapshotWhereInput | boolean
    connect?: RankingSnapshotWhereUniqueInput
    update?: XOR<XOR<RankingSnapshotUpdateToOneWithWhereWithoutParticipantInput, RankingSnapshotUpdateWithoutParticipantInput>, RankingSnapshotUncheckedUpdateWithoutParticipantInput>
  }

  export type PredictionUncheckedUpdateManyWithoutParticipantNestedInput = {
    create?: XOR<PredictionCreateWithoutParticipantInput, PredictionUncheckedCreateWithoutParticipantInput> | PredictionCreateWithoutParticipantInput[] | PredictionUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: PredictionCreateOrConnectWithoutParticipantInput | PredictionCreateOrConnectWithoutParticipantInput[]
    upsert?: PredictionUpsertWithWhereUniqueWithoutParticipantInput | PredictionUpsertWithWhereUniqueWithoutParticipantInput[]
    createMany?: PredictionCreateManyParticipantInputEnvelope
    set?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    disconnect?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    delete?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    connect?: PredictionWhereUniqueInput | PredictionWhereUniqueInput[]
    update?: PredictionUpdateWithWhereUniqueWithoutParticipantInput | PredictionUpdateWithWhereUniqueWithoutParticipantInput[]
    updateMany?: PredictionUpdateManyWithWhereWithoutParticipantInput | PredictionUpdateManyWithWhereWithoutParticipantInput[]
    deleteMany?: PredictionScalarWhereInput | PredictionScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateOneWithoutParticipantNestedInput = {
    create?: XOR<PaymentCreateWithoutParticipantInput, PaymentUncheckedCreateWithoutParticipantInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutParticipantInput
    upsert?: PaymentUpsertWithoutParticipantInput
    disconnect?: PaymentWhereInput | boolean
    delete?: PaymentWhereInput | boolean
    connect?: PaymentWhereUniqueInput
    update?: XOR<XOR<PaymentUpdateToOneWithWhereWithoutParticipantInput, PaymentUpdateWithoutParticipantInput>, PaymentUncheckedUpdateWithoutParticipantInput>
  }

  export type RankingSnapshotUncheckedUpdateOneWithoutParticipantNestedInput = {
    create?: XOR<RankingSnapshotCreateWithoutParticipantInput, RankingSnapshotUncheckedCreateWithoutParticipantInput>
    connectOrCreate?: RankingSnapshotCreateOrConnectWithoutParticipantInput
    upsert?: RankingSnapshotUpsertWithoutParticipantInput
    disconnect?: RankingSnapshotWhereInput | boolean
    delete?: RankingSnapshotWhereInput | boolean
    connect?: RankingSnapshotWhereUniqueInput
    update?: XOR<XOR<RankingSnapshotUpdateToOneWithWhereWithoutParticipantInput, RankingSnapshotUpdateWithoutParticipantInput>, RankingSnapshotUncheckedUpdateWithoutParticipantInput>
  }

  export type ParticipantCreateNestedOneWithoutPredictionsInput = {
    create?: XOR<ParticipantCreateWithoutPredictionsInput, ParticipantUncheckedCreateWithoutPredictionsInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutPredictionsInput
    connect?: ParticipantWhereUniqueInput
  }

  export type MatchCreateNestedOneWithoutPredictionsInput = {
    create?: XOR<MatchCreateWithoutPredictionsInput, MatchUncheckedCreateWithoutPredictionsInput>
    connectOrCreate?: MatchCreateOrConnectWithoutPredictionsInput
    connect?: MatchWhereUniqueInput
  }

  export type EnumMatchResultFieldUpdateOperationsInput = {
    set?: $Enums.MatchResult
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type ParticipantUpdateOneRequiredWithoutPredictionsNestedInput = {
    create?: XOR<ParticipantCreateWithoutPredictionsInput, ParticipantUncheckedCreateWithoutPredictionsInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutPredictionsInput
    upsert?: ParticipantUpsertWithoutPredictionsInput
    connect?: ParticipantWhereUniqueInput
    update?: XOR<XOR<ParticipantUpdateToOneWithWhereWithoutPredictionsInput, ParticipantUpdateWithoutPredictionsInput>, ParticipantUncheckedUpdateWithoutPredictionsInput>
  }

  export type MatchUpdateOneRequiredWithoutPredictionsNestedInput = {
    create?: XOR<MatchCreateWithoutPredictionsInput, MatchUncheckedCreateWithoutPredictionsInput>
    connectOrCreate?: MatchCreateOrConnectWithoutPredictionsInput
    upsert?: MatchUpsertWithoutPredictionsInput
    connect?: MatchWhereUniqueInput
    update?: XOR<XOR<MatchUpdateToOneWithWhereWithoutPredictionsInput, MatchUpdateWithoutPredictionsInput>, MatchUncheckedUpdateWithoutPredictionsInput>
  }

  export type ParticipantCreateNestedOneWithoutPaymentInput = {
    create?: XOR<ParticipantCreateWithoutPaymentInput, ParticipantUncheckedCreateWithoutPaymentInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutPaymentInput
    connect?: ParticipantWhereUniqueInput
  }

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus
  }

  export type ParticipantUpdateOneRequiredWithoutPaymentNestedInput = {
    create?: XOR<ParticipantCreateWithoutPaymentInput, ParticipantUncheckedCreateWithoutPaymentInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutPaymentInput
    upsert?: ParticipantUpsertWithoutPaymentInput
    connect?: ParticipantWhereUniqueInput
    update?: XOR<XOR<ParticipantUpdateToOneWithWhereWithoutPaymentInput, ParticipantUpdateWithoutPaymentInput>, ParticipantUncheckedUpdateWithoutPaymentInput>
  }

  export type ParticipantCreateNestedOneWithoutRankingInput = {
    create?: XOR<ParticipantCreateWithoutRankingInput, ParticipantUncheckedCreateWithoutRankingInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutRankingInput
    connect?: ParticipantWhereUniqueInput
  }

  export type ParticipantUpdateOneRequiredWithoutRankingNestedInput = {
    create?: XOR<ParticipantCreateWithoutRankingInput, ParticipantUncheckedCreateWithoutRankingInput>
    connectOrCreate?: ParticipantCreateOrConnectWithoutRankingInput
    upsert?: ParticipantUpsertWithoutRankingInput
    connect?: ParticipantWhereUniqueInput
    update?: XOR<XOR<ParticipantUpdateToOneWithWhereWithoutRankingInput, ParticipantUpdateWithoutRankingInput>, ParticipantUncheckedUpdateWithoutRankingInput>
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
    not?: NestedStringFilter<$PrismaModel> | string
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
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

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumMatchStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchStatus | EnumMatchStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchStatusFilter<$PrismaModel> | $Enums.MatchStatus
  }

  export type NestedEnumMatchResultNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResult | EnumMatchResultFieldRefInput<$PrismaModel> | null
    in?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMatchResultNullableFilter<$PrismaModel> | $Enums.MatchResult | null
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
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
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

  export type NestedEnumMatchStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchStatus | EnumMatchStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchStatus[] | ListEnumMatchStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchStatusWithAggregatesFilter<$PrismaModel> | $Enums.MatchStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMatchStatusFilter<$PrismaModel>
    _max?: NestedEnumMatchStatusFilter<$PrismaModel>
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

  export type NestedEnumMatchResultNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResult | EnumMatchResultFieldRefInput<$PrismaModel> | null
    in?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMatchResultNullableWithAggregatesFilter<$PrismaModel> | $Enums.MatchResult | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMatchResultNullableFilter<$PrismaModel>
    _max?: NestedEnumMatchResultNullableFilter<$PrismaModel>
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
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumMatchResultFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResult | EnumMatchResultFieldRefInput<$PrismaModel>
    in?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchResultFilter<$PrismaModel> | $Enums.MatchResult
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedEnumMatchResultWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResult | EnumMatchResultFieldRefInput<$PrismaModel>
    in?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchResult[] | ListEnumMatchResultFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchResultWithAggregatesFilter<$PrismaModel> | $Enums.MatchResult
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMatchResultFilter<$PrismaModel>
    _max?: NestedEnumMatchResultFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type MatchCreateWithoutTeam1Input = {
    id?: string
    matchNumber: number
    group: string
    kickoffUtc: Date | string
    venue?: string
    city?: string
    source?: string
    status?: $Enums.MatchStatus
    team1Goals?: number | null
    team2Goals?: number | null
    result?: $Enums.MatchResult | null
    resultUpdatedAt?: Date | string | null
    resultSource?: string | null
    autoDetectedTeam1Goals?: number | null
    autoDetectedTeam2Goals?: number | null
    autoDetectedResult?: $Enums.MatchResult | null
    autoDetectedSource?: string | null
    autoDetectionConfidence?: string | null
    autoDetectedAt?: Date | string | null
    autoResultStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    team2: TeamCreateNestedOneWithoutMatchesAsTeam2Input
    predictions?: PredictionCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutTeam1Input = {
    id?: string
    matchNumber: number
    group: string
    team2Id: string
    kickoffUtc: Date | string
    venue?: string
    city?: string
    source?: string
    status?: $Enums.MatchStatus
    team1Goals?: number | null
    team2Goals?: number | null
    result?: $Enums.MatchResult | null
    resultUpdatedAt?: Date | string | null
    resultSource?: string | null
    autoDetectedTeam1Goals?: number | null
    autoDetectedTeam2Goals?: number | null
    autoDetectedResult?: $Enums.MatchResult | null
    autoDetectedSource?: string | null
    autoDetectionConfidence?: string | null
    autoDetectedAt?: Date | string | null
    autoResultStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    predictions?: PredictionUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutTeam1Input = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutTeam1Input, MatchUncheckedCreateWithoutTeam1Input>
  }

  export type MatchCreateManyTeam1InputEnvelope = {
    data: MatchCreateManyTeam1Input | MatchCreateManyTeam1Input[]
    skipDuplicates?: boolean
  }

  export type MatchCreateWithoutTeam2Input = {
    id?: string
    matchNumber: number
    group: string
    kickoffUtc: Date | string
    venue?: string
    city?: string
    source?: string
    status?: $Enums.MatchStatus
    team1Goals?: number | null
    team2Goals?: number | null
    result?: $Enums.MatchResult | null
    resultUpdatedAt?: Date | string | null
    resultSource?: string | null
    autoDetectedTeam1Goals?: number | null
    autoDetectedTeam2Goals?: number | null
    autoDetectedResult?: $Enums.MatchResult | null
    autoDetectedSource?: string | null
    autoDetectionConfidence?: string | null
    autoDetectedAt?: Date | string | null
    autoResultStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    team1: TeamCreateNestedOneWithoutMatchesAsTeam1Input
    predictions?: PredictionCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutTeam2Input = {
    id?: string
    matchNumber: number
    group: string
    team1Id: string
    kickoffUtc: Date | string
    venue?: string
    city?: string
    source?: string
    status?: $Enums.MatchStatus
    team1Goals?: number | null
    team2Goals?: number | null
    result?: $Enums.MatchResult | null
    resultUpdatedAt?: Date | string | null
    resultSource?: string | null
    autoDetectedTeam1Goals?: number | null
    autoDetectedTeam2Goals?: number | null
    autoDetectedResult?: $Enums.MatchResult | null
    autoDetectedSource?: string | null
    autoDetectionConfidence?: string | null
    autoDetectedAt?: Date | string | null
    autoResultStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    predictions?: PredictionUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutTeam2Input = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutTeam2Input, MatchUncheckedCreateWithoutTeam2Input>
  }

  export type MatchCreateManyTeam2InputEnvelope = {
    data: MatchCreateManyTeam2Input | MatchCreateManyTeam2Input[]
    skipDuplicates?: boolean
  }

  export type MatchUpsertWithWhereUniqueWithoutTeam1Input = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutTeam1Input, MatchUncheckedUpdateWithoutTeam1Input>
    create: XOR<MatchCreateWithoutTeam1Input, MatchUncheckedCreateWithoutTeam1Input>
  }

  export type MatchUpdateWithWhereUniqueWithoutTeam1Input = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutTeam1Input, MatchUncheckedUpdateWithoutTeam1Input>
  }

  export type MatchUpdateManyWithWhereWithoutTeam1Input = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutTeam1Input>
  }

  export type MatchScalarWhereInput = {
    AND?: MatchScalarWhereInput | MatchScalarWhereInput[]
    OR?: MatchScalarWhereInput[]
    NOT?: MatchScalarWhereInput | MatchScalarWhereInput[]
    id?: StringFilter<"Match"> | string
    matchNumber?: IntFilter<"Match"> | number
    group?: StringFilter<"Match"> | string
    team1Id?: StringFilter<"Match"> | string
    team2Id?: StringFilter<"Match"> | string
    kickoffUtc?: DateTimeFilter<"Match"> | Date | string
    venue?: StringFilter<"Match"> | string
    city?: StringFilter<"Match"> | string
    source?: StringFilter<"Match"> | string
    status?: EnumMatchStatusFilter<"Match"> | $Enums.MatchStatus
    team1Goals?: IntNullableFilter<"Match"> | number | null
    team2Goals?: IntNullableFilter<"Match"> | number | null
    result?: EnumMatchResultNullableFilter<"Match"> | $Enums.MatchResult | null
    resultUpdatedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    resultSource?: StringNullableFilter<"Match"> | string | null
    autoDetectedTeam1Goals?: IntNullableFilter<"Match"> | number | null
    autoDetectedTeam2Goals?: IntNullableFilter<"Match"> | number | null
    autoDetectedResult?: EnumMatchResultNullableFilter<"Match"> | $Enums.MatchResult | null
    autoDetectedSource?: StringNullableFilter<"Match"> | string | null
    autoDetectionConfidence?: StringNullableFilter<"Match"> | string | null
    autoDetectedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    autoResultStatus?: StringNullableFilter<"Match"> | string | null
    createdAt?: DateTimeFilter<"Match"> | Date | string
    updatedAt?: DateTimeFilter<"Match"> | Date | string
  }

  export type MatchUpsertWithWhereUniqueWithoutTeam2Input = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutTeam2Input, MatchUncheckedUpdateWithoutTeam2Input>
    create: XOR<MatchCreateWithoutTeam2Input, MatchUncheckedCreateWithoutTeam2Input>
  }

  export type MatchUpdateWithWhereUniqueWithoutTeam2Input = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutTeam2Input, MatchUncheckedUpdateWithoutTeam2Input>
  }

  export type MatchUpdateManyWithWhereWithoutTeam2Input = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutTeam2Input>
  }

  export type TeamCreateWithoutMatchesAsTeam1Input = {
    id?: string
    officialName: string
    displayName: string
    shortName: string
    fifaCode: string
    isoCode: string
    flagEmoji?: string
    group: string
    aliases?: string
    createdAt?: Date | string
    matchesAsTeam2?: MatchCreateNestedManyWithoutTeam2Input
  }

  export type TeamUncheckedCreateWithoutMatchesAsTeam1Input = {
    id?: string
    officialName: string
    displayName: string
    shortName: string
    fifaCode: string
    isoCode: string
    flagEmoji?: string
    group: string
    aliases?: string
    createdAt?: Date | string
    matchesAsTeam2?: MatchUncheckedCreateNestedManyWithoutTeam2Input
  }

  export type TeamCreateOrConnectWithoutMatchesAsTeam1Input = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutMatchesAsTeam1Input, TeamUncheckedCreateWithoutMatchesAsTeam1Input>
  }

  export type TeamCreateWithoutMatchesAsTeam2Input = {
    id?: string
    officialName: string
    displayName: string
    shortName: string
    fifaCode: string
    isoCode: string
    flagEmoji?: string
    group: string
    aliases?: string
    createdAt?: Date | string
    matchesAsTeam1?: MatchCreateNestedManyWithoutTeam1Input
  }

  export type TeamUncheckedCreateWithoutMatchesAsTeam2Input = {
    id?: string
    officialName: string
    displayName: string
    shortName: string
    fifaCode: string
    isoCode: string
    flagEmoji?: string
    group: string
    aliases?: string
    createdAt?: Date | string
    matchesAsTeam1?: MatchUncheckedCreateNestedManyWithoutTeam1Input
  }

  export type TeamCreateOrConnectWithoutMatchesAsTeam2Input = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutMatchesAsTeam2Input, TeamUncheckedCreateWithoutMatchesAsTeam2Input>
  }

  export type PredictionCreateWithoutMatchInput = {
    id?: string
    predictedTeam1Goals: number
    predictedTeam2Goals: number
    predictedResult: $Enums.MatchResult
    points?: number
    isExactScore?: boolean | null
    isCorrectResult?: boolean | null
    goalDifferenceError?: number | null
    createdAt?: Date | string
    participant: ParticipantCreateNestedOneWithoutPredictionsInput
  }

  export type PredictionUncheckedCreateWithoutMatchInput = {
    id?: string
    participantId: string
    predictedTeam1Goals: number
    predictedTeam2Goals: number
    predictedResult: $Enums.MatchResult
    points?: number
    isExactScore?: boolean | null
    isCorrectResult?: boolean | null
    goalDifferenceError?: number | null
    createdAt?: Date | string
  }

  export type PredictionCreateOrConnectWithoutMatchInput = {
    where: PredictionWhereUniqueInput
    create: XOR<PredictionCreateWithoutMatchInput, PredictionUncheckedCreateWithoutMatchInput>
  }

  export type PredictionCreateManyMatchInputEnvelope = {
    data: PredictionCreateManyMatchInput | PredictionCreateManyMatchInput[]
    skipDuplicates?: boolean
  }

  export type TeamUpsertWithoutMatchesAsTeam1Input = {
    update: XOR<TeamUpdateWithoutMatchesAsTeam1Input, TeamUncheckedUpdateWithoutMatchesAsTeam1Input>
    create: XOR<TeamCreateWithoutMatchesAsTeam1Input, TeamUncheckedCreateWithoutMatchesAsTeam1Input>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutMatchesAsTeam1Input = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutMatchesAsTeam1Input, TeamUncheckedUpdateWithoutMatchesAsTeam1Input>
  }

  export type TeamUpdateWithoutMatchesAsTeam1Input = {
    id?: StringFieldUpdateOperationsInput | string
    officialName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    fifaCode?: StringFieldUpdateOperationsInput | string
    isoCode?: StringFieldUpdateOperationsInput | string
    flagEmoji?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    aliases?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matchesAsTeam2?: MatchUpdateManyWithoutTeam2NestedInput
  }

  export type TeamUncheckedUpdateWithoutMatchesAsTeam1Input = {
    id?: StringFieldUpdateOperationsInput | string
    officialName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    fifaCode?: StringFieldUpdateOperationsInput | string
    isoCode?: StringFieldUpdateOperationsInput | string
    flagEmoji?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    aliases?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matchesAsTeam2?: MatchUncheckedUpdateManyWithoutTeam2NestedInput
  }

  export type TeamUpsertWithoutMatchesAsTeam2Input = {
    update: XOR<TeamUpdateWithoutMatchesAsTeam2Input, TeamUncheckedUpdateWithoutMatchesAsTeam2Input>
    create: XOR<TeamCreateWithoutMatchesAsTeam2Input, TeamUncheckedCreateWithoutMatchesAsTeam2Input>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutMatchesAsTeam2Input = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutMatchesAsTeam2Input, TeamUncheckedUpdateWithoutMatchesAsTeam2Input>
  }

  export type TeamUpdateWithoutMatchesAsTeam2Input = {
    id?: StringFieldUpdateOperationsInput | string
    officialName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    fifaCode?: StringFieldUpdateOperationsInput | string
    isoCode?: StringFieldUpdateOperationsInput | string
    flagEmoji?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    aliases?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matchesAsTeam1?: MatchUpdateManyWithoutTeam1NestedInput
  }

  export type TeamUncheckedUpdateWithoutMatchesAsTeam2Input = {
    id?: StringFieldUpdateOperationsInput | string
    officialName?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    fifaCode?: StringFieldUpdateOperationsInput | string
    isoCode?: StringFieldUpdateOperationsInput | string
    flagEmoji?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    aliases?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matchesAsTeam1?: MatchUncheckedUpdateManyWithoutTeam1NestedInput
  }

  export type PredictionUpsertWithWhereUniqueWithoutMatchInput = {
    where: PredictionWhereUniqueInput
    update: XOR<PredictionUpdateWithoutMatchInput, PredictionUncheckedUpdateWithoutMatchInput>
    create: XOR<PredictionCreateWithoutMatchInput, PredictionUncheckedCreateWithoutMatchInput>
  }

  export type PredictionUpdateWithWhereUniqueWithoutMatchInput = {
    where: PredictionWhereUniqueInput
    data: XOR<PredictionUpdateWithoutMatchInput, PredictionUncheckedUpdateWithoutMatchInput>
  }

  export type PredictionUpdateManyWithWhereWithoutMatchInput = {
    where: PredictionScalarWhereInput
    data: XOR<PredictionUpdateManyMutationInput, PredictionUncheckedUpdateManyWithoutMatchInput>
  }

  export type PredictionScalarWhereInput = {
    AND?: PredictionScalarWhereInput | PredictionScalarWhereInput[]
    OR?: PredictionScalarWhereInput[]
    NOT?: PredictionScalarWhereInput | PredictionScalarWhereInput[]
    id?: StringFilter<"Prediction"> | string
    participantId?: StringFilter<"Prediction"> | string
    matchId?: StringFilter<"Prediction"> | string
    predictedTeam1Goals?: IntFilter<"Prediction"> | number
    predictedTeam2Goals?: IntFilter<"Prediction"> | number
    predictedResult?: EnumMatchResultFilter<"Prediction"> | $Enums.MatchResult
    points?: IntFilter<"Prediction"> | number
    isExactScore?: BoolNullableFilter<"Prediction"> | boolean | null
    isCorrectResult?: BoolNullableFilter<"Prediction"> | boolean | null
    goalDifferenceError?: IntNullableFilter<"Prediction"> | number | null
    createdAt?: DateTimeFilter<"Prediction"> | Date | string
  }

  export type PredictionCreateWithoutParticipantInput = {
    id?: string
    predictedTeam1Goals: number
    predictedTeam2Goals: number
    predictedResult: $Enums.MatchResult
    points?: number
    isExactScore?: boolean | null
    isCorrectResult?: boolean | null
    goalDifferenceError?: number | null
    createdAt?: Date | string
    match: MatchCreateNestedOneWithoutPredictionsInput
  }

  export type PredictionUncheckedCreateWithoutParticipantInput = {
    id?: string
    matchId: string
    predictedTeam1Goals: number
    predictedTeam2Goals: number
    predictedResult: $Enums.MatchResult
    points?: number
    isExactScore?: boolean | null
    isCorrectResult?: boolean | null
    goalDifferenceError?: number | null
    createdAt?: Date | string
  }

  export type PredictionCreateOrConnectWithoutParticipantInput = {
    where: PredictionWhereUniqueInput
    create: XOR<PredictionCreateWithoutParticipantInput, PredictionUncheckedCreateWithoutParticipantInput>
  }

  export type PredictionCreateManyParticipantInputEnvelope = {
    data: PredictionCreateManyParticipantInput | PredictionCreateManyParticipantInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutParticipantInput = {
    id?: string
    amountUsd?: number
    exchangeRate?: number | null
    exchangeRateDate?: Date | string | null
    amountVes?: number | null
    senderBank?: string | null
    paymentReference?: string | null
    paymentDate?: Date | string | null
    paymentProofPath?: string | null
    paymentStatus?: $Enums.PaymentStatus
    adminNotes?: string | null
    verifiedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentUncheckedCreateWithoutParticipantInput = {
    id?: string
    amountUsd?: number
    exchangeRate?: number | null
    exchangeRateDate?: Date | string | null
    amountVes?: number | null
    senderBank?: string | null
    paymentReference?: string | null
    paymentDate?: Date | string | null
    paymentProofPath?: string | null
    paymentStatus?: $Enums.PaymentStatus
    adminNotes?: string | null
    verifiedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentCreateOrConnectWithoutParticipantInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutParticipantInput, PaymentUncheckedCreateWithoutParticipantInput>
  }

  export type RankingSnapshotCreateWithoutParticipantInput = {
    id?: string
    totalPoints?: number
    exactScores?: number
    correctResults?: number
    wrongPredictions?: number
    pendingPredictions?: number
    playedMatches?: number
    totalGoalDiffError?: number
    effectivenessPercent?: number
    currentPosition?: number
    previousPosition?: number | null
    updatedAt?: Date | string
  }

  export type RankingSnapshotUncheckedCreateWithoutParticipantInput = {
    id?: string
    totalPoints?: number
    exactScores?: number
    correctResults?: number
    wrongPredictions?: number
    pendingPredictions?: number
    playedMatches?: number
    totalGoalDiffError?: number
    effectivenessPercent?: number
    currentPosition?: number
    previousPosition?: number | null
    updatedAt?: Date | string
  }

  export type RankingSnapshotCreateOrConnectWithoutParticipantInput = {
    where: RankingSnapshotWhereUniqueInput
    create: XOR<RankingSnapshotCreateWithoutParticipantInput, RankingSnapshotUncheckedCreateWithoutParticipantInput>
  }

  export type PredictionUpsertWithWhereUniqueWithoutParticipantInput = {
    where: PredictionWhereUniqueInput
    update: XOR<PredictionUpdateWithoutParticipantInput, PredictionUncheckedUpdateWithoutParticipantInput>
    create: XOR<PredictionCreateWithoutParticipantInput, PredictionUncheckedCreateWithoutParticipantInput>
  }

  export type PredictionUpdateWithWhereUniqueWithoutParticipantInput = {
    where: PredictionWhereUniqueInput
    data: XOR<PredictionUpdateWithoutParticipantInput, PredictionUncheckedUpdateWithoutParticipantInput>
  }

  export type PredictionUpdateManyWithWhereWithoutParticipantInput = {
    where: PredictionScalarWhereInput
    data: XOR<PredictionUpdateManyMutationInput, PredictionUncheckedUpdateManyWithoutParticipantInput>
  }

  export type PaymentUpsertWithoutParticipantInput = {
    update: XOR<PaymentUpdateWithoutParticipantInput, PaymentUncheckedUpdateWithoutParticipantInput>
    create: XOR<PaymentCreateWithoutParticipantInput, PaymentUncheckedCreateWithoutParticipantInput>
    where?: PaymentWhereInput
  }

  export type PaymentUpdateToOneWithWhereWithoutParticipantInput = {
    where?: PaymentWhereInput
    data: XOR<PaymentUpdateWithoutParticipantInput, PaymentUncheckedUpdateWithoutParticipantInput>
  }

  export type PaymentUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    amountUsd?: FloatFieldUpdateOperationsInput | number
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    exchangeRateDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amountVes?: NullableFloatFieldUpdateOperationsInput | number | null
    senderBank?: NullableStringFieldUpdateOperationsInput | string | null
    paymentReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProofPath?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    amountUsd?: FloatFieldUpdateOperationsInput | number
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    exchangeRateDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amountVes?: NullableFloatFieldUpdateOperationsInput | number | null
    senderBank?: NullableStringFieldUpdateOperationsInput | string | null
    paymentReference?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProofPath?: NullableStringFieldUpdateOperationsInput | string | null
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RankingSnapshotUpsertWithoutParticipantInput = {
    update: XOR<RankingSnapshotUpdateWithoutParticipantInput, RankingSnapshotUncheckedUpdateWithoutParticipantInput>
    create: XOR<RankingSnapshotCreateWithoutParticipantInput, RankingSnapshotUncheckedCreateWithoutParticipantInput>
    where?: RankingSnapshotWhereInput
  }

  export type RankingSnapshotUpdateToOneWithWhereWithoutParticipantInput = {
    where?: RankingSnapshotWhereInput
    data: XOR<RankingSnapshotUpdateWithoutParticipantInput, RankingSnapshotUncheckedUpdateWithoutParticipantInput>
  }

  export type RankingSnapshotUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalPoints?: IntFieldUpdateOperationsInput | number
    exactScores?: IntFieldUpdateOperationsInput | number
    correctResults?: IntFieldUpdateOperationsInput | number
    wrongPredictions?: IntFieldUpdateOperationsInput | number
    pendingPredictions?: IntFieldUpdateOperationsInput | number
    playedMatches?: IntFieldUpdateOperationsInput | number
    totalGoalDiffError?: IntFieldUpdateOperationsInput | number
    effectivenessPercent?: FloatFieldUpdateOperationsInput | number
    currentPosition?: IntFieldUpdateOperationsInput | number
    previousPosition?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RankingSnapshotUncheckedUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalPoints?: IntFieldUpdateOperationsInput | number
    exactScores?: IntFieldUpdateOperationsInput | number
    correctResults?: IntFieldUpdateOperationsInput | number
    wrongPredictions?: IntFieldUpdateOperationsInput | number
    pendingPredictions?: IntFieldUpdateOperationsInput | number
    playedMatches?: IntFieldUpdateOperationsInput | number
    totalGoalDiffError?: IntFieldUpdateOperationsInput | number
    effectivenessPercent?: FloatFieldUpdateOperationsInput | number
    currentPosition?: IntFieldUpdateOperationsInput | number
    previousPosition?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantCreateWithoutPredictionsInput = {
    id?: string
    fullName: string
    nationalId: string
    phone: string
    email?: string | null
    city?: string | null
    participationCode: string
    confirmationHash?: string | null
    submittedAt?: Date | string | null
    isComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    payment?: PaymentCreateNestedOneWithoutParticipantInput
    ranking?: RankingSnapshotCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateWithoutPredictionsInput = {
    id?: string
    fullName: string
    nationalId: string
    phone: string
    email?: string | null
    city?: string | null
    participationCode: string
    confirmationHash?: string | null
    submittedAt?: Date | string | null
    isComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    payment?: PaymentUncheckedCreateNestedOneWithoutParticipantInput
    ranking?: RankingSnapshotUncheckedCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantCreateOrConnectWithoutPredictionsInput = {
    where: ParticipantWhereUniqueInput
    create: XOR<ParticipantCreateWithoutPredictionsInput, ParticipantUncheckedCreateWithoutPredictionsInput>
  }

  export type MatchCreateWithoutPredictionsInput = {
    id?: string
    matchNumber: number
    group: string
    kickoffUtc: Date | string
    venue?: string
    city?: string
    source?: string
    status?: $Enums.MatchStatus
    team1Goals?: number | null
    team2Goals?: number | null
    result?: $Enums.MatchResult | null
    resultUpdatedAt?: Date | string | null
    resultSource?: string | null
    autoDetectedTeam1Goals?: number | null
    autoDetectedTeam2Goals?: number | null
    autoDetectedResult?: $Enums.MatchResult | null
    autoDetectedSource?: string | null
    autoDetectionConfidence?: string | null
    autoDetectedAt?: Date | string | null
    autoResultStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    team1: TeamCreateNestedOneWithoutMatchesAsTeam1Input
    team2: TeamCreateNestedOneWithoutMatchesAsTeam2Input
  }

  export type MatchUncheckedCreateWithoutPredictionsInput = {
    id?: string
    matchNumber: number
    group: string
    team1Id: string
    team2Id: string
    kickoffUtc: Date | string
    venue?: string
    city?: string
    source?: string
    status?: $Enums.MatchStatus
    team1Goals?: number | null
    team2Goals?: number | null
    result?: $Enums.MatchResult | null
    resultUpdatedAt?: Date | string | null
    resultSource?: string | null
    autoDetectedTeam1Goals?: number | null
    autoDetectedTeam2Goals?: number | null
    autoDetectedResult?: $Enums.MatchResult | null
    autoDetectedSource?: string | null
    autoDetectionConfidence?: string | null
    autoDetectedAt?: Date | string | null
    autoResultStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchCreateOrConnectWithoutPredictionsInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutPredictionsInput, MatchUncheckedCreateWithoutPredictionsInput>
  }

  export type ParticipantUpsertWithoutPredictionsInput = {
    update: XOR<ParticipantUpdateWithoutPredictionsInput, ParticipantUncheckedUpdateWithoutPredictionsInput>
    create: XOR<ParticipantCreateWithoutPredictionsInput, ParticipantUncheckedCreateWithoutPredictionsInput>
    where?: ParticipantWhereInput
  }

  export type ParticipantUpdateToOneWithWhereWithoutPredictionsInput = {
    where?: ParticipantWhereInput
    data: XOR<ParticipantUpdateWithoutPredictionsInput, ParticipantUncheckedUpdateWithoutPredictionsInput>
  }

  export type ParticipantUpdateWithoutPredictionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    nationalId?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    participationCode?: StringFieldUpdateOperationsInput | string
    confirmationHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payment?: PaymentUpdateOneWithoutParticipantNestedInput
    ranking?: RankingSnapshotUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateWithoutPredictionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    nationalId?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    participationCode?: StringFieldUpdateOperationsInput | string
    confirmationHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payment?: PaymentUncheckedUpdateOneWithoutParticipantNestedInput
    ranking?: RankingSnapshotUncheckedUpdateOneWithoutParticipantNestedInput
  }

  export type MatchUpsertWithoutPredictionsInput = {
    update: XOR<MatchUpdateWithoutPredictionsInput, MatchUncheckedUpdateWithoutPredictionsInput>
    create: XOR<MatchCreateWithoutPredictionsInput, MatchUncheckedCreateWithoutPredictionsInput>
    where?: MatchWhereInput
  }

  export type MatchUpdateToOneWithWhereWithoutPredictionsInput = {
    where?: MatchWhereInput
    data: XOR<MatchUpdateWithoutPredictionsInput, MatchUncheckedUpdateWithoutPredictionsInput>
  }

  export type MatchUpdateWithoutPredictionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchNumber?: IntFieldUpdateOperationsInput | number
    group?: StringFieldUpdateOperationsInput | string
    kickoffUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    team1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    team2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    result?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    resultUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resultSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedTeam1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedTeam2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedResult?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    autoDetectedSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectionConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoResultStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team1?: TeamUpdateOneRequiredWithoutMatchesAsTeam1NestedInput
    team2?: TeamUpdateOneRequiredWithoutMatchesAsTeam2NestedInput
  }

  export type MatchUncheckedUpdateWithoutPredictionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchNumber?: IntFieldUpdateOperationsInput | number
    group?: StringFieldUpdateOperationsInput | string
    team1Id?: StringFieldUpdateOperationsInput | string
    team2Id?: StringFieldUpdateOperationsInput | string
    kickoffUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    team1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    team2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    result?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    resultUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resultSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedTeam1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedTeam2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedResult?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    autoDetectedSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectionConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoResultStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantCreateWithoutPaymentInput = {
    id?: string
    fullName: string
    nationalId: string
    phone: string
    email?: string | null
    city?: string | null
    participationCode: string
    confirmationHash?: string | null
    submittedAt?: Date | string | null
    isComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    predictions?: PredictionCreateNestedManyWithoutParticipantInput
    ranking?: RankingSnapshotCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateWithoutPaymentInput = {
    id?: string
    fullName: string
    nationalId: string
    phone: string
    email?: string | null
    city?: string | null
    participationCode: string
    confirmationHash?: string | null
    submittedAt?: Date | string | null
    isComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    predictions?: PredictionUncheckedCreateNestedManyWithoutParticipantInput
    ranking?: RankingSnapshotUncheckedCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantCreateOrConnectWithoutPaymentInput = {
    where: ParticipantWhereUniqueInput
    create: XOR<ParticipantCreateWithoutPaymentInput, ParticipantUncheckedCreateWithoutPaymentInput>
  }

  export type ParticipantUpsertWithoutPaymentInput = {
    update: XOR<ParticipantUpdateWithoutPaymentInput, ParticipantUncheckedUpdateWithoutPaymentInput>
    create: XOR<ParticipantCreateWithoutPaymentInput, ParticipantUncheckedCreateWithoutPaymentInput>
    where?: ParticipantWhereInput
  }

  export type ParticipantUpdateToOneWithWhereWithoutPaymentInput = {
    where?: ParticipantWhereInput
    data: XOR<ParticipantUpdateWithoutPaymentInput, ParticipantUncheckedUpdateWithoutPaymentInput>
  }

  export type ParticipantUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    nationalId?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    participationCode?: StringFieldUpdateOperationsInput | string
    confirmationHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    predictions?: PredictionUpdateManyWithoutParticipantNestedInput
    ranking?: RankingSnapshotUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    nationalId?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    participationCode?: StringFieldUpdateOperationsInput | string
    confirmationHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    predictions?: PredictionUncheckedUpdateManyWithoutParticipantNestedInput
    ranking?: RankingSnapshotUncheckedUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantCreateWithoutRankingInput = {
    id?: string
    fullName: string
    nationalId: string
    phone: string
    email?: string | null
    city?: string | null
    participationCode: string
    confirmationHash?: string | null
    submittedAt?: Date | string | null
    isComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    predictions?: PredictionCreateNestedManyWithoutParticipantInput
    payment?: PaymentCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantUncheckedCreateWithoutRankingInput = {
    id?: string
    fullName: string
    nationalId: string
    phone: string
    email?: string | null
    city?: string | null
    participationCode: string
    confirmationHash?: string | null
    submittedAt?: Date | string | null
    isComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    predictions?: PredictionUncheckedCreateNestedManyWithoutParticipantInput
    payment?: PaymentUncheckedCreateNestedOneWithoutParticipantInput
  }

  export type ParticipantCreateOrConnectWithoutRankingInput = {
    where: ParticipantWhereUniqueInput
    create: XOR<ParticipantCreateWithoutRankingInput, ParticipantUncheckedCreateWithoutRankingInput>
  }

  export type ParticipantUpsertWithoutRankingInput = {
    update: XOR<ParticipantUpdateWithoutRankingInput, ParticipantUncheckedUpdateWithoutRankingInput>
    create: XOR<ParticipantCreateWithoutRankingInput, ParticipantUncheckedCreateWithoutRankingInput>
    where?: ParticipantWhereInput
  }

  export type ParticipantUpdateToOneWithWhereWithoutRankingInput = {
    where?: ParticipantWhereInput
    data: XOR<ParticipantUpdateWithoutRankingInput, ParticipantUncheckedUpdateWithoutRankingInput>
  }

  export type ParticipantUpdateWithoutRankingInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    nationalId?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    participationCode?: StringFieldUpdateOperationsInput | string
    confirmationHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    predictions?: PredictionUpdateManyWithoutParticipantNestedInput
    payment?: PaymentUpdateOneWithoutParticipantNestedInput
  }

  export type ParticipantUncheckedUpdateWithoutRankingInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    nationalId?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    participationCode?: StringFieldUpdateOperationsInput | string
    confirmationHash?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    predictions?: PredictionUncheckedUpdateManyWithoutParticipantNestedInput
    payment?: PaymentUncheckedUpdateOneWithoutParticipantNestedInput
  }

  export type MatchCreateManyTeam1Input = {
    id?: string
    matchNumber: number
    group: string
    team2Id: string
    kickoffUtc: Date | string
    venue?: string
    city?: string
    source?: string
    status?: $Enums.MatchStatus
    team1Goals?: number | null
    team2Goals?: number | null
    result?: $Enums.MatchResult | null
    resultUpdatedAt?: Date | string | null
    resultSource?: string | null
    autoDetectedTeam1Goals?: number | null
    autoDetectedTeam2Goals?: number | null
    autoDetectedResult?: $Enums.MatchResult | null
    autoDetectedSource?: string | null
    autoDetectionConfidence?: string | null
    autoDetectedAt?: Date | string | null
    autoResultStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchCreateManyTeam2Input = {
    id?: string
    matchNumber: number
    group: string
    team1Id: string
    kickoffUtc: Date | string
    venue?: string
    city?: string
    source?: string
    status?: $Enums.MatchStatus
    team1Goals?: number | null
    team2Goals?: number | null
    result?: $Enums.MatchResult | null
    resultUpdatedAt?: Date | string | null
    resultSource?: string | null
    autoDetectedTeam1Goals?: number | null
    autoDetectedTeam2Goals?: number | null
    autoDetectedResult?: $Enums.MatchResult | null
    autoDetectedSource?: string | null
    autoDetectionConfidence?: string | null
    autoDetectedAt?: Date | string | null
    autoResultStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchUpdateWithoutTeam1Input = {
    id?: StringFieldUpdateOperationsInput | string
    matchNumber?: IntFieldUpdateOperationsInput | number
    group?: StringFieldUpdateOperationsInput | string
    kickoffUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    team1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    team2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    result?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    resultUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resultSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedTeam1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedTeam2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedResult?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    autoDetectedSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectionConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoResultStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team2?: TeamUpdateOneRequiredWithoutMatchesAsTeam2NestedInput
    predictions?: PredictionUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutTeam1Input = {
    id?: StringFieldUpdateOperationsInput | string
    matchNumber?: IntFieldUpdateOperationsInput | number
    group?: StringFieldUpdateOperationsInput | string
    team2Id?: StringFieldUpdateOperationsInput | string
    kickoffUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    team1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    team2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    result?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    resultUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resultSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedTeam1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedTeam2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedResult?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    autoDetectedSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectionConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoResultStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    predictions?: PredictionUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateManyWithoutTeam1Input = {
    id?: StringFieldUpdateOperationsInput | string
    matchNumber?: IntFieldUpdateOperationsInput | number
    group?: StringFieldUpdateOperationsInput | string
    team2Id?: StringFieldUpdateOperationsInput | string
    kickoffUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    team1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    team2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    result?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    resultUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resultSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedTeam1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedTeam2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedResult?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    autoDetectedSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectionConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoResultStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchUpdateWithoutTeam2Input = {
    id?: StringFieldUpdateOperationsInput | string
    matchNumber?: IntFieldUpdateOperationsInput | number
    group?: StringFieldUpdateOperationsInput | string
    kickoffUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    team1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    team2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    result?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    resultUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resultSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedTeam1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedTeam2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedResult?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    autoDetectedSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectionConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoResultStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team1?: TeamUpdateOneRequiredWithoutMatchesAsTeam1NestedInput
    predictions?: PredictionUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutTeam2Input = {
    id?: StringFieldUpdateOperationsInput | string
    matchNumber?: IntFieldUpdateOperationsInput | number
    group?: StringFieldUpdateOperationsInput | string
    team1Id?: StringFieldUpdateOperationsInput | string
    kickoffUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    team1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    team2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    result?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    resultUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resultSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedTeam1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedTeam2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedResult?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    autoDetectedSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectionConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoResultStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    predictions?: PredictionUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateManyWithoutTeam2Input = {
    id?: StringFieldUpdateOperationsInput | string
    matchNumber?: IntFieldUpdateOperationsInput | number
    group?: StringFieldUpdateOperationsInput | string
    team1Id?: StringFieldUpdateOperationsInput | string
    kickoffUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumMatchStatusFieldUpdateOperationsInput | $Enums.MatchStatus
    team1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    team2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    result?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    resultUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resultSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedTeam1Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedTeam2Goals?: NullableIntFieldUpdateOperationsInput | number | null
    autoDetectedResult?: NullableEnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult | null
    autoDetectedSource?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectionConfidence?: NullableStringFieldUpdateOperationsInput | string | null
    autoDetectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoResultStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictionCreateManyMatchInput = {
    id?: string
    participantId: string
    predictedTeam1Goals: number
    predictedTeam2Goals: number
    predictedResult: $Enums.MatchResult
    points?: number
    isExactScore?: boolean | null
    isCorrectResult?: boolean | null
    goalDifferenceError?: number | null
    createdAt?: Date | string
  }

  export type PredictionUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    predictedTeam1Goals?: IntFieldUpdateOperationsInput | number
    predictedTeam2Goals?: IntFieldUpdateOperationsInput | number
    predictedResult?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    points?: IntFieldUpdateOperationsInput | number
    isExactScore?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isCorrectResult?: NullableBoolFieldUpdateOperationsInput | boolean | null
    goalDifferenceError?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participant?: ParticipantUpdateOneRequiredWithoutPredictionsNestedInput
  }

  export type PredictionUncheckedUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    predictedTeam1Goals?: IntFieldUpdateOperationsInput | number
    predictedTeam2Goals?: IntFieldUpdateOperationsInput | number
    predictedResult?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    points?: IntFieldUpdateOperationsInput | number
    isExactScore?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isCorrectResult?: NullableBoolFieldUpdateOperationsInput | boolean | null
    goalDifferenceError?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictionUncheckedUpdateManyWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    predictedTeam1Goals?: IntFieldUpdateOperationsInput | number
    predictedTeam2Goals?: IntFieldUpdateOperationsInput | number
    predictedResult?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    points?: IntFieldUpdateOperationsInput | number
    isExactScore?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isCorrectResult?: NullableBoolFieldUpdateOperationsInput | boolean | null
    goalDifferenceError?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictionCreateManyParticipantInput = {
    id?: string
    matchId: string
    predictedTeam1Goals: number
    predictedTeam2Goals: number
    predictedResult: $Enums.MatchResult
    points?: number
    isExactScore?: boolean | null
    isCorrectResult?: boolean | null
    goalDifferenceError?: number | null
    createdAt?: Date | string
  }

  export type PredictionUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    predictedTeam1Goals?: IntFieldUpdateOperationsInput | number
    predictedTeam2Goals?: IntFieldUpdateOperationsInput | number
    predictedResult?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    points?: IntFieldUpdateOperationsInput | number
    isExactScore?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isCorrectResult?: NullableBoolFieldUpdateOperationsInput | boolean | null
    goalDifferenceError?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneRequiredWithoutPredictionsNestedInput
  }

  export type PredictionUncheckedUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    predictedTeam1Goals?: IntFieldUpdateOperationsInput | number
    predictedTeam2Goals?: IntFieldUpdateOperationsInput | number
    predictedResult?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    points?: IntFieldUpdateOperationsInput | number
    isExactScore?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isCorrectResult?: NullableBoolFieldUpdateOperationsInput | boolean | null
    goalDifferenceError?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictionUncheckedUpdateManyWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    predictedTeam1Goals?: IntFieldUpdateOperationsInput | number
    predictedTeam2Goals?: IntFieldUpdateOperationsInput | number
    predictedResult?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    points?: IntFieldUpdateOperationsInput | number
    isExactScore?: NullableBoolFieldUpdateOperationsInput | boolean | null
    isCorrectResult?: NullableBoolFieldUpdateOperationsInput | boolean | null
    goalDifferenceError?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



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
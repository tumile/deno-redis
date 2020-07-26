import {
  Bulk,
  BulkNil,
  BulkString,
  ConditionalArray,
  Integer,
  Raw,
  Status,
} from "./io.ts";
import { RedisPipeline } from "./pipeline.ts";
import { RedisSubscription } from "./pubsub.ts";
import {
  StartEndCount,
  XAddFieldValues,
  XClaimOpts,
  XClaimReply,
  XId,
  XIdAdd,
  XIdInput,
  XIdNeg,
  XIdPos,
  XInfoConsumersReply,
  XInfoGroupsReply,
  XInfoStreamFullReply,
  XInfoStreamReply,
  XKeyId,
  XKeyIdGroup,
  XKeyIdGroupLike,
  XKeyIdLike,
  XMaxlen,
  XMessage,
  XPendingCount,
  XPendingReply,
  XReadGroupOpts,
  XReadOpts,
  XReadReply,
} from "./stream.ts";

export interface RedisCommands {
  /**
   * Assign new hash slots to receiving node
   * @param slot
   * @param slots more slots
   */
  cluster_addslots(slot: number, ...slots: number[]): Promise<Status>;

  /**
   * Return the number of failure reports active for a given node
   * @param node_id
   */
  cluster_countfailurereports(node_id: string): Promise<Integer>;

  /**
   * Return the number of local keys in the specified hash slot
   * @param slot
   */
  cluster_countkeysinslot(slot: number): Promise<Integer>;

  /**
   * Set hash slots as unbound in receiving node
   * @param slot
   * @param slots more slots
   */
  cluster_delslots(slot: number, ...slots: number[]): Promise<Status>;

  /**
   * Forces a replica to perform a manual failover of its master
   * @param opt FORCE or TAKEOVER
   */
  cluster_failover(opt?: "FORCE" | "TAKEOVER"): Promise<Status>;

  /**
   * Delete a node's own slots information
   */
  cluster_flushslots(): Promise<Status>;

  /**
   * Remove a node from the nodes table
   * @param node_id
   */
  cluster_forget(node_id: string): Promise<Status>;

  /**
   * Return local key names in the specified hash slot
   * @param slot
   * @param count
   */
  cluster_getkeysinslot(slot: number, count: number): Promise<BulkString[]>;

  /**
   * Provides info about Redis Cluster node state
   */
  cluster_info(): Promise<BulkString>;

  /**
   * Returns the hash slot of the specified key
   * @param key
   */
  cluster_keyslot(key: string): Promise<Integer>;

  /**
   * Force a node cluster to handshake with another node
   * @param ip
   * @param port
   */
  cluster_meet(ip: string, port: number): Promise<Status>;

  /**
   * Return the node id
   */
  cluster_myid(): Promise<BulkString>;

  /**
   * Get Cluster config for the node
   */
  cluster_nodes(): Promise<BulkString>;

  /**
   * List replica nodes of the specified master node
   * @param node_id
   */
  cluster_replicas(node_id: string): Promise<BulkString[]>;

  /**
   * Reconfigure a node as a replica of the specified master node
   * @param node_id
   */
  cluster_replicate(node_id: string): Promise<Status>;

  /**
   * Reset a Redis Cluster node
   * @param opt HARD or SOFT (default)
   */
  cluster_reset(opt?: "HARD" | "SOFT"): Promise<Status>;

  /**
   * Forces the node to save cluster state on disk
   */
  cluster_saveconfig(): Promise<Status>;

  /**
   * Bind a hash slot to a specific node
   * @param slot
   * @param subcommand
   * @param node_id
   */
  cluster_setslot(
    slot: number,
    subcommand: "IMPORTING" | "MIGRATING" | "NODE" | "STABLE",
    node_id?: string,
  ): Promise<Status>;

  /**
   * List replica nodes of the specified master node
   * @param node_id
   */
  cluster_slaves(node_id: string): Promise<BulkString[]>;

  /**
   * Get array of Cluster slot to node mappings
   */
  cluster_slots(): Promise<ConditionalArray>;

  /**
   * Enables read queries for a connection to a cluster replica node
   */
  readonly(): Promise<Status>;

  /**
   * Disables read queries for a connection to a cluster replica node
   */
  readwrite(): Promise<Status>;

  /**
   * Authenticate to the server
   * @param password
   */
  auth(password: string): Promise<Status>;

  /**
   * Authenticate to the server when ACLs are used
   * @param username
   * @param password
   */
  auth(username: string, password: string): Promise<Status>;

  /**
   * Returns the client ID for the current connection
   */
  client_id(): Promise<Integer>;

  /**
   * Kill the connection of a client
   * @param addr address and port in addr:port format
   */
  client_kill(addr: string): Promise<Status>;

  /**
   * Kill the connection of a client using filters
   * @param filters
   */
  client_kill(filters: {
    addr?: string;
    client_id?: string;
    type?: "NORMAL" | "MASTER" | "SLAVE" | "REPLICA" | "PUBSUB";
    user?: string;
    skipme?: "YES" | "NO";
  }): Promise<Integer>;

  /**
   * Get the list of client connections
   * @param type
   */
  client_list(
    type?: "NORMAL" | "MASTER" | "REPLICA" | "PUBSUB",
  ): Promise<BulkString>;

  /**
   * Get the current connection name
   */
  client_getname(): Promise<BulkString>;

  /**
   * Stop processing commands from clients for some time
   * @param timeout amount of time in milliseconds
   */
  client_pause(timeout: number): Promise<Status>;

  /**
   * Set the current connection name
   * @param name
   */
  client_setname(name: string): Promise<Status>;

  /**
   * Unblock a client blocked in a blocking command from a different connection
   * @param client_id
   * @param opt TIMEOUT (default) or ERROR
   */
  client_unblock(
    client_id: number,
    opt?: "TIMEOUT" | "ERROR",
  ): Promise<Integer>;

  /**
   * Echo the given string
   * @param message
   */
  echo(message: string | number): Promise<BulkString>;

  /**
   * Ping the server
   */
  ping(): Promise<Status>;

  /**
   * Ping the server with message
   * @param message
   */
  ping(message: string | number): Promise<BulkString>;

  /**
   * Close the connection
   */
  quit(): Promise<Status>;

  /**
   * Change the selected database for the current connection
   * @param index
   */
  select(index: number): Promise<Status>;

  /**
   * Add an item in the geospatial index represented using a sorted set
   * @param key
   * @param longitude
   * @param latitude
   * @param member
   */
  geoadd(
    key: string,
    longitude: number,
    latitude: number,
    member: string,
  ): Promise<Integer>;

  /**
   * Add one or more geospatial items in the geospatial index represented using a sorted set
   * @param key
   * @param longitude_latitude_member
   */
  geoadd(
    key: string,
    ...longitude_latitude_member: [number, number, string][]
  ): Promise<Integer>;

  /**
   * Returns members of a geospatial index as standard geohash strings
   * @param key
   * @param member
   * @param members more members
   */
  geohash(key: string, member: string, ...members: string[]): Promise<Bulk[]>;

  /**
   * Returns longitude and latitude of members of a geospatial index
   * @param key
   * @param member
   * @param members
   */
  geopos(
    key: string,
    member: string,
    ...members: string[]
  ): Promise<([Integer, Integer] | BulkNil)[]>;

  /**
   * Returns the distance between two members of a geospatial index
   * @param key
   * @param member1
   * @param member2
   * @param unit
   */
  geodist(
    key: string,
    member1: string,
    member2: string,
    unit?: "m" | "km" | "ft" | "mi",
  ): Promise<Bulk>;

  /**
   * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point
   * @param key
   * @param longitude
   * @param latitude
   * @param radius
   * @param unit
   * @param opts more options
   */
  georadius(
    key: string,
    longitude: number,
    latitude: number,
    radius: number,
    unit: "m" | "km" | "ft" | "mi",
    opts?: {
      with_coord?: boolean;
      with_dist?: boolean;
      with_hash?: boolean;
      count?: number;
      sort?: "ASC" | "DESC";
      store?: string;
      store_dist?: string;
    },
  ): Promise<ConditionalArray>;

  /**
   * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member
   * @param key
   * @param member
   * @param radius
   * @param unit
   * @param opts more options
   */
  georadiusbymember(
    key: string,
    member: string,
    radius: number,
    unit: "m" | "km" | "ft" | "mi",
    opts?: {
      with_coord?: boolean;
      with_dist?: boolean;
      with_hash?: boolean;
      count?: number;
      sort?: "ASC" | "DESC";
      store?: string;
      store_dist?: string;
    },
  ): Promise<ConditionalArray>;

  /**
   * Delete one or more hash fields
   * @param key
   * @param field
   * @param fields more fields
   */
  hdel(key: string, field: string, ...fields: string[]): Promise<Integer>;

  /**
   * Determine if a hash field exists
   * @param key
   * @param field
   */
  hexists(key: string, field: string): Promise<Integer>;

  /**
   * Get the value of a hash field
   * @param key
   * @param field
   */
  hget(key: string, field: string): Promise<Bulk>;

  /**
   * Get all the fields and values in a hash
   * @param key
   */
  hgetall(key: string): Promise<BulkString[]>;

  /**
   * Increment the integer value of a hash field by the given number
   * @param key
   * @param field
   * @param increment
   */
  hincrby(key: string, field: string, increment: number): Promise<Integer>;

  /**
   * Increment the float value of a hash field by the given amount
   * @param key
   * @param field
   * @param increment
   */
  hincrbyfloat(
    key: string,
    field: string,
    increment: number,
  ): Promise<BulkString>;

  /**
   * Get all the fields in a hash
   * @param key
   */
  hkeys(key: string): Promise<BulkString[]>;

  /**
   * Get the number of fields in a hash
   * @param key
   */
  hlen(key: string): Promise<Integer>;

  /**
   * Get the values of all the given hash fields
   * @param key
   * @param field
   * @param fields more fields
   */
  hmget(key: string, field: string, ...fields: string[]): Promise<Bulk[]>;

  /**
   * Set hash field to value
   * @deprecated since 4.0, use hset instead
   * @param key
   * @param field
   * @param value
   */
  hmset(key: string, field: string, value: string | number): Promise<Status>;

  /**
   * Set multiple hash fields to multiple values
   * @deprecated since 4.0, use hset instead
   * @param key
   * @param field_values mutiple fields and values
   */
  hmset(key: string, ...field_values: (string | number)[]): Promise<Status>;

  /**
   * Set the string value of a hash field
   * @param key
   * @param field
   * @param value
   */
  hset(key: string, field: string, value: string | number): Promise<Integer>;

  /**
   * Set the string value of a hash field
   * @param key
   * @param field_values mutiple fields and values
   */
  hset(key: string, ...field_values: (string | number)[]): Promise<Integer>;

  /**
   * Set the value of a hash field, only if the field does not exist
   * @param key
   * @param field
   * @param value
   */
  hsetnx(key: string, field: string, value: string | number): Promise<Integer>;

  /**
   * Get the length of the value of a hash field
   * @param key
   * @param field
   */
  hstrlen(key: string, field: string): Promise<Integer>;

  /**
   * Get all the values in a hash
   * @param key
   */
  hvals(key: string): Promise<BulkString[]>;

  /**
   * Incrementally iterate hash fields and associated values
   * @param key
   * @param cursor
   * @param opts more options
   */
  hscan(
    key: string,
    cursor: number,
    opts?: {
      pattern?: string;
      count?: number;
    },
  ): Promise<[BulkString, BulkString[]]>;

  /**
   * Adds the specified elements to the specified HyperLogLog
   * @param key
   * @param element
   * @param elements more elements
   */
  pfadd(
    key: string,
    element: string | number,
    ...elements: (string | number)[]
  ): Promise<Integer>;

  /**
   * Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s)
   * @param key
   * @param keys more keys
   */
  pfcount(key: string, ...keys: string[]): Promise<Integer>;

  /**
   * Merge N different HyperLogLogs into a single one
   * @param destkey
   * @param sourcekey
   * @param sourcekeys more keys
   */
  pfmerge(
    destkey: string,
    sourcekey: string,
    ...sourcekeys: string[]
  ): Promise<Status>;

  /**
   * Delete keys
   * @param key
   * @param keys more keys
   */
  del(key: string, ...keys: string[]): Promise<Integer>;

  /**
   * Return a serialized version of the value stored at the specified key
   * @param key
   */
  dump(key: string): Promise<Bulk>;

  /**
   * Determine if a key exists
   * @param key
   * @param keys more keys
   */
  exists(key: string, ...keys: string[]): Promise<Integer>;

  /**
   * Set a key's time to live in seconds
   * @param key
   * @param seconds
   */
  expire(key: string, seconds: number): Promise<Integer>;

  /**
   * Set the expiration for a key as a UNIX timestamp
   * @param key
   * @param timestamp
   */
  expireat(key: string, timestamp: number): Promise<Integer>;

  /**
   * Find all keys matching the given pattern
   * @param pattern
   */
  keys(pattern: string): Promise<BulkString[]>;

  /**
   * Atomically transfer keys from a Redis instance to another one
   * @param host
   * @param port
   * @param key
   * @param destination_db
   * @param timeout
   * @param opts more options
   */
  migrate(
    host: string,
    port: number,
    key: string,
    destination_db: string,
    timeout: number,
    opts?: {
      copy?: boolean;
      replace?: boolean;
      password?: string;
      keys?: string | string[];
    },
  ): Promise<Status>;

  /**
   * Move a key to another database
   * @param key
   * @param db
   */
  move(key: string, db: string): Promise<Integer>;

  /**
   * Return the number of references of the value associated with the specified key
   * @param key
   */
  object_refcount(key: string): Promise<Integer | BulkNil>;

  /**
   * Return the kind of internal representation used in order to store the value associated with a key
   * @param key
   */
  object_encoding(key: string): Promise<Bulk>;

  /**
   * Return the number of seconds since the object stored at the specified key is idle
   * @param key
   */
  object_idletime(key: string): Promise<Integer | BulkNil>;

  /**
   * Return the logarithmic access frequency counter of the object stored at the specified key
   * @param key
   */
  object_freq(key: string): Promise<Integer>;

  /**
   * Return a succinct help text
   */
  object_help(): Promise<BulkString[]>;

  /**
   * Remove the expiration from a key
   * @param key
   */
  persist(key: string): Promise<Integer>;

  /**
   * Set a key's time to live in milliseconds
   * @param key
   * @param milliseconds
   */
  pexpire(key: string, milliseconds: number): Promise<Integer>;

  /**
   * Set the expiration for a key as a UNIX timestamp specified in milliseconds
   * @param key
   * @param milliseconds_timestamp
   */
  pexpireat(key: string, milliseconds_timestamp: number): Promise<Integer>;

  /**
   * Get the time to live for a key in milliseconds
   * @param key
   */
  pttl(key: string): Promise<Integer>;

  /**
   * Return a random key from the keyspace
   */
  randomkey(): Promise<Bulk>;

  /**
   * Rename a key
   * @param key
   * @param newkey
   */
  rename(key: string, newkey: string): Promise<Status>;

  /**
   * Rename a key, only if the new key does not exist
   * @param key
   * @param newkey
   */
  renamenx(key: string, newkey: string): Promise<Integer>;

  /**
   * Create a key using the provided serialized value, previously obtained using DUMP
   * @param key
   * @param ttl
   * @param serialized_value
   * @param opts more options
   */
  restore(
    key: string,
    ttl: number,
    serialized_value: string,
    opts?: {
      replace?: boolean;
      absttl?: boolean;
      idle_time?: number;
      freq?: number;
    },
  ): Promise<Status>;

  /**
   * Sort the elements in a list, set or sorted set
   * @param key
   * @param opts more options
   */
  sort(
    key: string,
    opts?: {
      by?: string;
      offset?: number;
      count?: number;
      patterns?: string[];
      order?: "ASC" | "DESC";
      alpha?: boolean;
      destination?: string;
    },
  ): Promise<BulkString[] | Integer>;

  /**
   * Alter the last access time of a key(s), return the number of existing keys specified
   * @param key
   * @param keys more keys
   */
  touch(key: string, ...keys: string[]): Promise<Integer>;

  /**
   * Get the time to live for a key
   * @param key
   */
  ttl(key: string): Promise<Integer>;

  /**
   * Determine the type stored at key
   * @param key
   */
  type(key: string): Promise<Status>;

  /**
   * Delete a key asynchronously in another thread, just like DEL, but non blocking
   * @param key
   * @param keys more keys
   */
  unlink(key: string, ...keys: string[]): Promise<Integer>;

  /**
   * Wait for the synchronous replication of all the write commands sent in the context of the current connection
   * @param num_replicas
   * @param timeout
   */
  wait(num_replicas: number, timeout: number): Promise<Integer>;

  /**
   * Incrementally iterate the keys space
   * @param cursor
   * @param opts more options
   */
  scan(
    cursor: number,
    opts?: {
      pattern?: string;
      count?: number;
      type?: string;
    },
  ): Promise<[BulkString, BulkString[]]>;

  /**
   * Remove and get the first element in a list, or block until one is available
   * @param timeout
   * @param keys
   */
  blpop(timeout: number, ...keys: string[]): Promise<Bulk[]>;

  /**
   * Remove and get the last element in a list, or block until one is available
   * @param timeout
   * @param keys
   */
  brpop(timeout: number, ...keys: string[]): Promise<Bulk[]>;

  /**
   * Pop an element from a list, push it to another list and return it; or block until one is available
   * @param source
   * @param destination
   * @param timeout
   */
  brpoplpush(
    source: string,
    destination: string,
    timeout: number,
  ): Promise<Bulk>;

  /**
   * Get an element from a list by its index
   * @param key
   * @param index
   */
  lindex(key: string, index: number): Promise<Bulk>;

  /**
   * Insert an element before or after another element in a list
   * @param key
   * @param loc
   * @param pivot
   * @param value
   */
  linsert(
    key: string,
    loc: "BEFORE" | "AFTER",
    pivot: string,
    value: string | number,
  ): Promise<Integer>;

  /**
   * Get the length of a list
   * @param key
   */
  llen(key: string): Promise<Integer>;

  /**
   * Remove and get the first element in a list
   * @param key
   */
  lpop(key: string): Promise<Bulk>;

  /**
   * Return the index of matching elements on a list
   * @param key
   * @param element
   * @param opts more options
   */
  lpost(
    key: string,
    element: string | number,
    opts?: {
      rank?: number;
      count?: number;
      maxlen?: number;
    },
  ): Promise<Integer>;

  /**
   * Return the index of matching elements on a list
   * @param key
   * @param element
   * @param elements more elements
   */
  lpush(
    key: string,
    element: string | number,
    ...elements: (string | number)[]
  ): Promise<Integer>;

  /**
   * Prepend an element to a list, only if the list exists
   * @param key
   * @param element
   * @param elements more elements
   */
  lpushx(
    key: string,
    element: string | number,
    ...elements: (string | number)[]
  ): Promise<Integer>;

  /**
   * Get a range of elements from a list
   * @param key
   * @param start
   * @param stop
   */
  lrange(key: string, start: number, stop: number): Promise<BulkString[]>;

  /**
   * Remove elements from a list
   * @param key
   * @param count
   * @param value
   */
  lrem(key: string, count: number, value: string | number): Promise<Integer>;

  /**
   * Set the value of an element in a list by its index
   * @param key
   * @param index
   * @param value
   */
  lset(key: string, index: number, value: string | number): Promise<Status>;

  /**
   * Trim a list to the specified range
   * @param key
   * @param start
   * @param stop
   */
  ltrim(key: string, start: number, stop: number): Promise<Status>;

  /**
   * Remove and get the last element in a list
   * @param key
   */
  rpop(key: string): Promise<Bulk>;

  /**
   * Remove the last element in a list, prepend it to another list and return it
   * @param source
   * @param destination
   */
  rpoplpush(source: string, destination: string): Promise<Bulk>;

  /**
   * Append one or multiple elements to a list
   * @param key
   * @param element
   * @param elements more elements
   */
  rpush(
    key: string,
    element: string | number,
    ...elements: (string | number)[]
  ): Promise<Integer>;

  /**
   * Append an element to a list, only if the list exists
   * @param key
   * @param element
   * @param elements more elements
   */
  rpushx(
    key: string,
    element: string | number,
    ...elements: (string | number)[]
  ): Promise<Integer>;

  /**
   * Listen for messages published to channels matching the given patterns
   * @param pattern
   * @param patterns more patterns
   */
  psubscribe(
    pattern: string,
    ...patterns: string[]
  ): Promise<RedisSubscription>;

  /**
   * List the currently active channels
   * @param pattern
   */
  pubsub_channels(pattern: string): Promise<BulkString[]>;

  /**
   * Return the number of subscribers, not counting clients subscribed to patterns, for the specified channels
   * @param channels
   */
  pubsub_numsubs(...channels: string[]): Promise<[BulkString, Integer][]>;

  /**
   * Return the number of subscriptions to patterns that are performed using the PSUBSCRIBE command
   */
  pubsub_numpat(): Promise<Integer>;

  /**
   * Post a message to a channel
   * @param channel
   * @param message
   */
  publish(channel: string, message: string | number): Promise<Integer>;

  /**
   * Listen for messages published to the given channels
   * @param channel
   * @param channels more channels
   */
  subscribe(channel: string, ...channels: string[]): Promise<RedisSubscription>;

  /**
   * Execute a Lua script server side
   * @param script
   * @param numkeys
   * @param keys
   * @param args
   */
  eval(
    script: string,
    numkeys: number,
    keys: string | string[],
    args: (string | number) | (string | number)[],
  ): Promise<Raw>;

  /**
   * Execute a Lua script server side
   * @param sha1
   * @param numkeys
   * @param keys
   * @param args
   */
  evalsha(
    sha1: string,
    numkeys: number,
    keys: string | string[],
    args: (string | number) | (string | number)[],
  ): Promise<Raw>;

  /**
   * Set the debug mode for executed scripts
   * @param mode
   */
  script_debug(mode: "YES" | "SYNC" | "NO"): Promise<Status>;

  /**
   * Check existence of scripts in the script cache
   * @param sha1
   * @param sha1s
   */
  script_exists(sha1: string, ...sha1s: string[]): Promise<Integer[]>;

  /**
   * Remove all scripts from the script cache
   */
  script_flush(): Promise<Status>;

  /**
   * Kill the script currently in execution
   */
  script_kill(): Promise<Status>;

  /**
   * Load the specified Lua script into the script cache
   * @param script
   */
  script_load(script: string): Promise<Status>;

  /**
   * Reload the ACLs from the configured ACL file
   */
  acl_load(): Promise<Status>;

  /**
   * Save the current ACL rules in the configured ACL file
   */
  acl_save(): Promise<Status>;

  /**
   * List the current ACL rules in ACL config file format
   */
  acl_list(): Promise<BulkString[]>;

  /**
   * List the usernames of all the configured ACL rules
   */
  acl_users(): Promise<BulkString[]>;

  /**
   * Get the rules for a specific ACL user
   * @param username
   */
  acl_getuser(username: string): Promise<BulkString[]>;

  /**
   * Modify or create the rules for a specific ACL user
   * @param username
   * @param rules
   */
  acl_setuser(username: string, ...rules: string[]): Promise<Status>;

  /**
   * Remove the specified ACL users and the associated rules
   * @param username
   * @param usernames more users
   */
  acl_deluser(username: string, ...usernames: string[]): Promise<Integer>;

  /**
   * List the ACL categories or the commands inside a category
   * @param category
   */
  acl_cat(category?: string): Promise<BulkString[]>;

  /**
   * Generate a pseudorandom secure password to use for ACL users
   * @param bits
   */
  acl_genpass(bits?: number): Promise<Status>;

  /**
   * Return the name of the user associated to the current connection
   */
  acl_whoami(): Promise<Status>;

  /**
   * List latest events denied because of ACLs in place or reset log
   * @param opt
   */
  acl_log(opt: "RESET" | number): Promise<Status | BulkString[]>;

  /**
   * Show helpful text about the different subcommands
   */
  acl_help(): Promise<BulkString[]>;

  /**
   * Asynchronously rewrite the append-only file
   */
  bgrewriteaof(): Promise<Status>;

  /**
   * Asynchronously save the dataset to disk
   */
  bgsave(schedule?: boolean): Promise<Status>;

  /**
   * Get array of Redis command details
   */
  command(): Promise<
    [BulkString, Integer, BulkString[], Integer, Integer, Integer, BulkString[]]
  >;

  /**
   * Get total number of Redis commands
   */
  command_count(): Promise<Integer>;

  /**
   * Extract keys given a full Redis command
   */
  command_getkeys(): Promise<BulkString[]>;

  /**
   * Get array of specific Redis command details
   * @param command_name
   * @param command_names more commands
   */
  command_info(
    command_name: string,
    ...command_names: string[]
  ): Promise<
    | [
      BulkString,
      Integer,
      BulkString[],
      Integer,
      Integer,
      Integer,
      BulkString[],
    ]
    | BulkNil
  >;

  /**
   * Get the value of a configuration parameter
   * @param parameter
   */
  config_get(parameter: string): Promise<BulkString[]>;

  /**
   * Rewrite the configuration file with the in memory configuration
   */
  config_rewrite(): Promise<Status>;

  /**
   * Set a configuration parameter to the given value
   * @param parameter
   * @param value
   */
  config_set(parameter: string, value: string | number): Promise<Status>;

  /**
   * Reset the stats returned by INFO
   */
  config_resetstat(): Promise<Status>;

  /**
   * Return the number of keys in the selected database
   */
  dbsize(): Promise<Integer>;

  /**
   * Get debugging information about a key
   * @param key
   */
  debug_object(key: string): Promise<Status>;

  /**
   * Make the server crash
   */
  debug_segfault(): Promise<Status>;

  /**
   * Remove all keys from all databases
   * @param async
   */
  flushall(async?: boolean): Promise<Status>;

  /**
   * Remove all keys from the current database
   * @param async
   */
  flushdb(async?: boolean): Promise<Status>;

  /**
   * Get information and statistics about the server
   * @param section
   */
  info(section?: string): Promise<Status>;

  /**
   * Get the UNIX time stamp of the last successful save to disk
   */
  lastsave(): Promise<Integer>;

  /**
   * Outputs memory problems report
   */
  memory_doctor(): Promise<Status>;

  /**
   * Show helpful text about the different subcommands
   */
  memory_help(): Promise<BulkString[]>;

  /**
   * Show allocator internal stats
   */
  memory_malloc_stats(): Promise<Status>;

  /**
   * Ask the allocator to release memory
   */
  memory_purge(): Promise<Status>;

  /**
   * Show memory usage details
   */
  memory_stats(): Promise<ConditionalArray>;

  /**
   * Estimate the memory usage of a key
   * @param key
   * @param samples
   */
  memory_usage(key: string, samples?: number): Promise<Integer>;

  /**
   * List all modules loaded by the server
   */
  module_list(): Promise<BulkString[]>;

  /**
   * Load a module
   * @param path
   * @param args
   */
  module_load(path: string, ...args: string[]): Promise<Status>;

  /**
   * Unload a module
   * @param name
   */
  module_unload(name: string): Promise<Status>;

  /**
   * Return the role of the instance in the context of replication
   */
  role(): Promise<
    | ["master", Integer, BulkString[][]]
    | ["slave", BulkString, Integer, BulkString, Integer]
    | ["sentinel", BulkString[]]
  >;

  /**
   * Synchronously save the dataset to disk
   */
  save(): Promise<Status>;

  /**
   * Synchronously save the dataset to disk and then shut down the server
   * @param opt
   */
  shutdown(opt?: "NOSAVE" | "SAVE"): Promise<Status>;

  /**
   * Make the server a replica of another instance
   * @deprecated since 5.0, use replicaof instead
   * @param host
   * @param port
   */
  slaveof(host: string, port: string | number): Promise<Status>;

  /**
   * Promote the server as master
   * @deprecated since 5.0, use replicaof_noone instead
   */
  slaveof_noone(): Promise<Status>;

  /**
   * Make the server a replica of another instance
   * @param host
   * @param port
   */
  replicaof(host: string, port: string | number): Promise<Status>;

  /**
   * Promote the server as master
   */
  replicaof_noone(): Promise<Status>;

  /**
   * Manage the Redis slow queries log
   * @param subcommand
   * @param args
   */
  slowlog(
    subcommand: string,
    ...args: (string | number)[]
  ): Promise<ConditionalArray>;

  /**
   * Swap two Redis databases
   * @param index
   * @param index2
   */
  swapdb(index: number, index2: number): Promise<Status>;

  /**
   * Return the current server time
   */
  time(): Promise<[BulkString, BulkString]>;

  /**
   * Add one or more members to a set
   * @param key
   * @param member
   * @param members more members
   */
  sadd(
    key: string,
    member: string | number,
    ...members: (string | number)[]
  ): Promise<Integer>;

  /**
   * Get the number of members in a set
   * @param key
   */
  scard(key: string): Promise<Integer>;

  /**
   * Subtract multiple sets
   * @param key
   * @param keys more keys
   */
  sdiff(key: string, ...keys: string[]): Promise<BulkString[]>;

  /**
   * Subtract multiple sets and store the resulting set in a key
   * @param destination
   * @param key
   * @param keys more keys
   */
  sdiffstore(
    destination: string,
    key: string,
    ...keys: string[]
  ): Promise<Integer>;

  /**
   * Intersect multiple sets
   * @param key
   * @param keys more keys
   */
  sinter(key: string, ...keys: string[]): Promise<BulkString[]>;

  /**
   * Intersect multiple sets and store the resulting set in a key
   * @param destination
   * @param key
   * @param keys more keys
   */
  sinterstore(
    destination: string,
    key: string,
    ...keys: string[]
  ): Promise<Integer>;

  /**
   * Determine if a given value is member of a set
   * @param key
   * @param member
   */
  sismember(key: string, member: string | number): Promise<Integer>;

  /**
   * Get all members of a set
   * @param key
   */
  smembers(key: string): Promise<BulkString[]>;

  /**
   * Move a member from one set to another
   * @param source
   * @param destination
   * @param member
   */
  smove(
    source: string,
    destination: string,
    member: string | number,
  ): Promise<Integer>;

  /**
   * Remove and return one or multiple random members from a set
   * @param key
   * @param count
   */
  spop(key: string, count?: number): Promise<Bulk | BulkString[]>;

  /**
   * Get one or multiple random members from a set
   * @param key
   * @param count
   */
  srandmember(key: string, count?: number): Promise<Bulk | BulkString[]>;

  /**
   * Remove one or more members from a set
   * @param key
   * @param member
   * @param members more members
   */
  srem(
    key: string,
    member: string | number,
    ...members: (string | number)[]
  ): Promise<Integer>;

  /**
   * Add multiple sets
   * @param key
   * @param keys more keys
   */
  sunion(key: string, ...keys: string[]): Promise<BulkString[]>;

  /**
   * Add multiple sets and store the resulting set in a key
   * @param destination
   * @param key
   * @param keys more keys
   */
  sunionstore(
    destination: string,
    key: string,
    ...keys: string[]
  ): Promise<Integer>;

  /**
   * Incrementally iterate set elements
   * @param key
   * @param cursor
   * @param opts more options
   */
  sscan(
    key: string,
    cursor: number,
    opts?: {
      pattern?: string;
      count?: number;
    },
  ): Promise<[BulkString, BulkString[]]>;

  /**
   * Remove and return the member with the lowest score from one or more sorted sets, or block until one is available
   * @param timeout
   * @param keys
   */
  bzpopmin(
    timeout: number,
    ...keys: string[]
  ): Promise<[] | [BulkString, BulkString, BulkString]>;

  /**
   * Remove and return the member with the highest score from one or more sorted sets, or block until one is available
   * @param timeout
   * @param keys
   */
  bzpopmax(
    timeout: number,
    ...keys: string[]
  ): Promise<[] | [BulkString, BulkString, BulkString]>;

  /**
   * Add a member to a sorted set, or update its score if it already exists
   * @param key
   * @param score
   * @param member
   * @param opts more options
   */
  zadd(
    key: string,
    score: number,
    member: string | number,
    opts?: {
      mode?: "NX" | "XX";
      changed?: boolean;
      incr?: boolean;
    },
  ): Promise<Integer>;

  /**
   * Add multiple members to a sorted set, or update their scores if they exist
   * @param key
   * @param score_members
   * @param opts
   */
  zadd(
    key: string,
    score_members: [number, string | number][],
    opts?: {
      mode?: "NX" | "XX";
      changed?: boolean;
      incr?: boolean;
    },
  ): Promise<Integer>;

  /**
   * Get the number of members in a sorted set
   * @param key
   */
  zcard(key: string): Promise<Integer>;

  /**
   * Count the members in a sorted set with scores within the given values
   * @param key
   * @param min
   * @param max
   */
  zcount(
    key: string,
    min: string | number,
    max: string | number,
  ): Promise<Integer>;

  /**
   * Increment the score of a member in a sorted set
   * @param key
   * @param increment
   * @param member
   */
  zincrby(
    key: string,
    increment: number,
    member: string | number,
  ): Promise<BulkString>;

  /**
   * Intersect multiple sorted sets and store the resulting sorted set in a new key
   * @param destination
   * @param numkeys
   * @param keys
   * @param opts more options
   */
  zinterstore(
    destination: string,
    numkeys: number,
    keys: string | string[],
    opts?: {
      weights?: number | number[];
      aggregate?: "SUM" | "MIN" | "MAX";
    },
  ): Promise<Integer>;

  /**
   * Count the number of members in a sorted set between a given lexicographical range
   * @param key
   * @param min
   * @param max
   */
  zlexcount(key: string, min: string, max: string): Promise<Integer>;

  /**
   * Remove and return members with the highest scores in a sorted set
   * @param key
   * @param count
   */
  zpopmax(key: string, count?: number): Promise<BulkString[]>;

  /**
   * Remove and return members with the lowest scores in a sorted set
   * @param key
   * @param count
   */
  zpopmin(key: string, count?: number): Promise<BulkString[]>;

  /**
   * Return a range of members in a sorted set, by index
   * @param key
   * @param start
   * @param stop
   * @param opts more options
   */
  zrange(
    key: string,
    start: number,
    stop: number,
    opts?: {
      with_score?: boolean;
    },
  ): Promise<BulkString[]>;

  /**
   * Return a range of members in a sorted set, by lexicographical range
   * @param key
   * @param min
   * @param max
   * @param opts more options
   */
  zrangebylex(
    key: string,
    min: string,
    max: string,
    opts?: {
      offset?: number;
      count?: number;
    },
  ): Promise<BulkString[]>;

  /**
   * Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings
   * @param key
   * @param max
   * @param min
   * @param opts more options
   */
  zrevrangebylex(
    key: string,
    max: string,
    min: string,
    opts?: {
      offset?: number;
      count?: number;
    },
  ): Promise<BulkString[]>;

  /**
   * Return a range of members in a sorted set, by score
   * @param key
   * @param min
   * @param max
   * @param opts more options
   */
  zrangebyscore(
    key: string,
    min: string | number,
    max: string | number,
    opts?: {
      with_score?: boolean;
      offset?: number;
      count?: number;
    },
  ): Promise<BulkString[]>;

  /**
   * Determine the index of a member in a sorted set
   * @param key
   * @param member
   */
  zrank(key: string, member: string | number): Promise<Integer | BulkNil>;

  /**
   * Remove one or more members from a sorted set
   * @param key
   * @param member
   * @param members more members
   */
  zrem(
    key: string,
    member: string | number,
    ...members: (string | number)[]
  ): Promise<Integer>;

  /**
   * Remove all members in a sorted set between the given lexicographical range
   * @param key
   * @param min
   * @param max
   */
  zremrangebylex(key: string, min: string, max: string): Promise<Integer>;

  /**
   * Remove all members in a sorted set within the given indexes
   * @param key
   * @param start
   * @param stop
   */
  zremrangebyrank(key: string, start: number, stop: number): Promise<Integer>;

  /**
   * Remove all members in a sorted set within the given scores
   * @param key
   * @param min
   * @param max
   */
  zremrangebyscore(
    key: string,
    min: string | number,
    max: string | number,
  ): Promise<Integer>;

  /**
   * Return a range of members in a sorted set, by index, with scores ordered from high to low
   * @param key
   * @param start
   * @param stop
   * @param opts more options
   */
  zrevrange(
    key: string,
    start: number,
    stop: number,
    opts?: {
      with_score?: boolean;
    },
  ): Promise<BulkString[]>;

  /**
   * Return a range of members in a sorted set, by score, with scores ordered from high to low
   * @param key
   * @param max
   * @param min
   * @param ops more options
   */
  zrevrangebyscore(
    key: string,
    max: number | number,
    min: number | number,
    ops?: {
      with_score?: boolean;
      offset?: number;
      count?: number;
    },
  ): Promise<BulkString[]>;

  /**
   * Determine the index of a member in a sorted set, with scores ordered from high to low
   * @param key
   * @param member
   */
  zrevrank(key: string, member: string | number): Promise<Integer | BulkNil>;

  /**
   * Get the score associated with the given member in a sorted set
   * @param key
   * @param member
   */
  zscore(key: string, member: string | number): Promise<Bulk>;

  /**
   * Add multiple sorted sets and store the resulting sorted set in a new key
   * @param destination
   * @param keys
   * @param opts more options
   */
  zunionstore(
    destination: string,
    numkeys: number,
    keys: string | string[],
    opts?: {
      weights?: number | number[];
      aggregate?: "SUM" | "MIN" | "MAX";
    },
  ): Promise<Integer>;

  /**
   * Incrementally iterate sorted sets elements and associated scores
   * @param key
   * @param cursor
   * @param opts more options
   */
  zscan(
    key: string,
    cursor: number,
    opts?: {
      pattern?: string;
      count?: number;
    },
  ): Promise<[BulkString, BulkString[]]>;

  /**
   * Append a value to a key
   * @param key
   * @param value
   */
  append(key: string, value: string | number): Promise<Integer>;

  /**
   * Count set bits in a string
   * @param key
   */
  bitcount(key: string): Promise<Integer>;

  /**
   * Count set bits in a string within an interval
   * @param key
   * @param start
   * @param end
   */
  bitcount(key: string, start: number, end: number): Promise<Integer>;

  /**
   * Perform arbitrary bitfield integer operations on strings
   * @param key
   * @param opts more options
   */
  bitfield(
    key: string,
    opts?: {
      get?: { type: string; offset: number | string };
      set?: { type: string; offset: number | string; value: string | number };
      incrby?: { type: string; offset: number | string; increment: number };
      overflow?: "WRAP" | "SAT" | "FAIL";
    },
  ): Promise<(Integer | BulkNil)[]>;

  /**
   * Perform bitwise operations between strings
   * @param operation
   * @param destkey
   * @param key
   * @param keys more keys
   */
  bitop(
    operation: "AND" | "OR" | "XOR" | "NOT",
    destkey: string,
    key: string,
    ...keys: string[]
  ): Promise<Integer>;

  /**
   * Find first bit set or clear in a string
   * @param key
   * @param bit
   * @param start
   * @param end
   */
  bitpos(
    key: string,
    bit: number,
    start?: number,
    end?: number,
  ): Promise<Integer>;

  /**
   * Decrement the integer value of a key by one
   * @param key
   */
  decr(key: string): Promise<Integer>;

  /**
   * Decrement the integer value of a key by the given number
   * @param key
   * @param decrement
   */
  decrby(key: string, decrement: number): Promise<Integer>;

  /**
   * Get the value of a key
   * @param key
   */
  get(key: string): Promise<Bulk>;

  /**
   * Return the bit value at offset in the string value stored at key
   * @param key
   * @param offset
   */
  getbit(key: string, offset: number): Promise<Integer>;

  /**
   * Get a substring of the string stored at a key
   * @param key
   * @param start
   * @param end
   */
  getrange(key: string, start: number, end: number): Promise<BulkString>;

  /**
   * Set the string value of a key and return its old value
   * @param key
   * @param value
   */
  getset(key: string, value: string | number): Promise<Bulk>;

  /**
   * Increment the integer value of a key by one
   * @param key
   */
  incr(key: string): Promise<Integer>;

  /**
   * Increment the integer value of a key by the given amount
   * @param key
   * @param increment
   */
  incrby(key: string, increment: number): Promise<Integer>;

  /**
   * Increment the float value of a key by the given amount
   * @param key
   * @param increment
   */
  incrbyfloat(key: string, increment: number): Promise<BulkString>;

  /**
   * Get the values of all the given keys
   * @param key
   * @param keys more keys
   */
  mget(key: string, ...keys: string[]): Promise<Bulk[]>;

  /**
   * Set a key to a value
   * @param key
   * @param value
   */
  mset(key: string, value: string | number): Promise<Status>;

  /**
   * Set multiple keys to multiple values
   * @param key_values
   */
  mset(...key_values: (string | number)[]): Promise<Status>;

  /**
   * Set a key to a value, only if the key does not exist
   * @param key
   * @param value
   */
  msetnx(key: string, value: string | number): Promise<Integer>;

  /**
   * Set multiple keys to multiple values, only if none of the keys exist
   * @param key_values
   */
  msetnx(...key_values: (string | number)[]): Promise<Integer>;

  /**
   * Set the value and expiration in milliseconds of a key
   * @param key
   * @param milliseconds
   * @param value
   */
  psetex(
    key: string,
    milliseconds: number,
    value: string | number,
  ): Promise<Status>;

  /**
   * Set the string value of a key
   * @param key
   * @param value
   * @param opts
   */
  set(
    key: string,
    value: string | number,
    opts?: {
      px?: number;
      mode?: "NX" | "XX";
      keepttl?: boolean;
    },
  ): Promise<Status | BulkNil>;

  /**
   * Sets or clears the bit at offset in the string value stored at key
   * @param key
   * @param offset
   * @param value
   */
  setbit(key: string, offset: number, value: string | number): Promise<Integer>;

  /**
   * Set the value and expiration of a key
   * @param key
   * @param seconds
   * @param value
   */
  setex(key: string, seconds: number, value: string | number): Promise<Status>;

  /**
   * Set the value of a key, only if the key does not exist
   * @param key
   * @param value
   */
  setnx(key: string, value: string | number): Promise<Integer>;

  /**
   * Overwrite part of a string at key starting at the specified offset
   * @param key
   * @param offset
   * @param value
   */
  setrange(
    key: string,
    offset: number,
    value: string | number,
  ): Promise<Integer>;

  /**
   * Run LCS algorithm against strings
   * @param opts
   */
  stralgo_lcs(opts: {
    keys?: string[];
    strings?: string[];
    len?: boolean;
    idx?: boolean;
    min_match_len?: number;
    with_match_len?: boolean;
  }): Promise<BulkString | Integer | ConditionalArray>;

  /**
   * Get the length of the value stored in a key
   * @param key
   */
  strlen(key: string): Promise<Integer>;

  /**
   * Discard all commands issued after MULTI
   */
  discard(): Promise<Status>;

  /**
   * Execute all commands issued after MULTI
   */
  exec(): Promise<ConditionalArray>;

  /**
   * Mark the start of a transaction block
   */
  multi(): Promise<Status>;

  /**
   * Forget about all watched keys
   */
  unwatch(): Promise<Status>;

  /**
   * Watch the given keys to determine execution of the MULTI/EXEC block
   * @param key
   * @param keys more keys
   */
  watch(key: string, ...keys: string[]): Promise<Status>;

  /**
   * Create a Redis pipeline
   */
  pipeline(): RedisPipeline;

  /**
   * Create a Redis transactional pipeline
   */
  tx(): RedisPipeline;

  /**
   * The XACK command removes one or multiple messages
   * from the pending entries list (PEL) of a stream
   *  consumer group. A message is pending, and as such
   *  stored inside the PEL, when it was delivered to
   * some consumer, normally as a side effect of calling
   *  XREADGROUP, or when a consumer took ownership of a
   *  message calling XCLAIM. The pending message was
   * delivered to some consumer but the server is yet not
   *  sure it was processed at least once. So new calls
   *  to XREADGROUP to grab the messages history for a
   * consumer (for instance using an XId of 0), will
   * return such message. Similarly the pending message
   * will be listed by the XPENDING command, that
   * inspects the PEL.
   *
   * Once a consumer successfully processes a message,
   * it should call XACK so that such message does not
   * get processed again, and as a side effect, the PEL
   * entry about this message is also purged, releasing
   * memory from the Redis server.
   *
   * @param key the stream key
   * @param group the group name
   * @param xids the ids to acknowledge
   */
  xack(key: string, group: string, ...xids: XIdInput[]): Promise<Integer>;
  /**
   * Write a message to a stream.
   *
   * Returns bulk string reply, specifically:
   * The command returns the XId of the added entry.
   * The XId is the one auto-generated if * is passed
   * as XId argument, otherwise the command just returns
   *  the same XId specified by the user during insertion.
   * @param key  write to this stream
   * @param xid the XId of the entity written to the stream
   * @param field_values  record object or map of field value pairs
   */
  xadd(key: string, xid: XIdAdd, field_values: XAddFieldValues): Promise<XId>;
  /**
   * Write a message to a stream.
   *
   * Returns bulk string reply, specifically:
   * The command returns the XId of the added entry.
   * The XId is the one auto-generated if * is passed
   * as XId argument, otherwise the command just returns
   *  the same XId specified by the user during insertion.
   * @param key  write to this stream
   * @param xid the XId of the entity written to the stream
   * @param field_values  record object or map of field value pairs
   * @param maxlen  number of elements, and whether or not to use an approximate comparison
   */
  xadd(
    key: string,
    xid: XIdAdd,
    field_values: XAddFieldValues,
    maxlen: XMaxlen,
  ): Promise<XId>;
  /**
   * In the context of a stream consumer group, this command changes the ownership of a pending message, so that the new owner is the
   * consumer specified as the command argument.
   * 
   * It returns the claimed messages unless called with the JUSTIDs
   * option, in which case it returns only their XIds.
   * 
   * This is a complex command!  Read more at https://redis.io/commands/xclaim
   *
<pre>
XCLAIM mystream mygroup Alice 3600000 1526569498055-0
1) 1) 1526569498055-0
   2) 1) "message"
      2) "orange"
</pre>

   * @param key the stream name
   * @param opts Various arguments for the command.  The following are required:
   *    GROUP: the name of the consumer group which will claim the messages
   *    CONSUMER: the specific consumer which will claim the message
   *    MIN-IDLE-TIME:  claim messages whose idle time is greater than this number (milliseconds)
   * 
   * The command has multiple options which can be omitted, however
   * most are mainly for internal use in order to transfer the
   * effects of XCLAIM or other commands to the AOF file and to
   * propagate the same effects to the slaves, and are unlikely to
   * be useful to normal users:
   *    IDLE <ms>: Set the idle time (last time it was delivered) of the message. If IDLE is not specified, an IDLE of 0 is assumed, that is, the time count is reset because the message has now a new owner trying to process it.
   *    TIME <ms-unix-time>: This is the same as IDLE but instead of a relative amount of milliseconds, it sets the idle time to a specific Unix time (in milliseconds). This is useful in order to rewrite the AOF file generating XCLAIM commands.
   *    RETRYCOUNT <count>: Set the retry counter to the specified value. This counter is incremented every time a message is delivered again. Normally XCLAIM does not alter this counter, which is just served to clients when the XPENDING command is called: this way clients can detect anomalies, like messages that are never processed for some reason after a big number of delivery attempts.
   *    FORCE: Creates the pending message entry in the PEL even if certain specified XIds are not already in the PEL assigned to a different client. However the message must be exist in the stream, otherwise the XIds of non existing messages are ignored.
   *    JUSTXID: Return just an array of XIds of messages successfully claimed, without returning the actual message. Using this option means the retry counter is not incremented.
   * @param xids the message XIds to claim
   */
  xclaim(
    key: string,
    opts: XClaimOpts,
    ...xids: XIdInput[]
  ): Promise<XClaimReply>;
  /**
   * Removes the specified entries from a stream,
   * and returns the number of entries deleted,
   * that may be different from the number of
   * XIds passed to the command in case certain
   * XIds do not exist.
   *
   * @param key the stream key
   * @param xids ids to delete
   */
  xdel(key: string, ...xids: XIdInput[]): Promise<Integer>;
  /**
   * This command is used to create a new consumer group associated
   * with a stream.
   * 
   * <pre>
   XGROUP CREATE test-man-000 test-group $ MKSTREAM
   OK
   </pre>
   * 
   * See https://redis.io/commands/xgroup
   * @param key stream key
   * @param groupName the name of the consumer group
   * @param xid The last argument is the XId of the last
   *            item in the stream to consider already
   *            delivered. In the above case we used the
   *            special XId '$' (that means: the XId of the
   *            last item in the stream). In this case
   *            the consumers fetching data from that
   *            consumer group will only see new elements
   *            arriving in the stream.  If instead you
   *            want consumers to fetch the whole stream
   *            history, use zero as the starting XId for
   *            the consumer group
   * @param mkstream You can use the optional MKSTREAM subcommand as the last argument after the XId to automatically create the stream, if it doesn't exist. Note that if the stream is created in this way it will have a length of 0.
   */
  xgroup_create(
    key: string,
    groupName: string,
    xid: XIdInput | "$",
    mkstream?: boolean,
  ): Promise<Status>;
  /**
   * Delete a specific consumer from a group, leaving
   * the group itself intact.
   * 
   * <pre>
XGROUP DELCONSUMER test-man-000 hellogroup 4
(integer) 0
</pre>
   * @param key stream key
   * @param groupName the name of the consumer group
   * @param consumerName the specific consumer to delete
   */
  xgroup_delconsumer(
    key: string,
    groupName: string,
    consumerName: string,
  ): Promise<Integer>;
  /**
   * Destroy a consumer group completely.  The consumer 
   * group will be destroyed even if there are active 
   * consumers and pending messages, so make sure to
   * call this command only when really needed.
   * 
<pre>
XGROUP DESTROY test-man-000 test-group
(integer) 1
</pre>
   * @param key stream key
   * @param groupName the consumer group to destroy
   */
  xgroup_destroy(key: string, groupName: string): Promise<Integer>;
  /** A support command which displays text about the
   * various subcommands in XGROUP. */
  xgroup_help(): Promise<BulkString>;
  /**
     * Finally it possible to set the next message to deliver
     * using the SETID subcommand. Normally the next XId is set
     * when the consumer is created, as the last argument of
     * XGROUP CREATE. However using this form the next XId can
     * be modified later without deleting and creating the
     * consumer group again. For instance if you want the
     * consumers in a consumer group to re-process all the
     * messages in a stream, you may want to set its next ID
     * to 0:
<pre>
XGROUP SETID mystream consumer-group-name 0
</pre>
     *
     * @param key  stream key
     * @param groupName   the consumer group
     * @param xid the XId to use for the next message delivered
     */
  xgroup_setid(key: string, groupName: string, xid: XIdInput): Promise<Status>;
  xinfo_stream(key: string): Promise<XInfoStreamReply>;
  /**
   *  returns the entire state of the stream, including entries, groups, consumers and PELs. This form is available since Redis 6.0.
   * @param key The stream key
   */
  xinfo_stream_full(key: string, count?: number): Promise<XInfoStreamFullReply>;
  /**
   * Get as output all the consumer groups associated
   * with the stream.
   *
   * @param key the stream key
   */
  xinfo_groups(key: string): Promise<XInfoGroupsReply>;
  /**
   * Get the list of every consumer in a specific
   * consumer group.
   *
   * @param key the stream key
   * @param group list consumers for this group
   */
  xinfo_consumers(key: string, group: string): Promise<XInfoConsumersReply>;
  /**
   * Returns the number of entries inside a stream. If the specified key does not exist the command returns zero, as if the stream was empty. However note that unlike other Redis types, zero-length streams are possible, so you should call TYPE or EXISTS in order to check if a key exists or not.
   * @param key  the stream key to inspect
   */
  xlen(key: string): Promise<Integer>;
  /** Complex command to obtain info on messages in the Pending Entries List.
   *
   * Outputs a summary about the pending messages in a given consumer group.
   *
   * @param key get pending messages on this stream key
   * @param group get pending messages for this group
   */
  xpending(key: string, group: string): Promise<XPendingReply>;
  /**
   * Output more detailed info about pending messages:
   *
   *    - The ID of the message.
   *    - The name of the consumer that fetched the message and has still to acknowledge it. We call it the current owner of the message.
   *    - The number of milliseconds that elapsed since the last time this message was delivered to this consumer.
   *    - The number of times this message was delivered.
   *
   * If you pass the consumer argument to the command, it will efficiently filter for messages owned by that consumer.
   * @param key get pending messages on this stream key
   * @param group get pending messages for this group
   * @param startEndCount start and end: XId range params. you may specify "-" for start and "+" for end. you must also provide a max count of messages.
   * @param consumer optional, filter by this consumer as owner
   */
  xpending_count(
    key: string,
    group: string,
    startEndCount: StartEndCount,
    consumer?: string,
  ): Promise<XPendingCount[]>;
  /**
   * The command returns the stream entries matching a given 
   * range of XIds. The range is specified by a minimum and
   * maximum ID. All the entries having an XId between the
   * two specified or exactly one of the two XIds specified
   * (closed interval) are returned.
   * 
   * The command also has a reciprocal command returning 
   * items in the reverse order, called XREVRANGE, which 
   * is otherwise identical.
   * 
   * The - and + special XIds mean respectively the minimum
   * XId possible and the maximum XId possible inside a stream,
   * so the following command will just return every
   * entry in the stream.

<pre>
XRANGE somestream - +
</pre>
   * @param key  stream key
   * @param start beginning XId, or -
   * @param end  final XId, or +
   * @param count max number of entries to return
   */
  xrange(
    key: string,
    start: XIdNeg,
    end: XIdPos,
    count?: number,
  ): Promise<XMessage[]>;
  /**
   * This command is exactly like XRANGE, but with the
   * notable difference of returning the entries in
   * reverse order, and also taking the start-end range
   * in reverse order: in XREVRANGE you need to state the
   *  end XId and later the start ID, and the command will
   *  produce all the element between (or exactly like)
   * the two XIds, starting from the end side.
   *
   * @param key  the stream key
   * @param start   reading backwards, start from this XId.  for the maximum, specify "+"
   * @param end  stop at this XId.  for the minimum, specify "-"
   * @param count max number of entries to return
   */
  xrevrange(
    key: string,
    start: XIdPos,
    end: XIdNeg,
    count?: number,
  ): Promise<XMessage[]>;
  /**
   * Read data from one or multiple streams, only returning
   * entries with an XId greater than the last received XId
   * reported by the caller.
   * @param key_xids pairs containing the stream key, and
   *                    the XId from which to read
   * @param opts optional max count of entries to return
   *                    for each stream, and number of
   *                    milliseconds for which to block
   */
  xread(
    key_xids: (XKeyId | XKeyIdLike)[],
    opts?: XReadOpts,
  ): Promise<XReadReply>;
  /**
   * The XREADGROUP command is a special version of the XREAD command with support for consumer groups.
   *
   * @param key_ids { key, id } pairs to read
   * @param opts you must specify group name and consumer name.
   *              those must be created using the XGROUP command,
   *              prior to invoking this command.  you may optionally
   *              include a count of records to read, and the number
   *              of milliseconds to block
   */
  xreadgroup(
    key_xids: (XKeyIdGroup | XKeyIdGroupLike)[],
    opts: XReadGroupOpts,
  ): Promise<XReadReply>;

  /**
   * Trims the stream to the indicated number
   * of elements.  
<pre>XTRIM mystream MAXLEN 1000</pre>
   * @param key 
   * @param maxlen 
   */
  xtrim(key: string, maxlen: XMaxlen): Promise<Integer>;
}

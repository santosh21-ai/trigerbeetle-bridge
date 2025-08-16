/**
 * Converts a UUID string to a BigInt.
 * Strips hyphens and parses the hex as a 128-bit integer.
 */
// export function uuidToBigInt(uuid) {
//   console.log("param:", uuid);
//   const hex = uuid.replace(/-/g, "");
//   try {
//     return BigInt("0x" + hex);
//   } catch (error) {
//     console.error("Error converting UUID to BigInt:", error);
//     throw new Error("Invalid UUID format");
//   }
// }

/**
 * Extracts the timestamp portion (first 48 bits) from a UUIDv7.
 * Useful for sorting or indexing.
 */
// export function extractTimestamp(uuid: string): bigint {
//   const hex = uuid.replace(/-/g, '');
//   const timestampHex = hex.slice(0, 12); // First 48 bits
//   return BigInt('0x' + timestampHex);
// }

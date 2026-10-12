// lib/bigint.ts

if (typeof BigInt !== "undefined") {
  // @ts-ignore
  BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return Number.isSafeInteger(int) ? int : this.toString();
  };
}

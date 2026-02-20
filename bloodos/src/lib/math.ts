
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Math Utility (Sample for Unit Testing)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function sum(a: number, b: number): number {
    return a + b;
}

export function multiply(a: number, b: number): number {
    return a * b;
}

export function calculateDiscount(price: number, discountPercentage: number): number {
    if (price < 0 || discountPercentage < 0 || discountPercentage > 100) {
        throw new Error('Invalid input values');
    }
    const discountAmount = price * (discountPercentage / 100);
    return price - discountAmount;
}

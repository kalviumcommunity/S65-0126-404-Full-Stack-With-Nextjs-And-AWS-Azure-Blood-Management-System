
import { sum, multiply, calculateDiscount } from '@/lib/math';

describe('Math Utilities — Coverage Example', () => {

    describe('sum()', () => {
        it('correctly adds two positive numbers', () => {
            // Arrange, Act & Assert tightly bound
            expect(sum(1, 2)).toBe(3);
        });

        it('correctly adds negative numbers', () => {
            expect(sum(-5, 10)).toBe(5);
        });
    });

    describe('multiply()', () => {
        it('correctly multiplies two numbers', () => {
            expect(multiply(5, 5)).toBe(25);
        });
    });

    describe('calculateDiscount()', () => {
        it('returns the discounted price on a valid percentage', () => {
            // Arrange
            const price = 100;
            const discount = 20;

            // Act
            const result = calculateDiscount(price, discount);

            // Assert
            expect(result).toBe(80);
        });

        it('throws an error if price is magically negative', () => {
            // Testing the edge case error boundary to boost Branch Coverage to 100%
            expect(() => {
                calculateDiscount(-100, 20);
            }).toThrow('Invalid input values');
        });

        it('throws an error if discount percentage exceeds 100', () => {
            expect(() => {
                calculateDiscount(100, 150);
            }).toThrow('Invalid input values');
        });

        it('throws an error if discount percentage is negative', () => {
            expect(() => {
                calculateDiscount(100, -5);
            }).toThrow('Invalid input values');
        });
    });

});

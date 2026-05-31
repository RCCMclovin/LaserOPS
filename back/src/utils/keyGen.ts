export function generateRandomString(length = 6): string {
    const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result: string = '';

    // Validate length
    if (typeof length !== 'number' || length <= 0) {
        throw new Error('Length must be a positive integer.');
    }

    for (let i: number = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars.charAt(randomIndex);
    }

    return result;
}
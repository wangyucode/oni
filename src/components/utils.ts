export function calculateGridColumns(count: number): number {
    if (count <= 5) return count;
    
    const candidates = [5, 4, 3];
    let bestCols = 5;
    let bestScore = -1;

    for (const cols of candidates) {
        const remainder = count % cols;
        let score = 0;
        if (remainder === 0) {
            score = 100;
        } else {
            score = remainder / cols;
        }
        
        if (score > bestScore) {
            bestScore = score;
            bestCols = cols;
        }
    }
    return bestCols;
}
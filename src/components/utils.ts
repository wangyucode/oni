export function calculateGridColumns(count: number): number {
    if (count <= 5) return Math.max(count, 2);
    
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

export function getIconData(
    iconMap: Map<string, { icon: string; iconFilter?: string }>,
    name: string,
    icon?: string
): { icon: string; iconFilter?: string } | undefined {
    if (icon && /^https?:\/\//.test(icon)) return { icon };
    return iconMap.get(icon || name);
}

export function calculateGridColumns(count: number, minCols: number = 4): number {
    if (count <= 5) return Math.max(count, minCols);
    if (count > 12) return 5;
    
    const candidates: number[] = [];
    for (let i= minCols; i <= 5; i++) {
        candidates.push(i);
    }
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

/**
 * get `url(#colorMultiply-000000FF)` from `filter: url(#colorMultiply-000000FF);`
 * @param style 
 * @returns 
 */
export function getFilter(style?: string) {
    if (!style) return undefined;
    const match = style.match(/filter:\s*(url\(#[^)]+\))/i);
    return match ? match[1] : undefined;
}

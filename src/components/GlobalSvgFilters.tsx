import React, { useContext, useMemo } from 'react';
import { View } from '@tarojs/components';
import { DataContext } from './DataContext';

export default function GlobalSvgFilters() {
    const { iconMap } = useContext(DataContext);

    const filters = useMemo(() => {
        const uniqueFilters = new Set<string>();
        iconMap.forEach((val) => {
            if (val.iconFilter) {
                // extract id from url("#id")
                const match = val.iconFilter.match(/url\(['"]?#([^'"]+)['"]?\)/);
                if (match && match[1]) {
                    uniqueFilters.add(match[1]);
                }
            }
        });
        return Array.from(uniqueFilters);
    }, [iconMap]);

    if (filters.length === 0) return null;

    return (
        <View style={{ height: 0, width: 0, overflow: 'hidden', position: 'absolute', pointerEvents: 'none', visibility: 'hidden' }}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                <defs>
                    {filters.map(filterId => {
                        if (filterId.startsWith('colorMultiply-')) {
                            const colorHex = filterId.replace('colorMultiply-', '');
                            // Expect RRGGBBAA
                            if (colorHex.length === 8) {
                                const r = (parseInt(colorHex.substring(0, 2), 16) / 255).toFixed(3);
                                const g = (parseInt(colorHex.substring(2, 4), 16) / 255).toFixed(3);
                                const b = (parseInt(colorHex.substring(4, 6), 16) / 255).toFixed(3);
                                
                                // Matrix:
                                // R 0 0 0 0
                                // 0 G 0 0 0
                                // 0 0 B 0 0
                                // 0 0 0 1 0  <-- Keep alpha of original image
                                
                                return (
                                    <filter id={filterId} key={filterId}>
                                        <feColorMatrix
                                            type="matrix"
                                            values={`${r} 0 0 0 0
                                                     0 ${g} 0 0 0
                                                     0 0 ${b} 0 0
                                                     0 0 0 1 0`}
                                        />
                                    </filter>
                                );
                            }
                        }
                        return null;
                    })}
                </defs>
            </svg>
        </View>
    );
}

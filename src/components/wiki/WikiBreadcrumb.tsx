import React, { useImperativeHandle, forwardRef, useState, useContext, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { WikiContext } from '@/contexts/WikiContext';
import { Page } from '@/types/data';

import './WikiBreadcrumb.scss';

export interface WikiBreadcrumbRef {
  onPush: (link: string) => Promise<void>;
}

interface Props {
  onPageChange?: (page: Page) => void;
}

const WikiBreadcrumb = forwardRef<WikiBreadcrumbRef, Props>(({ onPageChange }, ref) => {
  const [stack, setStack] = useState<Page[]>([]);
  const { getPage } = useContext(WikiContext);

  const onPush = useCallback(async (link: string) => {
    try {
      const page = await getPage(link);
      setStack(prev => {
        const next = [...prev, page];
        onPageChange?.(page);
        return next;
      });
    } catch (error) {
      console.error('Failed to push wiki page:', error);
    }
  }, [getPage, onPageChange]);

  const onPopTo = useCallback((index: number) => {
    setStack(prev => {
      const next = prev.slice(0, index + 1);
      const currentPage = next[next.length - 1];
      if (currentPage) {
        onPageChange?.(currentPage);
      }
      return next;
    });
  }, [onPageChange]);

  useImperativeHandle(ref, () => ({
    onPush
  }));

  if (stack.length === 0) return null;

  return (
    <ScrollView scrollX className="wiki-breadcrumb-container">
      <View className="wiki-breadcrumb">
        {stack.map((page, index) => (
          <View key={page.link + index} className="breadcrumb-item-wrapper">
            <Text 
              className={`breadcrumb-item ${index === stack.length - 1 ? 'active' : ''}`}
              onClick={() => index < stack.length - 1 && onPopTo(index)}
            >
              {page.title}
            </Text>
            {index < stack.length - 1 && <Text className="separator">/</Text>}
          </View>
        ))}
      </View>
    </ScrollView>
  );
});

export default WikiBreadcrumb;

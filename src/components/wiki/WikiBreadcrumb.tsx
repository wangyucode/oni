import { useImperativeHandle, forwardRef, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { InterstitialAd } from '@tarojs/taro';
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
  const adRef = useRef<InterstitialAd | null>(null);
  const adLoadedRef = useRef(false);

  const loadAd = useCallback(() => {
    if (process.env.TARO_ENV !== 'weapp') return;
    const ad = adRef.current;
    if (!ad || adLoadedRef.current) return;
    ad.load().catch(() => {});
  }, []);

  const showAd = useCallback(() => {
    if (process.env.TARO_ENV !== 'weapp') return;
    const ad = adRef.current;
    if (!ad) return;
    if (!adLoadedRef.current) {
      loadAd();
      return;
    }
    ad.show().then(() => {
      adLoadedRef.current = false;
      loadAd();
    }).catch(() => {
      adLoadedRef.current = false;
      loadAd();
    });
  }, [loadAd]);

  useEffect(() => {
    if (process.env.TARO_ENV !== 'weapp') return;
    try {
      const ad = Taro.createInterstitialAd({adUnitId: 'adunit-43743fea0e83272c'});
      adRef.current = ad;
      ad.onLoad(() => {
        adLoadedRef.current = true;
      });
      ad.onError(() => {
        adLoadedRef.current = false;
      });
      ad.onClose(() => {
        adLoadedRef.current = false;
        loadAd();
      });
      loadAd();
    } catch (error) {
      console.log(error);
    }
  }, [loadAd]);

  const onPush = useCallback(async (link: string) => {
    if (stack.some(page => page.link === link)) return;
    try {
      const page = await getPage(link);
      loadAd();
      setStack(prev => {
        if (prev.some(p => p.link === link)) return prev;
        const next = [...prev, page];
        onPageChange?.(page);
        if (next.length >= 3 && Math.random() > 0.5) {
          showAd();
        }
        return next;
      });
    } catch (error) {
      console.error('Failed to push wiki page:', error);
    }
  }, [getPage, loadAd, onPageChange, showAd, stack]);

  const onPopTo = useCallback((index: number) => {
    loadAd();
    setStack(prev => {
      const next = prev.slice(0, index + 1);
      const currentPage = next[next.length - 1];
      if (currentPage) {
        onPageChange?.(currentPage);
      }
      return next;
    });
  }, [loadAd, onPageChange]);

  useImperativeHandle(ref, () => ({
    onPush
  }));

  if (stack.length === 0) return null;

  return (
    <ScrollView scrollX className='wiki-breadcrumb-container rounded-8'>
      <View className='wiki-breadcrumb'>
        {stack.map((page, index) => (
          <View key={page.link + index} className='breadcrumb-item-wrapper'>
            <Text 
              className={`breadcrumb-item ${index === stack.length - 1 ? 'active' : ''}`}
              onClick={() => index < stack.length - 1 && onPopTo(index)}
            >
              {page.title}
            </Text>
            {index < stack.length - 1 && <Text className='separator'>/</Text>}
          </View>
        ))}
      </View>
    </ScrollView>
  );
});

export default WikiBreadcrumb;

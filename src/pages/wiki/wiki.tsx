import { useEffect, useRef, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { Divider, Loading } from '@nutui/nutui-react-taro';

import WikiBreadcrumb, { WikiBreadcrumbRef } from '@/components/wiki/WikiBreadcrumb';
import LargeLink from '@/components/wiki/widgets/LargeLink';
import GlobalSvgFilters from '@/components/ui/GlobalSvgFilters';
import { Page } from '@/types/data';

import './wiki.scss';

export default function Wiki() {
  const breadcrumbRef = useRef<WikiBreadcrumbRef>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);

  useEffect(() => {
    onPush("/entry/home");
  }, []);

  function onPush(url: string) {
    breadcrumbRef.current?.onPush(url);
  }

  return (
    <View className='page wiki'>
      <WikiBreadcrumb
        ref={breadcrumbRef}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <View className={`body bg-white rounded-8 p-8 flex flex-col gap-1 ${currentPage ? '' : 'justify-center'}`}>
        {currentPage ? (
          <>
            {currentPage.sections?.map((section, idx) => (
              <View key={idx} className={`section layout-${section.layout}`}>
                {section.widgets?.map((widget, wIdx) => {
                  switch (widget.type) {
                    case 'title':
                      return <Text key={wIdx} className='font-bold text-lg'>{widget.data.text}</Text>;
                    case 'divider':
                      return <Divider key={wIdx} />;
                    case 'large-link':
                      return <LargeLink key={wIdx} data={widget.data} onPush={onPush} />;
                    default:
                      return <View key={wIdx}>[{widget.type}]</View>;
                  }
                })}
              </View>
            ))}
          </>
        ) : (
          <Loading className='loading' />
        )}
      </View>
      <GlobalSvgFilters />
    </View>
  );
}

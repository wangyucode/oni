import { useEffect, useRef, useState } from 'react';
import Image from '@/components/wiki/widgets/Image';
import Conversion from '@/components/wiki/widgets/Conversion';
import { View, Text, AdCustom } from '@tarojs/components';
import { Divider, Loading } from '@nutui/nutui-react-taro';

import WikiBreadcrumb, { WikiBreadcrumbRef } from '@/components/wiki/WikiBreadcrumb';
import LargeLink from '@/components/wiki/widgets/LargeLink';
import Body from '@/components/wiki/widgets/Body';
import GlobalSvgFilters from '@/components/ui/GlobalSvgFilters';
import { Page } from '@/types/data';

import './wiki.scss';
import Video from '@/components/wiki/widgets/Video';
import Grid from '@/components/wiki/widgets/Grid';
import SmallLink from '@/components/wiki/widgets/SmallLink';

export default function Wiki() {
  const breadcrumbRef = useRef<WikiBreadcrumbRef>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);

  useEffect(() => {
    onPush("/entry/home");
  }, []);

  function onPush(url: string) {
    breadcrumbRef.current?.onPush(url);
    setCurrentPage(null);
  }

  return (
    <View className='page wiki'>
      <WikiBreadcrumb
        ref={breadcrumbRef}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <View className={`body bg-white rounded-8 p-8 flex flex-col gap-8 ${currentPage ? '' : 'justify-center'}`}>
        {currentPage ? (
          <>
            {currentPage.sections?.map((section, idx) => (
              <View key={idx} className={`section layout-${section.layout}`}>
                {section.widgets?.map((widget, wIdx) => {
                  switch (widget.type) {
                    case 'title':
                      return <Text key={wIdx} className='font-bold text-lg'>{widget.data.text}</Text>;
                    case 'subtitle':
                    case 'section-header':
                      return <Text key={wIdx} className='font-bold text-md'>{widget.data.text}</Text>;
                    case 'image':
                      return <Image key={wIdx} data={widget.data} />;
                    case 'video':
                      return <Video key={wIdx} />;
                    case 'divider':
                      return <Divider key={wIdx} />;
                    case 'large-link':
                      return <LargeLink key={wIdx} data={widget.data} onPush={onPush} />;
                    case 'small-link':
                      return <SmallLink key={wIdx} data={widget.data} onPush={onPush} />;
                    case 'conversion':
                      return <Conversion key={wIdx} data={widget.data} onPush={onPush} />;
                    case 'grid':
                      return <Grid key={wIdx} data={widget.data} onPush={onPush} />;
                    case 'body':
                      return <Body key={wIdx} data={widget.data} onPush={onPush} />;
                    default:
                      return <View key={wIdx}>[{(widget as any).type}]</View>;
                  }
                })}
              </View>
            ))}
          </>
        ) : (
          <Loading className='loading' />
        )}
        
        {process.env.TARO_ENV === 'weapp' && <AdCustom unitId='adunit-ff208853f5f6f304' adIntervals={30}/>}
      </View>
      <GlobalSvgFilters />
    </View>
  );
}

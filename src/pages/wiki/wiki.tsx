import { useEffect, useRef, useState } from 'react';
import { View } from '@tarojs/components';
import WikiBreadcrumb, { WikiBreadcrumbRef } from '@/components/wiki/WikiBreadcrumb';
import { Page } from '@/types/data';

import './wiki.scss';

export default function Wiki() {
  const breadcrumbRef = useRef<WikiBreadcrumbRef>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);

  useEffect(() => {
    breadcrumbRef.current?.onPush("/entry/home");
  }, []);

  return (
    <View className='page wiki'>
      <WikiBreadcrumb 
        ref={breadcrumbRef} 
        onPageChange={(page) => setCurrentPage(page)} 
      />
      
      <View className="wiki-body">
        {currentPage ? (
          <View className="wiki-page-content">
            <View className="wiki-title">{currentPage.title}</View>
            <View className="wiki-sections">
              {currentPage.sections?.map((section, idx) => (
                <View key={idx} className={`wiki-section layout-${section.layout}`}>
                  {section.widgets?.map((widget, wIdx) => {
                    switch (widget.type) {
                      case 'title':
                        return <View key={wIdx} className="widget-title">{widget.data.text}</View>;
                      case 'body':
                        return (
                          <View key={wIdx} className="widget-body">
                            {widget.data.map((segment, sIdx) => (
                              <View 
                                key={sIdx} 
                                className={`segment-${segment.type} ${segment.type === 'link' ? 'link-text' : ''}`}
                                onClick={() => segment.type === 'link' && segment.data.link && breadcrumbRef.current?.onPush(segment.data.link)}
                              >
                                {segment.data.text}
                              </View>
                            ))}
                          </View>
                        );
                      case 'large-link':
                        return (
                          <View 
                            key={wIdx} 
                            className="widget-large-link"
                            onClick={() => breadcrumbRef.current?.onPush(widget.data.link)}
                          >
                            <View className="link-text">{widget.data.text}</View>
                          </View>
                        );
                      default:
                        return <View key={wIdx}>[{widget.type}]</View>;
                    }
                  })}
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View className="loading">加载中...</View>
        )}
      </View>
    </View>
  );
}

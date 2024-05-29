import { useListItemFocus } from '@hooks/useListItemFocus';
import { ComponentProps, FC, ReactElement, useCallback, useContext, useId } from 'react';
import { Box, BoxProps } from '../Box';
import clone from './lib/clone';
import { TabListContext } from './lib/tabContext';

export type TabListProps = {
  selectedVariant?: string;
  selectedClassName?: string;
} & BoxProps;

export const TabList: FC<TabListProps> = ({
  children,
  selectedVariant,
  selectedClassName,
  ...props
}) => {
  const { listRef, onKeyDown } = useListItemFocus('tab');
  const { selectedTab, selectTab, tabsPrefix } = useContext(TabListContext);
  const select = useCallback((id: string) => selectTab(id), [selectTab]);
  const id = useId();

  const childrenList: ReactElement[] = Array.isArray(children) ? children : [children];

  return (
    <Box as='article' {...props} ref={listRef} role='tablist' aria-label={id} onKeyDown={onKeyDown}>
      {childrenList?.map((child, index) => {
        const key = child.props?.id || `${id}-${index}`;
        const props: ComponentProps<any> = {
          ...child.props,
          onClick: () => {
            child.props?.onClick?.();
            select(key);
          },
          role: 'tab',
          'aria-selected': selectedTab === key,
          'aria-controls': `${tabsPrefix}-tab-panel-${key}`,
          tabIndex: selectedTab === key ? 0 : -1,
          variant: selectedTab === key ? selectedVariant : child.props?.variant,
          className: selectedTab === key ? selectedClassName : child.props?.className
        };

        return clone(child, props);
      })}
    </Box>
  );
};

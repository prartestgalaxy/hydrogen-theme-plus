import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * @param {{
 * connection: React.ComponentProps<typeof Pagination>['connection'];
 * children: React.FunctionComponent<{node: any; index: number}>;
 * resourcesClassName?: string;
 * }}
 */
export function PaginatedResourceSection({
  connection,
  children,
  // We set the default to a 3-column grid to match the Bandage theme layout
  resourcesClassName = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[80px] gap-x-[10px]',
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div className="flex flex-col items-center">
            {/* Load Previous Button */}
            <PreviousLink className="mb-10 px-8 py-3 rounded-full border border-[#23A6F0] text-[#23A6F0] font-bold text-sm hover:bg-[#23A6F0] hover:text-white transition-colors duration-300">
              {isLoading ? 'Loading...' : '↑ Load previous'}
            </PreviousLink>

            {/* The actual grid wrapper where the cards render */}
            <div className={`w-full ${resourcesClassName}`}>
              {resourcesMarkup}
            </div>

            {/* Load More Button */}
            <NextLink className="mt-12 px-8 py-3 rounded-full bg-[#23A6F0] text-white font-bold text-sm hover:opacity-90 transition-opacity duration-300 shadow-sm">
              {isLoading ? 'Loading...' : 'Load more ↓'}
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
}

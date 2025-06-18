import React, { memo, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    image: string;
  };
  images: string[];
  creationAt: string;
  updatedAt: string;
}

interface VirtualizedProductListProps {
  products: Product[];
  height: number;
  itemHeight: number;
}

const VirtualizedProductList: React.FC<VirtualizedProductListProps> = memo(({
  products,
  height,
  itemHeight
}) => {
  // Memoizar a lista para evitar re-renders desnecessários
  const memoizedProducts = useMemo(() => products, [products]);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const product = memoizedProducts[index];
    
    if (!product) return null;

    return (
      <div style={style} className="p-2">
        <ProductCard product={product} />
      </div>
    );
  };

  return (
    <List
      height={height}
      itemCount={memoizedProducts.length}
      itemSize={itemHeight}
      width="100%"
      itemData={memoizedProducts}
    >
      {Row}
    </List>
  );
});

VirtualizedProductList.displayName = 'VirtualizedProductList';

export default VirtualizedProductList; 
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-stone-50 p-6">
        <Skeleton height={200} className="mb-4 rounded-lg" />
        <Skeleton height={24} width="80%" className="mb-3" />
        <Skeleton count={2} height={16} />
        <div className="flex justify-between mt-4 pt-3 border-t border-stone-100">
            <Skeleton width={80} />
            <Skeleton width={50} />
        </div>
    </div>
);

export default SkeletonCard;
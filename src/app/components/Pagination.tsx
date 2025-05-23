import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const getPaginationRange = (totalPages: number, currentPage: number, delta = 2): (number | string)[] => {
    const range: (number | string)[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push('...');

    for (let i = left; i <= right; i++) {
        range.push(i);
    }

    if (right < totalPages - 1) range.push('...');
    if (totalPages > 1) range.push(totalPages);

    return range;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const range = getPaginationRange(totalPages, currentPage);

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2 rounded-md border bg-white disabled:opacity-50"
            >
                <ChevronLeft size={18} />
            </button>

            {range.map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                    className={`px-3 py-1 rounded-md border text-sm ${page === currentPage ? 'bg-[#005025] text-white' : 'bg-white text-gray-700'
                        } ${page === '...' ? 'cursor-default' : 'hover:bg-gray-100'}`}
                >
                    {page}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2 rounded-md border bg-white disabled:opacity-50"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default Pagination;

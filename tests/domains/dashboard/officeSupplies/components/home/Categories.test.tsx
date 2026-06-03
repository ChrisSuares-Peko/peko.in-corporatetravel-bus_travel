import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import Categories from '@domains/dashboard/officeSupplies/components/home/Categories';

const mockCategories: any[] = [
    {
        id: 1,
        categoryName: 'Stationary',
        categoryImage: '/images/stationary.png',
        categoryStatus: 'active',
        createdAt: '2023-08-10',
        updatedAt: '2023-08-15',
        vendorId: 101,
        vendor: 'Vendor 1',
    },
    {
        id: 2,
        categoryName: 'Furniture',
        categoryImage: '/images/furniture.png',
        categoryStatus: 'active',
        createdAt: '2023-08-10',
        updatedAt: '2023-08-15',
        vendorId: 102,
        vendor: 'Vendor 2',
    },
];

describe('Categories Component', () => {
    const setSelectedCategory = vi.fn();
    const setSelectedCategoryName = vi.fn();

    // it('should render loading skeleton when loading', () => {
    //     render(
    //         <Categories
    //             categories={[]}
    //             selectedCategory={null}
    //             isLoading
    //             setSelectedCategory={setSelectedCategory}
    //             setSelectedCategoryName={setSelectedCategoryName}
    //         />
    //     );

    //     // Check if skeleton elements are rendered
    //     const skeletons = screen.getAllByRole('img', { hidden: true });
    //     expect(skeletons.length).toBeGreaterThan(0);
    // });

    it('should render empty state when no categories are available', () => {
        render(
            <Categories
                categories={[]}
                selectedCategory={null}
                isLoading={false}
                setSelectedCategory={setSelectedCategory}
                setSelectedCategoryName={setSelectedCategoryName}
            />
        );

        // Using case-insensitive matching for the "No data" text
        expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });

    it('should render categories when available', () => {
        render(
            <Categories
                categories={mockCategories}
                selectedCategory={null}
                isLoading={false}
                setSelectedCategory={setSelectedCategory}
                setSelectedCategoryName={setSelectedCategoryName}
            />
        );

        expect(screen.getByText('Stationary')).toBeInTheDocument();
        expect(screen.getByText('Furniture')).toBeInTheDocument();
    });

    it('should call setSelectedCategory and setSelectedCategoryName when a category is clicked', () => {
        render(
            <Categories
                categories={mockCategories}
                selectedCategory={null}
                isLoading={false}
                setSelectedCategory={setSelectedCategory}
                setSelectedCategoryName={setSelectedCategoryName}
            />
        );

        const stationaryCategory = screen.getByText('Stationary');
        fireEvent.click(stationaryCategory);

        expect(setSelectedCategory).toHaveBeenCalledWith(1);
        expect(setSelectedCategoryName).toHaveBeenCalledWith('Stationary');
    });

    it('should highlight the selected category', () => {
        render(
            <Categories
                categories={mockCategories}
                selectedCategory={1}
                isLoading={false}
                setSelectedCategory={setSelectedCategory}
                setSelectedCategoryName={setSelectedCategoryName}
            />
        );

        const stationaryCategory = screen.getByText('Stationary');
        expect(stationaryCategory).toHaveClass('text-bgOrange');
    });

    it('should reset to All Categories when the "All" option is clicked', () => {
        render(
            <Categories
                categories={mockCategories}
                selectedCategory={null}
                isLoading={false}
                setSelectedCategory={setSelectedCategory}
                setSelectedCategoryName={setSelectedCategoryName}
            />
        );

        const allCategoriesOption = screen.getByText('All');
        fireEvent.click(allCategoriesOption);

        expect(setSelectedCategory).toHaveBeenCalledWith(null);
        expect(setSelectedCategoryName).toHaveBeenCalledWith('All Categories');
    });
});

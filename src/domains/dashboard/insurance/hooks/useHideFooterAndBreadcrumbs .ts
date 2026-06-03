import { useEffect } from 'react';

const useHideFooterAndBreadcrumbs = () => {
    useEffect(() => {
        // Hide the footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.display = 'none';
        }

        // // Hide elements with the 'ant-breadcrumb' class
        const breadcrumbs = document.querySelectorAll('.ant-breadcrumb');
        breadcrumbs.forEach(breadcrumb => {
            const element = breadcrumb as HTMLElement;
            element.style.margin = '0'; // Sets custom margin
        });
        // // Remove padding from the element with ID 'myContainer'
        // const myContainer = document.getElementById('myContainer');
        // if (myContainer) {
        //     // myContainer.style.padding = '0';
        // }

        // Cleanup function to reset the display properties
        return () => {
            if (footer) {
                footer.style.display = '';
            }
            breadcrumbs.forEach(breadcrumb => {
                const element = breadcrumb as HTMLElement;
                // element.style.margin = '0px 32px 0px 0px'; // Sets custom margin
                element.style.removeProperty('margin');
            });
            // if (myContainer) {
            //     // myContainer.style.removeProperty('padding');
            // }
        };
    }, []);
};

export default useHideFooterAndBreadcrumbs;

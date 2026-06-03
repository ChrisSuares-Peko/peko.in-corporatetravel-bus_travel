import { UserRole } from '@customtypes/general';
import { paths } from '@src/routes/paths';
import { RootState, store } from '@store/store';

export function checkCorporateSidebar(key: string) {
    const { services } = (store.getState() as RootState).reducer.services;
    const hasAccess = services?.data?.find(
        item => item.label.toLowerCase() === key?.toLowerCase().replace('-', ' ') && item.hasAccess
    );
    return hasAccess !== undefined;
}

export function checkSidebarkAccess(key: string) {
    const { services } = (store.getState() as RootState).reducer.services;
    const hasAccess = services?.data?.find(
        item =>
            item.serviceCategory?.toLowerCase() === key?.toLowerCase().replace('-', ' ') &&
            item.hasAccess
    );

    return hasAccess !== undefined;
}

// export function checkSubServicesAccess(key: string) {
//     const { services } = (store.getState() as RootState).reducer.services;
//     const hasAccess = services?.data?.find(item =>
//         item?.services?.find(service => service.hasAccess && service.serviceCategory === key)
//     );
//     return hasAccess !== undefined;
// }
export function checkServiceAccess(serviceCategory: string, key: string) {
    const { services } = (store.getState() as RootState).reducer.services;
    // const hasAccess = services?.data?.find(item =>
    //     item?.services?.find(service => service.hasAccess && service.service === key)
    // );
    const hasAccess = services?.data
        ?.find(
            item =>
                item?.serviceCategory.toLowerCase() ===
                serviceCategory.toLowerCase().replace('-', ' ')
        )
        ?.services.find(service => service.hasAccess && service.service === key);
    return hasAccess !== undefined;
}

// This functions needs to be rewritten so that it will work properly
// export function checkSubServiceChildAccess(key: string) {
//     const { services } = (store.getState() as RootState).reducer.services;
//     const servicesArr: Service[] | undefined = services?.data
//         ?.filter(item => item.services.length > 0)
//         .map(item => item.services)
//         .flat();
//     const childServices: SubService[] | undefined = servicesArr?.map(item => item.services).flat();
//     const hasAccess = childServices?.filter(
//         service => service?.serviceProvider === key && service?.hasAccess
//     );

//     return hasAccess !== undefined;
// }

export function checkSubServiceAccessCorporate(
    serviceCategory: string,
    serviceName: string,
    checkMainLabel: boolean = false
) {
    const { services } = (store.getState() as RootState).reducer.services;
    let hasAccess = services?.data
        ?.find(
            item => item?.label.toLowerCase() === serviceCategory.toLowerCase().replace('-', ' ')
        )
        ?.subServices.find(
            service =>
                service.hasAccess && service.label.toLowerCase() === serviceName.toLowerCase()
        );

    if (checkMainLabel && !hasAccess) {
        hasAccess = services?.data?.find(
            item => item?.label.toLowerCase() === serviceName.toLowerCase().replace('-', ' ')
        );
    }
    return hasAccess !== undefined;
}

export const checkRole = (key: string) => {
    const { role } = (store.getState() as RootState).reducer.auth;
    if (role === UserRole.SYSTEM) return paths.systemUser[key];
    return '';
};

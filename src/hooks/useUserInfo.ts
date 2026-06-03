// Prototype: all backend calls have been removed.
// isLoading is always false so DashboardLayout renders immediately.
export default function useUserInfo() {
    return { isLoading: false, getUserServicesData: async () => {} };
}

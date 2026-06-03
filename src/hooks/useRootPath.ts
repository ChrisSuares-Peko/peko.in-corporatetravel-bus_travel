import { paths } from '@src/routes/paths';

// Prototype: always open the dashboard directly — no auth redirect.
export const useRootPath = () => paths.dashboard.home;

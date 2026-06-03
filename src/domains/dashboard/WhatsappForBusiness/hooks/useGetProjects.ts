import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getAllProjects } from '../api';
import { prjectInfo, Project } from '../types/types';

export default function GetAllProjects(refresh: boolean, Page: number) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [projectDetails, setprojectDetails] = useState<Project[]>();
    const [count, setCount] = useState<number>();
    const [currentPage, setCurrentPage] = useState<number>();
    const [isLoading, setIsLoading] = useState(true);

    const getprojectInfo = useCallback(async () => {
        setIsLoading(true); // Set loading state to true when fetching starts
        const data: prjectInfo | false = await getAllProjects({
            userId: id,
            userType: role,
            page: Page,
        });
        if (data) {
            console.log(data);
            setprojectDetails(data.projects);
            setCount(data.pagination.totalProjects);
            setCurrentPage(data.pagination.currentPage);
        }
        setIsLoading(false);
    }, [id, role, Page]);

    useEffect(() => {
        getprojectInfo();
    }, [getprojectInfo, refresh]);

    return { projectData: projectDetails, count, currentPage, isLoading };
}

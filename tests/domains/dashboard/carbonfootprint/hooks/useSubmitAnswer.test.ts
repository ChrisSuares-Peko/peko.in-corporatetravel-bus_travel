import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { submitAnswers } from '@src/domains/dashboard/carbonFootprint/api';
import useSubmitAnswer from '@src/domains/dashboard/carbonFootprint/hooks/useSubmitAnswer';
import { AnswerSheet } from '@src/domains/dashboard/carbonFootprint/types/dashboard';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

// Mock useNavigate
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

// Mock submitAnswers API call
vi.mock('@src/domains/dashboard/carbonFootprint/api', () => ({
    submitAnswers: vi.fn(),
}));

// Mock useAppSelector
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('useSubmitAnswer', () => {
    const mockNavigate = vi.fn();

    const mockResponseData = {
        data: {
            someKey: 'someValue',
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useAppSelector as any).mockReturnValue({
            role: 'user',
            id: '123',
        });
    });

    it('should submit answers and navigate to the result page', async () => {
        (submitAnswers as any).mockResolvedValue(mockResponseData);

        const mockAnswerSheet: AnswerSheet = {
            1: {
                category: 'Category 1',
                type: 'Type 1',
                answers: [
                    {
                        1: {
                            1: {
                                selectedUnitId: 1,
                                value: 'Answer 1',
                            },
                        },
                    },
                ],
            },
        };

        const { result } = renderHook(() => useSubmitAnswer());

        await act(async () => {
            await result.current.getData('BASIC', mockAnswerSheet);
        });

        expect(result.current.btnLoading).toBe(false);
        expect(submitAnswers).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            questionType: 'BASIC',
            answers: mockAnswerSheet,
        });
        expect(mockNavigate).toHaveBeenCalledWith(paths.zeroCarbon.result, {
            state: {
                data: mockResponseData.data,
                advanced: true,
            },
        });
    });

    it('should set loading state during API call', async () => {
        (submitAnswers as any).mockResolvedValue(mockResponseData);

        const { result } = renderHook(() => useSubmitAnswer());

        act(() => {
            result.current.getData('BASIC', {} as AnswerSheet);
        });

        expect(result.current.btnLoading).toBe(true);

        await act(async () => {
            // Wait for the API call to complete
        });

        expect(result.current.btnLoading).toBe(false);
    });

    it('should handle failed API call gracefully', async () => {
        (submitAnswers as any).mockResolvedValue(false);

        const { result } = renderHook(() => useSubmitAnswer());

        await act(async () => {
            await result.current.getData('BASIC', {} as AnswerSheet);
        });

        expect(result.current.btnLoading).toBe(false);
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});

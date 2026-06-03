import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { getQuestions } from '@src/domains/dashboard/carbonFootprint/api';
import useGetQuestions from '@src/domains/dashboard/carbonFootprint/hooks/useGetQuestions';
import { AnswerSheet } from '@src/domains/dashboard/carbonFootprint/types/dashboard';

// Mock data
const mockQuestionSheet = [
    {
        id: 1,
        category: 'Category One',
        questions: [
            {
                id: 1,
                question: 'Question 1',
                toolTip: 'This is a tooltip',
                options: [
                    {
                        id: 1,
                        title: 'Option 1',
                        units: [
                            {
                                id: 1,
                                EF: 2.5,
                                unit: 'kg',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    // Add more categories and questions as needed
];

const mockAnswerSheet: AnswerSheet = {
    1: {
        category: 'Category One',
        type: 'text',
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

const mockQuestionsResponse = {
    data: {
        questionSheet: mockQuestionSheet,
        answerSheet: mockAnswerSheet,
    },
};

// Mock the API call
vi.mock('@src/domains/dashboard/carbonFootprint/api', () => ({
    getQuestions: vi.fn(),
}));

// Mock the useAppSelector hook
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn().mockReturnValue({
        role: 'admin',
        id: 123,
    }),
}));

describe('useGetQuestions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch advanced questions and update state', async () => {
        (getQuestions as any).mockResolvedValue(mockQuestionsResponse);

        const { result } = renderHook(() => useGetQuestions(true));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.questionSheet).toEqual(mockQuestionSheet);
        expect(result.current.answerSheet).toEqual(mockAnswerSheet);
        expect(result.current.advancedCal).toBe(true);
    });

    it('should fetch basic questions and update state', async () => {
        (getQuestions as any).mockResolvedValue(mockQuestionsResponse);

        const { result } = renderHook(() => useGetQuestions(false));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.questionSheet).toEqual(mockQuestionSheet);
        expect(result.current.answerSheet).toEqual(mockAnswerSheet);
        expect(result.current.advancedCal).toBe(false);
    });

    it('should handle API failure gracefully', async () => {
        (getQuestions as any).mockResolvedValue(false);

        const { result } = renderHook(() => useGetQuestions(true));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.questionSheet).toBeUndefined();
        expect(result.current.answerSheet).toEqual({});
        expect(result.current.advancedCal).toBe(true);
    });
});

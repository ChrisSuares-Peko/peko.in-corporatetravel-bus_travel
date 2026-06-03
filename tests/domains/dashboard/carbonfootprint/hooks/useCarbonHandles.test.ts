import { renderHook, act } from '@testing-library/react';
import { it, describe, expect, vi, beforeEach } from 'vitest';

import useCarbonHandles from '@src/domains/dashboard/carbonFootprint/hooks/useCarbonHandles';
import {
    AnswerSheet,
    ValidateAnswers,
} from '@src/domains/dashboard/carbonFootprint/types/dashboard';

describe('useCarbonHandles', () => {
    const mockAnswerSheet: AnswerSheet = {
        '35': {
            category: 'Energy and Utilities',
            type: 'BASIC',
            answers: [
                {
                    '60715272': {
                        '85446208': {
                            selectedUnitId: null,
                            value: null,
                        },
                    },
                },
            ],
        },
    };

    const mockQuestionNum: ValidateAnswers = {
        '35': false,
    };

    const setAnswerSheet = vi.fn();
    const setQuestionNum = vi.fn();
    const getData = vi.fn();

    beforeEach(() => {
        setAnswerSheet.mockClear();
        setQuestionNum.mockClear();
        getData.mockClear();
    });

    it('should handle answer change correctly', async () => {
        setAnswerSheet.mockImplementation(updateFn => {
            const updatedSheet = updateFn(mockAnswerSheet);
            const categoryID = 35;
            if (updatedSheet[categoryID].answers[0]['60715272']['85446208'].value !== null) {
                setQuestionNum({ '35': true });
            }
        });

        const { result } = renderHook(() =>
            useCarbonHandles({
                setAnswerSheet,
                setQuestionNum,
                answerSheet: mockAnswerSheet,
                questionNum: mockQuestionNum,
                advancedCal: false,
                getData,
            })
        );

        act(() => {
            result.current.handleAnswerChange(35, 60715272, 85446208, 46552501, '100');
        });

        expect(setAnswerSheet).toHaveBeenCalled();
        expect(setQuestionNum).toHaveBeenCalledWith({ '35': true });
    });

    it('should handle electricity change correctly', () => {
        const { result } = renderHook(() =>
            useCarbonHandles({
                setAnswerSheet,
                setQuestionNum,
                answerSheet: mockAnswerSheet,
                questionNum: mockQuestionNum,
                advancedCal: false,
                getData,
            })
        );

        act(() => {
            result.current.handleElectricityChange(35, 60715272, undefined, 85446208);
        });

        expect(setAnswerSheet).toHaveBeenCalled();
    });

    it('should call getData with correct parameters on handleSubmit', () => {
        const { result } = renderHook(() =>
            useCarbonHandles({
                setAnswerSheet,
                setQuestionNum,
                answerSheet: mockAnswerSheet,
                questionNum: mockQuestionNum,
                advancedCal: true,
                getData,
            })
        );

        act(() => {
            result.current.handleSubmit();
        });

        expect(getData).toHaveBeenCalledWith('ADVANCED', mockAnswerSheet);
    });

    it('should return false when not all answers are filled', () => {
        const partiallyFilledAnswerSheet: AnswerSheet = {
            '35': {
                category: 'Energy and Utilities',
                type: 'BASIC',
                answers: [
                    {
                        '60715272': {
                            '85446208': {
                                selectedUnitId: 46552501,
                                value: null, // This should be null to simulate an unfilled answer
                            },
                        },
                    },
                ],
            },
        };

        const { result } = renderHook(() =>
            useCarbonHandles({
                setAnswerSheet,
                setQuestionNum,
                answerSheet: partiallyFilledAnswerSheet,
                questionNum: mockQuestionNum,
                advancedCal: false,
                getData,
            })
        );

        const allAnswered = result.current.checkAllAnswers(35, partiallyFilledAnswerSheet);

        expect(allAnswered).toBe(false); // Now it should correctly return false
    });

    it('should return true when all answers are filled', () => {
        const filledAnswerSheet: AnswerSheet = {
            '35': {
                category: 'Energy and Utilities',
                type: 'BASIC',
                answers: [
                    {
                        '60715272': {
                            '85446208': {
                                selectedUnitId: 46552501,
                                value: 100,
                            },
                        },
                    },
                ],
            },
        };

        const { result } = renderHook(() =>
            useCarbonHandles({
                setAnswerSheet,
                setQuestionNum,
                answerSheet: filledAnswerSheet,
                questionNum: mockQuestionNum,
                advancedCal: false,
                getData,
            })
        );

        const allAnswered = result.current.checkAllAnswers(35, filledAnswerSheet);

        expect(allAnswered).toBe(true);
    });
});

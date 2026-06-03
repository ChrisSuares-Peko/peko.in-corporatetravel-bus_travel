import { render, screen, fireEvent } from '@testing-library/react';
import { it, describe, expect, vi } from 'vitest';

import Question from '@src/domains/dashboard/carbonFootprint/components/dashboard/CarbonForm/Question';
import {
    AnswerSheet,
    Category,
    ValidateAnswers,
} from '@src/domains/dashboard/carbonFootprint/types/dashboard';

describe('Question Component', () => {
    const mockQuestionSheet: Category[] = [
        {
            id: 1,
            category: 'General',
            questions: [
                {
                    id: 1,
                    question: 'How many people are in your household?',
                    toolTip: 'Enter the number of people living in your household.',
                    options: [
                        {
                            id: 1,
                            title: 'People',
                            units: [{ id: 1, EF: 1, unit: 'person' }],
                        },
                    ],
                },
            ],
        },
    ];

    const mockAnswerSheet: AnswerSheet = {
        1: {
            category: 'General',
            type: 'Numeric',
            answers: [
                {
                    1: {
                        1: { selectedUnitId: 1, value: '3' },
                    },
                },
            ],
        },
    };

    const mockQuestionNum: ValidateAnswers = {
        1: true,
    };

    const mockProps = {
        questionSheet: mockQuestionSheet,
        handleAnswerChange: vi.fn(),
        handleSubmit: vi.fn(),
        answerSheet: mockAnswerSheet,
        questionNum: mockQuestionNum,
        btnLoading: false,
        handleElectricityChange: vi.fn(),
    };

    it('should render the component with all elements', () => {
        render(<Question {...mockProps} />);

        expect(
            screen.getByText(/Calculate Your Carbon Footprint and Start Taking Action/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Question: 1\/1/i)).toBeInTheDocument();
        expect(screen.getByText(/How many people are in your household?/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/People/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Submit/i)[0]).toBeInTheDocument();
    });

    it('should call handleSubmit when the submit button is clicked', () => {
        render(<Question {...mockProps} />);

        const submitButton = screen.getAllByText(/Submit/i)[0];
        fireEvent.click(submitButton);

        expect(mockProps.handleSubmit).toHaveBeenCalled();
    });

    it('should enable the submit button if all questions are answered', () => {
        const completeQuestionNum = { 1: true, 2: true }; // Simulating all questions answered
        const completeQuestionSheet = [
            ...mockQuestionSheet,
            {
                id: 2,
                category: 'General',
                questions: [
                    {
                        id: 2,
                        question: 'What is your total household income?',
                        toolTip: 'Enter your household income.',
                        options: [
                            {
                                id: 2,
                                title: 'Income',
                                units: [{ id: 2, EF: 1, unit: 'currency' }],
                            },
                        ],
                    },
                ],
            },
        ];
        const completeProps = {
            ...mockProps,
            questionNum: completeQuestionNum,
            questionSheet: completeQuestionSheet,
        };

        render(<Question {...completeProps} />);

        const submitButton = document.getElementById('question-submit');
        expect(submitButton).not.toBeDisabled(); // Button should be enabled
    });

    it('should call handleAnswerChange when an input value is changed', () => {
        render(<Question {...mockProps} />);

        const input = screen.getAllByPlaceholderText(/People/i)[0];
        fireEvent.change(input, { target: { value: '4' } });

        expect(mockProps.handleAnswerChange).toHaveBeenCalled();
    });
});

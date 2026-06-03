import { render, screen, fireEvent } from '@testing-library/react';
import { it, describe, expect, vi } from 'vitest';

import QuestionSteps from '@src/domains/dashboard/carbonFootprint/components/dashboard/CarbonForm/QuestionSteps';
import {
    AnswerSheet,
    Category,
    question,
} from '@src/domains/dashboard/carbonFootprint/types/dashboard';

describe('QuestionSteps Component', () => {
    const mockQuestion: question = {
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
    };

    const mockCategory: Category = {
        id: 1,
        category: 'General',
        questions: [mockQuestion],
    };

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

    const mockProps = {
        idx: 0,
        questions: mockQuestion,
        category: mockCategory,
        handleAnswerChange: vi.fn(),
        answerSheet: mockAnswerSheet,
        handleElectricityChange: vi.fn(),
    };

    it('should render the question text and tooltip', () => {
        render(<QuestionSteps {...mockProps} />);

        expect(screen.getByText(/How many people are in your household?/i)).toBeInTheDocument();

        const imgs = screen.getAllByRole('img');
        const toolTipIcon = imgs.find(img => img.getAttribute('aria-label') === 'info-circle');
        expect(toolTipIcon).toBeInTheDocument();
    });

    it('should render the input and select elements', () => {
        render(<QuestionSteps {...mockProps} />);

        const inputs = screen.getAllByPlaceholderText(/People/i);
        expect(inputs.length).toBeGreaterThan(0);

        const selects = screen.getAllByRole('combobox');
        expect(selects.length).toBeGreaterThan(0);
    });

    it('should call handleAnswerChange when the input value changes', () => {
        render(<QuestionSteps {...mockProps} />);

        const inputs = screen.getAllByPlaceholderText(/People/i);
        const input = inputs[0];
        fireEvent.change(input, { target: { value: '4' } });

        expect(mockProps.handleAnswerChange).toHaveBeenCalledWith(
            mockCategory.id,
            mockQuestion.id,
            mockQuestion.options[0].id,
            mockQuestion.options[0].units[0].id,
            '4'
        );
    });
});

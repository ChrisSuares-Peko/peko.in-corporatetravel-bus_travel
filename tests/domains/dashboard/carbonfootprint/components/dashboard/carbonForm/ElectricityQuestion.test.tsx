import { render, screen, fireEvent } from '@testing-library/react';
import { it, describe, expect, vi } from 'vitest';

import ElectricityQuestion from '@src/domains/dashboard/carbonFootprint/components/dashboard/CarbonForm/ElectricityQuestion';
import {
    AnswerSheet,
    Category,
    question,
} from '@src/domains/dashboard/carbonFootprint/types/dashboard';

describe('ElectricityQuestion Component', () => {
    const mockQuestion: question = {
        id: 1,
        question: 'Electricity usage',
        toolTip: 'Enter your electricity usage',
        options: [
            {
                id: 1,
                title: 'Middle East',
                units: [{ id: 1, EF: 1, unit: 'kWh' }],
            },
            {
                id: 2,
                title: 'Europe',
                units: [{ id: 2, EF: 1, unit: 'kWh' }],
            },
        ],
    };

    const mockCategory: Category = {
        id: 1,
        category: 'Electricity',
        questions: [mockQuestion],
    };

    const mockAnswerSheet: AnswerSheet = {
        1: {
            category: 'Electricity',
            type: 'Numeric',
            answers: [
                {
                    1: {
                        1: { selectedUnitId: 1, value: '100' },
                    },
                },
            ],
        },
    };

    const mockProps = {
        questions: mockQuestion,
        category: mockCategory,
        handleAnswerChange: vi.fn(),
        answerSheet: mockAnswerSheet,
        handleElectricityChange: vi.fn(),
    };

    it('should render the component with default electricity option selected', () => {
        render(<ElectricityQuestion {...mockProps} />);
        const selectElement = screen.getByTestId('electricity-select');
        expect(selectElement.classList).toContain('ant-select-disabled');
        expect(selectElement).toHaveTextContent('Middle East');
    });

    it('should call handleAnswerChange on input change', () => {
        render(<ElectricityQuestion {...mockProps} />);
        const inputElement = screen.getByTestId('electricity-input');
        fireEvent.change(inputElement, { target: { value: '200' } });
        expect(mockProps.handleAnswerChange).toHaveBeenCalledWith(
            mockCategory.id,
            mockQuestion.id,
            mockQuestion.options[0].id,
            mockAnswerSheet[1].answers[0][mockQuestion.id][mockQuestion.options[0].id]
                ?.selectedUnitId,
            '200'
        );
    });

    it('should call handleAnswerChange on unit change', async () => {
        render(<ElectricityQuestion {...mockProps} />);
        const unitSelect = screen.getByTestId('unit-select');
        fireEvent.mouseDown(unitSelect); // Open the dropdown

        const option = await screen.findByText('kWh');
        fireEvent.click(option);

        // Retrieve the last call to handleAnswerChange
        const lastCall =
            mockProps.handleAnswerChange.mock.calls[
                mockProps.handleAnswerChange.mock.calls.length - 1
            ];

        // Expect the specific call that matches your expectations
        expect(lastCall).toEqual([
            mockCategory.id,
            mockQuestion.id,
            mockQuestion.options[0].id,
            1, // The ID for kWh
            null, // Expecting the previous value, change this if it’s valid to receive null
        ]);
    });

    it('should set the electricity option based on useEffect', () => {
        render(<ElectricityQuestion {...mockProps} />);
        const inputElement = screen.getByTestId('electricity-input');
        expect(inputElement).toHaveValue('100');
    });
});

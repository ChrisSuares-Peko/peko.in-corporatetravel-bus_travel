import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useAppSelector } from '@src/hooks/store';

import usePasswordValidation from '../../hooks/usePasswordValidation';

// Mock useAppSelector
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('usePasswordValidation', () => {
    it('should return an error when password is empty and level is 1 or higher', () => {
        (useAppSelector as any).mockReturnValue({ level: 1, minLength: 8 });

        const { result } = renderHook(() => usePasswordValidation());

        const errors = result.current.validatePassword('');
        expect(errors).toEqual(['Password cannot be empty.']);
    });

    it('should return an error when password is shorter than minLength and level is 2 or higher', () => {
        (useAppSelector as any).mockReturnValue({ level: 2, minLength: 10 });

        const { result } = renderHook(() => usePasswordValidation());

        const errors = result.current.validatePassword('short');
        expect(errors).toEqual(['Password must be at least 10 characters long.']);
    });

    it('should return errors when password does not meet level 3 criteria (missing lowercase, uppercase, and number)', () => {
        (useAppSelector as any).mockReturnValue({ level: 3, minLength: 8 });

        const { result } = renderHook(() => usePasswordValidation());

        const errors = result.current.validatePassword('Password');
        expect(errors).toEqual(['Password must contain at least one number.']);
    });

    it('should return an error when password does not contain a special character at level 4', () => {
        (useAppSelector as any).mockReturnValue({ level: 4, minLength: 8 });

        const { result } = renderHook(() => usePasswordValidation());

        const errors = result.current.validatePassword('Password1');
        expect(errors).toEqual(['Password must contain at least one special character.']);
    });

    it('should return an error when password contains more than 2 consecutive repeated characters at level 5', () => {
        (useAppSelector as any).mockReturnValue({ level: 5, minLength: 8 });

        const { result } = renderHook(() => usePasswordValidation());

        const errors = result.current.validatePassword('Passssword1!');
        expect(errors).toEqual([
            'Password cannot contain two or more consecutive repeated characters.',
        ]);
    });

    it('should return multiple errors for a password that fails multiple criteria', () => {
        (useAppSelector as any).mockReturnValue({ level: 5, minLength: 10 });

        const { result } = renderHook(() => usePasswordValidation());

        const errors = result.current.validatePassword('pass');
        expect(errors).toEqual([
            'Password must be at least 10 characters long.',
            'Password must contain at least one uppercase letter.',
            'Password must contain at least one number.',
            'Password must contain at least one special character.',
            'Password cannot contain two or more consecutive repeated characters.',
        ]);
    });

    it('should return no errors for a password that meets all criteria for the given level', () => {
        (useAppSelector as any).mockReturnValue({ level: 5, minLength: 8 });

        const { result } = renderHook(() => usePasswordValidation());

        const errors = result.current.validatePassword('Paesw0rd!');
        expect(errors).toEqual([]);
    });

    it('should return an empty array if no password policy is provided', () => {
        (useAppSelector as any).mockReturnValue({});

        const { result } = renderHook(() => usePasswordValidation());

        const errors = result.current.validatePassword('Passw0rd!');
        expect(errors).toEqual([]);
    });
});

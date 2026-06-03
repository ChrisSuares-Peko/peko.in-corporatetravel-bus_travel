import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import usePasswordPolicyValidation from '../../hooks/usePasswordPolicyValidation';

describe('usePasswordPolicyValidation', () => {
    it('should return an error when password is empty and level is 1 or higher', () => {
        const { result } = renderHook(() => usePasswordPolicyValidation([{ level: 1 }]));

        const errors = result.current.validatePassword('');
        expect(errors).toEqual(['Password cannot be empty.']);
    });

    it('should return an error when password is shorter than minLength and level is 2 or higher', () => {
        const { result } = renderHook(() =>
            usePasswordPolicyValidation([{ level: 2, minLength: 10 }])
        );

        const errors = result.current.validatePassword('short');
        expect(errors).toEqual(['Password must be at least 10 characters long.']);
    });

    it('should return errors when password does not meet level 3 criteria (missing lowercase, uppercase, and number)', () => {
        const { result } = renderHook(() => usePasswordPolicyValidation([{ level: 3 }]));

        const errors = result.current.validatePassword('Password');
        expect(errors).toEqual(['Password must contain at least one number.']);
    });

    it('should return an error when password does not contain a special character at level 4', () => {
        const { result } = renderHook(() => usePasswordPolicyValidation([{ level: 4 }]));

        const errors = result.current.validatePassword('Password1');
        expect(errors).toEqual(['Password must contain at least one special character.']);
    });

    it('should return an error when password contains two or more consecutive repeated characters at level 5', () => {
        const { result } = renderHook(() => usePasswordPolicyValidation([{ level: 5 }]));

        const errors = result.current.validatePassword('Passssword1!');
        expect(errors).toEqual([
            'Password cannot contain two or more consecutive repeated characters.',
        ]);
    });

    it('should return multiple errors for a password that fails multiple criteria', () => {
        const { result } = renderHook(() =>
            usePasswordPolicyValidation([{ level: 5, minLength: 10 }])
        );

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
        const { result } = renderHook(() =>
            usePasswordPolicyValidation([{ level: 5, minLength: 8 }])
        );

        const errors = result.current.validatePassword('Pasew0rd!');
        expect(errors).toEqual([]);
    });

    it('should return no errors if no passwordPolicy is provided', () => {
        const { result } = renderHook(() => usePasswordPolicyValidation([]));

        const errors = result.current.validatePassword('Passw0rd!');
        expect(errors).toEqual([]);
    });

    it('should default to a minimum length of 8 if no minLength is provided in the password policy', () => {
        const { result } = renderHook(() => usePasswordPolicyValidation([{ level: 2 }]));

        const errors = result.current.validatePassword('short');
        expect(errors).toEqual(['Password must be at least 8 characters long.']);
    });
});

import { describe, it, expect } from 'vitest';

import usePasswordPolicyValidation from '@src/domains/dashboard/profile/hooks/usePasswordPolicyValidation';

describe('usePasswordPolicyValidation', () => {
    it('should return error for empty password with level 1 policy', () => {
        const passwordPolicy = { level: 1, minLength: 8 };
        const { validatePassword } = usePasswordPolicyValidation(passwordPolicy);
        const errors = validatePassword('');
        expect(errors).toEqual(['Password cannot be empty.']);
    });

    it('should return error for short password with level 2 policy', () => {
        const passwordPolicy = { level: 2, minLength: 8 };
        const { validatePassword } = usePasswordPolicyValidation(passwordPolicy);
        const errors = validatePassword('short');
        expect(errors).toEqual(['Password must be at least 8 characters long.']);
    });

    it('should return error for missing special character with level 4 policy', () => {
        const passwordPolicy = { level: 4, minLength: 8 };
        const { validatePassword } = usePasswordPolicyValidation(passwordPolicy);
        const errors = validatePassword('Password1');
        expect(errors).toEqual(['Password must contain at least one special character.']);
    });

    it('should return error for more than 2 consecutive repeated characters with level 5 policy', () => {
        const passwordPolicy = { level: 5, minLength: 8 };
        const { validatePassword } = usePasswordPolicyValidation(passwordPolicy);
        const errors = validatePassword('P@sswwword');
        expect(errors).toContain(
            'Password cannot contain more than 2 consecutive repeated characters.'
        );
    });

    it('should not return error for valid password with level 5 policy', () => {
        const passwordPolicy = { level: 5, minLength: 8 };
        const { validatePassword } = usePasswordPolicyValidation(passwordPolicy);
        const errors = validatePassword('P@ssw0rd');
        expect(errors).toEqual([]);
    });
});

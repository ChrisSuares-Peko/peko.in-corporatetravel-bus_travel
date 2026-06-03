// Prototype: role guard is bypassed — render children unconditionally.
type CorporateUserGuardProps = {
    children: React.ReactNode;
};

export default function CorporateUserGuard({ children }: CorporateUserGuardProps) {
    return <>{children}</>;
}

// Prototype: authentication is bypassed — render children unconditionally.
type AuthGuardProps = {
    children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
    return <>{children}</>;
}

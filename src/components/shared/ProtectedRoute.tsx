import {Navigate} from 'react-router-dom';
import {useAuth} from '@/src/hooks/useAuth';

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({children}: Props) {
  const {session, loading} = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfaf6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9974a] border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

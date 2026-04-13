import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {supabase} from '@/src/lib/supabase';

export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase exchanges the token from the URL hash automatically
    supabase.auth.getSession().then(({data}) => {
      if (data.session) {
        navigate('/dashboard', {replace: true});
      } else {
        navigate('/login', {replace: true});
      }
    });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfaf6]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9974a] border-t-transparent" />
    </div>
  );
}

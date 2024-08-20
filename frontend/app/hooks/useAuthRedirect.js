import { useEffect } from 'react';
import { auth } from '../config/firebase';
import { router } from 'expo-router';

const useAuthRedirect = () => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('auth state changed', user)
      if (!user) {
        router.replace('/signin');
      }
    });

    return unsubscribe;
  }, []);
};

export default useAuthRedirect;

// // context/AuthContext.js
// import { createContext, useContext, useState, useEffect } from 'react';
// import { createClient } from '@/lib/supabase/client';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const supabase = createClient();

//   useEffect(() => {
//     // Initial session check
//     const getSession = async () => {
//       try {
//         const { data: { session }, error } = await supabase.auth.getSession();
//         if (error) {
//           console.error('Error fetching session:', error.message);
//           setUser(null);
//         } else {
//           setUser(session?.user ?? null);
//         }
//       } catch (err) {
//         console.error('Unexpected error fetching session:', err);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getSession();

//     // Listen for auth state changes
//     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//       console.log('Auth event:', event); // Debug auth events
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     // Cleanup listener
//     return () => {
//       authListener?.subscription?.unsubscribe();
//     };
//   }, [supabase]); // Add supabase as dependency to avoid stale client

//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);
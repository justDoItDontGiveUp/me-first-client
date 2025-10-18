// import { createContext, useContext, useEffect, useState } from 'react';
// import {jwtDecode} from 'jwt-decode'; // תוודאי שהתקנת את החבילה הזו: npm install jwt-decode

// // יצירת קונטקסט חדש לניהול התחברות
// const AuthContext = createContext();

// // קומפוננטת Provider שעוטפת את האפליקציה
// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null); // נשתמש בזה לשמור את פרטי המשתמש מהטוקן

//   useEffect(() => {
//     const token = localStorage.getItem("token"); // כאן את משנה בהתאם לשם מפתח הטוקן שלך (אם שונה)
//     if (token) {
//       try {
//         const decoded = jwtDecode(token); // מפענח את הטוקן
//         if (decoded.exp * 1000 > Date.now()) {
//           setUser(decoded); // שומר את פרטי המשתמש (שם, תפקיד, וכו' אם יש בטוקן)
//         }
//       } catch (err) {
//         console.error("בעיה בפענוח הטוקן", err);
//         setUser(null);
//       }
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{
//       user,                  // כל פרטי המשתמש מהטוקן
//       isLoggedIn: !!user,    // בוליאני שמחזיר true אם המשתמש מחובר
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // פונקציה שתאפשר להשתמש ב־useAuth בכל קומפוננטה
// export function useAuth() {
//   return useContext(AuthContext);
// }
import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        }
      } catch (err) {
        console.error("בעיה בפענוח הטוקן", err);
        setUser(null);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "/firebase";

import Home from "/pages/Home";
import Login from "/pages/Login";

function App() {

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

      setUser(currentUser);
      setCheckingAuth(false);

    });

    return () => unsubscribe();

  }, []);

  if (checkingAuth) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">

        <p className="text-lg text-gray-600">
          Loading...
        </p>

      </div>
    );

  }

  return user ? <Home /> : <Login />;

}

export default App;
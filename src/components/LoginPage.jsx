import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [session, setSession] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      navigate("/main");
    }
  }, [session, navigate]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error(error);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      console.log("signing up: ", email, password);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error(error);
        return;
      }
      console.alert("Check your email for conformiation link");
    } else {
      console.log("logging in: ", email, password);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(error);
        return;
      }

      navigate("/main");
    }
  };

  if (!isSignUp) {
    return (
      <div>
        <form action="" onSubmit={handleClick}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <label htmlFor="password"></label>
          <input
            type="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Dont have an account yet?{" "}
          <span onClick={() => setIsSignUp(true)}>Sign Up Now!</span>
        </p>
        <button onClick={signInWithGoogle}>Login in with google</button>
      </div>
    );
  } else {
    return (
      <div>
        <form action="" onSubmit={handleClick}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <label htmlFor="password"></label>
          <input
            type="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account yet?{" "}
          <span onClick={() => setIsSignUp(false)}>Login Now!</span>
        </p>
        <button onClick={signInWithGoogle}>Login in with google</button>
      </div>
    );
  }
}

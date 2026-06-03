import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const { register, login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/shop");
    }
  }, [isAuthenticated, navigate]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const success = await register(email, password);
      if (!success) {
        setError("A different account already exists in this browser.");
      } else {
        navigate("/shop");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const success = await login(email, password);
      if (!success) {
        setError("Invalid email or password");
      } else {
        navigate("/shop");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-card border border-border p-8">
        <h1 className="font-serif text-2xl mb-2 text-foreground">Account access</h1>
        <p className="text-sm text-muted-foreground mb-6">Create a simple browser session account to place orders. Close the browser or sign out to end the session.</p>
        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1 bg-primary" disabled={loading}>Sign up</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={handleLogin} disabled={loading}>Sign in</Button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <button onClick={() => navigate('/')} className="text-sm text-muted-foreground hover:text-primary">← Back to website</button>
        </div>
      </motion.div>
    </div>
  );
}

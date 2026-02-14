import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);

    try {
      let emailToUse = identifier.trim();

      // If input is not email, treat as name
      if (!identifier.includes("@")) {
        const q = query(
          collection(db, "users"),
          where("name", "==", identifier),
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          emailToUse = userDoc.data().email;
        } else {
          toast.error("User not found");
          setLoading(false);
          return;
        }
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailToUse,
        password,
      );
      localStorage.setItem("uid", userCredential.user.uid);
      setLoading(false);

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-md p-8 sm:p-10 rounded-3xl w-full max-w-md text-white shadow-lg"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center tracking-wide">
          Work Report Login
        </h2>

        <motion.input
          whileFocus={{ scale: 1.02 }}
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          placeholder="Enter your UserName"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="password"
          className="w-full p-3 mb-6 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogin}
          disabled={loading}
          className={`w-full p-3 rounded-lg font-semibold text-white ${
            loading ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-700"
          } transition-colors`}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>
      </motion.div>
    </div>
  );
}

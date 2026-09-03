import { useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import demoVideo from "../assets/demoVideo.mp4";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };
  const login = async () => {
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8F5F2]">
      <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-pink-300/40 blur-3xl"></div>

      <div className="absolute top-1/3 -right-20 h-[28rem] w-[28rem] rounded-full bg-orange-200/40 blur-3xl"></div>

      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-300/30 blur-3xl"></div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/40 px-4 py-2 backdrop-blur-lg">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>

              <span className="text-sm font-medium text-gray-700">
                Delivery Sheet Automation
              </span>
            </div>

            <h1 className="mt-8 text-5xl md:text-6xl font-black leading-tight text-[#2D2D2D]">
              Less
              <br />
              paperwork,
              <br />
              <span className="italic font-light text-[#7D5A50]">
                More deliveries.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
              Process delivery sheets in seconds using AI. Review extracted
              shipments, verify pricing, and keep your monthly Excel reports up
              to date — all from one clean workspace.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/50 bg-white/55 p-5 backdrop-blur-xl">
                <p className="text-3xl font-bold text-[#2D2D2D]">&lt;10s</p>

                <p className="mt-1 text-sm text-gray-500">
                  Average Processing Time
                </p>
              </div>

              <div className="rounded-3xl border border-white/50 bg-white/55 p-5 backdrop-blur-xl">
                <p className="text-3xl font-bold text-[#2D2D2D]">ICL</p>

                <p className="mt-1 text-sm text-gray-500">
                  Customized for ICL Employees
                </p>
              </div>
            </div>

            <div className="mt-12 text-sm text-gray-500">
              © {new Date().getFullYear()} RISE INTERNATIONAL COURIER SERVICES.
              All rights reserved.
            </div>
          </div>

          <div className="rounded-[32px] border border-white/40 bg-white/55 p-10 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_30px_100px_rgba(0,0,0,0.12)]">
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold text-[#2D2D2D]">
                Employee Login
              </h2>

              <p className="mt-2 text-gray-500">
                Sign in to upload and process delivery sheets.
              </p>

              <div className="mt-8">
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="admin@icl.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-3xl border border-white/50 bg-white/50 px-5 py-4 backdrop-blur-xl outline-none transition focus:border-[#C08497] focus:ring-4 focus:ring-pink-200"
                />
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="*******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-3xl border border-white/50 bg-white/50 px-5 pr-14 py-4 backdrop-blur-xl outline-none transition focus:border-[#C08497] focus:ring-4 focus:ring-pink-200"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition cursor-pointer"
                  >
                  </button>
                </div>
              </div>

              <button
                onClick={login}
                disabled={loading}
                className="mt-8 w-full rounded-3xl bg-[#2D2D2D] py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 hover:scale-[1.02] cursor-pointer"
              >
                {loading ? "Signing In..." : "Employee Login"}
              </button>

              <div className="my-8 flex items-center">
                <div className="h-px flex-1 bg-gray-300"></div>

                <span className="mx-4 text-sm text-gray-500">or</span>

                <div className="h-px flex-1 bg-gray-300"></div>
              </div>

              <div className="flex justify-center w-full">
                <button
                  onClick={() => navigate("/demo")}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="relative overflow-hidden group flex items-center justify-center w-[280px] sm:w-[320px] h-[64px] sm:h-[72px] rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] transition-all duration-300 cursor-pointer"
                >
                  <video
                    ref={videoRef} src={demoVideo} muted loop playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-60 transition-opacity duration-500 scale-105 group-hover:scale-100"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <span className="relative z-10 font-semibold text-black-777 sm:text-[1.05rem] flex items-center gap-2 drop-shadow-sm group-hover:text-black-700 transition-colors">
                    Explore Interactive Demo
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

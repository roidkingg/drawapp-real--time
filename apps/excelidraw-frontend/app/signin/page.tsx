"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { HTTP_BACKEND } from "@/config"

export default function () {
    const router = useRouter()
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-32 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
                <div className="absolute bottom-20 right-20 w-28 h-28 bg-yellow-200 rounded-full opacity-20 animate-pulse delay-500"></div>
            </div>

            <div className="w-full max-w-md relative">
                {/* Main card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            Join Excalidraw
                        </h1>
                        <p className="text-gray-600">Login and start drawing together</p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">



                        {/* Email input */}
                        <div className="relative group">
                            <input
                                onChange={(e) => { setemail(e.target.value) }}
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                className="w-full px-4 py-4 pl-12 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300 placeholder-gray-400 text-gray-700"
                            />
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                        </div>

                        {/* Password input */}
                        <div className="relative group">
                            <input
                                onChange={(e) => { setpassword(e.target.value) }}
                                type="password"
                                placeholder="Password"
                                value={password}
                                className="w-full px-4 py-4 pl-12 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300 placeholder-gray-400 text-gray-700"
                            />
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            onClick={async () => {
                                setIsLoading(true);
                                console.log("Sending:", { email, password });
                                try {
                                    const res = await axios.post(`${HTTP_BACKEND}/signin`, {
                                        email,
                                        password,
                                    });
                                    console.log("Signin response:", res.data);

                                    // Store the real JWT from backend
                                    const token = res.data.token;
                                    localStorage.setItem("token", token);
                                    // Redirect to a default room (or implement logic to fetch/create a room)
                                    const roomId = "defaultRoom";
                                    router.push(`/canvas/${roomId}`);
                                } catch (e: any) {
                                    console.error("Login Error:", e.response?.data || e);
                                    alert("Login failed. Check console for details.");
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                            disabled={isLoading || !email || !password}
                            className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-purple-200 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                        >
                            Login
                        </button>

                    </div>

                    {/* Footer */}

                </div>

                {/* Decorative drawing elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-purple-300 rounded-full opacity-60"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 border-2 border-blue-300 rounded-sm rotate-45 opacity-60"></div>
                <div className="absolute top-1/2 -left-6 w-4 h-4 border-2 border-pink-300 rounded-sm rotate-12 opacity-60"></div>
                <div className="absolute top-1/4 -right-6 w-5 h-5 border-2 border-yellow-300 rounded-full opacity-60"></div>
            </div>
        </div>
    )
}
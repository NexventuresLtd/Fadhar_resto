import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import mainAxios from '../Instance/mainAxios';

// Auth service functions
const authService = {
    login: async (email: string, password: string, rememberMe: boolean) => {
        try {
            const response = await mainAxios.post(`/auth/login`, {
                email,
                password
            });

            if (response.data.access_token) {
                const storage = rememberMe ? localStorage : sessionStorage;

                // Store tokens and user info
                storage.setItem('authToken', response.data.access_token);
                storage.setItem('refresh', response.data.refresh_token || '');
                storage.setItem('userInfo', JSON.stringify(response.data.UserInfo));

                return { success: true, data: response.data };
            }
        } catch (error: any) {
            let errorMessage = 'An unexpected error occurred';

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 401) {
                    errorMessage = 'Invalid email or password';
                } else if (error.response.status === 422) {
                    errorMessage = 'Validation error. Please check your inputs';
                } else if (error.response.data && error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                } else {
                    errorMessage = `Server error: ${error.response.status}`;
                }
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = 'Network error. Please check your connection';
            }

            return { success: false, error: errorMessage };
        }
    }
};

// Login Component
const FadharAdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await authService.login(email, password, rememberMe);

        if (result?.success) {
            window.location.href = "/dashboard"
        } else {
            setError(result?.error || 'Login failed');
        }

        setIsLoading(false);
    };





    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 to-green-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >


                {/* Login Form */}
                <motion.div
                    onClick={() => setError("")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-white pt-10 px-5 rounded-2xl shadow-lg overflow-hidden"
                >
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center justify-center w-16 h-16 mb-4"
                        >
                            <div className=" h-16 w-50 md:w-64 overflow-hidden py-1">
                                {/* <h1 className="text-2xl font-bold text-gray-800 font-delius">Fadhar's</h1> */}
                                <img src="logo.png" className='w-full h-full object-cover scale-250' alt="" />
                            </div>
                        </motion.div>
                        <h1 className="text-4xl font-bold text-green-800 mb-2 font-greatvibes">Fadhar Restaurant</h1>
                        <p className="text-green-600">Admin Dashboard Login</p>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-100 text-red-700 p-4 font-medium rounded-lg text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-4 bg-white outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder="Enter your email"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-4 bg-white outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="Enter your password"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                disabled={isLoading}
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 transition-colors"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <LogIn size={18} className="mr-2" />
                                    Sign In
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Demo Credentials Hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-6 p-4 bg-white rounded-lg text-sm text-green-800 text-center"
                >
                    <p className='text-gray-800'>Use your admin credentials to login</p>
                    <p onClick={() => window.location.href = "/"} className='underline cursor-pointer'>Vist The Customer site</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default FadharAdminLogin;
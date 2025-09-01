"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!form.email) {
            newErrors.email = 'Email is required';
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
        ) {
            newErrors.email = 'Invalid email address';
        }
        if (!form.password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setApiError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        setApiError('');
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // Example error
            setApiError('Invalid credentials');
        }, 1200);
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit} noValidate>
                <h2>Login</h2>
                {apiError && <div className="error-message">{apiError}</div>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="email"
                        required
                    />
                    {errors.email && (
                        <span className="field-error">{errors.email}</span>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={form.password}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="current-password"
                        required
                    />
                    {errors.password && (
                        <span className="field-error">{errors.password}</span>
                    )}
                </div>
                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="remember"
                            checked={form.remember}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        Remember me.
                    </label>
                </div>
                <button
                    type="submit"
                    className="login-btn"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className="register-link">
                    Don't have an account?{' '}
                    <Link href="/register">Register</Link>
                </div>
            </form>
            <style jsx>{`
                .login-container {
                    max-width: 400px;
                    margin: 60px auto;
                    padding: 32px;
                    background: #2463ebff;
                    border-radius: 8px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
                    background: #0575E6;  /* fallback for old browsers */
background: -webkit-linear-gradient(to top, #021B79, #0575E6);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to top, #021B79, #0575E6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

                }
                .login-form h2 {
                    margin-bottom: 24px;
                    font-size: 55px;
                    text-align: center;
                    font-weight: 700;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .form-group {
                    margin-bottom: 12px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 17px;
                    font-weight: 500;
                }
                .form-group input[type="email"],
                .form-group input[type="password"] {
                    width: 100%;
                    padding: 10px;
                    border: 2px solid #ddddddff;
                    border-radius: 4px;
                    font-size: 16px;
                }
                .form-group input[type="email"]:focus{
                    outline:none;
                }
                .form-group input[type="password"]:focus{
                    outline:none;
                }
                .checkbox-group label {
                    display: flex;
                    align-items: center;
                    font-weight: 400;
                    transition:.2s;
                }
                .checkbox-group input {
                    margin-right: 8px;
                }
                .login-btn {
                    width: 100%;
                    padding: 12px;
                    background: white;
                    color:#2463ebff;
                    border: none;
                    border-radius: 4px;
                    font-size: 17px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .login-btn:hover {
                     background: #2463ebff;
                     color:white;
                }
                .login-btn:disabled {
                    background: #a5b4fc;
                    cursor: not-allowed;
                }
                .register-link {
                    margin-top: 18px;
                    text-align: center;
                    font-size: 15px;
                }
                .register-link a {
                    color: #2563eb;
                    text-decoration: underline;
                }
                .error-message {
                    background: #fee2e2;
                    color: #b91c1c;
                    padding: 10px;
                    border-radius: 4px;
                    margin-bottom: 16px;
                    text-align: center;
                }
                .field-error {
                    color: #b91c1c;
                    font-size: 13px;
                    font-weight: 500;
                    margin-top: 4px;
                    display: block;
                }
            `}</style>
        </div>
    );
}
import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import * as z from "zod";
import axios from "axios";
import { Link, useLocation } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
const baseUrl = import.meta.env.VITE_BASE_URL;
const loginSchema = z.object({
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(5, "Password must be at least 8 characters"),
});

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const result = loginSchema.safeParse(formData);
        console.log(result)
        if (!result.success) {
            const formattedErrors = {};
            result.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setErrors(formattedErrors);
        } else {
            setErrors({});
            axios.post(baseUrl + '/api/v1/user/login', formData).then(response => {
                console.log(response)
                toast.success(response.data.message, {
                    position: 'bottom-center',
                    autoClose: 3000
                });

            })
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-green-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-none">
                <CardHeader className="space-y-1 text-center pt-2">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Log In
                    </CardTitle>

                </CardHeader>
                <CardContent className="space-y-6 px-10 pb-12">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="email" onChange={handleChange} className="h-11 focus-visible:ring-green-200 focus-visible:border-green-200" />
                            <p className="text-xs text-red-500 font-medium">{errors.email ? errors.email : ""}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input id="password" type={showPassword ? "text" : "password"} placeholder="password" onChange={handleChange} className="h-11 pr-10 focus-visible:ring-green-200 focus-visible:border-green-200" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label={showPassword ? "Hide password" : "Show password"}>
                                    {showPassword ? (
                                        <EyeOffIcon className="h-4 w-4" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-red-500 font-medium">{errors.password ? errors.password : ""}</p>
                        </div>
                    </div>
                    <Button className="text-base w-full h-12 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2" onClick={handleSubmit}>
                        Log In
                    </Button>
                    <p className="text-center">Don't have an account <Link to="/signup" className="text-green-700 underline underline-offset-3">Create account</Link></p>
                </CardContent>
            </Card>
            <ToastContainer />
        </div>
    );
}

export default Login
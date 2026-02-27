import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { EyeIcon, EyeOffIcon, Loader, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import * as z from "zod";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
import { useDebounce } from "@/hooks/useDebounce";
import { ToastContainer, toast } from 'react-toastify';
const signupSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().optional(),
    userName: z.string().min(1, "User Name is required"),
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(5, "Password must be at least 8 characters"),
});
const formDataTemplate = {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
}

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSearching, setIsSearching] = useState(false);
    const [isUnique, setIsUnique] = useState(false)
    const [formData, setFormData] = useState(formDataTemplate);

    const navigate = useNavigate()

    const changeHandler = (e) => {
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


    const submitHandler = (e) => {
        e.preventDefault();

        const result = signupSchema.safeParse(formData);
        console.log(result)
        if (!result.success) {
            const formattedErrors = {};
            result.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setErrors(formattedErrors);
        } else {
            setErrors({});
            console.log("Form is valid! Data:", result.data);
            axios.post(baseUrl + '/api/v1/user/signup', formData).then(response => {
                console.log(response)
                toast.success(response.data.message, {
                    position: 'bottom-center',
                    autoClose: 3000
                });
                setTimeout(() => {
                    navigate('/login')
                }, 3000);

            })

        }
    }
    console.log(formData, errors)

    const debouncedSearchTerm = useDebounce(formData.userName, 600);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const controller = new AbortController();

            const fetchResults = async () => {
                setIsSearching(true);
                try {
                    const response = await fetch(
                        `http://localhost:8080/api/v1/user/check-username-unique?userName=${debouncedSearchTerm}`,
                        { signal: controller.signal }
                    );
                    const data = await response.json();

                    if (data) {
                        setIsUnique(data.success);
                    }

                } catch (error) {
                    console.error('Search failed:', error);
                } finally {
                    setIsSearching(false);
                }
            };

            fetchResults();
            return () => controller.abort();
        } else {
            setIsUnique(false);
        }
    }, [debouncedSearchTerm]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-none">
                <CardHeader className="space-y-1 text-center pt-2">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Create Your Account
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        Welcome! Please fill in the details to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-10 pb-12">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="firstName">First Name</Label>
                                </div>
                                <Input id="firstName" placeholder="First Name" onChange={changeHandler} className="h-11 focus-visible:ring-green-200 focus-visible:border-green-200" />
                                <p className="text-xs text-red-500 font-medium">{errors.firstName ? errors.firstName : ""}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <span className="text-[10px] text-gray-400 uppercase">Optional</span>
                                </div>
                                <Input id="lastName" placeholder="Last Name" onChange={changeHandler} className="h-11 focus-visible:ring-green-200 focus-visible:border-green-200" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userName">User Name</Label>
                            <div className="relative">
                                <Input id="userName" type="text" placeholder="User Name" value={formData.userName} onChange={changeHandler} className="h-11 focus-visible:ring-green-200 focus-visible:border-green-200" />
                                <p className="absolute right-3 top-1/2 -translate-y-1/2">{
                                    formData.userName.length > 0 && (isSearching ? <Loader /> : (isUnique ? <Check className="text-green-700" /> : <X className="text-red-700" />))
                                }</p>
                            </div>
                            <p className="text-xs text-red-500 font-medium">{errors.userName ? errors.userName : ""}</p>
                            {formData.userName.length > 0 && !isUnique && <p className="text-xs text-red-500 font-medium">User Name already exists</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="Enter your email address" onChange={changeHandler} className="h-11 focus-visible:ring-green-200 focus-visible:border-green-200" />
                            <p className="text-xs text-red-500 font-medium">{errors.email ? errors.email : ""}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" onChange={changeHandler} className="h-11 pr-10 focus-visible:ring-green-200 focus-visible:border-green-200" />
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
                    <Button className="text-base w-full h-12 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2" onClick={submitHandler}>
                        Sign Up
                    </Button>
                </CardContent>
            </Card>
            <ToastContainer />
        </div>
    );
}
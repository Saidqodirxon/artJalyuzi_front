"use client";

import React, { useState, useEffect } from "react";
import { getMe, updateMe } from "@/src/lib/api/auth";
import { Button } from "@/src/components/ui/button"; // Assuming you have a Button component
import { useToast } from "@/src/hooks/use-toast";

const UpdatePage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Parolni tasdiqlash maydoni
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [showPassword, setShowPassword] = useState(false); // Parolni ko'rsatish uchun flag
  const { toast } = useToast();

  // Foydalanuvchi ma'lumotlarini olish
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await getMe();
        setLogin(userData.login); // Serverdan olingan login ma'lumotini formaga qo'shish
        setPassword(""); // Parolni bo'sh qoldiramiz, chunki biz uni yangilashni xohlaymiz
        setConfirmPassword(""); // Tasdiqlash parolini bo'sh qoldiramiz
        setLoading(false);
      } catch (err: any) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Faqat bir marta chaqirilishi uchun [] dep qo'yamiz

  const handleUpdate = async () => {
    try {
      // Parollarni tekshirish
      if (password !== confirmPassword) {
        setError("Parollar mos kelmaydi.");
        return;
      }
      const userData = await getMe();
      const updatedData = await updateMe({ login, password });
      setSuccess("User data updated successfully!");
      toast({
        title: "Success",
        description: "Banner created successfully",
      });

      setLogin(userData.login); // Serverdan olingan login ma'lumotini formaga qo'shish
      setPassword(""); // Parolni bo'sh qoldiramiz, chunki biz uni yangilashni xohlaymiz
      setConfirmPassword("");
      console.log(updatedData); // Log to verify
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState); // Parolni ko'rsatish/berish
  };

  return (
    <div className="w-[50vw]">
      <h1 className="text-3xl font-bold mb-4 text-center">Update Your Info</h1>
      {loading && <p className="text-center text-gray-500">Loading...</p>}{" "}
      {/* Agar ma'lumotlar yuklanayotgan bo'lsa, Loading matnini ko'rsatish */}
      {error && <p className="text-center text-red-600">{error}</p>}{" "}
      {/* Xatolik bo'lsa */}
      {success && <p className="text-center text-green-600">{success}</p>}{" "}
      {/* Yangilash muvaffaqiyatli bo'lsa */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Login:
        </label>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Password:
        </label>
        <input
          type={showPassword ? "text" : "password"} // Parolni ko'rsatish/berish
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
        />
        <button onClick={togglePasswordVisibility} className="mt-2 text-sm ">
          {showPassword ? "Hide Password" : "Show Password"}
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Confirm Password:
        </label>
        <input
          type={showPassword ? "text" : "password"} // Parolni tasdiqlash uchun ko'rsatish/berish
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
        />
      </div>
      <div className="flex justify-center">
        <Button onClick={handleUpdate} className="w-full">
          Update
        </Button>
      </div>
    </div>
  );
};

export default UpdatePage;

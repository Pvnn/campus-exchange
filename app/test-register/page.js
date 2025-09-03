"use client";

import { useState } from "react";

export default function TestRegister() {
  const [result, setResult] = useState("");

  const testRegister = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'pvnnraj@gmail.com',
          password: 'password123',
          name: 'Tester1',
          student_id: 'CS2025001',
          phone: '1234567890'
        })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Registration API</h1>
      <button 
        onClick={testRegister}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Test Register API
      </button>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {result}
      </pre>
    </div>
  );
}

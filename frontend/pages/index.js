import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home({ user }) {
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 AI Component Generator
          </h1>
          <p className="text-gray-600 mb-8">
            Build React components with AI assistance
          </p>
          
          <div className="space-y-4">
            <Link href="/login">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
                Sign In
              </button>
            </Link>
            
            <Link href="/register">
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-200">
                Create Account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
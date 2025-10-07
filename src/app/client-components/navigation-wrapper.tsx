'use client';

import dynamic from "next/dynamic";
import Link from "next/link";

const NavigationComponent = dynamic(() => import("@/components/layout/navigation"), {
  ssr: false,
  loading: () => (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Catálogo de Cursos
        </Link>
      </div>
    </nav>
  ),
});

export default function Navigation() {
  return <NavigationComponent />;
}
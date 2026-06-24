"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/header";

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black">
      <Header />

      <main className="flex-1 flex items-center justify-center"></main>
    </div>
  );
}

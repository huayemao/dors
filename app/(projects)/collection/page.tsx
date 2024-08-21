"use client"
import { BaseAutocomplete, BaseTextarea } from "@shuriken-ui/react";
import Content from "./Comp";
import { ClientOnly } from "@/components/ClientOnly";



export default function Collection() {

    return (
        <main className="w-full flex p-24 pt-8">
            <ClientOnly>
                <Content></Content>
            </ClientOnly>
        </main>
    );
}




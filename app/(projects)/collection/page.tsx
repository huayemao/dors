"use client"
import { BaseAutocomplete, BaseTextarea } from "@shuriken-ui/react";
import CollectionEditor from "../../../components/CollectionEditor";
import { ClientOnly } from "@/components/ClientOnly";



export default function Collection() {

    return (
        <main className="w-full flex p-24 pt-8">
            <ClientOnly>
                <CollectionEditor></CollectionEditor>
            </ClientOnly>
        </main>
    );
}




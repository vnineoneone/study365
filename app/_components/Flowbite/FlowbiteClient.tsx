"use client"

import { useEffect } from "react"
import { initFlowbite } from "flowbite";

export default function FlowbiteClient() {
    useEffect(() => {
        initFlowbite();
    }, []);
    return null
}

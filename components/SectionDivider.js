"use client"
import React from 'react'
import { useTheme } from 'next-themes'

const SectionDivider = () => {
    const { theme } = useTheme()
    return (
        <div className={`w-full h-0.5 ${theme === "dark" ? "bg-gray-50" : "bg-gray-900"}`}></div>
    )
}

export default SectionDivider

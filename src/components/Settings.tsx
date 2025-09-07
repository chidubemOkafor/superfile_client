import React from 'react'
import { useThemeStore } from '../stores/useThemeStore'
import { FaToggleOff, FaToggleOn } from "react-icons/fa";

const Settings = () => {
    const {theme, setTheme} = useThemeStore()
    return (
        <div className=''>
            <h2 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}  text-start mb-4`}>
                Settings
            </h2>
            <p className='text-gray-500'>theme</p>
            {theme === 'light' ? <FaToggleOff onClick={() => setTheme("dark")} className='size-10 cursor-pointer text-gray-700'/> : <FaToggleOn onClick={() => setTheme("light")}  className='size-10 cursor-pointer text-gray-100'/>}
        </div>
    )
}

export default Settings

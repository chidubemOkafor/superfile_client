import { CheckCircle2, Plus } from 'lucide-react';
import { useState } from 'react'
import { MdOutlineDelete } from 'react-icons/md';
import { IoIosClose } from "react-icons/io";
import useToggleSideBar from '../stores/useToggleSidebar';
import { useThemeStore } from '../stores/useThemeStore';
import Settings from './Settings';

const Sidebar = () => {
    const {theme} = useThemeStore()
    const { setIsToggled } = useToggleSideBar()
    const [vaults, setVaults] = useState<string[]>([]);
    const [newVault, setNewVault] = useState("");
    const [activeVault, setActiveVault] = useState<string | null>(null);


    const handleAddVault = () => {
        if (newVault.trim() && !vaults.includes(newVault)) {
        setVaults([...vaults, newVault]);
        setNewVault("");
        }
    };

    const handleRemoveVault = (vault: string) => {
        setVaults(vaults.filter((v) => v !== vault));
        if (activeVault === vault) setActiveVault(null);
    };

    const input =`w-full p-4  ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'} border rounded-xl outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400 transition`

    return (
        <aside className={`shadow-md border ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-100  bg-white'} p-5 flex flex-col m-6 rounded-xl fixed right-0 h-[95%]`}>
            <div className='flex justify-between'>
                <h2 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}  text-start mb-4`}>
                    vaults
                </h2>
                <IoIosClose className={`size-8 cursor-pointer ${theme === 'dark' && 'text-white'}`} onClick={setIsToggled}/>
            </div>

            <div className="flex gap-2 mb-6">
            <input
                type="text"
                value={newVault}
                onChange={(e) => setNewVault(e.target.value)}
                placeholder="Paste Telegram link..."
                className={input}
            />
            <button
                onClick={handleAddVault}
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 px-5 cursor-pointer"
            >
                <Plus size={18} />
            </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
            {vaults.length === 0 ? (
                <p className="text-gray-500 text-sm">No vaults added yet.</p>
            ) : (
                vaults.map((vault) => (
                <div
                    key={vault}
                    className={`p-1 rounded-2xl flex justify-between items-center cursor-pointer transition ${
                    activeVault === vault
                        ? "bg-indigo-100 border border-indigo-400"
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200"
                    }`}
                    onClick={() => setActiveVault(vault)}
                >
                    <div className="flex items-center gap-2 text-sm break-all pl-3">
                        {activeVault === vault && (
                            <CheckCircle2 className="text-indigo-600" size={16} />
                        )}
                        <span>{vault}</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveVault(vault);
                        }}
                        className="size-10 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-red-600 transition-all duration-200 shadow-sm"
                        >
                        <MdOutlineDelete size={18} />
                    </button>
                </div>
                ))
            )}
            </div>
            <Settings/>
        </aside>
    )
}

export default Sidebar

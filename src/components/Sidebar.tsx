import { CheckCircle2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react'
import { MdOutlineDelete } from 'react-icons/md';
import { IoIosClose } from "react-icons/io";
import useToggleSideBar from '../stores/useToggleSidebar';
import { useThemeStore } from '../stores/useThemeStore';
import Settings from './Settings';
import axios from 'axios';
import { useToggleActive } from '../stores/useToggleActive';
import { useUploadAndDownloadLock } from '../stores/useUploadAndDownloadLock';

const Sidebar = () => {
    const {theme} = useThemeStore()
    const { setIsToggled } = useToggleSideBar()
    const { setActive } = useToggleActive()
    const {isUploadindOrDownloadin} = useUploadAndDownloadLock()
    const [vaults, setVaults] = useState<any[]>([]);
    const [newVault, setNewVault] = useState("");
    const [activeVault, setActiveVault] = useState<string | null>(null);

    const handleAddVault = async () => {
        try {
            const response = await axios.post("http://localhost:5000/vault",{},{
                params: {
                    vaultUrl: newVault.trim()
                },
                withCredentials: true })
            console.log("response: ", response)
            if (newVault.trim() && !vaults.includes(newVault)) {
                setVaults([...vaults, {"vault_url":newVault}])
                setNewVault("")
            };
        } catch (e) {
            console.error("error:", e)
        }
    };

    const handleVaultFetch = async() => {
        try {
            const response = await axios.get("http://localhost:5000/vault", {
                withCredentials: true})
            console.log("vault_response: ", response)
            setVaults(response.data.data)
        } catch (e) {
            console.error("error:", e)
        }
    }

    const handleSetActive = async (vault: string) => {
        if (activeVault === vault) {
            return
        }

        if (isUploadindOrDownloadin) {
            return
        }

            try {
            const response = await axios.post("http://localhost:5000/vault/activate",{ vaultUrl: vault },{
                withCredentials: true})

            if (response.status === 200) {
                setActiveVault(vault) 
                setActive(vault)
            } 
            console.log("response: ", response)
            
        } catch (e) {
            console.error("error:", e)
        }
    }

    const handleFetchActive = async() => {
        try {
            const response = await axios.get("http://localhost:5000/vault/active", {
               withCredentials: true})
            
            setActiveVault(response.data.data)
        } catch (e) {
            console.error("error:", e)
        }
    }

    const handleRemoveVault = async (vault: string) => {
        if (activeVault === vault) {
            return;
        }
        try {
            const response = await axios.delete("http://localhost:5000/vault", {
                data: { vaultUrl: vault },
                withCredentials: true,
            });

            console.log("response: ", response);
            setVaults(vaults.filter((v) => v !== vault));
        } catch (e) {
            console.error("error:", e);
        }
    };

    useEffect(() => {
        handleVaultFetch()
        handleFetchActive()
    }, [])

    const input =`w-full p-4  ${theme === 'dark' ? 'border-gray-800 text-gray-100' : 'border-gray-100'} border rounded-xl outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400 transition`

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
                vaults.map((vault, index) => (
                <div
                    key={index}
                    className={`p-1 rounded-2xl flex justify-between items-center cursor-pointer transition h-12 ${
                    activeVault === vault.vault_url
                        ? `${theme === "dark" ? "bg-indigo-900 border-indigo-800 text-white" : "bg-indigo-100 border-indigo-400"} border`
                        : `${theme === "dark" ? `bg-gray-800 text-gray-100 hover:bg-gray-900 border border-gray-700 hover:border-gray-600`: "bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 "} transition-all duration-200 ${isUploadindOrDownloadin &&  "cursor-not-allowed" } `
                    }`}
                    
                    onClick={() => handleSetActive(vault.vault_url)}
                >
                    <div className="flex items-center gap-2 text-sm break-all pl-3">
                        {activeVault === vault.vault_url && (
                            <CheckCircle2 className="text-indigo-600" size={16} />
                        )}
                        <span>{vault.title}</span>
                    </div>
                    {activeVault === vault.vault_url || <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveVault(vault);
                        }}
                        title='delete'
                        className={`${theme === "dark" ? "bg-gradient-to-br from-gray-700 to gray-100 text-white hover:bg-red-800 hover:text-red-100" : "bg-white hover:bg-red-50  border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-600 border"} cursor-pointer p-2 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm`}
                        >
                        <MdOutlineDelete size={18} />
                    </button>}
                </div>
                ))
            )}
            </div>
            <Settings/>
        </aside>
    )
}

export default Sidebar


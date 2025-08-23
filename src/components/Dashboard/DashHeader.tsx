import { Menu, X } from "lucide-react";
import { getUserInfo } from "../../app/Localstorage";

interface PropsHeader {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function DashHEader({ sidebarOpen, setSidebarOpen }: PropsHeader) {
    return (
        <>
            {/* Header */}
            <header className="bg-white shadow-none p-4 flex justify-between items-center">
                <div className="relative">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    /> */}
                </div>
                <div className="flex items-center space-x-4">
                    {/* <button className="relative p-2 text-gray-600 hover:text-green-700">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">3</span>
                    </button> */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-semibold">{getUserInfo.first_name.slice(0,1)}{""}{getUserInfo.last_name.slice(0,1)}</div>
                        {sidebarOpen && <span className="text-sm max-lg:hidden">{getUserInfo.first_name}</span>}
                    </div>
                </div>
            </header>

        </>
    )
}

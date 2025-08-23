import { useState } from 'react';
import {
    LayoutDashboard,
    UtensilsCrossed,
    ListTree,
    SquareActivity,
    CreditCard,
    Users,
    LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SidebarItem } from './DashSideItem';
import { SubSidebarItem } from './DashSideSub';
import { logout } from '../../app/Localstorage';
interface PropsDashSide {
    sidebarOpen: boolean;
    setActiveItem: React.Dispatch<React.SetStateAction<string>>;
    activeItem: string;
    setActiveSubItem: React.Dispatch<React.SetStateAction<string>>;
    activeSubItem: string;
}
export default function DashSide({ sidebarOpen, setActiveItem, activeItem, setActiveSubItem, activeSubItem }: PropsDashSide) {


    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const handleItemClick = (item: string) => {
        if(item === "logout"){
            logout()
            return
        }
        setActiveItem(item);
        setActiveSubItem('');

        if (item === 'categories') {
            if (expandedItems.includes(item)) {
                setExpandedItems(expandedItems.filter(i => i !== item));
            } else {
                setExpandedItems([...expandedItems, item]);
            }
        }
    };

    const handleSubItemClick = (subItem: string) => {
        setActiveSubItem(subItem);
    };
    return (
        <>
            <motion.div
                initial={{ zoom: 0.9 }}
                animate={{ zoom: 1 }}
                className={`bg-green-800 text-white h-full flex-col w-64 transition-all duration-300 ${sidebarOpen ? 'hidden md:flex' : 'hidden md:flex'}`}
            >
                <div className="p-5 flex items-center justify-between">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xl font-bold"
                    >
                        Fadhar Restaurant
                    </motion.h1>

                </div>

                <nav className="flex-1 mt-6">
                    <div className="px-4 space-y-2">
                        <SidebarItem
                            icon={<LayoutDashboard size={20} />}
                            text="Dashboard"
                            isActive={activeItem === 'dashboard'}
                            onClick={() => handleItemClick('dashboard')}
                        />

                        <div>
                            <SidebarItem
                                icon={<ListTree size={20} />}
                                text="Categories"
                                isActive={activeItem === 'categories'}
                                hasSubmenu={true}
                                isExpanded={expandedItems.includes('categories')}
                                onClick={() => handleItemClick('categories')}
                            />
                            {expandedItems.includes('categories') && activeItem == "categories" && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <SubSidebarItem
                                        text="Manage Categories"
                                        isActive={activeSubItem === 'category'}
                                        onClick={() => handleSubItemClick('category')}
                                    />
                                    <SubSidebarItem
                                        text="Manage Subcategories"
                                        isActive={activeSubItem === 'sub-category'}
                                        onClick={() => handleSubItemClick('sub-category')}
                                    />
                                </motion.div>
                            )}
                        </div>

                        <SidebarItem
                            icon={<UtensilsCrossed size={20} />}
                            text="Menu Items"
                            isActive={activeItem === 'menu'}
                            hasSubmenu={false}
                            onClick={() => handleItemClick('menu')}
                        />

                        <SidebarItem
                            icon={<SquareActivity size={20} />}
                            text="Restaurant Tables"
                            isActive={activeItem === 'tables'}
                            onClick={() => handleItemClick('tables')}
                        />

                        <SidebarItem
                            icon={<Users size={20} />}
                            text="Orders"
                            isActive={activeItem === 'orders'}
                            onClick={() => handleItemClick('orders')}
                        />

                        <SidebarItem
                            icon={<CreditCard size={20} />}
                            text="Payments"
                            isActive={activeItem === 'payments'}
                            onClick={() => handleItemClick('payments')}
                        />
                    </div>
                </nav>

                <div className="p-4 border-t border-green-700">
                    {/* <SidebarItem
                        icon={<Settings size={20} />}
                        text="Settings"
                        isActive={activeItem === 'settings'}
                        onClick={() => handleItemClick('settings')}
                    /> */}
                    <SidebarItem
                        icon={<LogOut size={20} />}
                        text="Logout"
                        isActive={activeItem === 'logout'}
                        onClick={() => handleItemClick('logout')}
                    />
                </div>
            </motion.div>
        </>
    )
}

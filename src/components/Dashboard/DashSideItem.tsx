import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
export const SidebarItem: React.FC<{
    icon: React.ReactNode;
    text: string;
    isActive: boolean;
    hasSubmenu?: boolean;
    isExpanded?: boolean;
    onClick: () => void;
}> = ({ icon, text, isActive, hasSubmenu, isExpanded, onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-green-700 text-white' : 'text-gray-100 hover:bg-green-900'}`}
            onClick={onClick}
        >
            <div className="flex items-center">
                {icon}
                <span className="ml-3">{text}</span>
            </div>
            {hasSubmenu && (isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
        </motion.div>
    );
};

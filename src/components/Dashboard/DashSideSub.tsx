import { motion } from 'framer-motion';
export const SubSidebarItem: React.FC<{
    text: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ text, isActive, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`pl-10 py-2 cursor-pointer transition-colors ${isActive ? 'bg-green-700 font-medium' : 'text-gray-300 hover:bg-green-900 rounded-xl'}`}
            onClick={onClick}
        >
            {text}
        </motion.div>
    );
};
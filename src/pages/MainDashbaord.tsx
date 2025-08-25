import React, { useEffect, useState } from 'react';
import DashHEader from '../components/Dashboard/DashHeader';
import DashSide from '../components/Dashboard/DashSide';
import CategoryManagement from '../components/Dashboard/categoryManagement/CategoryManagement';
import SubcategoryManagement from '../components/Dashboard/categoryManagement/SubCategory';
import MenuItemManagement from '../components/Dashboard/MenuManagement/MenuItems';
import TableManagement from '../components/Dashboard/TableManagement/TableManage';
import Dashboard from '../components/Dashboard/MainCountsDash';
import OrderManagement from '../components/Dashboard/OrderManagement/OderManagement';
import PaymentManagement from '../components/Dashboard/payment/paymentManage';




const FadharAdminDashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // Initialize state with values from localStorage or default values
    const [activeItem, setActiveItem] = useState(() => {
        return localStorage.getItem('activeItem') || 'dashboard';
    });

    const [activeSubItem, setActiveSubItem] = useState(() => {
        return localStorage.getItem('activeSubItem') || '';
    });

    // Update localStorage whenever activeItem or activeSubItem changes
    useEffect(() => {
        localStorage.setItem('activeItem', activeItem);
    }, [activeItem]);

    useEffect(() => {
        localStorage.setItem('activeSubItem', activeSubItem);
    }, [activeSubItem]);



    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <DashSide sidebarOpen={sidebarOpen} activeSubItem={activeItem} setActiveSubItem={setActiveSubItem} activeItem={activeItem} setActiveItem={setActiveItem} />


            {/* Main Content */}
            <div className={`flex-1 overflow-auto `}>
                {/** HEader Dash */}
                <DashHEader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                {/* Dashboard Content */}
                <main className={`p-6 ${sidebarOpen? 'max-lg:hidden':'max-lg:block'}`}>
                    {activeItem == "dashboard" && <Dashboard />}
                    {activeItem == "menu" && <MenuItemManagement />}
                    {activeItem == "orders" && <OrderManagement />}
                    {activeItem == "tables" && <TableManagement />}
                    {activeItem == "payments" && <PaymentManagement/>}
                    {/** Sub Category Management */}
                    {activeItem == "categories" && <>
                        {activeSubItem == "" && <><CategoryManagement /></>}
                        {activeSubItem == "category" && <CategoryManagement />}
                        {activeSubItem == "sub-category" && <SubcategoryManagement />}
                    </>}
                </main>
            </div>
        </div>
    );
};

export default FadharAdminDashboard;
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import StickyFooter from '../components/common/StickyFooter';

const MainLayout = () => {
    return (
        <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
            {/* BG */}
            <div className='fixed  z-0'>
                <div className='absolute bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
                <div className='absolute  backdrop-blur-sm' />
            </div>

            <Sidebar />
            <div className='flex-1  overflow-auto'>
                <Outlet />
                <StickyFooter />
            </div>
        </div>
    );
}

export default MainLayout
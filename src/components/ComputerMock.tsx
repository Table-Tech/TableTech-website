import React, { useState } from 'react';
import { 
  Home, Users, Menu, BarChart3, Settings, Clock, Euro, TrendingUp, 
  ShoppingCart, LogOut, Plus, Building, Wifi, RefreshCw, AlertCircle
} from 'lucide-react';

// Type definitions
interface Order {
  id: string;
  table: string;
  items: string;
  time: string;
  amount: string;
  status: 'pending' | 'preparing' | 'ready';
  paymentStatus: 'paid' | 'pay_later' | 'pending_payment';
}

interface Table {
  id: number;
  name: string;
  seats: number;
  code: string;
  location?: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image: string;
}

export default function ComputerMock() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'orders' | 'tables' | 'menu' | 'analytics' | 'settings'>('dashboard');
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableSeats, setNewTableSeats] = useState('4');
  const [tableNumberError, setTableNumberError] = useState('');

  // Mock data with state management
  const [recentOrders, setRecentOrders] = useState<Order[]>([
    { id: '0003', table: 'Table 1', items: '1 Mexican Burger + Standaard', time: '1 min geleden', amount: '€10.89', status: 'pending', paymentStatus: 'pay_later' },
    { id: '0002', table: 'Table 1', items: '1 Mexican Burger + Groot', time: '4 min geleden', amount: '€13.07', status: 'preparing', paymentStatus: 'pay_later' },
    { id: '0001', table: 'Table 3', items: '2 Pizza Margherita, 1 Cola', time: '8 min geleden', amount: '€28.50', status: 'ready', paymentStatus: 'paid' }
  ]);

  const [tables, setTables] = useState<Table[]>([
    { id: 1, name: 'Table 1', seats: 4, code: 'TMFL29', status: 'available' },
    { id: 2, name: 'Table 2', seats: 4, code: 'WDVKT6', status: 'occupied' },
    { id: 3, name: 'Table 3', seats: 2, code: 'XQ1888', status: 'available' },
    { id: 4, name: 'Table 4', seats: 4, code: '1DVYKS', status: 'reserved' },
    { id: 5, name: 'Table 5', seats: 4, code: 'DLB0Y3', status: 'maintenance' }
  ]);

  // Helper functions
  const generateTableCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCompleteOrder = (orderId: string) => {
    setRecentOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  const validateTableNumber = (tableNum: string) => {
    if (!tableNum) {
      setTableNumberError('Tafelnummer is verplicht');
      return false;
    }
    
    const numericTableNum = parseInt(tableNum);
    if (isNaN(numericTableNum) || numericTableNum < 1 || numericTableNum > 999) {
      setTableNumberError('Kies een uniek nummer voor deze tafel (1-999)');
      return false;
    }

    const existingTable = tables.find(table => 
      table.name.toLowerCase() === `table ${numericTableNum}` || 
      table.id === numericTableNum
    );
    
    if (existingTable) {
      setTableNumberError('Dit tafelnummer bestaat al');
      return false;
    }

    setTableNumberError('');
    return true;
  };

  const handleAddTable = () => {
    if (!validateTableNumber(newTableNumber)) return;

    const newTable: Table = {
      id: Math.max(...tables.map(t => t.id)) + 1,
      name: `Table ${newTableNumber}`,
      seats: parseInt(newTableSeats),
      code: generateTableCode(),
      status: 'available'
    };

    setTables([...tables, newTable]);
    setShowAddTableModal(false);
    setNewTableNumber('');
    setNewTableSeats('4');
    setTableNumberError('');
  };

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Classic burger',
      description: 'The classic delicious burger',
      price: 8.99,
      category: 'Burgers',
      available: true,
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect width="200" height="150" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="14"%3EClassic Burger%3C/text%3E%3C/svg%3E'
    },
    {
      id: '2',
      name: 'Mexican Burger',
      description: 'Hot mexican burger',
      price: 9.99,
      category: 'Burgers',
      available: true,
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect width="200" height="150" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="14"%3EMexican Burger%3C/text%3E%3C/svg%3E'
    },
    {
      id: '3',
      name: 'Spicey burger',
      description: 'Very hot',
      price: 12.55,
      category: 'Burgers',
      available: true,
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect width="200" height="150" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="14"%3ESpicey Burger%3C/text%3E%3C/svg%3E'
    },
    {
      id: '4',
      name: 'Margherita Pizza',
      description: 'alle soorten kies maar',
      price: 10.99,
      category: 'Pizzas',
      available: true,
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect width="200" height="150" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="14"%3EMargherita%3C/text%3E%3C/svg%3E'
    }
  ];

  // Sidebar Component
  const Sidebar = () => (
    <div className="w-48 bg-brown-800 h-full flex flex-col relative" style={{ backgroundColor: '#3E2723' }}>
      {/* Top gloss/highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
      <div className="absolute top-1 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent opacity-10"></div>
      
      <div className="p-4 border-b border-brown-700" style={{ borderColor: '#4A3426' }}>
        <div className="flex items-center space-x-2">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' }}>
            <img src="/favicon/apple-touch-icon.png" alt="TableTech Logo" className="w-16 h-16 object-cover scale-110" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base">TableTech</h1>
            <p className="text-xs" style={{ color: '#FF8A50' }}>TableTech Demo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-all duration-200 ${
            currentPage === 'dashboard' ? 'bg-brown-700' : 'hover:bg-brown-700 hover:bg-opacity-50'
          }`}
          style={{ 
            backgroundColor: currentPage === 'dashboard' ? '#5D4037' : 'transparent',
          }}
        >
          <Home className="w-4 h-4" style={{ color: currentPage === 'dashboard' ? '#FFFFFF' : '#8D6E63' }} />
          <span className={`text-sm ${currentPage === 'dashboard' ? 'text-white font-medium' : 'text-gray-300'}`}>Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentPage('orders')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-all duration-200 ${
            currentPage === 'orders' ? 'bg-brown-700' : 'hover:bg-brown-700 hover:bg-opacity-50'
          }`}
          style={{ 
            backgroundColor: currentPage === 'orders' ? '#5D4037' : 'transparent',
          }}
        >
          <ShoppingCart className="w-4 h-4" style={{ color: currentPage === 'orders' ? '#FFFFFF' : '#8D6E63' }} />
          <span className={`text-sm ${currentPage === 'orders' ? 'text-white font-medium' : 'text-gray-300'}`}>Orders</span>
        </button>

        <button
          onClick={() => setCurrentPage('tables')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-all duration-200 ${
            currentPage === 'tables' ? 'bg-brown-700' : 'hover:bg-brown-700 hover:bg-opacity-50'
          }`}
          style={{ 
            backgroundColor: currentPage === 'tables' ? '#5D4037' : 'transparent',
          }}
        >
          <Users className="w-4 h-4" style={{ color: currentPage === 'tables' ? '#FFFFFF' : '#8D6E63' }} />
          <span className={`text-sm ${currentPage === 'tables' ? 'text-white font-medium' : 'text-gray-300'}`}>Tables</span>
        </button>

        <button
          onClick={() => setCurrentPage('menu')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-all duration-200 ${
            currentPage === 'menu' ? 'bg-brown-700' : 'hover:bg-brown-700 hover:bg-opacity-50'
          }`}
          style={{ 
            backgroundColor: currentPage === 'menu' ? '#5D4037' : 'transparent',
          }}
        >
          <Menu className="w-4 h-4" style={{ color: currentPage === 'menu' ? '#FFFFFF' : '#8D6E63' }} />
          <span className={`text-sm ${currentPage === 'menu' ? 'text-white font-medium' : 'text-gray-300'}`}>Menu</span>
        </button>

        <button
          onClick={() => setCurrentPage('analytics')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-all duration-200 ${
            currentPage === 'analytics' ? 'bg-brown-700' : 'hover:bg-brown-700 hover:bg-opacity-50'
          }`}
          style={{ 
            backgroundColor: currentPage === 'analytics' ? '#5D4037' : 'transparent',
          }}
        >
          <BarChart3 className="w-4 h-4" style={{ color: currentPage === 'analytics' ? '#FFFFFF' : '#8D6E63' }} />
          <span className={`text-sm ${currentPage === 'analytics' ? 'text-white font-medium' : 'text-gray-300'}`}>Analytics</span>
        </button>

        <button
          onClick={() => setCurrentPage('settings')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-all duration-200 ${
            currentPage === 'settings' ? 'bg-brown-700' : 'hover:bg-brown-700 hover:bg-opacity-50'
          }`}
          style={{ 
            backgroundColor: currentPage === 'settings' ? '#5D4037' : 'transparent',
          }}
        >
          <Settings className="w-4 h-4" style={{ color: currentPage === 'settings' ? '#FFFFFF' : '#8D6E63' }} />
          <span className={`text-sm ${currentPage === 'settings' ? 'text-white font-medium' : 'text-gray-300'}`}>Settings</span>
        </button>
      </nav>

      <div className="p-3 border-t" style={{ borderColor: '#4A3426' }}>
        {/* Super Admin Profile */}
        <div className="relative rounded-lg p-3 mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F97316 50%, #EA580C 100%)' }}>
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Super Admin</p>
              <p className="text-xs" style={{ color: '#8D6E63' }}>Super Admin</p>
            </div>
          </div>
        </div>

        {/* Switch Restaurant */}
        <div className="relative rounded-lg mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-brown-700 hover:bg-opacity-50 transition-all">
            <Building className="w-4 h-4" style={{ color: '#8D6E63' }} />
            <span className="text-sm text-white">Switch Restaurant</span>
          </button>
        </div>

        {/* Logout */}
        <div className="relative rounded-lg" style={{ backgroundColor: 'rgba(220,38,38,0.15)' }}>
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-700 hover:bg-opacity-30 transition-all">
            <LogOut className="w-4 h-4" style={{ color: '#DC2626' }} />
            <span className="text-sm" style={{ color: '#DC2626' }}>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard Page
  const DashboardPage = () => {
    // Dynamic calculations based on current orders
    const todaysRevenue = recentOrders.reduce((total, order) => {
      return total + parseFloat(order.amount.replace('€', ''));
    }, 0);
    
    const activeOrders = recentOrders.filter(order => order.status === 'pending' || order.status === 'preparing').length;
    const totalOrdersToday = recentOrders.length;
    const avgOrderValue = totalOrdersToday > 0 ? todaysRevenue / totalOrdersToday : 0;

    return (
      <div className="flex-1 p-6 overflow-auto" style={{ backgroundColor: '#FDF4E3' }}>
        {/* Dashboard Header */}
        <div className="rounded-xl p-6 mb-6 shadow-sm border border-gray-200" style={{backgroundImage: 'linear-gradient(120deg, #f5f5f0 0%, #e6d7c3 50%, #d2b48c 100%)'}}>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>Dashboard</h1>
          <p className="text-gray-600 text-sm">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-yellow-50 via-amber-200 to-yellow-800/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-200" style={{backgroundImage: 'linear-gradient(to right, #d2b48c 0%, #e6d7c3 70%, #e6d7c3 100%)'}}>
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg p-2 shadow-sm" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' }}>
                <Euro className="w-5 h-5" style={{ color: '#5D4037' }} />
              </div>
            </div>
            <p className="text-xs mb-1" style={{ color: '#8D6E63' }}>Today's Revenue</p>
            <p className="text-xl font-bold" style={{ color: '#5D4037' }}>€{todaysRevenue.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 via-amber-200 to-yellow-800/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-200" style={{backgroundImage: 'linear-gradient(120deg, #e6d7c3 0%, #e6d7c3 50%, #d2b48c 100%)'}}>
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg p-2 shadow-sm" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' }}>
                <Clock className="w-5 h-5" style={{ color: '#5D4037' }} />
              </div>
            </div>
            <p className="text-xs mb-1" style={{ color: '#8D6E63' }}>Active Orders</p>
            <p className="text-xl font-bold" style={{ color: '#5D4037' }}>{activeOrders}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 via-amber-200 to-yellow-800/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-200" style={{backgroundImage: 'linear-gradient(140deg, #e6d7c3 0%, #dcc7a8 50%, #c8a882 100%)'}}>
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg p-2 shadow-sm" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' }}>
                <Users className="w-5 h-5" style={{ color: '#5D4037' }} />
              </div>
            </div>
            <p className="text-xs mb-1" style={{ color: '#8D6E63' }}>Orders Today</p>
            <p className="text-xl font-bold" style={{ color: '#5D4037' }}>{totalOrdersToday}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 via-amber-200 to-yellow-800/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-200" style={{backgroundImage: 'linear-gradient(160deg, #e6d7c3 0%, #e8d2b0 50%, #d4a574 100%)'}}>
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg p-2 shadow-sm" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' }}>
                <TrendingUp className="w-5 h-5" style={{ color: '#5D4037' }} />
              </div>
            </div>
            <p className="text-xs mb-1" style={{ color: '#8D6E63' }}>Avg Order Value</p>
            <p className="text-xl font-bold" style={{ color: '#5D4037' }}>€{avgOrderValue.toFixed(2)}</p>
          </div>
        </div>

      {/* Recent Orders */}
      <div className="rounded-xl shadow-sm" style={{backgroundImage: 'linear-gradient(135deg, #e6d7c3 0%, #e6d7c3 50%, #d2b48c 100%)'}}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" style={{ color: '#8D6E63' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#5D4037' }}>Recent Orders</h2>
          </div>
          <button 
            onClick={() => setCurrentPage('orders')}
            className="px-3 py-1 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 hover:bg-opacity-90 transform" 
            style={{ 
              backgroundImage: 'linear-gradient(to right, #8D6E63 0%, #8D6E63 70%, #A1887F 90%, #BCAAA4 100%)', 
              color: 'white',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #6D4C41 0%, #6D4C41 70%, #8D6E63 90%, #A1887F 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #8D6E63 0%, #8D6E63 70%, #A1887F 90%, #BCAAA4 100%)';
            }}>
            View all
          </button>
        </div>
        <div className="p-4 space-y-3">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order.id} 
                className="rounded-xl p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer transform hover:-translate-y-1 hover:bg-opacity-95" 
                style={{ 
                  background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)',
                  border: '1px solid #e6d7c3'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f9f7f4 100%)';
                  e.currentTarget.style.borderColor = '#d2b48c';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(93, 64, 55, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)';
                  e.currentTarget.style.borderColor = '#e6d7c3';
                  e.currentTarget.style.boxShadow = '';
                }}>
                
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3 transition-all duration-200">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium px-2 py-1 rounded transition-all duration-200 hover:shadow-sm" 
                      style={{ backgroundColor: '#8D6E63', color: 'white' }}>
                      #{order.id}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3 transition-all duration-200" style={{ color: '#8D6E63' }} />
                      <span className="font-semibold text-sm transition-all duration-200" style={{ color: '#5D4037' }}>{order.table}</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold transition-all duration-200 hover:scale-105" style={{ color: '#5D4037' }}>{order.amount}</span>
                </div>

                {/* Order Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs transition-all duration-200" style={{ color: '#8D6E63' }}>
                    <div className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200">
                      <Clock className="w-3 h-3" />
                      <span>{order.items} • {order.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Order Status */}
                    <div className="flex items-center space-x-1">
                      <span className="px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-sm hover:scale-105"
                        style={{ backgroundColor: '#f9f7f4', color: '#8D6E63', border: '1px solid #e6d7c3' }}>
                        {order.status === 'pending' ? 'Bevestigd' :
                         order.status === 'preparing' ? 'In Voorbereiding' : 'Klaar'}
                      </span>
                    </div>
                    
                    {/* Payment Status */}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 transition-all duration-200 hover:shadow-sm hover:scale-105 ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                      order.paymentStatus === 'pay_later' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                      'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}>
                      <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        order.paymentStatus === 'paid' ? 'bg-green-500' :
                        order.paymentStatus === 'pay_later' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}></div>
                      <span>
                        {order.paymentStatus === 'paid' ? 'Betaald' :
                         order.paymentStatus === 'pay_later' ? 'Niet Betaald' : 'Wacht op Betaling'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="rounded-full p-4 mb-4 mx-auto w-fit" style={{ backgroundColor: 'rgba(93, 64, 55, 0.1)' }}>
                <ShoppingCart className="w-8 h-8" style={{ color: '#8D6E63' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#5D4037' }}>
                Geen recente orders
              </h3>
              <p className="text-sm mb-4" style={{ color: '#8D6E63' }}>
                Er zijn momenteel geen actieve bestellingen.
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    );
  };

  // Tables Page
  const TablesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    
    const tableStats = {
      total: tables.length,
      available: tables.filter(t => t.status === 'available').length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      reserved: tables.filter(t => t.status === 'reserved').length,
      maintenance: tables.filter(t => t.status === 'maintenance').length
    };

    // Filter tables based on search term and status
    const filteredTables = tables.filter(table => {
      const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           table.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All Statuses' || 
                           table.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="flex-1 p-6 overflow-auto" style={{ backgroundColor: '#f5f5f0' }}>
        
        {/* Tables Header Section */}
        <div className="rounded-xl p-6 mb-6 shadow-sm border border-gray-200" 
          style={{ 
            backgroundImage: 'linear-gradient(120deg, #faf9f7 0%, #f2ede6 50%, #ede3d3 100%)'
          }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>Tables</h1>
              <p className="text-gray-600 text-sm">Beheer restaurant tafels en beschikbaarheid</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                className="px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition-all duration-200 hover:shadow-md"
                style={{ 
                  background: 'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)',
                  color: '#2E7D32',
                  border: '1px solid #A5D6A7'
                }}>
                <Wifi className="w-4 h-4 animate-pulse" />
                <span className="font-medium">Live</span>
              </button>
              <button className="px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition-all duration-200 hover:shadow-md"
                style={{ 
                  background: 'linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%)',
                  color: 'white' 
                }}>
                <RefreshCw className="w-4 h-4" />
                <span className="font-medium">Vernieuwen</span>
              </button>
              <button 
                onClick={() => setShowAddTableModal(true)}
                className="px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition-all duration-200 hover:shadow-md transform hover:scale-105"
                style={{ 
                  backgroundColor: '#5D4037',
                  color: 'white'
                }}
              >
                <span className="text-lg">+</span>
                <span>Add Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards Row - 5 elements */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer transform hover:scale-105 border border-gray-200" 
            style={{ 
              backgroundImage: 'linear-gradient(to right, #ede3d3 0%, #f2ede6 70%, #f7f4f1 100%)'
            }}>
            <div className="text-center">
              <p className="text-2xl font-bold mb-1" style={{ color: '#5D4037' }}>{tableStats.total}</p>
              <p className="text-sm font-medium" style={{ color: '#8D6E63' }}>Total Tables</p>
            </div>
          </div>

          <div className="rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer transform hover:scale-105 border border-gray-200" 
            style={{ 
              backgroundImage: 'linear-gradient(120deg, #ede3d3 0%, #f2ede6 50%, #f7f4f1 100%)'
            }}>
            <div className="text-center">
              <p className="text-2xl font-bold mb-1 text-green-700">{tableStats.available}</p>
              <p className="text-sm font-medium text-green-800">Available</p>
            </div>
          </div>

          <div className="rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer transform hover:scale-105 border border-gray-200" 
            style={{ 
              backgroundImage: 'linear-gradient(140deg, #ede3d3 0%, #f0e8dc 50%, #f4f0ea 100%)'
            }}>
            <div className="text-center">
              <p className="text-2xl font-bold mb-1 text-orange-700">{tableStats.occupied}</p>
              <p className="text-sm font-medium text-orange-800">Occupied</p>
            </div>
          </div>

          <div className="rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer transform hover:scale-105 border border-gray-200" 
            style={{ 
              backgroundImage: 'linear-gradient(160deg, #ede3d3 0%, #f1e7db 50%, #f6f2ed 100%)'
            }}>
            <div className="text-center">
              <p className="text-2xl font-bold mb-1 text-yellow-700">{tableStats.reserved}</p>
              <p className="text-sm font-medium text-yellow-800">Reserved</p>
            </div>
          </div>

          <div className="rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer transform hover:scale-105 border border-gray-200" 
            style={{ 
              backgroundImage: 'linear-gradient(180deg, #ede3d3 0%, #f0e8dc 50%, #f5f1ec 100%)'
            }}>
            <div className="text-center">
              <p className="text-2xl font-bold mb-1 text-purple-700">{tableStats.maintenance}</p>
              <p className="text-sm font-medium text-purple-800">Maintenance</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="rounded-xl p-4 mb-6 shadow-sm border border-gray-200" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, #ede3d3 0%, #f2ede6 70%, #f7f4f1 100%)'
          }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input 
                type="text" 
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  borderColor: '#e6d7c3',
                  backgroundColor: 'white'
                }}
              />
              <span className="text-sm font-medium" style={{ color: '#8D6E63' }}>Search Table</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium" style={{ color: '#8D6E63' }}>Filter:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  borderColor: '#e6d7c3',
                  backgroundColor: 'white',
                  color: '#5D4037'
                }}
              >
                <option>All Statuses</option>
                <option>Available</option>
                <option>Occupied</option>
                <option>Reserved</option>
                <option>Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-4 gap-4">
          {filteredTables.length > 0 ? (
            filteredTables.map((table) => (
              <div key={table.id}
                className="rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer border border-gray-200 flex flex-col items-center text-center"
                style={{
                  backgroundImage:
                    table.status === 'available'
                      ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)'
                      : table.status === 'occupied'
                        ? 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 30%, #fed7aa 100%)'
                        : table.status === 'maintenance'
                          ? 'linear-gradient(135deg, #f8f5f0 0%, #ede1d0 30%, #d4c0a5 100%)'
                          : table.status === 'reserved'
                            ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 30%, #fde68a 100%)'
                            : 'linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 30%, #e5e5e5 100%)',
                  backgroundColor:
                    table.status === 'available'
                      ? '#f0fdf4'
                      : table.status === 'occupied'
                        ? '#fff7ed'
                        : table.status === 'maintenance'
                          ? '#f8f5f0'
                          : table.status === 'reserved'
                            ? '#fffbeb'
                            : '#f9f9f9'
                }}>
                
                {/* Table Header with status dot and name */}
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${
                    table.status === 'available' ? 'bg-green-500' :
                    table.status === 'occupied' ? 'bg-orange-500' :
                    table.status === 'reserved' ? 'bg-yellow-500' : 
                    table.status === 'maintenance' ? 'bg-gray-600' : 'bg-gray-500'
                  }`}></div>
                  <h3 className="font-semibold text-lg" style={{ color: '#5D4037' }}>{table.name}</h3>
                </div>

                {/* Seats with icon */}
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Users className="w-4 h-4" style={{ color: '#8D6E63' }} />
                  <span className="text-sm font-medium" style={{ color: '#8D6E63' }}>{table.seats} plaatsen</span>
                </div>

                {/* Code */}
                <div className="mb-4">
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      Code: {table.code}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    table.status === 'available' ? 'bg-green-200 text-green-800' :
                    table.status === 'occupied' ? 'bg-orange-100 text-orange-700' :
                    table.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' : 
                    table.status === 'maintenance' ? 'bg-gray-100 text-gray-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {table.status === 'available' ? 'Beschikbaar' :
                     table.status === 'occupied' ? 'Bezet' :
                     table.status === 'reserved' ? 'Gereserveerd' :
                     table.status === 'maintenance' ? 'Onderhoud' :
                     String(table.status).charAt(0).toUpperCase() + String(table.status).slice(1)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-8">
              <p className="text-lg font-medium mb-2" style={{ color: '#8D6E63' }}>No tables found</p>
              <p className="text-sm" style={{ color: '#8D6E63' }}>
                {searchTerm || statusFilter !== 'All Statuses' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No tables available'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Menu Page  
  const MenuPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All Items');
    
    const categories = ['All Items', 'Burgers', 'Pizzas'];
    
    const filteredItems = menuItems.filter(item => {
      if (selectedCategory !== 'All Items' && item.category !== selectedCategory) return false;
      return true;
    });

    const categoryGroups = filteredItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

    return (
      <div className="flex-1 p-6 overflow-auto" style={{ backgroundColor: '#FDF4E3' }}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>Menu Management</h1>
            <p className="text-gray-600 text-sm">Manage your restaurant's menu items and categories</p>
          </div>
          <button className="px-3 py-1 rounded-lg flex items-center space-x-1 text-xs"
            style={{ backgroundColor: '#5D4037', color: 'white' }}>
            <Plus className="w-3 h-3" />
            <span className="font-medium">Add Menu Item</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: selectedCategory === category ? '#5D4037' : undefined,
                  background: selectedCategory !== category ? 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' : undefined
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        {Object.entries(categoryGroups).map(([category, items]) => (
          <div key={category} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center space-x-2">
                <span className="text-xl">
                  {category === 'Burgers' ? '🍔' : category === 'Pizzas' ? '🍕' : '🍽️'}
                </span>
                <span>{category}</span>
              </h2>
              <span className="text-xs text-gray-500">{items.length} items</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-xl overflow-hidden shadow-sm" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' }}>
                  <div className="h-24 relative" style={{ background: 'linear-gradient(135deg, #f2ede6 0%, #e6d7c3 100%)' }}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm" style={{ color: '#5D4037' }}>{item.name}</h3>
                        <p className="text-xs" style={{ color: '#8D6E63' }}>{item.description}</p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#4CAF50' }}>
                        €{item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{category}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tables':
        return <TablesPage />;
      case 'menu':
        return <MenuPage />;
      case 'orders':
        return (
          <div className="flex-1 flex flex-col h-full" style={{ backgroundColor: '#f5f5f0' }}>
            
            {/* Live Bestellingen Header - Sticky */}
            <div className="sticky top-0 z-10 rounded-xl p-6 mb-6 mx-4 mt-4 shadow-sm border border-gray-200" 
              style={{ 
                backgroundImage: 'linear-gradient(120deg, #faf9f7 0%, #f2ede6 50%, #ede3d3 100%)'
              }}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>Live Bestellingen</h1>
                  <p className="text-gray-600 text-sm">Beheer actieve restaurantbestellingen</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    className="px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition-all duration-200 hover:shadow-md"
                    style={{ 
                      background: 'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)',
                      color: '#2E7D32',
                      border: '1px solid #A5D6A7'
                    }}>
                    <Wifi className="w-4 h-4 animate-pulse" />
                    <span className="font-medium">Live</span>
                  </button>
                  <button className="px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition-all duration-200 hover:shadow-md"
                    style={{ 
                      background: 'linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%)',
                      color: 'white' 
                    }}>
                    <RefreshCw className="w-4 h-4" />
                    <span className="font-medium">Vernieuwen</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Orders Content */}
            <div className="flex-1 overflow-auto px-4 pb-4 demo-scroll">
              {/* Orders Grid - Wat groter */}
              {recentOrders.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {recentOrders.map((order) => (
                  <div key={order.id} 
                    className="rounded-xl p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer transform hover:-translate-y-1 border border-gray-200" 
                    style={{ 
                      backgroundImage: 'linear-gradient(to right, #ede3d3 0%, #f2ede6 70%, #f7f4f1 100%)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #f7f4f1 0%, #faf9f7 70%, #ffffff 100%)';
                      e.currentTarget.style.borderColor = '#d2b48c';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(93, 64, 55, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #ede3d3 0%, #f2ede6 70%, #f7f4f1 100%)';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = '';
                    }}>
                    
                    {/* Order Header - Groter */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 transition-all duration-200 hover:scale-110" style={{ color: '#8D6E63' }} />
                        <h3 className="font-semibold text-base transition-all duration-200 hover:text-orange-600" style={{ color: '#5D4037' }}>{order.table}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Order Status - Groter */}
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-sm hover:scale-105"
                          style={{ backgroundColor: '#f9f7f4', color: '#8D6E63', border: '1px solid #e6d7c3' }}>
                          {order.status === 'pending' ? 'Bevestigd' :
                           order.status === 'preparing' ? 'Bereid' : 'Klaar'}
                        </span>
                        
                        {/* Payment Status - Groter */}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 transition-all duration-200 hover:shadow-sm hover:scale-105 ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600 hover:bg-green-200' :
                          order.paymentStatus === 'pay_later' ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' :
                          'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}>
                          {order.paymentStatus === 'paid' ? (
                            <div className="w-2 h-2 bg-green-500 rounded-full transition-all duration-200"></div>
                          ) : order.paymentStatus === 'pay_later' ? (
                            <AlertCircle className="w-3 h-3 text-orange-500 transition-all duration-200 hover:scale-110" />
                          ) : (
                            <div className="w-2 h-2 bg-red-500 rounded-full transition-all duration-200"></div>
                          )}
                          <span>
                            {order.paymentStatus === 'paid' ? 'Betaald' :
                             order.paymentStatus === 'pay_later' ? 'Niet Betaald' : 'Wacht'}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Order Details - Groter */}
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1.5 transition-all duration-200 hover:text-orange-600" style={{ color: '#8D6E63' }}>
                        #{order.id.slice(-4)}
                      </p>
                      <div className="flex items-center space-x-4 text-sm" style={{ color: '#8D6E63' }}>
                        <div className="flex items-center space-x-1 transition-all duration-200 hover:text-gray-700">
                          <Clock className="w-3.5 h-3.5 transition-all duration-200 hover:scale-110" />
                          <span>{order.time}</span>
                        </div>
                        <div className="flex items-center space-x-1 transition-all duration-200 hover:text-gray-700">
                          <ShoppingCart className="w-3.5 h-3.5 transition-all duration-200 hover:scale-110" />
                          <span>{order.items}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items - Groter */}
                    <div className="mb-3 p-3 rounded-lg transition-all duration-200 hover:bg-opacity-80" style={{ backgroundColor: 'rgba(141, 110, 99, 0.05)' }}>
                      <div className="space-y-2">
                        {order.items.split(', ').slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center justify-between hover:bg-white hover:bg-opacity-50 p-1 rounded transition-all duration-200">
                            <div className="flex-1 mr-2">
                              <div className="flex items-center flex-wrap gap-1">
                                <span className="font-medium text-sm transition-all duration-200 hover:text-orange-600" style={{ color: '#5D4037' }}>
                                  {item.includes('Mexican Burger') ? 'Mexican Burger' : item}
                                </span>
                                {item.includes('Mexican Burger') && (
                                  <span className="text-xs px-1.5 py-0.5 rounded whitespace-nowrap transition-all duration-200 hover:shadow-sm hover:scale-105" 
                                    style={{ backgroundColor: '#8D6E63', color: 'white' }}>
                                    {item.includes('Standaard') ? '+ Standaard' : '+ Groot'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm font-medium flex-shrink-0 transition-all duration-200 hover:scale-105 hover:text-green-600" style={{ color: '#5D4037' }}>
                              {item.includes('Mexican Burger') ? 
                                (item.includes('Standaard') ? '€10.89' : '€13.07') :
                                item.includes('Pizza') ? '€12.50' : '€2.50'
                              }
                            </div>
                          </div>
                        ))}
                        
                        {order.items.split(', ').length > 2 && (
                          <div className="text-sm transition-all duration-200 hover:text-gray-700" style={{ color: '#8D6E63' }}>
                            +{order.items.split(', ').length - 2} meer...
                          </div>
                        )}
                        
                        {/* Total - Groter */}
                        <div className="border-t pt-2 mt-2 transition-all duration-200 hover:border-gray-400" style={{ borderColor: '#e6d7c3' }}>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm transition-all duration-200" style={{ color: '#5D4037' }}>Totaal</span>
                            <span className="font-bold text-base transition-all duration-200 hover:scale-105 hover:text-green-600" style={{ color: '#5D4037' }}>{order.amount}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button - Groter */}
                    <button 
                      onClick={() => handleCompleteOrder(order.id)}
                      className="w-full py-2.5 rounded-lg font-medium text-white transition-all duration-300 hover:shadow-lg transform hover:scale-105 hover:-translate-y-0.5 text-sm"
                      style={{ 
                        background: 'linear-gradient(135deg, #5D4037 0%, #4A2C2A 100%)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #4A2C2A 0%, #3E2723 100%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #5D4037 0%, #4A2C2A 100%)';
                      }}>
                      Markeer als Voltooid
                    </button>
                  </div>
                ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="rounded-full p-4 mb-4" style={{ backgroundColor: 'rgba(93, 64, 55, 0.1)' }}>
                    <ShoppingCart className="w-12 h-12" style={{ color: '#8D6E63' }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#5D4037' }}>
                    Alle orders voltooid! 🎉
                  </h3>
                  <p className="text-sm mb-4" style={{ color: '#8D6E63' }}>
                    Er zijn momenteel geen actieve bestellingen.
                  </p>
                  <button 
                    onClick={() => {
                      // Reset orders for demo purposes
                      setRecentOrders([
                        { id: '0003', table: 'Table 1', items: '1 Mexican Burger + Standaard', time: '1 min geleden', amount: '€10.89', status: 'pending', paymentStatus: 'pay_later' },
                        { id: '0002', table: 'Table 1', items: '1 Mexican Burger + Groot', time: '4 min geleden', amount: '€13.07', status: 'preparing', paymentStatus: 'pay_later' },
                        { id: '0001', table: 'Table 3', items: '2 Pizza Margherita, 1 Cola', time: '8 min geleden', amount: '€28.50', status: 'ready', paymentStatus: 'paid' }
                      ]);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:shadow-md"
                    style={{ backgroundColor: '#5D4037' }}>
                    Demo Orders Herstellen
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex-1 p-6" style={{ backgroundColor: '#FDF4E3' }}>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>Analytics</h1>
            <p className="text-gray-600 text-sm">View detailed analytics and insights</p>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 p-6" style={{ backgroundColor: '#FDF4E3' }}>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>Settings</h1>
            <p className="text-gray-600 text-sm">Configure your restaurant settings</p>
          </div>
        );
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="relative w-[1200px] h-[768px] rounded-t-2xl overflow-hidden shadow-2xl border-4 border-black flex flex-col font-sans" 
      style={{ 
        background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)'
      }}>
      <style>{`
        .demo-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .demo-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .demo-scroll::-webkit-scrollbar-thumb {
          background: #8D6E63;
          border-radius: 3px;
        }
        .demo-scroll::-webkit-scrollbar-thumb:hover {
          background: #5D4037;
        }
      `}</style>
      <div className="w-full h-full bg-black rounded-t-2xl p-2">
        <div className="w-full h-full rounded-xl overflow-auto flex flex-col relative demo-scroll" style={{ background: 'linear-gradient(135deg, #f5f5f0 0%, #e6d7c3 100%)' }}>
          {/* Browser bar */}
          <div className="border-b flex items-center justify-between px-4 py-2 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' }}>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 mx-6">
              <div className="rounded-lg px-4 py-2 text-sm text-gray-600 flex items-center" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' }}>
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                tabletech.app/dashboard
              </div>
            </div>
          </div>

          {/* Full Interactive Dashboard */}
          <div className="flex h-full">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-auto demo-scroll">
              {renderPage()}
            </div>
          </div>
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#5D4037' }}>Nieuwe Tafel Toevoegen</h2>
              <button 
                onClick={() => {
                  setShowAddTableModal(false);
                  setNewTableNumber('');
                  setNewTableSeats('4');
                  setTableNumberError('');
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>

            {/* Table Number Input */}
            <div className="mb-4">
              <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: '#5D4037' }}>
                <span className="text-lg">#</span>
                <span>Tafelnummer</span>
              </label>
              <input
                type="text"
                value={newTableNumber}
                onChange={(e) => {
                  setNewTableNumber(e.target.value);
                  if (e.target.value && tableNumberError) {
                    validateTableNumber(e.target.value);
                  }
                }}
                onBlur={() => newTableNumber && validateTableNumber(newTableNumber)}
                placeholder="Voer tafelnummer in (1-999)"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  tableNumberError 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {tableNumberError && (
                <p className="text-red-500 text-xs mt-1">{tableNumberError}</p>
              )}
              {!tableNumberError && newTableNumber && (
                <p className="text-gray-500 text-xs mt-1">Kies een uniek nummer voor deze tafel (1-999)</p>
              )}
            </div>

            {/* Seats Input */}
            <div className="mb-6">
              <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: '#5D4037' }}>
                <span className="text-lg">👥</span>
                <span>Zitcapaciteit</span>
              </label>
              <input
                type="number"
                value={newTableSeats}
                onChange={(e) => setNewTableSeats(e.target.value)}
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-gray-500 text-xs mt-1">Maximum aantal klanten dat aan deze tafel kan zitten (1-20)</p>
            </div>

            {/* QR Code Info */}
            {newTableNumber && !tableNumberError && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-blue-600 text-sm">📱</span>
                  <span className="text-blue-800 text-sm font-medium">QR Code wordt gegenereerd</span>
                </div>
                <p className="text-blue-700 text-xs">
                  Klanten scannen deze code om toegang te krijgen tot Tafel {newTableNumber}
                </p>
              </div>
            )}

            {/* Table Overview */}
            {newTableNumber && !tableNumberError && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-green-800 text-sm font-medium mb-2">Tafel Overzicht</h3>
                <ul className="text-green-700 text-xs space-y-1">
                  <li>• <strong>Tafelnummer:</strong> {newTableNumber}</li>
                  <li>• <strong>Zitcapaciteit:</strong> {newTableSeats} personen</li>
                  <li>• <strong>QR Code:</strong> Wordt automatisch gegenereerd</li>
                  <li>• <strong>Status:</strong> Beschikbaar (standaard)</li>
                </ul>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddTableModal(false);
                  setNewTableNumber('');
                  setNewTableSeats('4');
                  setTableNumberError('');
                }}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ color: '#5D4037' }}
              >
                Annuleren
              </button>
              <button
                onClick={handleAddTable}
                disabled={!newTableNumber || !!tableNumberError}
                className="px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: !newTableNumber || !!tableNumberError ? '#ccc' : '#5D4037',
                  color: 'white'
                }}
              >
                Tafel Aanmaken
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Laptop bottom */}
      <div className="w-[1600px] h-5 bg-gray-400 rounded-b-2xl -mt-1 shadow-lg mx-auto"></div>
      <div className="w-[1700px] h-3 bg-gray-500 rounded-full -mt-1 shadow-xl mx-auto"></div>
    </div>
  );
}
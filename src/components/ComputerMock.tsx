import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  Menu,
  BarChart3,
  Settings,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Euro,
  TrendingUp,
  Download,
  Edit,
  UserPlus,
  CreditCard,
  Palette,
  Bell,
  Search,
  Calendar,
  Star,
  Eye,
  MoreHorizontal,
  MapPin,
  Timer,
  Check,
  X
} from 'lucide-react';

type TabId = 'home' | 'tables' | 'menu' | 'stats' | 'manage';

interface Table {
  id: number;
  number: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'ordering';
  guests?: number;
  duration?: string;
  orders?: number;
  reservedFor?: string;
  total?: number;
  customerName?: string;
}

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  sold: number;
  available: boolean;
  rating?: number;
  description?: string;
  ingredients?: string;
}

interface Order {
  id: number;
  table: number;
  items: string[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  time: string;
  orderTime: string;
}

export default function ComputerMock() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [manageModal, setManageModal] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const initialTables: Table[] = [
    { id: 1, number: 1, status: 'available' },
    { id: 2, number: 2, status: 'occupied', guests: 4, duration: '45 min', orders: 6, total: 68.50, customerName: 'Familie Jansen' },
    { id: 3, number: 3, status: 'reserved', reservedFor: '18:30', guests: 6, customerName: 'Van der Berg' },
    { id: 4, number: 4, status: 'occupied', guests: 3, duration: '65 min', orders: 8, total: 94.20, customerName: 'Pietersen' },
    { id: 5, number: 5, status: 'available' },
    { id: 6, number: 6, status: 'available' },
    { id: 7, number: 7, status: 'reserved', reservedFor: '19:45', guests: 4, customerName: 'De Vries' },
    { id: 8, number: 8, status: 'occupied', guests: 2, duration: '15 min', orders: 2, total: 31.40, customerName: 'Bakker' },
    { id: 9, number: 9, status: 'available' },
    { id: 10, number: 10, status: 'cleaning' },
    { id: 11, number: 11, status: 'available' },
    { id: 12, number: 12, status: 'ordering', guests: 5, customerName: 'Smit' },
    { id: 13, number: 13, status: 'occupied', guests: 2, duration: '25 min', orders: 3, total: 47.80, customerName: 'Hendriks' },
    { id: 14, number: 14, status: 'available' },
    { id: 15, number: 15, status: 'reserved', reservedFor: '20:15', guests: 3, customerName: 'Mulder' },
  ];

  const [tablesState, setTablesState] = useState<Table[]>(initialTables);
  const [tableAction, setTableAction] = useState<{
    action: 'guests' | 'reserve' | 'new' | 'checkout';
    tableId?: number;
  } | null>(null);
  const [guestInput, setGuestInput] = useState(0);
  const [reserveData, setReserveData] = useState({ guests: 0, name: '', time: '' });
  const [newTableNumber, setNewTableNumber] = useState(initialTables.length + 1);
  const [detailsTable, setDetailsTable] = useState<Table | null>(null);
  const [paymentData, setPaymentData] = useState({
    tableId: 0,
    total: 0,
    paymentMethod: 'cash',
    completed: false
  });

  const handleSaveGuests = () => {
    if (!tableAction?.tableId) return;
    setTablesState(prev =>
      prev.map(t =>
        t.id === tableAction.tableId ? { ...t, guests: guestInput, status: 'occupied' as const } : t
      )
    );
    setTableAction(null);
    setGuestInput(0);
  };

  const handleReserve = () => {
    if (!tableAction?.tableId) return;
    setTablesState(prev =>
      prev.map(t =>
        t.id === tableAction.tableId
          ? {
              ...t,
              guests: reserveData.guests,
              customerName: reserveData.name,
              reservedFor: reserveData.time,
              status: 'reserved' as const
            }
          : t
      )
    );
    setTableAction(null);
    setReserveData({ guests: 0, name: '', time: '' });
  };

  const handleAddTable = () => {
    setTablesState(prev => [
      ...prev,
      { id: prev.length + 1, number: newTableNumber, status: 'available' as const }
    ]);
    setTableAction(null);
    setNewTableNumber(newTableNumber + 1);
  };

  const handleCheckIn = (id: number) => {
    setTablesState(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'occupied' as const } : t))
    );
  };

  const handleCancelReservation = (id: number) => {
    setTablesState(prev =>
      prev.map(t =>
        t.id === id
          ? { id: t.id, number: t.number, status: 'available' as const }
          : t
      )
    );
  };

  const startCheckout = (tableId: number) => {
    const table = tablesState.find(t => t.id === tableId);
    if (table) {
      setPaymentData({
        tableId: table.id,
        total: table.total || 0,
        paymentMethod: 'cash',
        completed: false
      });
      setTableAction({ action: 'checkout', tableId });
    }
  };

  const finishCheckout = () => {
    setTablesState(prev =>
      prev.map(t =>
        t.id === paymentData.tableId
          ? { id: t.id, number: t.number, status: 'available' as const }
          : t
      )
    );
    setPaymentData({ ...paymentData, completed: true });
    setTimeout(() => {
      setTableAction(null);
      setPaymentData({ tableId: 0, total: 0, paymentMethod: 'cash', completed: false });
    }, 2000);
  };

  const initialMenuItems: MenuItem[] = [
    { id: 1, name: 'Margherita Pizza', category: 'Pizza', price: 9.95, image: '/menu/menu1.jpg', sold: 23, available: true, rating: 4.5, description: 'Klassieke pizza met tomaat, mozzarella en basilicum' },
    { id: 2, name: 'Pepperoni Pizza', category: 'Pizza', price: 11.50, image: '/menu/menu2.jpg', sold: 18, available: true, rating: 4.3, description: 'Pizza met pepperoni en extra kaas' },
    { id: 3, name: 'Prawn Raisukaree', category: 'Popular', price: 12.00, image: '/menu/menu1.jpg', sold: 31, available: true, rating: 4.8, description: 'Pittige garnalen curry met rijst' },
    { id: 4, name: 'Chicken Katsu Curry', category: 'Curry', price: 10.50, image: '/menu/menu3.jpg', sold: 15, available: true, rating: 4.4, description: 'Japanse kip curry met panko coating' },
    { id: 5, name: 'Tofu Firecracker Ramen', category: 'Ramen', price: 9.75, image: '/menu/menu5.jpg', sold: 12, available: false, rating: 4.2, description: 'Pittige ramen met tofu en groenten' },
    { id: 6, name: 'Cola', category: 'Drankjes', price: 2.50, image: '/menu/menu5.jpg', sold: 67, available: true, rating: 4.0, description: 'Koude cola' },
    { id: 7, name: 'Spa Blauw', category: 'Drankjes', price: 2.00, image: '/menu/menu3.jpg', sold: 45, available: true, rating: 4.1, description: 'Bruisend water' },
    { id: 8, name: 'Beef Ramen', category: 'Ramen', price: 11.25, image: '/menu/menu4.jpg', sold: 19, available: true, rating: 4.6, description: 'Rijke ramen met rundvlees' },
    { id: 9, name: 'Tiramisu', category: 'Dessert', price: 6.50, image: '/menu/menu2.jpg', sold: 8, available: true, rating: 4.7, description: 'Klassieke Italiaanse tiramisu' },
    { id: 10, name: 'Witte Wijn', category: 'Drankjes', price: 4.50, image: '/menu/menu4.jpg', sold: 22, available: true, rating: 4.3, description: 'Huiswijn wit' },
  ];

  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItemModal, setNewItemModal] = useState(false);
  const [newItemData, setNewItemData] = useState({
    name: '',
    ingredients: '',
    price: 0,
    image: '/menu/menu1.jpg',
    description: '',
    category: 'Popular'
  });
  const [menuOptionsOpen, setMenuOptionsOpen] = useState<number | null>(null);

  const availableImages = [
    '/menu/menu1.jpg',
    '/menu/menu2.jpg', 
    '/menu/menu3.jpg',
    '/menu/menu4.jpg',
    '/menu/menu5.jpg'
  ];

  const deleteMenuItem = (id: number) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    setMenuOptionsOpen(null);
  };

  const duplicateMenuItem = (item: MenuItem) => {
    const newItem = {
      ...item,
      id: Math.max(...menuItems.map(i => i.id)) + 1,
      name: `${item.name} (kopie)`
    };
    setMenuItems(prev => [...prev, newItem]);
    setMenuOptionsOpen(null);
  };

  const toggleItemAvailability = (id: number) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
    setMenuOptionsOpen(null);
  };

  const liveOrders: Order[] = [
    { id: 1, table: 2, items: ['Margherita Pizza', 'Cola'], total: 12.45, status: 'preparing', time: '5 min', orderTime: '17:23' },
    { id: 2, table: 4, items: ['Pepperoni Pizza', 'Prawn Raisukaree'], total: 23.50, status: 'ready', time: '12 min', orderTime: '17:15' },
    { id: 3, table: 8, items: ['Chicken Katsu Curry'], total: 10.50, status: 'pending', time: '2 min', orderTime: '17:25' },
    { id: 4, table: 13, items: ['Tofu Ramen', 'Spa Blauw'], total: 11.75, status: 'served', time: '18 min', orderTime: '17:09' },
    { id: 5, table: 12, items: ['Beef Ramen', 'Witte Wijn'], total: 15.75, status: 'preparing', time: '8 min', orderTime: '17:19' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'occupied': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'reserved': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cleaning': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'ordering': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-3 h-3" />;
      case 'occupied': return <Users className="w-3 h-3" />;
      case 'reserved': return <Clock className="w-3 h-3" />;
      case 'cleaning': return <AlertCircle className="w-3 h-3" />;
      case 'ordering': return <Menu className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'preparing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ready': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'served': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getMenuIcon = (src: string) => (
    <img
      src={src}
      alt="menu-item"
      className="w-12 h-12 rounded-lg object-cover"
    />
  );

  const tabs = [
    { id: 'home' as TabId, label: 'Dashboard', icon: Home },
    { id: 'tables' as TabId, label: 'Tafels', icon: MapPin },
    { id: 'menu' as TabId, label: 'Menu', icon: Menu },
    { id: 'stats' as TabId, label: 'Analytics', icon: BarChart3 },
    { id: 'manage' as TabId, label: 'Beheer', icon: Settings },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 h-full overflow-y-auto">
            <div className="grid grid-cols-4 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Totale omzet</p>
                    <p className="text-2xl font-bold text-emerald-600">€847.30</p>
                    <p className="text-sm text-emerald-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12.5%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Euro className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Actieve tafels</p>
                    <p className="text-2xl font-bold text-amber-600">6</p>
                    <p className="text-sm text-amber-600">van 15 tafels</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Live bestellingen</p>
                    <p className="text-2xl font-bold text-blue-600">{liveOrders.length}</p>
                    <p className="text-sm text-blue-600">actief nu</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vandaag verkocht</p>
                    <p className="text-2xl font-bold text-purple-600">127</p>
                    <p className="text-sm text-purple-600">items</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Live Bestellingen</h3>
                <div className="text-sm text-gray-500">
                  {currentTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <AnimatePresence>
                    {liveOrders.map((order) => (
                      <motion.div 
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-semibold">
                            T{order.table}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.items.join(', ')}
                            </div>
                            <div className="text-sm text-gray-500">
                              Besteld om {order.orderTime}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getOrderStatusColor(order.status)}`}>
                            {order.status === 'pending' && 'Wachtend'}
                            {order.status === 'preparing' && 'In bereiding'}
                            {order.status === 'ready' && 'Klaar'}
                            {order.status === 'served' && 'Geserveerd'}
                          </span>
                          <div className="text-sm text-gray-500 min-w-[3rem]">{order.time}</div>
                          <div className="text-lg font-semibold text-emerald-600 min-w-[4rem] text-right">€{order.total.toFixed(2)}</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Tafel Overzicht</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-6 gap-3">
                  {tablesState.map((table) => (
                    <motion.div
                      key={table.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${getStatusColor(table.status)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">T{table.number}</span>
                        {getStatusIcon(table.status)}
                      </div>
                      {table.guests && (
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {table.guests}
                          </div>
                          {table.duration && (
                            <div className="flex items-center">
                              <Timer className="w-3 h-3 mr-1" />
                              {table.duration}
                            </div>
                          )}
                          {table.total && (
                            <div className="font-semibold text-emerald-600">
                              €{table.total.toFixed(0)}
                            </div>
                          )}
                        </div>
                      )}
                      {table.reservedFor && (
                        <div className="text-sm">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {table.reservedFor}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'tables':
        return (
          <div className="space-y-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Tafel Management</h2>
              <button
                onClick={() => setTableAction({ action: 'new' })}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-amber-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nieuwe Tafel</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 max-h-[520px] overflow-y-auto">
              {tablesState.map((table) => (
                <motion.div 
                  key={table.id} 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Tafel {table.number}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(table.status)}`}>
                      {table.status === 'available' && 'Beschikbaar'}
                      {table.status === 'occupied' && 'Bezet'}
                      {table.status === 'reserved' && 'Gereserveerd'}
                      {table.status === 'cleaning' && 'Schoonmaken'}
                      {table.status === 'ordering' && 'Bestellen'}
                    </span>
                  </div>

                  {table.customerName && (
                    <div className="text-sm text-gray-600 mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {table.customerName}
                    </div>
                  )}

                  {table.status === 'occupied' && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {table.guests} gasten
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {table.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {table.orders} bestellingen
                      </div>
                      {table.total && (
                        <div className="text-lg font-semibold text-emerald-600">
                          €{table.total.toFixed(2)}
                        </div>
                      )}
                    </div>
                  )}

                  {table.status === 'reserved' && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {table.reservedFor}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {table.guests} personen
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {table.status === 'available' && (
                      <>
                        <button
                          onClick={() => setTableAction({ action: 'guests', tableId: table.id })}
                          className="flex-1 bg-emerald-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
                        >
                          Gasten
                        </button>
                        <button
                          onClick={() => setTableAction({ action: 'reserve', tableId: table.id })}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Reserveren
                        </button>
                      </>
                    )}
                    {(table.status === 'occupied' || table.status === 'ordering') && (
                      <>
                        <button
                          onClick={() => setDetailsTable(table)}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => startCheckout(table.id)}
                          className="flex-1 bg-emerald-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
                        >
                          Afrekenen
                        </button>
                      </>
                    )}
                    {table.status === 'reserved' && (
                      <>
                        <button
                          onClick={() => handleCheckIn(table.id)}
                          className="flex-1 bg-amber-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-amber-700 transition-colors"
                        >
                          Check-in
                        </button>
                        <button
                          onClick={() => handleCancelReservation(table.id)}
                          className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                          Annuleren
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'menu':
        return (
          <div className="space-y-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek gerechten..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setNewItemModal(true)}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-amber-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nieuw Gerecht</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {['Pizza', 'Popular', 'Curry', 'Ramen', 'Drankjes', 'Dessert'].map((category) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">{category}</h3>
                      <div className="space-y-3">
                        {filteredMenuItems
                          .filter(item => item.category === category)
                          .slice(0, 3)
                          .map((item) => (
                            <motion.div
                              key={item.id}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setSelectedItem(item)}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className="flex items-center space-x-3">
                                {getMenuIcon(item.image)}
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                  <p className="text-lg font-bold text-amber-600">€{item.price.toFixed(2)}</p>
                                  <div className="flex items-center space-x-3 mt-1">
                                    <div className="flex items-center">
                                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                      <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                                    </div>
                                    <span className="text-sm text-gray-600">{item.sold} verkocht</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.available ? 'Beschikbaar' : 'Niet beschikbaar'}
                                  </span>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingItem(item);
                                      }}
                                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <div className="relative">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setMenuOptionsOpen(menuOptionsOpen === item.id ? null : item.id);
                                        }}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                      >
                                        <MoreHorizontal className="w-4 h-4" />
                                      </button>
                                      {menuOptionsOpen === item.id && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 text-sm">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleItemAvailability(item.id);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center"
                                          >
                                            {item.available ? <X className="w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                            {item.available ? 'Niet beschikbaar maken' : 'Beschikbaar maken'}
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              duplicateMenuItem(item);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                          >
                                            Dupliceren
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              deleteMenuItem(item.id);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                                          >
                                            Verwijderen
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Statistieken</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setManageModal('Filter periode: deze week')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Deze week</span>
                </button>
                <button
                  onClick={() => setManageModal('Data export')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Totale winst</h3>
                  <Euro className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-3xl font-bold text-emerald-600">€31,847</p>
                <p className="text-sm text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% vs vorige maand
                </p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Totale bestellingen</h3>
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.3% vs vorige maand
                </p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Gemiddelde bestelling</h3>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-600">€25.53</p>
                <p className="text-sm text-purple-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +3.1% vs vorige maand
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Best verkochte items</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {menuItems
                      .sort((a, b) => b.sold - a.sold)
                      .slice(0, 5)
                      .map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`text-lg font-bold w-8 text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-400'}`}>
                              #{index + 1}
                            </span>
                            {getMenuIcon(item.image)}
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500">{item.sold} verkocht</p>
                            </div>
                          </div>
                          <p className="font-semibold text-emerald-600">€{(item.price * item.sold).toFixed(0)}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Verkoop Trend</h3>
                </div>
                <div className="p-4">
                  <div className="h-40 bg-gradient-to-t from-blue-50 to-white rounded-lg flex items-end justify-center p-4">
                    <div className="flex items-end space-x-2 h-full w-full">
                      {[20, 35, 25, 45, 30, 50, 40].map((height, i) => (
                        <div key={i} className="flex-1 bg-blue-500 rounded-t-lg" style={{height: `${height}%`}}></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-3">
                    <span>Ma</span>
                    <span>Di</span>
                    <span>Wo</span>
                    <span>Do</span>
                    <span>Vr</span>
                    <span>Za</span>
                    <span>Zo</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">8.5 min</div>
                <div className="text-sm text-gray-600">Gem. wachttijd</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">4.6/5</div>
                <div className="text-sm text-gray-600">Klantwaardering</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">89%</div>
                <div className="text-sm text-gray-600">Tafel bezetting</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">2.3x</div>
                <div className="text-sm text-gray-600">Tafel omloop</div>
              </div>
            </div>
          </div>
        );

      case 'manage':
        return (
          <div className="space-y-6 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900">Restaurant Beheer</h2>

            <div className="grid grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Menu className="w-5 h-5 mr-2 text-amber-600" />
                    Menu Beheer
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <button
                    onClick={() => setManageModal('Nieuw gerecht toevoegen')}
                    className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nieuw gerecht toevoegen</span>
                  </button>
                  <button
                    onClick={() => setManageModal('Categorieën beheren')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Categorieën beheren</span>
                  </button>
                  <button
                    onClick={() => setManageModal('Preview klant menu')}
                    className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-amber-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview klant menu</span>
                  </button>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Personeel Beheer
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <button
                    onClick={() => setManageModal('Werknemer toevoegen')}
                    className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Werknemer toevoegen</span>
                  </button>
                  <button
                    onClick={() => setManageModal('Rollen en rechten')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Rollen & rechten</span>
                  </button>
                  <button
                    onClick={() => setManageModal('Rooster plannen')}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Rooster plannen</span>
                  </button>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-gray-600" />
                    Restaurant Instellingen
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <button
                    onClick={() => setManageModal('Thema en branding')}
                    className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-colors"
                  >
                    <Palette className="w-4 h-4" />
                    <span>Thema & branding</span>
                  </button>
                  <button
                    onClick={() => setManageModal('Notificatie instellingen')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notificatie instellingen</span>
                  </button>
                  <button
                    onClick={() => setManageModal('Openingstijden')}
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-700 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Openingstijden</span>
                  </button>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                    Betalingen & Facturen
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <button
                    onClick={() => setManageModal('Betaalmethoden')}
                    className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Betaalmethoden</span>
                  </button>
                  <button
                    onClick={() => setManageModal('Prijzen en BTW')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
                  >
                    <Euro className="w-4 h-4" />
                    <span>Prijzen & BTW</span>
                  </button>
                  <button
                    onClick={() => setManageModal('Factuur export')}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Factuur export</span>
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Snelle acties</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setManageModal('Alles schoonmaken')}
                  className="bg-white text-gray-700 py-3 px-4 rounded-lg hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Alles schoonmaken</span>
                </button>
                <button
                  onClick={() => setManageModal('Dag afsluiten')}
                  className="bg-white text-gray-700 py-3 px-4 rounded-lg hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dag afsluiten</span>
                </button>
                <button
                  onClick={() => setManageModal('Backup maken')}
                  className="bg-white text-gray-700 py-3 px-4 rounded-lg hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Backup maken</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Tab niet gevonden</div>;
    }
  };

  return (
    <div className="relative w-[1200px] h-[768px] rounded-t-2xl overflow-hidden shadow-2xl border-4 border-black bg-white flex flex-col font-sans">
      <div className="w-full h-full bg-black rounded-t-2xl p-2">
        <div className="w-full h-full bg-gray-50 rounded-xl overflow-hidden flex flex-col relative">
          <div className="bg-white border-b flex items-center justify-between px-4 py-2 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 mx-6">
              <div className="bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-600 flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                uwbedrijf.app/dashboard
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {currentTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className="flex flex-1 bg-gray-50 overflow-hidden">
            <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex-shrink-0">
                <h1 className="text-lg font-bold">TableTech</h1>
                <p className="text-sm opacity-90">Restaurant Dashboard</p>
              </div>
              
              <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin min-h-0">
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                          activeTab === tab.id
                            ? 'bg-amber-600 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </nav>

              <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">JD</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Jan Doe</p>
                    <p className="text-sm text-gray-500">Manager</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-hidden p-6">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {renderTabContent()}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Modals within laptop */}
          {selectedItem && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-6 w-96 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{selectedItem.name}</h3>
                <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-40 object-cover rounded-lg" />
                <p className="mt-2 text-sm text-gray-700">{selectedItem.description}</p>
                <p className="mt-2 font-bold text-amber-600">€{selectedItem.price.toFixed(2)}</p>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-lg w-full hover:bg-amber-700 transition-colors"
                >
                  Sluiten
                </button>
              </motion.div>
            </div>
          )}

          {manageModal && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-6 w-80 shadow-lg text-center"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{manageModal}</h3>
                <p className="text-sm text-gray-600">Deze functionaliteit kan hier uitgebreid worden.</p>
                <button
                  onClick={() => setManageModal(null)}
                  className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-lg w-full hover:bg-amber-700 transition-colors"
                >
                  Sluiten
                </button>
              </motion.div>
            </div>
          )}

          {detailsTable && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-6 w-96 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Tafel {detailsTable.number} Details</h3>
                <div className="space-y-2">
                  <p><strong>Status:</strong> {detailsTable.status}</p>
                  <p><strong>Gasten:</strong> {detailsTable.guests}</p>
                  <p><strong>Duur:</strong> {detailsTable.duration}</p>
                  <p><strong>Bestellingen:</strong> {detailsTable.orders}</p>
                  <p><strong>Totaal:</strong> €{detailsTable.total?.toFixed(2)}</p>
                  <p><strong>Klant:</strong> {detailsTable.customerName}</p>
                </div>
                <button
                  onClick={() => setDetailsTable(null)}
                  className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-lg w-full hover:bg-amber-700 transition-colors"
                >
                  Sluiten
                </button>
              </motion.div>
            </div>
          )}

          {tableAction && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
              {tableAction.action === 'guests' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl p-6 w-80 shadow-lg"
                >
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Aantal gasten</h3>
                  <input
                    type="number"
                    value={guestInput}
                    onChange={e => setGuestInput(parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-200 rounded-lg p-2 mb-4"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveGuests}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                    >
                      Opslaan
                    </button>
                    <button
                      onClick={() => setTableAction(null)}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                    >
                      Annuleren
                    </button>
                  </div>
                </motion.div>
              )}
              {tableAction.action === 'reserve' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl p-6 w-80 shadow-lg space-y-3"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Reserveren</h3>
                  <input
                    type="number"
                    placeholder="Aantal personen"
                    value={reserveData.guests}
                    onChange={e => setReserveData({ ...reserveData, guests: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    placeholder="Naam"
                    value={reserveData.name}
                    onChange={e => setReserveData({ ...reserveData, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2"
                  />
                  <input
                    type="time"
                    value={reserveData.time}
                    onChange={e => setReserveData({ ...reserveData, time: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleReserve}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Opslaan
                    </button>
                    <button
                      onClick={() => setTableAction(null)}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                    >
                      Annuleren
                    </button>
                  </div>
                </motion.div>
              )}
              {tableAction.action === 'new' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl p-6 w-80 shadow-lg space-y-3"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Nieuwe tafel</h3>
                  <input
                    type="number"
                    value={newTableNumber}
                    onChange={e => setNewTableNumber(parseInt(e.target.value) || 1)}
                    className="w-full border border-gray-200 rounded-lg p-2"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddTable}
                      className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700"
                    >
                      Toevoegen
                    </button>
                    <button
                      onClick={() => setTableAction(null)}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                    >
                      Annuleren
                    </button>
                  </div>
                </motion.div>
              )}
              {tableAction.action === 'checkout' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl p-6 w-96 shadow-lg"
                >
                  {!paymentData.completed ? (
                    <>
                      <h3 className="text-xl font-semibold mb-4 text-gray-900">Afrekenen</h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-lg font-semibold">Totaalbedrag</div>
                          <div className="text-3xl font-bold text-emerald-600">€{paymentData.total.toFixed(2)}</div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Betaalmethode</label>
                          <select
                            value={paymentData.paymentMethod}
                            onChange={e => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg p-2"
                          >
                            <option value="cash">Contant</option>
                            <option value="card">Pinpas</option>
                            <option value="ideal">iDEAL</option>
                            <option value="paypal">PayPal</option>
                          </select>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={finishCheckout}
                            className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Betaling bevestigen
                          </button>
                          <button
                            onClick={() => setTableAction(null)}
                            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Annuleren
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Betaling voltooid!</h3>
                      <p className="text-gray-600">De tafel is vrijgemaakt en klaar voor nieuwe gasten.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {editingItem && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-6 w-96 shadow-lg max-h-[80vh] overflow-y-auto"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Gerecht bewerken</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prijs</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingItem.price}
                      onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                    <select
                      value={editingItem.category}
                      onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                    >
                      <option value="Pizza">Pizza</option>
                      <option value="Popular">Popular</option>
                      <option value="Curry">Curry</option>
                      <option value="Ramen">Ramen</option>
                      <option value="Drankjes">Drankjes</option>
                      <option value="Dessert">Dessert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Afbeelding</label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableImages.map((image) => (
                        <div
                          key={image}
                          onClick={() => setEditingItem({ ...editingItem, image })}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                            editingItem.image === image ? 'border-amber-500' : 'border-gray-200'
                          }`}
                        >
                          <img src={image} alt="Preview" className="w-full h-16 object-cover" />
                          {editingItem.image === image && (
                            <div className="absolute inset-0 bg-amber-500 bg-opacity-30 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
                    <textarea
                      value={editingItem.description}
                      onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2 h-20"
                    />
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => {
                      setMenuItems(prev => 
                        prev.map(item => 
                          item.id === editingItem.id ? editingItem : item
                        )
                      );
                      setEditingItem(null);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Opslaan
                  </button>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                  >
                    Annuleren
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {newItemModal && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-6 w-96 shadow-lg max-h-[80vh] overflow-y-auto"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Nieuw gerecht toevoegen</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
                    <input
                      type="text"
                      value={newItemData.name}
                      onChange={e => setNewItemData({ ...newItemData, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prijs</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItemData.price}
                      onChange={e => setNewItemData({ ...newItemData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                    <select
                      value={newItemData.category}
                      onChange={e => setNewItemData({ ...newItemData, category: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2"
                    >
                      <option value="Pizza">Pizza</option>
                      <option value="Popular">Popular</option>
                      <option value="Curry">Curry</option>
                      <option value="Ramen">Ramen</option>
                      <option value="Drankjes">Drankjes</option>
                      <option value="Dessert">Dessert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Afbeelding</label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableImages.map((image) => (
                        <div
                          key={image}
                          onClick={() => setNewItemData({ ...newItemData, image })}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                            newItemData.image === image ? 'border-amber-500' : 'border-gray-200'
                          }`}
                        >
                          <img src={image} alt="Preview" className="w-full h-16 object-cover" />
                          {newItemData.image === image && (
                            <div className="absolute inset-0 bg-amber-500 bg-opacity-30 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
                    <textarea
                      value={newItemData.description}
                      onChange={e => setNewItemData({ ...newItemData, description: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2 h-20"
                    />
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => {
                      const newItem: MenuItem = {
                        id: Math.max(...menuItems.map(i => i.id)) + 1,
                        name: newItemData.name,
                        category: newItemData.category,
                        price: newItemData.price,
                        image: newItemData.image,
                        sold: 0,
                        available: true,
                        rating: 4.0,
                        description: newItemData.description,
                        ingredients: newItemData.ingredients
                      };
                      setMenuItems(prev => [...prev, newItem]);
                      setNewItemModal(false);
                      setNewItemData({ name: '', ingredients: '', price: 0, image: '/menu/menu1.jpg', description: '', category: 'Popular' });
                    }}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                  >
                    Toevoegen
                  </button>
                  <button
                    onClick={() => setNewItemModal(false)}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                  >
                    Annuleren
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <div className="w-[1600px] h-5 bg-gray-400 rounded-b-2xl -mt-1 shadow-lg mx-auto"></div>
      <div className="w-[1700px] h-3 bg-gray-500 rounded-full -mt-1 shadow-xl mx-auto"></div>
    </div>
  );
}
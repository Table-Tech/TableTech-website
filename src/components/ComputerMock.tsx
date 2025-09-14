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

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  active: boolean;
  deleted: boolean;
  deletedAt?: Date;
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
  const [showManageTableModal, setShowManageTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableSeats, setNewTableSeats] = useState('4');
  const [tableNumberError, setTableNumberError] = useState('');
  const [language, setLanguage] = useState<'nl' | 'en'>('nl');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'general' | 'payment' | 'staff'>('general');

  // Translations
  const t = {
    nl: {
      // Navigation
      dashboard: 'Dashboard',
      orders: 'Bestellingen',
      tables: 'Tafels',
      menu: 'Menu',
      analytics: 'Analytics',
      settings: 'Instellingen',
      
      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.subtitle': 'Welkom terug! Hier is wat er vandaag gebeurt.',
      'dashboard.todaysRevenue': "Vandaag's Omzet",
      'dashboard.activeOrders': 'Actieve Bestellingen',
      'dashboard.ordersToday': 'Bestellingen Vandaag',
      'dashboard.avgOrderValue': 'Gem. Bestelwaarde',
      'dashboard.recentOrders': 'Recente Bestellingen',
      'dashboard.viewAll': 'Bekijk alle',
      'dashboard.noOrders': 'Geen recente bestellingen',
      'dashboard.noOrdersDesc': 'Er zijn momenteel geen actieve bestellingen.',
      
      // Orders
      'orders.title': 'Live Bestellingen',
      'orders.subtitle': 'Beheer actieve restaurantbestellingen',
      'orders.live': 'Live',
      'orders.refresh': 'Vernieuwen',
      'orders.markCompleted': 'Markeer als Voltooid',
      'orders.allCompleted': 'Alle orders voltooid! 🎉',
      'orders.noActiveOrders': 'Er zijn momenteel geen actieve bestellingen.',
      'orders.restoreDemo': 'Demo Orders Herstellen',
      
      // Tables
      'tables.title': 'Tafels',
      'tables.subtitle': 'Beheer restaurant tafels en beschikbaarheid',
      'tables.addTable': 'Tafel Toevoegen',
      'tables.totalTables': 'Totaal Tafels',
      'tables.available': 'Beschikbaar',
      'tables.occupied': 'Bezet',
      'tables.reserved': 'Gereserveerd',
      'tables.maintenance': 'Onderhoud',
      'tables.searchPlaceholder': 'Zoek tafels...',
      'tables.filter': 'Filter:',
      'tables.allStatuses': 'Alle Statussen',
      'tables.seats': 'plaatsen',
      'tables.code': 'Code',
      
      // Status
      'status.available': 'Beschikbaar',
      'status.occupied': 'Bezet',
      'status.reserved': 'Gereserveerd',
      'status.maintenance': 'Onderhoud',
      'status.pending': 'Bevestigd',
      'status.preparing': 'In Voorbereiding',
      'status.ready': 'Klaar',
      'status.paid': 'Betaald',
      'status.unpaid': 'Niet Betaald',
      'status.waiting': 'Wacht op Betaling',
      
      // Settings
      'settings.general': 'Algemeen',
      'settings.payment': 'Betalingen',
      'settings.staff': 'Personeel',
      'settings.generalTitle': 'Algemene Instellingen',
      'settings.generalSubtitle': 'Beheer basisinformatie en instellingen van het restaurant',
      'settings.languageSettings': 'Taalinstellingen',
      'settings.language': 'Taal',
      'settings.restaurantInfo': 'Restaurantinformatie',
      'settings.restaurantName': 'RESTAURANTNAAM',
      'settings.address': 'ADRES',
      'settings.phoneNumber': 'TELEFOONNUMMER',
      'settings.subscriptionType': 'ABONNEMENT TYPE',
      'settings.contactAdmin': 'Neem contact op met uw systeembeheerder om deze informatie bij te werken',
      'settings.openingHours': 'Openingstijden',
      'settings.openingHoursSubtitle': 'Stel de openingstijden van uw restaurant in voor elke dag van de week',
      'settings.openingTime': 'OPENINGSTIJD',
      'settings.closingTime': 'SLUITINGSTIJD',
      'settings.closed': 'Gesloten',
      'settings.paymentTitle': 'Betaalinstellingen',
      'settings.paymentSubtitle': 'Configureer betaalproviders en opties',
      'settings.acceptCash': 'Accepteer contante betalingen',
      'settings.acceptCashDesc': 'Accepteer contante betalingen in het restaurant',
      'settings.acceptCard': 'Accepteer kaartbetalingen',
      'settings.acceptCardDesc': 'Accepteer credit- en betaalkaarten',
      'settings.acceptOnline': 'Accepteer online betalingen',
      'settings.acceptOnlineDesc': 'Accepteer betalingen via mobile apps en websites',
      'settings.staffTitle': 'Personeelsbeheer',
      'settings.staffSubtitle': 'Beheer teamleden en hun toegang',
      'settings.addStaff': 'Personeelslid Toevoegen',
      'settings.deletedStaff': 'Verwijderd Personeel (Herstelbaar)',
      'settings.restore': 'Herstellen',
      'settings.delete': 'Verwijderen',
      'settings.confirmDelete': 'Weet je zeker dat je dit personeelslid wilt verwijderen?',
      'settings.confirmDeleteDesc': 'Dit personeelslid wordt gedeactiveerd en kan later worden hersteld.',

      // Days of the week
      'days.monday': 'Maandag',
      'days.tuesday': 'Dinsdag', 
      'days.wednesday': 'Woensdag',
      'days.thursday': 'Donderdag',
      'days.friday': 'Vrijdag',
      'days.saturday': 'Zaterdag',
      'days.sunday': 'Zondag',

      // Analytics
      'analytics.comingSoon': 'Binnenkort beschikbaar',

      // Table Management 
      'tables.name': 'NAAM',
      'tables.role': 'ROL', 
      'tables.actions': 'BEWERKINGEN',
      'tables.updateStatus': 'Tafel Status Bijwerken',
      'tables.readyForCustomers': 'Tafel is klaar voor nieuwe klanten',
      'tables.currentlyUsed': 'Tafel wordt momenteel gebruikt',
      'tables.current': 'Huidig',
      'tables.reservedForGuests': 'Tafel is gereserveerd voor toekomstige gasten',
      'tables.outOfService': 'Tafel is tijdelijk buiten dienst',
      'tables.numberAvailable': 'Tafelnummer beschikbaar!',
      'tables.chooseNumber': 'Kies een uniek nummer voor deze tafel (1-999). Druk Enter om toe te voegen.',
      'tables.seatingCapacity': 'Zitcapaciteit',
      'tables.maxCustomers': 'Maximum aantal klanten dat aan deze tafel kan zitten (1-20). Druk Enter om toe te voegen.',
      'tables.qrGenerated': 'QR Code wordt gegenereerd',
      'tables.overview': 'Tafel Overzicht',
      'tables.tableNumber': 'Tafelnummer:',
      'tables.capacity': 'Zitcapaciteit:',
      'tables.people': 'personen',

      // Common
      cancel: 'Annuleren',
      close: 'Sluiten',
      save: 'Opslaan',
      edit: 'Bewerken'
    },
    en: {
      // Navigation
      dashboard: 'Dashboard',
      orders: 'Orders',
      tables: 'Tables',
      menu: 'Menu',
      analytics: 'Analytics',
      settings: 'Settings',
      
      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.subtitle': 'Welcome back! Here\'s what\'s happening today.',
      'dashboard.todaysRevenue': "Today's Revenue",
      'dashboard.activeOrders': 'Active Orders',
      'dashboard.ordersToday': 'Orders Today',
      'dashboard.avgOrderValue': 'Avg Order Value',
      'dashboard.recentOrders': 'Recent Orders',
      'dashboard.viewAll': 'View all',
      'dashboard.noOrders': 'No recent orders',
      'dashboard.noOrdersDesc': 'There are currently no active orders.',
      
      // Orders
      'orders.title': 'Live Orders',
      'orders.subtitle': 'Manage active restaurant orders',
      'orders.live': 'Live',
      'orders.refresh': 'Refresh',
      'orders.markCompleted': 'Mark as Completed',
      'orders.allCompleted': 'All orders completed! 🎉',
      'orders.noActiveOrders': 'There are currently no active orders.',
      'orders.restoreDemo': 'Restore Demo Orders',
      
      // Tables
      'tables.title': 'Tables',
      'tables.subtitle': 'Manage restaurant tables and availability',
      'tables.addTable': 'Add Table',
      'tables.totalTables': 'Total Tables',
      'tables.available': 'Available',
      'tables.occupied': 'Occupied',
      'tables.reserved': 'Reserved',
      'tables.maintenance': 'Maintenance',
      'tables.searchPlaceholder': 'Search tables...',
      'tables.filter': 'Filter:',
      'tables.allStatuses': 'All Statuses',
      'tables.seats': 'seats',
      'tables.code': 'Code',
      
      // Status
      'status.available': 'Available',
      'status.occupied': 'Occupied',
      'status.reserved': 'Reserved',
      'status.maintenance': 'Maintenance',
      'status.pending': 'Confirmed',
      'status.preparing': 'Preparing',
      'status.ready': 'Ready',
      'status.paid': 'Paid',
      'status.unpaid': 'Unpaid',
      'status.waiting': 'Awaiting Payment',
      
      // Settings
      'settings.general': 'General',
      'settings.payment': 'Payment',
      'settings.staff': 'Staff',
      'settings.generalTitle': 'General Settings',
      'settings.generalSubtitle': 'Manage basic restaurant information and settings',
      'settings.languageSettings': 'Language Settings',
      'settings.language': 'Language',
      'settings.restaurantInfo': 'Restaurant Information',
      'settings.restaurantName': 'RESTAURANT NAME',
      'settings.address': 'ADDRESS',
      'settings.phoneNumber': 'PHONE NUMBER',
      'settings.subscriptionType': 'SUBSCRIPTION TYPE',
      'settings.contactAdmin': 'Contact your system administrator to update this information',
      'settings.openingHours': 'Opening Hours',
      'settings.openingHoursSubtitle': 'Set your restaurant\'s operating hours for each day of the week',
      'settings.openingTime': 'OPENING TIME',
      'settings.closingTime': 'CLOSING TIME',
      'settings.closed': 'Closed',
      'settings.paymentTitle': 'Payment Settings',
      'settings.paymentSubtitle': 'Configure payment providers and options',
      'settings.acceptCash': 'Accept cash payments',
      'settings.acceptCashDesc': 'Accept cash payments at the restaurant',
      'settings.acceptCard': 'Accept card payments',
      'settings.acceptCardDesc': 'Accept credit and debit card payments',
      'settings.acceptOnline': 'Accept online payments',
      'settings.acceptOnlineDesc': 'Accept payments via mobile apps and websites',
      'settings.staffTitle': 'Staff Management',
      'settings.staffSubtitle': 'Manage team members and their access',
      'settings.addStaff': 'Add Staff Member',
      'settings.deletedStaff': 'Deleted Staff (Restorable)',
      'settings.restore': 'Restore',
      'settings.delete': 'Delete',
      'settings.confirmDelete': 'Are you sure you want to delete this staff member?',
      'settings.confirmDeleteDesc': 'This staff member will be deactivated and can be restored later.',

      // Days of the week
      'days.monday': 'Monday',
      'days.tuesday': 'Tuesday',
      'days.wednesday': 'Wednesday',
      'days.thursday': 'Thursday',
      'days.friday': 'Friday',
      'days.saturday': 'Saturday',
      'days.sunday': 'Sunday',

      // Analytics
      'analytics.comingSoon': 'Coming Soon',

      // Table Management 
      'tables.name': 'NAME',
      'tables.role': 'ROLE', 
      'tables.actions': 'ACTIONS',
      'tables.updateStatus': 'Update Table Status',
      'tables.readyForCustomers': 'Table is ready for new customers',
      'tables.currentlyUsed': 'Table is currently being used',
      'tables.current': 'Current',
      'tables.reservedForGuests': 'Table is reserved for future guests',
      'tables.outOfService': 'Table is temporarily out of service',
      'tables.numberAvailable': 'Table number available!',
      'tables.chooseNumber': 'Choose a unique number for this table (1-999). Press Enter to add.',
      'tables.seatingCapacity': 'Seating Capacity',
      'tables.maxCustomers': 'Maximum number of customers that can sit at this table (1-20). Press Enter to add.',
      'tables.qrGenerated': 'QR Code will be generated',
      'tables.overview': 'Table Overview',
      'tables.tableNumber': 'Table Number:',
      'tables.capacity': 'Seating Capacity:',
      'tables.people': 'people',

      // Common
      cancel: 'Cancel',
      close: 'Close',
      save: 'Save',
      edit: 'Edit'
    }
  };

  // Get translation function
  const getText = (key: string) => t[language][key as keyof typeof t.nl] || key;

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

  // Staff management state
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: 1, name: 'Damian Willemse', email: 'damian@tabletech.nl', role: 'Beheerder', status: 'Actief', active: true, deleted: false },
    { id: 2, name: 'Wishant Bhajan', email: 'wishant@tabletech.nl', role: 'Beheerder', status: 'Actief', active: true, deleted: false },
    { id: 3, name: 'Hicham Tahiri', email: 'hicham@tabletech.nl', role: 'Kok', status: 'Actief', active: true, deleted: false },
    { id: 4, name: 'Mohammad Falaha', email: 'mohammad@tabletech.nl', role: 'Beheerder', status: 'Inactief', active: false, deleted: false }
  ]);
  const [deletedStaff, setDeletedStaff] = useState<StaffMember[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
  
  // Payment settings state
  const [paymentSettings, setPaymentSettings] = useState({
    cash: true,
    card: true,
    online: true
  });

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

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setShowManageTableModal(true);
  };

  const handleUpdateTableStatus = (newStatus: Table['status']) => {
    if (!selectedTable) return;
    
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === selectedTable.id 
          ? { ...table, status: newStatus }
          : table
      )
    );
    setShowManageTableModal(false);
    setSelectedTable(null);
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

    // Check if table number already exists (more robust check)
    const existingTable = tables.find(table => {
      const tableNumFromName = parseInt(table.name.replace(/[^0-9]/g, ''));
      return tableNumFromName === numericTableNum || table.id === numericTableNum;
    });
    
    if (existingTable) {
      setTableNumberError('Dit tafelnummer bestaat al');
      return false;
    }

    setTableNumberError('');
    return true;
  };

  const handleAddTable = () => {
    if (!validateTableNumber(newTableNumber)) return;

    // Generate a unique ID that doesn't conflict with existing tables
    const newId = Math.max(...tables.map(t => t.id), 0) + 1;
    
    const newTable: Table = {
      id: newId,
      name: `Table ${newTableNumber}`,
      seats: parseInt(newTableSeats),
      code: generateTableCode(),
      status: 'available'
    };

    setTables(prevTables => [...prevTables, newTable]);
    setShowAddTableModal(false);
    setNewTableNumber('');
    setNewTableSeats('4');
    setTableNumberError('');
    
    // Optional: Show success feedback
    console.log(`Tafel ${newTableNumber} succesvol toegevoegd!`);
  };

  // Staff management functions
  const handleDeleteStaff = (staff: StaffMember) => {
    setStaffToDelete(staff);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteStaff = () => {
    if (staffToDelete) {
      setStaffMembers(prevStaff => 
        prevStaff.filter(staff => staff.id !== staffToDelete.id)
      );
      setDeletedStaff(prev => [...prev, { ...staffToDelete, deletedAt: new Date() }]);
      setShowDeleteConfirm(false);
      setStaffToDelete(null);
    }
  };

  const restoreStaff = (staffId: number) => {
    const staffToRestore = deletedStaff.find(staff => staff.id === staffId);
    if (staffToRestore) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { deletedAt, ...restoredStaff } = staffToRestore;
      setStaffMembers(prev => [...prev, restoredStaff]);
      setDeletedStaff(prev => prev.filter(staff => staff.id !== staffId));
    }
  };

  const toggleStaffStatus = (staffId: number) => {
    setStaffMembers(prevStaff => 
      prevStaff.map(staff => 
        staff.id === staffId 
          ? { ...staff, active: !staff.active, status: !staff.active ? 'Actief' : 'Inactief' }
          : staff
      )
    );
  };

  // Payment settings functions
  const togglePaymentSetting = (type: 'cash' | 'card' | 'online') => {
    setPaymentSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
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
    <div className="w-56 bg-brown-800 h-full flex flex-col relative" style={{ backgroundColor: '#3E2723' }}>
      {/* Top gloss/highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
      <div className="absolute top-1 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent opacity-10"></div>
      
      <div className="p-5 border-b border-brown-700" style={{ borderColor: '#4A3426' }}>
        <div className="flex items-center space-x-3">
          <div className="w-18 h-18 rounded-xl flex items-center justify-center overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' }}>
            <img src="/favicon/apple-touch-icon.png" alt="TableTech Logo" className="w-18 h-18 object-cover scale-110" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-wide">TableTech</h1>
            <p className="text-sm font-medium" style={{ color: '#FF8A50' }}>TableTech Demo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            currentPage === 'dashboard' ? 'bg-brown-700 shadow-md' : 'hover:bg-brown-700 hover:bg-opacity-50'
          }`}
          style={{ 
            backgroundColor: currentPage === 'dashboard' ? '#5D4037' : 'transparent',
          }}
        >
          <Home className="w-5 h-5" style={{ color: currentPage === 'dashboard' ? '#FFFFFF' : '#8D6E63' }} />
          <span className={`text-base font-medium ${currentPage === 'dashboard' ? 'text-white' : 'text-gray-300'}`}>{getText('dashboard')}</span>
        </button>

        <button
          onClick={() => setCurrentPage('orders')}
          className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            currentPage === 'orders' ? 'bg-brown-700 shadow-md' : 'hover:bg-brown-700 hover:bg-opacity-50'
          }`}
          style={{ 
            backgroundColor: currentPage === 'orders' ? '#5D4037' : 'transparent',
          }}
        >
          <ShoppingCart className="w-5 h-5" style={{ color: currentPage === 'orders' ? '#FFFFFF' : '#8D6E63' }} />
          <span className={`text-base font-medium ${currentPage === 'orders' ? 'text-white' : 'text-gray-300'}`}>{getText('orders')}</span>
        </button>

        <button
          onClick={() => setCurrentPage('tables')}
          className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            currentPage === 'tables' ? 'bg-brown-700 shadow-md' : 'hover:bg-brown-700 hover:bg-opacity-50'
          }`}
          style={{ 
            backgroundColor: currentPage === 'tables' ? '#5D4037' : 'transparent',
          }}
        >
          <Users className="w-5 h-5" style={{ color: currentPage === 'tables' ? '#FFFFFF' : '#8D6E63' }} />
          <span className={`text-base font-medium ${currentPage === 'tables' ? 'text-white' : 'text-gray-300'}`}>{getText('tables')}</span>
        </button>

        <button
          onClick={() => setCurrentPage('menu')}
          className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            currentPage === 'menu' ? 'bg-brown-700 shadow-md' : 'hover:bg-brown-700 hover:bg-opacity-50'
          }`}
          style={{ 
            backgroundColor: currentPage === 'menu' ? '#5D4037' : 'transparent',
          }}
        >
          <Menu className="w-5 h-5" style={{ color: currentPage === 'menu' ? '#FFFFFF' : '#8D6E63' }} />
          <span className={`text-base font-medium ${currentPage === 'menu' ? 'text-white' : 'text-gray-300'}`}>{getText('menu')}</span>
        </button>

        <button
          onClick={() => setCurrentPage('analytics')}
          className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            currentPage === 'analytics' ? 'bg-brown-700 shadow-md' : 'hover:bg-brown-700 hover:bg-opacity-50'
          }`}
          style={{ 
            backgroundColor: currentPage === 'analytics' ? '#5D4037' : 'transparent',
          }}
        >
          <BarChart3 className="w-5 h-5" style={{ color: currentPage === 'analytics' ? '#FFFFFF' : '#8D6E63' }} />
          <span className={`text-base font-medium ${currentPage === 'analytics' ? 'text-white' : 'text-gray-300'}`}>{getText('analytics')}</span>
        </button>

        <button
          onClick={() => setCurrentPage('settings')}
          className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            currentPage === 'settings' ? 'bg-brown-700 shadow-md' : 'hover:bg-brown-700 hover:bg-opacity-50'
          }`}
          style={{ 
            backgroundColor: currentPage === 'settings' ? '#5D4037' : 'transparent',
          }}
        >
          <Settings className="w-5 h-5" style={{ color: currentPage === 'settings' ? '#FFFFFF' : '#8D6E63' }} />
          <span className={`text-base font-medium ${currentPage === 'settings' ? 'text-white' : 'text-gray-300'}`}>{getText('settings')}</span>
        </button>
      </nav>

      {/* Language Switcher */}
      <div className="px-4 py-3 border-t border-b" style={{ borderColor: '#4A3426' }}>
        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Language</p>
        <div className="flex bg-brown-700 rounded-lg p-1" style={{ backgroundColor: '#4A3426' }}>
          <button
            onClick={() => setLanguage('nl')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
              language === 'nl' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-brown-600'
            }`}
            style={{ 
              backgroundColor: language === 'nl' ? '#FF6B35' : 'transparent'
            }}
          >
            NL
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
              language === 'en' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-brown-600'
            }`}
            style={{ 
              backgroundColor: language === 'en' ? '#FF6B35' : 'transparent'
            }}
          >
            EN
          </button>
        </div>
      </div>

      <div className="p-3 border-t" style={{ borderColor: '#4A3426' }}>
        {/* Super Admin Profile */}
        <div className="relative rounded-lg p-3 mb-3 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.12) 0%, rgba(249,115,22,0.12) 100%)' }}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F97316 50%, #EA580C 100%)' }}>
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Super Admin</p>
              <p className="text-xs" style={{ color: '#FF8A50' }}>Administrator</p>
            </div>
          </div>
        </div>

        {/* Switch Restaurant */}
        <div className="relative rounded-lg mb-2 overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-brown-700 hover:bg-opacity-40 transition-all duration-200">
            <Building className="w-4 h-4" style={{ color: '#8D6E63' }} />
            <span className="text-sm font-medium text-white">Switch Restaurant</span>
          </button>
        </div>

        {/* Logout */}
        <div className="relative rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(220,38,38,0.12)' }}>
          <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-700 hover:bg-opacity-25 transition-all duration-200">
            <LogOut className="w-4 h-4" style={{ color: '#DC2626' }} />
            <span className="text-sm font-medium" style={{ color: '#DC2626' }}>Logout</span>
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
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>{getText('dashboard.title')}</h1>
          <p className="text-gray-600 text-sm">{getText('dashboard.subtitle')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-yellow-50 via-amber-200 to-yellow-800/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-200" style={{backgroundImage: 'linear-gradient(to right, #d2b48c 0%, #e6d7c3 70%, #e6d7c3 100%)'}}>
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg p-2 shadow-sm" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' }}>
                <Euro className="w-5 h-5" style={{ color: '#5D4037' }} />
              </div>
            </div>
            <p className="text-xs mb-1" style={{ color: '#8D6E63' }}>{getText('dashboard.todaysRevenue')}</p>
            <p className="text-xl font-bold" style={{ color: '#5D4037' }}>€{todaysRevenue.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 via-amber-200 to-yellow-800/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-200" style={{backgroundImage: 'linear-gradient(120deg, #e6d7c3 0%, #e6d7c3 50%, #d2b48c 100%)'}}>
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg p-2 shadow-sm" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' }}>
                <Clock className="w-5 h-5" style={{ color: '#5D4037' }} />
              </div>
            </div>
            <p className="text-xs mb-1" style={{ color: '#8D6E63' }}>{getText('dashboard.activeOrders')}</p>
            <p className="text-xl font-bold" style={{ color: '#5D4037' }}>{activeOrders}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 via-amber-200 to-yellow-800/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-200" style={{backgroundImage: 'linear-gradient(140deg, #e6d7c3 0%, #dcc7a8 50%, #c8a882 100%)'}}>
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg p-2 shadow-sm" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' }}>
                <Users className="w-5 h-5" style={{ color: '#5D4037' }} />
              </div>
            </div>
            <p className="text-xs mb-1" style={{ color: '#8D6E63' }}>{getText('dashboard.ordersToday')}</p>
            <p className="text-xl font-bold" style={{ color: '#5D4037' }}>{totalOrdersToday}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 via-amber-200 to-yellow-800/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-200" style={{backgroundImage: 'linear-gradient(160deg, #e6d7c3 0%, #e8d2b0 50%, #d4a574 100%)'}}>
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg p-2 shadow-sm" style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f2ede6 100%)' }}>
                <TrendingUp className="w-5 h-5" style={{ color: '#5D4037' }} />
              </div>
            </div>
            <p className="text-xs mb-1" style={{ color: '#8D6E63' }}>{getText('dashboard.avgOrderValue')}</p>
            <p className="text-xl font-bold" style={{ color: '#5D4037' }}>€{avgOrderValue.toFixed(2)}</p>
          </div>
        </div>

      {/* Recent Orders */}
      <div className="rounded-xl shadow-sm" style={{backgroundImage: 'linear-gradient(135deg, #e6d7c3 0%, #e6d7c3 50%, #d2b48c 100%)'}}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" style={{ color: '#8D6E63' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#5D4037' }}>{getText('dashboard.recentOrders')}</h2>
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
            {getText('dashboard.viewAll')}
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
    const [statusFilter, setStatusFilter] = useState(getText('tables.allStatuses'));
    
    const tableStats = {
      total: tables.length,
      available: tables.filter(t => t.status === 'available').length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      reserved: tables.filter(t => t.status === 'reserved').length,
      maintenance: tables.filter(t => t.status === 'maintenance').length
    };

    // Filter tables based on status
    const filteredTables = tables.filter(table => {
      const matchesStatus = statusFilter === getText('tables.allStatuses') || 
                           statusFilter === getText(`status.${table.status}`);
      
      return matchesStatus;
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
              <h1 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>{getText('tables.title')}</h1>
              <p className="text-gray-600 text-sm">{getText('tables.subtitle')}</p>
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
                <span>{getText('tables.addTable')}</span>
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
              <p className="text-sm font-medium" style={{ color: '#8D6E63' }}>{getText('tables.totalTables')}</p>
            </div>
          </div>

          <div className="rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer transform hover:scale-105 border border-gray-200" 
            style={{ 
              backgroundImage: 'linear-gradient(120deg, #ede3d3 0%, #f2ede6 50%, #f7f4f1 100%)'
            }}>
            <div className="text-center">
              <p className="text-2xl font-bold mb-1 text-green-700">{tableStats.available}</p>
              <p className="text-sm font-medium text-green-800">{getText('tables.available')}</p>
            </div>
          </div>

          <div className="rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer transform hover:scale-105 border border-gray-200" 
            style={{ 
              backgroundImage: 'linear-gradient(140deg, #ede3d3 0%, #f0e8dc 50%, #f4f0ea 100%)'
            }}>
            <div className="text-center">
              <p className="text-2xl font-bold mb-1 text-orange-700">{tableStats.occupied}</p>
              <p className="text-sm font-medium text-orange-800">{getText('tables.occupied')}</p>
            </div>
          </div>

          <div className="rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer transform hover:scale-105 border border-gray-200" 
            style={{ 
              backgroundImage: 'linear-gradient(160deg, #ede3d3 0%, #f1e7db 50%, #f6f2ed 100%)'
            }}>
            <div className="text-center">
              <p className="text-2xl font-bold mb-1 text-yellow-700">{tableStats.reserved}</p>
              <p className="text-sm font-medium text-yellow-800">{getText('tables.reserved')}</p>
            </div>
          </div>

          <div className="rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer transform hover:scale-105 border border-gray-200" 
            style={{ 
              backgroundImage: 'linear-gradient(180deg, #ede3d3 0%, #f0e8dc 50%, #f5f1ec 100%)'
            }}>
            <div className="text-center">
              <p className="text-2xl font-bold mb-1 text-purple-700">{tableStats.maintenance}</p>
              <p className="text-sm font-medium text-purple-800">{getText('tables.maintenance')}</p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="rounded-xl p-4 mb-6 shadow-sm border border-gray-200" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, #ede3d3 0%, #f2ede6 70%, #f7f4f1 100%)'
          }}>
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium" style={{ color: '#8D6E63' }}>{getText('tables.filter')}</span>
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
                <option>{getText('tables.allStatuses')}</option>
                <option>{getText('status.available')}</option>
                <option>{getText('status.occupied')}</option>
                <option>{getText('status.reserved')}</option>
                <option>{getText('status.maintenance')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-4 gap-4">
          {filteredTables.length > 0 ? (
            filteredTables.map((table) => (
              <div key={table.id}
                onClick={() => handleTableClick(table)}
                className="rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer border border-gray-200 flex flex-col items-center text-center"
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
                  <span className="text-sm font-medium" style={{ color: '#8D6E63' }}>{table.seats} {getText('tables.seats')}</span>
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
                    {table.status === 'available' ? getText('status.available') :
                     table.status === 'occupied' ? getText('status.occupied') :
                     table.status === 'reserved' ? getText('status.reserved') :
                     table.status === 'maintenance' ? getText('status.maintenance') :
                     String(table.status).charAt(0).toUpperCase() + String(table.status).slice(1)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-8">
              <p className="text-lg font-medium mb-2" style={{ color: '#8D6E63' }}>No tables found</p>
              <p className="text-sm" style={{ color: '#8D6E63' }}>
                {statusFilter !== getText('tables.allStatuses') 
                  ? 'Try adjusting your filter criteria' 
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
                  <h1 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>{getText('orders.title')}</h1>
                  <p className="text-gray-600 text-sm">{getText('orders.subtitle')}</p>
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
                    <span className="font-medium">{getText('orders.live')}</span>
                  </button>
                  <button className="px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition-all duration-200 hover:shadow-md"
                    style={{ 
                      background: 'linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%)',
                      color: 'white' 
                    }}>
                    <RefreshCw className="w-4 h-4" />
                    <span className="font-medium">{getText('orders.refresh')}</span>
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
                      {getText('orders.markCompleted')}
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
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#f5f5f0' }}>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4" style={{ color: '#FF6B35' }}>
                {getText('analytics')}
              </h1>
              <p className="text-2xl text-gray-500 font-light">
                {getText('analytics.comingSoon')}
              </p>
            </div>
          </div>
        );
      case 'settings': {
        const renderGeneralSettings = () => (
          <div className="rounded-xl p-4 shadow-sm border border-gray-200 bg-white mb-4">
            <h2 className="text-lg font-semibold mb-2" style={{ color: '#5D4037' }}>
              {getText('settings.generalTitle')}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              {getText('settings.generalSubtitle')}
            </p>

            {/* Language Settings */}
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2" style={{ color: '#5D4037' }}>
                {getText('settings.languageSettings')}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {getText('settings.language')}
                </span>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    language === 'en' 
                      ? 'bg-gray-300 text-gray-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('nl')}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    language === 'nl' 
                      ? 'bg-gray-300 text-gray-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  NL
                </button>
              </div>
            </div>

            {/* Restaurant Information */}
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2" style={{ color: '#5D4037' }}>
                {getText('settings.restaurantInfo')}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {getText('settings.contactAdmin')}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {/* Restaurant Name */}
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-xs">🏢</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide truncate">
                      {getText('settings.restaurantName')}
                    </p>
                    <p className="text-sm font-medium text-gray-800 truncate">TableTech-Demo</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                    <span className="text-xs">📍</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide truncate">
                      {getText('settings.address')}
                    </p>
                    <p className="text-sm font-medium text-gray-800 truncate">Rotterdam</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-xs">📞</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide truncate">
                      {getText('settings.phoneNumber')}
                    </p>
                    <p className="text-sm font-medium text-gray-800 truncate">+31612345678</p>
                  </div>
                </div>

                {/* Subscription */}
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                    <span className="text-xs">📄</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide truncate">
                      {getText('settings.subscriptionType')}
                    </p>
                    <p className="text-sm font-medium text-gray-800 truncate">Full Dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

        const renderPaymentSettings = () => (
          <div className="rounded-xl p-8 shadow-sm border border-gray-200 bg-white mb-6">
            <h2 className="text-xl font-semibold mb-3" style={{ color: '#5D4037' }}>
              {getText('settings.paymentTitle')}
            </h2>
            <p className="text-gray-500 text-base mb-8">
              {getText('settings.paymentSubtitle')}
            </p>

            <div className="space-y-6">
              {/* Cash Payments */}
              <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM15 8a5 5 0 01-5 5v-1.025a2.4 2.4 0 002.5-2.475A2.4 2.4 0 0010 7.025V6a5 5 0 015 2z" clipRule="evenodd"/></svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-800">
                      {getText('settings.acceptCash')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {getText('settings.acceptCashDesc')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => togglePaymentSetting('cash')}
                  className="relative focus:outline-none"
                >
                  <div className={`w-14 h-8 rounded-full shadow-inner transition-colors duration-300 ${
                    paymentSettings.cash ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 top-1 ${
                      paymentSettings.cash ? 'translate-x-7' : 'translate-x-1'
                    }`}></div>
                  </div>
                </button>
              </div>

              {/* Card Payments */}
              <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-800">
                      {getText('settings.acceptCard')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {getText('settings.acceptCardDesc')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => togglePaymentSetting('card')}
                  className="relative focus:outline-none"
                >
                  <div className={`w-14 h-8 rounded-full shadow-inner transition-colors duration-300 ${
                    paymentSettings.card ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 top-1 ${
                      paymentSettings.card ? 'translate-x-7' : 'translate-x-1'
                    }`}></div>
                  </div>
                </button>
              </div>

              {/* Online Payments */}
              <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-purple-50 to-white">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-800">
                      {getText('settings.acceptOnline')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {getText('settings.acceptOnlineDesc')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => togglePaymentSetting('online')}
                  className="relative focus:outline-none"
                >
                  <div className={`w-14 h-8 rounded-full shadow-inner transition-colors duration-300 ${
                    paymentSettings.online ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 top-1 ${
                      paymentSettings.online ? 'translate-x-7' : 'translate-x-1'
                    }`}></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

        const renderStaffManagement = () => (
          <div className="rounded-xl p-6 shadow-sm border border-gray-200 bg-white mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-2" style={{ color: '#5D4037' }}>
                  {getText('settings.staffTitle')}
                </h2>
                <p className="text-gray-500 text-sm">
                  {getText('settings.staffSubtitle')}
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:shadow-md"
                style={{ 
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F97316 100%)'
                }}>
                {getText('settings.addStaff')}
              </button>
            </div>

            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <div className="max-h-80 overflow-y-auto"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <table className="w-full">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getText('tables.name')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        E-MAIL
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getText('tables.role')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STATUS
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getText('tables.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {staffMembers.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                            style={{ backgroundColor: '#8D6E63' }}>
                            {staff.name.charAt(0)}
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">{staff.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {staff.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {staff.role}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleStaffStatus(staff.id)}
                            className="relative"
                          >
                            <div className={`w-10 h-6 rounded-full relative transition-colors ${staff.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                              <div className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform top-1 ${
                                staff.active ? 'translate-x-5' : 'translate-x-1'
                              }`}></div>
                            </div>
                          </button>
                          <span className="text-sm text-gray-600">{staff.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors">
                            {getText('edit')}
                          </button>
                          <button 
                            onClick={() => handleDeleteStaff(staff)}
                            className="text-orange-600 hover:text-orange-800 transition-colors"
                          >
                            {getText('settings.delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>            {/* Deleted Staff Section */}
            {deletedStaff.length > 0 && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="text-sm font-medium text-orange-800 mb-3">
                  {getText('settings.deletedStaff')}
                </h4>
                <div className="space-y-2">
                  {deletedStaff.map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium bg-gray-400">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">{staff.name}</span>
                          <span className="text-xs text-gray-400 ml-2">({staff.email})</span>
                        </div>
                      </div>
                      <button
                        onClick={() => restoreStaff(staff.id)}
                        className="px-3 py-1 text-xs font-medium text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded transition-colors"
                      >
                        {getText('settings.restore')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

        return (
          <div className="flex-1 p-6 overflow-hidden" style={{ backgroundColor: '#f5f5f0' }}>
              {/* Settings Header */}
              <div className="rounded-xl p-6 mb-6 shadow-sm border border-gray-200" 
                style={{ 
                  backgroundImage: 'linear-gradient(120deg, #faf9f7 0%, #f2ede6 50%, #ede3d3 100%)'
                }}>
                <h1 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>
                  {getText('settings')}
                </h1>
                <p className="text-gray-600 text-sm">
                  {getText('settings.generalSubtitle')}
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setActiveSettingsTab('general')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSettingsTab === 'general'
                      ? 'text-white'
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{ 
                    background: activeSettingsTab === 'general' 
                      ? 'linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%)' 
                      : undefined
                  }}
                >
                  {getText('settings.general')}
                </button>
                <button
                  onClick={() => setActiveSettingsTab('payment')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSettingsTab === 'payment'
                      ? 'text-white'
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{ 
                    background: activeSettingsTab === 'payment' 
                      ? 'linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%)' 
                      : undefined
                  }}
                >
                  {getText('settings.payment')}
                </button>
                <button
                  onClick={() => setActiveSettingsTab('staff')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSettingsTab === 'staff'
                      ? 'text-white'
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{ 
                    background: activeSettingsTab === 'staff' 
                      ? 'linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%)' 
                      : undefined
                  }}
                >
                  {getText('settings.staff')}
                </button>
              </div>

              {/* Tab Content */}
              {activeSettingsTab === 'general' && renderGeneralSettings()}
              {activeSettingsTab === 'payment' && renderPaymentSettings()}
              {activeSettingsTab === 'staff' && renderStaffManagement()}
              
              {/* Delete Confirmation Modal */}
              {showDeleteConfirm && staffToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {getText('settings.confirmDelete')}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {getText('settings.confirmDeleteDesc')}
                    </p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      >
                        {getText('cancel')}
                      </button>
                      <button
                        onClick={confirmDeleteStaff}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                      >
                        {getText('settings.delete')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>
        );
      }
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
        /* Hide all scrollbars completely */
        .demo-scroll::-webkit-scrollbar {
          display: none;
        }
        .demo-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Hide scrollbars for all elements */
        *::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
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

      {/* Manage Table Modal */}
      {showManageTableModal && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#5D4037' }}>Manage {selectedTable.name}</h2>
              <button 
                onClick={() => {
                  setShowManageTableModal(false);
                  setSelectedTable(null);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>

            {/* Table Info Card */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8D6E63' }}>
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: '#5D4037' }}>{selectedTable.name}</h3>
                    <p className="text-sm text-gray-600">{selectedTable.seats} {getText('tables.seats')} • {getText('tables.code')}: {selectedTable.code}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedTable.status === 'available' ? 'bg-green-100 text-green-700' :
                  selectedTable.status === 'occupied' ? 'bg-orange-100 text-orange-700' :
                  selectedTable.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' : 
                  selectedTable.status === 'maintenance' ? 'bg-gray-100 text-gray-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {selectedTable.status === 'available' ? 'Available' :
                   selectedTable.status === 'occupied' ? 'Occupied' :
                   selectedTable.status === 'reserved' ? 'Reserved' :
                   selectedTable.status === 'maintenance' ? 'Maintenance' :
                   'Unknown'}
                </span>
              </div>
            </div>

            {/* Status Options */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#5D4037' }}>{getText('tables.updateStatus')}</h3>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Available */}
                <button
                  onClick={() => handleUpdateTableStatus('available')}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
                    selectedTable.status === 'available' 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="font-medium text-green-700">{getText('status.available')}</span>
                  </div>
                  <p className="text-xs text-green-600">{getText('tables.readyForCustomers')}</p>
                </button>

                {/* Occupied */}
                <button
                  onClick={() => handleUpdateTableStatus('occupied')}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
                    selectedTable.status === 'occupied' 
                      ? 'border-orange-400 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="w-8 h-8 p-1.5 rounded-full bg-orange-500 text-white" />
                    <span className="font-medium text-orange-700">{getText('status.occupied')}</span>
                  </div>
                  <p className="text-xs text-orange-600">{getText('tables.currentlyUsed')}</p>
                </button>

                {/* Reserved */}
                <button
                  onClick={() => handleUpdateTableStatus('reserved')}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
                    selectedTable.status === 'reserved' 
                      ? 'border-yellow-400 bg-yellow-50' 
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-white text-sm">⏰</span>
                    </div>
                    <span className="font-medium text-yellow-700">{getText('status.reserved')}</span>
                    {selectedTable.status === 'reserved' && (
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">{getText('tables.current')}</span>
                    )}
                  </div>
                  <p className="text-xs text-yellow-600">{getText('tables.reservedForGuests')}</p>
                </button>

                {/* Maintenance */}
                <button
                  onClick={() => handleUpdateTableStatus('maintenance')}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
                    selectedTable.status === 'maintenance' 
                      ? 'border-gray-400 bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                      <span className="text-white text-sm">🔧</span>
                    </div>
                    <span className="font-medium text-gray-700">{getText('status.maintenance')}</span>
                  </div>
                  <p className="text-xs text-gray-600">{getText('tables.outOfService')}</p>
                </button>

              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  setShowManageTableModal(false);
                  setSelectedTable(null);
                }}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ color: '#5D4037' }}
              >
                {getText('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#5D4037' }}>{getText('tables.addTable')}</h2>
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
                  const value = e.target.value;
                  setNewTableNumber(value);
                  // Real-time validation while typing
                  if (value) {
                    validateTableNumber(value);
                  } else {
                    setTableNumberError('');
                  }
                }}
                onBlur={() => {
                  if (newTableNumber) {
                    validateTableNumber(newTableNumber);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!tableNumberError && newTableNumber && newTableSeats) {
                      handleAddTable();
                    }
                  }
                }}
                placeholder="Voer tafelnummer in (bijv. 6)"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors text-gray-800 ${
                  tableNumberError 
                    ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                    : newTableNumber && !tableNumberError
                    ? 'border-green-300 focus:ring-green-200 bg-green-50'
                    : 'border-gray-300 focus:ring-blue-200 bg-white'
                }`}
              />
              {tableNumberError && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {tableNumberError}
                </p>
              )}
              {!tableNumberError && newTableNumber && (
                <p className="text-green-600 text-xs mt-1 flex items-center">
                  <span className="mr-1">✅</span>
                  {getText('tables.numberAvailable')}
                </p>
              )}
              {!newTableNumber && (
                <p className="text-gray-500 text-xs mt-1">{getText('tables.chooseNumber')}</p>
              )}
            </div>

            {/* Seats Input */}
            <div className="mb-6">
              <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: '#5D4037' }}>
                <span className="text-lg">👥</span>
                <span>{getText('tables.seatingCapacity')}</span>
              </label>
              <input
                type="number"
                value={newTableSeats}
                onChange={(e) => setNewTableSeats(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!tableNumberError && newTableNumber && newTableSeats) {
                      handleAddTable();
                    }
                  }
                }}
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-gray-800"
              />
              <p className="text-gray-500 text-xs mt-1">{getText('tables.maxCustomers')}</p>
            </div>

            {/* QR Code Info */}
            {newTableNumber && !tableNumberError && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-blue-600 text-sm">📱</span>
                  <span className="text-blue-800 text-sm font-medium">{getText('tables.qrGenerated')}</span>
                </div>
                <p className="text-blue-700 text-xs">
                  {language === 'nl' 
                    ? `Klanten scannen deze code om toegang te krijgen tot Tafel ${newTableNumber}`
                    : `Customers scan this code to access Table ${newTableNumber}`
                  }
                </p>
              </div>
            )}

            {/* Table Overview */}
            {newTableNumber && !tableNumberError && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-green-800 text-sm font-medium mb-2">{getText('tables.overview')}</h3>
                <ul className="text-green-700 text-xs space-y-1">
                  <li>• <strong>{getText('tables.tableNumber')}</strong> {newTableNumber}</li>
                  <li>• <strong>{getText('tables.capacity')}</strong> {newTableSeats} {getText('tables.people')}</li>
                  <li>• <strong>QR Code:</strong> {language === 'nl' ? 'Wordt automatisch gegenereerd' : 'Generated automatically'}</li>
                  <li>• <strong>Status:</strong> {language === 'nl' ? 'Beschikbaar (standaard)' : 'Available (default)'}</li>
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
                {getText('cancel')}
              </button>
              <button
                onClick={handleAddTable}
                disabled={!newTableNumber || !!tableNumberError || !newTableSeats}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                  !newTableNumber || !!tableNumberError || !newTableSeats
                    ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
                    : 'hover:shadow-md hover:scale-105'
                }`}
                style={{ 
                  backgroundColor: !newTableNumber || !!tableNumberError || !newTableSeats ? undefined : '#5D4037',
                  color: !newTableNumber || !!tableNumberError || !newTableSeats ? undefined : 'white'
                }}
              >
                {!newTableNumber || !!tableNumberError || !newTableSeats 
                  ? (language === 'nl' ? 'Vul alle velden in' : 'Fill all fields') 
                  : `+ ${getText('tables.addTable')}`
                }
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


import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Loading } from '../components/ui/Loading';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Errore nel caricamento utenti:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Nome Utente',
      accessor: (user: any) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'role',
      header: 'Ruolo',
      accessor: (user: any) => (
        <Badge
          variant={
            user.role === 'admin' ? 'premium' :
            user.role === 'manager' ? 'success' :
            user.role === 'user' ? 'default' : 'secondary'
          }
        >
          {user.role === 'admin' ? 'Amministratore' :
           user.role === 'manager' ? 'Manager' :
           user.role === 'user' ? 'Utente' : user.role}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Stato',
      accessor: (user: any) => (
        <Badge
          variant={
            user.status === 'active' ? 'success' :
            user.status === 'inactive' ? 'destructive' :
            user.status === 'pending' ? 'warning' : 'secondary'
          }
        >
          {user.status === 'active' ? 'Attivo' :
           user.status === 'inactive' ? 'Inattivo' :
           user.status === 'pending' ? 'In Attesa' : user.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'lastLogin',
      header: 'Ultimo Accesso',
      accessor: (user: any) => (
        <div>
          <p className="text-sm text-gray-900">
            {new Date(user.lastLogin).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(user.lastLogin).toLocaleTimeString()}
          </p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'subscription',
      header: 'Abbonamento',
      accessor: (user: any) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {user.subscription?.plan || 'Nessuno'}
          </p>
          {user.subscription?.expiresAt && (
            <p className="text-xs text-gray-500">
              Scade: {new Date(user.subscription.expiresAt).toLocaleDateString()}
            </p>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Azioni',
      accessor: (user: any) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedUser(user)}
          >
            👁️ Visualizza
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditUser(user)}
          >
            ✏️ Modifica
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteUser(user.id)}
          >
            🗑️ Elimina
          </Button>
        </div>
      ),
    },
  ];

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowAddUser(true);
  };

  const handleDeleteUser = async (userId: string) => {
    // Show custom confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    confirmModal.innerHTML = `
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Delete User</h3>
            <p class="text-gray-600">This action cannot be undone</p>
          </div>
        </div>
        <div class="bg-red-50 rounded-lg p-3 mb-4">
          <p class="text-sm text-red-800">Are you sure you want to delete this user? This action cannot be undone.</p>
        </div>
        <div class="flex space-x-3">
          <button onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium">
            Cancel
          </button>
          <button id="confirmDelete" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
            Delete
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmModal);
    
    const cancelBtn = confirmModal.querySelector('#cancelDelete');
    const confirmBtn = confirmModal.querySelector('#confirmDelete');
    
    cancelBtn?.addEventListener('click', () => {
      document.body.removeChild(confirmModal);
    });
    
    confirmBtn?.addEventListener('click', async () => {
      document.body.removeChild(confirmModal);
      try {
        await apiService.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error('Errore nell\'eliminazione utente:', error);
      }
    });
  };

  if (loading) {
    return <Loading text="Caricamento utenti..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">👥 Gestione Utenti</h1>
          <p className="text-gray-600 mt-2">Gestisci utenti, ruoli e permessi</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utenti Totali</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-blue-600">+12% vs mese scorso</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attivi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'active').length}
                </p>
                <p className="text-sm text-green-600">89% del totale</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Attesa</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'pending').length}
                </p>
                <p className="text-sm text-yellow-600">8% del totale</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👑</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admin</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
                <p className="text-sm text-purple-600">3% del totale</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Cerca utenti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                  className="w-full md:w-64"
                />
              </div>

              {/* Role Filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tutti i Ruoli</option>
                <option value="admin">Amministratori</option>
                <option value="manager">Manager</option>
                <option value="user">Utenti</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tutti gli Stati</option>
                <option value="active">Attivi</option>
                <option value="inactive">Inattivi</option>
                <option value="pending">In Attesa</option>
              </select>
            </div>

            <Button
              onClick={() => setShowAddUser(true)}
              leftIcon="➕"
            >
              Aggiungi Utente
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow">
          <Table
            data={users.filter(user => {
              const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   user.email.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesRole = filterRole === 'all' || user.role === filterRole;
              const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
              return matchesSearch && matchesRole && matchesStatus;
            })}
            columns={columns}
            sortable={true}
            filterable={true}
            pagination={true}
            pageSize={10}
          />
        </div>

        {/* Add/Edit User Modal */}
        <Modal
          isOpen={showAddUser}
          onClose={() => {
            setShowAddUser(false);
            setSelectedUser(null);
          }}
          title={selectedUser ? 'Modifica Utente' : 'Aggiungi Nuovo Utente'}
          size="lg"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <Input
                  type="text"
                  defaultValue={selectedUser?.name || ''}
                  placeholder="Nome utente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cognome
                </label>
                <Input
                  type="text"
                  defaultValue={selectedUser?.lastName || ''}
                  placeholder="Cognome utente"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                defaultValue={selectedUser?.email || ''}
                placeholder="email@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ruolo
                </label>
                <select
                  defaultValue={selectedUser?.role || 'user'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">Utente</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Amministratore</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stato
                </label>
                <select
                  defaultValue={selectedUser?.status || 'active'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Attivo</option>
                  <option value="inactive">Inattivo</option>
                  <option value="pending">In Attesa</option>
                </select>
              </div>
            </div>

            {!selectedUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Password sicura"
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddUser(false);
                  setSelectedUser(null);
                }}
              >
                Annulla
              </Button>
              <Button>
                {selectedUser ? 'Aggiorna' : 'Crea'} Utente
              </Button>
            </div>
          </form>
        </Modal>

        {/* User Detail Modal */}
        <Modal
          isOpen={!!selectedUser && !showAddUser}
          onClose={() => setSelectedUser(null)}
          title="Dettagli Utente"
          size="lg"
        >
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex space-x-2 mt-2">
                    <Badge variant="success">{selectedUser.role}</Badge>
                    <Badge variant="info">{selectedUser.status}</Badge>
                  </div>
                </div>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Ultimo Accesso</p>
                  <p className="font-medium">{new Date(selectedUser.lastLogin).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Data Registrazione</p>
                  <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Subscription Info */}
              {selectedUser.subscription && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Abbonamento</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Piano:</span> {selectedUser.subscription.plan}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Scade:</span> {new Date(selectedUser.subscription.expiresAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Stato:</span> {selectedUser.subscription.status}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm">
                  📧 Invia Email
                </Button>
                <Button variant="outline" size="sm">
                  🔄 Reset Password
                </Button>
                <Button variant="outline" size="sm">
                  📊 Visualizza Analytics
                </Button>
                <Button variant="destructive" size="sm">
                  🗑️ Elimina Utente
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement; 
'use client'

import { useEffect, useState } from 'react'
import { Client } from '../../../types'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [newClient, setNewClient] = useState({ 
    full_name: '', 
    phone: '',
    subscription_type: 'Standard' as 'Standard' | 'Premium' | 'VIP', 
    status: 'Active' as 'Active' | 'Expired' 
  })
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const result = await response.json()
      
      if (!result.success) {
        console.error('Ошибка загрузки клиентов:', result.error)
        setError('Не удалось загрузить клиентов')
      } else {
        setClients(result.data || [])
        setError('')
      }
    } catch (error) {
      console.error('Ошибка загрузки клиентов:', error)
      setError('Не удалось загрузить клиентов')
    }
  }

  const addClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Подготавливаем данные для отправки
    const clientData: {
      full_name: string;
      subscription_type: string;
      status: string;
      phone?: string;
    } = {
      full_name: newClient.full_name.trim(),
      subscription_type: newClient.subscription_type,
      status: newClient.status,
    }
    
    // Добавляем phone только если он заполнен
    if (newClient.phone && newClient.phone.trim()) {
      clientData.phone = newClient.phone.trim()
    }
    
    // Используем API route для обхода RLS
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    })

    const result = await response.json()

    if (!result.success) {
      console.error('Ошибка добавления клиента:', result.error)
      setError(`Не удалось добавить клиента: ${result.error || 'Неизвестная ошибка'}`)
    } else {
      setNewClient({ full_name: '', phone: '', subscription_type: 'Standard', status: 'Active' })
      setSuccess('Клиент успешно добавлен')
      fetchClients()
    }
  }

  const startEdit = (client: Client) => {
    setEditingClient({ ...client })
    setError('')
    setSuccess('')
  }

  const cancelEdit = () => {
    setEditingClient(null)
    setError('')
    setSuccess('')
  }

  const updateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClient) return

    setError('')
    setSuccess('')

    const clientData: {
      full_name: string;
      subscription_type: string;
      status: string;
      phone?: string;
    } = {
      full_name: editingClient.full_name.trim(),
      subscription_type: editingClient.subscription_type,
      status: editingClient.status,
    }

    if (editingClient.phone && editingClient.phone.trim()) {
      clientData.phone = editingClient.phone.trim()
    } else {
      clientData.phone = null
    }

    const response = await fetch(`/api/clients/${editingClient.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    })

    const result = await response.json()

    if (!result.success) {
      console.error('Ошибка обновления клиента:', result.error)
      setError(`Не удалось обновить клиента: ${result.error || 'Неизвестная ошибка'}`)
    } else {
      setEditingClient(null)
      setSuccess('Клиент успешно обновлён')
      fetchClients()
    }
  }

  const deleteClient = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого клиента?')) {
      return
    }

    const response = await fetch(`/api/clients/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()

    if (!result.success) {
      console.error('Ошибка удаления клиента:', result.error)
      setError(`Не удалось удалить клиента: ${result.error || 'Неизвестная ошибка'}`)
    } else {
      setSuccess('Клиент успешно удалён')
      fetchClients()
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const getSubscriptionBadge = (type: string) => {
    const badges = {
      'Standard': 'bg-gray-100 text-gray-800',
      'Premium': 'bg-blue-100 text-blue-800',
      'VIP': 'bg-purple-100 text-purple-800'
    }
    return badges[type as keyof typeof badges] || badges.Standard
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Клиенты</h1>
        <p className="text-gray-600">Управление клиентами фитнес-центра</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {editingClient && (
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-blue-500">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Редактировать клиента</h2>
          <form onSubmit={updateClient} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Полное имя
              </label>
              <input
                type="text"
                value={editingClient.full_name}
                onChange={(e) => setEditingClient({ ...editingClient, full_name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Введите полное имя клиента"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон (необязательно)
              </label>
              <input
                type="text"
                value={editingClient.phone || ''}
                onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Введите телефон клиента"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип подписки
                </label>
                <select
                  value={editingClient.subscription_type}
                  onChange={(e) => setEditingClient({ ...editingClient, subscription_type: e.target.value as 'Standard' | 'Premium' | 'VIP' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="Standard">Стандарт</option>
                  <option value="Premium">Премиум</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <select
                  value={editingClient.status}
                  onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value as 'Active' | 'Expired' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="Active">Активен</option>
                  <option value="Expired">Истёк</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Сохранить изменения
              </button>
              <button 
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Добавить нового клиента</h2>
        <form onSubmit={addClient} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Полное имя
            </label>
            <input
              type="text"
              value={newClient.full_name}
              onChange={(e) => setNewClient({ ...newClient, full_name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Введите полное имя клиента"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Телефон (необязательно)
            </label>
            <input
              type="text"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Введите телефон клиента"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип подписки
              </label>
              <select
                value={newClient.subscription_type}
                onChange={(e) => setNewClient({ ...newClient, subscription_type: e.target.value as 'Standard' | 'Premium' | 'VIP' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Standard">Стандарт</option>
                <option value="Premium">Премиум</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={newClient.status}
                onChange={(e) => setNewClient({ ...newClient, status: e.target.value as 'Active' | 'Expired' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Active">Активен</option>
                <option value="Expired">Истёк</option>
              </select>
            </div>
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Добавить клиента
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Полное имя
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Телефон
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип подписки
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Нет клиентов
                  </td>
                </tr>
              ) : (
                clients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {client.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSubscriptionBadge(client.subscription_type)}`}>
                        {client.subscription_type === 'Standard' ? 'Стандарт' : 
                         client.subscription_type === 'Premium' ? 'Премиум' : 'VIP'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(client.status)}`}>
                        {client.status === 'Active' ? 'Активен' : 'Истёк'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button 
                        onClick={() => startEdit(client)} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        Редактировать
                      </button>
                      <button 
                        onClick={() => deleteClient(client.id)} 
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useEffect, useState } from 'react'
import { Client } from '../../types'

export default function AdminDashboard() {
  const [totalClients, setTotalClients] = useState(0)
  const [activeClients, setActiveClients] = useState(0)
  const [vipClients, setVipClients] = useState(0)
  const [expiredClients, setExpiredClients] = useState<Client[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/clients')
        const result = await response.json()
        
        if (!result.success) {
          console.error('Ошибка загрузки клиентов:', result.error)
          return
        }

        const clients = result.data || []
        setTotalClients(clients.length)
        setActiveClients(clients.filter((c: Client) => c.status === 'Active').length)
        setVipClients(clients.filter((c: Client) => c.subscription_type === 'VIP').length)
        setExpiredClients(clients.filter((c: Client) => c.status === 'Expired'))
      } catch (error) {
        console.error('Ошибка загрузки клиентов:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Панель управления
        </h1>
        <p className="text-gray-600">Обзор статистики фитнес-центра</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Всего клиентов</h2>
          <p className="text-4xl font-bold text-blue-600">{totalClients}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Активных клиентов</h2>
          <p className="text-4xl font-bold text-green-600">{activeClients}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">VIP клиентов</h2>
          <p className="text-4xl font-bold text-purple-600">{vipClients}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Клиенты с истёкшей подпиской</h2>
        {expiredClients.length === 0 ? (
          <p className="text-gray-500">Нет клиентов с истёкшей подпиской.</p>
        ) : (
          <ul className="space-y-3">
            {expiredClients.map(client => (
              <li key={client.id} className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">{client.full_name}</p>
                <p className="text-sm text-gray-600">Тип подписки: {client.subscription_type}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}


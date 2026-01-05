'use client'

import { useEffect, useState } from 'react'
import { Coach } from '../../../types'

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [newCoach, setNewCoach] = useState({ name: '', specialization: '' })
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchCoaches()
  }, [])

  const fetchCoaches = async () => {
    try {
      const response = await fetch('/api/coaches')
      const result = await response.json()
      
      if (!result.success) {
        console.error('Ошибка загрузки тренеров:', result.error)
        setError('Не удалось загрузить тренеров')
      } else {
        setCoaches(result.data || [])
        setError('')
      }
    } catch (error) {
      console.error('Ошибка загрузки тренеров:', error)
      setError('Не удалось загрузить тренеров')
    }
  }

  const addCoach = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    const coachData = {
      name: newCoach.name.trim(),
      specialization: newCoach.specialization.trim(),
    }

    const response = await fetch('/api/coaches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coachData),
    })

    const result = await response.json()

    if (!result.success) {
      console.error('Ошибка добавления тренера:', result.error)
      setError(`Не удалось добавить тренера: ${result.error || 'Неизвестная ошибка'}`)
    } else {
      setNewCoach({ name: '', specialization: '' })
      setSuccess('Тренер успешно добавлен')
      fetchCoaches()
    }
  }

  const startEdit = (coach: Coach) => {
    setEditingCoach({ ...coach })
    setError('')
    setSuccess('')
  }

  const cancelEdit = () => {
    setEditingCoach(null)
    setError('')
    setSuccess('')
  }

  const updateCoach = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCoach) return

    setError('')
    setSuccess('')

    const coachData = {
      name: editingCoach.name.trim(),
      specialization: editingCoach.specialization.trim(),
    }

    const response = await fetch(`/api/coaches/${editingCoach.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coachData),
    })

    const result = await response.json()

    if (!result.success) {
      console.error('Ошибка обновления тренера:', result.error)
      setError(`Не удалось обновить тренера: ${result.error || 'Неизвестная ошибка'}`)
    } else {
      setEditingCoach(null)
      setSuccess('Тренер успешно обновлён')
      fetchCoaches()
    }
  }

  const deleteCoach = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого тренера?')) {
      return
    }

    const response = await fetch(`/api/coaches/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()

    if (!result.success) {
      console.error('Ошибка удаления тренера:', result.error)
      setError(`Не удалось удалить тренера: ${result.error || 'Неизвестная ошибка'}`)
    } else {
      setSuccess('Тренер успешно удалён')
      fetchCoaches()
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Тренеры</h1>
        <p className="text-gray-600">Управление тренерами фитнес-центра</p>
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

      {editingCoach && (
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-blue-500">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Редактировать тренера</h2>
          <form onSubmit={updateCoach} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя
              </label>
              <input
                type="text"
                value={editingCoach.name}
                onChange={(e) => setEditingCoach({ ...editingCoach, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Введите имя тренера"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Специализация
              </label>
              <input
                type="text"
                value={editingCoach.specialization}
                onChange={(e) => setEditingCoach({ ...editingCoach, specialization: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Введите специализацию"
              />
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
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Добавить нового тренера</h2>
        <form onSubmit={addCoach} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя
            </label>
            <input
              type="text"
              value={newCoach.name}
              onChange={(e) => setNewCoach({ ...newCoach, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Введите имя тренера"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Специализация
            </label>
            <input
              type="text"
              value={newCoach.specialization}
              onChange={(e) => setNewCoach({ ...newCoach, specialization: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Введите специализацию"
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Добавить тренера
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Имя
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Специализация
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coaches.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    Нет тренеров
                  </td>
                </tr>
              ) : (
                coaches.map(coach => (
                  <tr key={coach.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {coach.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {coach.specialization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button 
                        onClick={() => startEdit(coach)} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        Редактировать
                      </button>
                      <button 
                        onClick={() => deleteCoach(coach.id)} 
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


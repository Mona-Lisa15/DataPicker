'use client'

import { useState } from 'react'
import { create } from 'zustand'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addDays, addMonths, addWeeks, addYears, format, isSameDay, startOfDay } from 'date-fns'

interface DatePickerState {
  startDate: Date | undefined
  endDate: Date | undefined
  recurrenceType: 'daily' | 'weekly' | 'monthly' | 'yearly'
  recurrenceInterval: number
  selectedDays: number[]
  setStartDate: (date: Date | undefined) => void
  setEndDate: (date: Date | undefined) => void
  setRecurrenceType: (type: 'daily' | 'weekly' | 'monthly' | 'yearly') => void
  setRecurrenceInterval: (interval: number) => void
  setSelectedDays: (days: number[]) => void
}

const useDatePickerStore = create<DatePickerState>((set) => ({
  startDate: undefined,
  endDate: undefined,
  recurrenceType: 'daily',
  recurrenceInterval: 1,
  selectedDays: [],
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setRecurrenceType: (type) => set({ recurrenceType: type }),
  setRecurrenceInterval: (interval) => set({ recurrenceInterval: interval }),
  setSelectedDays: (days) => set({ selectedDays: days }),
}))

export default function DatePicker() {
  const {
    startDate,
    endDate,
    recurrenceType,
    recurrenceInterval,
    selectedDays,
    setStartDate,
    setEndDate,
    setRecurrenceType,
    setRecurrenceInterval,
    setSelectedDays,
  } = useDatePickerStore()

  const [previewDates, setPreviewDates] = useState<Date[]>([])

  const updatePreviewDates = () => {
    if (!startDate) return

    const dates: Date[] = []
    let currentDate = startOfDay(startDate)
    const endDateToUse = endDate || addYears(currentDate, 1)

    while (currentDate <= endDateToUse) {
      if (recurrenceType === 'daily' ||
          (recurrenceType === 'weekly' && selectedDays.includes(currentDate.getDay())) ||
          (recurrenceType === 'monthly' && currentDate.getDate() === startDate.getDate()) ||
          (recurrenceType === 'yearly' &&
           currentDate.getDate() === startDate.getDate() &&
           currentDate.getMonth() === startDate.getMonth())) {
        dates.push(currentDate)
      }

      switch (recurrenceType) {
        case 'daily':
          currentDate = addDays(currentDate, recurrenceInterval)
          break
        case 'weekly':
          currentDate = addWeeks(currentDate, recurrenceInterval)
          break
        case 'monthly':
          currentDate = addMonths(currentDate, recurrenceInterval)
          break
        case 'yearly':
          currentDate = addYears(currentDate, recurrenceInterval)
          break
      }
    }

    setPreviewDates(dates)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-4">
        <div>
          <Label>Start Date</Label>
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={setStartDate}
            className="rounded-md border"
          />
        </div>
        <div>
          <Label>End Date (Optional)</Label>
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={setEndDate}
            className="rounded-md border"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Recurrence</Label>
        <Select onValueChange={setRecurrenceType as (value: string) => void} value={recurrenceType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select recurrence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Every</Label>
        <Input
          type="number"
          min={1}
          value={recurrenceInterval}
          onChange={(e) => setRecurrenceInterval(parseInt(e.target.value))}
          className="w-[100px]"
        />
        <span className="ml-2">{recurrenceType}</span>
      </div>
      {recurrenceType === 'weekly' && (
        <div className="space-y-2">
          <Label>On</Label>
          <div className="flex space-x-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <Button
                key={day}
                variant={selectedDays.includes(index) ? 'default' : 'outline'}
                onClick={() => {
                  const newSelectedDays = selectedDays.includes(index)
                    ? selectedDays.filter((d) => d !== index)
                    : [...selectedDays, index]
                  setSelectedDays(newSelectedDays)
                }}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>
      )}
      <Button onClick={updatePreviewDates}>Update Preview</Button>
      <div>
        <Label>Preview</Label>
        <Calendar
          mode="multiple"
          selected={previewDates}
          className="rounded-md border"
          numberOfMonths={3}
        />
      </div>
    </div>
  )
}
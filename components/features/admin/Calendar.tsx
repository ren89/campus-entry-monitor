"use client"

import * as React from "react"

import { Calendar as BaseCalendar} from "@/components/ui/calendar"

export function Calendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <BaseCalendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm"
      captionLayout="dropdown"
    />
  )
}

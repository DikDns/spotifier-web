"use client";

export function dateParser(dateString: string) {
  const [day, month, yearTime] = dateString?.split("-") ?? [];
  const [year, time] = yearTime?.split(" ") ?? [];
  if (!time) {
    const date = `${year}-${month}-${day}T00:00:00`;
    return new Date(date);
  }

  const formattedTime = time?.length === 5 ? `${time}:00` : time;
  const date = `${year}-${month}-${day}T${formattedTime}`;
  return new Date(date);
}

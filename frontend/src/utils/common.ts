import { format } from 'date-fns'

export const formatDate = (str: string) => {
  return format(new Date(str), "dd/MM/yy - HH:mm:ss")
}
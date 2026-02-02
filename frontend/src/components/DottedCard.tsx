import { Typography } from '@mui/material'

interface DottedCardProps {
	title: string
	onClick?: () => void
}
export function DottedCard({ title, onClick }: DottedCardProps) {
	return (
		<div
			className="border h-19 border-dashed rounded-lg p-4 mb-4 flex justify-evenly
      items-center cursor-pointer duration-500 hover:scale-105"
			onClick={onClick}
		>
			<Typography variant="h5">{title}</Typography>
		</div>
	)
}

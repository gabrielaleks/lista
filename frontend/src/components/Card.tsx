import { Typography } from '@mui/material'
import React from 'react'

interface CardProps {
	createdAt: string
	onClick?: () => void
	children?: React.ReactNode
}

export function Card({ createdAt, onClick, children }: CardProps) {
	return (
		<div
			className="border border-gray-300 rounded-lg p-4 mb-4 flex justify-center
			items-center cursor-pointer duration-500 hover:scale-105"
			onClick={onClick}
		>
			<Typography className="text-sm m-0">{createdAt}</Typography>
			<div>{children}</div>
		</div>
	)
}

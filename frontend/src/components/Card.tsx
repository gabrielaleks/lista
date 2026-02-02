import { Typography } from '@mui/material'
import React from 'react'

interface CardProps {
	createdAt: string
	children?: React.ReactNode
}

export function Card({ createdAt, children }: CardProps) {
	return (
		<div className="border border-gray-300 rounded-lg p-4 mb-4 flex justify-between items-center">
			<Typography className="text-sm m-0">{createdAt}</Typography>
			<div>{children}</div>
		</div>
	)
}

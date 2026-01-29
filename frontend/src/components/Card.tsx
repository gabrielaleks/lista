import React from 'react'

interface CardProps {
	createdAt: string
	children?: React.ReactNode
}
export function Card({ createdAt, children }: CardProps) {
	return (
		<div className="border border-gray-300 rounded-lg p-4 mb-4 flex justify-between items-center">
			<h2 className="text-sm font-medium text-gray-600 m-0">{createdAt}</h2>
			<div>{children}</div>
		</div>
	)
}

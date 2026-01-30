import { useNavigate } from 'react-router-dom'
import { Card } from '../components/Card'
import { useLists } from '../hooks/useLists'
import { formatDate } from '../utils/common'
import { Alert, Container, IconButton, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRemoveList } from '../hooks/useRemoveList'
import type { List } from '../types/list'
import { useState } from 'react'

export function ListsPage() {
	const { lists, loading, error, removeFromState } = useLists()
	const { remove, loadingRemove, errorRemove } = useRemoveList()
	const [successRemove, setSuccessRemove] = useState(false)
	const navigate = useNavigate()

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error}</p>

	const handleDelete = async (list: List) => {
		const response = await remove(list.id)
		if (response) {
			removeFromState(list.id)
			setSuccessRemove(true)
			setTimeout(() => setSuccessRemove(false), 2000)
		}
	}

	return (
		<Container maxWidth="xs" sx={{ mt: 4 }}>
			<Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
				Lista de compras
			</Typography>

			<div className="mb-4">
				{loadingRemove && (
					<Alert severity="info" variant="outlined">
						Removing list...
					</Alert>
				)}
				{errorRemove && (
					<Alert severity="error" variant="outlined">
						An error occurred when removing the list!
					</Alert>
				)}
				{successRemove && (
					<Alert severity="success" variant="outlined">
						Successfully removed the list!
					</Alert>
				)}
			</div>

			{lists.map((list) => (
				<Card key={list.id} createdAt={formatDate(list.createdAt)}>
					<IconButton
						color="info"
						disabled={loadingRemove}
						onClick={() => navigate(`lists/${list.id}`)}
					>
						<EditIcon />
					</IconButton>
					<IconButton color="warning" onClick={() => handleDelete(list)}>
						<DeleteIcon />
					</IconButton>
				</Card>
			))}
		</Container>
	)
}

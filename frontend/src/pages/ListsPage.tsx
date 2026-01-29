import { useNavigate } from 'react-router-dom'
import { Card } from '../components/Card'
import { useLists } from '../hooks/useLists'
import { formatDate } from '../utils/common'
import { Container, IconButton, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export function ListsPage() {
	const { lists, loading, error } = useLists()
	const navigate = useNavigate()

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error}</p>

	return (
		<Container maxWidth="xs" sx={{ mt: 4 }}>
			<Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
				Lista de compras
			</Typography>

			{lists.map((list) => (
				<Card key={list.id} createdAt={formatDate(list.createdAt)}>
					<IconButton color="info" onClick={() => navigate(`lists/${list.id}`)}>
						<EditIcon />
					</IconButton>
					<IconButton color="warning" onClick={() => console.log('delete')}>
						<DeleteIcon />
					</IconButton>
				</Card>
			))}
		</Container>
	)
}

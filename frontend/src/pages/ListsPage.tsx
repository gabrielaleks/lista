import { useNavigate } from 'react-router-dom'
import { Card } from '../components/Card'
import { useLists } from '../hooks/useLists'
import { formatDate } from '../utils/common'
import { Button, Container, Typography } from '@mui/material'

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
					<Button
						variant="outlined"
						onClick={() => navigate(`lists/${list.id}`)}
					>
						✏️ Edit
					</Button>
				</Card>
			))}
		</Container>
	)
}

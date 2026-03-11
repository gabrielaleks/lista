import {
	Box,
	Card,
	CardContent,
	Checkbox,
	FormControl,
	FormControlLabel,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material'
import Trash from '../assets/trash.svg?react'
import type { ListRow } from '../utils/datagrid'

interface MobileItemCardProps {
	row: ListRow
	onUpdate: (row: ListRow) => void
	onDelete: (id: string) => void
}

function MobileItemCard({ row, onUpdate, onDelete }: MobileItemCardProps) {
	const isNameValid = row.name && row.name.trim() !== ''
	const isQuantityValid =
		!isNaN(parseFloat(row.quantityX as string)) &&
		parseFloat(row.quantityX as string) > 0
	const isPriceValid =
		!isNaN(parseFloat(row.xPrice)) && parseFloat(row.xPrice) > 0

	return (
		<Card sx={{ mb: 1.5, border: '1px solid', borderColor: 'divider' }}>
			<CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
					<TextField
						label="Name"
						value={row.name}
						onChange={(e) => onUpdate({ ...row, name: e.target.value })}
						size="small"
						fullWidth
						error={!isNameValid}
					/>
					<Box sx={{ display: 'flex', gap: 1 }}>
						<FormControl size="small" sx={{ minWidth: 85 }}>
							<InputLabel>Type</InputLabel>
							<Select
								value={row.itemType}
								label="Type"
								onChange={(e) =>
									onUpdate({
										...row,
										itemType: e.target.value as 'UNIT' | 'KG',
									})
								}
							>
								<MenuItem value="UNIT">UNIT</MenuItem>
								<MenuItem value="KG">KG</MenuItem>
							</Select>
						</FormControl>
						<TextField
							label={row.itemType === 'UNIT' ? 'Units' : 'kg'}
							value={row.quantityX}
							onChange={(e) => onUpdate({ ...row, quantityX: e.target.value })}
							size="small"
							type="number"
							sx={{ flex: 1 }}
							error={!isQuantityValid}
						/>
						<TextField
							label={row.itemType === 'UNIT' ? 'Price/unit' : 'Price/kg'}
							value={row.xPrice}
							onChange={(e) => onUpdate({ ...row, xPrice: e.target.value })}
							size="small"
							type="number"
							sx={{ flex: 1 }}
							error={!isPriceValid}
						/>
					</Box>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<FormControlLabel
							control={
								<Checkbox
									checked={row.wasBought}
									onChange={(e) =>
										onUpdate({ ...row, wasBought: e.target.checked })
									}
									size="small"
								/>
							}
							label="Bought"
						/>
						<IconButton size="small" onClick={() => onDelete(row.id)}>
							<Trash width={24} height={24} />
						</IconButton>
					</Box>
				</Box>
			</CardContent>
		</Card>
	)
}

interface MobileItemListProps {
	rows: ListRow[]
	onRowUpdate: (row: ListRow) => void
	onDeleteRow: (id: string) => void
}

export function MobileItemList({
	rows,
	onRowUpdate,
	onDeleteRow,
}: MobileItemListProps) {
	return (
		<Box>
			{rows.map((row) => (
				<MobileItemCard
					key={row.id}
					row={row}
					onUpdate={onRowUpdate}
					onDelete={onDeleteRow}
				/>
			))}
		</Box>
	)
}

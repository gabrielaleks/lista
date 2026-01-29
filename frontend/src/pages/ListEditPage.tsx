import { Link, useParams } from 'react-router-dom'
import { useList } from '../hooks/useList'
import {
	DataGrid,
	type GridColDef,
	type GridRowSelectionModel,
} from '@mui/x-data-grid'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { formatDate } from '../utils/common'
import React from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

type Row = {
	id: string
	name: string
	itemType: 'UNIT' | 'KG'
	quantityX: number | string
	xPrice: string
	wasBought: boolean
}

const currencyFormatter = new Intl.NumberFormat('CH', {
	style: 'decimal',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

const validateName = (value: string) => {
	return value && value.trim() !== ''
}

const validateQuantity = (value: number | string) => {
	const numValue = parseFloat(value as string)
	return !isNaN(numValue) && numValue > 0
}

const validatePrice = (value: string) => {
	const numValue = parseFloat(value)
	return !isNaN(numValue) && numValue > 0
}

const columns: GridColDef<Row>[] = [
	{
		field: 'name',
		headerName: 'Name',
		flex: 1,
		minWidth: 10,
		editable: true,
		type: 'string',
		cellClassName: (params) => {
			return validateName(params.value) ? '' : 'cell-error'
		},
	},
	{
		field: 'itemType',
		headerName: 'Item type',
		width: 100,
		editable: true,
		type: 'singleSelect',
		valueOptions: ['UNIT', 'KG'],
	},
	{
		field: 'quantityX',
		headerName: 'Quantity',
		width: 100,
		editable: true,
		type: 'number',
		renderCell: (params) => {
			let unityForm = 'unity'
			if (params.row.itemType === 'UNIT' && Number(params.row.quantityX) > 1) {
				unityForm = 'unities'
			}
			const suffix = params.row.itemType === 'UNIT' ? unityForm : ' kg'
			return `${params.value} ${suffix}`
		},
		cellClassName: (params) => {
			return validateQuantity(params.value) ? '' : 'cell-error'
		},
	},
	{
		field: 'xPrice',
		headerName: 'Price',
		width: 100,
		editable: true,
		type: 'number',
		valueFormatter: (value) => {
			return currencyFormatter.format(value)
		},
		renderCell: (params) => {
			const suffix = params.row.itemType === 'UNIT' ? '/ unity' : '/ kg'
			return `${params.value} ${suffix}`
		},
		cellClassName: (params) => {
			return validatePrice(params.value) ? '' : 'cell-error'
		},
	},
	{
		field: 'wasBought',
		headerName: 'Was bought?',
		width: 100,
		editable: true,
		type: 'boolean',
	},
]

export function ListEditPage() {
	const { id } = useParams<{ id: string }>()
	const { list, loading, error } = useList(id)
	const [gridRows, setGridRows] = React.useState<Row[]>([])
	const [selectedRows, setSelectedRows] =
		React.useState<GridRowSelectionModel>()

	React.useEffect(() => {
		if (list?.items) {
			const rows: Row[] = list.items?.map((item) => ({
				id: item.id,
				name: item.name,
				itemType: item.itemType,
				quantityX:
					item.itemType == 'UNIT' ? item.totalUnities : item.totalWeight,
				xPrice: item.itemType == 'UNIT' ? item.unitPrice : item.kgPrice,
				wasBought: item.wasBought,
			}))
			setGridRows(rows)
		}
	}, [list])

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error}</p>
	if (!list) return <p>List not found</p>

	const isDeleteButtonDisabled = !selectedRows || selectedRows.ids.size === 0

	const handleDelete = () => {
		if (!selectedRows) return

		setGridRows(gridRows.filter((row) => !selectedRows.ids.has(row.id)))
	}

	const handleAddRow = () => {
		const newRow: Row = {
			id: crypto.randomUUID(),
			name: '',
			itemType: 'UNIT',
			quantityX: 0,
			xPrice: '0.00',
			wasBought: false,
		}

		setGridRows((prevRows) => [...prevRows, newRow])
	}

	const processRowUpdate = (newRow: Row) => {
		console.log(newRow.name)

		setGridRows((prevRows) =>
			prevRows.map((row) => (row.id === newRow.id ? newRow : row)),
		)
		return newRow
	}

	return (
		<div style={{ padding: '2rem' }}>
			<Box sx={{ maxWidth: 700, mx: 'auto', width: '100%' }}>
				<Typography
					variant="h4"
					className="flex justify-center"
					fontWeight="bold"
				>
					{formatDate(list.createdAt)}
				</Typography>
				<div className="flex justify-between mb-3">
					<Link to="/">
						<Button variant="outlined">Return</Button>
					</Link>
					<Button
						disabled={isDeleteButtonDisabled}
						variant="outlined"
						onClick={handleDelete}
					>
						Delete
					</Button>
				</div>
				<DataGrid
					rows={gridRows}
					columns={columns}
					processRowUpdate={processRowUpdate}
					pageSizeOptions={[5]}
					checkboxSelection
					disableRowSelectionExcludeModel
					disableRowSelectionOnClick
					onRowSelectionModelChange={(selected) => {
						setSelectedRows(selected)
					}}
					sx={{
						'& .cell-error': {
							backgroundColor: '#ffebee',
							color: '#c62828',
							border: '2px solid #d32f2f',
							boxSizing: 'border-box',
						},
					}}
				/>
				<IconButton color="primary" onClick={handleAddRow}>
					<AddCircleOutlineIcon />
				</IconButton>
			</Box>
		</div>
	)
}

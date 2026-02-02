import { Link } from 'react-router-dom'
import {
	DataGrid,
	type GridColDef,
	type GridRowSelectionModel,
} from '@mui/x-data-grid'
import { Box, Button, IconButton, Typography } from '@mui/material'
import React from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import type { List } from '../types/list'
import { ItemType } from '../types/item'
import Alert from '@mui/material/Alert'
import { useCreateList } from '../hooks/useCreateList'
import hash from 'object-hash'
import {
	useConfirmIfNeeded,
	useUnsavedChangesWarning,
} from '../hooks/useUnsavedChangesWarning'

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
		headerAlign: 'center',
		align: 'center',
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
		headerAlign: 'center',
		align: 'center',
		width: 100,
		editable: true,
		type: 'singleSelect',
		valueOptions: ['UNIT', 'KG'],
	},
	{
		field: 'quantityX',
		headerName: 'Quantity',
		headerAlign: 'center',
		align: 'center',
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
		headerAlign: 'center',
		align: 'center',
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
		headerAlign: 'center',
		align: 'center',
		width: 130,
		editable: true,
		type: 'boolean',
	},
]

export function NewListPage() {
	const { create, loadingCreate, errorCreate } = useCreateList()
	const [successCreate, setSuccessCreate] = React.useState(false)
	const [gridRows, setGridRows] = React.useState<Row[]>([])
	const [selectedRows, setSelectedRows] =
		React.useState<GridRowSelectionModel>()
	const [currentHash, setCurrentHash] = React.useState<string | null>(null)
	const [savedHash, setSavedHash] = React.useState<string | null>(null)

	const hasUnsavedChanges = currentHash !== savedHash ? true : false
	useUnsavedChangesWarning(hasUnsavedChanges)
	const confirmNavigation = useConfirmIfNeeded(hasUnsavedChanges)

	const setList = (list: List) => {
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
	}

	const getTotalBoughtPrice = () => {
		return gridRows
			.filter((row) => row.wasBought)
			.reduce((total, row) => {
				const price = parseFloat(row.xPrice)
				const quantity = parseFloat(row.quantityX as string)
				if (!isNaN(price) && !isNaN(quantity)) {
					return Math.round((total + price * quantity) * 100) / 100
				}
				return total
			}, 0)
	}

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
		setGridRows((prevRows) =>
			prevRows.map((row) => (row.id === newRow.id ? newRow : row)),
		)
		return newRow
	}

	const canonicalizeRows = (rows: Row[]) =>
		[...rows]
			.map((r) => ({
				name: r.name.trim(),
				itemType: r.itemType,
				quantityX: Number(r.quantityX),
				xPrice: Number(r.xPrice),
				wasBought: r.wasBought,
			}))
			.sort((a, b) => a.name.localeCompare(b.name))

	React.useEffect(() => {
		if (gridRows) {
			const canonicalizedRows = canonicalizeRows(gridRows)
			const newHash = hash(canonicalizedRows)
			setCurrentHash(newHash)
			setSavedHash((prev) => (prev === null ? newHash : prev))
		}
	}, [gridRows])

	const handleListSave = async () => {
		const updatedList: List = {
			id: crypto.randomUUID(),
			createdAt: new Date().toDateString(),
			updatedAt: new Date().toDateString(),
			items: gridRows.map((item) => {
				switch (item.itemType) {
					case ItemType.UNIT:
						return {
							id: item.id,
							name: item.name,
							itemType: ItemType.UNIT,
							wasBought: item.wasBought,
							totalUnities: Number(item.quantityX),
							unitPrice: item.xPrice,
						}
					case ItemType.KG:
						return {
							id: item.id,
							name: item.name,
							itemType: ItemType.KG,
							wasBought: item.wasBought,
							totalWeight: item.quantityX.toString(),
							kgPrice: item.xPrice,
						}
					default:
						throw new Error(`Invalid item type: ${item.itemType}`)
				}
			}),
		}

		const result = await create(updatedList)
		if (result) {
			setList(result)
			const canonicalizedRows = canonicalizeRows(gridRows)
			setSavedHash(hash(canonicalizedRows))
			setSuccessCreate(true)
			setTimeout(() => setSuccessCreate(false), 2000)
		}
	}

	return (
		<div style={{ padding: '2rem' }}>
			<Box sx={{ maxWidth: 700, mx: 'auto', width: '100%' }}>
				<Typography
					variant="h4"
					className="flex justify-center"
					fontWeight="bold"
				>
					Create new list
				</Typography>
				<div className="flex justify-between my-3">
					<Link
						to="/"
						onClick={(e) => {
							if (!confirmNavigation()) {
								e.preventDefault()
							}
						}}
					>
						<Button variant="outlined">Return</Button>
					</Link>
					{loadingCreate && (
						<Alert severity="info" variant="outlined">
							Saving list...
						</Alert>
					)}
					{errorCreate && (
						<Alert severity="error" variant="outlined">
							An error occurred when saving the list!
						</Alert>
					)}
					{successCreate && (
						<Alert severity="success" variant="outlined">
							List saved!
						</Alert>
					)}
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
							backgroundColor: '#2f3142',
							border: '2px solid #bd93f9',
							boxSizing: 'border-box',
						},
						'& .MuiDataGrid-columnHeaderTitle': {
							fontWeight: 'bold',
						},
					}}
				/>
				<div className="flex justify-between">
					<IconButton color="primary" onClick={handleAddRow}>
						<AddCircleOutlineIcon />
					</IconButton>
					<Typography variant="h6" className="flex items-center">
						Total price of bought items: {getTotalBoughtPrice()}
					</Typography>
					<IconButton
						disabled={loadingCreate}
						color="primary"
						onClick={handleListSave}
					>
						<DriveFolderUploadIcon />
					</IconButton>
				</div>
			</Box>
		</div>
	)
}

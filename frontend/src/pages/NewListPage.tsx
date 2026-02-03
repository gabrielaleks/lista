import { Link, useNavigate } from 'react-router-dom'
import { DataGrid, type GridRowSelectionModel } from '@mui/x-data-grid'
import { Box, Button, IconButton, Typography } from '@mui/material'
import React from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import type { List } from '../types/list'
import { ItemType } from '../types/item'
import Alert from '@mui/material/Alert'
import { useCreateList } from '../hooks/useCreateList'
import hash from 'object-hash'
import {
	useConfirmIfNeeded,
	useUnsavedChangesWarning,
} from '../hooks/useUnsavedChangesWarning'
import { listColumns, type ListRow } from '../utils/datagrid'
import BackArrow from '../assets/back-arrow.svg?react'
import Save from '../assets/save.svg?react'
import { v4 as uuidv4 } from 'uuid'

export function NewListPage() {
	const { create, loadingCreate, errorCreate } = useCreateList()
	const [successCreate, setSuccessCreate] = React.useState(false)
	const [gridRows, setGridRows] = React.useState<ListRow[]>([])
	const [selectedRows, setSelectedRows] =
		React.useState<GridRowSelectionModel>()
	const [currentHash, setCurrentHash] = React.useState<string | null>(null)
	const [savedHash, setSavedHash] = React.useState<string | null>(null)
	const navigate = useNavigate()

	const hasUnsavedChanges = currentHash !== savedHash ? true : false
	useUnsavedChangesWarning(hasUnsavedChanges)
	const confirmNavigation = useConfirmIfNeeded(hasUnsavedChanges)

	const setList = (list: List) => {
		if (list?.items) {
			const rows: ListRow[] = list.items?.map((item) => ({
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
		const newRow: ListRow = {
			id: uuidv4(),
			name: '',
			itemType: 'UNIT',
			quantityX: 0,
			xPrice: '0.00',
			wasBought: false,
		}

		setGridRows((prevRows) => [...prevRows, newRow])
	}

	const processRowUpdate = (newRow: ListRow) => {
		setGridRows((prevRows) =>
			prevRows.map((row) => (row.id === newRow.id ? newRow : row)),
		)
		return newRow
	}

	const canonicalizeRows = (rows: ListRow[]) =>
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
		const createdList: List = {
			id: uuidv4(),
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

		const result = await create(createdList)
		if (result) {
			setList(result)
			const canonicalizedRows = canonicalizeRows(gridRows)
			setSavedHash(hash(canonicalizedRows))
			setSuccessCreate(true)
			setTimeout(() => setSuccessCreate(false), 2000)
			navigate(`/lists/${result.id}`)
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
						<IconButton className="hover:scale-115" size="small">
							<BackArrow width={48} height={48} />
						</IconButton>
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
					columns={listColumns}
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
						size="small"
					>
						<Save
							width={36}
							height={36}
							className="duration-300 hover:scale-125"
						/>
					</IconButton>
				</div>
			</Box>
		</div>
	)
}

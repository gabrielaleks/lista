import { Link, useParams } from 'react-router-dom'
import { useList } from '../hooks/useList'
import { DataGrid, type GridRowSelectionModel } from '@mui/x-data-grid'
import { Box, IconButton, Typography } from '@mui/material'
import { formatDate } from '../utils/common'
import React from 'react'
import type { List } from '../types/list'
import { ItemType } from '../types/item'
import { useUpdateList } from '../hooks/useUpdateList'
import Alert from '@mui/material/Alert'
import hash from 'object-hash'
import {
	useConfirmIfNeeded,
	useUnsavedChangesWarning,
} from '../hooks/useUnsavedChangesWarning'
import { listColumns, type ListRow } from '../utils/datagrid'
import BackArrow from '../assets/back-arrow.svg?react'
import Save from '../assets/save.svg?react'
import Trash from '../assets/trash.svg?react'
import Add from '../assets/add.svg?react'
import { v4 as uuidv4 } from 'uuid'

export function ListEditPage() {
	const { id } = useParams<{ id: string }>()
	const { list, loading, error } = useList(id)
	const [showLoading, setShowLoading] = React.useState(false)
	const { update, loadingUpdate, errorUpdate } = useUpdateList()
	const [successUpdate, setSuccessUpdate] = React.useState(false)
	const [gridRows, setGridRows] = React.useState<ListRow[]>([])
	const [selectedRows, setSelectedRows] =
		React.useState<GridRowSelectionModel>()
	const shouldShowEmpty = !loading && !showLoading && list === null
	const [currentHash, setCurrentHash] = React.useState<string | null>(null)
	const [savedHash, setSavedHash] = React.useState<string | null>(null)

	const hasUnsavedChanges = currentHash !== savedHash ? true : false
	useUnsavedChangesWarning(hasUnsavedChanges)
	const confirmNavigation = useConfirmIfNeeded(hasUnsavedChanges)

	React.useEffect(() => {
		if (!loading) return

		const timeout = setTimeout(() => {
			setShowLoading(true)
		}, 200)

		return () => {
			clearTimeout(timeout)
			setShowLoading(false)
		}
	}, [loading])

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

	React.useEffect(() => {
		if (list) {
			setList(list)
		}
	}, [list])

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
		if (gridRows.length === 0 && currentHash === null) return
		const canonicalizedRows = canonicalizeRows(gridRows)
		const newHash = hash(canonicalizedRows)
		setCurrentHash(newHash)
		setSavedHash((prev) => (prev === null ? newHash : prev))
	}, [gridRows, currentHash])

	const handleListUpdate = async () => {
		const updatedList: List = {
			...list!,
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

		const result = await update(updatedList)
		if (result) {
			setList(result)
			const canonicalizedRows = canonicalizeRows(gridRows)
			setSavedHash(hash(canonicalizedRows))
			setSuccessUpdate(true)
			setTimeout(() => setSuccessUpdate(false), 2000)
		}
	}

	const processRowUpdate = (newRow: ListRow) => {
		setGridRows((prevRows) =>
			prevRows.map((row) => (row.id === newRow.id ? newRow : row)),
		)
		return newRow
	}

	return (
		<div style={{ padding: '2rem' }}>
			{showLoading ? (
				<Alert severity="info" variant="outlined">
					Loading items...
				</Alert>
			) : list ? (
				<Box sx={{ maxWidth: 700, mx: 'auto', width: '100%' }}>
					<Typography
						variant="h4"
						className="flex justify-center"
						fontWeight="bold"
					>
						{formatDate(list.createdAt)}
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
						{loadingUpdate && (
							<Alert severity="info" variant="outlined">
								Updating list...
							</Alert>
						)}
						{errorUpdate && (
							<Alert severity="error" variant="outlined">
								An error occurred when updating the list!
							</Alert>
						)}
						{successUpdate && (
							<Alert severity="success" variant="outlined">
								List updated!
							</Alert>
						)}
						<IconButton
							disabled={isDeleteButtonDisabled}
							size="small"
							onClick={handleDelete}
						>
							<Trash
								width={48}
								height={48}
								className="duration-300 hover:scale-115"
							/>
						</IconButton>
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
					<div className="flex justify-between mt-1">
						<IconButton size="small" color="primary" onClick={handleAddRow}>
							<Add
								width={36}
								height={36}
								className="duration-300 hover:scale-125"
							/>
						</IconButton>
						<Typography variant="h6" className="flex items-center">
							Total price of bought items: {getTotalBoughtPrice()}
						</Typography>
						<IconButton
							size="small"
							disabled={loadingUpdate}
							onClick={handleListUpdate}
						>
							<Save
								width={36}
								height={36}
								className="duration-300 hover:scale-125"
							/>
						</IconButton>
					</div>
				</Box>
			) : shouldShowEmpty ? (
				<Alert severity="error" variant="outlined">
					{error}
				</Alert>
			) : null}
		</div>
	)
}

import { Tooltip } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import Quantity from '../assets/quantity.svg?react'
import PriceBag from '../assets/price-bag.svg?react'
import ShoppingCar from '../assets/shopping-car.svg?react'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

export type ListRow = {
	id: string
	name: string
	itemType: 'UNIT' | 'KG'
	quantityX: number | string
	xPrice: string
	wasBought: boolean
}

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

const currencyFormatter = new Intl.NumberFormat('CH', {
	style: 'decimal',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

export const listColumns: GridColDef<ListRow>[] = [
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
		renderHeader: () => (
			<Tooltip title="Quantity">
				<Quantity width={48} height={48} />
			</Tooltip>
		),
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
		renderHeader: () => (
			<Tooltip title="Price">
				<PriceBag width={48} height={48} />
			</Tooltip>
		),
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
		renderHeader: () => (
			<Tooltip title="Was bought?">
				<div className="flex items-center justify-center h-full w-full">
					<ShoppingCar width={48} height={48} />
					<QuestionMarkIcon sx={{ fontSize: 23, ml: '-5px' }} />
				</div>
			</Tooltip>
		),
		headerName: 'Was bought?',
		headerAlign: 'center',
		align: 'center',
		width: 130,
		editable: true,
		type: 'boolean',
	},
]

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ListsPage } from './pages/ListsPage'
import { ListEditPage } from './pages/ListEditPage'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme'
import { NewListPage } from './pages/NewListPage'

export function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<ListsPage />}></Route>
					<Route path="/lists/:id" element={<ListEditPage />}></Route>
					<Route path="/lists/new" element={<NewListPage />}></Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	)
}

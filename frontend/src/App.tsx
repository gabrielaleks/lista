import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ListsPage } from './pages/ListsPage'
import { ListPage } from './pages/ListPage'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme'

export function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<ListsPage />}></Route>
					<Route path="/lists/:id" element={<ListPage />}></Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	)
}

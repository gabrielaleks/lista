import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ListsPage } from './pages/ListsPage'
import { ListEditPage } from './pages/ListEditPage'

export function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<ListsPage />}></Route>
				<Route path="/lists/:id" element={<ListEditPage />}></Route>
			</Routes>
		</BrowserRouter>
	)
}

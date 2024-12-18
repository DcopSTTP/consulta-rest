import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Pesquisa from '../Pages/Pesquisa/index.jsx'
import Protocolo from '../Pages/Protocolo/index.jsx'

export default function AppRoutes() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Pesquisa />} />

                <Route path="/protocolo" element={
                    <Protocolo />} />

            </Routes>
        </BrowserRouter>
    )
}
import { BrowserRouter, Route, Routes } from "react-router-dom";


export default function App() {
    return (
        <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
            <Routes>
                <Route path="/coisa" element={<div>coisa</div>} />
            </Routes>
        </BrowserRouter>
    )
}

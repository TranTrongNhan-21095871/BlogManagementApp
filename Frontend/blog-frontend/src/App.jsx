import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <header className="flex items-center justify-between w-full max-w-4xl p-4 bg-white shadow-md">
          <img src={viteLogo} className="h-8" alt="Vite logo" />
          <img src={reactLogo} className="h-8" alt="React logo" />
        </header>
        <main className="flex flex-col items-center mt-10">
          <h1 className="text-2xl font-bold mb-4">Welcome to Vite + React</h1>
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Count is: {count}
          </button>
        </main>
      </div>
      <footer className="w-full text-center p-4 bg-gray-200 mt-10">
        <p className="text-sm">Made with ❤️ using Vite and React</p>
      </footer>
      <div className="min-h-screen bg-white text-black p-10">
  <h1 className="text-4xl font-bold text-blue-600">Hello Tailwind</h1>
</div>
      <div className="min-h-screen bg-gray-100 text-gray-800 p-10">
        <h1 className="text-4xl font-bold text-blue-600">Hello Tailwind</h1>
        <p className="mt-4 text-lg">This is a simple example of using Tailwind CSS with React.</p>
      </div>
    </>
  )
}

export default App

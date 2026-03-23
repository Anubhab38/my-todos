import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { SignedIn, SignedOut, SignIn, UserButton, useUser } from '@clerk/clerk-react'

function App() {
  const [task, setTask] = useState("")
  const [todo, setTodo] = useState([])
  //const [idcount, setIdCount] = useState(1)
  const { user } = useUser()

  // useEffect(() => {
  //   axios.get("/todos").then((res) => {
  //     setTodo(res.data)
  //   })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }, [])

  useEffect(() => {
    if (!user) return

    axios.get(`${import.meta.env.VITE_API_URL}/todos/${user.id}`)
      .then((res) => {
        setTodo(res.data)
      })
      .catch((err) => {
        console.log(err)
      })

  }, [user])


  // const addButton = () => { //imp here old add button
  //   if (task.trim() === "") {
  //     return
  //   }
  //   else {
  //     setTodo([...todo, {id: idcount, tha_task: task, task_no:1}])
  //     setIdCount(idcount+1)

  //     setTask("")
  //   }
  // }

  const addButton = async () => {
    if(!user) return 
    if (task.trim() === "") return

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/add`, {
        text: task,
        userId: user.id
      })
      setTask("")
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/todos/${user.id}`)
      setTodo(res.data)
    }
    catch (err) {
      console.log(err)
    }
  }

  // const delButton = (deleteIdCount) => { *OLD DELETE BUTTON NO DB*
  //   let newTodo = [];
  //   for (let i = 0; i < todo.length; i++) {
  //     if (todo[i]._id != deleteIdCount) {
  //       newTodo.push(todo[i]);
  //     }
  //   }
  //   setTodo(newTodo)
  // }

  const delButton = async (id) => {
    if(!user) return 
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/delete/${id}`)
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/todos/${user.id}`)
      setTodo(res.data)
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-black">
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <motion.div
          className="min-h-screen bg-black"
          initial={{ opacity: 0.2, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className='flex justify-between items-center p-3 bg-violet-950 sticky top-0'>
            <h1 className='text-white font-extrabold text-3xl'>
              MyTODOS
            </h1>

            <UserButton />
          </div>
          <div>
            <div className="w-full flex justify-center items-center gap-4 mt-10">
              <input
                value={task}
                onChange={(e) => {
                  setTask(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addButton();
                  }
                }}
                type="text"
                placeholder="Enter your task"
                className="px-4 py-2 rounded-md mr-2 bg-slate-600 font-semibold text-white border-2 border-black focus:border-violet-700 focus:ring-4 focus:ring-violet-500 shadow-md outline-none
                    w-200"/>
              <button className='bg-red-600 hover:bg-red-700 transition-all duration-300 w-20 p-2 rounded-md text-white font-bold' onClick={addButton}>Add</button>
            </div>
          </div>
          <h2 className='underline font-bold text-xl ml-20 mt-10 text-yellow-300'>*My Tasks* : </h2>


          <div className='p-5 text-white grid gap-5 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4  max-w-7xl mx-auto '>
            <AnimatePresence>
              {todo.map((items) => {
                return (
                  <motion.div
                    key={items._id}
                    className="bg-gray-800 p-4 rounded-xl text-white shadow-md flex flex-col justify-between h-40 hover:scale-105 transition-transform duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      {items.text}
                    </div>

                    <div className="flex gap-2 mt-4">
                      {/* <button className="bg-blue-500 px-2 py-1 rounded text-white font-semibold hover:bg-blue-800 transition">
                    Edit
                  </button> */}

                      <button
                        className="cursor-pointer bg-red-500 px-2 py-1 rounded text-white font-semibold hover:bg-red-800 transition"
                        onClick={() => {
                          delButton(items._id)
                        }}>
                        Delete
                      </button>

                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </SignedIn>
    </>
  )
}

export default App


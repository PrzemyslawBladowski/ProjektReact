//import './style.css'
'use client'
import {useState, useEffect} from 'react'
export default function ClientCard(){
    const [count, setCount] = useState(0)

    useEffect(() => {
        console.log('Component mounted')
    }, [])

    return (
        <div>
            <p>
                Count: {count}
            </p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <br></br>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
        </div>
        
    )
}
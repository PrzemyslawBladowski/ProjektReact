//import './style.css'
async function getData(){
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1')
    return res.json()
}

export default async function ServerCard() {
    const data = await getData()
    return (
        <div>
            <h2>{data.title}</h2>
            <p>{data.body}</p>
        </div>
    );
}
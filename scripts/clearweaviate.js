async function clearWeaviate() {
    const response = await fetch('https://magicktest.weaviate.network/v1/objects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    })

    console.log('response', response)

    const data = (await response.json()).objects

    console.log('data', data)

        data.forEach(object => {
            fetch(`https://magicktest.weaviate.network/v1/objects/Event/${object.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            })
        })
}

clearWeaviate();

console.log('done')
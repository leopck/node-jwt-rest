let accessToken = '';

// Function to login and store the access token
function login(username, password) {
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        accessToken = data.accessToken;
        document.getElementById('response').innerText = 'Logged in successfully!';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to fetch all products
function getProducts() {
    fetch('http://localhost:3000/products', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(products => {
        document.getElementById('response').innerHTML = `<pre>${JSON.stringify(products, null, 2)}</pre>`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to fetch a specific product by ID
function getProduct(id) {
    fetch(`http://localhost:3000/product/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(product => {
        document.getElementById('response').innerHTML = `<pre>${JSON.stringify(product, null, 2)}</pre>`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to add a new product
function addProduct() {
    const productName = prompt("Enter the name of the product to add:");
    if (!productName) return;

    fetch('http://localhost:3000/product', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: productName })
    })
    .then(response => {
        if (response.ok) return response.json();
        else throw new Error(`HTTP status ${response.status}`);
    })
    .then(product => {
        document.getElementById('response').innerHTML = `<pre>${JSON.stringify(product, null, 2)}</pre>`;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('response').innerText = error.message;
    });
}


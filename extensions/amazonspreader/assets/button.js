
  window.addEventListener('DOMContentLoaded', async () => {
    console.log("extesnion hase been loaded")
    const cartBtn = document.querySelector('.product-form__buttons');
    const PrictceBtn = document.querySelector('.product-form__quantity');
  
    // Hide default cart button
    if (cartBtn) {
      cartBtn.style.display = "none";
      PrictceBtn.style.display = "none";
    }
  
    // Create custom button
    const customBtn = document.createElement('button');
    customBtn.innerText = "View On Amazon";
    customBtn.classList.add('custom_btn');
  
    // Append custom button to form
    const buttonForm = document.querySelector('.form');
    buttonForm.appendChild(customBtn);
  
    // Remove default form submission
    if (buttonForm) {
      buttonForm.addEventListener('submit', (event) => {
        event.preventDefault();
      });
    }
  
    // Fetch product details using Shopify Ajax API
    const productHandle = getProductHandleFromUrl();
  
    if (productHandle) {
      const product = await fetchProductByHandleAjax(productHandle);
      console.log('Product Details:', product);
  
      customBtn.addEventListener('click', async (event) => {
        // Call the endpoint with the product ID
        event.preventDefault();
        const productId = product.id;
       
        const endpoint = `https://${Shopify.shop}/apps/proxy/getProduct/${productId}`;
        const response = await fetch(endpoint);
        const amazonProduct = await response.json();
        console.log('Amazon Product Details:', amazonProduct);
  
        // Redirect to href attribute of custom button
        window.location.href = amazonProduct.ProductLink;
  
        // Prevent default form submission
      });
    }
  
    // Function to retrieve product handle from URL
    function getProductHandleFromUrl() {
      const url = window.location.href;
      const parts = url.split('/');
      const productHandle = parts[parts.length - 1].replace('.html', ''); // Adjust based on your URL structure
      return productHandle;
    }
  
    // Function to fetch product details using Shopify Ajax API
    async function fetchProductByHandleAjax(productHandle) {
      const apiEndpoint = window.Shopify.routes.root + `products/${productHandle}.js`;
      const response = await fetch(apiEndpoint);
      const product = await response.json();
      console.log(product)
      return product;
    }
  });
  
 
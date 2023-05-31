import products from "../products.js";
import stockPrice from "../stock-price.js";

////////////////////////////////////////////////////////
// Mini router for the product single view
////////////////////////////////////////////////////////
// Prevent default and change url while keeping history
const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  event.stopPropagation();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const createRoutes = () => {
  let routes = {
    404: {
      template: "pages/404.html",
      title: "Not found",
      description: "Not found",
    },
    "/": {
      template: "pages/index.html",
      title: "Minutentag",
      description: "Drinks straight to you!",
    },
  };

  for (let i = 0; i < products.length; i++) {
    // Format brand name to avoid spaces
    let brand = products[i].brand.replace(/\s/g, "");
    routes[`/${products[i].id}-${brand}`] = {
      template: `pages/product-detail.html`,
      title: brand,
      description: "",
    };
  }
  return routes;
};

const routes = createRoutes();

const handleLocation = async () => {
  let path = window.location.pathname;
  if (path.length == 0) {
    path = "/";
  }

  const route = routes[path] || routes[404];
  const html = await fetch(route.template).then((data) => data.text());
  document.getElementById("app").innerHTML = html;
  document.title = route.title;
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", route.description);
  if (route == "/") {
    listProducts(products);
  }
  if (route != routes[404]) {
    let id = extractId(path);
    renderSingle(id);
  }
};

window.onpopstate = handleLocation;
window.route = route;

// Helper functions to provide dynamic content
const extractId = (path) => {
  const start = path.indexOf("/") + 1;
  const end = path.indexOf("-");
  if (start >= 0 && end >= 0) {
    return path.substring(start, end);
  } else {
    return null;
  }
};

const expandText = () => {
  let p = $(".desc-info");
  let readMore = $(".read-more");
  if (p.hasClass("expanded")) {
    p.removeClass("expanded");
    readMore.text("Read more");
  } else {
    p.addClass("expanded");
    readMore.text("Read less");
  }
};

////////////////////////////////////////////////////////
// Button animations
////////////////////////////////////////////////////////

$(".category-button").click(function () {
  $(".category-button").removeClass("category-button-selected");
  $(this).addClass("category-button-selected");
});

$(".option").click(function () {
  $(".option").removeClass("option-selected");
  $(this).addClass("option-selected");
});

////////////////////////////////////////////////////////
// Render a single item in the single item page
////////////////////////////////////////////////////////

const renderSingle = (id) => {
    for (let i = 0; i < products.length; i++) {
      let stockData = stockPrice[products[i].skus[0].code];
      if (products[i].id == id) {
        const container = $("#container");
  
        // Add image
        const img = $("<img>").addClass("item-img").attr("src", `/icons/${products[i].brand}.png`);
        $("#main-image").append(img);
  
        // Add description
        // Header with title and price
        const contHeader = $("<div>").addClass("container-header");
        const title = $("<h1>").text(products[i].brand);
        const price = $("<div>").addClass("detail-price").text(`$ ${(stockPrice[products[i].skus[0].code].price / 100).toFixed(2)}`);
  
        contHeader.append(title);
        contHeader.append(price);
  
        // Origin and stock
        const subData = $("<div>").addClass("sub-data").text(`Origin: ${products[i].origin} | Stock: ${stockData.stock}`);
  
        //Description
        const desc = $("<div>").addClass("description");
        const descTitle = $("<h3>").text("Description");
        const info = $("<p>").addClass("desc-info").text(products[i].information);
        const readMore = $("<p>").addClass("read-more").text("Read more");
        readMore.click(expandText);
        desc.append(descTitle);
        desc.append(info);
        desc.append(readMore);
  
        // Size
        const sizeContainer = $("<div>").addClass("size-container");
        const sizeTitle = $("<h3>").text("Size");
        const sizeOptions = $("<div>").addClass("size-options");
        for (let x = 0; x < products[i].skus.length; x++) {
          const option = $("<div>").addClass("option").attr("id", products[i].skus[x].code);
          if (x === 0) {
            option.addClass("option-selected");
          }
          option.text(products[i].skus[x].name);
          sizeOptions.append(option);
        }
        sizeContainer.append(sizeTitle);
        sizeContainer.append(sizeOptions);
  
        // Cart container
        const cartContainer = $("<div>").addClass("cart-container");
        const cartButton = $("<div>").addClass("deatil-cart-button").html(`<svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.4" y="0.4" width="53.2" height="53.2" rx="11.6" stroke="#FF9F24" stroke-width="0.8"/>
        <circle cx="27" cy="21" r="4.25" stroke="#FF9F24" stroke-width="1.5"/>
        <path d="M19.3062 24.5969C19.5095 22.9705 20.8921 21.75 22.5311 21.75H31.4689C33.1079 21.75 34.4905 22.9705 34.6938 24.5969L35.6938 32.5969C35.9362 34.5367 34.4237 36.25 32.4689 36.25H21.5311C19.5763 36.25 18.0638 34.5367 18.3062 32.5969L19.3062 24.5969Z" fill="white" stroke="#FF9F24" stroke-width="1.5"/>
        <circle cx="24.75" cy="25.75" r="0.75" fill="#FF9F24"/>
        <circle cx="28.75" cy="25.75" r="0.75" fill="#FF9F24"/>
        </svg>`);
        const addToCart = $("<button>").addClass("detail-add-button").text("Add to cart");
        cartContainer.append(cartButton);
        cartContainer.append(addToCart);
  
        // Add elements to container
        container.append(contHeader);
        container.append(subData);
        container.append(desc);
        container.append(sizeContainer);
        container.append(cartContainer);
  
        /// Logic for selecting size option
        let detailOptions = $(".option");
  
        // Add an event listener to each
        detailOptions.on("click", function () {
          // Remove background color from all
          detailOptions.removeClass("option-selected");
  
          // Set background color for the clicked button
          $(this).addClass("option-selected");
  
          // Set price according to the selected variety
          let selection = $(".option-selected")[0];
          for (let x = 0; x < products[i].skus.length; x++) {
            if (selection.id == products[i].skus[x].code) {
              price.text(`$ ${(stockPrice[products[i].skus[x].code].price / 100).toFixed(2)}`);
              subData.text(`Origin: ${products[i].origin} | Stock: ${stockPrice[products[i].skus[x].code].stock}`);
            }
          }
        });
  
        // Update stock every 5 seconds
        setInterval(() => {
          let selection = $(".option-selected")[0];
          const fetchData = () => {
            for (let x = 0; x < products[i].skus.length; x++) {
              if (selection.id == products[i].skus[x].code) {
                return stockPrice[products[i].skus[x].code];
              }
            }
          };
          stockData = fetchData();
          console.log("Updated stock");
          subData.text(`Origin: ${products[i].origin} | Stock: ${stockData.stock}`);
        }, 5000);
      }
    }
  };
  

////////////////////////////////////////////////////////
// List prouducts in index.html
////////////////////////////////////////////////////////

const listProducts = (products) => {
    const container = $("#products");
    for (let i = 0; i < products.length; i++) {
      let brand = products[i].brand.replace(/\s/g, "");
  
      const div = $("<div>").addClass("item");
  
      const imgContainer = $("<div>").addClass("img-container").attr("href", `/${products[i].id}-${brand}`);
      const img = $("<img>").attr("src", `.${products[i].image}`).attr("href", `/${products[i].id}-${brand}`);
      const itemTitle = $("<a>").addClass("item-title").attr("href", `/${products[i].id}-${brand}`).text(products[i].brand);
  
      const itemMenu = $("<div>").addClass("item-menu");
      const itemPrice = $("<div>").addClass("item-price");
      const addButton = $("<div>").addClass("add-button");
      const span1 = $("<span>");
      const span2 = $("<span>");
      addButton.append(span1, span2);
  
      const getPrice = async (sku) => {
        try {
          const response = await fetch(
            "http://127.0.0.1:3000/api/stockprice/" + sku
          );
          if (response.ok) {
            const data = await response.json();
            if (data.stock > 0) {
              return data.price;
            } else {
              return "No stock";
            }
          } else {
            return "Not found";
          }
        } catch (error) {
          console.log(error);
          return "No stock";
        }
      };
  
      let price = (stockPrice[products[i].skus[0].code].price / 100).toFixed(2);
      itemPrice.text("$ " + price);
  
      itemMenu.append(itemPrice, addButton);
      imgContainer.append(img);
      div.append(itemTitle, imgContainer, itemMenu);
      container.append(div);
    }
  };
  
  if (window.location.pathname == "/") {
    listProducts(products);
  }
// BurgerBar

const bar = document.querySelector(".fa-bars");
const cross = document.querySelector("#hdcross");
const headerbar = document.querySelector(".headerbar");

bar.addEventListener("click", () => {
  setTimeout(() => {
    cross.style.display = "block";
  });
  headerbar.style.right = "0%";
});

cross.addEventListener("click", () => {
  cross.style.display = "none";
  headerbar.style.right = "-100%";
});

// search

const product = [
  {
    id: 0,
    image: "../images/simit.png",
    title: "სიმითი",
    price: 1.4,
    type: "bulk",
  },
  {
    id: 1,
    image: "../images/cookie.png",
    title: "ქუქისი",
    price: 1.5,
    type: "bulk",
  },
  {
    id: 2,
    image: "../images/croissant.png",
    title: "კრუასანი",
    price: 2.5,
    type: "bulk",
  },
  {
    id: 3,
    image: "../images/bagguete.png",
    title: "ბაგეტი",
    price: 1.2,
    type: "bread",
  },
  {
    id: 4,
    image: "../images/bread.png",
    title: "ბატონი",
    price: 2.2,
    type: "bread",
  },
  {
    id: 5,
    image: "../images/burger-bread.png",
    title: "ბურგერის პური",
    price: 1.5,
    type: "bread",
  },
  {
    id: 6,
    image: "../images/simit.png",
    title: "სიმითი",
    price: 1.4,
    type: "bulk",
  },
  {
    id: 7,
    image: "../images/cookie.png",
    title: "ქუქისი",
    price: 1.4,
    type: "bulk",
  },
];

const categories = [
  ...new Set(
    product.map((item) => {
      return item;
    })
  ),
];

document.getElementById("searchBar").addEventListener("keyup", (e) => {
  const searchData = e.target.value.toLowerCase();
  const filterData = categories.filter((item) => {
    return item.title.toLocaleLowerCase().includes(searchData);
  });

  displayItem(filterData);
});

const displayItem = (items) => {
  document.getElementById("grid").innerHTML = items
    .map((item) => {
      var { image, title, price } = item;
      return `<div class='box'>
        <div class='img-box'>
            <img class='images' src=${image}></img>
            </div>
            <div class='bottom'>
                <p>${title}</p>
                <h2>₾ ${price}</h2>
                <button>კალათაში დამატება</button>
                </div>
                </div>
        
        `;
    })
    .join("");
};

displayItem(categories);

/// api request
document.getElementById("searchButton").addEventListener("click", () => {
  const searchData = document.getElementById("searchBar").value.toLowerCase();
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  const checkedTypes = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.id);

  let filteredItems;

  if (checkedTypes.length === 0) {
    filteredItems = product.filter((item) =>
      item.title.toLowerCase().includes(searchData)
    );
  } else {
    filteredItems = product.filter((item) => {
      return (
        item.title.toLowerCase().includes(searchData) &&
        checkedTypes.includes(item.type)
      );
    });
  }

  displayItem(filteredItems);
});

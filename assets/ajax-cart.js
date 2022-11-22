class Cart {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });
  
    async fetchAPI(api, formData) {
      const response = await fetch(`/cart/${api}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      return await response.json();
    }
  
    addItem(formData) {
      return this.fetchAPI("add.js", formData);
    }
  
    changeItem(formData) {
      return this.fetchAPI("change.js", formData);
    }
  
    async getCartDetails() {
      const response = await fetch(`/cart.js`);
      return response.json();
    }
  
    deleteItem(line) {
      this.changeItem({ line: line, quantity: 0 }).then((res) =>
        this.renderCartItems(res)
      );
    }
  
    incrementItem(line, quantity) {
      this.changeItem({ line: line, quantity: quantity + 1 }).then((res) =>
        this.renderCartItems(res)
      );
    }
  
    decrementItem(line, quantity) {
      this.changeItem({ line: line, quantity: quantity - 1 }).then((res) =>
        this.renderCartItems(res)
      );
    }
  
    // async getProduct(handle) {
    //   const response = await fetch(`/products/${handle}.js`);
    //   return response.json();
    // }
  
    async updateCart() {
      const cartDetails = await this.getCartDetails();
      this.renderCartItems(cartDetails);
    }
  
    closeModal() {
      const sideCart = document.querySelector(".ajax-cart");
      sideCart.classList.toggle("ajax-cart-active");
      let backgroundOverlay = document.querySelector(".background-overlay");
      backgroundOverlay.classList.toggle("background-overlay--show");
      document.body.removeAttribute("style");
    }
  
    renderCartItems(cartDetails) {
      if (cartDetails.item_count == 0) {
        let emptyContainer = document.querySelector(".cart-empty-container");
        emptyContainer.classList.add("cart-empty-container-active");
      }
  
      const cartItemsWrapper = document.querySelector(".cart-items");
      cartItemsWrapper.innerHTML = "";
  
      for (let i = 0; i < cartDetails.items.length; i++) {
        const template=`
        <div class="cart-item">
                  <div class="cart-item__img">
                      <img src="${cartDetails.items[i].image}" alt="">
                  </div>
                  <div class="cart-item__content">
                      <h4 class="cart-item__title">
                      ${
                        cartDetails.items[i].title
                      }
                      </h4>
                      <p class="cart-item__price">
                      ${this.formatter.format(
                        cartDetails.items[i].price / 100
                      )}
                      </p>
                      <p class="cart-item-cancel" data-line="${
                        i + 1
                      }">
                          remove
                      </p>
                  </div>
              </div>
        `
        cartItemsWrapper.insertAdjacentHTML("beforeend", template);
      }
  
      const sideCartTotalPrice = document.querySelector(
        ".side-cart__total-price"
      );
      sideCartTotalPrice.textContent = this.formatter.format(
        cartDetails.total_price / 100
      );
    }
  
    async toggleCart() {
      await this.updateCart();
      const sideCart = document.querySelector(".ajax-cart");
      sideCart.classList.toggle("ajax-cart-active");
      let backgroundOverlay = document.querySelector(".background-overlay");
      backgroundOverlay.classList.toggle("background-overlay--show");
      document.body.setAttribute("style", "overflow: hidden");
    }
  
    addToCart(variantId) {
      // const variantId = document.querySelector(".product-variant").dataset.id;
      const formData = {
        items: [
          {
            id: variantId,
            quantity: 1,
          },
        ],
      };
  
      this.addItem(formData).then(() => this.toggleCart());
      let emptyContainer = document.querySelector(".cart-empty-container");
      emptyContainer.classList.remove("cart-empty-container-active");
    }
    addToCartWithSellingPlan(variantId,planId) {
      // const variantId = document.querySelector(".product-variant").dataset.id;
      const formData = {
        items: [
          {
            id: variantId,
            quantity: 1,
            selling_plan:planId
          },
        ],
      };
  
      this.addItem(formData).then(() => this.toggleCart());
      let emptyContainer = document.querySelector(".cart-empty-container");
      emptyContainer.classList.remove("cart-empty-container-active");
    }
  
    // addCartItemCount() {
    //   this.getCartDetails().then((cartDetails) => {
    //     const headerCartLinks = document.querySelectorAll(".header-cart-link");
    //     headerCartLinks.forEach((link) => {
    //       link.innerHTML += " (" + cartDetails.item_count + ")";
    //     });
    //   });
    // }
  }
  
  const sideCart = new Cart();
  
  // add an item to cart

  let form = document.querySelector(".product-details");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    let selectVariantId = document.querySelector(
      ".variant-selection"
    ).value;
    sideCart.addToCart(selectVariantId);
  });
  
  ////////////////////////////////////////////////////////
  let itemsBox = document.querySelector(".cart-items");
  
  itemsBox.addEventListener("click", (e) => {
    // deleting an item
    if (e.target.classList.contains("cart-item-cancel")) {
      const line = Number(e.target.dataset.line);
      sideCart.deleteItem(line);
    }
  
    // incrementing an item
    if (e.target.classList.contains("increment-btn")) {
      const line = Number(e.target.dataset.line);
      const quantity = Number(e.target.previousElementSibling.textContent);
      sideCart.incrementItem(line, quantity);
    }
    //decrementing an item
    if (e.target.classList.contains("decrement-btn")) {
      const line = Number(e.target.dataset.line);
      const quantity = Number(e.target.nextElementSibling.textContent);
      sideCart.decrementItem(line, quantity);
    }
  });
  
  // showing ajax cart
  let iconCart = document.querySelector(".cart-icon");
  iconCart.addEventListener("click", () => {
    sideCart.toggleCart();
  });
  
  //hiding ajax cart
  let cancelBtn = document.querySelector(".cancel-btn");
  cancelBtn.addEventListener("click", (e) => {
    sideCart.closeModal();
  });
  

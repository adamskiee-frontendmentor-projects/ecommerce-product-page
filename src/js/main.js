class EcommerceProduct {
  constructor() {
    this.state = {
      orderQuantity: 0,
      productPrice: 125,
      images: [
        "./build/images/image-product-1.jpg",
        "./build/images/image-product-2.jpg",
        "./build/images/image-product-3.jpg",
        "./build/images/image-product-4.jpg",
      ],
      currentImageIndex: 0,
      currentActiveProductThumbnail: "1",
    };
    this.elements = {
      mobileMenu: document.getElementById("mobile-menu"),
      mobileMenuOpenBtn: document.getElementById("mobile-menu-open-btn"),
      mobileMenuCloseBtn: document.getElementById("mobile-menu-close-btn"),
      cartBtn: document.getElementById("cart-btn"),
      orderNum: document.getElementById("order-num"),
      orderAddBtn: document.getElementById("order-add-btn"),
      orderMinusBtn: document.getElementById("order-minus-btn"),
      cartForm: document.getElementById("cart-form"),
      nextImgBtn: document.getElementById("next-img-btn"),
      previousImgBtn: document.getElementById("previous-img-btn"),
      mainImg: document.getElementById("main-img"),
      desktopMainImg: document.getElementById("desktop-main-img"),
      mainImgBtn: document.getElementById("main-img-btn"),
      cartCount: document.getElementById("cart-count"),
      cartBody: document.getElementById("cart-body"),
      cartProducts: document.getElementById("cart-products"),
      cartDeleteBtn: document.getElementById("cart-delete-btn"),
      lightboxDialog: document.getElementById("lightbox-dialog"),
      lightBoxMainImg: document.getElementById("lightbox-main-img"),
      lightBoxNextImgBtn: document.getElementById("lightbox-next-img-btn"),
      lightBoxPreviousImgBtn: document.getElementById(
        "lightbox-previous-img-btn"
      ),
      lightBoxCloseBtn: document.getElementById("lightbox-close-btn"),
      mainImgContainer: document.querySelectorAll(".main-img-container"),
    };
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderUi();
  }
  bindEvents() {
    const eventBindings = [
      {
        key: "mobileMenuOpenBtn",
        event: "click",
        handler: () => {
          this.elements.mobileMenu.showModal();
          this.elements.mobileMenuOpenBtn.setAttribute("aria-expanded", "true");
          this.elements.mobileMenuCloseBtn.focus();
        },
      },
      {
        key: "mobileMenuCloseBtn",
        event: "click",
        handler: () => {
          this.elements.mobileMenu.close();
          this.elements.mobileMenuOpenBtn.setAttribute(
            "aria-expanded",
            "false"
          );
        },
      },
      {
        key: "cartBtn",
        event: "click",
        handler: (e) => {
          e.stopPropagation();
          this.toggleCart();
        },
      },
      {
        key: "orderAddBtn",
        event: "click",
        handler: () => {
          this.elements.orderNum.value++;
        },
      },
      {
        key: "orderMinusBtn",
        event: "click",
        handler: () => {
          if (this.elements.orderNum.value <= 0) return;
          this.elements.orderNum.value--;
        },
      },
      {
        key: "nextImgBtn",
        event: "click",
        handler: () => {
          this.mobileNextImg(this.elements.mainImg);
        },
      },
      {
        key: "lightBoxNextImgBtn",
        event: "click",
        handler: () => {
          this.nextImg(this.elements.lightBoxMainImg);
        },
      },
      {
        key: "lightBoxPreviousImgBtn",
        event: "click",
        handler: () => {
          this.previousImg(this.elements.lightBoxMainImg);
        },
      },
      {
        key: "previousImgBtn",
        event: "click",
        handler: () => {
          this.mobilePreviousImg(this.elements.mainImg);
        },
      },
      {
        key: "mainImgBtn",
        event: "click",
        handler: () => {
          this.elements.lightboxDialog.showModal();

          this.elements.lightBoxCloseBtn.focus();
          // Update the lightbox product images state
          this.activateProductImg(
            this.elements.lightboxDialog.querySelector(
              `.thumbnail-btn[data-product="${this.state.currentActiveProductThumbnail}"]`
            )
          );
        },
      },
      {
        key: "lightBoxCloseBtn",
        event: "click",
        handler: () => {
          this.elements.lightboxDialog.close();

          // Update the desktop product images state
          this.activateProductImg(
            document
              .querySelector(".desktop-image-container")
              .querySelector(
                `.thumbnail-btn[data-product="${this.state.currentActiveProductThumbnail}"]`
              )
          );
        },
      },
      {
        key: "cartProducts",
        event: "click",
        handler: (e) => {
          if (e.target.closest(".delete-btn")) {
            this.deleteProductContent();
          }
        },
      },
    ];

    eventBindings.forEach(({ key, event, handler }) => {
      const element = this.elements[key];
      if (element) element.addEventListener(event, handler);
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".cart-body") && !e.target.closest(".cart-btn")) {
        this.elements.cartBody.classList.add("hidden");
        this.elements.cartBody.setAttribute("aria-expanded", "false");
      }

      if (e.target.closest(".thumbnail-btn")) {
        let btn = e.target.closest(".thumbnail-btn");
        // Check if the clicked thumbnail is the same with previous thumbnail
        if (
          btn.getAttribute("data-product") ===
          this.state.currentActiveProductThumbnail
        )
          return;

        this.activateProductImg(btn);
      }
    });

    this.elements.cartForm.addEventListener("submit", (e) => {
      e.preventDefault(e);

      const data = Object.fromEntries(new FormData(e.target));
      if (Number(data["order-num"]) === 0) {
        return;
      }

      if (this.state.orderQuantity === 0) {
        // Add product order in the cart
        this.renderProductContent();
        this.addOrderQuantity(Number(data["order-num"]));
      } else {
        // Update quantity and total of existing product in the cart
        this.addOrderQuantity(Number(data["order-num"]));
      }
      this.elements.cartCount.textContent = this.state.orderQuantity;
      this.elements.cartForm.reset();
    });
  }

  renderUi() {
    // Set default cart message
    this.elements.cartProducts.innerHTML = `
        <span id="empty-card-msg" class="empty-card-msg" >Your cart is empty</span>
        `;

    // Set default active thumbnail
    this.activateThumbnail(
      document.querySelector(
        `.thumbnail-btn[data-product= "${this.state.currentActiveProductThumbnail}"]`
      )
    );
  }

  addOrderQuantity(quantity) {
    this.state.orderQuantity += quantity;
    document.getElementById("quantity").textContent = this.state.orderQuantity;
    this.addOrderTotal();
  }
  addOrderTotal() {
    document.getElementById("total").textContent = (
      this.state.orderQuantity * this.state.productPrice
    ).toFixed(2);
  }

  mobilePreviousImg(mainImg) {
    if (this.state.currentImageIndex === 0)
      this.state.currentImageIndex = this.state.images.length - 1;
    else this.state.currentImageIndex--;

    mainImg.setAttribute(
      "src",
      this.state.images[this.state.currentImageIndex]
    );
  }
  mobileNextImg(mainImg) {
    if (this.state.currentImageIndex === this.state.images.length - 1)
      this.state.currentImageIndex = 0;
    else this.state.currentImageIndex++;

    mainImg.setAttribute(
      "src",
      this.state.images[this.state.currentImageIndex]
    );
  }

  nextImg(mainImg) {
    // Check if the image index is last index
    if (this.state.currentImageIndex === this.state.images.length - 1)
      this.state.currentImageIndex = 0;
    else this.state.currentImageIndex++;

    this.activateProductImg(
      mainImg
        .closest(".desktop-image-container")
        .querySelector(
          `.thumbnail-btn[data-product="${this.state.currentImageIndex + 1}"]`
        )
    );
  }
  previousImg(mainImg) {
    // Check if the image index is last index
    if (this.state.currentImageIndex === 0)
      this.state.currentImageIndex = this.state.images.length - 1;
    else this.state.currentImageIndex--;

    this.activateProductImg(
      mainImg
        .closest(".desktop-image-container")
        .querySelector(
          `.thumbnail-btn[data-product="${this.state.currentImageIndex + 1}"]`
        )
    );
  }

  activateProductImg(btn) {
    if (!btn) return;
    let mainContainer = btn.parentElement;
    // Deactivate previous thumbnail
    this.deactivateThumbnail(
      mainContainer.querySelector(".thumbnail-btn-focus")
    );

    this.activateThumbnail(btn);

    // Change the image of the main image
    mainContainer
      .querySelector(".main-img")
      .setAttribute("src", this.state.images[this.state.currentImageIndex]);
  }

  activateThumbnail(btn) {
    if (!btn) return;
    btn.querySelector(".thumbnail-img").classList.add("thumbnail-focus");
    btn.classList.add("thumbnail-btn-focus");
    btn.setAttribute("tabindex", "-1");
    // Change the states
    this.state.currentActiveProductThumbnail = btn.getAttribute("data-product");
    this.state.currentImageIndex =
      Number(this.state.currentActiveProductThumbnail) - 1;
  }

  deactivateThumbnail(btn) {
    if (!btn) return;
    btn.classList.remove("thumbnail-btn-focus");
    btn.setAttribute("tabindex", "0");
    btn.querySelector(".thumbnail-img").classList.remove("thumbnail-focus");
  }

  renderProductContent() {
    this.elements.cartProducts.innerHTML = `
        <div class="product-content">
            <img src="./build/images/image-product-1-thumbnail.jpg" class="thumbnail" height="50" width="50" alt="">
            <h3>Fall Limited Edition Sneakers</h3>
            <button class="delete-btn" id="cart-delete-btn" aria-label="Delete">
                <img src="./build/images/icon-delete.svg" alt="">
            </button>
            <p><span class="price">$125.00</span> x <span class="quantity" id="quantity"></span> <span class="total" id="total"></span></p>
            </div>
            <button class="primary-btn">Checkout</button>
        `;
  }

  deleteProductContent() {
    this.elements.cartProducts.innerHTML = `
        <span id="empty-card-msg" class="empty-card-msg" >Your cart is empty</span>
        `;
    this.elements.cartCount.textContent = "";
    this.state.orderQuantity = 0;
  }

  toggleCart() {
    const isOpen = !this.elements.cartBody.classList.contains("hidden");

    if (isOpen) {
      this.elements.cartBtn.setAttribute("aria-expanded", "false");
      this.elements.cartBody.classList.add("hidden");
    } else {
      this.elements.cartBtn.setAttribute("aria-expanded", "true");
      this.elements.cartBody.classList.remove("hidden");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new EcommerceProduct();
});

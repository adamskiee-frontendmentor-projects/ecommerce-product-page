class EcommerceProduct {
    constructor() {
        this.state = {
            orderQuantity: 0,
            productPrice: 125,
            images: ["./build/images/image-product-1.jpg", "./build/images/image-product-2.jpg", "./build/images/image-product-3.jpg", "./build/images/image-product-4.jpg"],
            currentImageIndex: 0,
            currentActiveProductThumbnail: "1"
        }
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
            lightBoxPreviousImgBtn: document.getElementById("lightbox-previous-img-btn"),
            lightBoxCloseBtn: document.getElementById("lightbox-close-btn"),
            mainImgContainer: document.querySelectorAll(".main-img-container")
        }
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderUi();
    }
    bindEvents() {
        this.elements.mobileMenuOpenBtn.addEventListener("click", () => {
            this.elements.mobileMenu.showModal();
            this.elements.mobileMenuOpenBtn.setAttribute("aria-expanded", "true")
        });

        this.elements.mobileMenuCloseBtn.addEventListener("click", () => {
            this.elements.mobileMenu.close();
            this.elements.mobileMenuOpenBtn.setAttribute("aria-expanded","false")
        })

        this.elements.cartBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggleCart();
        });

        this.elements.orderAddBtn.addEventListener("click", () => {
            this.elements.orderNum.value++;
        });
        
        this.elements.orderMinusBtn.addEventListener("click", () => {
            if(this.elements.orderNum.value <= 0) return;
            this.elements.orderNum.value--;
        });

        this.elements.cartForm.addEventListener("submit", (e) => {
            e.preventDefault(e);
  
            const data = Object.fromEntries(new FormData(e.target));
            if(this.state.orderQuantity === 0) {
                this.state.orderQuantity = Number(data["order-num"]);
                this.renderProductContent();
            } else {
                // Update quantity and total of existing product in the cart
                this.state.orderQuantity += Number(data["order-num"]);
                document.getElementById("quantity").textContent = this.state.orderQuantity;
                document.getElementById("total").textContent = (this.state.orderQuantity*this.state.productPrice).toFixed(2)
            }
            this.elements.cartCount.textContent = this.state.orderQuantity;
            this.elements.cartForm.reset();
        })

        this.elements.nextImgBtn.addEventListener("click", () => {
            this.nextImg(this.elements.mainImg)
        });

        this.elements.lightBoxNextImgBtn.addEventListener("click",() => {
            this.nextImg(this.elements.lightBoxMainImg);
        });

        this.elements.lightBoxPreviousImgBtn.addEventListener("click",() => {
            this.previousImg(this.elements.lightBoxMainImg);
        })
        
        this.elements.previousImgBtn.addEventListener("click", () => {
            this.previousImg(this.elements.mainImg)
        });
        
        document.addEventListener("click", (e) => {
            if(!e.target.closest(".cart-body") && !e.target.closest(".cart-btn")) {
                this.elements.cartBody.classList.add("hidden");
                this.elements.cartBody.setAttribute("aria-expanded", "false")
            }

            if(e.target.closest(".thumbnail-btn")) {
                let btn = e.target.closest(".thumbnail-btn");
                // Check if the clicked thumbnail is the same with previous thumbnail
                if(btn.getAttribute("data-product") === this.state.currentActiveProductThumbnail) return;

                this.activateProductImg(btn);
            }
        })

        this.elements.mainImgBtn.addEventListener("click", () => {
            this.elements.lightboxDialog.showModal();

            // Update the lightbox product images state
            this.activateProductImg(
                this.elements.lightboxDialog.querySelector(`.thumbnail-btn[data-product="${this.state.currentActiveProductThumbnail}"]`)
            );
        })
        this.elements.lightBoxCloseBtn.addEventListener("click", () => {
            this.elements.lightboxDialog.close();

            // Update the desktop product images state
            this.activateProductImg(
                document.querySelector(".desktop-image-container")
                .querySelector(`.thumbnail-btn[data-product="${this.state.currentActiveProductThumbnail}"]`
            ))
        })
    }

    renderUi() {
        // Set default cart message
        this.elements.cartProducts.innerHTML = `
        <span id="empty-card-msg" class="empty-card-msg" >Your cart is empty</span>
        `;

        // Set default active thumbnail
        this.activateThumbnail(document.querySelector(`.thumbnail-btn[data-product= "${this.state.currentActiveProductThumbnail}"]`))
    }

    nextImg(mainImg) {
        // Check if the image index is last index
        if(this.state.currentImageIndex === this.state.images.length-1 ) 
            this.state.currentImageIndex = 0;
        else
            this.state.currentImageIndex++;
        
        this.activateProductImg(mainImg.closest(".desktop-image-container").querySelector(`.thumbnail-btn[data-product="${this.state.currentImageIndex+1}"]`));
    }

    previousImg(mainImg) {
        // Check if the image index is last index
        if(this.state.currentImageIndex === 0 ) 
            this.state.currentImageIndex = this.state.images.length-1;
        else 
            this.state.currentImageIndex--;
        
        this.activateProductImg(mainImg.closest(".desktop-image-container").querySelector(`.thumbnail-btn[data-product="${this.state.currentImageIndex+1}"]`));
    }

    activateProductImg(btn) {
        let mainContainer = btn.parentElement;
        // Deactivate previous thumbnail
        this.deactivateThumbnail(mainContainer.querySelector(".thumbnail-btn-focus"));

        this.activateThumbnail(btn)

        // Change the image of the main image
        mainContainer.querySelector(".main-img").setAttribute("src", this.state.images[this.state.currentImageIndex]);
    }

    activateThumbnail(btn) {
        btn.querySelector(".thumbnail-img").classList.add("thumbnail-focus");
        btn.classList.add("thumbnail-btn-focus");
        // Change the states
        this.state.currentActiveProductThumbnail = btn.getAttribute("data-product");
        this.state.currentImageIndex = Number(this.state.currentActiveProductThumbnail)-1;
    }

    deactivateThumbnail(btn) {
        btn.classList.remove("thumbnail-btn-focus")
        btn.querySelector(".thumbnail-img").classList.remove("thumbnail-focus");
    }

    renderProductContent() {
        if (this.state.orderQuantity > 0) {
            const total = (this.state.orderQuantity*this.state.productPrice).toFixed(2);
            this.elements.cartProducts.innerHTML = `
            <div class="product-content">
                <img src="./build/images/image-product-1-thumbnail.jpg" class="thumbnail" height="50" width="50" alt="">
                <h3>Fall Limited Edition Sneakers</h3>
                <button class="delete-btn" id="cart-delete-btn" aria-label="Delete">
                    <img src="./build/images/icon-delete.svg" alt="">
                </button>
                <p><span class="price">$125.00</span> x <span class="quantity" id="quantity">${this.state.orderQuantity}</span> <span class="total" id="total">${total}</span></p>
                </div>
                <button class="primary-btn">Checkout</button>
            `;
            // Listen to the delete button of the rendered cart product
            document.getElementById("cart-delete-btn").addEventListener("click", () => {
                if(this.state.orderQuantity > 0) {
                    this.deleteProductContent();
                }
            })
        } else {
            this.elements.cartProducts.innerHTML = `
            <span id="empty-card-msg" class="empty-card-msg" >Your cart is empty</span>
            `;
        }
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

        if(isOpen) {
            this.elements.cartBtn.setAttribute("aria-expanded", "false");
            this.elements.cartBody.classList.add("hidden");
        }
        else {
            this.elements.cartBtn.setAttribute("aria-expanded", "true");
            this.elements.cartBody.classList.remove("hidden");    
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new EcommerceProduct();
})
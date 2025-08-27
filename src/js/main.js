class EcommerceProduct {
    constructor() {
        this.state = {
            orderNum: 0,
            productPrice: 125,
            images: ["./build/images/image-product-1.jpg", "./build/images/image-product-2.jpg", "./build/images/image-product-3.jpg", "./build/images/image-product-4.jpg"],
            currentImageIndex: 0
        }
        this.elements = {
            mobileMenu: document.getElementById("mobile-menu"),
            mobileMenuOpenBtn: document.getElementById("mobile-menu-open-btn"),
            mobileMenuCloseBtn: document.getElementById("mobile-menu-close-btn"),
            cartBtn: document.getElementById("cart-btn"),
            cartBody: document.getElementById("cart-body"),
            orderNum: document.getElementById("order-num"),
            orderAddBtn: document.getElementById("order-add-btn"),
            orderMinusBtn: document.getElementById("order-minus-btn"),
            cartForm: document.getElementById("cart-form"),
            nextImgBtn: document.getElementById("next-img-btn"),
            previousImgBtn: document.getElementById("previous-img-btn"),
            mainImg: document.getElementById("main-img"),
            cartCount: document.getElementById("cart-count"),
            cartBody: document.getElementById("cart-body"),
            cartProducts: document.getElementById("cart-products"),
            cartDeleteBtn: document.getElementById("cart-delete-btn")
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
        });

        this.elements.mobileMenuCloseBtn.addEventListener("click", () => {
            this.elements.mobileMenu.close();
        })

        this.elements.cartBtn.addEventListener("click", () => {
            this.elements.cartBody.classList.toggle("hidden");
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
            if(this.state.orderNum === 0) {
                this.state.orderNum = Number(data["order-num"]);
                this.renderProductContent();
            } else {
                this.state.orderNum += Number(data["order-num"]);
                document.getElementById("quantity").textContent = this.state.orderNum;
                document.getElementById("total").textContent = (this.state.orderNum*this.state.productPrice).toFixed(2)
            }
            console.log(this.state.orderNum)
            this.elements.cartCount.textContent = this.state.orderNum;
            this.elements.cartForm.reset();
        })

        this.elements.nextImgBtn.addEventListener("click", () => {
            if(this.state.currentImageIndex === this.state.images.length-1 ) this.state.currentImageIndex = 0;
            else {
                this.state.currentImageIndex++;
            }
            this.elements.mainImg.setAttribute("src", this.state.images[this.state.currentImageIndex]);
        })
        
        this.elements.previousImgBtn.addEventListener("click", () => {
            if(this.state.currentImageIndex === 0 ) this.state.currentImageIndex = this.state.images.length-1;
            else {
                this.state.currentImageIndex--;
            }
            this.elements.mainImg.setAttribute("src", this.state.images[this.state.currentImageIndex]);
        });
    }

    renderUi() {
        this.elements.cartProducts.innerHTML = `
        <span id="empty-card-msg" class="empty-card-msg" >Your cart is empty</span>
        `
    }

    renderProductContent() {
        console.log(this.state.orderNum)
        if (this.state.orderNum > 0) {
            const total = (this.state.orderNum*this.state.productPrice).toFixed(2);
            this.elements.cartProducts.innerHTML = `
            <div class="product-content">
                <img src="./build/images/image-product-1-thumbnail.jpg" class="thumbnail" height="50" width="50" alt="">
                <h3>Fall Limited Edition Sneakers</h3>
                <button class="delete-btn" id="cart-delete-btn" aria-label="Delete">
                    <img src="./build/images/icon-delete.svg" alt="">
                </button>
                <p><span class="price">$125.00</span> x <span class="quantity" id="quantity">${this.state.orderNum}</span> <span class="total" id="total">${total}</span></p>
                </div>
                <button class="primary-btn">Checkout</button>
            `;
            document.getElementById("cart-delete-btn").addEventListener("click", () => {
                if(this.state.orderNum > 0) {
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
        this.state.orderNum = 0;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new EcommerceProduct();
})
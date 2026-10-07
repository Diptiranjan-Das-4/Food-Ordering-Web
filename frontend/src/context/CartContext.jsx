
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const CartContext = createContext(null);

const CART_KEY = "foodie-cart";

function loadCart() {
    try {
        const saved = localStorage.getItem(CART_KEY);

        if (!saved) {
            return [];
        }

        const cart = JSON.parse(saved);

        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Cart loading error:", error);
        return [];
    }
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState(loadCart);

    useEffect(() => {
        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );
    }, [cart]);

    function addToCart(food) {
        setCart((previousCart) => {
            const existingFood = previousCart.find(
                (item) => item.id === food.id
            );

            if (existingFood) {
                return previousCart.map((item) =>
                    item.id === food.id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity + 1
                          }
                        : item
                );
            }

            return [
                ...previousCart,
                {
                    ...food,
                    quantity: 1
                }
            ];
        });
    }

    function increaseQuantity(id) {
        setCart((previousCart) =>
            previousCart.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantity:
                              item.quantity + 1
                      }
                    : item
            )
        );
    }

    function decreaseQuantity(id) {
        setCart((previousCart) =>
            previousCart
                .map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity - 1
                          }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function removeFromCart(id) {
        setCart((previousCart) =>
            previousCart.filter(
                (item) => item.id !== id
            )
        );
    }

    function clearCart() {
        setCart([]);
    }

    const cartItemCount = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    const cartTotal = cart.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) *
                Number(item.quantity || 0),
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart,
                cartItemCount,
                cartTotal
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider"
        );
    }

    return context;
}

